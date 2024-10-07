<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Elasticsearch;

use App\Http\ClientFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ElasticsearchController extends AbstractController
{
    private ?ClientFactory $clientFactory;

    public function __construct()
    {
        $this->clientFactory = new ClientFactory('https://es.yaka.la');
    }

    /**
     * @param Request $request
     * @param string|null $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws  RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/_elasticsearch/{route}', name: 'elasticsearch', requirements: ['route' => '.*'], methods: ['GET', 'POST'])]
    public function get(Request $request, ?string $route = null): Response
    {
        error_log(print_r($request->query->all(), true));
        $this->clientFactory
            ->options()
            ->setQuery(
                $request->query->all()
            );

        if($request->isMethod('POST'))
            $this->clientFactory
                ->options()
                ->setBody(
                    $request->getContent()
                );

        $response = $this->clientFactory
            ->request(
                $route
            );

        if($response->getStatusCode() > 199 && $response->getStatusCode() < 300)
            return new JsonResponse(
                $response
                  ->toArray(),
                $response->getStatusCode()
            );

        return new JsonResponse(
            [
                'message' => $response->getContent(false),
                'headers' => $response->getHeaders(false),
                'code' => $response->getStatusCode(),
                'status' => $response->getInfo('http_code')
            ],
            300
        );
    }
}