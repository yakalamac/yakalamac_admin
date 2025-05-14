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
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white p-4">
                <div>
                    <h5 class="modal-title fw-bold" id="addDictionaryLabel">Yeni Ürün Ekle</h5>
                    <p class="mb-0 opacity-75">Yeni ürün bilgilerini girin</p>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="addDictionaryForm">
                <div class="modal-body p-4">
                    <div class="row g-3">
                        <!-- Temel Bilgiler -->
                        <div class="col-md-6">
                            <label for="add-name" class="form-label">Ürün Adı</label>
                            <input type="text" class="form-control" id="add-name" name="name" placeholder="Ürün adını giriniz" required>
                        </div>
                        <div class="col-md-6">
                            <label for="add-price" class="form-label">Ürün Fiyatı</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="add-price" name="price" placeholder="0.00" required>
                                <span class="input-group-text">₺</span>
                            </div>
                        </div>

                        <!-- Kalori ve Hazırlanma Süresi -->
                        <div class="col-md-4">
                            <label for="add-calorie" class="form-label">Kalori Miktarı</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="add-calorie" name="calorie" placeholder="0">
                                <span class="input-group-text">kcal</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label for="add-preparationTime" class="form-label">Hazırlanma Süresi</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="add-preparationTime" name="preparationTime" placeholder="0">
                                <span class="input-group-text">dk</span>
                            </div>
                        </div>

                        <!-- Sıcak/Soğuk Durumu -->
                        <div class="col-md-4">
                            <label class="form-label d-block">Sıcak/Soğuk Durumu</label>
                            <div class="temperature-toggle mt-2">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="add-isHot" name="isHot">
                                    <span class="toggle-slider"></span>
                                </label>
                                <div class="toggle-labels d-flex gap-3">
                                    <span class="toggle-label text-muted" id="add-hot-label">
                                        <i class="material-icons-outlined toggle-icon">whatshot</i> Sıcak
                                    </span>
                                    <span class="toggle-label text-info fw-bold" id="add-cold-label">
                                        <i class="material-icons-outlined toggle-icon">ac_unit</i> Soğuk
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Pişirme Yöntemleri -->
                        <div class="col-md-12 cooking-methods-container d-none" id="add-cooking-methods-container">
                            <label for="add-cookingMethods" class="form-label">Pişirme Yöntemleri</label>
                            <select class="form-select modal-select2" id="add-cookingMethods" name="cookingMethods" multiple
                                    data-placeholder="Pişirme yöntemlerini seçin">
                                <option value="firin">Fırında</option>
                                <option value="izgara">Izgara</option>
                                <option value="kizartma">Kızartma</option>
                                <option value="haslanmis">Haşlanmış</option>
                                <option value="buharda">Buharda</option>
                                <option value="diger">Diğer</option>
                            </select>
                        </div>

                        <!-- Hizmet Türü -->
                        <div class="col-md-6">
                            <label for="add-serviceType" class="form-label">Hizmet Türü</label>
                            <select class="form-select" id="add-serviceType" name="serviceType" required>
                                <option value="">Seçiniz</option>
                                <option value="kahvalti">Kahvaltı</option>
                                <option value="anaYemek">Ana Yemek</option>
                                <option value="atistirmalik">Atıştırmalık</option>
                                <option value="tatli">Tatlı</option>
                                <option value="icecek">İçecek</option>
                            </select>
                        </div>

                        <!-- Yanında Servis Edilen Ürünler -->
                        <div class="col-md-6">
                            <label for="add-servedWith" class="form-label">Yanında Servis Edilen Ürünler</label>
                            <select class="form-select modal-select2" id="add-servedWith" name="servedWith" multiple
                                    data-placeholder="Servis edilecek ürünleri seçin">
                                <!-- Bu kısım JavaScript ile doldurulabilir -->
                                <option value="1">Ekmek</option>
                                <option value="2">Patates Kızartması</option>
                                <option value="3">Pilav</option>
                                <option value="4">Salata</option>
                            </select>
                        </div>

                        <!-- İçindekiler -->
                        <div class="col-md-12">
                            <label for="add-ingredients-select" class="form-label">İçindekiler</label>
                            <div class="ingredients-container bg-light p-3 rounded">
                                <select class="form-select modal-select2" id="add-ingredients-select" name="ingredients" multiple
                                        data-placeholder="İçindekiler seçin">
                                    <option value="Un" id="ing-001" title="Buğday unu">Un</option>
                                    <option value="Şeker" id="ing-002" title="Beyaz toz şeker">Şeker</option>
                                    <option value="Süt" id="ing-003" title="Tam yağlı süt">Süt</option>
                                    <option value="Yumurta" id="ing-004" title="Taze yumurta">Yumurta</option>
                                    <option value="Tereyağı" id="ing-005" title="Tuzsuz tereyağı">Tereyağı</option>
                                    <option value="Tuz" id="ing-006" title="İnce tuz">Tuz</option>
                                    <option value="Vanilya" id="ing-007" title="Vanilya özütü">Vanilya</option>
                                </select>

                                <div class="ingredient-tags d-flex flex-wrap gap-2 mt-3">
                                    <div class="text-muted">Henüz içerik seçilmedi</div>
                                </div>
                            </div>
                        </div>

                        <!-- Alerjenler -->
                        <div class="col-md-6">
                            <label class="form-label">Alerjenler</label>
                            <div class="allergens-container bg-light rounded p-3">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-allergen-gluten" name="allergens" value="gluten">
                                            <label class="form-check-label ms-2" for="add-allergen-gluten">Gluten</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-allergen-sut" name="allergens" value="sut">
                                            <label class="form-check-label ms-2" for="add-allergen-sut">Süt</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-allergen-yumurta" name="allergens" value="yumurta">
                                            <label class="form-check-label ms-2" for="add-allergen-yumurta">Yumurta</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-allergen-findik" name="allergens" value="findik">
                                            <label class="form-check-label ms-2" for="add-allergen-findik">Fındık</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-allergen-ceviz" name="allergens" value="ceviz">
                                            <label class="form-check-label ms-2" for="add-allergen-ceviz">Ceviz</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-allergen-soya" name="allergens" value="soya">
                                            <label class="form-check-label ms-2" for="add-allergen-soya">Soya</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Diyet Türü -->
                        <div class="col-md-6">
                            <label class="form-label">Diyet Türü</label>
                            <div class="diet-types-container bg-light rounded p-3">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-diet-vegan" name="dietTypes" value="vegan">
                                            <label class="form-check-label ms-2" for="add-diet-vegan">Vegan</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-diet-vegetarian" name="dietTypes" value="vegetarian">
                                            <label class="form-check-label ms-2" for="add-diet-vegetarian">Vejetaryen</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-diet-glutenfree" name="dietTypes" value="glutenfree">
                                            <label class="form-check-label ms-2" for="add-diet-glutenfree">Glütensiz</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-diet-lactosefree" name="dietTypes" value="lactosefree">
                                            <label class="form-check-label ms-2" for="add-diet-lactosefree">Laktozsuz</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-diet-lowcarb" name="dietTypes" value="lowcarb">
                                            <label class="form-check-label ms-2" for="add-diet-lowcarb">Düşük Karbonhidrat</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check bg-white rounded p-3 shadow-sm">
                                            <input class="form-check-input" type="checkbox" id="add-diet-lowcal" name="dietTypes" value="lowcal">
                                            <label class="form-check-label ms-2" for="add-diet-lowcal">Düşük Kalori</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Ürün Açıklaması -->
                        <div class="col-md-12">
                            <label for="add-description" class="form-label">Ürün Açıklaması</label>
                            <textarea class="form-control" id="add-description" name="description" 
                                placeholder="Ürün detaylarını ve özelliklerini yazın..." rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">İptal</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="material-icons-outlined me-1">add</i> Ekle
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
/* Modal içinde gerekli stil tanımlamaları */
#addDictionaryModal .modal-dialog {
    max-width: 800px;
}

#addDictionaryModal .temperature-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
}

#addDictionaryModal .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
}

#addDictionaryModal .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

#addDictionaryModal .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #00b8c0;
    transition: .4s;
    border-radius: 34px;
}

#addDictionaryModal .toggle-slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

#addDictionaryModal input:checked + .toggle-slider {
    background-color: #dc3545;
}

#addDictionaryModal input:focus + .toggle-slider {
    box-shadow: 0 0 1px #dc3545;
}

#addDictionaryModal input:checked + .toggle-slider:before {
    transform: translateX(30px);
}

#addDictionaryModal .ingredient-tags {
    min-height: 40px;
}

#addDictionaryModal .ingredient-tag {
    display: inline-flex;
    align-items: center;
    transition: all 0.2s;
}

#addDictionaryModal .ingredient-tag:hover {
    background-color: #f8f9fa;
}

#addDictionaryModal .ingredient-tag .btn-close {
    font-size: 0.7rem;
}

#addDictionaryModal .form-check {
    margin-bottom: 8px;
    transition: all 0.2s;
}

#addDictionaryModal .form-check:hover {
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}
</style>`;