<?php

/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Security;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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

    /**
     * Constructor method for `AuthenticationController` that creates new `ClientFactory`
     * with default options of API
     */
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
    #[Route('/authenticate/login', name: 'app_authenticate_login', methods: ['POST'])]
    public function login(Request $request, SessionInterface $session): Response
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if (!($email && $password)) {
            $this->addFlash('error', 'Email or password is missing.');
            return $this->redirectToRoute('app_login');
        }

        if (strlen($email) < 7 || strlen($password) < 7) {
            $this->addFlash('error', 'E-posta veya şifreniz eksik.');
            return $this->redirectToRoute('app_login');
        }

        $this->clientFactory
            ->options()
            ->setJson(
                [
                    'email' => $email,
                    'password' => $password,
                    'application' => 'BUSINESS'
                ]
            );

        $response = $this->clientFactory->requestLogin('/api/users/action/login', 'POST');

        $status = $response->getStatusCode();

        if (
            $status > 199 && $status < 300
            && array_key_exists(
                'accessToken',
                (
                    $body = $response->toArray(false)
                )
            )
        ) {

            $authToken = $this->encryptToken($body['accessToken']);
            $session->set('authToken', $authToken);
            $session->set('userUUID', $body['user']['id']);
            $session->set('accessToken', $body['accessToken']);


            $user = UserFactory::fromResponseArray($body['user']);

            $this->addFlash('success', 'Giriş yapıldı.');

            $redirect = match (true) {
                $user->isAdmin() => $this->redirectToRoute('admin_dashboard'),
                $user->isBusiness() => $this->redirectToRoute('partner_dashboard'),
                default => $this->redirectToRoute('app_login')
            };

            $redirect->headers->set('Authorization', 'Bearer ' . $authToken);

            $redirect->headers->setCookie(new Cookie('validationtoken', $authToken));

            return $redirect;
        } else {
            $this->addFlash('error', 'E-posta veya şifre hatalı');
            return $this->redirectToRoute('app_login');
        }
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
        $storedSession = $session->get('authToken' . $this->decryptToken($body['authToken']));

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