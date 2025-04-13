if(!window.$) throw new Error('jquery was not loaded');const nonce = btoa(Date.now().toString());window[nonce] = {stage: 0};
if(window.Twig === undefined) window.Twig = {};

const updateDataStageInteraction = function (interaction) {
    $('[data-stage-interaction]').each((index, element)=>{
       $(element).attr('hidden', $(element).attr('data-stage-interaction') !== interaction)
    });
}

const updateNextButtonState = function (){
    const next = $('[data-button-type="next"]');
    if(window[nonce].stage === 3) {
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

const affect = function () {
    $('[data-stage]').each((stage, element) => $(element).attr('hidden', stage !== window[nonce].stage));
    updateNextButtonState();
    updateBackButtonState();

    // Make sure Select2 elements are shown and accessible
    $('#cuisinetype').each((index, element) => {
        const $select2 = $(element);
        $select2.attr('aria-hidden', false); // Make Select2 visible for validation
        //$select2.select2("open"); // Optionally open Select2 if required
    });

    // Ensure other fields are not hidden and can be focused on
    $('input, select').each((index, element) => {
        const $element = $(element);
        $element.attr('hidden', false); // Make sure they are visible
        $element.removeAttr('tabindex'); // Remove tabindex="-1" if it's present
    });
};

const gonext = () => {
    if(window[nonce].stage === 3) return;
    const stage = $(`div[data-stage="${window[nonce].stage}"]`);
    if(checkStageRequirements(stage)) {
        window[nonce].stage = (window[nonce].stage+1)%4;
        affect();
    } else {
        toastr.error('Invalid fileds');
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
            return fetch("/_google/service:searchPlace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ textQuery: input }),
            })
                .then(async (response) => {
                    const json = await response.json();
                    return json.places || [];
                })
                .catch((e) => console.error(e) || []);
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
        delay: 2000,
        minSearchLength: 2,
        onNoneResult: () => '<h1>Hiç sonuç bulunamadı.</h1>',
        closeOnResultClick: true,
        placeholder: 'İşletme adresi ya da adı girin',
        maxResults: 100
    });

    affect();

    $('form').on('submit', function(event){
        console.log('submit')
        event.preventDefault();
        event.stopPropagation();
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
