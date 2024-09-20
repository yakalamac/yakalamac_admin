<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlaceAddRequest;
use App\Http\Requests\PlaceCategoryAddRequest;
use App\Http\Requests\PlaceEditRequest;
use App\Http\Requests\PlaceTagAddRequest;
use App\Http\Requests\PlaceTypeAddRequest;
use App\Traits\HttpTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PlaceController extends Controller
{
    use HttpTrait;

    public function index()
    {
        $endpoint = '/api/places';
        $page = request()->get('page') ?? 1;
        $total = 0;
        $places = [];

        if (($search = request()->get('addressSearch'))) {
            $size = 15; // Adjust pagination size

            $response = $this->httpElastica(
                'application/json',
                '/place/_search',
                [
                    "query" => [
                        "nested" => [
                            "path" => "address",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "address.shortAddress" => "*$search*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "address.longAddress" => "*$search*"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination,
                    "size" => $size
                ]
            );

            if (array_key_exists('hits', $response) && array_key_exists('hits', $response['hits']))
                foreach ($response['hits']['hits'] as $hit) {
                    $places[] = $hit['_source'];
                }

            $total = $response['hits']['total']['value'];
        } else {

            $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
            if ($response) {
                $places = $response['hydra:member'];
                $total = $response['hydra:totalItems'];
            }
        }
        return view('admin.places.index', compact('places', 'total', 'endpoint', 'page'));
    }

    public function categories()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $categories = [];
        $endpoint = '/api/category/places';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $categories = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.places.categories', compact('categories', 'total', 'endpoint', 'page'));
    }

    public function types()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $types = [];
        $endpoint = '/api/type/places';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $types = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.places.types', compact('types', 'total', 'endpoint', 'page'));
    }

    public function tags()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $tags = [];
        $endpoint = '//api/tag/places';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $tags = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.places.tags', compact('tags', 'total', 'endpoint', 'page'));
    }

    public function photoCategories()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $categories = [];
        $endpoint = '/api/category/place/photos';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $categories = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.places.photo_categories', compact('categories', 'total', 'endpoint', 'page'));
    }

    public function add()
    {
        $categories = [];
        $placeCategories = [];
        $placeTypes = [];
        $placeTags = [];
        $photoCategories = [];

        /** Accounts */
        $accounts =  Cache::remember('accounts', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/category/accounts', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Categories */
        $categories =  Cache::remember('categories', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/category/sources', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Photo Categories */
        $photoCategories =  Cache::remember('place_photo_categories', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/category/place/photos', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Place Categories */
        $placeCategories =  Cache::remember('place_categories_category', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/category/places', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Place Types */
        $placeTypes =  Cache::remember('place_types', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/type/places', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Place Tags */
        $placeTags =  Cache::remember('place_tags', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '//api/tag/places', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        return view('admin.places.add', compact('accounts', 'categories', 'placeCategories', 'photoCategories', 'placeTypes', 'placeTags'));
    }

    public function addCategory()
    {
        return view('admin.places.add_category');
    }

    public function addPhotoCategory()
    {
        return view('admin.places.add_photo_category');
    }

    public function addType()
    {
        return view('admin.places.add_type');
    }

    public function addTag()
    {
        return view('admin.places.add_tag');
    }

    public function edit($uuid)
    {
        $endpoint = '/api/places/' . $uuid;
        $openingHours = [];
        $photos = [];
        $addressUuid = [];
        $hourUuid = [];
        $logoUuid = [];
        $optionsUuid = [];
        $logo = '';
        $address = '';
        $openingHours = [];
        $options = [];
        $photos = [];
        $sources = [];
        $savedCategories = [];
        $savedTypes = [];
        $savedTags = [];
        $placeAccounts = [];
        $photoCategories = [];

        $place =  $this->httpConnection('application/json', 'get', $endpoint, []);


        /**
        Categories Cache::remember('categories', 125000, function () {
         **/
        $categories = [];
        $response = $this->httpConnection('application/json', 'get', '/api/category/sources', []);
        if ($response) {
            $categories = $response['hydra:member'];
            //return $response['hydra:member'];
        }
        //});

        /** Place Categories */
        $placeCategories =  Cache::remember('place_categories_category', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/category/places', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Photo Categories */
        $photoCategories =  Cache::remember('place_photo_categories_' . $uuid, 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/category/place/photos', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Place Types */
        $placeTypes =  Cache::remember('place_types', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '/api/type/places', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Place Tags */
        $placeTags =  Cache::remember('place_tags', 125000, function () {
            $response = $this->httpConnection('application/json', 'get', '//api/tag/places', []);
            if ($response) {
                return $response['hydra:member'];
            }
        });

        /** Accounts */
        $accounts =  $this->httpConnection('application/json', 'get', '/api/category/accounts', []);
            if ($accounts) {
                $accounts = $accounts['hydra:member'];
            }
     

        if ($place) {
            /** Source */
            Cache::flush();
            if (!empty($place['sources'])) {
                $sources =  Cache::remember('place_sources_' . $uuid, 125000, function () use ($place) {
                    $s = 0;
                    foreach ($place['sources'] as $sourceUrl) {
                        if (is_array($place['sources'])) {
                            $sourceUuid = explode('/api/place/sources/', $sourceUrl['@id']);
                            $sourceUri = $sourceUrl['@id'];
                        } else {
                            $sourceUuid = explode('/api/place/sources', $sourceUrl);
                            $sourceUri = $place['sources'];
                        }

                        $sources[$s] = [
                            'uuid' => $sourceUuid[1]
                        ];

                        $sourceDetail = $this->httpConnection('application/json', 'get', $sourceUri, []);
                        if ($sourceDetail) {
                            $category = $this->httpConnection('application/json', 'get', $sourceDetail['category'], []);

                            $sources[$s]['data'] = [
                                'source' => $sourceDetail,
                                'category' => $category
                            ];
                        }

                        $s++;
                    }
                    return $sources;
                });
            }
            /** Logo */
            if (!empty($place['logo'])) {
                if (is_array($place['logo'])) {
                    $logoUuid = explode('/api/place/logos/', $place['logo']['@id']);
                    $logoUri = $place['logo']['@id'];
                } else {
                    
                    $logoUuid = explode('/api/place/logos/', $place['logo']);
                    $logoUri = $place['logo'];
                }

                $logo =  Cache::remember('place_logo_' . $uuid, 125000, function () use ($logoUri) {
                    return $this->httpConnection('application/json', 'get', $logoUri, []);
                });
            }


            /** Categories */
            if (!empty($place['categories'])) {
                foreach ($place['categories'] as $category) {
                    $categoryDetail = $this->httpConnection('application/json', 'get', '/api/category/places/' . $category['id'], []);

                    $savedCategories[] = $categoryDetail['id'];
                }
            }

            /** Types */
            if (!empty($place['types'])) {
                foreach ($place['types'] as $type) {
                    $typeDetail = $this->httpConnection('application/json', 'get', '/api/type/places/' . $type['id'], []);

                    $savedTypes[] = $typeDetail['id'];
                }
            }

            /** Tags */
            if (!empty($place['hashtags'])) {
                foreach ($place['hashtags'] as $type) {
                    $tagDetail = $this->httpConnection('application/json', 'get', '//api/tag/places/' . $type['id'], []);

                    $savedTags[] = $tagDetail['id'];
                }
            }

            /** Address */
            if (!empty($place['address'])) {
                if (is_array($place['address'])) {
                    $addressUuid = explode('/api/place_addresses/', $place['address']['@id']);
                    $adddressUri = $place['address']['@id'];
                } else {
                    $addressUuid = explode('/api/place_addresses/', $place['address']);
                    $adddressUri = $place['address'];
                }

                $address = Cache::remember('place_addresses_' . $uuid, 125000, function () use ($adddressUri) {
                    return $this->httpConnection('application/json', 'get', $adddressUri, []);
                });
            }

            /** Opening Hours */
            if (!empty($place['openingHours'])) {
                $openingHours = Cache::remember('place_opening_hours_' . $uuid, 125000, function () use ($place) {
                    $m = 0;
                    foreach ($place['openingHours'] as $hourUrl) {
                        if (is_array($place['openingHours'])) {
                            $hourUuid = explode('/api/place/opening-hours', $hourUrl['@id']);
                            $hourUri = $hourUrl['@id'];
                        } else {
                            $hourUuid = explode('/api/place/opening-hours', $hourUrl);
                            $hourUri = $hourUrl;
                        }

                        $hours[$m] = [
                            'hour' => $this->httpConnection('application/json', 'get', $hourUri, []),
                            'uuid' => $hourUuid[1]
                        ];

                        $m++;
                    }

                    return $hours;
                });
            }

            /** Accounts */
            if (!empty($place['accounts'])) {
                foreach ($place['accounts'] as $account) {
                    if (is_array($place['accounts'])) {
                        $accountsUuid = explode('/api/place/accounts/', $account['@id']);
                        $accountsUri = $account['@id'];
                    } else {
                        $accountsUuid = explode('/api/place/accounts/', $place['accounts']);
                        $accountsUri = $place['accounts'];
                    }

                    $placeAccounts[] = $this->httpConnection('application/json', 'get', $accountsUri, []);
                }
            }

            /** Options */
            if (!empty($place['options'])) {
                if (is_array($place['options'])) {
                    $optionsUuid = explode('/api/place/options/', $place['options']['@id']);
                    $optionsUri = $place['options']['@id'];
                } else {
                    $optionsUuid = explode('/api/place/options/', $place['options']);
                    $optionsUri = $place['options'];
                }

                $options = Cache::remember('place_options_' . $uuid, 125000, function () use ($optionsUri) {
                    return $this->httpConnection('application/json', 'get', $optionsUri, []);
                });
            }
            /** Photos */
            if (!empty($place['photos'])) {
                $s = 0;
                foreach ($place['photos'] as $photoUrl) {
                    if (is_array($photoUrl)) {
                        $photoUuid = explode('/api/place/photos/', $photoUrl['@id']);
                        $photoUri = $photoUrl['@id'];
                    } else {
                        $photoUuid = explode('/api/place/photos/', $photoUrl);
                        $photoUri = $photoUrl;
                    }
                    $photos[$s] = [
                        'data' => $this->httpConnection('application/json', 'get', $photoUri, []),
                        'uuid' => $photoUuid[1]
                    ];

                    $s++;
                }
            }
        }
        return view('admin.places.edit', compact('uuid', 'place', 'accounts', 'sources', 'categories',  'address', 'openingHours', 'logo', 'options', 'photos', 'endpoint', 'logoUuid', 'addressUuid', 'optionsUuid', 'placeCategories', 'placeTypes', 'placeTags', 'photoCategories', 'savedCategories', 'savedTypes', 'savedTags', 'placeAccounts'));
    }

    public function editCategory($uuid)
    {
        $endpoint = '/api/category/places/' . $uuid;
        $category = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_category', compact('uuid', 'endpoint', 'category'));
    }

    public function editPhotoCategory($uuid)
    {
        $endpoint = '/api/category/place/photos/' . $uuid;
        $category = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_photo_category', compact('uuid', 'endpoint', 'category'));
    }

    public function editType($uuid)
    {
        $endpoint = '/api/type/places/' . $uuid;
        $type = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_type', compact('uuid', 'endpoint', 'type'));
    }

    public function editTag($uuid)
    {
        $endpoint = '//api/tag/places/' . $uuid;
        $tag = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_tag', compact('uuid', 'endpoint', 'tag'));
    }

    public function addPost(PlaceAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/places', [
            'name' => $request->name,
            'owner' => $request->owner == 1 ? true : false,
            'totalRating' => (float) $request->total_rating,
            'rating' => (float) $request->rating,
            'userRatingCount' => (int) $request->user_rating_count,
            //'googleMapsUri' => $request->google_maps_uri
        ]);

        if ($save) {
            $uuid = explode('/api/places/', $save['@id']);

            /** Place Categories */
            if (!empty($request->place_category[0])) {
                $c = 0;
                $jsonCategories = [];
                foreach ($request->place_category as $place_category) {
                    $jsonCategories['categories'][] = '/api/category/places/' . $request->place_category[$c];

                    $c++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $uuid[1], $jsonCategories);
            }

            /** Place Types */
            if (!empty($request->place_type[0])) {
                $t = 0;
                $jsonTypes = [];
                foreach ($request->place_type as $place_type) {
                    $jsonTypes['types'][] = '/api/type/places/' . $request->place_type[$t];

                    $t++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $uuid[1], $jsonTypes);
            }

            /** Place Tags */
            if (!empty($request->place_tag[0])) {
                $h = 0;
                $jsonTags = [];
                foreach ($request->place_tag as $place_tag) {
                    $jsonTags['hashtags'][] = '//api/tag/places/' . $request->place_tag[$h];

                    $h++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $uuid[1], $jsonTags);
            }

            /** Sources */
            if (!empty($request->category[0])) {
                $s = 0;
                foreach ($request->category as $category) {
                    $this->httpConnection('application/json', 'post', '/api/place/sources', [
                        'sourceUrl' => $request->source_url[$s],
                        'sourceId' => $request->source_id[$s],
                        'category' => '/api/category/sources/' . $request->category[$s],
                        'place' => '/api/places/' . $uuid[1]
                    ]);

                    $s++;
                }
            }

            /** Accounts */
            if (!empty($request->account_category[0])) {
                $s = 0;
                foreach ($request->account_category as $account_category) {
                    $this->httpConnection('application/json', 'post', '/api/place/accounts', [
                        'src' => $request->account_src[$s],
                        'priority' => (int) $request->account_priority[$s],
                        'category' => '/api/category/accounts/' . $request->account_category[$s],
                        'place' => '/api/places/' . $uuid[1]
                    ]);

                    $s++;
                }
            }

            /** Address */
            if (!empty($request->short_address)) {
                $this->httpConnection('application/json', 'post', '/api/place_addresses', [
                    //'place' => '/api/places/'.$uuid[1],
                    'shortAddress' => $request->short_address,
                    'longAddress' => $request->long_address
                ]);
            }

            /** Opening Hours */
            if (!empty($request->open[0]) && !is_null($request->open[0])) {
                $o = 0;
                foreach ($request->open as $hour) {
                    $s = $this->httpConnection('application/json', 'post', '/api/place/opening-hours', [
                        'place' => '/api/places/' . $uuid[1],
                        'open' => $request->open[$o],
                        'close' => $request->close[$o],
                        'day' => (int) $request->day[$o],
                        'dayText' => $request->day_text[$o],
                        'languageCode' => $request->language_code[$o],
                        'description' => $request->description[$o]
                    ]);

                    $o++;
                }
            }

            /** Logo */
            if (!empty($request->logo_src)) {
                $this->httpConnection('multipart/form-data', 'post', '/api/place/' . $uuid[1] . '/image/logos', [
                    'file' => $request->file('logo_src')->getPathname(),
                    'file_name' => $request->file('logo_src')->getClientOriginalName()
                ]);
            }

            /** Options */
            if ($request->allows_dogs == 0 || $request->allows_dogs == 1) {
                $this->httpConnection('application/json', 'post', '/api/place/options', [
                    'place' => '/api/places/' . $uuid[1],
                    'allowsDogs' => $request->allows_dogs == 1 ? true : false,
                    'curbsidePickup' => $request->curbside_pickup == 1 ? true : false,
                    'delivery' => $request->delivery == 1 ? true : false,
                    'dine_In' => $request->dine_in == 1 ? true : false,
                    'editorialSummary' => $request->editorial_summary == 1 ? true : false,
                    'goodForChildren' => $request->good_for_children == 1 ? true : false,
                    'goodForGroups' => $request->good_for_groups == 1 ? true : false,
                    'goodForWatchingSports' => $request->good_for_watching_sports == 1 ? true : false,
                    'liveMusic' => $request->live_music == 1 ? true : false,
                    'takeout' => $request->takeout == 1 ? true : false,
                    'menuForChildren' => $request->menu_for_children == 1 ? true : false,
                    'servesVegetarianFood' => $request->serves_vegetarian_food == 1 ? true : false,
                    'outdoorSeating' => $request->outdoor_seating == 1 ? true : false,
                    'servesWine' => $request->serves_wine == 1 ? true : false,
                    'reservable' => $request->reservable == 1 ? true : false,
                    'servesLunch' => $request->serves_lunch == 1 ? true : false,
                    'servesDinner' => $request->serves_dinner == 1 ? true : false,
                    'servesDesserts' => $request->serves_desserts == 1 ? true : false,
                    'servesCoffee' => $request->serves_coffee == 1 ? true : false,
                    'servesCocktails' => $request->serves_cocktails == 1 ? true : false,
                    'servesBrunch' => $request->serves_brunch == 1 ? true : false,
                    'servesBreakfast' => $request->serves_breakfast == 1 ? true : false,
                    'servesBeer' => $request->serves_beer == 1 ? true : false
                ]);
            }
            /** Photos */
            if (!empty($request->src[0]) && !is_null($request->src[0])) {
                $m = 0;
                foreach ($request->src as $source) {
                    $this->httpConnection('multipart/form-data', 'post', '/api/place/' . $uuid[1] . '/image/photos', [
                        'file' => $request->file('src')[$m]->getPathname(),
                        'category' => (int) $request->photo_category[$m],
                        'caption' => $request->caption[$m],
                        'showOnBanner' => $request->photo_banner[$m] == 1 ? true : false,
                        'file_name' => $request->file('src')[$m]->getClientOriginalName()
                    ]);
                    $m++;
                }
            }
            return back()->with('success', 'İşletme Başarıyla Kaydedilmiştir.');
        }
        return back()->with('error', 'İşletme Kaydedilememiştir.');
    }

    public function addPostCategory(PlaceCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/category/places', [
            'title' => $request->title,
            'description' => $request->description
        ]);

        if ($save) {
            Cache::forget('place_categories_category');

            return back()->with('success', 'Kategori başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Kategori eklenememiştir.');
    }

    public function addPostPhotoCategory(PlaceCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/category/place/photos', [
            'title' => $request->title,
            'description' => $request->description
        ]);

        if ($save) {
            Cache::forget('place_photo_categories');

            return back()->with('success', 'Kategori başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Kategori eklenememiştir.');
    }

    public function addPostType(PlaceTypeAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/type/places', [
            'type' => $request->type,
            'description' => $request->description
        ]);

        if ($save) {
            return back()->with('success', 'Tür başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Tür eklenememiştir.');
    }

    public function addPostTag(PlaceTagAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '//api/tag/places', [
            'tag' => $request->tag
        ]);

        if ($save) {
            return back()->with('success', 'Etiket başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Etiket eklenememiştir.');
    }

    public function editPost(PlaceEditRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, [
            'name' => $request->name,
            'owner' => $request->owner == 1 ? true : false,
            'totalRating' => (float) $request->total_rating,
            'rating' => (float) $request->rating,
            'userRatingCount' => (int) $request->user_rating_count,
            'googleMapsUri' => $request->google_maps_uri
        ]);
        if ($save) {
            Cache::forget('place_' . $request->uuid);

            /** Place Categories */
            if (!empty($request->place_category[0])) {
                $c = 0;
                $jsonCategories = [];
                foreach ($request->place_category as $place_category) {
                    $jsonCategories['categories'][] = '/api/category/places/' . $request->place_category[$c];

                    $c++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, $jsonCategories);
            } else {
                $jsonCategories['categories'] = '';

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, $jsonCategories);
            }

            /** Place Types */
            if (!empty($request->place_type[0])) {
                $t = 0;
                $jsonTypes = [];
                foreach ($request->place_type as $place_type) {
                    $jsonTypes['types'][] = '/api/type/places/' . $request->place_type[$t];

                    $t++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, $jsonTypes);
            } else {
                $jsonTypes['types'] = '';

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, $jsonTypes);
            }

            /** Place Tags */
            if (!empty($request->place_tag[0])) {
                $h = 0;
                $jsonTags = [];
                foreach ($request->place_tag as $place_tag) {
                    $jsonTags['hashtags'][] = '//api/tag/places/' . $request->place_tag[$h];

                    $h++;
                }

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, $jsonTags);
            } else {
                $jsonTags['hashtags'] = '';

                $this->httpConnection('application/merge-patch+json', 'patch', '/api/places/' . $request->uuid, $jsonTags);
            }

            /** Sources */
            if ($request->is_edited_source == 1) {
                if ($request->edit_category && is_array($request->edit_category)) {
                    $place = $this->httpConnection('application/json', 'get', '/api/places/' . $request->uuid, null);
                    if ($place) {
                        if (array_key_exists('sources', $place) && is_array($place['sources'])) {
                            foreach ($place['sources'] as $source) {
                                $this->httpConnection(
                                    'application/json',
                                    'delete',
                                    key_exists('@id', $source) ?
                                        $source['@id']
                                        : '/api/place/sources' . $source['id'],
                                    null
                                );
                            }
                        }

                        foreach ($request->edit_category as $key => $category) {
                            if (
                                empty($request->edit_source_url[$key]) || empty($request->edit_source_id[$key])
                                || empty($request->edit_category[$key])
                            )
                                continue;

                            $this->httpConnection(
                                'application/json',
                                'post',
                                '/api/place/sources',
                                [
                                    'sourceUrl' => $request->edit_source_url[$key],
                                    'sourceId' => $request->edit_source_id[$key],
                                    'category' => '/api/category/sources/' . $request->edit_category[$key],
                                    'place' => '/api/places/' . $request->uuid
                                ]
                            );
                        }
                    }
                }

                if (!empty($request->edit_category[0])) {
                    $s = 0;
                    foreach ($request->edit_category as $editCategory) {
                        if (!empty($request->edit_source_url[$s]) && !empty($request->edit_source_id[$s])) {

                            $this->httpConnection('application/merge-patch+json', 'patch', '/api/place/sources/' . $request->edit_source_uuid[$s], [
                                'sourceUrl' => $request->edit_source_url[$s],
                                'sourceId' => $request->edit_source_id[$s],
                                'category' => '/api/category/places/' . $request->edit_category[$s],
                                'place' => '/api/places/' . $request->uuid
                            ]);
                        }
                        $s++;
                    }
                }

                Cache::forget('place_sources_' . $request->uuid);
            }

            /** Accounts */
            if ($request->is_edited_account == 1) {
                if (!empty($request->account_category[0])) {
                    $s = 0;
                    foreach ($request->account_category as $account_category) {
                        $this->httpConnection('application/json', 'post', '/api/place/accounts', [
                            'src' => $request->account_src[$s],
                            'priority' => (int) $request->account_priority[$s],
                            'category' => '/api/category/accounts/' . $request->account_category[$s],
                            'place' => '/api/places/' . $request->uuid
                        ]);

                        $s++;
                    }

                    Cache::forget('place_accounts_place_' . $request->uuid);
                }

                if (!empty($request->edit_account_category[0])) {
                    $s = 0;
                    foreach ($request->edit_account_category as $edit_account_category) {
                        $this->httpConnection('application/merge-patch+json', 'patch', '/api/place/accounts/' . $request->edit_account_uuid[$s], [
                            'src' => $request->edit_account_src[$s],
                            'priority' => (int) $request->edit_account_priority[$s],
                            'category' => '/api/category/accounts/' . $request->edit_account_category[$s],
                            'place' => '/api/places/' . $request->uuid
                        ]);

                        $s++;
                    }

                    Cache::forget('place_accounts_place_' . $request->uuid);
                }
            }

            /** Address */
            if (!empty($request->short_address)) {
                if (!empty($request->address_uuid)) {
                    $this->httpConnection('application/merge-patch+json', 'patch', '/api/place_addresses/' . $request->address_uuid, [
                        'shortAddress' => $request->short_address,
                        'longAddress' => $request->long_address
                    ]);

                    Cache::forget('place_addresses_' . $request->uuid);
                } else {
                    $this->httpConnection('application/json', 'post', '/api/place_addresses', [
                        //'place' => '/api/places/'.$request->uuid,
                        'shortAddress' => $request->short_address,
                        'longAddress' => $request->long_address
                    ]);

                    Cache::forget('place_addresses_' . $request->uuid);
                }
            }

            /** Opening Hours */
            if ($request->is_set_hours == 1) {
                if (!empty($request->open[0]) && !is_null($request->open[0])) {
                    $o = 0;
                    foreach ($request->open as $hour) {
                        $s = $this->httpConnection('application/json', 'post', '/api/place/opening-hours', [
                            'place' => '/api/places/' . $request->uuid,
                            'open' => $request->open[$o],
                            'close' => $request->close[$o],
                            'day' => (int) $request->day[$o],
                            'dayText' => $request->day_text[$o],
                            'languageCode' => $request->language_code[$o],
                            'description' => $request->description[$o]
                        ]);

                        $o++;
                    }

                    Cache::forget('place_opening_hours_' . $request->uuid);
                }
            }

            if ($request->is_edited_hours == 1) {
                if (!empty($request->edit_open)) {
                    $e = 0;
                    foreach ($request->edit_open as $editSource) {
                        $this->httpConnection('application/merge-patch+json', 'patch', '/api/place/opening-hours/' . $request->edit_hour_uuid[$e], [
                            'open' => $request->edit_open[$e],
                            'close' => $request->edit_close[$e],
                            'day' => (int) $request->edit_day[$e],
                            'dayText' => $request->edit_day_text[$e],
                            'languageCode' => $request->edit_language_code[$e],
                            'description' => $request->edit_description[$e]
                        ]);

                        $e++;
                    }

                    Cache::forget('place_opening_hours_' . $request->uuid);
                }
            }
            /** Logo */
            if (!empty($request->logo_src)) {
                if (!empty($request->logo_uuid)) {
                    $s = $this->httpConnection('application/merge-patch+json', 'patch', '/api/place/logos/' . $request->logo_uuid, [
                        'place' => '/api/places/' . $request->uuid,
                        'file' => $request->logo_src,
                        'widthPx' => (int) $request->logo_width_px,
                        'heightPx' => (int) $request->logo_height_px
                    ]);
                } else {
                    $this->httpConnection('multipart/form-data', 'post', '/api/place/' . $request->uuid . '/image/logos', [
                        'file' => $request->file('logo_src')->getPathname(),
                        'file_name' => $request->file('logo_src')->getClientOriginalName()
                    ]);
                }  
                  
            }
            
            /** Options */
            if ($request->is_edited_options == 1) {
                if ($request->allows_dogs == 0 || $request->allows_dogs == 1) {
                    if (!empty($request->option_uuid)) {
                        $this->httpConnection('application/merge-patch+json', 'patch', '/api/place/options/' . $request->option_uuid, [
                            'place' => '/api/places/' . $request->uuid,
                            'allowsDogs' => $request->allows_dogs == 1 ? true : false,
                            'curbsidePickup' => $request->curbside_pickup == 1 ? true : false,
                            'delivery' => $request->delivery == 1 ? true : false,
                            'dine_In' => $request->dine_in == 1 ? true : false,
                            'editorialSummary' => $request->editorial_summary == 1 ? true : false,
                            'goodForChildren' => $request->good_for_children == 1 ? true : false,
                            'goodForGroups' => $request->good_for_groups == 1 ? true : false,
                            'goodForWatchingSports' => $request->good_for_watching_sports == 1 ? true : false,
                            'liveMusic' => $request->live_music == 1 ? true : false,
                            'takeout' => $request->takeout == 1 ? true : false,
                            'menuForChildren' => $request->menu_for_children == 1 ? true : false,
                            'servesVegetarianFood' => $request->serves_vegetarian_food == 1 ? true : false,
                            'outdoorSeating' => $request->outdoor_seating == 1 ? true : false,
                            'servesWine' => $request->serves_wine == 1 ? true : false,
                            'reservable' => $request->reservable == 1 ? true : false,
                            'servesLunch' => $request->serves_lunch == 1 ? true : false,
                            'servesDinner' => $request->serves_dinner == 1 ? true : false,
                            'servesDesserts' => $request->serves_desserts == 1 ? true : false,
                            'servesCoffee' => $request->serves_coffee == 1 ? true : false,
                            'servesCocktails' => $request->serves_cocktails == 1 ? true : false,
                            'servesBrunch' => $request->serves_brunch == 1 ? true : false,
                            'servesBreakfast' => $request->serves_breakfast == 1 ? true : false,
                            'servesBeer' => $request->serves_beer == 1 ? true : false
                        ]);
                    } else {
                        $this->httpConnection('application/json', 'post', '/api/place/options', [
                            'place' => '/api/places/' . $request->uuid,
                            'allowsDogs' => $request->allows_dogs == 1 ? true : false,
                            'curbsidePickup' => $request->curbside_pickup == 1 ? true : false,
                            'delivery' => $request->delivery == 1 ? true : false,
                            'dine_In' => $request->dine_in == 1 ? true : false,
                            'editorialSummary' => $request->editorial_summary == 1 ? true : false,
                            'goodForChildren' => $request->good_for_children == 1 ? true : false,
                            'goodForGroups' => $request->good_for_groups == 1 ? true : false,
                            'goodForWatchingSports' => $request->good_for_watching_sports == 1 ? true : false,
                            'liveMusic' => $request->live_music == 1 ? true : false,
                            'takeout' => $request->takeout == 1 ? true : false,
                            'menuForChildren' => $request->menu_for_children == 1 ? true : false,
                            'servesVegetarianFood' => $request->serves_vegetarian_food == 1 ? true : false,
                            'outdoorSeating' => $request->outdoor_seating == 1 ? true : false,
                            'servesWine' => $request->serves_wine == 1 ? true : false,
                            'reservable' => $request->reservable == 1 ? true : false,
                            'servesLunch' => $request->serves_lunch == 1 ? true : false,
                            'servesDinner' => $request->serves_dinner == 1 ? true : false,
                            'servesDesserts' => $request->serves_desserts == 1 ? true : false,
                            'servesCoffee' => $request->serves_coffee == 1 ? true : false,
                            'servesCocktails' => $request->serves_cocktails == 1 ? true : false,
                            'servesBrunch' => $request->serves_brunch == 1 ? true : false,
                            'servesBreakfast' => $request->serves_breakfast == 1 ? true : false,
                            'servesBeer' => $request->serves_beer == 1 ? true : false
                        ]);
                    }

                    Cache::forget('place_options_' . $request->uuid);
                }
            }
            /** Photos */

            if (!empty($request->src[0]) && !is_null($request->src[0])) {
                $m = 0;
                foreach ($request->src as $source) {
                    $this->httpConnection('multipart/form-data', 'post', '/api/place/' . $request->uuid . '/image/photos', [
                        'file' => $request->file('src')[$m]->getPathname(),
                        'category' => (int) $request->photo_category[$m],
                        'caption' => $request->caption[$m],
                        'showOnBanner' => $request->photo_banner[$m] == 1 ? true : false,
                        'file_name' => $request->file('src')[$m]->getClientOriginalName()
                    ]);
                    $m++;
                }
            }
            return back()->with('success', 'İşletme Başarıyla Kaydedilmiştir.');
        }
        return back()->with('error', 'İşletme Kaydedilememiştir.');
    }

    public function editPostCategory(PlaceCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/category/places/' . $request->uuid, [
            'title' => $request->title,
            'description' => $request->description
        ]);

        if ($save) {
            Cache::forget('place_categories_category');

            return back()->with('success', 'Kategori başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Kategori kaydedilememiştir.');
    }

    public function editPostPhotoCategory(PlaceCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/category/place/photos/' . $request->uuid, [
            'title' => $request->title,
            'description' => $request->description
        ]);

        if ($save) {
            Cache::forget('place_photo_categories');

            return back()->with('success', 'Kategori başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Kategori kaydedilememiştir.');
    }

    public function editPostType(PlaceTypeAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/type/places/' . $request->uuid, [
            'type' => $request->type,
            'description' => $request->description
        ]);

        if ($save) {
            return back()->with('success', 'Tür başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Tür kaydedilememiştir.');
    }

    public function editPostTag(PlaceTagAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '//api/tag/places/' . $request->uuid, [
            'tag' => $request->tag
        ]);

        if ($save) {
            return back()->with('success', 'Etiket başarıyla kaydedilmiştir.');
        }

        return back()->with('error', 'Etiket kaydedilememiştir.');
    }

    public function deleteCategory($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/category/places/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Kategori Silinmiştir.');
        }

        return back()->with('error', 'Kategori silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deletePhotoCategory($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/category/place/photos/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Kategori Silinmiştir.');
        }

        return back()->with('error', 'Kategori silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deleteType($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/type/places/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Tür Silinmiştir.');
        }

        return back()->with('error', 'Tür silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deleteTag($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '//api/tag/places/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Etiket Silinmiştir.');
        }

        return back()->with('error', 'Etiket silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deletePhoto($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/place/photos/' . $uuid, []);
        if ($delete) {

            return back()->with('success', 'Fotoğraf Silinmiştir.');
        }

        return back()->with('error', 'Fotoğraf silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deleteHour($placeUuid, $uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/place/opening-hours/' . $uuid, []);
        if ($delete) {
            Cache::forget('place_opening_hours_' . $placeUuid);

            return back()->with('success', 'Çalışma Saati Silinmiştir.');
        }

        return back()->with('error', 'Çalışma Saati silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function deleteAccount($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/place/accounts/' . $uuid, []);
        if ($delete) {
            return back()->with('success', 'Hesap Silinmiştir.');
        }

        return back()->with('error', 'Hesap silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function search()
    {
        $page = request()->get('page') ?? 1;
        $size = 15;
        $total = 0;
        $places = [];
        $endpoint = '/place/_search';
        $query = request()->get('query');

        $response = $this->httpElastica(
            'application/json',
            $endpoint,
            [
                "query" => [
                    "query_string" => [
                        "query" => $query,
                        "fuzziness" => "AUTO"
                    ]
                ],
                "from" => ($page - 1) * $size, // Pagination
                "size" => $size // Number of results per page
            ]
        );

        if ($response && array_key_exists("hits", $response) && array_key_exists("hits", $response["hits"])) {
            foreach ($response['hits']['hits'] as $place) {
                $places[] = $place['_source'];
            }
        }

        return view('admin.places.index', compact('places', 'total', 'endpoint', 'page'));
    }

    public function deleteLogo($logoUuid)    
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/menu/logos/' . $logoUuid, []);
        if ($delete) {
            return back()->with('success', 'Logo Silinmiştir.');
        }

        return back()->with('error', 'Logo silinirken sorun oluştu. Tekrar deneyiniz!');
    }
}
