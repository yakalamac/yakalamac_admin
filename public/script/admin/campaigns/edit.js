$(document).ready(function(){
    const selectedValues = [];
    let rules = [];
    function updateSelectOption(){

        $('.rule-select').each(function (){
            const val = $(this).val();

            if(!selectedValues.includes(val)){
                selectedValues.push(val);
            }
        })
        hideOption();
    }


    function hideOption(){
        $('.rule-select').each(function(){
            currentVal = $(this).val();

            $(this).find('option').each(function() {
                optVal = $(this).val();

                if(!optVal) return;

                if(selectedValues.includes(optVal) && currentVal !== optVal){
                    $(this).hide();

                }else{
                    $(this).show();
                }

            })
        })
    }
    $(document).on('click', '.repeater-remove-btn', function () {
        const $btn = $(this);
        const $card = $btn.closest('#div');
        const $select = $card.find('.rule-select');
        const val = $select.val();

        const index = selectedValues.indexOf(val);
        if (index !== -1) {
            selectedValues.splice(index, 1);
        }

        $select.find('option').each(function () {
            const optVal = $(this).val();
            if (optVal === val) {
                $(this).show();
            }
        });

        $card.remove();


    });

    $('.repeater-add-btn').on('click', function () {

        const $clone = $($('template#campaign-rule-template').html());

        $clone.find('select').val('');
        $clone.find('[data-rule]').hide();
        $clone.find('input').val('');
        $clone.find('select').prop('disabled', false)
        $clone.find('.text-success').remove();


        $('[data-group="options"] div.card-body').append($clone);
         hideOption();

    });

    $(document).on('click', '.repeater-save-btn', function(){
        updateSelectOption();
        const $btn = $(this);
        const $div = $btn.closest('#div');
        const ruleType = $div.find('.rule-select').val();

        if (!ruleType) return;

        const ruleData = { ruleType };

        $div.find('[data-rule="' + ruleType + '"] input').each(function () {
            const key = $(this).attr('data-name') || $(this).attr('name');
            const value = $(this).val();

            if (key && value) {
                ruleData[key] = isNaN(value) ? value : Number(value);
            }
        });

        //  aynı kural tipi varsa diziden çıkaracazz
        rules = rules.filter(r => r.ruleType !== ruleType);

        rules.push(ruleData);

        console.log(rules);
        $div.find('.rule-select').prop('disabled', true);

        $btn.replaceWith('<span class="text-success fw-bold"><i class="bi bi-check-circle-fill fs-3"></i></span>');
    });

    $(document).on('change', '.rule-select', function () {
        const val = $(this).val();
        const container = $(this).closest('.row');

        container.find('[data-rule]').hide();
        container.find(`[data-rule="${val}"]`).show();

    });

    $('[data-rule]').hide();

});