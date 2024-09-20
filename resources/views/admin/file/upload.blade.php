@extends('layouts.admin.app')


@section('title', 'Places File Uploader - Yaka.la')


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
            <h5 class="mb-0">Yeni Ürün Ekle</h5> <small class="text-muted float-end">Toplu Ürün Yönetimi</small>
            <div class="gap-x-2">
                <a><b>İsme göre</b>: ad|adı|isim|ısım|adi:Mekanadı</a>
                <br>
                <a><b>Şehire göre</b>: sehir|şehir|il|ıl:Mekansehri</a>
                <br>
                <a><b>İlçe göre</b>: ilce|ilçe|semt:Mekansemti</a>
                <br>
                <a><b>Posta koduna göre</b>: pk|posta kodu|post|kod|pkodu:Mekanpostakodu</a>
                <br>
                <a><b>Sokağa göre</b>: level3|sokak|sk:Mekansokagı</a>
                <br>
                <a><b>Herhangi bir adres</b>: adres|adr|address:Mekanadresindenbirparça</a>
                <br>
                <a><b>Herhangi bir terim için direkt yazın</b></a>
                <br>
            </div>

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

            <form action="{{ route('admin.products.addPost') }}" method="post" enctype="multipart/form-data" id="upload-file">
                @csrf

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">İşletme</label>
                    <div class="col-sm-10">
                        <select name="place_id" id="mySelect2" class="ajax w-100"></select>
                        @error('place_id')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>


                <div class="row mb-6 border-top pt-3">
                    <div class="col-lg-12">
                        <label class="col-form-label" for="basic-default-name">JSON Dosya Yükle</label>
                        <input type="file" class="form-control" id="file" name="src"
                               placeholder="Fotoğraf Yolu..." />
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-12">
                        <button type="submit" class="btn btn-primary" id="save-file"><i
                                class="fa fa-check" ></i>&nbsp;&nbsp;Kaydet</button>
                    </div>
                </div>
            </form>
        </div>

        <div id="status">
            <div id="on-error">

            </div>

            <div id="on-success">

            </div>
        </div>

    </div>
@endsection

@section('js')
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/i18n/tr.js"></script>

    <script>
        $(function() {

            let selectedPlace = null;

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
            $('#mySelect2').on('select2:select', function (e) {
                selectedPlace = e.params.data;
            });

            $('#upload-file').on('submit', function(event)
                {
                    event.preventDefault();
                    // Get selected place ID
                    console.log(selectedPlace);

                    // Get the file from file input
                    const file = $('#file')[0].files[0];

                    // Check file is exist and file type is compatible with json file
                    if(file && file.type === 'application/json')
                    {
                        // use blob to read file
                        const blob = new Blob(
                            [
                                file
                            ]
                        );
                        // Use text method to get string data with promise structure
                        blob.text().
                            then(
                                data =>
                                {
                                    const json = JSON.parse(data);
                                    if(json.url)
                                    {
                                        const urlParts = json.url.split('/');
                                        let sourceId = Array.isArray(urlParts) ? (
                                                urlParts[urlParts.length-1].length < 6 ? urlParts[urlParts.length-1] : urlParts[urlParts.length-2]
                                            ) : null;

                                        $.ajax(
                                            {
                                                url: '{{$_ENV['API_URL']}}/api/place/sources',
                                                type: 'POST',
                                                data: JSON.stringify(
                                                    {
                                                        place: `/api/places/${selectedPlace.id}`,
                                                        category: '/api/category/sources/10',
                                                        sourceId: sourceId,
                                                        sourceUrl: json.url
                                                    }
                                                ),
                                                dataType: 'json',
                                                contentType: 'application/json',
                                                success: function(response)
                                                {
                                                    console.log(response);
                                                    $('div#on-success').innerText += JSON.stringify(response);
                                                },
                                                error: function (err){
                                                    console.log(err);
                                                    $('div#on-error').innerText += err + '<br>';
                                                }
                                            }
                                        );
                                    }
                                    else {
                                        $('div#on-error').innerText += 'Kategori bilgisi eklenemedi.<br>';
                                    }

                                    if(json.products) {
                                        if(Array.isArray(json.products))
                                            Array.from(json.products).forEach(product =>uploadProduct(product, selectedPlace.id));
                                    }
                                    else {
                                        $('div#on-error').innerText += 'Ürün bilgisi bulunamadı.<br>';
                                    }
                                }
                        );
                        // const reader = new FileReader();
                        // reader.onload = function(e){
                        //     try {
                        //         var jsonData = JSON.parse(e.target.result); // Parse the JSON data
                        //         console.log(jsonData);
                        //         processJsonData(jsonData); // Process the JSON data
                        //     } catch (error) {
                        //         console.error('Invalid JSON:', error);
                        //         $('#json-output').html('<span class="text-danger">Invalid JSON format.</span>');
                        //     }
                        //
                        //     reader.readAsText(file); // Read the file as text
                        //};
                    }
                    else
                    {
                        $('#json-output').html('<span class="text-danger">Please upload a valid JSON file.</span>');
                    }
                }
            )

            /**
             * @property {string} name
             * @property {string} price
             * @property {string} description
             * @property {string} image
             * @typedef Product
             */

            /**
             * @param {string} placeId
             * @param {Product} product
             */
            function uploadProduct(product, placeId)
            {
                $.ajax({
                    url: `{{$_ENV['API_URL']}}/api/products`,
                    type: 'POST',
                    data: JSON.stringify(
                        {
                            place: `/api/places/${placeId}`,
                            name: product.name ?? 'undefined',
                            active: false,
                            price: 0,
                            description: product.description ?? 'Tanımsız'
                        }
                    ),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function(response)
                    {
                        console.log(response);
                        $('div#on-success').innerText += JSON.stringify(response);
                    },
                    error: function (err){
                        console.log(err);
                        $('div#on-error').innerText += err + '<br>';
                    }
                });
            }

            function uploadImage(url, productId)
            {

            }

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
