import {DataTableSearch} from "../../modules/datatable/DataTableSearch.js";
import {apiDelete, apiPost, apiPatch} from "../../modules/api-controller/ApiController.js";

const getBody=(id)=>({
    title: $(`#${id} input[name="title"]`).val(),
    description: $(`#${id} textarea[name="description"]`).val()
});

$(document).ready(function () {
    const table = $('#accountCategoriesTable');

    const datatable = new DataTableSearch(table,{
        processing: true, serverSide: true,
        ajax: {
            url: "/_search/account_category", type: "POST", dataType: "json", dataSrc: "data",
            error: (xhr, error)=>console.error('DataTables AJAX error:', error, xhr)
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
        if (confirm("Bu hesap kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            apiDelete(`/_json/category/accounts/${id}`, {
                success: () => datatable.ajax.reload(),
                successMessage: 'Silindi'
            });
        }
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editModal input[name="id"]').val();
        apiPatch(`/_json/category/accounts/${id}`, getBody('editModal'), {
            successMessage: 'Düzenlendi',
            success: ()=>{
                $('#editModal').modal('hide');
                datatable.ajax.reload();
            }
        });
    });

    $('#addForm').on('submit', function (e) {
        e.preventDefault();
        apiPost('/_json/category/accounts', {
            data: getBody('addModal'),
            format: 'application/json'
        },{
            success: ()=>{
                $('#addModal').modal('hide');
                datatable.ajax.reload();
            },
            successMessage: 'Eklendi'
        });
    });
});