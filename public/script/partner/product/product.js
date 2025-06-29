import { apiDelete, apiPatch } from "../../modules/api-controller/ApiController.js";
window.stopPchangeEventReload = true;
let searchTimeout;
let isDragging = false;
let hasChanges = false;
let changedProducts = [];
let groupsChanges = [];
const $searchInput = $('.search-bar-input');
const $productRows = $('.product-row');
const $categoryItems = $('.accordion-item');
const $productAccordion = $('#productAccordion');
const $productDragInfo = $('.product-drag-info');
const $saveOrderBtn = $('.save-order-btn');
const $cancelOrderBtn = $('.cancel-order-btn');
const $changesAlert = $('.changes-alert');

let currentTargetCategoryId = null;
let selectedProducts = [];
let availableProducts = [];

const handlePriceChange = (el, id) => {
    const newPrice = el.innerText.trim();

    if (isNaN(newPrice) || newPrice === '') {
        alert("Lütfen geçerli bir fiyat girin.");
        return;
    }

    const uri = `products/${id}`;
    const data = {
        price: parseFloat(newPrice)
    };

    apiPatch(uri, data, {
        success: () => {
            el.style.border = "1px solid green";
        },
        error: (err) => {
            el.style.border = "1px solid red";
        }
    });
};

const scrollToElement = (element, callback) => {
    const $collapse = $(element).closest('.collapse');
    if (!$collapse.hasClass('show')) {
        $collapse.collapse('show');
    }

    setTimeout(() => {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;

        const middle = window.innerHeight / 4;
        const scrollPosition = absoluteElementTop - middle;

        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });

        setTimeout(() => {
            if (typeof callback === 'function') {
                callback();
            }
        }, 500);

    }, 300);
};

const moveGroup = (direction, $groupItem) => {
    const $prevItem = $groupItem.prev('.group-item');
    const $nextItem = $groupItem.next('.group-item');
    const $saveGroupsBtn = $('.save-groups-btn');

    if (direction === 'up' && $prevItem.length) {
        $groupItem.insertBefore($prevItem);
        highlightElement($groupItem[0]);
        updateCategoryOrderBadges();
        updateMoveButtons();
        $saveGroupsBtn.prop('disabled', false);
    }

    if (direction === 'down' && $nextItem.length) {
        $groupItem.insertAfter($nextItem);
        highlightElement($groupItem[0]);
        updateCategoryOrderBadges();
        updateMoveButtons();
        $saveGroupsBtn.prop('disabled', false);
    }
}

const updateCategoryOrderBadges = () => {
    $('.group-item').each(function (index) {
        $(this).find('.group-order-badge').text(index + 1);
    });
};

const updateMoveButtons = () => {
    $('.group-item').each(function (index) {
        const isFirst = index === 0;
        const isLast = index === $('.group-item').length - 1;

        $(this).find('.move-group-up-btn').prop('disabled', isFirst);
        $(this).find('.move-group-down-btn').prop('disabled', isLast);
    });
};

const trackOrderChange = (productId, categoryId, newPosition) => {
    hasChanges = true;

    const existingIndex = changedProducts.findIndex(p => p.productId === productId && p.type === 'order');

    if (existingIndex !== -1) {
        changedProducts[existingIndex].position = newPosition;
    } else {
        changedProducts.push({
            productId,
            categoryId,
            position: newPosition,
            type: 'order'
        });
    }

    $saveOrderBtn.show();
    $cancelOrderBtn.show();
    $changesAlert.show();
};

const saveChanges = () => {
    console.log('Değişiklikler kaydediliyor...');
    console.log('Değiştirilen ürünler:', changedProducts);

    if (changedProducts.length === 0) {
        toastr.warning('Kaydedilecek değişiklik bulunamadı.');
        return;
    }

    $saveOrderBtn.prop('disabled', true).html('<i class="spinner-border spinner-border-sm me-2"></i> Kaydediliyor...');

    $.ajax({
        url: '/partner/products/order/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            changes: changedProducts
        }),
        success: function (response) {
            toastr.options.onHidden = () => {
                window.location.reload();
            }
            toastr.success('Değişiklikler başarıyla kaydedildi.');

            if (changedProducts.length > 0) {
                const firstProductId = changedProducts[0].productId;
                const firstProductElement = document.querySelector(`.product-row[data-id="${firstProductId}"]`);

                if (firstProductElement) {
                    highlightProduct(firstProductElement);
                }

                for (let i = 1; i < changedProducts.length; i++) {
                    const productElement = document.querySelector(`.product-row[data-id="${changedProducts[i].productId}"]`);
                    if (productElement) {
                        productElement.classList.add('highlight-product');
                        setTimeout(() => {
                            productElement.classList.remove('highlight-product');
                        }, 1500);
                    }
                }
            }

            resetChangeTracking();
        },
        error: function (error) {
            console.error('Değişiklikler kaydedilirken hata oluştu:', error);
            toastr.error('Değişiklikler kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
            $saveOrderBtn.prop('disabled', false).html('<i class="bi bi-check-circle me-2"></i><span>Kaydet</span>');
        }
    });
};

