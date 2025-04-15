import {DataTableSearch} from "../../modules/datatable/DataTableSearch.js";
import {apiDelete, apiPatch, apiPost} from "../../modules/bundles/api-controller/ApiController.js";

const getBody=id=>({
    title: $(`#${id} input[name="title"]`).val(),
    description: $(`#${id} input[name="description"]`).val()
});

$(document).ready(function () {
    const table = $('#placeCategoriesTable');

    const datatable = new DataTableSearch(table, {
        processing: true, serverSide: true,
        ajax: {
            url: "/_search/place_category", type: "POST", dataType: "json", dataSrc: "data",
            error: (xhr, error)=> console.error('DataTables AJAX error:', error, xhr)
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
        lengthMenu: [15, 25, 50, 100], pageLength: 15
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
        $('#editModal input[name="description"]').val(description);
        $('#editModal').modal('show');
    });

    table.on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            apiDelete(`/_json/category/places/${id}`, {
                success: datatable.ajax.reload, successMessage: 'Silindi'
            });
        }
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editModal input[name="id"]').val();
        apiPatch(`/_json/category/places/${id}`, getBody('editModal'), {
                successMessage:'Düzenlendi',
                success: ()=>{
                    $('#editModal').modal('hide');
                    datatable.ajax.reload();
                }
            });
    });

    $('#addForm').on('submit', function (e) {
        e.preventDefault();
        apiPost('/_json/category/places', {
            data: getBody('addModal'),
            format: 'application/json'
            },{successMessage: 'Eklendi',
           success:()=> {
               $('#addModal').modal('hide');
               datatable.ajax.reload();
           }
        });
    });
});