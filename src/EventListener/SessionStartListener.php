<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventListener;

use App\Client\YakalaApiClient;
use App\DTO\ApiUser;
use App\Event\SessionStartEvent;
use DateTime;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Cookie;
use Throwable;

#[AsEventListener(event: SessionStartEvent::class, method: 'onSessionStart')]
class SessionStartListener
{
    private const PARTNER_CURRENT_PLACE_ID_COOKIE_KEY = '_active_place';

    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param SessionStartEvent $event
     * @return void
     * @throws Throwable
     */
    public function onSessionStart(SessionStartEvent $event): void
    {
        $user = $event->getApiUser();

        if($user->isBusiness())
        {
            if(($business = $user->getBusinessRegistration())->requiresInitialization())
            {

                $response = $this->client->get(str_replace('/api/','', $business->getIri()), [
                    'auth_bearer' => $user->getAccessToken()
                ]);

                if($this->client->isSuccess($response)) {
                    $array = $this->client->toArray($response);
                    $business->setData($array);
                }
            }

            if($result = $this->hasPlaceCookie($event))
            {
                if($this->isPlaceCookieValid($result, $user)) {
                    return;
                }

                if(NULL !== $cookie = $this->createPlaceCookie($user)) {
                    $event->getResponse()->headers->setCookie($cookie);
                }
            }
        }


        if($user->isAdmin() && ($admin = $user->getAdminRegistration())->requiresInitialization())
        {

            $response = $this->client->get(str_replace('/api/','', $admin->getIri()), [
                'auth_bearer' => $user->getAccessToken()
            ]);

            if($this->client->isSuccess($response)) {
                $array = $this->client->toArray($response);
                $admin->setData($array);
            }
        }
    }

    /**
     * @param SessionStartEvent $event
     * @return array|false
     */
    private function hasPlaceCookie(SessionStartEvent $event): array|false
    {
        $stored = $event->getRequest()->cookies
            ->get(static::PARTNER_CURRENT_PLACE_ID_COOKIE_KEY, FALSE);

        if($stored && json_validate($stored) && json_last_error() === JSON_ERROR_NONE) {
            return json_decode($stored, true);
        }

        return FALSE;
    }

    /**
     * @param array $json
     * @param ApiUser $user
     * @return bool
     */
    private function isPlaceCookieValid(array $json, ApiUser $user): bool
    {
        if(empty($json['uid']) || empty($json['bid']) || empty($json['pid']) || empty($json['pname'])) {
            return FALSE;
        }

        if($user->getUserIdentifier() !== $json['uid']) {
            return FALSE;
        }

        $business = $user->getBusinessRegistration();

        if($business->getId() !== $json['bid']) {
            return FALSE;
        }

        return $business->hasManagedPlace($json['pid']) || $business->hasPlace($json['pid']);
    }

    /**
     * @param ApiUser $user
     * @return ?Cookie
     */
    private function createPlaceCookie(ApiUser $user): ?Cookie
    {
        $business = $user->getBusinessRegistration();

        $place = $business->getFirstPlace();

        if($place === NULL) {
            return NULL;
        }

        $array = [
            'uid' => $user->getUserIdentifier(),
            'bid' => $business->getId(),
            'pid' => $place->getId(),
            'pname' => $place->getName(),
        ];

        return new Cookie(
            name: static::PARTNER_CURRENT_PLACE_ID_COOKIE_KEY,
            value: json_encode($array),
            expire: new DateTime('+30 days'),
            secure: true
        );
    }
}