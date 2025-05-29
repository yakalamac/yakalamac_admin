<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public\Index;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    /**
     * @return Response
     */
    #[Route('/login', name: 'login_page')]
    public function login(): Response
    {
        return $this->render('public/login/index.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/forgot_password', name: 'forgot_password')]
    public function forgotPassword(): Response
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

    /**
     * @return Response
     */
    #[Route('/privacy-policy', name: 'app_public_privacy_policy')]
    public function privacy_policy(): Response
    {
        return $this->render('public/privacy-policy/index.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/terms-of-use', name: 'app_public_terms_of_use')]
    public function terms_of_use(): Response
    {
        return $this->render('public/terms-of-use/index.html.twig');
    }
}