import {getString, convertAddressComponentGoogleV2ToYakala} from '../util.js';

function getMostAcceptableReviewObject(json) {
    let commentTarget;
    if (json.text && json.text.languageCode === "tr") commentTarget = json.text;
    else if (json["originalText"] && json["originalText"].languageCode === "tr") commentTarget = json["originalText"];
    else if (json.text) commentTarget = json.text;
    else if (json["originalText"]) commentTarget = json["originalText"];
    else commentTarget = undefined;

    return {
        text:  commentTarget && commentTarget.text ? commentTarget.text : undefined,
        languageCode:  commentTarget && commentTarget.languageCode ? commentTarget.languageCode : undefined,
        rate: json.rating
    };
}

function autoSetOpeningHours(weekdayDescription) {
    const description = weekdayDescription;
    const dayText = weekdayDescription.split(": ")[0];
    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",].findIndex((day) => day === dayText) + 1;
    let open, close;
    if (weekdayDescription.includes("Closed")) {
        open = "24 hours";
        close = open;
    } else if (weekdayDescription.includes("24 hour")) {
        open = "Closed";
        close = open;
    } else {
        const hours = weekdayDescription.split(": ")[1].split(" – ");
        open = hours[0];
        close = hours[1];
    }
    const languageCode = "en_EN";

    return {description, dayText, day, open, close, languageCode};
}

function reverseOpeningHourObject(json) {
    const turkishWeekdays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const englishWeekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    json.open =
        typeof json.open === "string"
            ? json.open.includes("AM")
                ? json.open.replace("AM", "ÖÖ")
                : json.open.includes("PM")
                    ? json.open.replace("PM", "ÖS")
                    : json.open.includes("24 hours")
                        ? json.open.replace("24 hours", "24 saat")
                        : json.open.includes("Closed")
                            ? json.open.replace("Closed", "Kapalı")
                            : json.open
            : undefined;

    json.close =
        typeof json.close === "string"
            ? json.close.includes("AM")
                ? json.close.replace("AM", "ÖÖ")
                : json.close.includes("PM")
                    ? json.close.replace("PM", "ÖS")
                    : json.close.includes("24 hours")
                        ? json.close.replace("24 hours", "24 saat")
                        : json.close.includes("Closed")
                            ? json.close.replace("Closed", "Kapalı")
                            : json.close
            : undefined;

    json.dayText =
        typeof json.dayText === "string" ? englishWeekdays.includes(json.dayText) ? turkishWeekdays
                    .at(englishWeekdays.findIndex((d) => d === json.dayText))
                : turkishWeekdays.includes(json.dayText)
                    ? englishWeekdays.at(turkishWeekdays.findIndex((d) => d === json.dayText))
                    : json.dayText
            : undefined;
    if (json.dayText)
        if (["24 hours", "Closed", "Kapalı", "Açık", "24 Saat"].includes(json.open))
            json.description = json.dayText + ": " + json.open;
        else
            json.description = json.dayText + ": " + json.open + " – " + json.close;
    else json.dayText = undefined;

    if (turkishWeekdays.includes(json.dayText))
        json.languageCode = "tr";
    else if (englishWeekdays.includes(json.dayText))
        json.languageCode = "en_EN";
    else json.languageCode = undefined;

    return json;
}

export class GoogleV2Place {
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
        this._name = json.displayName.text;
        return this;
    }

    _buildViewport(json) {
        this._viewport = {
            low: {
                latitude: json?.viewport?.low?.latitude ?? 0,
                longitude: json?.viewport?.low?.longitude ?? 0
            },
            high: {
                latitude: json?.viewport?.high?.latitude ?? 0,
                longitude: json?.viewport?.high?.longitude ?? 0
            }
        }

        return this;
    }

    _buildLocation(json) {
        this._location = {
            latitude: json?.location?.latitude ?? 0,
            longitude: json?.location?.longitude ?? 0,
            zoom: 0
        };

        return this;
    }

    _buildPlusCode(json) {
        this._plusCode = {
            compoundCode : json.plusCode && json.plusCode.compoundCode ? json.plusCode.compoundCode : null,
            globalCode : json.plusCode && json.plusCode.globalCode ? json.plusCode.globalCode : null
        };

        return this;
    }

    _buildAddress(json) {
        if (this._address === undefined) this._address = {};
        this._address.longAddress = json["formattedAddress"];
        this._address.shortAddress = json["shortFormattedAddress"];

        return this;
    }

    _buildAddressComponents(json) {
        this._buildAddress(json);
        if(Array.isArray(json.addressComponents)) {
            this._address.addressComponents = json.addressComponents
                .map(addressComponent=> convertAddressComponentGoogleV2ToYakala(addressComponent))
                .filter(addressComponent => addressComponent !== undefined);
        }

        return this;
    }

    _buildContacts(json) {
        this.contacts = ["websiteUri", "nationalPhoneNumber", "phoneNumber"].map((key, index) => ({
            value: getString(json, key, ''),
            category: `/api/category/contacts/${index + 1}`
        }));

        return this;
    }

    _buildOpeningHours(json) {
        this._openingHours = [];
        if (
            json["regularOpeningHours"] &&
            json["regularOpeningHours"]["weekdayDescriptions"] &&
            Array.isArray(json["regularOpeningHours"]["weekdayDescriptions"])
        )  {

            Array.from(json["regularOpeningHours"]["weekdayDescriptions"]).forEach(weekdayDescription=>{
                this._openingHours.push(
                    reverseOpeningHourObject(
                        autoSetOpeningHours(weekdayDescription)
                    )
                );
            });
        }

        return this;
    }

    _buildReviews(json) {
        if (Array.isArray(json.reviews)) {
            this._reviews =  [];
            Array.from(json.reviews).forEach((review) => this._reviews.push(getMostAcceptableReviewObject(review)));
        }

        return this;
    }

    _buildPhotos() {
        return this;
    }

    _buildRating(json) {
        this._rating = json.rating;
        this._userRatingCount = json["userRatingCount"];

        return this;
    }

    _buildSources(json) {
        this._sources = [{
            sourceId: json.id,
            sourceUrl: json["googleMapsUri"],
            category: "/api/category/sources/7"
        }];

        return this;
    }

    _buildOptions(json) {
        this._options = {};
        Object.keys(json)
            .filter((key) => typeof json[key] === "boolean")
            .map((key) => (this._options[`${key}`] = json[key]));

        return this;
    }

    get viewport (){
        return this._viewport;
    }

    get options() {
        return this._options;
    }

    get photos() {
        return undefined;
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
        return undefined;
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