'use strict';

import { initializeSelect2 } from '../../util/select2.js?v=2';

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
    productCategories: [],
    productTypes: [],
    productTags: []
};

let applicationTypes = [];
let googleToAppTypeMapping = {};

$(document).ready(function () {
    initializeSelect2('#select-tag', 'bootstrap-5', 'Etiket seçiniz', false, false);
    initializeSelect2('#select-category', 'bootstrap-5', 'Kategori seçiniz', false, false);
    initializeSelect2('#select-type', 'bootstrap-5', 'Tür seçiniz', false, false);
    initializeSelect2('#select-primary-type', 'bootstrap-5', 'Birincil tür seçiniz', true, false);

    fetchAndPopulateTags();
    fetchAndPopulateCategories();
    fetchAndPopulateTypes().then(() => {
    });
    fetchAndPopulatePrimaryTypes();

    const accountsContainer = document.getElementById('accounts-container');

    Sortable.create(accountsContainer, {
        handle: '.drag-handle',
        animation: 150,
        onEnd: function () {
            $('#accounts-container li.list-group-item').each(function (index) {
                $(this).find('.account-priority-input').val(index + 1);
            });
        },
    });

    initializeTimePickers();
    initializeStatusSelects();
    initializeApplyToAllButton();
    populateOptions();
    populateProvinceSelect();
    initializeContactFields();

    $('#get-data-button').on('click', function () {
        const placeId = $('#google_place_id_input').val().trim();
        if (placeId) {
            clearAllInputs();
            getPlaceDetails(placeId);
        } else {
            alert('Lütfen geçerli bir Google Place ID giriniz.');
        }
    });

});

//google start
function getPlaceDetails(placeId) {
    $.ajax({
        url: '/admin/place/get-place-details',
        method: 'GET',
        data: {
            placeId: placeId
        },
        beforeSend: function () {
            $('#get-data-button').prop('disabled', true).text('Yükleniyor...');
        },
        success: function (data) {
            console.log(data);
            populateFormFields(data, placeId);
            $('#FormModal').modal('hide');
            toastr.success('İşletme bilgileri başarıyla alındı.');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching place details:', textStatus, errorThrown);
            toastr.error('İşletme bilgileri alınamadı. Lütfen Place ID\'yi ve API yapılandırmanızı kontrol ediniz.');
        },
        complete: function () {
            $('#get-data-button').prop('disabled', false).text('Verileri Al');
        }
    });
}

function clearAllInputs() {
    $('input').not('#google_place_id_input').val('');
    $('select').val('').trigger('change');
}


function populateFormFields(place, placeId) {
    // Temel Bilgiler
    $('#place_name').val(place.displayName ? place.displayName.text : '');
    $('#place_rate').val(place.rating || '');
    $('#place_rating_count').val(place.userRatingCount || '');

    if (place.location) {
        $('#place_location_latitude').val(place.location.latitude);
        $('#place_location_longitude').val(place.location.longitude);
        $('#place_location_zoom').val(15);
    }

    $('#long_address').val(place.formattedAddress || '');
    $('#short_address').val(place.shortFormattedAddress || '');

    const addressComponents = place.addressComponents;
    if (addressComponents) {
        let province = '';
        let district = '';
        let neighbourhood = '';
        let postalCode = '';
        let street = '';
        let streetNumber = '';

        addressComponents.forEach(component => {
            const types = component.types;

            if (types.includes('administrative_area_level_1')) {
                province = capitalizeWords(component.longText.toLowerCase());
            }
            if (types.includes('administrative_area_level_2')) {
                district = capitalizeWords(component.longText.toLowerCase());
            }
            if (types.includes('administrative_area_level_4') || types.includes('neighborhood') || types.includes('sublocality')) {
                neighbourhood = capitalizeWords(component.longText.toLowerCase().replace(/\s+mah$/i, '')).trim();
            }
            if (types.includes('postal_code')) {
                postalCode = component.longText;
            }
            if (types.includes('route')) {
                street = component.longText;
            }
            if (types.includes('street_number')) {
                streetNumber = component.longText;
            }
        });

        $('#province_select').val(province).trigger('change');

        setTimeout(function () {
            $('#district_select').val(district).trigger('change');
        }, 500);

        setTimeout(function () {
            $('#neighbourhood_select').val(neighbourhood).trigger('change');
        }, 1000);

        setTimeout(function () {
            $('#zipCode_input').val(postalCode);
            $('#street_input').val(street);
            $('#street_number_input').val(streetNumber);
        }, 1500);
    }

    if (place.nationalPhoneNumber) {
        $('#contact-container input[data-category-id="1"]').val(place.nationalPhoneNumber);
    }
    if (place.internationalPhoneNumber) {
        $('#contact-container input[data-category-id="2"]').val(place.internationalPhoneNumber);
    }
    if (place.websiteUri) {
        $('#contact-container input[data-category-id="3"]').val(place.websiteUri);
    }

    if (place.regularOpeningHours && place.regularOpeningHours.periods) {
        populateOpeningHours(place.regularOpeningHours.periods);
    }

    if (place.types) {
        mapGoogleTypesToYourTypes(place.types, place.primaryType);
    }

    if (place.googleMapsUri) {
        $('#sources-container .source-url-input[data-category-id="7"]').val(place.googleMapsUri);
        $('#sources-container .source-id-input[data-category-id="7"]').val(placeId);
    }

    if (place.reviews && place.reviews.length > 0) {
        populateReviews(place.reviews);
    }

    populateExtendedFields(place);
}

