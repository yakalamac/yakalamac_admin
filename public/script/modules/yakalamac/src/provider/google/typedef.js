/**
 * @typedef {Object} GoogleResponse
 * @property {string} clientId
 * @property {string} client_id
 * @property {string} credential
 * @property {string} select_by
 */

/**
 * @typedef {Object} GoogleAccountConfig
 * @property {string} client_id
 * @property {function(response: GoogleResponse)|undefined} callback
 * @property {string|undefined} nonce
 * @property {string|undefined} login_uri
 * @property {boolean|undefined} auto_select
 */

/**
 * @typedef {Object} GoogleAccountIntermediate
 * @property {function()} notifyParentClose
 * @property {function()} notifyParentDone
 * @property {function(a: any)} notifyParentResize
 * @property {function(a: any)} notifyParentTapOutsideMode
 * @property {function(a: any, b: any, c: any)} verifyParentOrigin
 */

/**
 * @typedef {Object} GoogleAccountID
 * @property {function(a: any)} PromptMomentNotification
 * @property {function()} cancel
 * @property {function()} disableAutoSelect
 * @property {function(config: GoogleAccountConfig)} initialize
 * @property {GoogleAccountIntermediate} intermediate
 * @property {function(a?: any, b?: any, c?: any)} prompt
 * @property {function(a: any, b: any, c?:any)} renderButton
 * @property {function(a:any, b:any)} revoke
 * @property {function(a: any)} setLogLevel
 * @property {function(a: any, b:any)} storeCredential
 */

/**
 * @typedef {Object} GoogleIdentityServicesErrorTypeObject
 * @property {string} se
 * @property {string} te
 * @property {string} ue
 * @property {string} xe
 */

/**
 * @typedef {Object} GoogleAccountOAuth2
 * @property {function(a: any)} CodeClient
 * @property {function(a: any, b: any)} GoogleIdentityServicesError
 * @property {GoogleIdentityServicesErrorTypeObject} GoogleIdentityServicesErrorType
 * @property {function(a: any)} TokenClient
 * @property {function(a: any)} hasGrantedAllScopes
 * @property {function(a: any)} hasGrantedAnyScope
 * @property {function(a: any)} initCodeClient
 * @property {function(a: any)} initTokenClient
 * @property {function(a: any, b: any)} revoke
 */

/**
 * @typedef {Object} GoogleAccount
 * @property {GoogleAccountID} id
 * @property {GoogleAccountOAuth2} oauth2
 */

/**
 * @typedef {Object} Google
 * @property {GoogleAccount} accounts
 */

/**
 * @typedef GoogleElementAttributes
 * @property {Object} DIV
 * @property {Object} DIV.ON_LOAD
 * @property {Object} DIV.ON_LOAD.CONTAINER
 * @property {Object} DIV.ON_LOAD.CONTAINER.CLIENT_ID
 * @property {string} DIV.ON_LOAD.CONTAINER.CLIENT_ID.ATTRIBUTE_NAME - Client ID'nin atribut adı.
 * @property {Object} DIV.ON_LOAD.CONTAINER.AUTO_PROMPT
 * @property {string} DIV.ON_LOAD.CONTAINER.AUTO_PROMPT.ATTRIBUTE_NAME - Auto Prompt atribut adı.
 * @property {Object} DIV.ON_LOAD.CONTAINER.LOGIN_URI
 * @property {string} DIV.ON_LOAD.CONTAINER.LOGIN_URI.ATTRIBUTE_NAME - Login URI atribut adı.
 * @property {Object} DIV.ON_LOAD.ID
 * @property {string} DIV.ON_LOAD.ID.ATTRIBUTE_NAME - ID'nin atribut adı.
 * @property {string} DIV.ON_LOAD.ID.VALUE - ID'nin değeri.
 * @property {Object} DIV.SIGN_IN
 * @property {Object} DIV.SIGN_IN.CONTAINER
 * @property {Object} DIV.SIGN_IN.CONTAINER.TYPE
 * @property {string} DIV.SIGN_IN.CONTAINER.TYPE.DEFAULT_VALUE - Default type değeri.
 * @property {string} DIV.SIGN_IN.CONTAINER.TYPE.ATTRIBUTE_NAME - Type atribut adı.
 * @property {Object} DIV.SIGN_IN.ID
 * @property {string} DIV.SIGN_IN.ID.ATTRIBUTE_NAME - ID'nin atribut adı.
 * @property {string} DIV.SIGN_IN.ID.VALUE - ID'nin değeri.
 * @property {Object} DIV.SIGN_IN.CLASS
 * @property {string} DIV.SIGN_IN.CLASS.ATTRIBUTE_NAME - Class atribut adı.
 * @property {string} DIV.SIGN_IN.CLASS.VALUE - Class değeri.
 * @property {Object} META
 * @property {Object} META.SIGN_ID
 * @property {Object} META.SIGN_ID.CONTENT
 * @property {string} META.SIGN_ID.CONTENT.ATTRIBUTE_NAME - Sign ID Content atribut adı.
 * @property {Object} META.SIGN_ID.NAME
 * @property {string} META.SIGN_ID.NAME.ATTRIBUTE_NAME - Sign ID Name atribut adı.
 * @property {string} META.SIGN_ID.NAME.VALUE - Sign ID Name değeri.
 * @property {Object} SCRIPT
 * @property {Object} SCRIPT.SRC
 * @property {string} SCRIPT.SRC.ATTRIBUTE_NAME - SRC atribut adı.
 * @property {Object} SCRIPT.ASYNC
 * @property {boolean} SCRIPT.ASYNC.DEFAULT_VALUE - Async'in varsayılan değeri.
 * @property {string} SCRIPT.ASYNC.ATTRIBUTE_NAME - Async atribut adı.
 * @property {Object} SCRIPT.DEFER
 * @property {boolean} SCRIPT.DEFER.DEFAULT_VALUE - Defer'in varsayılan değeri.
 * @property {string} SCRIPT.DEFER.ATTRIBUTE_NAME - Defer atribut adı.
 */

/**
 * @typedef {EventObject} GoogleEventObject
 */
