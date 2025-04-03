
async function saveSources() {
    const placeId = $('#page-identifier-place-id').val();
    const sourcesContainer = $('#sources-container');
    const sourceUrlInputs = sourcesContainer.find('.source-url-input');

    let existingSources = window.transporter.place.sources || [];
    const existingSourcesMap = {};
    existingSources.forEach(source => {
        existingSourcesMap[source.category.id] = source;
    });

    const ajaxPromises = sourceUrlInputs.map(function () {
        const urlInput = $(this);
        const categoryId = urlInput.data('category-id');
        const sourceUrl = urlInput.val().trim();
        const sourceId = sourcesContainer.find(`.source-id-input[data-category-id="${categoryId}"]`).val().trim();

        const existingSource = existingSourcesMap[categoryId];

        if (sourceUrl !== '') {
            if (existingSource) {
                if (existingSource.sourceUrl === sourceUrl && existingSource.sourceId === sourceId) {
                    return Promise.resolve();
                }
                const patchData = { sourceUrl, sourceId };
                return $.ajax({
                    url: `/_route/api/api/source/places/${existingSource.id}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify(patchData),
                    headers: { 'Accept': 'application/ld+json' },
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error(`Kaynak güncelleme hatası (ID: ${existingSource.id}):`, error);
                    toastr.error('Kaynak güncellenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            } else {
                const postData = {
                    place: `/api/places/${placeId}`,
                    category: `/api/category/sources/${categoryId}`,
                    sourceUrl,
                    sourceId
                };
                return $.ajax({
                    url: '/_route/api/api/source/places',
                    type: 'POST',
                    contentType: 'application/ld+json',
                    data: JSON.stringify(postData),
                    headers: { 'Accept': 'application/ld+json' },
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).then(response => {
                    existingSources.push(response);
                }).catch(error => {
                    console.error('Kaynak oluşturma hatası:', error);
                    toastr.error('Kaynak eklenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        } else {
            if (existingSource) {
                return $.ajax({
                    url: `/_route/api/api/source/places/${existingSource.id}`,
                    type: 'DELETE',
                    headers: { 'Accept': 'application/ld+json' },
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).then(() => {
                    existingSources = existingSources.filter(source => source.category.id !== categoryId);
                }).catch(error => {
                    console.error(`Kaynak silme hatası (ID: ${existingSource.id}):`, error);
                    toastr.error('Kaynak silinirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        }

        return Promise.resolve();
    }).get();

    try {
        await Promise.all(ajaxPromises);
        window.transporter.place.sources = existingSources;
    } catch (error) {
        console.error('Kaynakları kaydederken hata oluştu:', error);
    }
}
