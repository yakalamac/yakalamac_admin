<?php
namespace App\Security\Authenticator;

use App\Security\User\ApiUser;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException; 
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;

class ApiAuthenticator extends AbstractAuthenticator implements AuthenticationEntryPointInterface
{
    private HttpClientInterface $client;
    private RouterInterface $router;
    private CsrfTokenManagerInterface $csrfTokenManager;

    public function __construct(HttpClientInterface $client, RouterInterface $router, CsrfTokenManagerInterface $csrfTokenManager)
    {
        $this->client = $client;
        $this->router = $router;
        $this->csrfTokenManager = $csrfTokenManager;
    }


    public function supports(Request $request): ?bool
    {
        $route = $request->attributes->get('_route');
        return ($route === 'app_login' && $request->isMethod('POST')) ||
               ($route === 'verify_otp' && $request->isMethod('POST'));
    }
    
    public function sendOtp(string $mobilePhone): string
    {
        $response = $this->client->request('POST', $_ENV['API_URL'].'/api/users/action/login', [
            'json' => [
                'mobilePhone' => $mobilePhone,
                'application' => 'BUSINESS',
            ],
        ]);

        if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 201) {
            throw new CustomUserMessageAuthenticationException('SMS gönderimi başarısız.');
        }

        $data = $response->toArray();

        if (!isset($data['verificationToken'])) {
            throw new CustomUserMessageAuthenticationException('Doğrulama tokeni alınamadı.');
        }

