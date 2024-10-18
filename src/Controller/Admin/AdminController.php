<?php

namespace App\Controller\Admin;

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
use Symfony\Component\HttpFoundation\RedirectResponse;


class AdminController extends AbstractController
{
    

    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;

    }

    private function getUserOrRedirect(Request $request): array|RedirectResponse
    {
        $user = $request->attributes->get('user');

        if ($user === null) {
            $this->addFlash('error', 'Lütfen giriş yapın.');
            return $this->redirectToRoute('login');
        }

        return $user;
    }

    #[Route('/admin', name: 'admin_dashboard')]
    public function index(Request $request): Response
    {
        // $user = $this->getUserOrRedirect($request);

        // if ($user instanceof RedirectResponse) {
        //     return $user; 
        // }
        return $this->render('admin/pages/dashboard.html.twig');
    }

}