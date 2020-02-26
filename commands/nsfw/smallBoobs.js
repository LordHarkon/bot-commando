const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class SmallBoobsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'smallboobs',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'smallboobs',
            description: 'Returns a random lewd image of a girl with small boobs.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.smallBoobs())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};