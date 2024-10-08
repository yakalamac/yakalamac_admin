<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Security;

use App\Http\ClientFactory;
use App\Http\Defaults;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class AuthenticationController extends AbstractController
{
    private ?ClientFactory $clientFactory;

    public function __construct()
    {
        $this->clientFactory = Defaults::forAPI(new ClientFactory());
    }

    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    #[Route('/_route/authentication/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): Response
    {
        /** Convert body to array */
        $body = $request->toArray();

        /** Check email and password keys are exist */
        if(
            !(
                array_key_exists('email', $body) &&
                array_key_exists('password', $body)
            )
        )
            /** If aren't throw new exception */
            throw new \Exception('Email and password are required', 400);

        /** Set body using `ClientFactory` options */
        $this->clientFactory->options()->setJson(
            array_merge(
                /** Pass request body */
                $body,
                /** Merge with application definition */
                [
                    'application' => 'YAKALA'
                ]
            )
        );

        /** Send POST request to API */
        $response = $this->clientFactory->request('/api/user/action/login', 'POST');

        /** Return direct response as Json with returned status code */
        return new JsonResponse(
            /**
             * Set exception throwing choice false
             * when returning response content as response content which is coming from API
             */
            $response->toArray(false),
            $response->getStatusCode()
        );
    }

    #[Route('/_route/authentication/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/_route/authentication/check', name: 'check', methods: ['POST'])]
    public function isAuthenticated(Request $request): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}