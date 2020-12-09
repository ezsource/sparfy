const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./database.db");
const { MessageEmbed } = require("discord.js");
const blacklist = ["\"", "'", "`"];

module.exports = {
    name: "prefix",
    permission: "MANAGE_GUILD",
    run: async (bot, msg, args) => {
        if (!args[0]) {
            const errArgs = new MessageEmbed()
            .setAuthor("Błędne użycie!", "https://cdn.discordapp.com/emojis/745989621988458527.gif?v=1")
            .setColor("RED")
            .setDescription(`\`Poprawny przykład użycia: ${msg.guild.prefix}prefix <nowy prefix>\``)
        return msg.channel.send(errArgs)
        }
        const prefix = args.join(" ");
        let blocked = false;
        blacklist.forEach(b => {
            if (prefix.includes(b)) return blocked = true;
        })
        if (blocked === true) {
            const errLength = new MessageEmbed()
            .setAuthor("Wystąpił błąd!", "https://cdn.discordapp.com/emojis/745989621988458527.gif?v=1")
            .setColor("RED")
            .setDescription(`\`Prefix zawiera zablokowane znaki!\``)
        return msg.channel.send(errLength);
        }
        if (prefix.length > 3) {
            const errLength = new MessageEmbed()
            .setAuthor("Wystąpił błąd!", "https://cdn.discordapp.com/emojis/745989621988458527.gif?v=1")
            .setColor("RED")
            .setDescription(`\`Prefix może mieć max 3 znaki!\``)
        return msg.channel.send(errLength);
        }
        msg.guild.prefix = prefix;
        db.run(`UPDATE guilds SET prefix = "${prefix}" WHERE guildId = "${msg.guild.id}"`)
        const sucessEmbed = new MessageEmbed()
        .setAuthor("Gotowe!", bot.user.displayAvatarURL())
        .setColor("#a412de")
        .setDescription(`\`Prefix został ustawiony na ${msg.guild.prefix}\``)
        msg.channel.send(sucessEmbed)
    }
}