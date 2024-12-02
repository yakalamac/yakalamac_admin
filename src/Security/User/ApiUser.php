<?php
namespace App\Security\User;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\EquatableInterface;

class ApiUser implements UserInterface, EquatableInterface
{
    private string $id;
    private string $email;
    private string $phone;
    private array $roles;
    private string $accessToken;
    private array $data;

    public function isEqualTo(UserInterface $user): bool
    {
        if (!$user instanceof self) {
            return false;
        }

        return $this->getUserIdentifier() === $user->getUserIdentifier();
    }

    public function __construct(array $userData, string $accessToken)
    {
        $this->id = $userData['id'];
        $this->email = $userData['email'] ?? '';
        $this->phone = $userData['mobilePhone'] ?? '';
        $this->roles = $this->extractRoles($userData);
        $this->accessToken = $accessToken;
        $this->data = $userData;
    }

    private function extractRoles(array $userData): array
    {
        $roles = ['ROLE_USER'];

        if (isset($userData['businessRegistration'])) {
            $businessRoles = $userData['businessRegistration']['roles'] ?? [];
            foreach ($businessRoles as $role) {
                if ($role === 'SUPER_ADMIN') {
                    $roles[] = 'ROLE_SUPER_ADMIN';
                } elseif ($role === 'EDITOR_ADMIN') {
                    $roles[] = 'ROLE_EDITOR_ADMIN';
                } elseif ($role === 'PARTNER_ADMIN') {
                    $roles[] = 'ROLE_PARTNER_ADMIN';
                }
            }
        }

        return $roles;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function __serialize(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'phone' => $this->phone,
            'roles' => $this->roles,
            'accessToken' => $this->accessToken,
            'data' => $this->data,
        ];
    }

    public function __unserialize(array $data): void
    {
        $this->id = $data['id'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->phone = $data['phone'] ?? '';
        $this->roles = $data['roles'] ?? [];
        $this->accessToken = $data['accessToken'] ?? '';
        $this->data = $data['data'] ?? [];
    }

    public function getPassword(): ?string
    {
        return null;
    }

    public function getUserIdentifier(): string
    {
        return $this->id;
    }

    public function eraseCredentials(): void
    {
    }

    public function getAccessToken(): string
    {
        return $this->accessToken;
    }

    public function getData(): array
    {
        return $this->data;
    }
}