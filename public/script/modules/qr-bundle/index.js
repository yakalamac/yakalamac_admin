if (window.$ === undefined) throw new Error('Jquery wasn\'t defined.');

/**
 * @param obj
 * @param path
 * @param value
 */
function updateNestedField(obj, path, value) {
    const keys = path.split('.'); let current = obj;

    for(let i = 0; i < keys.length-1; i++) {
        if(!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length-1]] = value;
}

/**
 * @param settings
 * @constructor
 */
$.QRCodeBundle = function (settings) {
    //Initial settings
    this._settings = {
        width: 200, height: 200, margin: 10, target: '#modal-qr-code',
        imageOptions: {margin: 5, hideBackgroundDots: true},
        dotsOptions: { color: "#000000", type: 'rounded' },
        cornersSquareOptions: { color: "#000000", type: 'rounded' },
        cornersDotOptions: { color: '#00B8C0', type: 'dot' },
        backgroundOptions: { color: '#ffffff' },
        qrOptions: { errorCorrectionLevel: 'M' },
        ...settings
    };
    const $this = this;
    const $Instance = new QRCodeStyling(this._settings);
    $Instance.append($(this._settings.target).find('#qr-code-field')[0]);

    $(`${this._settings.target} form *`).on('change', 'select, input', function () {
            const attributes = $(this)[0].id.split('-'); let value = parseInt($(this).val());
            if(isNaN(value)) value = $(this).val();
            attributes.forEach(attribute=> updateNestedField($this._settings, attribute, value));
            $Instance.update($this._settings);
    });

    this.rewrite = (data) => {
        this._settings.data = data;
        $Instance.update(this._settings);
        return this;
    };

    this.show = ()=> $(this._settings.target).modal('show');

    return this;
};