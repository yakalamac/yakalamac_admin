import {apiPost} from "../modules/bundles/api-controller/ApiController.js";

if(!window.$) throw new Error('Jquery is not loaded.');
window.clickedEvents = [];
window.state = undefined;
const states = {
    email: {
        key: 'Telefon ile giriş yap',
        appearance: {
            'div#input-mobile': false,
            'div#input-email' : true
        },
        requirements: {
            'input#mobilePhone' : false,
            'input#email' : true
        },
        _next: 'mobile'
    },
    mobile: {
        key: 'E-posta ile giriş yap',
        appearance: {
            'div#input-mobile': true,
            'div#input-email' : false
        },
        requirements: {
            'input#mobilePhone' : true,
            'input#email' : false
        },
        _next: 'email'
    }
};


const ipHandler = function (data, type){
    if(window.clickedEvents.includes(type)) {
        return;
    }
    window.clickedEvents.push(type);
    fetch('/login_check?use-identity-provider=as_server_side', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json', 'X-XSRF-TOKEN' : window.Twig._xrf},
        body: JSON.stringify({providerType: type, ...data})
    }).then(async response=>{
        if(response.ok && response.redirected) {
            toastr.success('Yönlendiriliyorsunuz..');
            console.log(response.url);
            setTimeout(()=>window.location.href = response.url, 1000);
        } else {
            console.warn(await response.text());
            window.clickedEvents.filter(event=> event !== type);
        }
    }).catch(e=>{
        console.error(e);
        window.clickedEvents.filter(event=> event !== type);
    });
};

window.googleLoginHandler = (response) => ipHandler({clientId: response.clientId ?? response.client_id, token: response.credential},'google');


document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    if(event.detail) ipHandler({
            idToken: event.detail.authorization.id_token,
            code: event.detail.authorization.code,
            redirectUri: window.Twig.oauthRedirectUri
        },
        'apple'
    );
});

document.addEventListener('AppleIDSignInOnFailure', (event) => console.error(event));

$(document).ready(function () {


    (function () {
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
    })();

    $('#switchKey').on('click',function () {
       const state = $(this).data('state');
       const current = states[state];
       if(current === undefined) return;
       $(this).text(current.key);
       $(this).data('state', current._next);
       Object.keys(current.appearance).forEach(key=>{
          current.appearance[key] === true ? $(key).show() : $(key).hide();
       });

       Object.keys(current.requirements).forEach(key=>{
           $(key).prop('required', current.requirements[key]);
       });
    });


    $('#mobilePhone').inputmask("(999) 999 99 99", {clearMaskOnLostFocus: true});

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

    $('#passwordless').on('click',function () {
        const container = $('div#main-form form div#password');
        const password = container.find('div#container');

        if (password.length === 0) {
            container.append(`
                <div id="container">
                    <label for="inputChoosePassword" class="form-label">Şifre</label>
                    <div class="input-group" id="show_hide_password">
                        <input type="password" class="form-control" id="inputChoosePassword"
                               name="password"
                               placeholder="********" autocomplete="current-password" required>
                        <a href="javascript:void(0)" class="input-group-text bg-transparent">
                            <i class="bi bi-eye-slash-fill"></i>
                        </a>
                    </div>
                </div>
            `);
            $(this).text('Şifresiz giriş');
            window.state = undefined;
        } else {
            $(this).text('Şifre kullan');
            window.state = 'passwordless';
            password.remove();
        }
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
    }).on('submit', function (e){
        if(window.state === 'passwordless') {
            e.preventDefault();
            const state = $('#switchKey').data('state');
            const data = {
                loginId: undefined
            };
            let message;

            if(state === 'email') {
                data.loginId = $('input#mobilePhone').inputmask('unmaskedvalue');
                message = 'Telefonunuza gelen doğrulama kodunu girin';
            } else {
                data.loginId = $('input#email').val();
                message = 'E-posta kutunuzu kontrol edin';
            }

            apiPost('/_passwordless', {format: 'application/json', data: JSON.stringify(data)},
                {
                    successMessage: message,
                    success: (response)=>{
                        $('form div[data-step="start"]').hide();
                        const otp = $('form div[data-step="otp"]');
                        otp.show(); otp.prop('required', true);
                        const input = $('<input>');
                        input.prop('hidden', true);
                        input.prop('value',response.verificationToken);
                        input.attr('name','verificationToken');
                        const form = $('form');
                        form.append(input);
                        form.attr('action', '/login_check/otp');
                        window.state = undefined;
                    }
            });
        }
    });
});
