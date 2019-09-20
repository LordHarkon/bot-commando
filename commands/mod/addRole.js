const { Command } = require('discord.js-commando');

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

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Admin' || x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    run(msg, { user, role }) {
        this.client.guilds.get(process.env.GUILDID).members.get(user.id).roles.add(role)
        msg.say(`Successfully added ${role} to ${user}.`);
    }
}