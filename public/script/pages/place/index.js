$(document).ready(function () {
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
            },
            error: function (xhr, error, code) {
                console.error('DataTables AJAX error:', error, xhr);
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
    $('#cityFilter').on('change', function () {
        table.ajax.reload();
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
});
