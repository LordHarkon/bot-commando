const { getBank, setBank } = require('./database');

module.exports = class Bank {
    static balance(id) {
        return getBank(id).money;
    }

    static get(id, choice){
        let b = getBank(id);
        switch(choice){
            case 'loan': return b.loan;
            case 'day': return b.day;
            case 'interest': return b.interest;
            case 'date': return b.date;
            case 'multiplier': return b.multiplier
            default: return b.loan;
        }
    }

    static setMoney(id, sum) {
        let b = getBank(id);
        b.money = Number(sum);
        setBank(b);
        return true;
    }

    static addMoney(id, sum) {
        let b = getBank(id);
        b.money += Number(sum);
        setBank(b);
        return true;
    }

    static removeMoney(id, sum) {
        let b = getBank(id);
        b.money -= Number(sum);
        setBank(b);
        return true;
    }
}