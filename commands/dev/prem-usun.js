const sqlite = require("sqlite3").verbose()
const db = new sqlite.Database("./database.db")
const config = require("../../config.json")

module.exports = {
    name: "prem-usun",
    run: async (bot, msg, args) => {
        if (!config.owners.includes(msg.author.id)) return;
        if (!args[0]) return msg.reply("Podaj id..")
        db.get(`SELECT * FROM premium WHERE guildId = "${args[0]}"`, (err, data) => {
            if (data === undefined) {
                return msg.reply("Ten serwer nie ma premium")
            }
            db.run(`DELETE FROM premium WHERE guildId = "${args[0]}"`)
            msg.reply("Gotowe!")
        })
    }
}