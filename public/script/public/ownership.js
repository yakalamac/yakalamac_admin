/**
 * Ownership Form Management System
 * Modular and maintainable stepper form implementation
 * with UI enhancements, adapted for auto code sending by backend.
 */

class OwnershipFormManager {
  constructor() {
    this.stepper = null;
    this.stepperInstance = null;
    this.currentStep = 0;
    this.isProcessing = false;
    this.lastRequestTime = 0;
    this.requestCooldown = 3000;

    this.formData = {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      mobilePhone: '',
      placeId: null,
      appoinmentKey: null,
      verificationStatus: {
        mobile: {
          validated: false,
          code: null,
          lastSent: 0,
          autoSentAttempted: false,
        },
        email: {
          validated: false,
          code: null,
          lastSent: 0,
          autoSentAttempted: false,
        },
      },
    };

    this.validators = new FormValidators();
    this.uiManager = new UIManager();
    this.apiClient = new APIClient();

    this.init();
  }

  init() {
    if (!this.validateDependencies()) {
      this.uiManager.showError(
        'Sayfa düzgün yüklenemedi. Lütfen geliştirici konsolunu kontrol edin.',
      );
      return;
    }

    this.stepper = document.querySelector('#ownershipstepper');
    if (!this.stepper) {
      console.error('Stepper element (#ownershipstepper) bulunamadı.');
      this.uiManager.showError('Form yüklenirken bir sorun oluştu.');
      return;
    }

    this.setupStepper();
    this.bindEvents();
    this.loadInitialData();
    this.uiManager.showLoadingOverlay(false);
    this.updateStepUI(this.currentStep);
    this.uiManager.updateProgressIndicator(
      this.currentStep,
      this.stepperInstance,
    );
  }

  validateDependencies() {
    const dependencies = {
      Stepper: typeof Stepper !== 'undefined',
      jQuery: typeof jQuery !== 'undefined',
      toastr: typeof toastr !== 'undefined',
    };
    let allGood = true;
    for (const depName in dependencies) {
      if (!dependencies[depName] && depName !== 'toastr') {
        console.error(`Eksik bağımlılık: ${depName}`);
        allGood = false;
      }
    }
    return allGood;
  }

  setupStepper() {
    this.stepperInstance = new Stepper(this.stepper, {
      linear: false,
      animation: true,
    });

    this.stepper.addEventListener('show.bs-stepper', (event) => {
      this.currentStep = event.detail.indexStep;
      this.updateStepUI(this.currentStep);
      this.uiManager.updateProgressIndicator(
        this.currentStep,
        this.stepperInstance,
      );
    });
  }

  bindEvents() {
    $(document).on(
      'input',
      '#firstName, #lastName, #address, #email, #mobilephone',
      this.debounce(this.handleInputChange.bind(this), 500),
    );
    $(document).on(
      'click',
      '[data-verification-sender]',
      this.handleVerificationSend.bind(this),
    );
    $(document).on(
      'click',
      '[data-verification-check]',
      this.handleVerificationCheck.bind(this),
    );
    $(document).on(
      'click',
      '[data-step-action]',
      this.handleStepAction.bind(this),
    );

    $('#inputmobile, #inputemail').on('input', function () {
      const type = $(this).attr('id') === 'inputmobile' ? 'mobile' : 'email';
      const $checkButton = $(`[data-verification-check="${type}"]`);
      $checkButton.prop('disabled', $(this).val().trim().length !== 6);
    });
  }

  handleInputChange(event) {
    const fieldId = event.target.id;
    let value = event.target.value;
    let formDataKey = fieldId;

    if (fieldId === 'mobilephone') {
      value = value.replace(/[^0-9]/g, '');
      formDataKey = 'mobilePhone';
    } else if (fieldId === 'email') {
      value = value.trim();
    }

    this.formData[formDataKey] = value;
    this.validateField(fieldId, value);

    if (formDataKey === 'mobilePhone') {
      if (
        this.formData.verificationStatus.mobile.validated ||
        this.formData.verificationStatus.mobile.autoSentAttempted
      ) {
        this.formData.verificationStatus.mobile.validated = false;
        this.formData.verificationStatus.mobile.autoSentAttempted = false;
        this.formData.verificationStatus.mobile.code = null;
        this.uiManager.updateMobileStepView(
          value,
          false,
          this.validators.isValidMobile(value),
          false,
        );
      }
    } else if (formDataKey === 'email') {
      if (
        this.formData.verificationStatus.email.validated ||
        this.formData.verificationStatus.email.autoSentAttempted
      ) {
        this.formData.verificationStatus.email.validated = false;
        this.formData.verificationStatus.email.autoSentAttempted = false;
        this.formData.verificationStatus.email.code = null;
        this.uiManager.updateEmailStepView(
          value,
          false,
          this.validators.isValidEmail(value),
          false,
        );
      }
    }
  }

