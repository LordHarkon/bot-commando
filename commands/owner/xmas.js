const { Command } = require('discord.js-commando');

module.exports = class XMasCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'xmas',
            group: 'owner',
            memberName: 'xmas',
            aliases: [],
            ownerOnly: true,
            guildOnly: true,
            description: 'Send a Holiday message to every user on the server.',
            args: [
                {
                    type: 'string',
                    prompt: 'What would you like to wish to the people on the server?',
                    key: 'wish',
                    infinite: false
                }
            ]
        });
    }

    async run(msg, { wish }) {
        let users = (await this.client.guilds.get(msg.guild.id).fetch()).members;
        for(let user of users) {
            this.client.users.get(user[0]).send(wish);
        }
    }
}