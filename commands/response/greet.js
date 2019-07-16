const { Command } = require('discord.js-commando');
const { findEmoji } = require('../../util/Util');

module.exports = class GreetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'greet',
            group: 'response',
            memberName: 'greet',
            aliases: ['greetings', 'salute', 'hey'],
            description: 'Returns a greeting.',
            patterns: [/\b[hH][eE3][lL][lL][oO0]\b/i, /[gG][oO0][oO0][dD] [mM][oO0][rR][nN][iI1][nN][gG]/i, /[gG][oO0][oO0][dD] [aA@][fF][tT7][eE3][rR][nN][oO0][oO0][nN]/i, /[gG][oO0][oO0][dD] [eE3][vV][eE3][nN][iI1][nN][gG]/i]
        });
    }

    async run(msg) {
        const wave = findEmoji(this.client, 'waveHand');
        if(msg.patternMatches == undefined) {
            msg.reply(`Hi there! ${wave}`);
        } else {
            await msg.react(wave);
        }
    }
}