import "./typedef.js";
import { GOOGLE_SCRIPT_SOURCE } from "./constraint.js";

export class GoogleIdentityProvider {
  /**
   * @param {string} googleClientId
   * @param {string} googleRedirectUri
   */
  constructor(googleClientId, googleRedirectUri) {
    /**
     * @type {string}
     */
    this.nonce = undefined;

    /**
     * @type {undefined|string}
     */
    this.button = undefined;

    /**
     * @type {undefined|string}
     */
    this.meta = undefined;

    /**
     * @type {undefined|string}
     */
    this.script = undefined;

    /**
     * @type {undefined|string}
     */
    this.googleClientId = googleClientId;

    /**
     * @type {undefined|string}
     */
    this.googleRedirectUri = googleRedirectUri;

    /**
     * @type {GoogleEventObject}
     */
    this.onSuccess = {
      before: undefined,
      after: undefined,
    };

    /**
     * @type {GoogleEventObject}
     */
    this.onFailure = {
      before: undefined,
      after: undefined,
    };

    /**
     * @type {undefined|function(event: Event)}
     */
    this.onInitialization = undefined;

    /**
     *
     * @type {(function({credential: string, select_by: string}):RequestInit)|undefined}
     */
    this.fetchOps = undefined;

    /**
     * @type {string[]}
     */
    this.styleList = [];

      /**
       *
       * @type {{theme: string, size: string, shape: string, text: string, color: string, type: string}}
       * @see https://developers.google.com/identity/branding-guidelines
       */
    this.renderOps = {
       theme: 'filled_blue', //'filled_blue', Light, Neutral, Dark
       size: 'large',
       shape: 'pill', //'rectangular',
      // text: 'Google ile giriş yap',
       color: '#131314',
       type: 'icon', // button,
      width: 100,
      height: 100

    };

    /**
     *
     * @type {undefined|string}
     */
    this.serverSideRedirectUri = undefined;
  }

  /**
   *
   * @param {string} uri
   * @return {GoogleIdentityProvider}
   */
  setServerSideRedirectUri(uri){
    if(typeof uri === 'string' && URL.canParse(uri))
      this.serverSideRedirectUri = uri;

    return this;
  }

  /**
   * @returns {string|undefined}
   */
  getServerSideRedirectUri(){
    return this.serverSideRedirectUri;
  }

  init() {
    if (typeof this.onInitialization === "function") {
      this.onInitialization();
    }

    if ("FederatedCredential" in window) {
      console.info("FedCM is supported and enabled in this browser.");
    } else {
      console.info("FedCM is not supported or disabled in this browser.");
    }

    this.nonce = Date.now().toString();
    this.button = `yakalamac_google_identity_provider_button${this.nonce}`;
    this.meta = `yakalamac_google_identity_provider_meta_${this.nonce}`;
    this.script = `yakalamac_google_identity_provider_script_${this.nonce}`;

    const tokenElement = document.createElement("meta");

    tokenElement.httpEquiv = "origin-trial";

    tokenElement.content = this.googleClientId;

    document.head.appendChild(tokenElement);

    const button = document.createElement("div");

    button.id = this.button;
    this.styleList = this.styleList
      .concat(button.className.split(" "))
      .map((style) => style.trim())
      .filter((style) => typeof style === "string" && style.length > 0);

    if (this.styleList.length > 0) button.className = this.styleList.join(" ");

    const script = document.createElement("script");

    script.id = this.script;
    script.src = GOOGLE_SCRIPT_SOURCE.GSI_CLIENT;
    script.async = true;
    script.defer = true;
    script.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    script.onload = (event) => this.initializeGoogleSignIn(event, this);

    document.body.appendChild(button);
    document.head.appendChild(script);

    return this;
  }

