<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http;

use App\Security\Http\Abstract\Authenticator;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

class RegularAuthenticator extends Authenticator
{
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login_regular';
    }

    public function authenticate(Request $request): Passport
    {
        $this->csrfCheck($request);

        $content = $request->request->all();

        $result = array_intersect(['loginId', 'password'], $content);

        if(count($result) !== 2) {
            throw new CustomUserMessageAuthenticationException('Invalid credentials.');
        }

        $body = [
            'loginId'=>$content['loginId'],
            'password' => $content['password'],
            'application'=> str_contains('@yakalamac.com.tr', $content['loginId']) ? 'admin' : 'business'
        ];

        $response = $this->client->post('action/login', ['json' => $body]);

        throw new \Exception($response->getContent(false));

    }

}