function populateExtendedFields(place) {
    const extendedFields = [
        'allowsDogs',
        'curbsidePickup',
        'delivery',
        'servesBeer',
        'dineIn',
        'editorialSummary',
        'goodForChildren',
        'goodForGroups',
        'goodForWatchingSports',
        'liveMusic',
        'takeout',
        'menuForChildren',
        'servesVegetarianFood',
        'outdoorSeating',
        'servesWine',
        'reservable',
        'servesLunch',
        'servesDinner',
        'servesDesserts',
        'servesCoffee',
        'servesCocktails',
        'servesBrunch',
        'servesBreakfast',
        'restroom',
        'pureServiceAreaBusiness'
    ];

    extendedFields.forEach(field => {
        if (field in place) {
            const checkboxId = `option-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`; 
            $(`#${checkboxId}`).prop('checked', place[field]);
        }
    });
}

function capitalizeWords(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function populateOpeningHours(periods) {
    const dayMapping = {
        0: 7,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6
    };

    daysOfWeek.forEach(day => {
        $(`#status_${day.day}`).val('closed').trigger('change');
        $(`#open_${day.day}`).val('');
        $(`#close_${day.day}`).val('');
    });

    periods.forEach(period => {
        const openDay = dayMapping[period.open.day];
        const closeDay = dayMapping[period.close.day];
        const openTime = `${period.open.hour}:${period.open.minute < 10 ? '0' : ''}${period.open.minute}`;
        const closeTime = `${period.close.hour}:${period.close.minute < 10 ? '0' : ''}${period.close.minute}`;

        $(`#status_${openDay}`).val('hours').trigger('change');
        $(`#open_${openDay}`).val(openTime);
        $(`#close_${openDay}`).val(closeTime);
    });
}

function formatTime(timeStr) {
    const hour = timeStr.substring(0, 2);
    const minute = timeStr.substring(2, 4);
    return `${hour}:${minute}`;
}

function mapGoogleTypesToYourTypes(googleTypes, primaryType) {
    const matchedTypeIds = [];
    let primaryTypeId = null;

    if (primaryType) {
        const normalizedPrimaryType = primaryType.toUpperCase();
        if (googleToAppTypeMapping[normalizedPrimaryType]) {
            primaryTypeId = googleToAppTypeMapping[normalizedPrimaryType].id.toString();
        }
    }

    googleTypes.forEach(googleType => {
        const normalizedGoogleType = googleType.toUpperCase();
        if (googleToAppTypeMapping[normalizedGoogleType]) {
            const appType = googleToAppTypeMapping[normalizedGoogleType];
            matchedTypeIds.push(appType.id.toString());

            if (!primaryTypeId) {
                primaryTypeId = appType.id.toString();
            }
        }
    });

    $('#select-type').val(matchedTypeIds).trigger('change');

    if (primaryTypeId) {
        $('#select-primary-type').val(primaryTypeId).trigger('change');
    }
}

function fetchAndPopulateTags() {
    return $.ajax({
        url: '/_text/place_tag',
        type: 'GET',
        success: function (data) {
            const tags = data.hits && data.hits.hits 
                ? data.hits.hits.map(hit => hit._source) 
                : [];

            const selectTag = $('#select-tag');
            selectTag.empty();

            if (tags.length > 0) {
                tags.forEach(tag => {
                    selectTag.append(`<option value="${tag.id}" data-tag-id="${tag.id}">${tag.tag}</option>`);
                });
            } else {
                console.warn('Etiket verileri bulunamadı veya boş geldi.');
            }

            initializeSelect2('#select-tag', 'bootstrap-5', 'Etiket seçiniz', false, false);
        },
        error: function (error) {
            console.error('Etiketler yüklenirken hata oluştu:', error);
        }
    });
}

function fetchAndPopulateCategories() {
    return $.ajax({
        url: '/_text/place_category/_search?size=1000',
        type: 'GET',
        success: function (data) {
            const categories = data.hits && data.hits.hits 
                ? data.hits.hits.map(hit => hit._source) 
                : [];

            const selectCategory = $('#select-category');
            selectCategory.empty();

            if (categories.length > 0) {
                categories.forEach(category => {
                    selectCategory.append(`<option value="${category.id}" data-category-id="${category.id}">${category.description}</option>`);
                });
            } else {
                console.warn('Kategori verileri bulunamadı veya boş geldi.');
            }

            initializeSelect2('#select-category', 'bootstrap-5', 'Kategori seçiniz', false, false);
        },
        error: function (error) {
            console.error('Kategoriler yüklenirken hata oluştu:', error);
        }
    });
}


function fetchAndPopulateTypes() {
    return $.ajax({
        url: '/_text/place_type/',
        type: 'GET',
        success: function (data) {
            const types = data.hits && data.hits.hits 
                ? data.hits.hits.map(hit => hit._source) 
                : [];

            const selectType = $('#select-type');
            selectType.empty();

            if (types.length > 0) {
                types.forEach(type => {
                    selectType.append(`<option value="${type.id}" data-type-id="${type.id}">${type.description}</option>`);
                    if (type.type) {
                        googleToAppTypeMapping[type.type.toUpperCase()] = type;
                    }
                });
            } else {
                console.warn('Tür verileri bulunamadı veya boş geldi.');
            }

            initializeSelect2('#select-type', 'bootstrap-5', 'Tür seçiniz', false, false);
            applicationTypes = types;
        },
        error: function (error) {
            console.error('Türler yüklenirken hata oluştu:', error);
        }
    });
}

function fetchAndPopulatePrimaryTypes() {
    return $.ajax({
        url: '/_text/place_type',
        type: 'GET',
        success: function (data) {
            const types = data.hits && data.hits.hits 
                ? data.hits.hits.map(hit => hit._source) 
                : [];

            const selectPrimaryType = $('#select-primary-type');
            selectPrimaryType.empty();
            selectPrimaryType.append('<option value="">Birincil tür seçiniz</option>');

            if (types.length > 0) {
                types.forEach(type => {
                    selectPrimaryType.append(`<option value="${type.id}" data-primary-type-id="${type.id}">${type.description}</option>`);
                });
            } else {
                console.warn('Birincil tür verileri bulunamadı veya boş geldi.');
            }

            initializeSelect2('#select-primary-type', 'bootstrap-5', 'Birincil tür seçiniz', true, false);
        },
        error: function (error) {
            console.error('Birincil türler yüklenirken hata oluştu:', error);
        }
    });
}
function collectFormData() {
    const placeName = $('#place_name').val().trim();
    const owner = $('#place_owner').is(':checked');
    const primaryTypeId = $('#select-primary-type').val() || null;
    const rating = parseFloat($('#place_rate').val()) || 0;
    const userRatingCount = parseInt($('#place_rating_count').val(), 10) || 0;

    const location = {
        latitude: parseFloat($('#place_location_latitude').val()) || 0,
        longitude: parseFloat($('#place_location_longitude').val()) || 0,
        zoom: parseInt($('#place_location_zoom').val(), 10) || 0
    };

    const address = {
        longAddress: $('#long_address').val().trim(),
        shortAddress: $('#short_address').val().trim(),
        province: $('#province_select').val(),
        district: $('#district_select').val(),
        neighbourhood: $('#neighbourhood_select').val(),
        postalCode: $('#zipCode_input').val().trim(),
        street: $('#street_input').val().trim(),
        streetNumber: $('#street_number_input').val().trim(),
        country: "Türkiye"
    };

    const hashtags = $('#select-tag').val() ? $('#select-tag').val().map(id => `/api/tag/places/${id}`) : [];
    const categories = $('#select-category').val() ? $('#select-category').val().map(id => `/api/category/places/${id}`) : [];
    const types = $('#select-type').val() ? $('#select-type').val().map(id => `/api/type/places/${id}`) : [];
    const reviews = $('#reviews-container .review-item').map(function () {
        return {
            text: $(this).find('.review-text').text(),
            rate: parseInt($(this).find('.review-rate').val(), 10),
            authorSrc: $(this).find('.review-author-src').attr('href'),
            languageCode: $(this).find('.review-language-code').val()
        };
    }).get();

    const optionsData = collectOptionsData();
    const commericalData = collectCommercialData();
    const openingHours = collectOpeningHours();

    return {
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
        reviews,
        optionsData,
        commericalData,
        openingHours
    };
}

function populateReviews(reviews) {
    const reviewsContainer = $('#reviews-container');
    reviewsContainer.empty();

    reviews.forEach(review => {
        const authorName = review.authorAttribution && review.authorAttribution.displayName 
            ? review.authorAttribution.displayName 
            : 'Anonim';
        const authorSrc = '/api/user/6e8ee311-e3e0-4344-ab24-5746b037315a/yakala';
        const text = review.originalText && review.originalText.text ? review.originalText.text : '';
        const rate = review.rating || 0;
        const languageCode = review.originalText && review.originalText.languageCode ? review.originalText.languageCode : 'tr';

        const reviewHtml = `
        <hr>
            <div class="review-item mb-4">
                <div class="d-flex align-items-center">
                    <img src="${review.authorAttribution && review.authorAttribution.photoUri ? review.authorAttribution.photoUri : 'https://via.placeholder.com/50'}" alt="Author" class="rounded-circle me-3">
                    <div>
                        <a href="${authorSrc}" class="review-author-src" target="_blank">${authorName} (Yaka.la olarak kayıt edilecek...)</a>
                        <span class="badge bg-${rate >= 4 ? 'success' : rate >= 2 ? 'warning' : 'danger'} ms-2">${rate} Yıldız</span>
                    </div>
                </div>
                <p class="mt-2 review-text">${text}</p>
                <input type="hidden" class="review-rate" value="${rate}">
                <input type="hidden" class="review-language-code" value="${languageCode}">
            </div>
        `;
        reviewsContainer.append(reviewHtml);
    });
}

function collectOptionsData() {
    const optionsData = {};

    Object.keys(optionsMapping).forEach(switchId => {
        const key = optionsMapping[switchId];
        optionsData[key] = $(`#${switchId}`).is(':checked');;
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

            const ohData = {
                open: openTime,
                close: closeTime,
                day: day.day,
                dayText: lang === 'tr_TR' ? day.dayTextTR : day.dayTextEN,
                languageCode: lang,
                description: description
            };

            openingHours.push(ohData);
        });
    });

    return openingHours;
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

