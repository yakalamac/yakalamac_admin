/* global $ */

if (!(window.$)) {
    throw new Error('JQuery is not defined');
}

const $ = window.$;

if (!$().DataTable()) {
    throw new Error('DataTable is not defined');
}


import PathInterface from './PathInterface.js';
import UserDataTable from './UserDataTable/index.js';

/**
 * @callback DataProviderFunction
 * @param {Event} event
 * @returns {string|number|boolean|object|Array}
 */

/**
 * @callback IdGetterFunction
 * @param {Event} event
 * @returns {string|number}
 */

/**
 * @callback SuccessFuction
 * @param {Response} response
 * @returns {void}
 */

/**
 * @typedef {SuccessFuction} FailureFunction
 */

/**
 * @callback ErrorFunction
 * @param {Error} error
 * @returns {void}
 */

/**
 * @callback ModalProviderFunction
 * @returns {string|HTMLElement|void}
 */

/**
 * @callback ModalFillerFunction
 * @param {Event} event
 * @param {string|Function|HTMLElement} modal
 */

/**
 * @typedef {Object} EventHandlerObject
 * @property {SuccessFuction} success
 * @property {ErrorFunction} error
 * @property {FailureFunction} failure
 * @property {string|HTMLElement} target
 */

/**
 * @typedef {EventHandlerObject} EventHandlerHasIdObject
 * @property {IdGetterFunction} getId
 */

/**
 * @typedef {EventHandlerObject} EventHandlerPostObject
 * @property {DataProviderFunction} data
 * @property {string|Function|HTMLElement} modal
 */

/**
 * @typedef {EventHandlerPostObject} EventHandlerEditObject
 * @property {IdGetterFunction} getId
 * @property {ModalFillerFunction|undefined} modalFiller
 */

class UserControllerInterface {
    constructor(tableId) {

        if (!window?.Twig?.basePath) {
            throw new Error('Base path undefined');
        }

        if (typeof tableId !== 'string') {
            throw new Error('Table id is not found');
        }

        /**
         *
         * @type {{
         * onAddUser: undefined|EventHandlerPostObject,
         * onEditUser: undefined|EventHandlerEditObject,
         * onDeleteUser: undefined|EventHandlerHasIdObject
         * }}
         * @private
         */
        this._events = {
            onAddUser: undefined,
            onEditUser: undefined,
            onDeleteUser: undefined
        };

        this._eventStats = {
            onAddUser : {
                built : false,
                target: undefined
            },
            onEditUser: {
                built: false,
                target: undefined
            },
            onDeleteUser: {
                built: false,
                target: undefined
            }
        };

        this.table = document.getElementById(tableId);

        if (!this.table instanceof HTMLElement) {
            throw new Error('Invalid table id provided');
        }

        /**
         *
         * @type {undefined|UserDataTable}
         */
        this.tableJQuery = undefined;

        this.basePath = window.Twig.basePath;

        /**
         *
         * @type {undefined|PathInterface}
         */
        this.pathInterface = undefined;
    }

