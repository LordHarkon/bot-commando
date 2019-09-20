const { Command } = require('discord.js-commando');
const { addMoney, removeMoney } = require('../../util/db');
const { formatNumber } = require('../../util/Util');

module.exports = class CheatFensCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cf',
            group: 'owner',
            memberName: 'cf',
            aliases: ['cheatfens', 'cheatmoney', 'freefens', 'ownergib'],
            description: 'Cheat Fens.',
            throttling: {
                usages: 1,
                duration: 2
            },
            guildOnly: true,
            ownerOnly: true,
            args: [
                {
                    key: 'sum',
                    prompt: 'What is the sum that you wish to give/take?',
                    type: 'integer'
                },
                {
                    key: 'user',
                    prompt: 'To/From which user do you wish to give/take the Fens?',
                    type: 'user'
                }
            ]
        });
    }

    run(msg, { sum, user }) {
        msg.say('Done.');

        if(sum > 0) {
            addMoney(user.id, Number(sum));
            return msg.direct(`${formatNumber(sum)} ${sum == 1 ? 'Fen has' : 'Fens have'} been deposited into ${user.username}'s account.`);
        } else {
            removeMoney(user.id, Number(sum * -1));
            return msg.direct(`${formatNumber(sum * -1)} ${sum == -1 ? 'Fen has' : 'Fens have'} been retracted from ${user.username}'s account.`);
        }
    }
}