const highlightProduct = (productElement) => {
    productElement.classList.remove('highlight-product');

    void productElement.offsetWidth;

    scrollToElement(productElement, () => {
        productElement.classList.add('highlight-product');

        setTimeout(() => {
            productElement.classList.remove('highlight-product');
        }, 1500);
    });
};

const trackChange = (productId, fromCategoryId, toCategoryId) => {
    hasChanges = true;

    const existingIndex = changedProducts.findIndex(p => p.productId === productId && p.type === 'category');

    if (existingIndex !== -1) {
        changedProducts[existingIndex].toCategoryId = toCategoryId;
    } else {
        changedProducts.push({
            productId,
            fromCategoryId,
            toCategoryId,
            type: 'category'
        });
    }

    $saveOrderBtn.show();
    $cancelOrderBtn.show();
    $changesAlert.show();
};

const resetChangeTracking = () => {
    hasChanges = false;
    changedProducts = [];
    $saveOrderBtn.hide();
    $cancelOrderBtn.hide();
    $changesAlert.hide();
};

const trackGroupChanges = () => {
    hasChanges = true;

    const tempGroups = [];

    $('.group-item').each((index, item) => {
        console.log('item here => ', index, item);
        const groupId = $(item).data('group-id');
        const groupName = $(item).data('group-name');
        const groupOrder = index + 1;

        tempGroups.push({
            id: groupId,
            name: groupName,
            order: groupOrder
        });
    });

    changedGroups = tempGroups;
}

const trackCategoryOrderChange = () => {
    hasChanges = true;

    const categoryOrder = [];
    $('.accordion-item').each(function (index) {
        const categoryId = $(this).data('category-id');
        const categoryName = $(this).data('category-name');

        categoryOrder.push({
            id: categoryId,
            name: categoryName,
            position: index
        });
    });

    if (!changedProducts.some(p => p.type === 'categoryOrder')) {
        changedProducts.push({
            type: 'categoryOrder',
            order: categoryOrder
        });
    } else {
        const index = changedProducts.findIndex(p => p.type === 'categoryOrder');
        changedProducts[index].order = categoryOrder;
    }

    $saveOrderBtn.show();
    $cancelOrderBtn.show();
    $changesAlert.show();
};

const highlightElement = (element) => {
    element.classList.remove('highlight-element');
    void element.offsetWidth;

    element.classList.add('highlight-element');

    setTimeout(() => {
        element.classList.remove('highlight-element');
    }, 1500);
};

const selectProduct = (productId) => {
    const product = availableProducts.find(p => p.id == productId);

    if (product && !selectedProducts.some(p => p.id == productId)) {
        selectedProducts.push(product);

        const selectedItem = `
            <a href="#" class="list-group-item list-group-item-action selected-product-item d-flex align-items-center" data-id="${product.id}">
                <img src="${product.image}" class="me-2" style="width: 30px; height: 30px; object-fit: contain;">
                <div class="flex-grow-1">
                    <h6 class="mb-0 small">${product.name}</h6>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-product-btn">
                    <i class="bi bi-x"></i>
                </button>
            </a>
        `;

        $('#selectedProductsList').append(selectedItem);

        $('.remove-product-btn').last().on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $selectedItem = $(this).closest('.selected-product-item');
            const selectedProductId = $selectedItem.data('id');

            removeSelectedProduct(selectedProductId);

            $selectedItem.fadeOut(300, function () {
                $(this).remove();
            });

            addBackToAvailableList(selectedProductId);
        });
    }
};

const removeSelectedProduct = (productId) => {
    selectedProducts = selectedProducts.filter(p => p.id != productId);
};

