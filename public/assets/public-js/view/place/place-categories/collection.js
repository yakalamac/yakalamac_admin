import Ajax from '../../../http/Ajax.js';
import Elasticsearch from "../../../http/constraints/Elasticsearch.js";
import TableHandler from "./utils/tableHandler.js";
import PaginationHandler from "../cuisine-categories/utils/PaginationHandler.js";
import QueryBuilder from "../cuisine-categories/utils/QueryBuilder.js";

function onSuccess(success)
{
    TableHandler.pushCategories(success.message);
    PaginationHandler.pushPages(success.message);
}

function onFailure(failure)
{
    console.log(failure);
}

function onError(error)
{
    console.log(error);
}

$(document).ready(function (){
    Ajax.get(
        Elasticsearch.HOST_ELASTICSEARCH,
        QueryBuilder.build(Elasticsearch.SEARCH_PLACE_CATEGORY, QueryBuilder.mode.ELASTICSEARCH),
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
