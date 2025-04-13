const table = $('#product-table');

table.AdvancedTable({
    paginationContainer: '#paginationContainer',
    ajax: {
        url: '/_search/product',
        type: 'POST',
        data: (query) => {
            return {
                from: query.size*(query.page-1),
                size: query.size
            };
        }
    },
    itemSource: '_source',
    dataConvert: (data)=>{
        return {size: data.hits.hits.length, total: data.hits.total.value, data: data.hits.hits}
    },
    columns: [
        {html:()=>'<input class="form-check-input" type="checkbox">'},
        {html: (data)=> {
                return `
                <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                            <img src="${data.photos.length>0 ? data.photos[0].path.replace('/dev/','/main/') : undefined}" width="70" class="rounded-3" alt="">
                        </div>
                        <div class="product-info">
                            <a href="/${data.id}" class="product-title">${data.name}</a>
                            <p class="mb-0 product-category">Category : Fashion</p>
                        </div>
                    </div>
                `;
            }
        },
        {data: 'price', html: (price)=>`${price} ₺`},
        {data: 'categories'},
        {
            data:'hashtags',
            html: (tags)=> {
                return `<div class="product-tags">${
                    tags.map(tag=>`<a href="javascript:;" class="btn-tags">${tag.tag}</a>`)
                        .join('')}
                </div>`;
            }
        },
        {data: 'rating', html: rating =>
                `<div class="product-rating"><i class="bi bi-star-fill text-warning me-2"></i><span>${rating ?? 0}</span></div>`
        },
        {data:'createdAt',html: createdAt=>{
                const dt = Date.parse(createdAt);
                const date = new Date();
                date.setTime(dt);
                return date.toLocaleDateString()
            }
        }
    ],
    actions: [{name: 'Sil'}, {name: 'Düzenle',href:data=>data.id}]
});
