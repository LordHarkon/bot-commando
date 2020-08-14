const { Command } = require('discord.js-commando');
const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

module.exports = class RPSLSCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rpsls',
            group: 'games',
            memberName: 'rpsls',
            description: 'Play Rock-Paper-Scissors-Lizard-Spock.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'choice',
                    prompt: 'What will you use? Rock, Paper, Scissors, Lizard or Spock?',
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
			if (response === 'paper') return msg.reply('Paper! Paper covers Rock! I win!');
			if (response === 'scissors') return msg.reply('Scissors! Rock crushes Scissors, I lose...');
			if (response === 'lizard') return msg.reply('Lizard! Rock crushes Lizard, I lose...');
			if (response === 'spock') return msg.reply('Spock! Spock vaporizes Rock! I win!');
		}
		if (choice === 'paper') {
			if (response === 'rock') return msg.reply('Rock! Paper covers Rock, I lose...');
			if (response === 'paper') return msg.reply('Paper! Aw... A tie...');
			if (response === 'scissors') return msg.reply('Scissors! Scissors cuts Paper! I win!');
			if (response === 'lizard') return msg.reply('Lizard! Lizard eats Paper! I win!');
			if (response === 'spock') return msg.reply('Spock! Paper disproves Spock, I lose...');
		}
		if (choice === 'scissors') {
			if (response === 'rock') return msg.reply('Rock! Rock crushes Scissors! I win!');
			if (response === 'paper') return msg.reply('Paper! Scissors cut Paper, I lose...');
			if (response === 'scissors') return msg.reply('Scissors! Aw... A tie...');
			if (response === 'lizard') return msg.reply('Lizard! Scissors decapitates Lizard, I lose...');
			if (response === 'spock') return msg.reply('Spock! Spock smashes Scissors! I win!');
		}
                if (choice === 'lizard') {
			if (response === 'rock') return msg.reply('Rock! Rock crushes Lizard! I win!');
			if (response === 'paper') return msg.reply('Paper! Lizard eats Paper, I lose...');
			if (response === 'scissors') return msg.reply('Scissors! Scissors decapitates Lizard! I win!');
			if (response === 'lizard') return msg.reply('Lizard! Aw... A tie...');
			if (response === 'spock') return msg.reply('Spock! Lizard poisons Spock, I lose...');
		}
                if (choice === 'spock') {
			if (response === 'rock') return msg.reply('Rock! Spock vaporizes Rock, I lose...');
			if (response === 'paper') return msg.reply('Paper! Paper disproves Spock! I win!');
			if (response === 'scissors') return msg.reply('Scissors! Spock smashes Scissors, I lose...');
			if (response === 'lizard') return msg.reply('Lizard! Lizard poisons Spock! I win!');
			if (response === 'spock') return msg.reply('Spock! Aw... A tie...');
		}
    }
}
