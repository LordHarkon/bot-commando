const mysql = require('mysql');
const winston = require('winston');
const { promisify } = require('util');

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'commands.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
    )
});

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE
})

const query = promisify(con.query).bind(con);

con.connect(function(err) {
    if(err) throw logger.error(err);
    logger.info('Database connected.');
})

function keepAlive() {
    con.query(`SELECT 1 + 1 AS solution`, (err, result) => {
        if(err) throw logger.error(err);
    })
}

keepAlive();

setInterval(keepAlive, 180000);

module.exports = class Database {
    /**
     * Returns the current level of a user
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getLevel(id) {
        let x = await query(`SELECT * FROM levelSystem WHERE id = "${id}"`);
        return await x[0].level;
    };

    /**
     * Returns the current experience of a user
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getExperience(id) {
        let x = await query(`SELECT * FROM levelSystem WHERE id = "${id}"`);
        return await x[0].experience;
    };

    /**
     * Returns the amount of experience for the user to level up to the next level
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getNextLevelXP(id) {
        let x = await query(`SELECT * FROM levelSystem WHERE id = "${id}"`);
        return await x[0].nextLevelXP;
    };

    /**
     * Sets a user's level
     * @param {number} id - ID of the user's Discord account
     * @param {number} level - The level that will be set as the user's
     * @returns {boolean}
     */
    static setLevel(id, level) {
        query(`UPDATE levelSystem SET level = ${Number(level)} WHERE id = "${id}"`);
        return true;
    };

    /**
     * Sets a user's experience points
     * @param {number} id - ID of the user's Discord account
     * @param {number} experience - The amount of experience points that will be set as the user's
     * @returns {boolean}
     */
    static setExperience(id, experience) {
        query(`UPDATE levelSystem SET experience = ${Number(experience)} WHERE id = "${id}"`);
        return true;
    };

    /**
     * Adds to the current level of the user a specified amount
     * @param {number} id - ID of the user's Discord account
     * @param {number} level - The amount of levels that will be added
     * @returns {boolean}
     */
    static addLevel(id, level) {
        query(`UPDATE levelSystem SET level = ${Number(level)} + level WHERE id = "${id}"`);
        return true;
    }

    /**
     * Adds to the current experience pool of the user a specified amount
     * @param {number} id - ID of the user's Discord account
     * @param {number} experience - The amount of experience points that will be added
     * @returns {boolean}
     */
    static addExperience(id, experience) {
        query(`UPDATE levelSystem SET experience = ${Number(experience)} + experience WHERE id = "${id}"`);
        return true;
    }

    /**
     * Removes a specified number of levels from the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} level - The amount of levels that will be removed
     * @returns {boolean}
     */
    static removeLevel(id, level) {
        query(`UPDATE levelSystem SET level = ${Number(level)} - level WHERE id = "${id}"`);
        return true;
    }

    /**
     * Removes a specified amount of experience points from the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} experience - The amount of experience points that will be removed
     * @returns {boolean}
     */
    static removeExperience(id, experience) {
        query(`UPDATE levelSystem SET experience = ${Number(experience)} - experience WHERE id = "${id}"`);
        return true;
    }

    /**
     * Returns the amount of money the user has
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async balance(id) {
        let x = await query(`SELECT * FROM bank WHERE id = "${id}"`);
        return await x[0].balance
    }

    /**
     * Returns details about the loan of the user, if they have any
     * @param {number} id - ID of the user's Discord account
     * @param {string} choice - The current amount of the loan/Days since the loan was taken/The interest rate/Date when the loan was taken(in milliseconds)/The multiplier for the interest
     * @returns {number|string|date}
     */
    static async get(id, choice) {
        let x = await query(`SELECT * FROM bank WHERE id = "${id}"`);
        switch(choice) {
            case 'loan': return await x[0].loan;
            case 'day': return await x[0].day;
            case 'interest': return await x[0].interest;
            case 'date': return await x[0].date;
            case 'multiplier': return await x[0].multiplier;
            default: return await x[0].loan;
        }
    }

    /**
     * Sets the balance of a user
     * @param {number} id - ID of the user's Discord account
     * @param {number} sum - The amount of money that will be set
     * @returns {boolean}
     */
    static setMoney(id, sum) {
        query(`UPDATE bank SET money = ${Number(sum)} WHERE id = "${id}"`);
        return true;
    }

    /**
     * Adds to the current balance of the user a specified amount
     * @param {number} id - ID of the user's Discord account
     * @param {number} sum - The amount of money that will be added to the balance
     * @returns {boolean}
     */
    static addMoney(id, sum) {
        query(`UPDATE bank SET money = ${Number(sum)} + money WHERE id = "${id}"`);
        return true;
    }

    /**
     * Removes a specified amount of money from the user's balance
     * @param {number} id - ID of the user's Discord account
     * @param {number} sum - The amount of money that will be removed from the balance
     * @returns {boolean}
     */
    static removeMoney(id, sum) {
        query(`UPDATE bank SET money = ${Number(sum)} - money WHERE id = "${id}"`);
        return true;
    }

    /**
     * Returns the amount of messages the user has sent since joining the server (Only after the bot has joined the server)
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getMessages(id) {
        let x = await query(`SELECT * FROM stats WHERE id = "${id}"`);
        return await x[0].messages;
    }

    /**
     * Returns the amount of warnings the user has
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getWarnings(id) {
        let x = await query(`SELECT * FROM stats WHERE id = "${id}"`);
        return await x[0].warnings;
    }

    /**
     * Sets the number of messages a user has sent (has nothing to do with the real amount of messages the user has sent)
     * @param {number} id - ID of the user's Discord account
     * @param {number} messages - The amount of messages the will be set
     * @returns {boolean}
     */
    static setMessages(id, messages) {
        query(`UPDATE stats SET messages = ${Number(messages)} WHERE id = "${id}"`);
        return true;
    }

    /**
     * Sets a user's number of warnings
     * @param {number} id - ID of the user's Discord account
     * @param {number} warnings - The number of warnings that will be set
     * @returns {boolean}
     */
    static setWarnings(id, warnings) {
        query(`UPDATE stats SET warnings = ${Number(warnings)} WHERE id = "${id}"`);
        return true;
    }

    /**
     * Adds messages to a user (has nothing to do with the real amount of messages the user has sent)
     * @param {number} id - ID of the user's Discord account
     * @param {number} messages - The amount of messages that will be added
     * @returns {boolean}
     */
    static addMessages(id, messages) {
        query(`UPDATE stats SET messages = ${Number(messages)} + messages WHERE id = "${id}"`);
        return true;
    }

    /**
     * Adds a specified amount of warnings to the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} warnings - The number of warnings to add (Default: 1)
     * @returns {boolean}
     */
    static addWarnings(id, warnings = 1) {
        query(`UPDATE stats SET warnings = ${Number(warnings)} + warnings WHERE id = "${id}"`);
        return true;
    }

    /**
     * Reduces the number of messages the user has sent (has nothing to do with the real amount of messages the user has sent)
     * @param {number} id - ID of the user's Discord account
     * @param {number} messages - The amount of messages that will be reduced
     * @returns {boolean}
     */
    static removeMessages(id, messages) {
        query(`UPDATE stats SET messages = ${Number(messages)} - messages WHERE id = "${id}"`);
        return true;
    }

    /**
     * Removes a specified of warnings from the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} warnings - The number of warnings to be removed (Default: 1)
     */
    static removeWarnings(id, warnings = 1) {
        query(`UPDATE stats SET warnings = ${Number(warnings)} - warnings WHERE id = "${id}"`);
        return true;
    }
}