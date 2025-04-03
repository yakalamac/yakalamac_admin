import JSONFileUploader from "../bulk/json-uploader/JSONFileUploader";
import JSONFile from "../json/JSONFile";

function initializeProductUploader(){
    $(document).ready(
        function (){
            const productBulkUploader = new JSONFileUploader('#buttonProductBulk')
                .init()
                .run();

            productBulkUploader.handleSingleUploader(
                function (e, array) {
                    const jsonFile = new JSONFile()
                    array.forEach(file => {
                        jsonFile.setFile(file).load().then(async (/*content TODO NON IN USE*/) => {
                            const jsonContent = jsonFile.getJsonContent();
                            let contentProducts = undefined;

                            if(jsonContent.hasOwnProperty('productList') && Array.isArray(jsonContent.productList))
                                contentProducts = jsonContent.productList;

                            if(jsonContent.hasOwnProperty('products') && Array.isArray(jsonContent.products))
                                contentProducts = jsonContent.products;

                            if(Array.isArray(contentProducts)) {
                                for(let product of contentProducts) {
                                    const result = await pushProduct(product);

                                    if(result.status > 199 && result.status < 300) {
                                        toastr.success(`Ürün ${product.name} başarıyla yüklendi.`);
                                    }

                                    if(result.status > 399 && result.status < 500){
                                        toastr.info(`Ürün ${product.name} yüklenirken bir hatayla karşılaştı`);
                                    }

                                    if(result.status === 500)
                                        toastr.error(`Ürün ${product.name} yüklenemedi. Yöneticiyle iletişime geçin`);
                                    console.info(result)
                                }
                            }
                        });
                    });
                });
        });
}