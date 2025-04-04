<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client\Abstract;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

abstract class AbstractClient
{
    /**
     * @var HttpClientInterface|null
     */
    protected ?HttpClientInterface $httpClient = NULL;

    public function __construct()
    {
        if(is_null($this->httpClient)) {
            $this->httpClient = HttpClient::create(
                $this->options()
            );
        }
    }

    /**
     * @return array
     */
    protected abstract function options(): array;

    /**
     * @param string $method
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    protected function request(string $method, string $uri, array $options = []): ResponseInterface|Throwable
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
                status: $result->getStatusCode()
                /** TODO headers: */
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