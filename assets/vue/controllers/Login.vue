<script setup>
import '../../bootstrap/assets/js/pace.min.js';
import '../../bootstrap/assets/css/pace.min.css'

import '../../bootstrap/assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css';
import '../../bootstrap/assets/plugins/metismenu/metisMenu.min.css';
import '../../bootstrap/assets/plugins/metismenu/mm-vertical.css';

import '../../bootstrap/assets/css/bootstrap.min.css';

import '../../bootstrap/assets/css/bootstrap-extended.css';

import '../../bootstrap/sass/dark-theme.css';
import '../../bootstrap/sass/blue-theme.css';
import '../../bootstrap/sass/responsive.css';
</script>

<template>
  <div class="section-authentication-cover">
    <div class="">
    <div class="row g-0">

        <div class="col-12 col-xl-7 col-xxl-8 auth-cover-left align-items-center justify-content-center d-none d-xl-flex border-end bg-transparent">

          <div class="card rounded-0 mb-0 border-0 shadow-none bg-transparent bg-none">
            <div class="card-body">
              <img src="../../bootstrap/assets/images/auth/login1.png" class="img-fluid auth-img-cover-login" width="650" alt="">
            </div>
          </div>

        </div>

        <div class="col-12 col-xl-5 col-xxl-4 auth-cover-right align-items-center justify-content-center border-top border-4 border-primary border-gradient-1">
          <div class="card rounded-0 m-3 mb-0 border-0 shadow-none bg-none">
            <div class="card-body p-sm-5">
              <img src="../../bootstrap/assets/images/logo1.png" class="mb-4" width="259" alt="">
              <h4 class="fw-bold">Get Started Now</h4>
              <p class="mb-0">Enter your credentials to login your account</p>

              <div class="row g-3 my-4">
                <div class="col-12 col-lg-6">
                  <button class="btn btn-light py-2 font-text1 fw-bold d-flex align-items-center justify-content-center w-100"><img src="../../bootstrap/assets/images/apps/05.png" width="20" class="me-2" alt="">Google</button>
                </div>
                <div class="col col-lg-6">
                  <button class="btn btn-light py-2 font-text1 fw-bold d-flex align-items-center justify-content-center w-100"><img src="../../bootstrap/assets/images/apps/17.png" width="20" class="me-2" alt="">Facebook</button>
                </div>
              </div>

              <div class="separator section-padding">
                <div class="line"></div>
                <p class="mb-0 fw-bold">OR</p>
                <div class="line"></div>
              </div>

              <div class="form-body mt-4">
                <form class="row g-3">
                  <div class="col-12">
                    <label for="inputEmailAddress" class="form-label">Email</label>
                    <input type="email" class="form-control" id="inputEmailAddress" placeholder="jhon@example.com">
                  </div>
                  <div class="col-12">
                    <label for="inputChoosePassword" class="form-label">Password</label>
                    <div class="input-group" id="show_hide_password">
                      <input type="password" class="form-control" id="inputChoosePassword" value="12345678" placeholder="Enter Password">
                      <a href="javascript:;" class="input-group-text bg-transparent"><i class="bi bi-eye-slash-fill"></i></a>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked">
                      <label class="form-check-label" for="flexSwitchCheckChecked">Remember Me</label>
                    </div>
                  </div>
                  <div class="col-md-6 text-end">	<a href="auth-cover-forgot-password.html">Forgot Password ?</a>
                  </div>
                  <div class="col-12">
                    <div class="d-grid">
                      <button type="submit" class="btn btn-grd-primary">Login</button>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="text-start">
                      <p class="mb-0">Don't have an account yet? <a href="auth-cover-register.html">Sign up here</a>
                      </p>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
      <!--end row-->
    </div>
  </div>

</template>

<style scoped>

</style>