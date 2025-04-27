<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client\Abstract;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
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
            $status = $result->getStatusCode();

            if($status !== Response::HTTP_NO_CONTENT) {
                $data = $result->toArray(false);
            }

            return new JsonResponse(
                data: $data ?? NULL,
                status: $status,
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

    /**
     * @param ResponseInterface|Throwable $result
     * @return bool
     * @throws TransportExceptionInterface
     */
    public function isSuccess(ResponseInterface|Throwable $result): bool
    {
        if($result instanceof Throwable) {
            return FALSE;
        }

        $status = $result->getStatusCode();

        return $status > 199 && $status < 300;
    }

    /**
     * @param ResponseInterface|Throwable $result
     * @return array
     * @throws Throwable
     */
    public function toResponseArray(ResponseInterface|Throwable $result): array
    {
        if($result instanceof ResponseInterface) {

            $status = $result->getStatusCode();

            return [
                'status' => $status,
                'content' => $status !== Response::HTTP_NO_CONTENT ? $result->toArray(false) : NULL,
                'success' => $this->isSuccess($result),
                'exception' => NULL
            ];
        }

        return [
            'success' => false,
            'error' => $result->getMessage(),
            'status' => $result->getCode(),
            'exception' => $result::class
        ];
    }

    /**
     * @param array $array
     * @return Response
     */
    public function toResponseFromArray(array $array): Response
    {
        if(isset($array['exception'])) {
            unset($array['exception']);
            return new JsonResponse(data: $array, status: 500);
        }

        return new JsonResponse(data: $array['content'], status: $array['status']);
    }
}