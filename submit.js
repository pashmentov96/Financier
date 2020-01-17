function validateSum(sum) {
    let errors = document.getElementById("errors");
    if (isNaN(sum)) {
        errors.innerText = "Сумма должна быть числом";
        return false;
    }
    if (sum <= 0) {
        errors.innerText = "Сумма должна быть положительным числом";
        return false;
    }
    return true;
}

function validateDate(date) {
    let errors = document.getElementById("errors");
    if (date === "") {
        errors.innerText = "Выберите дату";
        return false;
    }

    date = new Date(date);

    let now = new Date();

    if (date > now) {
        errors.innerText = "Выберите дату, которая уже прошла";
        return false;
    }
    return true;
}

function addRecord(object) {
    records.add(object);
    fillStatistics();
    localStorage.setItem("RECORDS", records.toString());
    console.log(records);
}

function getTypeCheckedButton() {
    let checkboxes = document.getElementsByName("type");
    let checked = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checked.push(checkboxes[i].value);
        }
    }
    return checked[0];
}

function validateForm() {
    let errors = document.getElementById("errors");
    let input_sum = document.getElementById("input_sum").value;
    let input_date = document.getElementById("input_date").value;
    let input_category = document.getElementById("input_category").value;
    let input_type = getTypeCheckedButton();

    errors.innerText = "";

    if (!validateSum(input_sum)) {
        return false;
    }

    if (!validateDate(input_date)) {
        return false;
    }

    console.log("input_sum: " + input_sum);
    console.log("input_date: " + input_date);
    console.log("input_category: " + input_category);
    console.log("input_type: " + input_type);

    if (input_type === "Expense") {
        input_sum *= -1;
    }

    let record = new Record(input_sum, input_date, input_category);
    addRecord(record);

    return true;
}