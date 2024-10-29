/**
 *
 * @param {string} modalId
 * @param {function} modal
 * @param {function} onSave
 * @param {function} onClose
 */
export const control = function (modalId, modal, onSave, onClose = undefined)
{
    if(typeof modalId === 'string' && modalId.trim().length > 0)
    {
        let foundedModal = $(`#${modalId}`);

        if(foundedModal.length === 0 && typeof modal === 'function')
        {
            foundedModal = $(modal(modalId));

            if(typeof onSave === 'function')
                foundedModal
                    .find(`button#${modalId}-button-submit`)
                    .on(
                        'click',
                        event=>{
                            event.preventDefault();
                            if(onSave) onSave(event);
                        }
                    );

            if(typeof onClose === 'function')
                foundedModal
                    .find(`button#${modalId}-button-close`)
                    .on(
                        'click',
                        event=>{
                            event.preventDefault();
                            if(onClose) onClose(event);
                        }
                    );

            foundedModal.modal('show');
        }
        else
            foundedModal.modal('show');
    }
}