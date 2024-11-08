'use strict';

import { initializeSelect2, pushMulti, pushMultiForSelects } from '../../util/select2.js';
import {photoModal, photoModalAreas} from '../../util/modal.js';
import {control} from '../../util/modal-controller.js';

const placeId = $('#page-identifier-place-id')[0].value;
const daysOfWeek = [
    {'day': 1, 'dayTextTR': 'Pazartesi', 'dayTextEN': 'Monday'},
    {'day': 2, 'dayTextTR': 'Salı', 'dayTextEN': 'Tuesday'},
    {'day': 3, 'dayTextTR': 'Çarşamba', 'dayTextEN': 'Wednesday'},
    {'day': 4, 'dayTextTR': 'Perşembe', 'dayTextEN': 'Thursday'},
    {'day': 5, 'dayTextTR': 'Cuma', 'dayTextEN': 'Friday'},
    {'day': 6, 'dayTextTR': 'Cumartesi', 'dayTextEN': 'Saturday'},
    {'day': 7, 'dayTextTR': 'Pazar', 'dayTextEN': 'Sunday'}
];
window.transporter = {
    ...window.transporter,
    productCategories: [],
    productTypes: [],
    productTags: []
}

initializeSelect2('#select-tag');
initializeSelect2('#select-category');
initializeSelect2('#select-type');
let categoriesx = [];

async function fetchPhotoCategories() {
    try {
        const response = await $.ajax({
            url: '/_route/api/api/category/place/photos',
            method: 'GET',
            dataType: 'json',
        });
        categoriesx = response['hydra:member'] || response;
    } catch (error) {
        console.error('Fotoğraf kategorileri alınırken hata oluştu:', error);
        categoriesx = [];
    }
}

(async () => {
    await fetchPhotoCategories();
})();

$('#button-photo-add').on('click', function (event) {
  event.preventDefault();

  $('#photoModal').remove();
  $('body').append(photoModal('photoModal'));
  $('#photoModal').modal('show');

  $('#photoModal').on('shown.bs.modal', function () {
    const areas = photoModalAreas('photoModal');


    const categorySelect = $(areas.categorySelect);
    categorySelect.empty();
    categorySelect.append('<option value="" disabled selected>Kategori seçiniz</option>');
    if (categoriesx.length > 0) {
      categoriesx.forEach(category => {
        categorySelect.append(`<option value="${category['id']}">${category.description}</option>`);
      });
    } else {
      categorySelect.append('<option value="" disabled>Kategori yüklenemedi</option>');
    }
  });

$('#photoModal form').on('submit', async function (e) {
    e.preventDefault();
    const areas = photoModalAreas('photoModal');
    const form = new FormData();
  
    const fileInput = areas.fileInput;
    const file = fileInput.files[0];
    if (file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      form.append('file', file);
    } else {
      alert('Lütfen geçerli bir resim dosyası seçiniz.');
      return;
    }
  
    if (
      !areas.titleInput.value.trim() ||
      !areas.altTagInput.value.trim() ||
      !areas.categorySelect.value
    ) {
      alert('Lütfen tüm alanları doldurunuz.');
      return;
    }
  
    const data = {
      title: areas.titleInput.value.trim(),
      altTag: areas.altTagInput.value.trim(),
      category: '/api/category/place/photos/' + areas.categorySelect.value,
      showOnBanner: areas.showOnBannerSwitch.checked,
      showOnLogo: areas.showOnLogoSwitch.checked,
    };
  
    form.append('data', JSON.stringify(data));
    try {
      const response = await $.ajax({
        url: `https://api.yaka.la/api/place/${placeId}/image/photos`,
        method: 'POST',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Accept': 'application/ld+json',
        },
      });
      console.log('Fotoğraf başarıyla yüklendi:', response);
      alert('Fotoğraf başarıyla yüklendi.');
      $('#photoModal').modal('hide');
      $('#photoModal').remove();
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu.');
    }
  });
  
  
});

  
  

