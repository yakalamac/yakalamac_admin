$(document).ready(function() {
    $('.discount-option').change(function() {
        const id = $(this).attr('id');
        if($(this).is(':checked')) {
            $('#input-' + id).slideDown();
        } else {
            $('#input-' + id).slideUp();
        }
    });
});