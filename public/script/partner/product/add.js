import { initializeSelect2Auto } from "../../modules/select-bundle/select2.js";
import { apiPost } from "../../modules/api-controller/ApiController.js";

window.dictionary_adapter = dictionary => {
    return {
        text: dictionary.name,
        id: dictionary.id
    };
};
window.description_adapter = data => ({ id: data.id, text: data.description });
window.tag_adapter = data => ({ id: data.id, text: data.tag });

initializeSelect2Auto();

let productOptions = [];
let editingOptionIndex = -1;

document.addEventListener('DOMContentLoaded', function () {
    const addOptionBtn = document.getElementById('add-option-btn');
    const saveOptionBtn = document.getElementById('save-option-btn');
    const optionsContainer = document.getElementById('options-container');
    const addOptionValueBtn = document.getElementById('add-option-value-btn');
    const optionValuesContainer = document.getElementById('option-values-container');
    const optionMultipleCheckbox = document.getElementById('option-multiple');
    const multipleLimitContainer = document.querySelector('.multiple-limit-container');
    const productForm = document.getElementById('product-form');
    const photoInput = document.getElementById('photo');
    let optionModal;

    if (photoInput) {
        photoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                updatePhotoPreview(file);
            }
        });
    }

    function updatePhotoPreview(file) {
        const previewContainer = document.getElementById('photo-preview');
        if (!previewContainer) return;

        previewContainer.innerHTML = '';

        if (file) {
            const previewCard = document.createElement('div');
            previewCard.className = 'card mt-3';

            const objectUrl = URL.createObjectURL(file);

            previewCard.innerHTML = `
                <div class="card-body p-2">
                    <div class="d-flex align-items-center">
                        <div class="me-3" style="width: 60px; height: 60px; overflow: hidden;">
                            <img src="${objectUrl}" class="img-fluid rounded" alt="Ürün fotoğrafı">
                        </div>
                        <div>
                            <h6 class="mb-1">Ürün Fotoğrafı</h6>
                            <p class="small text-muted mb-0">${file.name}</p>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger ms-auto remove-photo">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            previewContainer.appendChild(previewCard);

            previewCard.querySelector('.remove-photo').addEventListener('click', function () {
                photoInput.value = '';
                previewContainer.innerHTML = '';
                URL.revokeObjectURL(objectUrl);
            });
        }
    }

    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', function () {
            resetOptionForm();
            editingOptionIndex = -1;
            optionModal = new bootstrap.Modal(document.getElementById('option-modal'));
            optionModal.show();
        });
    }

    if (optionMultipleCheckbox) {
        optionMultipleCheckbox.addEventListener('change', function () {
            multipleLimitContainer.style.display = this.checked ? 'block' : 'none';
        });
    }

    if (addOptionValueBtn) {
        addOptionValueBtn.addEventListener('click', function () {
            addOptionValueField();
        });
    }

    function addOptionValueField(valueData = null) {
        const infoAlert = optionValuesContainer.querySelector('.alert-info');
        if (infoAlert) {
            infoAlert.remove();
        }

        const template = document.getElementById('option-value-template');
        const clone = document.importNode(template.content, true);

        if (valueData) {
            clone.querySelector('.option-value-description').value = valueData.description || '';
            clone.querySelector('.option-value-price').value = valueData.price || 0;
            clone.querySelector('.option-value-free').checked = valueData.free || false;

            if (valueData.free) {
                clone.querySelector('.option-value-price').disabled = true;
            }
        }

        const removeBtn = clone.querySelector('.remove-option-value');
        removeBtn.addEventListener('click', function () {
            this.closest('.option-value-item').remove();

            if (optionValuesContainer.children.length === 0) {
                optionValuesContainer.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        Lütfen en az bir seçenek değeri ekleyin.
                    </div>
                `;
            }
        });

        const freeCheckbox = clone.querySelector('.option-value-free');
        const priceInput = clone.querySelector('.option-value-price');

        freeCheckbox.addEventListener('change', function () {
            priceInput.disabled = this.checked;
            if (this.checked) {
                priceInput.value = 0;
            }
        });

        optionValuesContainer.appendChild(clone);
    }

    if (saveOptionBtn) {
        saveOptionBtn.addEventListener('click', function () {
            const optionTitle = document.getElementById('option-title').value.trim();
            const isRequired = document.getElementById('option-required').checked;
            const isMultiple = document.getElementById('option-multiple').checked;
            const multipleLimit = isMultiple ? parseInt(document.getElementById('option-multiple-limit').value || 0) : 0;

            const values = [];
            const valueItems = optionValuesContainer.querySelectorAll('.option-value-item');

            let isValid = true;

            if (!optionTitle) {
                alert('Lütfen seçenek başlığı girin.');
                return;
            }

            if (valueItems.length === 0) {
                alert('Lütfen en az bir seçenek değeri ekleyin.');
                return;
            }

            valueItems.forEach(item => {
                const description = item.querySelector('.option-value-description').value.trim();
                const price = parseFloat(item.querySelector('.option-value-price').value || 0);
                const free = item.querySelector('.option-value-free').checked;

                if (!description) {
                    isValid = false;
                    item.querySelector('.option-value-description').classList.add('is-invalid');
                } else {
                    item.querySelector('.option-value-description').classList.remove('is-invalid');
                }

                values.push({
                    description,
                    price,
                    free
                });
            });

            if (!isValid) {
                alert('Lütfen tüm seçenek değerlerini doldurun.');
                return;
            }

            const optionData = {
                title: optionTitle,
                required: isRequired,
                multiple: isMultiple,
                multipleLimit: multipleLimit,
                values: values
            };

            if (editingOptionIndex >= 0) {
                productOptions[editingOptionIndex] = optionData;
            } else {
                productOptions.push(optionData);
            }

            renderOptions();

            bootstrap.Modal.getInstance(document.getElementById('option-modal')).hide();
        });
    }

    function resetOptionForm() {
        document.getElementById('option-title').value = '';
        document.getElementById('option-required').checked = false;
        document.getElementById('option-multiple').checked = false;
        document.getElementById('option-multiple-limit').value = '';
        document.querySelector('.multiple-limit-container').style.display = 'none';

        optionValuesContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Lütfen en az bir seçenek değeri ekleyin.
            </div>
        `;
    }

    function fillOptionForm(option) {
        document.getElementById('option-title').value = option.title;
        document.getElementById('option-required').checked = option.required;
        document.getElementById('option-multiple').checked = option.multiple;
        document.getElementById('option-multiple-limit').value = option.multipleLimit || '';
        document.querySelector('.multiple-limit-container').style.display = option.multiple ? 'block' : 'none';

        optionValuesContainer.innerHTML = '';

        option.values.forEach(value => {
            addOptionValueField(value);
        });
    }

    function renderOptions() {
        if (productOptions.length === 0) {
            optionsContainer.innerHTML = `
                <div class="text-center py-4 bg-light rounded-3 mb-3" id="no-options-placeholder">
                    <p class="text-muted mb-2">Henüz seçenek eklenmemiş</p>
                    <p class="small text-muted">Ürününüz için boyut, ekstra malzeme gibi seçenekler ekleyebilirsiniz</p>
                </div>
            `;
            return;
        }

        optionsContainer.innerHTML = '';

        productOptions.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option-item mb-3';

            const badges = [];
            if (option.required) badges.push('<span class="badge bg-danger ms-1">Zorunlu</span>');
            if (option.multiple) badges.push('<span class="badge bg-info ms-1">Çoklu Seçim</span>');
            if (option.multiple && option.multipleLimit > 0) badges.push(`<span class="badge bg-secondary ms-1">Maks. ${option.multipleLimit}</span>`);

            const valuesList = option.values.map(v => {
                const priceText = v.free ?
                    '<span class="text-success">Ücretsiz</span>' :
                    `<span class="text-primary">+${v.price} ₺</span>`;

                return `<div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge bg-light text-dark">${v.description}</span>
                    ${priceText}
                </div>`;
            }).join('');

            optionEl.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${option.title} ${badges.join('')}</h6>
                        </div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary edit-option" data-index="${index}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger remove-option" data-index="${index}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="option-values">
                            ${valuesList}
                        </div>
                    </div>
                </div>
            `;

            optionEl.querySelector('.edit-option').addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                editingOptionIndex = index;
                fillOptionForm(productOptions[index]);
                optionModal = new bootstrap.Modal(document.getElementById('option-modal'));
                optionModal.show();
            });

            optionEl.querySelector('.remove-option').addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('Bu seçeneği silmek istediğinizden emin misiniz?')) {
                    productOptions.splice(index, 1);
                    renderOptions();
                }
            });

            optionsContainer.appendChild(optionEl);
        });
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = productForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    productForm.querySelectorAll('.form-control, .form-select').forEach(field => {
        field.addEventListener('change', function () {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
});

function stringGetter(selector) {
    const selected = $(selector);
    if (selected.length === 0) return undefined;
    let value = selected.val();
    if (typeof value !== "string") return undefined;
    value = value.trim();
    if (value.length === 0) return undefined;
    return value;
}

function stringPopulator(init, selector, key) {
    let str = stringGetter(selector);
    if (str === undefined) return;

    if (String(key).toLowerCase().startsWith('_number_', 0)) {
        key = key.replace('_number_', '');
        str = parseFloat(str);
        if (isNaN(str) || str === null || str === undefined) return;
    }

    init[key] = str;
}

const map = {
    basic: (init) => {
        const _map = {
            name: 'input[name="pname"]',
            description: 'textarea[name="description"]',
            _number_price: 'input[name="pprice"]',
        };
        Object.keys(_map).forEach(key => {
            stringPopulator(init, _map[key], key);
        });
    },
    definitions: (init) => {
        const _map = {
            category: (init, data) => {
                if (!init.hasOwnProperty('categories')) {
                    init.categories = [];
                }

                init.categories.push(`/api/category/products/${data}`);
            },
            type: (init, data) => {
                if (!init.hasOwnProperty('types')) {
                    init.types = [];
                }

                init.types.push(`/api/type/products/${data}`);
            },
            hashtag: (init, data) => {
                if (!init.hasOwnProperty('hashtags')) {
                    init.hashtags = [];
                }

                init.hashtags.push(`/api/tag/products/${data}`);
            },
            dictionary: (init, data) => {
                init.dictionaryDefinition = `/api/dictionaries/${data}`;
            }
        };

        Object.keys(_map).forEach(key => {
            let value = $(`select[data-declaration="${key}"]`).val();
            if (Array.isArray(value)) {
                value.forEach(v => {
                    _map[key](init, v);
                });
            } else {
                stringPopulator(init, `select[data-declaration="${key}"]`, key);
                //_map[key](init, value);
            }
        });
    },
    options: (init) => {
        if (window.productOptions && window.productOptions.length > 0) {
            init.productOptions = window.productOptions.map(option => {
                return {
                    place: init.place,
                    title: option.title,
                    required: option.required,
                    multiple: option.multiple,
                    multipleLimit: option.multipleLimit || 0,
                    values: option.values.map(value => ({
                        price: value.free ? 0 : parseFloat(value.price) || 0,
                        description: value.description,
                        free: value.free
                    }))
                };
            });
        }
    },
    runner: () => {
        const init = {};
        Object.keys(map).forEach(key => {
            if (key === 'runner') return;
            map[key](init);
        });
        init.active = true;
        return init;
    }
};

window.productOptions = productOptions;

window.addEventListener('updateproduct', (e) => {
    const productForm = document.getElementById('product-form');
    const photoInput = document.getElementById('photo');

    const requiredFields = productForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        if (window.toastr) {
            toastr.error('Lütfen tüm zorunlu alanları doldurun');
        }
        return;
    }

    if (!photoInput.files || !photoInput.files[0]) {
        if (window.toastr) {
            toastr.warning('Lütfen bir ürün fotoğrafı yükleyin');
        }
        photoInput.classList.add('is-invalid');
        setTimeout(() => {
            photoInput.classList.remove('is-invalid');
        }, 2000);
        return;
    }

    const submitBtn = document.querySelector('button[onclick="window.dispatchEvent(new Event(\'updateproduct\'))"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Yükleniyor...';
    }

    const productData = map.runner();

    const formData = new FormData();
    formData.append('productData', JSON.stringify({
        ...productData,
        place: `/api/places/${window.activePlace.pid}`
    }));
    formData.append('photo', photoInput.files[0]);

    $.ajax({
        url: '/partner/products/add',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Product added successfully:', response);
            if (window.toastr) {
                toastr.success('Ürün başarıyla eklendi.');
            }
            window.location.href = '/partner/products';
        },
        error: function (xhr, status, error) {
            console.error('Error adding product:', error);
            if (window.toastr) {
                toastr.error('Ürün eklenirken bir hata oluştu');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    });
});