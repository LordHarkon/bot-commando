const { Command } = require('discord.js-commando');
const { getWarnings, addWarnings } = require('../../util/db');
const { MessageEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'mod',
            memberName: 'warn',
            guildOnly: true,
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
            description: 'Issue a warning to a user.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would like to warn?',
                    type: 'user'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the warn?',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Moderator' || x.name === 'Admin' || x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    async run(msg, { user, reason }) {
        const wa = await getWarnings(user.id);

        const modlog = this.client.channels.find(x => x.name === process.env.MODLOG);

        if(!modlog) {
            await msg.guild.createChannel(process.env.MODLOG, 'text');
        }

        addWarnings(user.id);

        const log = new MessageEmbed()
            .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({size: 2048}))
            .setColor(0x800080)
            .setDescription(`**Action:** Warning\n**Target:** ${user.tag} (${user.id})\n**Current Warnings:** ${wa + 1}\n**Reason:** ${reason}`)
            .setTimestamp()
        
        await modlog.send(log);
    }
}