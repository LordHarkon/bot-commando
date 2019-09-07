const { Command } = require('discord.js-commando');
const { getBank, setBank } = require('../../util/database');
const { findGuild, findChannel } = require('../../util/Util');
const { GUILDID, GAMBLING } = process.env;
const { SlotMachine, SlotSymbol } = require('slot-machine');

module.exports = class SlotsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slots',
            group: 'games',
            memberName: 'slots',
            aliases: ['slot-machine', 'slot'],
            description: 'Play a game of slots. A fee of 500 Fens is deducted upon losing.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 60
            }
        });
    }

    run(msg) {
        const bank = getBank(msg.author.id);
        const guild = findGuild(this.client, GUILDID);
        const channel = findChannel(guild, GAMBLING);
        if(msg.channel.id != channel.id) return msg.reply(`This command can only be used in the gambling channel.`);

        const cherry = new SlotSymbol('cherry', {
            display: '🍒',
            points: 20,
            weight: 100
        });
         
        const grape = new SlotSymbol('grape', {
            display: '🍇',
            points: 100,
            weight: 50
        });
         
        const wild = new SlotSymbol('wild', {
            display: '❔',
            points: 80,
            weight: 50,
            wildcard: true
        });

        const machine = new SlotMachine(3, [cherry, grape, wild]);
        const results = machine.play();

        if(results.totalPoints >= 500) {
            msg.say(`${results.visualize()}\nYou have won ${results.totalPoints} Fens.`);
            bank.money = Number.parseInt(bank.money, 10) + Number.parseInt((results.totalPoints),10);
        } else {
            msg.say(`${results.visualize()}\nYou have lost 500 Fens.`);
            bank.money = Number.parseInt(bank.money, 10) - 500;
        }

        setBank(bank);
    }
}