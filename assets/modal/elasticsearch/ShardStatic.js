export default class ShardStatic {
    constructor(shards) {
        this.shards = shards;
    }

    failed()
    {
        return this.shards.failed;
    }

    skipped()
    {
        return this.shards.skipped;
    }

    total()
    {
        return this.shards.total;
    }

    successful(){
        return this.shards.successful;
    }
}