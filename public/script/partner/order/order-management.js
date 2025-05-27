// We assume that the allOrdersMap object is added to the global scope by Twig
// and populated with initialNewOrders and initialContinueOrders.
// ('All Order Data (JS - allOrdersMap):', allOrdersMap);

let notificationAudio = null;
let newOrderModalInstance = null;
let confirmModalInstance = null; 

// Define event listeners and modal instances inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const enableBtn = document.getElementById('enableSoundBtn');
  const disableBtn = document.getElementById('disableSoundBtn');
  const newOrderModalElement = document.getElementById('newOrderModal');
  const dismissModalBtn = document.getElementById('dismissModalBtn');
  const confirmModalElement = document.getElementById('confirmModal');

  if (enableBtn && disableBtn) {
    enableBtn.addEventListener('click', () => {
      if (!notificationAudio) {
        notificationAudio = new Audio(
          'https://cdn.freesound.org/previews/24/24929_37876-lq.ogg',
        );
        notificationAudio.loop = true;
      }
      notificationAudio.load();
      enableBtn.classList.add('d-none');
      disableBtn.classList.remove('d-none');
    });

    disableBtn.addEventListener('click', () => {
      if (notificationAudio) {
        notificationAudio.pause();
        notificationAudio.currentTime = 0;
      }
      disableBtn.classList.add('d-none');
      enableBtn.classList.remove('d-none');
    });
  }

  if (newOrderModalElement) {
    newOrderModalInstance = new bootstrap.Modal(newOrderModalElement);
  }

  if (dismissModalBtn) {
    dismissModalBtn.addEventListener('click', () => {
      if (notificationAudio) {
        notificationAudio.pause();
        notificationAudio.currentTime = 0;
      }
    });
  }

  if (confirmModalElement) {
    confirmModalInstance = new bootstrap.Modal(confirmModalElement);
  }

  // Render initial orders and start periodic updates when the page loads
  renderAllOrderCards();
  fetchAndUpdateOrders();
  setInterval(fetchAndUpdateOrders, 10000); 
});

function playNotificationSound() {
  if (!notificationAudio) {
    console.warn(
      'Bildirim sesi objesi oluşturulmamış veya kullanıcı henüz izin vermemiş.',
    );
    return;
  }

  notificationAudio.currentTime = 0;
  notificationAudio.play().catch((error) => {
    // An error may occur due to autoplay policies.
    // Usually, the first play action must follow a user interaction (such as a click).
    console.warn(
      'Ses otomatik çalınamadı, kullanıcı etkileşimi gerekebilir:',
      error,
    );
  });

  if (newOrderModalInstance) {
    newOrderModalInstance.show();
  } else {
    console.warn('Yeni sipariş modal instance bulunamadı.');
  }
}

