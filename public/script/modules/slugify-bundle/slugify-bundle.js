
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