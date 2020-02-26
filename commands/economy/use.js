const {Command} = require('discord.js-commando');
const {getInventory, addExperience, updateInventory, setExperience, setLevel} = require('../../util/db');

module.exports = class UseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'use',
            group: 'economy',
            memberName: 'use',
            guildOnly: true,
            description: 'The command to use the items in your inventory.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'integer',
                    prompt: 'What is the ID of the item you wish to use?',
                    key: 'item_id'
                },
                {
                    type: 'integer',
                    prompt: 'How many of them would you like to use?',
                    key: 'amount',
                    default: 1
                }
            ]
        })
    }

    async run(msg, {item_id, amount}) {
        let inv = await getInventory(msg.author.id);
        let items = JSON.parse(inv["items_owned"]);
        let history = JSON.parse(inv["items_history"]);

        let found = false;
        items.forEach(item => {
            if (item.id === item_id) {
                found = item;
                if (!this.check_eval_exist(item.eval_code)) return msg.reply(`__${item.name}__ is not usable through this method.`);
                amount = this.check_set_quantity(found.quantity, amount);
                item.quantity -= amount;
                if (this.check_quantity_zero(item.quantity)) items.splice(items.indexOf(found), 1);
                for (let i = 1; i <= amount; i++) eval(item.eval_code);
                history.push({
                    type: 'used',
                    name: item.name,
                    amount: amount,
                    date: new Date()
                });

            }
        });

        if (!found) return msg.reply(`You do not have such an item in your inventory. Please check and try again.`);
        else await msg.reply(`You have used ${amount} – **${found.name}**.`);

        items = items.sort(function compare(a, b) {
            if (a.id > b.id) return 1;
            else if (a.id < b.id) return -1;
            return 0;
        });

        updateInventory(msg.author.id, JSON.stringify(items), JSON.stringify(history));
    }

    check_eval_exist(code) {
        return !(code == null || false);
    }

    check_quantity_zero(quantity) {
        return quantity <= 0;
    }

    check_set_quantity(quantity, amount) {
        if (quantity >= amount) return amount;
        return quantity;
    }
};