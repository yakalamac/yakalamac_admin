'use strict';
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {URLBuilder} from "../../modules/url-builder/index.js";
import {apiPatch} from "../../modules/api-controller/ApiController.js";
import {val} from "../../util/val.js";
import {FieldBinder} from "../../modules/populator/populator.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";

window.place_tag_adapter = data => ({text: data.tag, id: data.id});
window.place_description_adapter = data => ({text: data.description, id: data.id});

/**
 * Generates url dynamically
 * @returns {string[]}
 */
function URLParts() {
    const parts = {CITY: undefined, DISTRICT: undefined, NAME: window.transporter.place.name};
    const keys = Object.keys(parts);
    window.transporter.place.address.addressComponents.forEach(each => {
        if (keys.includes(each.category.title)) parts[each.category.title] = each.shortText;
    });
    return keys.map(key => parts[key]).filter(key => key !== undefined);
}


const builder = {
    Basics: (init) => {
        const map = {
            name: {type: 'string', selector: 'input#place_name'},
            description: {type: 'string', selector: 'textarea#place_description'},
            owner: {type: 'boolean', selector: 'input#owner'},
            choosen: {type: 'boolean', selector: 'input#choosen'},
            userRatingCount: {type: 'number', selector: 'input#rating_count'},
            rating: {type: 'number', selector: 'input#rate'}
        };

        Object.keys(map).forEach(key => {
            const element = $(map[key].selector);
            if (element.length === 0) return;
            let value = element.val();
            switch (map[key].type) {
                case 'string':
                    if (typeof value !== 'string' || value.trim().length === 0) return;
                    init[key] = value;
                    break;
                case 'number':
                    if(typeof value === 'string') {
                        value = parseFloat(value);
                    }

                    if(!isNaN(value) && typeof value === 'number') {
                        init[key] = value;
                    }
                    break;
                case 'boolean':
                    init[key] = element.is(':checked');
                    break;
            }
        });
    },
    Location: (init) => {
        const obj = {};
        ['latitude', 'longitude', 'zoom'].forEach(key=>{
            const element = $(`input#place_location_${key}`);
            if(element.length === 0) return;
            let value = element.val();
            if(typeof value === 'string') {
                value = parseFloat(value);
            }
            if(!isNaN(value) && typeof value === 'number') {
                obj[key] = value;
            }
        });

        if(Object.keys(obj).length > 0) {
            init['location'] = obj;
        }
    },
    Address: (init) => {
        const adr={};
        ['short','long'].forEach(k=>{
           const current = $(`input#place_${k}_address`);
           if(current.length === 0) return;
           let value = current.val();
           if(typeof value === 'string') {
               value = value.trim();
           }
           if(value.length > 0) {
               adr[k+'Address'] = value;
           }
        });

        const addressComponents = addressComponentBuilder();
        if (addressComponents !== undefined) {
            if (addressComponents.find(component => component.category.includes('/1')) === undefined) {
                addressComponents.push({
                    category: '/api/category/address/components/1',
                    shortText: 'TR',
                    longText: 'Türkiye',
                    languageCode: 'tr'
                });
            }
            adr.addressComponents = addressComponents;
        }

        if(Object.keys(adr).length > 0) {
            init['address'] = adr;
        }
    },
    Options: (init)=>{
        init['options'] = optionsBuilder();
    },
    Hashtags: (init) => {
        const value = $('select#place_tags').val();
        if(Array.isArray(value) && value.length > 0) {
            init['hashtags'] = value.map(each => '/api/tag/places/'+ each);
        }
    },
    Categories: (init) => {
        const value = $('select#place_categories').val();
        if(Array.isArray(value) && value.length > 0) {
            init['categories'] = value.map(each => '/api/category/places/'+ each);
        }
    },
    Types: (init) => {
        const value = $('select#place_types').val();
        if(Array.isArray(value) && value.length > 0) {
            init['types'] = value.map(each => '/api/type/places/'+ each);
        }

        const primaryTypeValue = $('select#place_primary_type').val();
        if(primaryTypeValue !== undefined) {
            if(
                Array.isArray(init['types']) &&
                init['types'].length > 0 &&
                init['types'].includes('/api/type/places/'+primaryTypeValue)
            ) init['primaryType'] = '/api/type/places/'+primaryTypeValue;
            else {
                window.toastr.error('Birincil tür işletmenin barındırdığı türlerden biri olmalıdır.');
                throw new Error('Unsupported primary type');
            }
        }
    },
    Sources:(init)=>{
        init['sources'] = sourcesBuilder();
    },
    Contacts: (init)=>{
        const array = [];
        $('.contact-value-input').each((index, element)=>{
            let value = $(element).val();
            if(typeof value === 'string') {
                value = value.trim();
            }

            if(value.length > 0) {
                array.push({
                    value,
                    category: '/api/category/contacts/'+$(element).data('category-id')
                });
            }
        });
        if(array.length > 0) {
            init['contacts'] = array;
        }
    },
    Accounts: (init)=>{
        const array = [];
        $('.account-src-input').each((index, element)=>{
            let value = $(element).val();
            if(typeof value === 'string') {
                value = value.trim();
            }

            if(value.length > 0) {
                array.push({
                    src: value,
                    category: '/api/category/accounts/'+$(element).data('category-id')
                });
            }
        });

        if(array.length > 0) {
            init['accounts'] = array;
        }
    },
    OpeningHours: (init) => {
        const array = [];
         $('#opening-hours-container div[data-binder="opening-hours"]').each((index,element)=>{
             const obj = {
                 day : $(element).find('select[name="opening_hours"]').data('day'),
                 dayText : $(element).find('label').text(),
                 languageCode: 'tr'
             };
            const status = $(element).find('select.status-select').val();

            if(status === 'closed') {
                obj.open = 'Kapalı';
                obj.close = obj.open;
            }

            if(status === '24h') {
                obj.open = '24 Saat Açık';
                obj.close = obj.open;
            }

            if(status === 'hours') {
                obj.open = $(element).find('input[name="open"]').val();
                if(!obj.open.includes(':')) {
                    obj.open = '08:00 AM';
                }

                obj.close = $(element).find('input[name="close"]').val();
                if(!obj.close.includes(':')) {
                    obj.close = '08:00 PM';
                }
            }

             array.push(obj);
         });

         init['openingHours'] = array;
    },
    Build: () => {
        const init = {};
        ['Basics', 'Location', 'Address', 'Hashtags', 'Categories', 'Types', 'Options', 'Sources','Accounts','Contacts', 'OpeningHours'].forEach(each => {
            builder[each](init);
        });

        console.log(init);
        return init;
    }
};

