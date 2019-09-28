const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { item, balance, getLevel, getInventory, updateInventory, removeMoney, removeStock } = require('../../util/db');

module.exports = class BuyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'buy',
            group: 'economy',
            memberName: 'buy',
            aliases: [],
            description: 'Allows you to buy items from the shop.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'integer',
                    prompt: `What is the ID of the item that you wish to buy? To know the ID of an item use \`>shop\`.`,
                    key: 'item_id',
                    validate: async (item_id, msg) => {
                        let x = await item(item_id);
                        let l = await getLevel(msg.author.id);
                        if(x == undefined) return `Item ID invalid. Please try again.`
                        if(l < x.min_level) return `your level is too low to buy this item. You need ${x.min_level - l} more levels to be able to buy this item.`
                        return true;
                    }
                },
                {
                    type: 'integer',
                    prompt: 'How many items would you like to buy ?',
                    key: 'quantity',
                    default: 1
                }
            ]
        });
    }

    async run(msg, { item_id, quantity }) {
        let x = await item(item_id);
        let y = await balance(msg.author.id);
        if(y < x.price * quantity) return msg.reply(`You do not have enough money to buy this item. You need \`${x.price * quantity - y}\` more Fens to buy it.`);
        if(x.quantity && x.quantity < quantity) return msg.reply(`You are trying to buy more items than are on stock. Please try again with a lower number.`);

        let item_data = await item(item_id);
        let inv_item = {
            id: item_data.id,
            name: item_data.name,
            description: item_data.description,
            quantity: quantity,
            image: item_data.image
        }

        let item_embed = new MessageEmbed()
            .setAuthor(item_data.name, item_data.image)
            .setThumbnail(item_data.image)
            .setColor(0x000000)
            .setDescription(`Are you sure you want to purchase ${quantity > 1 ? 'these items' : 'this item'}? If yes, the please react with ✅.\n\n**Name:** __${item_data.name}__\n${quantity > 1 ? `**Quantity:** ${quantity}\n` : ''}**Min. level:** ${item_data.min_level}\n**Description:** __${item_data.description}__\n**Price:** __${item_data.price * quantity}__`)
            .setTimestamp()
        
        msg.say(item_embed).then(message => {
            message.react('✅');
            const acceptFilter = (reaction, user) => reaction.emoji.name ==='✅' && user.id === msg.author.id;

            const accept = message.createReactionCollector(acceptFilter, { time: 60000 });

            let timeout = setTimeout(() => {
                message.delete(1);
                msg.reply(`you have not accepted in time. If you wish to try buying the item again, use ${msg.usage()}.`);
            }, 60000);

            accept.on('collect', async r => {
                let x = await getInventory(msg.author.id);
                let items_owned = JSON.parse(x["items_owned"]);
                let items_history = JSON.parse(x["items_history"]);
                let exists = false;

                if(items_owned.length >= x.inventory_size) return msg.reply(`sorry, your inventory is full. Please clean up some space and try again.`);

                if(item_data.quantity) removeStock(item_data.id, quantity);

                message.delete(1);
                msg.say(`Congratulations, ${msg.author.tag}! You've successfully bought x${quantity} \`${item_data.name}\`. You can find ${quantity > 1 ? 'it' : 'them'} in your inventory.`);
                
                if(items_owned == '[]' || !items_owned) {
                    items_owned = [].push(inv_item);
                } else {
                    items_owned.forEach(item => {
                        if(item.id == inv_item.id) {
                            item.quantity += quantity;
                            exists = true;
                        }
                    });
                    if(!exists) items_owned.push(inv_item);
                    removeMoney(msg.author.id, Number(item_data.price * quantity))
                }

                if(items_history == '[]' || !items_history) {
                    items_history = [`Bought x${quantity} ${item_data.name} for ${item_data.price * quantity} Fens.`];
                } else {
                    items_history.push(`Bought x${quantity} ${item_data.name} for ${item_data.price * quantity} Fens.`);
                }

                items_owned = JSON.stringify(items_owned);
                items_history = JSON.stringify(items_history);
                
                updateInventory(msg.author.id, `'${items_owned}'`, `'${items_history}'`);
                clearTimeout(timeout);
            })
        })
    }
}