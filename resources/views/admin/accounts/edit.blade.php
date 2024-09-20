@extends('layouts.admin.app')

@section('title', 'Edit Account Category - Yaka.la')

@section('content')
    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">Hesap Kategorisi Düzenle</h5> <small class="text-muted float-end">Hesap Kategorisi Yönetimi</small>
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

            <form action="{{ route('admin.accounts.editPost') }}" method="post" enctype="multipart/form-data">
                @csrf

                <input type="hidden" name="uuid" value="{{ $uuid }}">

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Hesap Kategorisi Adı</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="title"
                            placeholder="Getir..." value="{{ $category['title'] }}" />
                        @error('title')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">Açıklama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="description"
                            placeholder="Açıklama..." value="{{ $category['description'] }}" />
                        @error('description')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-company">İkon</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-company" name="icon"
                            placeholder="İkon..." value="{{ $category['icon'] }}" />
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