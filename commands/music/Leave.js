const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const { Queue } = require("../../structures/Queue");

module.exports = class JoinCommand extends Command {
  constructor() {
    super("leave", {
      aliases: [ "leave" ],
      description: "Leave the voice channel the bot is currently in.",
      guildOnly: true,
      category: "music"
    });
  }

  /**
   * @param {import("discord.js")} message
   * @param {String[]} args
   * @param {import("discord.js").Client} client
   * @returns {Promise<void>}
   */
  async exec(message, args, client) {
    const player = client.andesite.players.get(message.guild.id)
    if (!player)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no existing player."));

    if (!message.guild.channels.resolve(player.channelId).members.has(message.author.id))
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please join the voice channel i'm in.`));

    const node = client.andesite.nodes.get();
    if (!node)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription("I'm very sorry, I can't find my producer... check back in like another year or so."));

    await node.leave(message.guild.id);
    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Left \`${message.member.voice.channel.name}\` via request of you *(${message.author} if you didn't remember)*!`));
  }
};