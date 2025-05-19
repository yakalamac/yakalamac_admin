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
                <a href="/admin/places/${search.id}" class="kewords">
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

    function resultProcessor(index) {
      return {
          'place' : {
              process:(data)=>{
                  return '<ul class="list-group">' + Array.from(data).map(hit=> {
                      if(
                          typeof hit !== 'object' || !hit.hasOwnProperty('_index') ||
                          hit._index !== 'place' || !hit.hasOwnProperty('_source') ||
                          typeof hit._source !== 'object'
                      ) return;
                      hit = hit._source;
                      return `<li class="list-group-item suggestion-item" data-id="${hit.id}" data-name="${hit.name}">
                                        <a href="/admin/places/${hit.id}" target="_blank">
                                    <strong>${hit.name}</strong><br>
                                    <small>${hit.address?.longAddress ?? 'Adres bilgisi mevcut değil'}</small>
                                    </a>
                                </li>`;
                  }).filter(each=>each !== undefined).join('') + '</ul>';
              }
          },
          'place_tag' : {
              process:(data)=>{
                  return '<div class="d-flex align-items-start flex-wrap gap-2 kewords-wrapper">' + Array.from(data).map(hit=> {
                      if(
                          typeof hit !== 'object' || !hit.hasOwnProperty('_index') ||
                          hit._index !== 'place_tag' || !hit.hasOwnProperty('_source') ||
                          typeof hit._source !== 'object'
                      ) return;
                      hit = hit._source;
                      return `<a class="btn btn-sm btn-light border shadow-sm text-uppercase" data-type="hashtag" data-id="hit.id">#${hit.tag}</a>`;
                  }).filter(each=>each !== undefined).join('') + '</div>';
              }
          },
          'place_type' : {
              process: (data)=>{
                  return Array.from(data).map(hit=> {
                      if(
                          typeof hit !== 'object' || !hit.hasOwnProperty('_index') ||
                          hit._index !== 'place_type' || !hit.hasOwnProperty('_source') ||
                          typeof hit._source !== 'object'
                      ) return;
                      hit = hit._source;
                      return `<li class="list-group-item suggestion-item" data-id="${hit.id}" data-type="${hit.type}"><strong>${hit.description}</strong></li>`;
                  }).filter(each=>each !== undefined).join('');
              }
          },
          'place_category' : {
              process: (data)=>{
                  return Array.from(data).map(hit=> {
                      if(
                          typeof hit !== 'object' || !hit.hasOwnProperty('_index') ||
                          hit._index !== 'place_category' || !hit.hasOwnProperty('_source') ||
                          typeof hit._source !== 'object'
                      ) return;
                      hit = hit._source;
                      return `<li class="list-group-item suggestion-item" data-id="${hit.id}" data-title="${hit.title}"><strong>#${hit.description}</strong></li>`;
                  }).filter(each=>each !== undefined).join('');
              }
          },
          'product' : {
              process: (data)=> {
                  return '<div class="search-list d-flex flex-column gap-2">' + Array.from(data).map(hit=> {
                      if(
                          typeof hit !== 'object' || !hit.hasOwnProperty('_index') ||
                          hit._index !== 'product' || !hit.hasOwnProperty('_source') ||
                          typeof hit._source !== 'object'
                      ) return;
                      hit = hit._source;
                      return `<a href="/products/${hit.id}" target="_blank">
                            <div class="search-list-item d-flex align-items-center gap-3" data-id="${hit.id}" data-type="product">
                                <div class="memmber-img">
                                    <img class="rounded-circle" width="32" height="32" src="${hit.logo?.path ?? 'https://cdn.yaka.la/assets/web/yakalamac-icon.png'}" alt="${hit.logo?.altTag ?? 'Yakalamaç'}">
                                </div>
                                <div class="member-info">
                                    <h5 class="mb-0 search-list-title">${hit.name}</h5>
                                    <small class="text-muted">${hit.description}</small>
                                </div>
                          </div>
                        </a>`;
                  }).filter(each=>each !== undefined).join('') + '</div>';
              }
          },
          'product_type' : {
              process: (data)=>{
                  console.log(data);
              }
          },
          'product_category' : {
              process: (data)=>{
                  console.log(data);
              }
          },
          'product_tag' : {
              process:(data)=>{
                  return '<div class="d-flex align-items-start flex-wrap gap-2 kewords-wrapper">' + Array.from(data).map(hit=> {
                      if(
                          typeof hit !== 'object' || !hit.hasOwnProperty('_index') ||
                          hit._index !== 'product_tag' || !hit.hasOwnProperty('_source') ||
                          typeof hit._source !== 'object'
                      ) return;
                      hit = hit._source;
                      return `<a class="btn btn-sm btn-light border shadow-sm text-uppercase" data-type="hashtag" data-id="hit.id">#${hit.tag}</a>`;
                  }).filter(each=>each !== undefined).join('') + '</div>';
              }
          },
      }[index];
    }

    function performSearch(query) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            $.ajax({
                url: '/_autocomplete',
                method: 'GET',
                data: {q: query},
                success: function (data) {
                    if(data.hasOwnProperty('responses') && Array.isArray(data.responses)) {
                        let template = '';
                        if (data.responses.length > 0) {
                            data.responses.forEach(response=> {
                                if(response.hits.hits.length === 0) return;
                                const indexName = response.hits.hits.at(0)?._index;
                                if(indexName === undefined) return;
                                const processor = resultProcessor(indexName);
                                if(typeof processor !== 'object' || !processor.hasOwnProperty('process') || typeof processor.process !== "function") return;
                                template += processor.process(response.hits.hits);
                            });

                            if(template.length !== 0) searchContent.html(template);
                            else searchContent.html('<p>Sonuç bulunamadı.</p>');
                        } else {
                            searchContent.html('<p>Sonuç bulunamadı.</p>');
                        }
                        searchPopup.show();
                        return;
                    }

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
                    console.error(xhr,status,error)
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

        addToRecentSearches({id: placeId, name: placeName});

        window.location.href = `/admin/places/${placeId}`;
    });

    searchContent.on('click', '.kewords', function (event) {
        event.preventDefault();
        const placeId = $(this).attr('href').split('/').pop();
        const placeName = $(this).find('span').text();

        addToRecentSearches({id: placeId, name: placeName});
        window.location.href = `/admin/places/${placeId}`;
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
