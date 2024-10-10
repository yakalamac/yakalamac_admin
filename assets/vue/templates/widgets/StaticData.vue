<script setup>
</script>

<template>
      <!--start main wrapper-->
  <main class="main-wrapper">
    <div class="main-content">
      <!--breadcrumb-->
      <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div class="breadcrumb-title pe-3">Widgets</div>
        <div class="ps-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 p-0">
              <li class="breadcrumb-item"><a href="javascript:;"><i class="bx bx-home-alt"></i></a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">Static</li>
            </ol>
          </nav>
        </div>
        <div class="ms-auto">
          <div class="btn-group">
            <button type="button" class="btn btn-primary">Settings</button>
            <button type="button" class="btn btn-primary split-bg-primary dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"> <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu dropdown-menu-right dropdown-menu-lg-end"> <a class="dropdown-item"
                href="javascript:;">Action</a>
              <a class="dropdown-item" href="javascript:;">Another action</a>
              <a class="dropdown-item" href="javascript:;">Something else here</a>
              <div class="dropdown-divider"></div> <a class="dropdown-item" href="javascript:;">Separated link</a>
            </div>
          </div>
        </div>
      </div>
      <!--end breadcrumb-->

      <div class="card rounded-4">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-around flex-wrap gap-4 p-4">
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <a href="javascript:;" class="wh-48 bg-grd-deep-blue text-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="material-icons-outlined">shopping_cart</i>
              </a>
              <p class="mb-0">Checkout</p>
            </div>
            <div class="vr"></div>
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <a href="javascript:;" class="wh-48 bg-grd-success text-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="material-icons-outlined">print</i>
              </a>
              <p class="mb-0">Invoice</p>
            </div>
            <div class="vr"></div>
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <a href="javascript:;" class="wh-48 bg-grd-danger text-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="material-icons-outlined">notifications</i>
              </a>
              <p class="mb-0">Notifications</p>
            </div>
            <div class="vr"></div>
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <a href="javascript:;" class="wh-48 bg-grd-warning text-dark rounded-circle d-flex align-items-center justify-content-center">
                <i class="material-icons-outlined">question_answer</i>
              </a>
              <p class="mb-0">Messages</p>
            </div>
            <div class="vr"></div>
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <a href="javascript:;" class="wh-48 bg-grd-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="material-icons-outlined">send</i>
              </a>
              <p class="mb-0">Request</p>
            </div>
            <div class="vr"></div>
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <a href="javascript:;" class="wh-48 bg-grd-branding text-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="material-icons-outlined">payment</i>
              </a>
              <p class="mb-0">Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card rounded-4">
        <div class="card-body">
          <div class="position-relative">
            <a href="javascript:;" class="sharelink ms-auto" data-bs-dismiss="modal">
              <span class="material-icons-outlined">close</span>
            </a>
          </div>
          <div class="text-center">
            <h4>Share This Product</h4>
            <p>Bootstrap only supports one modal window at a time.</p>
            <div class="d-flex align-items-center justify-content-center flex-wrap gap-4 py-5">
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 bg-facebook text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-facebook fs-3"></i></a>
                <p class="mb-0">Facebook</p>
              </div>
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 bg-linkedin text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-linkedin fs-3"></i></a>
                <p class="mb-0">Linkedin</p>
              </div>
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-twitter-x fs-3"></i></a>
                <p class="mb-0">Twitter</p>
              </div>
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 bg-pinterest text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-pinterest fs-3"></i></a>
                <p class="mb-0">Pinterest</p>
              </div>
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 bg-whatsapp text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-whatsapp fs-3"></i></a>
                <p class="mb-0">WhatsApp</p>
              </div>
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-youtube fs-3"></i></a>
                <p class="mb-0">YouTube</p>
              </div>
              <div class="d-flex flex-column align-items-center justify-content-center gap-2">
                <a href="javascript:;"
                  class="wh-64 border text-white rounded-circle d-flex align-items-center justify-content-center"><i
                    class="bi bi-link fs-3"></i></a>
                <p class="mb-0">Copy Link</p>
              </div>

            </div>
          </div>
        </div>
      </div>


      <div class="row row-cols-1 row-cols-lg-3">
        <div class="col d-flex">
          <div class="card w-100 rounded-4">
            <div class="card-header border-0 p-3 border-bottom">
              <div class="position-relative">
                <input class="form-control rounded-5 px-5" type="text" placeholder="Search">
                <span class="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50">search</span>
                <span
                  class="material-icons-outlined position-absolute me-3 translate-middle-y end-0 top-50">people</span>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="user-list p-3">
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/01.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Elon Jonado</h6>
                      <p class="mb-0">elon_deo</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/02.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Alexzender Clito</h6>
                      <p class="mb-0">zli_alexzender</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/03.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Michle Tinko</h6>
                      <p class="mb-0">tinko_michle</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/04.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">KailWemba</h6>
                      <p class="mb-0">wemba_kl</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/05.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Henhco Tino</h6>
                      <p class="mb-0">Henhco_tino</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/06.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Gonjiko Fernando</h6>
                      <p class="mb-0">gonjiko_fernando</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <img src="assets/images/avatars/08.png" width="45" height="45" class="rounded-circle" alt="">
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Specer Kilo</h6>
                      <p class="mb-0">specer_kilo</p>
                    </div>
                    <div class="form-check form-check-inline me-0">
                      <input class="form-check-input ms-0" type="checkbox">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent p-3">
              <div class="d-flex align-items-center justify-content-between gap-3">
                <a href="javascript:;" class="sharelink"><i class="material-icons-outlined">share</i></a>
                <a href="javascript:;" class="sharelink"><i class="material-icons-outlined">textsms</i></a>
                <a href="javascript:;" class="sharelink"><i class="material-icons-outlined">email</i></a>
                <a href="javascript:;" class="sharelink"><i class="material-icons-outlined">attach_file</i></a>
                <a href="javascript:;" class="sharelink"><i class="material-icons-outlined">event</i></a>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card w-100 rounded-4">
            <div class="card-header p-3 bg-transparent">
              <div class="d-flex align-items-center justify-content-between">
                <div class="">
                  <h5 class="mb-0">Income / Expense</h5>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                    data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="payments-list">
                <div class="d-flex flex-column gap-4">
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/11.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$4856</h5>
                      <p class="mb-0">Paypal</p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-success">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>28.5%</span>
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/10.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$1286</h5>
                      <p class="mb-0 fs-6">Figma </p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-success">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>12.4%</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/13.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$9946</h5>
                      <p class="mb-0 fs-6">Visa Card</p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-danger">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>18.5%</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/01.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$4376</h5>
                      <p class="mb-0 fs-6">Gmail</p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-success">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>32.8%</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/02.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$6674</h5>
                      <p class="mb-0 fs-6">Skype</p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-danger">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>27.8%</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/06.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$3489</h5>
                      <p class="mb-0 fs-6">Instagram</p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-success">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>10.2%</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle border">
                      <img src="assets/images/apps/04.png" width="30" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-0">$5578</h5>
                      <p class="mb-0 fs-6">Youtube</p>
                    </div>
                    <div class="d-flex align-items-center gap-1 text-success">
                      <span class="material-icons-outlined">expand_less</span>
                      <span>37.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card w-100 rounded-4">
            <div class="card-header p-3">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="d-flex flex-row gap-3 align-items-center justify-content-center border p-3 rounded-3 flex-fill">
                  <img src="assets/images/avatars/11.png" width="40" height="40" class="rounded-circle" alt="">
                  <div class="">
                    <h5 class="mb-0">65%</h5>
                    <p class="mb-0">Male</p>
                  </div>
                </div>
                <div
                  class="d-flex flex-row gap-2 align-items-center justify-content-center border p-3 rounded-3 flex-fill">
                  <img src="assets/images/avatars/12.png" width="40" height="40" class="rounded-circle" alt="">
                  <div class="">
                    <h5 class="mb-0">35%</h5>
                    <p class="mb-0">Female</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <h5 class="mb-3">Campaign Portfolio</h5>
              <div class="d-flex flex-column justify-content-between gap-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <img src="assets/images/apps/17.png" width="32" alt="">
                    <p class="mb-0">Facebook</p>
                  </div>
                  <div class="">
                    <p class="mb-0 fs-5">65%</p>
                  </div>
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#0d6efd", "rgb(0 0 0 / 10%)"],   "innerRadius": 16, "radius": 20 }'>5/7</span>
                    </p>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <img src="assets/images/apps/18.png" width="32" alt="">
                    <p class="mb-0">LinkedIn</p>
                  </div>
                  <div class="">
                    <p class="mb-0 fs-5">44%</p>
                  </div>
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#fc185a", "rgb(0 0 0 / 10%)"],   "innerRadius": 16, "radius": 20 }'>5/7</span>
                    </p>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <img src="assets/images/apps/19.png" width="32" alt="">
                    <p class="mb-0">Instagram</p>
                  </div>
                  <div class="">
                    <p class="mb-0 fs-5">27%</p>
                  </div>
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#02c27a", "rgb(0 0 0 / 10%)"],   "innerRadius": 16, "radius": 20 }'>5/7</span>
                    </p>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <img src="assets/images/apps/20.png" width="32" alt="">
                    <p class="mb-0">Snapchat</p>
                  </div>
                  <div class="">
                    <p class="mb-0 fs-5">68%</p>
                  </div>
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#fd7e14", "rgb(0 0 0 / 10%)"],   "innerRadius": 16, "radius": 20 }'>5/7</span>
                    </p>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <img src="assets/images/apps/05.png" width="32" alt="">
                    <p class="mb-0">Google</p>
                  </div>
                  <div class="">
                    <p class="mb-0 fs-5">29%</p>
                  </div>
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#0dcaf0", "rgb(0 0 0 / 10%)"],   "innerRadius": 16, "radius": 20 }'>5/7</span>
                    </p>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center gap-3 flex-grow-1">
                    <img src="assets/images/apps/08.png" width="32" alt="">
                    <p class="mb-0">Altaba</p>
                  </div>
                  <div class="">
                    <p class="mb-0 fs-5">58%</p>
                  </div>
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#6f42c1", "rgb(0 0 0 / 10%)"],   "innerRadius": 16, "radius": 20 }'>5/7</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div><!--end row-->

      <div class="card rounded-4 rounded-4">
        <div class="card-body">
          <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-4 g-3">
            <div class="col">
              <div class="card rounded-4 mb-0 border">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <img src="assets/images/apps/05.png" width="35" alt="">
                    <div class="dropdown">
                      <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown">
                        <span class="material-icons-outlined fs-5">more_vert</span>
                      </a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="mb-0 fw-light">45.2K</h4>
                    <p class="mb-0">Followers</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-end gap-1 mt-3">
                    <p
                      class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                      <span class="material-icons-outlined fs-6">arrow_downward</span>45.7%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card rounded-4 mb-0 border">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <img src="assets/images/apps/18.png" width="35" alt="">
                    <div class="dropdown">
                      <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown">
                        <span class="material-icons-outlined fs-5">more_vert</span>
                      </a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="mb-0 fw-light">62.4K</h4>
                    <p class="mb-0">Followers</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-end gap-1 mt-3">
                    <p
                      class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                      <span class="material-icons-outlined fs-6">arrow_downward</span>25.6%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card rounded-4 mb-0 border">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <img src="assets/images/apps/17.png" width="35" alt="">
                    <div class="dropdown">
                      <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown">
                        <span class="material-icons-outlined fs-5">more_vert</span>
                      </a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="mb-0 fw-light">25.8K</h4>
                    <p class="mb-0">Followers</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-end gap-1 mt-3">
                    <p
                      class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                      <span class="material-icons-outlined fs-6">arrow_downward</span>25.6%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card rounded-4 mb-0 border">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <img src="assets/images/apps/19.png" width="35" alt="">
                    <div class="dropdown">
                      <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                        data-bs-toggle="dropdown">
                        <span class="material-icons-outlined fs-5">more_vert</span>
                      </a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                        <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="mb-0 fw-light">58.9K</h4>
                    <p class="mb-0">Followers</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-end gap-1 mt-3">
                    <p
                      class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                      <span class="material-icons-outlined fs-6">north</span>34.8%
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div><!--end row-->
        </div>
      </div>


      <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-4">
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between gap-3">
                <div
                  class="wh-48 d-flex bg-success text-success bg-opacity-10 align-items-center justify-content-center rounded-circle">
                  <span class="material-icons-outlined">account_circle</span>
                </div>
                <div class="">
                  <div class="d-flex align-items-center align-self-end text-success mb-1">
                    <p class="mb-0">10.6%</p>
                    <span class="material-icons-outlined">arrow_drop_up</span>
                  </div>
                  <h4 class="mb-0">25.3K</h4>
                  <p class="mb-0">Followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between gap-3">
                <div
                  class="wh-48 d-flex bg-danger text-danger bg-opacity-10 align-items-center justify-content-center rounded-circle">
                  <span class="material-icons-outlined">favorite_border</span>
                </div>
                <div class="">
                  <div class="d-flex align-items-center align-self-end text-success mb-1">
                    <p class="mb-0">35.7%</p>
                    <span class="material-icons-outlined">arrow_drop_up</span>
                  </div>
                  <h4 class="mb-0">45.6K</h4>
                  <p class="mb-0">Total Hearts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between gap-3">
                <div
                  class="wh-48 d-flex bg-info text-info bg-opacity-10 align-items-center justify-content-center rounded-circle">
                  <span class="material-icons-outlined">play_circle</span>
                </div>
                <div class="">
                  <div class="d-flex align-items-center align-self-end text-success mb-1">
                    <p class="mb-0">25.6%</p>
                    <span class="material-icons-outlined">arrow_drop_up</span>
                  </div>
                  <h4 class="mb-0">64.8K</h4>
                  <p class="mb-0">Total Songs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between gap-3">
                <div
                  class="wh-48 d-flex bg-orange-light text-orange bg-opacity-10 align-items-center justify-content-center rounded-circle">
                  <span class="material-icons-outlined">bookmarks</span>
                </div>
                <div class="">
                  <div class="d-flex align-items-center align-self-end text-success mb-1">
                    <p class="mb-0">25.6%</p>
                    <span class="material-icons-outlined">arrow_drop_up</span>
                  </div>
                  <h4 class="mb-0">78.2K</h4>
                  <p class="mb-0">Bookmarks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><!--end row-->

      <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
        <div class="col d-flex">
          <div class="card w-100 rounded-4">
            <div class="card-header p-3 bg-transparent">
              <div class="d-flex align-items-center justify-content-between">
                <div class="">
                  <h5 class="mb-0">Popular Products</h5>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle" data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/01.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">Apple Hand Watch</h6>
                    <p class="mb-0">Sale: 258</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$199</h5>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/02.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">Mobile Phone Set</h6>
                    <p class="mb-0">Sale: 169</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$159</h5>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/03.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">Fancy Chair</h6>
                    <p class="mb-0">Sale: 268</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$678</h5>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/04.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">Blue Shoes Pair</h6>
                    <p class="mb-0">Sale: 859</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$279</h5>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/05.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">Blue Yoga Mat</h6>
                    <p class="mb-0">Sale: 328</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$389</h5>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/06.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">White water Bottle</h6>
                    <p class="mb-0">Sale: 992</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$584</h5>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/top-products/07.png" width="55" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">Laptop Full HD</h6>
                    <p class="mb-0">Sale: 489</p>
                  </div>
                  <div class="">
                    <h5 class="mb-0">$398</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card w-100 rounded-4">
            <div class="card-header p-3 bg-transparent">
              <div class="d-flex align-items-center justify-content-between">
                <div class="">
                  <h5 class="mb-0">Recent Transactions</h5>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                    data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="payments-list">
                <div class="d-flex flex-column gap-4">
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center bg-danger rounded-circle">
                      <span class="material-icons-outlined text-white">shopping_cart</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-primary">
                      <span class="material-icons-outlined text-white">monetization_on</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-success">
                      <span class="material-icons-outlined text-white">credit_card</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-purple">
                      <span class="material-icons-outlined text-white">account_balance</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-orange">
                      <span class="material-icons-outlined text-white">savings</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-info">
                      <span class="material-icons-outlined text-white">paid</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="wh-48 d-flex align-items-center justify-content-center rounded-circle bg-pink">
                      <span class="material-icons-outlined text-white">card_giftcard</span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">Online Purchase</h6>
                      <p class="mb-0">03/10/2022</p>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <h5 class="mb-0">$9848</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
           <div class="card w-100 rounded-4">
            <div class="card-header p-3 bg-transparent">
              <div class="d-flex align-items-center justify-content-between">
                <div class="">
                  <h5 class="mb-0">Country Sales</h5>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                    data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>
             <div class="card-body">
                <div class="d-flex flex-column gap-4">
                   <div class="d-flex align-items-center gap-3">
                     <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                         <img src="assets/images/county/01.png" width="40" alt="">
                         <div class="">
                            <h5 class="mb-0">$95,256</h5>
                            <p class="mb-0">Canada</p>
                         </div>
                     </div>
                     <div class="progress w-25" style="height: 7px;">
                        <div class="progress-bar bg-grd-danger" style="width: 65%"></div>
                     </div>
                     <div class="">
                      <p class="mb-0 fs-5">68%</p>
                     </div>
                   </div>
                   <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                        <img src="assets/images/county/02.png" width="40" alt="">
                        <div class="">
                           <h5 class="mb-0">$75M</h5>
                           <p class="mb-0">United Kingdom</p>
                        </div>
                    </div>
                    <div class="progress w-25" style="height: 7px;">
                       <div class="progress-bar bg-grd-success" style="width: 55%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-5">57%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                        <img src="assets/images/county/03.png" width="40" alt="">
                        <div class="">
                           <h5 class="mb-0">$958K</h5>
                           <p class="mb-0">France</p>
                        </div>
                    </div>
                    <div class="progress w-25" style="height: 7px;">
                       <div class="progress-bar bg-grd-info" style="width: 48%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-5">48%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                        <img src="assets/images/county/04.png" width="40" alt="">
                        <div class="">
                           <h5 class="mb-0">$568K</h5>
                           <p class="mb-0">Brazil</p>
                        </div>
                    </div>
                    <div class="progress w-25" style="height: 7px;">
                       <div class="progress-bar bg-grd-warning" style="width: 75%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-5">38%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                        <img src="assets/images/county/05.png" width="40" alt="">
                        <div class="">
                           <h5 class="mb-0">$855K</h5>
                           <p class="mb-0">United Kingdom</p>
                        </div>
                    </div>
                    <div class="progress w-25" style="height: 7px;">
                       <div class="progress-bar bg-grd-deep-blue" style="width: 65%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-5">68%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                        <img src="assets/images/county/06.png" width="40" alt="">
                        <div class="">
                           <h5 class="mb-0">$983K</h5>
                           <p class="mb-0">United States</p>
                        </div>
                    </div>
                    <div class="progress w-25" style="height: 7px;">
                       <div class="progress-bar bg-grd-purple" style="width: 88%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-5">88%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                        <img src="assets/images/county/07.png" width="40" alt="">
                        <div class="">
                           <h5 class="mb-0">$724K</h5>
                           <p class="mb-0">China</p>
                        </div>
                    </div>
                    <div class="progress w-25" style="height: 7px;">
                       <div class="progress-bar bg-grd-primary" style="width: 80%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-5">85%</p>
                    </div>
                  </div>
                </div>
             </div>
            
           </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="card w-100 rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h6 class="mb-0 fw-bold">Popular Products</h6>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle" data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                    <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                    <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                  </ul>
                </div>
               </div>
              <div class="d-flex flex-column gap-4">
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/orders/01.png" width="78" class="rounded-3" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">Apple Hand Watch</h6>
                    <p class="mb-0">Sale: 258</p>
                  </div>
                  <div class="">
                    <h6 class="mb-0">$199</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/orders/08.png" width="78" class="rounded-3" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">Mobile Phone Set</h6>
                    <p class="mb-0">Sale: 169</p>
                  </div>
                  <div class="">
                    <h6 class="mb-0">$159</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/orders/03.png" width="78" class="rounded-3" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">Fancy Chair</h6>
                    <p class="mb-0">Sale: 268</p>
                  </div>
                  <div class="">
                    <h6 class="mb-0">$678</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/orders/04.png" width="78" class="rounded-3" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">Blue Shoes Pair</h6>
                    <p class="mb-0">Sale: 859</p>
                  </div>
                  <div class="">
                    <h6 class="mb-0">$279</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/orders/05.png" width="78" class="rounded-3" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">Blue Yoga Mat</h6>
                    <p class="mb-0">Sale: 328</p>
                  </div>
                  <div class="">
                    <h6 class="mb-0">$389</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <img src="assets/images/orders/06.png" width="75" class="rounded-3" alt="">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">White water Bottle</h6>
                    <p class="mb-0">Sale: 992</p>
                  </div>
                  <div class="">
                    <h6 class="mb-0">$584</h6>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xxl-8 d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h5 class="mb-0">Transactions</h5>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                    data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                    <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                    <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                  </ul>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-middle mb-0 table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source Name</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="">
                          <h6 class="mb-0">10 Sep,2024</h6>
                          <p class="mb-0">8:20 PM</p>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src="assets/images/apps/paypal.png" width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">Paypal</h6>
                            <p class="mb-0">Business Plan</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable bg-success text-success bg-opacity-10">
                          <p class="text-success mb-0">Paid</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">$5897</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="">
                          <h6 class="mb-0">10 Sep,2024</h6>
                          <p class="mb-0">8:20 PM</p>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src="assets/images/apps/13.png" width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">Visa</h6>
                            <p class="mb-0">Business Plan</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable bg-danger text-danger bg-opacity-10">
                          <p class="text-danger mb-0">Unpaid</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">$9638</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="">
                          <h6 class="mb-0">10 Sep,2024</h6>
                          <p class="mb-0">8:20 PM</p>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src="assets/images/apps/behance.png" width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">Behance</h6>
                            <p class="mb-0">Business Plan</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable bg-success text-success bg-opacity-10">
                          <p class="text-success mb-0">Paid</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">$9638</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="">
                          <h6 class="mb-0">10 Sep,2024</h6>
                          <p class="mb-0">8:20 PM</p>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src="assets/images/apps/07.png" width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">Spotify</h6>
                            <p class="mb-0">Business Plan</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable bg-success text-success bg-opacity-10">
                          <p class="text-success mb-0">Paid</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">$9638</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="">
                          <h6 class="mb-0">10 Sep,2024</h6>
                          <p class="mb-0">8:20 PM</p>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src="assets/images/apps/05.png" width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">Google</h6>
                            <p class="mb-0">Business Plan</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable bg-danger text-danger bg-opacity-10">
                          <p class="text-danger mb-0">Unpaid</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">$9638</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="">
                          <h6 class="mb-0">10 Sep,2024</h6>
                          <p class="mb-0">8:20 PM</p>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center flex-row gap-3">
                          <div class="">
                            <img src="assets/images/apps/apple.png" width="35" alt="">
                          </div>
                          <div class="">
                            <h6 class="mb-0">Apple</h6>
                            <p class="mb-0">Business Plan</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card-lable bg-success text-success bg-opacity-10">
                          <p class="text-success mb-0">Paid</p>
                        </div>
                      </td>
                      <td>
                        <h5 class="mb-0">$9638</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-12 d-flex">
          <div class="card w-100 rounded-4">
             <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h5 class="mb-0 fw-bold">Ongoing Projects</h5>
                </div>
                <div class="dropdown">
                  <a href="javascript:;" class="dropdown-toggle-nocaret options dropdown-toggle"
                    data-bs-toggle="dropdown">
                    <span class="material-icons-outlined fs-5">more_vert</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="javascript:;">Action</a></li>
                    <li><a class="dropdown-item" href="javascript:;">Another action</a></li>
                    <li><a class="dropdown-item" href="javascript:;">Something else here</a></li>
                  </ul>
                </div>
               </div>
                <div class="d-flex flex-column gap-4">
                   <div class="d-flex align-items-center gap-4">
                     <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                      <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                        <img src="assets/images/projects/angular.png" width="30" alt="">
                      </div>
                        <div class="">
                          <h6 class="mb-0 fw-bold">Angular 12</h6>
                          <p class="mb-0">Admin Template</p>
                        </div>
                     </div>
                     <div class="progress w-25" style="height: 5px;">
                        <div class="progress-bar bg-grd-danger" style="width: 95%"></div>
                     </div>
                     <div class="">
                      <p class="mb-0 fs-6">95%</p>
                     </div>
                   </div>
                   <div class="d-flex align-items-center gap-4">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                     <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                       <img src="assets/images/projects/react.png" width="30" alt="">
                     </div>
                       <div class="">
                         <h6 class="mb-0 fw-bold">React Js</h6>
                         <p class="mb-0">eCommerce Admin</p>
                       </div>
                    </div>
                    <div class="progress w-25" style="height: 5px;">
                       <div class="progress-bar bg-grd-info" style="width: 90%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-6">90%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                     <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                       <img src="assets/images/projects/vue.png" width="30" alt="">
                     </div>
                       <div class="">
                         <h6 class="mb-0 fw-bold">Vue Js</h6>
                         <p class="mb-0">Dashboard Template</p>
                       </div>
                    </div>
                    <div class="progress w-25" style="height: 5px;">
                       <div class="progress-bar bg-grd-success" style="width: 85%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-6">85%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                     <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                       <img src="assets/images/projects/bootstrap.png" width="30" alt="">
                     </div>
                       <div class="">
                         <h6 class="mb-0 fw-bold">Bootstrap 5</h6>
                         <p class="mb-0">Corporate Website</p>
                       </div>
                    </div>
                    <div class="progress w-25" style="height: 5px;">
                       <div class="progress-bar bg-grd-voilet" style="width: 75%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-6">75%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                     <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                       <img src="assets/images/projects/magento.png" width="30" alt="">
                     </div>
                       <div class="">
                         <h6 class="mb-0 fw-bold">Magento</h6>
                         <p class="mb-0">Shoping Portal</p>
                       </div>
                    </div>
                    <div class="progress w-25" style="height: 5px;">
                       <div class="progress-bar bg-grd-warning" style="width: 65%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-6">65%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                     <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                       <img src="assets/images/projects/django.png" width="30" alt="">
                     </div>
                       <div class="">
                         <h6 class="mb-0 fw-bold">Django</h6>
                         <p class="mb-0">Backend Admin</p>
                       </div>
                    </div>
                    <div class="progress w-25" style="height: 5px;">
                       <div class="progress-bar bg-grd-deep-blue" style="width: 55%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-6">55%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-shrink-0">
                     <div class="wh-48 d-flex align-items-center justify-content-center rounded-3 border">
                       <img src="assets/images/projects/python.png" width="30" alt="">
                     </div>
                       <div class="">
                         <h6 class="mb-0 fw-bold">Python</h6>
                         <p class="mb-0">User Panel</p>
                       </div>
                    </div>
                    <div class="progress w-25" style="height: 5px;">
                       <div class="progress-bar bg-grd-primary" style="width: 45%"></div>
                    </div>
                    <div class="">
                     <p class="mb-0 fs-6">45%</p>
                    </div>
                  </div>
                </div>
             </div>
           </div>
         </div>
      </div><!--end row-->
    </div><!-- main content-->
  </main>
  <!--end main wrapper-->

</template>