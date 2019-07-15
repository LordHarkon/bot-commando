const { Command } = require('discord.js-commando');
const { getBank } = require('../../util/database');
const { MessageEmbed } = require('discord.js');

module.exports = class BankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bank',
            memberName: 'bank',
            group: 'money',
            aliases: ['atm'],
            description: 'Check your current status at the bank.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: 'user',
                    prompt: 'Which user would like to view the account of?',
                    key: 'user',
                    default: msg => msg.author
                }
            ]
        })
    }

    run(msg, { user }) {
        const bank = getBank(user.id);
        const money = bank.money;
        const loan = `**Money to pay (loan):** __${bank.loan}__\n**Interest rate:** __${bank.interest}%/day__\n**Time to pay:** __${30-bank.day}__`;
        var rank = '';

        if(money < 1000) rank = 'Get a job';
        else if(money < 10000) rank = 'Low Class Pleb'
        else if(money < 100000) rank = 'Middle Class Pleb'
        else if(money < 1000000) rank = 'Rich Noob'
        else if(money < 10000000) rank = 'Millionare Loser'
        else if(money > 100000000) rank = 'Money Horder No-Lifer'

        const embed = new MessageEmbed()
            .setColor(0x0000ff)
            .setAuthor('Fenbank of United Headpats')
            .setThumbnail('https://i.imgur.com/52To2ip.png')
            .setDescription(`**Client:** __${user.username}__\n**Balance:** __${money} Fens__\n${bank.loan > 0 ? loan : `**Money to pay (loan):** __0__`}`)
            .setTimestamp()
            .setFooter(rank, user.displayAvatarURL)
        
        msg.say({embed});
        msg.delete(10000);
    }
}