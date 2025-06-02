<?php

/**
 * @author Kıvanç Hançerli
 * @version 1.0.0
 *
 * @author Onur Kudret
 * @version 1.0.1
 */

namespace App\DTO;

use App\DTO\Registration\AdminRegistration;
use App\DTO\Registration\BusinessRegistration;
use Symfony\Component\Security\Core\User\EquatableInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ApiUser implements UserInterface, EquatableInterface
{
    /**
     * @var string|null
     */
    private ?string $accessToken = NULL;

    /**
     * @var string|null
     */
    private ?string $refreshToken = NULL;

    /**
     * @var array
     */
    private array $data = [];

    /**
     * @var array
     */
    private array $roles = [];

    /**
     * @var AdminRegistration|null
     */
    private ?AdminRegistration $adminRegistration = NULL;

    /**
     * @var BusinessRegistration|null
     */
    private ?BusinessRegistration $businessRegistration = NULL;

    /**
     * Entrypoint of user
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->init($data);
    }

    /**
     * @return array|string[]
     */
    public function getRoles(): array
    {
        return array_merge(
            $this->roles,
            $this->getBusinessRegistration()?->getRoles() ?? [],
            $this->getAdminRegistration()?->getRoles() ?? []
        );
    }

    /**
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return NULL;
    }

    /**
     * @return string
     */
    public function getUserIdentifier(): string
    {
        return $this->data['id'];
    }

    /**
     * @return void
     */
    public function eraseCredentials(): void {/**do nothing*/}

    /**
     * @return string|null
     */
    public function getAccessToken(): ?string
    {
        return $this->accessToken;
    }

    /**
     * @param string|null $accessToken
     * @return $this
     */
    public function setAccessToken(?string $accessToken): static
    {
        $this->accessToken = $accessToken;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getRefreshToken(): ?string
    {
        return $this->refreshToken;
    }

    /**
     * @param string|null $refreshToken
     * @return $this
     */
    public function setRefreshToken(?string $refreshToken): static
    {
        $this->refreshToken = $refreshToken;

        return $this;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @param self $user
     * @return $this
     */
    public function refresh(self $user): static
    {
        if($this->isEqualTo($user)) {
            $this->init($user->getData());
        }

        return $this;
    }

    /**
     * @param UserInterface $user
     * @return bool
     */
    public function isEqualTo(UserInterface $user): bool
    {
        if (!$user instanceof self) {
            return FALSE;
        }

        return $this->getUserIdentifier() === $user->getUserIdentifier();
    }

    /**
     * @return array
     */
    public function __serialize(): array
    {
        $array = [];

        foreach ($this as $key => $value)
        {
            if (is_callable($this->$key) || is_callable($value) || $this->$key === null) continue;

            $array[$key] = $value;
        }
        return $array;
    }

    /**
     * @param array $data
     * @return void
     */
    public function __unserialize(array $data): void
    {
        foreach ($data as $key => $value) if (property_exists($this, $key)) $this->$key = $value;
    }

    /**
     * @return BusinessRegistration|null
     */
    public function getBusinessRegistration(): ?BusinessRegistration
    {
        return $this->businessRegistration;
    }

    /**
     * @return bool
     */
    public function isBusiness(): bool
    {
        return $this->businessRegistration !== NULL;
    }

    /**
     * @return AdminRegistration|null
     */
    public function getAdminRegistration(): ?AdminRegistration
    {
        return $this->adminRegistration;
    }

    /**
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->adminRegistration !== NULL;
    }

    public function getFullName(): string
    {
        if(isset($this->data['fullName'])) {
            return $this->data['fullName'];
        }

        return ($this->data['firstName'] ?? '') . ($this->data['lastName'] ?? '');
    }

    protected function init(array $data): void
    {
        if(isset($data['accessToken'])) {
            $this->accessToken = $data['accessToken'];
        }

        if(isset($data['refreshToken'])) {
            $this->refreshToken = $data['refreshToken'];
        }

        if(isset($data['user'])) {
            $this->data = $data['user'];
        }

        if(isset($data['id'])) {
            $this->data = $data;
        }

        if(isset($this->data['adminRegistration'])) {
            if(is_string($this->data['adminRegistration'])) {
                $this->data['adminRegistration'] = ['iri' => $this->data['adminRegistration']];
            }

            $this->adminRegistration = new AdminRegistration(
                $this,
                $this->data['adminRegistration']
            );
        }

        if(isset($this->data['businessRegistration'])) {

            if(is_string($this->data['businessRegistration'])) {
                $this->data['businessRegistration'] = ['iri' => $this->data['businessRegistration']];
            }

            $this->businessRegistration = new BusinessRegistration(
                $this,
                $this->data['businessRegistration']
            );
        }
    }
}