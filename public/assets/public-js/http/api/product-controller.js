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
        return Ajax.get(ApiConstraint.HOST_API, ApiConstraint.PRODUCTS, null, null, null, 'application/json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** GET **/

    getProduct: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, null, null, null, 'application/json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** POST **/

    postProduct: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.HOST_API, ApiConstraint.PRODUCTS, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** PUT **/

    putProduct: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchProduct: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, data, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** DELETE **/

    deleteProduct: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(ApiConstraint.HOST_API, `${ApiConstraint.PRODUCTS}/${id}`, null, null, null, 'application/json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
};
