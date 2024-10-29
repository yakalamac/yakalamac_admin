$(document).ready(function () {


    $('#placesTable').DataTable(
        {
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/places",
                data: function (d) {
                    d.page = Math.ceil(d.start / d.length) + 1;
                },
                dataSrc: "hydra:member"
            },
            columns: [
                {
                    data: "id",
                    render: function (data) {
                        return `<a title="${data}">${data.slice(0, 5)}...</a>`;
                    }
                },
                {
                    data: "name"
                },
                {
                    data: "owner",

                    render: function (data) {
                        return `<div class="form-check form-switch form-check-success">
                                            <input class="form-check-input" type="checkbox" role="switch" ${data ? 'checked' : ''}>
                                        </div>`;
                    }
                },
                {
                    data: "address",
                    render: function (data) {
                        return data ?
                            (
                                data.shortAddress
                                    ? data.shortAddress
                                    : (
                                        data.longAddress
                                            ? data.longAddress
                                            : ''
                                    )
                            ) : '';
                    }
                },
                {
                    data: "updatedAt",
                    render: function (data) {
                        return moment(data).format('DD/MM/YYYY - HH:mm');
                    }
                },
                {
                    data: "createdAt",
                    render: function (data) {
                        return moment(data).format('DD/MM/YYYY - HH:mm');
                    }
                },
                {
                    data: null,
                    render: function (data, type, row){
                        return `
                                <a href="/place/${row.id}" title="${row.name} adlı işletmeyi düzenle">
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
            lengthMenu: [15, 25, 50, 100],

        }
    );
});