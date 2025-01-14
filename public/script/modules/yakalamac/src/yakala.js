/**
 * @namespace YakalamacIdentityProvider
 * @class YakalamacIdentityProvider
 * @copyright LevelEnd Yazılım Bilişim Anonim Şirket
 */

import "./typedef.js";
import { AppleIdentityProvider } from "./provider/apple/index.js";
import { GoogleIdentityProvider } from "./provider/google/index.js";
import { FacebookIdentityProvider } from "./provider/facebook/index.js";
import {
  APPLICATION_YAKALA,
  APPLICATION_ADMIN,
  APPLICATION_BUSINESS,
} from "./constraint.js";

export class YakalamacIdentityProvider {
  /**
   *
   * @param {string|undefined} application
   */

  constructor(application)
  {

    /**
     * @type {URL}
     */
    this.url = new URL(document.URL);

    this.ensureClientIsRight();

    /**
     * @type {string|undefined}
     */
    this.application = undefined;

    if (application === undefined) {
      console.warn("Do not forget to set application id");
    } else {
      this.setApplication(application);
    }

    /**
     * @type {GoogleIdentityProvider|undefined}
     */
    this.google = undefined;

    /**
     * @type {AppleIdentityProvider|undefined}
     */
    this.apple = undefined;

    /**
     * @type {FacebookIdentityProvider|undefined}
     */
    this.facebook = undefined;

    /**
     * @type {[{tag: string, event: function}]}
     */
    this.eventQueue = [];

    /**
     * @type {boolean}
     */
    this.serverSide = false;

    /**
     * @type {undefined|string}
     */
    this.serverRedirectUri = undefined;
  }

  /**
   *
   * @param {boolean} use
   */
  setServerSide(use)
  {
    if(typeof use === 'boolean') {
      this.serverSide = use;
    }

    return this;
  }

  /**
   * @returns {boolean}
   */
  getServerSide(){
    return this.serverSide;
  }

  /**
   *
   * @param {string} uri
   * @returns {YakalamacIdentityProvider}
   */
  setServerSideRedirectUri(uri)
  {
    if(typeof uri !== 'string'){
      return this;
    }

    if(!uri.includes('http')) {
      const url = new URL(document.URL);
      uri = url.protocol + '//' + [url.host, uri]
          .map(part => part.startsWith('/') ? part.slice(1) : part)
          .join('/');
    }

    if(typeof this.csrf === 'object' && this.csrf.key && this.csrf.as === 'query' && this.csrf.token) {
        const queryBag = {};
        queryBag[this.csrf.key] = this.csrf.token;
        uri = this.withQuery(uri, queryBag);
    }

    if(URL.canParse( uri)) {
      this.serverRedirectUri = uri;

      if(this.google instanceof GoogleIdentityProvider) {
        this.google.setServerSideRedirectUri(uri);
      }

      return this.setServerSide(true);
    }

    return this;
  }

  /**
   *
   * @returns {string|undefined}
   */
  getServerSideRedirectUri(){
    return this.serverRedirectUri;
  }

  /**
   *
   * @param {GoogleIdentityProvider} google
   */
  setGoogleIdentityProvider(google) {
    this.google = google;

    return this;
  }

  /**
   *
   * @returns {GoogleIdentityProvider|undefined}
   */
  getGoogleIdentityProvider() {
    return this.google;
  }

  /**
   *
   * @param {string} googleClientId
   * @param {string} googleRedirectUri
   * @returns {YakalamacIdentityProvider}
   */

