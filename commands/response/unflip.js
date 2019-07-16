const { Command } = require('discord.js-commando');

module.exports = class UnflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unflip',
            group: 'response',
            memberName: 'unflip',
            description: 'Unflips a flipped table.',
            patterns: [/\(╯°□°）╯︵ ┻━┻/i]
        });
    }

    run(msg) {
        if(msg.author.bot) return;
        return msg.say('┬─┬ ノ( ゜-゜ノ)');
    }
}