import {photoBulkUploadModal} from '../../../util/modal.js';

/**
 * Copyright (c) 2024 Yakalamaç Project of LevelEnd Yazılım Bilişim A.Ş
 *
 * Licensed under the MIT License.
 * You may obtain a copy of the License at:
 *
 * https://opensource.org/licenses/MIT
 *
 * @author Onur Kudret
 * @version 1.0.0
 *
 * @class BulkImageUploader
 * @description Class to handle bulk image file uploads with support for validation, progress, and error handling.
 *
 * @description
 *  The `BulkImageUploader` class allows for bulk image file uploads with support for
 *  file validation (PNG, JPG, JPEG), progress tracking, error handling, and custom events
 *  during the upload process.
 *
 * @example
 * const uploader = new BulkImageUploader('#file-upload-input', {
 *     event: 'uploadFiles',  // Custom event name for triggering the upload process
 *     onEvent: (files) => {  // Callback function triggered when the upload starts
 *         console.log('Upload started for these files:', files);
 *     }
 * });
 * // Initializes the uploader
 * uploader.init();
 * // Starts the upload process for all files
 * uploader.uploadAllFiles();
 *
 * @copyright 2024 Yakalamaç Project of LevelEnd Yazılım Bilişim A.Ş
 * @classDesc This class handles bulk image uploads with file validation, progress tracking,
 * error handling, and supports custom event triggers during the upload process.
 * It simplifies image uploads in web applications by handling file validation,
 * progress tracking, and server communication
 *
 * @requires jQuery
 * @requires FancyFileUpload
 */
export default class BulkImageUploader
{
    /**
     * @param {string} selector
     * @param {{event: string, onEvent: function}} options
     */
    constructor(selector = undefined, options = {event : 'click', onEvent : undefined})
    {
        this.initialized = false;
        this.selector = selector;
        this.options = options;
        this.target = undefined;
        this.modalNonceId = undefined;
        this.modalStructure = undefined;
        this.imageUploadify = undefined;
        this.isImageUploadifyBuilded = false;
        this.imageUploadifyEvents = {
            onStartUpload : undefined
        };
        this.fancyFileUpload = undefined;
        this.isFancyFileUploadBuilded = false;
        this.fancyFileUploadEvents = {
            onStartUpload : undefined,
            onContinueUpload : undefined,
            onCompletedUpload : undefined
        };
    }

    /**
     * Returns boolean if instance is initialized
     * @returns {boolean}
     */
    isInitialized()
    {
        return this.initialized;
    }

    /**
     * Initializes the BulkImageUploader with the given selector and options.
     * Sets up the event listeners for file selection and triggers the custom event.
     * @returns {BulkImageUploader}
     */
    init()
    {
        if (this.isInitialized()) {
            console.warn("BulkImageUploader already initialized.");
            return this;
        }

        this.target = document.querySelector(this.selector);

        if(!(this.target instanceof HTMLElement))
        {
            this.target = undefined;
            throw new Error('Invalid selector provided');
        }

        if(!(typeof this.options === 'object'))
        {
            this.options = {event : 'click', onEvent : undefined};
            throw new Error('Invalid options provided');
        }

        if(!(this.options.event && typeof this.options.event === 'string'))
        {
            this.options.event = 'click';
            throw new Error('Invalid event type provided');
        }

        if(!(this.options.onEvent && typeof this.options.onEvent === 'function'))
        {
            this.options.onEvent = undefined;
            throw new Error('Invalid event handler provided');
        }

        this.initialized = true;

        return this
    }


    /**
     * Builds html structure
     * @returns {BulkImageUploader}
     */
    buildHTML(){

        if(!(this.modalStructure && document.querySelector(`#${this.modalNonceId}`)))
        {
            this.modalStructure = $(photoBulkUploadModal(this.modalNonceId));
            $('body').append(this.modalStructure);
            this.isImageUploadifyBuilded = false;
            this.isFancyFileUploadBuilded = false;
        }

        return this;
    }

    /**
     * Shows modal
     * @returns {BulkImageUploader}
     */
    show(){
        this.modalStructure.modal('show');

        return this;
    }

    /**
     * Hides modal
     * @returns {BulkImageUploader}
     */
    hide(){
        this.modalStructure.modal('hide');

        return this;
    }

