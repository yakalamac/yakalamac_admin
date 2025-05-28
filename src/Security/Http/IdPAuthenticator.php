<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http;

use App\DTO\ApiUser;
use App\Security\Http\Abstract\Authenticator;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

class IdPAuthenticator extends Authenticator
{
    /**
     * @param Request $request
     * @return bool|null
     */
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login_idp';
    }

    /**
     * @param Request $request
     * @return Passport
     * @throws Throwable
     * @throws TransportExceptionInterface
     */
    public function authenticate(Request $request): Passport
    {
        $content = $this->getContent($request);

        if(empty($content['providerType'])) {
            throw new Exception('Provider type not specified');
        }

        if(!in_array($content['providerType'], ['google', 'facebook', 'apple'])) {
            throw new Exception('Provider type not supported');
        }

        $result = $this->client->post("identity-provider/{$content['providerType']}", [
            'headers' => ['content-type' => 'application/json'],
            'json' => [...$this->buildBody($content), 'application' => 'business']
        ]);

        $data = $this->client->toArray($result);

        if(!$this->client->isSuccess($result)) {
            throw new AuthenticationException(json_encode($data));
        }

        return $this->createPassport(new ApiUser($data));
    }

    /**
     * @param Request $request
     * @return array
     * @throws Exception
     */
    private function getContent(Request $request): array
    {
        switch ($request->getContentTypeFormat()) {
            case 'form':
                return $request->request->all();
            case 'json':
                $content = $request->getContent();
                if(json_validate($content) && json_last_error() === JSON_ERROR_NONE) {
                    return json_decode($content, true);
                }
                throw new Exception('Invalid json content.');
            default: throw new Exception('Unsupported request format');
        }
    }

    /**
     * @param array $content
     * @return array
     * @throws Exception
     */
    private function buildBody(array $content): array
    {
        return match ($content['providerType']) {
            'google' => ['token' => $content['token']],
            'apple' => [
                'native' => FALSE,
                'idToken'=> $content['idToken'],
                'code' => $content['code'],
                'redirectUri' => $content['redirect_uri'] ?? $_ENV['APPLE_REDIRECT_URI']
            ],
            default => throw new Exception('Unsupported provider type')
        };
    }
}