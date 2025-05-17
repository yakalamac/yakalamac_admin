import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";
import {apiPost} from "../../modules/api-controller/ApiController.js";

window.dictionary_adapter = dictionary => {
    console.log(dictionary)
};
window.description_adapter = data => ({id: data.id, text: data.description});
window.tag_adapter = data => ({id: data.id, text: data.tag});

initializeSelect2Auto();