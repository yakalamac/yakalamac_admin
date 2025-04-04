<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

class YakalaApiClient
{
    /**
     * @var HttpClientInterface|null
     */
    private ?HttpClientInterface $httpClient = NULL;

    public function __construct()
    {
        if ($this->httpClient == NULL) {
            $this->httpClient = HttpClient::create([
                'base_uri' => $_ENV['API_URL'],
                'headers' => ['Content-Type' => 'application/json']
            ]);
        }
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function get(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('GET', $uri, $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function post(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('POST', $uri, $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function put(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('PUT', $uri, $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function delete(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('DELETE', $uri, $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function patch(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('PATCH', $uri, $options);
    }

    /**
     * @param string $method
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    private function request(string $method, string $uri, array $options = []): ResponseInterface|Throwable
    {
        try {
            return $this->httpClient->request($method, $uri, $options);
        } catch (Throwable $exception) {
            return $exception;
        }
    }

    /**
     * @param ResponseInterface|Throwable $result
     * @return Response
     * @throws Throwable
     */
    public function toResponse(ResponseInterface|Throwable $result): Response
    {
       if ($result instanceof ResponseInterface) {
           return new JsonResponse(
               data: $result->toArray(false),
               status: $result->getStatusCode(),
               headers: $result->getHeaders(false)
           );
       }

       return new JsonResponse(data: [
           'success' => false,
           'error' => $result->getMessage(),
           'status' => $result->getCode()
       ], status: 500);
    }

    /**
     * @param ResponseInterface|Throwable $result
     * @return array
     * @throws Throwable
     */
    public function toArray(ResponseInterface|Throwable $result): array
    {
        if($result instanceof ResponseInterface) {
            return $result->toArray(false);
        }

        return [
            'success' => false,
            'error' => $result->getMessage(),
            'status' => $result->getCode()
        ];
    }
}