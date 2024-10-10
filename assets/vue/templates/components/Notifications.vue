<script setup>

</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="row row-cols-1 row-cols-lg-5">
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center" onclick="default_noti()">
                        <div class="card-body bg-grd-primary rounded-4">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">notifications</i>
                                </a>
                                <h6 class="mb-0">Default</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-info rounded-4" onclick="info_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">info</i>
                                </a>
                                <h6 class="mb-0">Info</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-warning rounded-4" onclick="warning_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">warning_amber</i>
                                </a>
                                <h6 class="mb-0">Warning</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-danger rounded-4" onclick="error_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">dangerous</i>
                                </a>
                                <h6 class="mb-0">Danger</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-success rounded-4" onclick="success_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">check_circle</i>
                                </a>
                                <h6 class="mb-0">Success</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!--end row-->


            <h6 class="mb-0 text-uppercase">Rounded Corners Notifications</h6>
            <hr>
            <div class="row row-cols-1 row-cols-lg-5">
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center" onclick="round_default_noti()">
                        <div class="card-body bg-grd-primary rounded-4">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">notifications</i>
                                </a>
                                <h6 class="mb-0">Default</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-info rounded-4" onclick="round_info_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">info</i>
                                </a>
                                <h6 class="mb-0">Info</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-warning rounded-4" onclick="round_warning_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">warning_amber</i>
                                </a>
                                <h6 class="mb-0">Warning</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-danger rounded-4" onclick="round_error_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">dangerous</i>
                                </a>
                                <h6 class="mb-0">Danger</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-success rounded-4" onclick="round_success_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">check_circle</i>
                                </a>
                                <h6 class="mb-0">Success</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!--end row-->


            <h6 class="mb-0 text-uppercase">Notifications With image</h6>
            <hr>
            <div class="row row-cols-1 row-cols-lg-5">
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center" onclick="img_default_noti()">
                        <div class="card-body bg-grd-primary rounded-4">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">notifications</i>
                                </a>
                                <h6 class="mb-0">Default</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-info rounded-4" onclick="img_info_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">info</i>
                                </a>
                                <h6 class="mb-0">Info</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-warning rounded-4" onclick="img_warning_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">warning_amber</i>
                                </a>
                                <h6 class="mb-0">Warning</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-danger rounded-4" onclick="img_error_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">dangerous</i>
                                </a>
                                <h6 class="mb-0">Danger</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-success rounded-4" onclick="img_success_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">check_circle</i>
                                </a>
                                <h6 class="mb-0">Success</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!--end row-->


            <h6 class="mb-0 text-uppercase">Alternative Position</h6>
            <hr>
            <div class="row row-cols-1 row-cols-lg-5">
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center" onclick="pos1_default_noti()">
                        <div class="card-body bg-grd-primary rounded-4">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">notifications</i>
                                </a>
                                <h6 class="mb-0">Default</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-info rounded-4" onclick="pos2_info_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">info</i>
                                </a>
                                <h6 class="mb-0">Info</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-warning rounded-4" onclick="pos3_warning_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">warning_amber</i>
                                </a>
                                <h6 class="mb-0">Warning</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-danger rounded-4" onclick="pos4_error_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">dangerous</i>
                                </a>
                                <h6 class="mb-0">Danger</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card p-2 rounded-4 cursor-pointer text-center">
                        <div class="card-body bg-grd-success rounded-4" onclick="pos5_success_noti()">
                            <div class="d-flex flex-column gap-2">
                                <a href="javascript:;"
                                    class="mb-3 text-white rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="material-icons-outlined fs-2">check_circle</i>
                                </a>
                                <h6 class="mb-0">Success</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!--end row-->

        </div>
    </main>
    <!--end main wrapper-->
</template>