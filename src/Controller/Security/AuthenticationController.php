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
use Symfony\Component\Routing\Attribute\Route;
use App\Http\ClientFactory;
use App\Http\Defaults;
use Exception;

class AuthenticationController extends AbstractController
{
    private ClientFactory $clientFactory;

    public function __construct()
    {
        $this->clientFactory = Defaults::forAPI(new ClientFactory());
    }

    #[Route('/_route/authentication/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): Response
    { //api istek api cevap geri döndür 
        //var_dump($request->getSession()->isStarted());

        $this->clientFactory->options()
            ->setJson(
                array_merge(
                    $request->toArray(),
                    [
                        'application' => 'YAKALA'
                    ]
                )
            );


        $reponse = $this->clientFactory->request('/api/users/action/login', 'POST');

        return new JsonResponse(
            $reponse->toArray(false),
            $reponse->getStatusCode()
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
        // $session = $request->getSession();
        $session = $request->toArray();
        if ( array_key_exists('authToken', $session)) {
            return new JsonResponse('başarılı',200);
        }
        else return new JsonResponse('başarısız', 400);

        // // $request->toArray(bodyden authtoken var mı diye auth token va rmı diye bak);
        // $authToken = $request->query->get('authToken');
        // $sessionToken = $request->getSession()->get('authToken');

        // // Debugging için log ekleyin
        // error_log("Auth Token: $authToken");
        // error_log("Session Token: $sessionToken");

        // if ($authToken && $sessionToken === $authToken) {
        //     return new Response($request->getSession()->get('authToken'), 200);
        // }
        //tokeni al ve kontrol et getsessionstorageden get item yapıcan, aldıktan sonra checkt route
        // controllere istek atıyosun, post olucak authToekn gödnericen. bu arkadaş sessionu kontorl edicek
        //varsa 200 yoksa 404 dönücek. bu fonskyion da 200 dönerse ture else false
        // return new Response($request->getSession()->get('authToken'), 401);
        //return new Response($request->getSession()->get('authToken'), 200);
    }
}
