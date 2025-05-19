$(function () {

    const placeId = $('#place-id').data('id');
    console.log(placeId);
    $('#productsTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: `/_json/place/${placeId}/products`,
            type: 'GET',
            headers: {
                accept: 'application/ld+json'
            },
            data: (d) => {
                return {
                    page: Math.floor(d.start / d.length) + 1,
                    limit: d.length
                };
            },
            dataFilter: (response) => {
                if (typeof response === 'string') response = JSON.parse(response);

                if (!Array.isArray(response)) {
                    return JSON.stringify({
                        recordsTotal: response['hydra:totalItems'],
                        data: response['hydra:member'],
                        recordsFiltered: response['hydra:totalItems'],
                        error: undefined
                    });
                }
            },
            error: (err) => {
                console.error('DataTable Ajax error:', err);
            }
        },
        columns: [
            {
                data: 'id',
                title: 'ID'
            },
            {
                data: 'name',
                title: 'Ürün Adı'
            },
            {
                data: 'active',
                render: (data) => data ? 'Evet' : 'Hayır',
                title: 'Aktif'
            },
            {
                data: 'description',
                render: (data) => {
                    if (!data) return '-';
                    return data.length > 30 ? data.substring(0, 30) + '...' : data;
                },
                title: 'Açıklama'
            },
            {
                data: 'price',
                render: (data) => `${data} ₺`,
                title: 'Fiyat'
            },
            {
                data: 'categories',
                render: (data) => {
                    if (!data || data.length === 0) return '--';
                    return data.map(cat => cat.name || cat).join(', ');
                },
                title: 'Kategoriler'
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-grd btn-warning edit-btn"><i class="fadeIn animated bx bx-pencil" data-id='${row.id}'></i></button>
                        <button class="btn btn-grd btn-grd-danger delete-btn"><i class="lni lni-trash"></i></button>
                    `;
                },
                title: 'İşlem'
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 10,
        paging: true,
        searching: true,
        ordering: true
    });

    $(document).on('click','#button-product-add', function(){
       return  window.location.href = '/admin/product/add';
    });

    $(document).on('click', '.edit-btn', function () {
        const table = $('#productsTable').DataTable();
        const rowData = table.row($(this).closest('tr')).data();
        const productId = rowData.id;

        return window.location.href = `/admin/products/${productId}`;

    })
});