$(document).ready(function(){

    $('#involvedBusinesses').DataTable({
        ajax: {
            url: '..',
            type: 'GET',
            headers :{
                accept: 'application/json'
            },
            data: (query) =>{
                return {
                    start: Math.floor(query.start/query.length) +1,
                    limit: query.length
                }

            },
            dataFilter : (data)=>{
                console.log(typeof data);

            }
        }
    })

})