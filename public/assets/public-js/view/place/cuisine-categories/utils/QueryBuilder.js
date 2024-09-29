const elasticParameters = (param, value, paginationSize=15) => {
    if(value === '')
        return '';

    switch (param) {
        case 'query':
            return `q=${value}&`;
        case 'page':
            return `from=${(value-1)*paginationSize}&`;
        case 'per_page':
            return `size=${value}&`;
        default:
            return `${param}=${value}&`; // Return the original if no match
    }
};

const apiParameters = (param, value) => {
    if(value === '')
        return '';
    switch (param) {
        case 'query':
            return `search=${value}&`;
        case 'page':
            return `page=${value}&`;
        case 'per_page':
            return `limit=${value}&`;
        default:
            return `${param}=${value}&`; // Return the original if no match
    }
};

const builderFunction = (mode) => {
    switch (mode) {
        case Builder.mode.ELASTICSEARCH:
            return elasticParameters;
        case Builder.mode.API:
            return apiParameters;
        default:
            throw new Error('Invalid mode provided');
    }
};

const Builder = {
    build: function (url, mode, page = 1, paginationSize = 15) {
        const builder = builderFunction(mode);
        let template = '';

        let queryString = location.href
            .trim()
            .split('?')[1];

        if (!queryString)
            queryString = `page=${page}&per_page=${paginationSize}&query=`;

        if(!queryString.includes('per_page'))
            queryString+='&per_page='+paginationSize;

        queryString.split('&').forEach((parameter) => {
            const parameterParts = parameter.split('=');
                template += builder(parameterParts[0], parameterParts[1] ? encodeURIComponent(parameterParts[1]) : '', paginationSize);
        });
        template = template.replace(/&$/, '').trim(); // Remove trailing '&'

        return template.length > 0 ? `${url}?${template}` : url;
    },
    mode: {
        ELASTICSEARCH: 1,
        API: 2
    }
};

export default Builder;
