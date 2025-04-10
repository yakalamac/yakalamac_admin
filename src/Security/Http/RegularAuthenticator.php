<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http;

use App\DTO\ApiUser;
use App\Security\Http\Abstract\Authenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Throwable;

class RegularAuthenticator extends Authenticator
{
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login_regular';
    }

    /**
     * @param Request $request
     * @return Passport
     * @throws Throwable
     */
    public function authenticate(Request $request): Passport
    {
        $this->csrfCheck($request);

        $content = $request->request->all();

        if(!$content['password']) {
            throw new CustomUserMessageAuthenticationException('Password is required.');
        }

        $loginId = $content['email'] ?? $content['mobilePhone']
            ?? throw new CustomUserMessageAuthenticationException('Invalid credentials.');

        $body = [
            'loginId'=>$loginId,
            'password' => $content['password'],
            'application'=> str_contains('@yakalamac.com.tr', $loginId) ? 'admin' : 'business'
        ];

        $response = $this->client->post('action/login', ['json' => $body]);

        $data = $this->client->toArray($response);

        if($response->getStatusCode() < 200 || $response->getStatusCode() > 299) {
            throw new AuthenticationException(json_encode($data));
        }

        $user = new ApiUser($data['user'], $data['accessToken'], $data['refreshToken'] ?? NULL);

        return $this->createPassport($user);
    }

}