$('#button-save').on('click', async function () {
    const saveButton = $(this);
    const originalText = saveButton.text();
    saveButton.text('Yükleniyor...').prop('disabled', true);

    try {
        await addPlace();
    } finally {
        saveButton.text(originalText).prop('disabled', false);
    }
});

function collectAddressComponents(addressData) {
    const components = [];

    if (addressData.province) {
        components.push({
            categories: [`/api/category/address/components/2`],
            shortText: addressData.province,
            longText: addressData.province,
            languageCode: 'tr'
        });
    }

    if (addressData.district) {
        components.push({
            categories: [`/api/category/address/components/3`],
            shortText: addressData.district,
            longText: addressData.district,
            languageCode: 'tr'
        });
    }

    if (addressData.neighbourhood) {
        components.push({
            categories: [`/api/category/address/components/4`],
            shortText: addressData.neighbourhood,
            longText: addressData.neighbourhood,
            languageCode: 'tr'
        });
    }

    if (addressData.postalCode) {
        components.push({
            categories: [`/api/category/address/components/6`],
            shortText: addressData.postalCode,
            longText: addressData.postalCode,
            languageCode: 'tr'
        });
    }

    if (addressData.street) {
        components.push({
            categories: [`/api/category/address/components/5`],
            shortText: addressData.street,
            longText: addressData.street,
            languageCode: 'tr'
        });
    }

    if (addressData.streetNumber) {
        components.push({
            categories: [`/api/category/address/components/8`],
            shortText: addressData.streetNumber,
            longText: addressData.streetNumber,
            languageCode: 'tr'
        });
    }

    components.push({
        categories: [`/api/category/address/components/1`],
        shortText: 'TR',
        longText: 'Türkiye',
        languageCode: 'tr'
    });

    return components;
}

