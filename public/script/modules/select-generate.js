function generateSelectOptions(data, allOptions, type) {
    let template = '';
    if (data && Array.isArray(data)) {
        data.forEach(d => {
            template += `<option value="${d.id}" selected>${d.description}</option>`;
        });
    }
    allOptions.forEach(option => {
        template += `<option value="${option._id}">${option._source.description}</option>`;
    });
    return `<select data-placeholder="Hiç ${type} belirtilmedi" multiple class="form-select ${type}-select">${template}</select>`;
}



function extractCategoryId(category) {
    if (typeof category === 'object' && category['@id']) {
        return category['@id'].split('/').pop();
    } else if (typeof category === 'string') {
        return category.split('/').pop();
    }
    console.error('Beklenmeyen category tipi:', category);
    return null;
}