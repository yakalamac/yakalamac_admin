'use strict';
import { initializeSelect2Auto } from '../../modules/select-bundle/select2.js';
import { apiGet } from '../../modules/api-controller/ApiController.js';

/**
 * @param {string} str
 * @param {string} spl
 * @returns {string}
 */
const toCamelCase = (str, spl = '-') => {
  const pascalCase = str
    .split(spl)
    .map((each) => each[0].toUpperCase() + each.slice(1))
    .join('');
  return pascalCase.at(0).toLowerCase() + pascalCase.slice(1);
};

/**
 * Capitalizes string
 * @param {string} string
 * @returns {string}
 */
function capitalizeWords(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

$.InitializeAddressZone(undefined, true);
window.place_description_adapter = (data) => ({
  text: data.description,
  id: data.id,
});
window.place_tag_adapter = (data) => ({ text: data.tag, id: data.id });
initializeSelect2Auto();
initContactZone();
initAccountZone();

/*
const accountsContainer = document.getElementById('accounts-container');
    Sortable.create(accountsContainer, {
        handle: '.drag-handle',
        animation: 150,
        onEnd: function () {
            $('#accounts-container li.list-group-item').each(function (index) {
                $(this).find('.account-priority-input').val(index + 1);
            });
        },
    });
 */

const daysOfWeek = [
  { day: 1, dayTextTR: 'Pazartesi', dayTextEN: 'Monday' },
  { day: 2, dayTextTR: 'Salı', dayTextEN: 'Tuesday' },
  { day: 3, dayTextTR: 'Çarşamba', dayTextEN: 'Wednesday' },
  { day: 4, dayTextTR: 'Perşembe', dayTextEN: 'Thursday' },
  { day: 5, dayTextTR: 'Cuma', dayTextEN: 'Friday' },
  { day: 6, dayTextTR: 'Cumartesi', dayTextEN: 'Saturday' },
  { day: 7, dayTextTR: 'Pazar', dayTextEN: 'Sunday' },
];

window.transporter = {
  productCategories: [],
  productTypes: [],
  productTags: [],
};

let googleToAppTypeMapping = {};

$(document).ready(function () {
  /**
   * @var $
   * @method timepicker
   * */
  // Initialize time pickers
  $('.open-time, .close-time').timepicker({
    timeFormat: 'HH:mm',
    interval: 15,
    forceRoundTime: true,
    lang: { decimal: '.', mins: 'dakika', hr: 'saat', hrs: 'saat' },
  });

  // initialize status selects
  $('.status-select').on('change', function () {
    const day = $(this).data('day');
    const status = $(this).val();
    if (status === 'hours') {
      $(`#time_inputs_${day}`).show();
    } else {
      $(`#time_inputs_${day}`).hide();
    }
  });

  initializeApplyToAllButton();

  $('#get-data-button').on('click', () => {
    const id = $('#google_place_id_input').val()?.trim();
    if (typeof id !== 'string' || id.length < 10) {
      alert('Lütfen geçerli bir Google Place ID giriniz.');
      return;
    }
    clearAllInputs();
    getPlaceDetails(id);
  });
});

const staticData = (id) => {
  const button = $('#get-data-button');
  button.prop('disabled', true).text('Yükleniyor...');

  // bu alan kalkacak retun kadar (istek engelleniyor)
  const data = {
    name: 'places/ChIJ3UWd1D17uRQRVJCIoOo4pkQ',
    id: 'ChIJ3UWd1D17uRQRVJCIoOo4pkQ',
    types: [
      'middle_eastern_restaurant',
      'restaurant',
      'food',
      'point_of_interest',
      'establishment',
    ],
    nationalPhoneNumber: '(0232) 479 16 16',
    internationalPhoneNumber: '+90 232 479 16 16',
    formattedAddress: 'Yeşilçam, 2001. Sk. No:39, 35050 Bornova/İzmir, Türkiye',
    addressComponents: [
      {
        longText: 'No:39',
        shortText: 'No:39',
        types: ['street_number'],
        languageCode: 'en-US',
      },
      {
        longText: '2001. Sokak',
        shortText: '2001. Sk.',
        types: ['route'],
        languageCode: 'tr',
      },
      {
        longText: 'Yeşilçam',
        shortText: 'Yeşilçam',
        types: ['administrative_area_level_4', 'political'],
        languageCode: 'tr',
      },
      {
        longText: 'Bornova',
        shortText: 'Bornova',
        types: ['administrative_area_level_2', 'political'],
        languageCode: 'tr',
      },
      {
        longText: 'İzmir',
        shortText: 'İzmir',
        types: ['administrative_area_level_1', 'political'],
        languageCode: 'tr',
      },
      {
        longText: 'Türkiye',
        shortText: 'TR',
        types: ['country', 'political'],
        languageCode: 'en',
      },
      {
        longText: '35050',
        shortText: '35050',
        types: ['postal_code'],
        languageCode: 'en-US',
      },
    ],
    plusCode: {
      globalCode: '8GC9C7WW+QW',
      compoundCode: 'C7WW+QW Bornova/İzmir, Türkiye',
    },
    location: {
      latitude: 38.4469551,
      longitude: 27.2973658,
    },
    viewport: {
      low: {
        latitude: 38.4455519197085,
        longitude: 27.2960171697085,
      },
      high: {
        latitude: 38.4482498802915,
        longitude: 27.298715130291505,
      },
    },
    rating: 3,
    googleMapsUri: 'https://maps.google.com/?cid=4946703821079875668',
    regularOpeningHours: {
      openNow: true,
      periods: [
        {
          open: {
            day: 0,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 0,
            hour: 23,
            minute: 30,
          },
        },
        {
          open: {
            day: 1,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 1,
            hour: 23,
            minute: 30,
          },
        },
        {
          open: {
            day: 2,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 2,
            hour: 23,
            minute: 30,
          },
        },
        {
          open: {
            day: 3,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 3,
            hour: 23,
            minute: 30,
          },
        },
        {
          open: {
            day: 4,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 4,
            hour: 23,
            minute: 30,
          },
        },
        {
          open: {
            day: 5,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 5,
            hour: 23,
            minute: 30,
          },
        },
        {
          open: {
            day: 6,
            hour: 8,
            minute: 0,
          },
          close: {
            day: 6,
            hour: 23,
            minute: 30,
          },
        },
      ],
      weekdayDescriptions: [
        'Monday: 8:00 AM – 11:30 PM',
        'Tuesday: 8:00 AM – 11:30 PM',
        'Wednesday: 8:00 AM – 11:30 PM',
        'Thursday: 8:00 AM – 11:30 PM',
        'Friday: 8:00 AM – 11:30 PM',
        'Saturday: 8:00 AM – 11:30 PM',
        'Sunday: 8:00 AM – 11:30 PM',
      ],
      nextCloseTime: '2025-04-05T20:30:00Z',
    },
    utcOffsetMinutes: 180,
    adrFormatAddress:
      '<span class="street-address">Yeşilçam, 2001. Sk. No:39</span>, <span class="postal-code">35050</span> <span class="locality">Bornova</span>/<span class="region">İzmir</span>, <span class="country-name">Türkiye</span>',
    businessStatus: 'OPERATIONAL',
    userRatingCount: 7,
    iconMaskBaseUri:
      'https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet',
    iconBackgroundColor: '#FF9E67',
    displayName: {
      text: 'Aydınlılar Yeşilçam',
      languageCode: 'tr',
    },
    primaryTypeDisplayName: {
      text: 'Middle Eastern Restaurant',
      languageCode: 'en-US',
    },
    takeout: true,
    dineIn: true,
    servesLunch: true,
    servesBeer: false,
    servesWine: false,
    currentOpeningHours: {
      openNow: true,
      periods: [
        {
          open: {
            day: 0,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 6,
            },
          },
          close: {
            day: 0,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 6,
            },
          },
        },
        {
          open: {
            day: 1,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 7,
            },
          },
          close: {
            day: 1,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 7,
            },
          },
        },
        {
          open: {
            day: 2,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 8,
            },
          },
          close: {
            day: 2,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 8,
            },
          },
        },
        {
          open: {
            day: 3,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 9,
            },
          },
          close: {
            day: 3,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 9,
            },
          },
        },
        {
          open: {
            day: 4,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 10,
            },
          },
          close: {
            day: 4,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 10,
            },
          },
        },
        {
          open: {
            day: 5,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 11,
            },
          },
          close: {
            day: 5,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 11,
            },
          },
        },
        {
          open: {
            day: 6,
            hour: 8,
            minute: 0,
            date: {
              year: 2025,
              month: 4,
              day: 5,
            },
          },
          close: {
            day: 6,
            hour: 23,
            minute: 30,
            date: {
              year: 2025,
              month: 4,
              day: 5,
            },
          },
        },
      ],
      weekdayDescriptions: [
        'Monday: 8:00 AM – 11:30 PM',
        'Tuesday: 8:00 AM – 11:30 PM',
        'Wednesday: 8:00 AM – 11:30 PM',
        'Thursday: 8:00 AM – 11:30 PM',
        'Friday: 8:00 AM – 11:30 PM',
        'Saturday: 8:00 AM – 11:30 PM',
        'Sunday: 8:00 AM – 11:30 PM',
      ],
      nextCloseTime: '2025-04-05T20:30:00Z',
    },
    primaryType: 'middle_eastern_restaurant',
    shortFormattedAddress: 'Yeşilçam, 2001. Sk. No:39, Bornova',
    reviews: [
      {
        name: 'places/ChIJ3UWd1D17uRQRVJCIoOo4pkQ/reviews/ChZDSUhNMG9nS0VJQ0FnSUNZNmVXS09REAE',
        relativePublishTimeDescription: '5 years ago',
        rating: 3,
        text: {
          text: 'Worth a visit alone far away',
          languageCode: 'en-US',
        },
        originalText: {
          text: 'Ziyaret edilmeye değer yalnız uzak',
          languageCode: 'tr',
        },
        authorAttribution: {
          displayName: 'Şanver Kuplay',
          uri: 'https://www.google.com/maps/contrib/117401743755710278740/reviews',
          photoUri:
            'https://lh3.googleusercontent.com/a/ACg8ocKWoA4yv8FAKJ8iZWu6iSh71kBSnUWSxY3QuQ8f2eJmHaxRQQ=s128-c0x00000000-cc-rp-mo-ba4',
        },
        publishTime: '2019-04-15T09:31:26.550338Z',
        flagContentUri:
          'https://www.google.com/local/review/rap/report?postId=ChZDSUhNMG9nS0VJQ0FnSUNZNmVXS09REAE&d=17924085&t=1',
        googleMapsUri:
          'https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChZDSUhNMG9nS0VJQ0FnSUNZNmVXS09REAE!2m1!1s0x14b97b3dd49d45dd:0x44a638eaa0889054',
      },
      {
        name: 'places/ChIJ3UWd1D17uRQRVJCIoOo4pkQ/reviews/ChZDSUhNMG9nS0VJQ0FnSUM0cUplQU9BEAE',
        relativePublishTimeDescription: '5 years ago',
        rating: 1,
        text: {
          text: 'Even this is too much',
          languageCode: 'en-US',
        },
        originalText: {
          text: 'Bu bile cok',
          languageCode: 'tr',
        },
        authorAttribution: {
          displayName: 'Turgut Koçak',
          uri: 'https://www.google.com/maps/contrib/105905071622662216886/reviews',
          photoUri:
            'https://lh3.googleusercontent.com/a-/ALV-UjVXD6Zi8LVXK02X2BDOMz156HogcQy7iDwhXF3-0OACLrD4fwNS=s128-c0x00000000-cc-rp-mo-ba3',
        },
        publishTime: '2019-05-31T23:07:23.236060Z',
        flagContentUri:
          'https://www.google.com/local/review/rap/report?postId=ChZDSUhNMG9nS0VJQ0FnSUM0cUplQU9BEAE&d=17924085&t=1',
        googleMapsUri:
          'https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChZDSUhNMG9nS0VJQ0FnSUM0cUplQU9BEAE!2m1!1s0x14b97b3dd49d45dd:0x44a638eaa0889054',
      },
      {
        name: 'places/ChIJ3UWd1D17uRQRVJCIoOo4pkQ/reviews/ChdDSUhNMG9nS0VJQ0FnSUNHdkwyQndBRRAB',
        relativePublishTimeDescription: '3 years ago',
        rating: 5,
        authorAttribution: {
          displayName: 'kemal karaman',
          uri: 'https://www.google.com/maps/contrib/110303586047755629435/reviews',
          photoUri:
            'https://lh3.googleusercontent.com/a-/ALV-UjWUQwJa8sOOHCSOB4vAiGGwA9XCBzK-6XjOMa91NQRC1GavPzc=s128-c0x00000000-cc-rp-mo-ba2',
        },
        publishTime: '2021-10-23T13:06:06.435222Z',
        flagContentUri:
          'https://www.google.com/local/review/rap/report?postId=ChdDSUhNMG9nS0VJQ0FnSUNHdkwyQndBRRAB&d=17924085&t=1',
        googleMapsUri:
          'https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnSUNHdkwyQndBRRAB!2m1!1s0x14b97b3dd49d45dd:0x44a638eaa0889054',
      },
      {
        name: 'places/ChIJ3UWd1D17uRQRVJCIoOo4pkQ/reviews/ChdDSUhNMG9nS0VJQ0FnSUM2X3Q2azZ3RRAB',
        relativePublishTimeDescription: '3 years ago',
        rating: 5,
        authorAttribution: {
          displayName: 'Levent Öztürk',
          uri: 'https://www.google.com/maps/contrib/112024215551674018651/reviews',
          photoUri:
            'https://lh3.googleusercontent.com/a-/ALV-UjUCDGP6RLMETZci9-vjpvZS0Ta_mpIQOagcatlnHHq3j2UUTDt3Cg=s128-c0x00000000-cc-rp-mo',
        },
        publishTime: '2021-09-05T20:37:20.336192Z',
        flagContentUri:
          'https://www.google.com/local/review/rap/report?postId=ChdDSUhNMG9nS0VJQ0FnSUM2X3Q2azZ3RRAB&d=17924085&t=1',
        googleMapsUri:
          'https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnSUM2X3Q2azZ3RRAB!2m1!1s0x14b97b3dd49d45dd:0x44a638eaa0889054',
      },
      {
        name: 'places/ChIJ3UWd1D17uRQRVJCIoOo4pkQ/reviews/ChdDSUhNMG9nS0VJQ0FnSURVLWRhVnRRRRAB',
        relativePublishTimeDescription: '5 years ago',
        rating: 1,
        authorAttribution: {
          displayName: 'Hasret Ksm',
          uri: 'https://www.google.com/maps/contrib/101748299213899579637/reviews',
          photoUri:
            'https://lh3.googleusercontent.com/a/ACg8ocLjcU_Z-V7Sc2qaia5YeQUg5iWkPL1Xk6z9eqrE6tI3JMgWxQ=s128-c0x00000000-cc-rp-mo',
        },
        publishTime: '2019-08-29T05:53:39.286587Z',
        flagContentUri:
          'https://www.google.com/local/review/rap/report?postId=ChdDSUhNMG9nS0VJQ0FnSURVLWRhVnRRRRAB&d=17924085&t=1',
        googleMapsUri:
          'https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnSURVLWRhVnRRRRAB!2m1!1s0x14b97b3dd49d45dd:0x44a638eaa0889054',
      },
    ],
    liveMusic: false,
    servesCocktails: false,
    restroom: true,
    pureServiceAreaBusiness: false,
    addressDescriptor: {
      landmarks: [
        {
          name: 'places/ChIJ0duyuj17uRQRDFMDBh7UBIM',
          placeId: 'ChIJ0duyuj17uRQRDFMDBh7UBIM',
          displayName: {
            text: 'Yeşilçam Cami',
            languageCode: 'tr',
          },
          types: [
            'establishment',
            'mosque',
            'place_of_worship',
            'point_of_interest',
          ],
          spatialRelationship: 'DOWN_THE_ROAD',
          straightLineDistanceMeters: 155.09422,
          travelDistanceMeters: 153.99025,
        },
        {
          name: 'places/ChIJqw-cIDx7uRQRvnmejHgAs78',
          placeId: 'ChIJqw-cIDx7uRQRvnmejHgAs78',
          displayName: {
            text: 'Şehit Musa Can Ortaokulu',
            languageCode: 'tr',
          },
          types: ['establishment', 'point_of_interest', 'school'],
          spatialRelationship: 'DOWN_THE_ROAD',
          straightLineDistanceMeters: 103.33972,
          travelDistanceMeters: 110.00079,
        },
        {
          name: 'places/ChIJCbJqAz97uRQRgnyb7zGIrdY',
          placeId: 'ChIJCbJqAz97uRQRgnyb7zGIrdY',
          displayName: {
            text: 'Warehouse Website',
            languageCode: 'en',
          },
          types: ['establishment', 'point_of_interest', 'storage'],
          straightLineDistanceMeters: 273.25543,
          travelDistanceMeters: 653.3377,
        },
        {
          name: 'places/ChIJ8bIYLDx7uRQRO8cVnlGnDgE',
          placeId: 'ChIJ8bIYLDx7uRQRO8cVnlGnDgE',
          displayName: {
            text: 'A101',
            languageCode: 'en',
          },
          types: [
            'establishment',
            'food',
            'grocery_or_supermarket',
            'point_of_interest',
            'store',
            'supermarket',
          ],
          straightLineDistanceMeters: 46.942352,
          travelDistanceMeters: 69.90345,
        },
        {
          name: 'places/ChIJ9XIWSD57uRQRYuL7hcWMzFo',
          placeId: 'ChIJ9XIWSD57uRQRYuL7hcWMzFo',
          displayName: {
            text: 'Efes Çadır ve Tente A.Ş.',
            languageCode: 'tr',
          },
          types: ['establishment', 'point_of_interest'],
          straightLineDistanceMeters: 279.48306,
          travelDistanceMeters: 297.26334,
        },
      ],
    },
    googleMapsLinks: {
      directionsUri:
        "https://www.google.com/maps/dir//''/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x14b97b3dd49d45dd:0x44a638eaa0889054!3e0",
      placeUri: 'https://maps.google.com/?cid=4946703821079875668',
      writeAReviewUri:
        'https://www.google.com/maps/place//data=!4m3!3m2!1s0x14b97b3dd49d45dd:0x44a638eaa0889054!12e1',
      reviewsUri:
        'https://www.google.com/maps/place//data=!4m4!3m3!1s0x14b97b3dd49d45dd:0x44a638eaa0889054!9m1!1b1',
      photosUri:
        'https://www.google.com/maps/place//data=!4m3!3m2!1s0x14b97b3dd49d45dd:0x44a638eaa0889054!10e5',
    },
    timeZone: {
      id: 'Europe/Istanbul',
    },
    postalAddress: {
      regionCode: 'TR',
      languageCode: 'en-US',
      postalCode: '35050',
      administrativeArea: 'İzmir',
      locality: 'Bornova',
      addressLines: ['Yeşilçam', '2001. Sk. No:39'],
    },
  };

  populateFormFields(data, id);
  $('#google-data-modal').modal('hide');
  button.prop('disabled', false).text('Ara');

  return;
};

