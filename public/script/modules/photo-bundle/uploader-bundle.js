import BulkImageUploader from "../bulk/bulk-image-uploader/BulkFileUploder";

const imageUploader = new BulkImageUploader(
    '#testButtonBulk',
    {
        event: 'click',
        onEvent: () => console.log("test"),
        data: { placeName }
    }
).init().run().handleFancyUploadOnComplete((/* event, data TODO NON IN USE*/) => {/*Nothing*/})
    .handleFancyUploadOnStart(function (e, data) {
        const report = {success: '', error: '', failure: ''};
        const saveAllButton = $(`#${imageUploader.fancyFileUpload.buttonUploadAll}`);
        const originalButtonText = saveAllButton.html();
        saveAllButton.prop('disabled', true).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Lütfen bekleyiniz`);

        const ajaxPromises = data.files.map(file => {
            return new Promise((resolve, reject) => {
                const description = data.context.find('.description-input').val() || placeName;
                const category = data.context.find('.category-select').val();
                const showOnLogo = data.context.find('.showOnLogo').is(':checked');
                const showOnBanner = data.context.find('.showOnBanner').is(':checked');

                if (file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                    const form = new FormData();
                    form.append('file', file);

                    form.append(
                        'data',
                        JSON.stringify({
                            title: description,
                            altTag: description,
                            category: category, // '/api/category/place/photos/1',
                            showOnBanner: showOnBanner,
                            showOnLogo: showOnLogo,
                            place: `/api/places/${placeId}`
                        })
                    );

                    $.ajax({
                        url: `/_api/api/place/photos`,
                        method: 'POST',
                        data: form,
                        contentType: false,
                        processData: false,
                        success: (response) => {
                            if (response && response.hasOwnProperty('exception') && response.exception) {
                                report.error += `Hata: ${response.exception}\n`;
                                console.error(response);
                                reject(response.exception || 'Bilinmeyen hata');
                            } else {
                                report.success += `${description} başarıyla yüklendi.\n`;
                                resolve();
                            }
                        },
                        error: (e) => {
                            report.error += e.responseText + '\n';
                            console.error(e);
                            reject('Hata oluştu');
                        },
                        failure: (e) => {
                            report.failure += e.responseText + '\n';
                            console.info(e);
                            reject('Başarısız');
                        }
                    });
                } else {
                    alert('Lütfen geçerli bir resim dosyası seçiniz.');
                    reject('Geçersiz dosya türü');
                }
            });
        });

        Promise.all(ajaxPromises).then(() => toastr.success(report.success))
            .catch(() => {
                if (report.error) {
                    toastr.error(report.error);
                }
                if (report.failure) {
                    toastr.info(report.failure);
                }
            })
            .finally(() => saveAllButton.prop('disabled', false).html(originalButtonText));
    });