const addBackToAvailableList = (productId) => {
    const product = availableProducts.find(p => p.id == productId);

    if (product) {
        const productItem = `
            <a href="#" class="list-group-item list-group-item-action product-item d-flex align-items-center" data-id="${product.id}">
                <img src="${product.image}" class="me-3" style="width: 40px; height: 40px; object-fit: contain;">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${product.name}</h6>
                    <small class="text-muted">${product.price} TRY</small>
                </div>
                <button class="btn btn-sm btn-outline-primary select-product-btn">
                    <i class="bi bi-plus"></i>
                </button>
            </a>
        `;

        $('#availableProductsList').append(productItem);

        $('#availableProductsList .select-product-btn').last().on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $productItem = $(this).closest('.product-item');
            const productId = $productItem.data('id');

            selectProduct(productId);

            $productItem.fadeOut(300, function () {
                $(this).remove();
            });
        });
    }
}

const openEditLayoutModal = () => {

    $('#categorySelect').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#editLayoutModal'),
        width: '100%'
    });

    const editLayoutModal = new bootstrap.Modal(document.getElementById('editLayoutModal'));
    editLayoutModal.show();
};


const filterAvailableProducts = (searchTerm) => {
    $('#availableProductsList .product-item').each(function () {
        const productName = $(this).find('h6').text().toLowerCase();
        const productPrice = $(this).find('small').text().toLowerCase();

        if (productName.includes(searchTerm) || productPrice.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
};

const addSelectedProductsToCategory = () => {
    if (selectedProducts.length === 0 || !currentTargetCategoryId) {
        return;
    }

    const $targetCategory = $(`.accordion-item[data-group-id="${currentTargetCategoryId}"]`);
    const $targetProductList = $targetCategory.find('.product-list');

    selectedProducts.forEach(product => {
        const $originalProduct = $(`.product-row[data-id="${product.id}"]`);

        if ($originalProduct.length) {
            const $clonedProduct = $originalProduct.clone();
            $clonedProduct.attr('data-original-category', product.categoryId);
            $targetProductList.append($clonedProduct);
            $targetProductList.find('.no-products-message').remove();

            $originalProduct.remove();

            trackChange(product.id, product.categoryId, currentTargetCategoryId);
        }
    });

    $targetCategory.find('.collapse').collapse('show');

    bootstrap.Modal.getInstance(document.getElementById('addProductsModal')).hide();

    $saveOrderBtn.show();
    $cancelOrderBtn.show();
    $changesAlert.show();
};

const openAddProductsModal = (categoryId, categoryName) => {
    currentTargetCategoryId = categoryId;
    $('#targetCategoryName').text(categoryName);

    selectedProducts = [];
    $('#selectedProductsList').empty();

    loadAvailableProducts(categoryId);

    const addProductsModal = new bootstrap.Modal(document.getElementById('addProductsModal'));
    addProductsModal.show();
};

const loadAvailableProducts = (excludeCategoryId) => {
    availableProducts = [];
    $('#availableProductsList').empty();

    const pendingChangedProductIds = new Set();
    changedProducts.forEach(change => {
        if (change.type === 'category' && change.productId) {
            pendingChangedProductIds.add(change.productId);
        }
    });

    const productsInGroups = new Set();

    $('.product-list').each(function () {
        const categoryId = $(this).data('category-id');
        const categoryName = $(this).closest('.accordion-item').data('group-name');

        if (categoryName !== 'Tüm Ürünler' && categoryId != excludeCategoryId) {
            $(this).find('.product-row').each(function () {
                const productId = $(this).data('id');
                productsInGroups.add(productId);
            });
        }
    });

    $('.product-list').each(function () {
        const categoryId = $(this).data('category-id');
        const categoryName = $(this).closest('.accordion-item').data('group-name');

        if (categoryId != excludeCategoryId) {
            $(this).find('.product-row').each(function () {
                const productId = $(this).data('id');

                if ((categoryName !== 'Tüm Ürünler' && productsInGroups.has(productId)) ||
                    pendingChangedProductIds.has(productId)) {
                    return;
                }

                const productName = $(this).data('name');
                const productImage = $(this).find('.product-img').attr('src');
                const productPrice = $(this).find('.product-price').first().text();

                availableProducts.push({
                    id: productId,
                    name: productName,
                    image: productImage,
                    price: productPrice,
                    categoryId: categoryId
                });

                const productItem = `
                    <a href="#" class="list-group-item list-group-item-action product-item d-flex align-items-center" data-id="${productId}">
                        <img src="${productImage}" class="me-3" style="width: 40px; height: 40px; object-fit: contain;">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">${productName}</h6>
                            <small class="text-muted">${productPrice}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-primary select-product-btn">
                            <i class="bi bi-plus"></i>
                        </button>
                    </a>
                `;

                $('#availableProductsList').append(productItem);
            });
        }
    });

    $('.select-product-btn').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $productItem = $(this).closest('.product-item');
        const productId = $productItem.data('id');

        selectProduct(productId);

        $productItem.fadeOut(300, function () {
            $(this).remove();
        });
    });
};


const saveCategoryChanges = () => {
    const categoryId = $('#editCategoryId').val();
    const newCategoryName = $('#editCategoryName').val().trim();

    if (newCategoryName) {
        const $accordionItem = $(`.accordion-item[data-category-id="${categoryId}"]`);
        const oldCategoryName = $accordionItem.data('category-name');

        $accordionItem.find('.category-name').text(newCategoryName);
        $accordionItem.data('category-name', newCategoryName);

        trackCategoryNameChange(categoryId, oldCategoryName, newCategoryName);

        bootstrap.Modal.getInstance(document.getElementById('editLayoutModal')).hide();
    } else {
        alert('Lütfen kategori adı girin.');
    }
};

const trackCategoryNameChange = (categoryId, oldName, newName) => {
    hasChanges = true;

    const existingIndex = changedProducts.findIndex(p => p.type === 'categoryNameChange' && p.categoryId === categoryId);

    if (existingIndex !== -1) {
        changedProducts[existingIndex].newName = newName;
    } else {
        changedProducts.push({
            type: 'categoryNameChange',
            categoryId: categoryId,
            oldName: oldName,
            newName: newName
        });
    }

    $saveOrderBtn.show();
    $cancelOrderBtn.show();
    $changesAlert.show();
};

const enableCategoryNameEditMode = ($groupItem, groupId, groupName) => {
    const $categoryNameSpan = $groupItem.find('.group-name');
    const $categoryContainer = $groupItem.find('.group-category').parent();
    const currentWidth = $categoryNameSpan.width();
    const currentCategoryId = $groupItem.data('group-category-id') || '';
    const originalCategoryHtml = $categoryContainer.html();


    $categoryNameSpan.html(`
        <div class="input-group input-group-sm">
            <input type="text" class="form-control edit-category-name-input" value="${groupName}" style="min-width: ${currentWidth}px">
            <button class="btn btn-success save-category-name-btn" type="button">
                <i class="bi bi-check"></i>
            </button>
            <button class="btn btn-danger cancel-category-name-btn" type="button">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `);

    $categoryContainer.html(`
        <small class="text-muted me-2">Kategori:</small>
        <select class="form-select form-select-sm edit-category-select" style="width: auto; min-width: 150px;">
            <option value="">Kategori seçin</option>
            ${getCategoryOptionsHtml(currentCategoryId)}
        </select>
    `);

    try {
        $('.edit-category-select').select2({
            theme: 'bootstrap-5',
            width: '100%',
            minimumResultsForSearch: 5
        });
    } catch (e) {
        console.log('Select2 not available, using standard dropdown');
    }

    const $input = $categoryNameSpan.find('.edit-category-name-input');
    $input.focus();
    $input.select();

    $categoryNameSpan.find('.save-category-name-btn').on('click', function () {
        const newCategoryId = $categoryContainer.find('.edit-category-select').val();
        saveGroupInList($groupItem, groupId, groupName, newCategoryId);
    });

    $categoryNameSpan.find('.cancel-category-name-btn').on('click', function () {
        $categoryNameSpan.text(groupName);
        $categoryContainer.html(originalCategoryHtml);
    });

    $input.on('keypress', function (e) {
        if (e.which === 13) {
            const newCategoryId = $categoryContainer.find('.edit-category-select').val();
            saveGroupInList($groupItem, groupId, groupName, newCategoryId);
        }
    });

    $input.on('keydown', function (e) {
        if (e.which === 27) {
            $categoryNameSpan.text(groupName);
            $categoryContainer.html(originalCategoryHtml);
        }
    });
};

const saveGroupInList = ($categoryItem, categoryId, oldCategoryName, newCategoryId) => {
    const $input = $categoryItem.find('.edit-category-name-input');
    const newCategoryName = $input.val().trim();
    const $saveGroupsBtn = $('.save-groups-btn');
    const oldCategoryId = $categoryItem.data('group-category-id');
    const newCategoryText = $('.edit-category-select option:selected').text();


    if (newCategoryName) {
        $categoryItem.find('.group-name').text(newCategoryName);
        $categoryItem.data('group-name', newCategoryName);
        $categoryItem.data('name-changed', true);
        $categoryItem.data('old-name', oldCategoryName);
        $categoryItem.data('new-name', newCategoryName);

        if (newCategoryId != oldCategoryId) {
            $categoryItem.data('group-category-id', newCategoryId);
            $categoryItem.data('category-changed', true);
            $categoryItem.data('old-category-id', oldCategoryId);
            $categoryItem.data('new-category-id', newCategoryId);

            $categoryItem.find('.group-category')
                .attr('data-category-id', newCategoryId)
                .text(newCategoryText);
        }

        highlightElement($categoryItem[0]);
        $saveGroupsBtn.prop('disabled', false);
    } else {
        $categoryItem.find('.group-name').text(oldCategoryName);
    }
};

const trackProductStatusChange = (productId, status) => {
    hasChanges = true;

    const existingIndex = changedProducts.findIndex(p => p.productId === productId && p.type === 'status');

    if (existingIndex !== -1) {
        changedProducts[existingIndex].status = status;
    } else {
        changedProducts.push({
            productId,
            status,
            type: 'status'
        });
    }

    $saveOrderBtn.show();
    $cancelOrderBtn.show();
    $changesAlert.show();
};

const deleteCategory = ($groupItem) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
        $groupItem.remove();
        updateCategoryOrderBadges();
        updateMoveButtons();
    }
};

