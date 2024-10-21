<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class PlaceCousineCategoryService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getPlaceCousineCategory(): JsonResponse
    {
        $response = $this->httpClient->request('GET', "https://es.yaka.la/place_cuisine_category/_search?", [
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

    public function setCousineCategory(int $id, string $title, string $description): JsonResponse
    {
        $response = $this->httpClient->request('POST', "http://es.yaka.la/place_category/_doc/$id", [
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'id' => $id,
                'title' => $title,
                'description' => $description
            ]
        ]);

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
}
