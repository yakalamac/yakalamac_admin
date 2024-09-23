/**
 * @author Barış Kudret
 * @author Alper Uyanık
 * @author Onur Kudret
 * @version 1.0.0
 */
import ApiConstraint from "../constraints/Api.js";
import Ajax from "../Ajax.js";

export default {

    /** GET COLLECTION **/

    getProductPhotos: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PRODUCT_PHOTOS, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** GET **/

    getProductPhoto: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_PHOTOS}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** POST **/

    postProductPhoto: (id, data, file, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, `product/${id}/image/photos`, data, file, file, 'json', 'multipart/form-data', Ajax.flags.MULTIPART_FLAG, onSuccess, onFailure, onError);
    },

    /** PUT **/

    putProductPhoto: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_PHOTOS}/${id}`, data, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchProductPhoto: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_PHOTOS}/${id}`, data, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** DELETE **/

    deleteProductPhoto: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_PHOTOS}/${id}`, null, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
};
