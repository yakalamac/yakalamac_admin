/**
 * @var {jQuery} $
 * @method val
 */

/**
 * @typedef AjaxEvents
 * @prop {Function|undefined} success
 * @prop {string|undefined} successMessage
 * @prop {Function|undefined} failure
 * @prop {string|undefined} failureMessage
 * @prop {Function|undefined} error
 * @prop {string|undefined} errorMessage
 */

/**
 * @param config
 * @param {AjaxEvents} events
 */
function ApiRequest(config, events) {
    this.config = config;
    this.events = events;
}

ApiRequest.prototype.send = function () {
    const $this = this;
    $.ajax({
        ...this.config,
        success: (successResponse)=>{
            if(window.toastr) {
                toastr.success($this.events.successMessage ?? 'Başarılı.');
            }
            if(typeof $this.events.success === 'function') {
                $this.events.success(successResponse);
            }
        },
        error: (errorResponse)=>{console.log(errorResponse)
            if(window.toastr) {
                toastr.error($this.events.errorMessage ?? 'Bir hata oluştu.');
            }
            if(typeof this.events.error === 'function') {
                $this.events.error(errorResponse);
            }
        },
        failure: (failureResponse)=>{console.log(failureResponse)
            if(window.toastr) {
                toastr.error($this.events.failureMessage ?? 'Başarısız.');
            }
            if(typeof $this.events.failure === 'function') {
                $this.events.failure(failureResponse);
            }
        }
    });
}

/**
 * @param {string} uri
 * @param {{data: any, format: string}} request
 * @param {AjaxEvents} events
 */
export function apiPost(uri, request, events = {})
{
    if(request === undefined) return;

    const extraAttributes = {};

    if(request.data instanceof FormData) {
        extraAttributes.processData = false;
        extraAttributes.contentType = false;
    }

    if(request.format.includes('json')) {
        request.data = JSON.stringify(request.data);
    }

    new ApiRequest({
        type: 'POST',
        url: uri,
        data: request.data,
        contentType: request.format,
        ...extraAttributes
    }, events).send();
}


/**
 * @param {string} uri
 * @param {AjaxEvents} events
 */
export function apiDelete(uri, events = {})
{
    new ApiRequest({
        type: 'DELETE',
        url: uri,
    }, events).send();
}

/**
 * @param {string} uri
 * @param {AjaxEvents} events
 */
export function apiGet(uri, events = {})
{
    new ApiRequest({
        type: 'GET',
        url: uri,
    }, events).send();
}

/**
 * @param {string} uri
 * @param {any} data
 * @param {AjaxEvents} events
 */
export function apiPatch(uri,data, events = {})
{
    if(data === undefined) return;
    new ApiRequest({
        type: 'PATCH',
        url: uri,
        data: JSON.stringify(data),
        contentType: 'application/merge-patch+json',
        headers: {'Content-Type' : 'application/merge-patch+json'}
    }, events).send();
}

/**
 * @param {string} uri
 * @param {{data: any, format: string}} request
 * @param {AjaxEvents} events
 */
export function apiPut(uri,request, events = {})
{
    if(request === undefined) return;

    new ApiRequest({
        type: 'PUT',
        url: uri,
        data: request.data,
        contentType: request.format
    }, events).send();
}
