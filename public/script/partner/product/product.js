import {apiDelete, apiPatch} from "../../modules/api-controller/ApiController.js";
window.stopPchangeEventReload = true;

$(document).ready(()=>{

    window.addEventListener('pnotfound', ()=>{
        console.log('pnotfound');
    });

    /**
     * @var $
     * @method DataTable
     * */
    const table = $('#product-table');

    const datatable = table.DataTable({
        processing: true, serverSide: true,
        ajax: (data, callback)=> {
            /** @var {{pid:undefined|string}} window.activePlace */
            if (window.activePlace?.pid === undefined) {
                return callback({
                    draw: data.draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: []
                });
            }

            const q = {
                query: {bool: {filter: [{bool:{should:[{nested:{ignore_unmapped: true, path:'place', query: {bool:{must:[{term:{'place.id':window.activePlace.pid}}]}}}}, {term: {place: window.activePlace.pid}}], minimum_should_match: 1}}]}},
                from: data.length * (data.start / data.length), size: data.length
            };

            if(data.search && data.search.value.length > 2) {
                q.query.bool.must = [{multi_match: {query: data.search.value, fields: ['name','tags.tag','categories.description','types.description']}}];
            }

            $.ajax({
                url: '/_search/product', type: 'POST', data: q,
                /** @var {{draw:number,hits:{total:{},hits:[]}}} response */
                success: function (response) {
                    callback({
                        draw: data.draw,
                        recordsTotal: response.hits.total.value,
                        recordsFiltered: response.hits.total.value,
                        data: response.hits.hits
                    });
                },
                error: function (e) {
                    console.error(e);
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                }
            });
        },
        columns: [
            {render:()=>'<input class="form-check-input cursor-pointer selected-item" type="checkbox">'},
            /** @var {{logo: ?string}} data*/
            {data: '_source', render: (data)=> {
                    return `
                <div class="d-flex align-items-center gap-3">
                        <div class="product-box">
                            <img src="${data.logo?.path ?? 'https://cdn.yaka.la/assets/web/logo-removebg.png'}" width="70" class="rounded-3" alt="${data.logo?.altTag ?? 'yakalamac'}">
                        </div>
                        <div class="product-info">
                            <a href="/partner/products/${data.id}" class="product-title">${data.name}</a>
                            <p class="mb-0">
                                <div class="form-check form-switch">
                                    <input class="form-check-input product-active" type="checkbox" role="switch" id="flexActiveElement_${data.id}" ${data.active?'checked':''} data-id="${data.id}">
                                    <label class="form-check-label" for="flexActiveElement_${data.id}">Siparişe Açık</label>
                                </div>
                            </p>
                        </div>
                    </div>
                `;
                }
            },
            {data: '_source.price', render: (price)=>`${price} ₺`},
            {data: '_source.categories', render:(ctgs, type, row)=>{
                    return `<div class="product-tags" data-key="categories" data-prod-id="${row._id}">${ctgs.map(c=> 
                            `<a class="btn-tags cursor-pointer" data-type="category" id="${c.id}">${c.description}</a>`).join('')}</div>`;
            }},
            {data:'_source.hashtags',
                render: (tags, type, row)=> {
                    return `<div class="product-tags" data-key="hashtags" data-prod-id="${row._id}">${
                        tags.map(tag=>`<a class="btn-tags cursor-pointer" data-type="tag" id="${tag.id}">${tag.tag}</a>`)
                            .join('')}</div>`;
                }
            },
            {data: '_source.rating', render: rating =>
                    `<div class="product-rating"><i class="bi bi-star-fill text-warning me-2"></i><span>${rating ?? 0}</span></div>`
            },
            {data:'_source.createdAt', render: createdAt=>{
                    const dt = Date.parse(createdAt);
                    const date = new Date();
                    date.setTime(dt);
                    return date.toLocaleDateString()
                }
            },
            {
                /** @var {{_id, _source}} data */
                data: undefined, render:(data)=>{
                    return `<div class="dropdown">
                    <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots"></i></button><ul class="dropdown-menu">
                        <li><a class="dropdown-item cursor-pointer deleteprod" data-prod-id="${data._id}">Sil</a></li>
                        <li><a class="dropdown-item" href="/partner/products/${data._id}">Düzenle</a></li>
                    </ul></div>`
                }
            }
        ], pageLength: 15, lengthMenu: [15, 30, 50, 100, 200], dom: 'lfrtip',
    });

    $('.dataTables_filter').remove();
    let currentTimeout = undefined;
    $('input[data-search="dtable"]').on('input',function (){
        clearTimeout(currentTimeout);

        currentTimeout = setTimeout(()=>{
            const value = $(this).val();
            if(value.length > 2) datatable.search(value).draw();
            else if(value.length === 0) datatable.search(value).draw();
        }, 1000);
    });

    $('.dataTables_length').remove();
    const tl = $('select#table-length');

    const lengthMenu = datatable.settings()[0].aLengthMenu.flat();
    lengthMenu.forEach(length => {
        tl.append(`<option value="${length}">${length}</option>`);
    });

    tl.on('change', (e) => {
        const newLength = parseInt(e.currentTarget.value, 10);
        datatable.page.len(newLength).draw();
    });

    window.addEventListener('pchange', ()=> datatable.ajax.reload());
    $(window).on('click', function (e){
        if(e.target.classList.contains('btn-tags')) {
            const parent = $(e.target).parent('.product-tags');
            const array = [];
            parent.children().map((index, element) => {
                if(element === e.target) return;
                array.push(`/api/${$(element).data('type')}/products/${element.id}`);
            });
            apiPatch(`/_json/products/${parent.data('prod-id')}`, {
                [parent.data('key')]: array},
                {successMessage: 'başarılı', success: ()=>e.target.remove()}
            );
        }
        if(e.target.classList.contains('deleteprod')) {
            const id = $(e.target).data('prod-id');
            if(typeof id !== "string" || id.length === 0)return;
            apiDelete(`/_json/products/${id}`,{successMessage:'Ürün silindi',success:()=>{
                    const $row = $(e.target).closest('tr[role="row"]');
                    $row.remove();
                    if($row.length === 0) {
                        datatable.ajax.reload();
                    }
                }
            });
        }
    });

    table.on('click', '.product-active',function (){
        const id = $(this).data('id');
        if(typeof(id) !== 'string' || id.length === 0) return;
        apiPatch(`/_json/products/${id}`, {
            active: $(this).is(':checked')
        });
    });

    table.on('click', '#selectall', function (){
        const checked = $(this).is(':checked');
        $('input.selected-item').prop('checked',checked);
    });

    table.on('click','.selected-item',function (){
        //todo
    });

    window.addEventListener('exportcurrentpage', ()=>{
        const indexes = datatable.rows({ search: 'applied' }).indexes().toArray();
        const data = datatable.rows({ search: 'applied' }).data();
        if(Array.isArray(indexes) && indexes.length > 0) {
            const map = {
                hashtags: {
                    header: 'Etiketler',
                    value: (data)=>Array.from(data).map(x=> x.tag).join(' - ')
                },
                categories: {
                    header: 'Kategoriler',
                    value: (data)=>Array.from(data).map(x=> x.description).join(' - ')
                },
                types: {
                    header: 'Türler',
                    value: (data)=>Array.from(data).map(x=> x.description).join(' - ')
                },
                logo: {
                    header: 'Logo',
                    value: (data)=>data.logo?.path ?? 'https://cdn.yaka.la/assets/web/logo-removebg.png'
                },
                name: {
                    header: 'İsim',
                    value: (data)=>data.name??''
                },
                price: {
                    header: 'Fiyat',
                    value: (data)=>data.price ?? ''
                },
                rating: {
                    header: 'Puan',
                    value: (data)=>data.rating ?? ''
                },
                description: {
                    header: 'Açıklama',
                    value: (data)=>data.description ?? ''
                },
                createdAt: {
                    header: 'Oluşturulma Tarihi',
                    value: (data)=>data.createdAt.toString()
                },
                updatedAt: {
                    header: 'Güncellenme Tarihi',
                    value: (data)=>data.updatedAt.toString()
                },
                active: {
                    header: 'Aktif',
                    value: (data)=>data.active === true ? 'EVET' : 'HAYIR'
                }
            };

            let csvRows = [];

            csvRows.push(Object.values(map).map(m => `"${m.header}"`).join(','));

            indexes.forEach(i => {
                let rowData = data[i];

                if (rowData && typeof rowData === 'object' && rowData.hasOwnProperty('_source')) {
                    rowData = rowData._source;
                }

                const row = Object.keys(map).map(key => {
                    try {
                        return `"${map[key].value(rowData[key])}"`;
                    } catch (e) {
                        return '""';
                    }
                }).join(',');

                csvRows.push(row);
            });

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\r\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

});