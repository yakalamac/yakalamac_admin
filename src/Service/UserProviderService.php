<?php

namespace App\Service;

use App\Http\ClientFactory;
use ArrayObject;
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
    public function getUsers(?string $refreshToken = null , ?string $accessToken = null, int $page = 1, int $limit): JsonResponse
    {
        /**
         * @note $this->client->options()->setHeader('Authorization', 'Bearer ' . $token);
         * => Aynı işlem
         * */
        if($refreshToken) $this->client->options()->setAuthBearer($accessToken);
        if($accessToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);
        $response = $this->client->request("/api/users?page=$page&limit=$limit");

        $statusCode = $response->getStatusCode();

        return new JsonResponse( $response->toArray(false), $statusCode);
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
    public function addUser(array $credentials, ?string $accessToken = null, ?string $refreshToken = null, string $uri): array
    {
        if($accessToken){
        
            $this->client->options()->setAuthBearer($accessToken);
        }

        if($refreshToken){
            $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);
        }

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
     * Undocumented function
     *
     * @param string $url
     * @param string $id
     * @param string $token
     * @param array $extraData
     * @return array|JsonResponse
     */
    public function updateUser(string $url, string $id, ?string $accessToken = null, ?string $refreshToken = null , $extraData = [] ):array|JsonResponse
    {  
        if($accessToken) $this->client->options()->setAuthBearer($accessToken);
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);    

       $response =  $this->client->request(join('/', [$url , $id]), 'PATCH' , $extraData);

       $statusCode = $response->getStatusCode();
        return [
            'ok' => $statusCode > 199 && $statusCode < 300,
                'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
                'status_code' => $statusCode,
                'data' => $response->toArray(false),
                'message' => $statusCode > 199 && $statusCode < 300
                 ? 'Users provided success' : 'An error occurred while providing users',
                 'extraData' => $extraData
        ];
    }

    /**
     * Undocumented function
     *
     * @param string $url
     * @param string $id
     * @param string $token
     * @return JsonResponse
     * @throws Exception
     * @throws 
     */
    public function deleteUser(string $url, string $id, ?string $refreshToken =null , ?string $accessToken = null):JsonResponse
    {   
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);
        if($accessToken) $this->client->options()->setAuthBearer($accessToken);

        $response = $this->client->request(join('/',[$url, $id]), 'DELETE' );

        $statusCode = $response->getStatusCode();

        if ($statusCode == 204) {
           
            return new JsonResponse([
                'status' => 'success',
                'status_code' => $statusCode,
                'message' => 'User deleted successfully.'
            ], $statusCode);
        } elseif ($statusCode>199 && $statusCode<300) {
            
            return new JsonResponse([
                'status' => 'success',
                'status_code' => $statusCode,
                'message' => 'User deleted successfully. No content returned.'
            ], $statusCode);
        } else {
            return new JsonResponse([
                'status' => 'error',
                'status_code' => $statusCode,
                'message' => $response->getContent(false) ?: 'An error occurred while deleting the user.',
            ], $statusCode);
        }
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
    public function getUser(string $url, string $id, ?string $accessToken = null, ?string $refreshToken = null, array $extraProperty = []): array|JsonResponse
    {
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);
        if($accessToken) $this->client->options()->setAuthBearer($accessToken);

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