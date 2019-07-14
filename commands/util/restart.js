const { Command } = require('discord.js-commando');
const { closeDatabase } = require('../../util/better-sqlite3');

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
        await closeDatabase();
        process.exit();
    }
}