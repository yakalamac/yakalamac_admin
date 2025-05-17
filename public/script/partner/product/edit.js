import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";
import {apiPost, apiPatch} from "../../modules/api-controller/ApiController.js";

window.dictionary_adapter = dictionary => ({text: dictionary.name, id: dictionary.id});
window.description_adapter = data => ({id: data.id, text: data.description});
window.tag_adapter = data => ({id: data.id, text: data.tag});

// todo (must be better)
class SlickContextAwareMediaFetcher
{
    constructor(uri, selector, slick, handler, data, supports) {
        this.slick = slick;
        this.selector = selector;
        this.handler = handler;
        this.uri = uri;
        this.data = data;
        this.current = {page: 1, size: slick.slidesToShow, total: 0};
        this.lastResponse = undefined;
        this.supports = supports;
        this.__start();
    }

    __start() {
        $(this.selector).slick(this.slick);
        this.__search();

        $(this.selector).on('afterChange', (slick, currentSlide)=> {
            // todo (Look if tab is active)
            if(this.current.total <= (currentSlide.currentSlide+1) && this.supports(this.lastResponse, this.current.total)) {
                this.current.page++;
                this.__search();
            }
        });
    }

    __search() {
        apiPost(this.uri,
            {
                data: this.data({
                    from: (this.current.page - 1) * (this.current.size * 2),
                    size: this.current.size * 2
                }), format: 'application/json'
            }, {
                success: (data) => {
                    const result = this.handler(data);

                    if(!Array.isArray(result) || result.length === 0) {
                        return;
                    }

                    result.forEach((each, index) => {
                        if(index >= this.current.size) {
                            const currentItem = $(each).find('img');
                            const source = currentItem.attr('src');
                            currentItem.removeAttr('src');
                            currentItem.attr('data-lazy', source);
                        }

                        $(this.selector).slick('slickAdd', each)
                    });

                    this.lastResponse = data;
                    this.current.total += result.length;
                }
            });
    }
}

$(document).ready(function () {
    initializeSelect2Auto();


    // filler
    (()=> {
        [
            {
                prop: 'categories', adapter: (data)=>{
                    const selected = $('select[data-declaration="category"]');
                    if(selected.length === 0) return;
                    const obj = window.description_adapter(data);
                    const opt = new Option(obj.text, obj.id, false, true);
                    $(selected).append(opt);
                }
            },
            {
                prop: 'types', adapter: (data)=>{
                    const selected = $('select[data-declaration="type"]');
                    if(selected.length === 0) return;
                    const obj = window.description_adapter(data);
                    const opt = new Option(obj.text, obj.id, false, true);
                    $(selected).append(opt);
                }
            },
            {
                prop: 'hashtags', adapter: (data)=>{
                    const selected = $('select[data-declaration="hashtag"]');
                    if(selected.length === 0) return;
                    const obj = window.tag_adapter(data);
                    const opt = new Option(obj.text, obj.id, false, true);
                    $(selected).append(opt);
                }
            },
            {
                    prop: 'dictionaryDefinition', adapter: (data)=>{
                        const selected = $('select[data-declaration="dictionary"]');
                        if(selected.length === 0) return;
                        const obj = window.dictionary_adapter(data);
                        const opt = new Option(obj.text, obj.id, false, true);
                        $(selected).append(opt);
                    }
            },
        ].forEach(each => {
            if(window.product?.hasOwnProperty(each.prop)) {
                if(Array.isArray(window.product[each.prop])) {
                    window.product[each.prop].forEach(current => each.adapter(current));
                } else {
                    each.adapter(window.product[each.prop]);
                }
            }
        });
    })();

    FancyFileUploadAutoInit(
        '#fancy-file-upload',
        `/partner/products/${window.product.id}/photo`,
        {
            product: `/api/products/${window.product.id}`
        }, ['png', 'jpg'],
        {
            listener: '#btn-add-photo',
            modal: '#photo-add-modal'
        }
    );

    new SlickContextAwareMediaFetcher(
        '/_search/product_photo',
        '.photo-container', {
            autoplay: true,
            autoplaySpeed: 2000,
            appendArrows: '#dots-footer',
            draggable: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            focusOnSelect: true,
            nextArrow: '<button class="btn btn-primary">İleri</button>',
            prevArrow: '<button class="btn btn-warning">Geri</button>'
        },
        /**@var {{hits:{hits:[{_id:any,_source:{}}], total: {value:number}}}} **/
        (data) => {
            return data.hits.hits.map(hit => {
                    hit = hit._source;
                    const $img = $(`<div class="logo-img cursor-pointer" id="${hit.id}">`);
                    $(`<img src="${hit.path}" alt="${hit.altTag}" title="${hit.title}" height="300">`).appendTo($img);
                    return $img;
                }
            );
        },
        (d)=>({ ...d, query:{bool:{filter:[{term: {product: window.product.id }}]}}}),
        (data, total) => {
            return data.hits.total.value > total;
        }
    );


    // Product patch

    function stringGetter(selector){
        const selected = $(selector);
        if(selected.length === 0) return undefined;
        let value = selected.val();
        if(typeof value !== "string") return undefined;
        value = value.trim();
        if(value.length === 0) return undefined;
        return value;
    }

    function stringPopulator(init, selector, key) {
        let str = stringGetter(selector);
        if(str === undefined) return;

        if(String(key).toLowerCase().startsWith('_number_',0)) {
            key = key.replace('_number_', '');
            str = parseFloat(str);
            if(isNaN(str) || str === null || str === undefined) return;
        }

        init[key] = str;
    }

    const map = {
        basic: (init) => {console.log('basic run')
            const _map = {
                name: 'input[name="pname"]',
                description: 'textarea[name="description"]',
                _number_price: 'input[name="pprice"]',
            };
            Object.keys(_map).forEach(key => {console.log(key)
                stringPopulator(init, _map[key], key);
            });
        },
        definitions: (init) => {
            const _map = {
                category: (init, data)=>{
                    if(!init.hasOwnProperty('categories')) {
                        init.categories = [];
                    }

                    init.categories.push(`/api/category/products/${data}`);
                },
                type: (init, data)=>{
                    if(!init.hasOwnProperty('types')) {
                        init.types = [];
                    }

                    init.types.push(`/api/type/products/${data}`);
                },
                hashtag: (init, data)=>{
                    if(!init.hasOwnProperty('hashtags')) {
                        init.hashtags = [];
                    }

                    init.hashtags.push(`/api/tag/products/${data}`);
                },
                dictionary: (init, data)=>{
                    init.dictionaryDefinition = `/api/dictionaries/${data}`;
                }
            };

            Object.keys(_map).forEach(key=>{
                let value = $(`select[data-declaration="${key}"]`).val();
                if(Array.isArray(value)) {
                    value.forEach(v => {
                        _map[key](init, v);
                    });
                } else {
                    stringPopulator(init, `select[data-declaration="${key}"]`, key);
                    //_map[key](init, value);
                }
            });
        },
        options: (init) => {
            console.log('options run')
        },
        runner:()=>{
            const init = {};
            Object.keys(map).forEach(key => {
                if(key === 'runner') return;
                map[key](init);
            });
            return init;
        }
    };

    window.addEventListener('updateproduct', (e) => {
        const runresult = map.runner();
        if(typeof runresult !== 'object' || Object.keys(runresult).length === 0) return;
        apiPatch(window.location.href, runresult, {
            successMessage: 'Güncellendi',
            failureMessage: false,
            errorMessage: false
        });
    });

});