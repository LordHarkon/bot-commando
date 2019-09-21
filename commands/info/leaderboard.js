const { Command } = require('discord.js-commando');
const SQLite = require('better-sqlite3');
const sql = new SQLite('./database.sqlite');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');
const { topHundred } = require('../../util/db');

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            group: 'info',
            memberName: 'leaderboard',
            aliases: ['top', 'top10', 'ranking'],
            description: 'Shows the top 10 highest leveled people on the server.',
            throttling: {
                usages: 1,
                duration: 2
            },
            guildOnly: true,
            args: [
                {
                    type: 'string',
                    prompt: 'What leaderboard would like to see? Available leaderboards: level, fens.',
                    key: 'rtype',
                    oneOf: ['level', 'lvl', 'money', 'balance', 'fens', 'experience', 'xp'],
                    parse: str => str.toLowerCase()
                }
            ]
        });
    }

    async run(msg, { rtype }) {
        const levels = ['level', 'lvl', 'experience', 'xp'];
        if(levels.includes(rtype)) var name = 'Level';
        else var name = 'Fens';
        const topLv = await topHundred('level');
        const topFens = await topHundred('bank');

        const embed = new MessageEmbed()
            .setTitle(`Leaderboard - ${name}`)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({size: 2048}))
            .setColor(0x00AE86)
            .setThumbnail('https://i.imgur.com/cN6FyGN.png');
        
        var users = [];

        if(name === 'Level'){
            for(const data of topLv) {
                if(users.length < 10) {
                    const member = await this.client.users.find(x => x.id == data.id);
                    if(member != undefined) {
                        users.push(`**${member.tag}**`);
                        embed.addField(`${users.length}. ${member.tag}`, `**Level __${data.level}__** (**__${formatNumber(data.experience)}__ experience**)`);
                    }
                }
            }
            embed.setDescription(`Top ${users.length} highest leveled users on the server!\n-------------------------------\n\n\n`)
        } else {
            for(const data of topFens) {
                if(users.length < 10) {
                    const member = await this.client.users.find(x => x.id == data.id);
                    if(member != undefined) {
                        users.push(`**${member.tag}**`);
                        embed.addField(`${users.length}. ${member.tag}`, `**__${formatNumber(data.money)}__ Fens**`);
                    }
                }
            }
            embed.setDescription(`Top ${users.length} richest users on the server!\n-------------------------------\n\n\n`)
        }
        

        return msg.say(embed);
    }
}