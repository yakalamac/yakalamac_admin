<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Service;

class TokenStorage
{
    private ?string $token = null;

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function clearToken(): static
    {
        $this->token = null;

        return $this;
    }
}