@extends('layouts.admin.app')

@section('title', 'Add New Source - Yaka.la')

@section('content')
    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">Yeni Mutfak Kategorisi</h5> <small class="text-muted float-end">Kaynak Yönetimi</small>
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

            <form>
                @csrf

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Kaynak Adı</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="text"
                               placeholder="Türk Mutfağı" />
                        @error('text')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">Açıklama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="description"
                               placeholder="Açıklama..." />
                        @error('description')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">İkon</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="icon"
                               placeholder="İkon..." />
                        @error('icon')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
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
    <script>
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            makeReqUrl : "{{route('admin.file.uploadRequest')}}"
        };
    </script>
    <script src="{{asset('assets/public-js/view/place/cuisine-categories/add.js')}}" type="module" async></script>
@endsection
