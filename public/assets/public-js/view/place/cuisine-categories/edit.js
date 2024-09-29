import Ajax from "../../../http/Ajax.js";
import Elasticsearch from "../../../http/constraints/Elasticsearch.js";
import ElasticsearchParser from "../../../http/elasticsearch/Parser.js";
import Api from "../../../http/constraints/Api.js"
import StatusBar from "../../../template/status-bar.js";

function onPatch(id) {
    const _title = $('input[name="title"]').val();
    const _description = $('input[name="description"]').val();
    Ajax.patch(
        Api.HOST_API,
        `${Api.MENU_CUISINES}/${id}`,
        {
            title: _title,
            description: _description
        },
        null, null,
        'application/json',
        'application/merge-patch+json',
        Ajax.flags.DEFAULT_FLAG,
        function (success) {
          console.log(success);
        },
        function (failure) {
            console.log(failure);
        },
        function (error) {
            console.error(error)
        }
    )
}

const fetchCategory = (id) => {
    Ajax.get(
        Elasticsearch.HOST_ELASTICSEARCH,
        `place_cuisine_category/_doc/${id}`,
        null, null, null,
        'application/json', 'application/json',
        Ajax.flags.DEFAULT_FLAG,
        function (success) {
            const category = ElasticsearchParser.extractSourceFromHit(success.message);
            $('input[name="title"]').val(category.title);
            $('input[name="description"]').val(category.description);
        },
        function (failure) {
            console.log(failure)
        },
        function (error) {
            console.log(error)
        }
    );
};

$(document).ready(
    function () {
        fetchCategory(window.Laravel.id);
        $('form').on('submit', function (event) {
            //prevent to form reloding
            event.preventDefault();
            onPatch(window.Laravel.id);
        });
    }
);
