import Ajax from "../../../http/Ajax.js";
import Elasticsearch from "../../../http/constraints/Elasticsearch.js";
import ElasticsearchParser from "../../../http/elasticsearch/Parser.js";

const fetchCategory = (id) => {
    console.log(id);
    Ajax.get(
        Elasticsearch.HOST_ELASTICSEARCH,
        `place_cuisine_category/_doc/${id}`,
        null, null, null,
        'application/json', 'application/json',
        Ajax.flags.DEFAULT_FLAG,
        function (success){
            const category = ElasticsearchParser.extractSourceFromHit(success.message);

            $('input[name="title"]').val(category.title);
            $('input[name="description"]').val(category.description);
        },
        function (failure){
            console.log(failure)
        },
        function (error){
            console.log(error)
        }
    );
};

const patchCategory = () => {

};

$(document).ready(
    function () {
        fetchCategory(window.Laravel.id);
    }
);
