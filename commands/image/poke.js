const { Command } = require('discord.js-commando');
const { get } = require('superagent');
const { MessageAttachment } = require('discord.js');

module.exports = class PokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poke',
            group: 'image',
            memberName: 'poke',
            aliases: ['boop'],
            description: 'Poke a user of your choice.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to poke?',
                    key: 'user'
                }
            ]
        });
    }

    async run(msg, { user }) {
        let { body } = await get('https://nekos.life/api/v2/img/poke');
        const attachment = new MessageAttachment(body.url);

        msg.say(`<@${msg.author.id}> pokes <@${user.id}>. **BOOP** :3`, attachment);
    }
}