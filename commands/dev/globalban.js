const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const config = require("../../config.json");

module.exports = {
    name: "gban",
    aliases: ["globalban", "global-ban"],
    run: async (bot, msg, args) => {
        if (!config.owners.includes(msg.author.id)) return;
        if (!args[0]) return msg.channel.send(`<a:745989621988458527:762659584351010856> **Podaj id osoby!**`)
        const m = await msg.channel.send("<a:ban:759776566439444500> **Nadaje gbana proszę czekać!**")
        bot.guilds.cache.forEach(g => {
            if (g.ownerID === args[0]) g.leave();
        })
        db.set(`gban_${args[0]}`, true);
        m.edit("<a:yes:762659666635128842> **Global ban nadany!**")
    }
}