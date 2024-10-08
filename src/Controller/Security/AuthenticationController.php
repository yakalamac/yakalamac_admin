<?php

/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Security;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;
use App\Http\ClientFactory;
use App\Http\Defaults;
use Exception;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class AuthenticationController extends AbstractController
{
    private ClientFactory $clientFactory;

    public function __construct()
    {
        $this->clientFactory = Defaults::forAPI(new ClientFactory());
    }

    /**
     * @param Request $request
     * @param SessionInterface $session
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    #[Route('/_route/authentication/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, SessionInterface $session): Response
    {
        /** Convert body to array */
        $body = $request->toArray();

        /** Check body if includes email and password */
        if(
            !(
                array_key_exists('email', $body) &&
                array_key_exists('password', $body)
            )
        )
            /** If isn't throw exception and detail exception */
            throw new Exception(
                json_encode([
                    'message' => 'Username or password is missing',
                    'code' => 400,
                    'status' => 'error'
                ]),
                400
            );

        /** Set body of `ClientFactory` options to send body with `POST` request */
        $this->clientFactory->options()
            ->setJson(
                /** Merge request body with application identifier key */
                array_merge(
                    $body,
                    [
                        'application' => 'YAKALA'
                    ]
                )
            );

        /** Make `POST` request to API endpoint */
        $response = $this
            ->clientFactory
            ->request('/api/users/action/login', 'POST');

        /** Save response status code and content to reuse */
        $status = $response->getStatusCode();
        $body = $response->toArray(false);

        /** Check status of response is success and ensure response body has `accessToken` key */
        if($status > 199 && $status < 300 && array_key_exists('accessToken', $body))
        {
            /** If condition is true, set session using `SessionInterface` */
            $session->set($body['accessToken'], $authToken = $this->encryptToken($body['accessToken']));
            $body['accessToken'] = $authToken;
            $request->getSession()->set('authToken', $authToken);
        }

        return $this->json($body, $status);
    }

    #[Route('/_route/authentication/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @param Request $request
     * @param SessionInterface $session
     * @return Response
     * @throws Exception
     */
    #[Route('/_route/authentication/check', name: 'check', methods: ['POST'])]
    public function isAuthenticated(Request $request, SessionInterface $session): Response
    {
        /** Convert body to array */
        $body = $request->toArray();

        /** Check ``authToken`` key is exist */
        if (!array_key_exists('authToken', $body))
            /** If isn't throw new exception */
           throw new Exception(
               json_encode([
                   'message' => 'Token is missing',
                   'code' => 400,
                   'status' => 'error'
               ]),
               400
           );

        /** Try to retrieve stored session using decrypting provided authToken */
        $storedSession = $session->get('authToken'.$this->decryptToken($body['authToken']));

        /** Check session was found and equal to authToken */
        if ($storedSession && $storedSession === $body['authToken'])
            /** If condition true return 200 status code with success message */
            return $this->json([
                'message' => 'Token is valid',
                'code' => 200,
                'status' => 'Authenticated'
            ]);

        /** If condition false return 401 status code with unauthorized message */
        return $this->json(
            [
                'message' => 'Token is not valid',
                'code' => 401,
                'status' => 'Unauthenticated'
            ],
            401
        );
    }

    /**
     * @param string $token
     * @return string
     */
    private function encryptToken(string $token): string
    {
        return password_hash($token, PASSWORD_DEFAULT);
    }

    /**
     * @param string $token
     * @return string
     */
    private function decryptToken(string $token): string
    {
        return password_verify($token, PASSWORD_DEFAULT);
    }
}