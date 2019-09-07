const { Command } = require('discord.js-commando');
const { getWarnings, setWarnings } = require('../../util/database');
const { LOGS } = process.env;
const { MessageEmbed } = require('discord.js');

module.exports = class RWCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove-warning',
            group: 'mod',
            memberName: 'remove-warning',
            aliases: ['rw'],
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
            autoAliases: true,
            guildOnly: true,
            description: 'Removes a specified number of warnings from a user.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'From which user would like to remove the warnings?',
                    type: 'user'
                },
                {
                    key: 'number',
                    prompt: 'How many warnings would like to remove?',
                    type: 'integer'
                }
            ]
        });
    }

    async run(msg, { user, number }) {
        const wa = getWarnings(user.id);

        const logs = msg.guild.channels.find(x => x.name === LOGS);

        if(!logs) {
            await msg.guild.createChannel(LOGS, 'text');
        };

        let curr = wa.warnings;

        wa.warnings = wa.warnings - number;

        if(wa.warnings < 0) wa.warnings = 0;

        setWarnings(wa);

        const log = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({size: 2048}))
            .setColor(0xFF00FF)
            .setDescription(`<@${msg.author.id}> removed ${curr} warning(s) from <@${user.id}>\n\n`)
            .setTimestamp();

        logs.send(log);
    }
}