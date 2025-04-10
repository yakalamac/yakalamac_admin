<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\EventListener;

use App\DTO\ApiUser;
use App\Event\PasswordlessEvent;
use App\Exception\InvalidCredentialsException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[AsEventListener(event: PasswordlessEvent::class,method: 'onPasswordless')]
class AuthenticationListener
{
    public function onPasswordless(PasswordlessEvent $event)
    {

    }

    /**
     * @param string $mobilePhone
     * @param string $smsCode
     * @param string $verificationToken
     * @return ApiUser
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function verifyOtp(string $mobilePhone, string $smsCode, string $verificationToken): ApiUser
    {
        $response = $this->client->request('POST', $_ENV['API_URL'] . '/api/users/action/verificate/mobile-phone', [
            'json' => [
                'mobilePhone' => $mobilePhone,
                'smsCode' => $smsCode,
                'verificationToken' => $verificationToken
            ],
        ]);

        $data = $this->extractResponseData($response);

        return $this->retrieveUserDetailAsUser($data['user']['id'], $data['accessToken']);
    }
}