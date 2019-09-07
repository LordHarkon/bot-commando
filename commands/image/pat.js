const { Command } = require('discord.js-commando');
const { get } = require('superagent');
const { MessageAttachment } = require('discord.js');

module.exports = class PatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pat',
            group: 'image',
            memberName: 'pat',
            aliases: ['patting'],
            description: 'Pat a user of your choice.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to pat?',
                    key: 'user'
                }
            ]
        });
    }

    async run(msg, { user }) {
        let { body } = await get('https://nekos.life/api/v2/img/pat');
        const attachment = new MessageAttachment(body.url);

        msg.say(`<@${msg.author.id}> pats <@${user.id}>. (^^;)`, attachment);
    }
}