  async handleStepAction(event) {
    const button = event.currentTarget;
    const action = $(button).data('step-action');

    if (this.isProcessing) return;

    if (action === 'next') {
      this.isProcessing = true;
      const defaultButtonHtml =
        $(button).find('.button-text-main').html() ||
        "İlerle <i class='bx bx-right-arrow-alt ms-1'></i>";
      this.uiManager.setButtonLoadingState(button, true, 'Kontrol ediliyor...');
      this.uiManager.showLoadingOverlay(true);

      const isValid = await this.validateStep(this.currentStep);
      if (isValid) {
        const stepActionResult = await this.executeStepActions(
          this.currentStep,
        );
        if (stepActionResult) {
          this.stepperInstance.next();
        }
      }
      this.isProcessing = false;
      this.uiManager.setButtonLoadingState(
        button,
        false,
        '',
        defaultButtonHtml,
      );
      this.uiManager.showLoadingOverlay(false);
    } else if (action === 'previous') {
      this.stepperInstance.previous();
    }
  }

  async validateStep(stepIndex) {
    this.uiManager.clearAllFieldErrors();
    let isValid = false;
    switch (stepIndex) {
      case 0:
        isValid = this.validatePersonalInfo();
        break;
      case 1:
        isValid = this.validateMobileVerification();
        break;
      case 2:
        isValid = this.validateEmailVerification();
        break;
      case 3:
        isValid = true;
        break; 
      default:
        isValid = true;
    }
    return isValid;
  }

  validatePersonalInfo() {
    const { firstName, lastName, address, email, mobilePhone } = this.formData;
    let isValid = true;

    if (!this.validators.isValidName(firstName)) {
      this.uiManager.showFieldError(
        'firstName',
        'Lütfen geçerli bir isim giriniz (en az 2 karakter).',
      );
      isValid = false;
    }
    if (!this.validators.isValidName(lastName)) {
      this.uiManager.showFieldError(
        'lastName',
        'Lütfen geçerli bir soyisim giriniz (en az 2 karakter).',
      );
      isValid = false;
    }
    if (!this.validators.isValidAddress(address)) {
      this.uiManager.showFieldError(
        'address',
        'Lütfen geçerli bir adres giriniz (en az 10 karakter).',
      );
      isValid = false;
    }

    const isEmailEntered = !!email;
    const isMobileEntered = !!mobilePhone;
    const isEmailValidIfEntered = isEmailEntered
      ? this.validators.isValidEmail(email)
      : true;
    const isMobileValidIfEntered = isMobileEntered
      ? this.validators.isValidMobile(mobilePhone)
      : true;

    if (!isEmailEntered && !isMobileEntered) {
      this.uiManager.showFieldError(
        'email',
        'E-posta adresinizi girmelisiniz.',
      );
      this.uiManager.showFieldError(
        'mobilephone',
        'Telefon numaranızı girmelisiniz.',
      );
      isValid = false;
    } else {
      if (isEmailEntered && !isEmailValidIfEntered) {
        this.uiManager.showFieldError(
          'email',
          'Lütfen geçerli bir e-posta adresi giriniz.',
        );
        isValid = false;
      }
      if (isMobileEntered && !isMobileValidIfEntered) {
        this.uiManager.showFieldError(
          'mobilephone',
          'Lütfen geçerli bir telefon numarası giriniz (örn: 5XXXXXXXXX).',
        );
        isValid = false;
      }
    }
    return isValid;
  }

  validateMobileVerification() {
    if (
      !this.formData.mobilePhone ||
      !this.validators.isValidMobile(this.formData.mobilePhone)
    ) {
      return true;
    }
    if (!this.formData.verificationStatus.mobile.validated) {
      this.uiManager.showWarning('Lütfen telefon numaranızı doğrulayın.');
      $('#inputmobile').focus();
      return false;
    }
    return true;
  }

