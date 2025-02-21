<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http;

use Exception;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ClientFactory
{
    /**
     * @var HttpClientInterface|null
     */
    private ?HttpClientInterface $client;

    /**
     * @var HttpOptions|null
     */
    private ?HttpOptions $options;

    /**
     * Constructor method of `ClientFactory`
     * @param string|null $baseUri
     */
    public function __construct(?string $baseUri = null)
    {
        $this->client = HttpClient::create();
        $this->options = new HttpOptions();
        if($baseUri) {
            $this->options->setBaseUri($baseUri);
        }
    }

    /**
     * Returns client
     * @return HttpClientInterface
     */
    public function getClient(): HttpClientInterface
    {
        return $this->client;
    }

    /**
     * Returns options
     * @return HttpOptions
     */
    public function options(): HttpOptions
    {
        return $this->options;
    }

    /**
     * Makes json request
     * @param string $url
     * @param string $method
     * @param array $body
     * @param string $contentType
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function request( string $url, string $method = 'GET', array $body = [], string $contentType = 'application/json' ): ResponseInterface {
        return $this
            ->client
            ->withOptions(
                $this->options->toArray()
            )
            ->request($method, $url, [
                'headers' => [
                    'Content-Type' => $contentType,
                ],
                'json' => $body,
            ]);
    }

    /**
     * Makes multipart request
     * @param string $url
     * @param string $method
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function requestMultipart(string $url, string $method = 'GET'): ResponseInterface
    {
        return $this
            ->client
            ->withOptions(
                $this->options->toArray()
            )
            ->request($method, $url);
    }

   /**
     * @param string $url
     * @param string $method
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function requestLogin(string $url, string $method = 'GET'): ResponseInterface
    {
        return $this
            ->client
            ->withOptions(
               $this->options->toArray()
            )
            ->request($method, $url);
    }
}