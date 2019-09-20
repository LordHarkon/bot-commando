const { Command } = require('discord.js-commando');

module.exports = class removeRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'removerole',
            aliases: ['remove-role', 'rrole'],
            group: 'mod',
            memberName: 'removerole',
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            description: 'Removes a role from a user.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to remove the role from?',
                    key: 'user',
                    default: msg => msg.author
                },
                {
                    type: 'role',
                    prompt: 'Which role would you like to remove?',
                    key: 'role'
                }
            ]
        })
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Admin' || x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    run(msg, { user, role }) {
        this.client.guilds.get(process.env.GUILDID).members.get(user.id).roles.remove(role)
        msg.say(`Successfully took away the role ${role} from ${user}.`);
    }
}