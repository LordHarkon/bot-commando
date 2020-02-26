const { Command } = require('discord.js-commando');
const { addLevel, removeLevel } = require('../../util/db');
const { formatNumber } = require('../../util/Util');

module.exports = class CheatLevelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cl',
            group: 'owner',
            memberName: 'cl',
            aliases: ['cheatlvl', 'cheatlevel', 'freelv'],
            description: 'Cheat Levels.',
            throttling: {
                usages: 1,
                duration: 2
            },
            guildOnly: true,
            ownerOnly: true,
            args: [
                {
                    key: 'levels',
                    prompt: 'How many levels do you wish to give/take?',
                    type: 'integer'
                },
                {
                    key: 'user',
                    prompt: 'To/From which user do you wish to give/take the levels?',
                    type: 'user',
                    default: msg => msg.author
                }
            ]
        });
    }

    run(msg, { levels, user }) {
        msg.say('Done.');

        if(levels > 0) {
            addLevel(user.id, parseInt(levels));
            return msg.direct(`${formatNumber(levels)} ${levels == 1 ? 'level has' : 'levels have'} been given to ${user.username}.`);
        } else {
            removeLevel(user.id, parseInt(levels * -1));
            return msg.direct(`${formatNumber(levels * -1)} ${levels == -1 ? 'level has' : 'levels have'} been taken from ${user.username}.`);
        }
    }
}