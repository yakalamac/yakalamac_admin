@extends('layouts.admin.app')

@section('title', 'Add New Photo - Yaka.la')

@section('content')
    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">{{ $place->name }} İşletmesine Yeni Fotoğraf Ekle</h5> <small class="text-muted float-end">İşletme Yönetimi</small>
        </div>
        <div class="card-body">
            @if(session()->has('error'))
                <div class="alert alert-danger">
                    {{ session()->get('error') }}
                </div>
            @endif
            
            <form action="{{ route('admin.places.addPhotoPost') }}" method="post">
                @csrf

                <input type="hidden" name="place_id" value="{{ $place->uuid }}">

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Fotoğraf UUID</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="uuid" readonly value="{{ Str::uuid() }}">
                        @error('uuid')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Fotoğraf Yolu</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="src" placeholder="Fotoğraf Yolu..." />
                        @error('src')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">Genişlik(px)</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="width_px" placeholder="Genişlik(px)..." />
                        @error('width_px')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">Yükseklik(px)</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="height_px" placeholder="Yükseklik(px)..." />
                        @error('height_px')
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
