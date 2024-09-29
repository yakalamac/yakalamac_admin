@extends('layouts.admin.app')

@section('title', 'Edit Product - Yaka.la')

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
        <h5 class="mb-0">Ürün Düzenle</h5> <small class="text-muted float-end">Ürün Yönetimi</small>
    </div>
    <div class="card-body">
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

        <form action="{{ route('admin.products.editPost') }}" method="post" enctype="multipart/form-data">
            @csrf

            <input type="hidden" name="is_edited_option" value="0" id="is_edited_option">
            <input type="hidden" class="form-control" name="uuid" readonly value="{{ $uuid }}">
            @error('uuid')
                <span class="text-danger">{{ $message }}</span>
            @enderror

            <div class="row mb-6">
                <label class="col-sm-2 col-form-label" for="basic-default-email">İşletme</label>
                <div class="col-sm-10">
                    <div>
                        <a>
                            <input type="hidden" name="place_id" value="{{$place['id']}}">
                            {{$place['name'] ?? 'İşletme Adı Bulunamadı'}}
                            {{$place['address'] ?  $place['address']['longAddress'] ?? 'Adress Bulunamadı' : 'Adres Hiç Bulunamadı'}}
                        </a>
                    </div>
                    <!-- <select name="place_id" id="" class="ajax w-100">
                        <option value="{{ $placeUuid ?? 0 }}">{{ $place['name'] ?? '-' }}</option>
                    </select> -->
                    @error('place_id')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>
            </div>

            <div class="row mb-6">
                <label class="col-sm-2 col-form-label" for="basic-default-name">Ürün Adı</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="basic-default-name" name="name" placeholder="Baklava..."
                        value="{{ optional($product)['name'] ?? '' }}" />
                    @error('name')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            <div class="row mb-6">
                <label class="col-sm-2 col-form-label" for="basic-default-company">Fiyat</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="basic-default-company" name="price"
                        placeholder="Ünvan..." value="{{ $product['price'] ?? 0 }}" />
                    @error('price')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            <div class="row mb-6">
                <label class="col-sm-2 col-form-label" for="basic-default-email">Aktif Mi?</label>
                <div class="col-sm-10">
                    <select name="active" id="" class="form-select">
                        <option {{ !(isset($product['active']) && $product['active']) ? 'selected' : '' }} value="0">
                            Hayır</option>
                        <option {{ (isset($product['active']) && $product['active']) ? 'selected' : '' }} value="1">Evet
                        </option>
                    </select>
                </div>
            </div>
            <div class="row mb-6">
                <label class="col-sm-2 col-form-label" for="basic-default-rating">Açıklama</label>
                <div class="col-sm-10">
                    <input type="text" id="basic-default-rating" name="description" class="form-control" placeholder="5"
                        value="{{ $product['description'] ?? ''}}" />
                </div>
            </div>

            <div class="row mb-6 border-top pt-3">
                <div class="col-lg-12">
                    <h3>Kategori</h3>
                </div>

                <div class="col-sm-12">
                    <select name="product_category[]" multiple id="product-category-dropdown" class="select2 w-100">
                        @if (!empty($productCategories))
                            @foreach ($productCategories as $productCategory)
                                <option {{ in_array($productCategory['id'], $savedCategories) ? 'selected' : '' }}
                                    value="{{ $productCategory['id'] }}">{{ $productCategory['title'] }}</option>
                            @endforeach
                        @endif
                    </select>
                </div>
            </div>

            <div class="row mb-6 border-top pt-3">
                <div class="col-lg-12">
                    <h3>Tür</h3>
                </div>

                <div class="col-sm-12">
                    <select name="product_type[]" multiple id="product-type-dropdown" class="select2 w-100">
                        @if (!empty($productTypes))
                            @foreach ($productTypes as $productType)
                                <option {{ in_array($productType['id'], $savedTypes) ? 'selected' : '' }}
                                    value="{{ $productType['id'] }}">{{ $productType['type'] }}</option>
                            @endforeach
                        @endif
                    </select>
                </div>
            </div>

            <div class="row mb-6 border-top pt-3">
                <div class="col-lg-12">
                    <h3>Etiket</h3>
                </div>

                <div class="col-sm-12">
                    <select name="product_tag[]" multiple id="product-tag-dropdown" class="select2 w-100">
                        @if (!empty($productTags))
                            @foreach ($productTags as $productTag)
                                <option {{ in_array($productTag['id'], $savedTags) ? 'selected' : '' }}
                                    value="{{ $productTag['id'] }}">{{ $productTag['tag'] }}</option>
                            @endforeach
                        @endif
                    </select>
                </div>
            </div>

            <div class="row mb-6 border-top pt-3">
                <div class="col-lg-12">
                    <h3>Seçenekler</h3>
                </div>
            </div>

            @if (!empty($productOptions))
                @foreach ($productOptions as $option)
                    <input type="hidden" name="edit_option_uuid[]" value="{{ $option['uuid'] }}">

                    <div class="row mb-6 border-top pt-3">
                        <div class="col-lg-4">
                            <label class="col-form-label" for="basic-default-name">Fiyata Etkisi</label>
                            <input type="text" class="form-control" id="basic-default-name" name="edit_option_price[]"
                                placeholder="Fiyata Etkisi..." value="{{ $option['data']['price'] }}" />
                        </div>

                        <div class="col-lg-4">
                            <label class="col-form-label" for="basic-default-name">Açıklama</label>
                            <input type="text" class="form-control" id="basic-default-name" name="edit_option_description[]"
                                placeholder="Açıklama..." value="{{ $option['data']['description'] }}" />
                        </div>

                        <div class="col-lg-4">
                            <label class="col-form-label" for="basic-default-name">Dil Kodu</label>
                            <input type="text" class="form-control" id="basic-default-name" name="edit_option_language_code[]"
                                placeholder="Dil Kodu..." value="{{ $option['data']['languageCode'] }}" />
                        </div>
                    </div>
                @endforeach
            @endif

            <div class="cloned-options"></div>

            <div class="row mb-6">
                <div class="col-lg-12">
                    <a href="javascript:;" class="btn btn-secondary add-option-area"><i
                            class="fa fa-plus"></i>&nbsp;&nbsp;Seçenek Alanı Ekle</a>
                </div>
            </div>

            <div class="row mb-6 border-top pt-3">
                <div class="col-lg-12">
                    <h3>Fotoğraflar</h3>
                </div>
            </div>

            @if (!empty($productPhotos))
                @foreach ($productPhotos as $photo)
                    <input type="hidden" name="edit_photo_uuid[]" value="{{ $photo['uuid'] ?? 0 }}">

                    <div class="row mb-6 border-top pt-3">
                        <div class="col-lg-4">
                            <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label>
                            <input type="file" class="form-control" id="basic-default-name" name="edit_src[]"
                                placeholder="Fotoğraf Yolu..." value="{{ $photo['data']['file'] ?? 0 }}" />
                            <span class="text-primary" style="font-size: 12px">{{ $photo['data']['file'] ?? 0 }}</span>
                        </div>

                        <div class="col-lg-4">
                            <label class="col-form-label" for="basic-default-name">Genişlik(px)</label>
                            <input type="text" class="form-control" id="basic-default-name" name="edit_width_px[]"
                                placeholder="Genişlik(px)..." value="{{ $photo['data']['widthPx'] ?? 0 }}" />
                        </div>

                        <div class="col-lg-4">
                            <label class="col-form-label" for="basic-default-name">Yükseklik(px)</label>
                            <input type="text" class="form-control" id="basic-default-name" name="edit_height_px[]"
                                placeholder="Yükseklik(px)..." value="{{ $photo['data']['heightPx'] ?? 0 }}" />
                        </div>
                        <div class="col-lg-12 mt-2 d-none">
                            <a href="{{ route('admin.products.deletePhoto', ['uuid' => $photo['uuid']]) ?? 0 }}"
                                onclick="return confirm('Bu Fotoğrafı Silmek İstediğinize Emin misiniz?')"
                                class="text-danger"><i class="fa fa-trash"></i></a>
                        </div>
                    </div>
                @endforeach
            @endif

            <div class="cloned-photos"></div>

            <div class="row mb-6">
                <div class="col-lg-12">
                    <a href="javascript:;" class="btn btn-secondary add-photo-area"><i
                            class="fa fa-plus"></i>&nbsp;&nbsp;Fotoğraf Alanı Ekle</a>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12">
                    <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i>&nbsp;&nbsp;Kaydet</button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection

@section('js')


<!-- Local Scripts -->
<script>
    window.Laravel = {
        csrfToken: '{{ csrf_token() }}',
        ajaxUrl: '{{ route('admin.products.ajax') }}',
        makeReqUrl: '{{ route('admin.file.uploadRequest') }}',
        productId: '{{$uuid}}',
    };

</script>
<script src="{{ asset('assets/public-js/view/product-edit/index.js') }}" type="module"></script>

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/i18n/tr.js"></script>

@endsection
@section('js')
    <script>
        $(document).ready(()=>Page.ready());
    </script>
@endsection
