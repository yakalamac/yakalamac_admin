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
            dataType: 'json',
            success: function(data) {
                let items = [];
                if (data['hydra:member']) {
                    items = data['hydra:member'];
                } else if (data.hits && data.hits.hits) {
                    items = data.hits.hits.map(hit => hit._source);
                } else {
                    items = data;
                }
                dataCache[url] = items;
                const options = items.map(mapping);
                $(element).html(options.join(''));
            },
            error: function(err) {
                console.error(`Error fetching data from ${url}:`, err);
                toastr.error("Veri alınırken bir hata oluştu.");
            },
            complete: function() {
                $(element).prop('disabled', false);
            }
        });
    }

    $('#place').select2({
        theme: 'bootstrap-5',
        placeholder: 'İşletme seçiniz',
        language: {
            inputTooShort: function() {
                return "Lütfen en az 2 karakter giriniz.";
            },
            searching: function() {
                return "Aranıyor...";
            },
            noResults: function() {
                return "Aramanızla eşleşen sonuç bulunamadı.";
            }
        },
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
                return data;
            },
            cache: true
        },
        minimumInputLength: 2,
    }).on('select2:select', function(e) {
        selectedPlaceId = e.params.data.id;
    });

    fetchData('/_route/elasticsearch/product_category/_search?size=1000', '#product-category', category => `<option value="${category.id}">${category.title}</option>`);
    fetchData('/_route/elasticsearch/product_type/_search?size=1000', '#product-type', type => `<option value="${type.id}">${type.type}</option>`);
    fetchData('/_route/elasticsearch/product_tag/_search?size=1000', '#product-tag', tag => `<option value="${tag.id}">${tag.tag}</option>`);

    $("#repeater-product-photos").createRepeater({
        showFirstItemToDefault: true,
        ready: function (setIndexes) {
            $('#repeater-product-photos .items:first .primary-photo').prop('checked', true);
        },
        show: function (item) {
            item.find('.primary-photo').prop('checked', false);
        }
    });
    $("#repeater-product-options").createRepeater({
        showFirstItemToDefault: true,
    });

    $('#repeater-product-photos').on('change', '.primary-photo', function() {
        $('.primary-photo').prop('checked', false);
        $(this).prop('checked', true);
    });

    function setInitialPrimaryPhoto() {
        $('#repeater-product-photos .items:first .primary-photo').prop('checked', true);
    }

    setInitialPrimaryPhoto();

    $('#repeater-product-photos').on('repeater-add', function (e, item) {
        item.find('.primary-photo').prop('checked', false);
    });

    $('.product-save').on('click', async function() {
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
            toastr.success("Ürün başarıyla eklendi. (Varsa) Fotoğraflar yükleniyor.");
            const productUuid = response.id;

            const photoUploads = [];

            $('#repeater-product-photos .items').each(function () {
                let formData = new FormData();
                let fileInput = $(this).find('input[data-name="product-photo"]')[0];
                let title = $(this).find('input[data-name="title"]').val();
                let altTag = $(this).find('input[data-name="altTag"]').val();
                let showOnLogo = $(this).find('.primary-photo').is(':checked');

                if (fileInput.files.length > 0) {
                    formData.append('file', fileInput.files[0]);
                    formData.append('data', JSON.stringify({
                        title: title || 'Default Title',
                        altTag: altTag || 'Default Alt Tag',
                        showOnLogo: showOnLogo,
                    }));


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
            toastr.success("Fotoğraflar başarıyla yüklendi.");
            resetFormFields();
        } catch (err) {
            toastr.error("Ürün fotoğrafı eklenirken bir hata ile karşılaşıldı. Yönetici ile iletişime geçiniz.");
            console.error("Error:", err);
        } finally {
            saveButton.prop('disabled', false);
            saveButton.text(originalButtonText);
        }
    });

    function resetFormFields() {
        $('#product-name').val('');
        $('#product-description').val('');
        $('#product-price').val('');
        $('#input39').prop('checked', false);
        $('#repeater-product-photos').find('.items').not(':first').remove();
        $('#repeater-product-photos .items input').val('');
        $('#repeater-product-options').find('.items').not(':first').remove();
        $('#repeater-product-options .items input').val('');
    }
});