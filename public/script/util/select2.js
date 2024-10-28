export function pushMulti(selectId, optionIdentifierAttrName, responseValue, responseIdentifier, endpoint, error, failure) {
    $.ajax(
        {
            url: `/_route/api/${endpoint}`,
            method: 'GET',
            success: response => {
                const select = $(`select#${selectId}`);
                response.forEach(item => {
                    if (!(select.find(`option[${optionIdentifierAttrName}="${item[responseIdentifier]}"`).length > 0)) {
                        select.append(
                            $(`<option ${optionIdentifierAttrName}="${item[responseIdentifier]}">${item[responseValue]}</option>`)
                        );
                    }
                });
            },
            error: error,
            failure: failure

        }
    );
}


/**
 *
 * @param {Array<{id: string|number, optionIdentifierAttrName: string}>} selectList
 * @param {string} responseValue
 * @param {string} responseIdentifier
 * @param {string} endpoint
 * @param error
 * @param failure
 */
export function pushMultiForSelects(selectList, responseValue, responseIdentifier, endpoint, error, failure) {
    $.ajax(
        {
            url: `/_route/api/${endpoint}`,
            method: 'GET',
            success: response => {
                selectList.forEach(select=>{
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
            error: error,
            failure: failure

        }
    );
}