const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const nekos = require('nekos.life');
const {nsfw} = new nekos();

module.exports = class PussyMasturbationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pussymasturbation',
            autoAliases: true,
            aliases: ['pussywank'],
            group: 'nsfw',
            memberName: 'pussymasturbation',
            description: 'Returns a random lewd gif of a girl masturbating.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        const image = (await nsfw.pussyWankGif())["url"];
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle('Sauce')
            .setURL(image)
            .setImage(image)
            .setTimestamp();

        await msg.direct(embed);
    }
};