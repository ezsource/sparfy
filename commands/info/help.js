const { MessageEmbed } = require("discord.js")
const sqlite = require("sqlite3")
const db = new sqlite.Database("./database.db")

module.exports = {
    name: "pomoc",
    aliases: ["help", "p", "h"],
    run: async (bot, msg) => {
            //console.log(aaaemoji4)
            let links = `<:link:755508015238611046> \`${msg.guild.prefix}link <nazwa linku>\` - **Ustawia custom link do serwera**\n<:link:755508015238611046> \`${msg.guild.prefix}opis <treść opisu max 400 znaków>\` - **Ustawia opis serwera**`
            db.get(`SELECT * FROM premium WHERE guildId = "${msg.guild.id}"`, (err, prem) => {
                console.log(prem)
                if (prem !== undefined) {
                    links = `<:link:755508015238611046> \`${msg.guild.prefix}link <nazwa linku>\` - **Ustawia custom link do serwera**\n<:link:755508015238611046> \`${msg.guild.prefix}opis <treść opisu max 400 znaków>\` - **Ustawia opis serwera**\n<:link:755508015238611046> \`${msg.guild.prefix}tło <link do tła>\` - **Ustawia tło na stronie serwera**`
                }
            })
                const help1 = new MessageEmbed()
                .setAuthor("Ładowanie...", "https://cdn.discordapp.com/emojis/755507946804477996.gif?v=1")
                .setColor(bot.config.mainColor)
                
                const filter = (reaction, user) => {
                    return user.id == msg.author.id
                } 
                /*{name: "CUSTOM LINK:", value: `\`${msg.guild.prefix}link <nazwa linku>\` - **Ustawia custom link do serwera**\n\`${msg.guild.prefix}opis <treść opisu max 200 znaków>\` - **Ustawia opis serwera**\n`}*/
                msg.channel.send(help1).then(async m => {
                    const help = new MessageEmbed()
                .setAuthor("MENU POMOCY", "https://cdn.discordapp.com/emojis/724564075773952025.gif?v=1")
                .setColor(bot.config.mainColor)
                .addField("> **`CUSTOM LINK:`** <:link:755508015238611046> ", "** **")
                .addField("> **`REKLAMOWANIE:`** <a:reklamowe:759552073296511036>", `** **`)
                .addField("> **`KONFIGURACJA:`** <a:konfiguracja:759553275010875392>", `** **`)
                .addField("> **`INFORMACYJNE:`** <a:info:759555349241004063>", `** **`)
                .addField("> **`LINKI:`** ", `<:arp:762996043914543144> [\`Serwer wsparcia\`](https://discord.gg/SmCx55n)\n<:arp:762996043914543144> [\`Zaproszenie bota na serwer\`](https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)\n<:arp:762996043914543144> [\`Strona internetowa\`](https://sparfy.pl)`)
                   await  m.react(":link:755508015238611046"), await m.react("a:reklamowe:759552073296511036"), await m.react("a:konfiguracja:759553275010875392"), await m.react("a:info:759555349241004063")
                    m.edit(help)
                    let status = 0
                    const customlink = new MessageEmbed()
                    .setAuthor("MENU POMOCY", "https://cdn.discordapp.com/emojis/724564075773952025.gif?v=1")
                    .setColor(bot.config.mainColor)
                    .addField("> **`KOMENDY:`**", links)
                   .addField("> **`LINKI:`** ", `<:arp:762996043914543144> [\`Serwer wsparcia\`](https://discord.gg/SmCx55n)\n<:arp:762996043914543144> [\`Zaproszenie bota na serwer\`](https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)\n<:arp:762996043914543144> [\`Strona internetowa\`](https://sparfy.pl)`)

                    const ads = new MessageEmbed()
                    .setAuthor("MENU POMOCY", "https://cdn.discordapp.com/emojis/724564075773952025.gif?v=1")
                    .setColor(bot.config.mainColor)
                    .addField("> **`KOMENDY:`**", `<a:reklamowe:759552073296511036> \`${msg.guild.prefix}kanał <#kanał>\` - **Ustawia kanał reklam bota <@!${bot.user.id}> na serwerze**\n<a:reklamowe:759552073296511036> \`${msg.guild.prefix}reklama <treść>\` - **Ustawia reklamę serwera w bocie <@!${bot.user.id}>**`)
                   .addField("> **`LINKI:`** ", `<:arp:762996043914543144> [\`Serwer wsparcia\`](https://discord.gg/SmCx55n)\n<:arp:762996043914543144> [\`Zaproszenie bota na serwer\`](https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)\n<:arp:762996043914543144> [\`Strona internetowa\`](https://sparfy.pl)`)
                    const conf = new MessageEmbed()
                    .setAuthor("MENU POMOCY", "https://cdn.discordapp.com/emojis/724564075773952025.gif?v=1")
                    .setColor(bot.config.mainColor)
                    .addField("> **`KOMENDY:`**", `<a:konfiguracja:759553275010875392> \`${msg.guild.prefix}prefix <nowy prefix>\` - **Ustawia prefix dla serwera**`)
                   .addField("> **`LINKI:`** ", `<:arp:762996043914543144> [\`Serwer wsparcia\`](https://discord.gg/SmCx55n)\n<:arp:762996043914543144> [\`Zaproszenie bota na serwer\`](https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)\n<:arp:762996043914543144> [\`Strona internetowa\`](https://sparfy.pl)`)

                    const info = new MessageEmbed()
                    .setAuthor("MENU POMOCY", "https://cdn.discordapp.com/emojis/724564075773952025.gif?v=1")
                    .setColor(bot.config.mainColor)
                    .addField("> **`KOMENDY:`**", `<a:info:759555349241004063> \`${msg.guild.prefix}status\` - **Pokazuje status konfiguracji serwera**`)
                   .addField("> **`LINKI:`** ", `<:arp:762996043914543144> [\`Serwer wsparcia\`](https://discord.gg/SmCx55n)\n<:arp:762996043914543144> [\`Zaproszenie bota na serwer\`](https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)\n<:arp:762996043914543144> [\`Strona internetowa\`](https://sparfy.pl)`)
                    

                    const collector = m.createReactionCollector(filter, { time: 20000 })

                    collector.on("collect", (reaction, user) => {
                        reaction.users.remove(user.id)
                        if (user.id !== msg.author.id) return;
                        if (reaction.emoji.id === "755508015238611046") {
                            status = 1
                            m.edit(customlink)
                            
                        }
                        if (reaction.emoji.id === "759552073296511036") {
                            status = 1
                            m.edit(ads)
                            
                        }
                        if (reaction.emoji.id === "759553275010875392") {
                            status = 1
                            m.edit(conf)
                            
                        }
                        if (reaction.emoji.id === "759555349241004063") {
                            status = 1
                            m.edit(info)
                            
                        }

                    })

                    collector.on("end", collected => {
                        if (status === 1) {
                            m.reactions.removeAll()
                        } else {
                            m.edit(help.setFooter(`Czas na dodanie reakcji minął`, "https://cdn.discordapp.com/emojis/745989621988458527.gif?v=1"))
                            m.reactions.removeAll()
                        }
                    })
                })
        
    }
}