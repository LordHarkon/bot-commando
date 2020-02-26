const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class KetaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'keta',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'keta',
            description: 'Returns a random lewd image of a sweet girl.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.keta())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};