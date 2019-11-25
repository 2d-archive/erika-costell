const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("pause", {
      aliases: [ "pause" ],
      description: "Pauses the current player.",
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
        .setDescription(`Use \`erika join\` to create a player.`));

    if (!message.guild.channels.get(player.channelId).members.has(message.author.id))
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please join the voice channel i'm in.`));

    if (player.paused)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription("The player is already paused."));

    await player.pause();
    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Paused the player!`));
  }
};