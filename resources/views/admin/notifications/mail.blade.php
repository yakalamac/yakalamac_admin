@extends('layouts.admin.app')

@section('title', 'Mail Notifications - Yaka.la')

@section('content')
    <div class="btns-wrapper float-start w-100 mb-4">
        <a href="{{ route('admin.notifications.addMail') }}" class="btn rounded-pill btn-primary waves-effect waves-light"><i
                class="fa fa-plus"></i>&nbsp;&nbsp;Yeni Mail Bildirimi Ekle</a>
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
        <h5 class="card-header">Mail Bildirimleri</h5>
        <div class="table-responsive text-nowrap">
            <table class="table" id="isletmelerTablosu" data-page-length='15'>
                <thead class="table-light">
                    <tr>
                        <th>KULLANICI ADI</th>
                        <th>ROL</th>
                        <th>İŞLEM</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @forelse($notifications as $notification)
                        <tr>
                            <td>
                                {{ $notification['name'] }}
                            </td>
                            <td>
                                {!! $notification['owner']
                                    ? '<span class="text-success fw-bold">Evet</span>'
                                    : '<span class="text-danger fw-bold">Hayır</span>' !!}
                            </td>
                            <td>
                                @if (!empty($notification['address']) && !empty($notification['address']['shortAddress']))
                                    <a title="{{ $notification['address']['shortAddress'] }}">
                                            @if(strlen($notification['address']['shortAddress'] < 100))
                                            {{Str::substr($notification['address']['shortAddress'], 0, 100)}}
                                            @else
                                            {{ Str::substr($notification['address']['shortAddress'], 0, 100).'...'}}
                                            @endif
                                    </a>
                                @else
                                    Adres bilgisi mevcut değil.
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('admin.places.edit', ['uuid' => is_array($uuid) ?  $uuid[1] : $uuid]) }}"><i
                                        class="ti ti-pencil me-1"></i></a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3">Bildirim Bulunamadı</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="float-start w-100 mt-3">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    @if(request()->get('addressSearch'))
                        <a class="page-link" href="?page=1&addressSearch={{request()->get('addressSearch')}}">
                    @else
                        <a class="page-link" href="?page=1">
                    @endif
                        <<
                    </a>
                </li>
                @php
                    $pages = ceil($total / 15);
                    if ($page < $pages) {
                        for ($m = $page; $m <= $page + 16; $m++) {
                            if(request()->get('addressSearch'))
                            {
                                echo '<li class="page-item"><a class="page-link" href="?page=' .
                                $m .
                                '&addressSearch=' .
                                request()->get('addressSearch').
                                '">'.
                                $m. //Sayfa numarası text olarak
                                '</a></li>';
                            }
                            else
                            {
                                echo '<li class="page-item"><a class="page-link" href="?page=' .
                                    $m .
                                    '&query=' .
                                    request()->get('query') .
                                    '">' .
                                    $m .
                                    '</a></li>';
                            }
                        }
                    } else {
                        if(request()->get('addressSearch'))
                            echo '<li class="page-item"><a class="page-link" href="?page=' .
                            $pages .
                            '&addressSearch=' .
                            request()->get('addressSearch') .
                            '">Son</a></li>';
                        else
                            echo '<li class="page-item"><a class="page-link" href="?page=' .
                                $pages .
                                '&query=' .
                                request()->get('query') .
                                '">Son</a></li>';
                    }
                @endphp
                <li class="page-item">
                    @if(request()->get('addressSearch'))
                        <a class="page-link" href="?page={{ $pages }}&addressSearch={{ request()->get('addressSearch') }}">
                    @else
                        <a class="page-link" href="?page={{ $pages }}">
                    @endif

                        >>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
@endsection
@extends('layouts.admin.app')

@section('title', 'Push Notifications - Yaka.la')

@section('content')
    <div class="btns-wrapper float-start w-100 mb-4">
        <a href="{{ route('admin.notifications.addPush') }}" class="btn rounded-pill btn-primary waves-effect waves-light"><i
                class="fa fa-plus"></i>&nbsp;&nbsp;Yeni Push Bildirimi Ekle</a>
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
        <h5 class="card-header">Push Bildirimleri</h5>
        <div class="table-responsive text-nowrap">
            <table class="table" id="isletmelerTablosu" data-page-length='15'>
                <thead class="table-light">
                    <tr>
                        <th>KULLANICI ADI</th>
                        <th>ROL</th>
                        <th>İŞLEM</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @forelse($notifications as $notification)
                        <tr>
                            <td>
                                {{ $notification['name'] }}
                            </td>
                            <td>
                                {!! $notification['owner']
                                    ? '<span class="text-success fw-bold">Evet</span>'
                                    : '<span class="text-danger fw-bold">Hayır</span>' !!}
                            </td>
                            <td>
                                @if (!empty($notification['address']) && !empty($notification['address']['shortAddress']))
                                    <a title="{{ $notification['address']['shortAddress'] }}">
                                            @if(strlen($notification['address']['shortAddress'] < 100))
                                            {{Str::substr($notification['address']['shortAddress'], 0, 100)}}
                                            @else
                                            {{ Str::substr($notification['address']['shortAddress'], 0, 100).'...'}}
                                            @endif
                                    </a>
                                @else
                                    Adres bilgisi mevcut değil.
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('admin.places.edit', ['uuid' => is_array($uuid) ?  $uuid[1] : $uuid]) }}"><i
                                        class="ti ti-pencil me-1"></i></a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3">Bildirim Bulunamadı</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="float-start w-100 mt-3">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    @if(request()->get('addressSearch'))
                        <a class="page-link" href="?page=1&addressSearch={{request()->get('addressSearch')}}">
                    @else
                        <a class="page-link" href="?page=1">
                    @endif
                        <<
                    </a>
                </li>
                @php
                    $pages = ceil($total / 15);
                    if ($page < $pages) {
                        for ($m = $page; $m <= $page + 16; $m++) {
                            if(request()->get('addressSearch'))
                            {
                                echo '<li class="page-item"><a class="page-link" href="?page=' .
                                $m .
                                '&addressSearch=' .
                                request()->get('addressSearch').
                                '">'.
                                $m. //Sayfa numarası text olarak
                                '</a></li>';
                            }
                            else
                            {
                                echo '<li class="page-item"><a class="page-link" href="?page=' .
                                    $m .
                                    '&query=' .
                                    request()->get('query') .
                                    '">' .
                                    $m .
                                    '</a></li>';
                            }
                        }
                    } else {
                        if(request()->get('addressSearch'))
                            echo '<li class="page-item"><a class="page-link" href="?page=' .
                            $pages .
                            '&addressSearch=' .
                            request()->get('addressSearch') .
                            '">Son</a></li>';
                        else
                            echo '<li class="page-item"><a class="page-link" href="?page=' .
                                $pages .
                                '&query=' .
                                request()->get('query') .
                                '">Son</a></li>';
                    }
                @endphp
                <li class="page-item">
                    @if(request()->get('addressSearch'))
                        <a class="page-link" href="?page={{ $pages }}&addressSearch={{ request()->get('addressSearch') }}">
                    @else
                        <a class="page-link" href="?page={{ $pages }}">
                    @endif

                        >>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
@endsection
@section('js')
    <script>
        $(document).ready(()=>Page.ready());
    </script>
@endsection
