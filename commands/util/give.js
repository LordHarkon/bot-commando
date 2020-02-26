const {Command} = require('discord.js-commando');
const {getLevel, getExperience, setLevel, setExperience, setNextLevelXP, addExperience, removeExperience} = require('../../util/db');
const {nextLevel} = require('../../util/Util');

module.exports = class GiveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'give',
            memberName: 'give',
            group: 'util',
            description: 'Send to another user your experience. Every transfer is taxed by 15% of the total amount sent.',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'To which user would you like to give the experience?',
                    type: 'user'
                },
                {
                    key: 'experience',
                    prompt: 'How much experience would you like to give?',
                    type: 'integer',
                    validate: (experience) => {
                        experience = parseInt(experience);

                        if(experience <= 0) return `You cannot give less than 1 experience. Try again.`;
                        if(isNaN(experience)) return `The introduced experience is not a number. Try again.`;
                        return true;
                    }
                }
            ]
        });
    }

    async run(msg, {user, experience}) {
        let currExp = await getExperience(msg.author.id);
        let currLvl = await getLevel(msg.author.id);

        let finalExp = 0;
        let finalLvl = 0;

        let perc = (this.getAllExp(currLvl) + currExp * 15) / 100;
        let totalExperience = this.getAllExp(currLvl) + currExp;
        console.log('Percentage Experience: ', perc);
        console.log('Total Experience: ', totalExperience);
        console.log('All Experience: ', this.getAllExp(currLvl));

        if(experience > totalExperience) {
            experience = totalExperience;
            finalExp = 0;
        } else {
            finalExp = totalExperience - experience;
        }

        if(experience > currExp) {
            while(finalExp > nextLevel(finalLvl + 1)) {
                let next = nextLevel(finalLvl + 1);
                finalExp -= next;
                if(finalExp < 0) finalExp = 0;
                finalLvl += 1;
            }
            this.setLevelSystem(msg.author.id, finalLvl, Math.round(finalExp));
            addExperience(user.id, Math.round(experience - perc));
        } else {
            removeExperience(msg.author.id, Math.round(experience));
            addExperience(user.id, Math.round(experience - perc));
        }
        addExperience(process.env.OWNERS, Math.round(perc));
        await msg.reply(`You've sent ${Math.round(experience - perc)} experience to ${user.tag}. The 15% tax has been applied automatically.`);
    }

    getAllExp(level) {
        let total = 0;
        for(let i = 1; i <= level; i++) {
            total += nextLevel(i);
        }
        return total;
    }

    setLevelSystem(id, level, experience) {
        setLevel(id, level);
        setExperience(id, experience);
        setNextLevelXP(id, nextLevel(level + 1));
    }
};