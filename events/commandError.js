const { FriendlyError } = require('discord.js-commando');

module.exports = (cmd, err) => {
    if(err instanceof FriendlyError) return;
    console.error(`[ERROR] Error in command ${cmd.groupID}:${cmd.memberName}`, err);
}