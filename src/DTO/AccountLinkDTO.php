<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\DTO;

class AccountLinkDTO
{
    /**
     * @var ApiUser|null
     */
    private ?ApiUser $user;

    /**
     * @var array|null
     */
    private ?array $data;

    /**
     * @var string|null
     */
    private ?string $accountType;

    public function __construct(array $data, ?ApiUser $user = null, ?string $accountType = NULL)
    {
        $this->user = $user;
        $this->data = $data;
        $this->accountType = $accountType;
    }

    /**
     * @return string|null
     */
    public function getUserId(): ?string
    {
        return $this->user->getUserIdentifier();
    }

    /**
     * @return string|null
     */
    public function getAudience(): ?string
    {
        if(isset($this->data['aud']) && is_string($this->data['aud'])) {
            return $this->data['aud'];
        }

        return null;
    }

    /**
     * @return string|null
     */
    public function getIssuer(): ?string
    {
        if(isset($this->data['iss']) && is_string($this->data['iss'])) {
            return $this->data['iss'];
        }

        return null;
    }

    /**
     * @return string|null
     */
    public function getSubject(): ?string
    {
        if(isset($this->data['sub']) && is_string($this->data['sub'])) {
            return $this->data['sub'];
        }

        return null;
    }

    /**
     * @return string|null
     */
    public function getPicture(): ?string
    {
        if(isset($this->data['picture']) && is_string($this->data['picture'])) {
            return $this->data['picture'];
        }

        return null;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        if(isset($this->data['email']) && is_string($this->data['email'])) {
            return $this->data['email'];
        }

        return null;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        if(isset($this->data['name']) && is_string($this->data['name'])) {
            return $this->data['name'];
        }

        return null;
    }

    /**
     * @return bool
     */
    public function isEmailVerified(): bool
    {
        if(isset($this->data['email_verified']) && is_bool($this->data['email_verified'])) {
            return $this->data['email_verified'];
        }

        return false;
    }

    /**
     * @return string|null
     */
    public function getAccessKey(): ?string
    {
        return $this?->user?->getAccessToken();
    }

    /**
     * @return string|null
     */
    public function getRefreshToken(): ?string
    {
        return $this?->user?->getRefreshToken();
    }

    /**
     * @param ApiUser $user
     * @return $this
     */
    public function setUser(ApiUser $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @param array $data
     * @return $this
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    /**
     * @param string $accountType
     * @return $this
     */
    public function setAccountType(string $accountType): static
    {
        $this->accountType = $accountType;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getLinkUri(): ?string
    {
        return match ($this->accountType) {
            'google' => '/api/identity-provider/google/link',
            'apple' => '/api/identity-provider/apple/link',
            'facebook' => '/api/identity-provider/facebook/link',
            default => null
        };
    }

    /**
     * @return array
     */
    public function __toArray(): array
    {
        return [
          'linkUri' => $this->getLinkUri(),
          'issuer' => $this->getIssuer(),
          'email' => $this->getEmail(),
          'name' => $this->getName(),
          'accessKey' => $this->getAccessKey(),
          'refreshToken' => $this->getRefreshToken(),
            'picture' => $this->getPicture(),
            'isEmailVerified' => $this->isEmailVerified(),
            'accountType' => $this->accountType
        ];
    }
}