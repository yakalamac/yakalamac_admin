const RequestUtil = {
    /**
     * Checks response was success
     * @param response
     * @returns {boolean}
     */
    wasSuccess : (response)=>{
        return response.status > 199 && response.status < 300;
    },
    /**
     * Standard request handling process to handle error and request status
     * @param {Promise<function>} callback
     * @returns {Promise<{result: any, request: *, message: *, error: null, ok: *, config: *, status: *} | {result: *, request: *, message: *, error: {code: *, name: *, message: *, status: *}, ok: *, config: *, status: *}>}
     */
    standardProcess : function (callback){
        return callback.then(
            /**
             * @param {AxiosResponse} response
             */
            response => (
                {
                    result: response.data,
                    message: response.statusText,
                    error: null,
                    ok: RequestUtil.wasSuccess(response),
                    status: response.status,
                    request: response.request,
                    config: response.config,
                }
            )
        ).catch(
            error => (
                {
                    result: error.response.data,
                    message: error.response.statusText,
                    error:{
                        name: error.name,
                        message: error.message,
                        code: error.code,
                        status: error.status,
                    },
                    ok: RequestUtil.wasSuccess(error.response),
                    status: error.response.status,
                    request: error.response.request,
                    config: error.response.config,
                }
            )
        );
    },
    queryBuilder : {
        Elasticsearch : {
            paginationBuilder : (page, perPage) =>  `from=${(page-1)*perPage}&size=${perPage}`
        },
        API : {

        }
    }
};

export default RequestUtil;