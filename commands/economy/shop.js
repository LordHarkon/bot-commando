const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { shopItems } = require('../../util/db');

module.exports = class ShopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shop',
            group: 'economy',
            memberName: 'shop',
            aliases: [],
            description: 'Shows the available items for sale.',
            throttling: {
                usages: 1,
                duration: 2
            }
        });
    }

    async run(msg) {
        let page = 1;
        let pages = [];
        let count = 1;
        let description = `Welcome to Fen's Botique to buy anything please use **>buy <item_id>** or **<@${process.env.BOT_ID}> buy <item_id>**\n\n`;
        
        let itemsBulk = await shopItems();

        for(const item of itemsBulk) {
            if(item.quantity !== 0) {
                description = `${description}__${count}. **${item.name}**__ **(ID: ${item.id})**
                    **Min. level:** ${item.min_level}
                    **Price:** ${item.price} Fens
                    **Stock:** ${!item.quantity ? '∞' : item.quantity} left
                    **Description:** ${item.description}\n\n`;
                count++;
            }
            
            if(count === 11) {
                pages.push(description);
                description = `Welcome to Fen's Botique to buy anything please use >buy <item_id> or <@${process.env.BOT_ID}>\n\n`;
                count = 1;
            }
        }

        pages.push(description);

        const embed = new MessageEmbed()
            .setColor(0x0000ff)
            .setAuthor('Fen\'s Boutique', 'https://i.imgur.com/pw7uXJQ.png')
            .setFooter(`Page ${page} of ${pages.length}`)
            .setDescription(pages[page - 1])
            .setTimestamp()
        
        msg.say(embed).then(message => {
            if(pages.length === 1) return;
            message.react('⬅').then(r => {
                message.react('➡');

                const leftFilter = (reaction, user) => reaction.emoji.name ==='⬅' && user.id === msg.author.id;
                const rightFilter = (reaction, user) => reaction.emoji.name ==='➡' && user.id === msg.author.id;

                const left = message.createReactionCollector(leftFilter, { time: 60000 });
                const right = message.createReactionCollector(rightFilter, { time: 60000 });

                left.on('collect', async r => {
                    if(page === 1) return;
                    page--;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`)
                    embed.setTimestamp();
                    message.edit(embed);
                })

                right.on('collect', async r => {
                    if(page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`)
                    embed.setTimestamp();
                    message.edit(embed);
                })

                setTimeout(() => {
                    msg.reply(`The shop has closed. To open it again please use ${msg.usage()}.`);
                    message.delete();
                }, 60000);
            })
        })
    }
}