const addNewGroup = () => {
    const groupName = $('#newGroupName').val().trim();
    const categoryId = $('#categorySelect').val();
    const groupDescription = $('#newGroupDescription').val().trim();
    const groupOrder = $('.group-item').length + 1;
    const categoryName = categoryId ? $('#categorySelect option:selected').text() : '';

    if (!groupName) {
        toastr.error('Lütfen grup adı giriniz');
        return;
    }

    const tempId = 'temp_' + Date.now();

    const newGroupHtml = `
        <div class="list-group-item d-flex justify-content-between align-items-center group-item" 
             data-group-id="${tempId}" 
             data-group-name="${groupName}" 
             data-group-order="${groupOrder}" 
             data-group-category-id="${categoryId || ''}" 
             data-is-new="true">
            <div class="d-flex justify-content-between align-items-center">
                <span class="group-order-badge badge bg-secondary rounded-pill me-2">${groupOrder}</span>
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <span class="group-name">${groupName}</span>
                        <span class="badge bg-success ms-2">Yeni</span>
                    </div>
                    ${categoryId ? `
                    <div class="d-flex align-items-center mt-1">
                        <small class="text-muted me-2">Kategori:</small>
                        <span class="group-category" data-category-id="${categoryId}">${categoryName}</span>
                    </div>` : ''}
                </div>
            </div>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm btn-outline-primary edit-category-name-btn" title="Kategori Adını Düzenle">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary move-group-up-btn" data-direction="up">
                    <i class="bi bi-arrow-up"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary move-group-down-btn" data-direction="down">
                    <i class="bi bi-arrow-down"></i>
                </button>
            </div>
        </div>
    `;

    $('.group-list').append(newGroupHtml);

    updateCategoryOrderBadges();
    updateMoveButtons();

    $('.save-groups-btn').prop('disabled', false);

    $('#newGroupName').val('');
    $('#categorySelect').val('').trigger('change');
    $('#newGroupDescription').val('');

    $('#categories-tab').tab('show');

    const $newGroup = $('.group-item').last();
    setTimeout(() => {
        $newGroup[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightElement($newGroup[0]);
    }, 300);

    toastr.success('Grup eklendi. Değişiklikleri kaydetmeyi unutmayın!');
};

const getCategoryOptionsHtml = (selectedCategoryId) => {
    let optionsHtml = '';

    $('#categorySelect option').each(function () {
        const categoryId = $(this).val();
        const categoryName = $(this).text();
        if (categoryId) {
            optionsHtml += `<option value="${categoryId}" ${categoryId == selectedCategoryId ? 'selected' : ''}>${categoryName}</option>`;
        }
    });

    return optionsHtml;
};


const saveGroupsChanges = () => {
    const groups = [];

    $('.group-item').each((index, item) => {
        const groupId = $(item).data('group-id');
        const groupName = $(item).find('.group-name').text();
        const groupOrder = index + 1;
        const isNew = $(item).data('is-new') === true;
        const categoryId = $(item).data('group-category-id') || null;
        const description = $(item).data('group-description') || '';

        groups.push({
            id: groupId,
            name: groupName,
            order: groupOrder,
            isNew: isNew,
            category: categoryId,
            description: description
        });
    })

    $.ajax({
        url: '/partner/products/group/changes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            groups: groups
        }),
        success: function (response) {
            toastr.success('Gruplar güncellendi');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        },
        error: function (error) {
            console.error('Gruplar güncellenirken hata oluştu:', error);
            toastr.error('Gruplar güncellenirken hata oluştu');
        }
    });

    const $saveBtn = $('.save-category-btn');

    const groupChanges = {
        order: [],
        new: [],
        deleted: [],
        renamed: []
    };

    const existingGroupIds = [];
    $('.accordion-item').each(function () {
        if ($(this).data('is-default') == false) {
            existingGroupIds.push($(this).data('group-id'));
        }
    });

    $('.group-item').each(function (index) {
        const groupId = $(this).data('group-id');
        const groupName = $(this).find('.group-name').text();
        const isNew = $(this).data('is-new') === true;
        const nameChanged = $(this).data('name-changed') === true;

        if (isNew) {
            groupChanges.new.push({
                id: groupId,
                name: groupName,
                position: index
            });
        } else {
            groupChanges.order.push({
                id: groupId,
                name: groupName,
                position: index
            });

            if (nameChanged) {
                groupChanges.renamed.push({
                    id: groupId,
                    oldName: $(this).data('old-name'),
                    newName: $(this).data('new-name')
                });
            }
        }
    });

    existingGroupIds.forEach(id => {
        if (!groupChanges.order.some(c => c.id == id)) {
            groupChanges.deleted.push(id);
        }
    });

    if (groupChanges.order.length > 0 || groupChanges.new.length > 0 ||
        groupChanges.deleted.length > 0 || groupChanges.renamed.length > 0) {
        $saveBtn.prop('disabled', false);
        hasChanges = true;

        if (!changedProducts.some(p => p.type === 'groupChanges')) {
            changedProducts.push({
                type: 'groupChanges',
                changes: groupChanges
            });
        } else {
            const index = changedProducts.findIndex(p => p.type === 'groupChanges');
            changedProducts[index].changes = groupChanges;
        }

        $saveOrderBtn.show();
        $cancelOrderBtn.show();
        $changesAlert.show();
    }

    bootstrap.Modal.getInstance(document.getElementById('editLayoutModal')).hide();

    console.log('Ürün grupları değişiklikleri:', groupChanges);
};

