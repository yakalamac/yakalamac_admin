const daysOfWeek = [
    { 'day': 1, 'dayTextTR': 'Pazartesi', 'dayTextEN': 'Monday' },
    { 'day': 2, 'dayTextTR': 'Salı', 'dayTextEN': 'Tuesday' },
    { 'day': 3, 'dayTextTR': 'Çarşamba', 'dayTextEN': 'Wednesday' },
    { 'day': 4, 'dayTextTR': 'Perşembe', 'dayTextEN': 'Thursday' },
    { 'day': 5, 'dayTextTR': 'Cuma', 'dayTextEN': 'Friday' },
    { 'day': 6, 'dayTextTR': 'Cumartesi', 'dayTextEN': 'Saturday' },
    { 'day': 7, 'dayTextTR': 'Pazar', 'dayTextEN': 'Sunday' }
];


function initializeApplyToAllButton() {
    $('#apply-to-all').on('click', function () {
        const firstDay = daysOfWeek[0].day;
        const status = $(`#status_${firstDay}`).val();
        let openTime = $(`#open_${firstDay}`).val().trim();
        let closeTime = $(`#close_${firstDay}`).val().trim();

        if (status === 'hours') {
            if (openTime === '') openTime = '09:00';
            if (closeTime === '') closeTime = '22:00';
        }

        daysOfWeek.forEach(day => {
            if (day.day !== firstDay) {
                $(`#status_${day.day}`).val(status).trigger('change');
                if (status === 'hours') {
                    $(`#open_${day.day}`).val(openTime);
                    $(`#close_${day.day}`).val(closeTime);
                } else if (status === 'closed') {
                    $(`#open_${day.day}`).val('Kapalı');
                    $(`#close_${day.day}`).val('Kapalı');
                } else if (status === '24h') {
                    $(`#open_${day.day}`).val('24 saat');
                    $(`#close_${day.day}`).val('24 saat');
                }
            }
        });
    });
}


function initializeTimePickers() {
    $('.open-time, .close-time').timepicker({
        timeFormat: 'HH:mm',
        interval: 15,
        forceRoundTime: true,
        lang: {
            decimal: '.',
            mins: 'dakika',
            hr: 'saat',
            hrs: 'saat'
        }
    });
}

function initializeStatusSelects() {
    $('.status-select').on('change', function () {
        const day = $(this).data('day');
        const status = $(this).val();
        if (status === 'hours') {
            $(`#time_inputs_${day}`).show();
        } else {
            $(`#time_inputs_${day}`).hide();
        }
    });
}



initializeTimePickers();


function collectOpeningHours() {
    const openingHours = [];

    daysOfWeek.forEach(day => {
        ['tr_TR', 'en_EN'].forEach(lang => {
            let status = $(`#status_${day.day}`).val();
            let openTime = '';
            let closeTime = '';
            let description = '';

            if (status === 'hours') {
                openTime = $(`#open_${day.day}`).val().trim();
                closeTime = $(`#close_${day.day}`).val().trim();

                if (openTime === '' || closeTime === '') {
                    status = 'closed';
                    openTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                    closeTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                }

                if (status === 'hours') {
                    description = lang === 'tr_TR'
                        ? `${day.dayTextTR}: ${openTime} - ${closeTime}`
                        : `${day.dayTextEN}: ${formatTimeTo12Hour(openTime)} - ${formatTimeTo12Hour(closeTime)}`;
                }
            }

            if (status === 'closed') {
                openTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                closeTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
                description = lang === 'tr_TR'
                    ? `${day.dayTextTR}: Kapalı`
                    : `${day.dayTextEN}: Closed`;
            } else if (status === '24h') {
                openTime = lang === 'tr_TR' ? '24 saat' : '24 hours';
                closeTime = lang === 'tr_TR' ? '24 saat' : '24 hours';
                description = lang === 'tr_TR'
                    ? `${day.dayTextTR}: 24 Saat Açık`
                    : `${day.dayTextEN}: Open 24 hours`;
            }

            const existingHour = window.transporter.place.openingHours.find(oh => oh.day === day.day && oh.languageCode === lang);
            const openingHourId = existingHour ? existingHour.id : null;

            const ohData = {
                open: openTime,
                close: closeTime,
                day: day.day,
                dayText: lang === 'tr_TR' ? day.dayTextTR : day.dayTextEN,
                languageCode: lang,
                description: description
            };

            if (openingHourId) {
                ohData.id = openingHourId;
            }

            openingHours.push(ohData);
        });
    });

    return openingHours;
}

function formatTimeTo12Hour(timeStr) {
    const lowerTimeStr = timeStr.toLowerCase();
    if (lowerTimeStr === 'closed' || lowerTimeStr === 'kapalı') {
        return timeStr;
    }
    if (lowerTimeStr === '24 saat' || lowerTimeStr === '24 hours') {
        return timeStr;
    }
    const [hour, minute] = timeStr.split(':');
    let hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minuteNum < 10 ? '0' + minuteNum : minuteNum} ${period}`;
}