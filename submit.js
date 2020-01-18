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

function resetForm() {
    let sum = document.getElementById("input_sum");
    sum.value = "";

    let category = document.getElementById("input_category");
    category.value = "";

    let date_add = document.getElementById("input_date");
    let now = new Date();

    date_add.value = dateToString(now);
    date_add.min = "1970-01-01";
    date_add.max = dateToString(now);
}

function addRecord(object) {
    records.add(object);
    fillStatistics();
    resetForm();
    localStorage.setItem("RECORDS", records.toString());
    console.log(records);

    updateStatistics("incomes");
    updateStatistics("expenses");
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

function validateCategory(category) {
    let errors = document.getElementById("errors");
    if (category === "") {
        errors.innerText = "Введите категорию";
        return false;
    }
    return true;
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

    if (!validateCategory(input_category)) {
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