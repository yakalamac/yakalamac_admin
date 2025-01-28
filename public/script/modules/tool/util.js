function getString(json, path, defaultValue) {
    if (typeof path !== 'string') throw new Error('Invalid object path');
    const pathParts = path.split('.');
    for (let i = 0; i < pathParts.length; i++) {
        if (typeof json[pathParts[i]] !== "object" && i < pathParts.length - 1) return defaultValue;
        json = json[pathParts[i]];

        if (i === pathParts.length - 1) {
            if (typeof json !== "string") return defaultValue;
            if (['null', 'undefined', 'nan', ''].includes(json.toLowerCase())) return defaultValue;
            return json;
        }
    }
}

function extractValueFromNested(data, targetPath) {
    if (typeof targetPath !== 'string') return null;
    const vals = targetPath.split('.');
    if (vals.length < 1) return null;
    if (vals.length < 2) return data[vals[0]];

    vals.forEach((val) => {
        if (typeof data === 'object' && !Array.isArray(data)) {
            data = data[val];
        } else if (Array.isArray(data)) {
            const founded = data.find(d => typeof d === 'object' && d[val] !== undefined && d[val] !== null && !Array.isArray(d));
            data = founded ? founded[val] : null;
        }
    });

    return ['boolean', 'string', 'number'].includes(typeof data) ? data : null;
}

function englishToTurkishDayNames(dayName) {
    if (typeof dayName === 'string') {
        switch (dayName.toLowerCase()) {
            case 'saturday':
                return 'Cumartesi';
            case 'sunday':
                return 'Pazar';
            case 'monday':
                return 'Pazartesi';
            case 'tuesday':
                return 'Salı';
            case 'wednesday':
                return 'Çarşamba';
            case 'thursday':
                return 'Perşembe';
            case 'friday':
                return 'Cuma';
        }
    }

    return undefined;
}

function findDayNumberOfWeek(dayName) {
    if (typeof dayName !== 'string') return -1;
    switch (dayName) {
        case 'saturday':
        case 'cumartesi':
            return 1;
        case 'sunday':
        case 'pazar':
            return 2;
        case 'monday':
        case 'pazartesi':
            return 3;
        case 'tuesday':
        case 'salı':
            return 4;
        case 'wednesday':
        case 'çarşamba':
            return 5;
        case 'thursday':
        case 'perşembe':
            return 6;
        case 'friday':
        case 'cuma':
            return 7;
        default:
            return -1;
    }
}


function parsePostCode(address) {
    if(typeof address !== 'string') return null;
    const regex = new RegExp(/(\s?[0-9]{4,5}\s?)/);
    const result = regex.exec(address);
    if(result !== null) return result[0];
    return null;
}

function parseStreetNumber(address) {
    if(typeof address !== 'string') return null;
    const regex = new RegExp(/(((no|No|NO|nO)(\s?)(:?)(\s?)([0-9]{0,3}(\/?)[0-9]{0,3}))|(([0-9]{0,3}(\/\s)?[A-Za-z]{1}))|(([A-Za-z]{1}(\/\s)?[0-9]{0,3}))),?/);
    const result = regex.exec(address);
    if(result !== null) return result[0];
    return null;
}

/**
 *
 * @param address
 * @returns {{postCode: string, streetNumber: undefined, avenue: undefined, street: undefined}|null}
 */
function addressParser(address) {
    if(typeof address !== 'string') return null;
    const addressObject = {postCode : parsePostCode(address), streetNumber: undefined, avenue: undefined, street: undefined};

    if(addressObject.postCode !== null) {
        const remain = address.split(addressObject.postCode);
        if(remain.length > 0) {
            const target = remain[0].trim();
            if(target.length !== 0) {
                if (target.includes(',')) {
                    const neighborhood = target.split(",");
                    if (neighborhood.length > 0) {
                        addressObject.neighborhood = neighborhood[0];
                    }
                }
                addressObject.streetNumber = parseStreetNumber(target) ?? parseStreetNumber(address);
                let nonParsedValues = target;
                Object.keys(addressObject).forEach(key=>
                    nonParsedValues = typeof addressObject[key] === 'string'
                        ? nonParsedValues.replace(addressObject[key], '')
                        : nonParsedValues
                );

                const regex = new RegExp(/(([A-Za-z]{1,})\s?){1,4}\.?/);
                const streetOrAvenue = regex.exec(nonParsedValues);
                if (streetOrAvenue !== null && Array.isArray(streetOrAvenue) && streetOrAvenue[0].length > 0) {
                    const value = streetOrAvenue[0].trim().toLowerCase();
                    if(value.includes('sok') || value.includes('sk') || value.includes('sokak')) {
                        addressObject.street = value;
                    } else {
                        addressObject.avenue = value;
                    }
                }
            }
        }
    }

    return addressObject;
}


function convertAddressComponentGoogleV2ToYakala (jsonAddressComponent) {
    if (Array.isArray(jsonAddressComponent.types)) {
        const addressComponentObject = {
            languageCode : jsonAddressComponent.languageCode,
            shortText : jsonAddressComponent.shortText,
            longText : jsonAddressComponent.longText,
            categories: []
        };

        switch (true) {
            case jsonAddressComponent.types.includes("country"):
                addressComponentObject.categories.push('/api/category/address/components/1');
                break;
            case jsonAddressComponent.types.includes("administrative_area_level_1"):
                addressComponentObject.categories.push('/api/category/address/components/2');
                break;
            case jsonAddressComponent.types.includes("administrative_area_level_2"):
                addressComponentObject.categories.push('/api/category/address/components/3');
                break;
            case jsonAddressComponent.types.includes("administrative_area_level_3"):
                addressComponentObject.categories.push('/api/category/address/components/3');
                break;
            case jsonAddressComponent.types.includes("administrative_area_level_4"):
                addressComponentObject.categories.push('/api/category/address/components/4');
                break;
            case jsonAddressComponent.types.includes("postal_code"):
                addressComponentObject.categories.push('/api/category/address/components/6');
                break;
            case jsonAddressComponent.types.includes("street") || t.includes("route"):
                addressComponentObject.categories.push('/api/category/address/components/5');
                break;
            case jsonAddressComponent.types.includes("street_number"):
                addressComponentObject.categories.push('/api/category/address/components/8');
                break;
            case jsonAddressComponent.types.includes("point_of_interest"):
                addressComponentObject.categories.push('/api/category/address/components/9');
                break;
            case jsonAddressComponent.types.includes("subpremise"):
            case jsonAddressComponent.types.includes("plus_code"):
            default: return undefined;
        }

        if(addressComponentObject.categories.length !== 0) return addressComponentObject;
    }

    return undefined;
}

export {
    findDayNumberOfWeek,
    englishToTurkishDayNames,
    getString,
    extractValueFromNested,
    addressParser,
    parsePostCode,
    parseStreetNumber,
    convertAddressComponentGoogleV2ToYakala
}