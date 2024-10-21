<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PlaceService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }
    public function getPlaces(int $page, int $pagination = 15): JsonResponse
    {
        $from = ($page - 1) * $pagination;

        $response = $this->httpClient->request('GET', "https://es.yaka.la/place/_search?size=$pagination&from=$from", [
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ]);

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse($response->toArray(false), $response->getStatusCode());
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

    public function searchPlaceWithName(string $s)
    {
        
        $query =  [
            "query" => [
                "bool" => [
                    "should" => [
                        [
                            "wildcard" => [
                                "name" => "*$s*"
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->httpClient->request('POST', 'https://es.yaka.la/place/_search', [
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($query)
        ]);

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            $data = $response->toArray(false);

            // "hits" içerisinden "name" alanlarını al  
            $names =  $data['hits']['hits'];

            return new JsonResponse($names, $response->getStatusCode());
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

        $response = $this->httpClient->request('POST', 'https://es.yaka.la/place/_search', [
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode(value: $query)
        ]);

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            $data = $response->toArray(false);

            $shortAddresses = [];

            return new JsonResponse($data, $response->getStatusCode());
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

    public function deletePlaceCategory(int $id): JsonResponse
    {
        $response = $this->httpClient->request('DELETE', "http://es.yaka.la/place_category/_doc/$id", [
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ]);

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                [
                    'message' => 'Document deleted successfully',
                    'status' => $response->getStatusCode(),
                    'data' => $response->toArray(false)
                ],
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'Delete failed',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }
}
