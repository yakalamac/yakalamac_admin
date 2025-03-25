<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventSubscriber;

use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Routing\RouterInterface;

readonly class ExceptionSubscriber implements EventSubscriberInterface
{
    private LoggerInterface $logger;
    public function __construct(private RouterInterface $router) {
        $this->logger = new Logger();
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        if($_ENV['APP_ENV'] === 'dev') return;
        
        $request = $event->getRequest();
        $exception = $event->getThrowable();
        $message = $exception->getMessage();
        $code = $exception->getCode();
        $request->getSession()->getFlashBag()->add('error',  $message ?? 'Bir sorun oluştu. Geri yönlendirildiniz.');

        $logMessage = json_encode(
            [
                'message' => $message,
                'code' => $code
            ]
        );

        error_log($logMessage);

        $this->logger->info($logMessage);
        $this->logger->error($logMessage);
        $this->logger->debug($logMessage);
        $this->logger->notice($logMessage);
        $this->logger->alert($logMessage);
        $this->logger->emergency($logMessage);

        $referer = $request->headers->get('referer');

        $response = $referer
            ? new RedirectResponse($referer)
            : new RedirectResponse($this->router->generate('login_page'));

        $event->setResponse($response);
//        $event->setResponse(
//            new JsonResponse(
//                ['message' => $exception->getMessage()],
//                $exception->getCode() == 0 ? 500 : $exception->getCode()
//            )
//        );
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException'
        ];
    }
}