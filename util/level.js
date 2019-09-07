const { getLevel, setLevel } = require('./database');

module.exports = class levelSystem {
    static getLevel(id) {
        return getLevel(id).level;
    }
    
    static getExperience(id) {
        return getLevel(id).experience;
    }

    static getNextLevelXP(id) {
        return getLevel(id).nextLevelXP;
    }

    static setLevel(id, level) {
        let lvl = getLevel(id);
        lvl.level = Number(level);
        setLevel(lvl);
        return true;
    }

    static setExperience(id, experience) {
        let lvl = getLevel(id);
        lvl.experience = Number(experience);
        setLevel(lvl);
        return true;
    }

    static addLevel(id, level) {
        let lvl = getLevel(id);
        lvl.level += Number(level);
        setLevel(lvl);
        return true;
    }

    static addExperience(id, experience) {
        let lvl = getLevel(id);
        lvl.experience += Number(experience);
        setLevel(lvl);
        return true;
    }

    static removeLevel(id, level) {
        let lvl = getLevel(id);
        lvl.level -= Number(level);
        setLevel(lvl);
        return true;
    }

    static removeExperience(id, experience) {
        let lvl = getLevel(id);
        lvl.experience -= Number(experience);
        setLevel(lvl);
        return true;
    }
}