  createGoogleIdentityProvider(googleClientId, googleRedirectUri) {
    const gip = new GoogleIdentityProvider(googleClientId, googleRedirectUri);

    const headers = {};
    const body = {};

    if(typeof this.csrf === 'object' && this.csrf.key && this.csrf.token && this.csrf.as) {
      switch (this.csrf.as){
        case "header":
          headers[this.csrf.key] = this.csrf.token;
          break;
        case "body":
          body[this.csrf.key] = this.csrf.token;
            break;
      }
    }

    gip.fetchOps = (response) => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        ...headers
      },
      body: JSON.stringify({ application: this.application,
        providerType: 'google',
        ...response, ...body
      }),
    });

    gip.onSuccess = {
      before: (event) => this.runEvent("google.onSuccess", event),
      //after: event=>this.runEvent('google.onSuccess', event)
    };

    gip.onFailure = {
      before: (event) => this.runEvent("google.onFailure", event),
      //after: event=>console.log(event)
    };

    return this.setGoogleIdentityProvider(gip);
  }

  /**
   *
   * @param {function} callback
   */
  googleOnSuccess(callback) {
    return this.pushEvent("google.onSuccess", callback);
  }

  /**
   *
   * @param {function} callback
   */
  googleOnFailure(callback) {
    return this.pushEvent("google.onFailure", callback);
  }

  /**
   *
   * @param {AppleIdentityProvider | undefined} apple
   * @returns {YakalamacIdentityProvider}
   */
  setAppleIdentityProvider(apple) {
    this.apple = apple;

    return this;
  }

  /**
   * @returns {AppleIdentityProvider|undefined}
   */
  getAppleIdentityProvider() {
    return this.apple;
  }

  withQuery(currentUri, queryBag){
    let hasQueries = false;
    if(currentUri.includes('?')) {
      hasQueries = true;
    }
    const keys = Object.keys(queryBag);

    if(hasQueries) {
      keys.forEach(key => currentUri += '&' + key + '=' + queryBag[key]);
    } else {
      currentUri += '?';
      keys.forEach(key => currentUri += key + '=' + queryBag[key] + '&');
    }

    if(currentUri.endsWith('&')) {
      return currentUri.slice(0, currentUri.length);
    }
    return currentUri;
  }

  /**
   *
   * @param {string} appleClientId
   * @param {Array} scopes
   * @param {string} redirectUri
   * @returns {YakalamacIdentityProvider}
   */
  createAppleIdentityProvider(
    appleClientId,
    scopes = undefined,
    redirectUri = undefined
  ) {
    const aip = new AppleIdentityProvider(appleClientId, scopes, redirectUri);
    aip.onSuccess = {
      before: (event) => {

        const headers = {};
        const query = {};
        const body = {};

        if(typeof this.csrf === 'object') {
          if(this.csrf.token && this.csrf.as && this.csrf.key){
            switch (this.csrf.as){
              case 'header':
                headers[this.csrf.key] = this.csrf.token;
                break;
              case 'body':
                body[this.csrf.key] = this.csrf.token;
                break;
              case 'query':
                query[this.csrf.key] =  this.csrf.token;
                break;
            }
          }
        }

        const targetUri = this.serverSide && URL.canParse(this.serverRedirectUri) ? this.serverRedirectUri : aip.redirectUri;

        event.request = fetch(this.withQuery(targetUri, query),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                ...headers
              },
              body: JSON.stringify(
                {
                  scopes: aip.scopes,
                  redirectUri: aip.redirectUri,
                  appleClientId: aip.clientId,
                  auth: {
                    code: event.detail.authorization.code,
                    idToken: event.detail.authorization.id_token,
                  },
                  application: this.application,
                  providerType: 'apple',
                  ...body
              }),
          });
      },
      after: (event) => {
        if (event.request && event.request instanceof Promise) {
          return event.request
            .then((response) => {
              if (response.status > 199 && response.status < 300) {

                response
                  .text()
                  .then((text) => {
                    try {
                      const json = JSON.parse(text);
                      this.runEvent("apple.onSuccess", json);
                    } catch (jsonException) {
                      this.runEvent(
                        "apple.onSuccess.onException",
                        jsonException,
                        response,
                        text
                      );
                    }
                  })
                  .catch((e) =>
                    this.runEvent("apple.onSuccess.onException", e, response)
                  );
              } else {
                return this.runEvent("apple.onFailure", response);
              }
            })
            .catch((e) => this.runEvent("apple.onSuccess.onException", e));
        }

        return this.runEvent("apple.onSuccess", event);
      },
    };

    return this.setAppleIdentityProvider(aip);
  }

  /**
   * @returns {FacebookIdentityProvider|undefined}
   */
  getFacebookIdentityProvider() {
    return this.facebook;
  }

  /**
   * @param facebook
   * @returns {YakalamacIdentityProvider}
   */
  setFacebookIdentityProvider(facebook) {
    this.facebook = facebook;

    return this;
  }

  /**
   * @param {function} callback
   * @return {YakalamacIdentityProvider}
   */
  appleOnSuccess(callback) {
    return this.pushEvent("apple.onSuccess", callback);
  }

  /**
   * @param {function} callback
   * @return {YakalamacIdentityProvider}
   */
  appleOnFailure(callback) {
    return this.pushEvent("apple.onFailure", callback);
  }

  /**
   * @param {function} callback
   * @return {YakalamacIdentityProvider}
   */
  appleOnSuccessOnException(callback) {
    return this.pushEvent("apple.onSuccess.onException", callback);
  }

  /**
   * @param {function} callback
   * @return {YakalamacIdentityProvider}
   */
  appleOnFailureOnException(callback) {
    return this.pushEvent("apple.onFailure.onException", callback);
  }

  /**
   * @returns {YakalamacIdentityProvider}
   */
  createFacebookIdentityProvider() {
    const fip = new FacebookIdentityProvider();

    return this.setFacebookIdentityProvider(fip);
  }

  /**
   * @param {string} tag
   * @param {function} callback
   * @returns {YakalamacIdentityProvider}
   */
  pushEvent(tag, callback) {
    const event = this.eventQueue.find((event) => event.tag === tag);
    if (event) {
      event.event = callback;
    } else {
      this.eventQueue.push({
        tag: tag,
        event: callback,
      });
    }

    return this;
  }

  /**
   * @param tag
   * @returns {Function|boolean}
   */
  getEvent(tag) {
    const event = this.eventQueue.find((event) => event.tag === tag);

    if (!event) {
      return false;
    }

    if (!event.event || typeof event.event !== "function") {
      return false;
    }

    return event.event;
  }

  /**
   * @param tag
   * @param args
   */
  runEvent(tag, ...args) {
    const event = this.getEvent(tag);

    if (event) {
      return event(...args);
    }

    return event;
  }

  ensureClientIsRight() {
    if (this.url.protocol !== "https:") {
      throw new Error(
        "This package should be ran with https schema, your schema is " +
          this.url.protocol
      );
    }

    if (
      this.url.host !== "yaka.la" &&
      this.url.host !== "panel.yaka.la" &&
      this.url.host !== "api.yaka.la" &&
      this.url.host !== "stag-deep-internally.ngrok-free.app" &&
      !this.url.host.startsWith("localhost:")
    ) {
      throw new Error(
        "This package should be ran in allowed origins. \nAllowed origins: \n-> " +
          [
            "yaka.la",
            "panel.yaka.la",
            "api.yaka.la",
            "localhost:*",
            "stag-deep-internally.ngrok-free.app",
          ].join("\n-> ") +
          "\nBut your origin is `" +
          this.url.host +
          "`"
      );
    }

    console.info("YakalaIP is running right ↔↔");
  }

  /**
   * @param style
   * @returns {YakalamacIdentityProvider}
   */
  addGoogleStyle(style) {
    if (this.google && this.google instanceof GoogleIdentityProvider) {
      this.google.addStyle(style);
    }

    return this;
  }

  /**
   * @param style
   * @returns {YakalamacIdentityProvider}
   */
  removeGoogleStyle(style) {
    if (this.google && this.google instanceof GoogleIdentityProvider) {
      this.google.removeStyle(style);
    }

    return this;
  }

  /**
   * @param style
   * @returns {YakalamacIdentityProvider}
   */
  addAppleStyle(style) {
    if (this.apple && this.apple instanceof AppleIdentityProvider) {
      this.apple.addStyle(style);
    }

    return this;
  }

  /**
   * @param style
   * @returns {YakalamacIdentityProvider}
   */
  removeAppleStyle(style) {
    if (this.apple && this.apple instanceof AppleIdentityProvider) {
      this.apple.removeStyle(style);
    }

    return this;
  }

  forceToReplaceGoogle(element) {
    if (this.google instanceof GoogleIdentityProvider) {
      this.replace(this.google.getTarget(), element);
    }

    return this;
  }

  forceToReplaceApple(element) {
    if (this.apple instanceof AppleIdentityProvider) {
      this.replace(this.apple.getTarget(), element);
    }

    return this;
  }

  /**
   * @param {HTMLElement} element
   * @param {HTMLElement} parent
   * @return {YakalamacIdentityProvider}
   */
  replace(element, parent) {
    if (element instanceof HTMLElement && parent instanceof HTMLElement) {
      element.parentElement.removeChild(element);
      parent.appendChild(element);
    }

    return this;
  }

  /**
   * @param {string} application
   * @returns {YakalamacIdentityProvider}
   */
  setApplication(application) {
    if (
      ![APPLICATION_BUSINESS, APPLICATION_YAKALA, APPLICATION_ADMIN].includes(
        application
      )
    ) {
      throw new Error("Invalid application type assignment.");
    }

    this.application = application;

    return this;
  }

  /**
   *
   * @param {{token: string, as: 'header'|'body'|'query', key: string}} csrf
   * @returns {YakalamacIdentityProvider}
   */
  useCsrf(csrf) {
    this.csrf = csrf;
    this.setServerSideRedirectUri(this.getServerSideRedirectUri());
    return this;
  }
}
