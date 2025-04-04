<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use App\Http\Defaults;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
    /**
     * @var HttpClientInterface|null
     */
    private ?HttpClientInterface $httpClient = NULL;

    public function __construct()
    {
        if($this->httpClient == NULL) {
            $this->httpClient = HttpClient::create([
                'base_uri' => $_ENV['API_URL'],
            ]);
        }
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface
     */
    public function get(string $uri, array $options = []): ResponseInterface
    {

    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface
     */
    public function post(string $uri, array $options = []): ResponseInterface
    {

    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface
     */
    public function put(string $uri, array $options = []): ResponseInterface
    {

    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface
     */
    public function delete(string $uri, array $options = []): ResponseInterface
    {

    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface
     */
    public function patch(string $uri, array $options = []): ResponseInterface
    {

    }


    private function request(string $method, string $uri, array $options = []): ResponseInterface|Response
    {
        try {
            return $this->httpClient->request($method, $uri, $options);
        } catch (TransportExceptionInterface $exception) {
            return new JsonResponse([
                'success' => false,
                'error' => $exception->getMessage(),
                'status' => $exception->getCode(),
            ], $exception->getCode());
        }
    }
}