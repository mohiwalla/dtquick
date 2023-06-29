class dtquick {
    constructor(id, options = {}) {
        this.element = document.querySelector(id);
        this.handleChange = this.handleChange.bind(this);
        if (this.isEmptyObject(options) != undefined)
            this.initialize(options);
    }

    initialize(options) {
        this.setVariables(options);
        document.head.innerHTML += `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`;
        this.createAndAppendNecessaryElements();

        if (this.cols)
            this.makeTableHeaders();
        this.fetch();
    }

    setVariables(options) {
        this.advancedSearch = options.advancedSearch === undefined ? true : (options.advancedSearch === false ? false : true);
        this.ajaxFile = options.ajaxFile || undefined;
        this.cols = options.cols || undefined;
        this.searchFromOptions = [...this.cols];
        this.key = options.defKey || '';
        this.limits = options.limits || [25, 50, 100, 250, 500];
        this.defLimit = options.defLimit || this.limits[0];
        this.limit = this.defLimit;
        this.defOrderBy = options.defOrderBy || this.cols ? this.cols[0] : undefined;
        this.defPageNo = this.defPageNo || 1;
        this.order = options.order || 'ASC';
        this.orderBy = options.orderBy || this.cols[0] || undefined;
        this.pageCount = undefined;
        this.pageNo = this.defPageNo;
        this.queryLang = options.queryLang || undefined;
        this.requestType = options.requestType || 'GET';
        this.response = undefined;
        this.searchFrom = this.searchFrom || 'All';
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

    makeElement = (tag, classNames = '', id = '') => {
        var element = document.createElement(tag);
        element.id = id;
        element.className = classNames;
        return element;
    }

    makeLimitsDropdown() {
        var limits = this.makeElement('select', 'form-select', 'limitsDropDown');
        this.limits.forEach(limit => {
            var option = this.makeElement('option');
            option.textContent = limit;
            option.setAttribute('value', limit);
            if (limit == this.defLimit)
                option.setAttribute('selected', true);
            limits.appendChild(option);
        });
        return limits;
    }

    makeSearchFromDropdown() {
        var searchFrom = this.makeElement('select', 'form-select', 'searchFromDropDown');
        this.searchFromOptions.unshift("All");
        this.searchFromOptions.forEach(searchFromItem => {
            var option = this.makeElement('option');
            option.textContent = searchFromItem;
            option.value = searchFromItem;
            if (searchFromItem == 'All')
                option.value = '';
            if (searchFromItem == this.searchFrom)
                option.setAttribute('selected', true);
            searchFrom.appendChild(option);
        });
        return searchFrom;
    }

    makeTableHeaders() {
        if (this.cols && Array.isArray(this.cols))
            this.cols.forEach(col => {
                var th = this.makeElement('th', 'th');
                th.innerHTML = col;
                var arrowImg = this.makeElement('img', 'arrow');
                arrowImg.src = 'dn2.png';
                th.appendChild(arrowImg);
                th.addEventListener('click', () => {
                    pageNo = 1;
                    checkOrder(th);
                    orderBy = col;
                    fetch();
                });
                document.getElementById("thead").appendChild(th);
            });

        // else if (this.cols && !Array.isArray(this.cols))
        //     this.cols.split(",").forEach(col => {
        //         document.getElementById("th").innerHTML +=
        //             `<th onclick="pageNo = 1; checkOrder(this); orderBy = '` +
        //             col +
        //             `'; fetch();" class="th asc" >` +
        //             col +
        //             `<img style="cursor: pointer; position:absolute; mix-blend-mode: darken;" draggable="false" src='dn2.png' class="order"></th>`;
        //         var option = document.createElement("option");
        //         option.value = col;
        //         option.innerHTML = col;
        //         document.getElementById("searchFrom").append(option);
        //     });
    }

    isEmptyObject(obj) {
        return obj[Object.keys(obj)[0]];
    }

    createAndAppendNecessaryElements() {
        var container = this.element;
        var limitsDiv = this.makeElement('div', 'limitsDiv');
        var limitsDropDown = this.makeLimitsDropdown();
        var limitsDropDownLabel = this.makeElement('label', 'form-label', 'limitsDropDownLabel');
        var emptyDiv = this.makeElement('div');
        var searchFromDropDown = this.makeSearchFromDropdown();
        var searchFromDropDownLabel = this.makeElement('label', 'form-label', 'searchFromDropDownLabel');
        var searchFromDiv = this.makeElement('div', 'searchFromDiv');
        var searchBox = this.makeElement('input', 'form-control', 'searchBox');
        var searchBoxLabel = this.makeElement('label', 'form-label', 'searchBox');
        var taskBar = this.makeElement('div', 'taskBar');
        var searchBoxDiv = this.makeElement('div', 'searchBoxDiv');
        var tableWrapper = this.makeElement('div', 'justify-content-center');
        var table = this.makeElement('table', 'table table-striped table-responsive-md');
        var pagesDiv = this.makeElement('div', 'pagesDiv');
        var notFound = this.makeElement('p', 'text-center d-none', 'notFound');
        var info = this.makeElement('div', 'info');
        var thead = this.makeElement('thead', '', 'thead');
        var tbody = this.makeElement('tbody', '', 'tbody');
        var pagination = this.makeElement('nav');
        var ul = this.makeElement('ul', 'pagination justify-content-end');

        container.setAttribute('class', 'dtquick');

        pagination.appendChild(ul);
        pagesDiv.appendChild(pagination);

        limitsDropDownLabel.setAttribute('for', 'limitsDropDown');
        limitsDropDownLabel.textContent = this.limitsText;
        limitsDropDown.addEventListener('input', this.handleChange);
        limitsDiv.append(limitsDropDownLabel, limitsDropDown);

        searchFromDropDownLabel.setAttribute('for', 'searchFromDropDown');
        searchFromDropDownLabel.textContent = this.searchFromText;
        searchFromDropDown.addEventListener('input', this.handleChange);
        searchFromDiv.append(searchFromDropDownLabel, searchFromDropDown);

        searchBoxLabel.setAttribute('for', 'searchBox');
        this.searchBoxAutoFocus ? searchBox.setAttribute('autofocus', true) : null;
        searchBox.setAttribute('placeholder', "Press '/' to focus");
        searchBox.addEventListener('input', this.handleChange);
        searchBoxLabel.textContent = this.searchBoxText;
        searchBoxDiv.append(searchBoxLabel, searchBox);

        notFound.innerHTML = this.notFoundText;
        table.append(thead, tbody);
        taskBar.append(limitsDiv, emptyDiv, searchFromDiv, searchBoxDiv);
        tableWrapper.append(taskBar, table, notFound, info, pagination);
        container.appendChild(tableWrapper);
        document.body.appendChild(container);

        window.addEventListener('keyup', function (e) {
            if (e.key == '/') {
                searchBox.focus();
            }
        });
    }

    handleChange(event) {
        if (event.target.id == 'limitsDropDown')
            this.limit = event.target.value;
        else if (event.target.id == 'searchFromDropDown')
            this.searchFrom = event.target.value;
        else if (event.target.id == 'searchBox')
            this.key = event.target.value;
        this.pageNo = 1;

        this.fetch();
    }

    setPagination() {
        document.getElementsByClassName('pagination')[0].innerHTML = `<li class="page-item"><a class="page-link" tabindex="-1" onclick="this.setActive(1, true);" >First</a></li>`;

        document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item"><a class="page-link" tabindex="-1" onclick="this.setActive(parseInt(this.pageNo) - 1, true);" >Previous</a></li>`;

        document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item pages"><a onclick="this.setActive(parseInt(innerHTML), true);" class="page-link">1</a></li>`;

        this.pageCount = Math.ceil(this.response["total"] / this.limit);

        for (var i = 2; i <= this.pageCount; i++)
            document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item pages"><a onclick="this.setActive(parseInt(innerHTML), true);" class="page-link">${i}</a></li>`;

        if (this.pageCount > 1) {
            document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item"><a onclick="this.setActive(parseInt(this.pageNo) + 1, true);" class="page-link" tabindex="-1">Next</a></li>`;

            document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item"><a onclick="this.setActive(parseInt(this.pageCount), true);" class="page-link" tabindex="-1">Last</a></li>`;
        }

        this.setDisabled();
        this.setActive(this.pageNo, false);

        if (this.pageCount > 7)
            this.managePagination(this.pageCount);
    }

    managePagination(last) {
        if (this.pageNo < this.pageCount / 2) {
            for (var i = 2; i <= this.pageNo - 1; i++)
                document.querySelectorAll('.page-item')[i].style.display = 'none';

            for (var i = parseInt(this.pageNo) + 4; i < last; i++) {
                if (document.querySelectorAll('.page-item')[i])
                    document.querySelectorAll('.page-item')[i].style.display = 'none';
            }

            if (this.pageNo != this.pageCount)
                if (parseInt(this.pageNo) + 6 < last - 1) {
                    var dots = document.querySelectorAll('.page-link')[this.pageNo + 3];
                    dots.innerHTML = '...';
                    dots.style.fontWeight = 900;
                    dots.style.cursor = 'auto';
                    dots.style.letterSpacing = '2px';
                }
        }

        else {
            for (i = 6; i <= this.pageNo - 1; i++)
                document.querySelectorAll('.page-item')[i].style.display = 'none';

            for (i = this.pageNo + 3; i < last + 2; i++)
                document.querySelectorAll('.page-item')[i].style.display = 'none';

            dots = document.querySelectorAll('.page-link')[5];
            dots.innerHTML = '...';
            dots.style.fontWeight = 900;
            dots.style.cursor = 'auto';
            dots.style.letterSpacing = '2px';
        }
    }

    setActive(page, byUser) {
        if (isNaN(page))
            return false;
        if (byUser && page == this.pageNo)
            return false;

        var pageItem = document.querySelectorAll('.page-item');

        if (document.querySelector('.page-item.active')) {
            document.querySelector('.page-item.active').classList.remove('active');
        }

        document.querySelectorAll('.pages')[page - 1].classList.add('active');
        this.pageNo = page;

        if (byUser)
            this.fetch();
    }


    setDisabled() {
        if (this.pageNo == 1) {
            document.getElementsByClassName("page-item")[0].classList.add("disabled");
            document.getElementsByClassName("page-item")[1].classList.add("disabled");

            document.getElementsByClassName("pages")[0].classList.add("active");
        }

        if (this.pageNo == this.pageCount)
            if (document.getElementsByClassName("page-item")[parseInt(this.pageCount) + 2] && document.getElementsByClassName("page-item")[parseInt(this.pageCount) + 3]) {
                document.getElementsByClassName("page-item")[parseInt(this.pageCount) + 2].classList.add("disabled");
                document.getElementsByClassName("page-item")[parseInt(this.pageCount) + 3].classList.add("disabled");
            }
    }

    fetch() {
        this.queryLang ? xhr.open("GET", `${this.ajaxFile}?query=${this.makeSQLQuery()}&totalRecords=${this.totalRecordsSQLQuery()}`, true) : this.xhr.open("GET", `${this.ajaxFile}?query=${this.makeMySQLQuery()}&totalRecords=${this.totalRecordsMySQLQuery()}`, true);
        this.xhr.onreadystatechange = this.handleResponse.bind(this);
        this.xhr.send();
    }

    handleResponse() {
        if (this.xhr.readyState == 4 && this.xhr.status == 200) {
            this.response = JSON.parse(this.xhr.response);
            this.setInfo();
            this.setTable();
            this.setPagination();
        }
    }

    makeMySQLQuery() {
        const rowsPerPage = this.pageNo === 1 ? '' : (this.pageNo - 1) * this.limit + ', ';

        if (this.key === '') this.searchQuery = '';
        else {
            if (this.searchFrom === '') {
                console.log(this.searchQuery)
                this.searchQuery = ' AND ';
                for (var i = 0; i < this.cols.length; i++)
                    if (i < this.cols.length - 1)
                        this.searchQuery += ` ${this.cols[i]} like '%${this.key}%' or`;
                    else if (i === this.cols.length - 1)
                        this.searchQuery += ` ${this.cols[i]} like '%${this.key}%'`;
            }
            else
                this.searchQuery = ` and ${this.searchFrom} like '%${this.key}%'`;
        }

        return encodeURI(`SELECT * FROM ${this.table} WHERE 1 ${this.searchQuery} ORDER BY ${this.orderBy} ${this.order} LIMIT ${rowsPerPage} ${this.limit};`);
    }

    makeSQLQuery() {
        const rowsPerPage = this.pageNo === 1 ? '' : (this.pageNo - 1) * this.limit + ', ';

        if (this.key === '') {
            this.searchQuery = '';
        } else {
            if (this.searchFrom === '') {
                this.searchQuery = ' AND (';
                for (let i = 0; i < this.cols.length; i++) {
                    if (i < this.cols.length - 1) {
                        this.searchQuery += ` ${this.cols[i]} LIKE '%${this.key}%' OR`;
                    } else if (i === cols.length - 1) {
                        this.searchQuery += ` ${this.cols[i]} LIKE '%${this.key}%'`;
                    }
                }
                this.searchQuery += ')';
            } else
                this.searchQuery = ` AND ${this.searchFrom} LIKE '%${this.key}%'`;
        }

        return encodeURI(`SELECT * FROM ${this.table} WHERE 1${this.searchQuery} ORDER BY ${this.orderBy} ${order} OFFSET ${rowsPerPage} FETCH NEXT ${this.limit} ROWS ONLY;`);
    }

    totalRecordsMySQLQuery() {
        if (this.key === '') this.searchQuery = '';
        else {
            if (this.searchFrom === '') {
                this.searchQuery = ' AND ';
                for (var i = 0; i < this.cols.length; i++)
                    if (i < this.cols.length - 1)
                        this.searchQuery += ` ${this.cols[i]} like '%${this.key}%' or`;
                    else if (i === this.cols.length - 1)
                        this.searchQuery += ` ${this.cols[i]} like '%${this.key}%'`;
            }
            else
                this.searchQuery = ` and ${this.searchFrom} like '%${this.key}%'`;
        }

        return encodeURI(`SELECT COUNT(*) as totalRecords FROM ${this.table} where 1 ${this.searchQuery};`);
    }

    totalRecordsSQLQuery() {
        if (this.key === '') {
            this.searchQuery = '';
        } else if (this.searchFrom === '') {
            this.searchQuery = ' AND (';
            for (let i = 0; i < this.cols.length; i++) {
                if (i < this.cols.length - 1) {
                    this.searchQuery += ` ${this.cols[i]} LIKE '%${this.key}%' OR`;
                } else if (i === this.cols.length - 1) {
                    this.searchQuery += ` ${this.cols[i]} LIKE '%${this.key}%'`;
                }
            }
            this.searchQuery += ')';
        } else {
            this.searchQuery = ` AND ${this.searchFrom} LIKE '%${this.key}%'`;
        }

        return encodeURI(`SELECT COUNT(*) as totalRecords FROM ${this.table} WHERE 1 ${this.searchQuery};`);
    }

    setInfo() {
        var till = this.response["found"];
        var from = parseInt(((this.pageNo - 1) * this.limit) + 1);
        var to = parseInt(this.pageNo * this.limit) - (this.limit - till);
        document.getElementsByClassName("info")[0].innerHTML =
            "Showing " + till + " (from " + from + ' to ' + to + ") out of " + this.response["total"];

        if (!till)
            notFound.style.display = 'block';
        else
            notFound.style.display = 'none';
    }

    setTable() {
        var data = this.response["data"];

        document.getElementById("tbody").innerHTML = "";
        var till = this.response["found"];
        var i = 0;
        while (i < till) {
            var tr = document.createElement("tr");
            for (var j = 0; j < this.cols.length; j++) {
                var td = document.createElement("td");
                td.textContent = data[i][this.cols[j]];
                tr.append(td);
            }
            document.getElementById("tbody").append(tr);
            i++;
        }
    }

    checkOrder(obj) {
        this.setArrows();
        if (obj.classList.contains("asc")) {
            this.removeASC();
            obj.classList.remove("asc");
            obj.style.transform = "";
            obj.children[0].style.transform = "rotate(-180deg) scale(1.2)";
            this.order = "DESC";
        } else {
            this.removeASC();
            obj.classList.add("asc");
            obj.children[0].style.transform = "scale(1.7)";
            this.order = "ASC";
        }
    }

    removeASC() {
        ths = document.getElementsByClassName("th");
        for (i = 0; i < ths.length; i++) ths[i].classList.remove("asc");
    }

    setArrows() {
        arrows = document.getElementsByClassName("order");
        for (i = 0; i < arrows.length; i++) {
            arrows[i].style.transform = "rotate(0deg) scale(1)";
        }
    }
}