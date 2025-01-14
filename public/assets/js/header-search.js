
$(document).ready(function () {
    const desktopSearchInput = $('.search-control');
    const mobileSearchInput = $('.mobile-search-control');
    const searchPopup = $('.search-popup');
    const searchContent = $('.search-content');

    const recentSearchesKey = 'recentSearches';
    const maxRecentSearches = 10;

    let recentSearches = JSON.parse(localStorage.getItem(recentSearchesKey)) || [];

    function renderRecentSearches() {
        if (recentSearches.length === 0) {
            searchContent.html('<p class="search-title">Son Aramalarınız</p><p>Henüz bir arama yapmadınız.</p>');
            return;
        }

        let recentSearchesHtml = `
            <p class="search-title">Son Aramalarınız</p>
            <div class="d-flex align-items-start flex-wrap gap-2 kewords-wrapper">
        `;

        recentSearches.forEach(search => {
            recentSearchesHtml += `
                <a href="/admin/place/${search.id}" class="kewords">
                    <span>${search.name}</span>
                    <i class="material-icons-outlined fs-6">search</i>
                </a>
            `;
        });

        recentSearchesHtml += '</div>';

        searchContent.html(recentSearchesHtml);
    }

    function addToRecentSearches(place) {
        recentSearches = recentSearches.filter(s => s.id !== place.id);

        recentSearches.unshift(place);

        if (recentSearches.length > maxRecentSearches) {
            recentSearches.pop();
        }

        localStorage.setItem(recentSearchesKey, JSON.stringify(recentSearches));
    }

    let searchTimeout;

    function performSearch(query) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            $.ajax({
                url: '/_route/elasticsearch/autocomplete',
                method: 'GET',
                data: { q: query },
                success: function (data) {
                    const results = data.results || [];
                    if (results.length > 0) {
                        let suggestionsHtml = '<ul class="list-group">';
                        results.forEach(result => {
                            suggestionsHtml += `
                                <li class="list-group-item suggestion-item" data-id="${result.id}" data-name="${result.name}">
                                    <strong>${result.name}</strong><br>
                                    <small>${result.address}</small>
                                </li>
                            `;
                        });
                        suggestionsHtml += '</ul>';
                        searchContent.html(suggestionsHtml);
                    } else {
                        searchContent.html('<p>Sonuç bulunamadı.</p>');
                    }
                    searchPopup.show();
                },
                error: function (xhr, status, error) {
                    console.error('Autocomplete error:', error);
                }
            });
        }, 300);
    }

    function handleInput(event) {
        const query = $(this).val().trim();
        if (query.length >= 2) {
            performSearch(query);
        } else if (query.length === 0) {
            renderRecentSearches();
            searchPopup.show();
        } else {
            searchContent.html('<p>İşletme aramak için en az 2 karakter yazınız.</p>');
            searchPopup.show();
        }
    }

    desktopSearchInput.on('input', handleInput);
    mobileSearchInput.on('input', handleInput);

    searchContent.on('click', '.suggestion-item', function () {
        const placeId = $(this).data('id');
        const placeName = $(this).data('name');

        addToRecentSearches({ id: placeId, name: placeName });

        window.location.href = `/admin/place/${placeId}`;
    });

    searchContent.on('click', '.kewords', function (event) {
        event.preventDefault();
        const placeId = $(this).attr('href').split('/').pop();
        const placeName = $(this).find('span').text();

        addToRecentSearches({ id: placeId, name: placeName });
        window.location.href = `/admin/place/${placeId}`;
    });

    desktopSearchInput.on('focus', function () {
        if ($(this).val().trim().length === 0) {
            renderRecentSearches();
            searchPopup.show();
        }
    });
    mobileSearchInput.on('focus', function () {
        if ($(this).val().trim().length === 0) {
            renderRecentSearches();
            searchPopup.show();
        }
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.search-bar').length && !$(event.target).closest('.search-popup').length) {
            searchPopup.removeClass('d-block');
            searchPopup.hide();
        }
    });

    $('.search-close, .mobile-search-close').on('click', function () {
        searchPopup.hide();
        desktopSearchInput.val('');
        mobileSearchInput.val('');
    });
});
