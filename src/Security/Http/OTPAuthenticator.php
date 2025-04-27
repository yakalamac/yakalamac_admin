<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http;

use App\DTO\ApiUser;
use App\Security\Http\Abstract\Authenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Throwable;

class OTPAuthenticator extends Authenticator
{
    /**
     * @param Request $request
     * @return bool|null
     */
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login_otp';
    }

    /**
     * @param Request $request
     * @return Passport
     * @throws Throwable
     */
    public function authenticate(Request $request): Passport
    {
        $array = $request->request->all();

        $type = $this->getType($array);

        $response = $this->client->post("action/verification/verify/$type",
            ['json' => $this->buildBodyFromType($type, $array)]
        );

        $data = $this->client->toArray($response);

        if(FALSE === $this->client->isSuccess($response)) {
            throw new AuthenticationException(json_encode($data));
        }

        return $this->createPassport(
            new ApiUser($data)
        );
    }

    /**
     * @param array $array
     * @return string
     */
    private function getType(array $array): string
    {
        return match ($array['type'] ?? NULL) {
            'email' => 'email',
            'mobile' => 'mobile-phone',
            default => throw new BadRequestHttpException('No valid type definition.')
        };
    }

    /**
     * @param string $type
     * @param array $content
     * @return array
     */
    private function buildBodyFromType(string $type, array $content): array
    {
        if(empty($content['verificationToken'])) {
            throw new BadRequestHttpException('No valid verification token');
        }

        if(empty($content['otp'])) {
            throw new BadRequestHttpException('No valid code.');
        }

        if(empty($content['identifier'])) {
            throw new BadRequestHttpException('No valid identifier.');
        }

        $body = ['verificationToken' => $content['verificationToken']];

        if($type === 'email') {
            $body['code'] = $content['otp'];
            $body['email'] = $content['identifier'];
        }

        if($type === 'mobile-phone') {
            $body['smsCode'] = $content['otp'];
            $body['mobilePhone'] = $content['identifier'];
        }

        return $body;
    }
}