    init() {

        const _self = this;

        this.pathInterface = new PathInterface(this.basePath);
        this.tableJQuery = new UserDataTable(this.table);
        this.tableJQuery.columns =  this._columns;
        this.tableJQuery.processing = true;
        this.tableJQuery.serverSide = true;
        this.tableJQuery.menuLength = [15, 30, 50, 100, 200];
        this.tableJQuery.pageLength = 15;
        const ajax = this.tableJQuery.ajax;

        ajax.url = this.pathInterface.userList();
        ajax.type = 'POST';
        ajax.dataType = 'json';
        // this.tableJQuery.data = (x)=>{
        //     console.warn(x);
        //     return [];
        // }
        this.tableJQuery.draw = function (event){
            const onUserAddEvent = _self.onAddUser;

            if (onUserAddEvent)
            {
                const modalElement = $(onUserAddEvent.modal);
                //TODO Burada modal tıklanınca oluşturulabilir
                if(typeof onUserAddEvent.modal === 'string' && !modalElement.parent().length) {
                    $('body').append(modalElement);
                    onUserAddEvent.modal = modalElement;
                }

                $(onUserAddEvent.target).on('click', (event) => {
                    event.preventDefault();
                    if (typeof onUserAddEvent.modal === 'function') {
                        onUserAddEvent.modal(event);
                    } else {
                        modalElement.modal('show');
                    }
                });

                if(typeof onUserAddEvent.modal !== 'function') {
                    modalElement.on('submit', (event) => {
                        event.preventDefault();

                        _self.addUser(onUserAddEvent.data(event))
                            .then(response => {
                                if(response.ok) {
                                    if(typeof onUserAddEvent.success === 'function') {
                                        onUserAddEvent.success(response);
                                    }
                                } else {
                                    if(typeof onUserAddEvent.failure === 'function') {
                                        onUserAddEvent.failure(response);
                                    }
                                }
                            })
                            .catch(error => {
                                if(typeof onUserAddEvent.error === 'function') {
                                    onUserAddEvent.error(error);
                                }
                            });
                    });
                }
            }

            const onDeleteUser = _self.onDeleteUser;

            if(onDeleteUser)
            {
                $(onDeleteUser.target).on(
                    'click',
                    function (event) {
                        event.preventDefault();

                        _self.deleteUser(onDeleteUser.getId(event))
                            .then(response=>{
                                if(response.ok) {
                                    if(typeof onDeleteUser.success === 'function') {
                                        onDeleteUser.success(response);
                                    }
                                } else if(typeof onDeleteUser.failure === 'function') {
                                    onDeleteUser.failure(response);
                                }
                            })
                            .catch(error=> {
                                if(typeof onDeleteUser.error === 'function') {
                                    onDeleteUser.error(error);
                                }
                            });
                    });
            }

            const onEditUser = _self.onEditUser;

            if(onEditUser)
            {
                if(typeof onEditUser.modal === 'string') {
                    const modalElement = $(onEditUser.modal);
                    //TODO Burada modal tıklanınca oluşturulabilir
                    if(!modalElement.parent().length) {
                        $('body').append(modalElement);
                        onEditUser.modal = modalElement;
                    }
                }

                $(onEditUser.target).on('click', (event)=>{
                    event.preventDefault();
                    if(typeof onEditUser.modal === 'function') {
                        onEditUser.modal(event);
                    } else {
                        onEditUser.modal.modal('show');
                    }
                });

                if(typeof onEditUser.modal !== 'function') {
                    $(onEditUser.modal).on('submit', (event)=> {
                        event.preventDefault();
                        if(typeof onEditUser.modalFiller === 'function') {
                            onEditUser.modalFiller(event, onEditUser.modal);
                        }

                        _self.editUser(onEditUser.getId(event), onEditUser.data(event))
                            .then(response=>{
                                if(response.ok) {
                                    if(typeof onEditUser.success === 'function') {
                                        onEditUser.success(response);
                                    }
                                } else if(typeof onEditUser.failure === 'function') {
                                    onEditUser.failure(response);
                                }
                            })
                            .catch(error=>{
                                if(typeof onEditUser.error === 'function') {
                                    onEditUser.error(error);
                                }
                            });

                    });
                }

            }
        };

        return this;
    }

    set columns(columns){
        this._columns = columns;
    }

