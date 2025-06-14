document.addEventListener('DOMContentLoaded', function () {
  
    const pname = window.activePlace?.pname || 'Varsayılan Mekan Adı';
  setRestaurantName(pname);

  const offcanvasElement = document.getElementById('advancedFiltersOffcanvas');
  if (offcanvasElement) {
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    const advancedFiltersBtn = document.getElementById('advancedFiltersBtn');
    if (advancedFiltersBtn) {
      advancedFiltersBtn.addEventListener('click', () => {
        offcanvas.show();
      });
    }
  }

  setupReplyButtons();
  setupCancelReplyButtons();
  setupSendReplyButtons();
  setupFilterButtons();
  setupReviewLimitSelect();
  configureDatePicker();
  setupDateFilter();
  setupApplyFilters();
  setupResetFilters();
  syncOffcanvasFiltersWithUrl();
// setupInstantToggleFilters(); // NOTE: This function reloads the page on every checkbox change.
});


function setRestaurantName(name) {
  const dropdown = document.getElementById('restaurantName');
  if (dropdown) dropdown.textContent = name;
}

function setupReplyButtons() {
  document.querySelectorAll('.reply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
    });
  });
}

function setupCancelReplyButtons() {
  document.querySelectorAll('.cancel-reply').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reviewId = btn.dataset.reviewId;
      const replyBtn = document.getElementById(`reply-btn-${reviewId}`);
      if (replyBtn) replyBtn.style.display = 'inline-block';

      const replyForm = document.getElementById(`reply-form-${reviewId}`);
      if (replyForm) {
        const bsCollapse = bootstrap.Collapse.getInstance(replyForm);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
}

function setupSendReplyButtons() {
  document.querySelectorAll('.send-reply').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reviewId = btn.dataset.reviewId;
      const reviewItem = document.getElementById(`review-${reviewId}`);
      const textarea = document.getElementById(`replyText-${reviewId}`);
      if (!textarea || !reviewItem) return;

      const replyText = textarea.value.trim();
      if (!replyText) return;

      const existingReply = reviewItem.querySelector('.business-reply');
      if (existingReply) existingReply.remove();

      const replyContainer = document.createElement('div');
      replyContainer.className = 'business-reply mt-3';
      replyContainer.innerHTML = `
                <div class="d-flex">
                    <div class="flex-shrink-0"><i class="fa-solid fa-store text-muted"></i></div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="fw-bold mb-1">İşletme Yanıtınız</h6>
                        <p class="mb-1" style="white-space: pre-wrap;">${replyText}</p>
                        <small class="text-muted">${formatDate(
                          new Date(),
                        )}</small>
                    </div>
                </div>`;
      reviewItem.appendChild(replyContainer);

      const replyBtnContainer = document
        .getElementById(`reply-btn-${reviewId}`)
        ?.closest('div');
      const replyForm = document.getElementById(`reply-form-${reviewId}`);

      if (replyForm) {
        const bsCollapse = bootstrap.Collapse.getInstance(replyForm);
        if (bsCollapse) bsCollapse.hide();
      }
      const replyButton = document.getElementById(`reply-btn-${reviewId}`);
      if (replyButton) replyButton.remove();
    });
  });
}

function formatDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function updateUrlAndReload(params) {
  const url = new URL(window.location.href);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  url.searchParams.set('page', '1'); 
  window.location.href = url.toString();
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filters .btn[data-filter]');
  const currentUrlParams = new URLSearchParams(window.location.search);
  const activeFilter = currentUrlParams.get('filter');

  buttons.forEach((btn) => {
    if (btn.dataset.filter === activeFilter) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedFilterValue = btn.dataset.filter;

      if (clickedFilterValue === activeFilter) {
        updateUrlAndReload({ filter: null, startDate: null, endDate: null });
      } else {
        updateUrlAndReload({
          filter: clickedFilterValue,
          startDate: null,
          endDate: null,
        });
      }
    });
  });
}

function setupReviewLimitSelect() {
  const select = document.getElementById('review-limit-select');
  if (!select) return;
  const currentLimit = new URLSearchParams(window.location.search).get('limit');
  if (currentLimit) select.value = currentLimit;

  select.addEventListener('change', function () {
    updateUrlAndReload({ limit: this.value });
  });
}

function configureDatePicker() {
  if (typeof $.datepicker === 'undefined') return;
  $.datepicker.regional['tr'] = {
    closeText: 'Kapat',
    prevText: '&#x3C;Geri',
    nextText: 'İleri&#x3e;',
    currentText: 'Bugün',
    monthNames: [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ],
    monthNamesShort: [
      'Oca',
      'Şub',
      'Mar',
      'Nis',
      'May',
      'Haz',
      'Tem',
      'Ağu',
      'Eyl',
      'Eki',
      'Kas',
      'Ara',
    ],
    dayNames: [
      'Pazar',
      'Pazartesi',
      'Salı',
      'Çarşamba',
      'Perşembe',
      'Cuma',
      'Cumartesi',
    ],
    dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    weekHeader: 'Hf',
    dateFormat: 'yy-mm-dd',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
  };
  $.datepicker.setDefaults($.datepicker.regional['tr']);
}

function setupDateFilter() {
  if (typeof $.datepicker === 'undefined') return;
  $('#startDate, #endDate').datepicker({ changeMonth: true, changeYear: true });
  $('#applyDateFilterBtn').on('click', () => {
    const start = $('#startDate').val();
    const end = $('#endDate').val();
    if (start && end) {
      updateUrlAndReload({ filter: 'custom', startDate: start, endDate: end });
    } else {
    toastr.warning('Lütfen başlangıç ve bitiş tarihlerini seçin.');
    }
  });
}

function setupApplyFilters() {
  const btn = document.getElementById('applyFiltersBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const params = {};
    params.text = document.getElementById('onlyWithTextCheck').checked
      ? 'true'
      : null;
    params.photos = document.getElementById('onlyWithPhotosCheck').checked
      ? 'true'
      : null;
    params.rate =
      document.querySelector('input[name="ratingFilter"]:checked')?.value ||
      null;
    params.replyFilter =
      document.querySelector('input[name="replyFilter"]:checked')?.value ||
      null;
    updateUrlAndReload(params);
  });
}

function setupResetFilters() {
  const btn = document.getElementById('resetFiltersBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const currentUrl = new URL(window.location.href);
    const limit = currentUrl.searchParams.get('limit');
    const baseUrl = new URL(window.location.pathname, window.location.origin);
    if (limit) {
      baseUrl.searchParams.set('limit', limit);
    }
    window.location.href = baseUrl.toString();
  });
}

function syncOffcanvasFiltersWithUrl() {
  const params = new URLSearchParams(window.location.search);
  const textCheck = document.getElementById('onlyWithTextCheck');
  if (textCheck) textCheck.checked = params.has('text');

  const photosCheck = document.getElementById('onlyWithPhotosCheck');
  if (photosCheck) photosCheck.checked = params.has('photos');

  const rate = params.get('rate');
  if (rate) {
    const ratingInput = document.querySelector(
      `input[name="ratingFilter"][value="${rate}"]`,
    );
    if (ratingInput) ratingInput.checked = true;
  }
  const replyStatus = params.get('replyFilter');
  if (replyStatus) {
    const replyInput = document.querySelector(
      `input[name="replyFilter"][value="${replyStatus}"]`,
    );
    if (replyInput) replyInput.checked = true;
  }
}
