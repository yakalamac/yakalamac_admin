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
                  <input type="file" class="form-control" id="${modalId}-input-file" name="photo" required>
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