if(!window.$) throw new Error('Jquery was not found.');

/**
 * @param {string} selector
 * @param {string} uri
 * @param {object} data
 * @param {string[]} accept
 * @param {{modal:string, listener: string}} modalObject
 * @constructor
 */
export const FancyFileUploadAutoInit = function (selector, uri, data = undefined, accept = undefined, modalObject = undefined)
{
    const settings = {
        url: uri,
        edit: true,
        retries: 2,
        maxfilesize: 10000000
    };

    if(accept !== undefined) {
        if(!Array.isArray(accept)) throw new Error('Accepted extensions must be array');
        settings.accept = accept;
    }

    if(data !== undefined) {
        if(typeof data !== "object") throw new Error('Data must be typeof object');
        settings.param = data;
    }

    $(selector).FancyFileUpload(settings);

    if(typeof modalObject === 'object') {
        if(!modalObject.hasOwnProperty('listener')) throw new Error('No listener exists');
        if(!modalObject.hasOwnProperty('modal')) throw new Error('Modal selector no exists');
        $(modalObject.listener).on('click', () => $(modalObject.modal).modal('show'));
    }

    return this;
}