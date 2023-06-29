class dtquick {
    constructor(id, options = {}) {
        this.element = document.querySelector(id);
        this.handleChange = this.handleChange.bind(this);
        this.initialize(options);
    }

    initialize(options) {
        this.setVariables(options);
        document.head.innerHTML += `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`;
        this.createAndAppendNecessaryElements();

        if (this.cols) {
            this.makeTableHeaders();
        }
        this.fetch();
    }

    setVariables(options) {
        this.advancedSearch = options.advancedSearch === undefined ? true : options.advancedSearch;
        this.ajaxFile = options.ajaxFile || undefined;
        this.cols = options.cols || undefined;
        this.searchFromOptions = [...this.cols];
        this.key = options.defKey || '';
        this.limits = options.limits || [25, 50, 100, 250, 500];
        this.defLimit = options.defLimit || this.limits[0];
        this.limit = this.defLimit;
        this.defOrderBy = options.defOrderBy || (this.cols ? this.cols[0] : undefined);
        this.defPageNo = options.defPageNo || 1;
        this.order = options.order || 'ASC';
        this.orderBy = options.orderBy || (this.cols ? this.cols[0] : undefined);
        this.pageCount = undefined;
        this.pageNo = this.defPageNo;
        this.queryLang = options.queryLang || undefined;
        this.requestType = options.requestType || 'GET';
        this.response = undefined;
        this.searchFrom = options.searchFrom || 'All';
        this.searchQuery = undefined;
        this.serverSide = options.serverSide || false;
        this.styles = options.styles;
        this.table = this.serverSide ? undefined : options.table;
        this.xhr = new XMLHttpRequest();
        this.notFoundText = options.notFoundText || `No records found ¯\\_(ツ)_/¯<hr>`;
        this.limitsText = options.limitsText || 'Limit';
        this.searchFromText = options.searchFromText || 'From';
        this.searchBoxText = options.searchBoxText || 'Search';
        this.searchBoxAutoFocus = options.searchBoxAutoFocus || false;
    }

    makeElement(tag, classNames = '', id = '') {
        const element = document.createElement(tag);
        element.id = id;
        element.className = classNames;
        return element;
    }

    makeLimitsDropdown() {
        const limits = this.makeElement('select', 'form-select');
        limits.id = 'limitsDropDown';
        this.limits.forEach(limit => {
            const option = this.makeElement('option');
            option.textContent = limit;
            option.value = limit;
            if (limit === this.defLimit) {
                option.selected = true;
            }
            limits.appendChild(option);
        });
        return limits;
    }

    makeSearchFromDropdown() {
        const searchFrom = this.makeElement('select', 'form-select');
        searchFrom.id = 'searchFromDropDown';
        this.searchFromOptions.unshift('All');
        this.searchFromOptions.forEach(searchFromItem => {
            const option = this.makeElement('option');
            option.textContent = searchFromItem;
            option.value = searchFromItem === 'All' ? '' : searchFromItem;
            if (searchFromItem === this.searchFrom) {
                option.selected = true;
            }
            searchFrom.appendChild(option);
        });
        return searchFrom;
    }

    makeTableHeaders() {
        const headersRow = this.makeElement('tr');
        this.cols.forEach(col => {
            const header = this.makeElement('th');
            header.textContent = col;
            headersRow.appendChild(header);
        });
        this.table.appendChild(headersRow);
    }

    isEmptyObject(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    createAndAppendNecessaryElements() {
        const searchContainer = this.makeElement('div', 'input-group mb-3');
        const searchFrom = this.makeSearchFromDropdown();
        const searchBox = this.makeElement('input', 'form-control');
        const searchInputGroup = this.makeElement('div', 'input-group-prepend');
        const searchButton = this.makeElement('button', 'btn btn-primary');
        const limits = this.makeLimitsDropdown();
        const paginationContainer = this.makeElement('div', 'd-flex justify-content-center');
        const paginationList = this.makeElement('ul', 'pagination');

        searchBox.type = 'text';
        searchBox.id = 'searchBox';
        searchBox.placeholder = this.searchBoxText;
        searchBox.autofocus = this.searchBoxAutoFocus;
        searchButton.type = 'button';
        searchButton.textContent = 'Search';
        searchButton.onclick = this.handleChange;
        limits.onchange = this.handleChange;

        searchInputGroup.appendChild(searchButton);
        searchContainer.appendChild(searchFrom);
        searchContainer.appendChild(searchBox);
        searchContainer.appendChild(searchInputGroup);

        this.element.appendChild(searchContainer);
        this.element.appendChild(limits);

        if (this.table) {
            this.element.appendChild(this.table);
        } else {
            const tableContainer = this.makeElement('div');
            tableContainer.id = 'tableContainer';
            this.table = this.makeElement('table', 'table');
            this.table.id = 'table';
            tableContainer.appendChild(this.table);
            this.element.appendChild(tableContainer);
        }

        if (paginationContainer) {
            paginationContainer.appendChild(paginationList);
            this.element.appendChild(paginationContainer);
        }
    }


    handleChange() {
        this.limit = parseInt(document.querySelector('#limitsDropDown').value);
        this.pageNo = 1;
        this.orderBy = this.cols ? this.cols[0] : undefined;
        this.searchFrom = document.querySelector('#searchFromDropDown').value;
        this.searchQuery = document.querySelector('#searchBox').value.trim();
        this.fetch();
    }

    setPagination() {
        const paginationList = document.querySelector('.pagination');
        paginationList.innerHTML = '';

        const firstItem = this.makeElement('li', 'page-item');
        const firstLink = this.makeElement('a', 'page-link');
        firstLink.textContent = 'First';
        firstLink.onclick = () => this.setActive(1);
        firstItem.appendChild(firstLink);
        paginationList.appendChild(firstItem);

        const prevItem = this.makeElement('li', 'page-item');
        const prevLink = this.makeElement('a', 'page-link');
        prevLink.textContent = 'Previous';
        prevLink.onclick = () => this.setActive(this.pageNo - 1);
        prevItem.appendChild(prevLink);
        paginationList.appendChild(prevItem);

        for (let i = 1; i <= this.pageCount; i++) {
            if (i >= this.pageNo - 2 && i <= this.pageNo + 2) {
                const pageItem = this.makeElement('li', 'page-item');
                const pageLink = this.makeElement('a', 'page-link');
                pageLink.textContent = i;
                pageLink.onclick = () => this.setActive(i);
                if (i === this.pageNo) {
                    pageItem.classList.add('active');
                }
                pageItem.appendChild(pageLink);
                paginationList.appendChild(pageItem);
            }
        }

        const nextItem = this.makeElement('li', 'page-item');
        const nextLink = this.makeElement('a', 'page-link');
        nextLink.textContent = 'Next';
        nextLink.onclick = () => this.setActive(this.pageNo + 1);
        nextItem.appendChild(nextLink);
        paginationList.appendChild(nextItem);

        const lastItem = this.makeElement('li', 'page-item');
        const lastLink = this.makeElement('a', 'page-link');
        lastLink.textContent = 'Last';
        lastLink.onclick = () => this.setActive(this.pageCount);
        lastItem.appendChild(lastLink);
        paginationList.appendChild(lastItem);
    }

    setActive(pageNo) {
        if (pageNo < 1 || pageNo > this.pageCount) {
            return;
        }
        this.pageNo = pageNo;
        this.fetch();
    }

    fetch() {
        const params = new URLSearchParams();
        params.append('limit', this.limit);
        params.append('pageNo', this.pageNo);
        params.append('orderBy', this.orderBy);
        params.append('order', this.order);
        params.append('searchFrom', this.searchFrom);
        params.append('searchQuery', this.searchQuery);

        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState === XMLHttpRequest.DONE) {
                if (this.xhr.status === 200) {
                    this.response = JSON.parse(this.xhr.responseText);
                    this.renderTable();
                    this.setPagination();
                } else {
                    console.error('An error occurred while fetching the data.');
                }
            }
        };
        this.xhr.open(this.requestType, this.ajaxFile + '?' + params.toString(), true);
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.xhr.send();
    }

    renderTable() {
        this.table.innerHTML = '';

        if (this.response.length === 0) {
            const noRecordsRow = this.makeElement('tr');
            const noRecordsCell = this.makeElement('td');
            noRecordsCell.colSpan = this.cols.length;
            noRecordsCell.innerHTML = this.notFoundText;
            noRecordsRow.appendChild(noRecordsCell);
            this.table.appendChild(noRecordsRow);
            return;
        }

        if (this.cols) {
            this.makeTableHeaders();
        }

        this.response.forEach(rowData => {
            const row = this.makeElement('tr');
            this.cols.forEach(col => {
                const cell = this.makeElement('td');
                cell.textContent = rowData[col] || '';
                row.appendChild(cell);
            });
            this.table.appendChild(row);
        });
    }
}