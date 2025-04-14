$.fn.AdvancedTable = function (settings) {
    const _local = {this: this, currentPage: 1, currentLength: undefined};

    this.settings = {
        paginationContainer: undefined,
        dataConvert: undefined,
        actions: undefined,
        itemSource: undefined,
        columns: [],
        length: 15,
        paginations: [15, 30, 50, 100, 200],
        spinnerState: false,
        ...settings,
    };

    function refresh(page) {
        const $tbody = $(_local.this).find('tbody');
        _local.currentPage = page;
        handleSpinner($tbody, true, settings);
        const ajax = Object.create(_local.this.settings.ajax);
        const query = {
            size: _local.currentLength,
            page: page,
        };

        if(typeof ajax.data === "function") {
            ajax.data = settings.ajax.data(query);
        } else {
            ajax.data = query;
        }

        new Promise(resolve => resolve($.ajax(ajax)))
            .then(async response => handleData($tbody, settings, response));
    }

    function paginationBuild(paginationContainer, settings, length, currentPage)
    {
        const totalPages = Math.ceil(length/_local.currentLength);
        const container = $(paginationContainer);
        container.find('#table-pagination-bar').remove();
        const nav = $(`<nav aria-label="Pagination" id="table-pagination-bar"><ul class="pagination" id="table-pagination-list"></ul></nav>`);
        container.append(nav);
        const list = nav.find('#table-pagination-list');

        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const addItem = (page, label = page, isActive = false, isDisabled = false) => {
            const li = $(`
            <li class="page-item ${settings.nonce} ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}" 
                data-page="${page}">
                <a class="page-link" href="javascript:void(0)">${label}</a>
            </li>`);
            list.append(li);
        };

        addItem(currentPage - 1, '«', false, currentPage === 1);

        if (start > 1) {
            addItem(1);
            if (start > 2) {
                list.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
            }
        }

        for (let i = start; i <= end; i++) {
            addItem(i, i, i === currentPage);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                list.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
            }
            addItem(totalPages);
        }

        addItem(currentPage + 1, '»', false, currentPage === totalPages);

        $(`li.${settings.nonce}`).off('click').on('click', function () {
            const page = $(this).data('page');
            if (!$(this).hasClass('disabled') && !$(this).hasClass('active')) {
                refresh(parseInt(page));
            }
        });
    }

    function handleSpinner (tablebody, method, settings) {
        if(settings.spinnerState ^ method) {
            if(method === true) {
                const columnLength = settings.columns.length + (settings.actions !== undefined);
                $(tablebody).empty();
                $(tablebody).append(
                    `<tr class="loading-row">
                    <td class="text-center align-middle" colspan="${columnLength}">
                        <div class="spinner-container flex text-center justify-content-center align-self-center align-items-center">
                            <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span class="visually-hidden"></div>
                            <span class="row text-center m-auto">Yükleniyor</span>
                        </div>
                    </td>
                </tr>`);
            }
            if(method === false) {
                $(tablebody).find('tr.loading-row').remove();
            }
            settings.spinnerState = method;
        }
    }

    function populate(tablebody, data, columns, actions) {
        const $row = $('<tr>');
        columns.forEach(column=>{
            const td = $('<td>');
            if(column.data === undefined && column.html !== undefined) {
                td.html(column.html(data));
            } else if(column.data !== undefined) {
                if(column.html === undefined) {
                    td.text(data[column.data] ?? null);
                } else {
                    const d = data[column.data] ?? null;
                    td.html(column.html(d));
                }
            }
            $row.append(td);
        });

        if(Array.isArray(actions)) {
            const actionsTemplate = $(`<td><div class="dropdown">
            <button class="btn btn-sm btn-filter dropdown-toggle dropdown-toggle-nocaret" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu"></ul></div></td>`);
            actions.forEach(action=>{
                const a  = $('<a class="dropdown-item">');
                a.text(action.name);
                if(action.href !== undefined) {
                    if(typeof action.href === "function") {
                        action.href = action.href(data);
                    }
                    a.attr('href', action.href);
                }
                const list = $('<li>');
                list.append(a);
                actionsTemplate.find('ul').append(list);
            });

            $row.append(actionsTemplate);
        }

        $(tablebody).append($row);
    }

    function handleData(tablebody, settings, result) {
        if(settings.dataConvert !== undefined) {
            result = settings.dataConvert(result);
        }
        handleSpinner(tablebody, false, settings);
        paginationBuild(settings.paginationContainer, settings, result.total, _local.currentPage);
        result.data.forEach(data=>{
            if(typeof settings.itemSource === 'string') {
                data = data[settings.itemSource];
            }
            populate(tablebody, data, settings.columns, settings.actions);
        });

        return result;
    }

    this.settings.nonce = `table_${Date.now().toString()}`;

    if(Array.isArray(this.settings.actions)) {
        $(this).find('thead tr').append('<th>Aksiyon</th>');
    }

    _local.currentLength = this.settings.length;
    refresh(1);

    return this;
}