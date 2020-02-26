const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const meme = require('memejs');

module.exports = class MemesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memes',
            autoAliases: true,
            aliases: ['meme'],
            group: 'image',
            memberName: 'memes',
            description: 'Returns a random meme.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        meme(async (data, err) => {
            if(err) return console.error(err);
            const embed = new MessageEmbed()
                .setTitle(data.title[0])
                .setURL(data.url[0])
                .setAuthor(data.author[0])
                .setTimestamp()
                .setFooter(`Subreddit: ${data.subreddit[0]}`)
                .setImage(data.url[0])
                .setColor('RANDOM');
            
            await msg.say(embed);
        });
    }
};