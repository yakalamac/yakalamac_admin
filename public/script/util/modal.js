export const photoModal = function (modalId = 'addModal') {
    return `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="addModalLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addModalLabel">Yeni Fotoğraf Ekle</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="#">
              <div class="modal-body">
                <div class="mb-3">
                <label for="${modalId}-input-file" class="form-label">Fotoğraf Seç</label>
                  <input type="file" class="form-control" accept="image/*" id="${modalId}-input-file" name="photo" required>
                </div>
                <div class="mb-3">
                  <label for="${modalId}-input-title" class="form-label">Fotoğraf Başlığı</label>
                  <input type="text" class="form-control" id="${modalId}-input-title" name="title" placeholder="Başlık giriniz" required>
                </div>
                <div class="mb-3">
                  <label for="${modalId}-input-altTag" class="form-label">Alt Etiket</label>
                  <input type="text" class="form-control" id="${modalId}-input-altTag" name="altTag" placeholder="Alt etiket giriniz" required>
                </div>
                <div class="mb-3">
                  <label for="${modalId}-select-category" class="form-label">Kategori</label>
                  <select class="form-select" id="${modalId}-select-category" name="category">
                    <option value="" disabled selected>Kategori seçiniz</option>
                  </select>
                </div>
                <div class="mb-3 row">
                  <label for="${modalId}-switch-showOnBanner" class="form-label col-10">
                    Banner Olarak Ayarla
                  </label>
                  <div class="form-check form-switch form-check-success col-2">
                    <input class="form-check-input" type="checkbox" id="${modalId}-switch-showOnBanner" name="showOnBanner" role="switch">
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="${modalId}-switch-showOnLogo" class="form-label col-10">
                    Logo Olarak Ayarla
                  </label>
                  <div class="form-check form-switch form-check-success col-2">
                    <input class="form-check-input" type="checkbox" id="${modalId}-switch-showOnLogo" name="showOnLogo" role="switch">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" id="${modalId}-button-close" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                  Kapat
                </button>
                <button type="submit" id="${modalId}-button-submit" class="btn btn-grd btn-grd-royal">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  };

  export const qrcodeModal = function (modalId = 'addModal') {
    return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="addModalLabel">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addModalLabel">QR Kod Oluştur</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form action="#">
                <div class="modal-body">
                  <div class="mb-3 text-center">
                    <div id="qrkod"></div>
                  </div>
                  <hr>
  
                  <div class="row g-3 mb-3">
                    <div class="col">
                      <label for="qrcode-width" class="form-label">En/Boy (px)</label>
                      <input type="number" id="qrcode-width" class="form-control" value="250">
                    </div>
                    <div class="col">
                      <label for="qrcode-margin" class="form-label">Margin</label>
                      <input type="number" id="qrcode-margin" class="form-control" value="5">
                    </div>
                  </div>
    
                  <div class="row g-3 mb-3">
                    <div class="col">
                      <label for="qrcode-color-dark" class="form-label">QR Kod Rengi</label>
                      <input type="color" id="qrcode-color-dark" class="form-control" value="#000000">
                    </div>
                    <div class="col">
                      <label for="qrcode-color-light" class="form-label">Arka Plan Rengi</label>
                      <input type="color" id="qrcode-color-light" class="form-control" value="#ffffff">
                    </div>
                  </div>
                  <hr>
  
                  <div class="row g-3 mb-3">
                    <div class="col">
                      <label for="qrcode-detailLevel" class="form-label">Detay/Hata Toleransı</label>
                      <select id="qrcode-detailLevel" class="form-select">
                        <option value="1" selected>Düşük (L)</option>
                        <option value="2">Orta (M)</option>
                        <option value="3">Yüksek (H)</option>
                      </select>
                    </div>
                    <div class="col">
                      <label for="dots-type" class="form-label">QR Nokta Tipi</label>
                      <select id="dots-type" class="form-select">
                        <option value="rounded" selected>Yuvarlak (varsayılan)</option>
                        <option value="dots">Nokta</option>
                        <option value="square">Kare</option>
                        <option value="extra-rounded">Ekstra Yuvarlak</option>
                        <option value="classy">Zarif</option>
                        <option value="classy-rounded">Yuvarlak Zarif</option>
                      </select>
                    </div>
                  </div>

                  <div class="row g-3 mb-3">
                    <div class="col">
                      <label for="corners-square-type" class="form-label">Köşe Kareleri Tipi</label>
                    <select id="corners-square-type" class="form-select">
                      <option value="extra-rounded" selected>Ekstra Yuvarlak (varsayılan)</option>
                      <option value="square">Kare</option>
                      <option value="dot">Nokta</option>
                      <option value="rounded">Yuvarlak</option>
                      <option value="classy">Zarif</option>
                      <option value="classy-rounded">Yuvarlak Zarif</option>
                    </select>
                    </div>
                    <div class="col">
                     <label for="corners-dot-type" class="form-label">Köşe Nokta Tipi</label>
                    <select id="corners-dot-type" class="form-select">
                      <option value="dot" selected>Nokta (varsayılan)</option>
                      <option value="square">Kare</option>
                      <option value="rounded">Yuvarlak</option>
                      <option value="extra-rounded">Ekstra Yuvarlak</option>
                    </select>
                    </div>
                  </div>
                   
  
                  <hr>
  
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="qrcode-with-icon" checked>
                    <label class="form-check-label" for="qrcode-with-icon">
                      Logo Ekle
                    </label>
                  </div>
                  <div class="row g-3 mb-3">
                    <div class="col">
                      <label for="qrcode-logo-size" class="form-label">Logo Boyutu</label>
                      <input type="number" step="0.1" id="qrcode-logo-size" class="form-control" value="0.5">
                    </div>
                    <div class="col">
                      <label for="qrcode-logo-margin" class="form-label">Logo Margin</label>
                      <input type="number" step="1" id="qrcode-logo-margin" class="form-control" value="4">
                    </div>
                  </div>
  
                </div>
                <div class="modal-footer">
                  <button type="submit" id="${modalId}-button-submit" class="btn btn-grd btn-grd-royal">
                    İndir
                  </button>
                  <button type="button" id="${modalId}-button-close" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                    Kapat
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
  };
  

/**
 *
 * @param modalId
 * @returns {{fileInput: HTMLInputElement, titleInput: HTMLInputElement, altTagInput: HTMLInputElement, categorySelect: HTMLSelectElement, showOnBannerSwitch: HTMLInputElement, showOnLogoSwitch: HTMLInputElement}|undefined}
 */
export const photoModalAreas = function (modalId) {
    const modal = $(`#${modalId}`);
    if (modal.length !== 0)
      return {
        fileInput: modal.find(`input#${modalId}-input-file`)[0],
        titleInput: modal.find(`input#${modalId}-input-title`)[0],
        altTagInput: modal.find(`input#${modalId}-input-altTag`)[0],
        categorySelect: modal.find(`select#${modalId}-select-category`)[0],
        showOnBannerSwitch: modal.find(`input#${modalId}-switch-showOnBanner`)[0],
        showOnLogoSwitch: modal.find(`input#${modalId}-switch-showOnLogo`)[0],
      };
    return undefined;
};


