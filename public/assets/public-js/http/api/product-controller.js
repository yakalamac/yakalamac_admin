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

    getProducts: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PRODUCTS, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },

    /** GET **/

    getProduct: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, null, null, null, 'json', null, onSuccess, onFailure, onError);
    },

    /** POST **/

    postProduct: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PRODUCTS, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** PUT **/

    putProduct: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchProduct: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, data, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },

    /** DELETE **/

    deleteProduct: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    },
};
