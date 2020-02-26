const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class HoloEroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'holoero',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'holoero',
            description: 'Returns a random erotic image of holo.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.holoEro())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};