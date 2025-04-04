<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Service\Google;

use App\Http\Client;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class GoogleAPIService
{
    private Client $clientFactory;

    public function __construct()
    {
        $this->clientFactory = new Client();
        $this->clientFactory->options()
            ->setHeader('X-Goog-Api-Key' ,$_ENV['GOOGLE_MAPS_API_KEY']);
    }

    /**
     * @param array $query
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function searchPlaceByQuery(array $query): ResponseInterface
    {
        $this->clientFactory->options()->setHeader('X-Goog-FieldMask' , 'places.id,places.displayName,places.formattedAddress,places.location');

        return $this->clientFactory
            ->request('https://places.googleapis.com/v1/places:searchText', 'POST', $query);
    }

    /**
     * @param string $authToken
     * @param array $query
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function searchPlaceByGoogleServiceAccount(string $authToken, array $query): ResponseInterface
    {
        return $this->clientFactory->getClient()
            ->request(
                'POST',
                'https://mybusinessbusinessinformation.googleapis.com/v1/googleLocations:search',
                [
                    'headers' => [ 'Authorization' => 'Bearer '.$authToken, 'Content-Type' => 'application/json' ],
                    'body' => $query
                ]
            );
    }

    public function setReferer(?string $referer): static
    {
        if($referer !== null) {
            $this->clientFactory->options()->setHeader('Referer', $referer);
        }

        return $this;
    }

    /**
     * @return string|false
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     */
    public function reauth(): string|false
    {
        $response = $this->clientFactory->request($_ENV['API_URL'].'/api/service/google/auth');

        $status = $response->getStatusCode();
        if($status < 200 || $status > 299) {
            return false;
        }

        $payload = $response->toArray(false);

        if(isset($payload['token'])) {
            return $payload['token'];
        }

        return false;
    }
}