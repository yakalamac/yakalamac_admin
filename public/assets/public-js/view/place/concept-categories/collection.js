import Ajax from '../../../http/Ajax.js';
import Elasticsearch from "../../../http/constraints/Elasticsearch.js";
import TableHandler from "./utils/tableHandler.js";
import CategoryController from "../../../http/api/category-controller.js";
import PageHandler from "../cuisine-categories/utils/PaginationHandler.js";
function onSuccess(success)
{
    TableHandler.pushCategories(success.message);
    PageHandler.pushPages(success.message);
    $('a.trash-me-element').on('click',function (event){
        CategoryController.deletePlaceConceptCategory(event.target.id,
            function (success) {
                event.target.parentElement.parentElement.parentElement.remove();
                console.log(success);
            });
    });
}

function onFailure(failure)
{

}

function onError(error)
{
    console.log(error);
}

$(document).ready(function (){
   Ajax.get(
            Elasticsearch.HOST_ELASTICSEARCH,
            Elasticsearch.SEARCH_CONCEPT_CATEGORY,
            null,
            null,
            null,
            'application/json',
            'application/json',
            Ajax.flags.DEFAULT_FLAG,
            onSuccess,
            onFailure,
            onError
        );
});