const statusTranslations = {
  pending: 'Beklemede',
  accepted: 'Kabul Edildi',
  preparing: 'Hazırlanıyor',
  delivery: 'Yola Çıktı',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

function getOrderStatusClass(status) {
  switch (status) {
    case 'pending':
      return 'bg-warning text-white';
    case 'accepted':
      return 'bg-primary text-white';
    case 'preparing':
      return 'bg-primary text-white';
    case 'delivery':
      return 'bg-success text-white';
    case 'delivered':
      return 'bg-success text-white';
    case 'cancelled':
      return 'bg-danger text-white';
    default:
      return 'bg-dark text-white';
  }
}

function getOrderStatusIcon(status) {
  switch (status) {
    case 'pending':
      return 'bi-hourglass-split';
    case 'accepted':
      return 'bi-patch-check-fill';
    case 'preparing':
      return 'bi-person-gear';
    case 'delivery':
      return 'bi-bicycle';
    case 'delivered':
      return 'bi-bag-check-fill';
    case 'cancelled':
      return 'bi-x-octagon-fill';
    default:
      return 'bi-question-circle-fill';
  }
}

function createOrderCardHTML(order) {
  const statusText =
    statusTranslations[order.status] ||
    order.status.charAt(0).toUpperCase() + order.status.slice(1);
  const statusClass = getOrderStatusClass(order.status);
  const statusIcon = getOrderStatusIcon(order.status);

  let itemsHTML = '';
  if (order.items && order.items.length > 0) {
    order.items.forEach((item) => {
      let productDescriptionHTML = '';
      if (item.productDescription && item.productDescription.trim() !== '') {
        productDescriptionHTML = `<small class="d-block text-muted fst-italic ms-3 product-description">- ${item.productDescription}</small>`;
      }
      itemsHTML += `
                <div>
                    <p class="mb-0"><i class="bi bi-dot"></i>${
                      item.productNameSnapshot || 'Bilinmeyen Ürün'
                    } <small class="text-muted">x${
        item.quantity || 0
      }</small></p>
                    ${productDescriptionHTML}
                </div>`;
    });
  } else {
    itemsHTML = '<p class="text-muted fst-italic">Ürün bilgisi bulunmuyor.</p>';
  }

  let lastStatusDateFormatted = '';
  if (
    order.statusHistory &&
    order.statusHistory.length > 0 &&
    order.statusHistory[0].createdAt
  ) {
    try {
      const date = new Date(order.statusHistory[0].createdAt);
      lastStatusDateFormatted = date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.warn('Tarih formatlama hatası (statusHistory):', e);
    }
  } else if (order.updatedAt) {
    try {
      const date = new Date(order.updatedAt);
      lastStatusDateFormatted = date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.warn('Tarih formatlama hatası (updatedAt):', e);
    }
  }

  let bottomCardActionsHTML = '';
  if (order.status === 'pending') {
    bottomCardActionsHTML = `<div class="order-actions">
                                    <button class="btn btn-sm btn-success w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${order.id}', 'accepted', 'Bu siparişi KABUL ETMEK istediğinizden emin misiniz?')">
                                        <i class="bi bi-check-circle-fill me-1"></i> Kabul Et
                                    </button>
                                 </div>`;
  } else if (order.status === 'accepted') {
    bottomCardActionsHTML = `<div class="order-actions">
                                    <button class="btn btn-sm btn-primary w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${order.id}', 'preparing', 'Bu siparişi HAZIRLAMAYA BAŞLAMAK istediğinizden emin misiniz?')">
                                        <i class="bi bi-play-circle-fill me-1"></i> Hazırla
                                    </button>
                                 </div>`;
  } else if (order.status === 'preparing') {
    bottomCardActionsHTML = `<div class="order-actions">
                                    <button class="btn btn-sm btn-success w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${order.id}', 'delivery', 'Bu siparişin YOLA ÇIKTIĞINI onaylıyor musunuz?')">
                                        <i class="bi bi-truck me-1"></i> Yola Çıkar
                                    </button>
                                 </div>`;
  } else if (order.status === 'delivery') {
    bottomCardActionsHTML = `<div class="order-actions">
                                    <button class="btn btn-sm btn-primary w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${order.id}', 'delivered', 'Bu siparişi TESLİM EDİLDİĞİNİ onaylıyor musunuz?')">
                                        <i class="bi bi-patch-check-fill me-1"></i> Teslim Et
                                    </button>
                                 </div>`;
  }

  return `
        <div class="order-box" id="order-card-${order.id}" data-order-id="${
    order.id
  }">
            <div class="order-box-clickable-area" onclick="showDynamicOrderDetails('${
              order.id
            }')">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge order-status ${statusClass}">
                        <i class="${statusIcon}"></i> ${statusText}
                    </span>
                    <div>
                        ${
                          lastStatusDateFormatted
                            ? `<small class="text-muted me-2">${lastStatusDateFormatted}</small>`
                            : ''
                        }
                        <small class="order-id">#${
                          order.id ? order.id.substring(0, 8) : 'N/A'
                        }</small>
                    </div>
                </div>
                <div class="order-items">
                    ${itemsHTML}
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                    <strong class="order-total">₺${(
                      parseFloat(order.grandTotal) || 0
                    ).toLocaleString('tr-TR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</strong>
                    <div class="d-flex align-items-center gap-2">
                        <span class="details-link">Detaylar
                            <i class="bi bi-arrow-right-short"></i>
                        </span>
                        ${bottomCardActionsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAllOrderCards() {
  const newOrdersContainer = document.getElementById('newOrdersContainer');
  const continueOrdersContainer = document.getElementById(
    'continueOrdersContainer',
  );
  const newOrdersSpinner = document.getElementById('newOrdersSpinner');
  const continueOrdersSpinner = document.getElementById(
    'continueOrdersSpinner',
  );
  const noNewOrdersMsg = newOrdersContainer
    ? newOrdersContainer.querySelector('.no-orders-message')
    : null;
  const noContinueOrdersMsg = continueOrdersContainer
    ? continueOrdersContainer.querySelector('.no-orders-message')
    : null;

  if (!newOrdersContainer || !continueOrdersContainer) {
    console.error('Sipariş konteynerları bulunamadı!');
    return;
  }

  if (newOrdersSpinner && newOrdersSpinner.style.display === 'none')
    newOrdersSpinner.style.display = 'block';
  if (continueOrdersSpinner && continueOrdersSpinner.style.display === 'none')
    continueOrdersSpinner.style.display = 'block';
  if (noNewOrdersMsg) noNewOrdersMsg.style.display = 'none';
  if (noContinueOrdersMsg) noContinueOrdersMsg.style.display = 'none';

  // While clearing existing cards, keep the spinner and messages
  Array.from(newOrdersContainer.querySelectorAll('.order-box')).forEach((el) =>
    el.remove(),
  );
  Array.from(continueOrdersContainer.querySelectorAll('.order-box')).forEach(
    (el) => el.remove(),
  );

  let newOrdersCount = 0;
  let continueOrdersCount = 0;
  const currentOrders = Object.values(allOrdersMap);

  currentOrders
    .sort((a, b) => {
      const statusOrder = [
        'pending',
        'accepted',
        'preparing',
        'delivery',
        'delivered',
        'cancelled',
      ];
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);
      if (statusA !== statusB) return statusA - statusB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .forEach((order) => {
      const cardHTML = createOrderCardHTML(order);
      if (['pending', 'accepted'].includes(order.status)) {
        newOrdersContainer.insertAdjacentHTML('beforeend', cardHTML);
        newOrdersCount++;
      } else if (
        ['preparing', 'delivery', 'delivered'].includes(order.status)
      ) {
        continueOrdersContainer.insertAdjacentHTML('beforeend', cardHTML);
        continueOrdersCount++;
      }
    });

  if (noNewOrdersMsg)
    noNewOrdersMsg.style.display = newOrdersCount === 0 ? 'block' : 'none';
  if (noContinueOrdersMsg)
    noContinueOrdersMsg.style.display =
      continueOrdersCount === 0 ? 'block' : 'none';

  if (newOrdersSpinner) newOrdersSpinner.style.display = 'none';
  if (continueOrdersSpinner) continueOrdersSpinner.style.display = 'none';
}

async function fetchAndUpdateOrders() {
  const newOrdersSpinner = document.getElementById('newOrdersSpinner');
  const continueOrdersSpinner = document.getElementById(
    'continueOrdersSpinner',
  );

  if (Object.keys(allOrdersMap).length === 0) {
    if (newOrdersSpinner && newOrdersSpinner.style.display === 'none')
      newOrdersSpinner.style.display = 'block';
    if (continueOrdersSpinner && continueOrdersSpinner.style.display === 'none')
      continueOrdersSpinner.style.display = 'block';
  }

  try {
    const response = await fetch('/partner/order/list');
    if (!response.ok) {
      throw new Error(
        `Sunucu hatası: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();

    let fetchedOrdersList = [];
    if (data.allOrders) {
      fetchedOrdersList = data.allOrders;
    } else if (data.newOrders || data.continueOrders) {
      fetchedOrdersList = [
        ...(data.newOrders || []),
        ...(data.continueOrders || []),
      ];
    } else {
      console.warn("API'den beklenen formatta sipariş verisi gelmedi.");
      if (newOrdersSpinner) newOrdersSpinner.style.display = 'none';
      if (continueOrdersSpinner) continueOrdersSpinner.style.display = 'none';
      if (Object.keys(allOrdersMap).length === 0) renderAllOrderCards();
      return;
    }

    if (
      fetchedOrdersList.length === 0 &&
      Object.keys(allOrdersMap).length === 0
    ) {
      renderAllOrderCards();
      return;
    }

    let hasChanges = false;
    const newAllOrdersMap = {};
    let newOrderDetected = false;

    for (const order of fetchedOrdersList) {
      newAllOrdersMap[order.id] = order;
      if (!allOrdersMap[order.id]) {
        // Completely new order
        hasChanges = true;
        if (['pending'].includes(order.status)) {
          newOrderDetected = true;
        }
      } else if (
        allOrdersMap[order.id].status !== order.status ||
        allOrdersMap[order.id].updatedAt !== order.updatedAt
      ) {
        hasChanges = true;
      }
    }
    // Deleted order check
    if (
      Object.keys(allOrdersMap).length !==
        Object.keys(newAllOrdersMap).length &&
      Object.keys(allOrdersMap).some((id) => !newAllOrdersMap[id])
    ) {
      hasChanges = true;
    }

    if (hasChanges) {
      if (newOrderDetected) {
        playNotificationSound();
      }
      allOrdersMap = newAllOrdersMap;
      renderAllOrderCards();
    } else {
      if (newOrdersSpinner) newOrdersSpinner.style.display = 'none';
      if (continueOrdersSpinner) continueOrdersSpinner.style.display = 'none';
    }
  } catch (error) {
    console.error('Siparişler periyodik olarak çekilirken hata oluştu:', error);
    if (newOrdersSpinner) newOrdersSpinner.style.display = 'none';
    if (continueOrdersSpinner) continueOrdersSpinner.style.display = 'none';
    if (Object.keys(allOrdersMap).length === 0) renderAllOrderCards();
  }
}

