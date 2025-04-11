<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\EntryPoint;

use App\DTO\ApiUser;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

readonly class AuthenticationEntryPoint implements AuthenticationEntryPointInterface
{
    /**
     * @param RouterInterface $router
     */
    public function __construct(private RouterInterface $router) {}

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return Response
     */
    public function start(Request $request, ?AuthenticationException $authException = null): Response
    {
        if($request->getUser() instanceof ApiUser) {
            return new RedirectResponse($request->getBaseUrl());
        }

        $request->getSession()->getFlashBag()
            ->add('error', "Önce giriş yapmalısınız.");

        return new RedirectResponse($this->router->generate('login_page'));
    }
}