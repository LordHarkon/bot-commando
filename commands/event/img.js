const { Command } = require('discord.js-commando');
const { findChannel, findGuild, findUser } = require('../../util/Util');
const { MessageEmbed, Message } = require('discord.js');
const ms = require('ms');

module.exports = class ImgCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'img',
            group: 'event',
            memberName: 'img',
            description:
                'Command built for the guessed the character tournament. This command is used to send an embed with the image to the specified channel for a specified time.',
            ownerOnly: true,
            args: [
                {
                    type: 'string',
                    prompt: 'What is the name of the channel you wish to send this to?',
                    key: 'channelName'
                },
                {
                    type: 'integer',
                    prompt: 'What is the ID of the user who submitted this?',
                    key: 'userID'
                },
                {
                    type: 'string',
                    prompt: 'Duration of the embed?',
                    key: 'duration'
                },
                {
                    type: 'string',
                    prompt: 'Is this a character or an anime?',
                    key: 'choice',
                    parse: (str) => str.toLowerCase(),
                    oneOf: ['char', 'character', 'anime']
                },
                {
                    type: 'string',
                    prompt: 'URL of the image?',
                    key: 'url'
                },
                {
                    type: 'string',
                    prompt: 'What is the answer?',
                    key: 'answer'
                },
                {
                    type: 'string',
                    prompt: 'URL of the complete image?',
                    key: 'curl'
                }
            ]
        });
    }

    async run(msg, { channelName, userID, duration, choice, url, answer, curl }) {
        if(msg.channel.type === 'text') msg.delete();
        const guild = findGuild(this.client, process.env.GUILDID);
        const channel = findChannel(guild, channelName);
        let user = findUser(guild, userID).user;
        const embed = new MessageEmbed()
            .setDescription(
                `**Guess Type: ${choice === 'anime' ? 'Anime' : 'Character'}**`
            )
            .setColor(choice === 'anime' ? 'RED' : 'BLUE')
            .setImage(url)
            .setAuthor(
                `${user.username}#${user.discriminator}`,
                `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`
            )
            .setTimestamp();

        const message = await channel.send(embed);

        message.delete({ timeout: ms(duration) });

        setTimeout(() => {
            console.log(`'${curl}'`)
            let embed2 = new MessageEmbed()
                .setDescription(
                    `**The answer was: ${answer}!**\n:confetti_ball: Congratulations to anyone that guessed. :confetti_ball:`
                )
                .setColor(choice === 'anime' ? 'RED' : 'BLUE')
                .setTimestamp()
                .setImage(curl);

            channel.send(embed2);
        }, ms(duration));
    }
};
