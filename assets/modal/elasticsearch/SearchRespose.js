import ShardStatic from "./ShardStatic";
import Hit from './Hit';
export default class SearchResponse
{
    constructor(response) {
        this.response = response;
    }

    hits()
    {
        return new Hit(this.response.hits);
    }

    shards()
    {
        return new ShardStatic(this.response._shards);
    }
}