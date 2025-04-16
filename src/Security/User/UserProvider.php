<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */
namespace App\Security\User;

use App\DTO\ApiUser;
use Exception;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

class UserProvider implements UserProviderInterface
{
    /**
     * @var HttpClientInterface
     */
    private HttpClientInterface $client;

    /**
     * @param RequestStack $stack
     */
    public function __construct(private readonly RequestStack $stack)
    {
        $this->client = HttpClient::create([
            'base_uri' => $_ENV['API_URL'],
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        ]);
    }

    /**
     * @param string $identifier
     * @return UserInterface
     * @throws Throwable
     */
    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $session = $this->stack->getSession();

        $user = $session->get('api_user');

        if($user !== NULL && $user->getUserIdentifier() !== $identifier) {
            throw new \Exception("Identifier empty");
            throw new UserNotFoundException();
        }

        return $user;
    }

    /**
     * @param UserInterface $user
     * @return UserInterface
     * @throws Throwable
     */
    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof ApiUser) {
            throw new UnsupportedUserException();
        }

        $accessToken = $user->getAccessToken();
        $refreshToken = $user->getRefreshToken();

        if($accessToken === NULL && $refreshToken === NULL) {
            throw new Exception('No authentication credentials were provided.');
        }

        try {
            $result = $this->getUser($user->getUserIdentifier(), $accessToken);

            if($result->getUserIdentifier() !== $user->getUserIdentifier()) {
                throw new \Exception("User is not valid.");
            }

        } catch (Throwable $exception) {

            error_log($exception->getMessage());

            if($refreshToken === NULL) {
                throw new Exception('Refresh token was not provided.');
            }

            $credentials = $this->jwtRefresh($accessToken, $refreshToken);

            $user = $user->setAccessToken($credentials['accessToken'])
                ->setRefreshToken($credentials['refreshToken']);
        }

        return $user;
    }

    /**
     * @param string $class
     * @return bool
     */
    public function supportsClass(string $class): bool
    {
        return ApiUser::class === $class;
    }

    /**
     * @param string $identifier
     * @param string $accessToken
     * @return ApiUser
     * @throws Throwable
     */
    private function getUser(string $identifier, string $accessToken): ApiUser
    {
        $response = $this->client->request('GET', '/api/users/' . urlencode($identifier), [
            'auth_bearer' => $accessToken,
        ]);

        $statusCode = $response->getStatusCode();

        if ($statusCode < 199 || $statusCode > 299) {
            throw new UserNotFoundException('Kullanıcı bulunamadı. API yanıt kodu: ' . $statusCode);
        }

        $data = $response->toArray();

        return new ApiUser($data);
    }

    /**
     * @param string $accessToken
     * @param string $refreshToken
     * @return array
     * @throws Throwable
     */
    private function jwtRefresh(string $accessToken, string $refreshToken): array
    {
        $response = $this->client->request('POST','/api/action/refresh/jwt', [
            'json' => [
                'accessToken' => $accessToken,
                'refreshToken' => $refreshToken,
            ]
        ]);

        $status = $response->getStatusCode();

        if($status < 200 || $status >= 300) {
            throw new Exception('No valid token');
        }

        return $response->toArray();
    }
}