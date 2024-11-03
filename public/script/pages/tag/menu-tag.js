$(document).ready(function () {
    const table = $('#menuTagsTable');

    table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_route/datatables/elasticsearch/menu_tag",
            type: "POST",
            dataType: "json",
            dataSrc: "data",
            error: function (xhr, error, code) {
                console.error('DataTables AJAX error:', error, xhr);
            }
        },
        columns: [
            { data: "tag", orderable: false },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-tag="${row.tag}" ><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}"><i class="lni lni-trash"></i></button>
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
        const tag = $(this).data('tag');

        $('#editModal input[name="id"]').val(id);
        $('#editModal input[name="tag"]').val(tag);
        $('#editModal').modal('show');
    });

    table.on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm("Bu etiketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            $.ajax({
                url: `/_route/api/api/tag/menus/${id}`, type: 'DELETE', success: function (result) {
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
        const tag = $('#editModal input[name="tag"]').val();

        $.ajax({
            url: `/_route/api/api/tag/menus/${id}`,
            type: 'PATCH',
            contentType: 'application/merge-patch+json',
            data: JSON.stringify({tag: tag}),
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

        const tag = $('#addModal input[name="tag"]').val();

        $.ajax({
            url: '/_route/api/api/tag/tags',
            type: 'POST',
            contentType: 'application/ld+json',
            data: JSON.stringify({tag: tag}),
            success: function (result) {
                console.info(result);
                toastr.success("Eklendi.");
                $('#addModal').modal('hide');
                table.DataTable().ajax.reload();
            }
        });
    });
});