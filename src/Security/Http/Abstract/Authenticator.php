<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http\Abstract;

use App\Client\YakalaApiClient;
use App\DTO\ApiUser;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;

abstract class Authenticator extends AbstractAuthenticator
{
    public function __construct(
        protected readonly YakalaApiClient $client,
        protected readonly RouterInterface           $router,
        protected readonly CsrfTokenManagerInterface $csrfTokenManager,
        protected readonly LoggerInterface           $logger
    ) {}

    /**
     * @param Request $request
     * @return void
     */
    public function csrfCheck(Request $request): void
    {
        $csrfToken = $this->extractCsrfToken($request);

        $token = new CsrfToken('authenticate', $csrfToken);

        if (!$this->csrfTokenManager->isTokenValid($token)) {
            throw new InvalidCsrfTokenException('Geçersiz CSRF Token.');
        }
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
}