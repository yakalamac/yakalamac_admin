@extends('layouts.admin.app')

@section('title', 'Edit Place Category - Yaka.la')

@section('content')
    <div class="card mb-6">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="mb-0">Konsept Kategorisi Düzenle</h5>
            <small class="text-muted float-end">Kategori Yönetimi</small>
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

            <form method="post">
                @csrf
                <input type="hidden" name="id" value="{{ $id }}">
                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Ünvan</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="title" placeholder="Başlık">
                        @error('title')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="row mb-6">
                    <label class="col-sm-2 col-form-label" for="basic-default-name">Açıklama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="basic-default-name" name="description"
                               placeholder="Açıklama..." value="{{ $category['description'] ?? '-' }}"/>
                        @error('description')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-sm-10">
                        <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i>&nbsp;&nbsp;Kaydet
                        </button>
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
            makeReqUrl: "{{route('admin.file.uploadRequest')}}",
            id: {{ $id }}
        };
    </script>
    <script type="module" src="{{ asset('assets/public-js/view/place/concept-categories/edit.js') }}"></script>
@endsection
