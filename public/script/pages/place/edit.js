'use strict';

import { initializeSelect2, pushMulti, pushMultiForSelects } from '../../util/select2.js';
import { photoModal, photoModalAreas } from '../../util/modal.js';
import { control } from '../../util/modal-controller.js';

const placeId = $('#page-identifier-place-id').val();

const daysOfWeek = [
    { 'day': 1, 'dayTextTR': 'Pazartesi', 'dayTextEN': 'Monday' },
    { 'day': 2, 'dayTextTR': 'Salı', 'dayTextEN': 'Tuesday' },
    { 'day': 3, 'dayTextTR': 'Çarşamba', 'dayTextEN': 'Wednesday' },
    { 'day': 4, 'dayTextTR': 'Perşembe', 'dayTextEN': 'Thursday' },
    { 'day': 5, 'dayTextTR': 'Cuma', 'dayTextEN': 'Friday' },
    { 'day': 6, 'dayTextTR': 'Cumartesi', 'dayTextEN': 'Saturday' },
    { 'day': 7, 'dayTextTR': 'Pazar', 'dayTextEN': 'Sunday' }
];

const optionsMapping = {
    'option-allows-dogs': 'allowsDogs',
    'option-curbside-pickup': 'curbsidePickup',
    'option-delivery': 'delivery',
    'option-serves-beer': 'servesBeer',
    'option-dine-in': 'dineIn',
    'option-editorial-summary': 'editorialSummary',
    'option-good-for-children': 'goodForChildren',
    'option-good-for-groups': 'goodForGroups',
    'option-good-for-watching-sports': 'goodForWatchingSports',
    'option-live-music': 'liveMusic',
    'option-takeout': 'takeout',
    'option-menu-for-children': 'menuForChildren',
    'option-serves-vegetarian-food': 'servesVegetarianFood',
    'option-outdoor-seating': 'outdoorSeating',
    'option-serves-wine': 'servesWine',
    'option-reservable': 'reservable',
    'option-serves-lunch': 'servesLunch',
    'option-serves-dinner': 'servesDinner',
    'option-serves-desserts': 'servesDesserts',
    'option-serves-coffee': 'servesCoffee',
    'option-serves-cocktails': 'servesCocktails',
    'option-serves-brunch': 'servesBrunch',
    'option-serves-breakfast': 'servesBreakfast',
    'option-restroom': 'restroom'
};

window.transporter = {
    ...window.transporter,
    productCategories: [],
    productTypes: [],
    productTags: []
};

initializeSelect2('#select-tag');
initializeSelect2('#select-category');
initializeSelect2('#select-type');

async function fetchPhotoCategories() {
    try {
        const response = await $.ajax({
            url: '/_route/api/api/category/place/photos',
            method: 'GET',
            dataType: 'json',
        });
        window.photoCategories = response['hydra:member'] || response;
    } catch (error) {
        console.error('Fotoğraf kategorileri alınırken hata oluştu:', error);
        window.photoCategories = [];
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
        if (window.photoCategories.length > 0) {
            window.photoCategories.forEach(category => {
                categorySelect.append(`<option value="${category['id']}">${category.description}</option>`);
            });
        } else {
            categorySelect.append('<option value="" disabled>Kategori yüklenemedi</option>');
        }
    });

    $('#photoModal').on('submit', 'form', handlePhotoUpload);
});

async function handlePhotoUpload(e) {
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
        category: `/api/category/place/photos/${areas.categorySelect.value}`,
        showOnBanner: areas.showOnBannerSwitch.checked,
        showOnLogo: areas.showOnLogoSwitch.checked,
    };

    form.append('data', JSON.stringify(data));

    try {
        const response = await $.ajax({
            url: `/_api/api/place/${placeId}/image/photos`,
            method: 'POST',
            data: form,
            contentType: false,
            processData: false,
            headers: {
                'Accept': 'application/ld+json',
            },
            error: e => console.log(e.responseText),
            failure: e => console.log(e.responseText),
            success: response => {
                toastr.success('Fotoğraf başarıyla yüklendi.');
                console.log(response);

                //$('#photoModal').modal('hide');
                //$('#photoModal').remove();
            }
        });
    } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error.responseText);
        alert('Fotoğraf yüklenirken bir hata oluştu.');
    }
}

