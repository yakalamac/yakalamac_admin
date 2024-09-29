<!DOCTYPE html>
<html lang="en" class="light-style layout-navbar-fixed layout-menu-fixed layout-compact" dir="ltr"
      data-theme="theme-default" data-assets-path="{{ asset('/') }}assets/" data-template="vertical-menu-template"
      data-style="light">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
        <title>@yield('title', ' - Yaka.la')</title>

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('/') }}assets/img/fav.png" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
            rel="stylesheet">
        {{--    <link rel="stylesheet" href="https://cdn.datatables.net/2.1.5/css/dataTables.dataTables.min.css"> --}}

        <!-- Icons -->
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/fonts/fontawesome.css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/fonts/tabler-icons.css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/fonts/flag-icons.css" />
        <!-- Core CSS -->
        <link rel="stylesheet" href="{{ asset('assets/css/loader.css') }}"/>
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/css/rtl/core.css"
            class="template-customizer-core-css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/css/rtl/theme-default.css"
            class="template-customizer-theme-css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/css/demo.css" />
        <!-- Vendors CSS -->
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/libs/node-waves/node-waves.css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/libs/typeahead-js/typeahead.css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/libs/apex-charts/apex-charts.css" />
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css">
        <link rel="stylesheet"
            href="{{ asset('/') }}assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css">
        <link rel="stylesheet" href="{{ asset('/') }}assets/vendor/libs/datatables-buttons-bs5/buttons.bootstrap5.css">
        <link rel="stylesheet" href="{{ asset('assets/css/success.css') }}">

        <!-- Page CSS -->

        <!-- Helpers -->
        <script src="{{ asset('/') }}assets/vendor/js/helpers.js"></script>
        <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

        <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
        <script src="{{ asset('/') }}assets/js/config.js"></script>
    </head>
    <body>

        <!-- ?PROD Only: Google Tag Manager (noscript) (Default ThemeSelection: GTM-5DDHKGP, PixInvent: GTM-5J3LMKC) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5J3LMKC" height="0" width="0"
                style="display: none; visibility: hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->

        <!-- Layout wrapper -->
        <div class="layout-wrapper layout-content-navbar  ">
            <div class="layout-container">

                <!-- Menu -->
                <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">

                    <div class="app-brand demo ">
                        <img src="{{ asset('assets/img/logo2.png') }}" width="100" alt="logo-yakalamac">

                        <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
                            <i class="ti menu-toggle-icon d-none d-xl-block align-middle"></i>
                            <i class="ti ti-x d-block d-xl-none ti-md align-middle"></i>
                        </a>
                    </div>

                    <div class="menu-inner-shadow"></div>

                    <ul class="menu-inner py-1">
                        <!-- Dashboards -->
                        <li class="menu-item">
                            <a href="{{ route('admin.dashboard') }}" class="menu-link">
                                <i class="menu-icon tf-icons fa fa-home"></i>
                                <div data-i18n="Dashboard">Dashboard</div>
                            </a>
                        </li>

                        <li class="menu-item {{ Route::is('admin.file.upload') ? 'active' : '' }}">
                            <a href="{{ route('admin.file.upload') }}" class="menu-link">
                                <i class="menu-icon tf-icons fa fa-paperclip"></i>
                                <div data-i18n="Dosya ile Yükle">Dosya ile Yükle</div>
                            </a>
                        </li>

                        <!-- Layouts -->
                        <li class="menu-item open {{ Route::is('admin.places.*') ? 'active' : '' }}">
                            <a href="javascript:" class="menu-link menu-toggle">
                                <i class="menu-icon tf-icons fa fa-building"></i>
                                <div data-i18n="İşletme Yönetimi">İşletme Yönetimi</div>
                            </a>
                            <ul class="menu-sub">
                                <li class="menu-item">
                                    <a href="{{ route('admin.places.types') }}" class="menu-link">
                                        <div data-i18n="İşletme Türleri">İşletme Türleri</div>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="{{ route('admin.places.tags') }}" class="menu-link">
                                        <div data-i18n="İşletme Etiketleri">İşletme Etiketleri</div>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="{{ route('admin.places.photoCategories') }}" class="menu-link">
                                        <div data-i18n="İşletme Fotoğraf Kategorileri">İşletme Fotoğraf Kategorileri</div>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="{{ route('admin.places.index') }}" class="menu-link">
                                        <div data-i18n="İşletmeler">İşletmeler</div>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="menu-item open {{ Route::is('admin.products.*') ? 'active' : '' }}">
                            <a href="javascript:" class="menu-link menu-toggle">
                                <i class="menu-icon tf-icons fa fa-tag"></i>
                                <div data-i18n="Ürün Yönetimi">Ürün Yönetimi</div>
                            </a>
                            <ul class="menu-sub">
                                <li class="menu-item">
                                    <a href="{{ route('admin.products.categories') }}" class="menu-link">
                                        <div data-i18n="Ürün Kategorileri">Ürün Kategorileri</div>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="{{ route('admin.products.types') }}" class="menu-link">
                                        <div data-i18n="Ürün Türleri">Ürün Türleri</div>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="{{ route('admin.products.tags') }}" class="menu-link">
                                        <div data-i18n="Ürün Etiketleri">Ürün Etiketleri</div>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="{{ route('admin.products.index') }}" class="menu-link">
                                        <div data-i18n="Ürünler">Ürünler</div>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="menu-item open {{ Route::is('admin.notifications.*') ? 'active' : '' }}">
                            <a href="javascript:" class="menu-link menu-toggle">
                                <i class="menu-icon tf-icons fa fa-bell"></i>
                                <div data-i18n="Bildirim Yönetimi">Bildirim Yönetimi</div>
                            </a>
                            <ul class="menu-sub">
                                <li class="menu-item"><a href="{{ route('admin.notifications.sms') }}"
                                        class="menu-link">
                                        <div data-i18n="SMS Bildirimleri">SMS Bildirimleri</div>
                                    </a>
                                </li>
                                <li class="menu-item"><a href="{{ route('admin.notifications.push') }}"
                                        class="menu-link">
                                        <div data-i18n="Push Bildirimleri">Push Bildirimleri</div>
                                    </a>
                                </li>
                                <li class="menu-item"><a href="{{ route('admin.notifications.mail') }}"
                                        class="menu-link">
                                        <div data-i18n="Mail Bildirimleri">Mail Bildirimleri</div>
                                    </a>
                                </li>
                            </ul>
                        </li>


                        <li class="menu-item open {{ Route::is('admin.categories.*') ? 'active' : '' }}">
                            <a href="javascript:" class="menu-link menu-toggle">
                                <i class="menu-icon tf-icons fa fa-building"></i>
                                <div data-i18n="Kategori Yönetimi">Kategori Yönetimi</div>
                            </a>
                            <ul class="menu-sub">
                                <li class="menu-item {{ Route::is('admin.categories.place.collection') ? 'active' : ''}}">
                                    <a href="{{ route('admin.categories.place.collection') }}" class="menu-link">
                                        <div data-i18n="İşletme Kategorileri">
                                            İşletme Kategorileri
                                        </div>
                                    </a>
                                </li>
                                <li class="menu-item {{ Route::is('admin.categories.place_concept.collection') ? 'active' : ''}}">
                                    <a href="{{ route('admin.categories.place_concept.collection') }}" class="menu-link">
                                        <div data-i18n="Konsept (Ambiyans) Kategorileri">
                                            Konsept (Ambiyans) Kategorileri
                                        </div>
                                    </a>
                                </li>
                                <li class="menu-item {{ Route::is('admin.categories.place_cuisine.collection') ? 'active' : ''}}">
                                    <a href="{{ route('admin.categories.place_cuisine.collection') }}" class="menu-link">
                                        <div data-i18n="Mutfak Kategorileri">Mutfak Kategorileri</div>
                                    </a>
                                </li>
                                <li class="menu-item {{ Route::is('admin.accounts.*') ? 'active' : '' }}">
                                    <a href="{{ route('admin.accounts.index') }}" class="menu-link">
                                        <i class="menu-icon tf-icons fa fa-shield"></i>
                                        <div data-i18n="Hesap Kategori Yönetimi">Hesap Kategorileri</div>
                                    </a>
                                </li>
                                <li class="menu-item {{ Route::is('admin.categories.index') ? 'active' : '' }}">
                                    <a href="{{ route('admin.categories.index') }}" class="menu-link">
                                        <i class="menu-icon tf-icons fa fa-list"></i>
                                        <div data-i18n="Kaynak Yönetimi">Kaynak Kategorileri</div>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li class="menu-item">
                            <a href="{{ route('auth.logout') }}" class="menu-link">
                                <i class="menu-icon tf-icons fa fa-right-from-bracket"></i>
                                <div data-i18n="Çıkış Yap">Çıkış Yap</div>
                            </a>
                        </li>
                    </ul>
                </aside>

                <div class="layout-page"
                    style="{{ Route::is('admin.places.*') || Route::is('admin.products.*') ? '' : 'padding-top: 20px !important' }}">
                    @if (Route::is('admin.places.*') || Route::is('admin.products.*'))
                        <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                            id="layout-navbar">
                            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0   d-xl-none ">
                                <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                                    <i class="ti ti-menu-2 ti-md"></i>
                                </a>
                            </div>

                            <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                                <!-- Search -->
                                <div class="navbar-nav align-items-center">
                                    <div class="nav-item navbar-search-wrapper mb-0">
                                        <a class="nav-item nav-link search-toggler d-flex align-items-center px-0"
                                            href="javascript:void(0);">
                                            <i class="ti ti-search ti-md me-2 me-lg-4 ti-lg"></i>
                                            <span class="d-none d-md-inline-block text-muted fw-normal">Search
                                                (Ctrl+/)</span>
                                        </a>
                                    </div>
                                </div>
                                <!-- /Search -->
                            </div>

                            <!-- Search Small Screens -->
                            <div class="navbar-search-wrapper search-input-wrapper  d-none">
                                <form
                                    action="{{ Route::is('admin.places.*') ? route('admin.places.search') : route('admin.products.search') }}"
                                    method="get">
                                    <input type="text" name="query"
                                        class="form-control search-input container-xxl border-0"
                                        placeholder="Arama Yap..." aria-label="Search...">
                                    <i class="ti ti-x search-toggler cursor-pointer"></i>
                                </form>
                            </div>

                        </nav>
                    @endif

                    <!-- / Navbar -->

                    <!-- Content wrapper -->
                    <div class="content-wrapper">

                        <!-- Content -->

                        <div class="loader"></div>
                        <div class="container-xxl flex-grow-1 container-p-y" id="main-container" hidden>
                            @yield('content')
                        </div>

                        <div id="status-zone">
                            <!-- / Status zone to show status-->
                        </div>

                        <!-- / Content -->

                        <!-- Footer -->
                        <footer class="content-footer footer bg-footer-theme">
                            <div class="container-xxl">
                                <div
                                    class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                                    <div class="text-body">
                                        ©
                                        <script>
                                            document.write(new Date().getFullYear())
                                        </script>, made with ❤️ by Yaka.la
                                    </div>
                                </div>
                            </div>
                        </footer>
                        <!-- / Footer -->
                        <div class="content-backdrop fade"></div>
                    </div>
                    <!-- Content wrapper -->
                </div>
                <!-- / Layout page -->
            </div>



            <!-- Overlay -->
            <div class="layout-overlay layout-menu-toggle"></div>


            <!-- Drag Target Area To SlideIn Menu On Small Screens -->
            <div class="drag-target"></div>

        </div>

        <script src="{{ asset('/') }}assets/vendor/libs/jquery/jquery.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/popper/popper.js"></script>
        <script src="{{ asset('/') }}assets/vendor/js/bootstrap.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/node-waves/node-waves.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/hammer/hammer.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/i18n/i18n.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/typeahead-js/typeahead.js"></script>
        <script src="{{ asset('/') }}assets/vendor/js/menu.js"></script>

        {{--    <script src="https://cdn.datatables.net/2.1.5/js/dataTables.min.js"></script> --}}
        {{--    <!-- endbuild --> --}}
        {{--    <script> --}}
        {{--        $(document).ready(function(){ --}}
        {{--            let table = new DataTable('#isletmelerTablosu'); --}}
        {{--        }); --}}
        {{--    </script> --}}
        <!-- Vendors JS -->

        <script src="{{ asset('/') }}assets/vendor/libs/apex-charts/apexcharts.js"></script>
        <script src="{{ asset('/') }}assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>

        <!-- Main JS -->
        <script src="{{ asset('/') }}assets/js/main.js"></script>

        <!-- Page JS -->
        <script src="{{ asset('/') }}assets/js/app-ecommerce-dashboard.js"></script>

        <script>
             const Page = {
               ready : function (){
                   $('#main-container').removeAttr('hidden');
                   $('div.loader').remove();
               },
               load : function (){
                   $('#main-container').attr('hidden',true);
                   $('div.content-wrapper').appendChild(
                       $('<div class="loader"></div>')
                   );
               },
                error : function (){

                },
                 failure : function (){

                 }
             };
        </script>
        @yield('js')
    </body>
</html>
