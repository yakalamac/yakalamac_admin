<?php
namespace App\Security\User;

use App\Exception\InvalidCredentialsException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ApiUserProvider implements UserProviderInterface
{
    private HttpClientInterface $client;
    private RequestStack $requestStack;

    public function __construct(HttpClientInterface $client, RequestStack $requestStack, private readonly LoggerInterface $logger)
    {
        $this->client = $client;
        $this->requestStack = $requestStack;
    }

    /**
     * @param string $identifier
     * @param string|null $accessToken
     * @param string|null $refreshToken
     * @return UserInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function loadUserByIdentifier(string $identifier, ?string $accessToken = null, ?string $refreshToken = null): UserInterface
    {
        $session = $this->requestStack->getSession();
        
        if ($accessToken === null) {
            $accessToken = $session->get('accessToken');
        }

        if($refreshToken === null) {
            $refreshToken = $session->get('refreshToken');
        }
    
        if (!($accessToken || $refreshToken)) {
            $this->logger->info("ApiUserProvider No access token");
            throw new UserNotFoundException('Access token bulunamadı.');
        }

        $options = [];

        if($accessToken) {
            $options['headers']['Authorization'] = 'Bearer ' . $accessToken;
        }

        if($refreshToken) {
            $options['query']['refresh_token'] = $refreshToken;
        }
        
        $response = $this->client->request('GET', $_ENV['API_URL'].'/api/users/' . urlencode($identifier),$options);
    
        $statusCode = $response->getStatusCode();

        if ($statusCode !== 200 && $statusCode !== 201) {
            throw new UserNotFoundException('Kullanıcı bulunamadı. API yanıt kodu: ' . $statusCode);
        }
    
        $data = $response->toArray();

        if (!isset($data['id'])) {
            throw new UserNotFoundException('Geçersiz kullanıcı verisi.');
        }
    
        $userData = $data;
    
        return new ApiUser($userData, $accessToken);
    }

    /**
     * @param UserInterface $user
     * @return UserInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws InvalidCredentialsException
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof ApiUser) {
            throw new UnsupportedUserException(sprintf('Beklenmeyen kullanıcı türü "%s".', get_class($user)));
        }

        $accessToken = $user->getAccessToken();
        $refreshToken = $user->getRefreshToken();
     
        return $user;
    }

    public function supportsClass(string $class): bool
    {
        return ApiUser::class === $class;
    }
}
