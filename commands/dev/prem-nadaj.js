const sqlite = require("sqlite3").verbose()
const db = new sqlite.Database("./database.db")
const { MessageEmbed } = require("discord.js")
const config = require("../../config.json")
module.exports = {
    name: "prem-nadaj",
    run: async (bot, msg, args) => {
        if (!config.owners.includes(msg.author.id)) return;
        if (!args[0]) {
            return msg.reply("Podaj id")
        }
        db.get(`SELECT * FROM premium WHERE guildId = "${args[0]}"`, (err, data) => {
            if (data !== undefined) {
                return msg.reply("Ten serwer posiada premium")
            } else {
                db.run(`INSERT INTO premium (guildId, premium) VALUES (?,?)`, args[0], true)
            }
            msg.reply("Gotowe!")
        })
    }
}