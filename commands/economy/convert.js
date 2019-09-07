const { Command } = require('discord.js-commando');
const { balance, removeMoney } = require('../../util/bank');
const { addExperience } = require('../../util/level');

module.exports = class ConvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'convert',
            group: 'economy',
            memberName: 'convert',
            description: 'Convert your money into experience. Current Ratio: 10 Fens = 1 XP.',
            args: [
                {
                    type: 'integer',
                    prompt: 'How many Fens would like to convert into experience points?',
                    key: 'fens',
                    validate: (fens, msg) => {
                        if(fens > balance(msg.author.id)) return `You do not have enough money to proceed. Please try again with a new sum.`;
                        if(fens < 10) return `You cannot convert less than 10 Fens. Please try again with a new sum.`;
                        return true;
                    }
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    run(msg, { fens }) {
        addExperience(msg.author.id, Math.round(Number(fens, 10) / 10));
        removeMoney(msg.author.id, Number(fens));

        msg.say(`${msg.author.username} has converted ${fens} Fens into ${Math.round(fens/10)} experience points.`);
    }
}