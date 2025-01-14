<?php

namespace App\Service;

use App\Http\ClientFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class UserProviderService
{
    /**
     * @var string|null
     */
    private ?string $baseUri = null;

    /**
     * @param ClientFactory $client
     */
    public function __construct(private readonly ClientFactory $client)
    {
        $this->baseUri = $_ENV['API_URL'];

        $this->client
            ->options()
            ->setHeader('Accept', 'application/ld+json')
            ->setHeader('Content-Type', 'application/json')
            ->setBaseUri($this->baseUri);
    }

    /**
     * @param string $url
     * @param string $token
     * @param int $page
     * @param array $extraProperty
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getUsers(string $url, string $token, int $page = 1, array $extraProperty = []): JsonResponse
    {
        /**
         * @note $this->client->options()->setHeader('Authorization', 'Bearer ' . $token);
         * => Aynı işlem
         * */
        $this->client->options()->setAuthBearer($token);

        $response = $this->client->request($url. "?page=$page");

        $statusCode = $response->getStatusCode();

        return new JsonResponse(
            [
                'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
                'status_code' => $statusCode,
                'data' => $response->toArray(false),
                'message' => $statusCode > 199 && $statusCode < 300
                    ? 'Users provided success' : 'An error occurred while providing users',
                'extra' => $extraProperty
            ],
            $statusCode
        );
    }

    /**
     * @param array $credentials
     * @param string $token
     * @param string $uri
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function addUser(array $credentials, string $token, string $uri): array
    {
        $this->client->options()->setAuthBearer($token);

        $response = $this->client->request($uri, "POST", $credentials);

        $statusCode = $response->getStatusCode();


        return [
            'ok' => $statusCode > 199 && $statusCode < 300,
            'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
            'status_code' => $statusCode,
            'data' => $response->toArray(false),
            'message' => $statusCode > 199 && $statusCode < 300
                ? 'Users provided success' : 'An error occurred while providing users'
        ];
    }

    /**
     * @param string $baseUri
     * @return $this
     */
    public function setBaseUri(string $baseUri): self
    {
        $this->baseUri = $baseUri;

        $this->client->options()->setBaseUri($baseUri);

        return $this;
    }

    /**
     * @param string $url
     * @param string $id
     * @param string $token
     * @param int $page
     * @param array $extraProperty
     * @return JsonResponse|array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getUser(string $url, string $id, string $token, int $page = 1, array $extraProperty = []): array|JsonResponse
    {
        $this->client->options()->setAuthBearer($token);

        $response = $this->client->request(join('/', [$url, $id]));

        $statusCode = $response->getStatusCode();

        return [
                'ok' => $statusCode > 199 && $statusCode < 300,
                'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
                'status_code' => $statusCode,
                'data' => $response->toArray(false),
                'message' => $statusCode > 199 && $statusCode < 300
                    ? 'Users provided success' : 'An error occurred while providing users',
                'extra' => $extraProperty
            ];
    }
}