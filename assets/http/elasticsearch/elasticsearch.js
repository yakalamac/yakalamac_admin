const axios = require('axios');
import SearchResponse from '../../modal/elasticsearch/SearchRespose';
import RequestUtil from "../../util/RequestUtil";

const client = axios.create({
    baseURL: '/_route/elasticsearch',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    /**
     * @param page
     * @param perPage
     * @returns {Promise<{result: *, request: *, message: *, error: null, ok: *, config: *, status: *} | {result: *, request: *, message: *, error: {code: *, name: *, message: *, status: *}, ok: *, config: *, status: *}>}
     */
    places: (page = 1, perPage = 15) =>
    {
        return RequestUtil.standardProcess(
            client.get(`place/_search?${RequestUtil.queryBuilder.Elasticsearch.paginationBuilder(page,perPage)}`)
        ).then(
            response=> {
                if(response.ok)
                    response.result = new SearchResponse(response.result);
                return response;
            }
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