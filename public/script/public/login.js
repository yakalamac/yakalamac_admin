import Yakalamac from "../modules/yakalamac/index.js";

/**
 *
 * @param {object} qBag
 * @returns {string}
 */
const buildQuery = (qBag) => {
    let query = '';
    if(typeof qBag === 'object'){
        const temp = [];
        const keys = Object.keys(qBag);

        if(keys.length > 0) {
            keys.forEach(key=> {
               if(qBag[key] && (typeof qBag[key] !== 'object' || typeof qBag[key] !== 'function')){
                   temp.push(key + '=' + qBag[key]);
               }
            });
            if(temp.length > 0) {
                query = '?' + temp.join('&');
            }
        }
    }

    return query;
}

/**
 * @param {object} data This is the response which provided by API
 * @param {Object} queryParameterBag
 * @param {object} extraProperties
 */
const handleResponseOnIdentityProviderLogin = (data, queryParameterBag={}, extraProperties = {}) => {

    if(!window.Twig._xrf){
        throw new Error('CSRF was not found.');
    }

    if(data.redirected){
        toastr.success("Giriş yapıldı, yönlendiriliyorsunuz.");
        setTimeout(()=>window.location.href = data.redirected, 200);
        return;
    }

    if (data.accessToken) {
        fetch("/login_check"+buildQuery(queryParameterBag),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/ld+json",
                },
                body: JSON.stringify({
                    accessToken: data.accessToken,
                    userUUID: data.user.id,
                    ...extraProperties
                }),
            }
        ).then(async (r) => {
                if(r.ok) {
                    toastr.success("Giriş yapıldı, yönlendiriliyorsunuz.");
                    setTimeout(()=>window.location.replace(r.url), 200);
                } else {
                    toastr.info('Bir sorun oluştu');
                    setTimeout(()=>window.location.reload(), 200);
                }

        }).catch(e=> console.error(e));

    } else {
        alert("Doğrulama kodu hatalı veya geçersiz. Lütfen tekrar deneyin.");
    }
};

$(document).ready(function () {

    (
        function ()
        {
            if(window.yakalamac instanceof Yakalamac) {
                console.warn('Regeneration of Yakalamac prevented. It was already defined');
                return;
            }
            const yakalamacIdentityProvider = new Yakalamac('admin');

            yakalamacIdentityProvider.createGoogleIdentityProvider(
                '901480078814-hs3spn3kcfl5rbv6fjqn14ghjufgs1ok.apps.googleusercontent.com',
                'https://stag-deep-internally.ngrok-free.app/identity-provider/google'
            ).getGoogleIdentityProvider().init();

            yakalamacIdentityProvider.createAppleIdentityProvider(
                'la.yaka.api',
                ['name', 'email'],
                'https://stag-deep-internally.ngrok-free.app/identity-provider/apple'
            ).getAppleIdentityProvider().setLocale('tr_tr').init();

            const parent = document.getElementById("yakalamac-identity-provider-list");

            yakalamacIdentityProvider
                .addAppleStyle('col-1 p-0 m-0')
                .addGoogleStyle('col-1 p-0 m-0')
                .appleOnSuccess((...args)=>{
                    const data = args[0];

                    if(!data){
                        toastr.info('Bir hata oluştu');
                        return;
                    }

                    handleResponseOnIdentityProviderLogin(
                        data,
                        {'use-identity-provider' : 'apple'},
                        {_xrf_token: window.Twig._xrf}
                    );
                })
                .googleOnSuccess(event=>{

                    const data = event.json;

                    if(!data){
                        toastr.info('Bir hata oluştu');
                        return;
                    }

                    handleResponseOnIdentityProviderLogin(
                        data,
                        {'use-identity-provider' : 'google'},
                        {_xrf_token: window.Twig._xrf}
                    );
                })
                .appleOnSuccessOnException((...args)=>{
                    console.log("Apple success on expetciyom hata");
                    console.log(...args);
                })
                .appleOnFailure((failureResponse)=>{
                    failureResponse.text().then(text=>{
                        console.log(JSON.parse(text));
                    }).catch(e=>{
                        console.error(e);
                    });
                })
                .googleOnFailure(event=>{
                    console.log("google giris hata")
                    console.error(event)}
                )
                .appleOnFailureOnException((...args)=>{console.log(...args)
                    console.log("apple on failure hata")
                })
                .forceToReplaceGoogle(parent)
                .forceToReplaceApple(parent)
                .setServerSideRedirectUri('/login_check?use-identity-provider=as_server_side')
                .useCsrf({token: window.Twig._xrf, key: '_xsrf_token', as: 'query'})
                .getAppleIdentityProvider()
                .setColor('white')
                .setLogo('small')
                .setRadius(50)
                .setMode('logo-only')
                .setWidth(1)
                .setHeight(1);

            window.yakalamac = yakalamacIdentityProvider;
        }
     )();

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