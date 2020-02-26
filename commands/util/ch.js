const { Command } = require('discord.js-commando');
const { MessageEmbed, WebhookClient } = require('discord.js');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const count = require('word-count');
const getUrls = require('get-urls');

module.exports = class ChCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'ch',
            group: 'util',
            memberName: 'ch',
            aliases: ['chapter'],
            description: 'Send the chapter link and an optional message in free-talk. Ein only.',
            args: [
                {
                    type: 'string',
                    prompt: 'What is the link [and message]?',
                    key: 'input',
                    infinite: false
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.author.id === process.env.EIN || this.client.isOwner(msg.author.id);
    }

    async run(msg, { input }) {
        const newChapter = new WebhookClient(process.env.CHAPTERWEBHOOKID, process.env.CHAPTERWEBHOOKTOKEN);

        let csrf = this.get_csrf();

        let chapter_link = (Array.from(getUrls(input)))[0].toString();

        input = input.replace('www.webnovel.com', 'webnovel.com');

        const message = input.replace(chapter_link, '').trim();

        const bookId = chapter_link.split('/')[4];
        const chapterId = chapter_link.split('/')[5];

        const book_url = `https://webnovel.com/book/${bookId}`;

        const chapter_body_url = `https://www.webnovel.com/apiajax/chapter/GetContent?_csrfToken=${csrf}&bookId=${bookId}&chapterId=${chapterId}`;

        const book_cover_url = `https://img.webnovel.com/bookcover/${bookId}/600/600.jpg`;

        const chapter_whole = await this.get_chapter_body(chapter_body_url);

        const book_name = await chapter_whole["data"]["bookInfo"]["bookName"];

        const chapter_title = await chapter_whole["data"]["chapterInfo"]["chapterName"];

        const chapter_number = await chapter_whole["data"]["chapterInfo"]["chapterIndex"];

        const chapter_contents = chapter_whole["data"]["chapterInfo"]["contents"];

        let chapter_body = '';

        let alternate_titles = '';

        chapter_contents.forEach(para => {
            chapter_body += para["content"] + '\n'
            if(para["content"].includes('Alternate Titles')) alternate_titles = para["content"];
            // console.log(alternate_titles)
        });

        const chapter_word_count = count(chapter_body);

        const embed = new MessageEmbed()
            .setThumbnail(book_cover_url)
            // .setAuthor(`Chapter ${chapter_number}: ${chapter_title}`, `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`, chapter_link)
            .setTitle(`Chapter ${chapter_number}: ${chapter_title}`)
            .setDescription(`**Book:** __[${book_name}](${book_url})__\n\n**Glimpse**:\n${chapter_contents[0]["content"]}[... Continue](${chapter_link})`)
            .setColor('#FFFFFE')
            .setTimestamp()
            // .addField('Glimpse:', chapter_contents[0]["content"])
            .addField('**Word Count**:', chapter_word_count, true)

        if(message.length > 1) embed.addField('**Ein\'s Note:**', message, true);
        embed.addField('**Patreon:**', '<https://bit.ly/2XBzAYu>');
        embed.addField('**Paypal:**', '<https://paypal.me/Einlion>', true);
        if(alternate_titles.length > 1) embed.addField('**Alternate Titles**:', `${((alternate_titles.match(/(?<=\(A\/N: Alternate Titles:)(.*)(?=\))/gm))[0]).trim()}`);

        await newChapter.send(`<@&${process.env.NOTIFYROLE}>`, embed);
    }

    async get_csrf() {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        const page = await browser.newPage();

        await page.goto('https://www.webnovel.com');

        const cookies = (await page.cookies())[0];

        await browser.close();

        return cookies;
    }

    async get_chapter_body(url) {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        const page = await browser.newPage();

        await page.goto(url);

        const content = await page.content();

        const $ = cheerio.load(content);

        const chapter = JSON.parse($('body').text())

        await browser.close();

        return chapter;
    }

}