  /**
   * @param event
   */
  initializeGoogleSignIn(event) {

    if (!event.isTrusted) {
      this.thrower("Event was not trusted.");
    }

    /**
     * @type {GoogleAccountID|*}
     */
    const google = window.google;
    const self = this;

    const checkGoogleScriptLoaded = () => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: self.googleClientId,
          auto_select: true,
          callback: (response) => self.handleCredentialResponse(response, self.serverSideRedirectUri ?? self.googleRedirectUri),
          nonce: self.nonce,
          login_uri: self.googleRedirectUri,
        });

        const parent = document.getElementById(self.button);
        if (parent === null) {
          self.thrower("Parent button was not found");
        }
        self.renderAgain();
        parent.addEventListener("click", () => google.accounts.id.prompt());
      } else {
        // Retry after a small delay if Google script is not yet loaded
        setTimeout(checkGoogleScriptLoaded, 100);
      }
    };

    checkGoogleScriptLoaded();

  }

  /**
   *
   * @param {{credential: string, select_by: string}} response
   * @param {string} redirectUri
   */
  handleCredentialResponse(response, redirectUri) {
    const itself = this;

    const handleOnSuccess = function (successResponse) {

      if(successResponse.redirected) {
        const promise = new Promise((resolve, reject)=>{
          try{
            const response = {
              json: { redirected: successResponse.url },
              status: successResponse.status,
            };

            if (itself.onSuccess.before) {
              itself.onSuccess.before(response);
            }

            if (itself.onSuccess.after) {
              itself.onSuccess.after(response);
            }
            resolve(true);
          }catch (e){
            reject(e);
          }

        }).then(()=>{
          if(window.location.href !== successResponse.url) {
            window.location.href = successResponse.url;
          }
        });

        return Promise.all([promise]);
      }

      successResponse
        .text()
        .then((text) => {
          try {
            if (typeof text === "string") {
              const json = JSON.parse(text);
              const response = {
                json: json,
                status: successResponse.status,
              };

              if (itself.onSuccess.before) {
                itself.onSuccess.before(response);
              }

              if (itself.onSuccess.after) {
                itself.onSuccess.after(response);
              }
            } else {
              console.warn("No text provided on success");
            }
          } catch (error) {
            if (itself.onSuccess.before) {
              itself.onSuccess.before(error, text);
            }

            if (itself.onSuccess.after) {
              itself.onSuccess.after(error, text);
            }
          }
        })
        .catch((e) => {
          if (itself.onSuccess.before) {
            itself.onSuccess.before(e, successResponse);
          }

          if (itself.onSuccess.after) {
            itself.onSuccess.after(e, successResponse);
          }
        });
    };

    const handleOnError = function (errorResponse) {
      errorResponse.text().then((text) => {
        try {
          if (typeof text === "string") {
            const json = JSON.parse(text);
            if (itself.onFailure.before) {
              itself.onFailure.before(json);
            }

            if (itself.onFailure.after) {
              itself.onFailure.after(json);
            }
          } else {
            if (itself.onFailure.before) {
              itself.onFailure.before(text);
            }

            if (itself.onFailure.after) {
              itself.onFailure.after(text);
            }
          }
        } catch (error) {
          if (itself.onFailure.before) {
            itself.onFailure.before(error, errorResponse);
          }

          if (itself.onFailure.after) {
            itself.onFailure.after(error, errorResponse);
          }
        }
      });
    };

    const handleOnFailure = handleOnError;

    fetch(
      redirectUri,
      this.fetchOps
        ? this.fetchOps(response)
        : this.thrower("Invalid request fetch ops provided.")
    )
      .then((response) => {
        if (response.status === 500) {
          handleOnError(response);
        } else if (response.ok) {
          handleOnSuccess(response);
        } else {
          handleOnFailure(response);
        }
      })
      .catch((error) => {
        handleOnError(error);
      });
  }

  /**
   * @param {string} message
   */
  thrower(message) {
    if (typeof message === "string") {
      throw new Error(message);
    } else {
      throw new Error(
        "Thrower callable method argument must be type of string."
      );
    }
  }

  /**
   * @param {string} className
   */
  addStyle(className) {
    if (typeof className === "string" && className.trim().length > 0) {
      className = className.trim();
      const button = document.getElementById(this.button);
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
   * @param {string} className
   *
   */
  removeStyle(className) {
    if (typeof className === "string" && className.trim().length > 0) {
      className = className.trim();
      if (this.styleList.includes(className)) {
        this.styleList = this.styleList.filter((style) => style !== className);
        const button = document.getElementById(this.button);
        if (button instanceof HTMLElement) {
          button.className = this.styleList.join(" ");
        }
      }
    }

    return this;
  }

  /**
   * @returns {HTMLElement}
   */
  getTarget() {
    return document.getElementById(this.button);
  }

  /**
   * @param type
   * @returns {GoogleIdentityProvider}
   */
  setType(type){
    this.renderOps.type =  type;

    return this.renderAgain();
  }

    /**
     * @param color
     * @returns {GoogleIdentityProvider}
     */
    setColor(color){
        this.renderOps.color =  color;

        return this.renderAgain();
    }

    /**
     * @param theme
     * @returns {GoogleIdentityProvider}
     */
    setTheme(theme){
        this.renderOps.type =  theme;

        return this.renderAgain();
    }

    /**
     * @param size
     * @returns {GoogleIdentityProvider}
     */
    setSize(size){
        this.renderOps.size =  size;

        return this.renderAgain();
    }

    /**
     * @param shape
     * @returns {GoogleIdentityProvider}
     */
    setShape(shape){
        this.renderOps.shape = shape;

        return this.renderAgain();
    }

    /**
     *
     * @param text
     * @returns {GoogleIdentityProvider}
     */
    setText(text){
        this.renderOps.text = text;

        return this.renderAgain();
    }

  renderAgain(){
    const parent = this.getTarget();
    if(parent instanceof HTMLElement && window.google && window.google.accounts && window.google.accounts.id && window.google.accounts.id.renderButton)
      window.google.accounts.id.renderButton(parent, this.renderOps);

    return this;
  }
}
