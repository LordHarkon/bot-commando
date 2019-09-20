const { Command } = require('discord.js-commando');
const { stripIndent } = require('common-tags');
const { removeMoney, addMoney, balance } = require('../../util/db');
const { formatNumber } = require('../../util/Util');

const Roulette = require('../../structures/Roulette');

const colors = {
    red: 0xBE1931,
    black: 0x0C0C0C
};

module.exports = class RouletteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roulette',
            group: 'games',
            memberName: 'roulette',
            description: 'Play a game of roulette to win some Fens!',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 30
            },
            args: [
                {
                    key: 'bet',
                    prompt: `How many Fens do you wish to bet?`,
                    type: 'integer',
                    validate: async (bet, msg) => {
                        const bal = await balance(msg.author.id);

                        if(bal < bet) return stripIndent`You don't have enough Fens to bet.
                        Your current account balance: ${bal} Fens.
                        Please specify a valid amount of Fens.
                        `
                        if(![100, 200, 300, 400, 500, 1000, 2000, 5000].includes(Number(bet))) return stripIndent`Your bet can only be one of the following values: \`100, 200, 300, 400, 500, 1000, 2000, 5000\`.`
                        return true;
                    }
                },
                {
                    key: 'space',
                    prompt: 'What space do you want to bet on?',
                    type: 'string',
                    validate: space => {
                        if(!Roulette.hasSpace(space)) return stripIndent`Invalid space, please enter either a specific number from 0-36, a range of dozens (e.g. 1-12), a range of halves (e.g. 1-18), a column (e.g. 1st), a color (e.g. black), or a parity (e.g. even).
                        `;
                        return true;
                    },
                    parse: str => str.toLowerCase()
                }
            ]
        })
    }

    run(msg, { bet, space }) {
        let roulette = Roulette.findGame(msg.guild.id);

        if(roulette) {
            if(roulette.hasPlayer(msg.author.id)) {
                return msg.reply(`you have already put a bet in this game of roulette. Please wait for the current game to finish.`);
            }

            roulette.join(msg.author, bet, space);
            removeMoney(msg.author.id, bet)
            return msg.reply(`you have successfully placed your bet of ${bet} Fens on ${space}.`);
        }

        roulette = new Roulette(msg.guild.id);
        roulette.join(msg.author, bet, space);
        removeMoney(msg.author.id, bet)

        return msg.say(stripIndent`
            A new game of roulette has been initiated!
            Use ${msg.usage()} in the next 30 seconds to place your bet.
        `)
            .then(async () => {
                setTimeout(() => msg.say(`20 seconds left before betting is closed.`), 10000);
                setTimeout(() => msg.say(`10 seconds left before betting is closed.`), 20000);
                setTimeout(() => msg.say(`5 seconds left before betting is closed.`), 25000);
                setTimeout(() => msg.say(`The roulette starts spinning!`), 29500);

                var winners = await roulette.awaitPlayers(31000);

                winners = winners.filter(player => player.winnings > 0);

                winners.forEach(winner => {
                    addMoney(winner.user.id, winner.winnings);
                });

                return msg.embed({
                    color: colors[roulette.winSpaces[1]] || null,
                    description: stripIndent`
                        The ball landed on: **${roulette.winSpaces[1]
                        ? roulette.winSpaces[1]
                        : ''} ${roulette.winSpaces[0]}**!
                        ${winners.length === 0 ? '__**No winner.**__' : `__**Winners:**__ ${winners.map(winner => `${winner.user.username} won ${formatNumber(winner.winnings)} Fens.`).join('\n')}`}`
                });
            });
    }
}