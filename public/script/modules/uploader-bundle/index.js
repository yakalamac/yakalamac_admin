if(!window.$) throw new Error('Jquery was not found.');

/**
 * @param {string} selector
 * @param {string} uri
 * @param {object} data
 * @param {string[]} accept
 * @param {{modal:string, listener: string, inputs: []|undefined}} modalObject
 * @constructor
 */
export const FancyFileUploadAutoInit = function (selector, uri, data = undefined, accept = undefined, modalObject = undefined)
{
    const settings = {
        url: uri,
        edit: true,
        retries: 0,
        maxfilesize: 50000000,
        added: function (e, data) {

            const $row = $(data.context);
            const container = $('<div>');
            $row.find('.ff_fileupload_summary .ff_fileupload_filename').css('max-width', '300px');
            if(data.files.reduce((ac, current)=> ac && (current.size > settings.maxfilesize),true)) {
                console.error('Max file size exceeded');
                return;
            }

            container.addClass('container');
            container.append('<div class="w-100"><input class="w-100" type="text" name="title" placeholder="Başlık"></div>');
            container.append('<div class="w-100"><input class="w-100" type="text" name="altTag" placeholder="Alt Etiketi"></div>')
            $row.find('.ff_fileupload_summary').append(container);
            $row.find('.ff_fileupload_summary .ff_fileupload_filename').appendTo(container);
            if(Array.isArray(modalObject.inputs)) {
                modalObject.inputs.forEach(input=> {
                    const c = $('<div>').addClass('w-100');
                    $(input).addClass('w-100').appendTo(c);
                    container.append(c);
                });
            }
        },
        startupload: function (SubmitUpload, e, data){
            const form = data.form[0];
            $(form).find('input').each((index, element)=>{
                if(element.name === 'files') {
                    return;
                }
                console.log(element)
                if(settings.params && settings.params[element.name] && typeof settings.params[element.name] === 'function') {
                    console.log(settings.params[element.name]);
                    const current = settings.params[element.name];
                    element.value = current(data.context.find('.ff_fileupload_summary .container'));
                }
            });
            // todo do not forget submitting upload
            SubmitUpload();
        },
        uploadcompleted : function(e, data) {
            if(data.textStatus === 'success') {
                data.ff_info.RemoveFile();
            } else if(typeof window.toastr === 'object' && typeof window.toastr.warning === 'function') {
                window.toastr.warning('Medya yüklemesi sırasında bir hata oluştu');
            }
        },
        langmap: {
            'The upload failed.': 'Yüklenmedi, bilinmeyen bir hata oluştu.',
            'File is too large.  Maximum file size is {0}.' : 'Dosya boyutu çok büyük. Maksimum dosya boyutu {0}',
            'Remove from list': 'Listeden kaldır.',
            'Cancel upload and remove from list' : 'Yüklemeyi iptal et ve listeden kaldır.'
        },
        uploadcancelled: function (ff_info, e, data) {
           if(e.errorThrown === 'abort') {
               console.warn('Aborted');
               return;
           }

           if(typeof window.toastr === 'object') {
               window.toastr.error('Fotoğraf yüklenirken bir sorun oluştu.');
           }
           console.warn(e.jqXHR.status);
           console.warn(e.jqXHR.responseText);
        }
    };

    if(accept !== undefined) {
        if(!Array.isArray(accept)) throw new Error('Accepted extensions must be array');
        settings.accept = accept;
    }

    if(data !== undefined) {
        if(typeof data !== "object") throw new Error('Data must be typeof object');
        settings.params = data;
    }

    $(selector).FancyFileUpload(settings);

    if(typeof modalObject === 'object') {
        if(!modalObject.hasOwnProperty('listener')) throw new Error('No listener exists');
        if(!modalObject.hasOwnProperty('modal')) throw new Error('Modal selector no exists');
        $(modalObject.listener).on('click', () => $(modalObject.modal).modal('show'));

        $(modalObject.modal).find('#fancy_file_upload_save_all_button').on('click', ()=>{
            $(modalObject.modal).find('.ff_fileupload_actions button.ff_fileupload_start_upload').click();
        });

        $(modalObject.modal).find('#fancy_file_upload_remove_all_button').on('click', ()=>{
            $(modalObject.modal).find('.ff_fileupload_actions button.ff_fileupload_remove_file').click();
        });
    }

    return this;
}