function showDynamicOrderDetails(orderId) {
  const data = allOrdersMap[orderId];

  if (!data) {
    console.error(
      'Sipariş verisi bulunamadı (JS showDynamicOrderDetails):',
      orderId,
    );
    const offcanvasLabel = document.getElementById('orderDetailsCanvasLabel');
    if (offcanvasLabel)
      offcanvasLabel.innerHTML = `<i class="bi bi-exclamation-triangle-fill text-danger"></i> Sipariş Bulunamadı`;
    document.getElementById(
      'offcanvasOrderItems',
    ).innerHTML = `<li class="list-group-item text-danger">Detaylar yüklenemedi.</li>`;
    document.getElementById('offcanvasPaymentSummary').innerHTML = '';
    document.getElementById('offcanvasCustomerInfo').innerHTML = '';
    document.getElementById('offcanvasOrderNote').textContent = '';
    document
      .getElementById('offcanvasTimeline')
      .querySelectorAll('.timeline-step')
      .forEach((el) => {
        el.classList.remove('active', 'completed', 'cancelled');
        el.style.display =
          el.id === 'timeline-step-cancelled' ? 'none' : 'flex';
      });
    document.getElementById('offcanvasActionButtons').innerHTML = '';
    const errorCanvasEl = document.getElementById('orderDetailsCanvas');
    if (errorCanvasEl)
      bootstrap.Offcanvas.getOrCreateInstance(errorCanvasEl).show();
    return;
  }

  document.getElementById(
    'orderDetailsCanvasLabel',
  ).innerHTML = `<i class="bi bi-receipt-cutoff"></i> Sipariş Detayı (#${
    data.id ? data.id.substring(0, 8) : 'N/A'
  })`;

  const orderItemsUl = document.getElementById('offcanvasOrderItems');
  orderItemsUl.innerHTML = '';
  let calculatedSubTotal = 0;
  if (data.items && data.items.length > 0) {
    data.items.forEach((item) => {
      const li = document.createElement('li');
      li.className =
        'list-group-item d-flex justify-content-between align-items-center';
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const itemTotalPrice = unitPrice * quantity;
      calculatedSubTotal += itemTotalPrice;

      let productDescriptionHTML = '';
      if (item.productDescription && item.productDescription.trim() !== '') {
        productDescriptionHTML = `<small class="d-block text-muted fst-italic ms-3 product-description">- ${item.productDescription}</small>`;
      }

      li.innerHTML = `
                <div class="w-100">
                    <div class="d-flex justify-content-between">
                        <span>${
                          item.productNameSnapshot || 'Bilinmeyen Ürün'
                        } <small class="text-muted">x${quantity}</small></span>
                        <strong>₺${itemTotalPrice.toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}</strong>
                    </div>
                    ${productDescriptionHTML}
                </div>
            `;
      orderItemsUl.appendChild(li);
    });
  } else {
    orderItemsUl.innerHTML =
      '<li class="list-group-item text-muted">Bu siparişte ürün bulunmamaktadır.</li>';
  }

  const paymentSummaryDiv = document.getElementById('offcanvasPaymentSummary');
  const grandTotal = parseFloat(data.grandTotal) || 0;
  paymentSummaryDiv.innerHTML = `
        <p><span>Ara Toplam</span> <span>₺${calculatedSubTotal.toLocaleString(
          'tr-TR',
          { minimumFractionDigits: 2, maximumFractionDigits: 2 },
        )}</span></p>
        <p class="total fw-bold border-top pt-2 mt-2 fs-5"><span>TOPLAM TUTAR</span> <span>₺${grandTotal.toLocaleString(
          'tr-TR',
          { minimumFractionDigits: 2, maximumFractionDigits: 2 },
        )}</span></p>
    `;

  const customerInfoDiv = document.getElementById('offcanvasCustomerInfo');
  let customerHtml = '';
  if (
    data.deliveryAddress &&
    data.deliveryAddress.company &&
    data.deliveryAddress.company !== '1231'
  ) {
    customerHtml += `<p class="mb-1"><strong>${data.deliveryAddress.company}</strong></p>`;
  }

  if (data.deliveryAddress) {
    customerHtml += data.deliveryAddress.phone
      ? `<p class="mb-1"><i class="bi bi-telephone-fill me-2"></i><a href="tel:${data.deliveryAddress.phone}" class="text-decoration-none text-dark">${data.deliveryAddress.phone}</a></p>`
      : '';
    customerHtml += data.deliveryAddress.longAddress
      ? `<p class="mb-1"><i class="bi bi-geo-alt-fill me-2"></i>${data.deliveryAddress.longAddress}</p>`
      : data.deliveryAddress.shortAddress
      ? `<p class="mb-1"><i class="bi bi-geo-alt-fill me-2"></i>${data.deliveryAddress.shortAddress}</p>`
      : '';
    let buildingInfo = '';
    if (data.deliveryAddress.apartment)
      buildingInfo += ` ${data.deliveryAddress.apartment}`;
    if (data.deliveryAddress.apartmentNumber)
      buildingInfo += ` No: ${data.deliveryAddress.apartmentNumber}`;
    if (data.deliveryAddress.floor)
      buildingInfo += ` Kat: ${data.deliveryAddress.floor}`;
    if (buildingInfo)
      customerHtml += `<p class="mb-1"><i class="bi bi-building me-2"></i>${buildingInfo.trim()}</p>`;
    customerHtml += data.deliveryAddress.addressInstruction
      ? `<p class="mb-1 fst-italic"><i class="bi bi-info-circle-fill me-2"></i>Tarif: ${data.deliveryAddress.addressInstruction}</p>`
      : '';
  } else {
    customerHtml =
      '<p class="text-muted">Teslimat bilgisi bulunmamaktadır.</p>';
  }
  if (data.createdAt) {
    try {
      const orderDate = new Date(data.createdAt);
      customerHtml += `<p class="mb-0 mt-2"><small class="text-muted">Sipariş Tarihi: ${orderDate.toLocaleString(
        'tr-TR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      )}</small></p>`;
    } catch (e) {
      customerHtml += `<p class="mb-0 mt-2"><small class="text-muted">Sipariş Tarihi: ${data.createdAt}</small></p>`;
    }
  }
  customerInfoDiv.innerHTML = customerHtml;
  document.getElementById('offcanvasOrderNote').textContent =
    data.orderDescription || 'Sipariş notu bulunmamaktadır.';

  const currentOrderStatus = data.status;
  updateTimelineStatusGUI(currentOrderStatus);

  const actionButtonsDiv = document.getElementById('offcanvasActionButtons');
  actionButtonsDiv.innerHTML = '';
  if (currentOrderStatus === 'pending') {
    actionButtonsDiv.innerHTML = `<button class="btn btn-success btn-lg w-100 mb-2" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${data.id}', 'accepted', 'Bu siparişi KABUL ETMEK istediğinizden emin misiniz?')"><i class="bi bi-check-circle-fill me-2"></i>Kabul Et</button><button class="btn btn-outline-danger btn-lg w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${data.id}', 'rejected', 'Bu siparişi İPTAL ETMEK istediğinizden emin misiniz?')"><i class="bi bi-x-circle-fill me-2"></i>Siparişi İptal Et</button>`;
  } else if (currentOrderStatus === 'accepted') {
    actionButtonsDiv.innerHTML = `<button class="btn btn-primary btn-lg w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${data.id}', 'preparing', 'Bu siparişi HAZIRLAMAYA BAŞLAMAK istediğinizden emin misiniz?')"><i class="bi bi-play-circle-fill me-2"></i>Hazırlamaya Başla</button>`;
  } else if (currentOrderStatus === 'preparing') {
    actionButtonsDiv.innerHTML = `<button class="btn btn-success btn-lg w-100 text-white" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${data.id}', 'delivery', 'Bu siparişin YOLA ÇIKTIĞINI onaylıyor musunuz?')"><i class="bi bi-truck me-2"></i>Yola Çıkar</button>`;
  } else if (currentOrderStatus === 'delivery') {
    actionButtonsDiv.innerHTML = `<button class="btn btn-primary btn-lg w-100" onclick="event.stopPropagation(); initiateOrderStatusUpdate('${data.id}', 'delivered', 'Bu siparişi TESLİM EDİLDİĞİNİ onaylıyor musunuz?')"><i class="bi bi-patch-check-fill me-2"></i>Teslim Edildi</button>`;
  }

  const canvasEl = document.getElementById('orderDetailsCanvas');
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(canvasEl);
  bsOffcanvas.show();
}

