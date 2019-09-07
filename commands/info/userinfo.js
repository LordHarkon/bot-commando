const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            group: 'info',
            memberName: 'userinfo',
            aliases: ['ui'],
            description: 'Show a detailed screen about a user.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user\'s info would you like to see?',
                    key: 'user'
                }
            ]
        });
    }

    run(msg, { user }) {
        let embed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({size: 2048}))
            .setTitle('User Information')
            .setURL(user.displayAvatarURL({size: 2048}))
            .setColor(0xFFFFFF)
            // .setImage(user.displayAvatarURL({size: 2048}))
            .setThumbnail(user.displayAvatarURL({size: 2048}))
            
            .addField('Created At', user.createdAt, true)
            .addField('Bot', user.bot, true)
            .addField('Discriminator', user.discriminator, true)
            .addField('ID', user.id, true)
            .addField('Tag', user.tag, true)
            .addField('Username', user.username, true)
            .addField('Nickname', msg.guild.member(user).displayName, true)
            .addField('Last Message ID', user.lastMessageID, true)
            .addField('Last Message', user.lastMessage, true)

            .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL({size: 2048}))
            .setTimestamp()
        
        msg.say(embed);
    }
}