const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("nowplaying", {
      aliases: [ "nowplaying", "np" ],
      description: "Resumes the current player.",
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
    const player = client.andesite.players.get(message.guild.id);
    if (!player)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Use \`erika join\` to create a player.`));

    if (!player.queue.np.song)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription("There is song currently playing."));

    const np = player.queue.np.song;
    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`**[${np.info.title}](${np.info.uri})**\n${require("../../utils/Util").playerEmbed(player, np)}`));
  }
};