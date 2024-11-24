$(document).ready(function () {
    populateProvinceSelect();

    $('#cityFilter').on('change', function () {
        var provinceName = $(this).val();
        populateDistrictSelect(provinceName);
    });

    var table = $('#placesTable').DataTable({
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
                data: "id",
                render: data => `<a title="${data}">${data.slice(0, 5)}...</a>`,
                orderable: false 
            },
            {
                data: "name",
                orderable: false 
            },
            {
                data: "primaryType",
                orderable: false,
                render: (data) => data?.description || ''
            },
            {
                data: "owner",
                orderable: true,
                render: data => `
                    <div class="form-check form-switch form-check-success">
                        <input disabled class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                    </div>`
            },
            {
                data: "address",
                orderable: false,
                render: (data) => data?.shortAddress || data?.longAddress || ''
            },
            {
                data: "updatedAt",
                orderable: false,
                render: data => moment(data).format('DD.MM.YYYY - HH:mm')
            },
            {
                data: "createdAt",
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
                    return `
                        <a target="_blank" href="./${row.id}" title="${row.name} adlı işletmeyi düzenle">
                            <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}">
                                <i class="fadeIn animated bx bx-pencil"></i>
                            </button>
                        </a>
                        <a href="#" title="${row.name} adlı işletmeyi sil">
                            <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                                <i class="lni lni-trash"></i>
                            </button>
                        </a>
                    `;
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
    

    $('#placesTable').on('click', '.delete-btn', function (e) {
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