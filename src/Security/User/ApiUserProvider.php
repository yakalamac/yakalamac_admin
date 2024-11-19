<?php
namespace App\Security\User;

use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ApiUserProvider implements UserProviderInterface
{
    private HttpClientInterface $client;
    private RequestStack $requestStack;

    public function __construct(HttpClientInterface $client, RequestStack $requestStack)
    {
        $this->client = $client;
        $this->requestStack = $requestStack;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $session = $this->requestStack->getSession();
    
        $accessToken = $session->get('accessToken');
    
        if (!$accessToken) {
            throw new UserNotFoundException('Access token bulunamadı.');
        }
    
        $response = $this->client->request('GET', 'https://api.yaka.la/api/users/' . urlencode($identifier), [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ]
        ]);
    
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
    

    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof ApiUser) {
            throw new UnsupportedUserException(sprintf('Beklenmeyen kullanıcı türü "%s".', get_class($user)));
        }

        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return ApiUser::class === $class;
    }
}
