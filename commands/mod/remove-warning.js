const { Command } = require('discord.js-commando');
const { getWarnings, removeWarnings, setWarnings } = require('../../util/db');
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
                    key: 'warns',
                    prompt: 'How many warnings would like to remove?',
                    type: 'integer'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Moderator' || x.name === 'Admin' || x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    async run(msg, { user, warns }) {
        const logs = msg.guild.channels.find(x => x.name === process.env.LOGS);

        if(!logs) {
            await msg.guild.createChannel(process.env.LOGS, 'text');
        };

        removeWarnings(user.id, warns);
        setWarnings(user.id, 0);

        const log = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({size: 2048}))
            .setColor(0xFF00FF)
            .setDescription(`<@${msg.author.id}> removed ${warns} warning(s) from <@${user.id}>\n\n`)
            .setTimestamp();

        logs.send(log);
    }
}