<?php

/**
 * @author Kıvanç Hançerli
 * @version 1.0.0
 *
 * @author Onur Kudret
 * @version 1.0.1
 */

namespace App\Security\User;

use App\Exception\InvalidCredentialsException;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\EquatableInterface;
use App\Service\UserService;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ApiUser implements UserInterface, EquatableInterface
{
    private ?string $id = null;
    private ?string $email = null;
    private ?string $phone = null;
    private ?array $roles = null;
    private ?string $accessToken = null;
    private ?string $refreshToken = null;
    private array $data = [];
    private ?array $linkedAccounts = null;

    public function isEqualTo(UserInterface $user): bool
    {
        if (!$user instanceof self) {
            return false;
        }

        return $this->getUserIdentifier() === $user->getUserIdentifier();
    }

    /**
     * @param array $userData
     * @param string|null $accessToken
     * @param string|null $refreshToken
     * @throws InvalidCredentialsException
     */
    public function __construct(array $userData, ?string $accessToken = null, ?string $refreshToken = null)
    {
        if ($accessToken === null && $refreshToken === null) {
            throw new InvalidCredentialsException();
        }
        // Todo (Parse this data into props)
        // Todo (Change user provider)
        $this->id = $userData['id'];
        $this->email = $userData['email'] ?? '';
        $this->phone = $userData['mobilePhone'] ?? '';
        $this->roles = $this->extractRoles($userData);
        $this->accessToken = $accessToken;
        $this->refreshToken = $refreshToken;

        if (array_key_exists('roles', $userData)) {
            $userData['roles'] = $this->roles;
        }

        $this->data = $userData;
    }

    /**
     * @param array $userData
     * @return array
     */
    private function extractRoles(array $userData): array
    {
        $roles = [];

        if (isset($userData['businessRegistration'])) {
            $roles = array_merge($roles, ['ROLE_ADMIN'], $userData['businessRegistration']['roles'] ?? []);
        }

        if (isset($userData['adminRegistration'])) {
            $roles = array_merge($roles, ['ROLE_PARTNER'], $userData['adminRegistration']['roles'] ?? []);
        }

        return $roles;
    }

    /**
     * @return array|string[]
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    /**
     * @return array
     */
    public function __serialize(): array
    {
        $array = [];

        foreach ($this as $key => $value)
        {
            if (is_callable($this->$key) || is_callable($value) || $this->$key === null) {
                continue;
            }

            $array[$key] = $value;
        }
        return $array;
    }

    public function __unserialize(array $data): void
    {
        foreach ($data as $key => $value) if (property_exists($this, $key)) $this->$key = $value;
    }

    public function getPassword(): ?string
    {
        return null;
    }

    public function getUserIdentifier(): string
    {
        return $this->id;
    }

    public function eraseCredentials(): void {}

    public function getAccessToken(): ?string
    {
        return $this->accessToken;
    }

    public function getRefreshToken(): ?string
    {
        return $this->refreshToken;
    }

    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getLinkedAccounts(): ?array
    {
        //todo (Move this process into an service `UserService` e.g.)
        if ($this->linkedAccounts === null)
        {
            $client = HttpClient::create();

            try
            {
                $response = $client->request(
                    'GET',
                    $_ENV['API_URL'] . '/api/identity-provider/' . $this->id
                );

                $linkedAccountArray = $response->toArray(false);

                if (
                    isset($linkedAccountArray['identityProviderLinks']['hydra:member'])
                ) {
                    $this->linkedAccounts = $linkedAccountArray['identityProviderLinks']['hydra:member'];
                } else {
                    $this->linkedAccounts = [];
                }
            } catch (\Exception $e) {
                error_log($e->getMessage());
                $this->linkedAccounts = [];
            }
        }
        return $this->linkedAccounts;
    }
}
