class dtquick {
    constructor(id, options = {}) {
        this.table = document.querySelector(id);
        if (this.isEmptyObject(options) != undefined)
            this.initialize(options);
    }

    initialize(options) {
        this.setVariables(options);
        document.head.innerHTML += `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`;
        this.createAndAppendNecessaryElements();

        if (this.cols)
            this.makeTableHeaders();
        // this.fetch();
    }

    makeElement = (tag, classNames = '', id = '') => {
        var element = document.createElement(tag);
        element.id = id;
        element.className = classNames;
        return element;
    }

    makeLimitsDropdown() {
        var limits = this.makeElement('select', 'form-select', 'limits');
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
        var searchFrom = this.makeElement('select', 'form-select', 'searchFrom');
        this.cols.forEach(searchItem => {
            var option = this.makeElement('option');
            option.textContent = searchItem;
            option.setAttribute('value', searchItem);
            if (searchItem == this.searchFrom)
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
                th.setAttribute('onclick', 'pageNo = 1; checkOrder(this); orderBy = \'' + col + '\'; fetch();');
                document.getElementById("thead").appendChild(th);
            });

        else if (this.cols && !Array.isArray(this.cols))
            this.cols.split(",").forEach(col => {
                document.getElementById("th").innerHTML +=
                    `<th onclick="pageNo = 1; checkOrder(this); orderBy = '` +
                    col +
                    `'; fetch();" class="th asc" >` +
                    col +
                    `<img style="cursor: pointer; position:absolute; mix-blend-mode: darken;" draggable="false" src='dn2.png' class="order"></th>`;
                var option = document.createElement("option");
                option.value = col;
                option.innerHTML = col;
                document.getElementById("searchFrom").append(option);
            });
    }

    isEmptyObject(obj) {
        return obj[Object.keys(obj)[0]];
    }

    setVariables(options) {
        this.advancedSearch = options.advancedSearch === undefined ? true : (options.advancedSearch === false ? false : true);
        this.ajaxFile = options.ajaxFile || undefined;
        this.cols = options.cols || undefined;
        this.defKey = this.cols ? (this.defKey || undefined) : undefined;
        this.defLimit = options.defLimit || this.limits[0];
        this.defOrderBy = options.defOrderBy || this.cols ? this.cols[0] : undefined;
        this.defPageNo = this.defPageNo || 1;
        this.limits = options.limits || [25, 50, 100, 250, 500];
        this.orderBy = options.orderBy || this.cols[0] || undefined;
        this.pageCount = undefined;
        this.queryLang = options.queryLang || undefined;
        this.requestType = options.requestType || 'GET';
        this.response = undefined;
        this.searchFrom = this.cols[0] || 'all';
        this.searchQuery = undefined;
        this.serverSide = options.serverSide || false;
        this.styles = options.styles;
    }

    createAndAppendNecessaryElements() {
        var container = this.table;
        var limitDiv = this.makeElement('div', 'limitDiv');
        var searchFromDiv = this.makeElement('div', 'searchDiv');
        var key = this.makeElement('input', 'form-control', 'key');
        var searchDiv = this.makeElement('div', 'searchDiv');
        var tableWrapper = this.makeElement('div', 'justify-content-center');
        var table = this.makeElement('table', 'table table-striped table-responsive-md');
        var pagesDiv = this.makeElement('div', 'pagesDiv');
        var notFound = this.makeElement('p', 'text-center d-none', 'notFound');
        var info = this.makeElement('div', 'info');
        var thead = this.makeElement('thead', '', 'thead');
        var tbody = this.makeElement('tbody', '', 'tbody');
        var pagination = this.makeElement('nav');
        var ul = this.makeElement('ul', 'pagination justify-content-end');

        pagination.appendChild(ul);
        pagesDiv.appendChild(pagination);
        limitDiv.appendChild(this.makeLimitsDropdown());
        searchFromDiv.appendChild(this.makeSearchFromDropdown());
        searchDiv.appendChild(key);
        notFound.innerHTML = `No records found ¯\\_(ツ)_/¯<hr>`;
        table.append(thead, tbody);
        tableWrapper.append(limitDiv, searchFromDiv, searchDiv, table, notFound, info, pagination);
        container.appendChild(tableWrapper);
        document.body.appendChild(container);
    }

