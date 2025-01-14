/**
 * @typedef {{
 * url: string,
 * type: 'POST'|'PATCH'|'DELETE'|'GET'|'PUT',
 * dataType: string,
 * error: function|undefined,
 * failure: function|undefined
 * }} DataTableAjaxConfig
 */
import YakalaDatatableResponse from "../../YakalaDatatableResponse/index.js";


class AjaxConfig {
    constructor() {

        /**
         *
         * @type {undefined|DataTableAjaxConfig}
         * @private
         */
        this._config = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this._url = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this._type = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this._dataType = undefined;

        /**
         *
         * @type {undefined|function}
         */
        this._onError = undefined;

        /**
         *
         * @type {undefined|function}
         */
        this.onFailure = undefined;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = typeof value === 'string' ? value : this.__thrower('Malformed url provided');
    }

    get type() {
        return this._type;
    }

    set type(value) {

        if(typeof value !== "string") {
            this.__thrower('Invalid request type provided. Must be GET, POST, PUT, PATCH or DELETE');
        }

        value = value.toUpperCase();

        this._type = ['GET','POST','PATCH', 'PUT', 'DELETE'].includes(value)
            ? value : this.__thrower('Request type must be GET, POST, PUT, PATCH or DELETE');
    }

    get dataType() {
        return this._dataType;
    }

    /**
     *
     * @param {string} value
     */
    set dataType(value) {
        this._dataType = value;
    }

    get onError() {
        return this._onError;
    }

    /**
     *
     * @param {function} value
     */
    set onError(value) {

        if (typeof value !== 'function' && value !== undefined) {
            throw new TypeError('onError must be a function or undefined');
        }

        this._onError = value;
    }

    get onFailure() {
        return this._onFailure;
    }

    set onFailure(value) {
        if (typeof value !== 'function' && value !== undefined) {
            throw new TypeError('onFailure must be a function or undefined');
        }

        this._onFailure = value;
    }

    /**
     *
     * @param message
     * @private
     */
    __thrower(message){
        throw new Error(message);
    }

    /**
     * @returns {AjaxConfig}
     * @private
     */
    __build(){
        this._config = this._config = {
            url: this.url,
            type: this.type,
            dataType: this.dataType,
            dataFilter: (data)=> {
                if(typeof data === 'string') {
                    data = JSON.parse(data);
                }

                return JSON.stringify((new YakalaDatatableResponse(data)).datatableResponse.generate);
            },
            //dataSrc: (data) => console.log(data) || data,
            error: (errorResponse)=>{
                const error = this.onError;

                if(typeof error === 'function') {
                    error(errorResponse);
                    return;
                }

                console.error('Bir hata meydana geldi. AjaxConfig error.');
                console.error(errorResponse);
            },
            failure: (failureResponse)=>{
                const failure = this.onFailure;

                if(typeof failure === 'function') {
                    failure(failureResponse);
                    return;
                }

                console.warn('Bir hata meydana geldi. AjaxConfig error.');
            }
        };

        return this;
    }

    /**
     * @returns {DataTableAjaxConfig|undefined}
     */
    get config() {
        return this.__build()._config;
    }
}

export default AjaxConfig;