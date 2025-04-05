'use strict';
import {initializeSelect2Auto} from "../../modules/bundles/select-bundle/select2.js";
import {apiGet} from "../../modules/bundles/api-controller/ApiController.js";


/**
 * @param {string} str
 * @param {string} spl
 * @returns {string}
 */
const toCamelCase = (str, spl = '-')=>{
    const pascalCase = str.split(spl).map(each=> each[0].toUpperCase() + each.slice(1)).join('');
    return pascalCase.at(0).toLowerCase()+pascalCase.slice(1);
};


function capitalizeWords(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


window.address_bundle_no_populate = true;
$.InitializeAddressZone();
window.place_description_adapter = data => ({text: data.description, id: data.id});
window.place_tag_adapter = data => ({text: data.tag, id: data.id});
initializeSelect2Auto();
initContactZone();
initAccountZone();



/*
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
 */


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
    productCategories: [],
    productTypes: [],
    productTags: []
};

let googleToAppTypeMapping = {};

$(document).ready(function () {

    // Initialize time pickers
    $('.open-time, .close-time').timepicker({
        timeFormat: 'HH:mm',
        interval: 15,
        forceRoundTime: true,
        lang: {decimal: '.', mins: 'dakika', hr: 'saat', hrs: 'saat'}
    });

    // initialize status selects
    $('.status-select').on('change', function () {
        const day = $(this).data('day');
        const status = $(this).val();
        if (status === 'hours') {
            $(`#time_inputs_${day}`).show();
        } else {
            $(`#time_inputs_${day}`).hide();
        }
    });

    initializeApplyToAllButton();


    $('#get-data-button').on('click', () => {
        const id = $('#google_place_id_input').val()?.trim();
        if (typeof id !== 'string' || id.length < 10) {
            alert('Lütfen geçerli bir Google Place ID giriniz.');
            return;
        }
        clearAllInputs();
        getPlaceDetails(id);
    });

});

const clearAllInputs = () => {
    $('input').not('#google_place_id_input').val('');
    $('select').val('').trigger('change');
};

//google start
const getPlaceDetails = (id) => {

    const button = $('#get-data-button');
    button.prop('disabled', true).text('Yükleniyor...');

    apiGet(`/_google/place/details/${id}`,
        {
            successMessage: 'İşletme bilgileri başarıyla alındı',
            success: (data) => {
                populateFormFields(data, id);
                $('#google-data-modal').modal('hide');
                button.prop('disabled', false).text('Ara');
            },
            errorMessage: 'İşletme bilgileri alınamadı. Lütfen Place ID\'yi ve API yapılandırmanızı kontrol ediniz.'
        }
    );
};

/**
 * @param {object} place
 * @param {string} id
 */
