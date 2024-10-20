<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\API;

use App\Http\ClientFactory;
use App\Http\Defaults;
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

class ApiController extends AbstractController
{
    private ClientFactory $clientFactory;

    public function __construct()
    {
        $this->clientFactory = new ClientFactory();
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route(
        '/_route/api/{route}',
        name: '_api_get',
        requirements: [
            'route' => '.*'
        ],
        methods: [
            'GET', 'POST', 'PATCH', 'DELETE', 'PUT'
        ]
    )]
    public function onAPIRequest(Request $request, string $route): Response
    {
        return match ($request->getMethod())
        {
            'GET' => $this->onGet($request, $route),
            'POST' => $this->onPost($request, $route),
            'PATCH' => $this->onPatch($request, $route),
            'DELETE' => $this->onDelete($request, $route),
            'PUT' => $this->onPut($request, $route),
            default => $this->onInvalidRequestMethod()
        };
    }

    /**
     * @param Request $request
     * @param string $route
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */

    private function onGet(Request $request, string $route): JsonResponse
    {
            return new JsonResponse(
                Defaults::forAPI(
                    $this->clientFactory
                )
                    ->request($route)
                    ->toArray()
            );
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/_api/{route}', name: '_api_post', requirements: ['route' => '.*'], methods: ['POST'])]
    private function onPost(Request $request, string $route): Response
    {
        $data = json_decode($request->getContent(), true);
        
        $contentType = $request->headers->get('Content-Type') ?: 'application/ld+json';
        
        return new JsonResponse(
            Defaults::forAPI($this->clientFactory)
                ->request($route, 'POST', $data, $contentType)
                ->toArray()
        );
    }


    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function onPut(Request $request, string $route): Response
    {
        return new JsonResponse(
            Defaults::forAPI(
                $this->clientFactory
            )
                ->request($route, 'PUT')
                ->toArray()
        );
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function onDelete(Request $request, string $route): Response
    {
        $response = Defaults::forAPI($this->clientFactory)
                    ->request($route, 'DELETE');
        
        if ($response->getStatusCode() === 204) {
            return new JsonResponse(['message' => 'Resource successfully deleted'], 200);
        }
        return new JsonResponse($response->toArray());
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function onPatch(Request $request, string $route): Response
    {
        $data = json_decode($request->getContent(), true);
    
        $contentType = $request->headers->get('Content-Type') ?: 'application/ld+json';
    
        return new JsonResponse(
            Defaults::forAPI($this->clientFactory)
                ->request($route, 'PATCH', $data, $contentType)
                ->toArray()
        );
    }
    

    /**
     * @return Response
     */
    private function onInvalidRequestMethod(): Response
    {
        return new JsonResponse(
            [
                'message' => 'Invalid request method provided',
                'status' => 400
            ],
            400
        );
    }

    #[Route('/api/places', name: 'fetch_places')]
    public function fetchPlaces(Request $request): JsonResponse {
        $page = $request->query->get('page', 1);
        
        $places = Defaults::forAPI($this->clientFactory)
            ->request('api/places?page='.$page)
            ->toArray();

        return new JsonResponse([
            'hydra:member' => $places,
            'totalCount' => 4000
        ]);
    }

}