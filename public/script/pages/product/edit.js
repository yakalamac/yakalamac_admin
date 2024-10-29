if (window.Twig)
    $(document).ready(function () {
        const productId = window.Twig.productId;
        const selectedPlaceId = window.Twig.placeId;

        const place = $('#place');

        place.prop('disabled', true);
        place.append(new Option('{{ product.place.id }}', selectedPlaceId, true, true));

        $('#product-name').val('{{ product.name }}');
        $('#product-description').val('{{ product.description }}');
        $('#product-price').val('{{ product.price }}');
        $('#input39').prop('checked', window.Twig.productActive);

        fetchData('/_route/api/api/category/products', '#product-category', category => {
            const selectedCategories = window.Twig.productCategories;
            const selected = selectedCategories.includes(category.id);
            return new Option(category.title, category.id, false, selected);
        });

        fetchData('/_route/api/api/type/products', '#product-type', type => {
            const selectedTypes = window.Twig.productTypes;
            const selected = selectedTypes.includes(type.id);
            return new Option(type.type, type.id, false, selected);
        });

        fetchData('/_route/api/api/tag/products', '#product-tag', tag => {
            const selectedTags = window.Twig.productTags;
            const selected = selectedTags.includes(tag.id);
            return new Option(tag.tag, tag.id, false, selected);
        });

        initializeRepeaters();

        $('.btn-grd-primary').on('click', async function () {
            const saveButton = $(this);

            const productName = $('#product-name').val().trim();
            if (!productName) {
                toastr.error("Ürün adı boş bırakılamaz.");
                return;
            }

            saveButton.prop('disabled', true);
            const originalButtonText = saveButton.text();
            saveButton.text('Lütfen bekleyiniz');

            try {
                let options = [];
                $('#repeater-product-options .items').each(function () {
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
                    categories: $('#product-category').val() ? $('#product-category').val().map(id => `/api/category/products/${id}`) : [],
                    types: $('#product-type').val() ? $('#product-type').val().map(id => `/api/type/products/${id}`) : [],
                    hashtags: $('#product-tag').val() ? $('#product-tag').val().map(id => `/api/tag/products/${id}`) : [],
                    options: options,
                    sources: [],
                };

                await $.ajax({
                    url: `/_route/api/api/products/${productId}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify(productData),
                });

                toastr.success("Ürün başarıyla güncellendi.");


            } catch (err) {
                toastr.error("Ürün güncellenirken bir hata ile karşılaşıldı. Yönetici ile iletişime geçiniz.");
                console.error("Error:", err);
            } finally {
                saveButton.prop('disabled', false);
                saveButton.text(originalButtonText);
            }
        });

        function fetchData(url, element, mapping) {
            $(element).prop('disabled', true);

            $.ajax({
                url: url,
                type: 'GET',
                success: function (data) {
                    const options = data.map(mapping);
                    $(element).append(options);
                },
                error: function (err) {
                    console.error(`Error fetching data from ${url}:`, err);
                },
                complete: function () {
                    $(element).prop('disabled', false);
                }
            });
        }

        function initializeRepeaters() {
            const optionsData = window.Twig.productOptions;
            console.log("Options Data:", optionsData);

            $("#repeater-product-options").createRepeater({
                showFirstItemToDefault: optionsData.length === 0,
                defaultValues: {
                    "options": [{}]
                },
                data: {
                    "options": optionsData.map(option => ({
                        "price": option.price,
                        "description": option.description,
                        "languageCode": option.languageCode,
                    })),
                },
            });

            const photosData = window.Twig.photosData;

            displayExistingPhotos(photosData);

            $("#repeater-product-photos").createRepeater({
                showFirstItemToDefault: true,
                defaultValues: {
                    "photos": [{}]
                }
            });
        }

        function displayExistingPhotos(photosData) {
            const container = $('#existing-photos');
            photosData.forEach(photo => {
                const photoElement = $(`
                    <div class="existing-photo-item">
                        <img src="https://${photo.path}" alt="${photo.caption}" width="100">
                        <p>${photo.caption}</p>
                        <button class="btn btn-danger btn-sm remove-photo-btn" data-photo-id="${photo.id}">Sil</button>
                    </div>
                `);
                container.append(photoElement);
            });

            container.on('click', '.remove-photo-btn', function () {
                const photoId = $(this).data('photo-id');
                $.ajax({
                    url: `/api/product/photos/${photoId}`,
                    type: 'DELETE',
                    success: function () {
                        toastr.success("Fotoğraf başarıyla silindi.");
                        $(this).closest('.existing-photo-item').remove();
                    },
                    error: function (err) {
                        toastr.error("Fotoğraf silinirken bir hata oluştu.");
                        console.error("Error deleting photo:", err);
                    }
                });
            });
        }
    });
