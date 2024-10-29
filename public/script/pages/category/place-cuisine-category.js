import StandardDatatable from "../../util/StandardDatatable.js";

$(document).ready(function () {
    StandardDatatable(
        'placeCuisineCategoriesTable',
        '/_route/api/api/category/place/cuisines',
        '/_route/api/api/category/place/cuisines',
        '/_route/api/api/category/place/cuisines',
        '/_route/api/api/category/place/cuisines',
        false
    );
});