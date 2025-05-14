import {DataTableSearch} from "../../modules/datatable/DataTableSearch.js";
$(document).ready(function () {
    const table = $('#placeProductCategoriesTable');

    new DataTableSearch(table,{
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_search/product_category",
            type: "POST",
            dataType: "json",
            dataSrc: "data",
            error: function (xhr, error, code) {
                console.error('DataTables AJAX error:', error, xhr);
            }
        },
        columns: [
            { data: "_source.title", orderable: false },
            { data: "_source.description", orderable: false },
            {
                data: "_source", orderable: false, searchable: false,
                render: function (data) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${data.id}" data-title="${data.title}" data-description="${data.description}"><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${data.id}"><i class="lni lni-trash"></i></button>
                    `;
                }
            }
        ],
        lengthMenu: [15, 25, 50, 100],
        pageLength: 15,
    });

    $('#addCategoryBtn').on('click', function () {
        $('#addModal').modal('show');
    });

    table.on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const title = $(this).data('title');
        const description = $(this).data('description');

        $('#editModal input[name="id"]').val(id);
        $('#editModal input[name="title"]').val(title);
        $('#editModal textarea[name="description"]').val(description);
        $('#editModal').modal('show');
    });

    table.on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm("Bu ürün kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            $.ajax({
                url: `/_json/category/products/${id}`, type: 'DELETE', success: function (result) {
                    console.info(result);
                    toastr.success("Silindi.");
                    table.DataTable().ajax.reload();
                }
            });
        }
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#editModal input[name="id"]').val();
        const title = $('#editModal input[name="title"]').val();
        const description = $('#editModal textarea[name="description"]').val();

        $.ajax({
            url: `/_json/category/products/${id}`,
            type: 'PATCH',
            contentType: 'application/merge-patch+json',
            data: JSON.stringify({title: title, description: description}),
            success: function (result) {
                console.info(result);
                toastr.success("Düzenlendi.");
                $('#editModal').modal('hide');
                table.DataTable().ajax.reload();
            }
        });
    });

    $('#addForm').on('submit', function (e) {
        e.preventDefault();

        const title = $('#addModal input[name="title"]').val();
        const description = $('#addModal textarea[name="description"]').val();

        $.ajax({
            url: '/_json/category/products',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({title: title, description: description}),
            success: function (result) {
                console.info(result);
                toastr.success("Eklendi.");
                $('#addModal').modal('hide');
                table.DataTable().ajax.reload();
            }
        });
    });
});