/*
<select id="select_loading_type_${modalId}">
    <option id="option_nonselect_${modalId}" selected>
        <a href="#primary-pills-tab_non_selected_${modalId}" data-bs-toggle="pill">Bir Değer Seçiniz</a>
    </option>
    <option id="option_drag_drop_${modalId}">
        <a href="#primary-pills-tab_drag_drop_${modalId}" data-bs-toggle="pill">Sürükle-Bırak</a>
    </option>
    <option id="option_from_file_${modalId}">
        <a href="#primary-pills-tab_from_file_${modalId}" data-bs-toggle="pill">Dosyadan Yükle</a>
    </option>
</select>
*/
export const photoBulkUploadModal = function (modalId = 'photoBulkUploadModal') {
    return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="addModalLabel">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="uploadImageBulk">Yeni Fotoğraf Ekle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                        <div class="modal-body">
                            
                            <div class="mb-3">
                                
                                <!-- Nav for Tabs -->
                                <ul class="nav nav-pills" id="tabList${modalId}" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link" id="tab_drag_drop_${modalId}" data-bs-toggle="pill" href="#primary-pills-tab_drag_drop_${modalId}" role="tab" aria-controls="primary-pills-tab_drag_drop_${modalId}" aria-selected="true">
                                            Sürükle-Bırak
                                        </a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link active" id="tab_from_file_${modalId}" data-bs-toggle="pill" href="#primary-pills-tab_from_file_${modalId}" role="tab" aria-controls="primary-pills-tab_from_file_${modalId}" aria-selected="false">
                                            Dosyadan Yükle
                                        </a>
                                    </li>
                                </ul>
                                <!-- Nav for Tabs/ -->
                                
                            </div>
                            
                            <div class="tab-content" id="pills-tabContent">
                                
                                <div class="tab-pane fade" id="primary-pills-tab_drag_drop_${modalId}" role="tabpanel" aria-labelledby="tab_drag_drop_${modalId}">
                                    <div class="card">
                                        <div class="card-body">
                                            <form>
                                                <input id="image_uploadify_${modalId}" type="file" accept=".xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf" multiple="" style="display: none;">
								            </form>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tab-pane fade show active" id="primary-pills-tab_from_file_${modalId}" role="tabpanel" aria-labelledby="tab_from_file_${modalId}">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row p-1">
                                                <button class="btn btn-success col m-1 text-center flex justify-content-center align-items-center" id="fancy_file_upload_save_all_button_${modalId}">
                                                    <div class="row">
                                                        <span class="material-symbols-outlined m-auto">save</span>
                                                        <b class="m-auto">Hepsini Kaydet</b>
                                                    </div>
                                                </button>
                                                <button class="btn btn-danger col m-1 text-center flex align-items-center justify-content-center" id="fancy_file_upload_remove_all_button_${modalId}">
                                                    <div class="row">
                                                        <span class="material-symbols-outlined">delete</span>
                                                        <b class="m-auto">Hepsini Kaldır</b>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <input id="fancy_file_upload_${modalId}" type="file" name="files" accept=".jpg, .png, image/jpeg, image/png" multiple>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" id="${modalId}-button-close" class="btn btn-grd btn-grd-deep-blue" data-bs-dismiss="modal">
                                Kapat
                            </button>
                            <button type="submit" id="${modalId}-button-submit" class="btn btn-grd btn-grd-royal d-none">
                                Kaydet
                            </button>
                        </div>
                        
                </div>
            </div>
        </div>
    `;
}
