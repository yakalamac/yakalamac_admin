import {checkAuthentication, login} from "../http/authentication/authentication";

/**
 * @param {string} identifier
 * @param {string} password
 */
export const authenticate = function (identifier, password) {
    login({
        email: identifier,
        password: password
    }).then(
        response=> console.log(response)
    );
};

export const unauthenticated = function (){

};

export const isAuthenticated = function (){
    const token = sessionStorage.getItem("authToken");

    if(!token)
        return false;

    checkAuthentication({
        authToken: token
    }).then(response=>{
        console.log(response);
    }).catch(error=>{
        console.error(error);
    });
}