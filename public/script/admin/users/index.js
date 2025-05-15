import { addUserModal } from "../../modules/modals/user.js";

$(document).ready(function() {  
    const table = $('#usersTable');
    $('body').append(addUserModal);

    const dataTable = table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_json/users",
            type: "GET",
            headers:{
                'accept': 'application/ld+json'
            },
            data: (d)=>{
                return{
                    page: Math.floor(d.start/d.length)+1,
                    limit: d.length
                }
            },
            dataFilter : (data)=>{
                if(typeof data === 'string') {
                    data = JSON.parse(data);
                }
                console.log(data);
                if(!Array.isArray(data)){
                    return JSON.stringify({
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
            error: function (xhr, error, code) {
                console.error('DataTables AJAX error:', error, xhr);
            }
        },
        columns: [
            {
                data: null,
                render: (data, type, row)=>{
                    if(typeof row === 'string') return '';
                    if(typeof row.fullName === 'string' && row.fullName.trim().length > 0)
                        return (row.fullName?? '').trim();
                    if(row.firstName === undefined && row.lastName === undefined)
                        return 'Bilgi içeriği yok';
                    return (row.firstName?? '' + ' ' + row.lastName?? '') ?? 'Bilinmeyen Kullanıcı Adı'.trim();
                }
            },
            {
                data: null,
                render: (data, type, row)=> row.email ?? row.username ?? 'kayıtsız mail girişi',
                orderable: false 
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    console.log(row);
                    return `
                        <a href="/admin/users/detail/${row.id}">
                            <button  class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" 
                                data-fullname="${row.fullName}" data-email="${row.email}" 
                                data-phone="${row.mobilePhone}">
                                <i class="fadeIn animated bx bx-pencil"></i>
                            </button>
                        </a>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}"><i class="lni lni-trash"></i></button>
                    `;
                }
            }
        ],
        lengthMenu: [15, 25, 50, 100],
        pageLength: 15,
        paging: true,
        searching: true,
        ordering: true
    });

    $(document).on('click', '#editProfile', function () {

        const userId = $('#userData').attr('data-userData')
        let data = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            mobilePhone: $('#mobilePhone').val()
        };
    
        $.ajax({
            url: `/admin/users/edit?id=${userId}`,
            type: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                toastr.success("Kullanıcı başarıyla güncellendi!");
            },
            error: function (xhr, status, error) {
                toastr.error("Güncelleme başarısız: " + xhr.responseText);
            }
        });
    });

    $('#addUserButton').on('click' , function(){

        $('#addUserModal').modal('show');
        })
        $(document).on('submit', '#addForm' , function(event) {

            event.preventDefault();
            const email = $('#email').val();
            const password = $('#password').val();

            $.ajax({
                url: `/admin/users/addUser`,
            type: "POST",   
            data: JSON.stringify({ email, password }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.ok) {
                    $('#addUserModal').modal('hide');
                    $('#usersTable').DataTable().ajax.reload();
                    toastr.success('Kullanıcı başarıyla eklendi');
                    }
                },
                error: (xhr)=>{
                    console.error("Hata:", xhr.responseText);
                    toastr.error('Kullanıcı ekleme işlemi başarısız oldu');
                }


            })
        })

     $('#usersTable tbody').on('click', '.delete-btn', function () {   
        const id = $(this).data('id');
        console.log(id);
        if(confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
            $.ajax({
                url: `/admin/users/delete/${id}`,
                type: "DELETE",
                success: function(response , xhr , status) {
                    console.log("Sunucu Yanıtı:", response);
                    console.log("HTTP Status:", xhr.status);
    
                    if (xhr.status === 200 || xhr.status === 204) {
                        toastr.success("Kullanıcı başarıyla silindi!");
                        dataTable.ajax.reload(null, false); 
                    } else {
                        toastr.error(" beklenmeyen bir yanıt alındı.");
                    }
                },
                error: function(xhr) {
                    toastr.error(`Hata: Kullanıcı silinemedi.${xhr}` );
                    dataTable.ajax.reload();
                }
             }); 
         }
     });
});

