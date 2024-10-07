<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ClientFactory
{
    private ?HttpClientInterface $client;

    private ?HttpOptions $options;

    public function __construct(?string $baseUri = null)
    {
        $this->client = HttpClient::create();
        $this->options = new HttpOptions();
        if($baseUri)
            $this->options->setBaseUri($baseUri);
    }

    /**
     * @return HttpClientInterface
     */
    public function getClient(): HttpClientInterface
    {
        return $this->client;
    }

    /**
     * @return HttpOptions
     */
    public function options(): HttpOptions
    {
        return $this->options;
    }

    /**
     * @param string $url
     * @param string $method
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function request(string $url, string $method = 'GET'): ResponseInterface
    {
        return $this
            ->client
            ->withOptions(
               $this->options->toArray()
            )
            ->request($method, $url);
    }

//    public function setHeader(string $key, string $value): static
//    {
//        $this->options->setHeader($key, $value);
//
//        return $this;
//    }
//
//    public function setHeaders(array $headers): static
//    {
//        $this->options->setHeaders($headers);
//
//        return $this;
//    }
//
//    public function removeHeader(string $key): static
//    {
//        $this->options->setHeader($key, null);
//
//        return $this;
//    }
//
//    public function setAuthBearer(string $bearerToken): static
//    {
//        $this->options->setAuthBearer($bearerToken);
//
//        return $this;
//    }
//
//    public function setBody(mixed $body): static
//    {
//        $this->options->setBody($body);
//
//        return $this;
//    }
//
//    public function set(string $name, string $value): static
//    {
//        $this->options->setExtra($name, $value);
//
//        return $this;
//    }
//
//    public function setAuthBasic(string $user, string $password): static
//    {
//        $this->options->setAuthBasic($user, $password);
//
//        return $this;
//    }
//
//    public function setAuthDigest(string $cafile): static
//    {
//        $this->options->setCaFile($cafile);
//    }
}