<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\RouterInterface;
use Twig\Error\RuntimeError;

readonly class ExceptionSubscriber implements EventSubscriberInterface
{
    public function __construct(private RouterInterface $router) {}

    public function onKernelException(ExceptionEvent $event): void
    {
        // Get the current request
//        $request = $event->getRequest();
//
//        $request->getSession()
//            ->getFlashBag()
//            ->add('error', $event->getThrowable()->getMessage() ?? 'Bir sorun oluştu. Geri yönlendirildiniz.');
//
//        $referer = $request->headers->get('referer');
//
//        $response = $referer
//            ? new RedirectResponse($referer)
//            : new RedirectResponse($this->router->generate('login_page'));
//
//        $event->setResponse($response);
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