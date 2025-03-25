<?php

namespace App\Service;

use Amp\Http\Client\Response;
use App\Http\ClientFactory;
use ArrayObject;
use Symfony\Component\HttpFoundation\JsonResponse;

class DictionaryProviderService {

    /**
     * Undocumented variable
     * @var string|null
     */
    private ?string $baseUrl = null;

    /**
     * @param ClientFactory $client
     */
    public function __construct(private readonly ClientFactory $client )
    {
       $this->baseUrl = $_ENV['API_URL'];
       $client->options()
       ->setHeader('Accept', 'application/ld+json')
       ->setHeader('Content-Type', 'application/json')
       ->setBaseUri($this->baseUrl);
    }

    public function getDictionaries(?string $accessToken = null, ?string $refreshToken = null, int $page = 1, int $limit = 15): JsonResponse
    {
        if($refreshToken === NULL && $accessToken === NULL) {
            throw new \Exception('Invalid credentials');
        }

        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);
        if($accessToken) $this->client->options()->setAuthBearer($accessToken);

        $response = $this->client->request("/api/dictionaries?page=$page&limit=$limit");

        $statusCode = $response->getStatusCode();
            return new JsonResponse($response->toArray(false), $statusCode);
    }

    /**
     * Undocumented function
     * @param string $url
     * @param string $token
     * @param array $credentials (body)
     * @return array
     */
    public function addDictionary(string $url, ?string $accessToken = null, ?string $refreshToken = null, array $credentials):array{

        if($accessToken) $this->client->options()->setAuthBearer($accessToken);
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);

        $response = $this->client->request($url, 'POST', $credentials);

        $statusCode = $response->getStatusCode();
        return [
            'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
            'status_code' => $statusCode,
            'message' => $statusCode >199 && $statusCode <  300 ? 'Dictionaries provided success' : 
            'An error occured while providing dictionaries',
            'data' => $response->toArray(false),
        ];
    }
    
    /**
     * @param string $url
     * @param string $id
     * @param string $token
     * @param array $extraData
     * @return array|JsonResponse
     */
    public function updateDictionary(string $url, string $id, ?string $accessToken = null, ?string $refreshToken = null , $extraData = [] ):array|JsonResponse
    {   
        if($accessToken) $this->client->options()->setAuthBearer($accessToken);
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);

       $response =  $this->client->request(join('/', [$url , $id]), 'PATCH' , $extraData , 'application/merge-patch+json' );

       $statusCode = $response->getStatusCode();
        return [
                'ok' => $statusCode > 199 && $statusCode < 300,
                'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
                'status_code' => $statusCode,
                'data' => $response->toArray(false),
                'message' => $statusCode > 199 && $statusCode < 300
                ? 'Dictionary provided success' : 'An error occurred while providing dictionary',
                 'extraData' => $extraData
        ];
    }
    
    /**
     * @param string $url
     * @param string $id
     * @param string $token
     * @param array $extraProperty
     * @return Array|JsonResponse
     */
    public function getDictionary(string $url, string $id, ?string $accessToken = null, ?string $refreshToken = null, array $extraProperty =[] ) : Array|JsonResponse{

        if($accessToken) $this->client->options()->setAuthBearer($accessToken);
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);

        $response = $this->client->request(join('/', [$url, $id]));
        $statusCode = $response->getStatusCode();

        return [
            'ok' => $statusCode > 199 && $statusCode < 300,
            'status' => $statusCode > 199 && $statusCode < 300 ? 'success' : 'error',
            'status_code' => $statusCode,
            'data' => $response->toArray(false),
            'message' => $statusCode > 199 && $statusCode < 300
                ? 'Dictionary provided success' : 'An error occurred while providing dictionary',
            'extra' => $extraProperty
        ];
    }

    /**
     * @param string $url
     * @param string $id
     * @param string $token
     * @return array
     */
    public function deleteDictionary(string $url, string $id, ?string $accessToken = null, ?string  $refreshToken = null ): array|int{

       if($accessToken) $this->client->options()->setAuthBearer($accessToken);
        if($refreshToken) $this->client->options()->setHeader('Yakala-Refresh-Token', $refreshToken);
        $response = $this->client->request(join('/', [$url, $id]), 'DELETE');
        $statusCode = $response->getStatusCode();

        return $statusCode;
    }

}