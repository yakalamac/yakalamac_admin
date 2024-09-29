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
    fetch('https://api.yaka.la/api/category/place/cuisines')
        .then(response=>{
            if(response.ok)
                console.log(response.json());
        }).catch(error=>{
            console.log(error);
    });

    $.ajax(
        {
            url: 'https://api.yaka.la/api/category/place/cuisines',
            type: 'GET',
            contentType: 'application/json',
            headers:{
              'accept' : 'application/json',
              'Content-Type' : 'application/json'
            },
            success: s=>console.log(s),
            error: e=>console.log(e),
            failure: f=>console.log(f),

        }
    );
    return Ajax.get(
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
}
