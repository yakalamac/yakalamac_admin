import CategoryController from "../../../http/api/category-controller.js";

const onPost = ()=>{
    CategoryController.postPlaceCategory(
        {
            title: $('input[name="title"]').val(),
            description: $('input[name="description"]').val()
        },
        function (success){
            $('input[name="title"]').val(success.message.title);
            $('input[name="description"]').val(success.message.description);
        }
    );
};

$(document).ready(
    function () {
        $('form').on('submit', function (event) {
            //prevent to form reloding
            event.preventDefault();
            onPost();
        });
        Page.ready();
    }
);
