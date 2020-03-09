const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("bassboost", {
      aliases: [ "bassboost", "bb" ],
      description: "Enables or Disables nightcore for the current player.",
      guildOnly: true,
      usage: '[high|medium|low|none]',
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

    let levels = {
      high: 0.25,
      medium: 0.15,
      low: 0.05,
      none: 0.00
    }, i = 0;

    if (levels[args[0]] === undefined)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`The available levels are ${Object.keys(levels).map(l => `**${l}**`).join(", ")}`));
    await player.filter("equalizer", {
      bands: Array(3).fill(null).map(() => ({ band: i++, gain: levels[args[0]] }))
    });

    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Set the bass boost level to **${args[0]}**`));
  }
};