import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";
import {apiPost} from "../../modules/api-controller/ApiController.js";

window.dictionary_adapter = dictionary => {
    return {
        text: dictionary.name,
        id: dictionary.id
    };
};
window.description_adapter = data => ({id: data.id, text: data.description});
window.tag_adapter = data => ({id: data.id, text: data.tag});

initializeSelect2Auto();

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

window.addEventListener('pushproduct', (e) => {
    const runresult = map.runner();
    if(typeof runresult !== 'object' || Object.keys(runresult).length === 0) return;

    apiPost('/partner/products/add', {
        data: {...runresult, place: `/api/places/${window.activePlace.pid}`},
        format: 'application/json'
    }, {
        success: (data) => {
            console.log(data);
        },
        failure: (data) => {
            console.error(data);
        },
        successMessage: 'Yönlendiriliyorsunuz', failureMessage: false, errorMessage: false
    });
});