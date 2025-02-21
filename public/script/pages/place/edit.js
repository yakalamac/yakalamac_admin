'use strict';

import {initializeSelect2, pushMulti, pushMultiForSelects} from '../../util/select2.js';
import {photoModal, photoModalAreas, qrcodeModal, videoModal , videoModalAreas} from '../../util/modal.js?v=4';
import BulkImageUploader from "../../modules/bulk/bulk-image-uploader/BulkFileUploder.js?v=2";
import JSONFileUploader from "../../modules/bulk/json-uploader/JSONFileUploader.js";
import JSONFile from "../../modules/json/JSONFile.js";



//import ajax from "../../util/Ajax";

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
const placeName = $('#page-identifier-place-name').val();

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
    productTags: [],
    photoCategories: []
};

initializeSelect2('#select-tag');
initializeSelect2('#select-category');
initializeSelect2('#select-type');

(async function() {
    await fetchPhotoCategories();
    initializeUploader();
    initializeProductUploader();
})();

function fetchPhotoCategories() {

    $.ajax({
        url: '/_route/api/api/category/place/photos',
        method: 'GET',
        dataType: 'json',
        success: response => {
            window.transporter.photoCategories = response['hydra:member'] || response;
            console.log(response);
        },
        error: error => {
            console.error('Fotoğraf kategorileri alınırken hata oluştu:', error);
            toastr.error('Fotoğraf kategorileri alınırken bir hata oluştur');
        },
        failure: failureResponse => {
            console.warn(failureResponse);
        }
    });
}

$('#button-photo-add').on('click', function (event) {
    event.preventDefault(); //Photo modal jquery selector değişti
    
    const photoModalElement = $('#photoModal');
    //photoModalElement.remove();
    $('body').append(photoModal('photoModal'));
    photoModalElement.modal('show');
    
    const areas = photoModalAreas('photoModal');
    const categorySelect = $(areas.categorySelect);
    categorySelect.empty();

    const limit = 50;
    let current = 0;

    const interval = setInterval(() => {
        if(window.transporter.photoCategories.length > 0) {
            categorySelect.append('<option value="" disabled selected>Kategori seçiniz</option>');
            window.transporter.photoCategories.forEach(category => {      
                categorySelect.append(`<option value="${category['id']}">${category.description}</option>`);
            });
            clearInterval(interval);
        } else if (current > limit) {
            categorySelect.append('<option value="" disabled>Kategori yüklenemedi</option>');
            clearInterval(interval);
        } else {
            console.log('bakıyorum')
            current++;
        }
    }, 100);
    

    photoModalElement.on('submit', 'form', handlePhotoUpload);
});

$('#button-video-add').on('click', function(event) {
    event.preventDefault();
    
    $('#videoModal').remove();
    $('body').append(videoModal('videoModal'));

    const videoModalElement = $('#videoModal');
    videoModalElement.modal('show');

    // Modal tamamen açıldığında çalıştır
    videoModalElement.on('shown.bs.modal', function () {
        videoModalElement.on('submit', 'form', handleVideoUpload);
    });
});

// url oluşturucu
function slugify(str) {
    if (!str) return '';
    return str
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/Ü/g, 'u')
      .replace(/ş/g, 's').replace(/Ş/g, 's')
      .replace(/ı/g, 'i').replace(/İ/g, 'i')
      .replace(/ö/g, 'o').replace(/Ö/g, 'o')
      .replace(/ç/g, 'c').replace(/Ç/g, 'c')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }
  
  function getCityAndDistrict(addressComponents) {
    let city = '';
    let district = '';
  
    if (!Array.isArray(addressComponents)) return { city, district };
  
    addressComponents.forEach(component => {
      if (!component.categories) return;
      component.categories.forEach(cat => {
        if (cat.title === 'CITY') {
          city = component.shortText || component.longText || '';
        }
        if (cat.title === 'DISTRICT') {
          district = component.shortText || component.longText || '';
        }
      });
    });
  
    return { city, district };
  }
  
  function buildPlaceUrl() {
    const placeId   = $('#page-identifier-place-id').val();
    const placeName = $('#page-identifier-place-name').val();
  
    const addressComponentsJson = $('#page-identifier-address-components').val() || '[]';
    let addressComponents = [];
    try {
      addressComponents = JSON.parse(addressComponentsJson);
    } catch (err) {
      console.warn("Address components JSON parse error", err);
    }
  
    const { city, district } = getCityAndDistrict(addressComponents);
  
    const citySlug     = slugify(city);
    const districtSlug = slugify(district);
    const placeSlug    = slugify(placeName);
  
    return `https://yaka.la/detail/${citySlug}/${districtSlug}/${placeSlug}?uuid=${encodeURIComponent(placeId)}`;
  }
  function updatePreviewLink() {
    const url = buildPlaceUrl();
    $('#preview-button').attr('href', url);
  }
  
