<?php

namespace App\DTO;

use stdClass;

class RegistrationDTO
{
    /**
     * @var ?string
     */
    public ?string $id;

    /**
     * @var ?int
     */
    public ?int $application;

    /**
     * @var ?string
     */
    public ?string $username;

    /**
     * @var array
     */
    public array $roles = [];

    /**
     * @var stdClass
     */
    public stdClass $data;

    public function __construct(?int $application)
    {
        $this->application = $application;
    }
}