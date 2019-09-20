const { Command } = require('discord.js-commando');

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

    async run(msg) {
        await msg.say('Closing...').then(x => x.delete(500));
        process.exit();
    }
}