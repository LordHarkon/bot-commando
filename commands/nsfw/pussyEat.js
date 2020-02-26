const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class PussyEatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pussyeat',
            autoAliases: true,
            group: 'nsfw',
            memberName: 'pussyeat',
            aliases: ['kuni', 'cunnilingus'],
            description: 'Returns a random lewd image of a kuni.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.kuni())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};