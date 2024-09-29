@extends('layouts.admin.app')

@section('title', 'Products - Yaka.la')

@section('content')
    <div class="btns-wrapper float-start w-100 mb-4">
        <a href="{{ route('admin.products.add') }}" class="btn rounded-pill btn-primary waves-effect waves-light"><i
                class="fa fa-plus"></i>&nbsp;&nbsp;Yeni Ürün Ekle</a>
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
        <h5 class="card-header">Ürünler</h5>
        <div class="table-responsive text-nowrap">
            <table class="table">
                <thead class="table-light">
                    <tr>
                        <th>İŞLETME</th>
                        <th>ÜRÜN ADI</th>
                        <th>FİYAT</th>
                        <th>DURUM</th>
                        <th>İŞLEM</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @forelse($products['products'] as $product)
                        @php
                            $uuid = explode($endpoint . '/', $product['data']['@id']);
                        @endphp

                        <tr>
                            <td>
                                {{ $product['place']['name'] ?? '-' }}
                            </td>
                            <td>
                                {{ $product['data']['name'] ?? '-' }}
                            </td>
                            <td>
                                {{ $product['data']['price'] ?? 0 }}₺
                            </td>
                            <td>
                                {!! $product['data']['active']
                                    ? '<span class="text-success fw-bold">Aktif</span>'
                                    : '<span class="text-danger fw-bold">Pasif</span>' !!}
                            </td>
                            <td>
                                <a href="{{ route('admin.products.edit', ['uuid' => $uuid[1]]) }}"><i
                                        class="ti ti-pencil me-1"></i></a>
                                <a href="{{ route('admin.products.delete', ['uuid' => $uuid[1]]) }}"
                                    onclick="return confirm('Bu Veriyi Silmek İstediğinize Emin misiniz?')"><i
                                        class="ti ti-trash me-1"></i></a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4">Ürün Bulunamadı</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="float-start w-100 mt-3">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" href="?page=1">
                        << </a>
                </li>
                @php
                    $pages = ceil($products['total'] / 15);
                    $last = $pages == 0 ? 1 : $pages;
                    if ($page < $pages) {
                        for ($m = $page; $m <= $page + 16; $m++) {
                            echo '<li class="page-item"><a class="page-link" href="?page=' .
                                $m .
                                '">' .
                                $m .
                                '</a></li>';
                        }
                    } else {
                        echo '<li class="page-item"><a class="page-link" href="?page=' . $last . '">Son</a></li>';
                    }
                @endphp
                <li class="page-item"><a class="page-link" href="?page={{ $last }}">>></a></li>
            </ul>
        </nav>
    </div>
@endsection
@section('js')
    <script>
        $(document).ready(()=>Page.ready());
    </script>
@endsection