// qr oluşturucu
let qrCode = null;
function createOrUpdateQRCode() {
    let detailLevel = $('#qrcode-detailLevel').val();
    switch (detailLevel) {
        case 1: detailLevel = 'L'; break;
        case 2: detailLevel = 'M'; break;
        default: detailLevel = 'H';
    }

    const widthHeight = parseInt($('#qrcode-width').val(), 10) || 250;
    const margin = parseInt($('#qrcode-margin').val(), 10) || 5;

    const colorDark = $('#qrcode-color-dark').val()   || "#000000";
    const colorLight = $('#qrcode-color-light').val() || "#ffffff";

    const withIcon = $('#qrcode-with-icon').is(':checked');
    const iconPath = $('#icon-path-holder').data('icon-path');

    const logoSize   = parseFloat($('#qrcode-logo-size').val()) || 0.5;
    const logoMargin = parseInt($('#qrcode-logo-margin').val(), 10) || 4;

    const targetUrl = buildPlaceUrl();

    const dotsType            = $('#dots-type').val() || 'rounded';
    const cornersSquareType   = $('#corners-square-type').val() || 'extra-rounded';
    const cornersDotType      = $('#corners-dot-type').val() || 'dot';

    const options = {
        width: widthHeight,
        height: widthHeight,
        data: targetUrl,
        margin: margin,
        image: withIcon ? iconPath : '',
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: logoSize,
            margin: logoMargin
        },
        dotsOptions: {
            color: colorDark,
            type: dotsType
        },
        cornersSquareOptions: {
            color: colorDark,
            type: cornersSquareType
        },
        cornersDotOptions: {
            color: "#00B8C0",
            type: cornersDotType
        },
        backgroundOptions: {
            color: colorLight
        },
        qrOptions: {
            errorCorrectionLevel: detailLevel
        }
    };

    if (!qrCode) {
        qrCode = new QRCodeStyling(options);
        qrCode.append(document.getElementById("qrkod"));
    } else {
        qrCode.update(options);
    }
}

function handleQrDownload(e) {
    e.preventDefault();
    if (!(qrCode && qrCode.hasOwnProperty('getRawData'))) return;

    qrCode.getRawData('png').then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'yakala-qrkod.png';
        link.click();
    });
}

$('#place-qr-code').on('click', function (event) {
    event.preventDefault();
    const qrcodeModalElement = $('#qrcodeModal');
    qrcodeModalElement.remove();

    $('body').append(qrcodeModal('qrcodeModal'));
    qrcodeModalElement.modal('show');

    qrcodeModalElement.on('shown.bs.modal', function () {
        qrCode = null;
        createOrUpdateQRCode();
    });

    qrcodeModalElement.on('input change',
      '#qrcode-width, #qrcode-margin, #qrcode-color-dark, #qrcode-color-light, #qrcode-detailLevel, #qrcode-with-icon, #dots-type, #corners-square-type, #corners-dot-type, #qrcode-logo-size, #qrcode-logo-margin',
      createOrUpdateQRCode
    );

    qrcodeModalElement.on('submit', 'form', handleQrDownload);
});

