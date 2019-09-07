const { Command } = require('discord.js-commando');
const { get } = require('superagent');
const { MessageAttachment } = require('discord.js');

module.exports = class SlapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slap',
            group: 'image',
            memberName: 'slap',
            aliases: [],
            description: 'Slap a user of your choice.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would you like to slap?',
                    key: 'user'
                }
            ]
        });
    }

    async run(msg, { user }) {
        let { body } = await get('https://nekos.life/api/v2/img/slap');
        const attachment = new MessageAttachment(body.url);

        msg.say(`<@${msg.author.id}> slaps <@${user.id}>! **BAM!** `, attachment);
    }
}