const { MessageEmbed } = require("discord.js")
const db = require("better-sqlite3")("./database.db");

module.exports = {
    name: "channel",
    aliases: ["kanał", "kanal"],
    perm: "MANAGE_GUILD",
    run: async (bot, msg, args) => {
        const channel = msg.mentions.channels.first();

        if (!channel || !msg.guild.channels.cache.get(channel.id) || channel.type !== "text") return {
            type: "error",
            content: "Musisz oznaczyć kanał!"
        }


        let blocked = false;
        await channel.permissionOverwrites.forEach(p => {
            const perms = channel.permissionsFor(p.id).serialize();
            if (perms["VIEW_CHANNEL"] === false || perms["READ_MESSAGE_HISTORY"] === false) blocked = true
        });

        if (blocked === true) return {
            type: "error",
            content: "Kanał reklam musi być widoczny dla WSZYSTKICH"
        }

        let errored = false;


        try {
            await channel.updateOverwrite(msg.guild.id, {
                SEND_MESSAGES: false
            })
        } catch (e) {
            errored = true;
        }
        

        try {
            var invite = await channel.createInvite({maxAge: 0})
        } catch (e) {
            errored = true;
        }

        if (errored === true) return {
            type: "error",
            content: "Bot nie mogł ustawić permisji lub stworzyć zaproszenia!"
        }

        const guildData = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(msg.guild.id);

        if (guildData) {
            db.prepare("UPDATE guilds SET channel = ? WHERE guildId = ?").run(channel.id, msg.guild.id);
            db.prepare("UPDATE guilds SET invite = ? WHERE guildId = ?").run(`https://discord.gg/${invite.code}`, msg.guild.id);
        } else {
            db.prepare("INSERT INTO guilds (guildId, channel, invite) VALUES(?,?,?)").run(msg.guild.id, channel.id, `https://discord.gg/${invite.code}`);
        }

        return {
            type: "success",
            content: "Kanał reklam został ustawiony!"
        }


    }
}