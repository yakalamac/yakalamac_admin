import { login, checkAuthentication } from "../http/authentication/authentication";


/**
 * @param {string} identifier
 * @param {string} password
 */
export const authenticate = function (identifier, password) {
    login({
        email: identifier,
        password: password
    }).then(response => {
        if (!response.ok) {
            console.error("Hata:", response.error);
            alert("Şifre veya email yanlış.");
        } else {
            if(typeof response.result === 'object' && response.result.hasOwnProperty('accessToken'))
            {
                const token = response.result.accessToken;
                if (typeof token === 'string') {
                    sessionStorage.setItem('authToken', token);
                    alert("Giriş başarılı!");
                } else {
                    alert('Token yok');
                }
            }
        }
    }).catch(error => {
        console.error("İstek hatası:", error);
        alert("Giriş işlemi sırasında bir hata oluştu.");
    });
};

export const unauthenticated = function () {

};

export const isAuthenticated = function () {
    const token = sessionStorage.getItem('authToken');

    if (!token)
        return false;

    return checkAuthentication({
        authToken: token
    }).then(response => {
        return response.ok;
    }).catch(error => {
        console.error(error);
        return false;
    });
};