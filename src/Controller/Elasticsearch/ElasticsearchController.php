<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Elasticsearch;

use App\Http\ClientFactory;
use App\Service\DataTablesElasticsearchService;
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
use App\Repository\EditedPlaceRepository;
use App\Repository\EditedPlaceCategoryRepository;

class ElasticsearchController extends AbstractController
{
    private ?ClientFactory $clientFactory;
    private ?DataTablesElasticsearchService $dataTablesService;

    public function __construct(
        private readonly EditedPlaceRepository $editedPlaceRepository,
        private readonly EditedPlaceCategoryRepository $editedPlaceCategoryRepository
    ) {
        $this->clientFactory = new ClientFactory($_ENV['ELASTIC_URL']);
        $this->dataTablesService = new DataTablesElasticsearchService($this->clientFactory);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     */
    #[Route("'/_route/elasticsearch/autocomplete'", name: 'elasticsearch', requirements: ['route' => '.*'], methods: ['GET', 'POST'])]
    public function autocomplete(Request $request): JsonResponse
    {
        $searchTerm = $request->query->get('q', '');

        if (strlen($searchTerm) < 2) return new JsonResponse(['results' => []], Response::HTTP_OK);

        $elasticsearchQuery = [
            'query' => [
                'bool' => [
                    'should' => [
                        [
                            'match_phrase_prefix' => [
                                'name' => [
                                    'query' => $searchTerm,
                                    'slop' => 2
                                ]
                            ]
                        ],
                        [
                            'fuzzy' => [
                                'name' => [
                                    'value' => $searchTerm,
                                    'fuzziness' => 'AUTO'
                                ]
                            ]
                        ],
                        [
                            'match' => [
                                'name' => [
                                    'query' => $searchTerm,
                                    'operator' => 'and'
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'size' => 15,
        ];
        
        try {
            $response = $this->clientFactory->request(
                'place/_search',
                'POST',
                $elasticsearchQuery
            );

            if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
                $responseData = $response->toArray(false);
                $hits = $responseData['hits']['hits'] ?? [];

                $results = array_map(function($hit) {
                    $place = $hit['_source'];
                    return [
                        'id' => $place['id'] ?? $hit['_id'],
                        'name' => $place['name'] ?? '',
                        'address' => $place['address']['longAddress'] ?? '',
                    ];
                }, $hits);

                return new JsonResponse(['results' => $results], Response::HTTP_OK);
            } else {
                return new JsonResponse([
                    'message' => 'Error fetching data from Elasticsearch',
                    'code' => $response->getStatusCode(),
                ], $response->getStatusCode());
            }
        } catch (TransportExceptionInterface $e) {
            return new JsonResponse([
                'message' => 'Error communicating with Elasticsearch',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param Request $request
     * @param string|null $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     */
    #[Route('/_route/elasticsearch/{route}', name: 'elasticsearch_routes', requirements: ['route' => '.*'], methods: ['GET', 'POST'])]
    public function get(Request $request, ?string $route = null): Response
{
    $searchTerm = $request->query->get('q', '');
    $size = $request->query->get('size', 15);

    $elasticsearchQuery = [
        'query' => empty($searchTerm) ? ['match_all' => (object)[]] : [
            'bool' => [
                'should' => [
                    [
                        'prefix' => [
                            'name' => $searchTerm
                        ]
                    ],
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
        ],
        'size' => $size,
    ];

    try {
        $response = $this->clientFactory->request($route, 'POST', $elasticsearchQuery);

        if ($response->getStatusCode() < 200 || $response->getStatusCode() > 300) {
            return new JsonResponse([
                'message' => 'Error fetching data from Elasticsearch',
                'code' => $response->getStatusCode(),
            ], $response->getStatusCode());
        }

        $responseData = $response->toArray(false);

        if (empty($searchTerm)) return new JsonResponse($responseData, Response::HTTP_OK);

        if(str_contains($route, 'place/_search')) {
            $hits = $responseData['hits']['hits'] ?? [];
            $results = array_map(function($hit) {
                $place = $hit['_source'];
                return [
                    'id' => $place['id'] ?? $hit['_id'],
                    'text' => ($place['name'] ?? '') . ' - ' . ($place['address']['longAddress'] ?? '')
                    ];
                },
                $hits
            );
        } else {
            $results = $responseData['hits']['hits'] ?? [];
        }


        return new JsonResponse(['results' => $results], Response::HTTP_OK);
    } catch (TransportExceptionInterface $e) {
        return new JsonResponse([
            'message' => 'Error communicating with Elasticsearch',
            'error' => $e->getMessage(),
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
    /**
     * @param Request $request
     * @param string $index
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/_route/datatables/elasticsearch/{index}', name: 'datatables_elasticsearch', requirements: ['index' => '.*'], methods: ['GET', 'POST'])]
    public function datatables(Request $request, string $index): JsonResponse
    {
        $configurations = [
            'place_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'contact_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'icon' => 'icon',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'product_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'menu_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'place_concept_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'place_cuisine_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'place_photo_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'source_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'icon' => 'icon',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'account_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'item_category' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'icon' => 'icon',
                    'title' => 'title',
                    'description' => 'description',
                ],
                'searchFields' => ['title', 'description'],
            ],
            'product_tag' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'tag' => 'tag',
                ],
                'searchFields' => ['tag'],
            ],
            'place_tag' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'tag' => 'tag',
                ],
                'searchFields' => ['tag'],
            ],
            'menu_tag' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'tag' => 'tag',
                ],
                'searchFields' => ['tag'],
            ],
            'product_type' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'type' => 'type',
                    'description' => 'description',
                ],
                'searchFields' => ['type','description'],
            ],
            'menu_type' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'type' => 'type',
                    'description' => 'description',
                ],
                'searchFields' => ['type','description'],
            ],
            'place_type' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'type' => 'type',
                    'description' => 'description',
                ],
                'searchFields' => ['type','description'],
            ],
            'place' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'name' => 'name',
                    'owner' => 'owner',
                    'address' => 'address',
                    'city' => 'city',
                    'district' => 'district',
                    'updatedAt' => 'updatedAt',
                    'createdAt' => 'createdAt',
                    'primaryType' => 'primaryType',
                ],
                'searchFields' => ['name', 'city', 'district'],
            ], 
            'product' => [
                'fieldMappings' => [
                    'id' => 'id',
                    'name' => 'name',
                    'price' => 'price',
                    'active' => 'active',
                    'categories' => 'categories',
                    'createdAt' => 'createdAt',
                    'updatedAt' => 'updatedAt',
                    'place' => 'place',
                ],
                'searchFields' => ['name'],
            ],
        ];

        if (!isset($configurations[$index])) {
            return new JsonResponse([
                'message' => 'Invalid index specified.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $fieldMappings = $configurations[$index]['fieldMappings'];
        $searchFields = $configurations[$index]['searchFields'];
        $city = $request->request->get('city', '');
        $district = $request->request->get('district', '');
        $additionalFilters = [];
        if (!empty($city)) {
            $additionalFilters['city'] = $city;
        }
        if (!empty($district)) {
            $additionalFilters['district'] = $district;
        }
        if ($index === 'place') {
            $response = $this->dataTablesService->handleRequestPlaces($request, $index, $fieldMappings, $searchFields, $additionalFilters);
            $placeIds = array_map(function($place) {
                return $place['id'];
            }, $response['data']);
            if (!empty($placeIds)) {
                $editedPlaces = $this->editedPlaceRepository->createQueryBuilder('e')
                    ->where('e.placeId IN (:placeIds)')
                    ->setParameter('placeIds', $placeIds)
                    ->getQuery()
                    ->getResult();
        
                $editedPlaceIds = array_map(function($editedPlace) {
                    return $editedPlace->getPlaceId();
                }, $editedPlaces);
        
                $editedPlaceCats = $this->editedPlaceCategoryRepository->createQueryBuilder('ec')
                    ->where('ec.placeId IN (:placeIds)')
                    ->setParameter('placeIds', $placeIds)
                    ->getQuery()
                    ->getResult();
        
                $editedPlaceCatIds = array_map(function($editedPlaceCat) {
                    return $editedPlaceCat->getPlaceId();
                }, $editedPlaceCats);
        
                foreach ($response['data'] as &$place) {
                    $place['isEdited'] = in_array($place['id'], $editedPlaceIds);
                    $place['isEditedCat'] = in_array($place['id'], $editedPlaceCatIds);
                }
            }
        }else {
            $response = $this->dataTablesService->handleRequest2($request, $index, $fieldMappings, $searchFields);
        }

        if ($index === 'product') {
            $data = $response['data'];

            $placeIds = array_values(array_unique(array_map(function($product) {
                return (string)$product['place'];
            }, $data)));

            if (!empty($placeIds)) {
                try {
                    $placeResponse = $this->clientFactory->request(
                        'place/_search',
                        'POST',
                        [
                            'query' => [
                                'terms' => [
                                    'id' => $placeIds
                                ]
                            ],
                            '_source' => ['id', 'name']
                        ]
                    );

                    $placeData = $placeResponse->toArray(false);
                    $places = [];
                    if (isset($placeData['hits']['hits'])) {
                        foreach ($placeData['hits']['hits'] as $hit) {
                            $source = $hit['_source'];
                            $places[$source['id']] = $source['name'];
                        }
                    }

                    foreach ($data as &$product) {
                        $placeId = $product['place'];
                        $product['placeName'] = $places[$placeId] ?? $placeId;
                    }
                } catch (Exception $e) {
                    error_log($e->getMessage());
                    foreach ($data as &$product) {
                        $product['placeName'] = 'Bilinmiyor';
                    }
                }
            }

            $response['data'] = $data;
        }

        if (isset($response['error'])) {
            return new JsonResponse($response, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse($response);
    }
}