<?php

/**
 * @author Kıvanç Hançerli
 * @version 1.0.0
 *
 * @author Onur Kudret
 * @version 1.0.1
 */

namespace App\DTO;

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
    private array $user = [];

    /**
     * @var array
     */
    private array $roles = [];

    /**
     * Entrypoint of user
     * @param array $data
     */
    public function __construct(array $data)
    {
        if(isset($data['accessToken'])) {
            $this->accessToken = $data['accessToken'];
        }

        if(isset($data['refreshToken'])) {
            $this->refreshToken = $data['refreshToken'];
        }

        if(isset($data['user'])) {
            $this->user = $data['user'];
        }

        if(isset($data['id'])) {
            $this->user = $data;
        }

        if(!empty($this->user)) {
            $this->init();
        }
    }

    /**
     * @return void
     */
    private function init(): void
    {
        foreach (['admin','business'] as $prefix) {
            $registration = $prefix.'Registration';
            if(isset($this->user[$registration]['roles'])) {
                $this->roles = array_unique(
                    array_merge(
                        $this->roles,
                        $this->user[$registration]['roles'],
                        ["ROLE_".strtoupper($prefix)]
                    )
                );
            }
        }
    }

    /**
     * @return array|string[]
     */
    public function getRoles(): array
    {
        return $this->roles;
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
        return $this->user['id'];
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
        return $this->user;
    }

    /**
     * @param array $data
     * @return $this
     */
    public function setData(array $data): static
    {
        $this->user = $data;

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
}