const clearAllInputs = () => {
  $('input').not('#google_place_id_input').val('');
  $('select').val('').trigger('change');
};

//google start
const getPlaceDetails = (id) => {
  // Prevent google request costs
  // return staticData(id);

  const button = $('#get-data-button');
  button.prop('disabled', true).text('Yükleniyor...');

  apiGet(`/_google/place/details/${id}`, {
    successMessage: 'İşletme bilgileri başarıyla alındı',
    success: (data) => {
      populateFormFields(data, id);
      $('#google-data-modal').modal('hide');
      button.prop('disabled', false).text('Ara');
    },
    errorMessage:
      "İşletme bilgileri alınamadı. Lütfen Place ID'yi ve API yapılandırmanızı kontrol ediniz.",
  });
};

/**
 * @param {object} place
 * @param {string} id
 */
function populateFormFields(place, id) {
  $('#place_name').val(place.displayName?.text ?? '');
  $('#place_rate').val(place.rating ?? '');
  $('#place_rating_count').val(place?.userRatingCount ?? '');

  $('#sources-container .source-id-input[data-category-id="7"]').val(id);

  if (place.location) {
    $('#place_location_latitude').val(place.location.latitude ?? '');
    $('#place_location_longitude').val(place.location.longitude ?? '');
    $('#place_location_zoom').val(15);
  }

  $('#place_long_address').val(place.formattedAddress || '');
  $('#place_short_address').val(place.shortFormattedAddress || '');

  if (place.addressComponents) {
    const components = {
      province: {
        attr: 'administrative_area_level_1',
        selector: '#province_select',
        cap: true,
      },
      district: {
        attr: 'administrative_area_level_2',
        selector: '#district_select',
        cap: true,
      },
      neighbourhood: {
        attr: 'administrative_area_level_4',
        selector: '#neighbourhood_select',
        cap: true,
      },
      postal_code: { attr: 'postal_code', selector: '#place_zip_code' },
      street: { attr: 'route', selector: '#place_street' },
      street_number: {
        attr: 'street_number',
        selector: '#place_street_number',
      },
    };

    const keys = Object.keys(components);

    place.addressComponents.forEach((component) => {
      const field = keys.find((key) =>
        component.types.includes(components[key].attr),
      );

      if (field === undefined) return;

      component.longText = component.longText
        .toUpperCase()
        .normalize('NFC')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      component.longText =
        component.longText[0] + component.longText.slice(1).toLowerCase();

      if (field === 'neighbourhood') {
        component.longText = component.longText.replace(/\s+mah$/i, '');
      }

      if (components[field].cap) {
        component.longText = capitalizeWords(component.longText).trim();
      }

      components[field].attr = component.longText;
    });

    keys.forEach((key) =>
      $(components[key].selector).val(components[key].attr).trigger('change'),
    );
  }

  ['nationalPhoneNumber', 'internationalPhoneNumber', 'websiteUri'].forEach(
    (prop, index) => {
      if (prop in place)
        $(`#contact-container input[data-category-id="${index}"]`).val(
          place[prop],
        );
    },
  );

  if (
    place.hasOwnProperty('regularOpeningHours') &&
    place.regularOpeningHours.hasOwnProperty('periods')
  ) {
    populateOpeningHours(place.regularOpeningHours.periods);
  }

  if (place.types) {
    mapGoogleTypesToYourTypes(place.types, place.primaryType);
  }

  if (place.hasOwnProperty('googleMapsUri')) {
    $('#sources-container .source-url-input[data-category-id="7"]').val(
      place.googleMapsUri,
    );
  }

  if (place.reviews && place.reviews.length > 0) {
    populateReviews(place.reviews);
  }

  $('.place-option').each((index, element) => {
    element.checked = place[toCamelCase(element.id)];
  });
}

