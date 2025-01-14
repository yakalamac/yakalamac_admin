class DataTableResponse {
    /**
     *
     * @param {object} data
     */
    constructor(data) {
        if (typeof data !== 'object') {
            throw new Error('Invalid data provided');
        }

        /**
         *
         * @type {boolean}
         * @private
         */
        this._draw = data.draw ?? 0;

        /**
         *
         * @type {*|number}
         * @private
         */
        this._recordsTotal = data.recordsTotal ?? 0;

        /**
         *
         * @type {*|number}
         * @private
         */
        this._recordsFiltered = data.recordsFiltered ?? 0;

        /**
         *
         * @type {undefined}
         * @private
         */
        this._data = data.data ?? [];

        /**
         *
         * @type {string}
         * @private
         */
        this._error = data.error ?? undefined;
    }

    get draw() {
        return this._draw;
    }

    get recordsTotal() {
        return this._recordsTotal;
    }

    get data() {
        return this._data;
    }

    get recordsFiltered() {
        return this._recordsFiltered;
    }

    get error() {
        return this._error;
    }

    /**
     *
     * @returns {{draw: boolean, data: undefined, recordsTotal: (*|number), recordsFiltered: (*|number), error: string|undefined}}
     */
    get generate() {
        let object = {
            draw: this.draw,
            data: this.data,
            recordsTotal: this.recordsTotal,
            recordsFiltered: this.recordsFiltered
        };

        if(typeof this.error === 'string') {
            object.error = this.error;
        }

        return object;
    }
}

export default DataTableResponse;