export default class JSONFileUploader {
    constructor(
        selector = undefined, 
        options = { 
            onClick: ()=>console.info('Button clicked'),
            onUpload: ()=>console.info('File uploading..'),
            onUploadSuccess: ()=>console.info('File uploaded successfully')
        }
    ) {
        this.selector = selector;
        this.target = undefined;
        this.options = options;
        this.modalStructure = undefined;
        this.initialized = false;
        this.running = false;
        this.nonce = undefined;
        this.modal = undefined;
        this.singleUploader = undefined;
        this.isSingleUploaderBuilded = false;
        this.singleUploaderEvents = {
            onStartUpload: undefined
        };
        this.fancyBulkFileUpload = undefined;
        this.isFancyBulkFileUploadBuilded = false;
        this.fancyBulkFileUploadEvents = {
            onStartUpload: undefined,
            onContinueUpload: undefined,
            onCompletedUpload: undefined
        };
        this.fileInput = [];
    }

    /**
     * Initializes uploader by checking provided properties
     * @returns {JSONFileUploader}
     */
    init(){
        
        if(this.initialized)
        {
            console.warn('JSONFileUploader is already initialized.')
            return this;   
        }
        
        if(typeof this.selector !== 'string')
            throw new Error('Selector must be a string');
        
        this.target = document.querySelector(this.selector);
        
        if(!this.target instanceof HTMLElement)
        {
            this.target = undefined;
            throw new Error('Selector must be a valid HTML element');    
        }
        
        if(typeof this.options !== 'object') {
            this.options = undefined;
            throw new Error('Invalid options provided. Options must be an object that includes onClick, onUpload, onUploadSuccess functions.');   
        }
        
        if(typeof this.options.onClick !== 'function')
        {
            this.options.onClick = undefined;
            throw new Error('onClick option must be a function');   
        }
        
        if(typeof this.options.onUpload !== 'function')
        {
            this.options.onUpload = undefined;
            throw new Error('onUpload option must be a function');   
        }
        
        if(typeof this.options.onUploadSuccess !== 'function') 
        {
            this.options.onUploadSuccess = undefined;
            throw new Error('onUploadSuccess option must be a function');   
        }
        
        this.initialized = true;
        
        return this;
    }
    
    buildHTML()
    {
        if(typeof this.nonce === 'string' && this.running && !(document.querySelector(`#${this.nonce}`)))
        {
            this.modalStructure = `
                <div class="modal fade" id="${this.nonce}" tabindex="-1" aria-labelledby="addModalLabel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="uploadJSONBulk">JSON Ekle</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                            <div class="modal-body">
                                
                                <div class="mb-3">
                                    
                                    <!-- Nav for Tabs -->
                                    <ul class="nav nav-pills" id="tabList${this.nonce}" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <a class="nav-link" id="tab_drag_drop_${this.nonce}" data-bs-toggle="pill" href="#primary-pills-tab_drag_drop_${this.nonce}" role="tab" aria-controls="primary-pills-tab_drag_drop_${this.nonce}" aria-selected="true">
                                                Tek Dosyadan Yükle
                                            </a>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <a class="nav-link active" id="tab_from_file_${this.nonce}" data-bs-toggle="pill" href="#primary-pills-tab_from_file_${this.nonce}" role="tab" aria-controls="primary-pills-tab_from_file_${this.nonce}" aria-selected="false">
                                                Toplu Dosyadan Yükle
                                            </a>
                                        </li>
                                    </ul>
                                    <!-- Nav for Tabs/ -->
                                    
                                </div>
                                
                                <div class="tab-content" id="pills-tabContent">
                                    
                                    <div class="tab-pane fade" id="primary-pills-tab_drag_drop_${this.nonce}" role="tabpanel" aria-labelledby="tab_drag_drop_${this.nonce}">
                                        <div class="card">
                                            <div class="card-body">
                                                <div class="row p-1">
                                                    <button class="btn btn-success col m-1 text-center flex justify-content-center align-items-center" id="image_uploadify_save_all_button_${this.nonce}">
                                                        <div class="row">
                                                            <span class="material-symbols-outlined m-auto">save</span>
                                                            <b class="m-auto">Hepsini Kaydet</b>
                                                        </div>
                                                    </button>
                                                    <button class="btn btn-danger col m-1 text-center flex align-items-center justify-content-center" id="image_uploadify_remove_all_button_${this.nonce}">
                                                        <div class="row">
                                                            <span class="material-symbols-outlined">delete</span>
                                                            <b class="m-auto">Hepsini Kaldır</b>
                                                        </div>
                                                    </button>
                                                </div>
                                                <form>
                                                    <input id="image_uploadify_${this.nonce}" type="file" accept=".json" style="display: none;" multiple>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="tab-pane fade show active" id="primary-pills-tab_from_file_${this.nonce}" role="tabpanel" aria-labelledby="tab_from_file_${this.nonce}">
                                        <div class="card">
                                            <div class="card-body">
                                                <div class="row p-1">
                                                    <button class="btn btn-success col m-1 text-center flex justify-content-center align-items-center" id="fancy_file_upload_save_all_button_${this.nonce}">
                                                        <div class="row">
                                                            <span class="material-symbols-outlined m-auto">save</span>
                                                            <b class="m-auto">Hepsini Kaydet</b>
                                                        </div>
                                                    </button>
                                                    <button class="btn btn-danger col m-1 text-center flex align-items-center justify-content-center" id="fancy_file_upload_remove_all_button_${this.nonce}">
                                                        <div class="row">
                                                            <span class="material-symbols-outlined">delete</span>
                                                            <b class="m-auto">Hepsini Kaldır</b>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="card-footer">
                                                <input id="fancy_file_upload_${this.nonce}" type="file" name="files" accept=".json" multiple>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" id="${this.nonce}-button-close" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                                    Kapat
                                </button>
                                <button type="submit" id="${this.nonce}-button-submit" class="btn btn-grd btn-grd-royal d-none">
                                    Kaydet
                                </button>
                            </div>
                            
                    </div>
                </div>
            </div>
            `;
        }

        return this;
    }

