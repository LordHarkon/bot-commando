const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'util',
            memberName: 'say',
            aliases: [],
            description: 'Make the bot say something.',
            args: [
                {
                    type: 'string',
                    prompt: 'What do you want the bot to say?',
                    key: 'input',
                    infinite: false
                }
            ],
            throttling: {
                usages: 1,
                duration: 60
            }
        });
    }

    async run(msg, { input }) {
        await msg.say(input);
    }
}