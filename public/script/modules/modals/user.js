export const userAdminAddModal = `<div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Yeni Admin Ekle</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addForm">
                    <div class="modal-body">
                        <label for="email" class="form-label">E-Posta Adresi</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="email" class="form-control" name="email" 
                                placeholder="example" required>
                            <span class="input-group-text">@yakalamac.com.tr</span>
                            <button class="btn btn-outline-secondary" type="button" id="createEmail">Oluştur</button>
                        </div>
                        <label for="email" class="form-label">Şifre</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="password" id="password" class="form-control" name="password" 
                                placeholder="***********" required>
                            <button class="btn btn-outline-secondary" type="button" id="createPassword">Oluştur</button>
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="mobile-phone" class="form-control" name="mobilePhone" 
                                placeholder="+90 (5**) *** ** **" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                            Kapat
                        </button>
                        <button type="submit" class="btn btn-grd btn-grd-royal">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

export const userPartnerAddModal = `<div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Yeni Partner Ekle</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addForm">
                    <div class="modal-body">
                        <label for="email" class="form-label">E-Posta Adresi</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="email" class="form-control" name="email" 
                                placeholder="example" required>
                            <span class="input-group-text">@yakalamac.com.tr</span>
                            <button class="btn btn-outline-secondary" type="button" id="createEmail">Oluştur</button>
                        </div>
                        <label for="email" class="form-label">Şifre</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="password" id="password" class="form-control" name="password" 
                                placeholder="***********" required>
                            <button class="btn btn-outline-secondary" type="button" id="createPassword">Oluştur</button>
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="mobile-phone" class="form-control" name="mobilePhone" 
                                placeholder="+90 (5**) *** ** **" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                            Kapat
                        </button>
                        <button type="submit" class="btn btn-grd btn-grd-royal">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

export const userYakalaAddModal = `<div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Yeni Kullanıcı Ekle</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addForm">
                    <div class="modal-body">
                        <label for="email" class="form-label">E-Posta Adresi</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="email" class="form-control" name="email" 
                                placeholder="example" required>
                            <span class="input-group-text">@yakalamac.com.tr</span>
                            <button class="btn btn-outline-secondary" type="button" id="createEmail">Oluştur</button>
                        </div>
                        <label for="email" class="form-label">Şifre</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="password" id="password" class="form-control" name="password" 
                                placeholder="***********" required>
                            <button class="btn btn-outline-secondary" type="button" id="createPassword">Oluştur</button>
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="mobile-phone" class="form-control" name="mobilePhone" 
                                placeholder="+90 (5**) *** ** **" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                            Kapat
                        </button>
                        <button type="submit" class="btn btn-grd btn-grd-royal">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

    export const addUserModal = `<div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserLabel">Yeni Kullanıcı Ekle</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addForm">
                    <div class="modal-body">
                        <label for="email" class="form-label">E-Posta Adresi</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="email" class="form-control" name="email" 
                                placeholder="example" required>
                            <span class="input-group-text">@yakalamac.com.tr</span>
                            <button class="btn btn-outline-secondary" type="button" id="createEmail">Oluştur</button>
                        </div>
                        <label for="email" class="form-label">Şifre</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="password" id="password" class="form-control" name="password" 
                                placeholder="***********" required>
                            <button class="btn btn-outline-secondary" type="button" id="createPassword">Oluştur</button>
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="mobile-phone" class="form-control" name="mobilePhone" 
                                placeholder="+90 (5**) *** ** **" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                            Kapat
                        </button>
                        <button type="submit" class="btn btn-grd btn-grd-royal">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;


    export const addDictionaryModal = `<div class="modal fade" id="addDictionaryModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addDictionaryLabel">Yeni sözlük ekle</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addDictionaryForm">
                    <div class="modal-body">
                        <label for="email" class="form-label">Ürün Sözlük Adı</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="DictionaryName" class="form-control" name="dictionaryName" 
                                placeholder="example" required>
                        </div>
                        <label for="email" class="form-label">İçerik</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="content" class="form-control" name="content" 
                                placeholder="ürün içeriği" required>
                        </div>
                        <label for="email" class="form-label">Hizmet Türü</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="serviceType" class="form-control" name="service" 
                                placeholder="content" required>
                        </div>
                        <label for="email" class="form-label">Açıklama</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="description" class="form-control" name="description" 
                                placeholder="content" required>
                        </div>
                        <label for="email" class="form-label">Yan Ürünler</label>
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" id="servedWith" class="form-control" name="servedWith" 
                                placeholder="content" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                            Kapat
                        </button>
                        <button type="submit" class="btn btn-grd btn-grd-royal">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;