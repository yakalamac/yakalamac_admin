const localcache = [];
const modalHandler = (button, body, footer = undefined) => {
    const cardBody = $(button).closest('div.card-body');
    if(cardBody.length === 0) return;
    const title = cardBody.find('h5.card-title');
    if(title.length === 0) return;
    modalFactory(title.text(), body, footer);
};

/**
 * @param element
 */
handleCampaignProducts = (element) => {
    const card = $(element).closest('div.card-body');
    if(card.length === 0) return;
    const id = card.attr('id');
    if(!localcache[id]) {
        localcache[id] = [];
        $.ajax({
            url: `/partner/campaigns/yakala/list/${id}/products`,
            method: 'GET',
            success: data => {
                console.log(data);
            }
        });
        return;
    }
    console.log(localcache[id]);
    //todo
}

const buttonMap = [
    {
        /** @param {{givenPlaceExists: boolean, campaignType: string}} campagin */
        supports: campagin => campagin.givenPlaceExists && campagin.campaignType === 'PRODUCT_BASE',
        text: 'Daha fazla ürün ekleyin',
        campaign_action: 'add-more-product',
        classname: 'btn btn-success px-5',
        action: element=>{
            handleCampaignProducts(element);
        }
    },
    {
        supports: campagin => !campagin.givenPlaceExists && campagin.campaignType === 'PRODUCT_BASE',
        text: 'Ürünlerinizi ekleyin', campaign_action: 'add-products', classname: 'btn btn-primary px-5',
        action: element=>{
            handleCampaignProducts(element);
            modalHandler(
                element, `<div class="card-body">
                                  <p class="fs-5">Ürünleriniz</p><div class="my-3 border-top"></div>
                                  <div class="d-flex align-items-center gap-3">
                                    <a class="d-block flex-shrink-0" href="javascript:;">
                                      <img src="assets/images/top-products/06.png" width="60" height="60" alt="Product">
                                    </a>
                                    <div class="ps-2">
                                      <h6 class="mb-1"><a href="javascript:;" class="text-white">White Polo T-Shirt</a>
                                      </h6>
                                      <div class="widget-product-meta"><span class="me-2">$19.<small>00</small></span><span class="">x 1</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="my-3 border-top"></div>
                                  <div class="d-flex align-items-center gap-3">
                                    <a class="d-block flex-shrink-0" href="javascript:;">
                                      <img src="assets/images/top-products/05.png" width="60" height="60" alt="Product">
                                    </a>
                                    <div class="ps-2">
                                      <h6 class="mb-1"><a href="javascript:;" class="text-white">White Polo T-Shirt</a>
                                      </h6>
                                      <div class="widget-product-meta"><span class="me-2">$19.<small>00</small></span><span class="">x 1</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="my-3 border-top"></div>
                                  <div class="d-flex align-items-center gap-3">
                                    <a class="d-block flex-shrink-0" href="javascript:;">
                                      <img src="assets/images/top-products/04.png" width="60" height="60" alt="Product">
                                    </a>
                                    <div class="ps-2">
                                      <h6 class="mb-1"><a href="javascript:;" class="text-white">White Polo T-Shirt</a>
                                      </h6>
                                      <div class="widget-product-meta"><span class="me-2">$19.<small>00</small></span><span class="">x 1</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="my-3 border-top"></div>
                                  <div class="d-flex align-items-center gap-3">
                                    <a class="d-block flex-shrink-0" href="javascript:;">
                                      <img src="assets/images/top-products/03.png" width="60" height="60" alt="Product">
                                    </a>
                                    <div class="ps-2">
                                      <h6 class="mb-1"><a href="javascript:;" class="text-white">Fancy Red Sneakers</a>
                                      </h6>
                                      <div class="widget-product-meta"><span class="me-2">$16.<small>00</small></span><span class="">x 2</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="my-3 border-top"></div>
                                  <div class="d-flex align-items-center gap-3">
                                    <a class="d-block flex-shrink-0" href="javascript:;">
                                      <img src="assets/images/top-products/02.png" width="60" height="60" alt="Product">
                                    </a>
                                    <div class="ps-2">
                                      <h6 class="mb-1"><a href="javascript:;" class="text-white">Yellow Shine Blazer</a>
                                      </h6>
                                      <div class="widget-product-meta"><span class="me-2">$22.<small>00</small></span><span class="">x 1</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="my-3 border-top"></div>
                                  <div class="d-flex align-items-center gap-3">
                                    <a class="d-block flex-shrink-0" href="javascript:;">
                                      <img src="assets/images/top-products/01.png" width="60" height="60" alt="Product">
                                    </a>
                                    <div class="ps-2">
                                      <h6 class="mb-1"><a href="javascript:;" class="text-white">Men Black Hat Cap</a>
                                      </h6>
                                      <div class="widget-product-meta"><span class="me-2">$14.<small>00</small></span><span class="">x 1</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>`);
        }
    },
    {
        supports: campagin => campagin.givenPlaceExists && campagin.campaignType === 'GENERAL_BASE',
        text: 'Katılım sağlandı', campaign_action: 'joined', classname: 'btn btn-warning px-5 disabled',
        action: element=>{
            modalHandler(element,'Bu kampanyaya zaten katılım sağladınız');
        }
    },
    {
        supports: campagin => !campagin.givenPlaceExists && campagin.campaignType === 'GENERAL_BASE',
        text: 'Şimdi katılın', campaign_action: 'join', classname: 'btn btn-warning px-5',
        action: element=>{
            const dynamicId = Date.now().toString();
            modalHandler(
                element,
                'Bu kampanyaya katılım sağlamak istiyor musunuz? Bu işlem geri alınamaz.',
                `<button class="btn btn-success" id="${dynamicId}">Katıl</button>`
            );

            $(`button#${dynamicId}`).on('click',()=>{
                console.log('Katılım sağlandı');
            });
        }
    }
];

