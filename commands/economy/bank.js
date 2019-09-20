const { Command } = require('discord.js-commando');
const { balance, get } = require('../../util/db');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class BankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bank',
            group: 'economy',
            memberName: 'bank',
            aliases: ['atm'],
            description: 'Check your current status at the bank.',
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

    async run(msg, { user }) {
        const money = await balance(user.id)
        const loan = stripIndent`
            **Money to pay (loan):** __${await get(user.id, 'loan')}__
            **Interest rate:** __${await get(user.id, 'interest')}%/day__
            **Time to pay:** __${(30-(await get(user.id, 'date'))) < 0 ? 0 : 30-(await get(user.id, 'date'))} Days__
        `;
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
            .setDescription(`**Client:** __${user.username}__\n**Balance:** __${money} Fens__\n${await get(user.id, 'loan') > 0 ? loan : `**Money to pay (loan):** __0__`}`)
            .setTimestamp()
            .setFooter(rank, user.displayAvatarURL)
        
        msg.say(embed);
    }
}