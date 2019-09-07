const { Command } = require('discord.js-commando');
const lewdCateg = require('../../assets/json/lewd-categories');
const { get } = require('superagent');
const { MessageEmbed } = require('discord.js');

module.exports = class LewdNekoCommand extends Command {
    constructor(client) {
        super(client,  {
            name: 'lewd',
            autoAliases: true,
            memberName: 'lewd',
            group: 'nsfw',
            description: 'Returns a random lewd image of your selected category. Can only be used in DMs.',
            details: `Available categories: ${lewdCateg.join(', ')}`,
            args: [
                {
                    type: 'string',
                    prompt: `What category would you like to see an image of? Available categories: ${lewdCateg.join(', ')}`,
                    key: 'category',
                    validate: (category, msg) => {
                        if(lewdCateg.includes(category)) return true;
                        return `Incorrect category. Please select one of the available categories: ${lewdCateg.join(', ')}`
                    }
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    async run(msg, { category }) {
        let { body } = await get(`https://nekos.life/api/v2/img/${category}`);

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setImage(body.url)
        
        return msg.direct(embed);
    }
}