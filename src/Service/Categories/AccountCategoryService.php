<?php

namespace App\Service\Categories;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AccountCategoryService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getAccountCategory()
    {
        $response = $this->httpClient->request('GET', "https://es.yaka.la/account_category/_search?", [
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ]);

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

    public function createAccountCategory(string $title, string $description, string $icon)
    {
        $data = [
            'title' => $title,
            'description' => $description,
            'icon' => $icon
        ];

        $response = $this->httpClient->request(
            'POST',
            "https://api.yaka.la/api/category/accounts",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'json' => $data
            ]
        );

        if ($response->getContent() > 199 && $response->getStatusCode() < 300) {
            return new JsonResponse(
                $response->getContent(),
                $response->getStatusCode()
            );
        }

        return new JsonResponse(
            [
                'message' => 'failed',
                'status' => $response->getStatusCode(),
                'data' => $response->getContent()
            ],
            status: $response->getContent()
        );
    }

    public function updateAccountCategory(int $id, string $title, string $description, string $icon)
    {
        $data = [
            'title' => $title,
            'description' => $description,
            'icon' => $icon
        ];

        $response = $this->httpClient->request(
            'PATCH',
            "https://api.yaka.la/api/category/accounts/$id",
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
                'message' => 'Update failed',
                'status' => $response->getStatusCode(),
                'data' => $response->toArray(false)
            ],
            status: $response->getStatusCode()
        );
    }

    public function deleteAccountCategory(int $id): JsonResponse
    {
        $response = $this->httpClient->request(
            'DELETE',
            "https://api.yaka.la/api/category/accounts/$id",
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]
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
