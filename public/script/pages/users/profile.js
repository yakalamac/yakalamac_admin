if (!window.$) throw new Error('jQuery is not defined');
$=window.$;
if(!window.toastr) throw new Error('toastr is not defined');
toastr = window.toastr;
window.oauthEventID = `closeoauthwin-${Date.now().toString()}`;
window.modalStructureInitial = $('#validation-modal-initial-structure').find('.modal-content').clone();
const autoCloseEvent = (popupWindow, redirectUri)=>{
    const checkPopup = setInterval(() => {
        if (popupWindow.closed) {
            clearInterval(checkPopup);
            return;
        }
        try {
            const url = popupWindow.location.href;
            if (url.indexOf(redirectUri) === 0) {
                const urlParams = new URLSearchParams(url.split('?')[1]);
                const authCode = urlParams.get("code");
                if (authCode) {
                    clearInterval(checkPopup);
                    window.dispatchEvent(new CustomEvent(window.oauthEventID, {detail: {windowProxy: popupWindow}}));
                }
            }
        } catch (error) {console.error(error);}
    }, 1000);
};

const generateOAuthUrl = (credentials, redirectUri = undefined) => {
    if(typeof credentials !== 'object') throw new Error('Invalid parameter bag provided');

    if(!(typeof credentials.baseUri === 'string' && URL.canParse(credentials.baseUri))) throw new Error('Invalid base uri provided');

    if(typeof credentials.parameterBag !== 'object') throw new Error('Parameter-bag is not exists');

    if(!credentials.parameterBag?.scope) throw new Error('Invalid scope provided')

    if(!URL.canParse(redirectUri)) throw new Error('Invalid redirect uri provided');

    if(Array.isArray(credentials.parameterBag.scope)) credentials.parameterBag.scope = credentials.parameterBag.scope.join(' ');

    if(credentials.parameterBag.state && credentials.parameterBag.state === 'required') credentials.parameterBag.state = window.Twig._xrf;

    credentials.parameterBag.redirect_uri = redirectUri;

    const keys = Object.keys(credentials.parameterBag);

    keys.forEach(value => {
       if(credentials.parameterBag[value] === 'random') credentials.parameterBag[value] = Date.now().toString();
    });

    const params = new URLSearchParams(credentials.parameterBag);
    return `${credentials.baseUri}?${params.toString()}`;
};


window.crd = {
    google: {
        baseUri: "https://accounts.google.com/o/oauth2/v2/auth",
        parameterBag: {
            client_id: "901480078814-hs3spn3kcfl5rbv6fjqn14ghjufgs1ok.apps.googleusercontent.com",
            scope: "https://www.googleapis.com/auth/userinfo.email",
            access_type: "offline",
            include_granted_scopes: true,
            prompt: "select_account",
            state: 'required',
            response_type: "code",
            type: "google"
        },
        autoClose: true
    },
    apple: {
        baseUri: "https://appleid.apple.com/auth/oauth2/v2/authorize",
        parameterBag: {
            client_id: "la.yaka.api",
            scope: ["email", "profile"],
            response_type: ["code", "id_token"].join(" "),
            response_mode: "form_post",
            state: 'required',
            nonce: 'random',
            type: "apple"
        },
        autoClose: true
    },
    applev2: {
        baseUri: "https://appleid.apple.com/auth/authorize",
        parameterBag: {
            client_id: "la.yaka.api",
            scope: ["email", "name"],
            response_type: ["code", "id_token"].join(" "),
            response_mode: 'form_post',
            state: 'required',
            nonce: 'random',
            type: "apple"
        },
        autoClose: false
    },
    applev3: {
        baseUri: "https://appleid.apple.com/auth/authorize",
        parameterBag: {
            client_id: "la.yaka.api",
            scope: ["email", "name"],
            response_type: ["code", "id_token"].join(" "),
            response_mode: "web_message",
            state: 'required',
            nonce: 'random',
            type: 'apple'
        },
        autoClose: 'message'
    }
}

window.addEventListener(window.oauthEventID, event=>
    event && event.detail && event.detail.windowProxy && event.detail.windowProxy.close()
);

window.addEventListener('message', event=>{
    if (event.origin !== 'https://appleid.apple.com') {
        console.warn('Invalid origin:', event.origin);
        return;
    }
    try {
        fetch('/oauth2/callback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...JSON.parse(event.data).data.authorization, type: 'apple'}),
        })
            .then((response) => {
                if(window.Twig.autoClose) window.Twig.autoClose.close();
                if(response.ok) toastr.success('Başarılı.');
                else toastr.warn('Bir sorun oluştu.');
            })
            .catch((error) => {
                console.error('Error on proccess. ', error);
                toastr.error('Bir hata oluştu');
            });
    } catch (error) {console.error('Failed to parse message data');}
});

