const ipHandler = function (data, type){
    fetch('/login_check?use-identity-provider=as_server_side', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-XSRF-TOKEN' : window.Twig._xrf
        },
        body: JSON.stringify({providerType: type, ...data})
    }).then(async r=>{
        if(r.ok && r.redirected) {
            toastr.success('Yönlendiriliyorsunuz..');
            console.log(r.url);
            setTimeout(()=>window.location.href = r.url, 1000);
        }
    })
        .catch(e=>console.error(e));
};

window.googleLoginHandler = (response) => {
    ipHandler({
        clientId: response.clientId ?? response.client_id,
        token: response.credential
    },'google');
};

document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    if(event.detail) {
        ipHandler({
            idToken: event.detail.authorization.id_token,
            code: event.detail.authorization.code,
            redirectUri: window.Twig.oauthRedirectUri
        },'apple');
    }
});

document.addEventListener('AppleIDSignInOnFailure', (event) => {
    console.log(event);
});

$(document).ready(function () {
    (
        function ()
        {
            const iElement = $('#show_hide_password i');
            const inputElement = $('#show_hide_password input');

            $("#show_hide_password a").on('click', function (event) {
                event.preventDefault();

                if (inputElement.attr("type") === "text") {
                    inputElement.attr('type', 'password');
                    iElement.addClass("bi-eye-slash-fill");
                    iElement.removeClass("bi-eye-fill");
                } else if (inputElement.attr("type") === "password") {
                    inputElement.attr('type', 'text');
                    iElement.removeClass("bi-eye-slash-fill");
                    iElement.addClass("bi-eye-fill");
                }
            });
        }
    )();

    $('#switchToPhoneLogin').click(function () {
        $('#emailLoginForm').hide();
        $('#phoneLoginForm').show();
        $('#inputEmailAddress').prop('required', false);
        $('#inputChoosePassword').prop('required', false);

        $('#inputPhoneNumber').prop('required', true);
        $('#inputOtpCode').prop('required', false);
    });

    $('#switchToEmailLogin').click(function () {
        $('#phoneLoginForm').hide();
        $('#emailLoginForm').show();
        $('#inputPhoneNumber').prop('required', false);
        $('#inputOtpCode').prop('required', false);

        $('#inputEmailAddress').prop('required', true);
        $('#inputChoosePassword').prop('required', true);
    });
    $('#inputPhoneNumber').inputmask("(999) 999 99 99", {
        clearMaskOnLostFocus: true
    });

    $('#sendOtpBtn').on('click', function () {
        const phoneNumber = $('#inputPhoneNumber').inputmask('unmaskedvalue');
        if (!phoneNumber || phoneNumber.length < 10) {
            toastr.error('Lütfen geçerli bir telefon numarası girin. Örn: (555) 555 55 55');
            return;
        }
        if (!phoneNumber) {
            toastr.error('Lütfen telefon numarasını girin.');
            return;
        }

        $.ajax({
            url: '/send-otp',
            method: 'POST',
            data: {
                mobilePhone: phoneNumber
            },
            success: function (response) {
                const otpStep = $('#otpStep');
                toastr.info('SMS kodu gönderildi.');
                $('#phoneStep').hide();
                otpStep.show();
                $('#inputOtpCode').prop('required', true);
                otpStep.data('verificationToken', response.verificationToken);
            },
            error: function (xhr) {
                toastr.error(xhr.responseJSON.error || 'Bir hata oluştu.');
            }
        });
    });

    $('#loginOtpBtn').on('click', function () {

        const phoneNumber = $('#inputPhoneNumber').val();
        const smsCode = $('#inputOtpCode').val();
        const verificationToken = $('#otpStep').data('verificationToken');
        const csrfToken = $('input[name="_csrf_token_phone"]').val();
        if (!/^\d{6}$/.test(smsCode)) {
            toastr.error('Lütfen geçerli bir 6 haneli SMS kodu girin.');
            return;
        }
        if (!smsCode || !verificationToken) {
            toastr.error('Lütfen tüm bilgileri doldurun.');
            return;
        }
        $.ajax({
            url: '/verify-otp',
            method: 'POST',
            data: {
                mobilePhone: phoneNumber,
                smsCode: smsCode,
                verificationToken: verificationToken,
                _csrf_token: csrfToken,
            },
            success: function (response) {
                window.location.href = response.redirect;
                toastr.success('Giriş başarılı!');
            },
            error: function (xhr) {
                toastr.error(xhr.responseJSON.error || 'Bir hata oluştu.');
            }
        });
    });

    $('form').on('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            if ($('#emailLoginForm').is(':visible')) {
                $('#emailLoginForm button[type="submit"]').click();
            } else if ($('#phoneLoginForm').is(':visible')) {
                if ($('#otpStep').is(':visible')) {
                    $('#loginOtpBtn').click();
                } else {
                    $('#sendOtpBtn').click();
                }
            }
        }
    });

});
