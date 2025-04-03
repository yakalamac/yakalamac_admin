$('input#fancy_file_upload_image_input').FancyFileUpload({
    url: '/_route/api/api/place/photos',
    edit: true,
    retries: 2,
    preinit: function (self) {
    },
    maxfilesize: 10000000,
    params: {
        data: JSON.stringify({
            category: '/api/category/photos/1',
            showOnBanner: true,
            place: `/api/places/${window.transporter.place.id}`
        })
    },
    accept: ['png', 'jpeg']
});
$('button#button-photo-bulk').on('click', () => $('div#fancy_file_upload_image').modal('show'));


// Video
$('input#fancy_file_upload_video_input').FancyFileUpload({
    url: '/_route/api/api/place/videos/stream-upload',
    edit: true,
    retries: 2,
    preinit: function (self) {
    },
    maxfilesize: 10000000,
    params: {
        place: window.transporter.place.id,
        title: 'xasf',
        showOnBanner: true,
        category: '/api/category/photos/1'
    },
    accept: ['mp4']
});
$('button#button-video-bulk').on('click', () => $('div#fancy_file_upload_video').modal('show'));