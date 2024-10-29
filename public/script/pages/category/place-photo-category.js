import StandardDatatable from "../../util/StandardDatatable.js";

$(document).ready(function () {
   StandardDatatable(
       'placePhotoCategoriesTable',
       '/_route/api/api/category/place/photos',
       '/_route/api/api/category/place/photos',
       '/_route/api/api/category/place/photos',
       '/_route/api/api/category/place/photos',
       false
   );
});