const db = require("better-sqlite3")("./database.db");
const config = require("../config.json")

module.exports = (bot) => {
    bot.on("ready", () => {
        console.log(`Logged in as ${bot.user.tag}`)
        let guilds = 0
        bot.user.setPresence({ activity: { name: `${config.prefix}pomoc | @${bot.user.username} | v3.5.1 ` }, status: 'dnd' });
        bot.guilds.cache.forEach(g => {
            if (!g.prefix) {
                const data = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(g.id);
                if (!data || !data.prefix) {
                    db.prepare("INSERT INTO guilds (guildId, prefix) VALUES (?,?)").run(g.id, config.prefix);
                    g.prefix = config.prefix;
                } else {
                    g.prefix = data.prefix;
                }
            }
        })
    })
}