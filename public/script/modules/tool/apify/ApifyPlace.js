import {getString, extractValueFromNested, findDayNumberOfWeek, englishToTurkishDayNames} from '../util.js';

export class ApifyPlace {
    constructor(json) {
        this._buildBasic(json)
            ._buildLocation(json)
            ._buildPlusCode(json)
            ._buildAddressComponents(json)
            ._buildContacts(json)
            ._buildOpeningHours(json)
            ._buildReviews(json)
            ._buildPhotos(json)
            ._buildRating(json)
            ._buildSources(json)
            ._buildOptions(json);
    }

    _buildBasic(json) {
        this._name = json.title;
        this._description = json.description;

        return this;
    }

    _buildLocation(json) {
        this._location = {
            latitude: json.lat ?? 0,
            longitude: json.lng ?? 0,
            zoom: 0
        };

        return this;
    }

    _buildPlusCode(json) {
        this._plusCode = json.plusCode;

        return this;
    }

    _buildAddress(json) {
        if (this._address === undefined) this._address = {};
        this._address.shortAddress = json.address;
        this._address.longAddress = json.address;

        return this;
    }

    _buildAddressComponents(json) {
        this._buildAddress(json);
        this._address.addressComponents = [
            {
                shortText: json["countryCode"],
                longText: json["countryCode"],
                categories: ["/api/category/address/components/1"],
                languageCode: "tr"
            },
            {
                shortText: json.state,
                longText: json.state,
                categories: ["/api/category/address/components/2"],
                languageCode: "tr"
            },
            {
                longText: json.neighborhood,
                shortText: json.neighborhood,
                categories: ["/api/category/address/components/4"],
                languageCode: "tr"
            },
            {
                longText: json.street,
                shortText: json.street,
                categories: ["/api/category/address/components/5"],
                languageCode: "tr"
            },
            {
                longText: null,
                shortText: null,
                categories: ["/api/category/address/components/8"],
                languageCode: "tr"
            },
            {
                longText: json.city,
                shortText: json.city,
                categories: ["/api/category/address/components/3"],
                languageCode: "tr",
            },
            {
                longText: json.postalCode,
                shortText: json.postalCode,
                categories: ["/api/category/address/components/6"],
                languageCode: "tr"
            },
        ];

        return this;
    }

    _buildContacts(json) {
        this.contacts = ["website", "phone", "phoneUnformatted"].map((key, index) => ({
            value: getString(json, key, ''),
            category: `/api/category/contacts/${index + 1}`
        }));

        return this;
    }

    _buildOpeningHours(json) {
        if (Array.isArray(json.openingHours)) {
            this._openingHours = [];
            json.openingHours.forEach(openingHour => {
                const dayText = englishToTurkishDayNames(openingHour.day) ?? openingHour.day;
                const day = findDayNumberOfWeek(openingHour.day);
                const hourParts = openingHour.hours.split('to');
                const open = hourParts[0].trim();
                const close = hourParts[1].trim();
                this._openingHours.push({
                    dayText,
                    day,
                    open,
                    close,
                    description: `${dayText}: ${open}-${close}`,
                    languageCode: 'tr'
                });
            });
        }

        return this;
    }

    _buildReviews(json) {
        if (Array.isArray(json.reviews)) {
            this._reviews = json.reviews.map(review => ({
                rate: review.rating ?? review["stars"],
                languageCode: 'tr',
                text: review.text ?? review["textTranslated"],
                authorSrc: review["reviewUrl"] ?? review["reviewerUrl"]
            }));
        }

        return this;
    }

    _buildPhotos(json) {
        this._photos = [];
        if (typeof json["imageUrl"] === 'string') this._photos.push(json["imageUrl"]);
        if (typeof json.images === 'string') this._photos.push(json.images);
        if (Array.isArray(json["imageUrls"])) this._photos = this._photos.concat(json["imageUrls"]);
        if (this._photos.length === 0) this._photos = undefined;

        return this;
    }

    _buildRating(json) {
        if (Array.isArray(json.reviews)) {
            let totalRateFromReviews = 0;
            let average = 0;
            json.reviews.forEach(element => totalRateFromReviews += element.rating ?? element["stars"] ?? 0);
            average = totalRateFromReviews / json.reviews.length;
            this._rating = average;
            this._userRatingCount = totalRateFromReviews;
        } else {
            this._rating = json["totalScore"];
            this._userRatingCount = json["reviewsCount"];
        }

        return this;
    }

    _buildSources(json) {
        this._sources = [{
            sourceId: json.placeId,
            sourceUrl: typeof json["cid"] === 'string' ? `https://maps.google.com/?cid=${json["cid"]}` : json.url,
            category: "/api/category/sources/7"
        }];

        return this;
    }

    _buildOptions(json) {
        this._options = {};
        if (json.hasOwnProperty('additionalInfo') && typeof json.additionalInfo === 'object') {
            this._options.delivery = extractValueFromNested(json.additionalInfo, 'Hizmet seçenekleri.Paket servisi');
            this._options.servesLunch = extractValueFromNested(json.additionalInfo, 'Yemek seçenekleri.Öğle yemeği');
            this._options.servesDinner = extractValueFromNested(json.additionalInfo, 'Hizmet seçenekleri.İçeride servis');
            this._options.servesDessert = this._options.servesDinner;
            this._options.servesCoffee = this._options.servesDessert;
            this._options.goodForChildren = extractValueFromNested(json.additionalInfo, 'Çocuklar.Çocuklar için uygun');
            this._options.menuForChildren = this._options.goodForChildren;
            this._options.goodForGroups = extractValueFromNested(json.additionalInfo, 'Kitle.Gruplar');
        }

        return this;
    }

    get options() {
        return this._options;
    }

    get photos() {
        return this._photos;
    }

    get name() {
        return this._name;
    }

    get rating() {
        return this._rating;
    }

    get userRatingCount() {
        return this._userRatingCount;
    }

    get reviews() {
        return this._reviews;
    }

    get description() {
        return this._description;
    }

    get plusCode() {
        return this._plusCode;
    }

    get location() {
        return this._location;
    }
    get sources(){
        return this._sources;
    }
}