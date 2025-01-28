class YakalaResponse
{
    /**
     *
     * @param {object} data
     */
    constructor(data) {
        if(typeof data !== 'object') {
            throw new Error('Invalid data provided');
        }

        /**
         *
         * @type {boolean}
         * @private
         */
        this._status = data.status ?? false;

        /**
         *
         * @type {*|number}
         * @private
         */
        this._statusCode = data.status_code ?? 500;

        /**
         *
         * @type {undefined}
         * @private
         */
        this._data = data.data ?? undefined;

        /**
         *
         * @type {string}
         * @private
         */
        this._message = data.message ?? 'No message provided';

        /**
         *
         * @type {*|undefined}
         * @private
         */
        this._extra = data.extra ?? undefined;
    }

    get status(){
        return this._status;
    }

    get statusCode(){
        return this._statusCode;
    }

    get data(){
        return this._data;
    }

    get message(){
        return this._message;
    }

    get extra(){
        return this._extra;
    }
}

export default YakalaResponse;