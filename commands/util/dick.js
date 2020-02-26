const {Command} = require('discord.js-commando');
const {MersenneTwister19937, integer} = require('random-js');

module.exports = class DickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dick',
            autoAliases: true,
            group: 'util',
            memberName: 'dick',
            aliases: ['dick-size', 'penis', 'penis-size', 'pee-pee', 'pee-pee-size', 'cock', 'cock-size'],
            description: 'Determines your dick size.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to determine the dick size of?',
                    type: 'user',
                    default: (msg) => msg.author
                }
            ]
        });
    }

    async run(msg, {user}) {
        const random = MersenneTwister19937.seed(user.id);
        const length = integer(0, 200)(random);
        return msg.reply(`8${'='.repeat(length)}D`);
    }
};