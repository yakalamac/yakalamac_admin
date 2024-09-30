import Ajax from "../../http/Ajax.js";
import productController from "../../http/api/product-controller.js";
import QueryBuilder from "../place/cuisine-categories/utils/QueryBuilder.js";

function setupProduct()
{
    $('#product-category-dropdown').select2({
        // İsteğe bağlı ayarlar
        language: "tr", // Türkçe dil desteği,
        placeholder: 'Bir kategori seçiniz.'
    });

    productController.getProduct(
        window.Laravel.productId,
        function(successProduct){

            const product = successProduct.message;
            console.log(product);
            pushProductCategories('#product-category-dropdown', product);
            pushProductTypes('#product-type-dropdown', product);
            pushProductTags('#product-tag-dropdown', product);
        }
     );


}

function pushProductTypes(select, product)
{
    $('#product-type-dropdown').select2({
        // İsteğe bağlı ayarlar
        language: "tr", // Türkçe dil desteği,
        placeholder: 'Bir tür seçiniz.'
    });

    Ajax.get(
        'es.yaka.la', 'product_type/_search', null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG,
        function(success){
            if(success.status == 200)
            {
                if(
                    success.message
                    && success.message.hits
                    && success.message.hits.hits
                    && Array.isArray(success.message.hits.hits)
                )
                {
                    let types = success.message.hits.hits;
                    let existingIds = product.types.map(type => type.id);
                    types.forEach(type => {
                        $(select).append($('<option>', {
                            value: type._id,
                            text: type._source.type,
                            selected: existingIds.includes(parseInt(type._id))
                        }));

                    });
                }
            }

        },
        function(failure){
            console.log(failure);
        },
        function(error){
            console.log(error);
        }
     );
}

function pushProductCategories(select, product)
{
    Ajax.get(
        'es.yaka.la', QueryBuilder.build('product_category/_search',QueryBuilder.mode.ELASTICSEARCH, 1, 100), null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG,
        function(success){
            if(success.status == 200)
            {
                if(
                    success.message
                    && success.message.hits
                    && success.message.hits.hits
                    && Array.isArray(success.message.hits.hits)
                )
                {
                    let categories = success.message.hits.hits;
                    let existingIds = product.categories.map(category =>category.id);
                    categories.forEach(category => {

                        $(select).append(
                            $(
                                '<option>',
                                {
                                    value: category._id,
                                    text: category._source.title,
                                    selected: existingIds.includes(parseInt(category._id))
                                }
                            )
                        );
                    });

                }
            }

        }
     );
}



function pushProductTags(select, product)
{
    $('#product-tag-dropdown').select2({
        // İsteğe bağlı ayarlar
        language: "tr", // Türkçe dil desteği,
        placeholder: 'Bir etiket seçiniz.'
    });

    Ajax.get(
        'es.yaka.la', 'product_tag/_search', null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG,
        function(success){
            if(success.status == 200)
            {
                if(
                    success.message
                    && success.message.hits
                    && success.message.hits.hits
                    && Array.isArray(success.message.hits.hits)
                )
                {

                    let tags = success.message.hits.hits;
                    let existingIds = product.hashtags.map(category =>category.id);
                    tags.forEach(tag => {
                        $(select).append($('<option>', {
                            value: tag._id,
                            text: tag._source.tag,
                            selected: existingIds.includes(parseInt(tag._id))
                        }));

                    });
                }
            }

        },
        function(failure){
            console.log(failure);
        },
        function(error){
            console.log(error);
        }
     );
}





/**
 * Entry point function
 */
$(document).ready(function()
{
    $(function () {
        $('.ajax').select2({
            language: "tr",
            placeholder: "İşletme Seçiniz...",
            minimumInputLength: 2,
            ajax: {
                url: window.Laravel.ajaxUrl,
                dataType: 'json',
                data: function (params) {
                    return {
                        q: $.trim(params.term)
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };
                }
            }
        })

        $('.add-photo-area').click(function () {
            $('.cloned-photos').append(
                '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"> <label class="col-form-label" for="basic-default-name">Fotoğraf Yolu</label><input type="file" class="form-control" id="basic-default-name" name="src[]" placeholder="Fotoğraf Yolu..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Genişlik(px)</label><input type="text" class="form-control" id="basic-default-name" name="width_px[]" placeholder="Genişlik(px)..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Yükseklik(px)</label><input type="text" class="form-control" id="basic-default-name" name="height_px[]" placeholder="Yükseklik(px)..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-photo-area"><i class="fa fa-trash"></i></a></div></div>'
            )
        })

        $(document).on('click', '.remove-photo-area', function () {
            $(this).parent().parent().remove()
        })

        $('.add-address-area').click(function () {
            $('.cloned-addresses').append(
                '<div class="row mb-6 border-top pt-3"><div class="col-lg-6"><label class="col-form-label" for="basic-default-name">Kısa Adres</label><input type="text" class="form-control" id="basic-default-name" name="short_address" placeholder="Kısa Adres..." /></div><div class="col-lg-6"><label class="col-form-label" for="basic-default-name">Uzun Adres</label><input type="text" class="form-control" id="basic-default-name" name="long_address" placeholder="Uzun Adres..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-address-area"><i class="fa fa-trash"></i></a></div></div>'
            )
        })

        $(document).on('click', '.remove-address-area', function () {
            $(this).parent().parent().remove()
        })

        $('.add-hour-area').click(function () {
            $('.cloned-hours').append(
                '<div class="row mb-6 border-top pt-3"><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açılış Saati</label><input type="text" class="form-control" id="basic-default-name" name="open[]" placeholder="Açılış Saati..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Kapanış Saati</label><input type="text" class="form-control" id="basic-default-name" name="close[]" placeholder="Kapanış Saati..." /> </div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün</label><input type="text" class="form-control" id="basic-default-name" name="day[]" placeholder="Gün..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün Adı</label><input type="text" class="form-control" id="basic-default-name" name="day_text[]" placeholder="Gün Adı..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control" id="basic-default-name" name="language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control" id="basic-default-name" name="description[]" placeholder="Açıklama..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-hour-area"><i class="fa fa-trash"></i></a></div></div>'
            )
        })

        $(document).on('click', '.remove-hour-area', function () {
            $(this).parent().parent().remove()
        })

        $('.add-option-area').click(function () {
            $('.cloned-options').append(
                '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Fiyata Etkisi</label><input type="text" class="form-control" id="basic-default-name" name="option_price[]" placeholder="Fiyata Etkisi..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control" id="basic-default-name" name="option_description[]" placeholder="Açıklama..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control" id="basic-default-name" name="option_language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-option-area"><i class="fa fa-trash"></i></a></div></div>'
            )
        })

        $(document).on('click', '.remove-option-area', function () {
            $(this).parent().parent().remove()
        })
    })

    setupProduct();



});