function collectContacts() {
    const contacts = [];
    $('#contact-container input').each(function () {
        const value = $(this).val().trim();
        const categoryId = $(this).data('category-id');

        if (value !== '') {
            contacts.push({
                value: value,
                category: `/api/category/contacts/${categoryId}`
            });
        }
    });
    return contacts;
}

function collectAccounts() {
    const accounts = [];
    let priority = 1;
    $('#accounts-container li.list-group-item').each(function () {
        const accountUrl = $(this).find('.account-src-input').val().trim();
        const categoryId = $(this).data('category-id');

        if (accountUrl !== '') {
            accounts.push({
                category: `/api/category/accounts/${categoryId}`,
                src: accountUrl,
                priority: priority
            });
            priority++;
        }
    });
    return accounts;
}

function collectSources() {
    const sources = [];
    $('#sources-container .source-url-input').each(function () {
        const sourceUrl = $(this).val().trim();
        const categoryId = $(this).data('category-id');
        const sourceId = $(`.source-id-input[data-category-id="${categoryId}"]`).val().trim();

        if (sourceUrl !== '') {
            sources.push({
                category: `/api/category/sources/${categoryId}`,
                sourceUrl: sourceUrl,
                sourceId: sourceId
            });
        }
    });
    return sources;
}

async function addPlace() {
    const formData = collectFormData();

    try {
        const placeData = {
            name: formData.placeName,
            owner: formData.owner,
            rating: formData.rating,
            userRatingCount: formData.userRatingCount,
            address: {
                shortAddress: formData.address.shortAddress,
                longAddress: formData.address.longAddress,
                addressComponents: collectAddressComponents(formData.address)
            },
            location: {
                latitude: formData.location.latitude,
                longitude: formData.location.longitude,
                zoom: formData.location.zoom
            },
            contacts: collectContacts(),
            accounts: collectAccounts(),
            openingHours: formData.openingHours,
            options: formData.optionsData,
            sources: collectSources(),
            hashtags: formData.hashtags,
            categories: formData.categories,
            types: formData.types,
            primaryType: formData.primaryTypeId ? `/api/type/places/${formData.primaryTypeId}` : null,
            commericalInformation: formData.commericalData,
        };

        console.log("PlaceData: ", placeData);

        const response = await $.ajax({
            url: `/_route/api/api/places`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(placeData),
            headers: {
                'Accept': 'application/ld+json',
            }
        });

        console.log("server response: ", response);

        toastr.success('İşletme başarıyla eklendi.');
        const newPlaceId = response.id;
        const newPlaceUrl = `/api/places/${newPlaceId}`;
        await postReviews(formData.reviews, newPlaceUrl);

        // window.location.href = `/admin/place/edit/${response.id}`;

    } catch (error) {
        console.error('Yeni işletme eklenirken hata:', error);
        toastr.error('İşletme eklenirken bir hata oluştu.');
    }
}
async function postReviews(reviews, placeUrl) {
    for (const review of reviews) {
        const reviewData = {
            author: `${review.authorSrc}`,
            place: `${placeUrl}`,
            photos: [],
            text: review.text,
            rate: review.rate,
            languageCode: review.languageCode || 'tr'
        };

        try {
            const response = await $.ajax({
                url: '/_route/api/api/place/reviews',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(reviewData),
                headers: {
                    'Accept': 'application/json',
                }
            });
            toastr.success('Yorumlar başarıyla eklendi.');
        } catch (error) {
            console.error('Error posting review:', error);
        }
    }

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

function populateOptions() {
    for (const [switchId, optionKey] of Object.entries(optionsMapping)) {
        $(`#${switchId}`).prop('checked', false);
    }
}

async function populateProvinceSelect() {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        const provinceSelect = $('#province_select');
        provinceSelect.empty();
        provinceSelect.append('<option value="">Şehir seçiniz</option>');
        provinces.forEach(province => {
            provinceSelect.append(`<option value="${capitalizeWords(province.Province.toLowerCase())}">${capitalizeWords(province.Province.toLowerCase())}</option>`);
        });
        initializeSelect2('#province_select', 'bootstrap-5', 'İl seçiniz', true, false);

        initializeSelect2('#district_select', 'bootstrap-5', 'İlçe seçiniz', true, false);
        initializeSelect2('#neighbourhood_select', 'bootstrap-5', 'Mahalle seçiniz', true, false);

        $('#province_select').on('change', function () {
            const selectedProvince = $(this).val();
            if (selectedProvince) {
                populateDistrictSelect(selectedProvince, provinces);
            } else {
                $('#district_select').empty().append('<option value="">İlçe seçiniz</option>');
                $('#neighbourhood_select').empty().append('<option value="">Mahalle seçiniz</option>');
                $('#zipCode_input').val('');
            }
        });

        $('#district_select').on('change', function () {
            const selectedProvince = $('#province_select').val();
            const selectedDistrict = $(this).val();
            if (selectedDistrict) {
                populateNeighbourhoodSelect(selectedProvince, selectedDistrict, provinces);
                setZipCode(selectedProvince, selectedDistrict, provinces);
            } else {
                $('#neighbourhood_select').empty().append('<option value="">Mahalle seçiniz</option>');
                $('#zipCode_input').val('');
            }
        });

    } catch (error) {
        console.error('Şehirler yüklenirken hata oluştu:', error);
    }
}

