<?php

namespace App\Security\Http;

use App\DTO\ApiUser;
use App\Exception\InvalidCredentialsException;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class Authenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly HttpClientInterface       $client,
        private readonly RouterInterface           $router,
        private readonly CsrfTokenManagerInterface $csrfTokenManager,
        private readonly LoggerInterface           $logger,
    ) {}

    public function supports(Request $request): ?bool
    {
        return $request->isMethod('POST') && in_array(
            $request->attributes->get('_route'),
            ['app_login', 'verify_otp']
        );
    }

    /**
     * @param string $mobilePhone
     * @return string
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function sendOtp(string $mobilePhone): string
    {
        $response = $this->client->request('POST', $_ENV['API_URL'] . '/api/action/login', [
            'json' => [
                'loginId' => $mobilePhone,
                'application' => 'BUSINESS',
            ],
        ]);

        $statusCode = $response->getStatusCode();

        if ($statusCode !== 200 && $statusCode !== 201) {
            throw new CustomUserMessageAuthenticationException('SMS gönderimi başarısız.');
        }

        $data = $response->toArray();

        if (!isset($data['verificationToken'])) {
            throw new CustomUserMessageAuthenticationException('Doğrulama tokeni alınamadı.');
        }

        return $data['verificationToken'];
    }

    /**
     * @param string $mobilePhone
     * @param string $smsCode
     * @param string $verificationToken
     * @return ApiUser
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function verifyOtp(string $mobilePhone, string $smsCode, string $verificationToken): ApiUser
    {
        $response = $this->client->request('POST', $_ENV['API_URL'] . '/api/users/action/verificate/mobile-phone', [
            'json' => [
                'mobilePhone' => $mobilePhone,
                'smsCode' => $smsCode,
                'verificationToken' => $verificationToken
            ],
        ]);

        $data = $this->extractResponseData($response);

        return $this->retrieveUserDetailAsUser($data['user']['id'], $data['accessToken']);
    }

    /**
     * @param Request $request
     * @return Passport
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws InvalidCredentialsException
     */
    public function authenticate(Request $request): Passport
    {
        $csrfToken = $this->extractCsrfToken($request);

        $token = new CsrfToken('authenticate', $csrfToken);

        if (!$this->csrfTokenManager->isTokenValid($token)) {
            throw new InvalidCsrfTokenException('Geçersiz CSRF Token.');
        }

        $route = $request->attributes->get('_route');

        if ($route === 'app_login') {
            return $this->doLogin($request);
        }

        if ($route === 'verify_otp') {
            return $this->doPasswordlessLogin($request);
        }

        throw new CustomUserMessageAuthenticationException('Desteklenmeyen kimlik doğrulama yöntemi.');
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $firewallName
     * @return Response|null
     * @throws Exception
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user = $token->getUser();
        
        $this->logger->info("ApiAuthenticator authentication success  ".json_encode($user->getRoles()));

        if (!$user instanceof ApiUser) {
            throw new Exception('User is not exist', 400);
        }
        
        $session = $request->getSession();

        $session->set('accessToken', $user->getAccessToken());

        $session->set('refreshToken', $user->getRefreshToken());

        $userRoles = $user->getRoles();
        
        $this->logger->info(json_encode($userRoles));
        
        $routeName = match (true) {
            in_array('ROLE_SUPER_ADMIN', $userRoles),
            in_array('ROLE_ADMIN', $userRoles) => 'admin_dashboard',
            in_array('ROLE_PARTNER', $userRoles, true) => 'partner_dashboard',
            default => null
        };

        if($routeName === null){
            throw new AuthenticationException('Route name not exist');
        }

        $targetPath = $this->router->generate($routeName);
        
        $this->logger->info("ApiAuthenticator authentication success  target path => ".$targetPath);
        $session->getFlashBag()->add('success', "Giriş başarılı.");
        $this->logger->info($request->isXmlHttpRequest() ? 'is xml http request' : 'is xml http request not ');

        return $request->isXmlHttpRequest()
            ? new JsonResponse(['redirect' => $targetPath], 200)
            : new RedirectResponse($targetPath);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        //throw $exception; 
        $request->getSession()->getFlashBag()->add('error', "Giriş bilgileri hatalı." . $exception->getMessage());
        return new RedirectResponse($this->router->generate('login_page'));
    }

    /**
     * @param Request $request
     * @return Passport
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    private function doLogin(Request $request): Passport
    {
        $ipLoginResult = $this->doIdentityProviderLogin($request);

        if($ipLoginResult instanceof Passport) {
            return $ipLoginResult;
        }

        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if (!$email || !$password) {
            throw new CustomUserMessageAuthenticationException('E-posta veya şifre eksik.');
        }
       
        $response = $this->client->request('POST', $_ENV['API_URL'] . '/api/action/login',
            [
                'json' => [
                    'loginId' => $email,
                    'password' => $password,
                    'application' => 'ADMIN',
                ],
            ]
        );

        $data = $this->extractResponseData($response);
       
        if (!isset($data['user'])) {
            throw new CustomUserMessageAuthenticationException('Kimlik doğrulama sunucusundan geçersiz yanıt.');
        }
        if(is_string($data['user'])) {
            $data['user'] = $this->client->request('GET', $_ENV['API_URL'] . $data['user'], [
                'auth_bearer' => $data['accessToken']
            ])->toArray(false);
        }
        $user = new ApiUser($data['user'], $data['accessToken'] ?? null, $data['refreshToken'] ?? null);
     
        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier(), function () use ($user) {
                return $user;
            })
        );
    }

    /**
     * @param Request $request
     * @return Passport
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws InvalidCredentialsException
     */
    private function doPasswordlessLogin(Request $request): Passport
    {
        $mobilePhone = $request->request->get('mobilePhone');

        $smsCode = $request->request->get('smsCode');

        $verificationToken = $request->request->get('verificationToken');

        if (!$mobilePhone || !$smsCode || !$verificationToken) {
            throw new CustomUserMessageAuthenticationException('Telefon, SMS kodu veya doğrulama tokeni eksik.');
        }

        $response = $this->client->request('POST', $_ENV['API_URL'] . '/api/action/verificate/mobile-phone',
            [
                'json' => [
                    'mobilePhone' => $mobilePhone,
                    'smsCode' => $smsCode,
                    'verificationToken' => $verificationToken,
                    'application' => "BUSINESS",
                ],
            ]
        );

        $data = $this->extractResponseData($response, 'Doğrulama başarısız.');

        if (!isset($data['user'])) {
            throw new CustomUserMessageAuthenticationException('Kimlik doğrulama sunucusundan geçersiz yanıt.');
        }

        $dataX = $this->retrieveUserDetail($data['user']['id'], $data['accessToken']);

        if (!isset($dataX['id'])) {
            throw new CustomUserMessageAuthenticationException('Geçersiz kullanıcı verisi.');
        }


        $user = new ApiUser($dataX, $data['accessToken'] ?? null, $data['refreshToken'] ?? null);

        return new SelfValidatingPassport(
            new UserBadge(
                $user->getUserIdentifier(),
                function () use ($user) {
                    return $user;
                }
            )
        );
    }

    /**
     * @param Request $request
     * @return string|false
     */
    private function extractCsrfToken(Request $request): string|false
    {
        $token = $request->request->get('_csrf_token');

        if($token === null && $request->query->count() > 0) {
            $token = $request->query->get('_csrf_token') ??
                $request->query->get('_xrf_token') ??
                $request->query->get('_xsrf_token');
        }

        if(!$token) {
            $token = $request->headers->get('_csrf_token') ??
                $request->headers->get('X-CSRF-Token') ??
                $request->headers->get('X-XSRF-TOKEN');
        }

        if(!$token) {
            if($request->headers->get('Content-Type') !== 'application/json') {
                return false;
            }

            $body = $request->toArray();
            $token = $body['_csrf_token'] ?? $body['_xrf_token'] ?? $body['_xsrf_token'] ?? false;
        }

        return $token;
    }

    /**
     * @param string $userId
     * @param string $accessToken
     * @param mixed $data
     * @return ApiUser
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function retrieveUserDetailAsUser(string $userId, string $accessToken, mixed $data = null): ApiUser
    {
        if($data === null) {
            $dataX = $this->retrieveUserDetail($userId, $accessToken);
        } else {
            $dataX = $data;
        }


        if (!isset($dataX['id'])) {
            throw new CustomUserMessageAuthenticationException('Geçersiz kullanıcı verisi.');
        }

        return new ApiUser($dataX, $accessToken);
    }

    /**
     * @param string $userId
     * @param string $accessToken
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function retrieveUserDetail(string $userId, string $accessToken): array
    {
        $response = $this->client->request('GET', $_ENV['API_URL'] . '/api/users/' . $userId,
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]
        );

        $this->logger->info('retrieveUserDetail function line 366 ');

        return $this->extractResponseData(
            $response,
            'Kullanıcı bulunamadı. API yanıt kodu: ' . $response->getStatusCode()
        );
    }

    /**
     * @param ResponseInterface $response
     * @param string|null $onException
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function extractResponseData(ResponseInterface $response, ?string $onException = 'Geçersiz kimlik bilgileri.'): array
    {
        $statusCode = $response->getStatusCode();
        
        if ($statusCode !== 200 && $statusCode !== 201) {
            throw new Exception(print_r($response->getContent(), true));//CustomUserMessageAuthenticationException($onException);
        }

        return $response->toArray(false);
    }

    /**
     * @param Request $request
     * @return Passport|false
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function doIdentityProviderLogin(Request $request): Passport|false
    {
        if($request->query->has('use-identity-provider')) {

            $identityProviderType = $request->query->get('use-identity-provider');

            if($identityProviderType === 'as_server_side') {
                $user = $this->doServerSideLogin($request);
            } else {

                if(!in_array($identityProviderType, ['google', 'apple', 'facebook'])) {
                    throw new CustomUserMessageAuthenticationException('Invalid identity provider type provided.');
                }

                $data = $request->toArray();

                if(!isset($data['accessToken'], $data['userUUID'])) {
                    throw new CustomUserMessageAuthenticationException('Access key or user not provided.');
                }

                $user = $this->retrieveUserDetailAsUser($data['userUUID'], $data['accessToken'], $data);
            }

            return new SelfValidatingPassport(
                new UserBadge(
                    $user->getUserIdentifier(),
                    function () use ($user) {
                        return $user;
                    }
                )
            );
        }

        return false;
    }

    /**
     * @param Request $request
     * @return ApiUser
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function doServerSideLogin(Request $request): ApiUser
    {
        $data = $request->toArray();

        $response = $this->client->request(
            'POST',
            $_ENV['API_URL'] . '/api/identity-provider/' . $data['providerType'],
            [
                'json' => array_merge($data, ['application' => 'ADMIN'])
            ]
        );

        $data = $this->extractResponseData($response);

        return new ApiUser($data['user'], $data['accessToken']);
    }
}