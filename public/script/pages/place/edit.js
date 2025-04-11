'use strict';
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

import {initializeSelect2Auto} from "../../modules/bundles/select-bundle/select2.js";
import {URLBuilder} from "../../modules/bundles/url-builder/index.js";
import {apiPatch} from "../../modules/bundles/api-controller/ApiController.js";
import {val} from "../../util/val.js";
import {FieldBinder} from "../../modules/bundles/populator/populator.js";
import {FancyFileUploadAutoInit} from "../../modules/bundles/uploader-bundle/index.js";

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

/**
 * Builds place address components by checking exists or not
 * @returns {undefined|[{shortText: string, longText: string, id: ?number, category: ?string}]}
 */
function addressComponentBuilder() {
    const data = [];
    $('input[data-adc-category]').each(function (index, element) {
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
    const options = {};

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

}

/**
 * Main Patch Builder Function
 */
function patch() {
    const data = {
        name: val('input#place_name'),
        owner: val('input#owner', undefined, 'boolean'),
        primaryType: val('select#place_primary_type', '/api/type/places/'),
        location: {
            latitude: val('input#place_location_latitude', undefined, 'number'),
            longitude: val('input#place_location_longitude', undefined, 'number'),
            zoom: val('input#place_location_zoom', undefined, 'number')
        },
        address: {
            shortAddress: val('input#place_short_address'),
            longAddress: val('input#place_long_address')
        },
        hashtags: val('select#place_tags', '/api/tag/places/'),
        categories: val('select#place_categories', '/api/category/places/'),
        types: val('select#place_types', '/api/type/places/'),
        options: optionsBuilder(),
        sources: sourcesBuilder()
    };

    const addressComponents = addressComponentBuilder();
    if (addressComponents !== undefined) data.address.addressComponents = addressComponents;
    console.log(data)
    //return;
    apiPatch(`/_json/places/${window.transporter.place.id}`, data);
}

//Entry-point
$(document).ready(() => {
    // Initialize select2s
    initializeSelect2Auto();
    // Initialize address zones
    $.InitializeAddressZone();
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
                data: (current)=> {
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
            inputs:[
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
});