function populateDistrictSelect(selectedProvince, provinces) {
    const districtSelect = $('#district_select');
    districtSelect.empty();
    districtSelect.append('<option value="">İlçe seçiniz</option>');

    const selectedProvinceData = provinces.find(province => capitalizeWords(province.Province.toLowerCase()) === selectedProvince);
    if (selectedProvinceData) {
        selectedProvinceData.Districts.forEach(district => {
            districtSelect.append(`<option value="${capitalizeWords(district.District.toLowerCase())}">${capitalizeWords(district.District.toLowerCase())}</option>`);
        });
    }

    districtSelect.val('').trigger('change');
}

function populateNeighbourhoodSelect(selectedProvince, selectedDistrict, provinces) {
    const neighbourhoodSelect = $('#neighbourhood_select');
    neighbourhoodSelect.empty();
    neighbourhoodSelect.append('<option value="">Mahalle seçiniz</option>');

    const selectedProvinceData = provinces.find(province => capitalizeWords(province.Province.toLowerCase()) === selectedProvince);
    if (selectedProvinceData) {
        const selectedDistrictData = selectedProvinceData.Districts.find(district => capitalizeWords(district.District.toLowerCase()) === selectedDistrict);
        if (selectedDistrictData) {
            let neighborhoods = [];
            if (selectedDistrictData.Towns) {
                selectedDistrictData.Towns.forEach(town => {
                    if (town.Neighbourhoods && town.Neighbourhoods.length > 0) {
                        town.Neighbourhoods.forEach(neighbourhood => {
                            const cleanedNeighbourhood = neighbourhood.replace(/\s?mah$/i, "");
                            neighborhoods.push(capitalizeWords(cleanedNeighbourhood.toLowerCase()));
                        });
                    }
                });
            }
            neighborhoods = [...new Set(neighborhoods)];

            neighborhoods.forEach(neighbourhood => {
                neighbourhoodSelect.append(`<option value="${neighbourhood}">${neighbourhood}</option>`);
            });
        }
    }

    neighbourhoodSelect.val('').trigger('change');
}

