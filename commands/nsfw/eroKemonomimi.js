const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class EroKemonomimiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'erokemonomimi',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'erokemonomimi',
            description: 'Returns a random erotic image of a kemonomimi.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.eroKemonomimi())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};