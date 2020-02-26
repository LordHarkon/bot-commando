const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class BlowjobCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'blowjob',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'blowjob',
            description: 'Returns a random lewd image of a blowjob.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.blowJob())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};