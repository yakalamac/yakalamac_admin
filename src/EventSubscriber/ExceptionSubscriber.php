<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\RouterInterface;

readonly class ExceptionSubscriber implements EventSubscriberInterface
{
    public function __construct(private RouterInterface $router) {}

    public function onKernelException(ExceptionEvent $event): void
    {
        if($_ENV['APP_ENV'] === 'dev') return;

        $request = $event->getRequest();
        //$exception = $event->getThrowable();
        $request->getSession()->getFlashBag()
            ->add('error', $event->getThrowable()->getMessage() ?? 'Bir sorun oluştu. Geri yönlendirildiniz.');

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