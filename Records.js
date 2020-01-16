class Record {
    constructor(amount, date, category) {
        this.amount = amount;
        this.date = date;
        this.category = category;
    }

    toString() {
        let tmp = {amount: this.amount, date: this.date, category: this.category};
        return JSON.stringify(tmp);
    }
}

class Records {
    constructor(records) {
        if (records === "") {
            records = "[]";
        }
        this.records = JSON.parse(records);
    }

    add(record) {
        this.records.push(record);
    }

    toString() {
        return JSON.stringify(this.records);
    }
}