let pname = window.activePlace?.pname || 'Varsayılan Mekan Adı';

document.addEventListener('DOMContentLoaded', function () {
  setRestaurantName(pname);
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
  setupInstantToggleFilters();
});

// Set restaurant name in dropdown
function setRestaurantName(name) {
  const dropdown = document.getElementById('restaurantName');
  if (dropdown) dropdown.textContent = name;
}

// {TODO: Implement the logic to fetch and set the restaurant name dynamically if needed.}
// Setup reply button logic
function setupReplyButtons() {
  document.querySelectorAll('.reply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reviewId = btn.dataset.reviewId;
      const replyForm = document.getElementById(`reply-form-${reviewId}`);
      if (replyForm) btn.style.display = 'none';
    });
  });
}

// Setup cancel reply button logic
function setupCancelReplyButtons() {
  document.querySelectorAll('.cancel-reply').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reviewId = btn.dataset.reviewId;
      const replyForm = document.getElementById(`reply-form-${reviewId}`);
      const replyBtn = document.getElementById(`reply-btn-${reviewId}`);
      if (replyForm) replyForm.classList.remove('show');
      if (replyBtn) replyBtn.style.display = 'inline-block';
    });
  });
}
//{TODO: Implement the logic to hide the reply form and show the reply button when cancel is clicked.}
// Setup send reply button logic
function setupSendReplyButtons() {
  document.querySelectorAll('.send-reply').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reviewId = btn.dataset.reviewId;
      const replyForm = document.getElementById(`reply-form-${reviewId}`);
      const replyBtn = document.getElementById(`reply-btn-${reviewId}`);
      const reviewItem = document.getElementById(`review-${reviewId}`);
      const textarea = document.getElementById(`replyText-${reviewId}`);
      const replyText = textarea.value.trim();

      if (!replyText || !reviewItem) return;

      const formattedDate = formatDate(new Date());
      const replyContainer = document.createElement('div');
      replyContainer.className = 'business-reply mt-3';
      replyContainer.innerHTML = `
        <div class="d-flex">
          <div class="flex-shrink-0">
            <i class="fa-solid fa-store text-muted"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <h6 class="fw-bold mb-1">İşletme Yanıtınız</h6>
            <p class="mb-1">${replyText}</p>
            <small class="text-muted">${formattedDate}</small>
          </div>
        </div>
      `;
      reviewItem.appendChild(replyContainer);

      if (replyForm) {
        const collapse = bootstrap.Collapse.getInstance(replyForm);
        collapse ? collapse.hide() : replyForm.classList.remove('show');
      }
      if (replyBtn) replyBtn.remove();
    });
  });
}

function formatDate(date) {
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;
}

// Filter buttons setup
function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filters .btn[data-filter]');
  const currentUrl = new URL(window.location.href);
  const active = currentUrl.searchParams.get('filter');

  buttons.forEach((btn) => {
    if (btn.dataset.filter === active) btn.classList.add('active');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filterValue = btn.dataset.filter;
      const url = new URL(window.location.href);
      url.searchParams.set('filter', filterValue);
      url.searchParams.set('page', '1');

      if (filterValue === 'custom') {
        const start = currentUrl.searchParams.get('startDate');
        const end = currentUrl.searchParams.get('endDate');
        if (start) url.searchParams.set('startDate', start);
        if (end) url.searchParams.set('endDate', end);
      }

      window.location.href = url.toString();
    });
  });
}

// Review limit dropdown
function setupReviewLimitSelect() {
  const select = document.getElementById('review-limit-select');
  if (!select) return;

  const currentUrl = new URL(window.location.href);
  select.value = currentUrl.searchParams.get('limit') || '5';

  select.addEventListener('change', function () {
    currentUrl.searchParams.set('limit', this.value);
    currentUrl.searchParams.set('page', '1');
    window.location.href = currentUrl.toString();
  });
}

