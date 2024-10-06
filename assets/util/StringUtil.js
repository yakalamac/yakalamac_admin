export default {
    /**
     * @param {string} str
     * @param {number} maxLength
     * @param {string} remain
     */
    truncate: (str, maxLength, remain)=>{
        return str.length > maxLength ? str.slice(0, maxLength) + remain : str;
    }
}