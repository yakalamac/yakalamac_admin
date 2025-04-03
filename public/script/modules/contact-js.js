async function updateContacts() {
    const contactCategories = window.contactCategories || [];
    const existingContacts = window.transporter.place.contacts || [];

    const existingContactsMap = {};
    existingContacts.forEach(contact => {
        let categoryHref = contact.category;
        if (typeof categoryHref === 'object' && categoryHref['@id']) {
            categoryHref = categoryHref['@id'];
        } else if (typeof categoryHref !== 'string') {
            console.error('Beklenmeyen categoryHref tipi:', categoryHref);
            return;
        }
        const categoryId = categoryHref.split('/').pop();
        existingContactsMap[categoryId] = contact;
    });

    const ajaxPromises = contactCategories.map(category => {
        const categoryId = category.id.toString();
        const categoryInputId = `contact_${categoryId}`;
        const value = $(`#${categoryInputId}`).val().trim();

        const existingContact = existingContactsMap[categoryId];

        if (value !== '') {
            if (existingContact) {
                if (existingContact.value === value) {
                    return Promise.resolve();
                }
                const contactId = existingContact.id;
                const contactData = { value: value };
                return $.ajax({
                    url: `/_route/api/api/place/contacts/${contactId}`,
                    type: 'PATCH',
                    contentType: 'application/merge-patch+json',
                    data: JSON.stringify(contactData),
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error(`İletişim bilgisi güncelleme hatası (ID: ${contactId}):`, error);
                    toastr.error('İletişim bilgisi güncellenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            } else {
                const contactData = {
                    value: value,
                    category: `/api/category/contacts/${categoryId}`,
                    place: `/api/places/${placeId}`
                };
                return $.ajax({
                    url: `/_route/api/api/place/contacts`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(contactData),
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error('İletişim bilgisi oluşturma hatası:', error);
                    toastr.error('İletişim bilgisi eklenirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        } else {
            if (existingContact) {
                const contactId = existingContact.id;
                return $.ajax({
                    url: `/_route/api/api/place/contacts/${contactId}`,
                    type: 'DELETE',
                    contentType: 'application/json',
                    error:(e)=>console.error(e),
                    success: (s)=> console.log(s),
                    failure: (f) => console.log(f)
                }).catch(error => {
                    console.error(`İletişim bilgisi silme hatası (ID: ${contactId}):`, error);
                    toastr.error('İletişim bilgisi silinirken bir hata oluştu.');
                    return Promise.reject(error);
                });
            }
        }

        return Promise.resolve();
    });

    try {
        await Promise.all(ajaxPromises);
    } catch (error) {
        console.error('İletişim bilgileri güncellenirken bir hata oluştu:', error);
    }
}



async function populateContactFields() {
    const contactCategories = window.contactCategories || [];
    const existingContacts = window.transporter.place.contacts || [];

    const existingContactsMap = new Map(existingContacts.map(contact => {
        const categoryId = extractCategoryId(contact.category);
        return [categoryId, contact];
    }));

    const contactContainer = $('#contact-container');
    contactContainer.empty();

    let contactFieldsHTML = '';
    contactCategories.forEach(category => {
        const categoryId = category.id.toString();
        const value = existingContactsMap.get(categoryId)?.value || '';

        contactFieldsHTML += `
            <div class="col-6 mb-3">
                <label class="form-label" for="contact_${categoryId}">
                    ${category.description}
                </label>
                <input id="contact_${categoryId}" name="contact_${categoryId}" class="form-control"
                       type="text" placeholder="İletişim bilgisi"
                       value="${value}"
                       data-category-id="${categoryId}">
            </div>
        `;
    });
    contactContainer.html(contactFieldsHTML);
}

populateContactFields();