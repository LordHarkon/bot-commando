const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class NekoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neko',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'neko',
            description: 'Returns a random lewd image of a neko.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.neko())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};