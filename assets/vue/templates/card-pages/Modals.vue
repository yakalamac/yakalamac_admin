<script setup>
</script>

<template>
    <main class="main-wrapper">
        <div class="main-content">
            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-body">
                            <h5 class="mb-0">Basic Modal</h5>
                            <p class="my-3">In publishing and graphic design, Lorem ipsum is a placeholder text commonly
                                used to
                                demonstrate the visual
                                content. </p>
                            <div class="">
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-grd-primary px-4" data-bs-toggle="modal"
                                    data-bs-target="#BasicModal">Click Me</button>
                                <!-- Modal -->
                                <div class="modal fade" id="BasicModal">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header border-bottom-0 py-2">
                                                <h5 class="modal-title">Modal title</h5>
                                                <a href="javascript:;" class="primaery-menu-close"
                                                    data-bs-dismiss="modal">
                                                    <i class="material-icons-outlined">close</i>
                                                </a>
                                            </div>
                                            <div class="modal-body">It is a long established fact that a reader will be
                                                distracted by the readable content of a page when looking at its layout.
                                                The point of using
                                                Lorem Ipsum is
                                                that it has a more-or-less normal distribution of letters, as opposed to
                                                using 'Content here,
                                                content here', making
                                                it look like readable English. Many desktop publishing packages and web
                                                page editors now use
                                                Lorem Ipsum as their
                                                default model text, and a search for
                                                'lorem ipsum' will uncover many web sites still in their infancy.</div>
                                            <div class="modal-footer border-top-0">
                                                <button type="button" class="btn btn-grd-danger"
                                                    data-bs-dismiss="modal">Delete</button>
                                                <button type="button" class="btn btn-grd-info">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-body">
                            <h5 class="mb-0">Scrollable Modal</h5>
                            <p class="my-3">In publishing and graphic design, Lorem ipsum is a placeholder text commonly
                                used to
                                demonstrate the visual
                                content. </p>
                            <div class="">
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-grd-primary px-4" data-bs-toggle="modal"
                                    data-bs-target="#ScrollableModal">Click Me</button>
                                <!-- Modal -->
                                <div class="modal fade" id="ScrollableModal">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                        <div class="modal-content">
                                            <div class="modal-header border-bottom-0 bg-grd-primary py-2">
                                                <h5 class="modal-title">Order Summary</h5>
                                                <a href="javascript:;" class="primaery-menu-close"
                                                    data-bs-dismiss="modal">
                                                    <i class="material-icons-outlined">close</i>
                                                </a>
                                            </div>
                                            <div class="modal-body">
                                                <div class="order-summary">
                                                    <div class="card mb-0">
                                                        <div class="card-body">
                                                            <div class="card border bg-transparent shadow-none mb-3">
                                                                <div class="card-body">
                                                                    <p class="fs-5">Apply Discount Code</p>
                                                                    <div class="input-group">
                                                                        <input type="text" class="form-control"
                                                                            placeholder="Enter discount code">
                                                                        <button class="btn btn-grd-primary"
                                                                            type="button">Apply</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="card border bg-transparent shadow-none">
                                                                <div class="card-body">
                                                                    <p class="fs-5">Order summary</p>
                                                                    <div class="my-3 border-top"></div>
                                                                    <div class="d-flex align-items-center gap-3">
                                                                        <a class="d-block flex-shrink-0"
                                                                            href="javascript:;">
                                                                            <img src="../../../../assets/bootstrap/assets/images/top-products/06.png"
                                                                                width="60" height="60" alt="Product">
                                                                        </a>
                                                                        <div class="ps-2">
                                                                            <h6 class="mb-1"><a href="javascript:;"
                                                                                    class="text-white">White Polo
                                                                                    T-Shirt</a>
                                                                            </h6>
                                                                            <div class="widget-product-meta"><span
                                                                                    class="me-2">$19.<small>00</small></span><span
                                                                                    class="">x 1</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3 border-top"></div>
                                                                    <div class="d-flex align-items-center gap-3">
                                                                        <a class="d-block flex-shrink-0"
                                                                            href="javascript:;">
                                                                            <img src="../../../../assets/bootstrap/assets/images/top-products/05.png"
                                                                                width="60" height="60" alt="Product">
                                                                        </a>
                                                                        <div class="ps-2">
                                                                            <h6 class="mb-1"><a href="javascript:;"
                                                                                    class="text-white">White Polo
                                                                                    T-Shirt</a>
                                                                            </h6>
                                                                            <div class="widget-product-meta"><span
                                                                                    class="me-2">$19.<small>00</small></span><span
                                                                                    class="">x 1</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3 border-top"></div>
                                                                    <div class="d-flex align-items-center gap-3">
                                                                        <a class="d-block flex-shrink-0"
                                                                            href="javascript:;">
                                                                            <img src="../../../../assets/bootstrap/assets/images/top-products/04.png"
                                                                                width="60" height="60" alt="Product">
                                                                        </a>
                                                                        <div class="ps-2">
                                                                            <h6 class="mb-1"><a href="javascript:;"
                                                                                    class="text-white">White Polo
                                                                                    T-Shirt</a>
                                                                            </h6>
                                                                            <div class="widget-product-meta"><span
                                                                                    class="me-2">$19.<small>00</small></span><span
                                                                                    class="">x 1</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3 border-top"></div>
                                                                    <div class="d-flex align-items-center gap-3">
                                                                        <a class="d-block flex-shrink-0"
                                                                            href="javascript:;">
                                                                            <img src="../../../../assets/bootstrap/assets/images/top-products/03.png"
                                                                                width="60" height="60" alt="Product">
                                                                        </a>
                                                                        <div class="ps-2">
                                                                            <h6 class="mb-1"><a href="javascript:;"
                                                                                    class="text-white">Fancy Red
                                                                                    Sneakers</a>
                                                                            </h6>
                                                                            <div class="widget-product-meta"><span
                                                                                    class="me-2">$16.<small>00</small></span><span
                                                                                    class="">x 2</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3 border-top"></div>
                                                                    <div class="d-flex align-items-center gap-3">
                                                                        <a class="d-block flex-shrink-0"
                                                                            href="javascript:;">
                                                                            <img src="../../../../assets/bootstrap/assets/images/top-products/02.png"
                                                                                width="60" height="60" alt="Product">
                                                                        </a>
                                                                        <div class="ps-2">
                                                                            <h6 class="mb-1"><a href="javascript:;"
                                                                                    class="text-white">Yellow Shine
                                                                                    Blazer</a>
                                                                            </h6>
                                                                            <div class="widget-product-meta"><span
                                                                                    class="me-2">$22.<small>00</small></span><span
                                                                                    class="">x 1</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3 border-top"></div>
                                                                    <div class="d-flex align-items-center gap-3">
                                                                        <a class="d-block flex-shrink-0"
                                                                            href="javascript:;">
                                                                            <img src="../../../../assets/bootstrap/assets/images/top-products/01.png"
                                                                                width="60" height="60" alt="Product">
                                                                        </a>
                                                                        <div class="ps-2">
                                                                            <h6 class="mb-1"><a href="javascript:;"
                                                                                    class="text-white">Men Black Hat
                                                                                    Cap</a>
                                                                            </h6>
                                                                            <div class="widget-product-meta"><span
                                                                                    class="me-2">$14.<small>00</small></span><span
                                                                                    class="">x 1</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="card border bg-transparent mb-0 shadow-none">
                                                                <div class="card-body">
                                                                    <p class="mb-2">Subtotal: <span
                                                                            class="float-end">$198.00</span>
                                                                    </p>
                                                                    <p class="mb-2">Shipping: <span
                                                                            class="float-end">--</span>
                                                                    </p>
                                                                    <p class="mb-2">Taxes: <span
                                                                            class="float-end">$14.00</span>
                                                                    </p>
                                                                    <p class="mb-0">Discount: <span
                                                                            class="float-end">--</span>
                                                                    </p>
                                                                    <div class="my-3 border-top"></div>
                                                                    <h5 class="mb-0">Order Total: <span
                                                                            class="float-end">212.00</span></h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer border-top-0">
                                                <button type="button" class="btn btn-grd-danger"
                                                    data-bs-dismiss="modal">Delete</button>
                                                <button type="button" class="btn btn-grd-info">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-body">
                            <h5 class="mb-0">Fullscreen Modal</h5>
                            <p class="my-3">In publishing and graphic design, Lorem ipsum is a placeholder text commonly
                                used to
                                demonstrate the visual
                                content. </p>
                            <div class="">
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-grd-primary px-4" data-bs-toggle="modal"
                                    data-bs-target="#FullScreenModal">Click Me</button>
                                <!-- Modal -->
                                <div class="modal fade" id="FullScreenModal">
                                    <div class="modal-dialog modal-fullscreen">
                                        <div class="modal-content">
                                            <div class="modal-header border-bottom-0 py-2 bg-grd-primary">
                                                <h5 class="modal-title">Find Out Our New Products</h5>
                                                <a href="javascript:;" class="primaery-menu-close"
                                                    data-bs-dismiss="modal">
                                                    <i class="material-icons-outlined">close</i>
                                                </a>
                                            </div>
                                            <div class="modal-body">
                                                <div class="row row-cols-1 row-cols-lg-4">
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/gallery/01.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-danger rounded-4">Buy Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/gallery/02.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-success rounded-4">Buy
                                                                        Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/gallery/03.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-warning rounded-4">Buy
                                                                        Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/gallery/04.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-info rounded-4">Buy Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/orders/01.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-info rounded-4">Buy Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/orders/05.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-primary rounded-4">Buy
                                                                        Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/orders/03.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-branding rounded-4">Buy
                                                                        Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="card rounded-4">
                                                            <div class="card-body">
                                                                <img src="../../../../assets/bootstrap/assets/images/orders/04.png"
                                                                    class="img-fluid rounded-4" alt="">
                                                                <div class="mt-3">
                                                                    <h5 class="mb-0 fw-bold product-short-title">
                                                                        Syndrona</h5>
                                                                    <p class="mb-0 product-short-name">Color Printed
                                                                        Kurta</p>
                                                                    <div
                                                                        class="product-price d-flex align-items-center gap-2 mt-2">
                                                                        <div class="h6 fw-bold">$458</div>
                                                                        <div
                                                                            class="h6 fw-light text-secondary text-decoration-line-through">
                                                                            $2089</div>
                                                                        <div class="h6 fw-bold text-danger">(70% off)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="d-grid mt-2">
                                                                    <a href="javascript:;"
                                                                        class="btn btn-grd-voilet rounded-4">Buy Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div><!--end row-->
                                            </div>
                                            <div class="modal-footer border-top-0">
                                                <button type="button" class="btn btn-grd-danger rounded-0"
                                                    data-bs-dismiss="modal">Delete</button>
                                                <button type="button" class="btn btn-grd-info rounded-0">Save
                                                    changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-body">
                            <h5 class="mb-0">Form Modal</h5>
                            <p class="my-3">In publishing and graphic design, Lorem ipsum is a placeholder text commonly
                                used to
                                demonstrate the visual
                                content. </p>
                            <div class="">
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-grd-primary px-4" data-bs-toggle="modal"
                                    data-bs-target="#FormModal">Click Me</button>
                                <!-- Modal -->
                                <div class="modal fade" id="FormModal">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header border-bottom-0 py-2 bg-grd-info">
                                                <h5 class="modal-title">Registration Form</h5>
                                                <a href="javascript:;" class="primaery-menu-close"
                                                    data-bs-dismiss="modal">
                                                    <i class="material-icons-outlined">close</i>
                                                </a>
                                            </div>
                                            <div class="modal-body">
                                                <div class="form-body">
                                                    <form class="row g-3">
                                                        <div class="col-md-6">
                                                            <label for="input1" class="form-label">First Name</label>
                                                            <input type="text" class="form-control" id="input1"
                                                                placeholder="First Name">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label for="input2" class="form-label">Last Name</label>
                                                            <input type="text" class="form-control" id="input2"
                                                                placeholder="Last Name">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label for="input3" class="form-label">Phone</label>
                                                            <input type="text" class="form-control" id="input3"
                                                                placeholder="Phone">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label for="input4" class="form-label">Email</label>
                                                            <input type="email" class="form-control" id="input4">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label for="input5" class="form-label">Password</label>
                                                            <input type="password" class="form-control" id="input5">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label for="input6" class="form-label">DOB</label>
                                                            <input type="date" class="form-control" id="input6">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label for="input7" class="form-label">Country</label>
                                                            <select id="input7" class="form-select">
                                                                <option selected="">Choose...</option>
                                                                <option>One</option>
                                                                <option>Two</option>
                                                                <option>Three</option>
                                                            </select>
                                                        </div>

                                                        <div class="col-md-6">
                                                            <label for="input8" class="form-label">City</label>
                                                            <input type="text" class="form-control" id="input8"
                                                                placeholder="City">
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="input9" class="form-label">State</label>
                                                            <select id="input9" class="form-select">
                                                                <option selected="">Choose...</option>
                                                                <option>One</option>
                                                                <option>Two</option>
                                                                <option>Three</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <label for="input10" class="form-label">Zip</label>
                                                            <input type="text" class="form-control" id="input10"
                                                                placeholder="Zip">
                                                        </div>
                                                        <div class="col-md-12">
                                                            <label for="input11" class="form-label">Address</label>
                                                            <textarea class="form-control" id="input11"
                                                                placeholder="Address ..." rows="3"></textarea>
                                                        </div>
                                                        <div class="col-md-12">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox"
                                                                    id="input12">
                                                                <label class="form-check-label" for="input12">Check me
                                                                    out</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-12">
                                                            <div class="d-md-flex d-grid align-items-center gap-3">
                                                                <button type="button"
                                                                    class="btn btn-grd-danger px-4">Submit</button>
                                                                <button type="button"
                                                                    class="btn btn-grd-info px-4">Reset</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card rounded-4">
                        <div class="card-body">
                            <h5 class="mb-0">User List Modal</h5>
                            <p class="my-3">In publishing and graphic design, Lorem ipsum is a placeholder text commonly
                                used to
                                demonstrate the visual
                                content.</p>
                            <div class="">
                                <!-- Button trigger modal -->
                                <button type="button" class="btn btn-grd-primary px-4" data-bs-toggle="modal"
                                    data-bs-target="#userListModal">Click Me</button>
                                <!-- Modal -->
                                <div class="modal fade" id="userListModal">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header border-bottom-0 py-2 bg-grd-warning">
                                                <h5 class="modal-title">User List</h5>
                                                <a href="javascript:;" class="primaery-menu-close"
                                                    data-bs-dismiss="modal">
                                                    <i class="material-icons-outlined">close</i>
                                                </a>
                                            </div>
                                            <div class="modal-body">
                                                <div class="card w-100 mb-0 shadow-none">
                                                    <div class="card-header border-0 p-3 border-bottom">
                                                        <div class="position-relative">
                                                            <input class="form-control rounded-5 px-5" type="text"
                                                                placeholder="Search">
                                                            <span
                                                                class="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50">search</span>
                                                            <span
                                                                class="material-icons-outlined position-absolute me-3 translate-middle-y end-0 top-50">people</span>
                                                        </div>
                                                    </div>
                                                    <div class="card-body p-0">
                                                        <div class="user-list p-3">
                                                            <div class="d-flex flex-column gap-3">
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/01.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">Elon Jonado</h6>
                                                                        <p class="mb-0">elon_deo</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/02.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">Alexzender Clito</h6>
                                                                        <p class="mb-0">zli_alexzender</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">Michle Tinko</h6>
                                                                        <p class="mb-0">tinko_michle</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/04.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">KailWemba</h6>
                                                                        <p class="mb-0">wemba_kl</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/05.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">Henhco Tino</h6>
                                                                        <p class="mb-0">Henhco_tino</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/06.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">Gonjiko Fernando</h6>
                                                                        <p class="mb-0">gonjiko_fernando</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex align-items-center gap-3">
                                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/08.png" width="45"
                                                                        height="45" class="rounded-circle" alt="">
                                                                    <div class="flex-grow-1">
                                                                        <h6 class="mb-0">Specer Kilo</h6>
                                                                        <p class="mb-0">specer_kilo</p>
                                                                    </div>
                                                                    <div class="form-check form-check-inline me-0">
                                                                        <input class="form-check-input ms-0"
                                                                            type="checkbox">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="card-footer bg-transparent p-3">
                                                        <div
                                                            class="d-flex align-items-center justify-content-between gap-3">
                                                            <a href="javascript:;" class="sharelink"><i
                                                                    class="material-icons-outlined">share</i></a>
                                                            <a href="javascript:;" class="sharelink"><i
                                                                    class="material-icons-outlined">textsms</i></a>
                                                            <a href="javascript:;" class="sharelink"><i
                                                                    class="material-icons-outlined">email</i></a>
                                                            <a href="javascript:;" class="sharelink"><i
                                                                    class="material-icons-outlined">attach_file</i></a>
                                                            <a href="javascript:;" class="sharelink"><i
                                                                    class="material-icons-outlined">event</i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div><!--end row-->

        </div>
    </main>
    <!--end main wrapper-->
</template>