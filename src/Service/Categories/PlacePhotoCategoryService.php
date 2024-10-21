<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PlacePhotoCategoryService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getProductCategory(): JsonResponse
    {
        $response = $this->httpClient->request('GET', "https://es.yaka.la/place_photo_category/_search?", [
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
}
