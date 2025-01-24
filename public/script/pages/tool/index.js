if(!window.$) throw new Error('Jquery is not defined');

$(document).ready(function (){
    $('#tool-searchbar').on('input', (event) => {
       // todo
    });

    $('[data-type="converter-tool"]').on('click', event => {
        const functionContainer = $('.functional-container');
        functionContainer.find('#inputGroupAdaptorSelect').val(
            event.currentTarget.getAttribute('data-function')
        );
        $('.main-container').attr('hidden', true);
        functionContainer.attr('hidden', false);
    });

    $('[data-type="function-close"]').on('click', event => {
        $('.main-container').attr('hidden', false);
        $('.functional-container').attr('hidden', true);
    });

    $('.functional-container form').on('submit', function (event){
        event.stopPropagation();
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const adaptor = formData.get('adaptor');
        if(!['apify', 'octoparse', 'google-version-2'].includes(adaptor)) {
            //warning todo
            return;
        }
        formData.delete('adaptor');
        const converter = new Converter(adaptor, formData);
        converter.run();

    });

    $('#image-uploadify').imageuploadify();


});