const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'util',
            memberName: 'invite',
            description: 'Responds with the server\'s invite link.',
            guarded: true,
            throttling: {
                usages: 1,
                duration: 2
            }
        });
    }

    run(msg) {
        return msg.say(stripIndents`
        The Server invite is:
        <${process.env.INVITELINK}>
        `);
    }
}