<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class UserStatusListener implements EventSubscriberInterface
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        $session = $request->getSession();
        $user = $this->getUserData($session);
        $isLoggedIn = $user !== null;
        
        $request->attributes->set('isLoggedIn', $isLoggedIn);
        $request->attributes->set('user', $user);
    }

    private function getUserData(SessionInterface $session)
    {
        $accessToken = $session->get('accessToken');
        $userUUID = $session->get('userUUID');

        if (!$accessToken || !$userUUID) {
            return null; 
        }

        try {
            $response = $this->httpClient->request('GET', 'https://api.yaka.la/api/users/' . $userUUID, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]);
            return $response->toArray(); 
        } catch (\Exception $e) {
            return null; 
        }
    }
}
