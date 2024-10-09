<script setup>
import { onMounted } from 'vue';
import $ from '../../../bootstrap/assets/js/jquery.min';

onMounted(() => {
    $("#show_hide_password a").on('click', function (event) {
          event.preventDefault();
          if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("bi-eye-slash-fill");
            $('#show_hide_password i').removeClass("bi-eye-fill");
          } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("bi-eye-slash-fill");
            $('#show_hide_password i').addClass("bi-eye-fill");
          }
    });
});
</script>

<template>
    <body class="bg-reset-password">
        <div class="auth-basic-wrapper d-flex align-items-center justify-content-center">
            <div class="container my-5 my-lg-0">
                <div class="row">
                    <div class="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
                        <div class="card rounded-4 mb-0 border-top border-4 border-primary border-gradient-1">
                            <div class="card-body p-5">
                                <img src="../../../../assets/bootstrap/assets/images/logo1.png" class="mb-4" width="145" alt="">
                                <h4 class="fw-bold">Genrate New Password</h4>
                                <p class="mb-0">We received your reset password request. Please enter your new password!
                                </p>
                                <div class="form-body mt-4">
                                    <form class="row g-4">
                                        <div class="col-12">
                                            <label class="form-label" for="NewPassword">New Password</label>
                                            <input type="text" class="form-control" id="NewPassword"
                                                placeholder="Enter new password">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="ConfirmPassword">Confirm Password</label>
                                            <input type="text" class="form-control" id="ConfirmPassword"
                                                placeholder="Confirm password">
                                        </div>
                                        <div class="col-12">
                                            <div class="d-grid gap-2">
                                                <button type="button" class="btn btn-grd-info">Change Password</button>
                                                <a href="auth-basic-login.html" class="btn btn-grd-royal">Back to
                                                    Login</a>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div><!--end row-->
            </div>
        </div>
    </body>
</template>