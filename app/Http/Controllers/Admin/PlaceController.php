<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlaceAddRequest;
use App\Http\Requests\PlaceCategoryAddRequest;
use App\Http\Requests\PlaceEditRequest;
use App\Http\Requests\PlaceTagAddRequest;
use App\Http\Requests\PlaceTypeAddRequest;
use App\Traits\HttpTrait;
use Illuminate\Console\Application;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class PlaceController extends Controller
{
    use HttpTrait;
    public const PAGINATION_SIZE = 15;

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function index(): View|Factory|Application
    {
        $endpoint = '/api/places';
        $page = request()->get('page') ?? 1;
        $total = 0;
        $places = [];

        if (($search = request()->get('addressSearch'))) {
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
                    "from" => ($page - 1) * self::PAGINATION_SIZE, // Pagination,
                    "size" => self::PAGINATION_SIZE
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

    /**
     * @return View|Factory|Application
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function categories(): View|Factory|Application
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

    /**
     * @return View|Factory|Application
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function types(): View|Factory|Application
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

    /**
     * @return View|Factory|Application
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function tags(): View|Factory|Application
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

    /**
     * @return View|Factory|Application
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function photoCategories(): View|Factory|Application
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

    /**
     * @return View|Factory|Application
     */
    public function add(): View|Factory|Application
    {
        /** Accounts */
        $accounts = $this->httpConnection('application/json', 'get', '/api/category/accounts', []);
        if ($accounts) $accounts = $accounts['hydra:member'];

        /** Categories */
        $categories =  $this->httpConnection('application/json', 'get', '/api/category/sources', []);
        if ($categories) $categories = $categories['hydra:member'];

        /** Photo Categories */
        $photoCategories = $this->httpConnection('application/json', 'get', '/api/category/place/photos', []);
        if ($photoCategories) $photoCategories = $photoCategories['hydra:member'];

        /** Place Categories */
        $placeCategories =  $this->httpConnection('application/json', 'get', '/api/category/places', []);
        if ($placeCategories) $placeCategories = $placeCategories['hydra:member'];

        /** Place Types */
        $placeTypes =  $this->httpConnection('application/json', 'get', '/api/type/places', []);
        if ($placeTypes) $placeTypes = $placeTypes['hydra:member'];

        /** Place Tags */
        $placeTags =  $this->httpConnection('application/json', 'get', '/api/tag/places', []);
        if ($placeTags) $placeTags = $placeTags['hydra:member'];

        return view('admin.places.add', compact('accounts', 'categories', 'placeCategories', 'photoCategories', 'placeTypes', 'placeTags'));
    }

    public function addCategory(): View|Factory|Application
    {
        return view('admin.places.add_category');
    }

    public function addPhotoCategory(): View|Factory|Application
    {
        return view('admin.places.add_photo_category');
    }

    public function addType(): View|Factory|Application
    {
        return view('admin.places.add_type');
    }

    public function addTag(): View|Factory|Application
    {
        return view('admin.places.add_tag');
    }

    public function edit(string $uuid):  Factory|View|Application
    {
        $endpoint = '/api/places/' . $uuid;
        $openingHours = [];
        $photos = [];
        $addressUuid = [];
        $logoUuid = [];
        $optionsUuid = [];
        $logo = '';
        $address = '';
        $options = [];
        $sources = [];
        $savedCategories = [];
        $savedTypes = [];
        $savedTags = [];
        $placeAccounts = [];

        $place = $this->httpConnection('application/json', 'get', $endpoint, []);

        /**
        Categories Cache::remember('categories', 125000, function () {
         **/
        $categories = $this->httpConnection('application/json', 'get', '/api/category/sources', []);
        if ($categories) {
            $categories = $categories['hydra:member'];
        }

        /** Place Categories */
        $placeCategories =  $this->httpConnection('application/json', 'get', '/api/category/places', []);
        if ($placeCategories) {
            $placeCategories =  $placeCategories['hydra:member'];
        }


        /** Photo Categories */
        $photoCategories = $this->httpConnection('application/json', 'get', '/api/category/place/photos', []);
        if ($photoCategories) {
            $photoCategories = $photoCategories['hydra:member'];
        }


        /** Place Types */
        $placeTypes =   $this->httpConnection('application/json', 'get', '/api/type/places', []);
        if ($placeTypes) {
                $placeTypes = $placeTypes['hydra:member'];
        }

        /** Place Tags */
        $placeTags =  $this->httpConnection('application/json', 'get', '/api/tag/places', []);
        if ($placeTags) {
                $placeTags = $placeTags['hydra:member'];
        }

        /** Accounts */
        $accounts = $this->httpConnection('application/json', 'get', '/api/category/accounts', []);
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
                            $sourceUuid = explode('/api/source/places', $sourceUrl['@id']);
                            $sourceUri = $sourceUrl['@id'];
                        } else {
                            $sourceUuid = explode('/api/source/places', $sourceUrl);
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

                $options = $this->httpConnection('application/json', 'get', $optionsUri, []);
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

    /**
     * @param string $uuid
     * @return View|Factory|Application
     */
    public function editCategory(string $uuid): View|Factory|Application
    {
        $endpoint = '/api/category/places/' . $uuid;
        $category = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_category', compact('uuid', 'endpoint', 'category'));
    }

    /**
     * @param string $uuid
     * @return View|Factory|Application
     */
    public function editPhotoCategory(string $uuid): View|Factory|Application
    {
        $endpoint = '/api/category/place/photos/' . $uuid;
        $category = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_photo_category', compact('uuid', 'endpoint', 'category'));
    }

    /**
     * @param string $uuid
     * @return View|Factory|Application
     */
    public function editType(string $uuid): View|Factory|Application
    {
        $endpoint = '/api/type/places/' . $uuid;
        $type = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_type', compact('uuid', 'endpoint', 'type'));
    }

    /**
     * @param string $uuid
     * @return View|Factory|Application
     */
    public function editTag(string $uuid): View|Factory|Application|RedirectResponse
    {
        $endpoint = '/api/tag/places/' . $uuid;
        $tag = $this->httpConnection('application/json', 'get', $endpoint, []);

        return view('admin.places.edit_tag', compact('uuid', 'endpoint', 'tag'));
    }

    /**
     * @param PlaceAddRequest $request
     * @return View|Factory|Application|RedirectResponse
     */
    public function addPost(PlaceAddRequest $request): View|Factory|Application|RedirectResponse
    {
        $save = $this->httpConnection(
            'application/json', 'post', '/api/places',
            [
                'name' => $request->name,
                'owner' => $request->owner == 1,
                'totalRating' => (float) $request->total_rating,
                'rating' => (float) $request->rating,
                'userRatingCount' => (int) $request->user_rating_count,
            ]
        );

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
                    'allowsDogs' => $request->allows_dogs == 1,
                    'curbsidePickup' => $request->curbside_pickup == 1,
                    'delivery' => $request->delivery == 1,
                    'dine_In' => $request->dine_in == 1,
                    'editorialSummary' => $request->editorial_summary == 1,
                    'goodForChildren' => $request->good_for_children == 1,
                    'goodForGroups' => $request->good_for_groups == 1,
                    'goodForWatchingSports' => $request->good_for_watching_sports == 1,
                    'liveMusic' => $request->live_music == 1,
                    'takeout' => $request->takeout == 1,
                    'menuForChildren' => $request->menu_for_children == 1,
                    'servesVegetarianFood' => $request->serves_vegetarian_food == 1,
                    'outdoorSeating' => $request->outdoor_seating == 1,
                    'servesWine' => $request->serves_wine == 1,
                    'reservable' => $request->reservable == 1,
                    'servesLunch' => $request->serves_lunch == 1,
                    'servesDinner' => $request->serves_dinner == 1,
                    'servesDesserts' => $request->serves_desserts == 1,
                    'servesCoffee' => $request->serves_coffee == 1,
                    'servesCocktails' => $request->serves_cocktails == 1,
                    'servesBrunch' => $request->serves_brunch == 1,
                    'servesBreakfast' => $request->serves_breakfast == 1,
                    'servesBeer' => $request->serves_beer == 1
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
                        'showOnBanner' => $request->photo_banner[$m] == 1,
                        'file_name' => $request->file('src')[$m]->getClientOriginalName()
                    ]);

                    $m++;
                }
            }

            return back()->with('success', 'İşletme Başarıyla Kaydedilmiştir.');
        }

        return back()->with('error', 'İşletme Kaydedilememiştir.');
    }

    /**
     * @param PlaceCategoryAddRequest $request
     * @return View|Factory|Application|RedirectResponse
     */
    public function addPostCategory(PlaceCategoryAddRequest $request): View|Factory|Application|RedirectResponse
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

    /**
     * @param PlaceCategoryAddRequest $request
     * @return View|Factory|Application|RedirectResponse
     */
    public function addPostPhotoCategory(PlaceCategoryAddRequest $request): View|Factory|Application|RedirectResponse
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

    /**
     * @param PlaceTypeAddRequest $request
     * @return View|Factory|Application|RedirectResponse
     */
    public function addPostType(PlaceTypeAddRequest $request): View|Factory|Application|RedirectResponse
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

    /**
     * @param PlaceTagAddRequest $request
     * @return View|Factory|Application|RedirectResponse
     */
    public function addPostTag(PlaceTagAddRequest $request): View|Factory|Application|RedirectResponse
    {
        $save = $this->httpConnection('application/json', 'post', '//api/tag/places', [
            'tag' => $request->tag
        ]);

        if ($save) {
            return back()->with('success', 'Etiket başarıyla eklenmiştir.');
        }

        return back()->with('error', 'Etiket eklenememiştir.');
    }

    /**
     * @param PlaceEditRequest $request
     * @return View|Factory|Application|RedirectResponse
     */
    public function editPost(PlaceEditRequest $request): View|Factory|Application|RedirectResponse
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
                    $jsonTags['hashtags'][] = '/api/tag/places/' . $request->place_tag[$h];

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

                Cache::forget('place_logo_' . $request->uuid);
            }

            /** Options */
            if ($request->is_edited_options == 1) {
                if ($request->allows_dogs == 0 || $request->allows_dogs == 1)
                {
                    $body = [
                        'place' => '/api/places/' . $request->uuid,
                        'allowsDogs' => $request->allows_dogs !== null,
                        'curbsidePickup' => $request->curbside_pickup !== null,
                        'delivery' => $request->delivery !== null,
                        'dine_In' => $request->dine_in !== null,
                        'editorialSummary' => $request->editorial_summary !== null,
                        'goodForChildren' => $request->good_for_children !== null,
                        'goodForGroups' => $request->good_for_groups !== null,
                        'goodForWatchingSports' => $request->good_for_watching_sports !== null,
                        'liveMusic' => $request->live_music !== null,
                        'takeout' => $request->takeout !== null,
                        'menuForChildren' => $request->menu_for_children !== null,
                        'servesVegetarianFood' => $request->serves_vegetarian_food !== null,
                        'outdoorSeating' => $request->outdoor_seating !== null,
                        'servesWine' => $request->serves_wine !== null,
                        'reservable' => $request->reservable !== null,
                        'servesLunch' => $request->serves_lunch !== null,
                        'servesDinner' => $request->serves_dinner !== null,
                        'servesDesserts' => $request->serves_desserts !== null,
                        'servesCoffee' => $request->serves_coffee !== null,
                        'servesCocktails' => $request->serves_cocktails !== null,
                        'servesBrunch' => $request->serves_brunch !== null,
                        'servesBreakfast' => $request->serves_breakfast !== null,
                        'servesBeer' => $request->serves_beer !== null
                    ];
                     match (true) {
                            !empty($request->option_uuid) =>
                            $this->httpConnection(
                                'application/merge-patch+json',
                                'patch',
                                '/api/place/options/' . $request->option_uuid,
                                $body
                            ),
                            default =>
                            $this->httpConnection(
                                'application/json',
                                'post',
                                '/api/place/options',
                                $body
                            )
                        };

                    Cache::forget('place_options_' . $request->get('uuid'));
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

                Cache::forget('place_photo_categories_' . $request->uuid);
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
        /**
         * Delete a specified resource from storage.
         *
         * This method is used to permanently remove a particular
         * resource from the application's storage system.
         * Ensure proper authorization before invoking this method
         * to prevent unauthorized deletions.
         *
         * @param int $id The unique identifier of the resource to be deleted.
         * @return bool Returns true if the deletion was successful, otherwise false.
         */
            return $this->httpConnection('application/json', 'delete', '/api/place/photos/' . $uuid, [])
                ? back()->with('success', 'Fotoğraf Silinmiştir.')
                : back()->with('error', 'Fotoğraf silinirken sorun oluştu. Tekrar deneyiniz!');
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

    public function deleteLogo($logoId)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/place/logos/' . $logoId, []);
        if ($delete) {
            return back()->with('success', 'Logo Silinmiştir.');
        }

        return back()->with('error', 'Logo silinirken sorun oluştu. Tekrar deneyiniz!');
    }

    public function conceptCategories()
    {
        return view('admin.places.concept-categories');
    }

    public function cuisineCategories()
    {
        return view('admin.places.cuisine-categories');
    }
}
