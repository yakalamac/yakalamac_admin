$(document).ready(function(){
    // Yakala DataTable
    $('#yakalaCampaignTable').DataTable({
        processing: true,
        serverSide: true,
        ajax:{
            url: '/_json/campaigns/scope/yakala',
            type: 'GET',
            headers: {
                accept: 'application/ld+json'
            },
            data: (d)=>{
                return {
                    page: Math.floor(d.start / d.length) +1,
                    limit: d.length
                }
            },
            dataFilter: (response)=>{
                if(typeof response === 'string') response = JSON.parse(response);
                console.log(response)
                if(!Array.isArray(response)){
                    return JSON.stringify({
                        recordsTotal: response['hydra:totalItems'],
                        data: response['hydra:member'],
                        recordsFiltered: response['hydra:totalItems'],
                        error: undefined
                    })
                }
            },
            error: (err)=>{
                console.log(`DataTable Ajax error :`, err );
            }
        },
        columns: [
            {
                data: 'banner',
                render: function(data){
                    if(data === undefined) return 'Afiş Bulunamadı';
                    if(data && data.path){
                        return `<img src="${data.path}"  alt="${data.altTag}" width="150"/>`;
                    }
                    else{
                        return '-';
                    }

                }
            },
            {
                data: null,
                render: function(data, type, row){
                    return row && row.name ? row.name.trim() : '';
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    if(!row && !(row.startTime && row.endTime)) return '';
                    return (row.startTime ? row.startTime: '-') +' / '+ (row.endTime ? row.endTime : '--') ;
                }
            },
            {
                data: null,
                render: (data, type, row)=>{
                    return row && row.maxPartipicationPerUser ? row.maxPartipicationPerUser.toString().trim() : '';
                }
            },
            {
                data:null,
                render: function(data, type, row){
                    if(!row && !Array.isArray(row.rules) && row.rules.length === 0) return '-';

                    return  row.rules.map(rule => rule.name).join('<br>').trim();
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (!row || !row.id) return '';
                    return `
                        <a href="/admin/campaign/detail/${row.id}">
                            <button class="btn btn-grd btn-grd-deep-blue edit-btn" 
                                <i class="fadeIn animated bx bx-edit"></i>
                            </button>
                        </a>
                        <button class="btn btn-grd btn-grd-danger yakala-delete-btn" data-id="${row.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 10,
        paging: true,
        searching: true,
        ordering: true
    })

    //custom DataTable
    $('#customCampaignTable').DataTable({
        serverSide: true,
        processing: true,
        ajax: {
            url: '/_json/campaigns/scope/custom',
            type:'GET',
            headers:{
                accept: 'application/json',
            },
            data: (d)=>{
                return {
                    page: Math.floor(d.length/d.start)+1,
                    limit: d.length
                }
            },
            dataFilter: (response)=>{
                if(typeof response === 'string') response = JSON.parse(response);

                if(!Array.isArray(response)){
                    return JSON.stringify({
                        draw: 0,
                        recordsTotal: response['hydra:totalItems'],
                        data: response['hydra:member'],
                        recordsFiltered: data['hydra:totalItems'],
                        error: undefined
                    })
                }
            },
            error: (error, errorText, xhr)=>{
                console.log('DataTable AJAX  error', error);
            },
        },
        columns: [
            {
                data: 'banner',
                render: function(data){
                    if(data === undefined) return 'Afiş Bulunamadı';
                    if(data && data.path){
                        count++;
                        return `<img src="${data.path}"  alt="${data.altTag}" width="100"/>`;
                    }
                    else{
                        console.log(count)
                        return 'Eklenmemiş';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    return row && row.name ? row.name.trim() : '';
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    if(!row && !(row.startTime && row.endTime)) return '';
                    return (row.startTime ? row.startTime: '-') +' / '+ (row.endTime ? row.endTime : '--') ;
                }
            },
            {
                data: null,
                render: (data, type, row)=>{
                    return row && row.maxPartipicationPerUser ? row.maxPartipicationPerUser.toString().trim() : '';
                }
            },
            {
                data:null,
                render: function(data, type, row){
                    console.log(row.rules)
                    if(!row && !Array.isArray(row.rules) && row.rules.length === 0) return '-';
                    return  row.rules.map(rule => rule.name).join('<br>').trim();
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (!row || !row.id) return '';
                    return `
                        <a href="/admin/campaign/detail/${row.id}">
                            <button class="btn btn-grd btn-grd-deep-blue edit-btn" 
                                <i class="fadeIn animated bx bx-edit"></i>
                            </button>
                        </a>
                        <button class="btn btn-grd btn-grd-danger yakala-delete-btn" data-id="${row.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        pageLength: 10,
        paging: true,
        searching: true,
        ordering: true
    })

    $('#yakalaCampaignTable tbody').on('click', '.yakala-delete-btn', function(){
        const id = $(this).data('id');
        if(confirm('Silmek istediğinize emin misiniz ? Yapılan işlem geri alınmaz.')){
            $.ajax({
                url: `/_json/campaigns/scope/yakala/${id}`,
                type: 'DELETE',
                success: function(response) {
                    console.log(response);
                },
                error: function(xhr){
                    console.log('Bir Hata oluştu:'+xhr);
                }

            })
        }
    })

    $(document).on('click', )
    $('#customCampaignTable tbody').on('click', '.custom-delete-btn', function(){
        const id = $(this).data('id')
        if(confirm('Silmek istediğinize emin misiniz ? Yapılan işlem geri alınmaz.')){
            $.ajax({
                url: `/_json/campaigns/scope/custom/${id}`,
                type: 'DELETE',
                success: function(response) {
                    console.log(response);
                },
                error: function(xhr){
                  console.log('Bir Hata oluştu:'+xhr);
                }

            })
        }
    })


})