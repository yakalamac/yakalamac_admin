/**
 * @typedef AppleEvent
 * @property {boolean} isTrusted - Event'in güvenilir olup olmadığını belirtir. Örneğin, kullanıcı tarafından tetiklenmiş mi?
 * @property {boolean} bubbles - Event'in "bubbling" (baloncuk yapma) özelliğini belirtir.
 * @property {boolean} cancelBubble - Event'in baloncuk yapmasını engelleme durumu.
 * @property {boolean} cancellable - Event'in iptal edilebilir olup olmadığını belirtir.
 * @property {boolean} composed - Event'in kompozit olup olmadığını belirtir.
 * @property {any} currentTarget - Event'in mevcut hedefi. Genellikle event listener'ının bağlandığı element.
 * @property {boolean} defaultPrevented - Event'in varsayılan davranışının engellenip engellenmediğini belirtir.
 * @property {Object} detail - Apple Sign-In'den gelen detaylar.
 * @property {Object} detail.authorization - Authorization bilgileri.
 * @property {string} detail.authorization.code - Apple'dan gelen authorization kodu.
 * @property {string} detail.authorization.id_token - Apple'dan alınan id_token.
 * @property {string} detail.authorization.error - Giriş sırasında bir hata oluşursa, hata mesajı.
 * @property {number} eventPhase - Event'in aşaması (bubbling, capturing vb. gibi).
 * @property {boolean} returnValue - Event'in geri değerini belirtir. Genellikle event'in işlenip işlenmeyeceğine karar verir.
 * @property {Document} srcElement - Olayın tetiklediği kaynak element (örneğin, event'i başlatan HTML element).
 * @property {Document} target - Event'in hedef aldığı element.
 * @property {number} timeStamp - Event'in tetiklendiği zamanın zaman damgası.
 * @property {string} type - Event'in türünü belirtir (örneğin, "AppleIDSignInOnSuccess").
 */

/**
 * @typedef AppleIDConfig
 * @property {string} clientId
 * @property {string} redirectURI
 * @property {string} nonce
 * @property {boolean} usePopup
 * @property {string} scope
 */

/**
 * {init: function, renderButton: function, signIn: function}
 * @typedef AppleIDAuth
 * @property {function(config: AppleIDConfig)} init
 * @property {function(parent: HTMLElement)} renderButton
 * @property {function} signIn
 *
 */

/**
 * @typedef AppleIDObject
 * @property {boolean} __esModule
 * @property {AppleIDAuth} auth
 */

/**
 * @typedef AppleEventObject
 * @property {function(AppleEvent)|undefined} before
 * @property {function(AppleEvent)|undefined} after
 */