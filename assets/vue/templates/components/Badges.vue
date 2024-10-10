<script setup>

</script>

<template>
    <main class="main-wrapper">
        <div class="main-content">
            <div class="card">
                <div class="card-header">
                    <h6 class="card-title mb-0 py-1">Basic Badge</h6>
                </div>
                <div class="card-body">
                    <span class="badge bg-grd-primary">Primary</span>
                    <span class="badge bg-grd-voilet">Secondary</span>
                    <span class="badge bg-grd-success">Success</span>
                    <span class="badge bg-grd-danger">Danger</span>
                    <span class="badge bg-grd-warning text-dark">Warning</span>
                    <span class="badge bg-grd-info text-dark">Info</span>
                    <span class="badge bg-light text-white">Light</span>
                    <span class="badge bg-grd-royal">Dark</span>
                    <hr> <span class="badge rounded-pill bg-grd-primary">Primary</span>
                    <span class="badge rounded-pill bg-grd-voilet">Secondary</span>
                    <span class="badge rounded-pill bg-grd-success">Success</span>
                    <span class="badge rounded-pill bg-grd-danger">Danger</span>
                    <span class="badge rounded-pill bg-grd-warning text-dark">Warning</span>
                    <span class="badge rounded-pill bg-grd-info text-dark">Info</span>
                    <span class="badge rounded-pill bg-light text-white">Light</span>
                    <span class="badge rounded-pill bg-grd-royal">Dark</span>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="card-title mb-0 py-1">Buttons Badge</h6>
                </div>
                <div class="card-body">
                    <div class="row row-cols-auto g-3">
                        <div class="col">
                            <button type="button" class="btn btn-grd-primary">Notifications <span
                                    class="badge bg-dark">8</span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-grd-danger">Notifications <span
                                    class="badge bg-dark">5</span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-grd-success">Notifications <span
                                    class="badge bg-dark">10</span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-grd-warning">Notifications <span
                                    class="badge bg-dark">6</span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-grd-info">Notifications <span
                                    class="badge bg-dark">7</span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-grd-royal">Notifications <span
                                    class="badge bg-secondary">6</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="card-title mb-0 py-1">Badge Usage</h6>
                </div>
                <div class="card-body">
                    <div class="row row-cols-auto gy-4">
                        <div class="col">
                            <button type="button" class="btn btn-dark position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">chat_bubble_outline</i>Comments<span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">+18
                                    <span class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-danger position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">chat_bubble_outline</i>Bookmark<span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">+18
                                    <span class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-primary position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">favorite_border</i>Wishlist<span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">10<span
                                        class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-success position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">event</i>Event<span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">10<span
                                        class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-warning position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">assignment</i>Projects<span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">8k
                                    <span class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-info position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">account_circle</i>Teams<span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">24
                                    <span class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-secondary position-relative d-flex gap-2"><i
                                    class="material-icons-outlined">alarm_on</i>Alerts <span
                                    class="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2"><span
                                        class="visually-hidden">unread messages</span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6 class="card-title mb-0 py-1">Icon Badge</h6>
                </div>
                <div class="card-body">
                    <div class="row row-cols-auto g-4">
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-white bg-grd-branding"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">7</span>
                                <i class="material-icons-outlined">notifications</i>
                            </a>
                        </div>
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-white bg-grd-primary"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">9</span>
                                <i class="material-icons-outlined">favorite_border</i>
                            </a>
                        </div>
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-white bg-grd-success"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">4</span>
                                <i class="material-icons-outlined">verified_user</i>
                            </a>
                        </div>
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-dark bg-grd-warning"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">8</span>
                                <i class="material-icons-outlined">home</i>
                            </a>
                        </div>
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-white bg-grd-royal"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">6</span>
                                <i class="material-icons-outlined">date_range</i>
                            </a>
                        </div>
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-white bg-grd-info"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">5</span>
                                <i class="material-icons-outlined">notification_important</i>
                            </a>
                        </div>
                        <div class="col">
                            <a class="badge-icon position-relative p-3 rounded-circle text-white bg-secondary"
                                href="javascript:;">
                                <span class="badge-number position-absolute top-0 end-0">8</span>
                                <i class="material-icons-outlined">chat_bubble_outline</i>
                            </a>
                        </div>


                    </div><!--end row-->

                </div>
            </div>


        </div>
    </main>
    <!--end main wrapper-->
</template>