const express = require("express")
const app = express()
const config = require("./config.json")
const db = require("better-sqlite3")("./database.db");

module.exports = (bot) => {
    app.use(express.static(`${__dirname}/public`))
    app.set("view engine", "ejs")
    app.get("/", (req, res) => {
        res.render("main.ejs", {
            bot: bot
        })
    })

    app.get("/:link", async (req, res) => {
        const link = req.params.link;
        const linkData = db.prepare("SELECT * FROM links WHERE link = ?").get(link);
        if (!linkData) return res.render("404");
        const guild = bot.guilds.cache.get(linkData.guildId);
        const guildData = db.prepare("SELECT * FROM guilds WHERE guildId = ?").get(guild.id);
        res.render("server", {
            name: guild.name,
            icon: guild.iconURL({dynamic: true}) || "",
            desc: linkData.desc || "Brak opisu",
            background: linkData.background,
            invite: guildData.invite
        })
    })

    app.get("/partnerzy/lecraft", (req, res) => {
        res.render("lecraft")
    })

    app.get("/partnerzy/gifland", (req, res) => {
        res.render("gitland.ejs")
    })

    app.listen(config.port, () => {
        console.log(`Page is run on ${config.port}`)
    })
}

