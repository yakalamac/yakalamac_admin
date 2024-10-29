import LocalStorage from "./LocalStorage";
import DynamicStorage from "./DynamicStorage";

class AjaxPoweredByDynamicStorage{

    /**
     * @param {string} key
     * @param {function} callback
     * @param {DynamicStorage} storage
     */
     fetch(key, callback, storage) {

    }

    /**
     * @param {string} key
     * @param {function} callback
     * @param {DynamicStorage} storage
     */
    post(key, callback, storage) {

    }

    /**
     * @param {string} key
     * @param {function} callback
     * @param {DynamicStorage} storage
     */
    update(key, callback, storage) {

    }

    /**
     * @param {string} key
     * @param {function} callback
     * @param {DynamicStorage} storage
     */
    remove(key, callback, storage) {

    }

}

class AjaxPoweredByLocalStorage{

}


const Ajax = {
    PoweredBy: {
        LocalStorage: ()=> new AjaxPoweredByLocalStorage(),
        DynamicStorage: ()=> new AjaxPoweredByDynamicStorage()
    }
};

export default Ajax;