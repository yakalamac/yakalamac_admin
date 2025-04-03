const levels = {
    province: { next: 'district', category: 2, defer: false },
    district: { next: 'neighbourhood', prev: 'province', category: 3},
    neighbourhood: { prev: 'district', category: 4}
};

/**
 * @param {string} level
 */
const initializeSelect = (level) =>
{
    const current = $(`#${level}_select`);

    current.select2({
        theme: "bootstrap-5", closeOnSelect: true, tags: true,
        width: $(this).data('width') ?? $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        data: getData(level)
    });

    populateInitialAddresses(level);

    current.on('change', ()=> onChangeEvent(level));
}

/**
 * @param {string} level
 * @returns {{}[]|string[]}
 */
const getData = (level)=> {
    const keys = Object.keys(levels);
    let data = localAddressStorage;

    for(let i = 0; i < keys.length; i++) {
        if(keys[i] === level) break;
        const value = $(`#${keys[i]}_select`).val();
        if(!data.hasOwnProperty(value)) return;
        data = data[value];
    }
    return Array.isArray(data) ? data : Object.keys(data);
}

/**
 * @param {string} level
 */
const onChangeEvent = (level) => {
    const current = levels[level];
    if(current.next === undefined) return;
    const selected = $(`#${current.next}_select`);
    selected.empty();
    selected.select2({data: getData(current.next)});
    selected.val(null);
    selected.trigger('change');
};

/**
 * @param {string} level
 */
const populateInitialAddresses = (level) => {
    const current = levels[level];
    let detail = window.transporter.place.address.addressComponents.find(adc=> adc.category.id === current.category);
    if(detail === undefined) return;
    detail = detail.shortText ?? detail.longText;
    const select = $(`#${level}_select`);
    select.val(detail);
    select.trigger('change');
}

/**
 * @returns {Promise<[{}]>}
 */
const getAddressJSON = ()=>{
    return fetch('/script/util/cities2.json')
        .then(async response=> await response.json());
}

/**
 * @returns {$.InitializeAddressZone}
 * @constructor
 */
window.$.InitializeAddressZone = async function () {
    getAddressJSON().then(json => {
        window.localAddressStorage = json;
        Object.keys(levels).forEach(level => initializeSelect(level));
    });
    return this;
};