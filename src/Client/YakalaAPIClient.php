<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Contracts\HttpClient\ResponseInterface;

class YakalaAPIClient
{
    public function __construct(private HttpClientInterface $httpClient, private HttpOptions $httpOptions)
    {
        if (!$this->httpClient)
            $this->httpClient = HttpClient::create();
        if (!$this->httpOptions)
            $this->httpOptions = new HttpOptions();
        $this->httpOptions
            ->setBaseUri('https://api.yaka.la/api')
            ->setHeaders(
                [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                ]
            );
    }

    /**
     * @param int $statusCode
     * @return string
     */
    private function messageFromStatusCode(int $statusCode): string
    {
        return match (true) {
            $statusCode === 100 => 'Continue',
            $statusCode > 100 && $statusCode < 200 => 'Informational',
            $statusCode === 204 => 'No Content',
            $statusCode > 200 && $statusCode < 300 => 'Success',
            $statusCode > 300 && $statusCode < 400 => 'Redirection',
            $statusCode > 400 && $statusCode < 500 => 'Client Error',
            $statusCode > 500 && $statusCode < 600 => 'Server Error',
            default => 'Unknown'
        };
    }

    /**
     * @param ResponseInterface $response
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function handleRequest(ResponseInterface $response): JsonResponse
    {
        $statusCode = $response->getStatusCode();

        return new JsonResponse(
            [
                'status' => $statusCode,
                'message' => $this->messageFromStatusCode($statusCode),
                'data' => $response->toArray(false)
            ],
            $statusCode
        );
    }

    /**
     * @param int|string|null $id
     * @param string $endpoint
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function get(int|string|null $id, string $endpoint): JsonResponse
    {
        if ($id)
            $endpoint .= '/' . $id;

        return $this->handleRequest(
            $this->httpClient
                ->withOptions($this->httpOptions->toArray())
                ->request('GET', $endpoint)
        );
    }

    /**
     * @param string $endpoint
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getCollection(string $endpoint): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
                ->withOptions($this->httpOptions->toArray())
                ->request('GET', $endpoint)
        );
    }

    /**
     * @param string $endpoint
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function post(string $endpoint): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
                ->withOptions($this->httpOptions->toArray())
                ->request('POST', $endpoint)
        );
    }

    /**
     * @param int|string $id
     * @param string $endpoint
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function put(int|string $id, string $endpoint): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
                ->withOptions($this->httpOptions->toArray())
                ->request('PUT', $endpoint.'/'.$id)
        );
    }

    /**
     * @param int|string $id
     * @param string $endpoint
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function patch(int|string $id, string $endpoint): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
                ->withOptions($this->httpOptions->toArray())
                ->request('PATCH', $endpoint.'/'.$id)
        );
    }

    /**
     * @param int|string $id
     * @param string $endpoint
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function delete(int|string $id, string $endpoint): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
                ->withOptions($this->httpOptions->toArray())
                ->request('DELETE', $endpoint.'/'.$id)
        );
    }
}