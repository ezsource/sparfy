const db = require("better-sqlite3")("./database.db");
module.exports = {
    name: "tlo",
    aliases: ["tło"],
    perm: "MANAGE_GUILD",
    run: async (bot, msg, args) => {

        const prem = db.prepare("SELECT * FROM premium WHERE guildId = ?").get(msg.guild.id);

        if (!prem) return {
            type: "error",
            content: "Serwer nie posiada premium!"
        }

        const link = db.prepare("SELECT * FROM links WHERE guildId = ?").get(msg.guild.id)

        if (!link) return {
            type: "error",
            content: "Najpierw ustaw link serwera!"
        }

        if (!args[0]) return {
            type: "error",
            content: "Podaj link do tła!"
        }

        if (!new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpg|png)/g).test(args[0])) return {
            type: "error",
            content: "Podaj poprawny link!"
        }

        db.prepare("UPDATE links SET background = ? WHERE guildId = ?").run(args[0], msg.guild.id);

        return {
            type: "success",
            content: "Tło zostało ustawione!"
        }

    }
}
