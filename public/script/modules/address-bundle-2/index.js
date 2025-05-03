class Address
{
    constructor(list)
    {
        this.addressList = list;
    }

}

class AddressBundle
{
     constructor()
    {
        this.addressStorage = undefined;
        fetch('/script/util/cities2.json')
            .then(async response=> await response.json())
            .then(json=>{ this.addressStorage = json; });
    }

    getCity(name){
         if(this.isInitialized()) {
             return this.addressStorage[name];
         }

         return undefined;
    }

    getDistrict(city, district) {
        const _city = this.getCity(city);
        if(_city) {
            return _city[district];
        }

        return undefined;
    }

    getNeighborhoods(city, district) {
        const districts = this.getDistrict(city);
        if(districts !== undefined) {
            return districts[district];
        }

        return undefined;
    }

    isInitialized(){
       return this.addressStorage !== undefined;
    }

    async initialize() {
         while (!this.isInitialized()) {
            await new Promise(resolve => setTimeout(resolve, 100));
         }

         return this;
    }
}