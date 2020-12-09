const db = require("better-sqlite3")("./database.db");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ad",
    aliases: ["reklama", "rek"],
    perm: "MANAGE_GUILD",
    run: async (bot, msg, args) => {
        const guildData = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(msg.guild.id);
        if (!guildData || !guildData.channel) return {
            type: "error",
            content: "Najpierw ustaw kanał reklam!"
        }

        const channel = msg.guild.channels.cache.get(guildData.channel);
        if (!channel) return {
            type: "error",
            content: "Najpierw ustaw kanał reklam!"
        }

        let blocked = false;

        await channel.permissionOverwrites.forEach(p => {
            const perms = channel.permissionsFor(p.id).serialize();
            if (perms["VIEW_CHANNEL"] === false || perms["READ_MESSAGE_HISTORY"] === false) blocked = true
        });

        if (blocked === true) return {
            type: "error",
            content: "Najpierw ustaw kanał reklam!"
        }

        const adStatus = db.prepare("SELECT * FROM adsCheck WHERE guildId = ?").get(msg.guild.id);

        if (adStatus) return {
            type: "error",
            content: "Reklama tego serwera czeka na weryfikacje!"
        }

        if (!args[0]) return {
            type: "error",
            content: "Podaj treść reklamy!"
        }

        const content = args.join(" ");

        if (content.length < 30) return {
            type: "error",
            content: "Treść reklamy musi mieć minimalnie 30 znaków"
        }

        if (msg.mentions.users.first() || msg.mentions.roles.first() || msg.content.includes("@everyone") || msg.content.includes("@here")) return {
            type: "error",
            content: "Reklama nie może zawierać wzmianek"
        }

        let errBlacklist = false;
        const blackList = ["discord.gg/", "discord.com/invite", "discordapp.com/invite", "nadsc.pl", "marketingbot.tk", "market-bot.pl"];

        blackList.forEach(word => {
            if (msg.content.includes(word)) errBlacklist = true;
        });

        if (errBlacklist === true) return {
            type: "error",
            content: "Reklama nie może zawierać linku do serwera, ponieważ bot doda go sam"
        }

        if (content.length > 1000) return {
            type: "error",
            content: "Treść reklamy może mieć maksymalnie 1000 znaków!"
        }
        db.prepare("INSERT INTO adsCheck (guildId, content, user) VALUES(?,?,?)").run(msg.guild.id, content, msg.author.id);
        db.prepare("UPDATE guilds SET ad = ? WHERE guildId = ?").run(content, msg.guild.id);

        const embed = new MessageEmbed()
            .setAuthor("Nowa reklama!", bot.user.displayAvatarURL())
            .setColor(bot.config.mainColor)
            .addField("**\`Osoba\`**", `\`${msg.author.tag} \` [\`(${msg.author.id})\` (<@!${msg.author.id}>)]`)
            .addField("**\`Serwer\`**", `\`${msg.guild.name} (${msg.guild.id})\``)
            .addField("**\`Zaproszenie\`**", `[\`${guildData.invite}\`](${guildData.invite})`)
            .addField("**\`Treść\`**", `${content}`)
            .setFooter(`System sprawdzania reklam ${bot.user.username}`)
        bot.channels.cache.get("745687783519158403").send(embed);

        return {
            type: "success",
            content: "Reklama została wysłana do weryfikacji"
        }
    }
}