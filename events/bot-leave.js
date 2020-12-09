const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./database.db");

module.exports = (bot) => {
    bot.on("guildDelete", g => {
        db.run(`DELETE FROM guilds WHERE guildId = "${g.id}"`)
        db.run(`DELETE FROM reklamyCheck WHERE guildId = "${g.id}"`)
        db.run(`DELETE FROM premium WHERE guildId = "${g.id}"`)
            const channel = bot.channels.cache.get("745687784357888080")
            if (channel) {
                const { MessageEmbed } = require("discord.js")
                const embed = new MessageEmbed()
                .setAuthor("Wyrzucono bota!", g.iconURL({dynamic: true}) || bot.user.displayAvatarURL())
                .setColor(bot.config.errorColor)
                .addField("**\`Serwer\`**", `\`${g.name} | ${g.id}\``)
                .addField("**\`Ilość osób:\`**", `\`${g.memberCount}\``)
                channel.send(embed);
            }
    })
}