import "./typedef.js";
import {
  APPLE_BUNDLE_SCRIPT_SOURCE, APPLE_SIGN_ON_FAILURE_EVENT, APPLE_SIGN_ON_SUCCESS_EVENT,
  generateAppleBundleScriptSource, VALID_LOCALES,
} from "./constraint.js";

/**
 * @class AppleIdentityProvider
 * @method init
 * @see https://developer.apple.com/documentation/sign_in_with_apple/displaying_sign_in_with_apple_buttons_on_the_web
 */
export class AppleIdentityProvider {
  constructor(clientId, scopes, redirectUri = undefined, locale = undefined) {
    /**
     * @type {string|undefined}
     */
    this.nonce = undefined;

    /**
     * @type {string|undefined}
     */
    this.script = undefined;

    /**
     * @type {string}
     */
    this.button = undefined;

    /**
     * @type {string}
     */
    this.clientId = clientId;

    /**
     * @type {string}
     */
    this.scopes = scopes.join(" ");

    /**
     * @type {string}
     */
    this.redirectUri = redirectUri;

    /**
     * @type {AppleEventObject}
     */
    this.onSuccess = {
      before: undefined,
      after: undefined,
    };

    /**
     * @type {AppleEventObject}
     */
    this.onFailure = {
      before: undefined,
      after: undefined,
    };

    /**
     * @type {string[]}
     */
    this.styleList = [];

    /**
     * @type {undefined|function(event: Event)}
     */
    this.onInitialization = undefined;

    /**
     *
     * @type {undefined|function(Event)}
     */
    this.onEventFire = undefined;

    /**
     * @type {string|undefined}
     */
    this.locale = undefined;

    if(typeof locale === 'string') this.setLocale(locale);
  }

  init() {
    this.nonce = Date.now().toString();
    this.script = `yakalamac_apple_script_${this.nonce}`;
    this.button = `yakalamac_apple_button_${this.nonce}`;

    const button = document.createElement("div");
    button.id = "appleid-signin";
    button.setAttribute("data-id", this.button);
    button.setAttribute("data-border", "true");
    button.setAttribute("data-type", "sign in");


    if(typeof this.onEventFire === 'function'){
      button.addEventListener('click', this.onEventFire);
    }

    this.styleList = this.styleList
      .concat(button.className.split(" "))
      .map((style) => style.trim())
      .filter((style) => typeof style === "string" && style.length > 0);

    if (this.styleList.length > 0) button.className = this.styleList.join(" ");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = typeof this.locale === 'string' ? generateAppleBundleScriptSource(this.locale) : APPLE_BUNDLE_SCRIPT_SOURCE;
    script.id = this.script;
    script.onload = (event) => this.initializeApple(event);

    document.body.appendChild(button);
    document.head.appendChild(script);

    return this;
  }

