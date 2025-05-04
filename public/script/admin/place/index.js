'use strict';
if(!window.hasOwnProperty('moment')) throw new Error('moment');
if(!window.$.fn.DataTable) throw new Error('No data-tables found.');
import {apiDelete} from "../../modules/api-controller/ApiController.js";

$.InitializeAddressZone(undefined,true);

/**
 * @param value
 * @param category
 * @returns {{nested: {path: string, query: {bool: {must: [{match: {"address.addressComponents.shortText"}},{nested: {path: string, query: {match: {"address.addressComponents.category.title"}}}}]}}}}}
 */
function addressComponentsQuery(value, category) {
    return {
        nested: {
            path: 'address.addressComponents',
            query: {
                bool: {
                    must: [
                        {match: {'address.addressComponents.shortText': value}},
                        {
                            nested: {
                                path: 'address.addressComponents.category',
                                query: {
                                    match: {'address.addressComponents.category.title': category}
                                }
                            }
                        }
                    ]
                }
            }
        }
    };
}


$(document).ready(function () {
    const table = $('table#places');

    const dataTable = table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_search/place",
            type: "POST",
            dataType: "json",
            dataSrc: "data",
            data: function (query) {
                const builded = {from: query.start, size: query.length, track_total_hits: true, draw: query.draw};

                if (typeof query.search?.value === 'string' && query.search.value.length > 2) {
                    builded.query = {
                        bool: {
                            must: [
                                {
                                    multi_match: {
                                        query: query.search.value,
                                        fields: query.columns
                                            .map(column => column.searchable && column.name.length > 0 ? column.name : undefined)
                                            .filter(column => column !== undefined)
                                    }
                                }
                            ]
                        }
                    };
                }

                $('select[data-filter]').each((index, element)=>{
                    element.value = element.value.trim();
                    if(element.value.length > 0) {
                        if(!builded.query) {
                            builded.query = {bool: {must:[]}};
                        }
                        builded.query.bool.must.push(
                            addressComponentsQuery(element.value, element.getAttribute('data-filter'))
                        );
                    }
                });

                if (Array.isArray(query.order) && query.order.length > 0) {
                    builded.order = [];
                    query.order.forEach((order, key) => {
                        const current = query.columns[key] ?? undefined;
                        if (current?.orderable && current.name?.length > 0) {
                            builded.order.push({
                                [current.name]: {
                                    order: query.dir,
                                    unmapped_type: 'keyword'
                                }
                            });
                        }
                    });
                }

                return builded;
            },
            dataFilter: (response) => {
                if (typeof response === 'string') response = JSON.parse(response);
                return JSON.stringify({
                    draw: response.draw,
                    data: response.hits.hits,
                    recordsTotal: response.hits.total.value,
                    recordsFiltered: response.hits.total.value
                });
            },
            error: function (xhr, error, as) {
                console.error('DataTables AJAX hatası:', error, xhr, as);
            }
        },
        columns: [
            {
                data: "_source",
                render: (data) => {
                    return `<div><a title="${data.id}"><u>${data.id.slice(0, 5)}...</u></a><br>
                        <a title="${data?.primaryType?.description ?? ''}"><b>${data?.primaryType?.description ? data?.primaryType?.description.slice(0, 10) : 'Belirtilmedi'}</b> </a>
                        <br><a title="${data.hasOwnProperty('createdAt') ? moment(data.createdAt).format('DD.MM.YYYY - HH:mm') : ''}">${data?.createdAt ? moment(data.createdAt).format('DD.MM.YYYY') : 'Belirtilmedi'}</a></div>`;
                }
            },
            { data: "_source.name", orderable: true, name: 'name'},
            {
                data: "_source.address", orderable: true, name: 'address.shortAddress',
                render: (data) => {
                    const text = data.shortAddress ?? 'Kısa adres bilgisi mevcut değil';
                    return `<span title="${data.longAddress ?? undefined}">${text}</span>`;
                }
            },
            {
                data: "_source.updatedAt", orderable: true,
                render: data => moment(data).format('DD.MM.YYYY - HH:mm')
            },
            {
                data: "_source.address.addressComponents", orderable: true, name: 'address.addressComponents.shortText',
                render: data => data.find(component => component.category.title === 'CITY')?.shortText ?? ''

            },
            {
                data: "_source.address.addressComponents", orderable: true, name: 'address.addressComponents.longText',
                render: data => data.find(component => component.category.title === 'DISTRICT')?.shortText ?? ''
            },
            {
                data: "_source", orderable: false, className: 'd-flex',
                render: function (data) {
                    return `     
                        <button class="btn btn-grd btn-warning edit-btn" data-id="${data.id}" data-title="${data.title}" data-description="${data.description}"><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-danger delete-btn" data-id="${data.id}"><i class="lni lni-trash"></i></button>                
                    `;
                }
            }
        ],
        pageLength: 15, lengthMenu: [15, 30, 50, 100, 200], dom: 'lfrtip',
        initComplete: function () {
            const $searchInput = $('#places_filter input');
            $searchInput.attr('placeholder', 'İşletme adı');
            let api = this.api();

            function addJumpToPage() {
                let pagination = $(api.table().container()).find('.dataTables_paginate');

                if (!pagination.find('#jumpToPageContainer').length) {
                    let jumpToPageHtml = `
                        <div id="jumpToPageContainer" style="display: inline-block; margin-left: 10px;">
                            <label for="jumpToPageInput" style="margin-right:5px;">Sayfa:</label>
                            <input type="number" min="1" style="width: 60px; margin-right: 5px;" id="jumpToPageInput" placeholder="1">
                            <button id="jumpToPageBtn" class="btn btn-sm btn-primary">Git</button>
                        </div>
                    `;

                    pagination.append(jumpToPageHtml);

                    $('#jumpToPageBtn').on('click', function () {
                        let page = parseInt($('#jumpToPageInput').val(), 10);
                        let info = api.page.info();
                        let totalPages = info.pages;

                        if (isNaN(page) || page < 1 || page > totalPages) {
                            alert(`Lütfen 1 ile ${totalPages} arasında geçerli bir sayfa numarası girin.`);
                            return;
                        }
                        api.page(page - 1).draw(false);
                    });

                    $('#jumpToPageInput').on('keypress', function (e) {
                        if (e.which === 13) {
                            $('#jumpToPageBtn').click();
                        }
                    });
                }
            }
            addJumpToPage();
            api.on('draw', function () {
                addJumpToPage();
            });
        }
    });

    $('#filterButton').on('click', function () {
        let $btn = $(this);
        $btn.prop('disabled', true);
        dataTable.ajax.reload(()=> $btn.prop('disabled', false));
    });

    table.on('click', '.edit-btn', function (){window.open([window.location.href,$(this).data('id')].join('/'));});

    table.on('click', '.delete-btn', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        if (confirm("Bu işletmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            apiDelete(`/_json/places/${id}`, {
                errorMessage: 'İşletme başarıyla silindi',
                successMessage: 'İşletme başarıyla silindi',
                success: ()=>table.ajax.reload()
            });
        }
    });
});