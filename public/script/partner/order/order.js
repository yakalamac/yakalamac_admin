document.addEventListener('DOMContentLoaded', () => {
  initializeOrderButtons();
  console.log('Order buttons initialized');
});

function initializeOrderButtons() {
  const acceptButtons = document.querySelectorAll('.accept-btn');
  const declineButtons = document.querySelectorAll('.reject-btn');

  acceptButtons.forEach((button) => {
    addClickListenerToButton(button, handleAcceptOrder);
  });

  declineButtons.forEach((button) => {
    addClickListenerToButton(button, handleDeclineOrder);
  });
}

function addClickListenerToButton(button, handler) {
  button.addEventListener('click', (event) => {
    const orderId = event.target.closest('button').dataset.id;
    const status = event.target.closest('button').dataset.status;

    console.log('Order ID:', orderId);
    console.log('Status:', status);

    const modalTitle = document.getElementById(`modalTitle-${orderId}`);
    const modalBody = document.getElementById(`modalBody-${orderId}`);
    const confirmBtn = document.getElementById(`modalConfirmBtn-${orderId}`);

    const isAccept = status === 'accepted';
    modalTitle.textContent = isAccept ? 'Siparişi Kabul Et' : 'Siparişi Reddet';
    modalBody.textContent = isAccept
      ? 'Bu siparişi kabul etmek istediğinize emin misiniz?'
      : 'Bu siparişi reddetmek istediğinize emin misiniz?';

    const modalEl = document.getElementById(`orderConfirmModal-${orderId}`);
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) modal = new bootstrap.Modal(modalEl);

    confirmBtn.onclick = async () => {
      try {
        await handler(orderId, status);

        document
          .getElementById(`acceptOrder-${orderId}`)
          ?.setAttribute('disabled', 'disabled');
        document
          .getElementById(`declineOrder-${orderId}`)
          ?.setAttribute('disabled', 'disabled');
      } catch (error) {
        //console.error('İşlem sırasında hata oluştu:', error);
      } finally {
        modal.hide();
      }
    };

    modal.show();
  });
}

async function handleAcceptOrder(orderId, status) {
  if (status === 'accepted') {
    await sendOrderRequest(orderId, status);
  }
}

async function handleDeclineOrder(orderId, status) {
  if (status === 'rejected') {
    await sendOrderRequest(orderId, status);
  }
}

async function sendOrderRequest(orderId, status) {
  try {
    const response = await fetch('/partner/order/update_order_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: orderId,
        status: status,
      }),
    });

    if (response.ok) {
      console.log('Order updated successfully');
      location.reload();
    } else {
      const errText = await response.text();
      console.error('Update failed:', errText);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
}

async function sendOrderUpdate(orderId, status) {
  try {
    await sendOrderRequest(orderId, status);
    //location.reload();
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

function handleUpdateClick() {
  const orderId = document.getElementById('orderId')?.textContent;
  const selectedStatus = orderStatus.value;
  console.log('Selected status:', selectedStatus);
  console.log('Order ID:', orderId);
  if (!orderId || !selectedStatus) {
    alert('Sipariş ID veya durum bilgisi eksik.');
    return;
  }

  sendOrderUpdate(orderId, selectedStatus);
}

function initOrderStatusPage() {
  document
    .getElementById('updateOrderStatusBtn')
    ?.addEventListener('click', handleUpdateClick);
}

document.addEventListener('DOMContentLoaded', initOrderStatusPage);

window.viewOrder = function (btn) {
  const orderId = btn.dataset.id;
  const outputElement = document.getElementById('orderOutput-' + orderId);

  outputElement.innerHTML = 'Yükleniyor...';

  fetch('/partner/order/view_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: orderId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.error) {
        outputElement.innerHTML = 'Sipariş bilgisi alınamadı.';
        return;
      }

      const address = data.deliveryAddress?.shortAddress || 'Adres bilgisi yok';
      const total = data.grandTotal + '₺';
      const items = data.items || [];

      const itemList = items
        .map((item) => {
          const product = item.product || {};
          const photoUrl =
            product.photos?.[0]?.path ||
            'https://www.huronelginwater.ca/app/uploads/2019/03/test.jpg';

          return `
        <div class="d-flex align-items-center mb-3">
          <img src="${photoUrl}" alt="${product.name}" width="60" height="60" class="me-3 rounded">
          <div>
            <div><strong>${item.productNameSnapshot}</strong></div>
            <div>${item.quantity} x ${item.unitPrice}₺</div>
          </div>
        </div>`;
        })
        .join('');

      outputElement.innerHTML = `
        <div><strong>Adres:</strong> ${address}</div>
        <div><strong>Toplam:</strong> ${total}</div>
        <hr>
        <div><strong class="mb-4" >Ürünler:</strong></div>
        ${itemList || 'Ürün bulunamadı.'}
      `;
    })
    .catch((err) => {
      outputElement.innerHTML = 'İstek hatası: ' + err.message;
    });
};