  /**
   * @param {Event} event
   */
  initializeApple(event) {
    if (!window.AppleID) {
      this.thrower("AppleID is not defined");
    }
 
    const parent = document.querySelector(`div[data-id="${this.button}"]`);

    if (!parent instanceof HTMLElement) {
      this.thrower("Button was not found.");
    }

    if (typeof this.onInitialization === "function") {
      this.onInitialization(event);
    }

    try {
      /**
       * @var {AppleIDObject} AppleID
       */
      AppleID.auth.init({
        clientId: this.clientId,
        scope: this.scopes,
        redirectURI: this.redirectUri,
        nonce: this.nonce,
        usePopup: true,
      });

      document.addEventListener(APPLE_SIGN_ON_SUCCESS_EVENT, (event) =>
        event
          ? this.onEvent(event, this.onSuccess)
          : this.thrower("Invalid event type provided on success event.")
      );

      document.addEventListener(APPLE_SIGN_ON_FAILURE_EVENT, (event) =>
        event
          ? this.onEvent(event, this.onFailure)
          : this.thrower("Invalid event type provided on failure event.")
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {AppleEvent} event
   * @param {AppleEventObject|undefined} eventObject
   */
  onEvent(event, eventObject) {
    if (!event.isTrusted && false) {
      this.thrower("The returned response event is not trust current credentials or client");
    }

    if (eventObject && eventObject.before) {
      eventObject.before(event);
    }

    if (eventObject && eventObject.before) {
      eventObject.after(event);
    }
  }

  /**
   * @param {string} message
   */
  thrower(message) {
    throw new Error(message);
  }

  /**
   * @param {string} className
   * @returns {AppleIdentityProvider}
   */
  addStyle(className) {
    if (typeof className === "string" && className.trim().length > 0) {
      className = className.trim();
      const button = document.querySelector(`div[data-id="${this.button}"]`);
      if (button instanceof HTMLElement) {
        const classList = button.className.split(" ");
        if (!classList.includes(className)) classList.push(className);

        button.className = classList.join(" ");
        this.styleList = classList;
      }
    }

    return this;
  }

  /**
   *
   * @param {string} className
   * @returns {AppleIdentityProvider}
   */
  removeStyle(className) {
    if (typeof className === "string" && className.trim().length > 0) {
      className = className.trim();
      if (this.styleList.includes(className)) {
        this.styleList = this.styleList.filter((style) => style !== className);
        const button = this.getTarget();
        if (button instanceof HTMLElement) {
          button.className = this.styleList.join(" ");
        }
      }
    }

    return this;
  }

  /**
   * @returns {HTMLElement} element
   */
  getTarget() {
    return document.querySelector(`div[data-id="${this.button}"]`);
  }

  /**
   * * center-align: A center-aligned button. Both the logo and text are centered in the button. This is the default.
   *
   * * left-align: A left-aligned button with an adjustable logo size, logo position, and label position.
   *
   * * logo-only: A square button with a centered Apple logo and no text.
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setMode(value){
    return this.customizeButton('data-mode', value);
  }

  /**
   *
   * `Defaults`
   * * sign-in: The Sign in with Apple button. This is the default.
   *
   * * continue: The Continue with Apple button.
   *
   * * sign-up: The Sign-up with Apple button.
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setType(value){
    return this.customizeButton('data-type', value);
  }

  /**
   * @returns {string}
   */
  getType(){
    return this.getTarget().getAttribute('data-type');
  }

  /**
   * @values white-black (Default is black)
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setColor(value){
    return this.customizeButton('data-color', value);
  }

  /**
   *
   * @returns {string}
   */
  getColor(){
    return this.getTarget().getAttribute('data-color');
  }

  /**
   * DEFAULTS
   * * true: The button has a border. This is the default.
   *
   * * false: The button doesn’t have a border.
   *
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setBorder(value){
    return this.customizeButton('data-border', value);
  }

  /**
   *
   * @returns {string}
   */
  getBorder(){
    return this.getTarget().getAttribute('data-border');
  }

  /**
   * A number between 0—50. The default is 15.
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setRadius(value){
    return this.customizeButton('data-border-radius', value);
  }

  /**
   *
   * @returns {string}
   */
  getRadius(){
    return this.getTarget().getAttribute('data-border-radius');
  }

  /**
   * Points between 130 / -375 , %100 default to fit container size
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setWidth(value){
    return this.customizeButton('data-width', value);
  }

  /**
   *
   * @returns {string}
   */
  getWidth(){
    return this.getTarget().getAttribute('data-width');
  }

  /**
   * Points between 30—64, or 100% to fit the container size. The default is 100%.
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setHeight(value){
    return this.customizeButton('data-height', value);
  }

  /**
   *
   * @returns {string}
   */
  getHeight(){
    return this.getTarget().getAttribute('data-height');
  }

  /**
   * It's only work on left-align mode
   * @example appleIdentityProvider.setMode('left-aling').setLogo('small');
   * @values small, medium, large
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setLogo(value){
    return this.customizeButton('data-logo', value);
  }

  /**
   *
   * @returns {string}
   */
  getLogo(){
    return this.getTarget().getAttribute('data-logo');
  }

  /**
   * It's only work on left-align mode
   * Points between 0 and half the width of the button.
   * @defaultValue 0
   * @example appleIdentityProvider.setMode('left-align').setLogoPosition(10);
   * @param value
   * @returns {AppleIdentityProvider}
   */
  setLogoPosition(value){
    return this.customizeButton('data-logo-position', value);
  }

  getLogoPosition(){
    return this.getTarget().getAttribute('data-logo-position');
  }

  /**
   *
   * @param type
   * @param value
   * @returns {AppleIdentityProvider}
   */
  customizeButton(type, value){
    const target = this.getTarget();

    if(!target instanceof HTMLElement) {
      this.thrower('Ensure the provider was initialized...');
    }

    target.setAttribute(type, value);

    return this;
  }

  /**
   *
   * @param {function(Event)} callback
   */
  onEventFired(callback){
    if(typeof callback === 'function') {
      const target = this.getTarget();
      if(target instanceof HTMLElement) {
        target.addEventListener('click',this.onEventFire);
      }
    }
  }

  /**
   * @param {string|undefined} locale
   * @returns {AppleIdentityProvider}
   */
  setLocale(locale)
  {
    if(locale === undefined) {
      this.locale = undefined;

      return this;
    }

    if(typeof locale !== "string") {
      return this;
    }

    const founded = VALID_LOCALES
        .map(locale=> locale.toLowerCase())
        .findIndex(_locale => _locale === locale.toLowerCase());

    if(founded > -1 && founded < VALID_LOCALES.length) {
      this.locale = VALID_LOCALES[founded];

      return this;
    }

    this.thrower(`Provided locale is not valid: ${locale}`);
  }

  /**
   *
   * @returns {string|undefined}
   */
  getLocale(){
    return this.locale;
  }
}