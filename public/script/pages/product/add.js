$(document).ready(function() {
    let selectedPlaceId;
    const dataCache = {};

    function fetchData(url, element, mapping) {
        $(element).prop('disabled', true);

        if (dataCache[url]) {
            const options = dataCache[url].map(mapping);
            $(element).html(options);
            $(element).prop('disabled', false);
            return;
        }

        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                dataCache[url] = data;
                const options = data.map(mapping);
                $(element).html(options);
            },
            error: function(err) {
                console.error(`Error fetching data from ${url}:`, err);
            },
            complete: function() {
                $(element).prop('disabled', false);
            }
        });
    }

    $('#place').select2({
        theme: 'bootstrap-5',
        placeholder: 'İşletme seçiniz',
        ajax: {
            url: '/_route/elasticsearch/place/_search',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term
                };
            },
            processResults: function(data) {
                return {
                    results: data.map(function(place) {
                        return {
                            id: place.id,
                            text: place.name + ' - ' + place.address
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 2,
    }).on('select2:select', function(e) {
        selectedPlaceId = e.params.data.id;
    });

    fetchData('/_route/api/api/category/products', '#product-category', category => `<option value="${category.id}">${category.title}</option>`);
    fetchData('/_route/api/api/type/products', '#product-type', type => `<option value="${type.id}">${type.type}</option>`);
    fetchData('/_route/api/api/tag/products', '#product-tag', tag => `<option value="${tag.id}">${tag.tag}</option>`);

    $("#repeater-product-photos").createRepeater({
        showFirstItemToDefault: true,
    });
    $("#repeater-product-options").createRepeater({
        showFirstItemToDefault: true,
    });

    $('.btn-grd-primary').on('click', async function() {
        const saveButton = $(this);

        const productName = $('#product-name').val().trim();
        if (!productName) {
            toastr.error("Ürün adı boş bırakılamaz.");
            return;
        }
        if (!selectedPlaceId) {
            toastr.error("Lütfen bir işletme seçiniz.");
            return;
        }

        saveButton.prop('disabled', true);
        const originalButtonText = saveButton.text();
        saveButton.text('Lütfen bekleyiniz');

        try {
            let options = [];
            $('#repeater-product-options .items').each(function() {
                let option = {
                    price: parseFloat($(this).find('input[data-name="price"]').val()) || 0,
                    description: $(this).find('input[data-name="description"]').val(),
                    languageCode: $(this).find('input[data-name="languageCode"]').val(),
                };
                options.push(option);
            });

            const productData = {
                name: productName,
                price: parseFloat($('#product-price').val()) || 0,
                active: $('#input39').is(':checked'),
                description: $('#product-description').val(),
                place: `/api/places/${selectedPlaceId}`,
                categories: $('#product-category').val() ? $('#product-category').val().map(id => `/api/category/products/${id}`) : [],
                types: $('#product-type').val() ? $('#product-type').val().map(id => `/api/type/products/${id}`) : [],
                hashtags: $('#product-tag').val() ? $('#product-tag').val().map(id => `/api/tag/products/${id}`) : [],
                options: options,
                sources: [],
            };

            let response = await $.ajax({
                url: '/_route/api/api/products',
                type: 'POST',
                contentType: 'application/ld+json',
                data: JSON.stringify(productData),
            });
            toastr.success("Ürün başarıyla eklendi.");
            const productUuid = response.id;

            const photoUploads = [];
            $('#repeater-product-photos .items').each(function() {
                let formData = new FormData();
                let fileInput = $(this).find('input[data-name="name"]')[0];
                let caption = $(this).find('input[data-name="caption"]').val();
                if (fileInput.files.length > 0) {
                    formData.append('file', fileInput.files[0]);
                    formData.append('caption', caption);

                    photoUploads.push($.ajax({
                        url: `https://api.yaka.la/api/product/${productUuid}/image/photos`,
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        headers: {
                            'Accept': 'application/ld+json'
                        },
                    }));
                }
            });

            let uploadResponses = await Promise.all(photoUploads);

            let photoIds = uploadResponses.map(response => response.id);

            if (photoIds.length > 0) {
                await $.ajax({
                    url: `https://api.yaka.la/api/products/${productUuid}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify({
                        photos: photoIds.map(id => `/api/photos/${id}`)
                    }),
                });
            }

        } catch (err) {
            toastr.error("Ürün eklenirken bir hata ile karşılaşıldı. Yönetici ile iletişime geçiniz.");
            console.error("Error:", err);
        } finally {
            saveButton.prop('disabled', false);
            saveButton.text(originalButtonText);
        }
    });
});