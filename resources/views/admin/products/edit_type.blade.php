@extends('layouts.admin.app')

@section('title', 'Edit Product Type - Yaka.la')

@section('content')
    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">Ürün Türü Düzenle</h5> <small class="text-muted float-end">Ürün Yönetimi</small>
        </div>
        <div class="card-body">
            @if(session()->has('error'))
                <div class="alert alert-danger">
                    {{ session()->get('error') }}
                </div>
            @endif

            @if(session()->has('success'))
                <div class="alert alert-success">
                    {{ session()->get('success') }}
                </div>
            @endif
            
            <form action="{{ route('admin.products.editProductType') }}" method="post">
                @csrf

                <input type="hidden" name="uuid" value="{{ $uuid }}">

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Tür</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="type" placeholder="Tür" value="{{ $type['type'] ?? '-' }}">
                        @error('type')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Açıklama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="description" placeholder="Açıklama..." value="{{ $type['description'] ?? '-' }}" />
                        @error('description')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-sm-10">
                        <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i>&nbsp;&nbsp;Kaydet</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
