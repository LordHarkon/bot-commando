const { Command } = require('discord.js-commando');

String.prototype.allReplace = function(obj) {
    let retStr = this;
    for (const x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};

module.exports = class RunicCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'runic',
            group: 'util',
            memberName: 'runic',
            aliases: ['rune', 'runictl', 'runetl'],
            description: 'Translate normal messages into runic languange.',
            args: [
                {
                    type: 'string',
                    prompt: 'What is the message that you want to translate?',
                    key: 'input',
                    infinite: false
                }
            ]
        });
    }

    async run(msg, { input }) {
        const letters = {
            'a': "ᚨ",
            'b': "ᛒ",
            'c': "ᚲ",
            'd': "ᛞ",
            'e': "ᛖ",
            'f': "ᚠ",
            'g': "ᚷ",
            'h': "ᚺ",
            'i': "ᛁ",
            'j': "ᛃ",
            'k': "ᚴ",
            'l': "ᛚ",
            'm': "ᛗ",
            'n': "ᚾ",
            'o': "ᛟ",
            'p': "ᛈ",
            'q': "ᛩ",
            'r': "ᚱ",
            's': "ᛋ",
            't': "ᛏ",
            'u': "ᚢ",
            'v': "ᚡ",
            'w': "ᚹ",
            'x': "ᛪ",
            'y': "ᚤ",
            'z': "ᛉ"
        };

        await msg.say((input.toLowerCase()).allReplace(letters));
    }
}