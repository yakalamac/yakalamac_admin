<?php

namespace App\Service;

use App\Client\YakalaApiClient;
use App\Client\ElasticaClient;

class ProductService
{
    public function __construct(
        private readonly ElasticaClient $elastica,
        private readonly YakalaApiClient $client
    ) {}

    public function getProductsByPlaceId(string $placeId): array
    {
        $query = [
            'query' => [
                'bool' => [
                    'filter' => [
                        'bool' => [
                            'should' => [
                                'nested' => [
                                    'ignore_unmapped' => true,
                                    'path' => 'place',
                                    'query' => [
                                        'bool' => [
                                            'must' => [
                                                'term' => [
                                                    'place.id' => $placeId,
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'size' => 1000
        ];

        $response = $this->elastica->search('product', $query);
        $data = $this->elastica->toArray($response);


        return array_map(function ($product) {
            return [
                'id' => $product['_id'],
                'name' => $product['_source']['name'],
                'active' => $product['_source']['active'],
                'price' => $product['_source']['price'],
                'image' => $product['_source']['logo']['path'] ?? null,
                'rating' => $product['_source']['rating'] ?? 0,
                'options' => $product['_source']['options'] ?? [],
                'categories' => $product['_source']['categories'] ?? [],
                'group' => $product['_source']['groups'] ?? null,
                'createdAt' => $product['_source']['createdAt'] ?? null,
                'hashtags' => array_map(fn($tag) => $tag['tag'], $product['_source']['hashtags'] ?? [])
            ];
        }, $data['hits']['hits'] ?? []);
    }

    public function getProductCategories(): array
    {
        $query = [
            'query' => [
                'match_all' => new \stdClass()
            ],
            'size' => 1000
        ];

        $response = $this->elastica->search('product_category', $query);
        $data = $this->elastica->toArray($response);

        return array_map(function ($category) {
            return [
                'id' => $category['_id'],
                'title' => $category['_source']['title'] ?? null,
                'description' => $category['_source']['description'] ?? null,
            ];
        }, $data['hits']['hits'] ?? []);
    }

    public function getProductGroups(string $placeId): array
    {
        $query = [
            'query' => [
                'match' => [
                    'place' => $placeId
                ]
            ],
            'size' => 1000
        ];

        $response = $this->elastica->search('product_group', $query);
        $data = $this->elastica->toArray($response);

        return array_map(function ($group) {
            return [
                'id' => $group['_id'],
                'title' => $group['_source']['title'] ?? null,
                'description' => $group['_source']['description'] ?? null,
                'priority' => $group['_source']['priority'] ?? 0,
                'category' => $group['_source']['category'] ?? null,
            ];
        }, $data['hits']['hits'] ?? []);
    }

    public function createGroup(string $placeId, string $title, string $description, ?string $categoryId = null): string
    {
        $data = [
            'place' => '/api/places/' . $placeId,
            'title' => $title,
            'description' => $description,
            'category' => $categoryId ? '/api/category/products/' . $categoryId : null,
            'priority' => 0
        ];

        if ($categoryId) {
            $data['category'] = '/api/category/products/' . $categoryId;
        }

        $response = $this->client->post('product/groups', [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
            'json' => $data
        ]);

        return $response->getContent();
    }

    public function updateGroup(string $groupId, int $priority, string $title, ?string $description, ?string $categoryId = null): string
    {
        $data = [
            'title' => $title,
            'priority' => $priority,
        ];

        if ($description) {
            $data['description'] = $description;
        }

        if ($categoryId) {
            $data['category'] = '/api/category/products/' . $categoryId;
        }

        $response = $this->client->patch('product/groups/' . $groupId, [
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
                'Accept' => 'application/json',
            ],
            'json' => $data,
        ]);

        return $response->getContent();
    }

    public function updateProductOrder(string $productId, string $groupId, int $position): string
    {
        $data = [
            'priority' => $position,
            'group' => '/api/product/groups/' . $groupId
        ];

        $response = $this->client->patch('products/' . $productId, [
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
                'Accept' => 'application/json',
            ],
            'json' => $data
        ]);

        return $response->getContent();
    }

    public function updateProductStatus(string $productId, bool $isAvailable): string
    {
        $data = [
            'active' => $isAvailable
        ];

        $response = $this->client->patch('products/' . $productId, [
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
                'Accept' => 'application/json',
            ],
            'json' => $data
        ]);

        return $response->getContent();
    }

    public function updateCategoryOrder(array $categoryOrder): string
    {
        // This would depend on your API structure
        // Assuming you have an endpoint to update multiple categories at once
        $data = [
            'categories' => $categoryOrder
        ];

        $response = $this->client->patch('product/categories/order', [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
            'json' => $data
        ]);

        return $response->getContent();
    }

    public function moveProductToGroup(string $productId, string $groupId): string
    {
        $data = [
            'group' => '/api/product/groups/' . $groupId
        ];

        $response = $this->client->patch('products/' . $productId, [
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
                'Accept' => 'application/json',
            ],
            'json' => $data
        ]);

        return $response->getContent();
    }
}
