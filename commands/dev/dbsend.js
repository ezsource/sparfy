const config = require("../../config.json")

module.exports = {
    name: "dbsend",
    run: async (client, msg, args) => {
        if (!config.owners.includes(msg.author.id)) return;
        msg.channel.send("Plik bazy danych", {
            files: [`./database.db`]
        })
    }
}