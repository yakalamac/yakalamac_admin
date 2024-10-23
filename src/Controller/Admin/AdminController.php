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


class AdminController extends AbstractController
{

    private $httpClient;
    private $service;
    private $userService;
    private ApiController $apiController;



     /**
     *
     * @param HttpClientInterface $httpClient
     * @param UserService $userService
     */
    public function __construct(HttpClientInterface $httpClient, UserService $userService,ApiController $apiController, PlaceService $service)
    {
        $this->httpClient = $httpClient;
        $this->userService = $userService;
        $this->service = $service;
        $this->apiController = $apiController;

    }

    #[Route('/logout', name: 'logout')]
    public function logout(Request $request): Response
    {

        $user = $this->userService->getCurrentUser();
        if ($user === null) {
            return $this->redirectToRoute('login'); 
        }

        $response = $this->userService->logout($user['id']);

        $request->getSession()->remove('accessToken');
        $request->getSession()->remove('user');
        $this->addFlash('success', 'Çıkış yapıldı.');

        return $this->redirectToRoute('login');
    }

    /**
     *
     * @param Request $request
     * @return array|RedirectResponse
     */
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
        $user = $this->getUserOrRedirect($request);
        if ($user instanceof RedirectResponse) {
            return $user; 
        }
        return $this->render('admin/pages/dashboard.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/places', name: 'places')]
    public function places(Request $request): Response
    {
        $user = $this->getUserOrRedirect($request);
        if ($user instanceof RedirectResponse) {
            return $user; 
        }
    
    
        return $this->render('admin/pages/place/places.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/place_category', name: 'place_category')]
    public function placeCategory(Request $request): Response
    {
        $user = $this->getUserOrRedirect($request);
        if ($user instanceof RedirectResponse) {
            return $user; 
        }
    
    
        return $this->render('admin/pages/place/place-category.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/admin_add_product', name: 'admin_add_product')]
    public function addProduct(Request $request): Response
    {
        $user = $this->getUserOrRedirect($request);
        if ($user instanceof RedirectResponse) {
            return $user; 
        }
        return $this->render('admin/pages/product/add-product.html.twig', [
            'user' => $user,
        ]);
    }

    
  
}