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
            const token = response.result.accessToken; 
            if (token && typeof token === 'string') {
                sessionStorage.setItem("authToken", token); 
                alert("Giriş başarılı!");
                isAuthenticated();
            } else {
                alert('Token yok');
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
    const token = sessionStorage.getItem("authToken");

    if (!token)
        return false;

    checkAuthentication({
        authToken: token
    }).then(response => {
        console.log(response);
    }).catch(error => {
        console.error(error);
    });
};
