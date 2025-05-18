
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";

$(document).ready(() => {
    console.log(window.activePlace.pid)
    // Image
    $('#partner_fancy_file_upload_image').on('shown.bs.modal', function () {
        if (!$('#partner_fancy_file_upload_image_input').closest('.ff_fileupload').length) {
            FancyFileUploadAutoInit(
                '#partner_fancy_file_upload_image_input',
                '/_multipart/place/photos',
                {
                    data: (current) => {
                        return JSON.stringify({
                            place: `/api/places/${window.activePlace?.pid}`,
                            category: `/api/category/photos/${$(current).find('#category').val()}`,
                            showOnBanner: false
                        });
                    }
                },
                ['png', 'jpg'],
                {
                    listener: '#button-photo-partner-bulk',
                    modal: '#partner_fancy_file_upload_image',
                    inputs: [
                        `<select id="category">
                        <option value="1" selected>YEMEK</option>
                        <option value="2">AMBİYANS</option>
                        <option value="3">DIŞ MEKAN</option>
                        <option value="4">İÇ MEKAN</option>
                    </select>`
                    ]
                }
            );
        }
    });
});