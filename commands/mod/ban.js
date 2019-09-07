const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class banCommand extends Command {
    constructor(client) {
        super(client, {
            name:"ban",
            group: 'mod',
            memberName: 'ban',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            description: 'Bans a user.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to ban?",
                    key:"user",
                }
            ]
        })
    }
    run(msg, { user }) {
        
        if (msg.guild.member(user).hasPermission('ADMINISTRATOR')) return msg.reply('I can not ban this user, he has higher permission than I do.');
        // if (!msg.guild.me.hasPermission('BAN_MEMBERS')) return msg.reply('I need the permission `BAN_MEMBERS` for this to work.');
        
        msg.guild.member(user).ban();
        msg.say(`Successfully banned ${user}.`);
    }
}