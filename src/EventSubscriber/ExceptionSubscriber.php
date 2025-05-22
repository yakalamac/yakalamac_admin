<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventSubscriber;

use App\DTO\ApiUser;
use App\Service\Logger\Log;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

readonly class ExceptionSubscriber implements EventSubscriberInterface
{
    /**
     * @var Logger
     */
    private Logger $logger;

    /**
     * @param RouterInterface $router
     * @param TokenStorageInterface $storage
     */
    public function __construct(private RouterInterface $router, private TokenStorageInterface $storage)
    {
        $this->logger = new Logger();
    }

    /**
     * @param ExceptionEvent $event
     * @return void
     */
    public function onKernelException(ExceptionEvent $event): void
    {
        if($_ENV['APP_ENV'] === 'dev') return;
        
        $request = $event->getRequest();

        $response = $this->generateRoute($request);

        Log::write($this->logger, $request, $response, $event->getThrowable());

        $event->setResponse($response);
    }

    /**
     * @return string[]
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException'
        ];
    }

    /**
     * @param Request $request
     * @return Response
     */
    private function generateRoute(Request $request): Response
    {
        $referer = $request->headers->get('referer');

        if(!empty($referer) && $referer !== $request->getUri()) {
            return new RedirectResponse($referer);
        }

        $token = $this->storage->getToken();

        if ($token !== NULL && (($user = $token->getUser()) instanceof ApiUser) && method_exists($user, 'isAdmin')) {
            $routeName = $user->isAdmin() ? 'admin_dashboard' : 'partner_dashboard';
            return new RedirectResponse($this->router->generate($routeName));
        }

        return new RedirectResponse($this->router->generate('login_page'));
    }
}