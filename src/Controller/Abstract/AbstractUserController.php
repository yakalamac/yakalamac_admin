<?php

namespace App\Controller\Abstract;

use App\Interface\UserControllerInterface;
use App\Service\UserProviderService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

abstract class AbstractUserController extends AbstractController implements UserControllerInterface
{
    public function __construct(protected readonly UserProviderService $service) {}

    /**
     * @param Request $request
     * @return array|false
     * @throws Exception
     */
    protected function getCredentials(Request $request): array|false
    {
        $session = $request->getSession();

        $token = $session->get('accessToken');
        $refreshToken = $session->get('refreshToken');

        if($token === null && $refreshToken === null){
            $response = $this->onAccessDenied();

            if(is_array($response)) {
                throw new Exception(json_encode($response), 403);
            }

            return false;
        }

        return [
            'accessToken' => $token,
            'refreshToken' => $refreshToken
        ];
    }

    protected function onAccessDenied(): array|null
    {
        return null;
    }
}