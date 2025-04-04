$(document).ready(function () {
    const table = $('#placeCuisineCategoriesTable');

    table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_json/category/place/cuisines",
            type: "GET",
            dataType: "json",
            data: function(d) {
                return {
                    page: Math.floor(d.start / d.length) + 1,
                    limit: d.length
                };
            },
            dataFilter: function(data) {
                if(typeof data === 'string') {
                    data = JSON.parse(data);
                }


                return JSON.stringify({
                    draw: 0,
                    recordsTotal: data['hydra:totalItems'],
                    recordsFiltered: data['hydra:totalItems'],
                    data: data['hydra:member']
                });
            },
            error: function (xhr, error, code) {
                console.error('DataTables AJAX hatası:', error, xhr);
                toastr.error("Veriler yüklenemedi.");
            }
        },
        columns: [
            { data: "title", orderable: false },
            { data: "description", orderable: false },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}">
                            <i class="fadeIn animated bx bx-pencil"></i>
                        </button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        lengthMenu: [15, 20, 25, 50],
        pageLength: 15
    });

    $('#addCategoryBtn').on('click', function () {
        $('#addModal').modal('show');
        $(document).on('submit', '#addForm', function(event){
            event.preventDefault();
            const title = $('#addModal input[name="title"]').val();
            const description = $('#addModal textarea[name="description"]').val();

            $.ajax({
                url: '/_json/category/place/cuisines',
                type: 'POST',
                contentType: 'application/ld+json',
                data: JSON.stringify({title: title, description: description}),
                success: function (result, xhr, request) {
                    if(result.code && result.code > 300 || result.code < 199 ) {
                        console.info(result);
                        $('#addModal').modal('hide');
                        console.log(result);
                        return toastr.error("Hata oluştu Eklenmedi");
                    }

                    $('#addModal').modal('hide');
                    console.log(result);
                    table.DataTable().ajax.reload();
                    return toastr.success('Eklendi');

                },
                error:function (error){
                    toastr.error('Eklenemedi');
                    console.log(error);
            }
            });
        })
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
        if (confirm("Bu işletme mutfağını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            $.ajax({
                url: `/_json/category/place/cuisines/${id}`, type: 'DELETE', success: function (result) {
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
            url: `/_json/category/place/cuisines/${id}`,
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
});