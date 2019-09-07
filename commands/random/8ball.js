const { Command } = require('discord.js-commando');
const answers = require('../../assets/json/8ball');

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            aliases: ['8b', 'eight-ball', 'magic-eight-ball'],
            autoAliases: true,
            group: 'random',
            memberName: '8ball',
            description: 'Ask the magic 8 Ball a question.',
            args: [
                {
                    type: 'string',
                    prompt: 'What is your question for the 8 Ball ?',
                    key: 'question',
                    max: 1900
                }
            ]
        });
    }

    run(msg, { question }) {
        msg.say(`${question}\n🎱 ${answers[Math.floor(Math.random() * answers.length)]}`);
    }
}