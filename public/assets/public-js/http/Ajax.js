

const ajaxMaker = (baseUrl, url, type, data, file, blob, dataType, contentType, onSuccess, onFailure, onError) => {
    return $.ajax(
        {
            url: window.Laravel.makeReqUrl,
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').attr('value')
            },
            data: JSON.stringify({
                url: baseUrl+'/'+url,
                method: type,
                data: data
            }),
            dataType: dataType,
            contentType: contentType,
            success: onSuccess,
            error: (xhr)=>onError(xhr.responseText),
            failure: (failure)=>onFailure(failure.responseText),
            file: file,
            blob: blob
        }
    );
}

export default {
    get : (baseUrl, url, data, file, blob, dataType, contentType, onSuccess, onFailure, onError)=>{
        return ajaxMaker(baseUrl, url, 'GET', data, file, blob, dataType, contentType, onSuccess, onFailure, onError);
    },
    post : (baseUrl, url, data, file, blob, dataType, contentType, onSuccess, onFailure, onError)=>{
        return ajaxMaker(baseUrl, url, 'POST', data, file, blob, dataType, contentType, onSuccess, onFailure, onError);
    },
    delete : (baseUrl, url, data, file, blob, dataType, contentType, onSuccess, onFailure, onError)=>{
        return ajaxMaker(baseUrl, url, 'DELETE', data, file, blob, dataType, contentType, onSuccess, onFailure, onError);
    },
    put : (baseUrl, url, data, file, blob, dataType, contentType, onSuccess, onFailure, onError)=>{
        return ajaxMaker(baseUrl, url, 'PUT', data, file, blob, dataType, contentType, onSuccess, onFailure, onError);
    },
    patch : (baseUrl, url, data, file, blob, dataType, contentType, onSuccess, onFailure, onError)=>{
        return ajaxMaker(baseUrl, url, 'PATCH', data, file, blob, dataType, contentType, onSuccess, onFailure, onError);
    }
};
