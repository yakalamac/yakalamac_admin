@extends('layouts.admin.app')

@section('title', 'Add New Push Notification - Yaka.la')

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
            <h5 class="mb-0">Yeni Push Bildirimi Ekle</h5> <small class="text-muted float-end">Bildirim Yönetimi</small>
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

            <form action="{{ route('admin.notifications.addPostPush') }}" method="post">
                @csrf
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">Kullanıcı</label>
                    <div class="col-sm-10">
                        <select name="user" id="" class="ajax w-100"></select>
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-email">Rol</label>
                    <div class="col-sm-10">
                        <select name="role" id="" class="ajax-role w-100"></select>
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Başlık</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="title" placeholder="Başlık">
                        @error('title')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">İçerik</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" id="basic-default-name" name="content"
                            placeholder="İçerik..." rows="6"></textarea>
                        @error('content')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-sm-10">
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

            $('.ajax').select2({
                language: "tr",
                placeholder: "Kullanıcı Seçiniz...",
                minimumInputLength: 2,
                ajax: {
                    url: '#',
                    dataType: 'json',
                    data: function(params) {
                        return {
                            q: $.trim(params.term),
                            page: params.page || 1 // Use params.page for pagination
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

            $('.ajax-role').select2({
                language: "tr",
                placeholder: "Rol Seçiniz...",
                minimumInputLength: 2,
                ajax: {
                    url: '#',
                    dataType: 'json',
                    data: function(params) {
                        return {
                            q: $.trim(params.term),
                            page: params.page || 1 // Use params.page for pagination
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
        })
    </script>
@endsection