// Datepicker locale setup and configuration
function configureDatePicker() {
  const turkishLocale = {
    closeText: 'Bitti',
    prevText: 'Geri',
    nextText: 'İleri',
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
    dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    weekHeader: 'Hf',
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
    selectMonthLabel: 'Ay seçin',
    selectYearLabel: 'Yıl seçin',
  };
  $.datepicker.regional['tr'] = turkishLocale;
  $.datepicker.setDefaults(turkishLocale);
}

// Apply date filter logic
function setupDateFilter() {
  const options = {
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    prevText: '<i class="fas fa-chevron-left" title="Önceki Ay"></i>',
    nextText: '<i class="fas fa-chevron-right" title="Sonraki Ay"></i>',
    beforeShow: (input, inst) => $(inst.dpDiv).data('input', input),
  };

  $('#startDate, #endDate').datepicker(options);

  $('#applyDateFilterBtn').on('click', () => {
    const start = $('#startDate').val();
    const end = $('#endDate').val();

    if (start && end) {
      const url = new URL(window.location.href);
      url.searchParams.set('filter', 'custom');
      url.searchParams.set('startDate', start);
      url.searchParams.set('endDate', end);
      url.searchParams.set('page', '1');
      window.location.href = url.toString();
    } else {
      toastr.error('Lütfen başlangıç ve bitiş tarihlerini seçin.');
    }
  });

  $(window).on('resize', () => {
    $('.ui-datepicker:visible').each(function () {
      const input = $(this).data('input');
      if (input) {
        $(this).position({
          my: 'left top',
          at: 'left bottom+5',
          of: $(input),
        });
      }
    });
  });
}

// Apply filters from form
function setupApplyFilters() {
  const btn = document.getElementById('applyFiltersBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const url = new URL(window.location.href);

    const hasText = document.getElementById('onlyWithTextCheck').checked;
    const hasPhotos = document.getElementById('onlyWithPhotosCheck').checked;
    const rating = document.querySelector(
      'input[name="ratingFilter"]:checked',
    )?.value;
    const replyStatus = document.querySelector(
      'input[name="replyFilter"]:checked',
    )?.value;

    hasText
      ? url.searchParams.set('text', 'true')
      : url.searchParams.delete('text');
    hasPhotos
      ? url.searchParams.set('photos', 'true')
      : url.searchParams.delete('photos');

    rating
      ? url.searchParams.set('rate', rating)
      : url.searchParams.delete('rate');
    replyStatus
      ? url.searchParams.set('replyFilter', replyStatus)
      : url.searchParams.delete('replyFilter');

    url.searchParams.set('page', '1');

    window.location.href = url.toString();
  });
}

// Reset filters to default
function setupResetFilters() {
  const btn = document.getElementById('resetFiltersBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const url = new URL(window.location.pathname, window.location.origin);
    const limit = new URL(window.location.href).searchParams.get('limit');
    if (limit) url.searchParams.set('limit', limit);
    window.location.href = url.toString();
  });
}

// Synchronize offcanvas filters with URL parameters
function syncOffcanvasFiltersWithUrl() {
  const params = new URLSearchParams(window.location.search);

  const textCheck = document.getElementById('onlyWithTextCheck');
  if (textCheck) textCheck.checked = params.has('text');

  const photosCheck = document.getElementById('onlyWithPhotosCheck');
  if (photosCheck) photosCheck.checked = params.has('photos');

  const rating = params.get('rate');
  if (rating) {
    const ratingInput = document.querySelector(
      `input[name="ratingFilter"][value="${rating}"]`,
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

// Setup instant toggle filters for text and photos
function setupInstantToggleFilters() {
  const handleChange = function () {
    const url = new URL(window.location.href);
    const paramName = this.id === 'onlyWithTextCheck' ? 'text' : 'photos';

    if (this.checked) {
      url.searchParams.set(paramName, 'true');
    } else {
      url.searchParams.delete(paramName);
    }
    url.searchParams.set('page', '1');
    window.location.href = url.toString();
  };

  const textCheck = document.getElementById('onlyWithTextCheck');
  if (textCheck) {
    textCheck.addEventListener('change', handleChange);
  }

  const photosCheck = document.getElementById('onlyWithPhotosCheck');
  if (photosCheck) {
    photosCheck.addEventListener('change', handleChange);
  }
}