    /**
     * Builds image uploadify as an object module
     * @returns {BulkImageUploader}
     */
    buildImageUploadify()
    {
        if(!(this.isImageUploadifyBuilded && this.imageUploadify))
        {
            this.imageUploadify = {
                isInitializedBool : false,
                isInitialized : ()=>this.imageUploadify.isInitializedBool,
                setAsInitialized : ()=>this.imageUploadify.isInitializedBool = true,
                setAsNotInitialized : ()=>this.imageUploadify.isInitializedBool = false,
                isRunningBool : false,
                isRunning : ()=>this.imageUploadify.isRunningBool,
                setAsRunning : ()=>this.imageUploadify.isRunningBool = true,
                setAsNotRunning : ()=>this.imageUploadify.isRunningBool = false,
                id : undefined,
                init: ()=>{
                    if(!this.imageUploadify.isInitialized())
                    {
                        this.imageUploadify.id = `image_uploadify_${this.modalNonceId}`;

                        this.imageUploadify.setAsInitialized();
                    }
                },
                run : ()=>{
                    /*  && this.modalStructure && document.querySelector(`#${this.modalNonceId}` */
                    if(this.imageUploadify.isInitialized() && !this.imageUploadify.isRunning())
                    {
                        $(`#${this.imageUploadify.id}`).imageuploadify();

                        this.imageUploadify.setAsRunning();
                    }
                }
            };

            this.isImageUploadifyBuilded = true;
        }

        return this;
    }

    /**
     * Initializes image uploadify
     * @returns {BulkImageUploader}
     */
    initImageUploadify()
    {
        if(this.isImageUploadifyBuilded)
            this.imageUploadify.init();

        return this;
    }

    /**
     * Runs image uploadify if it initialized and is not running
     * @returns {BulkImageUploader}
     */
    runImageUploadify()
    {
        if(this.isImageUploadifyBuilded)
            this.imageUploadify.run();

        return this;
    }

