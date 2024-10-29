/**
 *
 * @param {string} selectId
 * @param {string} optionIdentifierAttrName
 * @param {string} responseValue
 * @param {string} responseIdentifier
 * @param {string} endpoint
 * @param {function} onError
 * @param {function} onFailure
 * @param {function} returnFunction
 */
export function pushMulti(selectId, optionIdentifierAttrName, responseValue, responseIdentifier, endpoint, onError = undefined, onFailure = undefined, returnFunction = undefined) {
    $.ajax(
        {
            url: `/_route/api/${endpoint}`,
            method: 'GET',
            success: response => {
                if (returnFunction && typeof returnFunction === 'function')
                    returnFunction(response);

                const select = $(`select#${selectId}`);
                response.forEach(item => {
                    if (!(select.find(`option[${optionIdentifierAttrName}="${item[responseIdentifier]}"`).length > 0)) {
                        select.append(
                            $(`<option ${optionIdentifierAttrName}="${item[responseIdentifier]}">${item[responseValue]}</option>`)
                        );
                    }
                });
            },
            failure: (failure) => typeof onFailure === 'function' ? onFailure(failure) : console.warn(failure),
            error: error => typeof onError === 'function' ? onError(error) : console.error(error)
        }
    )
}


/**
 *
 * @param {Array<{id: string|number, optionIdentifierAttrName: string}>} selectList
 * @param {string} responseValue
 * @param {string} responseIdentifier
 * @param {string} endpoint
 * @param {function} onError
 * @param {function} onFailure
 * @param {function} returnFunction
 */
export function pushMultiForSelects(selectList, responseValue, responseIdentifier, endpoint, onError = undefined, onFailure = undefined, returnFunction = undefined) {
    $.ajax(
        {
            url: `/_route/api/${endpoint}`,
            method: 'GET',
            success: response => {
                if (returnFunction && typeof returnFunction === 'function')
                    returnFunction(response);

                selectList.forEach(select => {
                    const selectObject = $(`select#${select.id}`);
                    response.forEach(item => {
                        if (!(selectObject.find(`option[${select.optionIdentifierAttrName}="${item[responseIdentifier]}"`).length > 0)) {
                            selectObject.append(
                                $(`<option ${select.optionIdentifierAttrName}="${item[responseIdentifier]}">${item[responseValue]}</option>`)
                            );
                        }
                    });
                });
            },
            failure: (failure) => typeof onFailure === 'function' ? onFailure(failure) : console.warn(failure),
            error: error => typeof onError === 'function' ? onError(error) : console.error(error)

        }
    );
}

/**
 *
 * @param {string} selector
 * @param {string} theme
 * @param {string} placeholder
 * @param {boolean} closeOnSelect
 * @param {boolean} tags
 */
export function initializeSelect2(selector, theme = "bootstrap-5", placeholder = 'placeholder', closeOnSelect = false, tags = true) {
    if (typeof $ === 'function' && typeof $.fn.select2 === 'function') {
        $(selector).select2
        (
            {
                theme: theme,
                width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',//width || (tags && '100%'),
                placeholder: $(this).data(placeholder),
                closeOnSelect: closeOnSelect,
                tags: tags
            }
        );
    } else {
        console.error('$ is not jQuery or Select2 is not defined. Please check your library includes.');
    }
}
