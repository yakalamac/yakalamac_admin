'use strict';

import { initializeSelect2, pushMulti, pushMultiForSelects } from '../../util/select2.js';
import {photoModal, photoModalAreas} from '../../util/modal.js';
import {control} from '../../util/modal-controller.js';

const placeId = $('#page-identifier-place-id')[0].value;
window.transporter = {
    ...window.transporter,
    productCategories: [],
    productTypes: [],
    productTags: []
}

initializeSelect2('#select-tag');
initializeSelect2('#select-category');
initializeSelect2('#select-type');

$('#button-photo-add').on(
    'click',
    function (event) {
        event.preventDefault();

        control(
            'photoModal',
            photoModal,
            function (e)
            {
                e.preventDefault();
                const areas = photoModalAreas('photoModal');
                const form = new FormData();

                if (
                    areas?.fileInput.files.length > 0
                    && ['image/png', 'image/jpg', 'image/jpeg'].includes(areas.fileInput.files.item(0).type)
                ) {
                    //const blob = new Blob([areas.fileInput.files.item(0)], {type: areas.fileInput.files.item(0).type});
                    form.append('file', areas.fileInput.files.item(0));
                }

                if (areas.captionTextArea.value.trim().length > 0)
                    form.append('caption', areas.captionTextArea.value.trim());

                form.append('showOnBanner', areas.showOnBannerSwitch.checked);

                form.append('category', '1');

                if (form.has('file') && form.has('showOnBanner'))
                    $.ajax(
                        {
                            url: `/_route/api/api/place/${placeId}/image/photos`,
                            method: 'POST',
                            data: form,
                            contentType: false,
                            processData: false,
                            success: response => console.log(response),
                            error: error => console.log(error.responseText),
                            failure: failure => console.log(failure.responseText)
                        }
                    );
            }
        );
    }
);

$(document).ready(
    function () {
        pushMulti(
            'select-category',
            'data-category-id',
            'description',
            'id',
            '/api/category/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

        pushMultiForSelects(
            [
                {
                    id: 'select-type',
                    optionIdentifierAttrName: 'data-type-id'
                },
                {
                    id: 'select-primary-type',
                    optionIdentifierAttrName: 'data-primary-type-id'
                }
            ],
            'description',
            'id',
            '/api/type/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );

        pushMulti(
            'select-tag',
            'data-tag-id',
            'tag',
            'id',
            '/api/tag/places',
            error => {
                console.log(error);
            },
            failure => {
                console.log(failure)
            }
        );


        $.ajax({
            url: '/_route/elasticsearch/product_category/_search?size=1000',
            method: 'GET',
            success: (response)=> {window.transporter.productCategories = response.hits.hits; console.log(window.transporter.productCategories)},
            error: e=>console.log(e.responseText),
            failure: e=>console.log(e.responseText)
        });


        const products = $('table#productsTable').DataTable
        (
            {
                processing: true,
                columns: [
                    {
                        data: "id",
                        render: function (data) {
                            return `<a title="${data}">${data.slice(0, 5)}...</a>`;
                        }
                    },
                    {
                        data: "name"
                    },
                    {
                        data: "active",
                        render: function (data) {
                            return `<div class="form-check form-switch form-check-success">
                                        <input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                                    </div>`;
                        }
                    },
                    {
                        data: "description"
                    },
                    {
                        data: "price",
                        render: data => `<div class="text-center" id="price-area"><b id="price">${data} ₺</b></div>`
                    },
                    {
                        data: "categories",
                        render: (data, type, row) => {
                            let template = '';
                            if (data && Array.isArray(data))
                                data.forEach(
                                    d => template += `<option data-type-id="${d.id}" id="product-category-${d.id}" selected>${d.description}</option>`
                                );

                                window
                                    .transporter
                                    .productCategories
                                    .forEach(
                                        category=>template += `<option data-type-id="${category._id}" id="product-category-${category._id}">${category._source.description}</option>`
                                    );

                            return `<select data-placeholder="Hiç kategori belirtilmedi" multiple id="select-product-category-${row.id}" class="form-select product-category-select form-select" id="${row.id}">${template}</select>`;
                        }
                    },
                    {
                        data: "types",
                        render: (data, type, row) => {
                            let template = '';
                            if (data && Array.isArray(data))
                                data.forEach(
                                    d => template += `<option data-type-id="${d.id}" id="product-type-${d.id}" selected>${d.description}</option>`
                                );

                            window
                                .transporter
                                .productCategories
                                .forEach(
                                    type=>template += `<option data-type-id="${type._id}" id="product-type-${type._id}">${type._source.description}</option>`
                                );

                            return `<select data-placeholder="Hiç tür belirtilmedi" multiple id="select-product-type-${row.id}" class="form-select product-type-select form-select" id="${row.id}">${template}</select>`;
                        }
                    },
                    {
                        data: "hashtags",
                        render: (data, type, row) => {
                            console.log(data)
                            let template = '';
                            if (data && Array.isArray(data))
                                data.forEach(
                                    d => template += `<option data-type-id="${d.id}" id="product-tag-${d.id}" selected>${d.description}</option>`
                                );

                            window
                                .transporter
                                .productCategories
                                .forEach(
                                    category=>template += `<option data-type-id="${category._id}" id="product-tag-${category._id}">${category._source.description}</option>`
                                );

                            return `<select data-placeholder="Hiç kategori belirtilmedi" multiple id="select-product-tag-${row.id}" class="form-select product-tag-select form-select" id="${row.id}">${template}</select>`;
                        }
                    },
                    {
                        data: null,
                        render: function (data, type, row)
                        {
                            return `
                                <a href="/admin/product/${row.id}" title="${row.name} adlı ürünü düzenle">
                                    <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}">
                                        <i class="fadeIn animated bx bx-pencil"></i>
                                    </button>
                                </a>
                                <a href="#" title="${row.name} adlı ürünü sil">
                                  <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                                    <i class="lni lni-trash"></i>
                                  </button>
                                </a>`;
                        }
                    }
                ],
                lengthMenu: [15, 25, 50, 100],
                pagination: true,
                language: {
                    paginate: {
                        next: 'İleri',
                        previous: 'Geri'
                    }
                }
            }
        );

        products
            .clear()
            .rows
            .add(
                window.transporter
                && window.transporter.place
                && window.transporter.place._source
                && Array.isArray(window.transporter.place._source.products)
                    ? window.transporter.place._source.products : []
            )
            .draw();

        initializeSelect2('.product-category-select');
        initializeSelect2('.product-tag-select');
        initializeSelect2('.product-type-select');

        products.on('draw', ()=>{
            initializeSelect2('.product-category-select');
            initializeSelect2('.product-tag-select');
            initializeSelect2('.product-type-select');
        });

    }
);