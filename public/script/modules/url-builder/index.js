import {slugify} from "../../util/slugify.js";

export const URLBuilder = (fields, params)=>{
    if(!Array.isArray(fields)) throw new Error('Pass fields as array');
    fields = fields.map(field => {
        if(typeof field === 'object') throw new Error('Must be string or number');
        return slugify(field);
    });

    const uri = `https://yaka.la/detail/${fields.join('/')}`;
    const parameterKeys = Object.keys(params);
    if(parameterKeys.length === 0) return uri;
    return `${uri}?`+ parameterKeys.map(key=> `${key}=${params[key]}`).join('&');
};