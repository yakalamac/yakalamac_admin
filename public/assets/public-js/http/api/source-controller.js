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

    getPlaceSources: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.HOST_API, ApiConstraint.HOST_API, ApiConstraint.PLACE_SOURCES, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getProductSources: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.HOST_API, ApiConstraint.PRODUCT_SOURCES, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getMenuSources: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.HOST_API, ApiConstraint.MENU_SOURCES, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },

    /** GET **/

    getPlaceSource: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.HOST_API, `${ApiConstraint.PLACE_SOURCES}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getProductSource: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_SOURCES}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getMenuSource: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.HOST_API, `${ApiConstraint.MENU_SOURCES}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },

    /** POST **/

    postPlaceSource: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PLACE_SOURCES, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    postProductSource: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PRODUCT_SOURCES, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    postMenuSource: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.MENU_SOURCES, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** PUT **/

    putPlaceSource: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_SOURCES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    putProductSource: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_SOURCES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    putMenuSource: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.MENU_SOURCES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchPlaceSource: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_SOURCES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    patchProductSource: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_SOURCES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    patchMenuSource: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.MENU_SOURCES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** DELETE **/

    deletePlaceSource: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_SOURCES}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    deleteProductSource: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_SOURCES}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    deleteMenuSource: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.MENU_SOURCES}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    }
};
