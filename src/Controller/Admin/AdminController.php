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

    #[Route('/admin/users', name: 'admin_users')]
    public function users(Request $request): Response
    {
        $user = $this->getUserOrRedirect($request);
        if ($user instanceof RedirectResponse) {
            return $user;
        }
        return $this->render('admin/pages/user/index.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('/admin/users/data', name: 'admin_users_data')]
    public function getUsersData(Request $request): JsonResponse
{
    $draw = intval($request->query->get('draw', 1));
    $start = intval($request->query->get('start', 0));
    $length = intval($request->query->get('length', 15));

    $page = floor($start / $length) + 1;

    $accessToken = $request->getSession()->get('accessToken');

    if (!$accessToken) {
        return new JsonResponse([
            'error' => 'User not authenticated'
        ], 401);
    }

    $client = HttpClient::create([
        'headers' => [
            'Authorization' => 'Bearer ' . $accessToken
        ]
    ]);

    try {
        $profilesResponse = $client->request('GET', 'https://api.yaka.la/api/user/profiles', [
            'query' => ['page' => $page],
        ]);
        $profilesData = $profilesResponse->toArray();

        $profiles = $profilesData['hydra:member'] ?? [];
        $totalProfiles = $profilesData['hydra:totalItems'] ?? 0;

        $data = [];

        // foreach ($profiles as $profile) {
        //     $userUri = $profile['user'];
        //     $userId = basename($userUri);

        //     $userResponse = $client->request('GET', 'https://api.yaka.la' . $userUri);
        //     $userData = $userResponse->toArray();

        //     $data[] = [
        //         'uuid' => $userId,
        //         'email' => $userData['email'] ?? '',
        //         'mobilePhone' => $userData['mobilePhone'] ?? ''
        //     ];
        // }

        $response = [
            'draw' => $draw,
            'recordsTotal' => $totalProfiles,
            'recordsFiltered' => $totalProfiles,
            'data' => $profiles
        ];

        return new JsonResponse($response);

    } catch (\Exception $e) {
        return new JsonResponse([
            'error' => 'An error occurred while fetching user data.',
            'details' => $e->getMessage()
        ], 500);
    }
}


}