function updateTimelineStatusGUI(currentStatusFromApi) {
  const timelineStatusMap = {
    pending: 'timeline-step-pending',
    accepted: 'timeline-step-accepted',
    preparing: 'timeline-step-preparing',
    delivery: 'timeline-step-delivery',
    delivered: 'timeline-step-delivered',
    cancelled: 'timeline-step-cancelled',
  };
  const orderOfStatusesInTimeline = [
    'pending',
    'accepted',
    'preparing',
    'delivery',
    'delivered',
  ];
  const cancelledStepElement = document.getElementById(
    timelineStatusMap['cancelled'],
  );

  document
    .querySelectorAll('#offcanvasTimeline .timeline-step')
    .forEach((stepEl) => {
      stepEl.classList.remove('active', 'completed', 'cancelled');
      stepEl.style.display =
        stepEl.id === timelineStatusMap['cancelled'] ? 'none' : 'flex';
    });

  if (currentStatusFromApi === 'cancelled') {
    if (cancelledStepElement) {
      cancelledStepElement.classList.add('active', 'cancelled');
      cancelledStepElement.style.display = 'flex';
    }
    return;
  }
  let currentStatusIndex =
    orderOfStatusesInTimeline.indexOf(currentStatusFromApi);
  for (let i = 0; i < orderOfStatusesInTimeline.length; i++) {
    const statusKey = orderOfStatusesInTimeline[i];
    const stepElementId = timelineStatusMap[statusKey];
    if (!stepElementId) continue;
    const stepElement = document.getElementById(stepElementId);
    if (stepElement) {
      if (i < currentStatusIndex) stepElement.classList.add('completed');
      else if (i === currentStatusIndex) stepElement.classList.add('active');
    }
  }
}

