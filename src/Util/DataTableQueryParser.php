<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Util;

use Symfony\Component\HttpFoundation\Request;

class DataTableQueryParser
{
    private ?array $bag = [];

    public function __construct(Request $request) {

        if($request->isMethod('POST')) {
            $contentType = $request->headers->get('Content-Type');

            if($contentType === 'application/json') {
                $this->bag = $request->toArray();
            } else {
                parse_str($request->getContent(), $this->bag);
            }

            return;
        }

        if($request->isMethod('GET')) {
            $queryString = $request->getQueryString();

            if($queryString) {
                parse_str($queryString, $this->bag);
            }
        }
    }

    public function draw(): bool|null
    {
        return $this->bag['draw'] ?? null;
    }

    public function start(): ?int
    {
        return $this->bag['start'] ?? null;
    }

    public function length(): ?int
    {
        return $this->bag['length'] ?? null;
    }

    public function search(): array|null
    {
        return $this->bag['search'] ?? null;
    }

    public function order(): array|null
    {
        return $this->bag['order'] ?? null;
    }

    public function _processId(): ?int
    {
        return $this->bag['_'] ?? null;
    }

    public function all(): array|null
    {
        return $this->bag;
    }
}