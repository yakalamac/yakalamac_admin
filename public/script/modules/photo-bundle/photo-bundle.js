import {photoModal, photoModalAreas} from "../../util/modal";

async function handlePhotoUpload(e) {
    e.preventDefault();
    const areas = photoModalAreas('photoModal');
    const form = new FormData();

    const fileInput = areas.fileInput;
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

            }
        });
    } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error.responseText);
        alert('Fotoğraf yüklenirken bir hata oluştu.');
    }
}



function fetchPhotoCategories() {
    $.ajax({
        url: '/_route/api/api/category/photos',
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