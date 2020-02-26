const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class EroNekoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eroneko',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'eroneko',
            description: 'Returns a random erotic image of a cat girl.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.eroNeko())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};