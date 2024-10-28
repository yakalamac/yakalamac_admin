export const photoModal = function (modalId = 'addModal'){
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
                            <label for="${modalId}-input-file" class="form-label input-group-text">Fotoğraf</label>
                            <input type="file" class="form-control" id="${modalId}-input-file" name="photo" required>
                        </div>
                        <div class="mb-3">
                            <label for="${modalId}-textarea-caption" class="form-label">Fotoğraf Başlığı</label>
                            <textarea class="form-control" id="${modalId}-textarea-caption" 
                            name="caption" rows="3" placeholder="Burayı doldurun.." required></textarea>
                        </div>
                        <div class="mb-3 row">
                            <label for="${modalId}-switch-showOnBanner" class="form-label col-10">
                                Banner Olarak Ayarla
                            </label>
                            <div class="form-check form-switch form-check-success col-1">
                                <input class="form-check-input" type="checkbox" id="${modalId}-switch-showOnBanner" 
                                name="showOnBanner" role="switch">
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
 * @returns {{fileInput: HTMLInputElement, captionTextArea: HTMLTextAreaElement, showOnBannerSwitch: HTMLImageElement}|undefined}
 */
export const photoModalAreas = function (modalId){
  const modal = $(`#${modalId}`);
  if(modal.length !== 0)
    return {
      fileInput: modal.find(`input#${modalId}-input-file`)[0],
      captionTextArea: modal.find(`textarea#${modalId}-textarea-caption`)[0],
      showOnBannerSwitch: modal.find(`input#${modalId}-switch-showOnBanner`)[0]
    };
  return undefined;
}