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

    // Stepper instance
    stepper2 = new Stepper(stepper, {linear: false});

    // Step validator, validates step and returns true if it is valid
    // On validation, shows error or warning messages and checks special cases like email and mobile phone verification
    function validateStep()
    {
        // Printer, shows custom error handler messages by key-value
        function MessagePrinter(selector, value) {
            const f = {
                email: ()=> {
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
                },
                warning: (val)=> {
                    if(window.toastr) {
                        toastr.warning(val);
                    }
                },
                error: (val)=> {
                    if(window.toastr) {
                        toastr.error(val);
                    }
                },
            };

            if(typeof  f[selector] === 'function') {
                f[selector](value);
            } else {
                if(window.toastr) {
                    toastr.error('Bilinmeyen bir hata oluştu, ' + value);
                }
            }
        }

        // Validator, checks if given value is valid for given selector
        // If no selector is given, returns true
        function validator(selector, val) {
            const f = {
                email: val => typeof val === 'string' && val.trim().length > 0 && /^([a-z])([a-z0-9_.]{1,31})@[a-z][a-z0-9]+\.[a-z]{2,}/.test(val),
                mobilephone: val => {
                    if(typeof val === 'string' && val.trim().length > 0) {
                        val = val.replaceAll(' ', '')
                            .replaceAll('(','')
                            .replaceAll(')','');

                      return /^\+?(00)?([1-9][0-9]{0,2})?[1-9][0-9]{9}$/.test(val);
                    }
                    return false;
                },
            }[selector];

            if(f === undefined) return true;

            return f(val);
        }

        // Validation map for each step
        const result = [
            ()=> {
                // Step 1 checks array-in fields
                let bool = true;
                ['email', 'mobilephone', 'address', 'firstName', 'lastName'].forEach(selector=>{
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

                    if(selector === 'mobilephone') {
                        current.data.mobilePhone = value;
                    }

                    current.data[selector] = value;
                });

                if(current.data.email !== undefined || current.data.mobilephone !== undefined) {
                    bool &= (current.data.email !== undefined || current.data.mobilephone !== undefined);
                } else {
                    MessagePrinter('missing');
                    return false;
                }

                return bool;
            },
            ()=> {
                if(typeof current.data.storage['step_1'] === 'object') {
                    if(current.data.storage['step_1'].validated) {
                        return $(`input#mobilephone`).val().trim() === current.data.storage['step_1'].mobile;
                    }
                }

                MessagePrinter('warning', 'Önce telefon numaranızı doğrulayın');

                return false;
            },
            ()=>{
                if(typeof current.data.storage['step_2'] === 'object') {
                    if(current.data.storage['step_2'].validated) {
                        return $(`input#email`).val().trim() === current.data.storage['step_2'].email;
                    }
                }

                MessagePrinter('warning', 'Önce e-posta adresinizi doğrulayın');

                return false;
            },
            ()=>{
                return true;
            }
        ][current.step];

        // If result exists, (has a validation), run it
        if(typeof result === 'function') {
            return result();
        }

        // If no validation, return false, no step exists
        return false;
    }

    // Step action container
    function makeActions() {
        const _map = {
            // Start appoinment
            '0' : ()=>{
              return fetch('/ownership/start', {
                  headers:{'Content-Type':'application/json'},
                  method:'POST',
                  body: JSON.stringify({
                      customer: current.data,
                      integration: {
                          identifier: current.data.storage.placeid,
                          type: 'yakala'
                      }
                  })
              }).then(async (response)=>{
                  const json = await response.json();
                  if(!response.ok) {
                      console.log(json);
                      return false;
                  }
                  if(json.hasOwnProperty('appoinmentKey') && typeof json.appoinmentKey === 'string') {
                      current.data.storage.key = json.appoinmentKey;
                      return true;
                  }
                  toastr.error('Başvuru başlagıncında bir hata olustu');
                  return false;
              }).catch(e=>{
                  console.log(e);
                  console.log(e.message);
                  return false;
              });
            },
        };

        if(_map[current.step] !== undefined) {
            return _map[current.step]();
        }
    }

    // On each step change update fields dynamically (Especially for email and mobile phone verifications)
    function updateNextStep() {
        // Update map with key-value functions
        const updates = {
          '1': ()=> {
              const step = $('[aria-labelledby="stepper2trigger2"]');
              const mobile = $('input#mobilephone').val().trim();
              const exists = mobile.length > 0;
              step.find('h5').text(exists ? mobile : 'Telefon doğrulaması mevcut değil.');
              step.find('p').text(exists ? 'Telefon numaranıza gelen 3 dakika geçerli doğrulama kodunu giriniz.' : 'Bu alanı doğrulama yapmadan geçiniz.');
              const button = step.find('button[data-verification-sender-button]');
              button.prop('disabled', !exists);
              button.text(exists ? 'Gönder' : 'Telefon bulunamadı');

              // todo
              // temporarily, if mobile phone exists, store validation data in storage to use in validation step method
              if(exists) {
                  if(typeof current.data.storage.step_1 === 'object' &&current.data.storage.step_1.validated && current.data.storage.step_1.mobile === mobile) {
                      button.prop('disabled', true);
                      button.text('Doğrulandı');
                      return;
                  }

                  current.data.storage['step_1'] = {
                      validated: false, mobile
                  };
              } else {
                  current.data.storage['step_1'] = undefined;
              }

          },
            '2': ()=>{
                const step = $('[aria-labelledby="stepper2trigger3"]');
                const email = $('input#email').val().trim();
                const exists = email.length > 0;
                step.find('h5').text(exists ? email : 'E-posta doğrulaması mevcut değil.');
                step.find('p').text(exists ? 'Posta kutunuza gelen 3 dakika geçerli doğrulama kodunu giriniz.' : 'Bu alanı doğrulama yapmadan geçiniz.');
                const button = step.find('button[data-verification-sender-button]');
                button.prop('disabled', !exists);
                button.text(exists ? 'Gönder' : 'E-posta bulunamadı');

                // todo
                // temporarily, if mobile phone exists, store validation data in storage to use in validation step method

                if(exists) {
                    if(typeof current.data.storage.step_2 === 'object' && current.data.storage.step_2.validated && current.data.storage.step_2.email === email) {
                        button.prop('disabled', true);
                        button.text('Doğrulandı');
                        return;
                    }

                    current.data.storage['step_2'] = {
                        validated: false, email
                    };
                } else {
                    current.data.storage['step_2'] = undefined;
                }
            }
        };
        // Check step has update
        if(updates[current.step] !== undefined) {
            // If it is, update by calling method
            updates[current.step]();
        }
    }

    let donotprevent = false;
    // On step change-show run custom event
    stepper.addEventListener('show.bs-stepper', async function (event) {
        // If step is lower than current step, or equal, do nothing
        if(event.detail.indexStep <= current.step) {
            return;
        }

        // If step self-triggered by programmatically, (in next line using stepper2.next() or stepper2.previous())
        // do not prevent step change
        if(donotprevent) {
            donotprevent = false;
            return;
        }

        // Prevent to step change
        event.preventDefault();

        // Validate step, if it is valid, run actions and update next step
        if(validateStep()) {
            // After validations make actions of step
            if((await makeActions()) === false) return;

            // Update current step
            current.step = event.detail.indexStep;

            // Update next step vals
            await updateNextStep();

            if(event.detail.from < event.detail.to) {
                stepper2.next();
                donotprevent = false;
            } else  {
                stepper2.previous();
            }
        }
    });

    // Fillers
    (()=>{
        if(window.transporter.pid) {
            $('#placename').text(window.transporter.pid._source.name);
            $('#placedescription').text(window.transporter.pid._source.name);
            $('#placeaddrees').val(window.transporter.pid._source.address.shortAddress);
            current.data.storage.placeid=window.transporter.pid._source.id;
        }
    })();



    // Verification sender button listeners
    $(document).on('click', '[data-verification-sender-button]', function (event) {
        event.preventDefault();
        switch ($(this).data('verification-sender-button')) {
            case 'mobile': {
                const val = $(`input#mobilephone`).val().trim();

                if(current.data.storage['step_1'] === undefined) {
                    current.data.storage['step_1'] = {
                        validated: false,
                        mobile: val
                    }
                }

                if(current.data.storage['step_1'].validated === true && current.data.storage.step_1.mobile === val) {
                    return;
                }

                current.data.storage['step_1'].validated = false;
                current.data.storage['step_1'].mobile = val;

                const value = $('input#inputmobile').val().trim();

                if(typeof value === 'string' && value.length === 6) {
                    $.ajax({
                        url: '/ownership/verify',
                        type: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({type: 'mobile', mobile: val, verificationCode: value}),
                        success: () => {
                            current.data.storage.step_1.validated = true;
                        },
                        error: (e) => {
                            //console.log(e);
                        },
                        failure: (e) =>{
                            //console.log(e);
                        }
                    });
                } else {
                    toastr.error('Geçerli bir doğrulama kodu giriniz');
                }
            } break;
            case 'email': {
                const val = $(`input#email`).val().trim();

                if(current.data.storage['step_2'] === undefined) {
                    current.data.storage['step_2'] = {
                        validated: false,
                        email: val
                    }
                }

                if(current.data.storage['step_2'].validated === true && current.data.storage.step_2.email === val) {
                    return;
                }

                current.data.storage['step_2'].validated = false;
                current.data.storage['step_2'].email = val;

                const value = $('input#inputemail').val().trim();

                if(typeof value === 'string' && value.length === 6) {
                    $.ajax({
                        url: '/ownership/verify',
                        type: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({type: 'email', email: val, verificationCode: value}),
                        success: () => {
                            current.data.storage.step_2.validated = true;
                        }
                    });
                } else {
                    toastr.error('Geçerli bir doğrulama kodu giriniz');
                }
            } break;
        }
        //console.log(current.data.storage)
    });
});