function populateOpeningHours(periods) {
  console.log(periods);
  periods.forEach((period) => {
    const unique = period.open.day % 7;
    const openingHour = $(`div.opening-hour#${unique}`);
    openingHour.find('#status').val('hours').trigger('change');
    openingHour.find('#open').val(`<span class="math-inline">\{String\(period\.open\.hour\)\.padStart\(2, '0'\)\}\:</span>{String(period.open.minute - (period.open.minute % 15)).padStart(2, '0')}`);
    openingHour.find('#close').val(`<span class="math-inline">\{String\(period\.close\.hour\)\.padStart\(2, '0'\)\}\:</span>{String(period.close.minute).padStart(2, '0')}`);
});
}

function mapGoogleTypesToYourTypes(googleTypes, primaryType) {
  const matchedTypeIds = [];
  let primaryTypeId = null;

  if (primaryType) {
    const normalizedPrimaryType = primaryType.toUpperCase();
    if (googleToAppTypeMapping[normalizedPrimaryType]) {
      primaryTypeId =
        googleToAppTypeMapping[normalizedPrimaryType].id.toString();
    }
  }

  googleTypes.forEach((googleType) => {
    const normalizedGoogleType = googleType.toUpperCase();
    if (googleToAppTypeMapping[normalizedGoogleType]) {
      const appType = googleToAppTypeMapping[normalizedGoogleType];
      matchedTypeIds.push(appType.id.toString());

      if (!primaryTypeId) {
        primaryTypeId = appType.id.toString();
      }
    }
  });

  $('#select-type').val(matchedTypeIds).trigger('change');

  if (primaryTypeId) {
    $('#select-primary-type').val(primaryTypeId).trigger('change');
  }
}

