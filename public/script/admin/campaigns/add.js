import {apiPost} from '../../modules/bundles/api-controller/ApiController.js';
$(document).ready(function() {

    const requiredFields = [
        { id: '#campaignName', message: 'Kampanya adı boş bırakılamaz!' },
        { id: '#startDate', message: 'Başlangıç tarihi seçilmelidir!' },
        { id: '#endDate', message: 'Bitiş tarihi seçilmelidir!' },
        {id:'#campaignType', message: 'Kampanya türü seçiniz!'},
        {id:'#descriptionArea', message: 'Açıklama kısmı boş bırakılamaz'},
        { id: '#bannerTitle', message: 'Banner başlığı girilmelidir!' },
        { id: '#bannerTag', message: 'Banner etiketi girilmelidir!'}
    ];

    const today = new Date().toISOString().split('T')[0];


    $('.form-check-input').change(function () {
        const idPrefix = $(this).attr('id').replace('Checkbox', '');
        const inputGroupId = '#' + idPrefix + 'InputGroup';

        if ($(this).is(':checked')) {
            $(inputGroupId).removeClass('d-none');
        } else {
            $(inputGroupId).addClass('d-none');
            $('#' + idPrefix + 'Value').val('');
        }
    });

    $('#startDate').val(today).attr('min', today);
    $('#endDate').attr('min', today);

    $('#startDate').on('change', function () {
        const selectedStart = $(this).val();
        $('#endDate').attr('min', selectedStart);

        if ($('#endDate').val() < selectedStart) {
            $('#endDate').val(selectedStart);
        }
    });
    $(document).on('change', '#endDate', function(){
        if($('#endDate').val()<$('#startDate').val())
        {
            alert('başlangıç tarihi, bitiş tarihinden büyük olamaz!')
        }
    })

    $(document).on('change','#imageUpload', function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageURL = URL.createObjectURL(file);
            $('#previewImage').attr('src', imageURL);
        } else {
            alert("Lütfen bir görsel dosyası seçin.");
        }
    });

    $(document).on('click', '#button-save', function(){
        const formData = new FormData()
        const discountSettings = [];
        const jsonFile = {}

        const startTime = $('#startDate').val();
        const endTime = $('#endDate').val();
        const file = $('#imageUpload')[0].files;
        const description = $('#descriptionArea').val();
        const maxPartipicationPerUser = $('#maxPartipicationPerUser').val()
        const name = $('#campaignName').val();
        const banner = {
            title: $('#bannerTitle').val(),
            tag: $('#bannerTag').val()
        }

        jsonFile.banner = banner;
        jsonFile.rules = discountSettings;
        //jsonFile.startTime = startTime;
        //jsonFile.endTime = endTime;
        jsonFile.description = description;
        jsonFile.maxPacketLifeTime = maxPartipicationPerUser;
        jsonFile.campaignType = 'GENERAL_BASE';
        jsonFile.name = name;

        $('#discountSettings .form-check').each(function(){
            const checkbox = $(this).find('.form-check-input');
            let input = $(this).find('input[type ="number"]');

            if(checkbox.is(':checked')){
                if(checkbox.val() !== 'TIME_RESTRICTION')
                {
                    discountSettings.push({
                        ruleType: checkbox.val(),
                        value: parseInt(input.val(),10)
                    })
                }
                else{
                    input = $(this).find('input[type="date"]');
                    discountSettings.push({
                        ruleType: checkbox.val(),
                        value: input.val()
                    })
                }
            }
        })
        formData.append('json', JSON.stringify(jsonFile));
        if(file.length > 0){
            formData.append('file',file[0]);
        }

        for(const fileId of requiredFields)
        {
            const value = $(fileId.id).val().trim();
            if(!value)
            {
                return alert(fileId.message)
            }
        }

        apiPost('/_multipart/campaigns/scope/yakala',{data: formData, format: 'multipart/form-data'});

    })

});