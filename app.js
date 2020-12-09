const { Client, Collection } = require("discord.js")
const fs = require("fs");
const { token } = require("./config.json");

class Bot extends Client {
    constructor(options) {
        super(options);

        this.config = require("./config.json");

        this.commands = new Collection();

        this.aliases = new Collection();

        fs.readdirSync("./handlers/").forEach(handler => {
            require(`./handlers/${handler}`)(this);
        });

        require("./web")(this);

        this.login(token).then(async () => {
            console.log("Connecting to discord API Gateway");
        })
    }
}

global.Sparfy = new Bot({shards: "auto", ws: { intents: ["GUILD_MEMBERS", "GUILDS", "GUILD_EMOJIS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"] }});