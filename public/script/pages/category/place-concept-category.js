import StandardDatatable from "../../util/StandardDatatable.js";

$(document).ready(function () {
    StandardDatatable(
        'placeConceptCategoriesTable',
        '/_route/api/api/category/place/concepts',
        '/_route/api/api/category/place/concepts',
        '/_route/api/api/category/place/concepts',
        '/_route/api/api/category/place/concepts',
        false
    );
});