import {initializeSelect2Auto} from "../../modules/bundles/select-bundle/select2.js";
import {FancyFileUploadAutoInit} from "../../modules/bundles/uploader-bundle/index.js";
import {apiPost} from "../../modules/bundles/api-controller/ApiController.js";

window.dictionary_adapter = dictionary => {
    console.log(dictionary)
};
window.description_adapter = data => ({id: data.id, text: data.description});
window.tag_adapter = data => ({id: data.id, text: data.tag});

class SlickContextAwareMediaFetcher {
    constructor(uri, selector, slick, handler, data) {
        this.slick = slick;
        this.selector = selector;
        this.handler = handler;
        this.uri = uri;
        this.data = data;
        this.current = {page: 1, size: slick.slidesToShow};
        this.__start();
    }

    __start() {
        $(this.selector).slick(this.slick);
        this.__search();
    }

    __search() {
        apiPost(this.uri,
            {
                data: this.data({
                    from: (this.current.page - 1) * this.current.size,
                    size: this.current.size
                }), format: 'application/json'
            }, {
                success: (data) => {
                    this.handler(data)
                        .every(each => $(this.selector).slick('slickAdd', each));
                }
            });
    }
}

$(document).ready(function () {
    initializeSelect2Auto();
    FancyFileUploadAutoInit(
        '#fancy-file-upload',
        '/_multipart/product/videos/stream-upload',
    );

    new SlickContextAwareMediaFetcher(
        '/_search/product_photo',
        '.photo-container', {
            autoplay: true,
            autoplaySpeed: 2000,
            appendArrows: '#dots-footer',
            draggable: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            focusOnSelect: true,
            nextArrow: '<button class="btn btn-primary">İleri</button>',
            prevArrow: '<button class="btn btn-warning">Geri</button>'
        },
        /**@var {{hits:{hits:[{_id:any,_source:{}}], total: {value:number}}}} **/
        (data) => {
            const array = [];
            data.hits.hits.every(hit => {
                    hit = hit._source;
                    const $img = $(`<div class="logo-img cursor-pointer" id="${hit.id}">`);
                    $(`<img src="${hit.path}" alt="${hit.altTag}" title="${hit.title}">`).appendTo($img);
                    array.push($img);
                    return array;
                },
                (query) => {
                    return {
                        ...query,
                        query: {bool: {filter: [{term: {product: "bd1a711d-ea0a-4398-902d-556a5fbb9851"}}]}}
                    };
                }
            );
        },
        (d)=>d);
});