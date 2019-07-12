const { MessageEmbed } = require('discord.js');
const { applyText, nextLevel, findChannel } = require('../util/Util');
const { XPLOGS } = process.env;
const db = require('../util/database.js');
const Canvas = require('canvas');
const { PREFIX, GUILDID } = process.env;
const cooldownExp = new Set();

module.exports = async (message) => {
    if(message.channel.type === "dm" || message.channel.type === "group" || message.author.bot) return;

    const client = message.client;
    const member = message.author;
    const xpLogs = findChannel(client, XPLOGS);

    const LevelSystem = db.getLevel(message.author.id);
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

    const Message = db.getStats(message.author.id);

    Message.messages++;

    const warns = db.getWarnings(message.author.id);

    gibRole = (roleName) => {
        let role = client.guilds.get(GUILDID).roles.find(role => role.name === roleName);
        message.guild.member(message.author).addRole(role);
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
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./bg.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px open-sans';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Congratulations,', canvas.width / 2.5, canvas.height / 3.5);

        ctx.font = applyText(canvas, `${member.username}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.username}!`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.font = '30px open-sans';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`You are now level ${Level + 1}!`, canvas.width / 2.5, canvas.height / 1.25);

        const kek = await Canvas.loadImage('./b.png');
        ctx.drawImage(kek, canvas.width / 1.12, canvas.height / 1.63, 50, 50);

        ctx.font = '15px open-sans';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`EXPLOSIOOOOON!`, canvas.width / 1.9, canvas.height / 1.1);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.displayAvatarURL);
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'levelup.png');
        // xpLogs.send(attachment);

        let xp = nextLevel(Level + 1);
        let res = Experience - xp;
        if(res < 0) res = 0;
        LevelSystem.experience = res;
        LevelSystem.level++;
    }
    db.setLevel(LevelSystem);
    db.setStats(Message);
    db.setWarnings(warns);
}