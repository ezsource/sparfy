const { MessageEmbed } = require("discord.js");
const db = require("better-sqlite3")("./database.db");

module.exports = {
    name: "status",
    run: async (bot, msg) => {
        let prem = ""
        let linkStatus = "";
        let content = ""
        let status = ""
        let channel = ""
        const statsEmbed = new MessageEmbed()
        .setAuthor(`Status konfiguracji serwera ${msg.guild.name}`, msg.guild.iconURL() || bot.user.displayAvatarURL())
        .setColor(bot.config.mainColor);

        const guild = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(msg.guild.id);

        const premium = db.prepare("SELECT * FROM premium WHERE guildId = ?").get(msg.guild.id);

        const link = db.prepare("SELECT * FROM links WHERE guildId = ?").get(msg.guild.id);

        channel = guild.channel ? `<a:yes:762659666635128842><#${guild.channel}>` : "<a:745989621988458527:762659584351010856> \`Nie ustawiony\`";

        content = guild.ad ? guild.ad : "\`\`\`Nie ustawiona\`\`\`";

        const adCheck = db.prepare("SELECT * FROM adsCheck WHERE guildId = ?").get(msg.guild.id);

        const ad = db.prepare("SELECT * FROM ads WHERE id = ?").get(msg.guild.id);

        if (ad) {
            status = `<a:yes:762659666635128842> \`Reklama zweryfikowana!\`\n**\`Numer w kolejce: ${ad.number}\`**\n**\`Została wysłana ${ad.wyslana} razy\`**`;
        } else if (adCheck) {
            status = "<a:745989621988458527:762659584351010856> \`Reklama czeka na zweryfikowanie\`";
        } else {
            status = "<a:745989621988458527:762659584351010856> \`Reklama nie została ustawiona\`";
        }

        if (link) {
            linkStatus = `<a:yes:762659666635128842> \`Link ustawiony znajdziesz go\` [**tutaj**](${bot.config.www}${link.link})`;
        } else {
            linkStatus = "<a:745989621988458527:762659584351010856> \`Nie ustawiony!\`";
        }

        if (premium) {
            prem = "<a:yes:762659666635128842> \`Serwer posiada permium\`";
        } else {
            prem = "<a:745989621988458527:762659584351010856> \`Serwer nie posiada premium\`"
        }


        statsEmbed.addField("> **\`Kanał reklam\`**", channel);
        statsEmbed.addField("**\`Reklama\`**", `${status}\n\n${content}`);
        statsEmbed.addField("**\`Link\`**", linkStatus);
        statsEmbed.addField("**\`Premium\`**", prem);
        statsEmbed.setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
        msg.channel.send(statsEmbed)

    }
}