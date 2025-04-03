import {initializeSelect2} from "../util/select2";

async function pushProduct(product) {

    const responseObject = {
        data: undefined,
        status: undefined
    };

    try {
        responseObject.data = await new Promise((resolve, reject) => {
            $.ajax({
                url: '/_api/api/products',
                method: 'POST',
                contentType: 'application/json',
                accept: 'application/json',
                data: JSON.stringify(
                    {
                        name: product.name,
                        price: typeof product.price === 'string' && product.price.includes('TL')
                            ? parseFloat(product.price.split(' TL')[0]) : 0,
                        active: false,
                        description: product.description,
                        place: `/api/places/${placeId}`
                    }
                ),
                success: response => {
                    if(response.hasOwnProperty('exception') && response.exception) {
                        responseObject.status = response.code;
                        resolve(response);
                    } else {
                        responseObject.status = 200;
                        console.log(response);

                        if(product.image) {
                            fetch('/_image',
                                {
                                    method: 'POST',
                                    body: JSON.stringify(
                                        {
                                            url: product.image
                                        }
                                    )
                                })
                                .then(res=> {
                                    console.log(res.headers.get('content-type'));
                                    const form = new FormData();
                                    res.blob().then(blob=> {
                                        form.append('file', blob);

                                        form.append(
                                            'data',
                                            JSON.stringify({
                                                title: product.name,
                                                altTag: product.name,
                                                showOnBanner: false,
                                                showOnLogo: false,
                                            })
                                        );
                                        console.log('forma girdi');
                                        $.ajax({
                                            url: `/_api/api/product/${response.id}/image/photos`,
                                            method: 'POST',
                                            data: form,
                                            contentType: false,
                                            processData: false,
                                            success: (imageResponse) => {

                                                if (imageResponse && imageResponse.exception) {
                                                    console.info({
                                                        product: response,
                                                        image: imageResponse
                                                    })
                                                    reject({
                                                        product: response,
                                                        image: imageResponse
                                                    });
                                                } else {
                                                    resolve({
                                                        product: response,
                                                        image: imageResponse
                                                    });
                                                }
                                            },
                                            error: (e) => {
                                                console.error(e);
                                                reject('Hata oluştu (fotoğraf yükleme)');
                                            },
                                            failure: (e) => {
                                                console.info(e);
                                                reject('Başarısız fotoğraf yükleme');
                                            }
                                        });

                                    });


                                });

                        }
                        else
                            resolve(response);
                    }
                },
                error: e => {
                    responseObject.status = 500;
                    reject(e.responseText);
                }
            });
        });
        return responseObject;
    } catch (e) {
        responseObject.status = 400;
        responseObject.data = e;
        return responseObject;
    }
}


function initializeProductsTable() {
    const products = $('table#productsTable').DataTable({
        processing: true,
        columns: [
            {
                data: "id",
                render: function (data) {
                    return `<a title="${data}">${data.slice(0, 5)}...</a>`;
                }
            },
            { data: "name" },
            {
                data: "active",
                render: function (data) {
                    return `
                        <div class="form-check form-switch form-check-success">
                            <input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                        </div>
                    `;
                }
            },
            { data: "description" },
            {
                data: "price",
                render: data => `<div class="text-center"><b>${data} ₺</b></div>`
            },
            {
                data: "categories",
                render: data => generateSelectOptions(data, window.transporter.productCategories, 'product-category')
            },
            {
                data: "types",
                render: data => generateSelectOptions(data, window.transporter.productTypes, 'product-type')
            },
            {
                data: "hashtags",
                render: data => generateSelectOptions(data, window.transporter.productTags, 'product-tag')
            },
            {
                data: null,
                render: function (data, type, row) {
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
                        </a>
                    `;
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
    });

    products.clear().rows.add(getInitialProducts()).draw();

    initializeSelect2('.product-category-select');
    initializeSelect2('.product-tag-select');
    initializeSelect2('.product-type-select');

    products.on('draw', () => {
        initializeSelect2('.product-category-select');
        initializeSelect2('.product-tag-select');
        initializeSelect2('.product-type-select');
    });
    window.transporter.productTable = products;
}