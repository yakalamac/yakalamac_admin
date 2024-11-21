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
        $today = new \DateTime('today', new \DateTimeZone('UTC'));
        $tomorrow = new \DateTime('tomorrow', new \DateTimeZone('UTC'));
    
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
    
//    /**
//     * @return AuditLog[] Returns an array of AuditLog objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AuditLog
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
