<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Security;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthenticationController extends AbstractController
{
    #[Route('/_route/authentication/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): Response
    {
        var_dump($request->getSession()->isStarted());
        return new Response( json_encode($request->getContent(), JSON_PRETTY_PRINT), 200);
    }

    #[Route('/_route/authentication/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/_route/authentication/check', name: 'check', methods: ['POST'])]
    public function isAuthenticated(Request $request): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}