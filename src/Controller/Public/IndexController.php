<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public;

use App\Security\Http\Abstract\Authenticator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('public/landing-page/index.html.twig');
    }

    #[Route('/login', name: 'login_page')]
    public function login(): Response
    {
        return $this->render('public/login/index.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/forgot_password', name: 'forgot_password')]
    public function forgot_password(): Response
    {
        return $this->render('public/forgot_password.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/register', name: 'register')]
    public function register(): Response
    {
        return $this->render('public/register.html.twig');
    }

}