$(document).ready(function(){
    const selectedValues = [];
    let rules = [];

    function updateSelectOption(){
        selectedValues.length = 0;
        $('.rule-select').each(function (){
            const val = $(this).val();
            if(val && !selectedValues.includes(val)){
                selectedValues.push(val);
            }
        });
        hideOption();
    }

    console.log(campaign);
    const campaignData = (typeof campaign !== 'undefined' && campaign.length > 0) ? campaign[0] : null;

    if (campaignData && Array.isArray(campaignData.rules)) {
        campaignData.rules.forEach(function (rule) {
            const ruleType = rule.ruleType || rule.name.toUpperCase().replace(' ', '_');

            const $clone = $($('template#campaign-rule-template').html());

            $clone.find('[data-rule]').hide();

            const $ruleBlock = $clone.find(`[data-rule="${ruleType}"]`);
            $ruleBlock.show();

            $clone.find('.rule-select').val(ruleType).prop('disabled', true);

            $ruleBlock.find('input').each(function () {
                const $input = $(this);

                const key = $input.attr('name') || $input.data('name');
                if (key && rule.hasOwnProperty(key)) {
                    $input.val(rule[key]);
                }
            });

            $('[data-group="options"] div.card-body').append($clone);


            $clone.find('.repeater-save-btn').replaceWith('<span class="text-success fw-bold"><i class="bi bi-check-circle-fill fs-3"></i></span>');


            if (!selectedValues.includes(ruleType)) {
                selectedValues.push(ruleType);
            }

            rules.push({
                ruleType: ruleType,
                ...rule
            });
        });

        hideOption();
    }

    function hideOption(){

        $('.rule-select:not(:disabled)').each(function(){
            const currentVal = $(this).val();
            $(this).find('option').each(function() {
                const optVal = $(this).val();
                if(!optVal) return;

                if(selectedValues.includes(optVal) && currentVal !== optVal){
                    $(this).hide();
                }else{
                    $(this).show();
                }
            });
        });
    }

    $(document).on('click', '.repeater-remove-btn', function () {
        const $btn = $(this);
        const $card = $btn.closest('.row');
        if ($card.length === 0) return;

        const $select = $card.find('.rule-select');
        const val = $select.val();

        rules = rules.filter(r => r.ruleType !== val);

        const index = selectedValues.indexOf(val);
        if (index !== -1) {
            selectedValues.splice(index, 1);
        }

        $card.remove();
        updateSelectOption();
        console.log(rules);
    });

    $('.repeater-add-btn').on('click', function () {
        const $clone = $($('template#campaign-rule-template').html());

        $clone.find('select').val('');
        $clone.find('[data-rule]').hide();
        $clone.find('input').val('');
        $clone.find('select').prop('disabled', false);
        $clone.find('.text-success').remove();

        $('[data-group="options"] div.card-body').append($clone);
        updateSelectOption();
    });

    $(document).on('click', '.repeater-save-btn', function(){
        const $btn = $(this);
        const $div = $btn.closest('.row');
        const $select = $div.find('.rule-select');
        const ruleType = $select.val();

        if (!ruleType) {
            alert('Lütfen bir kural tipi seçiniz.');
            return;
        }

        const ruleData = { ruleType };
        let isValid = true;

        $div.find('[data-rule="' + ruleType + '"] input').each(function () {
            const $input = $(this);
            const key = $input.data('name') || $input.attr('name');
            const value = $input.val();

            if (!value && $input.prop('required')) {
                isValid = false;
                $input.addClass('is-invalid');
                console.error(`Hata: ${key} alanı boş olamaz.`);
            } else {
                $input.removeClass('is-invalid');
            }

            if (key && value) {
                ruleData[key] = !isNaN(value) && value.trim() !== '' ? Number(value) : value;
            } else if (key) {
            }
        });

        if (!isValid) {
            alert('Lütfen işaretli alanları doldurunuz.');
            return;
        }


        rules = rules.filter(r => r.ruleType !== ruleType);
        rules.push(ruleData);

        console.log('Updated Rules:', rules);

        $select.prop('disabled', true);
        $btn.replaceWith('<span class="text-success fw-bold"><i class="bi bi-check-circle-fill fs-3"></i></span>');

        updateSelectOption();
    });

    $(document).on('change', '.rule-select', function () {
        const $select = $(this);
        const val = $select.val();
        const container = $select.closest('.row');

        container.find('[data-rule]').hide();
        container.find(`[data-rule="${val}"]`).show();
        const $checkmark = container.find('.text-success');
        if($checkmark.length > 0){

            const saveButtonHtml = '<button class="btn btn-success save-btn repeater-save-btn w-50"><i class="lni lni-save"></i></button>'; // Template'deki butonun aynısı
            $checkmark.replaceWith(saveButtonHtml);
            $select.prop('disabled', false);
        }

    });

});