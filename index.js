require('dotenv').config();
const { Client } = require('discord.js-commando');
const path = require('path');
const goodbye = require('./assets/json/goodbye');
const welcome = require('./assets/json/welcome');
const { MessageEmbed } = require('discord.js');
const { findChannel } = require('./util/Util');
const winston = require('winston');

const cmds = winston.createLogger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'commands.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
    )
})

const client = new Client({
    commandPrefix: process.env.PREFIX,
    owner: process.env.OWNERS.split(',')
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
    .on('commandError', (cmd, err) => require('./events/commandError')(cmd, err));

client.on('commandRun', (cmd, promise, msg) => {
    if(msg.channel.type == "dm") {
        cmds.info(`${msg.author.tag} (${msg.author.id}) ran the command ${cmd.name.toUpperCase()} in DM`);
    } else {
        cmds.info(`${msg.author.tag} (${msg.author.id}) ran the command ${cmd.name.toUpperCase()} in ${msg.guild.name} (${msg.guild.id})`);
    }
    
});

client.on('guildMemberRemove', async member => {
    const channel = member.guild.systemChannel;
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;

    const membersChannel = member.guild.channels.find(x => x.id == '579240274908413972')
    membersChannel.setName(`Members count: ${member.guild.memberCount}`);
    
    const ciao = goodbye[Math.floor(Math.random() * goodbye.length)];
	await channel.send(ciao.replace(/{{user}}/gi, `**${member.user.tag}**`));
});

client.on('guildMemberAdd', async member => {
    const channel = member.guild.systemChannel;
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;

    const membersChannel = member.guild.channels.find(x => x.id == '579240274908413972')
    membersChannel.setName(`Members count: ${member.guild.memberCount}`);

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

    return findChannel(guild, process.env.MODLOG).send(embed);
});

client.on('messageDelete', async (message) => {
    const logs = message.guild.channels.find(x => x.name === process.env.LOGS);

    if(message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        await message.guild.createChannel(process.env.LOGS, 'text');
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

    const logs = oldMessage.guild.channels.find(x => x.name === process.env.LOGS);

    if(oldMessage.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        await oldMessage.guild.createChannel(process.env.LOGS, 'text');
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

client.login(process.env.TOKEN);