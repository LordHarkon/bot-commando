const { Command } = require('discord.js-commando');
const { get } = require('superagent');
const { MessageAttachment } = require('discord.js');

module.exports = class CuddleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cuddle',
            group: 'image',
            memberName: 'cuddle',
            aliases: ['cuddling', 'hug', 'hugging'],
            description: 'Hug a user of your choice.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to cuddle?',
                    key: 'user'
                }
            ]
        });
    }

    async run(msg, { user }) {
        let { body } = await get('https://nekos.life/api/v2/img/cuddle');
        const attachment = new MessageAttachment(body.url);

        msg.say(`<@${msg.author.id}> hugs <@${user.id}>. ʕっ•ᴥ•ʔっ`, attachment);
    }
}