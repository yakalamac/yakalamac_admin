import Ajax from '../../../http/Ajax.js';
import Elasticsearch from "../../../http/constraints/Elasticsearch.js";
import TableHandler from "./utils/tableHandler.js";
import PageHandler from "./utils/PaginationHandler.js";
import QueryBuilder from "./utils/QueryBuilder.js";
function onSuccess(success)
{
    TableHandler.pushCategories(success.message);
    PageHandler.pushPages(success.message);
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
        QueryBuilder.build(Elasticsearch.SEARCH_CUISINE_CATEGORY, QueryBuilder.mode.ELASTICSEARCH),
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
