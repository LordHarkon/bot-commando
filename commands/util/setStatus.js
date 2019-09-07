const { Command } = require('discord.js-commando');

module.exports = class SetStatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setstatus',
            group: 'util',
            memberName: 'setstatus',
            aliases: ['set-status'],
            description: 'Set the status of the bot.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'string',
                    prompt: 'What is the status of the bot the you wish to set? Available: Online, Idle, DND, Invisible.',
                    key: 'status',
                    parse: status => status.toLowerCase(),
                    oneOf: ['online', 'idle', 'dnd', 'invisible']
                }
            ]
        });
    }

    run(msg, { status }) {
        this.client.user.setStatus(status);
        
        let sts = {
            "online": "Online",
            "idle": "Away",
            "dnd": "Do Not Disturb",
            "invisible": "Offline"
        }

        return msg.say('Status set to: ' + sts[status]);
    }
}