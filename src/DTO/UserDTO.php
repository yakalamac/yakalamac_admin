<?php

namespace App\DTO;

use Exception;
use stdClass;

class UserDTO
{
    private bool $isAdmin = false;
    private bool $isBusiness = false;
    private bool $isUser = false;

    /**
     * @var ?string
     */
    public ?string $id;

    /**
     * @var ?string
     */
    public ?string $firstName;

    /**
     * @var ?string
     */
    public ?string $lastName;

    /**
     * @var ?string
     */
    public ?string $username;

    /**
     * @var ?string
     */
    public ?string $email;

    /**
     * @var array
     */
    public array $roles = [];

    /**
     * @var array
     */
    private array $registrations = [];

    /**
     * @var stdClass
     */
    public stdClass $data;

    /**
     * @param RegistrationDTO $registration
     * @return $this
     * @throws Exception
     */

    public function addRegistration(RegistrationDTO $registration): self
    {
        if( !in_array($registration, $this->registrations) )
        {
            $this->registrations[] = $registration;

            match ($registration->application){
                1 => $this->isAdmin = true,
                2 => $this->isBusiness = true,
                3 => $this->isUser = true,
                default => throw new Exception("Application type not found")
            };
        }

        return $this;
    }

    public function isAdmin(): bool
    {
        return true;//$this->isAdmin;
    }

    public function isBusiness(): bool
    {
        return $this->isBusiness;
    }

    public function isUser(): bool
    {
        return $this->isUser;
    }
}