$(document).ready(function () {
    initializeDataPush();
    initializeProductsTable();
    initializeTimePickers();
    initializeStatusSelects();
    initializeApplyToAllButton();
    populateOptions();
});

function initializeDataPush() {
    pushMulti(
        'select-category',
        'data-category-id',
        'description',
        'id',
        '/api/category/places',
        error => console.log(error),
        failure => console.log(failure)
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
        error => console.log(error),
        failure => console.log(failure)
    );

    pushMulti(
        'select-tag',
        'data-tag-id',
        'tag',
        'id',
        '/api/tag/places',
        error => console.log(error),
        failure => console.log(failure)
    );

    $.ajax({
        url: '/_route/elasticsearch/product_category/_search?size=1000',
        method: 'GET',
        success: response => window.transporter.productCategories = response.hits,
        error: e => console.log(e.responseText),
        failure: e => console.log(e.responseText)
    });
}

function initializeProductsTable() {
    const products = $('table#productsTable').DataTable({
        processing: true,
        columns: [
            {
                data: "id",
                render: function (data) {
                    return `<a title="${data}">${data.slice(0, 5)}...</a>`;
                }
            },
            { data: "name" },
            {
                data: "active",
                render: function (data) {
                    return `
                        <div class="form-check form-switch form-check-success">
                            <input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                        </div>
                    `;
                }
            },
            { data: "description" },
            {
                data: "price",
                render: data => `<div class="text-center"><b>${data} ₺</b></div>`
            },
            {
                data: "categories",
                render: (data, type, row) => generateSelectOptions(data, window.transporter.productCategories, 'product-category')
            },
            {
                data: "types",
                render: (data, type, row) => generateSelectOptions(data, window.transporter.productTypes, 'product-type')
            },
            {
                data: "hashtags",
                render: (data, type, row) => generateSelectOptions(data, window.transporter.productTags, 'product-tag')
            },
            {
                data: null,
                render: function (data, type, row) {
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
                        </a>
                    `;
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
    });

    products.clear().rows.add(getInitialProducts()).draw();

    initializeSelect2('.product-category-select');
    initializeSelect2('.product-tag-select');
    initializeSelect2('.product-type-select');

    products.on('draw', () => {
        initializeSelect2('.product-category-select');
        initializeSelect2('.product-tag-select');
        initializeSelect2('.product-type-select');
    });
}

function generateSelectOptions(data, allOptions, type) {
    let template = '';
    if (data && Array.isArray(data)) {
        data.forEach(d => {
            template += `<option value="${d.id}" selected>${d.description}</option>`;
        });
    }
    allOptions.forEach(option => {
        template += `<option value="${option._id}">${option._source.description}</option>`;
    });
    return `<select data-placeholder="Hiç ${type} belirtilmedi" multiple class="form-select ${type}-select">${template}</select>`;
}

function getInitialProducts() {
    return (window.transporter && window.transporter.place && window.transporter.place.products) || [];
}

function initializeTimePickers() {
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
}

function initializeStatusSelects() {
    $('.status-select').on('change', function () {
        const day = $(this).data('day');
        const status = $(this).val();
        if (status === 'hours') {
            $(`#time_inputs_${day}`).show();
        } else {
            $(`#time_inputs_${day}`).hide();
        }
    });
}

function initializeApplyToAllButton() {
    $('#apply-to-all').on('click', function () {
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
                    $(`#open_${day.day}`).val('Kapalı');
                    $(`#close_${day.day}`).val('Kapalı');
                } else if (status === '24h') {
                    $(`#open_${day.day}`).val('24 saat');
                    $(`#close_${day.day}`).val('24 saat');
                }
            }
        });
    });
}

async function fetchContactCategories() {
    try {
        const response = await fetch('/_route/api/api/category/contacts');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('İletişim kategorileri alınırken hata oluştu:', error);
        return [];
    }
}

