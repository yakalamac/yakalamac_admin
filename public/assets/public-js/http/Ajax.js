import StatusBar from "../template/status-bar.js";

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

const middlewareAjax = (baseUrl, url, type, data, file, blob, dataType, contentType,
                   flag = Ajax.flags.DEFAULT_FLAG,
                   onSuccess = success => console.log(success),
                   onFailure = failure => console.log(failure),
                   onError = error => console.log(error),
                   resType = 'text'
) => {
    const header = dataType || contentType ? {} : null;
    if(header)
    {
        if(contentType)
            header['Content-Type'] = contentType;

        if(dataType)
            header['accept'] = dataType;
    }

    const isMultipart = flag === Ajax.flags.MULTIPART_FLAG;
    const requestData = isMultipart ? formMaker(baseUrl, url, type, data, file, blob, flag) : JSON.stringify({
        url: `${baseUrl}/${url}`,
        method: type || 'GET',
        data: data || [],
        header : header,
        flag: flag || Ajax.flags.DEFAULT_FLAG
    });
    return $.ajax({
        url: window.Laravel.makeReqUrl,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').attr('value'),
            'Content-Type' : contentType,
            'accept' : dataType
        },
        data: requestData || [],
        xhrFields: {
            responseType: resType,
        },
        processData: !isMultipart, // Don't process data if it's FormData
        contentType: isMultipart ? false : 'application/json;charset=utf-8', // Set content type accordingly
        success: (success) => {
            StatusBar.run('İşlem başarılı', StatusBar.status.SUCCESS);
            onSuccess(success);
            Page.ready();
        },
        error: (xhr) => {
            StatusBar.run('İşlem sırasında bir sorun oluştu. Yöneticiyle iletişime geçin.', StatusBar.status.FAILURE);
            onError(xhr.responseText);
            Page.ready();
        },
        failure: (failure) => {
            StatusBar.run('İşlem başarısız. Geliştiricilerle iletişime geçin', StatusBar.status.ERROR);
            onFailure(failure.responseText);
            Page.ready();
        }
    });
};

const AjaxRunner = (baseUrl, url, type, data, file, blob, dataType, contentType,
                    flag = Ajax.flags.DEFAULT_FLAG,
                    onSuccess = success => console.log(success),
                    onFailure = failure => console.log(failure),
                    onError = error => console.log(error),
                    resType = 'text',
                    useMiddleware = true
)=>{
    return useMiddleware
        ?
        middlewareAjax(baseUrl, url, type, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType)
        : $.ajax({
            url:`${baseUrl}/${url}`,
            type: type,
            data:  flag !== Ajax.flags.MULTIPART_FLAG ? data : formMaker(baseUrl, url, type, data, file, blob, flag),
            processData: flag !== Ajax.flags.MULTIPART_FLAG,
            headers: null,
            contentType: flag !== Ajax.flags.MULTIPART_FLAG ? 'application/json;charset=utf-8' : false,
            xhrFields: {
                responseType: resType,
            },
            success: onSuccess,
            error: (xhr) => onError(xhr.responseText),
            failure: (failure) => onFailure(failure.responseText)
        });
};

const Ajax = {
    get: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType = 'text', useMiddleware) => {
        return AjaxRunner(baseUrl, url, 'GET', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType, useMiddleware);
    },
    post: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType = 'text', useMiddleware) => {
        return AjaxRunner(baseUrl, url, 'POST', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType, useMiddleware);
    },
    delete: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType = 'text', useMiddleware) => {
        return AjaxRunner(baseUrl, url, 'DELETE', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType, useMiddleware);
    },
    put: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType = 'text', useMiddleware) => {
        return AjaxRunner(baseUrl, url, 'PUT', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType, useMiddleware);
    },
    patch: (baseUrl, url, data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType = 'text', useMiddleware) => {
        return AjaxRunner(baseUrl, url, 'PATCH', data, file, blob, dataType, contentType, flag, onSuccess, onFailure, onError, resType, useMiddleware);
    },
    flags: {
        DEFAULT_FLAG: 0,
        MULTIPART_FLAG: 1
    },
    middleware : {
        useMiddleware : true,
        notUseMiddleware : false
    }
};

export default Ajax;

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
