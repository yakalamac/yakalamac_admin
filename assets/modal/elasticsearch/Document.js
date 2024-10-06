export default class Document
{
    constructor(documentResponse) {
        this.documentResponse = documentResponse;
    }

    /**
     * @returns {string}
     */
    score()
    {
        return this.documentResponse._score;
    }

    /**
     * @returns {string|number}
     */
    id()
    {
        return this.documentResponse._id;
    }

    /**
     * @returns {string}
     */
    index()
    {
        return this.documentResponse._index;
    }

    /**
     * @returns {object}
     */
    source()
    {
        return this.documentResponse._source;
    }

    /**
     * @returns {string}
     */
    type()
    {
        return this.documentResponse._type;
    }
}