<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;
use App\Security\Http\Authenticator;
class IndexController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('public/index.html.twig');
    }

    #[Route('/login', name: 'login_page')]
    public function login(Request $request): Response
    {
        return $this->render('public/login.html.twig');
    }

    #[Route('/send-otp', name: 'send_otp')]
    public function sendOtp(Request $request, Authenticator $authenticator): JsonResponse
    {
        $mobilePhone = $request->request->get('mobilePhone');

        if (!$mobilePhone) {
            return new JsonResponse(['error' => 'Telefon numarası gerekli.'], 400);
        }

        try {
            $verificationToken = $authenticator->sendOtp($mobilePhone);
            return new JsonResponse(['verificationToken' => $verificationToken], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('/verify-otp', name: 'verify_otp')]
    public function verifyOtp(Request $request, Authenticator $authenticator): JsonResponse
    {
        $mobilePhone = $request->request->get('mobilePhone');
        $smsCode = $request->request->get('smsCode');
        $verificationToken = $request->request->get('verificationToken');
    
        if (!$mobilePhone || !$smsCode || !$verificationToken) {
            return new JsonResponse(['error' => 'Eksik bilgiler.'], 400);
        }
    
        try {
            $user = $authenticator->verifyOtp($mobilePhone, $smsCode, $verificationToken);
    
            $redirectUrl = $this->generateUrl(
                in_array('ROLE_SUPER_ADMIN', $user->getRoles(), true) || in_array('ROLE_EDITOR_ADMIN', $user->getRoles(), true)
                    ? 'admin_dashboard'
                    : (in_array('ROLE_PARTNER_ADMIN', $user->getRoles(), true) ? 'partner_dashboard' : 'admin_dashboard')
            );
    
            return new JsonResponse(['success' => true, 'redirect' => $redirectUrl], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        }
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