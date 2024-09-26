<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductAddRequest;
use App\Http\Requests\ProductCategoryAddRequest;
use App\Http\Requests\ProductEditRequest;
use App\Http\Requests\ProductTagAddRequest;
use App\Http\Requests\ProductTypeAddRequest;
use App\Models\Place;
use App\Traits\HttpTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    use HttpTrait;

    public function index()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $products = [];
        $endpoint = '/api/products';

            $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);

            //dd($response);
            if ($response) {
                $responseProducts = $response['hydra:member'];


                $p = 0;

                foreach ($responseProducts as $product) {
                    $products[$p]['data'] = $product;
                    if (!empty($product['place'])) {
                        $placeResponse = $this->httpConnection('application/json', 'get', '/api/places/'.$product['place']['id'] ?? $product['place']['@id'], []);
                        $products[$p]['place'] = $placeResponse;
                    }

                    $p++;
                }

                $total = $response['hydra:totalItems'];

                 $products = ['products' => $products, 'total' => $total];
            }

        return view('admin.products.index', compact('products', 'endpoint', 'page'));
    }

    public function add()
    {
        /** Product Categories */
        $productCategories = $this->httpConnection('application/json', 'get', '/api/category/products', []);

            if ($productCategories) {
                $productCategories = $productCategories['hydra:member'];
            }


        /** Product Types */
        $productTypes = $this->httpConnection('application/json', 'get', '/api/type/products', []);


            if ($productTypes) {
                $productTypes =  $productTypes['hydra:member'];
            }


        /** Product Tags */
        $productTags = $this->httpConnection('application/json', 'get', '/api/tag/products', []);
            if ($productTags) {
                $productTags =  $productTags['hydra:member'];
            }


        return view('admin.products.add', compact('productCategories', 'productTypes', 'productTags'));
    }

    public function edit($uuid)
    {
        $product = null;
        $place = null;
        $productPhotos = [];
        $productOptions = [];
        $placeUuid = 0;
        $savedCategories = [];
        $savedTypes = [];
        $savedTags = [];

        $product =  $this->httpConnection('application/json', 'get', '/api/products/' . $uuid, []);
        
        if (!is_null($product) && $product) {
            if (!empty($product['place'])) {
                $place = explode('/api/places/', $product['place']['@id']);
                $placeUuid = $place[1];
                $place = $this->httpConnection('application/json', 'get', '/api/places/' . $place[1], []);
            }

            /** Categories */
            if (!empty($product['categories'])) {
                foreach ($product['categories'] as $category) {
                    $categoryDetail = $this->httpConnection('application/json', 'get', '/api/category/products/' . $category['id'], []);

                    $savedCategories[] = $categoryDetail['id'];
                }
            }

            /** Types */
            if (!empty($product['types'])) {
                foreach ($product['types'] as $type) {
                    $typeDetail = $this->httpConnection('application/json', 'get', '/api/type/products/' . $type['id'], []);

                    $savedTypes[] = $typeDetail['id'];
                }
            }

            /** Tags */
            if (!empty($product['hashtags'])) {
                foreach ($product['hashtags'] as $type) {
                    $tagDetail = $this->httpConnection('application/json', 'get', '/api/tag/products/' . $type['id'], []);

                    $savedTags[] = $tagDetail['id'];
                }
            }

            /** Photos */
            if (!empty($product['photos'])) {
                $s = 0;
                foreach ($product['photos'] as $photoUrl) {
                    $photoUuid = explode('/api/product_photo/', $photoUrl);
                    $productPhotos[$s] = [
                        'data' => $this->httpConnection('application/json', 'get', $photoUrl, []),
                        'uuid' => $photoUuid[1]
                    ];

                    $s++;
                }
            }

            /** Options */
            if (!empty($product['options'])) {
                $o = 0;
                foreach ($product['options'] as $optionUrl) {
                    $optionUuid = explode('/api/product/option/', $optionUrl['@id']);
                    $productOptions[$o] = [
                        'data' => $this->httpConnection('application/json', 'get', $optionUrl['@id'], []),
                        'uuid' => $optionUuid[1]
                    ];

                    $o++;
                }
            }
            return view('admin.products.edit', compact('uuid', 'placeUuid', 'product', 'place', 'productPhotos', 'productOptions', 'savedCategories', 'savedTypes', 'savedTags'));
        }

        return abort(404, 'Product not found!');
    }

    public function addPost(ProductAddRequest $request)
    {
        $endpoint = '/api/products';

        $save = $this->httpConnection('application/json', 'post', $endpoint, [
            'place' => '/api/places/' . $request->place_id,
            'name' => $request->name,
            'price' => (float)$request->price,
            'description' => $request->description,
            'active' => $request->active == 1 ? true : false
        ]);


        if ($save) {
            $uuid = explode('/api/products/', $save['@id']);

            //Cache::forget('place_products');

            /** Product Categories */
            if (!empty($request->product_category[0])) {
                $c = 0;
                $jsonCategories = [];
                foreach ($request->product_category as $product_category) {
                    $jsonCategories['categories'][] = '/api/category/places/' . $request->product_category[$c];

                    $c++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $uuid[1], $jsonCategories);
            }

            /** Product Types */
            if (!empty($request->place_type[0])) {
                $t = 0;
                $jsonTypes = [];
                foreach ($request->place_type as $place_type) {
                    $jsonTypes['types'][] = '/api/place/types/' . $request->place_type[$t];

                    $t++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $uuid[1], $jsonTypes);
            }

            /** Product Tags */
            if (!empty($request->place_tag[0])) {
                $h = 0;
                $jsonTags = [];
                foreach ($request->place_tag as $place_tag) {
                    $jsonTags['hashtags'][] = '/api/place/tags/' . $request->place_tag[$h];

                    $h++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $uuid[1], $jsonTags);
            }

            /** Options */
            if (!empty($request->option_price[0]) && !is_null($request->option_price[0])) {
                $p = 0;
                foreach ($request->option_price as $option) {
                    $this->httpConnection('application/json', 'post', '/api/product/option', [
                        'product' => '/api/products/' . $uuid[1],
                        'price' => (float)$request->option_price[$p],
                        'description' => $request->option_description[$p],
                        'languageCode' => $request->option_language_code[$p]
                    ]);

                    $p++;
                }

               Cache::forget('place_' . $uuid[1]);
               $place = $this->httpConnection('application/json', 'get', '/api/places/' . $uuid[1], []);
            }

            /** Photos */
            if (!empty($request->file('src')[0]) && !is_null($request->file('src')[0])) {
                $m = 0;
                foreach ($request->file('src') as $file) {
                    $this->httpConnection('multipart/form-data', 'post', '/api/product/' . $uuid[1] . '/image/photos', [
                        'file' => $request->file('src')[$m]->getPathname(),
                        'file_name' => $request->file('src')[$m]->getClientOriginalName()
                    ]);

                    $m++;
                }
            }

            return redirect()->route('admin.products.index')->with('success', 'Ürün Başarıyla Eklenmiştir.');
        }

        return back()->with('error', 'Ürün Eklenememiştir.');
    }

    public function editPost(ProductEditRequest $request)
    {
        $endpoint = '/api/products';
        $save = $this->httpConnection('application/merge-patch+json', 'patch', $endpoint . '/' . $request->uuid, [
            'place' => '/api/places/' . $request->place_id,
            'name' => $request->name,
            'price' => (float)$request->price,
            'description' => $request->description,
            'active' => $request->active == 1 ? true : false
            ]);

        if ($save) {
            //Cache::forget('product_' . $request->uuid);
            /** Product Categories */
            if (!empty($request->product_category[0])) {
                $c = 0;
                $jsonCategories = [];
                foreach ($request->product_category as $product_category) {
                    $jsonCategories['categories'][] = '/api/category/products/' . $request->product_category[$c];

                    $c++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $request->uuid, $jsonCategories);
            } else {
                $jsonCategories['categories'] = '';

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $request->uuid, $jsonCategories);
            }

            /** Product Types */
            if (!empty($request->product_type[0])) {
                $t = 0;
                $jsonTypes = [];
                foreach ($request->product_type as $product_type) {
                    $jsonTypes['types'][] = '/api/type/products/' . $request->product_type[$t];

                    $t++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $request->uuid, $jsonTypes);
            } else {
                $jsonTypes['types'] = '';

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $request->uuid, $jsonTypes);
            }

            /** Product Tags */
            if (!empty($request->product_tag[0])) {
                $h = 0;
                $jsonTags = [];
                foreach ($request->product_tag as $product_tag) {
                    $jsonTags['hashtags'][] = '/api/tag/products/' . $request->product_tag[$h];

                    $h++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $request->uuid, $jsonTags);
            } else {
                $jsonTags['hashtags'] = '';

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/products/' . $request->uuid, $jsonTags);
            }

            /** Options */
            if (!empty($request->option_price[0]) && !is_null($request->option_price[0])) {
                $p = 0;
                foreach ($request->option_price as $option) {
                    $this->httpConnection('application/json', 'post', '/api/product/option', [
                        'product' => '/api/products/' . $request->uuid,
                        'price' => (float)$request->option_price[$p],
                        'description' => $request->option_description[$p],
                        'languageCode' => $request->option_language_code[$p]
                    ]);

                    $p++;
                }

               // Cache::forget('product_options');
                //Cache::forget('place_' . $request->uuid);
            }

            if (!empty($request->edit_option_price)) {
                $e = 0;
                foreach ($request->edit_option_price as $editOption) {
                    $this->httpConnection('application/merge-patch+json', 'patch', '/api/product/option/' . $request->edit_option_uuid[$e], [
                        'product' => '/api/products/' . $request->uuid,
                        'price' => (float)$request->edit_option_price[$e],
                        'description' => $request->edit_option_description[$e],
                        'languageCode' => $request->edit_option_language_code[$e]
                    ]);

                    Cache::forget('product_options');
                    Cache::forget('place_' . $request->uuid);

                    $e++;
                }
            }

            /** Photos */
            if (!empty($request->src[0]) && !is_null($request->src[0])) {
                $m = 0;
                foreach ($request->src as $file) {
                    $this->httpConnection('multipart/form-data', 'post', '/api/product/' . $request->uuid . '/image/photos', [
                        'file' => $request->file('src')[$m]->getPathname(),
                        'file_name' => $request->file('src')[$m]->getClientOriginalName()
                    ]);

                    $m++;
                }
            }

            if (!empty($request->edit_src[0]) && !is_null($request->edit_src[0])) {
                $m = 0;
                foreach ($request->edit_src as $file) {
                    $this->httpConnection('multipart/form-data', 'post', '/api/product/' . $request->uuid . '/image/photos', [
                        'file' => $request->file('edit_src')[$m]->getPathname(),
                        'file_name' => $request->file('edit_src')[$m]->getClientOriginalName()
                    ]);

                    $m++;
                }
            }
            return back()->with('success', 'Ürün Başarıyla Kaydedilmiştir.');
        }

        return back()->with('error', 'Ürün Kaydedilememiştir.');
    }

    public function delete($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/products/' . $uuid, []);

        if ($delete) {
            //Cache::forget('place_products');

            return back()->with('success', 'Ürün Silinmiştir.');
        }

        return back()->with('error', 'Ürün silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function ajax(Request $request)
    {
        $term = trim($request->q);
        if (empty($term)) {
            return response()->json([]);
        }

        $page = request()->get('page') ?? 1;
        $size = 15;
        $total = 0;
        $places = [];
        $endpoint = '/place/_search';

        $response = $this->httpElastica(
            'application/json',
            $endpoint,
            $this->elasticsearchFilter($term, $page, $size)
        );

        if ($response && array_key_exists("hits", $response) && array_key_exists("hits", $response["hits"])) {
            foreach ($response['hits']['hits'] as $place) {
                $places[] = [
                    'id' => $place['_source']['id'],
                    'text' => $place['_source']['name'] . ' - '. (
                        array_key_exists('address',$place['_source'])
                        && $place['_source']['address']
                        && array_key_exists('longAddress',$place['_source']['address'])
                            ? $place['_source']['address']['longAddress'] : 'Adres mevcut değil'
                        )
                ];
            }
        }
        return response()->json($places);
    }

    private function elasticsearchFilter($term, $page, $size)
    {

        if (str_contains($term, ':')) {
            $parts = explode(':', $term);
            if (count($parts) > 1) {
                $filter = $parts[0];
                $query = $parts[1];

                switch ($filter) {
                    case 'isim':
                    case 'ad':
                    case 'adı':
                    case 'adi':
                    case 'ısım':
                        return $this->elasticsearchFilterGenerator('name', $query, $page, $size);
                    case 'mahalle':
                        return $this->elasticsearchFilterGenerator('neighborhood', $query, $page, $size);
                    case 'semt':
                    case 'ilçe':
                    case 'ilce':
                        return $this->elasticsearchFilterGenerator('district', $query, $page, $size);
                    case 'sehir':
                    case 'şehir':
                    case 'il':
                    case 'ıl':
                    return $this->elasticsearchFilterGenerator('city', $query, $page, $size);
                    case 'posta':
                    case 'posta kodu':
                    case 'pk':
                    case 'kod':
                    case 'post':
                    case 'pkodu':
                    return $this->elasticsearchFilterGenerator('postal_code', $query, $page, $size);
                    case 'level3':
                    case 'sokak':
                    case 'sk':
                        return $this->elasticsearchFilterGenerator('street', $query, $page, $size);
                    case 'adres':
                    case 'address':
                    case 'adr':
                        return $this->elasticsearchFilterGenerator('default', $query, $page, $size);

                }
            }
        }
        return [
            "query" => [
                "query_string" => [
                    "query" => $term,
                    "fuzziness" => "AUTO",
                    "analyze_wildcard" => true
                ]
            ],
            "from" => ($page - 1) * $size, // Pagination
            "size" => $size // Number of results per page
        ];
    }


    private function elasticsearchFilterGenerator($field, $query, $page, $size): array
    {
        switch ($field) {
            case 'name':
                return [
                    "query" => [
                        "nested" => [
                            "path" => "place",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "place.name" => "*$query*"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];
            case 'district':
                return [
                    "query" => [
                        "nested" => [
                            "path" => "addressComponents",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "addressComponents.longText" => "*$query*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "administrative_area_level_2"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "political"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];

            case 'city':
                return [
                    "query" => [
                        "nested" => [
                            "path" => "addressComponents",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "addressComponents.longText" => "*$query*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "administrative_area_level_1"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];
            case 'street':
                return [
                    "query" => [
                        "nested" => [
                            "path" => "addressComponents",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "addressComponents.longText" => "*$query*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "administrative_area_level_3"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "political"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];
            case 'postal_code':
                return [
                    "query" => [
                        "nested" => [
                            "path" => "addressComponents",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "addressComponents.longText" => "*$query*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "postal_code"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];
            case 'neighborhood':
                return [
                    "query" => [
                        "nested" => [
                            "path" => "addressComponents",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "addressComponents.longText" => "*$query*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "administrative_area_level_4"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.types" => "political"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];
            default:
                return [
                    "query" => [
                        "nested" => [
                            "path" => "addressComponents",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "addressComponents.longText" => "*$query*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "addressComponents.shortText" => "*$query*"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination
                    "size" => $size // Number of results per page
                ];
        }
    }

    public function search()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $products = [];
        $endpoint = '/api/products';

        Cache::flush();

        $products = Cache::remember('place_products_searchs_' . request()->get('query') . '_' . $page, 125000, function () use ($endpoint) {
            $response = $this->httpConnection('application/json', 'get', $endpoint, ['search' => request()->get('query')]);
            if ($response) {
                $responseProducts = $response['hydra:member'];
                $products = [];
                $p = 0;

                foreach ($responseProducts as $product) {
                    $products[$p]['data'] = $product;
                    if (!empty($product['place'])) {
                        $placeResponse = $this->httpConnection('application/json', 'get', $product['place']['@id'], []);
                        $products[$p]['place'] = $placeResponse;
                    }

                    $p++;
                }

                $total = $response['hydra:totalItems'];

                return ['products' => $products, 'total' => $total];
            }
        });

        return view('admin.products.index', compact('products', 'total', 'endpoint', 'page'));
    }

    public function categories()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $categories = [];
        $endpoint = '/api/category/products';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $categories = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.products.categories', compact('categories', 'total', 'endpoint', 'page'));
    }

    public function types()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $types = [];
        $endpoint = '/api/type/products';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $types = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.products.types', compact('types', 'total', 'endpoint', 'page'));
    }

    public function tags()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $tags = [];
        $endpoint = '/api/tag/products';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $tags = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.products.tags', compact('tags', 'total', 'endpoint', 'page'));
    }

    public function addCategory()
    {
        return view('admin.products.add_category');
    }

    public function addType()
    {
        return view('admin.products.add_type');
    }

    public function addTag()
    {
        return view('admin.products.add_tag');
    }

    public function editCategory($uuid)
    {
        $endpoint = '/api/category/products/' . $uuid;
        $category = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.products.edit_category', compact('uuid', 'endpoint', 'category'));
    }

    public function editType($uuid)
    {
        $endpoint = '/api/type/products/' . $uuid;
        $type = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.products.edit_type', compact('uuid', 'endpoint', 'type'));
    }

    public function editTag($uuid)
    {
        $endpoint = '/api/tag/products/' . $uuid;
        $tag = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.products.edit_tag', compact('uuid', 'endpoint', 'tag'));
    }

    public function addProductCategory(ProductCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/category/products', [
            'title' => $request->title,
            'description' => $request->description
        ]);

        if ($save) {
            return back()->with('success', 'Kategori başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Kategori eklenememiştir.');
    }

    public function addProductType(ProductTypeAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/type/products', [
            'type' => $request->type,
            'description' => $request->description
        ]);

        if ($save) {
            return back()->with('success', 'Tür başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Tür eklenememiştir.');
    }

    public function addProductTag(ProductTagAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/tag/products', [
            'tag' => $request->tag
        ]);

        if ($save) {
            return back()->with('success', 'Etiket başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Etiket eklenememiştir.');
    }

    public function editProductCategory(ProductCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/category/products/' . $request->uuid, [
            'title' => $request->title,
            'description' => $request->description
        ]);

        if ($save) {
            return back()->with('success', 'Kategori başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Kategori kaydedilememiştir.');
    }

    public function editProductType(ProductTypeAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/type/products/' . $request->uuid, [
            'type' => $request->type,
            'description' => $request->description
        ]);

        if ($save) {
            return back()->with('success', 'Tür başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Tür kaydedilememiştir.');
    }

    public function editProductTag(ProductTagAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/tag/products/' . $request->uuid, [
            'tag' => $request->tag
        ]);

        if ($save) {
            return back()->with('success', 'Etiket başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Etiket kaydedilememiştir.');
    }

    public function deleteCategory($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/category/products/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Kategori Silinmiştir.');
        }

        return back()->with('error', 'Kategori silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deleteType($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/type/products/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Tür Silinmiştir.');
        }

        return back()->with('error', 'Tür silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deleteTag($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/tag/products/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Etiket Silinmiştir.');
        }

        return back()->with('error', 'Etiket silinirken sorun oluştu. Tekrar deneyiniz!');
    }
}
