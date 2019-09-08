const { Command } = require('discord.js-commando');
const { GUILDID } = process.env;

module.exports = class NotifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'notify',
            group: 'util',
            memberName: 'notify',
            aliases: [],
            description: 'Gives/Removes you the role `Notify Me Sempai`. The role will tell you when there\'s a new chapter.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'string',
                    prompt: 'What would like to do? (Give, Remove)',
                    key: 'choice',
                    oneOf: ['give', 'add', 'receive', 'remove', 'del', 'delete', 'take'],
                    parse: str => str.toLowerCase()
                }
            ]
        });
    }

    run(msg, { choice }) {
        let role = this.client.guilds.get(GUILDID).roles.find(role => role.name === 'Notify Me Sempai');
        switch (choice) {
            case 'remove':
            case 'del':
            case 'delete':
            case 'take': {
                this.client.guilds.get(GUILDID).members.get(msg.author.id).roles.remove(role);
                return msg.say(`Successfully took \`Notify Me Sempai\` from **${msg.author.tag}**.`);
            }
            case 'give':
            case 'add':
            case 'receive':
            default: {
                this.client.guilds.get(GUILDID).members.get(msg.author.id).roles.add(role);
                return msg.say(`Successfully added \`Notify Me Sempai\` to **${msg.author.tag}**.`);
            }
        }
        
    }
}