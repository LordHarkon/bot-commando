require('dotenv').config();
const { PREFIX, OWNERS, TOKEN } = process.env;
const { Client } = require('discord.js-commando');
const path = require('path');

const client = new Client({
    commandPrefix: PREFIX,
    owner: OWNERS.split(',')
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'General'],
        ['info', 'Information'],
        ['misc', 'Misc'],
        ['mod', 'Moderation'],
        ['money', 'Bank'],
        ['polls', 'Polls'],
        ['response', 'responsive'],
        ['util', 'Utility']
    ])
    .registerDefaultCommands({
        help: false,
		ping: false,
        prefix: false,
        eval_: false,
		commandState: false,
        unknownCommand: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client
    .on('ready', () => require('./events/ready')(client))
    .on('message', (message) => require('./events/message')(message))
    .on('guildBanAdd', (guild, user) => require('./events/guildBanAdd')(guild, user))
    .on('disconnected', () => require('./events/disconnected'))
    .on('reconnecting', () => require('./events/reconnecting'))
    .on('commandError', (cmd, err) => require('./events/commandError')(cmd, err))
client.login(TOKEN);