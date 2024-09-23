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

    getMenus: (onSuccess, onFailure, onError) => {
        return Ajax.get(ApiConstraint.MENUS, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** GET **/

    getMenu: (id, onSuccess, onFailure, onError) => {
        return Ajax.get(`${ApiConstraint.MENUS}/${id}`, null, null, null, 'json', null, Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** POST **/

    postMenu: (data, onSuccess, onFailure, onError) => {
        return Ajax.post(ApiConstraint.MENUS, data, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** PUT **/

    putMenu: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.put(`${ApiConstraint.MENUS}/${id}`, data, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** PATCH **/

    patchMenu: (id, data, onSuccess, onFailure, onError) => {
        return Ajax.patch(`${ApiConstraint.MENUS}/${id}`, data, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },

    /** DELETE **/

    deleteMenu: (id, onSuccess, onFailure, onError) => {
        return Ajax.delete(`${ApiConstraint.MENUS}/${id}`, null, null, null, 'json', 'application/json', Ajax.flags.DEFAULT_FLAG, onSuccess, onFailure, onError);
    },
};
