// Empty for now todo
/**
 * @param element
 * @param name
 * @constructor
 */
function Binder(element, name){ this.element = element; this.name = name;}
Binder.prototype.populate = function (){
    throw new Error('Not implemented.');
}
/**
 * @param {string} name
 * @returns {boolean}
 */
Binder.prototype.supports = function (name){
    return this.name === name;
}

/**
 * Opening hours Binder
 * @param element
 * @constructor
 */
function OpeningHoursBinder(element) {Binder.call(this, element, 'opening-hours');}
OpeningHoursBinder.prototype = Object.create(Binder.prototype);
OpeningHoursBinder.prototype.populate = function () {
    const day = this.element.getAttribute('data-day');
    const placeOpH = window.transporter.place.openingHours.find(o=> o.day.toString() === day);
    if(placeOpH === undefined) return;

    $(this.element).find('input[name], select[name]').each((index, element)=>{
       if(element instanceof HTMLSelectElement) {
           let selected = undefined;
           if (placeOpH.open.includes('24')) {
               selected = element.options.namedItem('always');
           } else if (placeOpH.open.toLowerCase().includes('kapalı')) {
               selected = element.options.namedItem('closed');
           } else {
               selected = element.options.namedItem('certain_hours');
           }
            // TODO
           return;
       }
       if(placeOpH.hasOwnProperty(element.name)) element.value = placeOpH[element.name];
    });
}

/**
 * Contact Binder
 * @param element
 * @constructor
 */
function ContactBinder(element) {Binder.call(this, element, 'contact');}
ContactBinder.prototype = Object.create(Binder.prototype);

/**
 * Place Option Binder
 * @param element
 * @constructor
 */
function PlaceOptionBinder(element){Binder.call(this,element, 'options');}
PlaceOptionBinder.prototype = Object.create(Binder.prototype);

/**
 * Address Binder
 * @param element
 * @constructor
 */
function AddressBinder(element){Binder.call(this,element, 'address');}
AddressBinder.prototype = Object.create(Binder.prototype);
AddressBinder.prototype.populate = function () {
    const categoryId = this.element.getAttribute('data-adc-category');
    if(categoryId === undefined) return;
    const component = (window.transporter.place.address.addressComponents || []).find(adc=> adc.category.id.toString() === categoryId);
    if(component) {
        this.element.value = component.shortText ?? component.longText;
    }
}

/**
 * AccountBinder
 * @param element
 * @constructor
 */
function AccountBinder(element) {Binder.call(this,element, 'account');}
AccountBinder.prototype = Object.create(Binder.prototype);
AccountBinder.prototype.populate = function () {

}

/**
 * Source Binder
 * @param element
 * @constructor
 */
function SourceBinder(element) {Binder.call(this,element, 'source');}
SourceBinder.prototype = Object.create(Binder.prototype);
SourceBinder.prototype.populate = function () {

}

/**
 * @type {Array<Function>}
 */
const RegisteredBinders = [SourceBinder, AccountBinder, AddressBinder, PlaceOptionBinder, ContactBinder, OpeningHoursBinder];


export function FieldBinder() {
    $('[data-binder]').each(function (index, element){
        const name = element.getAttribute('data-binder');
        if (typeof name !== "string") return;

        const binder = RegisteredBinders
            .map(Instance => new Instance(element))
            .find(current => current.supports(name));

        if (binder) {
            binder.populate();
        }
    });
}