$(document).ready(
    function () {
        pushMulti(
            'select-category',
            'data-category-id',
            'description',
            'id',
            '/api/category/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

        pushMultiForSelects(
            [
                {
                    id: 'select-type',
                    optionIdentifierAttrName: 'data-type-id'
                },
                {
                    id: 'select-primary-type',
                    optionIdentifierAttrName: 'data-primary-type-id'
                }
            ],
            'description',
            'id',
            '/api/type/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

        pushMulti(
            'select-tag',
            'data-tag-id',
            'tag',
            'id',
            '/api/tag/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );


        $.ajax({
            url: '/_route/elasticsearch/product_category/_search?size=1000',
            method: 'GET',
            success: response=> window.transporter.productCategories = response.hits.hits,
            error: e=>console.log(e.responseText),
            failure: e=>console.log(e.responseText)
        });

        const products = $('table#productsTable').DataTable
        (
            {
                processing: true,
                columns: [
                    {
                        data: "id",
                        render: function (data) {
                            return `<a title="${data}">${data.slice(0, 5)}...</a>`;
                        }
                    },
                    {
                        data: "name"
                    },
                    {
                        data: "active",
                        render: function (data) {
                            return `<div class="form-check form-switch form-check-success">
                                        <input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                                    </div>`;
                        }
                    },
                    {
                        data: "description"
                    },
                    {
                        data: "price",
                        render: data => `<div class="text-center" id="price-area"><b id="price">${data} ₺</b></div>`
                    },
                    {
                        data: "categories",
                        render: (data, type, row) => {
                            let template = '';
                            if (data && Array.isArray(data))
                                data.forEach(
                                    d => template += `<option data-type-id="${d.id}" id="product-category-${d.id}" selected>${d.description}</option>`
                                );

                                window
                                    .transporter
                                    .productCategories
                                    .forEach(
                                        category=>template += `<option data-type-id="${category._id}" id="product-category-${category._id}">${category._source.description}</option>`
                                    );

                            return `<select data-placeholder="Hiç kategori belirtilmedi" multiple id="select-product-category-${row.id}" class="form-select product-category-select form-select" id="${row.id}">${template}</select>`;
                        }
                    },
                    {
                        data: "types",
                        render: (data, type, row) => {
                            let template = '';
                            if (data && Array.isArray(data))
                                data.forEach(
                                    d => template += `<option data-type-id="${d.id}" id="product-type-${d.id}" selected>${d.description}</option>`
                                );

                            window
                                .transporter
                                .productTypes
                                .forEach(
                                    type=>template += `<option data-type-id="${type._id}" id="product-type-${type._id}">${type._source.description}</option>`
                                );

                            return `<select data-placeholder="Hiç tür belirtilmedi" multiple id="select-product-type-${row.id}" class="form-select product-type-select form-select" id="${row.id}">${template}</select>`;
                        }
                    },
                    {
                        data: "hashtags",
                        render: (data, type, row) => {
                            let template = '';
                            if (data && Array.isArray(data))
                                data.forEach(
                                    d => template += `<option data-type-id="${d.id}" id="product-tag-${d.id}" selected>${d.tag}</option>`
                                );

                            window
                                .transporter
                                .productTags
                                .forEach(
                                    category=>template += `<option data-type-id="${category._id}" id="product-tag-${category._id}">${category._source.tag}</option>`
                                );

                            return `<select data-placeholder="Hiç kategori belirtilmedi" multiple id="select-product-tag-${row.id}" class="form-select product-tag-select form-select" id="${row.id}">${template}</select>`;
                        }
                    },
                    {
                        data: null,
                        render: function (data, type, row)
                        {
                            return `
                                <a href="/admin/product/${row.id}" title="${row.name} adlı ürünü düzenle">
                                    <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}">
                                        <i class="fadeIn animated bx bx-pencil"></i>
                                    </button>
                                </a>
                                <a href="#" title="${row.name} adlı ürünü sil">
                                  <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                                    <i class="lni lni-trash"></i>
                                  </button>
                                </a>`;
                        }
                    }
                ],
                lengthMenu: [15, 25, 50, 100],
                pagination: true,
                language: {
                    paginate: {
                        next: 'İleri',
                        previous: 'Geri'
                    }
                }
            }
        );

        products
            .clear()
            .rows
            .add(
                window.transporter
                && window.transporter.place
                && window.transporter.place._source
                && Array.isArray(window.transporter.place._source.products)
                    ? window.transporter.place._source.products : []
            )
            .draw();

        initializeSelect2('.product-category-select');
        initializeSelect2('.product-tag-select');
        initializeSelect2('.product-type-select');

        products.on('draw', ()=>{
            initializeSelect2('.product-category-select');
            initializeSelect2('.product-tag-select');
            initializeSelect2('.product-type-select');
        });

        $('.open-time, .close-time').timepicker({
            timeFormat: 'HH:mm',
            interval: 15,
            forceRoundTime: true,
            lang: {
                decimal: '.',
                mins: 'dakika',
                hr: 'saat',
                hrs: 'saat'
            }
        });

    
        $('.status-select').on('change', function() {
            const day = $(this).data('day');
            const status = $(this).val();
            if (status === 'hours') {
                $(`#time_inputs_${day}`).show();
            } else {
                $(`#time_inputs_${day}`).hide();
            }
        });
        $('#apply-to-all').on('click', function() {
            const firstDay = daysOfWeek[0].day;
            const status = $(`#status_${firstDay}`).val();
            let openTime = $(`#open_${firstDay}`).val().trim();
            let closeTime = $(`#close_${firstDay}`).val().trim();
    
            if (status === 'hours') {
                if (openTime === '') openTime = '09:00';
                if (closeTime === '') closeTime = '22:00';
            }
    
            daysOfWeek.forEach(day => {
                if (day.day !== firstDay) {
                    $(`#status_${day.day}`).val(status).trigger('change');
                    if (status === 'hours') {
                        $(`#open_${day.day}`).val(openTime);
                        $(`#close_${day.day}`).val(closeTime);
                    } else if (status === 'closed') {
                        $(`#open_${day.day}`).val('Closed');
                        $(`#close_${day.day}`).val('Closed');
                    } else if (status === '24h') {
                        $(`#open_${day.day}`).val('24 saat');
                        $(`#close_${day.day}`).val('24 saat');
                    }
                }
            });
        });

    }
);

async function fetchContactCategories() {
    // const cachedCategories = localStorage.getItem('contactCategories');
    // if (cachedCategories) {
    //     return JSON.parse(cachedCategories);
    // } else {
        try {
            const response = await fetch('/_route/api/api/category/contacts');
            const data = await response.json();
            // localStorage.setItem('contactCategories', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('İletişim kategorileri alınırken hata oluştu:', error);
            return [];
        }
    // }
}
async function populateContactFields() {
    const contactCategories = await fetchContactCategories();
    const existingContacts = window.transporter.place.contacts || [];

    const existingContactsMap = {};
    existingContacts.forEach(contact => {
        const categoryId = contact.category.id.toString();
        existingContactsMap[categoryId] = contact;
    });

    const contactContainer = $('#contact-container');
    contactContainer.empty();

    contactCategories.forEach(category => {
        const categoryId = category.id.toString();
        const value = existingContactsMap[categoryId] ? existingContactsMap[categoryId].value : '';

        const contactField = `
            <div class="col-6 mb-3">
                <label class="form-label" for="contact_${categoryId}">
                    ${category.description}
                </label>
                <input id="contact_${categoryId}" name="contact_${categoryId}" class="form-control"
                       type="text" placeholder="İletişim bilgisi"
                       value="${value}"
                       data-category-id="${categoryId}">
            </div>
        `;
        contactContainer.append(contactField);
        $(`#contact_${categoryId}`).val(value);
    });
}

populateContactFields();

async function updateOpeningHours() {


    const existingOpeningHours = window.openingHours || [];
    const existingOpeningHoursMap = {
        'tr_TR': {},
        'en_EN': {}
    };

    existingOpeningHours.forEach(hours => {
        if (hours.languageCode === 'tr_TR') {
            existingOpeningHoursMap['tr_TR'][hours.day] = hours;
        } else if (hours.languageCode === 'en_EN') {
            existingOpeningHoursMap['en_EN'][hours.day] = hours;
        }
    });

    for (let i = 0; i < daysOfWeek.length; i++) {
        const day = daysOfWeek[i];
        const dayValue = day.day;
        const status = $(`#status_${dayValue}`).val();

        let openTime = '';
        let closeTime = '';
        let descriptionTR = '';
        let descriptionEN = '';

        if (status === 'hours') {
            openTime = $(`#open_${dayValue}`).val().trim();
            closeTime = $(`#close_${dayValue}`).val().trim();

            if (openTime === '' || closeTime === '') {
                status = 'closed';
                openTime = 'Closed';
                closeTime = 'Closed';
                descriptionTR = `${day.dayTextTR}: Kapalı`;
                descriptionEN = `${day.dayTextEN}: Closed`;
            } else {
                descriptionTR = `${day.dayTextTR}: ${openTime} - ${closeTime}`;
                descriptionEN = `${day.dayTextEN}: ${formatTimeTo12Hour(openTime)} - ${formatTimeTo12Hour(closeTime)}`;
            }
        }

        if (status === 'closed') {
            openTime = 'Closed';
            closeTime = 'Closed';
            descriptionTR = `${day.dayTextTR}: Kapalı`;
            descriptionEN = `${day.dayTextEN}: Closed`;
        } else if (status === '24h') {
            openTime = '24 saat';
            closeTime = '24 saat';
            descriptionTR = `${day.dayTextTR}: 24 Saat Açık`;
            descriptionEN = `${day.dayTextEN}: Open 24 hours`;
        }

        await upsertOpeningHour(
            dayValue,
            'tr_TR',
            day.dayTextTR,
            openTime,
            closeTime,
            descriptionTR,
            existingOpeningHoursMap['tr_TR']
        );

        await upsertOpeningHour(
            dayValue,
            'en_EN',
            day.dayTextEN,
            formatTimeTo12Hour(openTime),
            formatTimeTo12Hour(closeTime),
            descriptionEN,
            existingOpeningHoursMap['en_EN']
        );
    }
}

async function upsertOpeningHour(dayValue, languageCode, dayText, openTime, closeTime, description, existingHoursMap) {
    const openingHourData = {
        open: openTime,
        close: closeTime,
        dayText: dayText,
        languageCode: languageCode,
        description: description
    };

    if (existingHoursMap[dayValue]) {
        const openingHourId = existingHoursMap[dayValue].id;
        try {
            await $.ajax({
                url: `/_route/api/api/place/opening-hours/${openingHourId}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(openingHourData)
            });
        } catch (error) {
            console.error(`Çalışma saati güncelleme hatası (ID: ${openingHourId}, Dil: ${languageCode}):`, error);
            alert('Çalışma saati güncellenirken bir hata oluştu.');
        }
    } else {
        openingHourData.day = dayValue;
        openingHourData.place = `/api/places/${placeId}`;
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/opening-hours`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(openingHourData)
            });
        } catch (error) {
            console.error(`Çalışma saati oluşturma hatası (Dil: ${languageCode}):`, error);
            alert('Çalışma saati eklenirken bir hata oluştu.');
        }
    }
}

function formatTime(timeStr) {
    if (timeStr === 'Closed' || timeStr === '24 saat') {
        return timeStr;
    }
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}
function formatTimeTo12Hour(timeStr, lang) {
    if (timeStr === 'Closed' || timeStr === '24 saat') {
        return timeStr;
    }
    const [hour, minute] = timeStr.split(':');
    let hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);
    let period = '';
    period = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minuteNum < 10 ? '0' + minuteNum : minuteNum} ${period}`;
}


async function updatePlace() {
    const placeName = $('#place_name').val().trim();
    const primaryTypeId = $('#select-primary-type option:selected').data('primary-type-id');
    const rating = parseFloat($('#place_rate').val());
    const userRatingCount = parseInt($('#place_rating_count').val());

    const locationUuid = $('input[name="location_uuid"]').val();
    const latitude = parseFloat($('#place_location_latitude').val());
    const longitude = parseFloat($('#place_location_longitude').val());
    const zoom = parseInt($('#place_location_zoom').val());
    
    const addressUuid = $('input[name="address_uuid"]').val();
    const longAddress = $('#long_address').val();
    const shortAddress = $('#short_address').val();

const selectedTagIds = [];
$('#select-tag option:selected').each(function() {
    selectedTagIds.push($(this).data('tag-id'));
});
const selectedCategoryIds = [];
$('#select-category option:selected').each(function() {
    selectedCategoryIds.push($(this).data('category-id'));
});
const selectedTypeIds = [];
$('#select-type option:selected').each(function() {
    selectedTypeIds.push($(this).data('type-id'));
});
    const hashtags = selectedTagIds.map(id => `/api/tag/places/${id}`);
    const categories = selectedCategoryIds.map(id => `/api/category/places/${id}`);
    const types = selectedTypeIds.map(id => `/api/type/places/${id}`);

    const optionsData = {
        allowsDogs: $('#option-allows-dogs').is(':checked'),
        curbsidePickup: $('#option-curbside-pickup').is(':checked'),
        delivery: $('#option-delivery').is(':checked'),
        editorialSummary: $('#option-editorial-summary').is(':checked'),
        goodForChildren: $('#option-good-for-children').is(':checked'),
        goodForGroups: $('#option-good-for-groups').is(':checked'),
        goodForWatchingSports: $('#option-good-for-watching-sports').is(':checked'),
        liveMusic: $('#option-live-music').is(':checked'),
        takeout: $('#option-takeout').is(':checked'),
        menuForChildren: $('#option-menu-for-children').is(':checked'),
        servesVegetarianFood: $('#option-serves-vegetarian-food').is(':checked'),
        outdoorSeating: $('#option-outdoor-seating').is(':checked'),
        servesWine: $('#option-serves-wine').is(':checked'),
        reservable: $('#option-reservable').is(':checked'),
        servesLunch: $('#option-serves-lunch').is(':checked'),
        servesDinner: $('#option-serves-dinner').is(':checked'),
        servesDesserts: $('#option-serves-desserts').is(':checked'),
        servesCoffee: $('#option-serves-coffee').is(':checked'),
        servesCocktails: $('#option-serves-cocktails').is(':checked'),
        servesBrunch: $('#option-serves-brunch').is(':checked'),
        servesBreakfast: $('#option-serves-breakfast').is(':checked'),
        servesBeer: $('#option-serves-beer').is(':checked'),
        dineIn: $('#option-dine-in').is(':checked'),
        restroom: $('#option-restroom').is(':checked')
    };
    let optionsId = null;
    if (window.transporter.place.options && window.transporter.place.options.id) {
        optionsId = window.transporter.place.options.id;
    }

    if (optionsId) {
        try {
            await $.ajax({
                url: `/_route/api/api/place/options/${optionsId}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(optionsData)
            });
        } catch (error) {
            console.error('Options güncelleme hatası:', error);
            alert('İşletme seçenekleri güncellenirken bir hata oluştu.');
        }
    } else {
        optionsData.place = `/api/places/${placeId}`;
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/options`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(optionsData)
            });
            console.log('Options created successfully:', response);
        } catch (error) {
            console.error('Options oluşturma hatası:', error);
            alert('İşletme seçenekleri oluşturulurken bir hata oluştu.');
        }
    }
    const commericalTitle = $('#commerical_title').val().trim();
    const commericaltaxOffice = $('#commerical_tax_address').val().trim();
    const commericalMersisNumber = $('#commerical_mersis_number').val().trim();

    const commericalData = {
        title: commericalTitle,
        taxOffice: commericaltaxOffice,
        mersisNumber: commericalMersisNumber,
        place: `/api/places/${placeId}`
    };

    let commericalId = null;
    if (window.transporter.place.commericalInformation && window.transporter.place.commericalInformation.id) {
        commericalId = window.transporter.place.commericalInformation.id;
    }

    if (commericalId) {
        try {
            await $.ajax({
                url: `/_route/api/api/place/commerical-informations/${commericalId}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(commericalData)
            });
        } catch (error) {
            console.error('Ticari bilgi güncelleme hatası:', error);
            alert('Ticari bilgi güncellenirken bir hata oluştu.');
        }
    } else {
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/commerical-informations`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(commericalData)
            });
            console.log('Commerical information created successfully:', response);
        } catch (error) {
            console.error('Ticari bilgi oluşturma hatası:', error);
            alert('Ticari bilgi oluşturulurken bir hata oluştu.');
        }
    }
    
    const contactCategories = await fetchContactCategories();
    const existingContacts = window.transporter.place.contacts || [];

    const existingContactsMap = {};
    existingContacts.forEach(contact => {
        let categoryHref = contact.category;
        if (typeof categoryHref === 'object' && categoryHref['@id']) {
            categoryHref = categoryHref['@id'];
        } else if (typeof categoryHref !== 'string') {
            console.error('Beklenmeyen categoryHref tipi:', categoryHref);
            return;
        }
        const categoryId = categoryHref.split('/').pop();
        existingContactsMap[categoryId] = contact;
    });

    for (let i = 0; i < contactCategories.length; i++) {
        const category = contactCategories[i];
        const categoryId = category.id.toString();
        const categoryInputId = `contact_${categoryId}`;
        const value = $(`#${categoryInputId}`).val().trim();

        if (value !== '') {
            if (existingContactsMap[categoryId]) {
                const contactId = existingContactsMap[categoryId].id;
                const contactData = {
                    value: value,
                };
                try {
                    await $.ajax({
                        url: `/_route/api/api/place/contacts/${contactId}`,
                        type: 'PATCH',
                        contentType: 'application/merge-patch+json',
                        data: JSON.stringify(contactData)
                    });
                } catch (error) {
                    console.error(`İletişim bilgisi güncelleme hatası (ID: ${contactId}):`, error);
                    alert('İletişim bilgisi güncellenirken bir hata oluştu.');
                }
            } else {
                const contactData = {
                    value: value,
                    category: `/api/category/contacts/${categoryId}`,
                    place: `/api/places/${placeId}`
                };
                try {
                    const response = await $.ajax({
                        url: `/_route/api/api/place/contacts`,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(contactData)
                    });
                    console.log('İletişim bilgisi başarıyla oluşturuldu:', response);
                } catch (error) {
                    console.error('İletişim bilgisi oluşturma hatası:', error);
                    alert('İletişim bilgisi eklenirken bir hata oluştu.');
                }
            }
        } else {
            if (existingContactsMap[categoryId]) {
                const contactId = existingContactsMap[categoryId].id;
                try {
                    await $.ajax({
                        url: `/_route/api/api/place/contacts/${contactId}`,
                        type: 'DELETE',
                        contentType: 'application/json',
                    });
                } catch (error) {
                    console.error(`İletişim bilgisi silme hatası (ID: ${contactId}):`, error);
                    alert('İletişim bilgisi silinirken bir hata oluştu.');
                }
            }
        }
    }

    const placeData = {
      name: placeName,
      rating: rating,
      userRatingCount: userRatingCount,
      hashtags: hashtags,
      categories: categories,
      types: types
    };
    if (primaryTypeId) {
        placeData.primaryType = `/api/type/places/${primaryTypeId}`;
      }
    try {
      await $.ajax({
        url: `/_route/api/api/places/${placeId}`,
        type: 'PATCH',
        contentType: 'application/merge-patch+json',
        data: JSON.stringify(placeData)
      });
      console.log(placeData);
    } catch (error) {
      console.error('İşletme güncelleme hatası:', error);
      return;
    }

    const addressData = {
        shortAddress: shortAddress,
        longAddress: longAddress
    };

    if (addressUuid && addressUuid !== '0') {
        try {
            await $.ajax({
                url: `/_route/api/api/place/addresses/${addressUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(addressData)
            });
        } catch (error) {
            console.error('Adres güncelleme hatası:', error);
            alert('Adres güncellenirken bir hata oluştu.');
        }
    } else {
        addressData.place = `/api/places/${placeId}`;
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/addresses`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(addressData)
            });
            console.log("Adres başarıyla oluşturuldu:", response);
        } catch (error) {
            console.error('Adres oluşturma hatası:', error);
            alert('Adres oluşturulurken bir hata oluştu.');
        }
    }

  
    const locationData = {
      latitude: latitude,
      longitude: longitude,
      zoom: zoom
    };
  
    if (locationUuid && locationUuid !== '0') {
        try {
            await $.ajax({
                url: `/_route/api/api/place/locations/${locationUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(locationData)
            });
        } catch (error) {
            console.error('Adres güncelleme hatası:', error);
            alert('Adres güncellenirken bir hata oluştu.');
        }
    } else {
        locationData.place = `/api/places/${placeId}`;
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/locations`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(locationData)
            });
            console.log("Adres başarıyla oluşturuldu:", response);
        } catch (error) {
            console.error('Adres oluşturma hatası:', error);
            alert('Adres oluşturulurken bir hata oluştu.');
        }
    }
    await updateOpeningHours();
    toastr.success('İşletme başarıyla güncellendi.');

  }

  $('#button-save').on('click', function() {
    updatePlace();
  });