<?php

namespace App;

use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @deprecated
 */
class Deprecated
{
    public function getPlaces(int $page, int $pagination = 15): JsonResponse
    {
        $from = ($page - 1) * $pagination;

        $response = $this->httpClient->request(
            'GET',
            $_ENV['ELASTIC_URL']. "/place/_search?size=$pagination&from=$from",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]
        );

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $response->toArray(false),
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'failed',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }

    public function searchPlaceWithName(string $s, int $page = 1, int $pagination = 15)
    {

        $query = [
            "query" => [
                "bool" => [
                    "should" => [
                        [
                            "wildcard" => [
                                "name" => "*$s*"
                            ]
                        ],
                        [
                            "fuzzy" => [
                                "name" => [
                                    "value" => $s,
                                    "fuzziness" => "AUTO"
                                ]
                            ]
                        ],
                        [
                            "term" => [
                                "is_active" => true
                            ]
                        ]
                    ]
                ]
            ],
            "size" => $pagination,
            "from" => ($page - 1) * $pagination
        ];

        $response = $this->httpClient->request(
            'POST',
            $_ENV['ELASTIC_URL'].'/place/_search',
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'body' => json_encode($query)
            ]
        );

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            $data = $response->toArray(false);

            $names =  $data['hits']['hits'];

            return new JsonResponse(
                $names,
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'failed',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }

    public function searchPlaceWithAddress(string $s)
    {
        $query =  [
            "query" => [
                "bool" => [
                    "should" => [
                        [
                            "nested" => [
                                "path" => "address",
                                "query" => [
                                    "wildcard" => [
                                        "address.shortAddress" => "*$s*"
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->httpClient->request(
            'POST',
            $_ENV['ELASTIC_URL'].'/place/_search',
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'body' => json_encode(value: $query)
            ]
        );

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            $data = $response->toArray(false);

            $shortAddresses = [];

            return new JsonResponse(
                $data,
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'failed',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }
}