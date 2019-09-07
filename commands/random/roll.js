const { Command } = require('discord.js-commando');
const { randomRange } = require('../../util/Util');

module.exports = class RollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            aliases: [],
            description: 'Roll a random number between 1 and 100.',
            throttling: {
                usages: 1,
                duration: 2
            }
        });
    }

    run(msg, { dice }) {
        let number = randomRange(1, 100);

        msg.reply(`rolled a ${number}`);
    }
}