/**
 * Builds place address components by checking exists or not
 * @returns {undefined|[{shortText: string, longText: string, id: ?number, category: ?string}]}
 */
function addressComponentBuilder() {
    const data = [];
    $('[data-adc-category]').each(function (index, element) {

        if (element.value === undefined) return;

        element.value = element.value.trim();

        if (element.value.length === 0) return;

        const categoryId = element.getAttribute('data-adc-category');

        const founded = window.transporter.place.address.addressComponents
            .find(ac => ac.category.id.toString() === categoryId);

        const addressComponent = {
            shortText: element.value,
            longText: element.value,
            languageCode: 'tr'
        };

        addressComponent.category = `/api/category/address/components/${categoryId}`;

        if (founded !== undefined) {
            addressComponent.id = founded.id;
            addressComponent.address = `/api/place/addresses/${window.transporter.place.address.id}`;
        }

        data.push(addressComponent);
    });

    if (data.length === 0) return undefined;

    return data;
}

/**
 * Builds place options by generating key and value
 * @returns {{}}
 */
function optionsBuilder() {
    const options = window.transporter.place.options || {};
    $('.place-option').each((index, element) => {
        const key = element.id.split('-').map((key, index) => {
            if (index === 0) return key;
            return key.at(0).toUpperCase() + key.slice(1).toLowerCase();
        }).join('');

        options[key] = element.checked;
    })

    return options;
}