async function populateContactFields() {
    const contactCategories = await fetchContactCategories();
    const existingContacts = window.transporter.place.contacts || [];

    const existingContactsMap = new Map(existingContacts.map(contact => {
        const categoryId = extractCategoryId(contact.category);
        return [categoryId, contact];
    }));

    const contactContainer = $('#contact-container');
    contactContainer.empty();

    contactCategories.forEach(category => {
        const categoryId = category.id.toString();
        const value = existingContactsMap.get(categoryId)?.value || '';

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
    });
}

populateContactFields();

function extractCategoryId(category) {
    if (typeof category === 'object' && category['@id']) {
        return category['@id'].split('/').pop();
    } else if (typeof category === 'string') {
        return category.split('/').pop();
    }
    console.error('Beklenmeyen category tipi:', category);
    return null;
}

function formatTimeTo12Hour(timeStr) {
    const lowerTimeStr = timeStr.toLowerCase();
    if (lowerTimeStr === 'closed' || lowerTimeStr === 'kapalı') {
        return timeStr;
    }
    if (lowerTimeStr === '24 saat' || lowerTimeStr === '24 hours') {
        return timeStr;
    }
    const [hour, minute] = timeStr.split(':');
    let hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minuteNum < 10 ? '0' + minuteNum : minuteNum} ${period}`;
}

function collectOptionsData() {
    const optionsData = {};

    Object.keys(optionsMapping).forEach(switchId => {
        const key = optionsMapping[switchId];
        const isChecked = $(`#${switchId}`).is(':checked');
        optionsData[key] = isChecked;
    });

    return optionsData;
}

function collectCommercialData() {
    return {
        title: $('#commerical_title').val().trim(),
        taxOffice: $('#commerical_tax_address').val().trim(),
        mersisNumber: $('#commerical_mersis_number').val().trim()
    };
}

function collectOpeningHours() {
    const openingHours = [];

    daysOfWeek.forEach(day => {
        ['tr_TR', 'en_EN'].forEach(lang => {
            let status = $(`#status_${day.day}`).val();
            let openTime = '';
            let closeTime = '';
            let description = '';

            if (status === 'hours') {
                openTime = $(`#open_${day.day}`).val().trim();
                closeTime = $(`#close_${day.day}`).val().trim();

                if (openTime === '' || closeTime === '') {
                    status = 'closed';
                    openTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                    closeTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                }

                if (status === 'hours') {
                    description = lang === 'tr_TR' 
                        ? `${day.dayTextTR}: ${openTime} - ${closeTime}` 
                        : `${day.dayTextEN}: ${formatTimeTo12Hour(openTime)} - ${formatTimeTo12Hour(closeTime)}`;
                }
            }

            if (status === 'closed') {
                openTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                closeTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                description = lang === 'tr_TR' 
                    ? `${day.dayTextTR}: Kapalı` 
                    : `${day.dayTextEN}: Closed`;
            } else if (status === '24h') {
                openTime = lang === 'tr_TR' ? '24 saat' : '24 hours';
                closeTime = lang === 'tr_TR' ? '24 saat' : '24 hours';
                description = lang === 'tr_TR' 
                    ? `${day.dayTextTR}: 24 Saat Açık` 
                    : `${day.dayTextEN}: Open 24 hours`;
            }

            const existingHour = window.transporter.place.openingHours.find(oh => oh.day === day.day && oh.languageCode === lang);
            const openingHourId = existingHour ? existingHour.id : null;

            const ohData = {
                open: openTime,
                close: closeTime,
                day: day.day,
                dayText: lang === 'tr_TR' ? day.dayTextTR : day.dayTextEN,
                languageCode: lang,
                description: description
            };

            if (openingHourId) {
                ohData.id = openingHourId;
            }

            openingHours.push(ohData);
        });
    });

    return openingHours;
}

