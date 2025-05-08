import {initializeSelect2Auto} from '../../modules/select-bundle/select2.js';
import {apiPatch} from "../../modules/api-controller/ApiController.js";

window.description_adapter=data=>({text: data.description, id: data.id});
window.tag_adapter=data=>({text: '#'+data.tag, id: data.id});

// Data collector
const collector = {
    arrayRunner:(selector, builder)=>{
        const array = [];
        $(selector).each((index, element)=>{
            let value = $(element).val();
            if(typeof value === 'string') {
                value = value.trim();
                if(value.length > 0) {
                    array.push(
                     builder(value, $(element))
                    );
                }
            }
        });
        return array;
    },
    declarations:(obj)=>{
        const map = {hashtags:"tag/places",concept:"category/place/concepts",cuisines:"category/place/cuisines",categories:"category/places",types:"type/places"};
        Object.keys(map).forEach(key=>{
           const current = $(`select#${key}`);
           if(current.length === 0) return;

           if(current.prop('multiple')) {
               const values = current.val();
               if(Array.isArray(values) && values.length > 0) {
                   obj[key] = values.map(value=>`/api/${map[key]}/${value}`);
               }
           } else {
               obj[key] = `/api/${map[key]}/${current.val()}`;
           }
        });
    },
    options:(obj)=>{
        obj.options = {};
        $('#options-container input[type="checkbox"]').each((index, element)=>{
            obj.options[
                element.id.split('-').map((each, index)=>{
                    if(index === 0) return each.toLowerCase();
                    return each.charAt(0).toUpperCase() + each.slice(1).toLowerCase();
                }).join('')
            ] = element.checked;
        });
    },
    basic:(obj)=>{
        ['name', 'description'].forEach(item=>{
            let value = $(`input#place_${item}`).val();
            if(typeof value === 'string') {
                value = value.trim();
                if(value.length > 0) {
                    obj[item] = value;
                }
            }
        });
    },
    address:(obj)=>{
        let value = $('textarea[aria-label="full address"]').val();
        if(typeof value === 'string') {
            value = value.trim();
            if(value.length > 0) {
                obj['address'] = {
                    longAddress: value,
                    shortAddress: value
                }
            }
        }

        const comps = collector.addrcomp();
        if(Array.isArray(comps) && comps.length > 0) {
            if(!obj.hasOwnProperty('address') || typeof obj.address !== 'object') obj['address'] = {};
            obj.address.addressComponents = comps;
        }
    },
    contacts:(obj)=>{
        const array = collector.arrayRunner('[data-contact]', (value, element)=>({
            category: `/api/category/contacts/${$(element).data('contact')}`, value})
        );

        if(array.length > 0) {
            if(!obj.hasOwnProperty('contacts') || typeof obj.contacts !== 'object') obj['contacts'] = {};
            obj.contacts = array;
        }
    },
    addrcomp:()=>{
        const map = {'province_select': 2, 'district_select': 3, 'neighbourhood_select': 4, 'street': 5, 'post-code': 6};
        const array = [];
        Object.keys(map).forEach(key=>{
            const element = $('#address-container #'+key);
            if(element.length === 0) return;
            let value = element.val();
            if(typeof value !== 'string') return;
            value = value.trim();
            if(value.length === 0) return;
            array.push({shortText: value, longText: value, category: `/api/category/address/components/${map[key]}}`, languageCode: 'tr'});
        });
        return array;
    },
    accounts:(obj)=>{
        const array = collector.arrayRunner('[data-account]', (value, element)=>({
            category: `/api/category/accounts/${$(element).data('account')}`, src: value})
        );

        if(array.length > 0) {
            if(!obj.hasOwnProperty('accounts') || typeof obj.accounts !== 'object') obj['accounts'] = {};
            obj.accounts = array;
        }
    },
    run: ()=>{
        const init = {};
        ['basic','address','options','declarations'].forEach(item=>{
            if(typeof collector[item] !== 'function') return;
            collector[item](init);
        });
        console.log(init);
        return init;
    }
}

