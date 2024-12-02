<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class UserService
{
    private $requestStack;
    private $httpClient;

    public function __construct(RequestStack $requestStack, HttpClientInterface $httpClient)
    {
        $this->requestStack = $requestStack;
        $this->httpClient = $httpClient;
    }

    public function getCurrentUser()
    {
        $accessToken = $this->requestStack->getSession()->get('accessToken');
        $userUUID = $this->requestStack->getSession()->get('userUUID');
        if (!$accessToken || !$userUUID) {
            return null;
        }

        try {
            $response = $this->httpClient->request('GET', $_ENV['API_URL'].'/api/users/' . $userUUID, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]);
            return $response->toArray();
        } catch (\Exception $e) {
            return null;
        }
    }

    public function logout($userId)
    {
        $accessToken = $this->requestStack->getSession()->get('accessToken');

        try {
            $response = $this->httpClient->request('POST', $_ENV['API_URL'].'/api/users/' . $userId . '/action/logout', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);
            return $response->toArray();
        } catch (\Exception $e) {
            return null;
        }
    }
}
