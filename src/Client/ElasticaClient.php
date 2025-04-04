<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use App\Http\Defaults;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ElasticsearchClient
{
    public function __construct(private HttpClientInterface $httpClient, private HttpOptions $httpOptions)
    {
        if (!$this->httpClient)
            $this->httpClient = HttpClient::create();
        if (!$this->httpOptions)
            $this->httpOptions = new HttpOptions();
        $this->httpOptions
            ->setBaseUri($_ENV['ELASTIC_URL'])
            ->setHeaders(['Content-Type' => 'application/json']);
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
                'message' => Defaults::messageFromStatusCode($statusCode),
                'data' => $response->toArray(false)
            ],
            $statusCode
        );
    }

    /**
     * @param string $index
     * @param int $page
     * @param int $size
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function collection(string $index, int $page, int $size = 15): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
            ->withOptions($this->httpOptions->toArray())
            ->request('GET', "/$index/_search?size=$size&from=$page")
        );
    }

    /**
     * @param string $index
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function search(string $index): JsonResponse
    {
        return $this->handleRequest(
            $this->httpClient
            ->withOptions($this->httpOptions->toArray())
            ->request('POST', "/$index/_search")
        );
    }

    /**
     * @param string|int $documentId
     * @param string $index
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function document(string|int $documentId, string $index): JsonResponse
    {
        return $this->handleRequest(
          $this->httpClient
          ->withOptions(
              $this->httpOptions->toArray()
          )
            ->request('GET', "/$index/_doc/$documentId")
        );
    }
}