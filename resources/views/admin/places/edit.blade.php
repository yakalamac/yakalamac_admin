@extends('layouts.admin.app')

@section('title', 'Edit Place - Yaka.la')

@section('content')
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <style>
        .select2-container--default .select2-selection--single {
            border: var(--bs-border-width) solid #d1d0d4;
            border-radius: var(--bs-border-radius);
            padding: calc(.426rem - var(--bs-border-width)) calc(.9375rem - var(--bs-border-width));
            height: auto;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 100%;
        }

        .select2-container .select2-selection--single .select2-selection__rendered {
            padding: 0
        }
    </style>

    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">İşletme Düzenle</h5> <small class="text-muted float-end">İşletme Yönetimi</small>
        </div>
        <div class="card-body">
            @if (session()->has('error'))
                <div class="alert alert-danger">
                    {{ session()->get('error') }}
                </div>

                <div class="clearfix"></div>
            @endif

            @if (session()->has('success'))
                <div class="alert alert-success">
                    {{ session()->get('success') }}
                </div>

                <div class="clearfix"></div>
            @endif

            <form action="{{ route('admin.places.editPost') }}" method="post" enctype="multipart/form-data">
                @csrf

                <input type="hidden" name="is_edited_hours" value="0" id="is_edited_hours">
                <input type="hidden" name="is_set_hours" value="0" id="is_set_hours">
                <input type="hidden" name="is_edited_options" value="0" id="is_edited_options">
                <input type="hidden" name="is_edited_source" value="0" id="is_edited_source">
                <input type="hidden" name="is_edited_account" value="0" id="is_edited_account">
                <input type="hidden" name="uuid" readonly value="{{ $uuid }}">

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">İşletme Adı</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="name"
                            placeholder="Karagöz Baklava..." value="{{ $place['name'] ?? 'Adı Yok' }}" />
                        @error('name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">Sahibi Mi?</label>
                    <div class="col-sm-10">
                        <select name="owner" id="" class="form-select">
                            <option {{ @!$place['owner'] ? 'selected' : '' }} value="0">Hayır</option>
                            <option {{ @!$place['owner'] ? 'selected' : '' }} value="1">Evet</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-rating">Toplam Değerlendirme</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-rating" name="total_rating" class="form-control"
                            placeholder="5" value="{{ $place['totalRating'] ?? 0 }}" />
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-rating">Değerlendirme</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-rating" name="rating" class="form-control" placeholder="5"
                            value="{{ $place['rating'] ?? 0 }}" />
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-rating">Kullanıcı Değerlendirme
                        Sayısı</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-rating" name="user_rating_count" class="form-control"
                            placeholder="15" value="{{ $place['userRatingCount'] ?? 0 }}" />
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-uri">Birincil Tür</label>
                    <div class="col-sm-10">
                        @php
                            $primaryType = null;
                            $primaryDescription = null;
                            if ($place && array_key_exists('primaryType', $place)) {
                                $pt = $place['primaryType'];
                                if (array_key_exists('type', $pt)) {
                                    $primaryType = $pt['type'];
                                }
                                if (array_key_exists('$description', $pt)) {
                                    $primaryDescription = $pt['$description'];
                                }
                            }
                        @endphp
                        <input readonly type="text" id="basic-default-uri" name="primary_type" class="form-control"
                            placeholder="Kebapçı Onur" value="{{ $primaryType ?? '' }}" />
                        <a><i class="fa fa-external-link"></i>
                            {{ $primaryDescription ?? '' }}</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Kategori</h3>
                    </div>

                    <div class="col-sm-12">
                        <select name="place_category[]" multiple id="" class="select2 w-100">
                            @if (!empty($placeCategories))
                                @foreach ($placeCategories as $placeCategory)
                                    <option {{ in_array($placeCategory['id'], $savedCategories) ? 'selected' : '' }}
                                        value="{{ $placeCategory['id'] }}">{{ $placeCategory['title'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Tür</h3>
                    </div>

                    <div class="col-sm-12">
                        <select name="place_type[]" multiple id="" class="select2 w-100">
                            @if (!empty($placeTypes))
                                @foreach ($placeTypes as $placeType)
                                    <option {{ in_array($placeType['id'], $savedTypes) ? 'selected' : '' }}
                                        value="{{ $placeType['id'] }}">{{ $placeType['type'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Etiket</h3>
                    </div>

                    <div class="col-sm-12">
                        <select name="place_tag[]" multiple id="" class="select2 w-100">
                            @if (!empty($placeTags))
                                @foreach ($placeTags as $placeTag)
                                    <option {{ in_array($placeTag['id'], $savedTags) ? 'selected' : '' }}
                                        value="{{ $placeTag['id'] }}">{{ $placeTag['tag'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Kaynak</h3>
                    </div>
                </div>
                @if (!empty($sources))
                    @foreach ($sources as $source)
                        <div class="row mb-6 border-top pt-3">
                            <input type="hidden" name="edit_source_uuid[]" value="{{ $source['id'] ?? 0 }}">

                            <div class="col-lg-4">
                                <label class="col-form-label" for="basic-default-name">Kategoriler</label>
                                <select name="edit_category[]" id="source" class="form-select source">
                                    @if (!empty($categories))
                                        @foreach ($categories as $category)
                                            <option
                                                {{ $source['data']['category']['id'] == $category['id'] ? 'selected' : '' }}
                                                value="{{ $category['id'] }}">{{ $category['title'] }}</option>
                                        @endforeach
                                    @endif
                                </select>
                            </div>

                            <div class="col-lg-4">
                                <label class="col-form-label" for="basic-default-name">Kaynak URL</label>
                                <input type="text" class="form-control source" id="basic-default-name"
                                    name="edit_source_url[]" placeholder="Kaynak URL..."
                                    value="{{ $source['data']['source']['sourceUrl'] ?? '' }}" />
                                <a @php
$sourceId = null;
                                            $sourceUrl = null;
                                            if(array_key_exists('data', $source) && array_key_exists('source', $source['data']))
                                            {
                                                    $sourceId = $source['data']['source']['sourceId'] ?? null;
                                                    $sourceUrl = $source['data']['source']['sourceUrl'] ?? null;
                                            } @endphp
                                    @if ($sourceUrl !== null) href="{{ $sourceUrl }}" target="_blank" @endif>
                                    @if ($sourceId)
                                        <i class="fa fa-external-link"></i>
                                        {{ 'Kaynağa git.' }}
                                    @else
                                        Kaynak mevcut değil
                                    @endif
                                </a>
                            </div>

                            <div class="col-lg-4">
                                <label class="col-form-label" for="basic-default-name">Kaynak ID</label>
                                <input type="text" class="form-control source" id="basic-default-name"
                                    name="edit_source_id[]" placeholder="Kaynak ID..." value="{{ $sourceId ?? '' }}" />
                            </div>
                        </div>
                    @endforeach
                @endif
                <!-- SONRADAN EKLEME -->
                <div class="row mb-6 border-top pt-3">
                    <input type="hidden" name="edit_source_uuid[]" value="{{ $source['id'] ?? 0 }}">

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Kategoriler</label>
                        <select name="edit_category[]" id="source" class="form-select source">


                            @if (!empty($categories))
                                @foreach ($categories as $category)
                                    <option {{ '2' == $category['id'] ? 'selected' : '' }} value="{{ $category['id'] }}">
                                        {{ $category['title'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>


                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Kaynak URL</label>
                        <input type="text" class="form-control source" id="basic-default-name"
                            name="edit_source_url[]" placeholder="Kaynak URL..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Kaynak ID</label>
                        <input type="text" class="form-control source" id="basic-default-name"
                            name="edit_source_id[]" placeholder="Kaynak ID..." />
                    </div>
                </div>



                <div class="cloned-sources"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:" class="btn btn-secondary add-source-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Kaynak Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Adres</h3>
                    </div>

                    <input type="hidden" name="address_uuid" value="{{ $addressUuid[1] ?? 0 }}">

                    <div class="col-lg-6">
                        <label class="col-form-label" for="basic-default-name">Kısa Adres</label>
                        <input type="text" class="form-control" id="basic-default-name" name="short_address"
                            placeholder="Kısa Adres..." value="{{ $address['shortAddress'] ?? '' }}" />
                    </div>

                    <div class="col-lg-6">
                        <label class="col-form-label" for="basic-default-name">Uzun Adres</label>
                        <input type="text" class="form-control" id="basic-default-name" name="long_address"
                            placeholder="Uzun Adres..." value="{{ $address['longAddress'] ?? '' }}" />
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Hesaplar</h3>
                    </div>
                </div>

                @if (!empty($placeAccounts))
                    @foreach ($placeAccounts as $placeAccount)
                        @php
                            $accountUuid = explode('/api/place/accounts/', $placeAccount['@id']);
                            $placeCategory = explode('/api/category/accounts/', $placeAccount['category']);
                        @endphp

                        <input type="hidden" name="edit_account_uuid[]" value="{{ $accountUuid[1] }}">

                        <div class="row mb-6 border-top pt-3">
                            <div class="col-lg-4">
                                <label class="col-form-label" for="basic-default-name">Hesap Kategorisi123</label>
                                <select name="edit_account_category[]" id="" class="account form-select">
                                    <option value="">Seçim yapınız...</option>
                                    @if (!empty($accounts))
                                        @foreach ($accounts as $account)
                                            @php
                                                $category = explode('/api/category/accounts/', $account['@id']);
                                            @endphp

                                            <option {{ $placeCategory[1] == $category[1] ? 'selected' : '' }}
                                                value="{{ $account['id'] }}">{{ $account['title'] }}</option>
                                        @endforeach
                                    @endif
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <label class="col-form-label" for="basic-default-name">Hesap Kaynak</label>
                                <input type="text" class="account form-control" id="basic-default-name"
                                    name="edit_account_src[]" placeholder="Hesap Kaynak..."
                                    value="{{ $placeAccount['src'] ?? '-' }}" />
                                <a href="{{ $placeAccount['src'] ?? '-' }}" target="_blank"><i
                                        class="fa fa-external-link"></i> {{ $placeAccount['src'] ?? '-' }}</a>
                            </div>
                            <div class="col-lg-4">
                                <label class="col-form-label" for="basic-default-name">Hesap Öncelik</label>
                                <input type="text" class="account form-control" id="basic-default-name"
                                    name="edit_account_priority[]" placeholder="Hesap Öncelik..."
                                    value="{{ $placeAccount['priority'] ?? 0 }}" />
                            </div>
                            <div class="col-lg-12 mt-2">
                                <a href="{{ route('admin.places.deleteAccount', ['uuid' => $accountUuid[1]]) }}"
                                    class="text-danger remove-account-area"
                                    onclick="return confirm('Bu Hesabı Silmek İstediğinize Emin misiniz?')"><i
                                        class="fa fa-trash"></i></a>
                            </div>
                        </div>
                    @endforeach
                @endif

                <div class="cloned-accounts"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:" class="btn btn-secondary add-account-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Hesap Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Çalışma Saatleri</h3>
                    </div>
                </div>

                @if (!empty($openingHours))
                    @foreach ($openingHours as $hour)
                        @if (!empty($hour['hour']['open']))
                            <input type="hidden" name="edit_hour_uuid[]" value="{{ $hour['uuid'] }}">

                            <div class="row mb-6 border-top pt-3">
                                <div class="col-lg-2">
                                    <label class="col-form-label" for="basic-default-name">Açılış Saati</label>
                                    <input type="text" class="form-control edited" id="basic-default-name"
                                        name="edit_open[]" placeholder="Açılış Saati..."
                                        value="{{ @$hour['hour']['open'] }}" />
                                </div>

                                <div class="col-lg-2">
                                    <label class="col-form-label" for="basic-default-name">Kapanış Saati</label>
                                    <input type="text" class="form-control edited" id="basic-default-name"
                                        name="edit_close[]" placeholder="Kapanış Saati..."
                                        value="{{ @$hour['hour']['close'] }}" />
                                </div>

                                <div class="col-lg-2">
                                    <label class="col-form-label" for="basic-default-name">Gün</label>
                                    <input type="text" class="form-control edited" id="basic-default-name"
                                        name="edit_day[]" placeholder="Gün..." value="{{ @$hour['hour']['day'] }}" />
                                </div>

                                <div class="col-lg-2">
                                    <label class="col-form-label" for="basic-default-name">Gün Adı</label>
                                    <input type="text" class="form-control edited" id="basic-default-name"
                                        name="edit_day_text[]" placeholder="Gün Adı..."
                                        value="{{ @$hour['hour']['dayText'] }}" />
                                </div>

                                <div class="col-lg-2">
                                    <label class="col-form-label" for="basic-default-name">Dil Kodu</label>
                                    <input type="text" class="form-control edited" id="basic-default-name"
                                        name="edit_language_code[]" placeholder="Dil Kodu..."
                                        value="{{ @$hour['hour']['languageCode'] }}" />
                                </div>

                                <div class="col-lg-2">
                                    <label class="col-form-label" for="basic-default-name">Açıklama</label>
                                    <input type="text" class="form-control edited" id="basic-default-name"
                                        name="edit_description[]" placeholder="Açıklama..."
                                        value="{{ @$hour['hour']['description'] }}" />
                                </div>
                                <div class="col-lg-12 mt-2">
                                    <a href="{{ route('admin.places.deleteHour', ['place_uuid' => $uuid, 'uuid' => $hour['uuid']]) }}"
                                        onclick="return confirm('Bu Çalışma Saaatini Silmek İstediğinize Emin misiniz?')"
                                        class="text-danger"><i class="fa fa-trash"></i></a>
                                </div>
                            </div>
                        @endif
                    @endforeach
                @endif

                <div class="cloned-hours"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:" class="btn btn-secondary add-hour-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Çalışma Saati Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Logo</h3>
                    </div>

                    <input type="hidden" name="logo_uuid" value="{{ $logoUuid[1] ?? 0 }}">

                    <div class="col-lg-3">
                        <label class="col-form-label" for="basic-default-name">İkon Bağlantısı</label>
                        <input type="file" class="form-control" id="basic-default-name" name="logo_src"
                            placeholder="{{ $logo['path']  ?? "İkon Bağlantısı..."}}" value="{{ $logo['path'] ?? '' }}" />
                        <span class="text-primary" style="font-size: 12px">{{ $logo['path'] ?? 0 }}</span>
                        <div class="clearfix"></div>
                        @if (!empty($logo['path']))
                            <img src=" https://{{$logo['path'] }}" width="250" alt=" {{$logo['caption'] ?? 'bilgi yok'}}">
                        @endif     
                    <div class="col-lg-3">
                        <label class="col-form-label" for="basic-default-name">Başlık</label>
                        <input type="text" class="form-control" id="basic-default-name" name="logo_caption"
                               placeholder="Bu alan fotoğraf metasıdır" value="{{ $logo['caption'] ?? '' }}" />
                    </div>

                    <div class="col-lg-2">
                                        <!-- Incoming -->
                        <label class="col-form-label" for="basic-default-name">Genişlik</label>
                        <input readonly type="text" class="form-control" id="basic-default-name" name="logo_width_px"
                            placeholder="Genişlik..." value="{{ $logo['width'] ?? '' }}" />
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Yükseklik</label>
                        <input readonly type="text" class="form-control" id="basic-default-name" name="logo_height_px"
                            placeholder="Yükseklik..." value="{{ $logo['height'] ?? '' }}" />
                    </div>
                    @if($logo)
                    <div class="col-lg-2">
                        <a class="btn btn-danger"
                           href="{{ route('admin.places.deleteLogo', ['logoId' => $logo['id']]) }}"
                           onclick="return confirm('Bu Veriyi Silmek İstediğinize Emin misiniz?')">
                            <i class="ti ti-trash me-1"></i>
                            Sil
                        </a>
                    </div>
                    @endif
                </div>




                <div class="row mb-6 border-top pt-3 options-wrapper">
                    <div class="col-lg-12">
                        <h3>İşletme Seçenekleri</h3>
                    </div>

                    <input type="hidden" name="option_uuid" value="{{ $optionsUuid[1] ?? 0 }}">
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Köpekler Girebilir</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="allows_dogs" {{ @$options['allowsDogs'] ? 'checked' : '' }}>
                        Köpekler Girebilir
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Araçla Teslim</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="curbside_pickup" {{ @$options['curbsidePickup'] ? 'checked' : '' }}>
                        Araçla Teslim
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Teslimat</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="delivery" {{ @$options['delivery'] ? 'checked' : '' }}>
                        Teslimat
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Dine In</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="dine_in" {{ @$options['dineIn'] ? 'checked' : '' }}>
                        Dine In
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Editorial Summary</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="editorial_summary" {{ @$options['editorialSummary'] ? 'checked' : '' }}>
                        Editorial Summary
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Çocuklara Uygun</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="good_for_children" {{ @$options['goodForChildren'] ? 'checked' : '' }}>
                        Çocuklara Uygun
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Gruplara Uygun</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="good_for_groups" {{ @$options['goodForGroups'] ? 'checked' : '' }}>
                        Gruplara Uygun
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Spor İzleme Mümkün</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="good_for_watching_sports" {{ @$options['goodForWatchingSports'] ? 'checked' : '' }}>
                        Spor İzleme Mümkün
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Canlı Müzik</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="live_music" {{ @$options['liveMusic'] ? 'checked' : '' }}>
                        Canlı Müzik
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Paket</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="takeout" {{ @$options['takeout'] ? 'checked' : '' }}>
                        Paket
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Çocuklar İçin Menü</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="menu_for_children" {{ @$options['menuForChildren'] ? 'checked' : '' }}>
                        Çocuklar İçin Menü
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Vejetaryen Yiyecek</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_vegetarian_food" {{ @$options['serveVegetarianFood'] ? 'checked' : '' }}>
                        Vejetaryen Yiyecek
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Kaldırımda Oturulabilir</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="outdoor_seating" {{ @$options['outdoorSeating'] ? 'checked' : '' }}>
                        Kaldırımda Oturulabilir
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Şarap Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_wine" {{ @$options['servesWine'] ? 'checked' : '' }}>
                        Şarap Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Rezervasyon</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="reservable" {{ @$options['reservable'] ? 'checked' : '' }}>
                        Rezervasyon
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Öğle Yemeği Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_lunch" {{ @$options['servesLunch'] ? 'checked' : '' }}>
                        Öğle Yemeği Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Akşam Yemeği Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_dinner" {{ @$options['servesDinner'] ? 'checked' : '' }}>
                        Akşam Yemeği Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Tatlı Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_desserts" {{ @$options['servesDesserts'] ? 'checked' : '' }}>
                        Tatlı Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Kahve Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_coffee" {{ @$options['servesCoffee'] ? 'checked' : '' }}>
                        Kahve Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Kokteyl Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_cocktails" {{ @$options['servesCocktails'] ? 'checked' : '' }}>
                        Kokteyl Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Brunch Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_brunch" {{ @$options['servesBrunch'] ? 'checked' : '' }}>
                        Brunch Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Kahvaltı Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_breakfast" {{ @$options['servesBreakfast'] ? 'checked' : '' }}>
                        Kahvaltı Servisi
                    </div>
                    <div class="col-lg-2">
                        <!-- <label class="col-form-label" for="basic-default-name">Bira Servisi</label> -->
                        <div class="clearfix"></div>
                        <input type="checkbox" name="serves_beer" id="" {{ @$options['servesBeer'] ? 'checked' : '' }}>
                        Bira Servisi
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Fotoğraflar</h3>
                    </div>
                </div>

                @if (!empty($photos))
                    @foreach ($photos as $photo)
                        <input type="hidden" name="edit_photo_uuid[]" value="{{ $photo['uuid'] ?? 0 }}">

                        <div class="row mb-6 border-top pt-3">
                            <div class="col-lg-3">
                                <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label>
                                <input type="file" class="form-control" id="basic-default-name" name="edit_src[]"
                                       placeholder="Fotoğraf Yolu..." value="{{ $photo['data']['path'] ?? 0 }}" />
                                <span class="text-primary"
                                      style="font-size: 12px">{{ $photo['data']['path'] ?? 0 }}</span>
                                <div class="clearfix"></div>
                                @if (!empty($photo['data']['path']))
                                    <img src="https://{{ $photo['data']['path'] }}" width="250">
                                @endif
                            </div>
                            @if($photo)
                              <div class="col-lg-2">
                                <a class="btn btn-danger"
                                    href="{{ route('admin.places.deletePhoto', ['uuid' => $photo['uuid']]) }}"
                                    onclick="return confirm('Bu Veriyi Silmek İstediğinize Emin misiniz?')">
                                    <i class="ti ti-trash me-1"></i>
                                    Sil
                                </a>
                            </div>
                            @endif
                            <div class="col-lg-3">
                                <label class="col-form-label" for="basic-default-name">Kategori</label>
                                <select name="edit_photo_category[]" required id="" class="form-select w-100">
                                    @if (!empty($photoCategories))
                                        @foreach ($photoCategories as $photoCategory)
                                            @php
                                                $categoryId = explode(
                                                    '/api/category/place/photos/',
                                                    $photo['data']['category'],
                                                );
                                            @endphp
                                            <option value="{{ $photoCategory['id'] }}"
                                                {{ $categoryId[1] == $photoCategory['id'] ? 'selected' : '' }}>
                                                {{ $photoCategory['title'] }}</option>
                                        @endforeach
                                    @endif
                                </select>
                            </div>
                            <div class="col-lg-3">
                                <label class="col-form-label" for="basic-default-name">Caption</label>
                                <input type="text" class="form-control" id="basic-default-name" name="edit_caption[]"
                                       placeholder="Caption..." value="{{ $photo['data']['caption'] }}" />
                            </div>
                            <div class="col-lg-3">
                                <label class="col-form-label" for="basic-default-name">Show On Banner</label>
                                <select name="edit_photo_banner[]" required id="" class="form-select w-100">
                                    <option value="0" {{ $photo['data']['showOnBanner'] == 0 ? 'selected' : '' }}>
                                        Hayır</option>
                                    <option value="1" {{ $photo['data']['showOnBanner'] == 1 ? 'selected' : '' }}>
                                        Evet</option>
                                </select>
                            </div>
                        </div>
                    @endforeach
                @endif

                <div class="cloned-photos"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:" class="btn btn-secondary add-photo-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Fotoğraf Alanı Ekle</a>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <button type="submit" class="btn btn-primary" id="button-save"><i
                                class="fa fa-check"></i>&nbsp;&nbsp;Kaydet</button>
                        <script>
                            $(document).ready(function() {
                                $("#button-save").onclick(function() {
                                    $(this).text("Kaydediliyor..");
                                });
                            });
                        </script>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('js')
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/i18n/tr.js"></script>

    <script>
        $(function() {
            $('.select2').select2()

            $('.add-photo-area').click(function() {
                $('.cloned-photos').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-3"> <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label><input type="file" class="form-control" id="basic-default-name" name="src[]" placeholder="Fotoğraf Yolu..." /></div><div class="col-lg-3"><label class="col-form-label" for="basic-default-name">Kategori</label><select name="photo_category[]" required id="" class="form-select w-100"> @if (!empty($photoCategories)) @foreach ($photoCategories as $photoCategory) <option value="{{ $photoCategory['id'] }}">{{ $photoCategory['title'] }}</option> @endforeach @endif </select></div><div class="col-lg-3"><label class="col-form-label" for="basic-default-name">Caption</label><input type="text" class="form-control" id="basic-default-name" name="caption[]" placeholder="Caption..." /></div><div class="col-lg-3"><label class="col-form-label" for="basic-default-name">Show On Banner</label><select name="photo_banner[]" required id="" class="form-select w-100"><option value="0">Hayır</option><option value="1">Evet</option></select></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-photo-area"><i class="fa fa-trash"></i></a></div></div>'
                )
            })

            $(document).on('click', '.remove-photo-area', function() {
                $(this).parent().parent().remove()
            })

            $('.add-address-area').click(function() {
                $('.cloned-addresses').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-6"><label class="col-form-label" for="basic-default-name">Kısa Adres</label><input type="text" class="form-control" id="basic-default-name" name="short_address" placeholder="Kısa Adres..." /></div><div class="col-lg-6"><label class="col-form-label" for="basic-default-name">Uzun Adres</label><input type="text" class="form-control" id="basic-default-name" name="long_address" placeholder="Uzun Adres..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-address-area"><i class="fa fa-trash"></i></a></div></div>'
                )
            })

            $(document).on('click', '.remove-address-area', function() {
                $(this).parent().parent().remove()
            })

            $('.add-hour-area').click(function() {
                $('.cloned-hours').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açılış Saati</label><input type="text" class="form-control set" id="basic-default-name" name="open[]" placeholder="Açılış Saati..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Kapanış Saati</label><input type="text" class="form-control set" id="basic-default-name" name="close[]" placeholder="Kapanış Saati..." /> </div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün</label><input type="text" class="form-control set" id="basic-default-name" name="day[]" placeholder="Gün..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün Adı</label><input type="text" class="form-control set" id="basic-default-name" name="day_text[]" placeholder="Gün Adı..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control set" id="basic-default-name" name="language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control set" id="basic-default-name" name="description[]" placeholder="Açıklama..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-hour-area"><i class="fa fa-trash"></i></a></div></div>'
                )
            })

            $(document).on('click', '.remove-hour-area', function() {
                $(this).parent().parent().remove()
            })

            $(".edited").on("input", function() {
                $('#is_edited_hours').val('1')
            })

            $(document).on("input", '.set', function() {
                $('#is_set_hours').val('1')
            })

            $('.options-wrapper input[type=checkbox]').on('input', function() {
                $('#is_edited_options').val('1')
            })

            $(".source").on("input", function() {
                $('#is_edited_source').val('1')
            })

            $('.add-source-area').click(function() {
                $('.cloned-sources').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Kategori</label><select name="category[]" id="source" class="form-select source"> @if (!empty($categories)) @foreach ($categories as $category) <option value="{{ $category['id'] }}">{{ $category['title'] }}</option> @endforeach @endif</select></div><div class="col-lg-4"> <label class="col-form-label" for="basic-default-name">Kaynak URL</label><input type="text" class="form-control source" id="basic-default-name" name="source_url[]" placeholder="Kaynak URL..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Kaynak ID</label><input type="text" class="form-control source" id="basic-default-name" name="source_id[]" placeholder="Kaynak ID..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-source-area"><i class="fa fa-trash"></i></a></div></div>'
                )

                $('#is_edited_source').val('1')
            })

            $(document).on('click', '.remove-source-area', function() {
                $(this).parent().parent().remove()
            })

            $('.add-account-area').click(function() {
                $('.cloned-accounts').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Hesap Kategorisi</label><select name="account_category[]" id="" class="form-select account"><option value="">Seçim yapınız...</option> @if (!empty($accounts)) @foreach ($accounts as $account) <option value="{{ $account['id'] }}">{{ $account['title'] }}</option> @endforeach  @endif </select></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Hesap Kaynak</label><input type="text" class="form-control account" id="basic-default-name" name="account_src[]" placeholder="Hesap Kaynak..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Hesap Öncelik</label><input type="text" class="form-control account" id="basic-default-name" name="account_priority[]" placeholder="Hesap Öncelik..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-account-area"><i class="fa fa-trash"></i></a></div></div>'
                )

                $('#is_edited_account').val('1')
            })

            $(document).on('click', '.remove-account-area', function() {
                $(this).parent().parent().remove()
            })

            $(".account").on("input", function() {
                $('#is_edited_account').val('1')
            })
        })
    </script>
@endsection
