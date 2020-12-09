const config = require("../config.json")
const db = require("better-sqlite3")("./database.db");
const { MessageEmbed } = require("discord.js");
const fs = require("fs")

const isPremium = (id) => {
    const premium = db.prepare("SELECT * FROM premium WHERE guildId = ?").get(id);

    if (!premium) return false;
    if (premium) return true;
}

const supportInfo = (guild, content, client) => {
    const supportEmbed = new MessageEmbed()
        .setAuthor("Support Info", client.user.displayAvatarURL())
        .addField("**`Serwer`**", `\`${guild ? guild.name || "Error" : "Error"} (${guild ? guild.id || "Error" : "Error"})\``)
        .addField("**`Treść`**", `\`${content}\``)
        .setFooter(`Support Info ${client.user.username}`)
     client.channels.cache.get("776743014323191828").send(supportEmbed);
}

module.exports = (bot) => {
    bot.on("ready",  () => {
        setInterval( () => {

            let ad = db.prepare("SELECT * FROM ads WHERE number = ?").get(`${config.number}`);

            if (!ad) config.number = 1;
             fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
            ad = db.prepare("SELECT * FROM ads WHERE number = ?").get(`${config.number}`);

            if (!ad) return;
            const guild = bot.guilds.cache.get(ad.id);

            const guildData = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(ad.id);

            if (!guild || !guildData) return config.number = Number(config.number) +1,  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4)),  supportInfo(guild, `Brak bota lub ukryty kanał reklam na serwerze numer reklamy: ${ad.number}`, bot)

            const channel = guild.channels.cache.get(guildData.channel);

            if (!channel) return config.number = config.number + 1,  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4)),  supportInfo(guild, `Brak bota lub ukryty kanał reklam na serwerze numer reklamy: ${ad.number}`, bot);

            let blocked = false;

            channel.permissionOverwrites.forEach(p => {
                if (!p || !channel.permissionsFor(p.id)) return;
                const perms = channel.permissionsFor(p.id) ? channel.permissionsFor(p.id).serialize() : null;
                if (perms === null || perms["VIEW_CHANNEL"] === false || perms["VIEW_CHANNEL"] === null || perms["READ_MESSAGE_HISTORY"] === false || perms["READ_MESSAGE_HISTORY"] === null) blocked = true
            });

            if (blocked === true) return config.number = config.number + 1,  fs.writeFileSync("./config.json", JSON.stringify(config, null, 4)),  supportInfo(guild, `Brak bota lub ukryty kanał reklam na serwerze numer reklamy: ${ad.number}`, bot);

            db.prepare("UPDATE ads SET wyslana = ? WHERE id = ?").run(Number(ad.wyslana) + 1, guild.id);

            bot.guilds.cache.forEach(g => {
                const gData = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(g.id);
                if (!gData || !gData.channel) return ;
                const adChannel = g.channels.cache.get(gData.channel);
                if (!adChannel) return ;

                if (isPremium(guild.id) === false) {
                    adChannel.send(`\`Numer: ${config.number} Id: ${guild.id} Zaproszenie:\` ${guildData.invite}
                    
                    ${ad.content}`).catch(e => console.log(e));
                } else {
                    const adEmbed = new MessageEmbed()
                        .setAuthor(`Reklama PREMIUM || ${config.number}`)
                        .setColor(bot.config.mainColor)
                        .setDescription(ad.content)
                        .addField("**\`Zaproszenie\`**", `[**\`${guildData.invite}\`**](${guildData.invite})`)
                    adChannel.send(adEmbed).catch(e => {console.log(e)});
                }

            })

            config.number = config.number + 1;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        }, 5 * 60 * 1000);
    });
}