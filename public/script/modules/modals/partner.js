export const reviewModal = `
<div class="modal fade" id="ansModal" tabindex="-1" aria-labelledby="ansModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ansModalLabel">Yoruma Cevap Ver</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-body">
                <p id="reviewText">Yorum buraya gelecek...</p>
                <div class="mb-3">
                    <label for="ansInput" class="form-label">Cevabınız</label>
                    <textarea class="form-control" id="ansInput" rows="4" placeholder="Cevabınızı yazın..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                <button type="button" class="btn btn-primary">Gönder</button>
            </div>
        </div>
    </div>
</div>
`