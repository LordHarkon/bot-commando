const { Command } = require('discord.js-commando');
const { get } = require('snekfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class UrbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            memberName: 'util',
            group: 'util',
            description: 'Provides the first result for a given word from urbandictionary.com.',
            args: [
                {
                    type: 'string',
                    prompt: 'What word would you like to see the description of?',
                    key: 'word'
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            }
        })
    }

    async run(msg, { word }){
        try {
            const res = await get(`http://api.urbandictionary.com/v0/define?term=${word}`);
            var {list: [info]} = res.body;
            if(!info) throw 0;
        } catch {
            return msg.reply(`No results found for: \`${word}\``);
        }

        const embed = new MessageEmbed()
            .setTitle(`:book: ${info.word}`)
            .setURL(info.permalink)
            .addField("Definition", info.definition)
            .addField("Example Usage", info.example)
            .addField("Votes", `:thumbsup: ${info.thumbs_up} :thumbsdown: ${info.thumbs_down}`)
            .addField("Author", info.author)
            .setFooter(`Requested by: ${msg.author.tag}`)
            .setTimestamp(new Date(info.written_on))
            .setColor(0x0000ff)
        
        msg.say(embed);
    }
}