function populateFormFields(place, id) {
    $('#place_name').val(place.displayName?.text ?? '');
    $('#place_rate').val(place.rating ?? '');
    $('#place_rating_count').val(place?.userRatingCount ?? '');

    if (place.location) {
        $('#place_location_latitude').val(place.location.latitude ?? '');
        $('#place_location_longitude').val(place.location.longitude ?? '');
        $('#place_location_zoom').val(15);
    }

    $('#place_long_address').val(place.formattedAddress || '');
    $('#place_short_address').val(place.shortFormattedAddress || '');

    const addressComponents = place.addressComponents;
    if (addressComponents)
    {
        let province = '';
        let district = '';
        let neighbourhood = '';
        let postalCode = '';
        let street = '';
        let streetNumber = '';

        addressComponents.forEach(component => {
            const types = component.types;

            if (types.includes('administrative_area_level_1')) province = capitalizeWords(component.longText.toLowerCase());

            if (types.includes('administrative_area_level_2')) district = capitalizeWords(component.longText.toLowerCase());

            if (types.includes('administrative_area_level_4') || types.includes('neighborhood') || types.includes('sublocality')) {
                neighbourhood = capitalizeWords(component.longText.toLowerCase().replace(/\s+mah$/i, '')).trim();
            }

            if (types.includes('postal_code')) postalCode = component.longText;

            if (types.includes('route')) street = component.longText;

            if (types.includes('street_number')) streetNumber = component.longText;

        });

        new Promise((res) => res($('#province_select').val(province).trigger('change')))
            .then(() => $('#district_select').val(district).trigger('change'))
            .then(() => $('#neighbourhood_select').val(neighbourhood).trigger('change'))
            .then(() => {
                $('#place_zip_code').val(postalCode);
                $('#place_street').val(street);
                $('#place_street_number').val(streetNumber);
            });
    }

    if (place.hasOwnProperty('nationalPhoneNumber')) {
        $('#contact-container input[data-category-id="1"]').val(place.nationalPhoneNumber);
    }
    if (place.hasOwnProperty('internationalPhoneNumber')) {
        $('#contact-container input[data-category-id="2"]').val(place.internationalPhoneNumber);
    }
    if (place.hasOwnProperty('websiteUri')) {
        $('#contact-container input[data-category-id="3"]').val(place.websiteUri);
    }

    if (place.hasOwnProperty('regularOpeningHours') && place.regularOpeningHours.hasOwnProperty('periods')) {
        populateOpeningHours(place.regularOpeningHours.periods);
    }

    if (place.types) {
        mapGoogleTypesToYourTypes(place.types, place.primaryType);
    }

    if (place.hasOwnProperty('googleMapsUri')) {
        $('#sources-container .source-url-input[data-category-id="7"]').val(place.googleMapsUri);
        $('#sources-container .source-id-input[data-category-id="7"]').val(id);
    }

    if (place.reviews && place.reviews.length > 0) {
        populateReviews(place.reviews);
    }

    $('.place-option').each((index, element)=>{
        element.checked = place[toCamelCase(element.id)]
    });
}


