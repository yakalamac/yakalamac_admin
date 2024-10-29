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
    #[Route('/_route/elasticsearch/{route}', name: 'elasticsearch', requirements: ['route' => '.*'], methods: ['GET', 'POST'])]
    public function get(Request $request, ?string $route = null): Response
    {
        // This area is going to be changed
        if($request->getMethod() === 'GET')
        {
            $this->clientFactory->options()->setQuery($request->query->all());
            return new JsonResponse($this->clientFactory->requestS(
                '/'.$route
            )->toArray(false), 200);
        }
        $searchTerm = $request->query->get('q');

        if (empty($searchTerm)) {
            return new JsonResponse([], 200);
        }

        $elasticsearchQuery = [
            'query' => [
                'bool' => [
                    'should' => [
                        [
                            'prefix' => [
                                'name' => $searchTerm
                            ]
                        ],
                        // benzer verileri aramak için, mesela: "Gür" sorgusunda "gar" verisi de gelir. 
                        [
                            'fuzzy' => [
                                'name' => [
                                    'value' => $searchTerm,
                                    'fuzziness' => 'AUTO'
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->clientFactory->request(
            $route, 
            'POST',
            $elasticsearchQuery
        );

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            $places = $response->toArray()['hits']['hits'];
            return new JsonResponse(array_map(function($place) {
                return [
                    'id' => $place['_id'],
                    'name' => $place['_source']['name'],
                    'address' => $place['_source']['address']['longAddress']
                ];
            }, $places));
        }

        return new JsonResponse(
            [
                'message' => $response->getContent(false),
                'code' => $response->getStatusCode(),
            ],
            $response->getStatusCode()
        );
    }
}