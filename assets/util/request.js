export default {
    wasSuccess : (response)=>{
        return response.status > 199 && response.status < 300;
    }
}