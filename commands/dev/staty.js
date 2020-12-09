module.exports = {
    name: "staty",
    run: async (bot, msg, args) => {
        if (!bot.config.owners.includes(msg.author.id)) return {
            type: "error",
            content: "Nie jesteś właścicielem bota!"
        }

        return {
            type: "success",
            content: `Liczba serwerów: ${bot.guilds.cache.size}\`\n> \`Liczba użytkowników: ${bot.users.cache.size}`
        }
    }
}