<?php

namespace App\Service;

use App\Http\ClientFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class DataTablesElasticsearchService
{
    private ClientFactory $clientFactory;

    public function __construct(ClientFactory $clientFactory)
    {
        $this->clientFactory = $clientFactory;
    }

    /**
     *
     * @param Request $request
     * @param string $index
     * @param array $fieldMappings
     * @param array $searchFields
     * @return JsonResponse
     */
    public function handleRequest(Request $request, string $index, array $fieldMappings, array $searchFields): JsonResponse
    {
        $params = $request->isMethod('POST') ? $request->request->all() : $request->query->all();

        $draw = intval($params['draw'] ?? 1);
        $start = intval($params['start'] ?? 0);
        $length = intval($params['length'] ?? 15);

        $search = $params['search'] ?? [];
        $searchValue = $search['value'] ?? '';

        $query = [
            'from' => $start,
            'size' => $length,
            'track_total_hits' => true,
        ];

        if (!empty($searchValue)) {
            $query['query'] = [
                'multi_match' => [
                    'query' => $searchValue,
                    'fields' => $searchFields,
                    'type' => 'phrase_prefix',
                ],
            ];
        } else {
            $query['query'] = ['match_all' => new \stdClass()];
        }

        try {
            $response = $this->clientFactory->request(
                $index . '/_search',
                'POST',
                $query
            );

            if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
                $responseData = $response->toArray(false);
                $hits = $responseData['hits']['hits'] ?? [];
                $recordsFiltered = $responseData['hits']['total']['value'] ?? 0;

                $data = array_map(function ($hit) use ($fieldMappings) {
                    $source = $hit['_source'];
                    $row = [];
                    foreach ($fieldMappings as $key => $field) {
                        $row[$key] = $source[$field] ?? '';
                    }
                    return $row;
                }, $hits);

                $totalQuery = [
                    'track_total_hits' => true,
                    'size' => 0,
                    'query' => ['match_all' => new \stdClass()],
                ];

                $totalResponse = $this->clientFactory->request(
                    $index . '/_search',
                    'POST',
                    $totalQuery
                );
                $totalData = $totalResponse->toArray(false);
                $recordsTotal = $totalData['hits']['total']['value'] ?? 0;

                return new JsonResponse([
                    'draw' => $draw,
                    'recordsTotal' => $recordsTotal,
                    'recordsFiltered' => $recordsFiltered,
                    'data' => $data,
                ], JsonResponse::HTTP_OK);
            } else {
                $errorContent = $response->getContent(false);
                return new JsonResponse([
                    'message' => 'Error fetching data from Elasticsearch 1',
                    'code' => $response->getStatusCode(),
                    'error' => json_decode($errorContent, true),
                ], $response->getStatusCode());
            }
        } catch (TransportExceptionInterface $e) {
            return new JsonResponse([
                'message' => 'Error communicating with Elasticsearch 2',
                'error' => $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function handleRequest2(Request $request, string $index, array $fieldMappings, array $searchFields): array
    {
        $params = $request->isMethod('POST') ? $request->request->all() : $request->query->all();

        $draw = intval($params['draw'] ?? 1);
        $start = intval($params['start'] ?? 0);
        $length = intval($params['length'] ?? 15);

        $search = $params['search'] ?? [];
        $searchValue = $search['value'] ?? '';

        $query = [
            'from' => $start,
            'size' => $length,
            'track_total_hits' => true,
        ];

        if (!empty($searchValue) && mb_strlen($searchValue) >= 2) {
            $query['query'] = [
                'multi_match' => [
                    'query' => $searchValue,
                    'fields' => $searchFields,
                    'type' => 'phrase_prefix',
                ],
            ];
        } else {
            $query['query'] = ['match_all' => new \stdClass()];
        }

        try {
            $response = $this->clientFactory->request(
                $index . '/_search',
                'POST',
                $query
            );

            $responseData = $response->toArray(false);
            $hits = $responseData['hits']['hits'] ?? [];
            $recordsFiltered = $responseData['hits']['total']['value'] ?? 0;

            $data = array_map(function ($hit) use ($fieldMappings) {
                $source = $hit['_source'];
                $row = [];
                foreach ($fieldMappings as $key => $field) {
                    $row[$key] = $source[$field] ?? '';
                }
                return $row;
            }, $hits);

            $totalQuery = [
                'track_total_hits' => true,
                'size' => 0,
                'query' => ['match_all' => new \stdClass()],
            ];

            $totalResponse = $this->clientFactory->request(
                $index . '/_search',
                'POST',
                $totalQuery
            );
            $totalData = $totalResponse->toArray(false);
            $recordsTotal = $totalData['hits']['total']['value'] ?? 0;

            return [
                'draw' => $draw,
                'recordsTotal' => $recordsTotal,
                'recordsFiltered' => $recordsFiltered,
                'data' => $data,
            ];
        } catch (\Exception $e) {
            return [
                'draw' => $draw,
                'recordsTotal' => 0,
                'recordsFiltered' => 0,
                'data' => [],
                'error' => $e->getMessage(),
            ];
        }
    }
}
