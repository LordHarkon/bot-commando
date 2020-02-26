const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class KitsuneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kitsune',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'kitsune',
            description: 'Returns a random lewd image of a kitsune.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.kitsune())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};