<?php

namespace App\Service\Categories;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PlaceCousineCategoryService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getPlaceCousineCategory(): JsonResponse
    {
        $response = $this->httpClient->request(
            'GET',
            "https://es.yaka.la/place_cuisine_category/_search?",
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

    public function createPlaceCousineCategory(string $title, string $description): JsonResponse
    {
        $data = [
            'title' => $title,
            'description' => $description
        ];


        $response = $this->httpClient->request(
            'POST',
            "https://api.yaka.la/api/category/place/cuisines",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'json' => $data
            ]
        );

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse($response->toArray(false), $response->getStatusCode());
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

    public function updatePlaceCousineCategory(int $id, string $title, string $description)
    {
        $data = [
            'title' => $title,
            'description' => $description
        ];

        $response = $this->httpClient->request(
            'PATCH',
            "https://api.yaka.la/api/category/place/cuisines/$id",
            [
                'headers' => [
                    'Content-Type' => 'application/merge-patch+json'
                ],
                'json' => $data
            ]
        );

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse($response->toArray(false), $response->getStatusCode());
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

    public function deletePlaceCuisineCategory(int $id)
    {
        $response = $this->httpClient->request('DELETE', "https://api.yaka.la/api/category/place/cuisines/$id");

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                [
                    'message' => 'Document deleted successfully',
                    'status' => $response->getStatusCode(),
                ],
                $response->getStatusCode()
            );
        }

        if ($response->getStatusCode() === 204) {
            return new JsonResponse(
                $response->toArray(),
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
