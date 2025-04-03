
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
        case '1': detailLevel = 'L'; break;
        case '2': detailLevel = 'M'; break;
        case '3': detailLevel = 'H'; break;
    }

    const widthHeight = parseInt($('#qrcode-width').val(), 10) || 250;
    const margin = parseInt($('#qrcode-margin').val(), 10) || 5;

    const colorDark = $('#qrcode-color-dark').val() || "#000000";
    const colorLight = $('#qrcode-color-light').val() || "#ffffff";

    const withIcon = $('#qrcode-with-icon').is(':checked');
    const iconPath = $('#icon-path-holder').data('icon-path');

    const logoSize = parseFloat($('#qrcode-logo-size').val()) || 0.5;
    const logoMargin = parseInt($('#qrcode-logo-margin').val(), 10) || 4;

    const targetUrl = buildPlaceUrl();

    const dotsType = $('#dots-type').val() || 'rounded';
    const cornersSquareType = $('#corners-square-type').val() || 'extra-rounded';
    const cornersDotType = $('#corners-dot-type').val() || 'dot';

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
            color: $('#corners-dot-type').val() === 'dot' ? '#00B8C0' : colorDark,
            type: cornersDotType
        },
        backgroundOptions: {
            color: colorLight
        },
        qrOptions: {
            errorCorrectionLevel: detailLevel
        }
    };

    const qrkodElement = document.getElementById("qrkod");
    if (qrkodElement) {
        qrkodElement.innerHTML = '';
    }

    if (!qrCode) {
        qrCode = new QRCodeStyling(options);
        const element = document.getElementById("qrkod");
        qrCode.append(element);
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

$('#place-qr-code').on('click',  function (event) {
    event.preventDefault();

    const qrcodeModalElement = $('#modal-qr-code');

    //qrcodeModalElement.remove();

//    $('body').append(qrcodeModal('qrcodeModal'));

    qrCode=null;

    createOrUpdateQRCode();

    qrcodeModalElement.modal('show');

    qrcodeModalElement.off('input change')
        .on('input change',
            '#qrcode-width, #qrcode-margin, #qrcode-color-dark, #qrcode-color-light, #qrcode-detailLevel, #qrcode-with-icon, #dots-type, #corners-square-type, #corners-dot-type, #qrcode-logo-size, #qrcode-logo-margin',
            createOrUpdateQRCode
        );

    qrcodeModalElement.on('submit', 'form', handleQrDownload);
});