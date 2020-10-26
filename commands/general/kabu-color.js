const { Command } = require('discord.js-commando');
const { findGuild, findUser } = require('../../util/Util');
const { MessageEmbed } = require('discord.js');

module.exports = class kColorCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kcolor',
            group: 'general',
            memberName: 'kcolor',
            aliases: ['kabucolor'],
            description: 'Set a specific color for the Kabu role.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 30
            },
            args: [
                {
                    type: 'string',
                    prompt: 'What is the color you wish to set? Use Hex.',
                    key: 'color'
                }
            ]
        });
    }

    hasPermission(msg) {
        return (
            // findUser(
            //     findGuild(this.client, process.env.GUILDID),
            //     msg.author.id
            // )._roles.includes('760172996307714048') ||
            this.client.guilds
                .get(process.env.GUILDID)
                .members.get(msg.author.id)
                .roles.find((x) => x.name === 'Kabu') ||
            this.client.isOwner(msg.author.id)
        );
    }

    async run(msg, { color }) {
        const guild = findGuild(this.client, process.env.GUILDID);
        const kabu = guild.roles.find((r) => r.name === 'Kabu');

        if (!color.startsWith('#') && !/^#([0-9a-f]{6,})$/i.test(color)) {
            return msg.reply(
                'The introduced string is not a valid color hex code.'
            );
        } else {
            kabu.setColor(color).then((updated) => {
                const embed = new MessageEmbed()
                    .setDescription(`Set the color of Kabu to ${color}`)
                    .setColor(color);
                return msg.say(embed);
            });
        }
    }
};
