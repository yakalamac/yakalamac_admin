import {reviewModal} from "../../modules/modals/partner.js";

$(document).ready(function() {
    console.log(window.activePlace);
    const $reviewTable = $('#review-table');

    $('body').append(reviewModal);
    const dataTable = $reviewTable.DataTable({
        processing: true,
        serverSide: true,
        rowId: 'id',
        ajax: function(requestData, callback) {
            if (window.activePlace?.pid === undefined) {
                console.log("No active place found");
                return callback({
                    draw: requestData.draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: []
                });
            }

            $.ajax({
                url: `/_search/place_comment`,
                type: 'POST',
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    query: {
                        bool: {
                            filter: [
                                {
                                    term: {
                                        place: window.activePlace.pid
                                    }
                                }
                            ]
                        }
                    },
                    from: requestData.start,
                    size: requestData.length
                }),
                success: function(response) {
                    const hits = response.hits?.hits ?? [];
                    const total = response.hits?.total?.value ?? 0;

                    console.log("Mapped Data:", hits.map(hit => hit._source));
                    console.log("İlk kayıt örneği:", hits.length > 0 ? hits[0]._source : "Veri yok");

                    callback({
                        draw: requestData.draw,
                        recordsTotal: total,
                        recordsFiltered: total,
                        data: hits.map(hit => hit._source)
                    });
                },
                error: function(xhr, error, thrown) {
                    console.error("DataTables AJAX Hatası:", xhr, error, thrown);
                    alert('Yorumlar yüklenirken bir hata oluştu. Lütfen konsolu kontrol edin.');
                }
            });
        },
        columns: [
            {
                data: null,
                defaultContent: '',
                orderable: false,
                className: 'select-checkbox',
                render: function(data, type, row) {
                    return '<input type="checkbox" class="form-check-input cursor-pointer">';
                }
            },
            {
                data: null,
                render: function(data) {
                    if( data && data.authorSrc.length > 40 ){
                        return 'Google Kullanıcısı'
                    }
                    return data.authorSrc;
                }
            },
            {
                data: 'text',
                className: 'wrap-text',
                render: function(data, type, row) {
                    return data || '-';
                }
            },
            {
                data: 'photos',
                title: 'Fotoğraflar',
                render: function(data) {
                    if (data && Array.isArray(data) && data.length > 0)  {
                        return `<button class="btn btn-default btn-success"><span>(${data.length}) fotoğraf</span></button>`;
                    }
                    return 'Fotograf yok';
                }
            },
            {
                data: 'rate',
                title: 'Değerlendirme Puanı',
                render: function(data) {
                    let stars = '';
                    for (let i = 0; i < 5; i++) {
                        if (i < data) {
                            stars += '<i class="bx bxs-star text-warning"></i>';
                        } else {
                            stars += '<i class="bx bx-star text-secondary"></i>';
                        }
                    }
                    return stars + ' (' + data + ')';
                }
            },
            {
                data: 'createdAt',
                render: function(data) {

                    return data ? new Date(data).toLocaleDateString('tr-TR') : '';
                }
            },
            {
                data: null,
                orderable: false,
                render: function(data, type, row) {
                    return `
                     <div class="btn-group position-static">
                    <button  type="button" class="btn btn-primary dropdown-toggle px-4" data-bs-toggle="dropdown"
                            aria-expanded="false">
                        İşlemler
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" data-id ="${row.text}" id="answer" href="javascript:void(0);">Cevapla</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="javascript:void(0);">Bildir</a></li>
                    </ul>
                </div>   
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/tr.json'
        },
        pageLength: 15,
        lengthMenu: [15, 30, 50, 100, 200],
        paging: true,
        searching: true,
        ordering: true
    });


    $('#selectall').on('click', function() {
        const isChecked = $(this).prop('checked');
        $('.select-checkbox input[type="checkbox"]').prop('checked', isChecked);
    });

    $(document).on('click', '#answer', function() {
        console.log($(this).attr('data-id'))
        $('#ansModal').modal('show');
        $("#ansModal").find('#reviewText').text($(this).attr('data-id'))
    });
});