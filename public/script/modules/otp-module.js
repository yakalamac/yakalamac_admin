/**
 *
 * @param options
 * @returns {HTMLElement}
 * @constructor
 * @method draw
 * @method timeToDateString
 * @method start
 */
HTMLElement.prototype.Timer = function Timer(options = {}) {
    const defaultOptions = {
        time: 180,
        now: 0,
        onEnd: undefined,
        onEvent: undefined,
        inverse: false,
        ...options,
    };
    const div = document.createElement("div");
    div.classList.add("progress");
    div.style.height = "7px";
    const bar = document.createElement("div");
    bar.classList.value =  "progress-bar progress-bar-striped progress-bar-animated";
    bar.role = "progressbar";
    bar.setAttribute("aria-valuenow", '0');
    bar.setAttribute("aria-valuemax", '100');
    bar.setAttribute("aria-valuemin", '0');
    bar.style.width = "0%";
    div.append(bar);
    this.append(div);

    this.timeToDateString = () => {
        const minutes = Math.floor(defaultOptions.now / 60);
        const seconds = defaultOptions.now % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
    this.draw = function () {
        bar.style.width = `${
            (100 * defaultOptions.now) / defaultOptions.time
        }%`;
        bar.setAttribute("aria-valuenow", defaultOptions.now);
        if (typeof defaultOptions.onEvent === "function") {
            defaultOptions.onEvent({
                element: this,
                timeElapsed: defaultOptions.now,
                text: this.timeToDateString(),
            });
        }
    };
    this.start = function () {
        const context = this;
        defaultOptions.now = defaultOptions.inverse
            ? defaultOptions.time
            : 0;
        context.draw();
        const interval = setInterval(() => {
            if (
                (defaultOptions.inverse === false &&
                    defaultOptions.now < defaultOptions.time) ||
                (defaultOptions.inverse && defaultOptions.now > 0)
            ) {
                if (defaultOptions.inverse) defaultOptions.now--;
                else defaultOptions.now++;
                context.draw();
            } else {
                clearInterval(interval);
                if (typeof defaultOptions.onEnd === "function") {
                    defaultOptions.onEnd({
                        element: context,
                        timeElapsed: defaultOptions.now,
                        text: context.timeToDateString(),
                    });
                }
            }
        }, 1000);
    };
    return this;
};


HTMLElement.prototype.DigitHandler = function DigitHandler(options = {}) {
    const defaultOptions = {
        nonce: Date.now().toString(),
        clicked: false,
        digitLength: 6,
        currentValue: '',
        ...options
    };

    let template = '';
    for (let i = 0; i < defaultOptions.digitLength; i++)
        template += `<input type="text" data-digit="${i + 1}" class="form-control otp-input text-center ${defaultOptions.nonce}" autofocus="" maxlength="1">`;

    this.innerHTML = template;

    this.addEventListener("input", (event) => {
        console.log(event)
        event.preventDefault();
        if (event.target.classList.contains(defaultOptions.nonce)) {
            if (defaultOptions.clicked) {
                event.target.value = '';
                return;
            } else defaultOptions.clicked = true;
            /**
             * @type {HTMLCollection}
             **/
            const children = event.target.parentElement.children;
            const focused = {
                current: undefined,
                next: undefined,
                event: event.target,
            };

            for (const field of children) {
                // Identify the current and next focusable fields
                if (field === focused.event) {
                    focused.current = field;
                } else if (!field.value && focused.current) {
                    focused.next = field;
                    break; // Stop at the first empty input after the current
                }
            }

            // Automatically move focus
            if (focused.next) {
                focused.next.focus();
            } else if (focused.current) {
                focused.current.focus();
            }
            defaultOptions.currentValue = Array.from(this.querySelectorAll(`input.${defaultOptions.nonce}`)).map(input => input.value).join('');

        }
    });

    this.addEventListener('keyup', () => defaultOptions.clicked = false);

    this.getDigits = () => {
        return defaultOptions.currentValue;
    };
    return this;
};

/**
 * @param {{targetNumber: string, onResend: function, onSubmit: function, attachment: 'add'|'assign'}} options
 **/
HTMLElement.prototype.OTPModule = function OTPModule(options = {}) {
    const nonce = `otp-${Date.now()}`;
    const defaultOptions = {
        targetNumber: undefined,
        onResend: () => undefined,
        onSubmit: () => undefined,
        attachment: "add",
        inverse: false,
        ...options,
    };

    const thrower = (message) => {
        throw new Error(message);
    };
    const html = `<div class="mobile-phone-verification d-flex justify-content-center align-items-center container">
                            <div class="card rounded-4">
                                <div class="card-header text-center" data-otp-section="header-${nonce}">
                                    <h5 class="m-0">6 Haneli Doğrulama Kodunu Girin</h5>
                                    <div class="mobile-text">
                                    ${
                                        typeof defaultOptions.targetNumber === "string"
                                        ? `<u><b>${defaultOptions.targetNumber}</b></u>
                                           <span>numaralı telefonunuza gönderilen 6 haneli kodu girin.</span>`
                                        : thrower("Invalid target number provided.")
                                    }
                                    </div>
                                </div>
                                <div class="card-body d-flex flex-row m-auto mt-5 col gap-2" id="digit-box" data-otp-section="body-${nonce}"></div>
                                <div class="card-footer text-center mt-5 col" data-otp-section="footer-${nonce}">
                                    <div class="timer col" id="timer">

                                    </div>
                                    <div class="resend col">
                                        <div id="resend">
                                            <span class="d-block mobile-text text-danger">Doğrulama Kodunu Almadınız mı?</span>
                                            <span class="font-weight-bold text-success cursor-pointer" id="button-resend">Yeniden Gönder</span>
                                        </div>
                                    </div>
                                    <div class="col m-3" id="verify">
                                        <button type="button" class="btn btn-outline-success px-5" id="button-verify">Doğrula</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

    if (defaultOptions.attachment === "add") {
        this.innerHTML +=  html;
    } else if (defaultOptions.attachment === "assign") {
        this.innerHTML = html;
    } else {
        throw new Error("Invalid attachment type");
    }

    const timer = this.querySelector("#timer");
    const timeText = document.createElement("span");
    timer.appendChild(timeText);

    const resendBlock = this.querySelector("#resend");
    const verifyButton = this.querySelector("#verify");
    const buttonResend = this.querySelector("#button-resend");
    buttonResend.isClicked = false
    resendBlock.hidden = true;
    verifyButton.hidden = false;


    timer
        .Timer({
            onEvent: ({text}) => (timeText.textContent = text),
            inverse: defaultOptions.inverse,
            time: 30,
            onEnd: ({element}) => {
                element.hidden = true;
                element.ariaHidden = true;
                verifyButton.hidden = true;
                resendBlock.hidden = false;
            },
        })
        .start();

    async function resendEvent(event) {
        if (buttonResend.isClicked === false) {
            if (typeof defaultOptions.onResend === 'function') {
                await defaultOptions.onResend(event);
            }

            timer.hidden = false;
            verifyButton.hidden = false;
            buttonResend.isClicked = true;
            timer.start();
            buttonResend.textContent = "Yeniden gönder";
            buttonResend.style.pointer = "none";
            buttonResend.classList.remove("text-success");
            buttonResend.classList.add("text-dark");
            buttonResend.removeEventListener("click", resendEvent);

        }
    }

    buttonResend.addEventListener("click",resendEvent);

    const digitBox = this.querySelector("#digit-box");
    digitBox.DigitHandler({nonce: nonce, digitLength: 6});

    if (typeof defaultOptions.onSubmit === 'function') {
        verifyButton.addEventListener('click', (event) => {
            const digits = digitBox.getDigits();

            if (typeof digits === 'string' && digits.length === 6) {
                defaultOptions.onSubmit({event: event, digits: digits});
            }
        });
    }


    this.getHeader = function (){
          return this.querySelector(`div[data-otp-section="header-${nonce}"]`);
    };

    this.getBody = function (){
        return this.querySelector(`div[data-otp-section="body-${nonce}"]`);
    };

    this.getFooter = function (){
        return this.querySelector(`div[data-otp-section="footer-${nonce}"]`);
    };

    return this;
};