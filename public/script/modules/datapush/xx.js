import {pushMulti, pushMultiForSelects} from "../../util/select2";

function initializeDataPush() {
    pushMulti(
        'select-category',
        'data-category-id',
        'description',
        'id',
        'place_category',
        error => console.log(error),
        failure => console.log(failure)
    );

    pushMultiForSelects(
        [
            {id: 'select-type', optionIdentifierAttrName: 'data-type-id'},
            {id: 'select-primary-type', optionIdentifierAttrName: 'data-primary-type-id'}
        ],
        'description',
        'id',
        'place_type',
        error => console.log(error),
        failure => console.log(failure)
    );

    pushMulti(
        'select-tag',
        'data-tag-id',
        'tag',
        'id',
        'place_tag',
        error => console.log(error),
        failure => console.log(failure)
    );

    $.ajax({
        url: '/_text/product_category',
        method: 'GET',
        success: response => window.transporter.productCategories = response.hits,
        error: e => console.log(e.responseText),
        failure: e => console.log(e.responseText)
    });
}