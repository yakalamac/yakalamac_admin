document.addEventListener('DOMContentLoaded', function () {
    // Store stepper locally
    const stepper = document.querySelector('#ownershipstepper');
    // Check if the given selector is existing
    if(stepper === null || stepper === undefined) throw new Error('No valid stepper found.');

    if(!window.hasOwnProperty('Stepper') || typeof window.Stepper !== 'function' || typeof Stepper !== 'function') throw new Error('No valid stepper plugin');

    // Create current step control storage
    const current = {
        step: 0,
        data: {
            fullname: undefined,
            address: undefined,
            email: undefined,
            mobile: undefined,
            storage: {

            }
        }
    };

    stepper2 = new Stepper(stepper, {
        linear: false
    });

    function validateStep() {

        function MessagePrinter(selector, value) {
            const f = {
                email: val=> {
                    if(window.toastr) {
                        toastr.warning('Geçerli bir e-posta adresi giriniz.');
                    }
                },
                mobilephone: ()=>{
                    if(window.toastr) {
                        toastr.warning('Geçerli bir telefon numarası giriniz.');
                    }
                },
                missing:()=>{
                    if(window.toastr) {
                        toastr.warning('Telefon ya da email adresinden en az birini girmelisiniz.');
                    }
                }
            };

            if(typeof  f[selector] === 'function') {
                f[selector](value);
            }
        }

        function validator(selector, val) {
            return {
                email: val => typeof val === 'string' && val.trim().length > 0 && /^([a-z])([a-z0-9_.]{1,31})@[a-z][a-z0-9]+\.[a-z]{2,}g/.test(val),
                moilephone: val => typeof val === 'string' && val.trim().length > 0 && /^\+?[0-9]*[1-9][0-9]{9}$/.test(val),
            }[selector](val) ?? true;
        }

        const result = [
            ()=> {
                let bool = true;
                ['email', 'mobilephone', 'address', 'fullname'].forEach(selector=>{
                    const selected = $(`input#${selector}`);
                    if(selected.length === 0) return;
                    let value = selected.val();
                    if(typeof value !== "string") return;
                    value = value.trim();
                    if(value.length === 0) return;

                    if(!validator(selector, value)) {
                        MessagePrinter(selector, value);
                        bool &= false;
                        return;
                    }
                    current.data[selector] = value;
                });

                if((current.data.email !== undefined || current.data.mobilephone !== undefined)) {
                    bool &= (current.data.email !== undefined || current.data.mobilephone !== undefined);
                } else {
                    MessagePrinter('missing');
                    return false;
                }

                return bool;
            },
            ()=>{
                return true;
            },
            ()=>{
                return true;
            },
            ()=>{
                return true;
            }
        ][current.step];

        if(typeof result === 'function') {
            return result();
        }

        return false;
    }


    stepper.addEventListener('show.bs-stepper', function (event) {
        if(current.step < 0 || current.step > 3) throw new Error('Invalid step');

        if(validateStep()) {
            current.step = event.detail.indexStep;
            return;
        }

        event.preventDefault();
    });

    (()=>{
        if(window.transporter.pid) {
            $('#placename').text(window.transporter.pid._source.name);
            $('#placedescription').text(window.transporter.pid._source.name);
            $('#placeaddrees').val(window.transporter.pid._source.address.shortAddress);
        }
    })();
});