function initiateOrderStatusUpdate(orderId, newStatus, confirmationMessage) {
  const confirmModalMessageEl = document.getElementById('confirmModalMessage');
  const confirmModalYesBtn = document.getElementById('confirmModalYes');

  if (confirmModalMessageEl) {
    confirmModalMessageEl.textContent = confirmationMessage;
  }

  if (confirmModalYesBtn && confirmModalInstance) {
    // Önceki event listener'ı kaldırıp yenisini eklemek daha güvenli
    const newYesButton = confirmModalYesBtn.cloneNode(true);
    confirmModalYesBtn.parentNode.replaceChild(
      newYesButton,
      confirmModalYesBtn,
    );

    newYesButton.addEventListener(
      'click',
      function handleYesClick() {
        processOrderStatusUpdate(orderId, newStatus);
        confirmModalInstance.hide();
        // Optionally remove the event listener after it runs once (good practice, but optional)
        // newYesButton.removeEventListener('click', handleYesClick);
      },
      { once: true },
    ); // { once: true } event listener'ın sadece bir kere çalışmasını sağlar

    confirmModalInstance.show();
  } else {
    console.warn('Onay modalı bulunamadı, confirm() kullanılıyor.');
    if (confirm(confirmationMessage)) {
      processOrderStatusUpdate(orderId, newStatus);
    }
  }
}

