$(document).ready(function () {
    var table = $('#productsTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_route/datatables/elasticsearch/product",
            type: "POST",
            dataType: "json",
            dataSrc: "data",
            error: function (xhr, error, code) {
                console.error('DataTables AJAX error:', error, xhr);
                toastr.error('Veri yüklenirken bir hata oluştu.');
            }
        },
        columns: [
            {
               data: "placeName",
               orderable: true
            },
            {
                data: "name",
                orderable: false
            },
            {
                data: "price",
                orderable: false,
                render: function(data, type, row) {
                    return data.toFixed(2) + ' ₺';
                }
            },
            {
                data: "active",
                orderable: false,
                render: function(data, type, row) {
                    return `
                        <div class="form-check form-switch form-check-success">
                            <input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''} disabled>
                        </div>`;
                }
            },
            {
                data: "categories",
                orderable: false,
                render: function(data, type, row) {
                    if (Array.isArray(data)) {
                        return data.map(category => category.title).join(', ');
                    }
                    return '';
                }
            },
            {
                data: "createdAt",
                orderable: false,
                render: function(data, type, row) {
                    return moment(data).format('DD.MM.YYYY - HH:mm');
                }
            },
            {
                data: "updatedAt",
                orderable: false,
                render: function(data, type, row) {
                    return moment(data).format('DD.MM.YYYY - HH:mm');
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}"><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}"><i class="lni lni-trash"></i></button>
                    `;
                }
            }
        ],
        pageLength: 15,
        lengthMenu: [15, 30, 50, 100, 200],
        initComplete: function() {
            var $searchInput = $('#productsTable_filter input');
            $searchInput.attr('placeholder', 'Ürün adı');
        }
    });

    $('#productsTable tbody').on('click', '.edit-btn', function () {
        var productId = $(this).data('id');
        window.location.href = '/admin/product/' + productId;
    });

    $('#productsTable_filter input').unbind().bind('keyup', function(e) {
        var searchTerm = this.value.trim();
        if (searchTerm.length >= 2 || searchTerm.length === 0) {
            table.search(searchTerm).draw();
        } else {
            return;
        }
    });

    $('#productsTable tbody').on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        if (confirm("Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) { 
            $.ajax({
                url: `/_route/api/api/products/${id}`,
                type: 'DELETE',
                success: function (result) { 
                    console.info(result);
                    toastr.success("Silindi.");
                    table.ajax.reload();
                },
                error: function (xhr, status, error) {
                    console.error('Silme hatası:', error);
                    toastr.error("Ürün silinirken bir hata oluştu.");
                }
            });
        }
    });
});
