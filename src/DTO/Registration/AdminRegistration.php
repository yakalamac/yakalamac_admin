<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\DTO\Registration;

use App\DTO\Registration\Abstract\AbstractRegistration;

class AdminRegistration extends AbstractRegistration
{
    public function getRoles(): array
    {
        return $this->data['roles'] ?? ['ROLE_ADMIN'];
    }

    protected function init(): void
    {
        $this->data['roles'][] = 'ROLE_ADMIN';
    }
}