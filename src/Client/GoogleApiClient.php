<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Client;

use App\Client\Abstract\AbstractClient;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

class GoogleApiClient extends AbstractClient
{
    /**
     * @param string $id
     * @param array $options
     * @return ResponseInterface
     */
    public function placeDetails(string $id, array $options = []): ResponseInterface
    {
        return $this->request('GET', "https://places.googleapis.com/v1/places/$id", $options);
    }

    /**
     * @param array $query
     * @return ResponseInterface
     */
    public function searchPlaceByQuery(array $query = []): ResponseInterface
    {
        return $this->request('POST', 'https://places.googleapis.com/v1/places:searchText', [
            'query' => $query,
            'headers' => [
                'X-Goog-FieldMask' => 'places.id,places.displayName,places.formattedAddress,places.location'
            ]
        ]);
    }

    /**
     * @param string $authToken
     * @param array $query
     * @return ResponseInterface
     */
    public function searchPlaceByGoogleServiceAccount(string $authToken, array $query): ResponseInterface
    {
        return $this->request('POST',
            'https://mybusinessbusinessinformation.googleapis.com/v1/googleLocations:search', [
                'headers' => [
                    'Authorization' => "Bearer $authToken",
                    'Content-Type' => 'application/json'
                ],
                'body' => $query
            ]
        );
    }

    /**
     * @param string|null $referer
     * @return $this
     */
    public function setReferer(?string $referer): static
    {
        if ($referer !== null) {
            $this->httpClient = $this->httpClient->withOptions([
                'headers' => ['Referer' => $referer]
            ]);
        }

        return $this;
    }

    /**
     * @return string|false
     * @throws  Throwable
     */
    public function reauth(): string|false
    {
        $response = $this->request('GET', $_ENV['API_URL'] . '/api/service/google/auth');

        $response = $this->toArray($response);

        if (isset($response['token'])) {
            return $response['token'];
        }

        return FALSE;
    }

    /**
     * @return array[]
     */
    protected function options(): array
    {
        return [
            'headers' => [
                'X-Goog-Api-Key' => $_ENV['GOOGLE_PLACES_API_KEY']
            ]
        ];
    }
}