function collectFormData() {
  const id = $('#select-primary-type').val()?.trim();
  const primaryType =
    typeof id === 'string' && id.length > 0
      ? `/api/type/places/${id}`
      : null;

  let types =
    $('#select-type')
      .val()
      ?.map((id) => `/api/type/places/${id}`) ?? [];

  if (primaryType && !types.includes(primaryType)) {
    types.push(primaryType);
  }
  return {
    name: $('#place_name').val()?.trim(),
    owner: $('#place_owner').is(':checked'),
    primaryType: primaryType,
    rating: parseFloat($('#place_rate').val()) || 0,
    userRatingCount: parseInt($('#place_rating_count').val(), 10) || 0,
    location: {
      latitude: parseFloat($('#place_location_latitude').val()) || 0,
      longitude: parseFloat($('#place_location_longitude').val()) || 0,
      zoom: parseInt($('#place_location_zoom').val(), 10) || 0,
    },
    address: {
      longAddress: $('#place_long_address').val()?.trim(),
      shortAddress: $('#place_short_address').val()?.trim(),
      addressComponents: collectAddressComponents(),
    },
    hashtags:
      $('#select-tag')
        .val()
        ?.map((id) => `/api/tag/places/${id}`) ?? [],
    categories:
      $('#select-category')
        .val()
        ?.map((id) => `/api/category/places/${id}`) ?? [],
    types: types,
    reviews: $('#reviews-container .review-item')
      .map(function () {
        return {
          text: $(this).find('.review-text').text(),
          rate: parseInt($(this).find('.review-rate').val(), 10),
          authorSrc: $(this).find('.review-author-src').attr('href'),
          languageCode: $(this).find('.review-language-code').val(),
        };
      })
      .get(),
    options: collectOptionsData(),
    commericalInformation: {
      title: $('#commerical_title').val().trim(),
      taxOffice: $('#commerical_tax_address').val().trim(),
      mersisNumber: $('#commerical_mersis_number').val().trim(),
    },
    openingHours: collectOpeningHours(),
    contacts: collectContacts(),
    accounts: collectAccounts(),
    sources: collectSources(),
  };
}