async function handleVideoUpload(event) {   
    event.preventDefault();
    
    const areas = videoModalAreas('videoModal');
    const input = areas.fileInput;
    const form = new FormData();

    const file = input.files[0];

    if (!file) {
        alert("Lütfen bir video dosyası seçin!");
        return;
    }

    console.log("Seçilen dosya:", file);

    if (['video/mp4', 'video/mov'].includes(file.type)) {
        form.append('file', file);
    } else {
        alert('Lütfen geçerli bir video dosyası giriniz (mp4, mov)');
        return;
    }

    if (!areas.titleInput.value.trim() || !areas.altTagInput.value.trim()) {
        alert('Lütfen tüm alanları doldurunuz.');
        return;
    }

    const title = areas.titleInput.value.trim();
    form.append('title' , title);
    form.append('place', placeId);
    form.append('category',`/api/category/place/photos/1` );
    form.append('showOnBanner', true);

    console.log("Gönderilen FormData:");
    for (const pair of form.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    try {
        await $.ajax({
            url: `/_api/api/place/videos/stream-upload`,
            method: 'POST',
            data: form,
            contentType: false,  
            processData: false,  
            error: (e) => {
                console.error('Hata:', e.responseText);
                alert('Video yüklenirken bir hata oluştu.');
            },
            success: (response) => {
                toastr.success('Video başarıyla yüklendi.');
                console.log(response);
            }
        });
    } catch (error) {
        console.error('Video yükleme hatası:', error);
        alert('Video yüklenirken bir hata oluştu.');
    }
}

async function handlePhotoUpload(e) {
    e.preventDefault();
    const areas = photoModalAreas('photoModal');
    const form = new FormData();

    const fileInput = areas.fileInput;
    console.log('fileınput' ,fileInput.files);
    const file = fileInput.files[0];
    if (file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        form.append('file', file);
    } else {
        console.log(file)
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
        place: `/api/places/${placeId}`,
        title: areas.titleInput.value.trim(),
        altTag: areas.altTagInput.value.trim(),
        category: `/api/category/place/photos/${areas.categorySelect.value}`,
        showOnBanner: areas.showOnBannerSwitch.checked,
        showOnLogo: areas.showOnLogoSwitch.checked,
    };

    form.append('data', JSON.stringify(data));

    try {
        await $.ajax({
            url: `/_api/api/place/photos`,
            method: 'POST',
            data: form,
            contentType: false,
            processData: false,
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

function initializeUploader() {
    $(document).ready(function () {
        initializeDataPush();
        initializeProductsTable();
        initializeTimePickers();
        initializeStatusSelects();
        initializeApplyToAllButton();
        populateOptions();
        
        const imageUploader = new BulkImageUploader(
            '#testButtonBulk',
            {
                event: 'click',
                onEvent: () => console.log("test"),
                data: { placeName }
            }
            ).init().run().handleFancyUploadOnComplete((/* event, data TODO NON IN USE*/) => {/*Nothing*/})
            .handleFancyUploadOnStart(function (e, data) {
                const report = {success: '', error: '', failure: ''};
                const saveAllButton = $(`#${imageUploader.fancyFileUpload.buttonUploadAll}`);
                const originalButtonText = saveAllButton.html();
                saveAllButton.prop('disabled', true).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Lütfen bekleyiniz`);

                const ajaxPromises = data.files.map(file => {
                    return new Promise((resolve, reject) => {
                        const description = data.context.find('.description-input').val() || placeName;
                        const category = data.context.find('.category-select').val();
                        const showOnLogo = data.context.find('.showOnLogo').is(':checked');
                        const showOnBanner = data.context.find('.showOnBanner').is(':checked');

                        if (file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                            const form = new FormData();
                            form.append('file', file);

                            form.append(
                                'data',
                                JSON.stringify({
                                    title: description,
                                    altTag: description,
                                    category: category, // '/api/category/place/photos/1',
                                    showOnBanner: showOnBanner,
                                    showOnLogo: showOnLogo,
                                    place: placeId
                                })
                            );

                            $.ajax({
                                url: `/_api/api/place/photos`,
                                method: 'POST',
                                data: form,
                                contentType: false,
                                processData: false,
                                success: (response) => {
                                    if (response && response.hasOwnProperty('exception') && response.exception) {
                                        report.error += `Hata: ${response.exception}\n`;
                                        console.error(response);
                                        reject(response.exception || 'Bilinmeyen hata');
                                    } else {
                                        report.success += `${description} başarıyla yüklendi.\n`;
                                        resolve();
                                    }
                                },
                                error: (e) => {
                                    report.error += e.responseText + '\n';
                                    console.error(e);
                                    reject('Hata oluştu');
                                },
                                failure: (e) => {
                                    report.failure += e.responseText + '\n';
                                    console.info(e);
                                    reject('Başarısız');
                                }
                            });
                        } else {
                            alert('Lütfen geçerli bir resim dosyası seçiniz.');
                            reject('Geçersiz dosya türü');
                        }
                    });
                });

                Promise.all(ajaxPromises).then(() => toastr.success(report.success))
                    .catch(() => {
                        if (report.error) {
                            toastr.error(report.error);
                        }
                        if (report.failure) {
                            toastr.info(report.failure);
                        }
                    })
                    .finally(() => saveAllButton.prop('disabled', false).html(originalButtonText));
            });
    });
}

async function pushProduct(product) {

    const responseObject = {
        data: undefined,
        status: undefined
    };

    try {
        responseObject.data = await new Promise((resolve, reject) => {
            $.ajax({
                url: '/_api/api/products',
                method: 'POST',
                contentType: 'application/json',
                accept: 'application/json',
                data: JSON.stringify(
                    {
                        name: product.name,
                        price: typeof product.price === 'string' && product.price.includes('TL')
                            ? parseFloat(product.price.split(' TL')[0]) : 0,
                        active: false,
                        description: product.description,
                        place: `/api/places/${placeId}`
                    }
                ),
                success: response => {
                    if(response.hasOwnProperty('exception') && response.exception) {
                        responseObject.status = response.code;
                        resolve(response);
                    } else {
                        responseObject.status = 200;
                        console.log(response);

                        if(product.image) {
                            fetch('/_image',
                                {
                                    method: 'POST',
                                    body: JSON.stringify(
                                        {
                                            url: product.image
                                        }
                                    )
                                })
                                .then(res=> {
                                    console.log(res.headers.get('content-type'));
                                const form = new FormData();
                                res.blob().then(blob=> {
                                            form.append('file', blob);

                                            form.append(
                                                'data',
                                                JSON.stringify({
                                                    title: product.name,
                                                    altTag: product.name,
                                                    showOnBanner: false,
                                                    showOnLogo: false,
                                                })
                                            );
                                            console.log('forma girdi');
                                            $.ajax({
                                                url: `/_api/api/product/${response.id}/image/photos`,
                                                method: 'POST',
                                                data: form,
                                                contentType: false,
                                                processData: false,
                                                success: (imageResponse) => {

                                                    if (imageResponse && imageResponse.exception) {
                                                        console.info({
                                                            product: response,
                                                            image: imageResponse
                                                        })
                                                        reject({
                                                            product: response,
                                                            image: imageResponse
                                                        });
                                                    } else {
                                                        resolve({
                                                            product: response,
                                                            image: imageResponse
                                                        });
                                                    }
                                                },
                                                error: (e) => {
                                                    console.error(e);
                                                    reject('Hata oluştu (fotoğraf yükleme)');
                                                },
                                                failure: (e) => {
                                                    console.info(e);
                                                    reject('Başarısız fotoğraf yükleme');
                                                }
                                            });

                                        });


                                    });

                        }
                        else
                            resolve(response);
                    }
                },
                error: e => {
                    responseObject.status = 500;
                    reject(e.responseText);
                }
            });
        });
        return responseObject;
    } catch (e) {
        responseObject.status = 400;
        responseObject.data = e;
        return responseObject;
    }
}

function initializeProductUploader(){
    $(document).ready(
        function (){
            const productBulkUploader = new JSONFileUploader('#buttonProductBulk')
                .init()
                .run();

            productBulkUploader.handleSingleUploader(
                function (e, array) {
                    const jsonFile = new JSONFile()
                    array.forEach(file => {
                            jsonFile.setFile(file).load().then(async (/*content TODO NON IN USE*/) => {
                                const jsonContent = jsonFile.getJsonContent();
                                let contentProducts = undefined;

                                if(jsonContent.hasOwnProperty('productList') && Array.isArray(jsonContent.productList))
                                    contentProducts = jsonContent.productList;

                                if(jsonContent.hasOwnProperty('products') && Array.isArray(jsonContent.products))
                                    contentProducts = jsonContent.products;

                                if(Array.isArray(contentProducts)) {
                                    for(let product of contentProducts) {
                                        const result = await pushProduct(product);

                                        if(result.status > 199 && result.status < 300) {
                                            toastr.success(`Ürün ${product.name} başarıyla yüklendi.`);
                                        }

                                        if(result.status > 399 && result.status < 500){
                                            toastr.info(`Ürün ${product.name} yüklenirken bir hatayla karşılaştı`);
                                        }

                                        if(result.status === 500)
                                            toastr.error(`Ürün ${product.name} yüklenemedi. Yöneticiyle iletişime geçin`);
                                        console.info(result)
                                    }
                                }
                            });
                    });
                });
        });
}

function initializeDataPush() {
    pushMulti(
        'select-category',
        'data-category-id',
        'description',
        'id',
        'place_category/_search?size=1000',
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
        'place_type/_search?size=1000',
        error => console.log(error),
        failure => console.log(failure)
    );

    pushMulti(
        'select-tag',
        'data-tag-id',
        'tag',
        'id',
        'place_tag/_search?size=1000',
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
                render: data => generateSelectOptions(data, window.transporter.productCategories, 'product-category')
            },
            {
                data: "types",
                render: data => generateSelectOptions(data, window.transporter.productTypes, 'product-type')
            },
            {
                data: "hashtags",
                render: data => generateSelectOptions(data, window.transporter.productTags, 'product-tag')
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
    window.transporter.productTable = products;
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

async function populateContactFields() {
    const contactCategories = window.contactCategories || [];
    const existingContacts = window.transporter.place.contacts || [];

    const existingContactsMap = new Map(existingContacts.map(contact => {
        const categoryId = extractCategoryId(contact.category);
        return [categoryId, contact];
    }));

    const contactContainer = $('#contact-container');
    contactContainer.empty();

    let contactFieldsHTML = '';
    contactCategories.forEach(category => {
        const categoryId = category.id.toString();
        const value = existingContactsMap.get(categoryId)?.value || '';

        contactFieldsHTML += `
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
    });
    contactContainer.html(contactFieldsHTML);
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
        optionsData[key] = $(`#${switchId}`).is(':checked');
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
                        const cleanedNeighbourhood = neighbourhood.replace(/\s?mah$/i, "");
                        allNeighbourhoods.push(capitalizeFirstLetter(cleanedNeighbourhood));
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

$(document).ready(async function () {
    await populateProvinceSelect();
    await autoFillAddressComponents();
});


async function autoFillAddressComponents() {
    const addressComponents = window.transporter.place?.address?.addressComponents || [];
    
    let province, district, neighbourhood, postalCode, street, streetNumber
    addressComponents.forEach(component => {
        if(!(component?.categories && Array.isArray(component.categories) && component.categories.length>0)) return;
        const categoryId = component.categories[0]?.id;
        if(!categoryId) return;
        switch (categoryId) {
            case 2:
                province = component.longText;
                break;
            case 3:
                district = component.longText;
                break;
            case 4:
                neighbourhood = component.longText;
                break;
            case 6:
                postalCode = component.longText;
                break;
            case 5:
                street = component.longText;
                break;
            case 8:
                streetNumber = component.longText;
                break;
        }
    });
    function normalizeString(string) {
        return string.normalize('NFC');
    }
    if (province) {
        province = normalizeString(province);
        $('#province_select').val(province).trigger('change');
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (district) {
        await populateDistrictSelect(province);
        district = normalizeString(district);
        $('#district_select').val(capitalizeFirstLetter(district.toLowerCase())).trigger('change');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (neighbourhood) {
        await populateNeighbourhoodSelect(province, district);
        const formattedNeighbourhood = normalizeString(capitalizeFirstLetter(neighbourhood.toLowerCase()).replace(/\s?mah$/i, ""));
        $('#neighbourhood_select').val(formattedNeighbourhood).trigger('change');
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (postalCode) {
        $('#zipCode_input').val(postalCode);
    }
    if (street) {
        $('#street_input').val(street);
    }
    if (streetNumber) {
        $('#street_number_input').val(streetNumber);
    }
}

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
    const province = $('#province_select').val();
    const district = $('#district_select').val();
    const neighbourhood = $('#neighbourhood_select').val();
    const postalCode = $('#zipCode_input').val().trim();
    const street = $('#street_input').val().trim();
    const streetNumber = $('#street_number_input').val().trim();

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
        address: { addressUuid, longAddress, shortAddress, province, district, neighbourhood, postalCode,street,streetNumber },
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
    //  placeId, todo (Non in use)
        placeName,
        owner,
        primaryTypeId,
        rating,
        userRatingCount,
    //  location, todo (Non in use)
    //  address, todo (Non in use)
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
    const contactCategories = window.contactCategories || [];
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

    const ajaxPromises = contactCategories.map(category => {
        const categoryId = category.id.toString();
        const categoryInputId = `contact_${categoryId}`;
        const value = $(`#${categoryInputId}`).val().trim();

        const existingContact = existingContactsMap[categoryId];

        if (value !== '') {
            if (existingContact) {
                if (existingContact.value === value) {
                    return Promise.resolve();
                }
                const contactId = existingContact.id;
                const contactData = { value: value };
                return $.ajax({
                    url: `/_route/api/api/place/contacts/${contactId}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify(contactData),
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error(`İletişim bilgisi güncelleme hatası (ID: ${contactId}):`, error);
                    toastr.error('İletişim bilgisi güncellenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            } else {
                const contactData = {
                    value: value,
                    category: `/api/category/contacts/${categoryId}`,
                    place: `/api/places/${placeId}`
                };
                return $.ajax({
                    url: `/_route/api/api/place/contacts`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(contactData),
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error('İletişim bilgisi oluşturma hatası:', error);
                    toastr.error('İletişim bilgisi eklenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        } else {
            if (existingContact) {
                const contactId = existingContact.id;
                return $.ajax({
                    url: `/_route/api/api/place/contacts/${contactId}`,
                    type: 'DELETE',
                    contentType: 'application/json',
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error(`İletişim bilgisi silme hatası (ID: ${contactId}):`, error);
                    toastr.error('İletişim bilgisi silinirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        }

        return Promise.resolve();
    });

    try {
        await Promise.all(ajaxPromises);
    } catch (error) {
        console.error('İletişim bilgileri güncellenirken bir hata oluştu:', error);
    }
}

async function updateAddressComponents(addressData) {
    const { addressUuid, province, district, neighbourhood, postalCode, street, streetNumber } = addressData;
    const languageCode = 'tr';

    const existingComponentsMap = new Map();
    const components = window.transporter.place.address.addressComponents || [];
    components.forEach(component => {
        if (component.categories && component.categories[0]) {
            existingComponentsMap.set(component.categories[0].id, component);
        }
    });

    const componentsToUpdate = [
        {
            field: 'city',
            value: province,
            categoryId: 2,
            shortText: province || "",
            longText: province || ""
        },
        {
            field: 'district',
            value: district,
            categoryId: 3,
            shortText: district || "",
            longText: district || ""
        },
        {
            field: 'neighbourhood',
            value: neighbourhood,
            categoryId: 4,
            shortText: neighbourhood || "",
            longText: neighbourhood || ""
        },
        {
            field: 'postalCode',
            value: postalCode,
            categoryId: 6,
            shortText: postalCode || "",
            longText: postalCode || ""
        },
        {
            field: 'street',
            value: street,
            categoryId: 5,
            shortText: street || "",
            longText: street || ""
        },
        {
            field: 'streetNumber',
            value: streetNumber,
            categoryId: 8,
            shortText: streetNumber || "",
            longText: streetNumber || ""
        },
        {
            field: 'country',
            value: "Türkiye",
            categoryId: 1,
            shortText: "TR",
            longText: "Türkiye"
        }
    ];

    if (!window.transporter.place.addressComponents) {
        window.transporter.place.addressComponents = [];
    }

    const ajaxPromises = componentsToUpdate.map(component => {
        const payload = {
            address: `/api/place/addresses/${addressUuid}`,
            categories: [`/api/category/address/components/${component.categoryId}`],
            shortText: component.shortText,
            longText: component.longText,
            languageCode: languageCode
        };

        const existingComponent = existingComponentsMap.get(component.categoryId);

        let hasChanged ;
        if (existingComponent) {
            hasChanged = existingComponent.shortText !== component.shortText || existingComponent.longText !== component.longText;
        } else {
            hasChanged = !!component.value;
        }

        if (!hasChanged) {
            return Promise.resolve();
        }

        if (existingComponent) {
            return $.ajax({
                url: `/_route/api/api/place/address/components/${existingComponent.id}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(payload),
                headers: { 'Accept': 'application/ld+json' },
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            }).catch(error => {
                console.error(`${component.field} güncellenirken hata oluştu:`, error);
                toastr.error(`${component.field} güncellenirken bir hata oluştu.`);
                return Promise.reject(error);
            });
        } else if (component.value) {
            return $.ajax({
                url: `/_route/api/api/place/address/components`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                headers: { 'Accept': 'application/ld+json' },
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            }).then(response => {
                window.transporter.place.addressComponents.push(response);
            }).catch(error => {
                console.error(`${component.field} oluşturulurken hata oluştu:`, error);
                toastr.error(`${component.field} oluşturulurken bir hata oluştu.`);
                return Promise.reject(error);
            });
        } else {
            return Promise.resolve();
        }
    });

    try {
        await Promise.all(ajaxPromises);
    } catch (error) {
        console.error('Adres bileşenleri güncellenirken bir hata oluştu:', error);
    }
}


async function updateAddress(addressData) {
    const { addressUuid, longAddress, shortAddress } = addressData;
    const payload = { shortAddress, longAddress };

    const existingAddress = window.transporter.place.address || {};
    const hasChanged = existingAddress.shortAddress !== shortAddress || existingAddress.longAddress !== longAddress;

    if (!hasChanged) {
        await updateAddressComponents(addressData);
        return;
    }

    try {
        if (addressUuid && addressUuid !== '0') {
            await $.ajax({
                url: `/_route/api/api/place/addresses/${addressUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(payload),
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
        } else {
            payload.place = `/api/places/${placeId}`;
            window.transporter.place.address = await $.ajax({
                url: `/_route/api/api/place/addresses`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
        }
        await updateAddressComponents(addressData);
    } catch (error) {
        console.error('Adres güncelleme hatası:', error);
        toastr.error('Adres güncellenirken bir hata oluştu.');
    }
}


async function updateLocation(locationData) {
    const { locationUuid, latitude, longitude, zoom } = locationData;
    const payload = { latitude, longitude, zoom };

    const existingLocation = window.transporter.place.location || {};

    const hasChanged = existingLocation.latitude !== latitude ||
                       existingLocation.longitude !== longitude ||
                       existingLocation.zoom !== zoom;

    if (!hasChanged) {
        return;
    }

    if (locationUuid && locationUuid !== '0') {
        try {
            await $.ajax({
                url: `/_route/api/api/place/locations/${locationUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(payload),
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
            window.transporter.place.location.latitude = latitude;
            window.transporter.place.location.longitude = longitude;
            window.transporter.place.location.zoom = zoom;
        } catch (error) {
            console.error('Lokasyon güncelleme hatası:', error);
            toastr.error('Lokasyon güncellenirken bir hata oluştu.');
        }
    } else {
        try {
            payload.place = `/api/places/${placeId}`;
            window.transporter.place.location = await $.ajax({
                url: `/_route/api/api/place/locations`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
        } catch (error) {
            console.error('Lokasyon oluşturma hatası:', error);
            toastr.error('Lokasyon oluşturulurken bir hata oluştu.');
        }
    }
}


async function updateOptions(optionsData) {
    let optionsId = null;
    if (window.transporter.place.options && window.transporter.place.options.id) {
        optionsId = window.transporter.place.options.id;
    }

    const existingOptions = window.transporter.place.options || {};

    const hasChanged = Object.keys(optionsData).some(key => existingOptions[key] !== optionsData[key]);

    if (!hasChanged && optionsId) {
        return;
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
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
            window.transporter.place.options = { ...existingOptions, ...optionsData };
        } catch (error) {
            console.error('Options güncelleme hatası:', error);
            toastr.error('İşletme seçenekleri güncellenirken bir hata oluştu.');
        }
    } else {
        const payload = {
            ...optionsData,
            place: `/api/places/${placeId}`
        };
        try {
            window.transporter.place.options = await $.ajax({
                url: `/_route/api/api/place/options`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/ld+json',
                },
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
        } catch (error) {
            console.error('Options oluşturma hatası:', error);
            toastr.error('İşletme seçenekleri oluşturulurken bir hata oluştu.');
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

    const ajaxPromises = sourceUrlInputs.map(function () {
        const urlInput = $(this);
        const categoryId = urlInput.data('category-id');
        const sourceUrl = urlInput.val().trim();
        const sourceId = sourcesContainer.find(`.source-id-input[data-category-id="${categoryId}"]`).val().trim();
        
        const existingSource = existingSourcesMap[categoryId];

        if (sourceUrl !== '') {
            if (existingSource) {
                if (existingSource.sourceUrl === sourceUrl && existingSource.sourceId === sourceId) {
                    return Promise.resolve();
                }
                const patchData = { sourceUrl, sourceId };
                return $.ajax({
                    url: `/_route/api/api/source/places/${existingSource.id}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify(patchData),
                    headers: { 'Accept': 'application/ld+json' },
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error(`Kaynak güncelleme hatası (ID: ${existingSource.id}):`, error);
                    toastr.error('Kaynak güncellenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            } else {
                const postData = { 
                    place: `/api/places/${placeId}`, 
                    category: `/api/category/sources/${categoryId}`, 
                    sourceUrl, 
                    sourceId 
                };
                return $.ajax({
                    url: '/_route/api/api/source/places',
                    type: 'POST',
                    contentType: 'application/ld+json',
                    data: JSON.stringify(postData),
                    headers: { 'Accept': 'application/ld+json' },
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).then(response => {
                    existingSources.push(response);
                }).catch(error => {
                    console.error('Kaynak oluşturma hatası:', error);
                    toastr.error('Kaynak eklenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        } else {
            if (existingSource) {
                return $.ajax({
                    url: `/_route/api/api/source/places/${existingSource.id}`,
                    type: 'DELETE',
                    headers: { 'Accept': 'application/ld+json' },
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).then(() => {
                    existingSources = existingSources.filter(source => source.category.id !== categoryId);
                }).catch(error => {
                    console.error(`Kaynak silme hatası (ID: ${existingSource.id}):`, error);
                    toastr.error('Kaynak silinirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        }

        return Promise.resolve();
    }).get();

    try {
        await Promise.all(ajaxPromises);
        window.transporter.place.sources = existingSources;
    } catch (error) {
        console.error('Kaynakları kaydederken hata oluştu:', error);
    }
}

$(document).ready(function () {
    updatePreviewLink();
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

    const ajaxPromises = [];
    let priority = 1;

    sortedAccounts.each(function () {
        const categoryId = $(this).data('category-id');
        const accountUrl = $(this).find('.account-src-input').val().trim();

        if (accountUrl !== '') {
            const existingAccount = existingAccountsMap[categoryId];

            if (existingAccount) {
                if (accountUrl !== existingAccount.src || priority !== existingAccount.priority) {
                    const patchData = { src: accountUrl, priority: priority };
                    ajaxPromises.push(
                        $.ajax({
                            url: `/_route/api/api/place/accounts/${existingAccount.id}`,
                            type: 'PATCH',
                            contentType: 'application/merge-patch+json',
                            data: JSON.stringify(patchData),
                            headers: { 'Accept': 'application/ld+json' },
                            error:(e)=>console.error(e),
                            success: (s)=> console.log(s),
                            failure: (f) => console.log(f)
                        }).catch(error => {
                            console.error(`Hesap güncelleme hatası (ID: ${existingAccount.id}):`, error);
                            toastr.error('Hesap güncellenirken bir hata oluştu.');
                            return Promise.reject(error);
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
                ajaxPromises.push(
                    $.ajax({
                        url: '/_route/api/api/place/accounts',
                        type: 'POST',
                        contentType: 'application/ld+json',
                        data: JSON.stringify(postData),
                        headers: { 'Accept': 'application/ld+json' },
                        error:(e)=>console.error(e),
                        success: (s)=> console.log(s),
                        failure: (f) => console.log(f)
                    }).then(response => {
                        existingAccounts.push(response);
                    }).catch(error => {
                        console.error('Hesap oluşturma hatası:', error);
                        toastr.error('Hesap eklenirken bir hata oluştu.');
                        return Promise.reject(error);
                    })
                );
            }
            priority++;
        } else {
            const existingAccount = existingAccountsMap[categoryId];
            if (existingAccount) {
                ajaxPromises.push(
                    $.ajax({
                        url: `/_route/api/api/place/accounts/${existingAccount.id}`,
                        type: 'DELETE',
                        headers: { 'Accept': 'application/ld+json' },
                        error:(e)=>console.error(e),
                        success: (s)=> console.log(s),
                        failure: (f) => console.log(f)
                    }).then(() => {
                        existingAccounts = existingAccounts.filter(account => account.category.id !== categoryId);
                    }).catch(error => {
                        console.error(`Hesap silme hatası (ID: ${existingAccount.id}):`, error);
                        toastr.error('Hesap silinirken bir hata oluştu.');
                        return Promise.reject(error);
                    })
                );
            }
        }
    });

    try {
        await Promise.all(ajaxPromises);
        window.transporter.place.accounts = existingAccounts;
    } catch (error) {
        console.error('Hesapları kaydederken hata oluştu:', error);
    }
}

$(document).on('click', '.video-update-button', function() {

    const videoId = $(this).data('video-id');
    
    const titleElement = $(`#video-${videoId}-title`);
    //const altTagElement = $(`#video-${videoId}-altTag`);
    
    $.ajax({
        url: `/_route/api/api/place/videos/${videoId}`,
        method: 'PATCH',
        data: JSON.stringify({title: titleElement.val()}),
        dataType: 'json',
        contentType: "application/merge-patch+json",
        success: function(response) {
                console.log(response)
                toastr.success('Video başarıyla güncellendi');
                $(`#video-${videoId}-updatedAt`).val(response.updatedAt);
        },
        error: function(error){
            console.error(error)
            toastr.error(response.message || 'Güncelleme sırasında bir hata oluştu');
        },
        failure: function(failure){
            console.warn(failure)
            toastr.error(response.message || 'Güncelleme sırasında bir hata oluştu');
        }
    });
});

$(document).on('click', '.video-delete-button' , async function(){
    const videoId = $(this).data('video-id');
    if(!videoId){
        alert('Silinecek Video Bulunmadı.');
        return;
    }
    if(!confirm('Bu Video içeriğini silmek istediğinize emin misiniz?')){
        return;
    }
    try{

        await $.ajax({
            url: `/_route/api/api/place/videos/${videoId}`,
            method: 'DELETE',
            success:()=>{
                toastr.success('Video başarıyla silindi.');
                $(`#photo-${videoId}`).remove();
            },
            error: (error) => {
                console.error('Video silme hatası:', error);
                toastr.error('Video silinirken bir hata oluştu.');
            },
        });
    }catch(error){
        console.log('Video silme işleminde bir hata oluştu' , $error);     
    }

});

$(document).on('click', '.photo-delete-button', async function () {
    const photoId = $(this).data('photo-id');
    if (!photoId) {
        alert('Silinecek fotoğraf bulunamadı.');
        return;
    }

    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
        return;
    }

    try {
        await $.ajax({
            url: `/_route/api/api/place/photos/${photoId}`,
            method: 'DELETE',
            success: () => {
                toastr.success('Fotoğraf başarıyla silindi.');
                $(`#photo-${photoId}`).remove();
            },
            error: (error) => {
                console.error('Fotoğraf silme hatası:', error);
                toastr.error('Fotoğraf silinirken bir hata oluştu.');
            },
        });
    }catch (error) {
        console.error('Fotoğraf silinirken hata oluştu:', error);
    }
});

async function updatePlace() {
    const formData = collectFormData();
    console.log(formData);
    try {
        await synchronizeData(formData);
        await Promise.all([
            updateOptions(formData.optionsData),
            updateContacts(),
            updateAddress(formData.address),
            updateLocation(formData.location),
            saveSources(),
            saveAccounts()
        ]);
        toastr.success('İşletme başarıyla güncellendi.');
    } catch (error) {
        console.error('İşletme güncelleme hatası:', error);
        toastr.error('İşletme güncellenirken bir hata oluştu.');
    }
}