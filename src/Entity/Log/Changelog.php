<?php
/**
 * @author Kıvanç Hançerli
 * @version 1.0.0
 */

namespace App\Entity\Log;

use App\Entity\Abstract\AbstractEntity;
use App\Repository\Log\ChangelogRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChangelogRepository::class)]
class Changelog extends AbstractEntity
{
    /**
     * @var string|null
     */
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    /**
     * @var DateTimeInterface|null
     */
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?DateTimeInterface $createdAt = null;

    /**
     * @var bool
     */
    #[ORM\Column(type: 'boolean')]
    private bool $important = false;

    /**
     * @param int $id
     * @return $this
     */
    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string|null $title
     * @return $this
     */
    public function setTitle(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getContent(): ?string
    {
        return $this->content;
    }

    /**
     * @param string|null $content
     * @return $this
     */
    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }

    /**
     * @return DateTimeInterface|null
     */
    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @param DateTimeInterface $createdAt
     * @return $this
     */
    public function setCreatedAt(DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return bool
     */
    public function isImportant(): bool
    {
        return $this->important;
    }

    /**
     * @param bool $important
     * @return $this
     */
    public function setImportant(bool $important): static
    {
        $this->important = $important;

        return $this;
    }
}