    build()
    {
        if(this.initialized && typeof this.nonce === 'string' && this.modalStructure && this.running && !this.modal) {
            this.modal = $(this.modalStructure);
            $('body').append(this.modal);
            this.modalStructure = undefined;
        }

        return this;
    }

    /**
     *
     * @returns {JSONFileUploader}
     */
    show() {
        if(this.running && this.modal)
            this.modal.modal('show');

        return this;
    }

    /**
     *
     * @returns {JSONFileUploader}
     */
    hide() {
        if(this.running && this.modal)
            this.modal.modal('hide');

        return this;
    }

    /**
     * Builds uploadify as an object module
     * @returns {JSONFileUploader}
     */
    buildSingleUploader()
    {
        if(!(this.isSingleUploaderBuilded && this.singleUploader))
        {
            this.singleUploader = {
                isInitializedBool : false,
                isInitialized : ()=>this.singleUploader.isInitializedBool,
                setAsInitialized : ()=>this.singleUploader.isInitializedBool = true,
                setAsNotInitialized : ()=>this.singleUploader.isInitializedBool = false,
                isRunningBool : false,
                isRunning : ()=>this.singleUploader.isRunningBool,
                setAsRunning : ()=>this.singleUploader.isRunningBool = true,
                setAsNotRunning : ()=>this.singleUploader.isRunningBool = false,
                id : undefined,
                buttonUploadAll: undefined,
                buttonRemoveAll: undefined,
                init: ()=>{
                    if(!this.singleUploader.isInitialized())
                    {
                        this.singleUploader.id = `image_uploadify_${this.nonce}`;
                        this.singleUploader.buttonUploadAll = `image_uploadify_save_all_button_${this.nonce}`;
                        this.singleUploader.buttonRemoveAll = `image_uploadify_remove_all_button_${this.nonce}`;
                        this.singleUploader.setAsInitialized();
                    }
                },
                run : ()=>{
                    /*  && this.modalStructure && document.querySelector(`#${this.nonce}` */
                    if(this.singleUploader.isInitialized() && !this.singleUploader.isRunning())
                    {
                        $(`#${this.singleUploader.id}`).imageuploadify();

                        $(`#${this.singleUploader.buttonUploadAll}`).on('click', (event)=>{

                            const fileList = $(`#${this.singleUploader.id}`)[0].files;
                            this.singleUploaderEvents.onStartUpload(event, fileList);
                        });

                        $(`#${this.singleUploader.buttonRemoveAll}`).on('click', (event)=>{
                            console.log('y')
                        });

                        this.singleUploader.setAsRunning();
                    }
                }
            };

            this.isSingleUploaderBuilded = true;
        }

        return this;
    }

