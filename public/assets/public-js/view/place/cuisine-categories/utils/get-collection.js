import Ajax from '../../../../http/Ajax.js';
import Elasticsearch from "../../../../http/constraints/Elasticsearch.js";
import TableHandler from "./tableHandler.js";
import Api from "../../../../http/constraints/Api.js";

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
        Api.HOST_API,
        Api.MENU_CUISINES,
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