  validateEmailVerification() {
    if (
      !this.formData.email ||
      !this.validators.isValidEmail(this.formData.email)
    ) {
      return true;
    }
    if (!this.formData.verificationStatus.email.validated) {
      this.uiManager.showWarning('Lütfen e-posta adresinizi doğrulayın.');
      $('#inputemail').focus();
      return false;
    }
    return true;
  }

  async executeStepActions(stepIndex) {
    if (stepIndex === 0) {
      if (
        this.formData.appoinmentKey &&
        this.formData.verificationStatus.mobile.autoSentAttempted &&
        this.formData.verificationStatus.email.autoSentAttempted
      ) {
        let shouldSkipStartApp = true;
        if (
          this.formData.mobilePhone &&
          this.validators.isValidMobile(this.formData.mobilePhone) &&
          !this.formData.verificationStatus.mobile.autoSentAttempted
        )
          shouldSkipStartApp = false;
        if (
          this.formData.email &&
          this.validators.isValidEmail(this.formData.email) &&
          !this.formData.verificationStatus.email.autoSentAttempted
        )
          shouldSkipStartApp = false;
        if (shouldSkipStartApp && this.formData.appoinmentKey) return true;
      }

      const success = await this.startApplication();
      if (success) {
        if (
          this.formData.mobilePhone &&
          this.validators.isValidMobile(this.formData.mobilePhone)
        ) {
          this.formData.verificationStatus.mobile.autoSentAttempted = true;
        } else {
          this.formData.verificationStatus.mobile.autoSentAttempted = false; 
        }
        if (
          this.formData.email &&
          this.validators.isValidEmail(this.formData.email)
        ) {
          this.formData.verificationStatus.email.autoSentAttempted = true;
        } else {
          this.formData.verificationStatus.email.autoSentAttempted = false; 
        }
      }
      return success;
    }
    return true;
  }

  async startApplication() {
    if (!this.formData.placeId) {
      this.uiManager.showError(
        'İşletme bilgisi yüklenemedi. Lütfen sayfayı yenileyin.',
      );
      return false;
    }
    try {
      const payload = {
        customer: {
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          address: this.formData.address,
          email: this.formData.email,
          mobilePhone: this.formData.mobilePhone,
        },
        integration: {
          identifier: this.formData.placeId,
          type: 'yakala', 
        },
      };
      const response = await this.apiClient.startOwnership(payload);
      if (response && response.appoinmentKey) {
        this.formData.appoinmentKey = response.appoinmentKey;
        this.uiManager.showSuccess(
          'Başvuru başarıyla başlatıldı. Doğrulama kodları gönderilmiş olabilir.',
        );
        return true;
      }
      this.uiManager.showError(
        response.message || 'Başvuru başlatılırken bilinmeyen bir hata oluştu.',
      );
      return false;
    } catch (error) {
      this.uiManager.showError('Başvuru başlatılamadı: ' + error.message);
      return false;
    }
  }

