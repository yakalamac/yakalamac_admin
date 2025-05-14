if(!window.$) throw new Error('jquery was not loaded');const nonce = btoa(Date.now().toString());window[nonce] = {stage: 0};
if(window.Twig === undefined) window.Twig = {};

document.addEventListener('keydown', function(event) {
    const tag = event.target.tagName.toLowerCase();
    if (event.key === 'Enter' && (tag === 'input' || tag === 'textarea')) {
        event.preventDefault();
        gonext();
    }
});

const updateDataStageInteraction = function (interaction) {
    $('[data-stage-interaction]').each((index, element)=>{
       $(element).attr('hidden', $(element).attr('data-stage-interaction') !== interaction)
    });
}

const updateNextButtonState = function (){
    const next = $('[data-button-type="next"]');
    if(window[nonce].stage === 2) {
        next.addClass('btn-grd-danger');
        next.text('Tamamla');
        next.attr('type', 'submit');
        updateDataStageInteraction('complete');
        return;
    }

    next.removeClass('btn-grd-danger');
    next.text('İlerle');
    next.attr('type', 'button');
}

const updateBackButtonState = function (){
    if(window[nonce].stage === 0) $('[data-button-type="back"]').addClass('disabled');
    else $('[data-button-type="back"]').removeClass('disabled');

}

function checkFieldRequirement(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function validateFieldValue (type, value) {
    switch (type) {
        case 'email':
            return /^[a-z][a-z0-9_.]{2,}@[a-z]{2,}\.[a-z]{2,}/.test(value);
        case 'password': return true;
        case 'number': /[0-9]+/.test(value);
    }
}

const checkStageRequirements = function (dataStage) {
    const form = document.createElement('form');
    $(form).append($(dataStage).clone());
    const data = new FormData(form);

    $(dataStage).find('input, select').each((index, element) => {
        $(element).attr('hidden', false);
    });

    for(const [field,value]  of data.entries()) {
        let valid = true;
        const input = $(form).find(`[name="${field}"]`);
        if(input.attr('required') !== undefined)  {
            valid &= checkFieldRequirement(value);
        }

        if(input.get(0) instanceof HTMLInputElement ) {
            const type = $(input.get(0)).attr('type');
            if(['email', 'password', 'number'].includes(type)) valid &= validateFieldValue(type, value);
        }

        if(!valid) {
            $(dataStage).find(`[name="${field}"]`).focus();
            $(form).remove();
            return false;
        }
    }

    $(form).remove();
    return true;
};

/**
 * Updates the visibility and state of form elements based on the current stage.
 * 
 * This function performs the following tasks:
 * - Shows only the current stage elements while hiding others
 * - Updates the state of navigation buttons (Next/Back)
 * - Ensures Select2 elements are visible and accessible
 * - Makes form elements (inputs, selects) visible and manages their tabindex
 * - Updates the visual appearance of stage indicators using CSS classes
 * 
 * @function affect
 * @requires jQuery
 * @requires select2
 * @global {Object} window[nonce] - Contains the current stage information
 * @example
 * affect();
 */
const affect = function () {
    const currentStage = window[nonce].stage; 

    // Show only the current step, hide others
    $('[data-stage]').each((index, element) => {
        $(element).attr('hidden', index !== currentStage);
    });

    // Update "Next" and "Back" button states
    updateNextButtonState();
    updateBackButtonState();

    // Ensure Select2 elements are visible and accessible
    $('#cuisinetype').each((index, element) => {
        const $select2 = $(element);
        $select2.attr('aria-hidden', false);
    });

    // Make form inputs/selects visible and accessible
    $('input, select').each((index, element) => {
        const $element = $(element);
        $element.attr('hidden', false);
        $element.removeAttr('tabindex');
    });

    // Update step indicators' colors based on the current step
    $('[data-stage-pre]').each((index, element) => {
        const stage = $(element).attr('data-stage-pre');
        if (stage === undefined) return;

        if (stage.toString() === window[nonce].stage.toString()) {
            $(element).removeClass('bg-secondary').addClass('bg-primary');
        } else {
            $(element).removeClass('bg-primary').addClass('bg-secondary');
        }
    });
};

const gonext = () => {
    if(window[nonce].stage === 2) return;
    const stage = $(`div[data-stage="${window[nonce].stage}"]`);
    if(checkStageRequirements(stage)) {
        window[nonce].stage = (window[nonce].stage+1)%4;
        affect();
    } else {
        toastr.error('Boş veya hatalı alanları doldurunuz.');
    }
};

const goback = ()=>{
    if(window[nonce].stage === 0) return;
    window[nonce].stage = (window[nonce].stage-1)%4;
    affect();
};

$(document).ready(function () {
    $('#custom-search-bar-plugin').SearchBox({
        onSearch: (input) => {
            $('#loader').removeClass('d-none');

            return fetch("/_google/service:searchPlace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ textQuery: input }),
            })
                .then(async (response) => {
                    $('#loader').addClass('d-none');

                    if(response.ok) {
                        const json = await response.json();
                        return json.places || [];
                    }

                    return [];
                })
                .catch((e) => {$('#loader').addClass('d-none');
                    console.error(e);
                    return [];});
        },
        onResult: (result) => {
            return `<strong data-name="${result.displayName.text}" data-address="${result.formattedAddress}" data-lat="${result.location.latitude}" data-lng="${result.location.longitude}">${result.displayName.text}</strong><br><small>${result.formattedAddress}</small>`;
        },
        onResultClick: (event) => {
            const strong = $(event.currentTarget).find('strong')[0];
            if (strong.length === 0) {
                console.error('No <strong> element found in the clicked target');
                return;
            }

            return strong.getAttribute('data-name');
        },
        delay: 200,
        minimumSearchLength: 3,
        onNoneResult: () => '<small>Hiç sonuç bulunamadı.</small>',
        closeOnResultClick: true,
        placeholder: 'İşletme adresi ya da adı girin',
        maxResults: 25
    });

    affect();

    $('form').on('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
    
        const formData = $(this).serializeArray();
        const data = {};
        formData.forEach(item => data[item.name] = item.value);
    
        //console.log('Gönderilen veri:', data);
    
        $.ajax({
            url: '/appointment', 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
            //console.log('Başarılı:', response);
            },
            error: function(xhr, status, error) {
            console.error('Hata:', error);
            }
        });
    });

    $('[data-button-type="next"]').on('click', gonext);

    $('[data-button-type="back"]').on('click', goback);

    $('#cuisinetype').select2(
        {
            theme: 'bootstrap-5',
            placeholder: 'En az bir değer belirtiniz',
            language: {
                searching: function() {
                    return "Listeleniyor...";
                },
                noResults: function() {
                    return "Aramanızla eşleşen sonuç bulunamadı.";
                }
            },
            ajax: {
                url: '/_text/cuisine_category',
                type: 'POST',
                dataType: 'json',
                delay: 150,
                data: function(params) {
                    return { q: params.term };
                },
                processResults: function(data) {
                    if(data?.hits?.hits) data = data.hits.hits;
                    return {
                        results: Array.from(data).map(d => ({
                                id: d._id,
                                text: d._source.description
                            })
                        )
                    }
                },
                cache: true
            },
            minimumInputLength: 0,
        }
    );

    $('input.form-check-input.delivery-method.cursor-pointer').on('input', function (event){
       $('input.form-check-input.delivery-method.cursor-pointer').each((index, element) => {
           element.checked = element === event.currentTarget;
       });
    });

});
