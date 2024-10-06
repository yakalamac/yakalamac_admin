export default {
    getValue : {
        /**
         * @param {object} object
         * @param {string} stringPath
         * @returns {*}
         */
        fromString:(object, stringPath)=>{
            return stringPath.split('.').reduce((o, key) => (o ? o[key] : undefined), object);
        }
    }
}