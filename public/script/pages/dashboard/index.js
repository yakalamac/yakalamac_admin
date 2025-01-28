if(window.$ === undefined)
    throw new Error('jQuery is not found');

$ = window.$;

$(document).ready(function () {
    const auditLogsTable = $('#auditLogsTable');

    auditLogsTable.DataTable({
        serverSide: false,
        ajax: {
            url: '/audit/audit-logs/latest',
            type: 'GET',
            dataSrc: '',
        },
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: 'additionalData.userName',
                title: 'Kullanıcı',
                render: function(data) {
                    return data || 'Bilinmiyor';
                }
            },
            { data: 'entityId', title: 'Entity ID' },
            { data: 'entityType', title: 'Entity Türü' },
            {
                data: 'action',
                title: 'İşlem',
                render: function (data) {
                    const badges = {
                        'DELETE': '<span class="badge bg-danger">Silme</span>',
                        'POST': '<span class="badge bg-success">Ekleme</span>',
                        'PATCH': '<span class="badge bg-warning text-dark">Güncelleme</span>',
                        'selected': '<span class="badge bg-info">Seçilmiş</span>',
                        'unselected': '<span class="badge bg-dark">Seçilmemiş</span>',
                        'selectedCat': '<span class="badge bg-info">Seçilmiş Kat</span>',
                        'unselectedCat': '<span class="badge bg-dark">Seçilmemiş Kat</span>'
                    };
                    return badges[data] || data;
                }
            },
            {
                data: 'timestamp',
                title: 'Tarih',
                render: function (data) {
                    const utcDate = new Date(data.date);
                    const localDate = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000);

                    const day = localDate.getDate().toString().padStart(2, '0');
                    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
                    const year = localDate.getFullYear();
                    const hours = localDate.getHours().toString().padStart(2, '0');
                    const minutes = localDate.getMinutes().toString().padStart(2, '0');

                    return `${day}.${month}.${year} ${hours}:${minutes}`;
                }
            },
            {
                data: null,
                title: 'Detay',
                render: function (data) {
                    const safeDetails = JSON.stringify(data).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                    return `<button class="btn btn-sm btn-primary detail-btn" data-id="${data.id}" data-details="${safeDetails}">Detay</button>`;
                }
            }
        ],
        order: [[0, 'desc']],
    });

    auditLogsTable.on('click', '.detail-btn', function () {
        try {
            const details = JSON.parse($(this).attr('data-details'));

            let changesHtml = 'Değişiklik bulunamadı.';
            if (details.additionalData.changes) {
                if (details.additionalData.changes.oldData) {
                    const oldData = JSON.stringify(details.additionalData.changes.oldData, null, 2);
                    changesHtml = `<pre style="white-space: pre-wrap;">Eski Veri:<br>${oldData}</pre>`;
                } else {
                    changesHtml = Object.keys(details.additionalData.changes).map(key => {
                        const change = details.additionalData.changes[key];
                        return `<strong>${key}:</strong> ${change.old || 'N/A'} -> ${change.new || 'N/A'}`;
                    }).join('<br>');
                }
            }
            else if (details.additionalData.newData) {
                const oldData = JSON.stringify(details.additionalData.newData, null, 2);
                changesHtml = `<pre style="white-space: pre-wrap;">Eklenen veri:<br>${oldData}</pre>`;

                // changesHtml = Object.keys(details.additionalData.newData).map(key => {
                //     const change = details.additionalData.newData[key];
                //     return `<strong>${key}:</strong> ${JSON.stringify(change) || 'N/A'}`;
                // }).join('<br>');
            }else if (details.additionalData.oldData) {
                const oldData = JSON.stringify(details.additionalData.oldData, null, 2);
                changesHtml = `<pre style="white-space: pre-wrap;">Silinen veri:<br>${oldData}</pre>`;
                //  changesHtml = Object.keys(details.additionalData.oldData).map(key => {
                //     const change = details.additionalData.oldData[key];
                //     return `<strong>${key}:</strong> ${JSON.stringify(change) || 'N/A'}`;
                // }).join('<br>');
            }

            $('.detailModal .modal-body').html(`
					<p><strong>Log ID:</strong> ${details.id}</p>
					<p><strong>Kullanıcı:</strong> ${details.additionalData.userName || 'Bilinmiyor'}</p>
					<p><strong>Entity ID:</strong> ${details.entityId}</p>
					<p><strong>Entity Türü:</strong> ${details.entityType}</p>
					<p><strong>İşlem:</strong> ${details.action}</p>
					<p><strong>Tarih:</strong> ${details.timestamp.date}</p>
					<p><strong>Değişiklikler:</strong></p>
					<div class="bg-dark shadow-lg p-4 rounded">${changesHtml}</div>
				`);

            $('.detailModal').modal('show');
        } catch (e) {
            console.error('Detay modalında hata:', e);
            alert('Detaylar yüklenirken bir hata oluştu.');
        }
    });
});