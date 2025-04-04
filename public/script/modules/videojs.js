$(document).on('click', '.video-update-button', function() {

    const videoId = $(this).data('video-id');

    const titleElement = $(`#video-${videoId}-title`);

    $.ajax({
        url: `/_json/place/videos/${videoId}`,
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
            toastr.error(error.message || 'Güncelleme sırasında bir hata oluştu');
        },
        failure: function(failure){
            console.warn(failure)
            toastr.error(failure.message || 'Güncelleme sırasında bir hata oluştu');
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

        $.ajax({
            url: `/_json/place/videos/${videoId}`,
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
            url: `/_json/place/photos/${photoId}`,
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