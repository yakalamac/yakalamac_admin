$(document).ready(function () {

    const iElement = $('#show_hide_password i');
    const inputElement = $('#show_hide_password input');

    $("#show_hide_password a").on('click', function (event)
    {
        event.preventDefault();

        if (inputElement.attr("type") === "text")
        {
            inputElement.attr('type', 'password');
            iElement.addClass("bi-eye-slash-fill");
            iElement.removeClass("bi-eye-fill");
        }
        else if (inputElement.attr("type") === "password")
        {
            inputElement.attr('type', 'text');
            iElement.removeClass("bi-eye-slash-fill");
            iElement.addClass("bi-eye-fill");
        }
    });
});