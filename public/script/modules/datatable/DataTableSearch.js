/**
 *
 * @param selector
 * @param settings
 * @constructor
 */
export function DataTableSearch(selector, settings)
{
    const overwrite = { data: undefined, dataFilter: undefined };

    if (settings.ajax) {
        if (settings.ajax.data) overwrite.data = settings.ajax.data;
        if (settings.ajax.dataFilter) overwrite.dataFilter = settings.ajax.dataFilter;
    }

    const customAjax = {
        ...settings.ajax,
        data: (query) => {
            const builded = { from: query.start, size: query.length, track_total_hits: true, draw: query.draw };
            if (typeof overwrite.data === 'function') {
                return { ...builded, ...overwrite.data(query) };
            }

            return builded;
        },
        dataFilter: (response) => {
            if (typeof response === 'string') response = JSON.parse(response);
            return JSON.stringify({
                draw: response.draw,
                data: response.hits.hits,
                recordsTotal: response.hits.total.value,
                recordsFiltered: response.hits.total.value
            });
        }
    };

    return $(selector).DataTable({
        ...settings,
        ajax: customAjax
    });
}