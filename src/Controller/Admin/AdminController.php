<?php

namespace App\Controller\Admin;

use App\Service\PlaceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UserService;
use App\Controller\API\ApiController;

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
use Symfony\Component\HttpClient\HttpClient;

class AdminController extends AbstractController
{


    private HttpClientInterface $httpClient;
    private $service;
    private $userService;
    private ApiController $apiController;


    /**
     *
     * @param HttpClientInterface $httpClient
     * @param UserService $userService
     * @param ApiController $apiController
     * @param PlaceService $service
     */
    public function __construct(HttpClientInterface $httpClient, UserService $userService, ApiController $apiController, PlaceService $service)
    {
        $this->httpClient = $httpClient;
        $this->userService = $userService;
        $this->service = $service;
        $this->apiController = $apiController;
    }

    // #[Route('/logout', name: 'logout')]
    // public function logout(Request $request): Response
    // {

    //     $user = $this->userService->getCurrentUser();
    //     if ($user === null) {
    //         return $this->redirectToRoute('app_login');
    //     }

    //     $response = $this->userService->logout($user['id']);

    //     $request->getSession()->remove('accessToken');
    //     $request->getSession()->remove('user');
    //     $this->addFlash('success', 'Çıkış yapıldı.');

    //     return $this->redirectToRoute('login_page');
    // }

    #[Route('/login', name: 'login_page')]
public function login(Request $request): Response
{
    return $this->render('public/login.html.twig');
}

    #[Route('/admin', name: 'admin_dashboard')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/dashboard.html.twig');
    }
}