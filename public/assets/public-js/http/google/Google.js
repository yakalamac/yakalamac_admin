import Ajax from "../Ajax.js";
import GoogleConstraints from '../constraints/Google.js';

export default {
    getPlace : (id, onSuccess, onFailure, onError)=>{
        return Ajax.get(GoogleConstraints.HOST_GOOGLE_API, `${GoogleConstraints.PLACE_DETAILS}/${id}`, null, null, null, 'json', 'application/json', onSuccess, onFailure, onError);
    }
}
