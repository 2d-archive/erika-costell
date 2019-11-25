const Command = require("../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class JoinCommand extends Command {
  constructor() {
    super("help", {
      aliases: [ "help", "commands", "?" ],
      description: "Provides a list of commands.",
      guildOnly: true,
      category: "misc"
    });
  }

  /**
   * @param {import("discord.js")} message
   * @param {String[]} args
   * @param {import("discord.js").Client} client
   * @returns {Promise<void>}
   */
  async exec(message, args, client) {
    if (args[0] && client.commands.some(s => s.aliases.includes(args[0]))) {
      const command = client.commands.find(c => c.aliases.includes(args[0]));
      return message.channel.send(new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`**Description**: ${command.description || "None Provided."}\n**Category**: ${command.category}`)
        .setTitle(`erika ${command.aliases[0]} ${command.usage}`))
    }

    const Embed = new MessageEmbed().setColor("BLUE");
    for (const category of [...new Set(client.commands.map(c => c.category))])
      Embed.addField(category, client.commands.filter(_ => _.category === category).map(_ => `\`${_.name}\``).join(", "))

    return message.channel.send(Embed);
  }
};