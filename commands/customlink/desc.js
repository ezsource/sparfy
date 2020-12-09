const db = require("better-sqlite3")("./database.db");

module.exports = {
    name: "opis",
    aliases: ["desc"],
    permission: "MANAGE_GUILD",
    run: async (bot, msg, args) => {
        const link = db.prepare("SELECT * FROM links WHERE guildId = ?").get(msg.guild.id);

        if (!link) return {
            type: "error",
            content: "Najpierw ustaw link serwera!"
        }

        if (!args[0]) return {
            type: "error",
            content: "Podaj nowy opis!"
        }

        if (args.join(" ").length > 400) return {
            type: "error",
            content: "Link może mieć maksymalnie 400 znaków!"
        }

        db.prepare("UPDATE links SET desc = ? WHERE guildId = ?").run(args.join(" "), msg.guild.id);

        return {
            type: "success",
            content: "Opis został ustawiony!"
        }
    }
}