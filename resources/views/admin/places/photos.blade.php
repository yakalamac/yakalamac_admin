@extends('layouts.admin.app')

@section('title', 'Places - Yaka.la')

@section('content')
    <div class="btns-wrapper float-start w-100 mb-4">
        <a href="{{ route('admin.places.addPhoto', ['uuid' => $place->uuid]) }}"
            class="btn rounded-pill btn-primary waves-effect waves-light"><i class="fa fa-plus"></i>&nbsp;&nbsp;Yeni Fotoğraf
            Ekle</a>
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
        <h5 class="card-header">{{ $place->name }} İşletmesinin Fotoğrafları</h5>
        <div class="table-responsive text-nowrap">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>FOTOĞRAF YOLU</th>
                        <th>GENİŞLİK</th>
                        <th>YÜKSEKLİK</th>
                        <th>İŞLEM</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @forelse($photos as $photo)
                        <tr>
                            <td>
                                {{ $loop->iteration }}
                            </td>
                            <td>
                                {{ $photo->src }}
                            </td>
                            <td>
                                {{ $photo->width_px }}px
                            </td>
                            <td>
                                {{ $photo->height_px }}px
                            </td>
                            <td>
                                <div class="dropdown">
                                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                        data-bs-toggle="dropdown"><i class="ti ti-dots-vertical"></i></button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item"
                                            href="{{ route('admin.places.deletePhoto', ['uuid' => $photo->uuid]) }}"
                                            onclick="return confirm('Bu Veriyi Silmek İstediğinize Emin misiniz?')"><i
                                                class="ti ti-trash me-1"></i>
                                            Sil</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4">Fotoğraf Bulunamadı</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="float-start w-100 mt-3">
        {{ $photos->links() }}
    </div>
@endsection
