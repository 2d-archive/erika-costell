const Event = require("../structures/Event");
const { MessageEmbed } = require("discord.js");

module.exports = class ReadyEvent extends Event {
  constructor() {
    super("command-parser", {
      event: "message"
    });
  }

  /**
   * Message Event (client#on("message"))
   * @param {import("discord.js").Message} message
   */
  async exec(message) {
    if (!message.content.startsWith("erika ")) return;

    const args = message.content.slice("erika ".length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command = this.client.commands.find(c => c.aliases.includes(cmd));

    if (!command) return;
    if (command.guildOnly && message.channel.type === "dm") return;

    try {
      await command.exec(message, args, this.client);
    } catch(error) {
      await message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription("Sorry, I ran into an error!"));
      this.client.log.error(error, `Command ${command.name}`);
    }
  }
}