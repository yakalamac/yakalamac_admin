import { addDictionaryModal } from "../../modules/modals/user.js";


$(document).ready(function(){

    $('body').append(addDictionaryModal);

    $('#dictionaryTable').DataTable({
        processing: true,
        serverSide: true,

        ajax: {
            url: '/_json/dictionaries',
            type:'GET',
            headers:{
                'accept': 'application/ld+json',
            },
            data: (d)=>{
                return {
                    page: Math.floor(d.start/d.length)+1,
                    limit: d.length
                }
            },
            dataFilter: (data)=>{
                if(typeof data === 'string'){
                    data = JSON.parse(data);

                }

                if(!Array.isArray(data)){
                    return JSON.stringify({
                        draw: 0,
                        recordsTotal: data['hydra:totalItems'],
                        data: data['hydra:member'],
                        recordsFiltered: data['hydra:totalItems'],
                        error: undefined

                    });
                }
                else{
                    return JSON.stringify({
                        draw: 0,
                        recordsTotal: data.length,
                        data: data,
                        recordsFiltered: data.length,
                        error: undefined
                    });
                }

            },
            error: (error, errorText, xhr)=>{
                console.log('DataTable AJAX  error', error);
            }

        },
        columns:[
            {
                data: null,
                render: function(data, type, row){
                    return row && row.name ? row.name.trim() : '';
                }
            },{
                data: null,
                render: function(data, type, row){
                    return row && row.serviceType ? row.serviceType.trim() : '';

                }
            },
            {
                data: null,
                render: (data, type, row)=>{
                    return row && row.servedWith ? row.servedWith.trim() : '';
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (!row || !row.id) return '';
                    return `
                        <a href="/admin/dictionary/detail/${row.id}">
                            <button class="btn btn-grd btn-grd-deep-blue edit-btn" 
                                data-id="${row.id}" 
                                data-name="${row.name || ''}" 
                                data-serviceType="${row.serviceType || ''}" 
                                data-servedWith="${row.servedWith || ''}"
                                data-description="${row.description || ''}">
                                <i class="fadeIn animated bx bx-pencil"></i>
                            </button>
                        </a>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 10,
        paging: true,
        searching: true,
        ordering: true
    });



    $('#addDictionaryButton').on('click', function(){
        $('#addDictionaryModal').modal('show')
    })
    $(document).on('submit','#addDictionaryForm' , function(event){

        event.preventDefault();
        const name = $('#DictionaryName').val();
        const content = $('#content').val();
        const serviceType = $('#serviceType').val();
        const description = $('#description').val();
        const servedWith = $('#servedWith').val();

        $.ajax({
            url: '/_json/dictionaries',
            type:'POST',
            data:JSON.stringify({name, content, serviceType, description, servedWith}),
            contentType: "application/json",
            dataType: "json",
            success:(response)=>{

                if(response.status === 'success'){
                    $('#addDictionaryModal').modal('hide');
                    $('#dictionaryTable').DataTable().ajax.reload(null, false);
                    toastr.success('Sözlük başarıyla eklendi.')
                }
            },
            error: (xhr)=>{
                toastr.error('Sözlük ekleme işlemi başarısız')
            }
        })
    });

    $('#dictionaryTable tbody').on('click', '.delete-btn', function() {
        const id = $(this).data('id');

        if (confirm('Silmek istediğine emin misin?')) {
            $.ajax({
                url: `/admin/dictionary/delete/${id}`,
                type: 'DELETE',
                success: function(response, xhr, status) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        toastr.success('silme işlemi başarılır');
                        $('#dictionaryTable').DataTable().ajax.reload(null, false);
                    } else {
                        console.log(response)
                        toastr.error('silme işlemi başarısız');
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                    toastr.error(`Bir Hata oluştu ${xhr}`);
                }
            });
        }
    });

    $(document).on('click', '#editDictionary', function(event){

        const dictionaryId = $('#dictionaryId').attr('data-dictionaryId');
        console.log(dictionaryId)

        const dictionaryData = {
            name: $('#name').val(),
            content: $('#content').val(),
            serviceType: $('#serviceType').val(),
            servedWith: $('#servedWith').val(),
            description: $('#description').val()
        };

        $.ajax({
            url: `/json/dictionaries/${dictionaryId}`,
            type: 'PATCH',
            contentType: 'application/merge-patch+json',
            dataType: 'json',
            data: JSON.stringify(dictionaryData),
            success:(response)=>{

                if(response.status === 'success'){
                    toastr.success('Güncelleme işlemi başarılı ');
                    console.log(dictionaryData)
                    window.location.reload()

                }
            },
            error:(error)=>{
                toastr.error('Güncelleme işlemi başarısız.')
            }
        })

    });

});