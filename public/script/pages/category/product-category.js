import StandardDatatable from "../../util/StandardDatatable.js";
$(document).ready(function () {
    StandardDatatable(
        'productCategoriesTable',
        '/_route/api/api/category/products',
        '/_route/api/api/category/products',
        '/_route/api/api/category/products',
        '/_route/api/api/category/products',
        false
    );
});