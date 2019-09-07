const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class testCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'owner',
            memberName: 'test',
            description: 'test',
            ownerOnly: true,
            description: 'This is the description of the command.',
            details: 'These are the details of the command.',
            examples: ['test boio'],
            throttling: {
                usages: 1,
                duration: 3600
            },
            args: [
                {
                    type: 'user',
                    prompt: 'User?',
                    key: 'user'
                },
                {
                    type: 'string',
                    prompt: "Leaving? Joining?",
                    key: 'state',
                    oneOf: ['leaving', 'joining', 'leave', 'join', 'ban', 'unban']
                }
            ]
        })
    }

    async run(msg, { user, state }) {
        if(state === 'joining' || state === 'join'){
            this.client.emit('guildMemberAdd', msg.member || await msg.guild.fetchMember(user));
        } else if(state === 'leaving' || state === 'leave') {
            this.client.emit('guildMemberRemove', msg.member || await msg.guild.fetchMember(user));
        } else if(state === 'ban') {
            this.client.emit('guildBanAdd', msg.member || await msg.guild.fetchMember(user));
        } else if(state === 'unban') {
            this.client.emit('guildBanRemove', msg.member || await msg.guild.fetchMember(user));
        }
        
    }
}