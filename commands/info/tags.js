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

        const getTags = async (no) => {
            const $ = await fetchData();
            const tags = $('#info > #tags').children().eq(no).text();
            return tags.replace(/\t/g,'').replace(/\n/g,'').match(/((\b[a-z ]+\b\s)(\(\d+[,]+\d+\)|\(\d+\)))/g);
        };

        const getTitle = async () => {
            const $ = await fetchData();
            return $('#info > h1').text();
        };

        if(await fetchData() === null) return msg.say('That number does not exist. Please try again using another number.');

        let title = await getTitle();
        let parodies = await getTags(0);
        let chars = await getTags(1);
        let Tags = await getTags(2);
        let artists = await getTags(3);
        let groups = await getTags(4);
        let langs = await getTags(5);
        let categs = await getTags(6);

        function bolden (varIn) {
            let out = [];
            if(varIn === null) return ['N/A'];
            for(const varIns of varIn) {
                out.push(varIns.replace(/(\b[a-z ]+\b)/g, `**$1**`));
            }
            return out;
        };

        let parody = bolden(parodies);
        let character = bolden(chars);
        let tags = bolden(Tags);
        let artist = bolden(artists);
        let group = bolden(groups);
        let lang = bolden(langs);
        let categ = bolden(categs);


        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(`**__• Parodies:__**\n${parody.join(' ')}\n
            **__• Characters:__**\n${character.join(' ')}\n
            **__• Tags:__**\n${tags.join(' ')}\n
            **__• Artists:__**\n${artist.join(' ')}\n
            **__• Groups:__**\n${group.join(' ')}\n
            **__• Languages:__**\n${lang.join(' ')}\n
            **__• Categories:__**\n${categ.join(' ')}`)
            .setColor('#ED2553')
            .setTimestamp()
            .setFooter(number)
            .setThumbnail('https://i.imgur.com/8WU83ac.png');

        await msg.say(embed);
    }
}