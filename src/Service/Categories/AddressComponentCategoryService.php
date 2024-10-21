<?php

namespace App\Service\Categories;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AddressComponentCategoryService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getAddressComponentCategory(): JsonResponse
    {
        $response = $this->httpClient->request(
            'GET',
            "https://es.yaka.la/address_component_category/_search?",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]
        );

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
    public function createAddressComponentCategory(int $id, string $title, string $description)
    {
        $data = [
            'title' => $title,
            'description' => $description
        ];


        $response = $this->httpClient->request(
            'POST',
            "http://api.yaka.la/api/category/address/components",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'json' => $data
            ]
        );

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $response->toArray(false),
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'Failed to set category',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }

    public function updateAddressComponentCategory(int $id, string $title, string $description)
    {
        $data = [
            'title' => $title,
            'description' => $description
        ];

        $response = $this->httpClient->request(
            'PATCH',
            "https://api.yaka.la/api/category/address/components/$id",
            [
                'headers' => [
                    'Content-Type' => 'application/merge-patch+json'
                ],
                'json' => $data
            ]
        );

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $response->toArray(false),
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'Failed to set category',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }
    public function deleteAddressComponentCategory(int $id)
    {
        $response = $this->httpClient->request(
            'DELETE', 
            "https://api.yaka.la/api/category/address/components/$id"
        );

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                [
                    'message' => 'Document deleted successfully',
                    'status' => $response->getStatusCode(),
                ],
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'Failed to set category',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }
}
