const db = require("better-sqlite3")("./database.db");
module.exports = {
    name: "link",
    perm: "MANAGE_GUILD",
    run: async (bot, msg, args) => {
        if (!args[0]) return {
            type: "error",
            content: "Podaj nazwę linku!"
        }

        if (new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/).test(args[0].toLowerCase())) return {
            type: "error",
            content: "Link nie może zawierać znaków specjalnych!"
        }

        if (args[0].length > 10) return {
            type: "error",
            content: "Link może mieć maksymalnie 10 znaków!"
        }

        const link = db.prepare("SELECT * FROM links WHERE guildId = ?").get(msg.guild.id);

        let errored = false;

        try {
            var invite = await msg.channel.createInvite({maxAge: 0});
        } catch (e) {
            errored === true;
        }

        if (errored ===  true) return {
            type: "error",
            content: "Bot nie mogł stworzyć zaproszenia!"
        }

        if (!link) {
            db.prepare("UPDATE guilds SET invite = ? WHERE guildId = ?").run(`https://discord.gg/${invite.code}`, msg.guild.id);
            db.prepare("INSERT INTO links (guildId, link, background) VALUES(?,?,?)").run(msg.guild.id, args[0].toLowerCase(), "https://cdn.discordapp.com/attachments/765894553366298644/779411723538399242/To_sparfy.png");
        } else {
            db.prepare("UPDATE links SET link = ? WHERE guildId = ?").run(args[0].toLowerCase(), msg.guild.id);
            db.prepare("UPDATE guilds SET invite = ? WHERE guildId = ?").run(`https://discord.gg/${invite.code}`, msg.guild.id);
        }

        return {
            type: "success",
            content: `Link został ustawiony!\`\n> [\`Znajdziesz go tutaj\`](${bot.config.www}${args[0].toLowerCase()})`
        }
    }
}