// main function
$(document).ready(() => {
    toastr.options = {
        closeButton: true,
        newestOnTop: true,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };


    $('#sort-mode-btn, #category-mode-btn').parent('.btn-group').remove();

    const productAccordion = document.getElementById('productAccordion');

    new Sortable(productAccordion, {
        animation: 150,
        handle: '.category-header .drag-handle',
        ghostClass: 'sortable-ghost',
        chosenClass: 'category-drop-target',
        draggable: '.accordion-item',
        direction: 'vertical',
        fallbackOnBody: true,
        swapThreshold: 0.65,
        invertSwap: true,
        forceFallback: true,
        onChoose: function (evt) {
            const $item = $(evt.item);

            const $openCollapse = $item.find('.collapse.show');
            if ($openCollapse.length) {
                $item.data('had-open-collapse', true);
                $openCollapse.collapse('hide');
            }
        },
        onStart: function (evt) {
            $('.collapse').collapse('hide');

            const $ghost = $(evt.item);
            $ghost.addClass('dragging');

            $productDragInfo.text('Kategoriyi sıralamak için yukarı/aşağı sürükleyin').fadeIn(200);
        },
        onEnd: function (evt) {
            $productDragInfo.fadeOut(200);

            $(evt.item).removeClass('dragging');

            const categoryOrder = [];
            $('.accordion-item').each(function (index) {
                const categoryId = $(this).data('category-id');
                const categoryName = $(this).data('category-name');

                categoryOrder.push({
                    id: categoryId,
                    name: categoryName,
                    position: index
                });
            });

            trackCategoryOrderChange(categoryOrder);

            const $item = $(evt.item);
            if ($item.data('had-open-collapse')) {
                setTimeout(() => {
                    $item.find('.collapse').collapse('show');
                    $item.removeData('had-open-collapse');
                }, 300);
            }
        }
    });

    $(document).on('click', '.category-header', function (e) {
        console.log('category header click');
        if ($(e.target).hasClass('drag-handle') || $(e.target).closest('.drag-handle').length) {
            e.preventDefault();
            return false;
        }

        if ($(e.target).hasClass('add-products-btn') || $(e.target).closest('.add-products-btn').length) {
            e.preventDefault();
            return false;
        }
    });

    $saveOrderBtn.on('click', saveChanges);
    $cancelOrderBtn.on('click', resetChangeTracking);
    const productLists = document.querySelectorAll('.product-list');

    productLists.forEach(list => {
        new Sortable(list, {
            group: 'products',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            handle: '.drag-handle',
            delay: 100,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            fallbackTolerance: 5,
            fallbackOnBody: true,
            preventOnFilter: false,
            forceFallback: true,
            onStart: function (evt) {
                window.isDragging = true;
                const productName = evt.item.dataset.name;
                if (!evt.item.dataset.originalCategory) {
                    evt.item.dataset.originalCategory = evt.from.dataset.categoryId;
                }

                $productDragInfo.text(`"${productName}" ürününü kategoriye sürükleyin`).fadeIn(200);
                $productAccordion.addClass('drag-mode');

                $('.accordion-item').each(function () {
                    $(this).find('.accordion-header').addClass('show-category');
                    $(this).find('.collapse').collapse('show');
                });
            },
            onEnd: function (evt) {
                window.isDragging = false;
                $productDragInfo.fadeOut(200);
                $productAccordion.removeClass('drag-mode');
                $('.category-header').removeClass('category-drop-target');

                $('.accordion-item').each(function () {
                    $(this).find('.accordion-header').removeClass('show-category');
                });

                const productId = evt.item.dataset.id;
                const fromCategoryId = evt.from.dataset.categoryId;
                const toCategoryId = evt.to.dataset.categoryId;
                const originalCategoryId = evt.item.dataset.originalCategory || fromCategoryId;
                const newPosition = Array.from(evt.to.children).indexOf(evt.item);

                if (fromCategoryId !== toCategoryId) {
                    console.log(`Ürün ${productId} taşındı: ${fromCategoryId} kategorisinden ${toCategoryId} kategorisine`);
                    trackChange(productId, originalCategoryId, toCategoryId);
                    highlightProduct(evt.item);

                    updateProductPositionsInCategory(toCategoryId);

                    toastr.info(`"${evt.item.dataset.name}" ürünü "${$(evt.to).data('category-name')}" grubuna taşındı. Değişiklikleri kaydetmek için "Kaydet" butonuna tıklayın.`);
                } else if (evt.oldIndex !== evt.newIndex) {
                    trackOrderChange(productId, toCategoryId, newPosition);
                    highlightProduct(evt.item);
                    updateProductPositionsInCategory(toCategoryId);

                    toastr.info(`"${evt.item.dataset.name}" ürünü "${$(evt.to).data('category-name')}" grubu içinde sıralandı. Değişiklikleri kaydetmek için "Kaydet" butonuna tıklayın.`);
                }
            }
        });
    });

    const updateProductPositionsInCategory = (categoryId) => {
        const $productList = $(`.product-list[data-category-id="${categoryId}"]`);
        const $products = $productList.find('.product-row');

        $products.each(function (index) {
            const productId = $(this).data('id');
            const existingIndex = changedProducts.findIndex(p => p.productId === productId && p.type === 'order');

            if (existingIndex !== -1) {
                changedProducts[existingIndex].position = index;
            } else {
                changedProducts.push({
                    productId,
                    categoryId,
                    position: index,
                    type: 'order'
                });
            }
        });
    };

    window.addEventListener('pchange', () => datatable?.ajax?.reload());

    $(window).on('click', function (e) {
        if (e.target.classList.contains('btn-tags')) {
            const parent = $(e.target).parent('.product-tags');
            const array = [];
            parent.children().map((index, element) => {
                if (element === e.target) return;
                array.push(`/api/${$(element).data('type')}/products/${element.id}`);
            });
            apiPatch(`/_json/products/${parent.data('prod-id')}`, {
                [parent.data('key')]: array
            },
                { successMessage: 'başarılı', success: () => e.target.remove() }
            );
        }
        if (e.target.classList.contains('deleteprod')) {
            const id = $(e.target).data('prod-id');
            if (typeof id !== "string" || id.length === 0) return;
            apiDelete(`/partner/products/${id}`, {
                successMessage: 'Ürün silindi', success: () => {
                    const $row = $(e.target).closest('.product-row');
                    $row.remove();
                }
            });
        }
    });

    $searchInput.on('keyup', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const term = $searchInput.val().toLowerCase().trim();

            if (!term) {
                $productRows.show();
                $categoryItems.show();
                return;
            }

            $productRows.each(function () {
                const $row = $(this);
                const productName = $row.find('.product-name').text().toLowerCase();
                const productPrice = $row.find('.product-price').text().toLowerCase();
                const isVisible = productName.includes(term) || productPrice.includes(term);

                $row.toggle(isVisible);
            });

            $categoryItems.each(function () {
                const $category = $(this);
                const $productsInCategory = $category.find('.product-row');
                const visibleProducts = $productsInCategory.filter(function () {
                    return $(this).is(':visible');
                });

                $category.toggle(visibleProducts.length > 0);
            });
        }, 300);
    });

    const $backToTopButton = $('#back-to-top');

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 300) {
            $backToTopButton.addClass('show');
            $backToTopButton.fadeIn();
        } else {
            $backToTopButton.removeClass('show');
            $backToTopButton.fadeOut();
        }
    });

    $backToTopButton.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    resetChangeTracking();

    $('.add-products-btn').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const categoryId = $(this).data('category-id');
        const categoryName = $(this).data('category-name');

        openAddProductsModal(categoryId, categoryName);
    });

    $('.product-search-input').on('keyup', function () {
        const searchTerm = $(this).val().toLowerCase().trim();
        filterAvailableProducts(searchTerm);
    });

    $('#addSelectedProductsBtn').on('click', function () {
        addSelectedProductsToCategory();
    });

    $('.move-group-up-btn, .move-group-down-btn').on('click', function () {
        moveGroup($(this).data('direction'), $(this).closest('.group-item'));
    });

    $('.delete-category-btn').on('click', function () {
        deleteCategory($(this).closest('.group-item'));
    });

    $(document).on('click', '.edit-category-name-btn', function () {
        const $groupItem = $(this).closest('.group-item');
        const groupId = $groupItem.data('group-id');
        const groupName = $groupItem.find('.group-name').text();
        const nameInput = $groupItem.find('.edit-category-name-input');

        if (nameInput.length === 0) {
            enableCategoryNameEditMode($groupItem, groupId, groupName);
        }
    });

    $(document).on('click', '.move-group-up-btn', function () {
        moveGroup('up', $(this).closest('.group-item'));
    });

    $(document).on('click', '.move-group-down-btn', function () {
        moveGroup('down', $(this).closest('.group-item'));
    });

    $(document).on('click', '.delete-category-btn', function () {
        deleteCategory($(this).closest('.group-item'));
    });

    $(document).on('click', '.move-up-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $productRow = $(this).closest('.product-row');
        const $prevProductRow = $productRow.prev('.product-row');

        if ($prevProductRow.length) {
            $productRow.insertBefore($prevProductRow);

            const productId = $productRow.data('id');
            const categoryId = $productRow.closest('.product-list').data('category-id');
            const newPosition = Array.from($productRow.parent().children('.product-row')).indexOf($productRow[0]);

            trackOrderChange(productId, categoryId, newPosition);

            highlightElement($productRow[0]);
        }
    });

    $(document).on('click', '.move-down-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $productRow = $(this).closest('.product-row');
        const $nextProductRow = $productRow.next('.product-row');

        if ($nextProductRow.length) {
            $productRow.insertAfter($nextProductRow);

            const productId = $productRow.data('id');
            const categoryId = $productRow.closest('.product-list').data('category-id');
            const newPosition = Array.from($productRow.parent().children('.product-row')).indexOf($productRow[0]);

            trackOrderChange(productId, categoryId, newPosition);

            highlightElement($productRow[0]);
        }
    });

    $('.edit-layout-btn').on('click', function () {
        openEditLayoutModal();
    });

    $('.add-group-btn').on('click', function () {
        addNewGroup();
    });

    $('.save-groups-btn').on('click', function () {
        $(this).text('Kaydediliyor...').prop('disabled', true);
        saveGroupsChanges();
    });

    $(document).on('click', '.product-active-switch', function (e) {
        const $statusOption = $(this);
        const $productRow = $statusOption.closest('.product-row');
        const $statusDisplay = $productRow.find('.product-status');
        const status = $statusOption.data('status');
        const productId = $productRow.data('id');

        trackProductStatusChange(productId, status);

        if ($changesAlert.is(':hidden')) {
            toastr.info('Durum değişikliği kaydedilmek üzere işaretlendi. Kaydetmek için "Kaydet" butonuna tıklayın.');
        }

        highlightElement($productRow[0]);
    });

    $(document).on('click', '.category-edit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const existingModal = bootstrap.Modal.getInstance($('#editLayoutModal'));


        if (existingModal) {
            existingModal.hide();
        }


        openEditLayoutModal();
        $('#editCategoryName').focus();
        return false;
    });
});