const openOAuthPopup = (type) => {
    const redirectUri = (new URL('/oauth2/callback', window.location.origin)).href;
    const oauthUrl = generateOAuthUrl(window.crd[type], redirectUri);
    const width = 500; const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popupWindow = window.open(oauthUrl, "Oauth2",
        `width=${width},height=${height},top=${top},left=${left}`);
    if(window.crd[type].autoClose === true) autoCloseEvent(popupWindow, redirectUri);
    else if(window.crd[type].autoClose === 'message') window.Twig.autoClose = popupWindow;
};

/**
 * @typedef {Object} ModalAttr
 * @property {string|undefined} html
 * @property {string|undefined} text
 * @property {Function|undefined} event
 */
/**
 * @param element
 * @param {ModalAttr} attribute
 */
const pushAttribute = (element, attribute) => {
    element.html(attribute.html ?? '');
    element.text(attribute.text ?? '');
    element.off('click');
    if (attribute.event) element.on('click', attribute.event);
};

/**
 * @param modal
 * @param {ModalAttr|undefined} modalHeader
 * @param {ModalAttr|undefined} modalBody
 * @param {ModalAttr|undefined} modalSuccess
 * @param {any} pushDirect
 */
const manipulateModal = (modal, modalHeader, modalBody, modalSuccess, pushDirect = null) => {
    if (modal.length) {
        if(pushDirect) {
            if(pushDirect.header) {
                modal.find('div.modal-header').html(pushDirect.header);
            }
            if(pushDirect.body) {
                modal.find('div.modal-body').html(pushDirect.body);
            }
            if(pushDirect.footer) {
                modal.find('div.modal-footer').html(pushDirect.footer);
            }
            return;
        }

        pushAttribute(modal.find('div.modal-header h5'), modalHeader ?? {});
        pushAttribute(modal.find('div.modal-body'), modalBody ?? {})
        pushAttribute(modal.find('div.modal-footer button.modal-success'), modalSuccess ?? {});
    }
}

const resetModal = (modal)=>{
    modal.find('div.modal-content').html(window.modalStructureInitial.html());
}

/**
 * @returns {{
 * manipulator: function(ModalAttr|undefined, ModalAttr|undefined, ModalAttr|undefined, any): void,
 * modal: (*|jQuery|HTMLElement)
 * }}
 */
const initialize = () => {
    const nonce = `ip-modal-${Date.now().toString()}`;
    /**
     * @type {object}
     * @property {Function} prop
     */
    $('div#ip-modal-initial-structure').prop('id', nonce);
    /**
     * @type {object}
     * @property {Function} each
     * @property {Function} first
     */
    $('input.ip-input-type').each(
        function (index, element) {
            element.setAttribute('data-bs-toggle', 'modal');
            element.setAttribute('data-bs-target', '#' + nonce);
        }
    );
    const modal = $(`div#${nonce}`);
    return {
        manipulator: (modalHeader = {}, modalBody = {}, modalSuccess = {}, pushDirect = undefined) =>
            manipulateModal(modal, modalHeader, modalBody, modalSuccess, pushDirect),
        modal: modal
    };
};

/**
 * @param {Event} event
 */
const addAccountEvent = (event) => {
    const target = event?.currentTarget;
    if(target instanceof HTMLElement) openOAuthPopup(target.getAttribute('data-type') ?? undefined);
};

