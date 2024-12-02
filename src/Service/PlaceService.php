<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
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

    /**
     * @param string $id
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getPlace(string $id): JsonResponse
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']. "/api/places/$id");

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
    public function getOpeningHours(string $id)
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']. "/api/places/$id");

        $data = json_decode(
            $response->getContent(), 
            true
        );
        
        $openingHours = $data['openingHours'] ?? [];

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $openingHours,
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

    public function getSources(string $id)
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']."/api/places/$id");

        $data = json_decode(
            $response->getContent(), 
            true
        );
        
        $sources = $data['sources'] ?? [];

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $sources,
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

    public function getAccounts(string $id)
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']."/api/places/$id");

        $data = json_decode(
            $response->getContent(), 
            true
        );
        
        $accounts = $data['accounts'] ?? [];
        
        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $accounts,
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

    
    public function getContactCategories()
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']."/api/category/contacts");

        $data = json_decode(
            $response->getContent(), 
            true
        );
        
        $accounts = $data['hydra:member'] ?? [];
        
        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $accounts,
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

    public function getAccountCategories()
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']."/api/category/accounts");

        $data = json_decode(
            $response->getContent(), 
            true
        );
        
        $accounts = $data['hydra:member'] ?? [];
        
        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $accounts,
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

    public function getSourceCategories()
    {
        $response = $this->httpClient->request('GET', $_ENV['API_URL']."/api/category/sources");

        $data = json_decode(
            $response->getContent(), 
            true
        );
        
        $accounts = $data['hydra:member'] ?? [];
        
        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $accounts,
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
