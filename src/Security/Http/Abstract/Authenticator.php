<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http\Abstract;

use App\Client\YakalaApiClient;
use App\DTO\ApiUser;
use App\Event\SessionStartEvent;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

abstract class Authenticator extends AbstractAuthenticator
{
    public function __construct(
        protected readonly YakalaApiClient $client,
        protected readonly RouterInterface           $router,
        protected readonly CsrfTokenManagerInterface $csrfTokenManager,
        protected readonly LoggerInterface           $logger,
        protected readonly RequestStack $stack,
        protected readonly EventDispatcherInterface $dispatcher
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

        if (!$user instanceof ApiUser) {
            throw new Exception('User is not exist', 400);
        }

        // Store session locally
        $session = $request->getSession();

       /*
        * TODO ITS NOT REQUIRED FOR NOW BECAUSE USER TRANSPORTS TOKENS WITHIN INSTEAD STORE USER TO THE SESSION IMMEDIATELY
        * TODO TO PREVENT RE-FETCHING THE USER USING REFRESH AND ACCESS TOKENS
            // Set access and refresh tokens into session
            $session->set('accessToken', $user->getAccessToken());
            $session->set('refreshToken', $user->getRefreshToken());
        */

        $pathname = match (true) {
            $user->isAdmin() => 'admin_dashboard',
            $user->isBusiness() => 'partner_dashboard',
            default => throw new AuthenticationException()
        };

        $targetPath = $this->router->generate($pathname);

        $session->getFlashBag()->add('success', "Giriş başarılı.");

        $response = $request->isXmlHttpRequest()
            ? new JsonResponse(['redirect' => $targetPath], 200)
            : new RedirectResponse($targetPath);

        $event = new SessionStartEvent($user, $response, $request);

        $this->dispatcher->dispatch($event, SessionStartEvent::class);

        return $response;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        //throw $exception;
        $request->getSession()->getFlashBag()->add('error', $exception->getMessage());
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

    /**
     * @param ApiUser $user
     * @return Passport
     */
    protected function createPassport(ApiUser $user): Passport
    {
        $this->stack->getSession()->set('api_user', $user);

        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier())
        );
    }
}