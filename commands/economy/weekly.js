const { Command } = require('discord.js-commando');
const { getLevel, addMoney } = require('../../util/db');
const { randomRange } = require('../../util/Util');

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weekly',
            group: 'economy',
            memberName: 'weekly',
            aliases: [],
            description: 'Random amount of weekly paycheck.',
            details: 'A random amount of Fens will be given to you, based on your level and other factors.',
            throttling: {
                usages: 1,
                duration: 604800
            }
        });
    }

    async run(msg) {
        const level = await getLevel(msg.author.id);

        const weekly = (randomRange(10, 150) + Math.round(msg.author.id / Math.pow(10, 16)) + (100 * level)) * 7;

        addMoney(msg.author.id, weekly);

        msg.say(`${msg.author.tag} received his weekly paycheck of ${weekly} Fens.`);
    }
}