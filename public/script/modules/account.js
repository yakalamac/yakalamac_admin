async function saveAccounts() {
    const placeId = $('#page-identifier-place-id').val();
    const accountsContainer = $('#accounts-container');
    const sortedAccounts = accountsContainer.find('li.list-group-item');

    let existingAccounts = window.transporter.place.accounts || [];
    const existingAccountsMap = {};
    existingAccounts.forEach(account => {
        existingAccountsMap[account.category.id] = account;
    });

    const ajaxPromises = [];
    let priority = 1;

    sortedAccounts.each(function () {
        const categoryId = $(this).data('category-id');
        const accountUrl = $(this).find('.account-src-input').val().trim();

        if (accountUrl !== '') {
            const existingAccount = existingAccountsMap[categoryId];

            if (existingAccount) {
                if (accountUrl !== existingAccount.src || priority !== existingAccount.priority) {
                    const patchData = { src: accountUrl, priority: priority };
                    ajaxPromises.push(
                        $.ajax({
                            url: `/_json/place/accounts/${existingAccount.id}`,
                            type: 'PATCH',
                            contentType: 'application/merge-patch+json',
                            data: JSON.stringify(patchData),
                            headers: { 'Accept': 'application/ld+json' },
                            error:(e)=>console.error(e),
                            success: (s)=> console.log(s),
                            failure: (f) => console.log(f)
                        }).catch(error => {
                            console.error(`Hesap güncelleme hatası (ID: ${existingAccount.id}):`, error);
                            toastr.error('Hesap güncellenirken bir hata oluştu.');
                            return Promise.reject(error);
                        })
                    );
                }
            } else {
                const postData = {
                    place: `/api/places/${placeId}`,
                    category: `/api/category/accounts/${categoryId}`,
                    src: accountUrl,
                    priority: priority
                };
                ajaxPromises.push(
                    $.ajax({
                        url: '/_json/place/accounts',
                        type: 'POST',
                        contentType: 'application/ld+json',
                        data: JSON.stringify(postData),
                        headers: { 'Accept': 'application/ld+json' },
                        error:(e)=>console.error(e),
                        success: (s)=> console.log(s),
                        failure: (f) => console.log(f)
                    }).then(response => {
                        existingAccounts.push(response);
                    }).catch(error => {
                        console.error('Hesap oluşturma hatası:', error);
                        toastr.error('Hesap eklenirken bir hata oluştu.');
                        return Promise.reject(error);
                    })
                );
            }
            priority++;
        } else {
            const existingAccount = existingAccountsMap[categoryId];
            if (existingAccount) {
                ajaxPromises.push(
                    $.ajax({
                        url: `/_json/place/accounts/${existingAccount.id}`,
                        type: 'DELETE',
                        headers: { 'Accept': 'application/ld+json' },
                        error:(e)=>console.error(e),
                        success: (s)=> console.log(s),
                        failure: (f) => console.log(f)
                    }).then(() => {
                        existingAccounts = existingAccounts.filter(account => account.category.id !== categoryId);
                    }).catch(error => {
                        console.error(`Hesap silme hatası (ID: ${existingAccount.id}):`, error);
                        toastr.error('Hesap silinirken bir hata oluştu.');
                        return Promise.reject(error);
                    })
                );
            }
        }
    });

    try {
        await Promise.all(ajaxPromises);
        window.transporter.place.accounts = existingAccounts;
    } catch (error) {
        console.error('Hesapları kaydederken hata oluştu:', error);
    }
}


$(document).ready(function () {
    updatePreviewLink();
    const accountsContainer = document.getElementById('accounts-container');

    Sortable.create(accountsContainer, {
        handle: '.drag-handle',
        animation: 150,
        onEnd: function () {
            $('#accounts-container li.list-group-item').each(function(index) {
                $(this).find('.account-priority-input').val(index + 1);
            });
        },
    });

    sortAccountsByPriority();
});

function sortAccountsByPriority() {
    const accountsContainer = $('#accounts-container');
    const accounts = accountsContainer.find('li.list-group-item').get();

    accounts.sort(function(a, b) {
        const priorityA = parseInt($(a).find('.account-priority-input').val()) || 6;
        const priorityB = parseInt($(b).find('.account-priority-input').val()) || 6;
        return priorityA - priorityB;
    });

    $.each(accounts, function(index, account) {
        accountsContainer.append(account);
    });
}