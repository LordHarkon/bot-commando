const { Command } = require('discord.js-commando');

module.exports = class EventCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'event',
            group: 'util',
            memberName: 'event',
            aliases: [],
            description: 'Start, create or end events.',
            throttling: {
                usages: 1,
                duration: 2
            }
        });
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Bird Admins' || x.name === 'Einlion') || this.client.isOwner(msg.author.id);
    }

    run(msg) {
        
    }
}