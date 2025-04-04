<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use App\Client\Abstract\AbstractClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaClient extends AbstractClient
{
    /**
     * @param string $index
     * @param int $page
     * @param int $size
     * @return Response
     * @throws Throwable
     */
    public function collection(string $index, int $page, int $size = 15): Response
    {
        return $this->toResponse(
            $this->request('GET', "/$index/_search?size=$size&from=$page")
        );
    }

    /**
     * @param string $index
     * @param array $query
     * @return JsonResponse
     * @throws Throwable
     */
    public function search(string $index, array $query): Response
    {
        return $this->toResponse(
            $this->request('POST', "/$index/_search", ['json' => $query])
        );
    }

    /**
     * @param string|int $documentId
     * @param string $index
     * @return JsonResponse
     * @throws Throwable
     */
    public function document(string|int $documentId, string $index): Response
    {
        return $this->toResponse(
            $this->request('GET', "/$index/_doc/$documentId")
        );
    }

    /**
     * @return array
     */
    protected function options(): array
    {
        return ['base_uri' => $_ENV['ELASTIC_URL'], 'headers' => ['Content-Type' => 'application/json']];
    }
}