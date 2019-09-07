const { Command } = require('discord.js-commando');
const kabu = require('../../assets/json/kabu');

module.exports = class KabuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kabu',
            group: 'random',
            memberName: 'kabu',
            aliases: [],
            description: 'Hate.',
            throttling: {
                usages: 1,
                duration: 600
            }
        });
    }

    sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000))
    }

    async run(msg) {
        for(let i = 0; i < 60; i++){
            msg.member.setNickname(kabu[Math.floor(Math.random() * kabu.length)]);
            await this.sleep(10);
        }
        msg.member.setNickname('');
    }
}