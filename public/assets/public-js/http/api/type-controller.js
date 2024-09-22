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

    getPlaceTypes: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PLACE_TYPES, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getProductTypes: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PRODUCT_TYPES, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getMenuTypes: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.MENU_TYPES, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },

    /** GET **/

    getPlaceType: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_TYPES}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getProductType: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_TYPES}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },
    getMenuType: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.MENU_TYPES}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },

    /** POST **/

    postPlaceType: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PLACE_TYPES, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    postProductType: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PRODUCT_TYPES, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    postMenuType: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.MENU_TYPES, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** PUT **/

    putPlaceType: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_TYPES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    putProductType: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_TYPES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    putMenuType: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.MENU_TYPES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchPlaceType: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(`${ApiConstraint.PLACE_TYPES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    patchProductType: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(`${ApiConstraint.PRODUCT_TYPES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    patchMenuType: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(`${ApiConstraint.MENU_TYPES}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** DELETE **/

    deletePlaceType: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_TYPES}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    deleteProductType: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_TYPES}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
    deleteMenuType: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.MENU_TYPES}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    }
};
