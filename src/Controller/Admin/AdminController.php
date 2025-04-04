<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin;

use App\Client\ElasticaClient;
use App\Repository\AuditLogRepository;
use App\Repository\ChangelogRepository;
use stdClass;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

class AdminController extends AbstractController
{
    /**
     * @param ElasticaClient $client
     * @param ChangelogRepository $changelogRepository
     * @param AuditLogRepository $auditLogRepository
     */
    public function __construct(
        private readonly ElasticaClient $client,
        private readonly ChangelogRepository $changelogRepository,
        private readonly AuditLogRepository $auditLogRepository
    ) {}

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
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/admin', name: 'admin_dashboard')]
    public function index(Request $request): Response
    {
        try {
            $response = $this->searchIndex('place');
            $totalBusinesses = $response['hits']['total']['value'] ?? 0;

            $responseProduct = $this->searchIndex('product');
            $totalProduct = $responseProduct['hits']['total']['value'] ?? 0;
        } catch (Throwable $exception) {
            error_log($exception->getMessage());
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
     * @return array
     * @throws Throwable
     */
    private function searchIndex(string $index): array
    {
        return $this->client->search($index, ['track_total_hits' => true, 'size' => 0,
            'query' => ['match_all' => new stdClass()]
        ])->toArray(false);
    }
}