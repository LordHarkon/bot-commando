const { Command } = require('discord.js-commando');
const choices = ['rock', 'paper', 'scissors'];

module.exports = class RockPaperScissorsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rps',
            group: 'games',
            memberName: 'rps',
            aliases: ['rock-paper-scissors'],
            description: 'Play Rock-Paper-Scissors.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'choice',
                    prompt: 'What will you use? Rock, Paper or Scissors?',
                    type: 'string',
                    validate: choice => {
                        if(choices.includes(choice)) return true;
                        return `Your choice is not valid. Please try again.`;
                    },
                    parse: choice => choice.toLowerCase()
                }
            ]
        });
    }

    run(msg, { choice }) {
        const response = choices[Math.floor(Math.random() * choices.length)];
		if (choice === 'rock') {
			if (response === 'rock') return msg.reply('Rock! Aw... A tie...');
			if (response === 'paper') return msg.reply('Paper! Yes! I win!');
			if (response === 'scissors') return msg.reply('Scissors! Aw... I lose...');
		}
		if (choice === 'paper') {
			if (response === 'rock') return msg.reply('Rock! Aw... I lose...');
			if (response === 'paper') return msg.reply('Paper! Aw... A tie...');
			if (response === 'scissors') return msg.reply('Scissors! Yes! I win!');
		}
		if (choice === 'scissors') {
			if (response === 'rock') return msg.reply('Rock! Yes! I win!');
			if (response === 'paper') return msg.reply('Paper! Aw... I lose...');
			if (response === 'scissors') return msg.reply('Scissors! Aw... A tie...');
		}
    }
}