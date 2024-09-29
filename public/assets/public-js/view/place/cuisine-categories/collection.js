import Ajax from '../../../http/Ajax.js';
import Elasticsearch from "../../../http/constraints/Elasticsearch.js";
import TableHandler from "./utils/tableHandler.js";
import StatusBar from "../../../template/status-bar.js";
function onSuccess(success)
{
    TableHandler.pushCategories(success.message);
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
        Elasticsearch.SEARCH_CUISINE_CATEGORY,
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
