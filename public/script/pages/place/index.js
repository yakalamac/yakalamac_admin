if(!window.hasOwnProperty('moment')) throw new Error('moment');
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
    populateProvinceSelect();

    const cityFilter = $('#cityFilter');

    cityFilter.on('change', () => populateDistrictSelect($(this).val()));

    const placesTable = $('#placesTable');
    const table = placesTable.DataTable({
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
                                        fields: query.columns.map(column => column.searchable && column.name.length > 0 ? column.name : undefined).filter(column => column !== undefined)
                                    }
                                },
                                addressComponentsQuery(cityFilter.val(), 'CITY'),
                                addressComponentsQuery($('#districtFilter').val(), 'DISTRICT')
                            ]
                        }
                    };
                }

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
            error: function (xhr, error) {
                console.error('DataTables AJAX hatası:', error, xhr);
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
                data: "_source.updatedAt", orderable: true, name: 'updatedAt',
                render: data => moment(data).format('DD.MM.YYYY - HH:mm')
            },
            {
                data: "_source.address.addressComponents", orderable: true, name: 'address.addressComponents.shortText',
                render: data => data.find(component => component.category.title === 'CITY')?.shortText ?? ''

            },
            {
                data: "_source.address.addressComponents", orderable: true, name: 'address.addressComponents.shortText',
                render: data => data.find(component => component.category.title === 'DISTRICT')?.shortText ?? ''
            },
            {
                data: "_source", orderable: false,
                render: function (data, type, row) {
                    return `<div class="gap-1">
                    <div class="col"><a target="_blank" href="./${data.id}" title="${data.name} adlı işletmeyi düzenle"><button type="button" data-id="${data.id}" data-title="${data.title}" data-description="${data.description}" class="btn btn-outline-info d-flex gap-2"><i class="material-icons-outlined">edit</i></button></a></div>
                    <div class="col"><a href="#" title="${data.name} adlı işletmeyi sil"><button type="button" class="btn btn-outline-danger d-flex gap-2"><i class="material-icons-outlined">delete</i></button></a></div>                     
                    </div>`;
                }
            }
        ],
        pageLength: 15,
        lengthMenu: [15, 30, 50, 100, 200],
        dom: 'lfrtip',
        initComplete: function () {
            var $searchInput = $('#placesTable_filter input');
            $searchInput.attr('placeholder', 'İşletme adı');
            var api = this.api();

            function addJumpToPage() {
                var pagination = $(api.table().container()).find('.dataTables_paginate');

                if (!pagination.find('#jumpToPageContainer').length) {
                    var jumpToPageHtml = `
                        <div id="jumpToPageContainer" style="display: inline-block; margin-left: 10px;">
                            <label for="jumpToPageInput" style="margin-right:5px;">Sayfa:</label>
                            <input type="number" min="1" style="width: 60px; margin-right: 5px;" id="jumpToPageInput" placeholder="1">
                            <button id="jumpToPageBtn" class="btn btn-sm btn-primary">Git</button>
                        </div>
                    `;

                    pagination.append(jumpToPageHtml);

                    $('#jumpToPageBtn').on('click', function () {
                        var page = parseInt($('#jumpToPageInput').val(), 10);
                        var info = api.page.info();
                        var totalPages = info.pages;

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
        var $btn = $(this);
        $btn.prop('disabled', true);
        table.ajax.reload(function () {
            $btn.prop('disabled', false);
        });
    });


    placesTable.on('click', '.delete-btn', function (e) {
        e.preventDefault();

        const id = $(this).data('id');

        if (confirm("Bu işletmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            $.ajax({
                url: `/_route/api/api/places/${id}`,
                type: 'DELETE',
                success: function (result) {
                    console.info(result);
                    toastr.success("İşletme başarıyla silindi.");
                    table.ajax.reload();
                },
                error: function (xhr, status, error) {
                    console.error(`Silme hatası: ${error}`);
                    toastr.error("İşletme silinirken bir hata oluştu.");
                }
            });
        }
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function populateProvinceSelect() {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        const provinceSelect = $('#cityFilter');
        provinceSelect.empty();
        provinceSelect.append('<option value="">Tüm Şehirler</option>');
        provinces.forEach(province => {
            provinceSelect.append(`<option value="${capitalizeFirstLetter(province.Province)}">${capitalizeFirstLetter(province.Province)}</option>`);
        });
    } catch (error) {
        console.error('Şehirler yüklenirken hata oluştu:', error);
    }
}

async function populateDistrictSelect(provinceName) {
    try {
        const provinces = await $.getJSON('/script/util/cities.json');
        const province = provinces.find(p => capitalizeFirstLetter(p.Province) === provinceName);
        const districtSelect = $('#districtFilter');
        districtSelect.empty();
        districtSelect.append('<option value="">Tüm İlçeler</option>');
        if (province && province.Districts) {
            province.Districts.forEach(district => {
                districtSelect.append(`<option value="${capitalizeFirstLetter(district.District)}">${capitalizeFirstLetter(district.District)}</option>`);
            });
        }
    } catch (error) {
        console.error('İlçeler yüklenirken hata oluştu:', error);
    }
}