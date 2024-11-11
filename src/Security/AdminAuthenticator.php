<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security;

use App\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Token\PostAuthenticationToken;

class AdminAuthenticator implements AuthenticatorInterface
{
    private ?int $validationMethod = null;

    private const COOKIE_VALIDATION = 1;
    private const HEADER_VALIDATION = 2;

    public function supports(Request $request): ?bool
    {
       return (
           $request->headers->has('Authorization')
           && str_starts_with($request->headers->get('Authorization'), 'Bearer ')
           && $this->validationMethod = self::HEADER_VALIDATION
           )
           || (
               $request->cookies->has('validationtoken')
               && $this->validationMethod = self::COOKIE_VALIDATION
           );
    }

    private function authenticateWithHeader(Request $request): Passport
    {
        //TODO
    }


    private function authenticateWithCookie(Request $request): Passport
    {
        $token = $request->cookies->get('validationtoken');
        return new SelfValidatingPassport(
            new UserBadge(
                $token,
                function ($token) {
                     $user = new User();
                     $user->setRoles(['ROLE_ADMIN']);
                     $user->setId($token);
                     return $user;
                }
            )
        );
    }

    public function authenticate(Request $request): Passport
    {
        return match ($this->validationMethod) {
            self::HEADER_VALIDATION => $this->authenticateWithHeader($request),
            self::COOKIE_VALIDATION => $this->authenticateWithCookie($request),
            default => null,
        };
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new RedirectResponse('/login123');
    }


    public function createToken(Passport $passport, string $firewallName): TokenInterface
    {
        return new PostAuthenticationToken($passport->getUser(), $firewallName, $passport->getUser()->getRoles());
    }
}