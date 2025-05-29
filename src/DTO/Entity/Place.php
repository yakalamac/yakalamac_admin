<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\DTO\Entity;

use App\DTO\Registration\BusinessRegistration;

readonly class Place
{
    /**
     * @param array $data
     * @param BusinessRegistration $registration
     */
    public function __construct(private array $data, private BusinessRegistration $registration) {}

    /**
     * @return BusinessRegistration,
     */
    public function getBusinessRegistration(): BusinessRegistration
    {
        return $this->registration;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->data['name'] ?? $this->getId();
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->data['id'];
    }
}