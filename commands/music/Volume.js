const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("volume", {
      aliases: [ "volume", "vol", "v" ],
      description: "",
      guildOnly: true,
      usage: "[volume]",
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

    if (!message.guild.channels.resolve(player.channelId).members.has(message.author.id))
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please join the voice channel i'm in.`));

    const volume = args[0];
    if (!volume)
      return message.channel.send(new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`The current volume is **${player.volume}**!`));

    if (isNaN(volume) || (parseInt(volume) > 100 || parseInt(volume) < 1))
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please provide a number between **1** and **100**!`));

    await player.setVolume(parseInt(volume));
    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Set the volume to **${volume}**!`));
  }
};