const { Command } = require('discord.js-commando');
const { addExperience, removeExperience } = require('../../util/db');
const { formatNumber } = require('../../util/Util');

module.exports = class CheatExperienceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ce',
            group: 'owner',
            memberName: 'ce',
            aliases: ['cheatexp', 'cheatexperience', 'freexp'],
            description: 'Cheat Experience.',
            throttling: {
                usages: 1,
                duration: 2
            },
            guildOnly: true,
            ownerOnly: true,
            args: [
                {
                    key: 'xp',
                    prompt: 'How much experience do you wish to give/take?',
                    type: 'integer'
                },
                {
                    key: 'user',
                    prompt: 'To/From which user do you wish to give/take the experience?',
                    type: 'user'
                }
            ]
        });
    }

    run(msg, { xp, user }) {
        msg.say('Done.');

        if(xp > 0) {
            addExperience(user.id, Number(xp));
            return msg.direct(`${formatNumber(xp)} experience have been given to ${user.username}.`);
        } else {
            removeExperience(user.id, Number(xp * -1));
            return msg.direct(`${formatNumber(xp * -1)} experience have been taken from ${user.username}.`);
        }
    }
}