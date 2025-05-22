if(window.$ === undefined) throw new Error('Jquery not found');

import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {apiDelete} from "../../modules/api-controller/ApiController.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";

window.category_adapter=data=>({text: data.description, id: data.id});
window.tag_adapter=data=>({text: data.tag, id: data.id});

$(document).ready(function () {
    initializeSelect2Auto();

    const productId = window.Twig.productId;

    $('.product-edit-save').on('click', async function () {
        const saveButton = $(this);

        const productName = $('#product-name').val().trim();
        if (!productName) {
            toastr.error("Ürün adı boş bırakılamaz.");
            return;
        }

        saveButton.prop('disabled', true);
        const originalButtonText = saveButton.text();
        saveButton.text('Lütfen bekleyiniz...');

        try {
            let options = [];
            $('#repeater-product-options .items').each(function () {
                let option = {
                    price: parseFloat($(this).find('input[data-name="price"]').val()) || 0,
                    description: $(this).find('input[data-name="description"]').val(),
                    languageCode: $(this).find('input[data-name="languageCode"]').val(),
                };
                options.push(option);
            });
            const productType = $('#product-type');
            const productCategory = $('#product-category');
            const productTag = $('#product-tag');

            const productData = {
                name: productName,
                price: parseFloat($('#product-price').val()) || 0,
                active: $('#input39').is(':checked'),
                description: $('#product-description').val(),
                categories: productCategory.val() ? productCategory.val().map(id => `/api/category/products/${id}`) : [],
                types: productType.val() ? productType.val().map(id => `/api/type/products/${id}`) : [],
                hashtags: productTag.val() ? productTag.val().map(id => `/api/tag/products/${id}`) : [],
                // options: options,
                sources: [],
            };

            await $.ajax({
                url: `/_json/products/${productId}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(productData),
                    success: function (response) {
                        toastr.success("Ürün başarıyla güncellendi.");
                    },
                    error: function (xhr, status, error) {
                        console.error('error::', error);
                    }
            });

        } catch (err) {
            toastr.error("Ürün güncellenirken bir hata ile karşılaşıldı. Yönetici ile iletişime geçiniz.");
            console.error("Error:", err);
        } finally {
            saveButton.prop('disabled', false);
            saveButton.text(originalButtonText);
        }
    });

    function initializeRepeaters() {
        const optionsData = window.Twig.productOptions;
        $("#repeater-product-options").createRepeater({
            showFirstItemToDefault: optionsData.length === 0,
            defaultValues: {
                "options": [{}]
            },
            data: {
                "options": optionsData.map(option => ({
                    "id": option.id,
                    "price": option.price,
                    "description": option.description,
                    "languageCode": option.languageCode,
                })),
            },
        });

        const photosData = window.Twig.photosData;

        $("#repeater-product-photos").createRepeater({
            showFirstItemToDefault: true,
            defaultValues: {
                "photos": [{}]
            }
        });
    }
    initializeRepeaters();

    $('#existing-photos').on('click','button.photo-delete-button',function(){

        const photoId = $(this).data('photo-id');
        if(photoId === undefined || photoId === null || photoId === 'undefined' || photoId === 'null'){
            toastr.error('Geliştirici ekibiyle iletişime geçiniz. Silinmek istenilen fotoğraf kimliğine erişilemiyor.');
            return;
        }

        //window.location.href = `/admin/product/photo/${photoId}`;
        const button = $(this);
        button.prop('disabled', true);
        button.text('Siliniyor');
        function onFail(){
            button.prop('disabled', false);
            button.text('Sil');
        }

        apiDelete(`/_json/product/photos/${photoId}`, {
            successMessage: 'Fotoğraf başarıyla silindi',
            failureMessage: 'Fotoğraf silinirken bir hata oluştu',
            errorMessage: 'Fotoğraf silinirken bir hata oluştu',
            success:()=> button.closest('.existing-photo-item').remove(),
            failure: onFail, error: onFail
        });
    });

    FancyFileUploadAutoInit(
        'input#fancy_file_upload_image_input',
        '/_multipart/product/photos',
        {
                data: (current) => {
                    return JSON.stringify({
                        product: `/api/products/${window.Twig.productId}`
                    });
                }
            },
        ['png', 'jpg'],
        {listener: '#button-photo-add', modal: 'div#fancy_file_upload_image'},
    );
});
