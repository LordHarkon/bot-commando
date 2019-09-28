const { Command } = require('discord.js-commando');
const { getInventory } = require('../../util/db');
const { MessageEmbed } = require('discord.js');

module.exports = class InventoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inventory',
            group: 'economy',
            memberName: 'inventory',
            aliases: ['backpack', 'warehouse', 'inv'],
            description: 'Shows your inventory will all your items inside.',
            throttling: {
                usages: 1,
                duration: 2
            }
        });
    }

    async run(msg) {
        let x = await getInventory(msg.author.id);

        let page = 1;
        let pages = [];
        let count = 1;

        let items_owned = JSON.parse(x["items_owned"]);

        let desc = `Inventory(${items_owned == '[]' ? '0' : items_owned.length}/${x.inventory_size})\n\n`;


        for(const item of items_owned) {
            if(item.id != undefined || item.name != undefined) {
                desc = `${desc}**Name:** ${item.name} (ID: ${item.id})\n**Quantity:** ${item.quantity}\n**Description:** ${item.description}\n\n`
                count++;
                if(count === 11) {
                    pages.push(desc);
                    desc = `Inventory(${items_owned == '[]' ? '0' : items_owned.length}/${x.inventory_size})\n\n`;
                    count = 1;
                }
            }
            
        }

        if(desc == `Inventory(${items_owned == '[]' ? '0' : items_owned.length}/${x.inventory_size})\n\n`) {
            desc = `Inventory(${items_owned == '[]' ? '0' : items_owned.length}/${x.inventory_size})\n\nNothing. Oh, wait. There's some dust :D`
        }
        pages.push(desc);

        const inv = new MessageEmbed()
            .setColor(0xffffff)
            .setAuthor(`Fen's Traveling Backpack - ${msg.author.tag}`, msg.author.displayAvatarURL({size: 2048}))
            .setThumbnail('https://i.imgur.com/O67Du0z.png')
            .setFooter(`Page ${page} of ${pages.length}`)
            .setDescription(pages[page - 1])
            .setTimestamp()

            msg.say(inv).then(message => {
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
                });

                right.on('collect', async r => {
                    if(page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`)
                    embed.setTimestamp();
                    message.edit(embed);
                });

                setTimeout(() => {
                    msg.reply(`The backpack closed itself. To open it again please use ${msg.usage()}.`);
                    message.delete();
                }, 60000);
            })
        })
    }
}