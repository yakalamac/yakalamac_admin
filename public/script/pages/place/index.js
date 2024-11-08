$(document).ready(function () {
    $('#placesTable').DataTable(
        {
            processing: true,
            serverSide: true,
            ajax: {
                url: "/_route/datatables/elasticsearch/place",
                type: "POST",
                dataType: "json",
                dataSrc: "data",
                error: function (xhr, error, code) {
                    console.error('DataTables AJAX error:', error, xhr);
                }
            },
            columns: [
                {
                    data: "id",
                    render: data => `<a title="${data}">${data.slice(0, 5)}...</a>`, orderable: false 
                },
                {
                    data: "name", orderable: false 
                },
                {
                    data: "primaryType", orderable: false,
                    render: (data) => data?.description || ''
                },
                {
                    data: "owner", orderable: false,

                    render: data => `<div class="form-check form-switch form-check-success">
                                        <input disabled class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                                    </div>`
                },
                {
                    data: "address", orderable: false,
                    render: (data) => data?.shortAddress || data?.longAddress || ''

                },
                {
                    data: "updatedAt", orderable: false ,
                    render: data=> moment(data).format('DD.MM.YYYY - HH:mm')
                },
                {
                    data: "createdAt", orderable: false ,
                    render: data => moment(data).format('DD.MM.YYYY - HH:mm')
                },
                {
                    data: null, orderable: false, searchable: false,
                    render: function (data, type, row) {
                        return `
                                <a target="_blank" href="./${row.id}" title="${row.name} adlı işletmeyi düzenle">
                                    <button class="btn btn-grd btn-grd-deep-blue edit-btn" data-id="${row.id}" data-title="${row.title}" data-description="${row.description}">
                                        <i class="fadeIn animated bx bx-pencil"></i>
                                    </button>
                                </a>
                                <a href="#" title="${row.name} adlı işletmeyi sil">
                                  <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                                    <i class="lni lni-trash"></i>
                                  </button>
                                </a>
                                `;
                    }
                }
            ],
            pageLength: 15,
            lengthMenu: [15, 30, 50, 100, 200]
        }
    );
});