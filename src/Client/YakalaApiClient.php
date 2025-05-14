<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use App\Client\Abstract\AbstractClient;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

class YakalaApiClient extends AbstractClient
{
    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function get(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('GET', "/api/$uri", $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function post(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('POST', "/api/$uri", $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function put(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('PUT', "/api/$uri", $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function delete(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('DELETE', "/api/$uri", $options);
    }

    /**
     * @param string $uri
     * @param array $options
     * @return ResponseInterface|Throwable
     */
    public function patch(string $uri, array $options = []): ResponseInterface|Throwable
    {
        return $this->request('PATCH', "/api/$uri", $options);
    }

    /**
     * @return array
     */
    protected function options(): array
    {
        return [ 'base_uri' => $_ENV['API_URL'], 'headers' => ['Content-Type' => 'application/json']];
    }
}