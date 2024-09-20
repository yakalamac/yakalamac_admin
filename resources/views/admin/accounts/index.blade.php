@extends('layouts.admin.app')

@section('title', 'Account Categories - Yaka.la')

@section('content')
    <div class="btns-wrapper float-start w-100 mb-4">
        <a href="{{ route('admin.accounts.add') }}" class="btn rounded-pill btn-primary waves-effect waves-light"><i
                class="fa fa-plus"></i>&nbsp;&nbsp;Yeni Hesap Kategorisi Ekle</a>
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
        <h5 class="card-header">Hesap Kategorileri</h5>
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
                    @forelse($accounts as $category)
                        @php
                            $uuid = explode($endpoint . '/', $category['@id']);
                        @endphp
                        <tr>
                            <td>
                                {{ $category['title'] ?? '-' }}
                            </td>
                            <td>
                                {{ $category['description'] ?? '-' }}
                            </td>
                            <td>
                                <a href="{{ route('admin.accounts.edit', ['uuid' => $uuid[1]]) }}"><i
                                        class="ti ti-pencil me-1"></i></a>
                                <a href="{{ route('admin.accounts.delete', ['uuid' => $uuid[1]]) }}"
                                    onclick="return confirm('Bu Veriyi Silmek İstediğinize Emin misiniz?')"><i
                                        class="ti ti-trash me-1"></i></a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4">Hesap Kategorisi Bulunamadı</td>
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
                    $pages = ceil($total / 15);
                    if ($page < $pages) {
                        for ($m = $page; $m <= $page + 16; $m++) {
                            echo '<li class="page-item"><a class="page-link" href="?page=' .
                                $m .
                                '">' .
                                $m .
                                '</a></li>';
                        }
                    } else {
                        echo '<li class="page-item"><a class="page-link" href="?page=' . $pages . '">Son</a></li>';
                    }
                @endphp
                <li class="page-item"><a class="page-link" href="?page={{ $pages }}">>></a></li>
            </ul>
        </nav>
    </div>
@endsection
