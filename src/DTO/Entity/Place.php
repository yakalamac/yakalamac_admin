<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\DTO\Entity;

use App\DTO\Registration\BusinessRegistration;

readonly class Place
{
    public function __construct(private array $data, private BusinessRegistration $registration) {}

    public function getBusinessRegistration(): BusinessRegistration
    {
        return $this->registration;
    }

    public function getName(): string
    {
        return $this->data['name'] ?? $this->getId();
    }

    public function getId(): string
    {
        return $this->data['id'];
    }
}