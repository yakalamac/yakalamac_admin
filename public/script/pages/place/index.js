$(document).ready(function () {
    populateProvinceSelect();

    $('#cityFilter').on('change', function () { var provinceName = $(this).val(); populateDistrictSelect(provinceName); });

    const placesTable = $('#placesTable');
    const table = placesTable.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_route/datatables/elasticsearch/place",
            type: "POST",
            dataType: "json",
            dataSrc: "data",
            data: function (d) {
                d.city = $('#cityFilter').val();
                d.district = $('#districtFilter').val();
            },
            error: function (xhr, error, code) {
                console.error('DataTables AJAX hatası:', error, xhr);
            }
        },
        columns: [
            {
                data: null,
                render: (data, type, row) => {
                    return `<div><a title="${data.id}"><u>${data.id.slice(0, 5)}...</u></a><br>
                        <a title="${data?.primaryType?.description ?? ''}"><b>${data?.primaryType?.description ? data?.primaryType?.description.slice(0,10) : 'Belirtilmedi'}</b> </a>
                        <br><a title="${data?.createdAt ? moment(data.createdAt).format('DD.MM.YYYY - HH:mm') : ''}">${ data?.createdAt ? moment(data.createdAt).format('DD.MM.YYYY') : 'Belirtilmedi'}</a></div>`;
                },
                orderable: false
            },
            {
                data: "name",
                orderable: false 
            },
            {
                data: null,
                orderable: true,
                render: (data, type, row) => {
                    return `<div class="form-check form-switch form-check-success">
                                <input disabled class="form-check-input" type="checkbox" role="switch" ${data.owner ? 'checked' : ''}>Sahipli 
                            </div>
                            <div class="form-check form-switch form-check-warning">
                                <input id="isEdited" class="form-check-input edit-toggle" type="checkbox" role="switch" data-id="${row.id}" ${data.isEdited ? 'checked' : ''}>Düzenlendi 
                            </div>
                            <div class="form-check form-switch form-check-purple">
                                <input id="isEditedCat" class="form-check-input edit-toggle" type="checkbox" role="switch" data-id="${row.id}" ${data.isEditedCat ? 'checked' : ''}>Kategorilendi
                            </div>`;
                }
            },
            {
                data: null,
                orderable: false,
                render: (data, type, row) => {
                    if(data?.address)
                        return `<span title="${data.address?.longAddress ?? 'Tam adres bilgisi mevcut değil'}">${data.address?.shortAddress ?? 'Kısa adres bilgisi mevcut değil'}</span>`;
                    return 'Adres bilgisi mevcut değil';
                }
            },
            {
                data: "updatedAt",
                orderable: false,
                render: data => moment(data).format('DD.MM.YYYY - HH:mm')
            },
            {
                data: "city",
                orderable: false
            },
            {
                data: "district",
                orderable: false
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `<div class="gap-1">
                    <div class="col"><a target="_blank" href="./${row.id}" title="${row.name} adlı işletmeyi düzenle"><button type="button" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}" class="btn btn-outline-info d-flex gap-2"><i class="material-icons-outlined">edit</i></button></a></div>
                    <div class="col"><a href="#" title="${row.name} adlı işletmeyi sil"><button type="button" class="btn btn-outline-danger d-flex gap-2"><i class="material-icons-outlined">delete</i></button></a></div>                     
                    </div>`;
                }
            }
        ],
        pageLength: 15,
        lengthMenu: [15, 30, 50, 100, 200],
        dom: 'lfrtip',
        initComplete: function () {
            var $searchInput = $('#placesTable_filter input');
            $searchInput.attr('placeholder', 'İşletme adı');
            var api = this.api();

            function addJumpToPage() {
                var pagination = $(api.table().container()).find('.dataTables_paginate');

                if (!pagination.find('#jumpToPageContainer').length) {
                    var jumpToPageHtml = `
                        <div id="jumpToPageContainer" style="display: inline-block; margin-left: 10px;">
                            <label for="jumpToPageInput" style="margin-right:5px;">Sayfa:</label>
                            <input type="number" min="1" style="width: 60px; margin-right: 5px;" id="jumpToPageInput" placeholder="1">
                            <button id="jumpToPageBtn" class="btn btn-sm btn-primary">Git</button>
                        </div>
                    `;

                    pagination.append(jumpToPageHtml);

                    $('#jumpToPageBtn').on('click', function () {
                        var page = parseInt($('#jumpToPageInput').val(), 10);
                        var info = api.page.info();
                        var totalPages = info.pages;

                        if (isNaN(page) || page < 1 || page > totalPages) {
                            alert(`Lütfen 1 ile ${totalPages} arasında geçerli bir sayfa numarası girin.`);
                            return;
                        }
                        api.page(page - 1).draw(false);
                    });

                    $('#jumpToPageInput').on('keypress', function (e) {
                        if (e.which === 13) {
                            $('#jumpToPageBtn').click();
                        }
                    });
                }
            }

            addJumpToPage();
            api.on('draw', function () {
                addJumpToPage();
            });
        }
    });

    $('#filterButton').on('click', function () {
        var $btn = $(this);
        $btn.prop('disabled', true);
        table.ajax.reload(function() {
            $btn.prop('disabled', false);
        });
    });
    

    placesTable.on('click', '.delete-btn', function (e) {
        e.preventDefault();

        const id = $(this).data('id');

        if (confirm("Bu işletmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            $.ajax({
                url: `/_route/api/api/places/${id}`,
                type: 'DELETE',
                success: function (result) {
                    console.info(result);
                    toastr.success("İşletme başarıyla silindi.");
                    table.ajax.reload();
                },
                error: function (xhr, status, error) {
                    console.error(`Silme hatası: ${error}`);
                    toastr.error("İşletme silinirken bir hata oluştu.");
                }
            });
        }
    });

    placesTable.on('change', '#isEdited', function() {
        var placeId = $(this).data('id');
        var isChecked = $(this).is(':checked');
        var $checkbox = $(this);

        if (isChecked) {
            $.ajax({
                url: '/admin/edited-place/',
                type: 'POST',
                data: JSON.stringify({ place_id: placeId }),
                contentType: 'application/json',
                success: function(response) {
                    toastr.success("Düzenleme durumu güncellendi.");
                },
                error: function(xhr, status, error) {
                    console.error('Düzenleme güncelleme hatası:', error);
                    toastr.error("Düzenleme durumu güncellenemedi.");
                    $checkbox.prop('checked', false);
                }
            });
        } else {
            $.ajax({
                url: `/admin/edited-place/${placeId}`,
                type: 'DELETE',
                success: function(response) {
                    toastr.success("Düzenleme durumu güncellendi.");
                },
                error: function(xhr, status, error) {
                    console.error('Düzenleme silme hatası:', error);
                    toastr.error("Düzenleme durumu güncellenemedi.");
                    $checkbox.prop('checked', true);
                }
            });
        }
    });
    
    placesTable.on('change', '#isEditedCat', function() {
        var placeId = $(this).data('id');
        var isChecked = $(this).is(':checked');
        var $checkbox = $(this);
    
        if (isChecked) {
            $.ajax({
                url: '/admin/edited-place/cat/',
                type: 'POST',
                data: JSON.stringify({ place_id: placeId }),
                contentType: 'application/json',
                success: function(response) {
                    toastr.success("Düzenleme durumu güncellendi.");
                    console.log(response)
                },
                error: function(xhr, status, error) {
                    console.error('Düzenleme güncelleme hatası:', error);
                    toastr.error("Düzenleme durumu güncellenemedi.");
                    $checkbox.prop('checked', false);
                }
            });
        } else {
            $.ajax({
                url: `/admin/edited-place/cat/${placeId}`,
                type: 'DELETE',
                success: function(response) {
                    toastr.success("Düzenleme durumu güncellendi.");
                },
                error: function(xhr, status, error) {
                    console.error('Düzenleme silme hatası:', error);
                    toastr.error("Düzenleme durumu güncellenemedi.");
                    $checkbox.prop('checked', true);
                }
            });
        }
    });
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function populateProvinceSelect() {
        try {
            const provinces = await $.getJSON('/script/util/cities.json');
            const provinceSelect = $('#cityFilter');
            provinceSelect.empty();
            provinceSelect.append('<option value="">Tüm Şehirler</option>');
            provinces.forEach(province => {
                provinceSelect.append(`<option value="${capitalizeFirstLetter(province.Province)}">${capitalizeFirstLetter(province.Province)}</option>`);
            });
        } catch (error) {
            console.error('Şehirler yüklenirken hata oluştu:', error);
        }
    }

    async function populateDistrictSelect(provinceName) {
        console.log(provinceName);
        try {
            const provinces = await $.getJSON('/script/util/cities.json');
            const province = provinces.find(p => capitalizeFirstLetter(p.Province) === provinceName);
            const districtSelect = $('#districtFilter');
            districtSelect.empty();
            districtSelect.append('<option value="">Tüm İlçeler</option>');
            if (province && province.Districts) {
                province.Districts.forEach(district => {
                    districtSelect.append(`<option value="${capitalizeFirstLetter(district.District)}">${capitalizeFirstLetter(district.District)}</option>`);
                });
            }
        } catch (error) {
            console.error('İlçeler yüklenirken hata oluştu:', error);
        }
    }
});