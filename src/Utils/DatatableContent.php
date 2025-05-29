<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Utils;

readonly class DatatableContent
{
    /**
     * @param array $content
     */
    public function __construct(private array $content) {}

    /**
     * @return int
     */
    public function getDraw(): int
    {
        return  $this->content['draw'] ?? 0;
    }

    /**
     * @return int
     */
    public function getStart(): int
    {
        return $this->content['start'] ?? 0;
    }

    /**
     * @return int
     */
    public function getLength(): int
    {
        return $this->content['length'] ?? 30;
    }

    /**
     * @return string|null
     */
    public function getSearch(): ?string
    {
        return !empty($this->content['search']['value'])
            ? $this->content['search']['value'] : NULL;
    }

    /**
     * @return array
     */
    public function order(): array
    {
        return $this->content['order'] ?? [];
    }

    /**
     * @param array $content
     * @return bool
     */
    public static function isDatatableContent(array $content): bool
    {
        return isset($content['draw']) || isset($content['start']) || isset($content['length']);
    }
}