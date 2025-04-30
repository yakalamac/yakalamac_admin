import {DataTableSearch} from "../../modules/datatable/DataTableSearch.js";
import {apiDelete, apiPatch, apiPost} from "../../modules/api-controller/ApiController.js";

const getBody=(id)=>({
    title: $(`#${id} input[name="title"]`).val(),
    description: $(`#${id} textarea[name="description"]`).val(),
    icon: $(`#${id} input[name="icon"]`).val()
});

$(document).ready(function () {
    const table = $('#contactsCategoriesTable');

    const datatable = new DataTableSearch(table, {
        processing: true, serverSide: true,
        ajax: {
            url: "/_search/contact_category", type: "POST", dataType: "json", dataSrc: "data",
            error: (xhr, error) => console.error('DataTables AJAX error:', error, xhr)
        },
        columns: [
            {data: "_source.icon", orderable: false},
            {data: "_source.title", orderable: false},
            {data: "_source.description", orderable: false},
            {
                data: "_source",
                orderable: false,
                searchable: false,
                render: function (data) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${data.id}" data-icon="${data.icon}" data-title="${data.title}" data-description="${data.description}"><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${data.id}"><i class="lni lni-trash"></i></button>
                    `;
                }
            }
        ],
        lengthMenu: [15, 25, 50, 100], pageLength: 15,
    });

    $('#addCategoryBtn').on('click', function () {
        $('#addModal').modal('show');
    });

    table.on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const title = $(this).data('title');
        const icon = $(this).data('icon');
        const description = $(this).data('description');

        $('#editModal input[name="id"]').val(id);
        $('#editModal input[name="title"]').val(title);
        $('#editModal input[name="icon"]').val(icon);
        $('#editModal textarea[name="description"]').val(description);
        $('#editModal').modal('show');
    });

    table.on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm("Bu kaynak kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            apiDelete(`/_json/category/contacts/${id}`, {
                successMessage: 'Silindi', success: datatable.ajax.reload
            });
        }
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editModal input[name="id"]').val();
        apiPatch(`/_json/category/contacts/${id}`, getBody('editModal'), {
            successMessage: 'Düzenlendi',
            success: () => {
                $('#editModal').modal('hide');
                datatable.ajax.reload();
            }
        });
    });

    $('#addForm').on('submit', function (e) {
        e.preventDefault();
        apiPost('/_json/category/contacts', {
                format: 'application/json',
                data: getBody('addModal')
            }, {
            success: () => {
                $('#addModal').modal('hide');
                datatable.ajax.reload();
            }, successMessage: 'Eklendi'
        });
    });
});