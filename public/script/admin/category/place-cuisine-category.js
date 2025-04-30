import {DataTableSearch} from "../../modules/datatable/DataTableSearch.js";
import {apiDelete, apiPatch, apiPost} from "../../modules/api-controller/ApiController.js";

const getBody=id=>({
    title: $(`#${id} input[name="title"]`).val(),
    description: $(`#${id} textarea[name="description"]`).val()
});

$(document).ready(function () {
    const table = $('#placeCuisineCategoriesTable');
    const datatable = new DataTableSearch(table, {
        processing: true, serverSide: true,
        ajax: {
            url: "/_search/cuisine_category", type: "POST", dataType: "json",
            error: (xhr, error)=>console.error('DataTables AJAX hatası => ', error, xhr)
        },
        columns: [
            { data: "_source.title", orderable: false },
            { data: "_source.description", orderable: false },
            { data: "_source", orderable: false, searchable: false,
                render: function (data) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${data.id}" data-title="${data.title}" data-description="${data.description}">
                            <i class="fadeIn animated bx bx-pencil"></i>
                        </button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${data.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        lengthMenu: [15, 20, 25, 50], pageLength: 15
    });

    $('#addCategoryBtn').on('click', function () {
        $('#addModal').modal('show');
        $(document).on('submit', '#addForm', function(event){
            event.preventDefault();
            apiPost('/_json/category/place/cuisines',{
                data: getBody('addModal'),
                format: 'application/json'
            },{
                successMessage:'Eklendi',
                success:()=>{
                    $('#addModal').modal('hide');
                    datatable.ajax.reload();
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
            apiDelete(`/_json/category/place/cuisines/${id}`,{
               successMessage:'Silindi',success:datatable.ajax.reload
            });
        }
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editModal input[name="id"]').val();
        apiPatch(`/_json/category/place/cuisines/${id}`,getBody('editModal'), {
            success:()=>{ $('#editModal').modal('hide'); datatable.ajax.reload(); },
            successMessage:'Düzenlendi'
        });
    });
});