const checkName = (json)=>{
    return json.name && typeof json.name === 'string' && json.name.trim().length > 0;
}

const checkRating = (json)=>{
    return json.rating && typeof json.rating === 'number' && json.rating >= 0 && json.rating < 5;
}

const checkLogoUrl = (json)=>{
    return json.logoUrl && typeof json.logoUrl === 'string' && json.logoUrl.trim().length > 0
}

const checkPhotos = (json)=>{
    if(json.photos)
    {
        if(Array.isArray(json.photos))
        {
            for(let i=0; i<json.photos.length; i+=1)
                if(typeof json.photos[i] === 'object')
                {
                    if(json.photos[i].url && typeof json.photos[i].url === 'string')
                    {
                        if(json.photos[i].caption)
                        {
                            if(typeof json.photos[i].caption === 'string' && typeof json.photos[i].caption.trim().length  > 0)
                                continue;
                            else
                                return false;
                        }
                        continue;
                    }
                    return false;
                }
                else
                    return false;
        }
        return false;
    }
    return true;
};

function checkAddress(json) {
    if (json.address) {
        if (
            !(
                (json.address.longAddress && typeof json.address.longAddress === 'string')
                ||
                (json.address.shortAddress && typeof json.address.shortAddress === 'string')
            )
        )
            return false;


        if (Array.isArray(json.address.components)) {
            for(let i=0; i<json.address.components.length; i++)
            {
                if(typeof json.address.components[i] === 'object')
                {
                    if(json.address.components[i].text && typeof json.address.components[i].text === 'string'
                        && json.address.components[i].category && typeof json.address.components[i].category === 'string')
                        continue;
                    else
                        return false;
                }
                return false;
            }

        }
    }
    return true;
}

const checkLocation = (json)=>{
    if(json.location)
    {
        return typeof json.location === 'object'
            && json.location.latitude && typeof json.location.latitude === 'number'
            && json.location.longitude && typeof json.location.longitude === 'number';
    }
    return true;
};

const checkHashtag = (json)=>{
    return json.hashtags ?
        (Array.isArray(json.hashtags)
            ? (
                !json.hashtags.some(hashtag =>
                    typeof hashtag !== 'string'
                    ||
                        hashtag.trim().length < 1
                )
            )
            : false
        )
        : true;
}

function checkOpeningHours(json) {
    if(json.openingHours)
    {
        if (Array.isArray(json.openingHours)) {
            for (const entry of json.openingHours) {
                if (!(typeof entry.open === 'string' && typeof entry.close === 'string'))
                    return false;

                if (!(typeof entry.day === 'number' && (1 <= entry.day <= 7))) {
                    return false;
                }

                if (!(typeof entry.dayText === 'string')) {
                    return false;
                }

                if (!(typeof entry.languageCode === 'string')) {
                    return false;
                }

                if (typeof entry.description === 'string') {
                    return false;
                }
            }
            return false;
        }
    }
    return true;
}
const checkTypes = (json)=>{
    return json.types ?
        (Array.isArray(json.types)
                ? (
                    !json.types.some(types =>
                        typeof types !== 'string'
                        ||
                        (
                            types.trim().length < 1
                        )
                    )
                )
                : false
        )
        : true;
}
const checkCategory = (json)=>{
    return json.category ?
        (Array.isArray(json.category)
                ? (
                    !json.category.some(category =>
                        typeof category !== 'string'
                        ||
                        (
                             category.trim().length < 1
                        )
                    )
                )
                : false
        )
        : true;
}


const checkActive = (json)=>{
    return json.active ? (
        typeof json.active === 'boolean'
    ) : true;
}

const checkDescription = (json)=>{
    return json.description ? (
        typeof json.description === 'string' && json.description.trim().length > 0
    ) : true;
}

const checkPrice =(json)=>{
    return json.price && typeof json.price === 'number';
}

const checkImage = (json) =>
{
    return json.image
        ? typeof json.image === 'string' && /^(https?:\/\/)/.test(json.image)
        : true;
}

const checkProducts = (json)=>{
    if(json.products)
    {
        if(Array.isArray(json.products))
        {
             for(let i=0; i<json.products.length; i++)
             {
                 if(typeof json.products[i] === 'object')
                 {
                     if(
                         checkName(json.products[i]) && checkLogoUrl(json.products[i]) &&
                         checkCategory(json.products[i]) && checkHashtag(json.products[i])
                         && checkTypes(json.products[i]) && checkActive(json.products[i])
                         && checkDescription(json.products[i]) && checkPrice(json.products[i])
                         && checkImage(json.products[i])
                     )
                         continue;
                     else
                         return false;
                 } else {
                     return false;
                 }
             }
        }
        return false;
    }
    return true;
};


export default {
    /**
     *
     * @param {object} json
     */
    isValid : (json)=>{
        return checkName(json) && checkRating(json) && checkLogoUrl(json)
            && checkLocation(json) && checkHashtag(json) && checkCategory(json)
        && checkTypes(json) && checkPhotos(json) && checkProducts(json) && checkOpeningHours(json)
        && checkAddress(json)
    }
}