const modalFactory = (title, body, footer='')=>{
    $('#action-modal #title').text(title);
    $('#action-modal #body').html(body);
    if(typeof footer === 'string' && footer.length > 0)
        $('#action-modal #footer').html(footer);
    $('#action-modal').modal('show');
}

/**
 * @param {{banner: object}} data
 * @returns {string}
 */
const imageFactory2 = data=> {
    if(data.banner)
        return `<img src="${data.banner?.path}" class="w-100 mb-4 rounded" alt="${data.banner?.altTag}"
         title="${data.banner?.title}" style="min-height: 100px"/>`;
    return `<img style="min-height: 100px" src="https://yakalamac.b-cdn.net/assets/web/yakalamac-icon.png" class="w-100 mb-4 rounded" alt="yakalamac" title="yakalamac">`;
}

const layoutFactory2 = data=>{
    const button = buttonMap.find(each => each.supports(data));
    return $(`
        <div class="col-3">
            <div class="card">
                <div class="card-body" id="${data.id}">
                        ${imageFactory2(data)}
                        <h5 class="card-title mb-4 text-center">${data.name}</h5>
                        <p class="card-text mb-4">${data.description}</p>  
                        <button class="${button.classname} w-100 raised" data-action="${button.campaign_action}">${button.text}</button>
                </div>
            </div>
        </div>
    `);
};

class DataTableLikeFetch {
    constructor(selector, ajax, data) {
        this.ajax = ajax;
        this.loading = false;
        this.pagination = {
            page: 1,
            size: 15
        };

        if($(selector).length === 0) {
            throw new Error('Invalid selector');
        }

        this.observerSelector = `dtlf_${Date.now().toString()}`;

        $(selector).after(`<div id="${this.observerSelector}">`);

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry=>{
                if(entry.isIntersecting) {
                    this.next();
                }
            })
        }, {
            root: null, rootMargin: '0px', threshold: 1.0
        });

        this.observer.observe(
            document.querySelector(
                'div#'+this.observerSelector
            )
        );

        this.lastResponse = undefined;
        if (data === undefined) {
            this.fetch();
        } else {
            this.loading = true;
            this.lastResponse = data;
            this.ajax.success(data);
            this.loading = false;
        }
    }

    fetch() {
        this.loading = true;
        $.ajax({
            ...this.ajax,
            data: typeof this.ajax?.data === 'function'
                ? this.ajax.data(this.pagination) : (
                    typeof this.ajax.data === 'object' ? {...this.ajax.data, ...this.pagination}
                        : this.pagination
                )
        }).then(r => {
            this.lastResponse = r;
            this.loading = false;
        });
    }

    next() {
        if(this.loading) return;
        if(this.lastResponse === undefined) return;

        if (
            this.lastResponse['hydra:totalItems'] < (this.pagination.page * this.pagination.size)
            ||
            this.lastResponse['hydra:member'].length < this.pagination.size
        ) {
            this.pagination.page++;
            this.fetch();
        }
    }
}

$(document).ready(() => {
    const container = $('#container');
    const fetcher = new DataTableLikeFetch(
        'div#container',
        {
            url: '/partner/campaigns/yakala/list',
            method: 'POST',
            success: data => {
                if (Array.isArray(data['hydra:member'])) {
                    Array.from(data['hydra:member']).forEach(each => {
                        container.append(layoutFactory2(each));
                    });
                }
            },
            error: e => console.log(e.responseText)
        },
        window.hasOwnProperty('initialData') ? window.initialData : undefined
    );

    window.addEventListener('click', event=>{
       if(event.target.hasAttribute('data-action')) {
           const attribute = event.target.getAttribute('data-action');
           const founded = buttonMap.find(each => each.campaign_action === attribute);
           if(founded !== undefined) {
               if(window.currentUser.exists(window.activePlace?.pid)) founded.action(event.target);
               else {
                   const length = window.currentUser.places.ownered.length + window.currentUser.places.managed.length;
                   const message = length === 0 ? 'Kayıtlı ya da kullanıma hazır işletme bulunamadığı için bu işlem gerçekleştirilemez.' :
                       'Kampanya katılımı sırasında bir sorun oluştu. Kayıtlı işletmeleriniz listesinden işlem yapmak istediğiniz işletmeyi seçiniz ya da sayfayı yenilemeyi deneyin. Bir sorun olduğunu düşünüyorsanız lütfen iletişime geçin.';
                   modalFactory('Aktif işletme bulunamadı',`<p>${message}</p>`);
               }
           }
       }
    });
});