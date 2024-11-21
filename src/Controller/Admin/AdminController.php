<?php

namespace App\Controller\Admin;

use App\Service\PlaceService;
use App\Repository\AuditLogRepository;
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
    private $clientFactory;
    private $auditLogRepository;
    private $elasticUrl;

    /**
     *
     * @param HttpClientInterface $httpClient
     * @param UserService $userService
     * @param ApiController $apiController
     * @param PlaceService $service
     */
    public function __construct(HttpClientInterface $httpClient, UserService $userService, ApiController $apiController, PlaceService $service, ClientFactory $clientFactory, AuditLogRepository $auditLogRepository, string $elasticUrl)
    {
        $this->httpClient = $httpClient;
        $this->userService = $userService;
        $this->service = $service;
        $this->apiController = $apiController;
        $this->clientFactory = $clientFactory;
        $this->auditLogRepository = $auditLogRepository;
        $this->elasticUrl = $elasticUrl;
    }

    #[Route('/login', name: 'login_page')]
    public function login(Request $request): Response
    {
        return $this->render('public/login.html.twig');
    }

    #[Route('/admin', name: 'admin_dashboard')]
    public function index(): Response
    {
        try {
            $query = [
                'track_total_hits' => true,
                'size' => 0,
                'query' => [
                    'match_all' => new \stdClass()
                ]
            ];

            $response = $this->clientFactory->request( $this->elasticUrl ."place" . '/_search', 'GET', $query );
            $responseData = $response->toArray(false);
            $totalBusinesses = $responseData['hits']['total']['value'] ?? 0;

            $responseProduct = $this->clientFactory->request( $this->elasticUrl ."product" . '/_search', 'GET', $query );
            $responseDataProduct = $responseProduct->toArray(false);
            $totalProduct = $responseDataProduct['hits']['total']['value'] ?? 0;
        } catch (\Exception $e) {
            $totalBusinesses = 0;
            $totalProduct = 0;
        }

        $actions = ['PATCH', 'DELETE', 'POST'];
        $entityTypePrefix = 'api/places/';
        $entityTypePrefixP = 'api/products/';

        $todayOperations = $this->auditLogRepository->countTodayOperations($actions, $entityTypePrefix);
        $todayOperationsProducts = $this->auditLogRepository->countTodayOperations($actions, $entityTypePrefixP);

        return $this->render('admin/pages/dashboard.html.twig', [
            'totalProduct' => $totalProduct,
            'totalBusinesses' => $totalBusinesses,
            'todayOperations' => $todayOperations,
            'todayOperationsProducts' => $todayOperationsProducts,
        ]);
    }
}
