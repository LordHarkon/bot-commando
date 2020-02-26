const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class LesbianCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lesbian',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'lesbian',
            description: 'Returns a random lewd image of lesbians.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.lesbian())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};