initializeSelect2('#province_select', 'bootstrap-5', 'İl seçiniz', true, false);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function populateProvinceSelect() {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        const provinceSelect = $('#province_select');
        provinceSelect.empty();
        provinceSelect.append('<option value="">Şehir seçiniz</option>');
        provinces.forEach(province => {
            provinceSelect.append(`<option value="${capitalizeFirstLetter(province.Province)}">${capitalizeFirstLetter(province.Province)}</option>`);
        });

        const defaultProvince = 'İzmir';
        if (provinces.some(p => capitalizeFirstLetter(p.Province) === defaultProvince)) {
            provinceSelect.val(defaultProvince).trigger('change');
        }
    } catch (error) {
        console.error('Şehirler yüklenirken hata oluştu:', error);
    }
}

async function populateDistrictSelect(provinceName) {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        const province = provinces.find(p => capitalizeFirstLetter(p.Province) === provinceName);
        const districtSelect = $('#district_select');
        districtSelect.empty();
        districtSelect.append('<option value="">İlçe seçiniz</option>');
        if (province && province.Districts) {
            province.Districts.forEach(district => {
                districtSelect.append(`<option value="${capitalizeFirstLetter(district.District)}">${capitalizeFirstLetter(district.District)}</option>`);
            });
        }

        initializeSelect2('#district_select', 'bootstrap-5', 'İlçe seçiniz', true, false);

        $('#neighbourhood_select').empty().append('<option value="">Mahalle seçiniz</option>');
        $('#zipCode_input').val('');
    } catch (error) {
        console.error('İlçeler yüklenirken hata oluştu:', error);
    }
}

async function populateNeighbourhoodSelect(provinceName, districtName) {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        const province = provinces.find(p => capitalizeFirstLetter(p.Province) === provinceName);
        if (!province) return;

        const district = province.Districts.find(d => capitalizeFirstLetter(d.District) === districtName);
        if (!district) return;

        const neighbourhoodSelect = $('#neighbourhood_select');
        neighbourhoodSelect.empty();
        neighbourhoodSelect.append('<option value="">Mahalle seçiniz</option>');

        const allNeighbourhoods = [];
        if (district.Towns) {
            district.Towns.forEach(town => {
                if (town.Neighbourhoods) {
                    town.Neighbourhoods.forEach(neighbourhood => {
                        allNeighbourhoods.push(capitalizeFirstLetter(neighbourhood));
                    });
                }
            });
        }

        const uniqueNeighbourhoods = [...new Set(allNeighbourhoods)];

        uniqueNeighbourhoods.forEach(neighbourhood => {
            neighbourhoodSelect.append(`<option value="${neighbourhood}">${neighbourhood}</option>`);
        });

        initializeSelect2('#neighbourhood_select', 'bootstrap-5', 'Mahalle seçiniz', true, false);

    } catch (error) {
        console.error('Mahalleler yüklenirken hata oluştu:', error);
    }
}
async function setZipCode(districtName) {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        let zipCode = '';
        provinces.forEach(province => {
            const district = province.Districts.find(d => capitalizeFirstLetter(d.District) === districtName);
            if (district && district.Towns && district.Towns.length > 0) {
                zipCode = district.Towns[0].ZipCode;
            }
        });
        $('#zipCode_input').val(zipCode);
    } catch (error) {
        console.error('Posta kodu ayarlanırken hata oluştu:', error);
    }
}

$('#province_select').on('change', function() {
    const selectedProvince = $(this).val();
    if (selectedProvince) {
        populateDistrictSelect(selectedProvince);
    } else {
        $('#district_select').empty().append('<option value="">İlçe seçiniz</option>');
        $('#neighbourhood_select').empty().append('<option value="">Mahalle seçiniz</option>');
        $('#zipCode_input').val('');
    }
});

$('#district_select').on('change', function() {
    const selectedProvince = $('#province_select').val();
    const selectedDistrict = $(this).val();
    if (selectedDistrict) {
        populateNeighbourhoodSelect(selectedProvince, selectedDistrict);
        setZipCode(selectedDistrict);
    } else {
        $('#neighbourhood_select').empty().append('<option value="">Mahalle seçiniz</option>');
        $('#zipCode_input').val('');
    }
});

$(document).ready(function () {
    populateProvinceSelect();
});

