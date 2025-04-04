<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin;

use App\Client\YakalaApiClient;
use App\Manager\Elastica\ElasticaSearchManager;
use App\Repository\AuditLogRepository;
use App\Repository\ChangelogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class AdminController extends AbstractController
{
    private AuditLogRepository $auditLogRepository;
    private ChangelogRepository $changelogRepository;

    /**
     * @param ElasticaSearchManager $searchManager
     * @param ChangelogRepository $changelogRepository
     * @param AuditLogRepository $auditLogRepository
     */
    public function __construct(
        private ElasticaSearchManager $searchManager,
        ChangelogRepository $changelogRepository,
        AuditLogRepository $auditLogRepository
    ){
        $this->auditLogRepository = $auditLogRepository;
        $this->changelogRepository = $changelogRepository;
    }

    /**
     * @return Response
     */
    #[Route('/login', name: 'login_page')]
    public function login(): Response
    {
        return $this->render('public/login.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/admin/profile', name: 'admin_profile')]
    public function profile(): Response
    {
        return $this->render('admin/pages/profile.html.twig');
    }

    /**
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     */
    #[Route('/admin', name: 'admin_dashboard')]
    public function index(Request $request): Response
    {
        try {


            $response = $this->searchIndex('place')->getContent();
            $responseData = $response->toArray(false);
            $totalBusinesses = $responseData['hits']['total']['value'] ?? 0;

            $responseProduct = $this->client->request($this->elasticUrl . "product" . '/_search', 'GET', $query);
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

    /**
     * @param string $index
     * @return Response
     * @throws \Throwable
     */
    private function searchIndex(string $index): Response
    {
        return $this->searchManager->manage($index, [
            'track_total_hits' => true,
            'size' => 0,
            'query' => [
                'match_all' => new \stdClass()
            ]
        ]);
    }

}