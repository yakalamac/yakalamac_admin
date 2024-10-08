@extends('layouts.admin.app')

@section('title', 'Add New Product - Yaka.la')

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
            <h5 class="mb-0">Yeni Ürün Ekle</h5> <small class="text-muted float-end">Ürün Yönetimi</small>
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

            <form action="{{ route('admin.products.addPost') }}" method="post" enctype="multipart/form-data">
                @csrf

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">İşletme</label>
                    <div class="col-sm-10">
                        <select name="place_id" id="" class="ajax w-100"></select>
                        @error('place_id')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Ürün Adı</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="name"
                            placeholder="Baklava..." />
                        @error('name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">Fiyat</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="price"
                            placeholder="150.00..." />
                        @error('price')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Açıklama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="description"
                            placeholder="Açıklama..." />
                        @error('description')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">Aktif Mi?</label>
                    <div class="col-sm-10">
                        <select name="active" id="" class="form-select">
                            <option value="0">Hayır</option>
                            <option value="1">Evet</option>
                        </select>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Kategori</h3>
                    </div>

                    <div class="col-sm-12">
                        <select name="product_category[]" multiple id="" class="select2 w-100">
                            @if (!empty($productCategories))
                                @foreach ($productCategories as $productCategory)
                                    <option value="{{ $productCategory['id'] }}">{{ $productCategory['title'] }}</option>
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
                        <select name="product_type[]" multiple id="" class="select2 w-100">
                            @if (!empty($productTypes))
                                @foreach ($productTypes as $productType)
                                    <option value="{{ $productType['id'] }}">{{ $productType['type'] }}</option>
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
                        <select name="product_tag[]" multiple id="" class="select2 w-100">
                            @if (!empty($productTags))
                                @foreach ($productTags as $productTag)
                                    <option value="{{ $productTag['id'] }}">{{ $productTag['tag'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Seçenekler</h3>
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Fiyata Etkisi</label>
                        <input type="text" class="form-control" id="basic-default-name" name="option_price[]"
                            placeholder="Fiyata Etkisi..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Açıklama</label>
                        <input type="text" class="form-control" id="basic-default-name" name="option_description[]"
                            placeholder="Açıklama..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Dil Kodu</label>
                        <input type="text" class="form-control" id="basic-default-name" name="option_language_code[]"
                            placeholder="Dil Kodu..." />
                    </div>
                </div>

                <div class="cloned-options"></div>

                <div class="row mb-6">
                    <div class="col-lg-12">
                        <a href="javascript:;" class="btn btn-secondary add-option-area"><i
                                class="fa fa-plus"></i>&nbsp;&nbsp;Seçenek Alanı Ekle</a>
                    </div>
                </div>

                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <h3>Fotoğraflar</h3>
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label>
                        <input type="file" class="form-control" id="basic-default-name" name="src[]"
                            placeholder="Fotoğraf Yolu..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Genişlik(px)</label>
                        <input type="text" class="form-control" id="basic-default-name" name="width_px[]"
                            placeholder="Genişlik(px)..." />
                    </div>

                    <div class="col-lg-4">
                        <label class="col-form-label" for="basic-default-name">Yükseklik(px)</label>
                        <input type="text" class="form-control" id="basic-default-name" name="height_px[]"
                            placeholder="Yükseklik(px)..." />
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
            Page.ready();
            $('.select2').select2()

            $('.ajax').select2({
                language: "tr",
                placeholder: "İşletme Seçiniz...",
                minimumInputLength: 2,
                ajax: {
                    url: '{{ route('admin.products.ajax') }}',
                    dataType: 'json',
                    data: function(params) {
                        return {
                            q: $.trim(params.term),
                            page: params.page || 1  // Use params.page for pagination
                        };
                    },
                    processResults: function(data) {
                        console.log(data);
                        return {
                            results: data, // data.items should be the array of results
                            pagination: {
                                more: data.length === 15 // Adjust '10' to the number of items per page
                            }
                        };
                    },
                    cache: true
                }
            })

            $('.add-photo-area').click(function() {
                $('.cloned-photos').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"> <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label><input type="file" class="form-control" id="basic-default-name" name="src[]" placeholder="Fotoğraf Yolu..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Genişlik(px)</label><input type="text" class="form-control" id="basic-default-name" name="width_px[]" placeholder="Genişlik(px)..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Yükseklik(px)</label><input type="text" class="form-control" id="basic-default-name" name="height_px[]" placeholder="Yükseklik(px)..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-photo-area"><i class="fa fa-trash"></i></a></div></div>'
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

            $('.add-option-area').click(function() {
                $('.cloned-options').append(
                    '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Fiyata Etkisi</label><input type="text" class="form-control" id="basic-default-name" name="option_price[]" placeholder="Fiyata Etkisi..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control" id="basic-default-name" name="option_description[]" placeholder="Açıklama..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control" id="basic-default-name" name="option_language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-option-area"><i class="fa fa-trash"></i></a></div></div>'
                    )
            })

            $(document).on('click', '.remove-option-area', function() {
                $(this).parent().parent().remove()
            })
        })
    </script>
@endsection
