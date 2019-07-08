const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class addRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addrole',
            aliases: ['add-role', 'arole'],
            group: 'mod',
            memberName: 'addrole',
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            description: 'Adds a role to a user.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to add the role to?',
                    key: 'user',
                    default: msg => msg.author
                },
                {
                    type: 'role',
                    prompt: 'Which role would you like to add?',
                    key: 'role'
                }
            ]
        })
    }

    run(msg, { user, role }) {
        msg.guild.member(user).addRole(role)
        msg.say(`Successfully added ${role} to ${user}.`);
    }
}