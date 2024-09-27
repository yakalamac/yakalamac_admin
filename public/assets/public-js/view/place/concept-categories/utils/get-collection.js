import Ajax from '../../../../http/Ajax.js';
import Elasticsearch from "../../../../http/constraints/Elasticsearch.js";
import TableHandler from "./tableHandler.js";
function onSuccess(success)
{
    TableHandler.pushCategories(success.message);
}

function onFailure(failure)
{

}

function onError(error)
{
    console.log(error);
}


export default function run()
{
    return Ajax.get(
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
}
