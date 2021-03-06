const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class NekoGifCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nekogif',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'nekogif',
            description: 'Returns a random lewd gif of a neko.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.nekoGif())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};