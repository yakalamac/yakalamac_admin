if (window.Twig)
    $(document).ready(function () {
        const productId = window.Twig.productId;

        $('#place').val(window.Twig.placeName);
        $('#product-name').val(window.Twig.product.name);
        $('#product-description').val(window.Twig.product.description);
        $('#product-price').val(window.Twig.product.price);
        $('#input39').prop('checked', window.Twig.productActive);

        fetchData(
            '/_route/api/api/category/products',
            '#product-category',
                category => {
                const selectedCategories = window.Twig.productCategories;
                const selected = selectedCategories.includes(category.id);
                return new Option(category.title, category.id, false, selected);
            }
        );

        fetchData(
            '/_route/api/api/type/products',
            '#product-type',
                type => {
                const selectedTypes = window.Twig.productTypes;
                const selected = selectedTypes.includes(type.id);
                return new Option(type.type, type.id, false, selected);
            }
        );

        fetchData(
            '/_route/api/api/tag/products',
            '#product-tag',
                tag => {
                const selectedTags = window.Twig.productTags;
                const selected = selectedTags.includes(tag.id);
                return new Option(tag.tag, tag.id, false, selected);
            }
        );


        $('.product-edit-save').on('click', async function () {
            const saveButton = $(this);

            const productName = $('#product-name').val().trim();
            if (!productName) {
                toastr.error("Ürün adı boş bırakılamaz.");
                return;
            }

            saveButton.prop('disabled', true);
            const originalButtonText = saveButton.text();
            saveButton.text('Lütfen bekleyiniz...');

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
                const productType = $('#product-type');
                const productCategory = $('#product-category');
                const productTag = $('#product-tag');

                const productData = {
                    name: productName,
                    price: parseFloat($('#product-price').val()) || 0,
                    active: $('#input39').is(':checked'),
                    description: $('#product-description').val(),
                    categories: productCategory.val() ? productCategory.val().map(id => `/api/category/products/${id}`) : [],
                    types: productType.val() ? productType.val().map(id => `/api/type/products/${id}`) : [],
                    hashtags: productTag.val() ? productTag.val().map(id => `/api/tag/products/${id}`) : [],
                    // options: options,
                    sources: [],
                };

                await $.ajax({
                    url: `/_route/api/api/products/${productId}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify(productData),
                        success: function (response) {
                            toastr.success("Ürün başarıyla güncellendi.");
                        },
                        error: function (xhr, status, error) {
                            console.error('error::', error);
                        }
                });

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
            $("#repeater-product-options").createRepeater({
                showFirstItemToDefault: optionsData.length === 0,
                defaultValues: {
                    "options": [{}]
                },
                data: {
                    "options": optionsData.map(option => ({
                        "id": option.id,
                        "price": option.price,
                        "description": option.description,
                        "languageCode": option.languageCode,
                    })),
                },
            });

            const photosData = window.Twig.photosData;

            $("#repeater-product-photos").createRepeater({
                showFirstItemToDefault: true,
                defaultValues: {
                    "photos": [{}]
                }
            });
        }
        initializeRepeaters();

        const container = $('#existing-photos');

        container.on('click', '.photo-delete-button', function () {
            const photoId = $(this).data('photo-id');
            const button = $(this);
            $.ajax({
                url: `/_route/api/api/product/photos/${photoId}`,
                type: 'DELETE',
                success: function () {
                    toastr.success("Fotoğraf başarıyla silindi.");
                    button.closest('.existing-photo-item').remove();
                },
                error: function (err) {
                    toastr.error("Fotoğraf silinirken bir hata oluştu.");
                    console.error("Error deleting photo:", err);
                }
            });
        });
            
    });
