const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class commandName extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
			aliases: ['rr', 'reboot'],
			group: 'util',
			memberName: 'restart',
			description: 'Restarts the bot.',
			guarded: true,
			ownerOnly: true
        })
    }

    run(msg) {
        process.exit();
    }
}