    /**
     * Initializes single uploader
     * @returns {JSONFileUploader}
     */
    initSingleUploader()
    {
        if(this.isSingleUploaderBuilded)
            this.singleUploader.init();

        return this;
    }

    /**
     * Runs uploadify if it initialized and is not running
     * @returns {JSONFileUploader}
     */
    runSingleUploader()
    {
        if(this.isSingleUploaderBuilded)
            this.singleUploader.run();

        return this;
    }

    /**
     * Builds fancy bulk file upload as an object module
     * @returns {JSONFileUploader}
     */
    buildFancyBulkFileUpload()
    {
        if(!(this.isFancyBulkFileUploadBuilded && this.fancyBulkFileUpload))
        {
            let fileIndex = 0;
            this.fancyBulkFileUpload = {
                isInitialized : false,
                setAsInitialized : ()=>this.fancyBulkFileUpload.isInitialized = true,
                setAsNotInitialized : ()=>this.fancyBulkFileUpload.isInitialized = false,
                init: ()=>{
                    if(!this.fancyBulkFileUpload.isInitialized)
                    {
                        this.fancyBulkFileUpload.id = `fancy_file_upload_${this.nonce}`;

                        this.fancyBulkFileUpload.buttonUploadAll = `fancy_file_upload_save_all_button_${this.nonce}`;

                        let inputElementList = $(`input#${this.fancyBulkFileUpload.id}[type="file"]`);
                        this.fancyBulkFileUpload.input = inputElementList[Object.keys(inputElementList).at(0)];

                        this.fancyBulkFileUpload.buttonRemoveAll = `fancy_file_upload_remove_all_button_${this.nonce}`;


                        this.fancyBulkFileUpload.setAsInitialized();
                    }
                },
                isRunning : false,
                setAsRunning : ()=>this.fancyBulkFileUpload.isRunning = true,
                setAsNotRunning : ()=>this.fancyBulkFileUpload.isRunning = false,
                onStartUpload : undefined,
                onContinueUpload : undefined,
                onCompletedUpload : undefined,
                self: undefined,
                run: ()=>{
                    if(this.fancyBulkFileUpload.isInitialized && !this.fancyBulkFileUpload.isRunning)
                    {
                        $(`#${this.fancyBulkFileUpload.id}`).fancyBulkFileUpload(
                            {
                                /* postinit: (a,b,c) => console.log(a,b,c,'postinit'), @deprecated */
                                preinit: (_self) => this.fancyBulkFileUpload.self = _self,
                                params: {
                                    action: 'fileuploader'
                                },
                                edit : false,
                                startupload : (SumbitUpload, event, data) => {
                                    event.preventDefault();
                                    console.log(`Uploading initialized..♥☻☺`);
                                    if(this.fancyBulkFileUpload.isInitialized && this.fancyBulkFileUpload.isRunning)
                                    {
                                        if(typeof this.fancyBulkFileUploadEvents.onStartUpload === 'function')
                                        {
                                            this.fancyBulkFileUploadEvents.onStartUpload(event, data);

                                            Object.keys(data.context).forEach(key => {
                                                const context = data.context[key];

                                                // Yükleme başlayınca butona loading sınıfı ekleyelim
                                                $(context).removeClass('ff_fileupload_starting');
                                                $(context).addClass('ff_fileupload_uploading');
                                                $(context).find('.progress-bar').css('width', '0%').show();
                                            });

                                            setTimeout(()=>this.fancyBulkFileUpload.self.continueupload(event, data), 1000);
                                        }
                                        else
                                            throw new Error('fancyBulkFileUpload onStartUpload callback is not defined');
                                    }
                                },
                                continueupload : (event, data) => {
                                    event.preventDefault();
                                    console.log(`Uploading continuing..♥☻☺`);

                                    if(
                                        this.fancyBulkFileUpload.isInitialized && this.fancyBulkFileUpload.isRunning
                                        && typeof this.fancyBulkFileUploadEvents.onContinueUpload === 'function'
                                    )
                                        this.fancyBulkFileUpload.onContinueUpload(event, data);

                                    if(data.ff_info && data.ff_info.progressbar)
                                        Object
                                            .keys(data.ff_info.progressbar)
                                            .forEach(key => $(data.context[key])
                                                .find('td.ff_fileupload_summary div.ff_fileupload_progress_background div.ff_fileupload_progress_bar')
                                                // İlerleme çubuğunu güncelle
                                                .css('width', '50%')
                                            );

                                    setTimeout(()=>this.fancyBulkFileUpload.self.uploadcompleted(event, data), 1000);

                                },
                                uploadcompleted : (event, data) => {
                                    event.preventDefault();
                                    console.log(`Uploading completed..♥☻☺`);
                                    if(this.fancyBulkFileUpload.isInitialized && this.fancyBulkFileUpload.isRunning)
                                    {
                                        if(typeof this.fancyBulkFileUploadEvents.onCompletedUpload === 'function')
                                        {
                                            this.fancyBulkFileUploadEvents.onCompletedUpload(event, data);

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

                                            this.fancyBulkFileUpload.addedFiles = this.fancyBulkFileUpload.addedFiles.filter(addedFile => addedFile !== data.ff_info);
                                        }
                                        else
                                            throw new Error('fancyBulkFileUpload onCompletedUpload callback is not defined');
                                    }
                                },
                                added: (e, data) => {
                                    this.fancyBulkFileUpload.addedFiles.push(data);
                                    if (!this.fancyBulkFileUpload.inputEvent) {
                                        this.fancyBulkFileUpload.inputEvent = e;
                                    }
                                    data.context.each((_, element) => {
                                        const currentIndex = fileIndex++;

                                        const categorySelect = $(`
                                            <div class="category-container">
                                                <div>
                                                    <label for="description-${currentIndex}">Açıklama:</label>
                                                    <input 
                                                        type="text" 
                                                        id="description-${currentIndex}" 
                                                        class="description-input" 
                                                        placeholder="Açıklama" 
                                                        value="${this.additionalData.placeName || ''}" 
                                                    />
                                                </div>
                                                <div>
                                                    <label for="category-${currentIndex}">Kategori:</label>
                                                    <select 
                                                        id="category-${currentIndex}" 
                                                        class="category-select">
                                                        <option selected value="/api/category/place/photos/1">Ambiyans</option>
                                                        <option value="/api/category/place/photos/2">İç Mekan</option>
                                                        <option value="/api/category/place/photos/3">Dış Mekan</option>
                                                        <option value="/api/category/place/photos/11">Yemek</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input class="form-check-input showOnLogo" type="checkbox" role="switch" id="showOnLogo-${currentIndex}">
                                                    <label for="showOnLogo-${currentIndex}"> Logo Olarak Görüntüle </label>
                                                </div>
                                                <div>
                                                    <input class="form-check-input showOnBanner" type="checkbox" role="switch" id="showOnBanner-${currentIndex}">
                                                    <label for="showOnBanner-${currentIndex}"> Banner Olarak Görüntüle </label>
                                                </div>
                                            </div>
                                        `);
                                        $(element).find('.ff_fileupload_actions').append(categorySelect);
                                    });
                                },
                                maxfilesize: 1000000
                            }
                        );

                        $(`#${this.fancyBulkFileUpload.buttonUploadAll}`).on('click', (event)=>{
                            console.log('Uploading all files start..☺☻♥♠♣•◘--▼ HI KIVANC HANCERLI ♣');
                            event.preventDefault();

                            this.fancyBulkFileUpload.addedFiles
                                .forEach(file => this.fancyBulkFileUpload.self.startupload(
                                    ()=> console.log('StartUpload'),
                                    this.fancyBulkFileUpload.inputEvent,
                                    file)
                                );
                        });

                        $(`#${this.fancyBulkFileUpload.buttonRemoveAll}`).on('click', ()=>{
                            this.fancyBulkFileUpload.addedFiles.forEach(addedFile => {

                                if (addedFile && addedFile.ff_info && typeof addedFile.ff_info.RemoveFile === 'function') {
                                    $(addedFile).off('click', addedFile.event);
                                    addedFile.ff_info.RemoveFile();
                                }
                                else {
                                    console.error('RemoveFile function is not defined or fileInput is missing');
                                }

                                this.fancyBulkFileUpload.addedFiles = this.fancyBulkFileUpload.addedFiles.filter(filteringItem => filteringItem !== addedFile);
                            });
                        });

                        this.fancyBulkFileUpload.setAsRunning();
                    }
                },
                unset: ()=>{
                    this.fancyBulkFileUpload.addedFiles.forEach(
                        addedFile=>{
                            if(addedFile && addedFile.ff_info && typeof addedFile.ff_info.RemoveFile === 'function'){
                                $(addedFile).off('click', addedFile.event);
                                addedFile.ff_info.RemoveFile();
                            }
                        }
                    );
                    this.fancyBulkFileUpload.addedFiles = [];
                    this.fancyBulkFileUpload.id = undefined;
                    this.fancyBulkFileUpload.buttonUploadAll = undefined;
                    this.fancyBulkFileUpload.buttonRemoveAll = undefined;
                    this.fancyBulkFileUpload.input = undefined;
                    this.fancyBulkFileUpload.inputEvent = undefined;
                    this.fancyBulkFileUpload.self = undefined;
                    this.fancyBulkFileUpload.setAsNotInitialized();
                },
                stop : ()=>{
                    this.fancyBulkFileUpload.unset();
                    this.fancyBulkFileUpload.setAsNotRunning();
                },
                id : undefined,
                maxFileSize : 100000000,
                buttonUploadAll : undefined,
                buttonRemoveAll : undefined,
                input : undefined,
                addedFiles : [],
                inputEvent : undefined,
            };

            this.isfancyBulkFileUploadBuilded = true;
        }

        return this;
    }

