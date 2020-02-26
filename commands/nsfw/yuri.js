const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class YuriCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yuri',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'yuri',
            description: 'Returns a random lewd image of yuri.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.yuri())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};