$(document).ready(function (){
    // Place rating stars
    (()=>{
        // Get rating value
        let rating = place.rating;
        if(rating === undefined) rating = 0;
        const rateContainer = document.querySelector('#rating-container');
        for(let i = 0;i<5; i++) {
            if(rating > 0) rating--;
            if(rating < 0) rating = 0;
            const i = document.createElement('i');
            const array = ['bi', 'text-warning', 'me-2'];
            switch (true) {
                case rating > 1 || rating === 1:array.push('bi-star-fill'); break;
                case rating > 0 && rating < 1: array.push('bi-star-half'); break;
                case rating === 0: array.push('bi-star'); break;
            }
            array.forEach(item => i.classList.add(item));
            rateContainer.append(i);
        }
    })();

    // Slugify
    (()=>{
        // Store preview element locally
        const preview = document.querySelector('a[title="Ön izle"]');
        if(preview === null || preview === undefined) return;
        // Retrieve place address components
        const addressContainer=(window.place.address.addressComponents || []);
        // Check address container length to prevent unnecessary loop
        if(!Array.isArray(addressContainer) || addressContainer.length === 0) return;
        // create a key-value map for each address component category
        const map = {'city': 2, 'district': 3, 'neighbourhood': 4, 'street': 5, 'post-code': 6};
        // Create a uri template with keys
        let template = '/[city]/[district]/[neighbourhood]?[uuid]';
        // Create address getter method with category
        const getAddress = (category)=>addressContainer
            .find(item=>item.category?.id?.toString() === category?.toString());
        // With regex, find all matches and loop through
        template.matchAll(/\[([a-z]+)]/g).forEach(match=>{
            // Check if index 1 exists
            if(match[1] === undefined) {
                // If isn't, replace it with an empty value
                template = template.replace(match[0], '');
                return;
            }

            // If matched equal to 'uuid' prevent continuining and replaces with place id
            if(match[1] === 'uuid') {
                template = template.replace(match[0], `uuid=${window.place.id}`);
                return;
            }
            // Get address from map value
            const address = getAddress(map[match[1]]);

            // If the address not exists, replace it with an empty value
            if(address === undefined || address === null) {
                template = template.replace(match[0], '');
                return;
            }

            // If the address exists, replace it with real value
            template = template.replace(match[0], address.longText);
        });
        // Replace all duplicated slashes with one
        template = template.replaceAll(/\/\//g, '/');
        preview.href = `https://yaka.la/detail${template}`;
    })();


    // Initialize select2's
    (()=>{
        // Concept select initial
        if(window.place.hasOwnProperty('concept') && typeof window.place.concept === 'object') {
            const select = document.querySelector('select#concept');
            if(select instanceof HTMLSelectElement) {
                [...select.children].forEach(item => item.remove());
                const option = document.createElement('option');
                option.value = window.place.concept.id;
                option.text = window.place.concept.description;
                option.setAttribute('data-id', window.place.concept.id);
                select.add(option);
                select.value = window.place.concept.id;
                select.setAttribute('data-id', window.place.concept.id);
            }
        }

        // Cuisine select initial
        if(window.place.hasOwnProperty('cuisines') && Array.isArray(window.place.cuisines) && window.place.cuisines.length > 0) {
            const select = document.querySelector('select#cuisines');
            if(select instanceof HTMLSelectElement) {
                [...select.children].forEach(item => item.remove());
                window.place.cuisines.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.text = item.description;
                    option.setAttribute('data-id', item.id);
                    option.selected = true;
                    select.add(option);
                });
                select.setAttribute('data-id', window.place.cuisines.map(item => item.id).join(','));
            }
        }

        // Tag select initial
        if(window.place.hasOwnProperty('hashtags') && Array.isArray(window.place.hashtags) && window.place.hashtags.length > 0) {
            const select = document.querySelector('select#hashtags');
            if(select instanceof HTMLSelectElement) {
                [...select.children].forEach(item => item.remove());
                window.place.hashtags.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.text = '#'+item.tag;
                    option.setAttribute('data-id', item.id);
                    option.selected = true;
                    select.add(option);
                });
                select.setAttribute('data-id', window.place.hashtags.map(item => item.id).join(','));
            }
        }

        // Category select initial
        if(window.place.hasOwnProperty('categories') && Array.isArray(window.place.categories) && window.place.categories.length > 0) {
            const select = document.querySelector('select#categories');
            if(select instanceof HTMLSelectElement) {
                [...select.children].forEach(item => item.remove());
                window.place.categories.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.text = item.description;
                    option.setAttribute('data-id', item.id);
                    option.selected = true;
                    select.add(option);
                });
                select.setAttribute('data-id', window.place.categories.map(item => item.id).join(','));
            }
        }

        // Type select initial
        if(window.place.hasOwnProperty('types') && Array.isArray(window.place.types) && window.place.types.length > 0) {
            const select = document.querySelector('select#types');
            if(select instanceof HTMLSelectElement) {
                [...select.children].forEach(item => item.remove());
                window.place.types.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.text = item.description;
                    option.setAttribute('data-id', item.id);
                    option.selected = true;
                    select.add(option);
                });
                select.setAttribute('data-id', window.place.types.map(item => item.id).join(','));
            }
        }
    })();

    // Initialize address fields
    (()=>{
        // Encode incoming place address with null safety default filter
        const addressComponents = place.address?.addressComponents || undefined;
        // Check loaded data is an array
        if(addressComponents && Array.isArray(addressComponents)) {
            // Build address getter method
            const getAddress = (category)=>{
                return addressComponents.find(item => {
                    if(item.hasOwnProperty('category') && typeof item.category === 'object' && item.category.hasOwnProperty('id')) {
                        return item.category.id.toString() === category.toString();
                    }
                    return false;
                });
            };
            // Create the disabled option once to prevent recreation on each iteration
            const disabledopt = document.createElement('option');
            disabledopt.disabled = true;
            disabledopt.selected = true;
            // Create the address field map with its ids
            const map = {'city_select': 2, 'district_select': 3, 'neighbourhood_select': 4, 'street': 5, 'post-code': 6};
            // Loop through address map keys
            Object.keys(map).forEach(key=>{
                // Select the current element with map key id
                const element = document.querySelector(`#address-container #${key}`);
                // Check if the element is valid
                if(!(element instanceof HTMLElement)) return;
                // Get element address
                const component = getAddress(map[key]);
                // Check if the founded component is valid
                if(component === undefined || component === null) {
                    // If not found and element is instance of HTML select element add disabled default option
                    if(element instanceof HTMLSelectElement) {
                        element.add(disabledopt);
                    }
                    return;
                }
                // If component founded and it is a select element create new option and append to select
                if(element instanceof HTMLSelectElement) {
                    const opt = document.createElement('option');
                    opt.id = component.id; opt.value = component.longText; opt.text = component.longText;
                    opt.setAttribute('data-id', component.id);
                    element.add(opt);
                } else {
                    // Whether set the component value because other fields are input
                    element.value = component.longText;
                    element.setAttribute('data-id', component.id);
                }
            });
        }
    })();

    // Initialize accounts
    (()=>{
        if(window.place.hasOwnProperty('accounts') && Array.isArray(window.place.accounts) && window.place.accounts.length > 0)
        {
            $('[data-account]').each(function (index, element){
                const accountId = element.getAttribute('data-account');
                const founded = window.place.accounts.find(current=> current?.category?.id?.toString() === accountId.toString());
                if(typeof founded === 'object' && founded.hasOwnProperty('src') && typeof founded.src === 'string' && founded.src.length > 0) {
                    $(element).val(founded.src);
                }
            });
        }
    })();

    initializeSelect2Auto();
    $.InitializeAddressZone(window.place.address.addressComponents || []);

    $('button#update').on('click', function (){
        apiPatch('/partner/place', collector.run(), {successMessage: false, success:r=>console.log(r)});
    });
});