function sourcesBuilder() {
    const sources = window.transporter.place?.sources ?? [];
    $('.source-id-input , .source-url-input').each((index, element) => {
        const type = $(element).attr('type');
        const obj = {};
        const value = $(element).val();
        if (typeof value === 'string' && value.trim().length === 0) return;
        let categoryId = $(element).data('category-id');
        if (categoryId === undefined || (typeof categoryId === 'string' && categoryId.length === 0)) return;
        const category = `/api/category/sources/${categoryId}`;
        if (type === 'text') {
            obj.sourceId = value
        }

        if (type === 'url') {
            obj.sourceUrl = value
        }

        const founded = sources.find(source => {
            if (typeof source.category === 'string') return source.category === category;
            if (typeof source.category === 'object') return source.category['@id'] === category ||
                source.category.id.toString() === categoryId.toString();
        });

        if (founded === undefined) {
            sources.push({
                category,
                ...obj
            });
        } else {
            let index = sources.findIndex(current => current === founded);
            sources[index] = {...founded, category, ...obj};
        }
    });

    return sources;
}

/**
 * Main Patch Builder Function
 */
function patch() {
    apiPatch(`/_json/places/${window.transporter.place.id}`, builder.Build(), {
        successMessage: false,
        success:s=>console.log(s)
    });
}

//Entry-point
$(document).ready(() => {
    // Initialize select2s
    initializeSelect2Auto();
    // Initialize address zones
    $.InitializeAddressZone(window.transporter.place.address.addressComponents || []);
    // Build uri
    const uri = URLBuilder(URLParts(), {uuid: window.transporter.place.id});
    // Init prev button
    $('#preview-button').attr('href', uri);
    // Init qr-code bundle
    const qrbundle = $.QRCodeBundle({data: uri});
    $('#place-qr-code').on('click', () => qrbundle.show());
    // Init patch method
    $('button#button-save').on('click', patch);
    // Bind fields
    FieldBinder();
    // Image
    FancyFileUploadAutoInit(
        'input#fancy_file_upload_image_input',
        '/_multipart/place/photos',
        {
            data: (current) => {
                return JSON.stringify({
                    place: `/api/places/${window.transporter.place.id}`,
                    category: `/api/category/photos/${$(current).find('#category').val()}`,
                    showOnBanner: false
                });
            }
        },
        ['png', 'jpg'],
        {
            listener: 'button#button-photo-bulk',
            modal: 'div#fancy_file_upload_image',
            inputs: [
                `<select id="category">
                    <option value="1" selected>YEMEK</option>
                    <option value="2">AMBİYANS</option>
                    <option value="3">DIŞ MEKAN</option>
                    <option value="4">İÇ MEKAN</option>
                </select>`
            ]
        }
    );

    // Video
    FancyFileUploadAutoInit(
        'input#fancy_file_upload_video_input',
        '/_multipart/place/videos/stream-upload',
        {
            place: window.transporter.place.id,
            title: 'xasf',
            showOnBanner: true,
            category: '/api/category/photos/1'
        },
        ['mp4'],
        {listener: 'button#button-video-bulk', modal: 'div#fancy_file_upload_video'}
    );


    // Opening hour select type change event
    $('select[name="opening_hours"]').on('change', function () {
        const selectedValue = $(this).val();
        const timeInputs = $(this).closest('[data-binder="opening-hours"]').find('div.time-inputs');

        if (selectedValue === 'hours') {
            timeInputs.show();
        } else {
            timeInputs.hide();
        }
    });

    // Initialize time pickers
    $('div.time-inputs input').timepicker({});
});
