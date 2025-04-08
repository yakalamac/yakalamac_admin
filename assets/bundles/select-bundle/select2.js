if(!window.$) throw new Error('JQuery was not found.');

function __throw(err){
    throw new Error(err);
}

export function initializeSelect2Auto()
{
    $('[data-auto-select2="true"]').each(function(){
        const adapter = $(this).data('adapter');
        if(adapter === undefined) throw new Error('No adapter definition found');
        if(!window[adapter] || typeof window[adapter] !== 'function') __throw('Invalid adapter definition. No found as global method or not a function')
        initializeSelect2($(this), window[adapter]);
    });
}

/**
 *
 * @param selector
 * @param adapter
 */
export function initializeSelect2(selector, adapter)
{
    if (typeof $.fn.select2 !== 'function') {
        console.error('$ is not jQuery or Select2 is not defined. Please check your library includes.');
        return;
    }
    const select = typeof selector === 'string' ? $(selector) : selector;

    const config = {
        source: select.data('source') ?? __throw('No source specified'),
        size : select.data('size') ?? 20,
        placeholder : select.data('placeholder') ?? __throw('No place holder specified')
    };
    select.select2({
        theme: "bootstrap-5", placeholder: config.placeholder, closeOnSelect: true, tags: true,
        width: $(this).data('width') ??  $(this).hasClass('w-100') ? '100%' : 'style',
        ajax: {
            url: `/_text/${config.source}`, delay: 1000,
            data: (query)=> {
                const template = {size: config.size};
                if(typeof query.term === 'string' && query.term.length > 2) {
                    template.q = query.term;
                }

                if(query.page) {
                    template.from = query.page * config.size;
                }

                return template;
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: (data.hits?.hits || []).map(hit=> adapter(hit._source)),
                    pagination: {
                        more: (params.page*config.size) < data.hits.total.value
                    }
                };
            },
            cache: true
        },
        cache: true
    });
}