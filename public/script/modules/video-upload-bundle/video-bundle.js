import {videoModal, videoModalAreas} from "../../util/modal";

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