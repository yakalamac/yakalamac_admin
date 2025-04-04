if(window.$ === undefined) throw new Error('Jquery is not defined');

$(document).ready(function () {
    const table = $('#products');

    const dataTable = table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/_search/product", type: "POST", dataType: "json", dataSrc: "data",
            data:  query => {
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
                console.error('DataTables AJAX error:', error, xhr);
                toastr.error('Veri yüklenirken bir hata oluştu.');
            }
        },
        columns: [
            { data: "_source.place", orderable: true, searchable: false },
            { data: "_source.name", orderable: false, searchable: true },
            { data: "_source.price", orderable: false, searchable: false, render: data=>data.toFixed(2) + ' ₺' },
            {
                data: "_source.active", orderable: false, searchable: false,
                render: (data) => `<div class="form-check form-switch form-check-success"><input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''} disabled></div>`
            },
            {
                data: "_source.categories", orderable: false, searchable: false, render: data => Array.isArray(data)
                    ? data.map(category => category.title).join(', ') : ''
            },
            { data: "_source.createdAt", orderable: false, searchable: false, render: data => moment(data).format('DD.MM.YYYY - HH:mm') },
            { data: "_source.updatedAt", orderable: false, searchable: false, render: data => moment(data).format('DD.MM.YYYY - HH:mm') },
            {
                data: "_source", orderable: false, searchable: false,
                render: function (data) {
                    return `
                        <button class="btn btn-grd btn-warning edit-btn" data-id="${data.id}"><i class="fadeIn animated bx bx-pencil"></i></button>
                        <button class="btn btn-grd btn-danger delete-btn" data-id="${data.id}"><i class="lni lni-trash"></i></button>
                    `;
                }
            }
        ],
        pageLength: 15,
        lengthMenu: [15, 30, 50, 100, 200],
        initComplete: ()=> {
            const filterInput = $('#products_filter input');
            filterInput.attr('placeholder', 'Ürün adı');
            filterInput.unbind().bind('keyup', ()=> {
                let searchTerm = this.value.trim();
                if (searchTerm.length >= 2 || searchTerm.length === 0) {
                    dataTable.search(searchTerm).draw();
                }
            });
        }
    });

    const tableBody = $('#products tbody');

    tableBody.on('click', '.edit-btn', function(){
        window.location.assign([window.location.href, $(this).data('id')].join('/'))
    });

    tableBody.on('click', '.delete-btn', function () {
        let id = $(this).data('id');
        if (confirm("Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) { 
            $.ajax({
                url: `/_json/products/${id}`, type: 'DELETE',
                success: function (result) { 
                    console.info(result);
                    toastr.success("Silindi.");
                    dataTable.ajax.reload();
                },
                error: function (xhr, status, error) {
                    console.error('Silme hatası:', error);
                    toastr.error("Ürün silinirken bir hata oluştu.");
                }
            });
        }
    });
});
