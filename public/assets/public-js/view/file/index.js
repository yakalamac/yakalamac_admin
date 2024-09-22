import PlaceController from "../../http/api/place-controller.js";
import ProductController from "../../http/api/product-controller.js";
import SourceController from "../../http/api/source-controller.js";
import MenuController from "../../http/api/menu-controller.js";
import TypeController from "../../http/api/type-controller.js";
import TagController from "../../http/api/tag-controller.js";
import CategoryController from "../../http/api/category-controller.js";
import FileReader from "../../util/file.js";
import Elasticsearch from "../../http/elasticsearch/Search.js";

import ApiConstraints from "../../http/constraints/Api.js";
import ElasticSearchConstraints from "../../http/constraints/Elasticsearch.js";
import Google from "../../http/google/Google.js";

let selectedPlace = null;


const errorMaker = (failureResponse)=>{
    if(typeof failureResponse !== 'object')
    {
        if(typeof failureResponse === 'string')
        {
            try{
                failureResponse = JSON.parse(failureResponse);
            }catch (e)
            {
                failureResponse = e;
            }
        }
        else
            failureResponse = {
                message: "Cevap bir object veya string değil.",
                status: 400
            };
    }

    const message = JSON.stringify(failureResponse);
    const status = failureResponse.status || 'error';

    return `
          <div class="error-message ${status}">
            <p>${message}</p>
        </div>
    `;
};


const readyEvents = ()=>{
    $(document).on('click', '.remove-photo-area', function() {
        $(this).parent().parent().remove()
    })

    $('.add-address-area').click(function() {
        $('.cloned-addresses').append(
            '<div class="row mb-6 border-top pt-3"><div class="col-lg-6"><label class="col-form-label" for="basic-default-name">Kısa Adres</label><input type="text" class="form-control" id="basic-default-name" name="short_address" placeholder="Kısa Adres..." /></div><div class="col-lg-6"><label class="col-form-label" for="basic-default-name">Uzun Adres</label><input type="text" class="form-control" id="basic-default-name" name="long_address" placeholder="Uzun Adres..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-address-area"><i class="fa fa-trash"></i></a></div></div>'
        )
    })

    $(document).on('click', '.remove-address-area', function() {
        $(this).parent().parent().remove()
    })

    $('.add-hour-area').click(function() {
        $('.cloned-hours').append(
            '<div class="row mb-6 border-top pt-3"><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açılış Saati</label><input type="text" class="form-control" id="basic-default-name" name="open[]" placeholder="Açılış Saati..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Kapanış Saati</label><input type="text" class="form-control" id="basic-default-name" name="close[]" placeholder="Kapanış Saati..." /> </div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün</label><input type="text" class="form-control" id="basic-default-name" name="day[]" placeholder="Gün..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Gün Adı</label><input type="text" class="form-control" id="basic-default-name" name="day_text[]" placeholder="Gün Adı..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control" id="basic-default-name" name="language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-2"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control" id="basic-default-name" name="description[]" placeholder="Açıklama..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-hour-area"><i class="fa fa-trash"></i></a></div></div>'
        )
    })

    $(document).on('click', '.remove-hour-area', function() {
        $(this).parent().parent().remove()
    })

    $('.add-option-area').click(function() {
        $('.cloned-options').append(
            '<div class="row mb-6 border-top pt-3"><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Fiyata Etkisi</label><input type="text" class="form-control" id="basic-default-name" name="option_price[]" placeholder="Fiyata Etkisi..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Açıklama</label><input type="text" class="form-control" id="basic-default-name" name="option_description[]" placeholder="Açıklama..." /></div><div class="col-lg-4"><label class="col-form-label" for="basic-default-name">Dil Kodu</label><input type="text" class="form-control" id="basic-default-name" name="option_language_code[]" placeholder="Dil Kodu..." /></div><div class="col-lg-12 mt-2"><a href="javascript:;" class="text-danger remove-option-area"><i class="fa fa-trash"></i></a></div></div>'
        )
    })

    $(document).on('click', '.remove-option-area', function() {
        $(this).parent().parent().remove()
    })
};

/**
 * Event function that triggers on uploaded file saving process
 * @param event
 */
function onUploadFile (event)
{
    event.preventDefault();
    // Get selected place ID
    console.log(selectedPlace);

    // Get the file from file input
    const file = $('#file')[0].files[0];

    FileReader.onData(file, data =>
    {
        try {
            const json = JSON.parse(data);
            if(json.url)
            {
                const urlParts = json.url.split('/');
                let sourceId = Array.isArray(urlParts) ? (
                    urlParts[urlParts.length-1].length < 6 ? urlParts[urlParts.length-1] : urlParts[urlParts.length-2]
                ) : null;

                SourceController.postPlaceSource({
                        place: `/api/places/${selectedPlace.id}`,
                        category: '/api/category/sources/10',
                        sourceId: sourceId,
                        sourceUrl: json.url
                    },
                    function(response)
                    {
                        console.log(response);
                        $('div#on-success').innerHTML += JSON.stringify(response);
                    },
                    function (err){
                        $('div#on-error').innerHTML += err.responseText + '<br>';
                    }
                )
            }
            else {
                $('div#on-error').innerText += 'Kategori bilgisi eklenemedi.<br>';
            }

            if(json.products) {
                if(Array.isArray(json.products))
                    Array.from(json.products).forEach(
                        product =>uploadProduct(product, selectedPlace.id)
                    );
            }
            else {
                $('div#on-error').innerText += 'Ürün bilgisi bulunamadı.<br>';
            }
        }catch (error)
        {
            console.error(error);
        }
    });
}


/**
 * @property {string} name
 * @property {string} price
 * @property {string} description
 * @property {string} image
 * @typedef Product
 */

/**
 * Uploads products which are readed from file
 * @param {string} placeId
 * @param {Product} product
 */
function uploadProduct(product, placeId)
{
    ProductController.postProduct({
            place: `/api/places/${placeId}`,
            name: product.name ?? 'undefined',
            active: false,
            price: 0,
            description: product.description ?? 'Tanımsız'
        },
        function(response) {
            console.log(response);
            $('div#on-success').innerText += JSON.stringify(response);
        },
        function (err){
        console.log(err);
        $('div#on-error').innerText += err + '<br>';
        },
        function (err){
        console.log(err);
        }
        );
}

function onGetPlaceByGoogle(event)
{
    let value = $('input#textByGoogle').val();

    if(value && (value = value.trim()).length > 0)
    {
        Google.getPlace(
            value,
            function (successResponse){
                console.log("sfsdf")
                console.log(JSON.parse(successResponse));
            },
            function (failureResponse){
                console.log("FAİLURE")
                console.log(failureResponse);
                    console.log(document.querySelector('div#on-error'))
                document.querySelector('div#on-error').innerHTML = errorMaker(failureResponse);
            },
            function (error){
                document.querySelector('div#on-error').innerHTML = errorMaker(error);
            }
            );
    }
}

function uploadImage(url, productId)
{
    console.log("sd1");
}



/**
 * Entry point function
 */
$(document).ready(function()
{
    readyEvents();

    $('.select2').select2();

    $('.ajax').select2({
        language: "tr",
        placeholder: "İşletme Seçiniz...",
        minimumInputLength: 2,
        ajax: Elasticsearch.byPlaceName(window.Laravel.ajaxUrl)
});

    $('#mySelect2').on('select2:select', function (e) {
        selectedPlace = e.params.data;
    });

    $('#upload-file').on('submit',onUploadFile);

    $('#byGoogle').on('click' ,onGetPlaceByGoogle);
});
