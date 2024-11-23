$(document).ready(function() {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    $('#endDate').val(today).attr('max', today);
    $('#startDate').val(sevenDaysAgoStr);

    const ajaxUrl = $('#auditLogsTable').data('ajax-url');

    var table = $('#auditLogsTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: ajaxUrl,
            type: 'GET',
            data: function(d) {
                d.start_date = $('#startDate').val();
                d.end_date = $('#endDate').val();
                d.action = $('#action').val();
            }
        },
        columns: [
            { data: 'id', title: 'ID' },
            { 
                data: 'additionalData',
                title: 'Kullanıcı',
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    let userName = 'Bilinmiyor';
                    try {
                        const additionalData = JSON.parse(data);
                        if (additionalData.userName) {
                            userName = additionalData.userName;
                        }
                    } catch (e) {
                        console.error('additionalData parse error:', e);
                    }
                    return userName;
                }
            },
            { data: 'entityId', title: 'Entity ID', orderable: false },
            { data: 'entityType', title: 'Entity Türü' },
            {
                data: 'action',
                title: 'İşlem',
                render: function (data) {
                    const badges = {
                        'DELETE': '<span class="badge bg-danger">Silme</span>',
                        'POST': '<span class="badge bg-success">Ekleme</span>',
                        'PATCH': '<span class="badge bg-warning text-dark">Güncelleme</span>'
                    };
                    return badges[data] || data;
                }
            },
            {
                data: 'timestamp',
                title: 'Tarih',
                render: function (data) {
                    const dateTime = new Date(data);
                    if (isNaN(dateTime.getTime())) {
                        return 'Geçersiz Tarih';
                    }
                    const day = String(dateTime.getDate()).padStart(2, '0');
                    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
                    const year = dateTime.getFullYear();
                    const hours = String(dateTime.getHours()).padStart(2, '0');
                    const minutes = String(dateTime.getMinutes()).padStart(2, '0');

                    return `${day}.${month}.${year} ${hours}:${minutes}`;
                }
            },
            {
                data: null,
                title: 'Detay',
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    let safeDetails = '';
                    if (typeof row === 'object') {
                        safeDetails = JSON.stringify(row).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                    } else {
                        safeDetails = '';
                    }
                    return `<button class="btn btn-sm btn-primary detail-btn" data-details='${safeDetails}'>Detay</button>`;
                }
            }
        ],
        order: [[0, 'desc']],
        lengthMenu: [15, 25, 50, 100],
        pageLength: 15,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json'
        },
        searching: false
    });

    $('#startDate, #endDate, #action').on('change', function() {
        table.ajax.reload();
    });

    $('#auditLogsTable').on('click', '.detail-btn', function() {
        const detailsStr = $(this).attr('data-details');
        try {
            const details = JSON.parse(detailsStr);

            let additionalData = {};
            if (details.additionalData) {
                try {
                    additionalData = JSON.parse(details.additionalData);
                } catch (e) {
                    console.error('additionalData error:', e);
                }
            }

            let changesHtml = 'Değişiklik bulunamadı.';
            if (additionalData.changes) {
                changesHtml = '<ul>';
                for (const [key, change] of Object.entries(additionalData.changes)) {
                    if (typeof change === 'object') {
                        changesHtml += `<li><strong>${key}:</strong> <pre>${JSON.stringify(change, null, 2)}</pre></li>`;
                    } else {
                        changesHtml += `<li><strong>${key}:</strong> ${change}</li>`;
                    }
                }
                changesHtml += '</ul>';
            } else if (additionalData.newData) {
                const newData = JSON.stringify(additionalData.newData, null, 2);
                changesHtml = `<pre style="white-space: pre-wrap;">Eklenen veri:<br>${newData}</pre>`;
            } else if (additionalData.oldData) {
                const oldData = JSON.stringify(additionalData.oldData, null, 2);
                changesHtml = `<pre style="white-space: pre-wrap;">Silinen veri:<br>${oldData}</pre>`;
            }

            $('#detailModal .modal-body').html(`
                <p><strong>Log ID:</strong> ${details.id || 'Bilinmiyor'}</p>
                <p><strong>Kullanıcı:</strong> ${additionalData.userName || 'Bilinmiyor'}</p>
                <p><strong>Entity ID:</strong> ${details.entityId || 'Bilinmiyor'}</p>
                <p><strong>Entity Türü:</strong> ${details.entityType || 'Bilinmiyor'}</p>
                <p><strong>İşlem:</strong> ${details.action || 'Bilinmiyor'}</p>
                <p><strong>Tarih:</strong> ${details.timestamp || 'Bilinmiyor'}</p>
                <p><strong>Değişiklikler:</strong></p>
                <div class="bg-light p-3 rounded">${changesHtml}</div>
            `);

            $('#detailModal').modal('show');
        } catch (e) {
            console.error('Detay modalında hata:', e);
            alert('Detaylar yüklenirken bir hata oluştu.');
        }
    });
});