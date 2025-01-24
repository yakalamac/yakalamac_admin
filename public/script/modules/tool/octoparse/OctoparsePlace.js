import {
    getString,
    findDayNumberOfWeek,
    englishToTurkishDayNames,
    addressParser
} from '../util.js';

export class OctoparsePlace {
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
        this._name = json["Title"];
        this._description = json.description;

        return this;
    }

    _buildLocation(json) {
        const latitude = parseFloat(json["Latitude"]);
        const longitude = parseFloat(json["Longitude"]);
        this._location = {zoom: 0};
        this._location.latitude = Number.isNaN(latitude) ? 0 : latitude;
        this._location.longitude = Number.isNaN(longitude) ? 0 : longitude;
        return this;
    }

    _buildPlusCode(json) {
        if (typeof json.plusCode === 'string') {
            const regex = new RegExp(/([a-zA-Z]{+})(\+)([a-zA-Z]{+})/);
            const plusCode = regex.exec(json.plusCode);
            if (plusCode !== null) {
                this._plusCode = {
                    globalCode: plusCode
                };
            }
        }

        return this;
    }

    _buildAddress(json) {
        if (this._address === undefined) this._address = {};
        this._address.shortAddress = json["Address"];
        this._address.longAddress = json["Address"];

        return this;
    }

    _buildAddressComponents(json) {
        this._buildAddress(json);
        this._address.addressComponents = [
            {
                shortText: json["Country"],
                longText: json["Country"],
                categories: ["/api/category/address/components/1"],
                languageCode: "tr"
            },
            {
                shortText: json["State"],
                longText: json["State"],
                categories: ["/api/category/address/components/2"],
                languageCode: "tr"
            },
            {
                longText: json["City"],
                shortText: json["City"],
                categories: ["/api/category/address/components/4"],
                languageCode: "tr"
            }
        ];

        const addressComponents = addressParser(this._address.longAddress);
        if (addressComponents !== null) {
            if (addressComponents.street) {
                this._address.addressComponents.push({
                    longText: addressComponents.street,
                    shortText: addressComponents.street,
                    categories: ["/api/category/address/components/5"],
                    languageCode: "tr"
                })
            }

            if (addressComponents.avenue) {
                this._address.addressComponents.push({
                    longText: addressComponents.avenue,
                    shortText: addressComponents.avenue,
                    categories: ["/api/category/address/components/3"],
                    languageCode: "tr",
                });
            }

            if (addressComponents.streetNumber) {
                this._address.addressComponents.push({
                    longText: addressComponents.streetNumber,
                    shortText: addressComponents.streetNumber,
                    categories: ["/api/category/address/components/8"],
                    languageCode: "tr"
                });
            }

            if (addressComponents.postCode) {
                this._address.addressComponents.push({
                    longText: addressComponents.postCode,
                    shortText: addressComponents.postCode,
                    categories: ["/api/category/address/components/6"],
                    languageCode: "tr"
                });
            }
        }

        return this;
    }

    _buildContacts(json) {
        this.contacts = ["Website", "Phone"].map((key, index) => ({
            value: getString(json, key, ''),
            category: `/api/category/contacts/${index + 1}`
        }));

        return this;
    }

    _buildOpeningHours(json) {
        this._openingHours = [];
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
            const currentTime = json[`Open_Time_${day}`];

            if (typeof currentTime !== 'string') return undefined;

            const regex = new RegExp(/(AM|PM)([-–])([0-9]{2})/);
            const result = regex.exec(currentTime);

            if (result === undefined || result === null) return undefined;

            const middleVal = result[0];

            const timeParts = currentTime.split(middleVal);

            const openTime = timeParts[0].split(" ")[1];
            const openTimeDescription = result[1];
            const openTimeValue = parseInt(openTime);

            const closeTime = result[3];
            const closeTimeDescription = timeParts[1].split(" ")[0];
            const closeTimeValue = parseInt(closeTime);

            this._openingHours.push({
                description: `${englishToTurkishDayNames(day)}: ${openTime.trim()}:00 ${openTimeDescription.trim()} - ${closeTime.trim()}:00 ${closeTimeDescription.trim()}`,
                day: findDayNumberOfWeek(day),
                dayText: englishToTurkishDayNames(day),
                open: Number.isNaN(openTimeValue) ? 0 : openTimeValue,
                close: Number.isNaN(closeTimeValue) ? 0 : closeTimeValue,
                languageCode: 'tr',

            });
        });

        return this;
    }

    _buildReviews() {
        return this;
    }

    _buildPhotos(json) {
        this._photos = [];
        if (typeof json["Main_image"] === "string") this._photos.push(json["Main_image"]);
        let counter = 1;
        while (true) {
            if (typeof json[`Image_${counter}`] !== 'string') break;
            this._photos.push(json[`Image_${counter++}`]);
        }

        if (this._photos.length === 0) this._photos = undefined;

        return this;
    }

    _buildRating(json) {
        this._userRatingCount = parseInt(json["Review_Count"]);
        this._rating = parseFloat(json["Rating"]);

        if (Number.isNaN(this._userRatingCount)) this._userRatingCount = 0;
        if (Number.isNaN(this._rating)) this._rating = 0;

        return this;
    }

    _buildSources(json) {
        this._sources = [{
            sourceId: json["Place_id"],
            sourceUrl: json["Page_URL"],
            category: "/api/category/sources/7"
        }];

        return this;
    }

    _buildOptions(json) {
        this._options = {};
        this._options.delivery = getString(json, 'Delivery', null);
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
        return undefined;
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