const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class TagsCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'tags',
            group: 'info',
            memberName: 'tags',
            aliases: ['tag', 'numbers', 'nh'],
            description: 'Shows all the tags for that \'weeb\' number.',
            args: [
                {
                    type: 'integer',
                    prompt: 'What is the number that you wish to see the tags for??',
                    key: 'number',
                    infinite: false
                }
            ]
        });
    }

    async run(msg, { number }) {
        const siteUrl = `https://nhentai.net/g/${number}/`;

        const fetchData = async () => {
            let result = null;
            try {
                result = await axios.get(siteUrl);
                return cheerio.load(result.data);
            } catch (err) {
                console.error("Error response:");
                console.error(err.response.status)
            }
            return result;
        };

        const window = {
            "_gallery": ''
        };

        const getDetails = async() => {
            const $ = await fetchData();
            const script = $('body').find('script').eq(1).html();
            const details = script.replace('\n','').replace('\t','');
            eval(details);
        };

        try {
            await getDetails();
        } catch (err) {
            return msg.say('That number does not exist or something went try. Please try again or use a different number.');
        }

        const h = window._gallery;

        const parodies = h.tags.filter(tag => tag.type === "parody").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const characters = h.tags.filter(tag => tag.type === "character").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const tags = h.tags.filter(tag => tag.type === "tag").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const artists = h.tags.filter(tag => tag.type === "artist").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const groups = h.tags.filter(tag => tag.type === "group").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const languages = h.tags.filter(tag => tag.type === "language").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const categories = h.tags.filter(tag => tag.type === "category").map(tag => {
            return `**${tag.name}** (${tag.count})`
        });

        const embed = new MessageEmbed()
            .setTitle(h.title.pretty)
            .setDescription(`**__• Parodies:__**\n${parodies.length > 0 ? parodies.join(', ') : 'N/A'}\n
            **__• Characters:__**\n${characters.length > 0 ? characters.join(', ') : 'N/A'}\n
            **__• Tags:__**\n${tags.length > 0 ? tags.join(', ') : 'N/A'}\n
            **__• Artists:__**\n${artists.length > 0 ? artists.join(', ') : 'N/A'}\n
            **__• Groups:__**\n${groups.length > 0 ? groups.join(', ') : 'N/A'}\n
            **__• Languages:__**\n${languages.length > 0 ? languages.join(', ') : 'N/A'}\n
            **__• Categories:__**\n${categories.length > 0 ? categories.join(', ') : 'N/A'}`)
            .setColor('#ED2553')
            .setTimestamp()
            .setFooter(`${number} • ${h.num_pages} pages • ${h.num_favorites} favorites`)
            .setThumbnail('https://i.imgur.com/8WU83ac.png');

        await msg.say(embed);
    }
}