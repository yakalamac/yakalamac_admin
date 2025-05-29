import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";
import {apiPost, apiPatch, apiDelete} from "../../modules/api-controller/ApiController.js";

// Global adapters
window.dictionary_adapter = dictionary => ({text: dictionary.name, id: dictionary.id});
window.description_adapter = data => ({id: data.id, text: data.description});
window.tag_adapter = data => ({id: data.id, text: data.tag});

$(document).ready(function () {
    initializeSelect2Auto();

    // Fill select fields
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

    // Photo uploader
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

    // List photos as cards
    const pnonce = Date.now().toString();

    const photoBuilder = (photo) => `
        <div class="col-6 col-md-4 col-lg-3" data-image-container id="${photo.id}">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div style="height: 300px; background: #000;">
                    <img src="${photo.path}?width=300&height=300" alt="${photo.altTag ?? 'No alt-tag'}" class="w-100 h-100 object-fit-cover">
                </div>
                <div class="card-body p-2">
                    <input type="text" class="form-control form-control-sm mb-1 fw-semibold text-truncate"
                           id="${photo.id}-title" placeholder="Başlık" value="${photo.title ?? ''}">
                    <input type="text" class="form-control form-control-sm mb-1 text-truncate"
                           id="${photo.id}-altTag" placeholder="Alt Etiket" value="${photo.altTag ?? ''}">
                    <small class="text-muted d-block">📅 ${photo.createdAt ?? ''} &emsp; | &emsp; 🔄 ${photo.updatedAt ?? ''}</small>
                </div>
                <div class="d-flex gap-1 p-2">
                    <button class="btn btn-success btn-sm flex-fill fw-semibold ${pnonce}-photo-update-btn" data-photo-id="${photo.id}">
                        <i class="fa fa-edit me-1"></i> Güncelle
                    </button>
                    <button class="btn btn-danger btn-sm flex-fill fw-semibold ${pnonce}-photo-delete-btn" data-photo-id="${photo.id}">
                        <i class="fa fa-trash me-1"></i> Sil
                    </button>
                </div>
            </div>
        </div>
    `;

    const loadPhotos = () => {
        apiPost('/_search/product_photo', {
            data: {
                query: {
                    bool: {
                        filter: [
                            { term: { product: window.product.id } }
                        ]
                    }
                },
                size: 100
            },
            format: 'application/json'
        }, {
            success: (data) => {
                const photos = data?.hits?.hits?.map(hit => hit._source) ?? [];
                $('#photo-storage').empty();
                photos.forEach(photo => $('#photo-storage').append(photoBuilder(photo)));

                $(`.${pnonce}-photo-update-btn`).on('click', function () {
                    const id = $(this).data('photo-id');
                    const title = $(`#${id}-title`).val();
                    const altTag = $(`#${id}-altTag`).val();
                    //PATCH DOESN'T WORK
                    apiPatch(`/partner/products/photos/${id}`, { title, altTag }, {
                        successMessage: 'Güncellendi',
                        failureMessage: 'Güncelleme başarısız',
                    });
                });

                $(`.${pnonce}-photo-delete-btn`).on('click', function () {
                    const id = $(this).data('photo-id');
                    if (!id) return toastr.error('ID eksik.');

                    apiDelete(`/partner/products/photos/${id}`, {
                        success: () => {
                            $(`#${id}`).remove();
                            toastr.success('Silindi');
                        },
                        error: () => toastr.error('Silinemedi')
                    });
                });
            }
        });
    };

    loadPhotos();
    
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
            if(isNaN(str)) return;
        }

        init[key] = str;
    }

    const map = {
        basic: (init) => {
            const _map = {
                name: 'input[name="pname"]',
                description: 'textarea[name="description"]',
                _number_price: 'input[name="pprice"]',
            };
            Object.keys(_map).forEach(key => stringPopulator(init, _map[key], key));
        },
        definitions: (init) => {
            const _map = {
                category: (init, data)=>{ if(!init.categories) init.categories = []; init.categories.push(`/api/category/products/${data}`); },
                type: (init, data)=>{ if(!init.types) init.types = []; init.types.push(`/api/type/products/${data}`); },
                hashtag: (init, data)=>{ if(!init.hashtags) init.hashtags = []; init.hashtags.push(`/api/tag/products/${data}`); },
                dictionary: (init, data)=>{ init.dictionaryDefinition = `/api/dictionaries/${data}`; }
            };

            Object.keys(_map).forEach(key=>{
                let value = $(`select[data-declaration="${key}"]`).val();
                if(Array.isArray(value)) {
                    value.forEach(v => _map[key](init, v));
                } else {
                    stringPopulator(init, `select[data-declaration="${key}"]`, key);
                }
            });
        },
        options: (init) => {},
        runner:()=> {
            const init = {};
            Object.keys(map).forEach(key => {
                if(key !== 'runner') map[key](init);
            });
            return init;
        }
    };

    window.addEventListener('updateproduct', () => {
        const runresult = map.runner();
        if(typeof runresult !== 'object' || Object.keys(runresult).length === 0) return;
        apiPatch(window.location.href, runresult, {
            successMessage: 'Güncellendi'
        });
    });

});