    /**
     * Initializes fancy file uploader
     * @returns {JSONFileUploader}
     */
    initFancyBulkFileUploader()
    {
        if(this.isFancyBulkFileUploadBuilded)
            this.fancyBulkFileUpload.init();

        return this;
    }

    /**
     * Runs fancy file uploader if it initialized and is not running
     * @returns {JSONFileUploader}
     */
    runFancyBulkFileUploader()
    {
        if(this.isfancyBulkFileUploadBuilded)
            this.fancyBulkFileUpload.run();

        return this;
    }
    
    run() {
        if(!this.initialized)
            throw new Error('Uploader is not initialized. Please call init() method before running.');

        while(true) {
            this.nonce = 'json_file_uploader'+Date.now().toString();
            if($(`#${this.nonce}`).length === 0)
                break;
        }
        this.running = true;
        const _self = this
            .buildHTML()
            .build()
            .buildSingleUploader()
            .buildFancyBulkFileUpload()
            .initSingleUploader()
            .initFancyBulkFileUploader()
            .runSingleUploader()
            .runFancyBulkFileUploader();

        $(this.target).on('click' ,function(event, self = _self){
            event.preventDefault();
            self.show();
        });


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
        this.nonce = undefined;
        this.modalStructure = undefined;
    }

    /**
     *
     * @param {function(e: event, data: object)} callback
     * @return {JSONFileUploader}
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
    handleFancyBulkFileUploadOnStart(callback)
    {
        if(callback instanceof Function)
            this.fancyBulkFileUploadEvents.onStartUpload = callback;
        else throw new Error('fancyBulkFileUpload onStartUpload callback is not callable');

        return this;
    }

    /**
     *
     * @param {function(e: event, data: object)} callback
     * @returns {JSONFileUploader}
     * @example function(e, data) {
     *    var ts = Math.round(new Date().getTime() / 1000);
     *    // Alternatively, just call data.abort()
     *    // or return false here to terminate the upload but leave the UI elements alone.
     *    if (token.expires < ts)  data.ff_info.RemoveFile();
     * }
     */
    handleFancyBulkFileUploadOnContinue(callback)
    {
        if(callback instanceof Function)
            this.fancyBulkFileUploadEvents.onContinueUpload = callback;
        else throw new Error('fancyBulkFileUpload onContinueUpload callback is not callable');

        return this;
    }

    /**
     *
     * @param {function(e: event, data: object)} callback
     * @returns {JSONFileUploader}
     *   function(e, data) {
     *       data.ff_info.RemoveFile();
     *   }
     */
    handleFancyBulkFileUploadOnComplete(callback)
    {
        if(callback instanceof Function)
            this.fancyBulkFileUploadEvents.onCompletedUpload = callback;
        else throw new Error('fancyBulkFileUpload onCompletedUpload callback is not callable');

        return this;
    }

    /**
     *
     * @param {function(e: event, data: Array)} callback
     * @returns {JSONFileUploader}
     */
    handleSingleUploader(callback)
    {
        if(this.isSingleUploaderBuilded)
        {
            this.singleUploaderEvents.onStartUpload = callback;
        }

        return this;
    }
}