<?php

namespace App\Service\Categories;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SourceCategoryService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getSourceCategory()
    {
        $response = $this->httpClient->request(
            'GET',
            "https://es.yaka.la/source_category/_search?",
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

    public function createSourceCategory(string $title, string $description, string $icon)
    {
        $data = [
            'title' => $title,
            'description' => $description,
            'icon' => $icon
        ];

        $response = $this->httpClient->request(
            'POST',
            "https://api.yaka.la/api/category/sources",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'json' => $data
            ]
        );

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $response->getContent(false),
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

    public function updateSourceCategory(int $id, string $title, string $description, string $icon)
    {
        $data = [
            'title' => $title,
            'description' => $description,
            'icon' => $icon
        ];

        $response = $this->httpClient->request(
            'PATCH',
            "https://api.yaka.la/api/category/sources/$id",
            [
                'headers' => [
                    'Content-Type' => 'application/merge-patch+json'
                ],
                'json' => $data
            ]
        );

        if ($response->getStatusCode() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $response->getContent(false),
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
    public function deleteSourceCategory(int $id)
    {
        $response = $this->httpClient->request(
            'DELETE',
            "https://api.yaka.la/api/category/sources/$id"
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
