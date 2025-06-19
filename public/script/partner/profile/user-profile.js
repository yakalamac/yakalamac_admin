function showMessage(containerId, message, isSuccess = false) {
  const messageDiv = document.getElementById(containerId);
  messageDiv.innerHTML = message;
  messageDiv.className = isSuccess ? 'message-success' : 'message-error';
  messageDiv.style.display = 'block'; 
  setTimeout(() => {
    messageDiv.style.display = 'none'; 
  }, 5000);
}

const verification = {
  phone: {
    token: null, 
    value: null, 
    container: 'phone-otp-container', 
    input: 'mobilePhone', 
    verifyUrl: '/partner/verification/verify/phone', 
    requestUrl: '/partner/change/number', 
    messageContainer: 'contactMessage', 
  },
  email: {
    token: null, 
    value: null, 
    container: 'email-otp-container', 
    input: 'email', 
    verifyUrl: '/partner/verification/verify/email', 
    requestUrl: '/partner/change/email', 
    messageContainer: 'contactMessage',
  },
};

async function sendPostRequest(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Bir hata oluştu.');
  }

  let text = await response.text();
  try {
    text = JSON.parse(text);
  } catch (error) {
    console.log(text);
  }
  return text;
}

async function changePassword(event) {
  event.preventDefault();

  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const newPasswordConfirm =
    document.getElementById('newPasswordConfirm').value;
  const messageContainerId = 'passwordMessage';

  if (!oldPassword || !newPassword || !newPasswordConfirm) {
    return showMessage(messageContainerId, 'Lütfen tüm alanları doldurun.');
  }

  if (newPassword !== newPasswordConfirm) {
    return showMessage(messageContainerId, 'Yeni şifreler eşleşmiyor.');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return showMessage(
      messageContainerId,
      'Şifre en az 8 karakter olmalı, en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.',
    );
  }

  try {
    await sendPostRequest('/partner/change/password', {
      oldPassword,
      newPassword,
      newPasswordConfirm,
    });
    showMessage(messageContainerId, 'Şifre başarıyla güncellendi.', true);
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newPasswordConfirm').value = '';
  } catch (error) {
    showMessage(messageContainerId, error.message);
    console.error('Şifre değiştirme hatası:', error);
  }
}

async function updateProfile(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const birthDate = document.getElementById('birthDate').value;
  const messageContainerId = 'profileMessage';

  if (!firstName || !lastName) {
    return showMessage(
      messageContainerId,
      'Ad ve Soyad alanları boş bırakılamaz.',
    );
  }

  try {
    await sendPostRequest('/partner/update/profile', {
      firstName,
      lastName,
      birthDate,
    });
    showMessage(
      messageContainerId,
      'Profil bilgileri başarıyla güncellendi.',
      true,
    );
  } catch (error) {
    showMessage(messageContainerId, error.message);
    console.error('Profil güncelleme hatası:', error);
  }
}

async function requestVerificationCode(type) {
  const inputElement = document.getElementById(verification[type].input);
  const value = inputElement.value;
  const messageContainerId = verification[type].messageContainer;

  if (!value) {
    return showMessage(
      messageContainerId,
      `Lütfen ${
        type === 'phone' ? 'telefon numarasını' : 'e-posta adresini'
      } girin.`,
    );
  }

  if (type === 'phone' && !/^[0-9]{10,15}$/.test(value)) {
    return showMessage(
      messageContainerId,
      'Lütfen geçerli bir telefon numarası girin.',
    );
  }

  if (
    type === 'email' &&
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  ) {
    return showMessage(
      messageContainerId,
      'Lütfen geçerli bir e-posta giriniz.',
    );
  }

  try {
    const payload =
      type === 'phone' ? { phoneNumber: value } : { email: value };
    const result = await sendPostRequest(
      verification[type].requestUrl,
      payload,
    );

    if (result.verificationToken) {
      verification[type].token = result.verificationToken;
      verification[type].value = value;
    } else {
      console.warn(`API'den ${type} için verificationToken gelmedi.`);
      showMessage(
        messageContainerId,
        'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.',
        false,
      );
      return; 
    }

    showMessage(
      messageContainerId,
      `${
        type === 'phone' ? 'Telefon numarasına' : 'E-posta adresine'
      } doğrulama kodu gönderildi.`,
      true,
    );
    showVerificationInput(type);
  } catch (error) {
    showMessage(messageContainerId, error.message);
    console.error(`${type} doğrulama kodu gönderme hatası:`, error);
  }
}

function showVerificationInput(type) {
  const otpContainer = document.getElementById(verification[type].container);

  if (otpContainer.querySelector(`#${type}-verification-code`)) {
    otpContainer.style.display = 'block';
    return;
  }

  otpContainer.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'd-flex gap-2 mt-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control';
  input.id = `${type}-verification-code`;
  input.placeholder = 'Doğrulama Kodu';
  input.autocomplete = 'one-time-code';

  const button = document.createElement('button');
  button.className = 'btn btn-secondary';
  button.type = 'button';
  button.textContent = 'Doğrula';
  button.onclick = () => verifyCode(type);

  wrapper.appendChild(input);
  wrapper.appendChild(button);
  otpContainer.appendChild(wrapper);

  otpContainer.style.display = 'block';
}

async function verifyCode(type) {
  const code = document.getElementById(`${type}-verification-code`).value;
  const messageContainerId = verification[type].messageContainer;

  if (!code) {
    return showMessage(messageContainerId, 'Lütfen doğrulama kodunu girin.');
  }

  const token = verification[type].token; 
  const value = verification[type].value; 

  if (!token || !value) {
    return showMessage(
      messageContainerId,
      'Doğrulama işlemi başlatılamadı veya token bulunamadı. Lütfen tekrar deneyin.',
    );
  }

  try {
    const payload = {
      code,
      verificationToken: token, 
      [type === 'phone' ? 'phoneNumber' : 'email']: value,
    };
    await sendPostRequest(verification[type].verifyUrl, payload);

    showMessage(
      messageContainerId,
      `${
        type === 'phone' ? 'Telefon numarası' : 'E-posta'
      } başarıyla doğrulandı.`,
      true,
    );
    document.getElementById(verification[type].container).style.display =
      'none'; 

  } catch (error) {
    showMessage(messageContainerId, error.message || 'Kod doğrulanamadı.');
    console.error('Kod doğrulama hatası:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('btnUpdatePassword')
    ?.addEventListener('click', changePassword);
  document
    .getElementById('btnUpdateProfile')
    ?.addEventListener('click', updateProfile);
  document
    .getElementById('btnUpdatePhone')
    ?.addEventListener('click', () => requestVerificationCode('phone'));
  document
    .getElementById('btnUpdateEmail')
    ?.addEventListener('click', () => requestVerificationCode('email'));
});

document
  .querySelector('form#profileForm')
  ?.addEventListener('submit', function (e) {
    e.preventDefault();
  });
