import {initializeSelect2Auto} from '../../modules/select-bundle/select2.js';

window.description_adapter=data=>({text: data.description, id: data.id});
window.tag_adapter=data=>({text: '#'+data.tag, id: data.id});

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
            const select = document.querySelector('select#cuisine');
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
            const select = document.querySelector('select#hashtag');
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
            const select = document.querySelector('select#category');
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
            const select = document.querySelector('select#type');
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

    initializeSelect2Auto();

    $.InitializeAddressZone(window.place.address.addressComponents || []);

});

