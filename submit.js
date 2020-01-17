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

function validateForm() {
    let errors = document.getElementById("errors");
    errors.innerText = "";

    if (!validateSum(document.getElementById("input_sum").value)) {
        return false;
    }

    if (!validateDate(document.getElementById("input_date").value)) {
        return false;
    }

    console.log("input_sum: " + document.getElementById("input_sum").value);
    console.log("input_date: " + document.getElementById("input_date").value);
    console.log("input_category: " + document.getElementById("input_category").value);
    return true;
}