    /**
     * Builds fancy file upload as an object module
     * @returns {BulkImageUploader}
     */
    buildFancyFileUpload()
    {
        if(!(this.isFancyFileUploadBuilded && this.fancyFileUpload))
        {
            this.fancyFileUpload = {
                isInitializedBool : false,
                isInitialized : ()=>this.fancyFileUpload.isInitializedBool,
                setAsInitialized : ()=>this.fancyFileUpload.isInitializedBool = true,
                setAsNotInitialized : ()=>this.fancyFileUpload.isInitializedBool = false,
                init: ()=>{
                    if(!this.fancyFileUpload.isInitialized())
                    {
                        this.fancyFileUpload.id = `fancy_file_upload_${this.modalNonceId}`;

                        this.fancyFileUpload.buttonUploadAll = `fancy_file_upload_save_all_button_${this.modalNonceId}`;

                        let inputElementList = $(`input#${this.fancyFileUpload.id}[type="file"]`);
                        this.fancyFileUpload.input = inputElementList[Object.keys(inputElementList).at(0)];

                        this.fancyFileUpload.buttonRemoveAll = `fancy_file_upload_remove_all_button_${this.modalNonceId}`;


                        this.fancyFileUpload.setAsInitialized();
                    }
                },
                isRunningBool : false,
                isRunning : ()=>this.fancyFileUpload.isRunningBool,
                setAsRunning : ()=>this.fancyFileUpload.isRunningBool = true,
                setAsNotRunning : ()=>this.fancyFileUpload.isRunningBool = false,
                onStartUpload : undefined,
                onContinueUpload : undefined,
                onCompletedUpload : undefined,
                self: undefined,
                run: ()=>{
                    if(this.fancyFileUpload.isInitialized() && !this.fancyFileUpload.isRunning())
                    {
                        $(`#${this.fancyFileUpload.id}`).FancyFileUpload(
                            {
                                postinit: (a,b,c) => console.log(a,b,c,'postinit'),
                                preinit: (_self) => this.fancyFileUpload.self = _self,
                                params: {
                                    action: 'fileuploader'
                                },
                                edit : true,
                                startupload : (SumbitUpload, event, data) => {
                                    event.preventDefault();
                                    console.log(`Uploading initialized..♥☻☺`);
                                    if(this.fancyFileUpload.isInitialized() && this.fancyFileUpload.isRunning())
                                    {
                                        if(typeof this.fancyFileUploadEvents.onStartUpload === 'function')
                                        {
                                            this.fancyFileUploadEvents.onStartUpload(event, data);

                                            Object.keys(data.context).forEach(key => {
                                                const context = data.context[key];

                                                // Yükleme başlayınca butona loading sınıfı ekleyelim
                                                $(context).removeClass('ff_fileupload_starting');
                                                $(context).addClass('ff_fileupload_uploading');
                                                $(context).find('.progress-bar').css('width', '0%').show();
                                            });

                                            setTimeout(()=>this.fancyFileUpload.self.continueupload(event, data), 1000);
                                        }
                                        else
                                            throw new Error('FancyFileUpload onStartUpload callback is not defined');
                                    }
                                },
                                continueupload : (event, data) => {
                                    event.preventDefault();
                                    console.log(`Uploading continuing..♥☻☺`);

                                    if(
                                        this.fancyFileUpload.isInitialized() && this.fancyFileUpload.isRunning()
                                        && typeof this.fancyFileUploadEvents.onContinueUpload === 'function'
                                    )
                                        this.fancyFileUpload.onContinueUpload(event, data);

                                    if(data.ff_info && data.ff_info.progressbar)
                                        Object
                                            .keys(data.ff_info.progressbar)
                                            .forEach(key => $(data.context[key])
                                                .find('td.ff_fileupload_summary div.ff_fileupload_progress_background div.ff_fileupload_progress_bar')
                                                // İlerleme çubuğunu güncelle
                                                .css('width', '50%')
                                        );

                                    setTimeout(()=>this.fancyFileUpload.self.uploadcompleted(event, data), 1000);

                                },
                                uploadcompleted : (event, data) => {
                                    event.preventDefault();
                                    console.log(`Uploading completed..♥☻☺`);
                                    if(this.fancyFileUpload.isInitialized() && this.fancyFileUpload.isRunning())
                                    {
                                        if(typeof this.fancyFileUploadEvents.onCompletedUpload === 'function')
                                        {
                                            this.fancyFileUploadEvents.onCompletedUpload(event, data);

                                            // Yükleme tamamlandığında animasyon veya efekt göster
                                            Object.keys(data.context).forEach(key => {
                                                const context = data.context[key];
                                                $(context).removeClass('ff_fileupload_uploading');
                                                $(context).addClass('ff_fileupload_completed');
                                                $(context).find('.progress-bar').css('width', '100%');
                                                $(context).find('.upload-status').text('Upload completed!');
                                            });

                                            if(data.ff_info && data.ff_info.RemoveFile instanceof Function)
                                                data.ff_info.RemoveFile();

                                            this.fancyFileUpload.addedFiles = this.fancyFileUpload.addedFiles.filter(addedFile => addedFile !== data.ff_info);
                                        }
                                        else
                                            throw new Error('FancyFileUpload onCompletedUpload callback is not defined');
                                    }
                                },
                                added: (event, fileInput) => {
                                    this.fancyFileUpload.addedFiles.push(fileInput);
                                    if(!this.fancyFileUpload.inputEvent)
                                        this.fancyFileUpload.inputEvent = event;
                                },
                                maxfilesize: 1000000
                            }
                        );

                        $(`#${this.fancyFileUpload.buttonUploadAll}`).on('click', (event)=>{
                            console.log('Uploading all files start..☺☻♥♠♣•◘--▼');
                            event.preventDefault();

                            this.fancyFileUpload.addedFiles
                                .forEach(file => this.fancyFileUpload.self.startupload(
                                    ()=> console.log('StartUpload'),
                                    this.fancyFileUpload.inputEvent,
                                    file)
                                );
                        });

                        $(`#${this.fancyFileUpload.buttonRemoveAll}`).on('click', ()=>{
                            this.fancyFileUpload.addedFiles.forEach(addedFile => {

                                if (addedFile && addedFile.ff_info && typeof addedFile.ff_info.RemoveFile === 'function') {
                                    $(addedFile).off('click', addedFile.event);
                                    addedFile.ff_info.RemoveFile();
                                }
                                else {
                                    console.error('RemoveFile function is not defined or fileInput is missing');
                                }

                                this.fancyFileUpload.addedFiles = this.fancyFileUpload.addedFiles.filter(filteringItem => filteringItem !== addedFile);
                            });
                        });

                        this.fancyFileUpload.setAsRunning();
                    }
                },
                unset: ()=>{
                    this.fancyFileUpload.addedFiles.forEach(
                        addedFile=>{
                            if(addedFile && addedFile.ff_info && typeof addedFile.ff_info.RemoveFile === 'function'){
                                $(addedFile).off('click', addedFile.event);
                                addedFile.ff_info.RemoveFile();
                            }
                        }
                    );
                    this.fancyFileUpload.addedFiles = [];
                    this.fancyFileUpload.id = undefined;
                    this.fancyFileUpload.buttonUploadAll = undefined;
                    this.fancyFileUpload.buttonRemoveAll = undefined;
                    this.fancyFileUpload.input = undefined;
                    this.fancyFileUpload.inputEvent = undefined;
                    this.fancyFileUpload.self = undefined;
                    this.fancyFileUpload.setAsNotInitialized();
                },
                stop : ()=>{
                    this.fancyFileUpload.unset();
                    this.fancyFileUpload.setAsNotRunning();
                },
                id : undefined,
                maxFileSize : 100000000,
                buttonUploadAll : undefined,
                buttonRemoveAll : undefined,
                input : undefined,
                addedFiles : [],
                inputEvent : undefined,
            };

            this.isFancyFileUploadBuilded = true;
        }

        return this;
    }