  async handleVerificationSend(event) {
    const button = event.currentTarget;
    const type = $(button).data('verification-sender'); 

    if (this.isProcessing) return;

    const now = Date.now();
    if (
      now - this.formData.verificationStatus[type].lastSent <
      this.requestCooldown
    ) {
      this.uiManager.showWarning(
        `Çok sık kod gönderme talebinde bulunuyorsunuz. Lütfen ${Math.ceil(
          (this.requestCooldown -
            (now - this.formData.verificationStatus[type].lastSent)) /
            1000,
        )} saniye sonra tekrar deneyin.`,
      );
      return;
    }

    const value =
      type === 'mobile' ? this.formData.mobilePhone : this.formData.email;

    if (!value) {
      this.uiManager.showWarning(
        type === 'mobile'
          ? 'Lütfen önce telefon numaranızı girin.'
          : 'Lütfen önce e-posta adresinizi girin.',
      );
      return;
    }
    if (
      (type === 'mobile' && !this.validators.isValidMobile(value)) ||
      (type === 'email' && !this.validators.isValidEmail(value))
    ) {
      this.uiManager.showFieldError(
        type === 'mobile' ? 'mobilephone' : 'email',
        `Lütfen geçerli bir ${
          type === 'mobile' ? 'telefon numarası' : 'e-posta adresi'
        } giriniz.`,
      );
      return;
    }

    // If autoSentAttempted is true, this is a "Resend" request.
    // Since there is no separate "resend" endpoint on the backend,
    // we will remind the user that the code has already been sent and ask them to check their spam folder.
    if (this.formData.verificationStatus[type].autoSentAttempted) {
      this.uiManager.showInfo(
        `Doğrulama kodunuz Adım 1'de <strong>${value}</strong> adresine/numarasına gönderilmişti. Lütfen gelen kutunuzu/mesajlarınızı ve spam klasörünüzü kontrol edin. Kodun ulaşması birkaç dakika sürebilir. (Not: Gerçek bir "tekrar gönder" işlemi şu anda yapılamamaktadır.)`,
      );
      this.formData.verificationStatus[type].lastSent = Date.now(); 
      $(button).prop('disabled', true);
      setTimeout(() => {
        if (!this.formData.verificationStatus[type].validated) {
          $(button).prop('disabled', false);
        }
      }, this.requestCooldown);
      return; 
    }

    this.uiManager.showError(
      'Beklenmedik bir durum oluştu. Kod gönderme işlemi yapılamıyor. (Hata Kodu: HVS-NAS)',
    );
    return;

    /* Önceki API Çağrı Mantığı (Backend'de /ownership/send-verification varsa kullanılabilir)
        this.isProcessing = true;
        const originalButtonHtml = $(button).data('default-text') || $(button).find('.button-text-main').html();
        this.uiManager.setButtonLoadingState(button, true, 'Gönderiliyor...');
        this.uiManager.showLoadingOverlay(true);

        try {
            const payload = { type: type, appoinmentKey: this.formData.appoinmentKey };
            payload[type] = value;

            await this.apiClient.sendVerificationCode(payload); // Bu endpoint PHP'de yok!
            this.formData.verificationStatus[type].lastSent = Date.now();
            this.uiManager.showSuccess('Doğrulama kodu başarıyla gönderildi.');
            this.uiManager.enableVerificationInput(type);
            $(button).prop('disabled', true); 
            setTimeout(() => {
                 if (!this.formData.verificationStatus[type].validated) {
                    $(button).prop('disabled', false);
                    const resendText = '<i class="bx bx-redo me-1"></i> Kodu Tekrar Gönder';
                    this.uiManager.setButtonLoadingState(button, false, '', resendText);
                    $(button).removeClass('btn-success').addClass('btn-info');
                 }
            }, this.requestCooldown);
        } catch (error) {
            this.uiManager.showError('Doğrulama kodu gönderilemedi: ' + error.message);
            this.uiManager.setButtonLoadingState(button, false, '', originalButtonHtml);
        } finally {
            this.isProcessing = false;
            this.uiManager.showLoadingOverlay(false);
        }
        */
  }

  async handleVerificationCheck(event) {
    const button = event.currentTarget;
    const type = $(button).data('verification-check');

    if (this.isProcessing) return;

    const code = $(`#input${type}`).val().trim();
    const value =
      type === 'mobile' ? this.formData.mobilePhone : this.formData.email;

    if (!this.validators.isValidVerificationCode(code)) {
      this.uiManager.showError(
        'Lütfen 6 haneli geçerli bir doğrulama kodu giriniz.',
      );
      $(`#input${type}`).focus();
      return;
    }

    this.isProcessing = true;
    const originalButtonHtml =
      $(button).data('default-text') ||
      $(button).find('.button-text-main').html();
    this.uiManager.setButtonLoadingState(button, true, 'Doğrulanıyor...');
    this.uiManager.showLoadingOverlay(true);

    try {
      const payload = {
        type: type,
        verificationCode: code,
        appoinmentKey: this.formData.appoinmentKey, 
      };
      // On the PHP side, in addition to `type` and `verificationCode`, it may also expect a `mobile` or `email` key.
      // According to the API documentation, the line payload[type] = value; may be added or removed.
      // The current PHP controller uses `data['verificationCode']` and `data['type']`,
      // and does not use something like `$data[$data['type']]`. Therefore, the line below may be unnecessary.
      // payload[type] = value;

      await this.apiClient.verifyCode(payload);
      this.formData.verificationStatus[type].validated = true;
      this.formData.verificationStatus[type].code = code;
      this.uiManager.showSuccess(
        `${
          type === 'mobile' ? 'Telefon numarası' : 'E-posta adresi'
        } başarıyla doğrulandı.`,
      );
      this.uiManager.markAsVerified(type);
    } catch (error) {
      this.uiManager.showError('Doğrulama başarısız: ' + error.message);
      this.uiManager.setButtonLoadingState(
        button,
        false,
        '',
        originalButtonHtml,
      );
      $(`#input${type}`).focus();
    } finally {
      this.isProcessing = false;
      this.uiManager.showLoadingOverlay(false);
    }
  }