function collectFormData() {
    const placeName = $('#place_name').val().trim();
    const owner = $('#place_owner').is(':checked');
    const primaryTypeId = $('#select-primary-type option:selected').data('primary-type-id') || null;
    const rating = parseFloat($('#place_rate').val()) || 0;
    const userRatingCount = parseInt($('#place_rating_count').val(), 10) || 0;

    const locationUuid = $('input[name="location_uuid"]').val();
    const latitude = parseFloat($('#place_location_latitude').val()) || 0;
    const longitude = parseFloat($('#place_location_longitude').val()) || 0;
    const zoom = parseInt($('#place_location_zoom').val(), 10) || 0;

    const addressUuid = $('input[name="address_uuid"]').val();
    const longAddress = $('#long_address').val().trim();
    const shortAddress = $('#short_address').val().trim();
    const city = $('#city_select').val();
    const district = $('#district_select').val();

    const selectedTagIds = [];
    $('#select-tag option:selected').each(function () {
        selectedTagIds.push($(this).data('tag-id'));
    });
    const selectedCategoryIds = [];
    $('#select-category option:selected').each(function () {
        selectedCategoryIds.push($(this).data('category-id'));
    });
    const selectedTypeIds = [];
    $('#select-type option:selected').each(function () {
        selectedTypeIds.push($(this).data('type-id'));
    });
    const hashtags = selectedTagIds.map(id => `/api/tag/places/${id}`);
    const categories = selectedCategoryIds.map(id => `/api/category/places/${id}`);
    const types = selectedTypeIds.map(id => `/api/type/places/${id}`);

    const optionsData = collectOptionsData();
    const commericalData = collectCommercialData();
    const openingHours = collectOpeningHours();

    return {
        placeId,
        placeName,
        owner,
        primaryTypeId,
        rating,
        userRatingCount,
        location: { locationUuid, latitude, longitude, zoom },
        address: { addressUuid, longAddress, shortAddress },
        hashtags,
        categories,
        types,
        optionsData,
        commericalData,
        openingHours
    };
}

async function synchronizeData(data) {
    const {
        placeId,
        placeName,
        owner,
        primaryTypeId,
        rating,
        userRatingCount,
        location,
        address,
        hashtags,
        categories,
        types,
        openingHours,
        commericalData
    } = data;

    const placeData = {
        name: placeName,
        owner: owner,
        rating: rating,
        userRatingCount: userRatingCount,
        hashtags: hashtags,
        categories: categories,
        types: types,
        primaryType: primaryTypeId ? `/api/type/places/${primaryTypeId}` : undefined,
        openingHours: openingHours,
        commericalInformation: commericalData
    };

    try {
        await syncPlace(placeData);
    } catch (error) {
        console.error('Veri senkronizasyon hatası:', error);
        throw error;
    }
}

async function syncPlace(placeData) {
    console.log('Place updated successfully:', placeData);
    try {
        await $.ajax({
            url: `/_route/api/api/places/${placeId}`,
            type: 'PATCH',
            contentType: 'application/merge-patch+json',
            data: JSON.stringify(placeData),
            headers: {
                'Accept': 'application/ld+json',
            },
            success: function(response) {
                console.log('Response from server:', response);
            }
        });
    } catch (error) {
        console.error('İşletme güncelleme hatası:', error);
        throw new Error('İşletme güncellenirken bir hata oluştu.');
    }
}


async function updateContacts() {
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
}

