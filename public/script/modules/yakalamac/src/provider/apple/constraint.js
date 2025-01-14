/**
 * @type {string}
 */
export const APPLE_SIGN_ON_SUCCESS_EVENT = 'AppleIDSignInOnSuccess';

/**
 * @type {string}
 */
export const APPLE_SIGN_ON_FAILURE_EVENT = 'AppleIDSignInOnFailure';

/**
 * @type {string}
 */
export const APPLE_BUNDLE_SCRIPT_SOURCE = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

export const VALID_LOCALES = [
    'ar_SA', 'ca_ES', 'cs_CZ', 'da_DK', 'de_DE', 'el_GR', 'en_GB', 'en_US',
    'es_ES', 'es_MX', 'fi_FI', 'fr_CA', 'fr_FR', 'hr_HR', 'hu_HU', 'id_ID',
    'it_IT', 'iw_IL', 'ja_JP', 'ko_KR', 'ms_MY', 'nl_NL', 'no_NO', 'pl_PL',
    'pt_BR', 'pt_PT', 'ro_RO', 'ru_RU', 'sk_SK', 'sv_SE', 'th_TH', 'tr_TR',
    'uk_UA', 'vi_VI', 'zh_CN', 'zh_HK', 'zh_TW'
];

/**
 * @param locale
 * @returns {string}
 */
export const generateAppleBundleScriptSource = (locale) => {
    if(typeof locale !== "string") {
        throw new Error('Invalid locale provided');
    }

    if(VALID_LOCALES.includes(locale))
        return `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/${locale}/appleid.auth.js`;

    throw new Error('Provided locale is not valid');
};
