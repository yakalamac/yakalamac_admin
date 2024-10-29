import StandardDatatable from "../../util/StandardDatatable.js";

$(document).ready(function () {
    StandardDatatable(
        'placeAccountCategoriesTable',
        '/_route/api/api/category/accounts',
        '/_route/api/api/category/accounts',
        '/_route/api/api/category/accounts',
        '/_route/api/api/category/accounts',
        false
    );
});