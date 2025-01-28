import UserControllerInterface from "../../../modules/UserControllerInterface/index.js";
import { userAdminAddModal } from "../../../modules/modals/user.js";
import {factoryX} from "../../role/manager.js";

$(document).ready(function () {

    const uci = new UserControllerInterface('adminUsersTable');

    uci.columns = [
        {
            data: null, orderable: true, searchable: true,
            render:data=>(data = data.user)&&data.firstName&&data.lastName?`${data.firstName} ${data.lastName}`:'Güncelleyin.'
        },
        {
            data: null, orderable: true, searchable: true,
            render:data=>(data=data.user)&&(data.email ?? 'Güncelleyin.')
        },
        {
            data: 'roles', orderable: false,
            render:data=>factoryX(data)
        },
        {
            data: null, orderable: false, searchable: false,
            render: function (data, type, row) {
                const id = data['@id'] ?? data.id; if(id===undefined)return;
                return `<button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${id}" data-email="${row.email}" 
                    data-roles="${row.roles}" data-firstName="${row.firstName}" data-lastName="${row.lastName}" data-username="${row.username}" 
                    data-mobilePhone="${row.mobilePhone}"><i class="fadeIn animated bx bx-pencil"></i></button>
                    <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${id}"><i class="lni lni-trash"></i></button>`;
            }
        }
    ];

    uci.onAddUser = {
        data: (event) => {
            const form = event.currentTarget.querySelector('form#addForm');
            if(Array.isArray(form) && form.length > 0 || form instanceof HTMLFormElement) {
                const data = new FormData(form instanceof HTMLFormElement ? form : form[0]);
                return {
                    email: `${data.get('email')}@yakalamac.com.tr`,
                    password: data.get('password'),
                    mobilePhone: data.get('mobilePhone')
                };
            }
            throw new Error('Form not found.');
        },
        modal: userAdminAddModal,
        target: '#addUserButton',
        success: (s)=> {
            if(s.ok) {
                s.json().then(j=> console.log(j));
            }
        },
        error: (e)=> {
            toast.error('Bir hata oluştu.');
        },
        failure: (f)=> {
            if(f.redirected) {
                console.log('redirect oldu');
                return;
            }
            f.json().then(j=>{
                if(j.data && j.data.message) {console.log(j.data);
                    toastr.warning(j.data.message);
                }
            });
        }
    };
    
    uci.onEditUser = {
        data: (event) => {},
        modal: function (event){
            const id = event.currentTarget.getAttribute('data-id');
            if(id === undefined)return;
            if(id.includes('/')) {
                const parts = id.split('/');
                window.location.href=['./detail',parts[parts.length-1]].join('/');
            } else {
                window.location.href=['./detail',id].join('/');
            }
        },
        target: 'button.edit-btn',
        success: (response)=>{},
        getId: (event)=>{},
        error: ()=>{},
        failure: ()=>{}
    };

    uci.init().start();

    console.log(uci);
});

// uci.onAddUser = function () {
//
//     const email = $('#email').val();
//
//     if(email && email.length > 0) {
//         $.ajax({
//             url: uci.pathInterface.userAdd(),
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             data: JSON.stringify({
//                 email: email
//             }),
//             success: function (data) {
//                 window.alert(`${email} admin hesabı başarıyla eklendi. Giriş şifresi ${data.generatedPassword}`);
//                 table.ajax.reload();
//             },
//             error: function (data) {
//                 console.log(data.responseText);
//             },
//             failure: function (data) {
//                 console.log(data.responseText);
//             }
//         });
//     }
// };

/*
uci.onAddUser = {
        data: () => {
            return {
                'onur': 'baris',
                'ege': 'ayla',
                'zekeriya': 'han'
            };
        },
        success: (s)=> {
            console.log(s);
        },
        error: (e)=> {
            console.log(e);
        },
        failure: (f)=> {
            console.log(f);
        }
    };
 */