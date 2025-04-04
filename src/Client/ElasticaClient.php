<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use App\Client\Abstract\AbstractClient;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

class ElasticaClient extends AbstractClient
{
    /**
     * @param string $index
     * @param int $page
     * @param int $size
     * @return ResponseInterface
     * @throws Throwable
     */
    public function collection(string $index, int $page, int $size = 15): ResponseInterface
    {
        return $this->request('GET', "/$index/_search?size=$size&from=$page");
    }

    /**
     * @param string $index
     * @param array $query
     * @return ResponseInterface
     * @throws Throwable
     */
    public function search(string $index, array $query): ResponseInterface
    {
        return $this->request('POST', "/$index/_search", ['json' => $query]);
    }

    /**
     * @param string|int $documentId
     * @param string $index
     * @return ResponseInterface
     * @throws Throwable
     */
    public function document(string|int $documentId, string $index): ResponseInterface
    {
        return $this->request('GET', "/$index/_doc/$documentId");
    }

    /**
     * @return array
     */
    protected function options(): array
    {
        return ['base_uri' => $_ENV['ELASTIC_URL'], 'headers' => ['Content-Type' => 'application/json']];
    }
}