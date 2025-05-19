console.log('edit.js dosyası yüklendi');
document.addEventListener('DOMContentLoaded', () => {
  const id = window.location.pathname.split('/').pop(); 

  const saveButton = document.getElementById('button-save');
  console.log(' calşsıtı  saveButton');
  saveButton.addEventListener('click', async () => {
    const formData = new FormData();

    formData.append('name', document.getElementById('name').value);
        const price = parseInt(document.getElementById("price").value, 10);
        formData.append("price", price);
    formData.append('stock', document.getElementById('stock').value);
    formData.append('cycleDays', document.getElementById('cycleDays').value);
    formData.append('status', document.getElementById('status').value);
    formData.append('detail', document.getElementById('detail').value);
    formData.append('startAt', document.getElementById('startAt').value);
    formData.append('endAt', document.getElementById('endAt').value);

    const imageInput = document.getElementById('imageUpload');
    if (imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
    }

    try {
      const response = await fetch(`/admin/point_market/edit/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Bir hata oluştu');
      }

      const data = await response.json();
      showToast('Etkinlik başarıyla güncellendi!', 'success');
      window.location.href = data.redirect;
    } catch (error) {
      showToast('Hata: ' + error.message, 'danger');
    }
  });

  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 m-2 show`;
    toast.role = 'alert';
    toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
});
