export default {
    /**
     * @param elasticsearchResponse
     * @returns {*|*[]}
     */
  extractHits(elasticsearchResponse)
  {
      return elasticsearchResponse.hits && elasticsearchResponse.hits.hits
          ? elasticsearchResponse.hits.hits
          : [];
  },
    /**
     * @param elasticsearchResponse
     * @returns {number}
     */
    extractResponseItemCount(elasticsearchResponse)
    {
        return elasticsearchResponse.hits && elasticsearchResponse.hits.total ? elasticsearchResponse.hits.total.value : 0;
    },
    /**
     * @param hit
     * @returns {(function(): never)|*|(function(): *|null)|null}
     */
    extractSourceFromHit(hit)
    {
        return hit._source ?? null;
    }
};
