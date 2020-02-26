const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class EroYuriCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eroyuri',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'eroyuri',
            description: 'Returns a random erotic yuri image.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.eroYuri())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};