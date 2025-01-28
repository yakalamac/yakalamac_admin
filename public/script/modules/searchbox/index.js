if(!(window.$ && $.hasOwnProperty('fn') && $.fn)) throw new Error('Jquery is not defined');

function checkConstruction(settings){
    if(typeof settings.closeOnResultClick !== 'boolean') throw new Error('Invalid type of closeOnResultClick. Expected boolean.');

    if(typeof settings.placeholder !== 'string') throw new Error('Invalid type of placeholder. Expected string or undefined');

    const functions = ['onNoneResult','onResult', 'onSearch', 'onResultClick'];
    const numbers = ['delay', 'minSearchLength', 'maxResults'];

    for(let i=0; i<functions.length; i++) {
        if(typeof settings[functions[i]] !== 'function')
            throw new Error(`Invalid type of ${functions[i]}. Expected function.`);
    }

    for(let i=0; i<numbers.length; i++) {
        if(typeof settings[numbers[i]] !== 'number')
            throw new Error(`Invalid type of ${numbers[i]}. Expected number.`);
    }
}

function searchBarHeader(settings) {
    return `<div class="search-bar-input"><div class="form-control rounded-0">
              <div class="row align-items-center g-2">
                <i class="col-auto material-icons-outlined fs-6 cursor-pointer">search</i>
                <div class="col p-0">
                    <input type="text" class="form-control border-0" placeholder="${settings.placeholder}" data-access="${settings.access.input}"/>
                </div>
              </div>
            </div>
          </div>`;
}

function searchBarResultContainer(settings) {
    return `<div class="search-bar-result" data-access="${settings.access.resultContainer}">
                <div class="card">
                    <ul class="list-group list-group-flush rounded-0" data-access="${settings.access.resultList}"></ul>
                </div>
            </div>`;
}

function buildHTML(target, settings) {
    $(target).replaceWith(`<div class="search-bar position-relative rounded-0" data-access="${settings.access.searchBarContainer}">${searchBarHeader(settings)}${searchBarResultContainer(settings)} </div>`);
}

function searchBarResult(active, content) {
    return `<li class="list-group-item search-result-list-item ${active && 'list-group-item-action active'}">${content}</li>`;
}

function hideResultContainer(settings) {
    const container = $(`[data-access=${settings.access.resultContainer}]`);
    container.removeClass('d-block'); container.hide();
}

function initResultListeners(settings) {
    $(`ul[data-access=${settings.access.resultList}] li`).on('click', event => {
        if(settings.closeOnResultClick === true) hideResultContainer(settings);
        const inputVal = settings.onResultClick(event);
        if(typeof inputVal !== 'string') throw new Error('onResultClick was not returned a string about result');
        $(`input[data-access="${settings.access.input}"]`).val(inputVal.trim());
    });
}

/**
 * @param {{maxResults: 10, placeholder: string, onSearch: Function, onResult: Function, onNoneResult: Function, onResultClick: Function, delay: 1000, minSearchLength: 3, closeOnResultClick: boolean}} options
 * @returns {window.$.SearchBox}
 * @constructor
 */
window.$.fn.SearchBox = function(options) {
    if(!$(this).length) return this;
    const now = Date.now();
    const defaults = {
        maxResults: 10,
        placeholder: 'Search...',
        onSearch: undefined,
        onResult: undefined,
        onNoneResult: undefined,
        onResultClick: undefined,
        closeOnResultClick: false,
        minSearchLength: 3,
        delay: 1000,
        inputChanged: false,
        input: undefined,
        searched: false,
        lastAccess: now,
        resultLength : undefined,
        access: {
            input: `input-${now}`,
            resultContainer: `recontainer-${now}`,
            resultList: `relist-${now}`,
            searchBarContainer: `search-bar-container-${now}`
        }
    };

    const settings = $.extend({}, defaults, options);

    checkConstruction(settings);

    buildHTML(this, settings);

    function startResult(result) {
        hideResultContainer(settings);
        let template = '';
        if(Array.isArray(result)) {
            Array.from(result).forEach((r, index)=> {
                if(index < settings.maxResults) template+= searchBarResult(false, settings.onResult(r))
            });
        }
        if(template.length === 0) template = settings.onNoneResult();
        settings.resultLength = true;
        $(`[data-access="${settings.access.resultList}"]`).html(template);
        $(`[data-access=${settings.access.resultContainer}]`).show();
        initResultListeners(settings);
    }

    function startSearch(){console.log(settings)
        setTimeout(async ()=>{
            if (
                settings.inputChanged && settings.searched === false &&
                Date.now() - settings.lastAccess > settings.delay
            ) {
                settings.searched = true;
                const result = await settings.onSearch(settings.input);
                startResult(result);
            }
        }, settings.delay);
    }

    const inputBar = $(`[data-access="${settings.access.input}"]`);

    inputBar.on('input', event=> {
        const input = $(event.currentTarget).val().trim();
        if(input.length < settings.minSearchLength) return;
        settings.inputChanged = input !== settings.input;
        settings.input = input;
        settings.lastAccess = Date.now();
        settings.searched = false;
        startSearch();
    });

    inputBar.on('click', ()=>{
        if(settings.resultLength) $(`[data-access=${settings.access.resultContainer}]`).show();
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest(`div.search-bar[data-access="${settings.access.searchBarContainer}"]`).length)
            hideResultContainer(settings);
    });

    $(`.search-bar-input *`).on('focus', event=>{
       $(event.currentTarget).closest('.search-bar-input').addClass('on-focus');
    });

    return this;
}