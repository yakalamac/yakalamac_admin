<?php

namespace App\Controller\Logger;

use App\Repository\AuditLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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

    #[Route('/admin/audit-logs', name: 'admin_audit_logs')]
    public function auditLogs(): Response
    {
        return $this->render('admin/pages/system/audit-logs.html.twig');
    }

    #[Route('/admin/audit-logs/data', name: 'admin_audit_logs_data')]
    public function getData(Request $request): JsonResponse
    {
        try {
            $startDate = $request->query->get('start_date');
            $endDate = $request->query->get('end_date');
            $action = $request->query->get('action');

            $start = $request->query->getInt('start', 0);
            $length = $request->query->getInt('length', 15);

            $params = $request->query->all();

            $orderParam = $params['order'] ?? [];
            $orderColumnIndex = 0;
            $orderColumnDir = 'desc';

            if (is_array($orderParam) && isset($orderParam[0])) {
                $orderColumnIndex = intval($orderParam[0]['column'] ?? 0);
                $orderColumnDir = strtolower($orderParam[0]['dir'] ?? 'desc') === 'desc' ? 'desc' : 'asc';
            }

            $columnsParam = $params['columns'] ?? [];
            $orderColumnName = 'timestamp';

            if (is_array($columnsParam) && isset($columnsParam[$orderColumnIndex]['data'])) {
                $orderColumnName = $columnsParam[$orderColumnIndex]['data'];
            }

            $allowedColumns = ['id', 'entityId', 'entityType', 'action', 'timestamp', 'user_id'];

            if (!in_array($orderColumnName, $allowedColumns)) {
                $orderColumnName = 'timestamp';
            }

            $data = $this->auditLogRepository->getAuditLogs(
                $start,
                $length,
                $startDate,
                $endDate,
                $action,
                $orderColumnName,
                $orderColumnDir
            );

            $recordsTotal = $this->auditLogRepository->countAllLogs();
            $recordsFiltered = $this->auditLogRepository->countFilteredLogs(
                $startDate,
                $endDate,
                $action
            );

            return new JsonResponse([
                'draw' => $request->query->getInt('draw'),
                'recordsTotal' => $recordsTotal,
                'recordsFiltered' => $recordsFiltered,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'type' => 'https://tools.ietf.org/html/rfc2616#section-10',
                'title' => 'An error occurred 542',
                'status' => 500,
                'detail' => 'Internal Server Error',
            ], 500);
        }
    }
}
