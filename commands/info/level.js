const { Command } = require('discord.js-commando');
const { getLevel, getExperience, getNextLevelXP } = require('../../util/db');
const { percentage, formatNumber } = require('../../util/Util');

module.exports = class LevelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'level',
            memberName: 'level',
            aliases: ['lv', 'lvl'],
            group: 'info',
            description: 'Shows your current amount of experience and level.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to see the information of?',
                    key: 'user',
                    default: msg => msg.author
                }
            ]
        })
    }

    async run(msg, { user }) {
        var Level       = await getLevel(user.id);
        var Experience  = await getExperience(user.id);
        var nextLevelXP = await getNextLevelXP(user.id);

        msg.say({embed: {
            color: parseInt(user.id.substr(12,user.id.length)),
            description: `Level: **__${formatNumber(Level)}__**\nExperience: **__${formatNumber(Experience)} / ${formatNumber(nextLevelXP)} (${percentage(Experience,nextLevelXP)} %)__**`,
            timestamp: new Date(),
            author: {
                name: user.username,
                icon_url: user.displayAvatarURL({size: 2048})
            }
        }})
    }
}