async function updateAddress(addressData) {
    const { addressUuid, longAddress, shortAddress } = addressData;
    const payload = { shortAddress, longAddress };

    if (addressUuid && addressUuid !== '0') {
        try {
            await $.ajax({
                url: `/_route/api/api/place/addresses/${addressUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Adres güncelleme hatası:', error);
            alert('Adres güncellenirken bir hata oluştu.');
        }
    } else {
        payload.place = `/api/places/${placeId}`;
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/addresses`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Adres oluşturma hatası:', error);
            alert('Adres oluşturulurken bir hata oluştu.');
        }
    }
}

async function updateLocation(locationData) {
    const { locationUuid, latitude, longitude, zoom } = locationData;
    const payload = { latitude, longitude, zoom };

    if (locationUuid && locationUuid !== '0') {
        try {
            await $.ajax({
                url: `/_route/api/api/place/locations/${locationUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Lokasyon güncelleme hatası:', error);
            alert('Lokasyon güncellenirken bir hata oluştu.');
        }
    } else {
        payload.place = `/api/places/${placeId}`;
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/locations`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Lokasyon oluşturma hatası:', error);
            alert('Lokasyon oluşturulurken bir hata oluştu.');
        }
    }
}

async function updateOptions(optionsData) {
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
                data: JSON.stringify(optionsData),
                headers: {
                    'Accept': 'application/ld+json',
                },
            });
        } catch (error) {
            console.error('Options güncelleme hatası:', error);
            alert('İşletme seçenekleri güncellenirken bir hata oluştu.');
        }
    } else {
        const payload = {
            ...optionsData,
            place: `/api/places/${placeId}`
        };
        try {
            const response = await $.ajax({
                url: `/_route/api/api/place/options`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/ld+json',
                },
            });
        } catch (error) {
            console.error('Options oluşturma hatası:', error);
            alert('İşletme seçenekleri oluşturulurken bir hata oluştu.');
        }
    }
}

function populateOptions() {
    const options = window.transporter.place.options || {};

    for (const [switchId, optionKey] of Object.entries(optionsMapping)) {
        const isChecked = options[optionKey] || false;
        $(`#${switchId}`).prop('checked', isChecked);
    }
}

$('#button-save').on('click', async function () {
    const saveButton = $(this);
    const originalText = saveButton.text();
    saveButton.text('Yükleniyor...').prop('disabled', true);

    try {
        await updatePlace();
    } finally {
        saveButton.text(originalText).prop('disabled', false);
    }
});

async function saveSources() {
    const placeId = $('#page-identifier-place-id').val(); 
    const sourcesContainer = $('#sources-container');
    const sourceUrlInputs = sourcesContainer.find('.source-url-input');
    
    let existingSources = window.transporter.place.sources || [];
    const existingSourcesMap = {};
    existingSources.forEach(source => {
        existingSourcesMap[source.category.id] = source;
    });

    const promises = [];

    sourceUrlInputs.each(function () {
        const urlInput = $(this);
        const categoryId = urlInput.data('category-id');
        const sourceUrl = urlInput.val().trim();
        const sourceId = sourcesContainer.find(`.source-id-input[data-category-id="${categoryId}"]`).val().trim();
        
        const existingSource = existingSourcesMap[categoryId];

        if (sourceUrl !== '') {
            if (existingSource) {
                if (sourceUrl !== existingSource.sourceUrl || sourceId !== existingSource.sourceId) {
                    const patchData = { sourceUrl, sourceId };
                    promises.push(
                        $.ajax({
                            url: `/_route/api/api/source/places/${existingSource.id}`,
                            type: 'PATCH',
                            contentType: 'application/merge-patch+json',
                            data: JSON.stringify(patchData),
                            headers: { 'Accept': 'application/ld+json' },
                        })
                    );
                }
            } else {
                const postData = { place: `/api/places/${placeId}`, category: `/api/category/sources/${categoryId}`, sourceUrl, sourceId };
                promises.push(
                    $.ajax({
                        url: '/_route/api/api/source/places',
                        type: 'POST',
                        contentType: 'application/ld+json',
                        data: JSON.stringify(postData),
                        headers: { 'Accept': 'application/ld+json' },
                    }).done(response => {
                        existingSources.push(response);
                    })
                );
            }
        } else {
            if (existingSource) {
                promises.push(
                    $.ajax({
                        url: `/_route/api/api/source/places/${existingSource.id}`,
                        type: 'DELETE',
                        headers: { 'Accept': 'application/ld+json' },
                    }).done(() => {
                        existingSources = existingSources.filter(source => source.category.id !== categoryId);
                    })
                );
            }
        }
    });

    try {
        await Promise.all(promises);
        window.transporter.place.sources = existingSources;
    } catch (error) {
        console.error('Kaynakları kaydederken hata oluştu:', error);
        toastr.error('Kaynakları kaydederken bir hata oluştu.');
    }
}

