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
    private const FULL_NUMBER = 0;
    private const COUNTRY_CODE = 1;
    private const NUMBER_BODY = 2;

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
     * @throws TransportExceptionInterface
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

        $response = $this->client->post("action/verification/verify/$type", ['json' => $array]);

        throw new \Exception($response->getContent(false));
    }

    /**
     * @param string $mobilePhone
     * @param int $mode
     * @return string|null
     */
    private function mobilePhoneExtract(string $mobilePhone, int $mode): ?string
    {
        if (!in_array($mode, [self::FULL_NUMBER, self::COUNTRY_CODE, self::NUMBER_BODY])) {
            throw new BadRequestHttpException('Invalid mode provided.', 400);
        }

        // Remove all whitespaces
        $mobilePhone = str_replace(' ', '', $mobilePhone);

        // Use preg_match to capture the match groups. Ensure to return the correct part based on $mode
        if (preg_match('/^(\+?\d+)?(\d{10})$/', $mobilePhone, $matches) && isset($matches[$mode])) return $matches[$mode];

        return NULL;
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