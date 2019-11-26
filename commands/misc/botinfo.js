const Command = require("../../structures/Command");
const { MessageEmbed, Message, Client } = require("discord.js");
const { get } = require("axios").default;
const { StringBuilder } = require("../../utils/StringBuilder");

let url = `https://github.com/lolwastedjs/erika-costell`
module.exports = class BotInfoCommand extends Command {
  constructor() {
    super("botinfo", {
      aliases: [ "botinfo", "bi", "info" ],
      description: "Shows info on the bot.",
      category: "misc"
    });
  }

  /**
   * @param {Message} message 
   * @param {String[]} args 
   * @param {Client} client 
   */
  async exec(message, args, client) {
    const { data } = (await get("https://api.github.com/repos/lolwastedjs/erika-costell/commits"));

    const builder = new StringBuilder({ seperator: "\n" });

    for (const _ of data.slice(0, 3))
      builder.append(`[\`${_.sha.slice(0, 7)}\`](${_.url}) ${_.commit.message}`);

    const Embed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(client.user.tag, client.user.avatarURL(), url)
      .setDescription(`Hello, I'm a bot made to show off [discord.js-andesite](${url}).\n\n`
        + `**Developer**: 2D#5773\n`
        + `**discord.js Version**: v12.0.0\n`)
      .addField("Changelog (commits)", builder.build())
      .setThumbnail(client.user.avatarURL());

    return message.channel.send(Embed);
  }
}