  updateStepUI(stepIndex) {
    if (stepIndex === 1) {
      this.uiManager.updateMobileStepView(
        this.formData.mobilePhone,
        this.formData.verificationStatus.mobile.validated,
        this.validators.isValidMobile(this.formData.mobilePhone),
        this.formData.verificationStatus.mobile.autoSentAttempted,
      );
    } else if (stepIndex === 2) {
      this.uiManager.updateEmailStepView(
        this.formData.email,
        this.formData.verificationStatus.email.validated,
        this.validators.isValidEmail(this.formData.email),
        this.formData.verificationStatus.email.autoSentAttempted,
      );
    }
  }

  loadInitialData() {
    if (
      window.transporter &&
      window.transporter.pid &&
      window.transporter.pid._source
    ) {
      const place = window.transporter.pid._source;
      $('#placename').text(place.name || 'İşletme Adı Yüklenemedi');
      $('#placedescription').text(place.name || ''); 
      this.formData.placeId = place.id;
      if (place.address && place.address.shortAddress) {
        $('#address').val(place.address.shortAddress);
        this.formData.address = place.address.shortAddress;
      }
    } else {
      $('#placename').text('İşletme Bilgisi Bulunamadı');
      $('#placedescription').text(
        'Lütfen sayfayı yenileyin veya bir işletme seçin.',
      );
      this.uiManager.showError(
        'İşletme bilgileri yüklenirken bir sorun oluştu.',
      );
    }
  }

