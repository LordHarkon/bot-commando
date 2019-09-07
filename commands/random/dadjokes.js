const { Command } = require('discord.js-commando');
const { get } = require('superagent');
const { MessageEmbed } = require('discord.js');

module.exports = class DadJokesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dadjokes',
            group: 'random',
            memberName: 'dadjokes',
            aliases: ['dj', 'dadjoke', 'dad-jokes', 'dad-joke'],
            description: 'Sends a random dad joke.',
            throttling: {
                usages: 1,
                duration: 2
            }
        });
    }

    async run(msg) {
        let { body } = await get(`https://icanhazdadjoke.com/slack`);

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setDescription(`**${body.attachments.map(a => a.text)}**`)
        
        msg.say(embed);
    }
}