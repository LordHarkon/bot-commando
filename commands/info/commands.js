const { Command } = require('discord.js-commando');
const { getCommandUseTop } = require('../../util/db');

module.exports = class CommandsCommand extends Command {
    constructor(client) {
        super(client,  {
            name: 'commands',
            autoAliases: true,
            memberName: 'commands',
            group: 'info',
            aliases: ['cmds'],
            description: 'Returns the top most used commands',
            args: [
                {
                    type: 'string',
                    prompt: `Do you want the top for this server or globally? [local, global]`,
                    key: 'location',
                    oneOf: ['local', 'global'],
                    default: 'local'
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    async run(msg, { location }) {
        if (location === "local") {
            let top = await getCommandUseTop();
            top.forEach(cmd => {
                msg.say(`${cmd["command"]} | ${cmd["use_count"]}`);
            });
        } else {
            let top = await getCommandUseTop(msg.guild.id);
            top.forEach(cmd => {
                msg.say(`${cmd["command"].replace(`${msg.guild.id}_`, '')} | ${cmd["use_count"]}`);
            });
        }
    }
}