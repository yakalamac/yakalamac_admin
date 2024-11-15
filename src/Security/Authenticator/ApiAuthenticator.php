<?php
namespace App\Security\Authenticator;

use App\Security\User\ApiUser;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException; // Doğru `use` bildirimi
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
        return $request->attributes->get('_route') === 'app_login' && $request->isMethod('POST');
    }

    public function authenticate(Request $request): Passport
    {
        $csrfToken = $request->request->get('_csrf_token');

        $token = new CsrfToken('authenticate', $csrfToken);
        if (!$this->csrfTokenManager->isTokenValid($token)) {
            throw new InvalidCsrfTokenException('Geçersiz CSRF Token.');
        }

        $email = $request->request->get('email');
        $password = $request->request->get('password');
    
        if (!$email || !$password) {
            throw new CustomUserMessageAuthenticationException('E-posta veya şifre eksik.');
        }
    
        $response = $this->client->request('POST', 'https://api.yaka.la/api/users/action/login', [
            'json' => [
                'email' => $email,
                'password' => $password,
                'application' => 'BUSINESS',
            ],
        ]);
    
        $statusCode = $response->getStatusCode();
        if ($statusCode !== 200 && $statusCode !== 201) {
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

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        /** @var ApiUser $user */
        $user = $token->getUser();
    
        $session = $request->getSession();
        $session->set('accessToken', $user->getAccessToken());
    
        if (in_array('ROLE_SUPER_ADMIN', $user->getRoles(), true)) {
            $targetPath = $this->router->generate('admin_dashboard');
        } elseif (in_array('ROLE_PARTNER_ADMIN', $user->getRoles(), true)) {
            $targetPath = $this->router->generate('partner_dashboard');
        } else {
            $targetPath = $this->router->generate('app_home');
        }
        $session = $request->getSession();
        if ($session instanceof Session) {
            $session->getFlashBag()->add('success', "Giriş başarılı.");
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
