<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class UserProviderService
{
    private string $baseUri;

    public function __construct(private readonly HttpClientInterface $client)
    {
        $this->baseUri = $_ENV['API_URL'];
    }

    /**
     * @param string $url
     * @param string $token
     * @param int $page
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getUsers(string $url, string $token, int $page = 1): JsonResponse
    {
        $response = $this->client->request('GET', $url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/ld+json',
            ],
            'query' => [
                'page' => $page,
            ],
            'base_uri' => $this->baseUri.'/api/user/'
        ]);

        $statusCode = $response->getStatusCode();

        return new JsonResponse(
            [
                'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
                'status_code' => $statusCode,
                'data' => $response->toArray(false),
                'message' => $statusCode > 199 && $statusCode < 300
                    ? 'Users provided success' : 'An error occurred while providing users'
            ],
            $statusCode > 99 ? $statusCode : 500
        );
    }

    public function addUser(array $credentials, string $token, ?string $uri = null): JsonResponse
    {
        $response = $this->client->request('POST', $uri ?? '/api/users', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/ld+json',
            ],
            'base_uri' => $this->baseUri,
            'json' => $credentials
        ]);

        $statusCode = $response->getStatusCode();

        return new JsonResponse(
            [
                'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
                'status_code' => $statusCode,
                'data' => $response->toArray(false),
                'message' => $statusCode > 199 && $statusCode < 300
                    ? 'Users provided success' : 'An error occurred while providing users'
            ],
            $statusCode > 99 ? $statusCode : 500
        );
    }

    /**
     * @param string $baseUri
     * @return $this
     */
    public function setBaseUri(string $baseUri): self
    {
        $this->baseUri = $baseUri;

        return $this;
    }
}