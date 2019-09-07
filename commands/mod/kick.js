const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class kickCommand extends Command {
    constructor(client) {
        super(client, {
            name:"kick",
            group: 'mod',
            memberName: 'kick',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            description: 'Kicks a user.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to kick?",
                    key:"user",
                }
            ]
        })
    }
    run(msg, { user }) {
        
        if (msg.guild.member(user).hasPermission('ADMINISTRATOR')) return msg.reply('I can not kick this user, he has higher permission than I do.');
        // if (!msg.guild.me.hasPermission('KICK_MEMBERS')) return msg.reply('I need the permission `KICK_MEMBERS` for this to work.');
        
        msg.guild.member(user).kick();
        msg.say(`Successfully kicked ${user}.`);
    }
}