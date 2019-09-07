const { Command } = require('discord.js-commando');
const { getWarnings } = require('../../util/database');
const { MessageEmbed } = require('discord.js');

module.exports = class WarningsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warnings',
            group: 'info',
            memberName: 'warnings',
            aliases: ['wa'],
            guildOnly: true,
            description: 'Check your or another user\'s warnings.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user\'s warnings would like to check?',
                    key: 'user',
                    default: msg => msg.author
                }
            ]
        });
    }

    run(msg, { user }) {
        const wa = getWarnings(user.id);

        const warn = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({size: 2048}))
            .setColor(0x000000)
            .setDescription(`<@${user.id}> has ${wa.warnings} warnings.`)
            .setTimestamp();

        msg.say(warn);
    }
}