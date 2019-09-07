const { Command } = require('discord.js-commando');
const { roll } = require('d20');

module.exports = class DTwentyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'd20',
            group: 'random',
            memberName: 'd20',
            aliases: ['d-twenty', 'd-20', 'dice'],
            description: 'Roll a dice. If no input, a d20 dice will be rolled. You can roll any kind of dice, from 4d6 to d100. You can also modifiers like +1 -2 +20 or something like that.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'string',
                    prompt: 'Please choose your type of dice. (Ex: "d20" "d100" "4d6")',
                    key: 'dice',
                    validate: dice => {
                        if(dice < 4) return `Dices cannot have less than 4 sides.`;
                    }
                }
            ]
        });
    }

    run(msg, { dice }) {
        let res = roll(dice);

        if(res <= 0) res = 1;

        msg.reply(`rolled a ${res}`);
    }
}