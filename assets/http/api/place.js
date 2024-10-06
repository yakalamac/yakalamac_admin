const axios = require('axios');

const client = axios.create({
   baseURL: '/_api',
   headers: {
       'Content-Type' : 'application/json',
       'accept' : 'application/json'
   }
});

export default {
  postPlace : (data)=>{
      return client.post('/places', data)
          .then(response => {
              return response;
          })
          .catch(error => {
              return error;
          });
  }
};