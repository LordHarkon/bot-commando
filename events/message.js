const Discord = require('discord.js');
const { applyText, nextLevel, findChannel, searchURL, findEmoji } = require('../util/Util');
const { XPLOGS } = process.env;
const { getLevel, getStats, getWarnings, setLevel, setStats, setWarnings } = require('../util/database.js');
const Canvas = require('canvas');
const { PREFIX, GUILDID, EIN, GENERAL, NOTIFYROLE, CHAPTERWEBHOOKID, CHAPTERWEBHOOKTOKEN } = process.env;
const cooldownExp = new Set();

module.exports = async (message) => {
    const client = message.client;
    const newChapter = new Discord.WebhookClient(CHAPTERWEBHOOKID, CHAPTERWEBHOOKTOKEN);

    if(message.channel.type === "dm") {
        if(message.author.id === EIN) {
            if(searchURL(message.content)) {
                let fencohee = findEmoji(client, 'fencohee');
                newChapter.send(`${fencohee} | ${message.content} <@&${NOTIFYROLE}>`)
            }
        }
    }

    if(message.channel.type === "dm" || message.channel.type === "group" || message.author.bot) return;

    const xpLogs = findChannel(client, XPLOGS);

    const LevelSystem = getLevel(message.author.id);
    const Experience = LevelSystem.experience;
    const Level      = LevelSystem.level;

    if(Experience < 0) LevelSystem.experience = 0;
    else if(Level < 0) LevelSystem.level = 0;

    LevelSystem.nextLevelXP = nextLevel(LevelSystem.level + 1);

    if(!message.content.startsWith(PREFIX)) {
        if (cooldownExp.has(message.author.id)) return;
        
        cooldownExp.add(message.author.id);
        setTimeout(() => {
            cooldownExp.delete(message.author.id);
        }, 5000);
    
        let xp = Math.round(Math.random() * 10 + 1);
        
        LevelSystem.experience += xp;
        xpLogs.send(`**${message.author.username}** received __${xp} exp__! :tada:`);
        console.log(`${message.author.username} received ${xp} exp!`);
    }

    const Message = getStats(message.author.id);

    Message.messages++;

    const warns = getWarnings(message.author.id);

    gibRole = (roleName) => {
        let role = client.guilds.get(GUILDID).roles.find(role => role.name === roleName);
        client.guilds.get(GUILDID).members.get(message.author.id).roles.add(role)
    }

    if(Level < 10) '';
    else if(Level < 20){
        gibRole('Mortal Soul');
    } else if(Level < 30){
        gibRole('Hero Soul');
    } else if(Level < 40){
        gibRole('Lord Soul');
    } else if(Level < 50){
        gibRole('Divine Soul');
    } else if(Level < 60){
        gibRole('Realm Soul');
    } else if(Level < 70){
        gibRole('Sage Soul');
    } else if(Level < 80){
        gibRole('Sovereign Soul');
    } else if(Level < 90){
        gibRole('Aspect Soul');
    } else if(Level < 100){
        gibRole('Origin Soul');
    } else if(Level > 100){
        gibRole('The Path');
    }

    if (Experience >= nextLevel(Level + 1)) {
        const level = Level;
        const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('./assets/images/bg.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
		ctx.font = '28px open-sans';
		ctx.fillStyle = '#ffffff';
		ctx.fillText('Congratulations,', canvas.width / 2.5, canvas.height / 3.5);
        
		ctx.font = applyText(canvas, message.author.username);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`${message.author.username}!`, canvas.width / 2.5, canvas.height / 1.8);
        
		ctx.font = '30px open-sans';
        ctx.fillStyle = '#ffffff';
		ctx.fillText(`You are now level ${level + 1}!`, canvas.width / 2.5, canvas.height / 1.25);
        
		ctx.font = '15px open-sans';
        ctx.fillStyle = '#ffffff';
		ctx.fillText(`EXPLOSIOOOOON!`, canvas.width / 1.9, canvas.height / 1.1);
		
		ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
		ctx.clip();
		
		const avatar = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`);
		ctx.drawImage(avatar, 25, 25, 200, 200);
        
        const attachment = canvas.toBuffer();
        
        xpLogs.send({ files: [{ attachment, name: 'levelup.png' }] })
        
        let xp = nextLevel(LevelSystem.level + 1);
        let res = Number.parseInt(LevelSystem.experience, 10) - Number.parseInt(xp, 10);
        if(res < 0) res = 0;
        LevelSystem.experience = res;
        LevelSystem.level = Number.parseInt(LevelSystem.level, 10) + 1;
    }
    setLevel(LevelSystem);
    setStats(Message);
    setWarnings(warns);
}