    setPagination() {
        document.getElementsByClassName('pagination')[0].innerHTML = `<li class="page-item"><a class="page-link" tabindex="-1" onclick="setActive(1, true);" >First</a></li>`;

        document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item"><a class="page-link" tabindex="-1" onclick="setActive(parseInt(pageNo) - 1, true);" >Previous</a></li>`;

        document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item pages"><a onclick="setActive(parseInt(innerHTML), true);" class="page-link">1</a></li>`;

        pageCount = Math.ceil(response["total"] / limit);

        for (i = 2; i <= pageCount; i++)
            document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item pages"><a onclick="setActive(parseInt(innerHTML), true);" class="page-link">${i}</a></li>`;

        if (pageCount > 1) {
            document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item"><a onclick="setActive(parseInt(pageNo) + 1, true);" class="page-link" tabindex="-1">Next</a></li>`;

            document.getElementsByClassName('pagination')[0].innerHTML += `<li class="page-item"><a onclick="setActive(parseInt(pageCount), true);" class="page-link" tabindex="-1">Last</a></li>`;
        }

        setDisabled();
        setActive(pageNo, false);

        if (pageCount > 7)
            managePagination(pageCount);
    }

    managePagination(last) {
        if (pageNo < pageCount / 2) {
            for (i = 2; i <= pageNo - 1; i++)
                document.querySelectorAll('.page-item')[i].style.display = 'none';

            for (i = parseInt(pageNo) + 4; i < last; i++) {
                if (document.querySelectorAll('.page-item')[i])
                    document.querySelectorAll('.page-item')[i].style.display = 'none';
            }

            if (pageNo != pageCount)
                if (parseInt(pageNo) + 6 < last - 1) {
                    dots = document.querySelectorAll('.page-link')[pageNo + 3];
                    dots.innerHTML = '...';
                    dots.style.fontWeight = 900;
                    dots.style.cursor = 'auto';
                    dots.style.letterSpacing = '2px';
                }
        }

        else {
            for (i = 6; i <= pageNo - 1; i++)
                document.querySelectorAll('.page-item')[i].style.display = 'none';

            for (i = pageNo + 3; i < last + 2; i++)
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
        if (byUser && page == pageNo)
            return false;

        pageItem = document.querySelectorAll('.page-item');

        if (document.querySelector('.page-item.active')) {
            document.querySelector('.page-item.active').classList.remove('active');
        }

        document.querySelectorAll('.pages')[page - 1].classList.add('active');
        pageNo = page;

        if (byUser)
            fetch();
    }


    setDisabled() {
        if (pageNo == 1) {
            document.getElementsByClassName("page-item")[0].classList.add("disabled");
            document.getElementsByClassName("page-item")[1].classList.add("disabled");

            document.getElementsByClassName("pages")[0].classList.add("active");
        }

        if (pageNo == pageCount)
            if (document.getElementsByClassName("page-item")[parseInt(pageCount) + 2] && document.getElementsByClassName("page-item")[parseInt(pageCount) + 3]) {
                document.getElementsByClassName("page-item")[parseInt(pageCount) + 2].classList.add("disabled");
                document.getElementsByClassName("page-item")[parseInt(pageCount) + 3].classList.add("disabled");
            }
    }

    fetch() {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", `${fileName}?query=${makeQuery()}&totalRecords=${totalRecords()}`, true);
        xhr.onreadystatechange = function () {
            document.body.style.cursor = 'wait';
            if (this.readyState == 4 && this.status == 200) {
                document.body.style.cursor = 'auto';
                response = JSON.parse(this.responseText);
                setInfo();
                setTable();
                setPagination();
            }
        };
        xhr.send();
    }

    makeMySQLQuery() {
        rowsPerPage = pageNo === 1 ? '' : (pageNo - 1) * limit + ', ';

        if (key === '') searchQuery = '';
        else {
            if (searchFrom === '') {
                searchQuery = ' AND ';
                for (var i = 0; i < this.cols.length; i++)
                    if (i < this.cols.length - 1)
                        searchQuery += ` ${this.cols[i]} like '%${key}%' or`;
                    else if (i === this.cols.length - 1)
                        searchQuery += ` ${this.cols[i]} like '%${key}%'`;
            }
            else
                searchQuery = ` and ${searchFrom} like '%${key}%'`;
        }

        return encodeURI(`SELECT * FROM ${db_table} WHERE 1 ${searchQuery} ORDER BY ${orderBy} ${order} LIMIT ${rowsPerPage} ${limit};`);
    }

    makeSQLQuery() {
        const rowsPerPage = pageNo === 1 ? '' : (pageNo - 1) * limit + ', ';
        let searchQuery = '';

        if (key === '') {
            searchQuery = '';
        } else {
            if (searchFrom === '') {
                searchQuery = ' AND (';
                for (let i = 0; i < cols.length; i++) {
                    if (i < cols.length - 1) {
                        searchQuery += ` ${cols[i]} LIKE '%${key}%' OR`;
                    } else if (i === cols.length - 1) {
                        searchQuery += ` ${cols[i]} LIKE '%${key}%'`;
                    }
                }
                searchQuery += ')';
            } else
                searchQuery = ` AND ${searchFrom} LIKE '%${key}%'`;
        }

        return encodeURI(`SELECT * FROM ${db_table} WHERE 1${searchQuery} ORDER BY ${orderBy} ${order} OFFSET ${rowsPerPage} FETCH NEXT ${limit} ROWS ONLY;`);
    }

    totalRecordsMySQLQuery() {
        if (key === '') searchQuery = '';
        else {
            if (searchFrom === '') {
                searchQuery = ' and ';
                for (var i = 0; i < cols.length; i++)
                    if (i < cols.length - 1)
                        searchQuery += ` ${cols[i].split("=")[1]} like '%${key}%' or`;
                    else if (i === cols.length - 1)
                        searchQuery += ` ${cols[i].split("=")[1]} like '%${key}%'`;
            }
            else
                searchQuery = ` and ${searchFrom} like '%${key}%'`;
        }

        return encodeURI(`SELECT COUNT(*) as totalRecords FROM ${db_table} where 1 ${searchQuery};`);
    }

    totalRecordsSQLQuery() {
        let searchQuery = '';

        if (key === '') {
            searchQuery = '';
        } else if (searchFrom === '') {
            searchQuery = ' AND (';
            for (let i = 0; i < cols.length; i++) {
                if (i < cols.length - 1) {
                    searchQuery += ` ${cols[i].split("=")[1]} LIKE '%${key}%' OR`;
                } else if (i === cols.length - 1) {
                    searchQuery += ` ${cols[i].split("=")[1]} LIKE '%${key}%'`;
                }
            }
            searchQuery += ')';
        } else {
            searchQuery = ` AND ${searchFrom} LIKE '%${key}%'`;
        }

        return encodeURI(`SELECT COUNT(*) as totalRecords FROM ${db_table} WHERE 1 ${searchQuery};`);
    }

    setInfo() {
        till = response["found"];
        from = parseInt(((pageNo - 1) * limit) + 1);
        to = parseInt(pageNo * limit) - (limit - till);
        document.getElementsByClassName("info")[0].innerHTML =
            "Showing " + till + " (from " + from + ' to ' + to + ") out of " + response["total"];

        if (!till)
            notFound.style.display = 'block';
        else
            notFound.style.display = 'none';
    }

    setTable() {
        data = response["data"];

        document.getElementById("tbody").innerHTML = "";
        till = response["found"];
        i = 0;
        while (i < till) {
            var tr = document.createElement("tr");
            for (var j = 0; j < cols.length; j++) {
                var td = document.createElement("td");
                td.textContent = data[i][cols[j].split("=")[1]];
                tr.append(td);
            }
            document.getElementById("tbody").append(tr);
            i++;
        }
    }

    checkOrder(obj) {
        setArrows();
        if (obj.classList.contains("asc")) {
            removeASC();
            obj.classList.remove("asc");
            obj.style.transform = "";
            obj.children[0].style.transform = "rotate(-180deg) scale(1.2)";
            order = "DESC";
        } else {
            removeASC();
            obj.classList.add("asc");
            obj.children[0].style.transform = "scale(1.7)";
            order = "ASC";
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
