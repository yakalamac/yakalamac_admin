@extends('layouts.admin.app')

@section('title', 'Add New Place - Yaka.la')

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
            <h5 class="mb-0">Yeni İşletme Ekle</h5> <small class="text-muted float-end">İşletme Yönetimi</small>
        </div>
        <div class="card-body">
            @if (session()->has('error'))
                <div class="alert alert-danger">
                    {{ session()->get('error') }}
                </div>
            @endif

            @if (session()->has('success'))
                <div class="alert alert-success">
                    {{ session()->get('success') }}
                </div>
            @endif

            <form action="{{ route('admin.places.addPost') }}" method="post" enctype="multipart/form-data">
                @csrf

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">İşletme Adı</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="name"
                            placeholder="Karagöz Baklava..." />
                        @error('name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">Sahibi Mi?</label>
                    <div class="col-sm-10">
                        <select name="owner" id="" class="form-select">
                            <option value="0">Hayır</option>
                            <option value="1">Evet</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-rating">Toplam Değerlendirme</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-rating" name="total_rating" class="form-control"
                            placeholder="5" />
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-rating">Değerlendirme</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-rating" name="rating" class="form-control"
                            placeholder="5" />
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-rating">Kullanıcı Değerlendirme Sayısı</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-rating" name="user_rating_count" class="form-control"
                            placeholder="15" />
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-uri">Google Maps URI</label>
                    <div class="col-sm-10">
                        <input type="text" id="basic-default-uri" name="google_maps_uri" class="form-control"
                            placeholder="https://maps.google.com/..." />
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Kategori</h3>
                    </div>

                    <div class="col-sm-12">
                        <select name="place_category[]" required multiple id="" class="select2 w-100">
                            @if (!empty($placeCategories))
                                @foreach ($placeCategories as $placeCategory)
                                    <option value="{{ $placeCategory['id'] }}">{{ $placeCategory['title'] }}</option>
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
                                    <option value="{{ $placeType['id'] }}">{{ $placeType['type'] }}</option>
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
                                    <option value="{{ $placeTag['id'] }}">{{ $placeTag['tag'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Kaynak</h3>
                    </div>

                    <input type="hidden" name="source_uuid" value="{{ $sources[0]['uuid'] ?? 0 }}">

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Kategori</label>
                        <select name="category[]" id="source" class="form-select source">
                            @if (!empty($categories))
                                @foreach ($categories as $category)
                                    <option value="{{ $category['id'] }}">{{ $category['title'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Kaynak URL</label>
                        <input type="text" class="form-control source" id="basic-default-name" name="source_url[]"
                            placeholder="Kaynak URL..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Kaynak ID</label>
                        <input type="text" class="form-control source" id="basic-default-name" name="source_id[]"
                            placeholder="Kaynak ID..." />
                    </div>
                </div>

                <div class="cloned-sources"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:;" class="btn btn-secondary add-source-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Kaynak Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Adres</h3>
                    </div>
                    <div class="col-lg-6">
                        <label class="col-form-label" for="basic-default-name">Kısa Adres</label>
                        <input type="text" class="form-control" id="basic-default-name" name="short_address"
                            placeholder="Kısa Adres..." />
                    </div>

                    <div class="col-lg-6">
                        <label class="col-form-label" for="basic-default-name">Uzun Adres</label>
                        <input type="text" class="form-control" id="basic-default-name" name="long_address"
                            placeholder="Uzun Adres..." />
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Hesaplar</h3>
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Hesap Kategorisi</label>
                        <select name="account_category[]" id="" class="form-select">
                            <option value="">Seçim yapınız...</option>
                            @if (!empty($accounts))
                                @foreach ($accounts as $account)
                                    <option value="{{ $account['id'] }}">{{ $account['title'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Hesap Kaynak</label>
                        <input type="text" class="form-control" id="basic-default-name" name="account_src[]"
                            placeholder="Hesap Kaynak..." />
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Hesap Öncelik</label>
                        <input type="text" class="form-control" id="basic-default-name" name="account_priority[]"
                            placeholder="Hesap Öncelik..." />
                    </div>
                </div>

                <div class="cloned-accounts"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:;" class="btn btn-secondary add-account-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Hesap Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Çalışma Saatleri</h3>
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Açılış Saati</label>
                        <input type="text" class="form-control" id="basic-default-name" name="open[]"
                            placeholder="Açılış Saati..." />
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Kapanış Saati</label>
                        <input type="text" class="form-control" id="basic-default-name" name="close[]"
                            placeholder="Kapanış Saati..." />
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Gün</label>
                        <input type="text" class="form-control" id="basic-default-name" name="day[]"
                            placeholder="Gün..." />
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Gün Adı</label>
                        <input type="text" class="form-control" id="basic-default-name" name="day_text[]"
                            placeholder="Gün Adı..." />
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Dil Kodu</label>
                        <input type="text" class="form-control" id="basic-default-name" name="language_code[]"
                            placeholder="Dil Kodu..." />
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Açıklama</label>
                        <input type="text" class="form-control" id="basic-default-name" name="description[]"
                            placeholder="Açıklama..." />
                    </div>
                </div>

                <div class="cloned-hours"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:;" class="btn btn-secondary add-hour-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Çalışma Saati Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Logo</h3>
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">İkon Bağlantısı</label>
                        <input type="file" class="form-control" id="basic-default-name" name="logo_src"
                            placeholder="İkon Bağlantısı..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Genişlik</label>
                        <input type="text" class="form-control" id="basic-default-name" name="logo_width_px"
                            placeholder="Genişlik..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Yükseklik</label>
                        <input type="text" class="form-control" id="basic-default-name" name="logo_height_px"
                            placeholder="Yükseklik..." />
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>İşletme Seçenekleri</h3>
                    </div>

                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Köpekler Girebilir</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="allows_dogs" id="" value="1">
                        Evet
                        <input type="radio" name="allows_dogs" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Araçla Teslim</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="curbside_pickup" id="" value="1">
                        Evet
                        <input type="radio" name="curbside_pickup" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Teslimat</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="delivery" id="" value="1"> Evet
                        <input type="radio" name="delivery" id="" value="1"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Dine In</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="dine_in" id="" value="1"> Evet
                        <input type="radio" name="dine_in" id="" value="1"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Editorial Summary</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="editorial_summary" id=""
                            value="1"> Evet
                        <input type="radio" name="editorial_summary" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Çocuklara Uygun</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="good_for_children" id=""
                            value="1"> Evet
                        <input type="radio" name="good_for_children" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Gruplara Uygun</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="good_for_groups" id="" value="1">
                        Evet
                        <input type="radio" name="good_for_groups" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Spor İzleme Mümkün</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="good_for_watching_sports" id=""
                            value="1"> Evet
                        <input type="radio" name="good_for_watching_sports" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Canlı Müzik</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="live_music" id="" value="1"> Evet
                        <input type="radio" name="live_music" id="" value="1"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Paket</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="takeout" id="" value="1"> Evet
                        <input type="radio" name="takeout" id="" value="1"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Çocuklar İçin Menü</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="menu_for_children" id=""
                            value="1"> Evet
                        <input type="radio" name="menu_for_children" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Vejetaryen Yiyecek</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_vegetarian_food" id=""
                            value="1"> Evet
                        <input type="radio" name="serves_vegetarian_food" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Kaldırımda Oturulabilir</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="outdoor_seating" id="" value="1">
                        Evet
                        <input type="radio" name="outdoor_seating" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Şarap Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_wine" id="" value="1">
                        Evet
                        <input type="radio" name="serves_wine" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Rezervasyon</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="reservable" id="" value="1"> Evet
                        <input type="radio" name="reservable" id="" value="1"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Öğle Yemeği Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_lunch" id="" value="1">
                        Evet
                        <input type="radio" name="serves_lunch" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Akşam Yemeği Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_dinner" id="" value="1">
                        Evet
                        <input type="radio" name="serves_dinner" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Tatlı Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_desserts" id="" value="1">
                        Evet
                        <input type="radio" name="serves_desserts" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Kahve Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_coffee" id="" value="1">
                        Evet
                        <input type="radio" name="serves_coffee" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Kokteyl Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_cocktails" id=""
                            value="1"> Evet
                        <input type="radio" name="serves_cocktails" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Brunch Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_brunch" id="" value="1">
                        Evet
                        <input type="radio" name="serves_brunch" id="" value="0">
                        Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Kahvaltı Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_breakfast" id=""
                            value="1"> Evet
                        <input type="radio" name="serves_breakfast" id=""
                            value="0"> Hayır
                    </div>
                    <div class="col-lg-2">
                        <label class="col-form-label" for="basic-default-name">Bira Servisi</label>
                        <div class="clearfix"></div>
                        <input type="radio" name="serves_beer" id="" value="1">
                        Evet
                        <input type="radio" name="serves_beer" id="" value="0">
                        Hayır
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Fotoğraflar</h3>
                    </div>
                    <div class="col-lg-3">
                        <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label>
                        <input type="file" class="form-control" id="basic-default-name" name="src[]"
                            placeholder="Fotoğraf Yolu..." />
                    </div>

                    <div class="col-lg-3">
                        <label class="col-form-label" for="basic-default-name">Kategori</label>
                        <select name="photo_category[]" required id="" class="form-select w-100">
                            @if (!empty($photoCategories))
                                @foreach ($photoCategories as $photoCategory)
                                    <option value="{{ $photoCategory['id'] }}">{{ $photoCategory['title'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                    <div class="col-lg-3">
                        <label class="col-form-label" for="basic-default-name">Caption</label>
                        <input type="text" class="form-control" id="basic-default-name" name="caption[]"
                            placeholder="Caption..." />
                    </div>
                    <div class="col-lg-3">
                        <label class="col-form-label" for="basic-default-name">Show On Banner</label>
                        <select name="photo_banner[]" required id="" class="form-select w-100">
                            <option value="0">Hayır</option>
                            <option value="1">Evet</option>
                        </select>
                    </div>
                </div>

                <div class="cloned-photos"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:;" class="btn btn-secondary add-photo-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Fotoğraf Alanı Ekle</a>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <button type="submit" class="btn btn-primary"><i
                                class="fa fa-check"></i>&nbsp;&nbsp;Kaydet</button>
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
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açılış Saati</label><input type="text" class="form-control" id="basic-default-name" name="open[]" placeholder="Açılış Saati..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Kapanış Saati</label><input type="text" class="form-control" id="basic-default-name" name="close[]" placeholder="Kapanış Saati..." /> </div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün</label><input type="text" class="form-control" id="basic-default-name" name="day[]" placeholder="Gün..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün Adı</label><input type="text" class="form-control" id="basic-default-name" name="day_text[]" placeholder="Gün Adı..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control" id="basic-default-name" name="language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control" id="basic-default-name" name="description[]" placeholder="Açıklama..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-hour-area"><i class="fa fa-trash"></i></a></div></div>'
                )
            })

            $(document).on('click', '.remove-hour-area', function() {
                $(this).parent().parent().remove()
            })

            $('.add-source-area').click(function() {
                $('.cloned-sources').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Kategori</label><select name="category[]" id="source" class="form-select source"> @if (!empty($categories)) @foreach ($categories as $category) <option value="{{ $category['id'] }}">{{ $category['title'] }}</option> @endforeach @endif</select></div><div class="col-lg-4"> <label class="col-form-label" for="basic-default-name">Kaynak URL</label><input type="text" class="form-control source" id="basic-default-name" name="source_url[]" placeholder="Kaynak URL..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Kaynak ID</label><input type="text" class="form-control source" id="basic-default-name" name="source_id[]" placeholder="Kaynak ID..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-source-area"><i class="fa fa-trash"></i></a></div></div>'
                )
            })

            $(document).on('click', '.remove-source-area', function() {
                $(this).parent().parent().remove()
            })

            $('.add-account-area').click(function() {
                $('.cloned-accounts').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Hesap Kategorisi</label><select name="account_category[]" id="" class="form-select"><option value="">Seçim yapınız...</option> @if (!empty($accounts)) @foreach ($accounts as $account) <option value="{{ $account['id'] }}">{{ $account['title'] }}</option> @endforeach  @endif </select></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Hesap Kaynak</label><input type="text" class="form-control" id="basic-default-name" name="account_src[]" placeholder="Hesap Kaynak..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Hesap Öncelik</label><input type="text" class="form-control" id="basic-default-name" name="account_priority[]" placeholder="Hesap Öncelik..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-account-area"><i class="fa fa-trash"></i></a></div></div>'
                )
            })

            $(document).on('click', '.remove-account-area', function() {
                $(this).parent().parent().remove()
            })
        })
    </script>
@endsection
