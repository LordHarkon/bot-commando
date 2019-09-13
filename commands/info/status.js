const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const moment = require('moment');
const { getStats } = require('../../util/database');
const { getLevel, getExperience, getNextLevelXP } = require('../../util/level');
const { percentage } = require('../../util/Util');
const Discord = require('discord.js');
const { GUILDID } = process.env;

module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            memberName: 'status',
            group: 'info',
            aliases: ['id'],
            description: 'Shows your current status card.',
            args: [
                {
                    type: 'user',
                    prompt: `Which user's card would you like to see?`,
                    key: 'user',
                    default: msg => msg.author
                }
            ],
            throttling: {
                usages: 1,
                duration: 20
            }
        })
    }

    async run(msg, { user }) {
        var stats = getStats(user.id);

        var Level = getLevel(user.id)
        var Experience = getExperience(user.id)
        var nextLevelXP = getNextLevelXP(user.id)
        var Messages = stats.messages;

        // Function to calculate the age of the account
        const calculate_age = (x) => {
            const diff_ms = Date.now() - x.getTime();
            const age_dt = new Date(diff_ms);

            return `${Math.abs(age_dt.getUTCFullYear() - 1970)} Years ${Math.abs(age_dt.getUTCMonth())} Months and ${Math.abs(age_dt.getUTCDate() - 1)} Days`;
        }

        // The date the account was created
        const y = new Date(moment.utc(user.createdAt));

        // Calculates the age of the user based on the date the account was created
        var age = calculate_age(new Date(y.getUTCFullYear(), y.getUTCMonth(), y.getUTCDate()));

        var fres = '';
        var color = '';

        const hasRole = (roleName) => {
            return this.client.guilds.get(GUILDID).members.get(user.id).roles.find(role => role.name === roleName)
        }
        
        if(hasRole('Einlion') || hasRole('Bird Admins')) age = 'Ageless'

        // Checking the highest role the user has
        if(hasRole('The Path')) {
            fres = "The Path";
            color = 'gray';
        } else if(hasRole('Origin Soul')) {
            fres = "Origin";
            color = 'white';
        } else if(hasRole('Aspect Soul')) {
            fres = "Aspect";
            color = 'black';
        } else if(hasRole('Sovereign Soul')) {
            fres = "Sovereign";
            color = 'violet';
        } else if(hasRole('Sage Soul')) {
            fres = "Sage";
            color = 'indigo';
        } else if(hasRole('Realm Soul')) {
            fres = "Realm";
            color = 'blue';
        } else if(hasRole('Divine Soul')) {
            fres = "Divine";
            color = 'green';
        } else if(hasRole('Lord Soul')) {
            fres = "Lord";
            color = 'yellow';
        } else if(hasRole('Hero Soul')) {
            fres = "Hero";
            color = 'orange';
        } else if(hasRole('Mortal Soul')) {
            fres = "Mortal";
            color = 'red';
        } else {
            fres = "Mana Construct";
            color = 'transparent'
        }

        /**
         * CANVAS START
         */

        const canvas = Canvas.createCanvas(400, 180);
        const ctx = canvas.getContext('2d');
        
        // Progress part of the progress bar
        const dsa = await Canvas.loadImage('./assets/images/dsa.png');
        ctx.drawImage(dsa, 14, canvas.height / 1.235, 370.5, 22);

        // Remaining part of the progress bar
        const bar = await Canvas.loadImage('./assets/images/bar.png');
        ctx.drawImage(bar, percentage(Experience,nextLevelXP) * 385 / 100, canvas.height / 1.235, 400, 22);

        // Background Image
        const background = await Canvas.loadImage('./assets/images/status.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Name Text
        ctx.font = '16px Open Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${user.username}!`, canvas.width / 2.39, canvas.height / 6.6);

        // Age Text
        ctx.font = '16px Open Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${age}`, canvas.width / 2.7, canvas.height / 3.8);

        // Level Text
        ctx.font = '16px Open Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${Level}`, canvas.width / 2.5, canvas.height / 2.68);

        // Messages Text
        ctx.font = '16px Open Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${Messages}`, canvas.width / 2.04, canvas.height / 2.06);

        // Class Text
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.font = '16px Open Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${fres}`, canvas.width / 2.5, canvas.height / 1.67);

        // Experience Text
        ctx.font = '16px Open Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${Experience} / ${nextLevelXP} (${percentage(Experience,nextLevelXP)} %)`, canvas.width / 3.76, canvas.height / 1.3);

        // Avatar Image
        let avatar;
        try {
            avatar = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
        } catch (e) {
            avatar = await Canvas.loadImage('./assets/images/no-avatar.png');
        }
        ctx.drawImage(avatar, 19.5, 17.5, 86.5, 87.5);

        const attachment = canvas.toBuffer();

        /**
         * CANVAS END
         */

        if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image is bigger than the limit of 8MB.');

        msg.say({ files: [{ attachment, name: 'status.png' }] })
    }
}