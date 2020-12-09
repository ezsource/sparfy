const db = require("better-sqlite3")("./database.db");
const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "replace",
    aliases: ["zamien", "zamień"],
    run: async (bot, msg, args) => {
        if (!msg.member.roles.cache.has("745687740292530176")) return {
            type: "error",
            content: "Nie jesteś weryfikatorem reklam!"
        }
        if (msg.channel.id !== "745687783519158403") return msg.author.send("<#745687783519158403>");

        if (!args[0]) return {
            type: "error",
            content: "Podaj id serwera!"
        }

        const check = db.prepare("SELECT * FROM adsCheck WHERE guildId = ?").get(args[0]);

        if (!check) return {
            type: "error",
            content: "Nie ma takiej reklamy do sprawdzenia!"
        }

        if (!args[1]) return {
            type: "error",
            content: "Podaj numer reklamy do podmiany!"
        }

        const checkNum = db.prepare("SELECT * FROM ads WHERE number = ?").get(Number(args[1]));
        if (!checkNum) return {
            type: "error",
            content: "Nie ma reklamy o tym numerze!"
        }

        const user = check.user;
        const guild = bot.guilds.cache.get(args[0]);
        if (!guild) {
            db.prepare("DELETE FROM adsCheck WHERE guildId = ?").run(args[0]);
            return {
                type: "error",
                content: "Bota nie ma na tym serwerze!"
            };
        }

        const guildData = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(args[0]);

        const userEmbed = new MessageEmbed()
            .setAuthor("Reklama zweryfikowana!", bot.user.displayAvatarURL())
            .setColor(bot.config.mainColor)
            .setDescription(`[**\`Reklama serwera ${guild.name} została dodana pod numer ${args[1]}\`**](${guildData.invite})`)
            .setFooter(`Weryfikator: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}));

        const channelEmbed = new MessageEmbed()
            .setAuthor("Reklama zaweyfikowana", bot.user.displayAvatarURL())
            .setColor(bot.config.mainColor)
            .setDescription(`**\`Reklama tego serwera została dodana pod numer ${args[1]}\`**`)
            .setFooter(`Weryfikator: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}));

        const statsEmbed = new MessageEmbed()
            .setAuthor("Reklama zweryfikowana", bot.user.displayAvatarURL())
            .setColor(bot.config.mainColor)
            .setDescription(`**\`Reklama serwera\`** [\`${guild.name}\`](${guildData.invite}) **\`została dodana pod numer ${args[1]}\`**`)
            .setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))

        guild.members.cache.get(user).send(userEmbed).catch(e => {
            console.log(e);
        });

        guild.channels.cache.get(guildData.channel).send(channelEmbed).catch(e => {
            console.log(e);
        });

        bot.channels.cache.get(bot.config.statsChannel).send(statsEmbed);

        db.prepare("UPDATE ads SET content = ? WHERE number = ?").run(check.content, Number(args[1]));
        db.prepare("UPDATE ads SET id = ? WHERE number = ?").run(args[0], Number(args[1]));

        return {
            type: "success",
            content: "Reklama została zamieniona"
        }

    }
};