async function processOrderStatusUpdate(orderId, newStatus) {
  const apiEndpoint = '/partner/order/update_order_status';

  const clickedButtonInCard = document.querySelector(
    `#order-card-${orderId} button[onclick*="'${newStatus}'"]`,
  );
  const clickedButtonInOffcanvas = document.querySelector(
    `#offcanvasActionButtons button[onclick*="'${newStatus}'"]`,
  );

  let clickedButton = clickedButtonInCard || clickedButtonInOffcanvas;
  let originalButtonText = '';

  if (clickedButton) {
    originalButtonText = clickedButton.innerHTML;
    clickedButton.disabled = true;
    clickedButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> İşleniyor...`;
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const textError = await response.text();
        throw new Error(textError || `Sunucu hatası: ${response.status}`);
      }
      console.error('API Hata Detayı:', errorData);
      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Sunucu hatası: ${response.status}`,
      );
    }

    const responseData = await response.json(); 

    if (responseData && responseData.id && responseData.status) {
      allOrdersMap[responseData.id] = responseData;
    } else if (allOrdersMap[orderId]) {
      allOrdersMap[orderId].status = newStatus;
      allOrdersMap[orderId].updatedAt = new Date().toISOString();
    }

    renderAllOrderCards();

    const offcanvasEl = document.getElementById('orderDetailsCanvas');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (
      bsOffcanvas &&
      bsOffcanvas._isShown &&
      document
        .getElementById('orderDetailsCanvasLabel')
        .textContent.includes(orderId.substring(0, 8))
    ) {
      showDynamicOrderDetails(orderId);
    }

    const translatedStatus = statusTranslations[newStatus] || newStatus;
    toastr.success(
      `Sipariş #${orderId.substring(
        0,
        8,
      )} durumu "${translatedStatus}" olarak güncellendi.`,
      'Başarılı!',
    );
  } catch (error) {
    console.error('Sipariş durumu güncellenirken hata oluştu:', error.message);
    toastr.error(`Sipariş durumu güncellenemedi: ${error.message}`, 'Hata!');
  } finally {
    if (clickedButton) {
      clickedButton.disabled = false;
      clickedButton.innerHTML = originalButtonText;
    }
  }
}
