<?php
/**
 * @author Kıvanç Hançerli
 * @version 1.0.0
 */

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
    private ?int $id = NULL;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $userId;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $entityId;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private string $action;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private string $entityType;

    #[ORM\Column(type: 'json', nullable: true)]
    private array $additionalData;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $timestamp;

    /**
     * @param string $userId
     * @param string|null $entityId
     * @param string $action
     * @param string $entityType
     * @param array $additionalData
     */
    public function __construct(string $userId, ?string $entityId, string $action, string $entityType, array $additionalData = [])
    {
        $this->userId = $userId;
        $this->entityId = $entityId;
        $this->action = $action;
        $this->entityType = $entityType;
        $this->additionalData = $additionalData;
        $this->timestamp = new \DateTime();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getUserId(): ?string
    {
        return $this->userId;
    }

    /**
     * @param string|null $userId
     * @return $this
     */
    public function setUserId(?string $userId): self
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEntityId(): ?string
    {
        return $this->entityId;
    }

    /**
     * @param string|null $entityId
     * @return $this
     */
    public function setEntityId(?string $entityId): self
    {
        $this->entityId = $entityId;

        return $this;
    }

    /**
     * @return string
     */
    public function getAction(): string
    {
        return $this->action;
    }

    /**
     * @param string $action
     * @return $this
     */
    public function setAction(string $action): self
    {
        $this->action = $action;

        return $this;
    }

    /**
     * @return string
     */
    public function getEntityType(): string
    {
        return $this->entityType;
    }

    /**
     * @param string $entityType
     * @return $this
     */
    public function setEntityType(string $entityType): self
    {
        $this->entityType = $entityType;

        return $this;
    }

    /**
     * @return array
     */
    public function getAdditionalData(): array
    {
        return $this->additionalData;
    }

    /**
     * @param array|null $additionalData
     * @return $this
     */
    public function setAdditionalData(?array $additionalData): self
    {
        $this->additionalData = $additionalData ?? [];

        return $this;
    }

    /**
     * @return \DateTimeInterface
     */
    public function getTimestamp(): \DateTimeInterface
    {
        return $this->timestamp;
    }

    /**
     * @param \DateTimeInterface $timestamp
     * @return $this
     */
    public function setTimestamp(\DateTimeInterface $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }
}