import {DataTableSearch} from "../../modules/datatable/DataTableSearch.js";
import {apiDelete, apiPatch, apiPost} from "../../modules/bundles/api-controller/ApiController.js";

const getBody =(id)=>({
    title: $(`#${id} input[name="title"]`).val(),
    description: $(`#${id} textarea[name="description"]`).val()
});

$(document).ready(function () {
    const table = $('#placeConceptCategoriesTable');

    const datatable = new DataTableSearch(table,{
        processing: true, serverSide: true,
        ajax: {
            url: "/_search/place_concept_category", type: "POST", dataType: "json", dataSrc: "data",
            error: (xhr, error) => console.error('DataTables AJAX error:', error, xhr)
        },
        columns: [
            { data: "_source.title", orderable: false },
            { data: "_source.description", orderable: false },
            {
                data: "_source", orderable: false, searchable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}"><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}"><i class="lni lni-trash"></i></button>
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
        const description = $(this).data('description');

        $('#editModal input[name="id"]').val(id);
        $('#editModal input[name="title"]').val(title);
        $('#editModal textarea[name="description"]').val(description);
        $('#editModal').modal('show');
    });

    table.on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm("Bu işletme konseptini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            apiDelete(`/_json/category/place/concepts/${id}`, {
               successMessage: 'Silindi',
               success: datatable.ajax.reload
            });
        }
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editModal input[name="id"]').val();
        apiPatch(`/_json/category/place/concepts/${id}`, getBody('editModal'),{
            successMessage: 'Düzenlendi',success:()=>{
                $('#editModal').modal('hide');
                datatable.ajax.reload();
            }
        });
    });

    $('#addForm').on('submit', function (e) {
        e.preventDefault();
        apiPost('/_json/category/place/concepts', {
         format: 'application/json', data: getBody('addModal')
        }, {
            successMessage: 'Eklendi', success:()=>{
                $('#addModal').modal('hide');
                datatable.ajax.reload();
            }
        });
    });
});