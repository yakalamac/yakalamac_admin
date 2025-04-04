<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Service\Audit;

use App\Entity\AuditLog;
use Doctrine\ORM\EntityManagerInterface;

class AuditLogService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

   /**
     * @param string $userId
     * @param string|null $entityId
     * @param string $action
     * @param string $entityType
     * @param array $additionalData
     */
    public function log(string $userId, ?string $entityId, string $action, string $entityType, array $additionalData = []): void
    {
        $auditLog = new AuditLog($userId, $entityId, $action, $entityType, $additionalData);
        $this->entityManager->persist($auditLog);
        $this->entityManager->flush();
    }
}
