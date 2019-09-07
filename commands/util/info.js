const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber } = require('../../util/Util');
const { version, dependencies } = require('../../package');

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['stats', 'uptime'],
			group: 'util',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS'],
            throttling: {
                usages: 1,
                duration: 2
            }
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©Mors et Vita#5324')
			.addField('❯ Commands', formatNumber(this.client.registry.commands.size), true)
            .addField('❯ Home Server', `[Here](https://discord.gg/mn5xMbE)`, true)
            .addField('❯ Source Code', 'N/A', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('hh:mm:ss', { trim: false }), true)
			.addField('❯ Node Version', process.version, true)
			.addField('❯ Dependencies', this.parseDependencies());
		return msg.embed(embed);
    }
    
    parseDependencies() {
		return Object.entries(dependencies).map(dep => {
			if (dep[1].startsWith('github:')) {
				const repo = dep[1].replace('github:', '').split('/');
				return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
			}
			return `[${dep[0]}](https://npmjs.com/${dep[0]})`;
		}).join(', ');
	}
};