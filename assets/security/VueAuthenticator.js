import { login, checkAuthentication } from "../http/authentication/authentication";


/**
 * @param {string} identifier
 * @param {string} password
 * @return {Promise<{message: string, ok: boolean}>}
 */
export const authenticate = function (identifier, password) {
    return login({
        email: identifier,
        password: password
    }).then(response => {
        if (!response.ok) {
            console.error("Hata:", response.error);
            return {
                message: 'Giriş başarısız, bilgilerinizi kontrol edin.',
                ok: false
            };
        } else {
            if(typeof response.result === 'object' && response.result.hasOwnProperty('accessToken'))
            {
                const token = response.result.accessToken;
                if (typeof token === 'string') {
                    sessionStorage.setItem('authToken', token);
                    return  {
                        message: 'Giriş başarılı, yönlendiriliyor',
                        ok: true
                    };
                } else {
                    return {
                        message: 'Giriş başarısız, kullanıcı kaydı eksik.',
                        ok: true
                    }
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