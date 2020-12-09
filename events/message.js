const db = require("better-sqlite3")("./database.db");
const config = require("../config.json")
const { MessageEmbed } = require("discord.js")
const quick = require("quick.db");


module.exports = (bot) => {
    bot.on("message", async msg => {
        if (!msg.guild) return;
        if (msg.author.bot) return;
        if (!msg.guild.prefix) {
            const guild = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(msg.guild.id);

            if (!guild) {
                msg.guild.prefix = config.prefix;
                db.prepare("INSERT INTO guilds (guildId, prefix) VALUES(?,?)").run(msg.guild.id, config.prefix);
            } else {
                msg.guild.prefix = guild.prefix;
            }
        }

        if (msg.content === `<@!${bot.user.id}>` || msg.content === `<@${bot.user.id}>`) {
            const mentionEmbed = new MessageEmbed()
                .setAuthor(`Cześć ${msg.author.username}`, msg.author.displayAvatarURL({dynamic: true}))
                .setColor(bot.config.mainColor)
                .setDescription(`**\`Mój prefix na tym serwerze to ${msg.guild.prefix}\`**
                **__A spis moich komend zobaczysz jeśli wpiszesz ${msg.guild.prefix}pomoc__**`)
                .setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
            return msg.channel.send(mentionEmbed);
        }

        let msgPrefix = msg.guild.prefix;

        if (!msg.content.startsWith(msgPrefix)) msgPrefix = `<@${bot.user.id}>`;
        if (!msg.content.startsWith(msgPrefix)) msgPrefix = `<@!${bot.user.id}>`;
        if (!msg.content.startsWith(msgPrefix)) return ;

        const args = msg.content.slice(msgPrefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return ;

        let command = bot.commands.get(cmd);
        if (!command) command = bot.commands.get(bot.aliases.get(cmd));

        if (!command) return ;

        if (quick.get(`gban_${msg.author.id}`)) return ;

        if (command.perm && !msg.member.hasPermission(command.perm)) {
            if (bot.config.owners.includes(msg.author.id));
            else {
                const errorEmbed = new MessageEmbed()
                    .setAuthor("Błąd!", bot.user.displayAvatarURL())
                    .setColor(bot.config.errorColor)
                    .setDescription(`> \`Nie posiadasz permisji ${require("../perms.json")[command.perm]}\``)
                    .setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
                return msg.channel.send(errorEmbed);
            }
        }

        const res = await command.run(bot, msg, args).catch(e => {
            console.log(e + "F");
        });

        if (typeof res === "object") {
            if (res.type === "error") {
                const errorEmbed = new MessageEmbed()
                    .setAuthor("Błąd!", bot.user.displayAvatarURL())
                    .setColor(bot.config.errorColor)
                    .setDescription(`> \`${res.content}\``)
                    .setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
                return msg.channel.send(errorEmbed);
            } else if (res.type === "message") {
                return msg.channel.send(res.content);
            } else if (res.type === "success") {
                const successEmbed = new MessageEmbed()
                    .setAuthor("Sukces!", bot.user.displayAvatarURL())
                    .setColor(bot.config.mainColor)
                    .setDescription(`> \`${res.content}\``)
                    .setFooter(`Wykonano dla: ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
                return msg.channel.send(successEmbed);
            };
        }

    })
}