$(document).ready(function () {
    const accountsContainer = document.getElementById('accounts-container');
    
    Sortable.create(accountsContainer, {
        handle: '.drag-handle',
        animation: 150,
        onEnd: function () {
            $('#accounts-container li.list-group-item').each(function(index) {
                $(this).find('.account-priority-input').val(index + 1);
            });
        },
    });
    
    sortAccountsByPriority();
});

function sortAccountsByPriority() {
    const accountsContainer = $('#accounts-container');
    const accounts = accountsContainer.find('li.list-group-item').get();

    accounts.sort(function(a, b) {
        const priorityA = parseInt($(a).find('.account-priority-input').val()) || 6;
        const priorityB = parseInt($(b).find('.account-priority-input').val()) || 6;
        return priorityA - priorityB;
    });

    $.each(accounts, function(index, account) {
        accountsContainer.append(account);
    });
}

async function saveAccounts() {
    const placeId = $('#page-identifier-place-id').val();
    const accountsContainer = $('#accounts-container');
    const sortedAccounts = accountsContainer.find('li.list-group-item');
    
    let existingAccounts = window.transporter.place.accounts || [];
    const existingAccountsMap = {};
    existingAccounts.forEach(account => {
        existingAccountsMap[account.category.id] = account;
    });

    const promises = [];
    let priority = 1;

    sortedAccounts.each(function () {
        const categoryId = $(this).data('category-id');
        const accountUrl = $(this).find('.account-src-input').val().trim();

        if (accountUrl !== '') {
            const existingAccount = existingAccountsMap[categoryId];

            if (existingAccount) {
                if (accountUrl !== existingAccount.src || priority !== existingAccount.priority) {
                    const patchData = { src: accountUrl, priority: priority };
                    promises.push(
                        $.ajax({
                            url: `/_route/api/api/place/accounts/${existingAccount.id}`,
                            type: 'PATCH',
                            contentType: 'application/merge-patch+json',
                            data: JSON.stringify(patchData),
                            headers: { 'Accept': 'application/ld+json' },
                        })
                    );
                }
            } else {
                const postData = { 
                    place: `/api/places/${placeId}`, 
                    category: `/api/category/accounts/${categoryId}`, 
                    src: accountUrl, 
                    priority: priority 
                };
                promises.push(
                    $.ajax({
                        url: '/_route/api/api/place/accounts',
                        type: 'POST',
                        contentType: 'application/ld+json',
                        data: JSON.stringify(postData),
                        headers: { 'Accept': 'application/ld+json' },
                    }).done(response => {
                        existingAccounts.push(response);
                    })
                );
            }
            priority++;
        } else {
            const existingAccount = existingAccountsMap[categoryId];
            if (existingAccount) {
                promises.push(
                    $.ajax({
                        url: `/_route/api/api/place/accounts/${existingAccount.id}`,
                        type: 'DELETE',
                        headers: { 'Accept': 'application/ld+json' },
                    }).done(() => {
                        existingAccounts = existingAccounts.filter(account => account.category.id !== categoryId);
                    })
                );
            }
        }
    });

    try {
        await Promise.all(promises);
        window.transporter.place.accounts = existingAccounts;
    } catch (error) {
        console.error('Hesapları kaydederken hata oluştu:', error);
        toastr.error('Hesapları kaydederken bir hata oluştu.');
    }
}


async function updatePlace() {
    const formData = collectFormData();

    try {
        await updateOptions(formData.optionsData);
        
        await updateContacts();
        
        await updateAddress(formData.address);
        
        await updateLocation(formData.location);
        
        await saveSources();
        await saveAccounts();
        
        toastr.success('İşletme başarıyla güncellendi.');
        await synchronizeData(formData);
    } catch (error) {
        console.error('İşletme güncelleme hatası:', error);
        toastr.error('İşletme güncellenirken bir hata oluştu.');
    }
}