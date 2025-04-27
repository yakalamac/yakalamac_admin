$(document).ready(function(){

    // Yakala DataTable
    $('#yakalaCampaignTable').DataTable({

        ajax:{
            url: '_json/campaigns/scope/yakala',
            type: 'GET',
            headers: {
                accept: 'application/json'
            },
            data: (d)=>{
                return {
                    page: Math.floor(d.start / d.length)+1,
                    limit: d.length
                }
            },
            dataFilter: (response)=>{
                if(typeof response === 'string') response = JSON.parse(response);

                if(!Array.isArray(response)){
                    return JSON.stringify({
                        recordsTotal: response['hydra:totalItems'],
                        data: response['hydra:member'],
                        recordsFiltered: data['hydra:totalItems'],
                        error: undefined
                    })
                }
            },

        },
        columns: [
            {
                data: null,
                render: function(data, type, row){
                    return row && row.name ? row.name.trim() : '';
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    return row && row.campaignType ? row.campaignType.trim() : '';
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    if(!row && !(row.startTime && row.endTime)) return '';
                    return row.startTime+'/'+row.endTime;
                }
            },
            {
                data: null,
                render: (data, type, row)=>{
                    return row && row.maxPartipicationPerUser ? row.maxPartipicationPerUser.trim() : '';
                }
            },
            {
                data:null,
                render: function(data, type, row){
                    if(!row && !Array.isArray(row.rules) && row.rules.length === 0) return '-';

                    return  row.rules.map(rule => rule.ruleType).join('\n').trim();
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (!row || !row.id) return '';
                    return `
                        <a href="/admin/dictionary/detail/${row.id}">
                            <button class="btn btn-grd btn-grd-deep-blue edit-btn" 
                                data-id="${row.id}" 
                                data-name="${row.name || ''}" 
                                data-serviceType="${row.serviceType || ''}" 
                                data-servedWith="${row.servedWith || ''}"
                                data-description="${row.description || ''}">
                                <i class="fadeIn animated bx bx-pencil"></i>
                            </button>
                        </a>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }

        ]
    })
    //custom DataTable
    $('#customCampaignTable').DataTable({

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
        columns:[
            {
                data: null,
                render: function(data, type, row){
                    return row && row.name ? row.name.trim() : '';
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    return row && row.campaignType ? row.campaignType.trim() : '';
                }
            },
            {
                data: null,
                render: function(data, type, row){
                    if(!row && !(row.startTime && row.endTime)) return '';
                    return row.startTime+'/'+row.endTime;
                }
            },
            {
                data: null,
                render: (data, type, row)=>{
                    return row && row.maxPartipicationPerUser ? row.maxPartipicationPerUser.trim() : '';
                }
            },
            {
                data:null,
                render: function(data, type, row){
                    if(!row && !Array.isArray(row.rules) && row.rules.length === 0) return '-';

                    return  row.rules.map(rule => rule.ruleType).join('\n').trim();
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (!row || !row.id) return '';
                    return `
                        <a href="/admin/dictionary/detail/${row.id}">
                            <button class="btn btn-grd btn-grd-deep-blue edit-btn" 
                                data-id="${row.id}" 
                                data-name="${row.name || ''}" 
                                data-serviceType="${row.serviceType || ''}" 
                                data-servedWith="${row.servedWith || ''}"
                                data-description="${row.description || ''}">
                                <i class="fadeIn animated bx bx-pencil"></i>
                            </button>
                        </a>
                        <button class="btn btn-grd btn-grd-danger delete-btn" data-id="${row.id}">
                            <i class="lni lni-trash"></i>
                        </button>
                    `;
                }
            }
        ],
    })
})