const { Command } = require('discord.js-commando');
const { create } = require('../../util/db');

module.exports = class CuddleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createprofile',
            group: 'owner',
            memberName: 'createprofile',
            aliases: [],
            ownerOnly: true,
            description: 'Create a profile in the level system and bank for a bot.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'For which user would like to create the profile?',
                    key: 'user'
                }
            ]
        });
    }

    run(msg, { user }) {
        create(user.id);
        msg.say(`Profile for the user \`${user.tag}\` has been successfully created.`);
    }
}