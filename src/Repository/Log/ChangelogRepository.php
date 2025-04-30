<?php

namespace App\Repository\Log;

use App\Entity\Log\Changelog;
use DateInterval;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Changelog>
 */
class ChangelogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Changelog::class);
    }

    /**
     * Kullanıcının görmediği güncelleme notlarını getirir
     *
     * @param array $seenChangelogIds
     * @return Changelog[]
     */
    public function findUnseenChangelogs(array $seenChangelogIds): array
    {
        $thirtyDaysAgo = new DateTime();
        $thirtyDaysAgo->sub(new DateInterval('P30D'));

        $qb = $this->createQueryBuilder('c')
            ->where('c.createdAt >= :thirtyDaysAgo')
            ->setParameter('thirtyDaysAgo', $thirtyDaysAgo)
            ->orderBy('c.createdAt', 'DESC');

        if (!empty($seenChangelogIds)) {
            $qb->andWhere('c.id NOT IN (:seenIds)')
               ->setParameter('seenIds', $seenChangelogIds);
        }

        return $qb->getQuery()->getResult();
    }

//    /**
//     * @return Changelog[] Returns an array of Changelog objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Changelog
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
