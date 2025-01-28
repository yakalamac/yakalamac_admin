<?php

namespace App\Service;

use App\DTO\AccountLinkDTO;
use App\Interface\IdentityProviderServiceInterface;
use Exception;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class GoogleService implements IdentityProviderServiceInterface
{
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    /**
     * @param array $data
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    public function exchange(array $data): ResponseInterface
    {
        if (isset($data['hd']) && $data['hd'] !== 'yakalamac.com.tr') {
            throw new Exception('Geçersiz kimlik doğrulayıcı ' . $data['hd'], Response::HTTP_UNAUTHORIZED);
        }

        if (empty($data['code'])) {
            throw new Exception('Authtoken is not exists', Response::HTTP_BAD_REQUEST);
        }

        $options = new HttpOptions();
        $body = http_build_query(
            [
                "code" => $data['code'],
                "client_id" => $_ENV['GOOGLE_CLIENT_ID'],
                "client_secret" => $_ENV['GOOGLE_CLIENT_SECRET'],
                "redirect_uri" => $_ENV['GOOGLE_REDIRECT_URI'],
                "grant_type" => "authorization_code",
            ],
            '', '&');

        $options
            ->setBaseUri('https://oauth2.googleapis.com')
            ->setHeader('Content-Type', 'application/x-www-form-urlencoded')
            ->setBody($body);

        return $this->httpClient->withOptions($options->toArray())->request('POST', 'token');
    }


    /**
     * @param array $data
     * @return AccountLinkDTO
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws Exception
     */
    public function getUserCredentials(array $data): AccountLinkDTO
    {
        if (!(isset($data['access_token']) && isset($data['id_token']))) {
            throw new Exception('Invalid request credentials.', Response::HTTP_BAD_REQUEST);
        }

        $response = $this->httpClient->request('GET', 'https://www.googleapis.com/oauth2/v2/userinfo', [
                'headers' => ['authorization' => 'Bearer ' . $data['access_token']]
            ]
        );

        $statusCode = $response->getStatusCode();
        $headers = $response->getHeaders(false);
        $contentType = $headers['content-type'] ?? null;

        $content = match (true) {
            $this->isContentTypeContains($contentType, 'x-www-form-urlencoded') => $this->decodeFromUrlEncoded($response->getContent(false)),
            $this->isContentTypeContains($contentType, 'json') => $response->toArray(false),
            default => [],
        };

        if(count($content) > 0) {

            if($statusCode < 300 && $statusCode > 199) {
                return new AccountLinkDTO([
                    'sub' => $content['id'] ?? ($content['sub'] ??  null),
                    'name' => $content['name'] ?? ($content['given_name'] ?? null),
                    'picture' => $content['picture'] ?? null,
                    'aud' => $content['audience'] ?? ($content['hd'] ?? $content['aud'] ?? null),
                    'iss' => $content['issuer'] ?? ($content['iss'] ?? 'https://accounts.google.com'),
                    'email' => $content['email'] ?? null,
                    'email_verified' => $content['verified_email'] ?? ($content['email_verified'] ?? null),
                ], null, 'google');
            }

            throw new Exception(json_encode($content, JSON_UNESCAPED_UNICODE));
        }

        throw new Exception('Couldn\'t get credentials', Response::HTTP_BAD_REQUEST);
    }

    /**
     * @param array $contentType
     * @param string $haystack
     * @return bool
     */
    private function isContentTypeContains(array $contentType, string $haystack): bool
    {
        return !empty(array_filter(
            $contentType,
            fn($header) => is_string($header) && str_contains($header,$haystack)
        ));
    }

    /**
     * @param string $content
     * @return array
     */
    private function decodeFromUrlEncoded(string $content): array
    {
        parse_str($content, $output);
        return $output ?: [];
    }

    /**
     * @param string $redirectUri
     * @param string $state
     * @return RedirectResponse
     */
    public function start(string $redirectUri, string $state): RedirectResponse
    {
        $query = http_build_query([
            'client_id' => $_ENV['GOOGLE_CLIENT_ID'],
            'response_type' => $_ENV['GOOGLE_RESPONSE_TYPE'],
            'scope' => $_ENV['GOOGLE_SCOPE'],
            'prompt' => $_ENV['GOOGLE_PROMPT'],
            'state' => $state,
            'redirect_uri' => $redirectUri,
        ]);

        return new RedirectResponse($_ENV['GOOGLE_AUTH_BASE_URI']."?$query");
    }
}