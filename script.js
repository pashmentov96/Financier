function addListeners() {
    window.addEventListener('load', function() {
        if (!localStorage.getItem("RECORDS")) {
            localStorage.setItem("RECORDS", "[]");
        }
        let json_records = localStorage.getItem("RECORDS");
        window.records = new Records(json_records);
        console.log(window.records);
    });

    window.addEventListener('beforeunload', function() {
        console.log("BYE");
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
    console.log("Now: " + dateToString(now));
    date.value = dateToString(now);
}

function add(object) {
    console.log(window.records);
    records.add(object);
    console.log(window.records);
}