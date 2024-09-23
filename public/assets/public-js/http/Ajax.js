const formMaker = (baseUrl, url, type, data, file, blob, flag) => {
    const form = new FormData();
    if(baseUrl || url) form.append('url', baseUrl + '/' + url);
    if(type) form.append('method', type);
    // Append data to FormData
    if (data) {
        for (const key in data) {
            form.append(key, data[key]);
        }
    }
    // Append file or blob if provided
    if (file) form.append('file', file);
    if (blob) form.append('blob', blob);
    if(flag) form.append('flag', flag);
    return form;
}

const ajaxMaker = (baseUrl, url, type, data, file, blob, dataType, contentType,
                   flag = Ajax.flags.DEFAULT_FLAG,
                   onSuccess = success => console.log(success),
                   onFailure = failure => console.log(failure),
                   onError = error => console.log(error),
                   reponseType = 'text'
) => {
    const isMultipart = flag === Ajax.flags.MULTIPART_FLAG;
    const requestData = isMultipart ? formMaker(baseUrl, url, type, data, file, blob, flag) : JSON.stringify({
        url: `${baseUrl}/${url}`,
        method: type || 'GET',
        data: data || [],
        flag: flag || Ajax.flags.DEFAULT_FLAG
    });

    return $.ajax({
        url: window.Laravel.makeReqUrl,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').attr('value')
        },
        data: requestData,
        xhrFields: {
            responseType: reponseType,
        },
        processData: !isMultipart, // Don't process data if it's FormData
        contentType: isMultipart ? false : 'application/json;charset=utf-8', // Set content type accordingly
        success: onSuccess,
        error: (xhr) => onError(xhr.responseText),
        failure: (failure) => onFailure(failure.responseText)
    });
};

// const ajaxMaker = (baseUrl, url, type, data, file, blob, dataType, contentType,
//                    flag = Ajax.flags.DEFAULT_FLAG,
//                    onSuccess = success => console.log(success),
//                    onFailure = failure => console.log(failure),
//                    onError = error => console.log(error)
// ) => {
//     return $.ajax(
//         {
//             url: window.Laravel.makeReqUrl,
//             type: 'POST',
//             headers: {
//                 'X-CSRF-TOKEN': $('input[name="_token"]').attr('value')
//             },
//             data: contentType === 'application/json' ?
//                 JSON.stringify({
//                     url: (baseUrl + '/' + url)
//                     // .replace('?', '%3F')
//                     // .replace('=', '%3D')
//                     // .replace('&', '%26')
//                     // .replace(',', '%2C')
//                     ,
//                     method: type ?? 'GET',
//                     data: data ?? [],
//                     flag: flag ?? Ajax.flags.DEFAULT_FLAG
//                 }) : formMaker(baseUrl, url, type, data, file, blob),
//             dataType: dataType,
//             contentType: contentType + ';charset=utf-8',
//             success: onSuccess,
//             error: (xhr) => onError(xhr.responseText),
//             failure: (failure) => onFailure(failure.responseText),
//             file: file,
//             blob: blob
//         }
//     );
// }
const Ajax = {
    get: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError) => {
        return ajaxMaker(baseUrl, url, 'GET', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, 'blob');
    },
    post: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError) => {
        return ajaxMaker(baseUrl, url, 'POST', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError);
    },
    delete: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError) => {
        return ajaxMaker(baseUrl, url, 'DELETE', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError);
    },
    put: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError) => {
        return ajaxMaker(baseUrl, url, 'PUT', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError);
    },
    patch: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError) => {
        return ajaxMaker(baseUrl, url, 'PATCH', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError);
    },
    flags: {
        DEFAULT_FLAG: 0,
        MULTIPART_FLAG: 1
    }
};
export default Ajax;
