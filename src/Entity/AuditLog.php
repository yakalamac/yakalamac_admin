<?php

namespace App\Entity;

use App\Repository\AuditLogRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AuditLogRepository::class)]
#[ORM\Table(name: "audit_logs")]
class AuditLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $userId = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $entityId = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private string $action;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private string $entityType;

    #[ORM\Column(type: 'json', nullable: true)]
    private array $additionalData = [];

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $timestamp;

    public function __construct(string $userId, ?string $entityId, string $action, string $entityType, array $additionalData = [])
    {
        $this->userId = $userId;
        $this->entityId = $entityId;
        $this->action = $action;
        $this->entityType = $entityType;
        $this->additionalData = $additionalData;
        $this->timestamp = new \DateTime();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?string
    {
        return $this->userId;
    }

    public function setUserId(?string $userId): self
    {
        $this->userId = $userId;

        return $this;
    }

    public function getEntityId(): ?string
    {
        return $this->entityId;
    }

    public function setEntityId(?string $entityId): self
    {
        $this->entityId = $entityId;

        return $this;
    }

    public function getAction(): string
    {
        return $this->action;
    }

    public function setAction(string $action): self
    {
        $this->action = $action;

        return $this;
    }

    public function getEntityType(): string
    {
        return $this->entityType;
    }

    public function setEntityType(string $entityType): self
    {
        $this->entityType = $entityType;

        return $this;
    }

    public function getAdditionalData(): array
    {
        return $this->additionalData;
    }

    public function setAdditionalData(?array $additionalData): self
    {
        $this->additionalData = $additionalData ?? [];

        return $this;
    }

    public function getTimestamp(): \DateTimeInterface
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeInterface $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }
}
