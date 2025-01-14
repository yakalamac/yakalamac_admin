import AjaxConfig from "./Config/AjaxConfig.js";

/**
 * @typedef {
 *     Array<{
 *     data: any,
 *     orderable: boolean,
 *     render: function(data: any, type: any, row: any),
 *     searchable: boolean,
 * }>} DataTableColumn
 */



/**
 * @typedef {Array<number>} DataTableMenuLengthConfig
 */

/**
 * @typedef {number} DataTablePageLength
 */

/**
 * @typedef {object} DataTableConfig
 * @property {array|undefined} data
 * @property {boolean|undefined} processing
 * @property {boolean|undefined} serverSide
 * @property {DataTableAjaxConfig|undefined} ajax
 * @property {DataTableColumn|undefined} columns
 * @property {DataTableMenuLengthConfig|undefined} lengthMenu
 * @property {DataTablePageLength|undefined} pageLength
 */

class UserDataTable {
    /**
     *
     * @param {HTMLElement|string} table
     */
    constructor(table) {

        if (typeof table === 'string') {
            table = document.querySelector(table);
        }

        if (!table instanceof HTMLElement) {
            throw new Error('Invalid table provided');
        }

        if (typeof $.fn.dataTable !== 'function') {
            throw new Error('DataTable function is not defined');
        }

        /**
         *
         * @type {HTMLElement}
         */
        this._table = table;

        /**
         *
         * @type {DataTableColumn|undefined}
         */
        this._columns = undefined;

        /**
         *
         * @type {AjaxConfig|undefined}
         */
        this._ajax = new AjaxConfig();

        /**
         *
         * @type {undefined|DataTablePageLength}
         */
        this._pageLength = undefined;

        /**
         *
         * @type {undefined|DataTableMenuLengthConfig}
         */
        this._menuLength = undefined;

        /**
         *
         * @type {undefined|boolean}
         */
        this._serverSide = undefined;

        /**
         *
         * @type {undefined|boolean}
         */
        this._processing = undefined;

        /**
         *
         * @type {undefined}
         */
        this._datatable = undefined;

        /**
         *
         * @type {undefined|function|array}
         * @private
         */
        this._data = undefined;

        /**
         * @type {Function}
         */
        this._draw = undefined;
    }

    /**
     *
     * @returns {Function|Array|undefined}
     */
    get data(){
        return this._data;
    }

    /**
     *
     * @param data
     */
    set data(data){
        this._data = data;
    }

    /**
     * @param {DataTableColumn} columns
     */
    set columns(columns) {
        this._columns = columns;
    }

    get columns(){
        return this._columns;
    }

    /**
     *
     * @param {DataTablePageLength} pageLength
     */
    set pageLength(pageLength) {
        this._pageLength = pageLength;
    }

    get pageLength(){
        return this._pageLength;
    }

    /**
     *
     * @param {DataTableMenuLengthConfig} menuLength
     */
    set menuLength(menuLength) {
        this._menuLength = menuLength;
    }

    get menuLength(){
        return this._menuLength;
    }

    /**
     *
     * @param {boolean} processing
     */
    set processing(processing) {
        this._processing = processing;
    }

    get processing(){
        return this._processing;
    }

    /**
     *
     * @param {boolean} serverSide
     */
    set serverSide(serverSide) {
        this._serverSide = serverSide;
    }

    get serverSide(){
        return this._serverSide;
    }

    /**
     *
     * @returns {AjaxConfig}
     */
    get ajax(){
        return this._ajax;
    }

    init() {

        /**
         *
         * @type {DataTableConfig}
         */
        const config = {
            processing: this.processing,
            serverSide: this.serverSide,
            ajax: this.ajax.config,
            columns: this.columns instanceof Array ? this.columns : this.__thrower('Columns were not defined'),
            lengthMenu: this.menuLength ?? [10, 25, 50, 100, 200],
            pageLength: this.pageLength ?? 15
        };


        this.datatable = $(this._table).DataTable(config);

        if(this._draw) {
            this.datatable.on('draw', this._draw);
        }

        return this;
    }

    /**
     *
     * @param message
     * @private
     */
    __thrower(message) {
        throw new Error(message);
    }

    /**
     *
     * @callback callback
     */
    set draw(callback){
        if(typeof callback === 'function') {
            this._draw = callback;
        }
    }
}

export default UserDataTable;