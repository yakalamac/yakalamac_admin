const onPost = ()=>{
    console.log("Onur")
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