const startValidationProcess = (event)=>{
    const target = event?.currentTarget;
    const type = target.getAttribute('data-type');
    const value = target?.parentNode?.querySelector(`#${type}`)?.value;
    if(typeof value !== 'string') return;
    const modal = $('#validation-modal-initial-structure');
    resetModal(modal);
    const body = {type, value};

    function onFetch(overwrite = undefined){
        return fetch('/admin/validate', {
            method:'POST',body:JSON.stringify(overwrite ?? body),
            headers:{'Content-Type':'application/json'}
        }).then(async response=>{
            const object = {returned:await response.text()};
            try{
                object.returned = JSON.parse(object.returned);
            }catch (error){
                console.error(error);
            }
            if(response.ok){
                console.log(object.returned);
            } else {
                console.warn(object.returned);
            }
            return object.returned;
        }).catch(e=>console.error(e) || e);
    }

    switch (type)
    {
        case 'email':
            manipulateModal(
                modal,
                {text:'E-posta adresinizi doğrulayın.'},
                {text:'Bu işlem için belirtilen e-posta adresinize doğrulama gönderilecektir. Gelen doğrulama bağlantısına tıkladığınızda doğrulama tamamlanmış olacaktır.'},
                {text: 'Doğrula', event:()=>{
                        if(value.length === 0) {
                            toastr.info('E-posta alanı boş olamaz');
                            return;
                        }

                        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
                            toastr.warning('Geçerli bir e-posta adresi girin');
                            return;
                        }

                        onFetch();
                    }
                }
            );
            break;
        case 'mobilePhone':
            manipulateModal(
                modal,
                {text:'Telefon numaranızı doğrulayın.'},
                {text:'Bu işlem için belirtilen telefon numaranıza kısa mesaj gönderilecektir. Gelen doğrulama kodunu girdiğinizde doğrulama tamamlanmış olacaktır.'},
                {text: 'Doğrula', event:()=>{
                        if(value.length === 0) {
                            toastr.info('Telefon numarası alanı boş olamaz');
                            return;
                        }

                        if(!(/^(\+?\d{1,4}[- ]?)?(\d{10}|\d{3}[- ]\d{3}[- ]\d{4})$/.test(value))) {
                            toastr.warning('Geçerli bir telefon numarası girin');
                            return;
                        }

                        onFetch()
                            .then(async response=>{
                                    const verificationToken = response.verificationToken;
                                    const otp = document.createElement('div');
                                    otp.OTPModule({
                                        targetNumber: value,
                                        onResend: ({digits})=>{
                                            console.log('yeniden gönderiliyor');
                                        },
                                        onSubmit: ({digits})=>{
                                            if(digits.length === 6) {
                                                onFetch({
                                                    state: 'verification',
                                                    mobilePhone: value,
                                                    verificationToken: verificationToken,
                                                    smsCode: digits,
                                                    type: 'mobilePhone'
                                                });
                                            }
                                        },
                                        inverse: true
                                    });

                                    manipulateModal(modal, undefined,undefined,undefined,
                                        {
                                            header: otp.getHeader(), body: otp.getBody(), footer: otp.getFooter()
                                        });
                            })
                            .catch(err=>{
                                console.error(err)
                            });
                    }
                }
            );
            break;
    }
    modal.modal('show');
};

const updateProfileEvent = function (event){
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const jsonData = {timezone: 'Europe/Istanbul', preferredLanguages:['tr_TR', 'tr']};
    form.forEach((val, key)=> {
        if(['string', 'number', 'boolean'].includes(typeof val)) {
            if(typeof val === 'string' && val.length === 0) return;
            if(['email', 'mobilePhone'].includes(key)) return;
            jsonData[key] = val;
        }
    });

    fetch('/admin/profile', {method:'PATCH', headers:{
        'Content-Type' : 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).then(r=>r.text().then(t=>{
        try{
            const json = JSON.parse(t);
            console.log('Ayrıştırabilir json');
            console.log(json);
        }catch (e){
            console.error(e);
            console.log(t);
        }
    })).catch(e=>console.error(e));
};

$(document).ready(function () {
    const {manipulator, modal} = initialize();

    $('.ip-checkbox').on('click',function (event) {
        event.preventDefault();
        const previousState = !event.target.checked;
        const nextState = event.target.checked;
        event.target.checked = previousState;
        const parent = event.currentTarget.parentElement.parentElement;

        if (previousState) {
            manipulator(
                {text: `${parent.getAttribute('data-type')} Hesabı Bağlantısı`},
                {text: `${parent.getAttribute('data-type')} hesabınızın bağlantısını kesmek istediğinizden emin misiniz.`},
                {
                    text: 'Bağlantıdan vazgeç',
                    event: function () {
                        const userId = parent.getAttribute('data-user-id');
                        const type = parent.getAttribute('data-type');
                        fetch(`/admin/deleteLinkedAccount?identityProviderUserId=${userId}&type=${type}`,
                            {method: 'DELETE',}
                        ).then(response => response.ok ? modal.modal('hide') && (event.target.checked = nextState)
                            : manipulator(
                                {text: 'Bir hata oluştu'},
                                {text: `${parent.getAttribute('data-type')} hesabınızın bağlantısı kesilirken bir hata oluştu.`},
                                undefined)
                        ).catch(error=>console.error(error) && manipulator(
                            {text: 'Bir hata oluştu'},
                            {text: `${parent.getAttribute('data-type')} hesabınızın bağlantısı kesilirken bir hata oluştu.`},
                            undefined)
                        )
                    }
                }
            );
        }
    });

   $('#add-linked-account').on('click',()=>$('#ip-modal-add-account').modal('show'));
   $('.add-account-symbol').on('click', addAccountEvent);
   $('#profile-basics-form').on('submit', updateProfileEvent);
   $('.validate-button').on('click', startValidationProcess);
});