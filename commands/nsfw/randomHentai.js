const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class RandomHentaiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randomhentai',
            autoAliases: true,
            aliases: ['rh'],
            group: 'nsfw',
            memberName: 'randomhentai',
            description: 'Returns a random lewd gif of a random hentai.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.randomHentaiGif())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};