function populateOpeningHours(periods) {
    const dayMapping = {0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6};

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


function collectFormData()
{
    const id = $('#select-primary-type').val().trim();
    return  {
        name: $('#place_name').val().trim(),
        owner: $('#place_owner').is(':checked'),
        primaryType: typeof id === 'string' && id.length > 0 ? `/api/type/places/${id}` : undefined,
        rating: parseFloat($('#place_rate').val()) || 0,
        userRatingCount: parseInt($('#place_rating_count').val(), 10) || 0,
        location: {
            latitude: parseFloat($('#place_location_latitude').val()) || 0,
            longitude: parseFloat($('#place_location_longitude').val()) || 0,
            zoom: parseInt($('#place_location_zoom').val(), 10) || 0
        },
        address: {
            longAddress: $('#long_address').val().trim(),
            shortAddress: $('#short_address').val().trim(),
            addressComponents: collectAddressComponents()
        },
        hashtags: $('#select-tag').val()?.map(id => `/api/tag/places/${id}`) ?? [],
        categories: $('#select-category').val()?.map(id => `/api/category/places/${id}`)  ?? [],
        types: $('#select-type').val().map(id => `/api/type/places/${id}`) ?? [],
        reviews: $('#reviews-container .review-item')
            .map(()=>({
                text: $(this).find('.review-text').text(),
                rate: parseInt($(this).find('.review-rate').val(), 10),
                authorSrc: $(this).find('.review-author-src').attr('href'),
                languageCode: $(this).find('.review-language-code').val()
                })
            ).get(),
        options: collectOptionsData(),
        commericalInformation: {
            title: $('#commerical_title').val().trim(),
            taxOffice: $('#commerical_tax_address').val().trim(),
            mersisNumber: $('#commerical_mersis_number').val().trim()
        },
        openingHours: collectOpeningHours(),
        contacts: collectContacts(),
        accounts: collectAccounts(),
        sources: collectSources()
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
    const options = {};

    $('.place-option').each((index, element)=>{
        options[toCamelCase(element.id)] = $(element).is(':checked')
    });

    return options;
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

function collectAddressComponents()
{
    const components = [{
        category: '/api/category/address/components/1',
        shortText: 'TR', longText: 'Türkiye', languageCode: 'tr'
    }];

    $('[data-adc-category]').each((index, element)=>{
        let value = $(element).val();
        if(typeof value !== 'string') return;
        value = value.trim();
        if(value.length === 0) return;
        components.push({
            category: `/api/category/address/components/${$(element).data('adc-category')}`,
            shortText: value,
            longText: value,
            languageCode: 'tr'
        });
    });

    return components;
}

function collectContacts() {
    const contacts = [];
    $('#contact-container input').each(function () {
        const value = $(this).val().trim();
        if (value !== '') {
            contacts.push({
                value: value,
                category: `/api/category/contacts/${$(this).data('category-id')}`
            });
        }
    });
    return contacts;
}

function collectAccounts() {
    const accounts = [];

    $('#accounts-container li.list-group-item').each(function (index) {
        const accountUrl = $(this).find('.account-src-input').val().trim();
        if (accountUrl !== '') {
            accounts.push({
                category: `/api/category/accounts/${$(this).data('category-id')}`,
                src: accountUrl,
                priority: index
            });
        }
    });
    return accounts;
}

function collectSources() {
    const sources = [];
    $('#sources-container .source-url-input').each(function () {
        const sourceUrl = $(this).val().trim();
        const categoryId = $(this).data('category-id');

        if (sourceUrl !== '') {
            sources.push({
                category: `/api/category/sources/${categoryId}`,
                sourceUrl: sourceUrl,
                sourceId: $(`.source-id-input[data-category-id="${categoryId}"]`).val().trim()
            });
        }
    });
    return sources;
}

async function addPlace()
{
    const data = collectFormData();
    console.log("PlaceData: ", data);
    $.ajax({
        url: `/_json/places`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            'Accept': 'application/ld+json',
        },
        success: (response)=>{
            console.log("server response: ", response);
            toastr.success('İşletme başarıyla eklendi.');
            postReviews(data.reviews, `/api/places/${response.id}`);
        },
        error: (err)=>{
            console.error('Yeni işletme eklenirken hata:', err);
            toastr.error('İşletme eklenirken bir hata oluştu.');
        }
    });
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
                url: '/_json/place/reviews',
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
            if (day.day !== firstDay)
            {
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


/** @returns {void} */
async function initAccountZone()
{
    fetchCategories('accounts').then(data=>{
        const accountContainer = $('#accounts-container');
        accountContainer.empty();
        data.forEach(category=> {
            accountContainer.append(`
            <li class="list-group-item align-items-center" data-category-id="{{ category.id }}">
                <div class="col-12 mb-3 d-flex">
                    <img src="https://${category.icon}" alt="${category.title}" width="24px" 
                    height="24px" style="width: 40px; height: 40px; object-fit: contain; margin-right: 10px;" >
                    <input id="account_src_${category.id}" aria-label="${category.description}"
                    name="account_src_${category.id}" class="form-control flex-grow-1 account-src-input"
                    type="url" placeholder="${category.description }" data-category-id="${ category.id }">
                </div>
            </li>    
            `);
        });
    });
}

/** @returns {void} */
async function initContactZone() {
    fetchCategories('contacts').then(data=>{
        const contactContainer = $('#contact-container');
        contactContainer.empty();
        data.forEach(category => {
            contactContainer.append(
                `<div class="col-12 mb-3">
                    <label class="form-label" for="contact_${category.id}">${category.description}</label>
                    <input id="contact_${category.id}" name="contact_${category.id}" class="form-control"
                    type="text" placeholder="İletişim bilgisi" data-category-id="${category.id}">
                </div>`
            );
        });
    });
}

function fetchCategories(category)
{
    return fetch(`/_json/category/${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Response is not success');
            }
            return response.json().then(data => data['hydra:member'] || data);
        })
        .catch(err => {
            console.error('İletişim kategorileri alınırken hata oluştu:', err);
            return [];
        });
}