<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Service;

use App\DTO\AccountLinkDTO;
use App\Interface\IdentityProviderServiceInterface;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class AppleService implements IdentityProviderServiceInterface
{
    private ?AppleJwtService $appleJwtService;

    public function __construct(private readonly ParameterBagInterface $parameterBag, private readonly HttpClientInterface $httpClient)
    {
        $this->appleJwtService = new AppleJwtService(null, $this->parameterBag);
    }

    /**
     * @param array $data
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     */
    public function exchange(array $data): ResponseInterface
    {
        return $this->doExchange($data);
    }

    /**
     * @param array $data
     * @return ResponseInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    private function doExchange(array $data): ResponseInterface
    {

        $jwtToken = $this->appleJwtService->generateAppleJwt();

        return $this->httpClient->request('POST','https://appleid.apple.com/auth/oauth2/v2/token', [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'body' => http_build_query(
                [
                    'grant_type' => 'authorization_code',
                    'client_id' => $_ENV['APPLE_CLIENT_ID'],
                    'client_secret' => $jwtToken,
                    'code' => $data['code'],
                    'redirect_uri' => $_ENV['APPLE_REDIRECT_URI'],
                ]
            )
        ]);
    }

    /**
     * @param array $data
     * @param array $exchange
     * @return bool
     */
    private function validateToken(array $data, array $exchange): bool
    {
        return false;
    }

    /**
     * @param array $data
     * @return AccountLinkDTO
     * @throws Exception
     */
    public function getUserCredentials(array $data): AccountLinkDTO
    {
        if(!isset($data['id_token'])) {
            throw new Exception('Invalid credentials provided.');
        }

        return new AccountLinkDTO(
            json_decode($this->appleJwtService->decodeTokenPayload($data['id_token']), true),
            null, 'apple'
        );
    }

    /**
     * @param string $redirectUri
     * @param string $state
     * @return RedirectResponse
     */
    public function start(string $redirectUri, string $state): RedirectResponse
    {
        $query = http_build_query([
            'client_id' => $_ENV['APPLE_CLIENT_ID'],
            'scope' => $_ENV['APPLE_SCOPE'],
            'response_type' => $_ENV['APPLE_RESPONSE_TYPE'],
            'response_mode' => $_ENV['APPLE_RESPONSE_MODE'],
            'redirect_uri' => $redirectUri,
            'state' => $state
        ]);

        return new RedirectResponse($_ENV['APPLE_AUTH_BASE_URI']."?$query");
    }
}