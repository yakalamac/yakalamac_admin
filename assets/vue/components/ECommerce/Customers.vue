<script setup>

</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="product-count d-flex align-items-center gap-3 gap-lg-4 mb-4 fw-bold flex-wrap font-text1">
                <a href="javascript:;"><span class="me-1">All</span><span class="text-secondary">(85472)</span></a>
                <a href="javascript:;"><span class="me-1">New</span><span class="text-secondary">(145)</span></a>
                <a href="javascript:;"><span class="me-1">Checkouts</span><span class="text-secondary">(89)</span></a>
                <a href="javascript:;"><span class="me-1">Locals</span><span class="text-secondary">(5872)</span></a>
                <a href="javascript:;"><span class="me-1">Subscribers</span><span
                        class="text-secondary">(163)</span></a>
                <a href="javascript:;"><span class="me-1">Top Reviews</span><span class="text-secondary">(8)</span></a>
            </div>

            <div class="row g-3">
                <div class="col-auto">
                    <div class="position-relative">
                        <input class="form-control px-5" type="search" placeholder="Search Customers">
                        <span
                            class="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50 fs-5">search</span>
                    </div>
                </div>
                <div class="col-auto flex-grow-1 overflow-auto">
                    <div class="btn-group position-static">
                        <div class="btn-group position-static">
                            <button type="button" class="btn btn-filter dropdown-toggle px-4" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Country
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                            </ul>
                        </div>
                        <div class="btn-group position-static">
                            <button type="button" class="btn btn-filter dropdown-toggle px-4" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Source
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                            </ul>
                        </div>
                        <div class="btn-group position-static">
                            <button type="button" class="btn btn-filter dropdown-toggle px-4" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                More Filters
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                                <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="d-flex align-items-center gap-2 justify-content-lg-end">
                        <button class="btn btn-filter px-4"><i class="bi bi-box-arrow-right me-2"></i>Export</button>
                        <button class="btn btn-primary px-4"><i class="bi bi-plus-lg me-2"></i>Add Customers</button>
                    </div>
                </div>
            </div><!--end row-->

            <div class="card mt-4">
                <div class="card-body">
                    <div class="customer-table">
                        <div class="table-responsive white-space-nowrap">
                            <table class="table align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>
                                            <input class="form-check-input" type="checkbox">
                                        </th>
                                        <th>Customers</th>
                                        <th>Email</th>
                                        <th>Orders</th>
                                        <th>Total Spent</th>
                                        <th>Location</th>
                                        <th>Last Seen</th>
                                        <th>Last Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/01.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/02.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/04.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/05.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/06.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/07.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/08.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/09.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/10.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="javascript:;" class="font-text1">abcexample.com</a>
                                        </td>
                                        <td>142</td>
                                        <td>$2485</td>
                                        <td>England</td>
                                        <td>24 min ago</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!--end main wrapper-->
</template>