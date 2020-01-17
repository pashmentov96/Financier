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
    let sum = document.getElementById("input_sum");
    sum.value = "";

    let category = document.getElementById("input_category");
    category.value = "";

    let date = document.getElementById("input_date");
    let now = new Date();

    date.value = dateToString(now);
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

function getData(type) {
    let arr = new Map();
    for (let elem of records.records) {
        if ((type === "expenses" && elem.amount < 0) || (type === "incomes" && elem.amount > 0)) {
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

function showStatistics(show, type) {
    let id = type + "_statistics";
    if (!show) {
        let statistics = document.getElementById(id);
        statistics.innerHTML = "";
    } else {
        let data = getData(type);
        let layout = {height: 300, width: 400};
        Plotly.newPlot(id, data, layout);
    }
}

function onButtonShowStatistics(type) {
    console.log(type);
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