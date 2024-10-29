export default class DynamicStorage {
    constructor() {
        this.storage = {};
    }

    set(key, val) {
        this.storage[key] = val;
    }

    get(key)
    {
        return this.storage[key];
    }

    remove(key){
        if(this.storage.key){
            this.storage[key] = null;
            return true;
        }
        return false;
    }

    refresh(){
        this.storage = {};
    }
}