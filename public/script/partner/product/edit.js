import {initializeSelect2Auto} from "../../modules/bundles/select-bundle/select2.js";

window.dictionary_adapter=dictionary=>{
    console.log(dictionary)
};

window.description_adapter=data=>{

};

window.tag_adapter=data=>{

};

$(document).ready(function () {
    initializeSelect2Auto();

});