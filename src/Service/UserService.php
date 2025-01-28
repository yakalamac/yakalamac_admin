<?php

namespace App\Service;

use App\DTO\AccountLinkDTO;
use App\Security\User\ApiUser;
use Exception;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\HttpClient\ResponseInterface;

class UserService
{
    private ?RequestStack $requestStack;
    private ?HttpClientInterface $httpClient;

    public function __construct(RequestStack $requestStack, HttpClientInterface $httpClient)
    {
        $this->requestStack = $requestStack;
        $this->httpClient = $httpClient;
    }

    /**
     * @return array|null
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     */
    public function getCurrentUser(): ?array
    {
        $accessToken = $this->requestStack->getSession()->get('accessToken');
        $userUUID = $this->requestStack->getSession()->get('userUUID');
        if (!$accessToken || !$userUUID) {
            return null;
        }

        try {
            $response = $this->httpClient->request('GET', $_ENV['API_URL'] . '/api/users/' . $userUUID, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ]
            ]);
            return $response->toArray();
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * @param $userId
     * @return array|null
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function logout($userId): ?array
    {
        $accessToken = $this->requestStack->getSession()->get('accessToken');

        try {
            $response = $this->httpClient->request('POST', $_ENV['API_URL'] . '/api/users/' . $userId . '/action/logout', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);
            return $response->toArray(false);
        } catch (Exception $e) {
            error_log($e->getMessage());
            return null;
        }
    }

    /**
     * @param AccountLinkDTO $accountLinkDTO
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    public function linkAccount(AccountLinkDTO $accountLinkDTO): ResponseInterface
    {
        if(null === $userId = $accountLinkDTO->getUserId()) {
            throw new Exception('Invalid request credentials. No user found.', Response::HTTP_BAD_REQUEST);
        }

        if(null === $uri = $accountLinkDTO->getLinkUri()) {
            throw new Exception('Invalid request credentials. No URI found.', Response::HTTP_BAD_REQUEST);
        }

        if (null === $subject = $accountLinkDTO->getSubject()) {
            throw new Exception('Invalid request credentials. Invalid account subject.', Response::HTTP_BAD_REQUEST);
        }

        $refreshToken = $accountLinkDTO->getRefreshToken();
        $accessToken = $accountLinkDTO->getAccessKey();

        if ($refreshToken === null && $accessToken === null) {
            throw new Exception('Invalid request credentials. Unauthorized.', Response::HTTP_BAD_REQUEST);
        }

        $options = new HttpOptions();
        $options->setBaseUri($_ENV['API_URL']);

        if ($accessToken !== null) {
            $options->setAuthBearer($accessToken);
        }

        if ($refreshToken !== null) {
            $options->setHeader('Yakalamac-Refresh-Token', $refreshToken);
        }

        $options->setJson(['userId' => $userId, 'identityProviderUserId' => $subject]);

        return $this->httpClient->request('POST',  $uri, $options->toArray());
    }

    /**
     * @param ApiUser $user
     * @param array $body
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function update(ApiUser $user, array $body): ResponseInterface
    {
        return $this->httpClient->request('PATCH',$_ENV['API_URL'] ."/api/users/{$user->getUserIdentifier()}",[
           'headers' => [
               'Content-Type' => 'application/merge-patch+json', 'accept' => 'application/ld+json',
               'X-Yakalamac-Refresh-Token' => $user->getRefreshToken(),
               'Authorization' => 'Bearer ' . $user->getAccessToken(),
           ],
            'json' => $body,
        ]);
    }

    /**
     * @param string $type
     * @param string $value
     * @param ApiUser $user
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function verifyUserCredential(string $type, string $value, ApiUser $user): ResponseInterface
    {
        $uri = match ($type) {
            'email' => '/api/action/verification/send/email',
            'mobilePhone' => '/api/action/verification/send/mobile-phone'
        };

        return $this->httpClient->request('POST', $_ENV['API_URL'] . $uri, [
            'headers' => [
                'Content-Type' => 'application/json', 'accept' => 'application/ld+json',
                'X-Yakalamac-Refresh-Token' => $user->getRefreshToken(),
                'Authorization' => 'Bearer ' . $user->getAccessToken(),
            ],
            'json' => [
                $type => $value
            ]
        ]);
    }

    public function completeMobilePhoneVerification(string $smsCode, string $verificationToken, string $identifier, ApiUser $user): ResponseInterface
    {
        return $this->httpClient->request('POST', $_ENV['API_URL'] . '/api/action/verification/verify/mobile-phone', [
            'headers' => [
                'Content-Type' => 'application/json', 'accept' => 'application/ld+json',
                'X-Yakalamac-Refresh-Token' => $user->getRefreshToken(),
                'Authorization' => 'Bearer ' . $user->getAccessToken(),
            ],
            'json' => [
                'smsCode' => $smsCode,
                'verificationToken' => $verificationToken,
                'mobilePhone'=>$identifier,
            ]
        ]);
    }
}
