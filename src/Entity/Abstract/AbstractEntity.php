<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Entity\Abstract;

use Doctrine\ORM\Mapping as ORM;

class AbstractEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    protected ?int $id = NULL;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }
}