function populateReviews(reviews) {
  const reviewsContainer = $('#reviews-container');
  reviewsContainer.empty();
  reviews.forEach((review) => {
    const authorName =
      review.authorAttribution && review.authorAttribution.displayName
        ? review.authorAttribution.displayName
        : 'Anonim';
    const authorSrc = '/api/user/6e8ee311-e3e0-4344-ab24-5746b037315a/yakala';
    const text =
      review.originalText && review.originalText.text
        ? review.originalText.text
        : '';
    const rate = review.rating || 0;
    const languageCode =
      review.originalText && review.originalText.languageCode
        ? review.originalText.languageCode
        : 'tr';

    const reviewHtml = `
        <hr>
            <div class="review-item mb-4">
                <div class="d-flex align-items-center">
                    <img src="${
                      review.authorAttribution &&
                      review.authorAttribution.photoUri
                        ? review.authorAttribution.photoUri
                        : 'https://via.placeholder.com/50'
                    }="${
      review.authorAttribution && review.authorAttribution.photoUri
        ? review.authorAttribution.photoUri
        : 'https://via.placeholder.com/50'
    }" alt="Author" class="rounded-circle me-3">
                    <img src="${
                      review.authorAttribution &&
                      review.authorAttribution.photoUri
                        ? review.authorAttribution.photoUri
                        : 'https://via.placeholder.com/50'
                    }="${
      review.authorAttribution && review.authorAttribution.photoUri
        ? review.authorAttribution.photoUri
        : 'https://via.placeholder.com/50'
    }" alt="Author" class="rounded-circle me-3">
                    <div>
                        <a href="${authorSrc}" class="review-author-src" target="_blank">${authorName} (Yaka.la olarak kayıt edilecek...)</a>
                        <span class="badge bg-${
                          rate >= 4
                            ? 'success'
                            : rate >= 2
                            ? 'warning'
                            : 'danger'
                        } ms-2">${rate} Yıldız</span>
                    </div>
                </div>
                <p class="mt-2 review-text">${text}</p>
                <input type="hidden" class="review-rate" value="${rate}">
                <input type="hidden" class="review-language-code" value="${languageCode}">
            </div>
        `;
    reviewsContainer.append(reviewHtml);
  });
}

