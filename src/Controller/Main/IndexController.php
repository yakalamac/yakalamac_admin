<?php

namespace App\Controller\Main;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use App\Http\ClientFactory;
use App\Http\Defaults;
use Exception;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class IndexController extends AbstractController
{
    

    public function __construct()
    {
    }


    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('public/index.html.twig');
    }
    #[Route('/login', name: 'login')]
    public function login(Request $request): Response
    {
        $user = $request->attributes->get('user');
        return $this->render('public/login.html.twig');
    }

    #[Route('/forgot_password', name: 'forgot_password')]
    public function forgot_password(): Response
    {
        return $this->render('public/forgot_password.html.twig');
    }

    #[Route('/register', name: 'register')]
    public function register(): Response
    {
        return $this->render('public/register.html.twig');
    }

}