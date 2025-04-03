function collectOptionsData() {
    const optionsData = {};

    Object.keys(optionsMapping).forEach(switchId => {
        const key = optionsMapping[switchId];
        optionsData[key] = $(`#${switchId}`).is(':checked');
    });

    return optionsData;
}

async function collectCommercialData() {

    //const taxPlateUrl = await uploadTaxPlate();
    return {
        title: $('#commerical_title').val().trim(),
        taxOffice: $('#commerical_tax_address').val().trim(),
        mersisNumber: $('#commerical_mersis_number').val().trim(),
        //taxtPlate: taxPlateUrl
    };
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