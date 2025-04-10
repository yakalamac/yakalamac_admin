<?php

namespace App\Interface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

interface AuthenticationScopeInterface
{
    public function authenticate(Request $request): Passport;
}