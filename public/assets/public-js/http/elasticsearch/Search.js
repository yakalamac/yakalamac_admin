export default {
    byPlaceName: function (route) {
        return {
            url: route,
            dataType: 'json',
            data: function (params) {
                    return {
                        q: $.trim(params.term),
                        page: params.page || 1  // Use params.page for pagination
                    };
                }
            ,
            processResults: function (data) {
                return {
                    results: data, // data.items should be the array of results
                    pagination: {
                        more: data.length > 0 // Adjust '10' to the number of items per page
                    }
                };
            }
            ,
            cache: true
        }
    }
};