    /**
     *
     * @param {object|string|number|array} body
     * @returns {Promise<Response>}
     */
    addUser(body) {

        if(Array.isArray(body) || typeof body === 'object') {
            body = JSON.stringify(body);
        }

        return fetch(this.pathInterface.userAdd(), {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type' : 'application/json'
            }
        });
    }

    /**
     *
     * @param {string|number} userId
     * @returns {Promise<Response>}
     */
    deleteUser(userId) {
        return fetch(this.pathInterface.userDelete(userId), {
            method: 'DELETE'
        });
    }

    /**
     *
     * @param userId
     * @param {Array|Object} body
     * @returns {Promise<Response>}
     */
    editUser(userId, body) {
        return fetch(this.pathInterface.userEdit(userId), {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    start() {
        this.tableJQuery.init();
    }

    /**
     *
     * @param {EventHandlerPostObject} addUserEvent
     * @throws Error
     */
    set onAddUser(addUserEvent) {
        if (typeof addUserEvent === 'object' && this._isEventHandlerPostObject(addUserEvent)) {
            this._events.onAddUser = addUserEvent;
        } else {
            throw new Error('Error on setting `onAddUser` event.');
        }
    }

    /**
     *
     * @param {EventHandlerHasIdObject} deleteUserEvent
     * @throws Error
     */
    set onDeleteUser(deleteUserEvent) {
        if (typeof deleteUserEvent === 'object' && this._isEventHandlerHasIdObject(deleteUserEvent)) {
            this._events.onDeleteUser = deleteUserEvent;
        } else {
            throw new Error('Error on setting `onDeleteUser` event.');
        }
    }

    /**
     *
     * @param {EventHandlerEditObject} editUserEvent
     * @throws Error
     */
    set onEditUser(editUserEvent) {
        if (typeof editUserEvent === 'object' && this._isEventHandlerEditObject(editUserEvent)) {
            this._events.onEditUser = editUserEvent;
        } else {
            throw new Error('Error on setting `onEditUser` event.');
        }
    }

    /**
     *
     * @returns {EventHandlerPostObject|false}
     */
    get onAddUser() {
        const event = this._getEvent('onAddUser');
        return this._isEventHandlerPostObject(event) ? event : false;
    }

    /**
     *
     * @returns {EventHandlerHasIdObject|false}
     */
    get onDeleteUser() {
        const event = this._getEvent('onDeleteUser');
        return this._isEventHandlerHasIdObject(event) ? event : false;
    }

    /**
     * @returns {false|EventHandlerEditObject}
     */
    get onEditUser() {
        const event = this._getEvent('onEditUser');
        return this._isEventHandlerEditObject(event) ? event : false;
    }

    /**
     *
     * @param {string} eventName
     * @returns {false|EventHandlerEditObject|EventHandlerPostObject|EventHandlerHasIdObject|EventHandlerObject}
     * @private
     */
    _getEvent(eventName) {
        if (typeof eventName === "string" && typeof this?._events[eventName] === 'object') {
            return this._events[eventName];
        }

        return false;
    }

    /**
     *
     * @param {EventHandlerEditObject} eventHandlerObject
     * @returns {boolean}
     * @private
     */
    _isEventHandlerEditObject(eventHandlerObject) {
        if(eventHandlerObject.modalFiller !== undefined && typeof eventHandlerObject.modalFiller !== 'function') {
            return false;
        }
        return this._isEventHandlerPostObject(eventHandlerObject) && typeof eventHandlerObject.getId === 'function';
    }

    /**
     *
     * @param {EventHandlerPostObject} eventHandlerObject
     * @returns {boolean}
     * @private
     */
    _isEventHandlerPostObject(eventHandlerObject) {
        return this._isEventHandlerObject(eventHandlerObject) &&
            typeof eventHandlerObject.data === 'function' &&
            (
                typeof eventHandlerObject.modal === 'string' ||
                typeof eventHandlerObject.modal === 'function' ||
                eventHandlerObject instanceof HTMLElement
            );
    }

    /**
     *
     * @param {EventHandlerHasIdObject} eventHandlerObject
     * @returns {boolean}
     * @private
     */
    _isEventHandlerHasIdObject(eventHandlerObject) {
        return this._isEventHandlerObject(eventHandlerObject) && typeof eventHandlerObject.getId === 'function';
    }

    /**
     *
     * @param {EventHandlerObject} eventHandlerObject
     * @returns boolean
     * @private
     */
    _isEventHandlerObject(eventHandlerObject) {
        if (typeof eventHandlerObject === 'object') {

            if (!(eventHandlerObject.target instanceof HTMLElement || typeof eventHandlerObject.target === 'string')) {
                return false;
            }

            const eventList = ['success', 'error', 'failure'];

            for (let i = 0; i < eventList.length; i++) {
                if (eventHandlerObject[eventList[i]] === undefined) {
                    if (['success'].includes(eventList[i])) {
                        return false;
                    }
                } else if (typeof eventHandlerObject[eventList[i]] !== 'function') {
                    return false;
                }
            }

            return true;
        }
        return false;
    }
}

export default UserControllerInterface;

/*
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

 */