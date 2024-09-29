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

    getPlaceCategories: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PLACE_CATEGORIES, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getProductCategories: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PRODUCT_CATEGORIES, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getMenuCategories: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.MENU_CATEGORIES, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getAccountCategories: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.ACCOUNT_CATEGORIES, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getAddressComponentCategories: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.ADDRESS_COMPONENT_CATEGORIES, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** GET **/

    getPlaceCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CATEGORIES}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getProductCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_CATEGORIES}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getMenuCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.MENU_CATEGORIES}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getAccountCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.ACCOUNT_CATEGORIES}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    getAddressComponentCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.ADDRESS_COMPONENT_CATEGORIES}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** POST **/

    postPlaceCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PLACE_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    postProductCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PRODUCT_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    postMenuCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.HOST_API, ApiConstraint.MENU_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    postAccountCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.ACCOUNT_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    postAddressComponentCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.ADDRESS_COMPONENT_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    postPlaceCuisineCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PLACE_CUISINE_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    postPlaceConceptCategory: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PLACE_CONCEPT_CATEGORIES, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    /** PUT **/

    putPlaceCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    putProductCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    putMenuCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.MENU_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    putAccountCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.ACCOUNT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    putAddressComponentCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.ADDRESS_COMPONENT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    putPlaceCuisineCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CUISINE_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    putPlaceConceptCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CONCEPT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchPlaceCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    patchProductCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    patchMenuCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.MENU_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    patchAccountCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.ACCOUNT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    patchAddressComponentCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.ADDRESS_COMPONENT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    patchPlaceCuisineCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CUISINE_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    patchPlaceConceptCategory: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CONCEPT_CATEGORIES}/${id}`, data, null, null, 'application/json', 'application/merge-patch+json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },


    /** DELETE **/

    deletePlaceCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    deleteProductCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCT_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    deleteMenuCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.MENU_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    deleteAccountCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.ACCOUNT_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    deleteAddressComponentCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.ADDRESS_COMPONENT_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    deletePlaceCuisineCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CUISINE_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
    deletePlaceConceptCategory: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PLACE_CONCEPT_CATEGORIES}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
};