function collectOptionsData() {
  const options = {};

  $('.place-option').each((index, element) => {
    options[toCamelCase(element.id)] = $(element).is(':checked');
  });

  return options;
}

function collectOpeningHours() {
  const langMap = {
    tr_TR: {
      closed: 'Kapalı',
      '24h': '24 Saat Açık',
    },
    en_EN: {
      closed: 'Closed',
      '24h': 'Open 24 hours',
    },
  };

  const openingHours = [];

  daysOfWeek.forEach((day) => {
    ['tr_TR', 'en_EN'].forEach((lang) => {
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
          description =
            lang === 'tr_TR'
              ? `${day.dayTextTR}: ${openTime} - ${closeTime}`
              : `${day.dayTextEN}: ${formatTimeTo12Hour(
                  openTime,
                )} - ${formatTimeTo12Hour(closeTime)}`;
        }
      }

      if (status === 'closed') {
        openTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
        closeTime = lang === 'tr_TR' ? 'Kapalı' : 'Closed';
        description =
          lang === 'tr_TR'
            ? `${day.dayTextTR}: Kapalı`
            : `${day.dayTextEN}: Closed`;
      } else if (status === '24h') {
        openTime = lang === 'tr_TR' ? '24 saat' : '24 hours';
        closeTime = lang === 'tr_TR' ? '24 saat' : '24 hours';
        description =
          lang === 'tr_TR'
            ? `${day.dayTextTR}: 24 Saat Açık`
            : `${day.dayTextEN}: Open 24 hours`;
      }

      const ohData = {
        open: openTime,
        close: closeTime,
        day: day.day,
        dayText: lang === 'tr_TR' ? day.dayTextTR : day.dayTextEN,
        languageCode: lang,
        description: description,
      };

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

$('#button-save').on('click', async function () {
  const saveButton = $(this);
  const originalText = saveButton.text();
  saveButton.text('Yükleniyor...').prop('disabled', true);
  await addPlace(saveButton, originalText);
});

function collectAddressComponents() {
  const components = [
    {
      category: '/api/category/address/components/1',
      shortText: 'TR',
      longText: 'Türkiye',
      languageCode: 'tr',
    },
  ];

  $('[data-adc-category]').each((index, element) => {
    let value = $(element).val();
    if (typeof value !== 'string') return;
    value = value.trim();
    if (value.length === 0) return;
    components.push({
      category: `/api/category/address/components/${$(element).data(
        'adc-category',
      )}`,
      shortText: value,
      longText: value,
      languageCode: 'tr',
    });
  });

  return components;
}

function collectContacts() {
  const contacts = [];
  $('#contact-container input').each(function () {
    const value = $(this).val().trim();
    if (value !== '') {
      contacts.push({
        value: value,
        category: `/api/category/contacts/${$(this).data('category-id')}`,
      });
    }
  });
  return contacts;
}

function collectAccounts() {
  const accounts = [];

  $('#accounts-container li.list-group-item').each(function (index) {
    const accountUrl = $(this).find('.account-src-input').val().trim();
    if (accountUrl !== '') {
      accounts.push({
        category: `/api/category/accounts/${$(this).data('category-id')}`,
        src: accountUrl,
        priority: index,
      });
    }
  });
  return accounts;
}

function collectSources() {
  const sources = [];
  $('#sources-container .source-url-input').each(function () {
    const sourceUrl = $(this).val().trim();
    const categoryId = $(this).data('category-id');

    if (sourceUrl !== '') {
      sources.push({
        category: `/api/category/sources/${categoryId}`,
        sourceUrl: sourceUrl,
        sourceId: $(`.source-id-input[data-category-id="${categoryId}"]`)
          .val()
          .trim(),
      });
    }
  });
  return sources;
}

async function addPlace(saveButton, originalText) {
  const data = collectFormData();
  console.log('PlaceData: ', data);
  //console.log(JSON.stringify(data));
    if (!data.name || data.name.trim() === '') {
        toastr.error('İşletme adı boş olamaz. Lütfen kontrol ediniz.');
        saveButton.text(originalText).prop('disabled', false); 
        return;
    }
    if (!data.primaryType) {
        toastr.error('Lütfen birincil tür seçiniz.');
        saveButton.text(originalText).prop('disabled', false);
        return;
    }
  $.ajax({
        url: `/_json/places`, 
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            'Accept': 'application/ld+json',
        },
        success: async (response) => { 
            console.log("Sunucu yanıtı: ", response);
            const placeId = response.id; 

            if (data.reviews && data.reviews.length > 0 && placeId) {
                try {
                    await postReviews(data.reviews, `/api/places/${placeId}`); 
                } catch (reviewError) {
                    console.error("Yorumlar gönderilirken bazı hatalar oluştu:", reviewError);
                    toastr.warning('İşletme eklendi ancak bazı yorumlar gönderilemedi. Lütfen kontrol ediniz.');
                }
            }

            toastr.success('İşletme başarıyla eklendi. Yönlendiriliyorsunuz...');

            if (placeId) {
                window.location.href = `/admin/places/${placeId}`;
            } else {
                toastr.warning('İşletme eklendi ancak ID alınamadı. Liste sayfasına yönlendiriliyorsunuz.');
                window.location.href = '/admin/places/'; 
            }
        },
        error: (err) => {
            console.error('Yeni işletme eklenirken hata:', err);
            let errorMessage = 'İşletme eklenirken bir hata oluştu. Lütfen tekrar deneyin.';
            if (err.responseJSON) {
                if (err.responseJSON['hydra:description']) {
                    errorMessage = err.responseJSON['hydra:description'];
                } else if (err.responseJSON.detail) {
                    errorMessage = err.responseJSON.detail;
                } else if (err.responseJSON.message) {
                    errorMessage = err.responseJSON.message;
                }
            }
            toastr.error(errorMessage);
            saveButton.text(originalText).prop('disabled', false); 
        }
    });
}

async function postReviews(reviews, placeUrl) {
  let allSuccessful = true;
  let successfulReviewCount = 0;

  for (const review of reviews) {
    const reviewData = {
      author: `${review.authorSrc}`,
      place: `${placeUrl}`,
      photos: [],
      text: review.text,
      rate: review.rate,
      languageCode: review.languageCode || 'tr',
    };

    try {
      const response = await $.ajax({
        url: '/_json/place/reviews',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(reviewData),
        headers: {
          Accept: 'application/json',
        },
      });
      successfulReviewCount++;
      console.log('Yorum gönderildi:', response);
    } catch (error) {
      allSuccessful = false;
      console.error(
        `'${review.text.substring(
          0,
          30,
        )}...' başlıklı yorum gönderilirken hata:`,
        error,
      );
    }
  }

  if (reviews.length > 0) {
    if (allSuccessful) {
      toastr.success(
        `${successfulReviewCount} yorumun tümü başarıyla eklendi.`,
      );
    } else if (successfulReviewCount > 0) {
      toastr.warning(
        `${successfulReviewCount} yorum eklendi ancak bazı yorumlar gönderilirken hata oluştu. Detaylar için konsolu kontrol edin.`,
      );
    } else {
      toastr.error(
        'Yorumlar gönderilirken bir veya daha fazla hata oluştu. Lütfen konsolu kontrol edin.',
      );
    }
  }
}

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

    daysOfWeek.forEach((day) => {
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

/** @returns {void} */
async function initAccountZone() {
  fetchCategories('accounts').then((data) => {
    const accountContainer = $('#accounts-container');
    accountContainer.empty();
    data.forEach((category) => {
      accountContainer.append(`
                    <li class="list-group-item align-items-center" data-category-id="{{ category.id }}">                
                    <div class="col-12 mb-3 d-flex">
                    <img src="https://${category.icon}" alt="${category.title}" width="24px" 
                    height="24px" style="width: 40px; height: 40px; object-fit: contain; margin-right: 10px;" >
                    <input id="account_src_${category.id}" aria-label="${category.description}"
                    name="account_src_${category.id}" class="form-control flex-grow-1 account-src-input"
                    type="url" placeholder="${category.description}" data-category-id="${category.id}">
                </div>
            </li>    
            `);
    });
  });
}

/** @returns {void} */
async function initContactZone() {
  fetchCategories('contacts').then((data) => {
    const contactContainer = $('#contact-container');
    contactContainer.empty();
    data.forEach((category) => {
      contactContainer.append(
        `<div class="col-12 mb-3">
                    <label class="form-label" for="contact_${category.id}">${category.description}</label>
                    <input id="contact_${category.id}" name="contact_${category.id}" class="form-control"
                    type="text" placeholder="İletişim bilgisi" data-category-id="${category.id}">
                </div>`,
      );
    });
  });
}

function fetchCategories(category) {
  return fetch(`/_json/category/${category}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Response is not success');
      }
      return response.json().then((data) => data['hydra:member'] || data);
    })
    .catch((err) => {
      console.error('İletişim kategorileri alınırken hata oluştu:', err);
      return [];
    });
}
