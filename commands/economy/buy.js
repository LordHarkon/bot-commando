const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { item_data, balance, getLevel, getInventory, updateInventory, removeMoney, removeStock } = require('../../util/db');
const { formatNumber } = require('../../util/Util');

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
                    key: 'item_id'
                },
                {
                    type: 'integer',
                    prompt: 'How many items would you like to buy ?',
                    key: 'quantity',
                    validate: (quantity) => {
                        if(parseInt(quantity) < 0) return `The amount you are trying is negative. Please try again.`;
                        if(parseInt(quantity) === 0) return `You can't buy nothing of something. Please try again.`;
                        return true;
                    },
                    default: 1
                }
            ]
        });
    }

    async run(msg, { item_id, quantity }) {
        const item = await item_data(item_id);
        const user_balance = await balance(msg.author.id);
        const inv = await getInventory(msg.author.id);
        const level = await getLevel(msg.author.id);

        if(item === undefined) return msg.reply('Item ID invalid. Please try again.');
        if(level < item.min_level) return msg.reply(`You are too low leveled to buy this item. You need ${item.min_level - level} more ${item.min_level - level > 1 ? 'levels' : 'level'} to be able to buy this item.`);
        if(user_balance < item.price * quantity) return msg.reply(`You do not have enough money to buy ${quantity > 1 ? 'these items' : 'this item'}. You need \`${formatNumber(item.price * quantity - user_balance)}\` more Fens to buy ${quantity > 1 ? 'these items' : 'this item'}.`);
        if(item.quantity && item.quantity < quantity) return msg.reply(`You are trying to buy more items than are on the stock. Current stock is of \`${formatNumber(item.quantity)}\` – **${item.name}**`);
        if(item.quantity === 0 || item.quantity < 0) return msg.reply(`__${item.name}__ is out of stock.`);

        let embed = new MessageEmbed()
            .setAuthor(item.name, item.image)
            .setThumbnail(item.image)
            .setColor(0x000000)
            .setDescription(`Are you sure you want to purchase ${quantity > 1 ? 'these items' : 'this item'}? If yes, then please click on the ✅ reaction.\n
                **Name:** __${item.name}__
                **Quantity:** ${quantity > 1 ? formatNumber(quantity) : '∞'}
                **Level needed:** ${item.min_level}
                **Price:** __${item.price * quantity}__
                **Description:** __${item.description}__`)
            .setTimestamp()

        msg.say(embed).then(message => {
            message.react('✅');
            const acceptFilter = (reaction, user) => reaction.emoji.name === "✅" && user.id === msg.author.id;

            const accept = message.createReactionCollector(acceptFilter, { time: 60000 });

            const timeout = setTimeout(() => {
                message.delete(1);
                msg.reply(`You have not accepted in time. If you wish to try buying the ${quantity > 1 ? 'items' : 'item'} again, use ${msg.usage()}.`);
            }, 60000);

            accept.on('collect', async r => {
                const items = JSON.parse(inv['items_owned']);
                const history = JSON.parse(inv['items_history']);
                let found = false;

                if(!this.inv_has_space(items.inventory_size, items.length)) return msg.reply(`Sorry, your inventory is full. Please clean up some space and try again.`);
                if(!isNaN(item.quantity)) removeStock(item.id, quantity);

                message.delete(1);
                msg.reply(`You've successfully bought \`${quantity}\` – **${item.name}**. ${quantity > 1 ? 'They have' : 'It has'} been placed into your inventory.`);

                const item_d = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    quantity: quantity,
                    image: item.image,
                    eval_code: item.eval_code
                };

                if(this.inv_is_empty(items)) {
                    items.push(item_d);
                } else {
                    items.forEach(Item => {
                        if(Item.id === item.id) {
                            found = Item;
                            Item.quantity += quantity;
                        }
                    });
                    if(!found) items.push(item_d);
                }

                removeMoney(msg.author.id, item.price * quantity);

                history.push({
                    type: 'bought',
                    name: item.name,
                    amount: quantity,
                    date: new Date()
                });

                updateInventory(msg.author.id, JSON.stringify(items), JSON.stringify(history));
                clearTimeout(timeout);
                accept.stop();
            })
        })
    }

    inv_has_space(inventory_capacity = 20, occupied_slots = 0) {
        return inventory_capacity >= occupied_slots + 1;
    }

    inv_is_empty(items) {
        return items.length === 0;
    }
};