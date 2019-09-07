require('dotenv').config();
const { PREFIX, OWNERS, TOKEN, MODLOG, LOGS } = process.env;
const { Client } = require('discord.js-commando');
const path = require('path');
const goodbye = require('./assets/json/goodbye');
const welcome = require('./assets/json/welcome');
const { MessageEmbed } = require('discord.js');
const { findChannel } = require('./util/Util');

const client = new Client({
    commandPrefix: PREFIX,
    owner: OWNERS.split(',')
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['economy', 'Economy'],
        ['games', 'Games'],
        ['general', 'General'],
        ['image', 'Random Images'],
        ['info', 'Information'],
        // ['misc', 'Misc'],
        ['mod', 'Moderation'],
        ['nsfw', 'Lewds (NSFW) - DM Only'],
        ['owner', 'Owner Only Commands'],
        ['random', 'Random'],
        // ['polls', 'Polls'],
        ['response', 'responsive'],
        ['util', 'Utility']
    ])
    .registerDefaultCommands({
        help: false,
		ping: false,
        prefix: false,
        eval_: false,
		commandState: false,
        unknownCommand: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client
    .on('ready', () => require('./events/ready')(client))
    .on('message', (message) => require('./events/message')(message))
    .on('disconnected', () => require('./events/disconnected'))
    .on('reconnecting', () => require('./events/reconnecting'))
    .on('commandError', (cmd, err) => require('./events/commandError')(cmd, err))

client.on('guildMemberRemove', async member => {
    const channel = member.guild.systemChannel;
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;

    const ciao = goodbye[Math.floor(Math.random() * goodbye.length)];
	await channel.send(ciao.replace(/{{user}}/gi, `**${member.user.tag}**`));
});

client.on('guildMemberAdd', async member => {
    const channel = member.guild.systemChannel;
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;

    const hello = welcome[Math.floor(Math.random() * welcome.length)];
    await channel.send(hello.replace(/{{user}}/gi, `**${member.user.tag}**`));
});

client.on('guildBanAdd', (guild, user) => {
    console.log(guild)
    const embed = new MessageEmbed()
        .setTitle('Recent Moderation - Report!')
        .setAuthor('Staff')
        .setColor(0x800080)
        .setTimestamp()
        .addField('Action:', 'Ban')
        .addField('User:', `${user.username}#${user.discriminator} (ID: ${user.id})`);

    return findChannel(guild, MODLOG).send(embed);
});

client.on('messageDelete', async (message) => {
    const logs = message.guild.channels.find(x => x.name === LOGS);

    if(message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        await message.guild.createChannel(LOGS, 'text');
    };

    if(!logs) {
        return console.log('I cannot find or create a logs channel.');
    };

    const entry = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE'
    }).then(audit => audit.entries.first());

    let user = entry.executor;

    const embed = new MessageEmbed()
        .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL({size: 2048}))
        .addField(`Channel:`, `<#${message.channel.id}>`)
        .addField(`Message's User:`, `${message.author.tag} (${message.author.id})`)
        .addField(`__Deleted__ Message:`, `${message.content}`)
        .setColor(0x0C0C0C)
        .setTimestamp()
        .setFooter(`Message Deleted`, `https://i.imgur.com/va5JmT1.png`)

        logs.send(embed);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if(oldMessage.author.bot || oldMessage.channel.type === 'dm') return null;

    const logs = oldMessage.guild.channels.find(x => x.name === LOGS);

    if(oldMessage.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        await oldMessage.guild.createChannel(LOGS, 'text');
    };

    if(!logs) {
        return console.log('I cannot find or create a logs channel.');
    };

    var embed = new MessageEmbed()
        .setAuthor(`${oldMessage.author.tag} (${oldMessage.author.id})`, oldMessage.author.displayAvatarURL({size: 2048}))
        .addField(`Channel:`, `<#${oldMessage.channel.id}>`)
        .addField(`__Old__ Message:`, oldMessage.content)
        .addField(`__New__ Message:`, newMessage.content)
        .setColor(0xBE1931)
        .setTimestamp()
        .setFooter(`Message Edited`, 'https://i.imgur.com/UH7uGFg.png');

    
    logs.send(embed);
})

client.login(TOKEN);