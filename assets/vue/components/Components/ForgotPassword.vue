<script setup>
import { onMounted } from 'vue';
import $ from '../../../bootstrap/assets/js/jquery.min';

onMounted(() => {
    $("#show_hide_password a").on('click', function (event) {
        event.preventDefault();
        const input = $('#show_hide_password input');
        if (input.attr("type") === "text") {
            input.attr('type', 'password');
            $('#show_hide_password i').addClass("bi-eye-slash-fill").removeClass("bi-eye-fill");
        } else {
            input.attr('type', 'text');
            $('#show_hide_password i').removeClass("bi-eye-slash-fill").addClass("bi-eye-fill");
        }
    });
});
</script>

<template>
    <div class="auth-basic-wrapper d-flex align-items-center justify-content-center">
        <div class="container my-5 my-lg-0">
            <div class="row">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
                    <div class="card rounded-4 mb-0 border-top border-4 border-primary border-gradient-1">
                        <div class="card-body p-5">
                            <img src="../../../../assets/bootstrap/assets/images/logo1.png" class="mb-4" width="145"
                                alt="">
                            <h4 class="fw-bold">Forgot Password?</h4>
                            <p class="mb-0">Enter your registered email ID to reset the password</p>

                            <div class="form-body mt-4">
                                <form class="row g-4">
                                    <div class="col-12">
                                        <label class="form-label">Email id</label>
                                        <input type="text" class="form-control form-control-lg"
                                            placeholder="example@user.com">
                                    </div>
                                    <div class="col-12">
                                        <div class="d-grid gap-2">
                                            <button type="button" class="btn btn-grd-primary">Send</button>
                                            <a href="auth-basic-login.html" class="btn btn-light">Back to Login</a>
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
</template>