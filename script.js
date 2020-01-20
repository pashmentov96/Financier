function addListeners() {
    window.addEventListener('load', function() {
        if (!localStorage.getItem("RECORDS")) {
            localStorage.setItem("RECORDS", "[]");
        }
        let json_records = localStorage.getItem("RECORDS");
        window.records = new Records(json_records);
        console.log(window.records);
        fillStatistics();
    });

    window.addEventListener('beforeunload', function() {
        localStorage.setItem("RECORDS", window.records.toString());
    });
}

function dateToString(date) {
    let full_year = date.getFullYear();
    let full_month = date.getMonth() + 1;
    if (full_month < 10) {
        full_month = "0" + full_month;
    }
    let full_day = date.getDate();
    if (full_day < 10) {
        full_day = "0" + full_day;
    }
    return full_year + "-" + full_month + "-" + full_day;
}

function fillDefaultForm() {
    resetForm();

    let now = new Date();

    document.getElementById("expenses_start_interval").min = "1970-01-01";
    document.getElementById("expenses_start_interval").max = dateToString(now);
    document.getElementById("expenses_start_interval").value = "";
    document.getElementById("expenses_finish_interval").value = dateToString(now);
    document.getElementById("expenses_finish_interval").max = dateToString(now);

    document.getElementById("incomes_start_interval").min = "1970-01-01";
    document.getElementById("incomes_start_interval").max = dateToString(now);
    document.getElementById("incomes_start_interval").value = "";
    document.getElementById("incomes_finish_interval").value = dateToString(now);
    document.getElementById("incomes_finish_interval").max = dateToString(now);
}

function compare(a, b) {
    if (a.date > b.date) {
        return -1;
    }
    if (a.date < b.date) {
        return 1;
    }
    return 0;
}

function createDay(arr) {
    let day = document.createElement('div');
    let name = document.createElement('p');
    name.innerText = arr[0].date;
    name.setAttribute("class", "date");
    day.append(name);
    for (let elem of arr) {
        let record = document.createElement('div');
        record.setAttribute("class", "record");

        let p = document.createElement('p');
        p.innerText = elem.category + ": " + elem.amount + "₽";
        if (elem.amount < 0) {
            p.setAttribute("class", "negative");
        } else {
            p.setAttribute("class", "positive");
        }
        record.append(p);
        day.append(record);
    }
    return day;
}

function fillHistory() {
    let arr = records.records; // the same link -- it's OK
    arr.sort(compare);
    console.log(arr);

    let history = [];

    let start = -1;
    for (let i = 0; i < arr.length; ++i) {
        if (start === -1 || arr[i].date !== arr[start].date) {
            if (start !== -1) {
                console.log(start + " -> " + (i - 1));
                history.push(createDay(arr.slice(start, i)));
            }
            start = i;
        }
        if (i === arr.length - 1) {
            console.log(start + " -> " + i);
            history.push(createDay(arr.slice(start, i + 1)));
        }
    }

    let div = document.getElementById("history");
    div.innerHTML = "";

    for (let day of history) {
        div.append(day);
    }
}

function fillStatistics() {
    let incomes = 0;
    let expenses = 0;
    for (let elem of records.records) {
        if (+elem.amount < 0) {
            expenses -= +elem.amount;
        } else {
            incomes += +elem.amount;
        }
    }
    document.getElementById("amount_incomes").innerText = incomes.toString();
    document.getElementById("amount_expenses").innerText = expenses.toString();
    fillHistory();
}

function getData(type, start, finish) {
    let arr = new Map();
    for (let elem of records.records) {
        if (((type === "expenses" && elem.amount < 0) || (type === "incomes" && elem.amount > 0)) && (start <= elem.date && elem.date <= finish)) {
            let key = elem.category;
            if (!arr.has(key)) {
                arr.set(key, 0);
            }
            arr.set(key, arr.get(key) + Math.abs(elem.amount));
        }
    }

    arr = Array.from(arr.entries());
    if (arr.length > 0) {
        return [{
            values: arr.map(d => d[1]),
            labels: arr.map(d => d[0]),
            type: 'pie'
        }];
    } else {
        return null;
    }
}

function updateStatistics(type) {
    let dates = document.getElementById(type + "_dates");
    let str = dates.className;
    if (str.indexOf("hidden") !== -1) {
        return ;
    }

    let id = type + "_statistics";
    let start = document.getElementById(type + "_start_interval").value;
    let finish = document.getElementById(type + "_finish_interval").value;

    if (start === "") {
        start = "1970-01-01";
    }

    if (finish === "") {
        return ;
    }

    let data = getData(type, start, finish);
    let layout = {height: 300, width: 400};
    if (data != null) {
        let sum = data[0].values.reduce((sum, current) => sum + current, 0);
        let amount_sum = document.getElementById("amount_" + type);
        amount_sum.innerText = sum.toString();

        Plotly.newPlot(id, data, layout);
    } else {
        let error = document.getElementById(type + "_interval_error");
        let promise = new Promise(resolve => {
            let str = error.className;
            str = str.slice(0, str.indexOf("hidden") - 2);
            console.log(str);
            error.setAttribute("class", str);

            setTimeout(() => resolve(), 2000);
        });
        promise.then(() => {
            let str = error.className + "; hidden";
            error.setAttribute("class", str);
        });
    }
}

function showStatistics(show, type) {
    let dates = document.getElementById(type + "_dates");
    let str = dates.className;
    console.log(str);

    let id = type + "_statistics";
    if (!show) {
        let statistics = document.getElementById(id);
        statistics.innerHTML = "";

        str = str + "; hidden";
        console.log(str);
        dates.setAttribute("class", str);
    } else {
        str = str.slice(0, str.indexOf("hidden") - 2);
        console.log(str);
        dates.setAttribute("class", str);
        updateStatistics(type);
    }
}

function onDateIntervalChange(type, is_start) {
    console.log("Change: " + type + ", " + is_start);
    let start = document.getElementById(type + "_start_interval");
    let finish = document.getElementById(type + "_finish_interval");
    console.log("START: " + start.value);
    console.log("FINISH: " + finish.value);
    if (is_start === 1) {
        if (start.value === "") {
            finish.min = "1970-01-01";
        } else {
            finish.min = start.value;
        }
    } else {
        if (finish.value === "") {
            let now = new Date();
            start.max = dateToString(now);
        } else {
            start.max = finish.value;
        }
    }
    updateStatistics(type);
}

function onButtonShowStatistics(type) {
    console.log("onButtonShowStatistics: " + type);
    let amount = document.getElementById("amount_" + type).innerText;
    if (amount === "0") {
        return ;
    }
    let id = "show_" + type + "_statistics";
    let text = document.getElementById(id);
    if (text.innerText === "v") {
        showStatistics(true, type);
        text.innerText = "^";
    } else {
        showStatistics(false, type);
        text.innerText = "v";
    }
}