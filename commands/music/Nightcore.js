const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("nightcore", {
      aliases: [ "nightcore", "nc" ],
      description: "Enables or Disables nightcore for the current player.",
      guildOnly: true,
      usage: '[disable|off]',
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
    const player = client.andesite.players.get(message.guild.id);
    if (!player)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Use \`erika join\` to create a player.`));

    if (!message.guild.channels.get(player.channelId).members.has(message.author.id))
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please join the voice channel i'm in.`));

    const disabled = ["off", "disable"].includes((args[0] || "").toLowerCase());
    await player.filter("timescale", { rate: disabled ? 1 : 1.5 });
    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`${disabled ? "Disabled" : "Enabled" } nightcore for this player!`));
  }
};