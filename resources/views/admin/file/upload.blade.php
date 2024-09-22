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
                    <label  class="col-sm-2 col-form-label" for="basic-default-email">Google Yardımcısı</label>
                    <div class="col-sm-10">
                        <input type="text" name="google_place_id" placeholder="Google ID" class="w-25" id="textByGoogle">
                        <input type="button" value="İşletmeyi Bul" class="w-25" id="byGoogle">
                    </div>
                </div>

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

    <!-- Local Scripts -->
    <script>
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            ajaxUrl: '{{ route('admin.products.ajax') }}',
            makeReqUrl: '{{ route('admin.file.uploadRequest') }}'
        };
    </script>

    <script src="{{ asset('assets/public-js/view/file/index.js') }}" type="module"></script>

@endsection
