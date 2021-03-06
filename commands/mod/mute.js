const { Command } = require('discord.js-commando');
const { findRole, addRole, removeRole, findChannel } = require('../../util/Util');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'mod',
            memberName: 'mute',
            aliases: ['silence'],
            description: 'Mute a user for a specific amount of time',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would like to mute?',
                    type: 'user'
                },
                {
                    key: 'time',
                    prompt: 'For how long would like to mute the user? The maximum time is 21 Days.',
                    type: 'string'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason you wish to mute the user?',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Moderator' || x.name === 'Admin' || x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    run(msg, { user, time, reason }) {
        let mutedRole = findRole(this.client, 'Muted', process.env.GUILDID);
        let modlog = findChannel(this.client, process.env.MODLOG);

        if(!modlog) return msg.reply(`The channel ${process.env.MODLOG} does not exist. Please create it and try again.`);

        const log = new MessageEmbed()
            .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({size: 2048}))
            .setColor(0x800080)
            .setDescription(`**Action:** Muted\n**Target:** ${user.tag} (${user.id})\n**Reason:** ${reason}`)
            .setTimestamp()
        
        addRole(this.client, mutedRole, process.env.GUILDID, user.id);
        modlog.send(log);

        setTimeout(() => {
            removeRole(this.client, mutedRole, process.env.GUILDID, user.id);
            modlog.send(`${user.tag}'s mute has been lifted.`);
            user.send(`Your mute has been lifted.`);
        }, ms(time));
    }
}