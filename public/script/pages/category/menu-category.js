import StandardDatatable from "../../util/StandardDatatable.js";

$(document).ready(function () {
    StandardDatatable(
        'menu   CategoriesTable',
        '/_route/api/api/category/menus',
        '/_route/api/api/category/menus',
        '/_route/api/api/category/menus',
        '/_route/api/api/category/menus',
        false
    );
});