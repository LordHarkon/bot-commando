const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class EroKitsuneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'erokitsune',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'erokitsune',
            description: 'Returns a random erotic image of a kitsune.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.eroKitsune())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};