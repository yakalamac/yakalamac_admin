$(document).ready(function () {

    const table = $('#adminUsersTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: window.Twig.fetcherPath,
            type: 'POST',
            dataType: "json"
        },
        columns: [
            {
                data: null,
                orderable: true,
                render: function (data, type, row) {
                    return (row.firstName && row.lastName) ? row.firstName + ' ' + row.lastName : 'Kullanıcı bilgisini güncelleyin.';
                }
            },
            {data: 'email', orderable: false},
            {data: 'roles', orderable: false},
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" 
                        data-email="${row.email}" data-roles="${row.roles}" data-firstName="${row.firstName}"
                        data-lastName="${row.lastName}" data-username="${row.username}" data-mobilePhone="${row.mobilePhone}"
                        >
                            <i class="fadeIn animated bx bx-pencil"></i>
                        </button>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}"><i class="lni lni-trash"></i></button>
                    `;
                }
            }
        ],
        lengthMenu: [15, 25, 50, 100],
        pageLength: 15,
    });

    $('#addAdminBtn').on('click', function () {
        $('#addModal').modal('show');
    });

    $('div#addModal button#createEmail').on('click', function (event) {
        event.preventDefault();
        $('div#addModal input#email').val(Math.random().toString(36).slice(-8) + '@yakalamac.com');
    });

    $('#addForm').on('submit', function (event) {
       event.preventDefault();
        const email = $('#email').val();

        if(email && email.length > 0) {
            $.ajax({
                url: window.Twig.addUser,
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    email: email
                }),
                success: function (data) {
                    window.alert(`${email} admin hesabı başarıyla eklendi. Giriş şifresi ${data.generatedPassword}`);
                    table.ajax.reload();
                },
                error: function (data) {
                    console.log(data.responseText);
                },
                failure: function (data) {
                    console.log(data.responseText);
                }
            });
        }
    });

    table.on('click', '.edit-btn', event=>{
       event.preventDefault();

       $('div#editModal input#email').val($(event.currentTarget).data('email'));
       $('div#editModal input#username').val($(event.currentTarget).data('username'));
       $('div#editModal input#firstName').val($(event.currentTarget).data('firstName'));
       $('div#editModal input#lastName').val($(event.currentTarget).data('lastName'));
       $('div#editModal input#mobilePhone').val($(event.currentTarget).data('mobilePhone'));
       $('#editModal').modal('show');
    });

    $('#editForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#editModal input[name="id"]').val();
        const type = $('#editModal input[name="type"]').val();
        const description = $('#editModal input[name="description"]').val();

        $.ajax({
            url: `/_route/api/api/type/places/${id}`,
            type: 'PATCH',
            contentType: 'application/merge-patch+json',
            data: JSON.stringify({type: type, description: description}),
            success: function (result) {
                console.info(result);
                toastr.success("Düzenlendi.");
                $('#editModal').modal('hide');
                table.DataTable().ajax.reload();
            }
        });
    });
});