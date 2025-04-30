<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\DTO\Registration\Abstract;

use App\DTO\ApiUser;

abstract class AbstractRegistration
{
    public function setData(array $data): static
    {
        $this->data = [...$this->data, ...$data];
        $this->init();

        return $this;
    }

    public function __construct(protected readonly ApiUser $user, protected array $data)
    {
        if(isset($this->data['iri'])) return;
        $this->init();
    }

    protected abstract function init(): void;

    /**
     * @return ApiUser|null
     */
    public function getApiUser(): ?ApiUser
    {
        return $this->user;
    }

    public function getId(): string
    {
        return $this->data['id'];
    }

    public function requiresInitialization(): bool
    {
        return array_keys($this->data) === ['iri'];
    }

    public function getIri(): ?string
    {
        return $this->data['iri'] ?? NULL;
    }
}