        return $data['verificationToken'];
    }
    public function verifyOtp(string $mobilePhone, string $smsCode, string $verificationToken): ApiUser
    {
        $response = $this->client->request('POST', $_ENV['API_URL'].'/api/users/action/verificate/mobile-phone', [
            'json' => [
                'mobilePhone' => $mobilePhone,
                'smsCode' => $smsCode,
                'verificationToken' => $verificationToken
            ],
        ]);

        if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 201) {
            throw new CustomUserMessageAuthenticationException('Doğrulama başarısız.');
        }

        $data = $response->toArray();

        if (!isset($data['accessToken'], $data['user'])) {
            throw new CustomUserMessageAuthenticationException('Kimlik doğrulama sunucusundan geçersiz yanıt.');
        }

        $accessToken = $data['accessToken'];
        $userData = $data['user'];


        $responseUser = $this->client->request('GET', $_ENV['API_URL'].'/api/users/' . $userData['id'], [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ]
        ]);

        $statusCodeUser = $responseUser->getStatusCode();
        if ($statusCodeUser !== 200 && $statusCodeUser !== 201) {
            throw new CustomUserMessageAuthenticationException('Kullanıcı bulunamadı. API yanıt kodu: ' . $statusCodeUser);
        }

        $dataX = $responseUser->toArray();

        if (!isset($dataX['id'])) {
            throw new CustomUserMessageAuthenticationException('Geçersiz kullanıcı verisi.');
        }
        return new ApiUser($dataX, $accessToken);
    }

    public function authenticate(Request $request): Passport
    {
        $csrfToken = $request->request->get('_csrf_token');
        $token = new CsrfToken('authenticate', $csrfToken);

        if (!$this->csrfTokenManager->isTokenValid($token)) {
            throw new InvalidCsrfTokenException('Geçersiz CSRF Token.');
        }

        $route = $request->attributes->get('_route');

    // E-posta ile giriş
    if ($route === 'app_login') {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if (!$email || !$password) {
            throw new CustomUserMessageAuthenticationException('E-posta veya şifre eksik.');
        }

        $response = $this->client->request('POST', $_ENV['API_URL'].'/api/users/action/login', [
            'json' => [
                'email' => $email,
                'password' => $password,
                'application' => 'BUSINESS',
            ],
        ]);

        if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 201) {
            throw new CustomUserMessageAuthenticationException('Geçersiz kimlik bilgileri.');
        }

        $data = $response->toArray();

        if (!isset($data['accessToken'], $data['user'])) {
            throw new CustomUserMessageAuthenticationException('Kimlik doğrulama sunucusundan geçersiz yanıt.');
        }

        $accessToken = $data['accessToken'];
        $userData = $data['user'];

        $user = new ApiUser($userData, $accessToken);

        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier(), function ($userIdentifier) use ($user) {
                return $user;
            })
        );
    }

    // OTP ile giriş
    if ($route === 'verify_otp') {
        $mobilePhone = $request->request->get('mobilePhone');
        $smsCode = $request->request->get('smsCode');
        $verificationToken = $request->request->get('verificationToken');

        if (!$mobilePhone || !$smsCode || !$verificationToken) {
            throw new CustomUserMessageAuthenticationException('Telefon, SMS kodu veya doğrulama tokeni eksik.');
        }

        $response = $this->client->request('POST', $_ENV['API_URL'].'/api/users/action/verificate/mobile-phone', [
            'json' => [
                'mobilePhone' => $mobilePhone,
                'smsCode' => $smsCode,
                'verificationToken' => $verificationToken,
                'application' => "BUSINESS",
            ],
        ]);

        if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 201) {
            throw new CustomUserMessageAuthenticationException('Doğrulama başarısız.');
        }

        $data = $response->toArray();

        if (!isset($data['accessToken'], $data['user'])) {
            throw new CustomUserMessageAuthenticationException('Kimlik doğrulama sunucusundan geçersiz yanıt.');
        }

        $accessToken = $data['accessToken'];
        $userData = $data['user'];
        
        $responseUser = $this->client->request('GET', $_ENV['API_URL'].'/api/users/' . $userData['id'], [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ]
        ]);

        $statusCodeUser = $responseUser->getStatusCode();
        if ($statusCodeUser !== 200 && $statusCodeUser !== 201) {
            throw new CustomUserMessageAuthenticationException('Kullanıcı bulunamadı. API yanıt kodu: ' . $statusCodeUser);
        }

        $dataX = $responseUser->toArray();

        if (!isset($dataX['id'])) {
            throw new CustomUserMessageAuthenticationException('Geçersiz kullanıcı verisi.');
        }


        $user = new ApiUser($dataX, $accessToken);

        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier(), function ($userIdentifier) use ($user) {
                return $user;
            })
        );
    }

    throw new CustomUserMessageAuthenticationException('Desteklenmeyen kimlik doğrulama yöntemi.');
}


    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        /** @var ApiUser $user */
        $user = $token->getUser();
    
        $session = $request->getSession();
        $session->set('accessToken', $user->getAccessToken());
    
        if (in_array('ROLE_SUPER_ADMIN', $user->getRoles(), true) || in_array('ROLE_EDITOR_ADMIN', $user->getRoles(), true)) {
            $targetPath = $this->router->generate('admin_dashboard');
        } elseif (in_array('ROLE_PARTNER_ADMIN', $user->getRoles(), true)) {
            $targetPath = $this->router->generate('partner_dashboard');
        } else {
            $targetPath = $this->router->generate('admin_dashboard');
        }
        
        $session = $request->getSession();
        if ($session instanceof Session) {
            $session->getFlashBag()->add('success', "Giriş başarılı.");
        }
        if ($request->isXmlHttpRequest()) {
            return new JsonResponse(['redirect' => $targetPath], 200);
        }
        return new RedirectResponse($targetPath);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    { 
        $session = $request->getSession();
        if ($session instanceof Session) {
            $session->getFlashBag()->add('error', "Giriş bilgileri hatalı.");
        }
        return new RedirectResponse($this->router->generate('login_page'));
    }

    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        $session = $request->getSession();
        if ($session instanceof Session) {
            $session->getFlashBag()->add('error', "Önce giriş yapmalısınız.");
        }
        return new RedirectResponse($this->router->generate('login_page'));
    }
}
