const { Command } = require('discord.js-commando');
const { findEmoji } = require('../../util/Util');
const { evaluate } = require('mathjs');

module.exports = class CalcCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'calc',
            group: 'response',
            memberName: 'calc',
            aliases: ['calculate'],
            description: 'Returns the result of a given math problem.',
            patterns: [/[0-9-+/^%*()sqrtsincotan ]+=/i]
        });
    }

    async run(msg) {
        msg.say(`\`${msg.patternMatches}${evaluate(msg.patternMatches[0].replace('=',''))}\``);
    }
}