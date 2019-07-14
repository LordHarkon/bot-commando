const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const db = require('../../util/database.js');
const { percentage } = require('../../util/Util');

module.exports = class commandName extends Command {
    constructor(client) {
        super(client, {
            name: 'level',
            memberName: 'level',
            aliases: ['lv', 'lvl'],
            group: 'info',
            description: 'Shows your current amount of experience and level.',
            guildOnly: true,
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

    run(msg, { user }) {
        var score = db.getLevel(user.id);

        var Level       = score.level;
        var Experience  = score.experience;
        var nextLevelXP = score.nextLevelXP;

        msg.say({embed: {
            color: parseInt(user.id.substr(12,user.id.length)),
            description: `Level: **__${Level}__**\nExperience: **__${Experience} / ${nextLevelXP} (${percentage(Experience,nextLevelXP)} %)__**`,
            timestamp: new Date(),
            author: {
                name: user.username,
                icon_url: user.displayAvatarURL()
            }
        }})
    }
}