const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class AgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "age",
            group: 'info',
            memberName: 'age',
            description: 'Tells you yours or somebody elses age on this server.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    type: "user",
                    prompt: "Which user would you like to know the age of?",
                    key: "user",
                    default: msg => msg.author
                }
            ]
        })
    }

    run(msg, { user }) {
        const calculate_age = (x) => {
            const a = moment();
            const b = moment(x);

            const y = a.diff(b, 'years');
            b.add(y, 'years');

            const m = a.diff(b, 'months');
            b.add(m, 'months');

            const d = a.diff(b, 'days');

            return `${y} ${y === 1 ? 'Year' : 'Years'} ${m} ${m === 1 ? 'Month' : 'Months'} and ${d} ${d === 1 ? 'Day' : 'Days'}`;
        };

        let embed = new MessageEmbed()
            .setTitle(`${user.tag}'s age!`)
            .setColor("RANDOM")
            .setDescription(`<@${user.id}> ${msg.author.id === user.id ? 'you are' : 'is'} currently ${calculate_age(msg.guild.member(user).joinedAt)} old.`);

        msg.embed(embed);
    }
}