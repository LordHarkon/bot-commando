const Discord = require('discord.js');
const client = new Discord.Client();
const { check, getOne, set } = require('./better-sqlite3');
const { nextLevel } = require('./Util');

// -----------------------Level--------------------------- //
check('levelSystem', ['id TEXT PRIMARY KEY', 'experience INTEGER', 'level INTEGER', 'nextLevelXP INTEGER']);

client.getLevelSystem = getOne('levelSystem');
client.setLevelSystem = set('levelSystem', ['id', 'experience', 'level', 'nextLevelXP']);

exports.getLevel = (id) => {
    var score = client.getLevelSystem.get(id);

    if (!score) {
        score = {
            id: id,
            experience: 0,
            level: 0,
            nextLevelXP: nextLevel(1)
        };
    };

    return score;
}

exports.setLevel = (score) => {
    client.setLevelSystem.run(score);
    return true;
}
// -----------------------Level--------------------------- //

// -----------------------Stats--------------------------- //
check('stats', ['id TEXT PRIMARY KEY', 'messages INTEGER']);

client.getStats = getOne('stats');
client.setStats = set('stats', ['id', 'messages']);

exports.getStats = (id) => {
    var stat = client.getStats.get(id);

    if (!stat) {
        stat = {
            id: id,
            messages: 1
        }
    }

    return stat;
}

exports.setStats = (stat) => {
    client.setStats.run(stat);
    return true;
}
// -----------------------Stats--------------------------- //

// ----------------------Warnings------------------------- //
check('warnings', ['id TEXT PRIMARY KEY', 'warnings INTEGER']);

client.getWarnings = getOne('warnings');
client.setWarnings = set('warnings', ['id', 'warnings']);

exports.getWarnings = (id) => {
    var Warning = client.getWarnings.get(id);

    if (!Warning) {
        Warning = {
            id: id,
            warnings: 0
        }
    }

    return Warning;
}

exports.setWarnings = (Warning) => {
    client.setWarnings.run(Warning);
    return true;
}
// ----------------------Warnings------------------------- //

// -----------------------Cases--------------------------- //
check('caseNum', ['id TEXT PRIMARY KEY', 'number INTEGER']);

client.getCaseNum = getOne('caseNum');
client.setCaseNum = set('caseNum', ['id', 'number']);

exports.getCase = () => {
    var caseNumber = client.getCaseNumber.get('caseNumber');

    if (!caseNumber) {
        caseNumber = {
            id: 'caseNumber',
            number: 0
        }
    };
}

exports.setCase = (cases) => {
    client.setCaseNumber.run(cases);
    return true;
}
// -----------------------Cases--------------------------- //

// ----------------------GTNGame-------------------------- //
check('GTN_game', ['id TEXT PRIMARY KEY', 'number INTEGER', 'started TEXT']);

client.getGTNGame = getOne('GTN_game');
client.setGTNGame = set('GTN_game', ['id', 'number', 'started']);

exports.getGame = () => {
    let game = client.getGTNGame.get('game');

    if(!game) {
        game = {
            id: 'game',
            number: 0,
            started: "false"
        }
    }

    return game;
}

exports.setGame = (game) => {
    client.setGTNGame.run(game);
    return true;
}
// ----------------------GTNGame-------------------------- //

// ---------------------GTNPlayer------------------------- //
check('GTN_player', ['id TEXT PRIMARY KEY', 'wins INTEGER']);

client.getGTNPlayer = getOne('GTN_player');
client.setGTNPlayer = set('GTN_player', ['id', 'wins']);

exports.getPlayer = (id) => {
    var player = client.getGTNPlayer.get(id);

    if(!player) {
        player = {
            id: id,
            wins: 0
        }
    }

    return player;
}

exports.setPlayer = (player) => {
    client.setGTNPlayer.run(player);
    return true;
}
// ---------------------GTNPlayer------------------------- //

// ------------------------Bank--------------------------- //
check('bank', ['id TEXT PRIMARY KEY', 'money INTEGER', 'loan INTEGER', 'day INTEGER', 'interest INTEGER', 'date INTEGER', 'multiplier INTEGER']);

client.getOneB = getOne('bank');
client.setB = set('bank', ['id', 'money', 'loan', 'day', 'interest', 'date', 'multiplier']);

exports.getBank = (id) => {
    var bank = client.getB.get(id);

    if(!bank) {
        bank = {
            id: id,
            money: 0,
            loan: 0,
            day: 0,
            interest: 0,
            date: "",
            multiplier: 0
        }
    }

    return bank;
}

exports.setBank = (bank) => {
    client.setB.run(bank);
    return true;
}
// ------------------------Bank--------------------------- //