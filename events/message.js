const Discord = require('discord.js');
const { applyText, nextLevel, findChannel } = require('../util/Util');
const { XPLOGS } = process.env;
const { getLevel, getStats, getWarnings, setLevel, setStats, setWarnings } = require('../util/database.js');
const Canvas = require('canvas');
const { PREFIX, GUILDID } = process.env;
const cooldownExp = new Set();

module.exports = async (message) => {
    if(message.channel.type === "dm" || message.channel.type === "group" || message.author.bot) return;

    const client = message.client;
    const member = message.author;
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
        xpLogs.send(`<@${member.id}>, Congratulations, you are now level ${Level + 1}! :tada:`);
        
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