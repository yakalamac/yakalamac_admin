@extends('layouts.admin.app')

@section('title', 'Place Categories - Yaka.la')

@section('content')
    <!-- Put csrf token inside of page -->
    @csrf
    <div class="btns-wrapper float-start w-100 mb-4">
        <a href="{{ route('admin.categories.place_cuisine.add') }}" class="btn rounded-pill btn-primary waves-effect waves-light"><i
                class="fa fa-plus"></i>&nbsp;&nbsp;Yeni Mutfak Kategorisi Ekle</a>
    </div>

    <div class="clearfix"></div>

    @if (session()->has('error'))
        <div class="alert alert-danger">
            {{ session()->get('error') }}
        </div>

        <div class="clearfix"></div>
    @endif

    @if (session()->has('success'))
        <div class="alert alert-success">
            {{ session()->get('success') }}
        </div>

        <div class="clearfix"></div>
    @endif
    <div class="card">
        <h5 class="card-header">Mutfak Kategorileri</h5>
        <div class="table-responsive text-nowrap">
            <table class="table">
                <thead class="table-light">
                <tr>
                    <th>KATEGORİ ADI</th>
                    <th>AÇIKLAMA</th>
                    <th>İŞLEM</th>
                </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    <!-- This area will be fulled by script -->
                </tbody>
            </table>
        </div>
    </div>
    <div class="float-start w-100 mt-3" id="pagination">
        <!-- Pagination Zone -->
    </div>
@endsection
@section('js')
    <script>
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            makeReqUrl : "{{route('admin.file.uploadRequest')}}",
            editCategory : id=> `{{ route('admin.categories.place_cuisine.edit', ['id' => '__id__']) }}`.replace('__id__', id),
           // deleteCategory : id => `{ route('admin.places.deleteCategory', ['uuid' => '__id__']) }}`.replace('__id__',id),
        };
    </script>
    <script src="{{asset('assets/public-js/view/place/cuisine-categories/collection.js')}}" type="module" async></script>
@endsection
