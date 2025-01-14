/**
 * @type {{PLATFORM_JS: string, GSI_CLIENT: string}}
 */
export const GOOGLE_SCRIPT_SOURCE = {
    /**
     * @type {string}
     */
    GSI_CLIENT : 'https://accounts.google.com/gsi/client',
    /**
     * @type {string}
     */
    PLATFORM_JS: 'https://apis.google.com/js/platform.js'
};

/**
 * @const {GoogleElementAttributes} GOOGLE_HTML_ELEMENTS
 */
export const GOOGLE_HTML_ELEMENTS = {
    /** @example <div /> */
    DIV : {
        /** @example <div id="g_id_onload" data-client_id="$$YOURCLIENTID" data-login_uri="$$LOGINURI$$" data-auto_prompt="true|false"/> */
        ON_LOAD: {
            /** @example <div id="g_id_onload"/> */
            ID: {
                ATTRIBUTE_NAME: 'id',
                VALUE: 'g_id_onload'
            },
            /** @example <div data-$$ANY$$="$$ANY$$"/> */
            CONTAINER: {
                /** @example <div data-client_id="$$YOURCLIENTID"/> */
                CLIENT_ID: {
                    ATTRIBUTE_NAME: 'data-client_id'
                },
                /** @example <div data-login_uri="$$LOGINURI$$"/> */
                LOGIN_URI: {
                    ATTRIBUTE_NAME: 'data-login_uri'
                },
                /** @example <div data-auto_prompt="true|false"/> */
                AUTO_PROMPT: {
                    ATTRIBUTE_NAME: 'data-auto_prompt'
                }
            }
        },
        /** @example <div id="g_id_signin" class="g-signin2" data-type="standard"/> */
        SIGN_IN: {
            /** @example <div id="g_id_signin"/> */
            ID: {
                ATTRIBUTE_NAME: 'id',
                VALUE: 'g_id_signin'
            },
            /** @example <div class="g-signin2"/> */
            CLASS: {
                ATTRIBUTE_NAME: 'class',
                VALUE: 'g-signin2'
            },
            /** @example <div data-$$ANY$$="$$VALUE$$"/> */
            CONTAINER: {
                /** @example <div  data-type="standard"/> */
                TYPE: {
                    ATTRIBUTE_NAME: 'data-type',
                    DEFAULT_VALUE: 'standard'
                }
            }
        }
    },
    META: {
        /** @example <meta name="google-signin-client_id" content="YOUR_CLIENT_ID"> */
        SIGN_ID: {
            /** @example <meta name="google-signin-client_id"> */
            NAME: {
                ATTRIBUTE_NAME: 'name',
                VALUE: 'google-signin-client_id'
            },
            /** @example <meta content="YOUR_CLIENT_ID"> */
            CONTENT: {
                ATTRIBUTE_NAME: 'content'
            }
        }
    },
    SCRIPT: {
        /** @example <script src="${GOOGLE_SCRIPT_SOURCE.GSI_CLIENT || GOOGLE_SCRIPT_SOURCE.PLATFORM_JS}" async defer> */
        SRC: {
            ATTRIBUTE_NAME: 'src'
        },
        /** @example <script async> */
        ASYNC: {
            ATTRIBUTE_NAME: 'async',
            DEFAULT_VALUE: true
        },
        /** @example <script defer> */
        DEFER: {
            ATTRIBUTE_NAME: 'defer',
            DEFAULT_VALUE: true
        }
    }
};