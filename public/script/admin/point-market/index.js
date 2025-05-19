class PointMarketManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEditButtons();
    this.bindDeleteButtons();
  }

  bindEditButtons() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = button.getAttribute('data-id');
        window.location.href = `/admin/point_market/edit/${id}`;
      });
    });
  }

  bindDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = button.getAttribute('data-id');
        if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
          this.deleteItem(id, button);
        }
      });
    });
  }

  deleteItem(id, button) {
    console.log('Silme isteği gönderiliyor:', id);
    fetch(`/admin/point_market/delete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Silinemedi');
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          button.closest('tr').remove();
          alert('Silme başarılı');
        } else {
          alert('Silme başarısız');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Bir hata oluştu');
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PointMarketManager();
});
