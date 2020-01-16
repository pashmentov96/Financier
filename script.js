function addListeners() {
    window.addEventListener('load', function() {
        console.log("Hello");
        let now = new Date();
        let record1 = new Record(1, now, "Зарплата");
        let record2 = new Record(-2, now, "Покупки в магазине");

        let json = `[${record1.toString()}, ${record2.toString()}]`;
        window.records = new Records(json);
        console.log(window.records);
    });

    window.addEventListener('beforeunload', function() {
        console.log("BYE");
    });
}

function add(object) {
    console.log(window.records);
    records.add(object);
    console.log(window.records);
}

function onButtonClick() {
    let now = new Date();
    let record3 = new Record(-10, now, "Транспорт");
    add(record3);
    console.log(records);
}