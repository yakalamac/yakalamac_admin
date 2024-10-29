$(document).ready(function () {
    const table = $('#placeCategoriesTable');

    table.DataTable({
        processing: true, serverSide: true, ajax: {
            url: "/_route/api/api/category/places", dataSrc: data => data['hydra:member'] ?? data
        }, columns: [{
            data: "title"
        }, {
            data: "description"
        }, {
            data: "updatedAt", render: function (data) {
                return moment(data).format('DD/MM/YYYY - HH:mm');
            }
        }, {
            data: "createdAt", render: function (data) {
                return moment(data).format('DD/MM/YYYY - HH:mm');
            }
        }, {
            data: null, render: function (data, type, row) {
                return `<button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}"><i class="fadeIn animated bx bx-pencil"></i></button>
                            <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}"><i class="lni lni-trash"></i></button>`;
            }
        }],

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
        if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            $.ajax({
                url: `/_route/api/api/category/places/${id}`, type: 'DELETE', success: function (result) {
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
            url: `/_route/api/api/category/places/${id}`,
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
            url: '/_route/api/api/category/places',
            type: 'POST',
            contentType: 'application/ld+json',
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