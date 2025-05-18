$(function (){
    $('#appointmentsTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: '/_json/appointments',
            type: 'GET',
            headers: {
                accept: 'application/ld+json'
            },
            data: (d) => {
                return {
                    page: Math.floor(d.start / d.length) + 1,
                    limit: d.length
                }
            },
            dataFilter: (response) => {
                if (typeof response === 'string') response = JSON.parse(response);
                console.log('Response:', response);

                if(!Array.isArray(response)){
                    return JSON.stringify({
                        recordsTotal: response['hydra:totalItems'],
                        data: response['hydra:member'],
                        recordsFiltered: response['hydra:totalItems'],
                        error: undefined
                    })
                }
            },
            error: (err) => {
                console.error('DataTable Ajax error:', err);
            }
        },
        columns: [
            {
                data: null,
                render: (data, type, row) => {
                    if (!row.customer) return '-';
                    return `${row.customer.firstName} ${row.customer.lastName}`;
                },
                title: 'Müşteri'
            },
            {
                data: 'customer.email',
                defaultContent: '-',
                title: 'Email'
            },
            {
                data: 'customer.mobilePhone',
                defaultContent: '-',
                title: 'Telefon'
            },
            {
                data: 'place.name',
                defaultContent: '-',
                title: 'Firma Adı'
            },
            {
                data: 'place.address',
                render:(data)=>{
                    if (!data) return '-';
                    return data.length > 20 ? data.substring(0, 20) + '...' : data;
                }
            },
            {
                data: 'place.deliveryMethod',
                render: (data) => {
                    switch (data) {
                        case 'NO_DELIVERY':
                            return 'Teslimat Yok';
                        case 'YAKALA_DELIVERY':
                            return 'Yakala Teslimatı';
                        case 'SELF_DELIVERY':
                            return 'Kendi Teslimatım';
                        default:
                            return '-';
                    }
                },
                title: 'Teslimat'
            },
            {
                data: 'status',
                render: (data) => {
                    return data === 'PENDING' ? 'Beklemede' : data;
                },
                title: 'Durum'
            },
            {
                data: 'validated',
                render: (data) => data ? 'Evet' : 'Hayır',
                title: 'Onaylı mı?'
            },
            {
                data: 'createdAt',
                render: (data) => new Date(data).toLocaleDateString('tr-TR'),
                title: 'Oluşturulma'
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                            <button class="btn btn-success">
                            <i class="lni lni-checkmark fs-6"></i>
                            </button>
                        </a>
                        <button class="btn btn-sm btn-danger delete-appointment-btn">
                            <i class="lni lni-trash fs-4"></i>
                        </button>
                    `;
                },
                title: 'İşlemler'
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 10,
        paging: true,
        searching: true,
        ordering: true
    });
});