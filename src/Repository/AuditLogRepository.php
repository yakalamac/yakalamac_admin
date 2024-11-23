<?php

namespace App\Repository;

use App\Entity\AuditLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AuditLog>
 */
class AuditLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AuditLog::class);
    }

    public function findLatestLogs(int $limit = 100): array
    {
        return $this->createQueryBuilder('log')
            ->orderBy('log.timestamp', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getArrayResult();
    }
    public function countTodayOperations(array $actions, string $entityTypePrefix): int
    {
        $today = new \DateTime('today', new \DateTimeZone('Europe/Istanbul'));
        $tomorrow = new \DateTime('tomorrow', new \DateTimeZone('Europe/Istanbul'));
    
        $qb = $this->createQueryBuilder('log')
            ->select('COUNT(log.id)')
            ->where('log.timestamp >= :today')
            ->andWhere('log.timestamp < :tomorrow')
            ->andWhere('log.action IN (:actions)')
            ->andWhere('log.entityType LIKE :entityTypePrefix')
            ->setParameter('today', $today)
            ->setParameter('tomorrow', $tomorrow)
            ->setParameter('actions', $actions)
            ->setParameter('entityTypePrefix', $entityTypePrefix . '%');
    
        return (int) $qb->getQuery()->getSingleScalarResult();
    }

      /**
     * Belirli filtrelere göre audit loglarını getirir.
     *
     * @param int $start
     * @param int $length
     * @param string|null $startDate
     * @param string|null $endDate
     * @param string|null $action
     * @param string $orderColumn
     * @param string $orderDir
     *
     * @return array
     */
    public function getAuditLogs(
        int $start,
        int $length,
        ?string $startDate,
        ?string $endDate,
        ?string $action,
        string $orderColumn = 'timestamp',
        string $orderDir = 'desc'
    ): array {
        $qb = $this->createQueryBuilder('log');

        if ($startDate) {
            $qb->andWhere('log.timestamp >= :startDate')
               ->setParameter('startDate', new \DateTime($startDate, new \DateTimeZone('UTC')));
        }
    
        if ($endDate) {
            $endDateTime = new \DateTime($endDate, new \DateTimeZone('Europe/Istanbul'));
            $endDateTime->setTime(23, 59, 59);
            $qb->andWhere('log.timestamp <= :endDate')
               ->setParameter('endDate', $endDateTime);
        }
        if ($action) {
            $qb->andWhere('log.action = :action')
               ->setParameter('action', $action);
        }
        $qb->orderBy('log.' . $orderColumn, $orderDir);

        $qb->setFirstResult($start)
           ->setMaxResults($length);

        $results = $qb->getQuery()->getArrayResult();

        foreach ($results as &$result) {
            if (isset($result['additionalData']) && is_array($result['additionalData'])) {
                $result['additionalData'] = json_encode($result['additionalData'], JSON_UNESCAPED_UNICODE);
            }

            if (isset($result['timestamp']) && $result['timestamp'] instanceof \DateTimeInterface) {
                $result['timestamp'] = $result['timestamp']->format('Y-m-d H:i:s');
            }
        }

        return $results;
    }

    /**
     * Belirli filtrelere göre filtrelenmiş audit log sayısını döndürür.
     *
     * @param string|null $startDate
     * @param string|null $endDate
     * @param string|null $action
     *
     * @return int
     */
    public function countFilteredLogs(
        ?string $startDate,
        ?string $endDate,
        ?string $action
    ): int {
        $qb = $this->createQueryBuilder('log')
                   ->select('COUNT(log.id)');

        if (!$startDate && !$endDate) {
            $qb->andWhere('log.timestamp >= :lastWeek')
               ->setParameter('lastWeek', new \DateTime('-7 days'));
        } else {
            if ($startDate) {
                $qb->andWhere('log.timestamp >= :startDate')
                   ->setParameter('startDate', new \DateTime($startDate));
            }

            if ($endDate) {
                $qb->andWhere('log.timestamp <= :endDate')
                   ->setParameter('endDate', new \DateTime($endDate));
            }
        }

        if ($action) {
            $qb->andWhere('log.action = :action') ->setParameter('action', $action);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Toplam audit log sayısını döndürür.
     *
     * @return int
     */
    public function countAllLogs(): int
    {
        $qb = $this->createQueryBuilder('log') ->select('COUNT(log.id)');
        return (int) $qb->getQuery()->getSingleScalarResult();
    }
}
