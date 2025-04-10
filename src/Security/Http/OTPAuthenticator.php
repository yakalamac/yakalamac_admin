<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Http;

use App\Security\Http\Abstract\Authenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

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
     * @throws \Throwable
     */
    public function authenticate(Request $request): Passport
    {
        $array = $request->request->all();

        if(empty($array['verificationToken'])) {
            throw new BadRequestHttpException('No valid verification token');
        }

        if(empty($array['otp'])) {
            throw new BadRequestHttpException('No valid code.');
        }

        $type = $this->getType($array);

        $body = [
            'verificationToken' => $array['verificationToken']
        ];

        if($type === 'email') {
            $body['code'] = $array['otp'];
        }

        if($type === 'mobile-phone') {
            $body['smsCode'] = $array['otp'];
            $body['mobilePhone'] = $array['mobilePhone'];
        }

        $response = $this->client->post("action/verification/verify/$type", ['json' => $body]);

        throw new BadRequestHttpException($response->getContent(false));
    }

    /**
     * @param array $array
     * @return string
     */
    private function getType(array $array): string
    {
        if(!empty($array['email'])) {
            return 'email';
        }

        if(!empty($array['mobilePhone'])) {
            return 'mobile-phone';
        }

        throw new BadRequestHttpException('No valid identifier.');
    }
}