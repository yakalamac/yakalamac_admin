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
    
    // if (!response.ok) {
    //     throw new Error('Sunucu hatası: ' + response.status);
    // }


    // UI güncellemesi yapılacaksa burada yapılabilir
  } catch (error) {
    //console.error('İstek hatası:', error);
    throw error; // Üst katmana hatayı ilet
  }
}

async function sendOrderUpdate(orderId, status) {
  try {
    await sendOrderRequest(orderId, status); 
    alert('Sipariş durumu güncellendi!');
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

function handleUpdateClick() {
  const orderId = document.getElementById('orderId')?.textContent;
  const selectedStatus = orderStatus.value;

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
