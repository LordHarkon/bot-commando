const { Command } = require('discord.js-commando');
const { addMoney } = require('../../util/bank');
const { getLevel } = require('../../util/level');
const { randomRange } = require('../../util/Util');

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            group: 'economy',
            memberName: 'daily',
            aliases: [],
            description: 'Random amount of daily paycheck.',
            details: 'A random amount of Fens will be given to you, based on your level and other factors.',
            throttling: {
                usages: 1,
                duration: 86400
            }
        });
    }

    run(msg) {
        const level = getLevel(msg.author.id);

        const daily = randomRange(10, 150) + Math.round(msg.author.id / Math.pow(10, 16)) + (100 * level);

        addMoney(msg.author.id, daily);

        msg.say(`${msg.author.tag} received his daily paycheck of ${daily} Fens.`);
    }
}