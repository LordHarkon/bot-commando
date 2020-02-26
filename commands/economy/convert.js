const { Command } = require('discord.js-commando');
const { addExperience, balance, removeMoney } = require('../../util/db');

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
                    validate: async (fens, msg) => {
                        let bal = await balance(msg.author.id);
                        if(fens > bal) return `You do not have enough money to proceed. Please try again with a new sum.`;
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
        addExperience(msg.author.id, Math.round(parseInt(fens) / 10));
        removeMoney(msg.author.id, parseInt(fens));

        msg.say(`${msg.author.username} has converted ${fens} Fens into ${Math.round(fens/10)} experience points.`);
    }
}