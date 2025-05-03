import {apiPost} from "../modules/api-controller/ApiController.js";

if (!window.$) throw new Error('Jquery is not loaded.');

const LoginPage = {
    clickedEvents: new Set(),
    csrfToken:  window?.Twig?._xrf || '',
    oauthRedirectUri: window?.Twig?.oauthRedirectUri || '',
    toggleEvent(type) {
        if (this.clickedEvents.has(type)) return false;
        this.clickedEvents.add(type);
        return true;
    },
    resetEvent(type) {
        this.clickedEvents.delete(type);
    },
    startInputMask(){
        /** @var {{inputmask: function}} $ */
        $('#mobilePhone').inputmask("(999) 999 99 99", {clearMaskOnLostFocus: true});
    },
    removeInputMask(){
        $('#mobilePhone').inputmask("remove");
    },
    form: {
        passwordless: false,
        state: 'email',
        otp: false,
        actions: {
            ['false']: undefined,
            ['true']: '/_passwordless'
        },
        build: ()=>{
            const form = $('#main-form form');
            const form_content = form.find('div#content');
            form_content.empty();
            let template = '';
            template+=$(`template#${LoginPage.form.state}-template`).html();

            if(!LoginPage.form.otp) {
                form.attr('action', LoginPage.form.actions[LoginPage.form.passwordless.toString()]);
            }

            if(LoginPage.form.passwordless === false && LoginPage.form.otp === false) {
                template+=$(`template#password-template`).html();
            }

            form_content.html(template);

            if(LoginPage.form.state === 'mobile') {
                LoginPage.startInputMask();
            }
        },
        initialized: false,
        init: ()=>{
            if(LoginPage.form.initialized) return;
            const form = $('#main-form form');
            LoginPage.form.actions['false'] = form.attr('action');
            LoginPage.form.initialized = true;
            LoginPage.form.build();
        },
        stateCache:undefined,
        otpStart: (identifier, response)=>{
            LoginPage.form.otp = true;
            const input = $('<input>');
            input.prop('hidden', true);
            input.prop('required', true);
            input.prop('value', response.verificationToken);
            input.attr('name', 'verificationToken');
            const form = $('#main-form form');
            const form_content = form.find('div#content');
            form_content.empty();
            form_content.append(input);
            form_content.append(`<input type="hidden" name="identifier" value="${identifier}">`);
            form_content.append(`<input type="hidden" name="type" value="${LoginPage.form.state}">`);
            form_content.append($(`template#otp-template`).html());
            form.attr('action', '/login_check/otp');
        },
        otpStop(){
            LoginPage.form.otp = false;
        },
        toggle(){
            LoginPage.form.otpStop();
            LoginPage.form.state = LoginPage.form.state === 'email' ? 'mobile' : 'email';
            LoginPage.form.build();
        }
    }
};


const ipHandler = function (data, type) {
    if (LoginPage.toggleEvent(type)) {
        return;
    }

    apiPost('/login_check?use-identity-provider=as_server_side', {
        format: 'application/json', data: {providerType: type, ...data},
        headers: {'X-XSRF-TOKEN': window.Twig._xrf}
    }, {
        successMessage: 'Yönlendiriliyorsunuz..',
        success: r=>setTimeout(() => window.location.href = r.url, 1000),
        failure: r=>{
            console.warn(r);
            LoginPage.resetEvent(type);
        },
        error: R=>{
            console.error(R);
            LoginPage.resetEvent(type);
        }
    });
};

window.googleLoginHandler = (response) => ipHandler({
    clientId: response.clientId ?? response.client_id,
    token: response.credential
}, 'google');


window.googleLoginHandler2=r=>console.log(r);

document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    if (event.detail) ipHandler({
            idToken: event.detail.authorization.id_token,
            code: event.detail.authorization.code,
            redirectUri: window.Twig.oauthRedirectUri
        },
        'apple'
    );
});

document.addEventListener('AppleIDSignInOnFailure', (event) => console.error(event));


$(document).on('click', "#show_hide_password a", function (event) {
    const iElement = $('#show_hide_password i');
    const inputElement = $('#show_hide_password input');
    event.preventDefault();
    switch ((inputElement.attr("type") === "text")) {
        case true:
            inputElement.attr('type', 'password');
            iElement.addClass("bi-eye-slash-fill");
            iElement.removeClass("bi-eye-fill");
            break;
        case false:
            inputElement.attr('type', 'text');
            iElement.removeClass("bi-eye-slash-fill");
            iElement.addClass("bi-eye-fill");
    }
});

$(document).ready(function () {
    LoginPage.form.init();

    $('#switchKey').on('click', LoginPage.form.toggle);

    LoginPage.startInputMask();

    $('#passwordless').on('click', function () {
        LoginPage.form.otpStop();
        LoginPage.form.passwordless = (!LoginPage.form.passwordless);
        LoginPage.form.build();
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
    }).on('submit', function (e) {
        e.preventDefault();
        const mobileInput = $('input#mobilePhone');

        if (!LoginPage.form.passwordless || LoginPage.form.otp) {
            const value = mobileInput.inputmask('unmaskedvalue');
            LoginPage.removeInputMask();
            mobileInput.val(value);
            e.target.submit();
            LoginPage.startInputMask();
            return;
        }

        const data = {loginId: undefined};
        let message;
        if (LoginPage.form.state === 'mobile') {
            data.loginId = mobileInput.inputmask('unmaskedvalue');
            message = 'Telefonunuza gelen doğrulama kodunu girin';
        } else {
            data.loginId = $('input#email').val();
            message = 'E-posta kutunuzu kontrol edin';
        }

        apiPost('/_passwordless', {format: 'application/json', data},
            {
                successMessage: message,
                success: (response) => LoginPage.form.otpStart(data.loginId, response)
            });
    });
});


/**


 $('#sendOtpBtn').on('click', function () {
const phoneNumber = $('#inputPhoneNumber').inputmask('unmaskedvalue');


if (!phoneNumber || phoneNumber.length < 10) {
    toastr.error('Lütfen geçerli bir telefon numarası girin. Örn: (555) 555 55 55');
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


 */