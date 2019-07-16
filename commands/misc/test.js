const { Command } = require('discord.js-commando');
const { getLevel, setLevel } = require('../../util/database.js');

module.exports = class testCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'misc',
            memberName: 'test',
            description: 'test',
            throttling: {
                usages: 1,
                duration: 3600
            }
        })
    }

    run(msg) {
        const lvl = getLevel(msg.author.id);
        msg.say(`Lvl: ${lvl.level}\nExp: ${lvl.experience}`);
        lvl.experience += 1;
        setLevel(lvl);
    }
}