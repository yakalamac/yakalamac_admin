if(!window.$) throw new Error('JQuery was not found.');

function __throw(err){
    throw new Error(err);
}

export function initializeSelect2Auto()
{
    $('[data-auto-select2="true"]').each(function(){
        const adapter = $(this).data('adapter');
        if(adapter === undefined) throw new Error('No adapter definition found for ' + this.outerHTML);
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

    /** Store results locally in the array cache */
    const LocalCacheStorage = {};

    /** @var {{select2:function}} select */
    select.select2({
        theme: "bootstrap-5", placeholder: config.placeholder, closeOnSelect: true, tags: false,
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
            transport: function (params, success, failure) {
                const cacheKey = `page_${params.data.from ?? 0}_${params.data.size ?? config.size}_${params.data.q ?? 'no_query'}`;
                if (LocalCacheStorage[cacheKey]) {
                    success(LocalCacheStorage[cacheKey]);
                    return;
                }

                const $request = $.ajax(params);
                $request.then((data)=>{
                    LocalCacheStorage[cacheKey] = data;
                    success(data);
                });
                $request.fail(failure);
                return $request;
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                const results = (data.hits?.hits || []).map(hit=> adapter(hit._source));
                return {
                    results: results,
                    pagination: {
                        more: (params.page*config.size) < data.hits.total.value
                    }
                };
            },
            cache: true,
            failure: (failure)=>{
                console.log(failure);
            },
            error: (error)=>console.log(error.responseText)
        },
        cache: true,
        language: {
            errorLoading: ()=>'Sonuç yüklenemedi',
            inputTooLong: args=> (args.input.length - args.maximum) + ' karakter daha girmelisiniz',
            inputTooShort: args=> /** @var {{minimum: number, input: string}} args */'En az ' + (args.minimum - args.input.length) + ' karakter daha girmelisiniz',
            loadingMore: ()=>'Daha fazla yükleniyor…',
            maximumSelected: args=>'Sadece ' + args.maximum + ' seçim yapabilirsiniz',
            noResults: ()=>'Sonuç bulunamadı',
            searching: ()=>'Aranıyor…',
            removeAllItems: ()=>'Tüm öğeleri kaldır',
            removeItem: ()=>'Bu öğeyi kaldır',
            search: ()=>'Ara'
        }
    });
}