const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class CumSlutsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cumsluts',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'cumsluts',
            description: 'Returns a random lewd image of cum sluts.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.cumsluts())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};