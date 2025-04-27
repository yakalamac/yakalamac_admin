<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Utils;

readonly class DatatableContent
{
    public function __construct(private array $content) {}

    public function getDraw(): int
    {
        return  $this->content['draw'] ?? 0;
    }

    public function getStart(): int
    {
        return $this->content['start'] ?? 0;
    }

    public function getLength(): int
    {
        return $this->content['length'] ?? 30;
    }

    public function getSearch(): ?string
    {
        return !empty($this->content['search']['value'])
            ? $this->content['search']['value'] : NULL;
    }

    public function order(): array
    {
        return $this->content['order'] ?? [];
    }

    public static function isDatatableContent(array $content): bool
    {
        return isset($content['draw']) || isset($content['start']) || isset($content['length']);
    }
}