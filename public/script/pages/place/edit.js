import {pushMulti, pushMultiForSelects} from '../../util/select2.js';
import {photoModal, photoModalAreas} from '../../util/modal.js';
import {control} from '../../util/modal-controller.js';

const placeId = $('#page-identifier-place-id')[0].value;

$('#select-tag').select2(
    {
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        closeOnSelect: false,
        tags: true
    }
);

$('#select-category').select2(
    {
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        closeOnSelect: false,
        tags: true
    }
);

$('#select-type').select2(
    {
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        closeOnSelect: false,
        tags: true
    }
);

$('#button-photo-add').on(
    'click',
    function (event){

        control(
            'photoModal',
            photoModal,
            function (e){
                const areas = photoModalAreas('photoModal');
                const form = new FormData();

                if(
                    areas?.fileInput.files.length > 0
                    && ['image/png', 'image/jpg', 'image/jpeg'].includes(areas.fileInput.files.item(0).type)
                )
                {
                    const blob = new Blob([areas.fileInput.files.item(0)]);
                    form.append('file', blob);
                }

                if(areas.captionTextArea.value.trim().length > 0)
                    form.append('caption', areas.captionTextArea.value.trim());

                form.append('showOnBanner', areas.showOnBannerSwitch.checked);

                form.append('category', 1);

                if(form.has('file') && form.has('showOnBanner'))
                    $.ajax(
                        {
                            url: `/_route/api/api/place/${placeId}/image/photos`,
                            method: 'POST',
                            data: form,
                            contentType: false,
                            processData: false,
                            success: response => console.log(response.responseText),
                            error: error => console.log(error.responseText),
                            failure: failure => console.log(failure.responseText)
                        }
                    );
            }
            );
    }
);
$(document).ready(
    function () {
        pushMulti(
            'select-category', 'data-category-id', 'description', 'id' ,'/api/category/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

        pushMultiForSelects(
            [
                {
                    id:'select-type',
                    optionIdentifierAttrName: 'data-type-id'
                },
                {
                    id:'select-primary-type',
                    optionIdentifierAttrName: 'data-primary-type-id'
                }
            ],
            'description', 'id' , '/api/type/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

        pushMulti('select-tag', 'data-tag-id', 'tag', 'id' ,'/api/tag/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

    }
);