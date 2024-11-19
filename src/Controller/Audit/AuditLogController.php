<?php

namespace App\Controller\Audit;

use App\Repository\AuditLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AuditLogController extends AbstractController
{
    private AuditLogRepository $auditLogRepository;

    public function __construct(AuditLogRepository $auditLogRepository)
    {
        $this->auditLogRepository = $auditLogRepository;
    }

    #[Route('/audit/audit-logs/latest', name: 'latest_audit_logs', methods: ['GET'])]
    public function latestLogs(): JsonResponse
    {
        $logs = $this->auditLogRepository->findLatestLogs();

        return new JsonResponse($logs);
    }
}
