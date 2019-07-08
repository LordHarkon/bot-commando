module.exports = (client) => {
    console.log(`[READY] Logged in as ${client.user.tag} (${client.user.id})`);
    client.user.setActivity({name: '>help', type:'WATCHING'});
}