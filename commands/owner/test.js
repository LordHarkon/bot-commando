const { Command } = require('discord.js-commando');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { getLevel, getExperience, addLevel } = require('../../util/db');

module.exports = class testCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'owner',
            memberName: 'test',
            description: 'test',
            description: 'This is the description of the command.',
            details: 'These are the details of the command.',
            examples: ['test boio'],
            throttling: {
                usages: 1,
                duration: 3600
            }
        })
    }

    hasPermission(msg) {
        return this.client.guilds.get(process.env.GUILDID).members.get(msg.author.id).roles.find(x => x.name === 'Passed') || this.client.isOwner(msg.author.id);
    }

    async run(msg) {
        // if(state === 'joining' || state === 'join'){
        //     this.client.emit('guildMemberAdd', msg.member || await msg.guild.fetchMember(user));
        // } else if(state === 'leaving' || state === 'leave') {
        //     this.client.emit('guildMemberRemove', msg.member || await msg.guild.fetchMember(user));
        // } else if(state === 'ban') {
        //     this.client.emit('guildBanAdd', msg.member || await msg.guild.fetchMember(user));
        // } else if(state === 'unban') {
        //     this.client.emit('guildBanRemove', msg.member || await msg.guild.fetchMember(user));
        // }
        // const kanna = new WebhookClient('622096496241803294', 'bM1pOSrpuFRoMt9kLkrHTJHExYrD3gV3CrBlBRcMXIcYY0JNoVDLMCMcqgWV05cffVwb');

        // kanna.send('This is a test.');
        let lvl = await getLevel(msg.author.id);
        let xp = await getExperience(msg.author.id);

        addLevel(msg.author.id, 1);

        console.log(lvl);
        console.log(xp);
        msg.say(`Level: ${lvl}\nExperience: ${xp}`);
    }
}