<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventSubscriber;

use App\Service\Logger\Log;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Routing\RouterInterface;

readonly class ExceptionSubscriber implements EventSubscriberInterface
{
    private Logger $logger;

    public function __construct(private RouterInterface $router)
    {
        $this->logger = new Logger();
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        if($_ENV['APP_ENV'] === 'dev') return;
        
        $request = $event->getRequest();
        $exception = $event->getThrowable();

        $referer = $request->headers->get('referer');

        $response = $referer
            ? new RedirectResponse($referer)
            : new RedirectResponse($this->router->generate('login_page'));

        Log::write($this->logger, $request,$response, $exception);

        $event->setResponse($response);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException'
        ];
    }
}