    /**
     * Initializes fancy file uploader
     * @returns {BulkImageUploader}
     */
    initFancyFileUploader()
    {
        if(this.isFancyFileUploadBuilded)
            this.fancyFileUpload.init();

       return this;
    }

    /**
     * Runs fancy file uploader if it initialized and is not running
     * @returns {BulkImageUploader}
     */
    runFancyFileUpload()
    {
        if(this.isFancyFileUploadBuilded)
            this.fancyFileUpload.run();

        return this;
    }

    /**
     * Runs uploader
     * @return {BulkImageUploader}
     */
    run()
    {
        if(this.target && typeof this.options.event === 'string' && typeof this.options.onEvent === 'function')
        {
            this.modalNonceId = `nonce-${Date.now()}`;
            const _self = this.buildHTML()
                .buildImageUploadify()
                .buildFancyFileUpload()
                .initImageUploadify()
                .initFancyFileUploader()
                .runImageUploadify()
                .runFancyFileUpload();

            this.target.addEventListener(
                this.options.event,
                function (event, self = _self)
                {
                    event.preventDefault();
                    self.show();
                }
            );
        }

        return this;
    }

    /**
     * Destroys uploader
     */
    destroy()
    {
        if(this.target && typeof this.options.event === 'string' && typeof this.options.onEvent === 'function')
        {
            this.target.removeEventListener(this.options.event, this.options.onEvent);
        }
    }

    /**
     * Destroys everything
     */
    destroyAll()
    {
        this.destroy();
        this.target = undefined;
        this.options = undefined;
        this.selector = undefined;
        this.modalNonceId = undefined;
        this.modalStructure = undefined;
    }

    /**
     *
     * @param {function(e: event, data: object)} callback
     * @return {BulkImageUploader}
     *
     * @example function(e, data) {
     *   var token;
     *   $.ajax({
     *       'url' : 'gettoken.php',
     *       'dataType' : 'json',
     *       'success' : function(tokendata) {
     *       token = tokendata;
     *       }
     *  });
     *
     *  // ... use token for upload if it's needed
     * }
     */
    handleFancyUploadOnStart(callback)
    {
        if(callback instanceof Function)
            this.fancyFileUploadEvents.onStartUpload = callback;
        else throw new Error('FancyFileUpload onStartUpload callback is not callable');

        return this;
    }

    /**
     *
     * @param {function(e: event, data: object)} callback
     * @returns {BulkImageUploader}
     * @example function(e, data) {
     *    var ts = Math.round(new Date().getTime() / 1000);
     *    // Alternatively, just call data.abort()
     *    // or return false here to terminate the upload but leave the UI elements alone.
     *    if (token.expires < ts)  data.ff_info.RemoveFile();
     * }
     */
    handleFancyUploadOnContinue(callback)
    {
        if(callback instanceof Function)
            this.fancyFileUploadEvents.onContinueUpload = callback;
        else throw new Error('FancyFileUpload onContinueUpload callback is not callable');

        return this;
    }

    /**
     *
     * @param {function(e: event, data: object)} callback
     * @returns {BulkImageUploader}
     *   function(e, data) {
     *       data.ff_info.RemoveFile();
     *   }
     */
    handleFancyUploadOnComplete(callback)
    {
        if(callback instanceof Function)
            this.fancyFileUploadEvents.onCompletedUpload = callback;
        else throw new Error('FancyFileUpload onCompletedUpload callback is not callable');

        return this;
    }

    /**
     *
     * @param {function} callback
     * @returns {BulkImageUploader}
     */
    handleImageUpload(callback)
    {
        if(this.isImageUploadifyBuilded)
        {
            this.imageUploadifyEvents.onStartUpload = callback;
        }

        return this;
    }
}