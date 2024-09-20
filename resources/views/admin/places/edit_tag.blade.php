@extends('layouts.admin.app')

@section('title', 'Edit Place Tag - Yaka.la')

@section('content')
    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">İşletme Etiketi Düzenle</h5> <small class="text-muted float-end">İşletme Yönetimi</small>
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
            
            <form action="{{ route('admin.places.editPostTag') }}" method="post">
                @csrf

                <input type="hidden" name="uuid" value="{{ $uuid }}">

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Etiket</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="tag" placeholder="Etiket" value="{{ $tag['tag'] ?? '-' }}">
                        @error('tag')
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
