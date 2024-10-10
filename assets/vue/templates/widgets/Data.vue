<script setup>

</script>

<template>
      <!--start main wrapper-->
  <main class="main-wrapper">
    <div class="main-content">
      <div class="row row-cols-1 row-cols-xl-3">
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="">
                  <h3 class="mb-0">$9,568</h3>
                </div>
                <div class="">
                  <p
                    class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                    <span class="material-icons-outlined fs-6">arrow_downward</span>8.6%
                  </p>
                </div>
              </div>
              <p class="mb-0">Total Sales</p>
              <div id="chart1"></div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="">
                  <h3 class="mb-0">85,247</h3>
                </div>
                <div class="">
                  <p
                    class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                    <span class="material-icons-outlined fs-6">arrow_downward</span>23.7%
                  </p>
                </div>
              </div>
              <p class="mb-0">Total Accounts</p>
              <div id="chart2"></div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="">
                  <h3 class="mb-0">$69,452</h3>
                </div>
                <div class="">
                  <p
                    class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                    <span class="material-icons-outlined fs-6">arrow_downward</span>8.6%
                  </p>
                </div>
              </div>
              <p class="mb-0">Average Weekly Sales</p>
              <div id="chart3"></div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="">
                  <h2 class="mb-0">$65,129</h2>
                </div>
                <div class="">
                  <p
                    class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                    <span class="material-icons-outlined fs-6">arrow_upward</span>24.7%
                  </p>
                </div>
              </div>
              <p class="mb-0">Sale This Year</p>
              <div class="mt-4">
                <p class="mb-2 d-flex align-items-center justify-content-between">285 left to Goal<span
                    class="">68%</span></p>
                <div class="progress w-100" style="height: 6px;">
                  <div class="progress-bar bg-grd-purple" style="width: 65%"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="">
                  <h2 class="mb-0">$88,367</h2>
                </div>
                <div class="">
                  <p
                    class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-danger text-danger bg-opacity-10">
                    <span class="material-icons-outlined fs-6">arrow_upward</span>18.6%
                  </p>
                </div>
              </div>
              <p class="mb-0">Sale This Month</p>
              <div class="mt-4">
                <p class="mb-2 d-flex align-items-center justify-content-between">285 left to Goal<span
                    class="">78%</span></p>
                <div class="progress w-100" style="height: 6px;">
                  <div class="progress-bar bg-grd-danger" style="width: 65%"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="col">
          <div class="card rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="">
                  <h2 class="mb-0">$55,674</h2>
                </div>
                <div class="">
                  <p
                    class="dash-lable d-flex align-items-center gap-1 rounded mb-0 bg-success text-success bg-opacity-10">
                    <span class="material-icons-outlined fs-6">arrow_upward</span>42.6%
                  </p>
                </div>
              </div>
              <p class="mb-0">Sale This Week</p>
              <div class="mt-4">
                <p class="mb-2 d-flex align-items-center justify-content-between">285 left to Goal<span
                    class="">88%</span></p>
                <div class="progress w-100" style="height: 6px;">
                  <div class="progress-bar bg-grd-success" style="width: 88%"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div><!--end row-->


      <div class="row row-cols-1 row-cols-xl-6">
        <div class="col d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h5 class="mb-0">97.4K</h5>
                  <p class="mb-0">Total Users</p>
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
              <div class="chart-container2">
                <div id="chart4"></div>
              </div>
              <div class="text-center">
                <p class="mb-0"><span class="text-success me-1">12.5%</span> from last month</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-1">
                <div class="">
                  <h5 class="mb-0">42.5K</h5>
                  <p class="mb-0">Active Users</p>
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
              <div class="chart-container2">
                <div id="chart5"></div>
              </div>
              <div class="text-center">
                <p class="mb-0">24K users increased from last month</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h5 class="mb-0">97.4K</h5>
                  <p class="mb-0">Total Users</p>
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
              <div class="chart-container2">
                <div id="chart6"></div>
              </div>
              <div class="text-center">
                <p class="mb-0"><span class="text-success me-1">12.5%</span> from last month</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-1">
                <div class="">
                  <h5 class="mb-0">42.5K</h5>
                  <p class="mb-0">Active Users</p>
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
              <div class="chart-container2">
                <div id="chart7"></div>
              </div>
              <div class="text-center">
                <p class="mb-0">24K users increased from last month</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h5 class="mb-0">97.4K</h5>
                  <p class="mb-0">Total Users</p>
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
              <div class="chart-container2">
                <div id="chart8"></div>
              </div>
              <div class="text-center">
                <p class="mb-0"><span class="text-success me-1">12.5%</span> from last month</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card rounded-4 w-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-1">
                <div class="">
                  <h5 class="mb-0">42.5K</h5>
                  <p class="mb-0">Active Users</p>
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
              <div class="chart-container2">
                <div id="chart9"></div>
              </div>
              <div class="text-center">
                <p class="mb-0">24K users increased from last month</p>
              </div>
            </div>
          </div>
        </div>
      </div><!--end row-->


      <div class="row">
        <div class="col-12 col-xl-4">
          <div class="card w-100 rounded-4">
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-start justify-content-between">
                  <div class="">
                    <h5 class="mb-0">Order Status</h5>
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
                <div class="position-relative">
                  <div class="piechart-legend">
                    <h2 class="mb-1">68%</h2>
                    <h6 class="mb-0">Total Sales</h6>
                  </div>
                  <div id="chart11"></div>
                </div>
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex align-items-center justify-content-between">
                    <p class="mb-0 d-flex align-items-center gap-2 w-25"><span
                        class="material-icons-outlined fs-6 text-primary">fiber_manual_record</span>Sales</p>
                    <div class="">
                      <p class="mb-0">68%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p class="mb-0 d-flex align-items-center gap-2 w-25"><span
                        class="material-icons-outlined fs-6 text-danger">fiber_manual_record</span>Product</p>
                    <div class="">
                      <p class="mb-0">25%</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p class="mb-0 d-flex align-items-center gap-2 w-25"><span
                        class="material-icons-outlined fs-6 text-success">fiber_manual_record</span>Income</p>
                    <div class="">
                      <p class="mb-0">14%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-8">
          <div class="card w-100 rounded-4">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="">
                  <h5 class="mb-0">Sales & Views</h5>
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
              <div id="chart10"></div>
              <div
                class="d-flex flex-column flex-lg-row align-items-start justify-content-around border p-3 rounded-4 mt-3 gap-3">
                <div class="d-flex align-items-center gap-4">
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#98ec2d", "rgb(0 0 0 / 12%)"], "innerRadius": 32, "radius": 40 }'>5/7</span>
                    </p>
                  </div>
                  <div class="">
                    <p class="mb-1 fs-6 fw-bold">Monthly</p>
                    <h2 class="mb-0">65,127</h2>
                    <p class="mb-0"><span class="text-success me-2 fw-medium">16.5%</span><span>55.21 USD</span></p>
                  </div>
                </div>
                <div class="vr"></div>
                <div class="d-flex align-items-center gap-4">
                  <div class="">
                    <p class="mb-0 data-attributes">
                      <span
                        data-peity='{ "fill": ["#ff6a00", "rgb(0 0 0 / 12%)"], "innerRadius": 32, "radius": 40 }'>5/7</span>
                    </p>
                  </div>
                  <div class="">
                    <p class="mb-1 fs-6 fw-bold">Yearly</p>
                    <h2 class="mb-0">984,246</h2>
                    <p class="mb-0"><span class="text-success me-2 fw-medium">24.9%</span><span>267.35 USD</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><!--end row-->

      <div class="row">
        <div class="col-12 col-xl-4 d-flex">
          <div class="card overflow-hidden w-100 rounded-4">
            <div class="card-body">
              <div class="text-center">
                <h6 class="mb-0">Monthly Revenue</h6>
              </div>
              <div class="mt-4" id="chart12"></div>
              <p>Avrage monthly sale for every author</p>
              <div class="d-flex align-items-center gap-3 mt-4">
                <div class="">
                  <h1 class="mb-0 text-primary">68.9%</h1>
                </div>
                <div class="d-flex align-items-center align-self-end">
                  <p class="mb-0 text-success">34.5%</p>
                  <span class="material-icons-outlined text-success">expand_less</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-3 d-flex">
          <div class="card overflow-hidden w-100 rounded-4">
            <div class="p-3 bg-grd-purple">
              <div class="text-center">
                <h6 class="mb-0 text-white">Trending Products</h6>
              </div>
              <div class="mt-4" id="chart13"></div>
            </div>
            <div class="p-4">
              <p>Avrage monthly sale for every author</p>
              <div class="d-flex align-items-center gap-3 mt-4">
                <div class="">
                  <h1 class="mb-0 text-danger">48.2%</h1>
                </div>
                <div class="d-flex align-items-center align-self-end">
                  <p class="mb-0 text-success">34.5%</p>
                  <span class="material-icons-outlined text-success">expand_less</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-5 d-flex">
          <div class="card overflow-hidden w-100 rounded-4">
            <div class="card-body">
              <div class="text-center">
                <h6 class="mb-0">Yearly Income</h6>
              </div>
              <div class="mt-4" id="chart14"></div>
              <p>Avrage monthly sale for every author</p>
              <div class="d-flex align-items-center gap-3 mt-4">
                <div class="">
                  <h1 class="mb-0 text-success">68.9%</h1>
                </div>
                <div class="d-flex align-items-center align-self-end">
                  <p class="mb-0 text-success">34.5%</p>
                  <span class="material-icons-outlined text-success">expand_less</span>
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