  validateField(fieldId, value) {
    this.uiManager.clearFieldError(fieldId);
    let isValid = true;
    let errorMessage = '';
    switch (fieldId) {
      case 'firstName':
        isValid = this.validators.isValidName(value);
        errorMessage = 'Lütfen geçerli bir isim giriniz.';
        break;
      case 'lastName':
        isValid = this.validators.isValidName(value);
        errorMessage = 'Lütfen geçerli bir soyisim giriniz.';
        break;
      case 'address':
        isValid = this.validators.isValidAddress(value);
        errorMessage = 'Lütfen geçerli bir adres giriniz.';
        break;
      case 'email':
        isValid = !value || this.validators.isValidEmail(value); 
        errorMessage = 'Lütfen geçerli bir e-posta adresi giriniz.';
        break;
      case 'mobilephone': 
        isValid = !value || this.validators.isValidMobile(value);
        errorMessage =
          'Lütfen geçerli bir telefon numarası giriniz (örn: 5XXXXXXXXX).';
        break;
    }
    if (!isValid && value) {
      this.uiManager.showFieldError(fieldId, errorMessage);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

class FormValidators {
  isValidEmail(email) {
    if (!email) return false; 
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
  }
  isValidMobile(mobile) {
    if (!mobile) return false;
    const cleaned = mobile.replace(/[\s\(\)\-]/g, '');
    const regex = /^(0?5\d{9})$|^(\+?905\d{9})$/;
    return regex.test(cleaned);
  }
  isValidName(name) {
    return (
      name &&
      name.trim().length >= 2 &&
      /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/.test(name.trim())
    );
  }
  isValidAddress(address) {
    return address && address.trim().length >= 10;
  }
  isValidVerificationCode(code) {
    return code && /^[0-9]{6}$/.test(code.trim());
  }
}

class UIManager {
  constructor() {
    if (window.toastr) {
      toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        timeOut: '5000',
        extendedTimeOut: '1000',
      };
    }
  }

  showLoadingOverlay(show) {
    $('body').toggleClass('loading', show);
  }

  setButtonLoadingState(
    buttonElement,
    isLoading,
    loadingText = 'İşleniyor...',
    defaultHtmlContent = null,
  ) {
    const $button = $(buttonElement);
    const $spinner = $button.find('.spinner-border');
    const $buttonTextSpan = $button.find('.button-text-main');

    if (isLoading) {
      $button.addClass('button-loading').prop('disabled', true);
      if ($spinner.length) $spinner.css('display', 'inline-block');
    } else {
      $button.removeClass('button-loading').prop('disabled', false);
      if ($spinner.length) $spinner.css('display', 'none');
      if (defaultHtmlContent && $buttonTextSpan.length) {
        $buttonTextSpan.html(defaultHtmlContent);
      } else if ($buttonTextSpan.length && $button.data('default-text')) {
        $buttonTextSpan.html($button.data('default-text'));
      }
    }
  }

  showSuccess(message) {
    if (window.toastr) toastr.success(message);
    else console.log('SUCCESS: ' + message);
  }
  showError(message) {
    if (window.toastr) toastr.error(message);
    else console.error('ERROR: ' + message);
  }
  showWarning(message) {
    if (window.toastr) toastr.warning(message);
    else console.warn('WARNING: ' + message);
  }
  showInfo(message) {
    if (window.toastr)
      toastr.info(message, null, { timeOut: 7000, extendedTimeOut: 2000 });
    else console.info('INFO: ' + message);
  }

  showFieldError(fieldId, message) {
    const $field = $(`#${fieldId}`);
    $field.addClass('is-invalid');
    let $errorDiv = $field.next('.invalid-feedback');
    if ($errorDiv.length === 0) {
      $errorDiv = $('<div class="invalid-feedback"></div>');
      $field.after($errorDiv);
    }
    $errorDiv.text(message).show();
  }

  clearFieldError(fieldId) {
    const $field = $(`#${fieldId}`);
    $field.removeClass('is-invalid is-valid'); 
    $field.next('.invalid-feedback').hide().text('');
  }

  clearAllFieldErrors() {
    $('.form-control').removeClass('is-invalid is-valid');
    $('.invalid-feedback').hide().text('');
  }

  enableVerificationInput(type) {
    const $input = $(`#input${type}`);
    const $checkButton = $(`[data-verification-check="${type}"]`);
    $input.prop('disabled', false).val('').focus();
    $checkButton.prop('disabled', $input.val().trim().length !== 6);
  }

  markAsVerified(type) {
    const $senderButton = $(`[data-verification-sender="${type}"]`);
    const $checkButton = $(`[data-verification-check="${type}"]`);
    const $inputField = $(`#input${type}`);
    const verifiedIconHtml = `<i class='bx bx-check-circle me-1'></i> Doğrulandı`;

    this.setButtonLoadingState($senderButton, false, '', verifiedIconHtml);
    $senderButton
      .removeClass('btn-success btn-primary btn-info')
      .addClass('btn-outline-success text-success')
      .prop('disabled', true);

    this.setButtonLoadingState($checkButton, false, '', verifiedIconHtml);
    $checkButton
      .removeClass('btn-primary btn-info')
      .addClass('btn-outline-success text-success')
      .prop('disabled', true);

    $inputField
      .prop('disabled', true)
      .addClass('is-valid')
      .removeClass('is-invalid');
    this.clearFieldError(`input${type}`);

    if (type === 'mobile') {
      $('#step2-subtitle').html(
        'Telefon doğrulandı <i class="bx bx-check-circle text-success"></i>',
      );
    } else if (type === 'email') {
      $('#step3-subtitle').html(
        'E-posta doğrulandı <i class="bx bx-check-circle text-success"></i>',
      );
    }
  }

  updateProgressIndicator(currentStepIndex, stepperInstance) {
    $('.bs-stepper-header .step').each(function (index) {
      $(this).toggleClass('completed', index < currentStepIndex);
    });
  }

  updateMobileStepView(
    mobilePhoneValue,
    isMobileValidated,
    isMobileValidFormat,
    autoSentAttempted,
  ) {
    const $section = $('#mobile-verification-section');
    const $skipMessage = $('#skip-mobile-message');
    const $sendButton = $('[data-verification-sender="mobile"]');
    const $checkButton = $('[data-verification-check="mobile"]');
    const $inputMobile = $('#inputmobile');
    const $stepTitle = $('#step2-title');
    const $stepSubtitle = $('#step2-subtitle');
    const $infoParagraph = $section.find('p.text-muted').first();

    const initialSendButtonHtml = '<i class="bx bx-send me-1"></i> Kod Gönder';
    const resendButtonHtml =
      '<i class="bx bx-redo me-1"></i> Kodu Tekrar Gönder';
    const initialCheckButtonHtml = '<i class="bx bx-check me-1"></i> Doğrula';

    $sendButton.data('default-text', initialSendButtonHtml);
    $checkButton.data('default-text', initialCheckButtonHtml);

    if (mobilePhoneValue && isMobileValidFormat) {
      $section.removeClass('d-none');
      $skipMessage.addClass('d-none');
      $infoParagraph.find('#mobile-to-verify').text(mobilePhoneValue);
      $stepTitle.text('Telefon Doğrulama');
      $stepSubtitle.text(mobilePhoneValue);

      if (isMobileValidated) {
        this.markAsVerified('mobile');
      } else {
        this.enableVerificationInput('mobile');
        // $inputMobile.prop('disabled', false); // already handled in enableVerificationInput
        // $checkButton.prop('disabled', $inputMobile.val().trim().length !== 6); // already handled in enableVerificationInput
        this.setButtonLoadingState(
          $checkButton,
          false,
          '',
          initialCheckButtonHtml,
        );
        $checkButton
          .removeClass('btn-outline-success text-success btn-info')
          .addClass('btn-primary');

        if (autoSentAttempted) {
          $infoParagraph.html(
            `<strong>${mobilePhoneValue}</strong> numaralı telefonunuza Adım 1'i tamamlarken bir doğrulama kodu gönderilmiş olmalı. Lütfen aşağıdaki alana girin. Kodu almadıysanız veya yeni bir kod istiyorsanız <strong class="text-primary">"Kodu Tekrar Gönder"</strong> butonunu kullanabilirsiniz.`,
          );
          this.setButtonLoadingState($sendButton, false, '', resendButtonHtml);
          $sendButton
            .prop('disabled', false)
            .removeClass('btn-success btn-outline-success text-success')
            .addClass('btn-info'); 
        } else {
          $infoParagraph.html(
            `<span id="mobile-to-verify">${mobilePhoneValue}</span> numaralı telefona bir doğrulama kodu göndermek için aşağıdaki butonu kullanın.`,
          );
          this.setButtonLoadingState(
            $sendButton,
            false,
            '',
            initialSendButtonHtml,
          );
          $sendButton
            .prop('disabled', false)
            .removeClass('btn-info btn-outline-success text-success')
            .addClass('btn-success'); 
        }
        $inputMobile.val(''); 
        this.clearFieldError('inputmobile');
      }
    } else {
      $section.addClass('d-none');
      $skipMessage.removeClass('d-none');
      $stepTitle.text('Telefon Doğrulaması (Atlandı)');
      $stepSubtitle.text(
        mobilePhoneValue
          ? 'Geçersiz telefon numarası'
          : 'Telefon numarası girilmedi',
      );

      this.setButtonLoadingState($sendButton, false, '', initialSendButtonHtml);
      $sendButton.prop('disabled', true);
      $inputMobile.prop('disabled', true).val('');
      this.setButtonLoadingState(
        $checkButton,
        false,
        '',
        initialCheckButtonHtml,
      );
      $checkButton.prop('disabled', true);
      this.clearFieldError('inputmobile');
    }
  }

  updateEmailStepView(
    emailValue,
    isEmailValidated,
    isEmailValidFormat,
    autoSentAttempted,
  ) {
    const $section = $('#email-verification-section');
    const $skipMessage = $('#skip-email-message');
    const $sendButton = $('[data-verification-sender="email"]');
    const $checkButton = $('[data-verification-check="email"]');
    const $inputEmail = $('#inputemail');
    const $stepTitle = $('#step3-title');
    const $stepSubtitle = $('#step3-subtitle');
    const $infoParagraph = $section.find('p.text-muted').first();

    const initialSendButtonHtml = '<i class="bx bx-send me-1"></i> Kod Gönder';
    const resendButtonHtml =
      '<i class="bx bx-redo me-1"></i> Kodu Tekrar Gönder';
    const initialCheckButtonHtml = '<i class="bx bx-check me-1"></i> Doğrula';

    $sendButton.data('default-text', initialSendButtonHtml);
    $checkButton.data('default-text', initialCheckButtonHtml);

    if (emailValue && isEmailValidFormat) {
      $section.removeClass('d-none');
      $skipMessage.addClass('d-none');
      $infoParagraph.find('#email-to-verify').text(emailValue);
      $stepTitle.text('E-posta Doğrulama');
      $stepSubtitle.text(emailValue);

      if (isEmailValidated) {
        this.markAsVerified('email');
      } else {
        this.enableVerificationInput('email');
        // $inputEmail.prop('disabled', false);
        // $checkButton.prop('disabled', $inputEmail.val().trim().length !== 6);
        this.setButtonLoadingState(
          $checkButton,
          false,
          '',
          initialCheckButtonHtml,
        );
        $checkButton
          .removeClass('btn-outline-success text-success btn-info')
          .addClass('btn-primary');

        if (autoSentAttempted) {
          $infoParagraph.html(
            `<strong>${emailValue}</strong> e-posta adresinize Adım 1'i tamamlarken bir doğrulama kodu gönderilmiş olmalı. Lütfen aşağıdaki alana girin. Kodu almadıysanız veya yeni bir kod istiyorsanız <strong class="text-primary">"Kodu Tekrar Gönder"</strong> butonunu kullanabilirsiniz.`,
          );
          this.setButtonLoadingState($sendButton, false, '', resendButtonHtml);
          $sendButton
            .prop('disabled', false)
            .removeClass('btn-success btn-outline-success text-success')
            .addClass('btn-info');
        } else {
          $infoParagraph.html(
            `<span id="email-to-verify">${emailValue}</span> e-posta adresine bir doğrulama kodu göndermek için aşağıdaki butonu kullanın.`,
          );
          this.setButtonLoadingState(
            $sendButton,
            false,
            '',
            initialSendButtonHtml,
          );
          $sendButton
            .prop('disabled', false)
            .removeClass('btn-info btn-outline-success text-success')
            .addClass('btn-success');
        }
        $inputEmail.val('');
        this.clearFieldError('inputemail');
      }
    } else {
      $section.addClass('d-none');
      $skipMessage.removeClass('d-none');
      $stepTitle.text('E-posta Doğrulaması (Atlandı)');
      $stepSubtitle.text(
        emailValue ? 'Geçersiz e-posta adresi' : 'E-posta adresi girilmedi',
      );

      this.setButtonLoadingState($sendButton, false, '', initialSendButtonHtml);
      $sendButton.prop('disabled', true);
      $inputEmail.prop('disabled', true).val('');
      this.setButtonLoadingState(
        $checkButton,
        false,
        '',
        initialCheckButtonHtml,
      );
      $checkButton.prop('disabled', true);
      this.clearFieldError('inputemail');
    }
  }
}

class APIClient {
  constructor() {}
  async _fetch(url, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    options.headers = { ...defaultHeaders, ...options.headers };
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      if (!response.ok) {
        const errorMessage =
          responseData.message ||
          responseData.error ||
          `HTTP error ${response.status}`;
        throw new Error(errorMessage);
      }
      return responseData;
    } catch (error) {
      console.error('API Client Fetch Error:', error);
      throw new Error(
        error.message ||
          'Sunucuyla iletişim kurulamadı. Lütfen internet bağlantınızı kontrol edin.',
      );
    }
  }
  startOwnership(data) {
    return this._fetch('/ownership/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  sendVerificationCode(data) {
    // This endpoint does not exist in the PHP controller.
    // If there is no such endpoint on the backend, this call will fail.
    // This situation is attempted to be handled inside handleVerificationSend.
    console.warn(
      "APIClient.sendVerificationCode çağrıldı, ancak PHP controller'da /ownership/send-verification endpoint'i tanımlı değil.",
    );
    return this._fetch('/ownership/send-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  verifyCode(data) {
    return this._fetch('/ownership/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    window.ownershipForm = new OwnershipFormManager();
  } catch (error) {
    console.error('Ownership form initialization failed:', error);
    if (window.toastr) {
      toastr.error(
        'Sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya geliştirici konsolunu kontrol edin.',
      );
    } else {
      alert('Sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
  }
});
