<script setup>

</script>

<template>
      <!--start main wrapper-->
  <main class="main-wrapper">
    <div class="main-content">
      <div class="product-count d-flex align-items-center gap-3 gap-lg-4 mb-4 fw-medium flex-wrap font-text1">
        <a href="javascript:;"><span class="me-1">All</span><span class="text-secondary">(88754)</span></a>
        <a href="javascript:;"><span class="me-1">Published</span><span class="text-secondary">(56242)</span></a>
        <a href="javascript:;"><span class="me-1">Drafts</span><span class="text-secondary">(17)</span></a>
        <a href="javascript:;"><span class="me-1">On Discount</span><span class="text-secondary">(88754)</span></a>
      </div>

      <div class="row g-3">
        <div class="col-auto">
          <div class="position-relative">
            <input class="form-control px-5" type="search" placeholder="Search Products">
            <span
              class="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50 fs-5">search</span>
          </div>
        </div>
        <div class="col-auto flex-grow-1 overflow-auto">
          <div class="btn-group position-static">
            <div class="btn-group position-static">
              <button type="button" class="btn btn-filter dropdown-toggle px-4" data-bs-toggle="dropdown"
                aria-expanded="false">
                Category
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
                Vendor
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
                Collection
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
            <button class="btn btn-primary px-4"><i class="bi bi-plus-lg me-2"></i>Add Product</button>
          </div>
        </div>
      </div><!--end row-->

      <div class="card mt-4">
        <div class="card-body">
          <div class="product-table">
            <div class="table-responsive white-space-nowrap">
              <table class="table align-middle">
                <thead class="table-light">
                  <tr>
                    <th>
                      <input class="form-check-input" type="checkbox">
                    </th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Tags</th>
                    <th>Rating</th>
                    <th>Vendor</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/01.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/02.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/03.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/04.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/05.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/06.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/07.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/08.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input class="form-check-input" type="checkbox">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                          <img src="../../../../assets/bootstrap/assets/images/orders/09.png" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                          <a href="javascript:;" class="product-title">Women Pink Floral Printed</a>
                          <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                      </div>
                    </td>
                    <td>$49</td>
                    <td>Palazzos</td>
                    <td>
                      <div class="product-tags">
                        <a href="javascript:;" class="btn-tags">Jeans</a>
                        <a href="javascript:;" class="btn-tags">iPhone</a>
                        <a href="javascript:;" class="btn-tags">Laptops</a>
                        <a href="javascript:;" class="btn-tags">Mobiles</a>
                        <a href="javascript:;" class="btn-tags">Wallets</a>
                      </div>
                    </td>
                    <td>
                      <div class="product-rating">
                        <i class="bi bi-star-fill text-warning me-2"></i><span>5.0</span>
                      </div>
                    </td>
                    <td>
                      <a href="javascript:;">Michle Shoes England</a>
                    </td>
                    <td>
                      Nov 12, 10:45 PM
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret"
                          type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                    </td>
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