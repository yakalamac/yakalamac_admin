export default class LocalStorage {

    set(key, val) {
        localStorage.setItem(key, val);
    }

    get(key)
    {
        return localStorage.getItem(key);
    }

    remove(key){
        if(localStorage.getItem(key)){
            localStorage.removeItem(key);
            return true;
        }
        return false;
    }

    refresh(){
        localStorage.clear();
    }
}