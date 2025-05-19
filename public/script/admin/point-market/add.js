document.addEventListener("DOMContentLoaded", function() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); 

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  document.getElementById('startAt').value = formatDate(today);

  document.getElementById('endAt').value = formatDate(tomorrow);
});

function getFormData() {
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const stock = parseInt(document.getElementById('stock').value);
  const status = document.getElementById('status').value.trim();
  const startAt = document.getElementById('startAt').value;
  const endAt = document.getElementById('endAt').value.trim();
  const detail = document.getElementById('detail').value.trim();
  const cycleDays = parseInt(document.getElementById('cycleDays').value);

  console.log('Form verileri:',  name, price, stock, status, startAt, endAt, detail, cycleDays);

  return {
    name: name,
    price: price || 0,
    stock: stock || 1,
    status: status,
    startAt: new Date(startAt).toISOString(),
    endAt: new Date(endAt).toISOString(),
    detail: detail,
    cycleDays: cycleDays || 0,
  };
}

async function sendFormDataToBackend(formData) {
  console.log('Form verileri:', formData);
  // if (!formData) {
  //   return; 
  // }

  try {
    const response = await fetch('/admin/point_market/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Bir hata oluştu!');
    }

    console.log('Başarılı yanıt:', result);

    if (result.redirect) {
      window.location.href = result.redirect;
    } else {
      showToast('success', 'Etkinlik başarıyla oluşturuldu!');
    }
  } catch (error) {
    console.error('İstek hatası:', error);
    showToast('danger', 'Bir hata oluştu: ' + error.message);
  }
}

function showToast(type, message) {
  const toastHTML = `
    <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
    `
  ;
  
  const toastContainer = document.getElementById('toast-container');
  toastContainer.innerHTML += toastHTML;

  const toastElement = toastContainer.lastElementChild;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

document.getElementById('button-save').addEventListener('click', async () => {
  const formData = await getFormData();
  sendFormDataToBackend(formData);
}); 