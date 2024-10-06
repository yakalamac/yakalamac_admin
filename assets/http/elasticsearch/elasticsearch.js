const axios = require('axios');
import SearchResponse from '../../modal/elasticsearch/SearchRespose';
import request from "../../util/request";

const client = axios.create({
    baseURL: '/_elasticsearch',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    /**
     * @returns {Promise<{result: SearchResponse, request: *, message: *, error: null, ok: *, config: *, status: *} | {result: *, request: *, message: *, error: {code: *, name: *, message: *, status: *}, ok: *, config: *, status: *}>}
     */
    places: (page = 1) => {
        return client.get('place/_search?size=' + page)
            .then(
                response => ({
                    result: new SearchResponse(response.data),
                    message: response.statusText,
                    error: null,
                    ok: request.wasSuccess(response),
                    status: response.status,
                    request: response.request,
                    config: response.config,
                })
            )
            .catch(
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
                        ok: request.wasSuccess(error.response),
                        status: error.response.status,
                        request: error.response.request,
                        config: error.response.config,
                    }
                )
            );
    },
    /**
     *
     * @returns {Promise<SearchResponse>}
     */
    menus: () => {
        return client.get('menu/_search')
            .then(response => new SearchResponse(response.data))
            .catch(error => {
                return error;
            });
    }
};