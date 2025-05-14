<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */
namespace App\Security\User;

use App\DTO\ApiUser;
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
     * @var ?HttpClientInterface
     */
    private ?HttpClientInterface $client = NULL;

    /**
     * @param RequestStack $stack
     */
    public function __construct(private readonly RequestStack $stack)
    {
        if($this->client === NULL) {
            $this->client = HttpClient::create([
                'base_uri' => $_ENV['API_URL'],
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ]
            ]);
        }
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

        if($user === NULL) {
            throw new UserNotFoundException('No user found.');
        }

        if($user->getUserIdentifier() !== $identifier) {
            throw new UserNotFoundException("Identifier empty");
        }

        $session->remove('api_user');

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
            // TODO for troubleshooting throw new \Exception('User is not instance of ApiUser');
            throw new UnsupportedUserException();
        }

        $accessToken = $user->getAccessToken();
        $refreshToken = $user->getRefreshToken();

        if($accessToken === NULL && $refreshToken === NULL) {
            // TODO for troubleshooting throw new \Exception('Both refresh and access token is null');
            throw new UnsupportedUserException('No authentication credentials were provided.');
        }

        try {
            $result = $this->getUser($user->getUserIdentifier(), $accessToken);
            if($result->getUserIdentifier() !== $user->getUserIdentifier()) {
             // TODO for troubleshooting throw new \Exception('User ');
                throw new UnsupportedUserException("User not found");
            }

            return $user->refresh($result);

        } catch (Throwable $exception) {

            error_log($exception->getMessage());

            if($refreshToken === NULL) {
               // TODO for troubleshooting throw new \Exception('Refresh token was not provided');
                throw new UnsupportedUserException('Refresh token was not provided.');
            }

            $credentials = $this->jwtRefresh($accessToken, $refreshToken);

            return $user->setAccessToken($credentials['accessToken'])
                ->setRefreshToken($credentials['refreshToken']);
        }
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
            // TODO for troubleshooting throw new \Exception('User not found. API response ' . $statusCode);
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
           // TODO for troubleshooting throw new \Exception('No validtoken');
            throw new UnsupportedUserException('No valid token');
        }

        return $response->toArray();
    }
}