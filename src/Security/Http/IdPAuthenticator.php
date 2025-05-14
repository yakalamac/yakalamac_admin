<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http;

use App\Security\Http\Abstract\Authenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

class IdPAuthenticator extends Authenticator
{
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login_idp';
    }

    public function authenticate(Request $request): Passport
    {
        // TODO: Implement authenticate() method.
    }
}