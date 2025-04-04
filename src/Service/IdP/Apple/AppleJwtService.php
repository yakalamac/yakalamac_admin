<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Service\IdP\Apple;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use stdClass;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AppleJwtService
{
    private stdClass|null $headers;
    public function __construct(
        private ?HttpClientInterface $httpClient = null,
        private readonly ?ParameterBagInterface $parameterBag = null
    ) {
        if($this->httpClient === null) $this->httpClient = HttpClient::create();
        $this->headers =  (object)['RS256'];
    }

    /**
     * @return string
     * @throws Exception
     */
    public function getApplePrivateKey(): string
    {
        $projectDir = $this->parameterBag->get('kernel.project_dir');

        if($projectDir === null) {
            throw new Exception('Invalid project directory.');
        }

        $path = $projectDir . $_ENV['APPLE_PRIVATE_KEY_PATH'];

        if(!file_exists($path)) {
            throw new Exception("Unable to load the private key. Not found.");
        }

        $privateKey = file_get_contents($path);

        if(!str_contains($privateKey, 'BEGIN PRIVATE KEY')) {
            throw new Exception("Unable to load the private key. Not valid.");
        }

        return $privateKey;
    }

    /**
     * @return string
     * @throws Exception
     */
    public function generateAppleJwt(): string
    {
        $privateKey = $this->getApplePrivateKey();

        $now = time();
        $payload = [
            'iss' => $_ENV['APPLE_TEAM_ID'],
            'iat' => $now,
            'exp' => $now + (60 * 60 * 24),
            'aud' => 'https://appleid.apple.com',
            'sub' => $_ENV['APPLE_CLIENT_ID']
        ];

        return JWT::encode($payload, $privateKey, 'ES256', $_ENV['APPLE_PRIVATE_KEY_ID']);
    }


    /**
     * Get the correct Apple public key based on the JWT's key ID (kid).
     * Thanks to GPT
     * @param string $idToken
     * @return Key
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws Exception
     */
    public function getApplePublicKey(string $idToken): Key
    {
        list($head, $body, $signature) = explode('.',$idToken);

        $head = json_decode(JWT::urlsafeB64Decode($head));

        /** @see 'https://appleid.apple.com/auth/oauth2/v2/keys' */
        $publicKeyUrl = 'https://appleid.apple.com/auth/oauth2/v2/keys';//'https://appleid.apple.com/auth/keys';
        $response = $this->httpClient->request('GET', $publicKeyUrl);

        $keys = $response->toArray();

        foreach ($keys['keys'] as $key) {
            if ($key['kid'] === $head->kid) {
                $pem = $this->jwkToPem($key);
                return new Key($pem, $head->alg);
            }
        }

        throw new Exception("Apple public key for the given JWT not found.");
    }


    /**
     * Convert Apple's public key to PEM format.
     * Thanks to GPT
     * @param array $key
     * @return string
     */
    private function convertToPem(array $key): string
    {
        $modulus = $key['n'];
        //$exponent = $key['e'];

        // Convert to base64-encoded format, add appropriate padding, and build the PEM structure.
        $modulusBase64 = base64_decode($modulus);
        //$exponentBase64 = base64_decode($exponent);

        // Use the modulus and exponent to build the public key (use OpenSSL functions)
        $pem = "-----BEGIN PUBLIC KEY-----\n";
        $pem .= chunk_split(base64_encode($modulusBase64), 64);
        $pem .= "-----END PUBLIC KEY-----\n";

        return $pem;
    }

    function jwkToPem(array $jwk): string
    {
        $modulus = base64_decode(strtr($jwk['n'], '-_', '+/'));
        $exponent = base64_decode(strtr($jwk['e'], '-_', '+/'));

        $rsaKey = pack(
            "Ca*a*a*",
            0x30,
            $this->encodeLength(strlen($modulus) + strlen($exponent) + 2),
            pack("Ca*", 0x02, $this->encodeLength(strlen($modulus)) . $modulus),
            pack("Ca*", 0x02, $this->encodeLength(strlen($exponent)) . $exponent)
        );

        $pem = "-----BEGIN PUBLIC KEY-----\n";
        $pem .= chunk_split(base64_encode($rsaKey), 64);
        $pem .= "-----END PUBLIC KEY-----\n";

        return $pem;
    }

    function encodeLength(int $length): string
    {
        if ($length <= 0x7F) {
            return chr($length);
        }

        $temp = ltrim(pack('N', $length), "\0");
        return chr(0x80 | strlen($temp)) . $temp;
    }

    /**
     * @param string $token
     * @return stdClass
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function decodeToken(string $token): stdClass
    {
        return JWT::decode($token, $this->getApplePublicKey($token));
    }


    public function decodeTokenHeadBoy(string $token): stdClass
    {
        list($head, $body, $signature) = explode('.',$token);
        $head = json_decode($this->doDecode($head));
        $body = json_decode($this->doDecode($body));
        return  (object)[
            'head' => $head,
            'body' => $body
        ];
    }

    public function decodeTokenHead(string $token): string
    {
        list($head, $body, $signature) = explode('.', $token);
        return $this->doDecode($head);
    }

    /**
     * @param string $token
     * @return string
     */
    public function decodeTokenPayload(string $token): string
    {
        list($head, $body, $signature) = explode('.',$token);
        return $this->doDecode($body);
    }

    /**
     * @param string $token
     * @return string
     */
    private function doDecode(string $token): string
    {
        return JWT::urlsafeB64Decode(strtr($token, '-_', '+/'));
    }
}
