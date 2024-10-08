const axios = require('axios');
import RequestUtil from "../../util/RequestUtil";

const client = axios.create(
    {
        baseURL: '/_route/authentication',
        headers: {
            'Content-Type': 'application/json'
        }
    }
)

export const login = (payload)=>{
    return RequestUtil.standardProcess(
        client.post('/login', payload)
    );
};

export const logout = ()=>{
    return RequestUtil.standardProcess(
        client.get('/logout')
    );
};

export const checkAuthentication = ()=>{
    return RequestUtil.standardProcess(
        client.get('/check')
    );
};