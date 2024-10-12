<script setup>

</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="product-count d-flex align-items-center gap-3 gap-lg-4 mb-4 fw-medium flex-wrap font-text1">
                <a href="javascript:;"><span class="me-1">All</span><span class="text-secondary">(85472)</span></a>
                <a href="javascript:;"><span class="me-1">Pending Payment</span><span
                        class="text-secondary">(86)</span></a>
                <a href="javascript:;"><span class="me-1">Incomplete</span><span class="text-secondary">(76)</span></a>
                <a href="javascript:;"><span class="me-1">Completed</span><span class="text-secondary">(8759)</span></a>
                <a href="javascript:;"><span class="me-1">Refunded</span><span class="text-secondary">(769)</span></a>
                <a href="javascript:;"><span class="me-1">Failed</span><span class="text-secondary">(42)</span></a>
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
                            <button type="button" class="btn border btn-filter dropdown-toggle px-4"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Payment Status
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
                            <button type="button" class="btn border btn-filter dropdown-toggle px-4"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Completed
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
                            <button type="button" class="btn border btn-filter dropdown-toggle px-4"
                                data-bs-toggle="dropdown" aria-expanded="false">
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
                        <button class="btn btn-primary px-4"><i class="bi bi-plus-lg me-2"></i>Add Order</button>
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
                                        <th>Order Id</th>
                                        <th>Price</th>
                                        <th>Customer</th>
                                        <th>Payment Status</th>
                                        <th>Completed Payment</th>
                                        <th>Delivery Type</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#2415</a>
                                        </td>
                                        <td>$98</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/01.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-success-subtle text-success rounded border border-success-subtle font-text2 fw-bold">Completed<i
                                                    class="bi bi-check2 ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">Failed<i
                                                    class="bi bi-x-lg ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#7845</a>
                                        </td>
                                        <td>$110</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/02.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-warning-subtle text-warning rounded border border-warning-subtle font-text2 fw-bold">Pending<i
                                                    class="bi bi-info-circle ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-primary-subtle text-primary rounded border border-primary-subtle font-text2 fw-bold">Completed<i
                                                    class="bi bi-check2-all ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#5674</a>
                                        </td>
                                        <td>$86</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-primary-subtle text-primary rounded border border-primary-subtle font-text2 fw-bold">Completed<i
                                                    class="bi bi-check2-all ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">Failed<i
                                                    class="bi bi-x-lg ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#6678</a>
                                        </td>
                                        <td>$78</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/04.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-success-subtle text-success rounded border border-success-subtle font-text2 fw-bold">Paid<i
                                                    class="bi bi-check2 ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">Failed<i
                                                    class="bi bi-x-lg ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#2367</a>
                                        </td>
                                        <td>$69</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/05.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">Failed<i
                                                    class="bi bi-x-lg ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-warning-subtle text-warning rounded border border-warning-subtle font-text2 fw-bold">Pending<i
                                                    class="bi bi-info-circle ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#9870</a>
                                        </td>
                                        <td>$49</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/06.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">Failed<i
                                                    class="bi bi-x-lg ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-success-subtle text-success rounded border border-success-subtle font-text2 fw-bold">Completed<i
                                                    class="bi bi-check2 ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
                                        <td>Nov 12, 10:45 PM</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input class="form-check-input" type="checkbox">
                                        </td>
                                        <td>
                                            <a href="javascript:;">#3456</a>
                                        </td>
                                        <td>$65</td>
                                        <td>
                                            <a class="d-flex align-items-center gap-3" href="javascript:;">
                                                <div class="customer-pic">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/07.png" class="rounded-circle"
                                                        width="40" height="40" alt="">
                                                </div>
                                                <p class="mb-0 customer-name fw-bold">Andrew Carry</p>
                                            </a>
                                        </td>
                                        <td><span
                                                class="lable-table bg-success-subtle text-success rounded border border-success-subtle font-text2 fw-bold">Completed<i
                                                    class="bi bi-check2 ms-2"></i></span></td>
                                        <td><span
                                                class="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">Failed<i
                                                    class="bi bi-x-lg ms-2"></i></span></td>
                                        <td>Cash on delivery</td>
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