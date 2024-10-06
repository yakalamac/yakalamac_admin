import Document from "./Document";

export default class Hit
{
    constructor(hits) {
        this.hitsResponse = hits;
    }

    totalValue()
    {
        return this.hitsResponse.total.value;
    }

    relation()
    {
        return this.hitsResponse.total.relation;
    }

    hits()
    {
        return this.hitsResponse.hits;
    }

    /**
     * @returns {Array<object>}
     */
    hitsAsData()
    {
        return this.hitsResponse.hits.map(hit=> hit._source);
    }

    /**
     *
     * @returns {Array<Document>}
     */
    hitsAsDocument()
    {
        return this.hitsResponse.hits.map(hit=> new Document(hit));
    }
}