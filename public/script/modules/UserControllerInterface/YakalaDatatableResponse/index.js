import DataTableResponse from "./Response/DataTableResponse.js";
import YakalaResponse from "./Response/YakalaResponse.js";

class YakalaDatatableResponse
{
    /**
     *
     * @param {object} data
     */
    constructor(data) {

        if(typeof data !== 'object') {
            throw new Error('No data provided');
        }

        this._yakalaResponse = new YakalaResponse(data);

        const extra = this._yakalaResponse.extra;

        let datatableResponse = {};

        if(
            typeof this._yakalaResponse.statusCode === 'number' &&
            ( this._yakalaResponse.statusCode < 200 || this._yakalaResponse.statusCode > 299 )
            && typeof  this._yakalaResponse.message === 'string'
        ) {
            datatableResponse.error = this._yakalaResponse.message;
        }

        if(typeof extra === 'object') {
            ['draw', 'recordsTotal', 'recordsFiltered']
                .forEach(field=>{
                    if(typeof extra[field] === 'number') {
                        datatableResponse[field] = extra[field];
                    }
            });
        }

        if(this._yakalaResponse.data) {

            datatableResponse.data = this._yakalaResponse.data;

            if(Array.isArray(datatableResponse.data)) {
                datatableResponse.recordsFiltered = datatableResponse.data.length;
                datatableResponse.recordsTotal = 0;
            }

            if(typeof datatableResponse.data === 'object' && datatableResponse.data['hydra:member']) {

                const data = datatableResponse.data;

                datatableResponse.data = data['hydra:member'];

                datatableResponse.recordsTotal = data['hydra:totalItems'];

                if(Array.isArray(data['hydra:member'])) {
                    datatableResponse.recordsFiltered = data['hydra:member'].length;
                }
            }
        }

        this._datatableResponse = new DataTableResponse(datatableResponse);
    }

    /**
     * @returns {DataTableResponse}
     */
    get datatableResponse(){
        return this._datatableResponse;
    }

    /**
     * @returns {YakalaResponse}
     */
    get yakalaResponse()
    {
        return this._yakalaResponse;
    }
}

export default YakalaDatatableResponse;