function setZipCode(selectedProvince, selectedDistrict, provinces) {
    let zipCode = '';
    const selectedProvinceData = provinces.find(province => capitalizeWords(province.Province.toLowerCase()) === selectedProvince);
    if (selectedProvinceData) {
        const selectedDistrictData = selectedProvinceData.Districts.find(district => capitalizeWords(district.District.toLowerCase()) === selectedDistrict);
        if (selectedDistrictData && selectedDistrictData.Towns && selectedDistrictData.Towns.length > 0) {
            zipCode = selectedDistrictData.Towns[0].ZipCode;
        }
    }
    $('#zipCode_input').val(zipCode);
}

async function initializeContactFields() {
    const contactCategories = await fetchContactCategories();
    const contactContainer = $('#contact-container');
    contactContainer.empty();

    contactCategories.forEach(category => {
        const categoryId = category.id.toString();

        const contactField = `
            <div class="col-6 mb-3">
                <label class="form-label" for="contact_${categoryId}">
                    ${category.description}
                </label>
                <input id="contact_${categoryId}" name="contact_${categoryId}" class="form-control"
                       type="text" placeholder="İletişim bilgisi"
                       value=""
                       data-category-id="${categoryId}">
            </div>
        `;
        contactContainer.append(contactField);
    });
}

async function fetchContactCategories() {
    try {
        const response = await fetch('/_route/api/api/category/contacts');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data['hydra:member'] || data;
    } catch (error) {
        console.error('İletişim kategorileri alınırken hata oluştu:', error);
        return [];
    }
}