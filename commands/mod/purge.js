const { Command } = require('discord.js-commando');

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'mod',
            memberName: 'purge',
            aliases: [],
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_MESSAGES'],
            description: 'Clears a specified number of messages, between 1 and 100.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'integer',
                    prompt: 'How many messages would like to delete?',
                    key: 'messages',
                    validate: messages => {
                        if(messages < 101) return true;
                        if(messages > 0) return true;
                        return `Please specify a number between 1 and 100.`
                    }
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Admin' || x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    async run(msg, { messages }) {
        msg.channel.bulkDelete(messages)
            .catch(err => msg.reply(`Error: ${err}`));
    }
}