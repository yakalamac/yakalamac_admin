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
use App\Entity\Changelog;
use App\Form\ChangelogType;
use App\Repository\ChangelogRepository;
use Doctrine\ORM\EntityManagerInterface;

class AdminController extends AbstractController
{


    private HttpClientInterface $httpClient;
    private $service;
    private $userService;
    private ApiController $apiController;
    private $clientFactory;
    private $auditLogRepository;
    private $elasticUrl;
    private ChangelogRepository $changelogRepository;
    /**
     *
     * @param HttpClientInterface $httpClient
     * @param UserService $userService
     * @param ApiController $apiController
     * @param PlaceService $service
     */
    public function __construct(HttpClientInterface $httpClient, UserService $userService, ApiController $apiController, PlaceService $service, ClientFactory $clientFactory, ChangelogRepository $changelogRepository,AuditLogRepository $auditLogRepository, string $elasticUrl)
    {
        $this->httpClient = $httpClient;
        $this->userService = $userService;
        $this->service = $service;
        $this->apiController = $apiController;
        $this->clientFactory = $clientFactory;
        $this->auditLogRepository = $auditLogRepository;
        $this->elasticUrl = $elasticUrl;
        $this->changelogRepository = $changelogRepository;
    }

    #[Route('/login', name: 'login_page')]
    public function login(Request $request): Response
    {
        return $this->render('public/login.html.twig');
    }

    #[Route('/admin', name: 'admin_dashboard')]
    public function index(Request $request): Response
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
        $seenChangelogIds = $request->cookies->get('seen_changelogs', '');
        $seenChangelogIds = $seenChangelogIds ? explode(',', $seenChangelogIds) : [];

        $unseenChangelogs = $this->changelogRepository->findUnseenChangelogs($seenChangelogIds);
        return $this->render('admin/pages/dashboard.html.twig', [
            'totalProduct' => $totalProduct,
            'totalBusinesses' => $totalBusinesses,
            'todayOperations' => $todayOperations,
            'todayOperationsProducts' => $todayOperationsProducts,
            'unseenChangelogs' => $unseenChangelogs,
        ]);
    }

    #[Route('/admin/changelogs', name: 'admin_changelog_index')]
    public function changelogs(Request $request, EntityManagerInterface $em, ChangelogRepository $changelogRepository): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $changelog = new Changelog();
        $form = $this->createForm(ChangelogType::class, $changelog);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $changelog->setCreatedAt(new \DateTime());

            $em->persist($changelog);
            $em->flush();

            $this->addFlash('success', 'Güncelleme notu başarıyla eklendi.');

            return $this->redirectToRoute('admin_changelog_index');
        }

        $changelogs = $changelogRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->render('admin/pages/system/change-logs.html.twig', [
            'form' => $form->createView(),
            'changelogs' => $changelogs,
        ]);
    }
    #[Route('/admin/changelogs/{id}/delete', name: 'admin_changelog_delete', methods: ['POST'])]
    public function deleteChangelog(Request $request, Changelog $changelog, EntityManagerInterface $em): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($this->isCsrfTokenValid('delete-changelog' . $changelog->getId(), $request->request->get('_token'))) {
            $em->remove($changelog);
            $em->flush();

            $this->addFlash('success', 'Güncelleme notu başarıyla silindi.');
        } else {
            $this->addFlash('error', 'Güncelleme notu silinirken bir hata oluştu.');
        }

        return $this->redirectToRoute('admin_changelog_index');
    }
}
