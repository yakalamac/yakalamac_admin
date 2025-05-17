import {initializeSelect2Auto} from "../../modules/select-bundle/select2.js";
import {FancyFileUploadAutoInit} from "../../modules/uploader-bundle/index.js";
import {apiPost} from "../../modules/api-controller/ApiController.js";

window.dictionary_adapter = dictionary => {
    console.log(dictionary)
};
window.description_adapter = data => ({id: data.id, text: data.description});
window.tag_adapter = data => ({id: data.id, text: data.tag});

// todo (must be better)
class SlickContextAwareMediaFetcher
{
    constructor(uri, selector, slick, handler, data, supports) {
        this.slick = slick;
        this.selector = selector;
        this.handler = handler;
        this.uri = uri;
        this.data = data;
        this.current = {page: 1, size: slick.slidesToShow, total: 0};
        this.lastResponse = undefined;
        this.supports = supports;
        this.__start();
    }

    __start() {
        $(this.selector).slick(this.slick);
        this.__search();

        $(this.selector).on('afterChange', (slick, currentSlide)=> {
            // todo (Look if tab is active)
            if(this.current.total <= (currentSlide.currentSlide+1) && this.supports(this.lastResponse, this.current.total)) {
                this.current.page++;
                this.__search();
            }
        });
    }

    __search() {
        apiPost(this.uri,
            {
                data: this.data({
                    from: (this.current.page - 1) * (this.current.size * 2),
                    size: this.current.size * 2
                }), format: 'application/json'
            }, {
                success: (data) => {
                    const result = this.handler(data);

                    if(!Array.isArray(result) || result.length === 0) {
                        return;
                    }

                    result.forEach((each, index) => {
                        if(index >= this.current.size) {
                            const currentItem = $(each).find('img');
                            const source = currentItem.attr('src');
                            currentItem.removeAttr('src');
                            currentItem.attr('data-lazy', source);
                        }

                        $(this.selector).slick('slickAdd', each)
                    });

                    this.lastResponse = data;
                    this.current.total += result.length;
                }
            });
    }
}

$(document).ready(function () {
    initializeSelect2Auto();
    FancyFileUploadAutoInit(
        '#fancy-file-upload',
        `/partner/products/${window.product.id}/photo`,
        {
            product: `/api/products/${window.product.id}`
        }, ['png', 'jpg'],
        {
            listener: '#btn-add-photo',
            modal: '#photo-add-modal'
        }
    );

    new SlickContextAwareMediaFetcher(
        '/_search/product_photo',
        '.photo-container', {
            autoplay: true,
            autoplaySpeed: 2000,
            appendArrows: '#dots-footer',
            draggable: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            focusOnSelect: true,
            nextArrow: '<button class="btn btn-primary">İleri</button>',
            prevArrow: '<button class="btn btn-warning">Geri</button>'
        },
        /**@var {{hits:{hits:[{_id:any,_source:{}}], total: {value:number}}}} **/
        (data) => {
            return data.hits.hits.map(hit => {
                    hit = hit._source;
                    const $img = $(`<div class="logo-img cursor-pointer" id="${hit.id}">`);
                    $(`<img src="${hit.path}" alt="${hit.altTag}" title="${hit.title}" height="300">`).appendTo($img);
                    return $img;
                }
            );
        },
        (d)=>d,
        (data, total) => {
            return data.hits.total.value > total;
        }
    );
});