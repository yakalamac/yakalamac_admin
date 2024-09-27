const messageBuilder = (status) => {
    switch (status) {
        case exported.status.ERROR:
            return 'Bir hata oluştu';
        case exported.status.FAILURE:
            return 'İşlem gerçekleştirilemedi';
        case exported.status.SUCCESS:
            return 'İşlem başarılı';
        default:
            return 'Tanımsız durum kodu';
    }
}

/**
 * 
 * @param {string} message 
 * @param {number} status 
 * @returns 
 */
const builder = (message, status) => {
    return `
    <div id="status-message" class="status-message ${status}">
        <span class="close-btn">&times;</span>
        <p>${messageBuilder(status)}!</p>
        <p>${message}</p>
        <div class="progress-bar"></div>
    </div>
    `;
};

function showSuccessMessage(message, status) {
    $('div#status-zone').html(
        builder(message, status)
    );
     // Sayfa yüklendiğinde başarı mesajını göster
    $('#status-message').fadeIn();
    $('.progress-bar').css('width', '100%');

    // 5 saniyelik zamanlayıcı
    $('.progress-bar').animate({ width: '0%' }, 5000, function () {
        $('#status-message').fadeOut();
    });

    // Çarpı butonuna tıklandığında mesajı gizle
    $('.close-btn').click(function () {
        $('#status-message').fadeOut();
    });

  
};

const exported = {
    run: showSuccessMessage,
    status: {
        ERROR: 'error',
        FAILURE: 'failure',
        SUCCESS: 'success'
    }
};

export default exported;