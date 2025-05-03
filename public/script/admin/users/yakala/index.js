import UserControllerInterface from "../../../modules/UserControllerInterface/index.js";
import { userYakalaAddModal } from "../../../modules/modals/user.js";
$(document).ready(function () {
    const uci = new UserControllerInterface('adminUsersTable');

    uci.onAddUser = {
        data: (event) => {
            console.log(event.target);
        },
        modal: userYakalaAddModal,
        target: '#addUserButton',
        success: (s)=> {
            console.log(s);
        },
        error: (e)=> {
            console.log(e);
        },
        failure: (f)=> {
            if(f.redirected) {
                console.log('redirect oldu');
                return;
            }
            f.json().then(j=>console.log(j))
        }
    };

    uci.onEditUser = {
        data: (event) => {},
        modal: function (event, getId){
            window.location.href = [
                './detail',
                event.currentTarget.getAttribute('data-id')
            ].join('/');
        },
        target: 'button.edit-btn',
        success: (response)=>{},
        getId: (event)=>{

        },
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