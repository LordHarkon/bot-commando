const mysql = require('promise-mysql');
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

mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE,
    reconnect: true
}).then(conn => {
    con = conn;
    return con;
})



module.exports = class Database {
    /**
     * As bots are excluded from the message event, this is used to insert them into the database;
     * @param {number} id - ID of the user's Discord account
     */
    static create(id) {
        con.query(`INSERT IGNORE INTO bank (id, money) VALUES (${id}, 0)`);
        con.query(`INSERT IGNORE INTO stats (id, messages, warnings) VALUES (${id}, 0, 0)`);
        con.query(`INSERT IGNORE INTO levelSystem (id, experience, level, nextLevelXP) VALUES (${id}, 0, 0, 18)`);
        con.query(`INSERT IGNORE INTO inventory (id, items_owned, items_history, inventory_size) VALUES (${id}, '[]', '[]', 20)`);
    };

    /**
     * Returns the current level of a user
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getLevel(id) {
        let x = await con.query(`SELECT * FROM levelSystem WHERE id = "${id}"`);
        return await x[0].level;
    };

    /**
     * Returns the current experience of a user
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getExperience(id) {
        let x = await con.query(`SELECT * FROM levelSystem WHERE id = "${id}"`);
        return await x[0].experience;
    };

    /**
     * Returns the amount of experience for the user to level up to the next level
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getNextLevelXP(id) {
        let x = await con.query(`SELECT * FROM levelSystem WHERE id = "${id}"`);
        return await x[0].nextLevelXP;
    };

    /**
     * Sets a user's level
     * @param {number} id - ID of the user's Discord account
     * @param {number} level - The level that will be set
     */
    static setLevel(id, level) {
        con.query(`UPDATE levelSystem SET level = ${Number(level)} WHERE id = "${id}"`);
    };

    /**
     * Sets a user's experience points
     * @param {number} id - ID of the user's Discord account
     * @param {number} experience - The amount of experience points that will be set
     */
    static setExperience(id, experience) {
        con.query(`UPDATE levelSystem SET experience = ${Number(experience)} WHERE id = "${id}"`);
    };

    /**
     * Sets the experience points needed for the user to level up to the next level
     * @param {number} id - ID of the user's Discord account
     * @param {number} nextLevelXP - The amount of experience points needed for the next level that will be set
     */
    static setNextLevelXP(id, nextLevelXP) {
        con.query(`UPDATE levelSystem SET nextLevelXP = ${Number(nextLevelXP)} WHERE id = "${id}"`);
    };

    /**
     * Adds to the current level of the user a specified amount
     * @param {number} id - ID of the user's Discord account
     * @param {number} level - The amount of levels that will be added
     */
    static addLevel(id, level) {
        con.query(`UPDATE levelSystem SET level = ${Number(level)} + level WHERE id = "${id}"`);
    };

    /**
     * Adds to the current experience pool of the user a specified amount
     * @param {number} id - ID of the user's Discord account
     * @param {number} experience - The amount of experience points that will be added
     */
    static addExperience(id, experience) {
        con.query(`UPDATE levelSystem SET experience = ${Number(experience)} + experience WHERE id = "${id}"`);
    };

    /**
     * Removes a specified number of levels from the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} level - The amount of levels that will be removed
     */
    static removeLevel(id, level) {
        con.query(`UPDATE levelSystem SET level = level - ${Number(level)} WHERE id = "${id}"`);
    };

    /**
     * Removes a specified amount of experience points from the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} experience - The amount of experience points that will be removed
     */
    static removeExperience(id, experience) {
        con.query(`UPDATE levelSystem SET experience = experience - ${Number(experience)} WHERE id = "${id}"`);
    };

    /**
     * Returns the amount of money the user has
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async balance(id) {
        let x = await con.query(`SELECT * FROM bank WHERE id = "${id}"`);
        return await x[0].money;
    };

    /**
     * Sets the balance of a user
     * @param {number} id - ID of the user's Discord account
     * @param {number} sum - The amount of money that will be set
     */
    static setMoney(id, sum) {
        con.query(`UPDATE bank SET money = ${Number(sum)} WHERE id = "${id}"`);
    };

    /**
     * Adds to the current balance of the user a specified amount
     * @param {number} id - ID of the user's Discord account
     * @param {number} sum - The amount of money that will be added to the balance
     */
    static addMoney(id, sum) {
        con.query(`UPDATE bank SET money = ${Number(sum)} + money WHERE id = "${id}"`);
    };

    /**
     * Removes a specified amount of money from the user's balance
     * @param {number} id - ID of the user's Discord account
     * @param {number} sum - The amount of money that will be removed from the balance
     */
    static removeMoney(id, sum) {
        con.query(`UPDATE bank SET money = money - ${Number(sum)} WHERE id = "${id}"`);
    };

    /**
     * Returns the amount of messages the user has sent since joining the server (Only after the bot has joined the server)
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getMessages(id) {
        let x = await con.query(`SELECT * FROM stats WHERE id = "${id}"`);
        return await x[0].messages;
    };

    /**
     * Returns the amount of warnings the user has
     * @param {number} id - ID of the user's Discord account
     * @returns {number}
     */
    static async getWarnings(id) {
        let x = await con.query(`SELECT * FROM stats WHERE id = "${id}"`);
        return await x[0].warnings;
    };

    /**
     * Sets the number of messages a user has sent (has nothing to do with the real amount of messages the user has sent)
     * @param {number} id - ID of the user's Discord account
     * @param {number} messages - The amount of messages the will be set
     */
    static setMessages(id, messages) {
        con.query(`UPDATE stats SET messages = ${Number(messages)} WHERE id = "${id}"`);
    };

    /**
     * Sets a user's number of warnings
     * @param {number} id - ID of the user's Discord account
     * @param {number} warnings - The number of warnings that will be set
     */
    static setWarnings(id, warnings) {
        con.query(`UPDATE stats SET warnings = ${Number(warnings)} WHERE id = "${id}"`);
    };

    /**
     * Adds messages to a user (has nothing to do with the real amount of messages the user has sent)
     * @param {number} id - ID of the user's Discord account
     * @param {number} messages - The amount of messages that will be added (Default: 1)
     */
    static addMessages(id, messages = 1) {
        con.query(`UPDATE stats SET messages = ${Number(messages)} + messages WHERE id = "${id}"`);
    };

    /**
     * Adds a specified amount of warnings to the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} warnings - The number of warnings to add (Default: 1)
     */
    static addWarnings(id, warnings = 1) {
        con.query(`UPDATE stats SET warnings = ${Number(warnings)} + warnings WHERE id = "${id}"`);
    };

    /**
     * Reduces the number of messages the user has sent (has nothing to do with the real amount of messages the user has sent)
     * @param {number} id - ID of the user's Discord account
     * @param {number} messages - The amount of messages that will be reduced (Default: 1)
     */
    static removeMessages(id, messages = 1) {
        con.query(`UPDATE stats SET messages = messages - ${Number(messages)} WHERE id = "${id}"`);
    };

    /**
     * Removes a specified of warnings from the user
     * @param {number} id - ID of the user's Discord account
     * @param {number} warnings - The number of warnings to be removed (Default: 1)
     */
    static removeWarnings(id, warnings = 1) {
        con.query(`UPDATE stats SET warnings = warnings - ${Number(warnings)} WHERE id = "${id}"`);
    };

    /**
     * Returns the top 100 entries in the databse depending on the choice
     * @param {string} choice [level|messages|bank] - The choice of which top will be requested
     * @returns {object}
     */
    static async topHundred(choice) {
        switch(choice) {
            case 'bank': {
                let x = await con.query(`SELECT * FROM bank ORDER BY money DESC LIMIT 100;`);
                return await x;
            }
            case 'messages': {
                let x = await con.query(`SELECT * FROM stats ORDER BY messages DESC LIMIT 100;`);
                return await x;
            }
            case 'level':
            default: {
                let x = await con.query(`SELECT * FROM levelSystem ORDER BY level DESC, experience DESC LIMIT 100;`);
                return await x;
            }
        }
    };

    static async shopItems() {
        let x = await con.query(`SELECT * FROM shop ORDER BY id;`);
        return await x;
    }

    static async item(item_id) {
        let x = await con.query(`SELECT * FROM shop WHERE id = "${item_id}"`);
        return await x[0];
    }

    static async getInventory(id) {
        let x = await con.query(`SELECT * FROM inventory WHERE id = "${id}"`);
        return await x[0];
    }

    static async updateInventory(id, items, history) {
        con.query(`UPDATE inventory SET items_owned = ${items}, items_history = ${history} WHERE id = "${id}"`);
    }

    static addStock(id, quantity) {
        con.query(`UPDATE shop SET quantity = quantity + ${quantity} WHERE id = "${id}"`);
    }

    static removeStock(id, quantity) {
        con.query(`UPDATE shop SET quantity = quantity - ${quantity} WHERE id = "${id}"`);
    }
}