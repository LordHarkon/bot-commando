const Discord = require('discord.js');
const { applyText, nextLevel, findChannel, searchURL, findEmoji, roundRect } = require('../util/Util');
const { getLevel, setLevel, addLevel, addMessages, setExperience, getExperience, addExperience, getNextLevelXP, setNextLevelXP, create } = require('../util/db');
const Canvas = require('canvas');
const cooldownExp = new Set();

module.exports = async (message) => {
    const client = message.client;

    create(message.author.id);

    if(message.channel.type === "dm" || message.channel.type === "group" || message.author.bot) return;

    const xpLogs = findChannel(client, process.env.XPLOGS);

    const Experience = await getExperience(message.author.id);
    const Level      = await getLevel(message.author.id);

    if(Experience < 0) setExperience(message.author.id, 0);
    else if(Level < 0) setLevel(message.author.id, 0);

    setNextLevelXP(message.author.id, nextLevel(Level + 1));

    if(!message.content.startsWith(process.env.PREFIX)) {
        if (cooldownExp.has(message.author.id)) return;
        
        cooldownExp.add(message.author.id);
        setTimeout(() => {
            cooldownExp.delete(message.author.id);
        }, 5000);
    
        let xp = Math.round(Math.random() * 10 + 1);
        
        addExperience(message.author.id, xp);
        xpLogs.send(`**${message.author.username}** received __${xp} exp__! :tada:`);
        console.log(`${message.author.username} received ${xp} exp!`);
    }

    addMessages(message.author.id);

    gibRole = (roleName) => {
        let guild = client.guilds.get(message.guild.id);
        let role2 = guild.roles.find(r => r.name === roleName);
        if (!guild.members.get(message.author.id).roles.has(role2)) return guild.members.get(message.author.id).roles.add(role2);
        return null;
    };

    function checkAndGive(level) {
        let souls = ['', 'Mortal Soul', 'Hero Soul', 'Lord Soul', 'Divine Soul', 'Realm Soul', 'Sage Soul', 'Sovereign Soul', 'Aspect Soul', 'Aspect Soul', 'Origin Soul'];
        level = Math.floor(level / 10);

        if(level === 0) return null;
        else if(level >= 1 && level <= 10) gibRole(souls[level]);
        else gibRole('The Path');

        return null;
    }

    checkAndGive(Level);

    const levelUp = async () => {
        const exp = await getExperience(message.author.id);
        const level = await getLevel(message.author.id);

        if(exp < 0) setExperience(message.author.id, 0);
        else if(level < 0) setLevel(message.author.id, 0);

        if (exp >= nextLevel(level + 1)) {
            const canvas = Canvas.createCanvas(444, 250);
            const ctx = canvas.getContext('2d');

            const background = await Canvas.loadImage('./assets/images/bg4.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.font = '30px Azonix';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('Congratulations', canvas.width / 2, 40);

            ctx.shadowColor = '#add8e6';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 10;

            ctx.font = '54px Azonix';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(`${level} -> ${level + 1}`, canvas.width / 2, canvas.height / 1.9);

            ctx.shadowBlur = 0;

            ctx.font = '48px Azonix';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('level up!', canvas.width / 2, canvas.height / 1.1);

            let tiers = ['', 'Mortal Soul', 'Hero Soul', 'Lord Soul', 'Divine Soul', 'Realm Soul', 'Sage Soul', 'Sovereign Soul', 'Aspect Soul', 'Aspect Soul', 'Origin Soul', 'The Path'];
            let tierColors = ['#000000','#FF0000','#FFA500','#FFFF00','#008000','#0000FF','#4B0082','#EE82EE','#000000','#ffffff','#888888'];

            let lv = Math.floor((level + 1) / 10);
            ctx.font = '20px Azonix';
            ctx.textAlign = "center";
            ctx.shadowColor = 'white';
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            if(lv <= 10) {
                ctx.fillStyle = tierColors[lv].toString();
                ctx.fillText(tiers[lv],canvas.width / 2, canvas.height / 1.65);
            } else ctx.fillStyle = tierColors[11];

            const attachment = canvas.toBuffer();

            xpLogs.send(`<@${message.author.id}>`, { files: [{ attachment, name: 'levelup.png' }] });

            let xp = nextLevel(level + 1);
            let res = Number.parseInt(exp, 10) - Number.parseInt(xp, 10);
            if(res < 0) res = 0;
            setNextLevelXP(message.author.id, nextLevel(level + 2));
            setExperience(message.author.id, res);
            addLevel(message.author.id, 1);

            await levelUp();
        }
    }
    await levelUp();
}