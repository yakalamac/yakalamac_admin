<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Interface;

use App\DTO\AccountLinkDTO;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Contracts\HttpClient\ResponseInterface;

interface IdentityProviderServiceInterface
{
    public function start(string $redirectUri, string $state): RedirectResponse;

    public function exchange(array $data): ResponseInterface;

    public function getUserCredentials(array $data): ?AccountLinkDTO;
}