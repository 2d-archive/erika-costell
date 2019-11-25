const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Util = require("../../utils/Util");
const { StringBuilder } = require("../../utils/StringBuilder");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("queue", {
      aliases: [ "queue", "q" ],
      description: "Shows the current queue.",
      guildOnly: true,
      usage: "[page]",
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

    if (!player.queue.next.length)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription('Got nothing in queue!'));

    const totalLength = player.queue.next.reduce((prev, song ) => prev + song.info.length, 0);
    const paginated = Util.paginate(player.queue.next, parseInt(args[0] || "1"));
    let index = (paginated.page - 1) * 10;

    const str = new StringBuilder(Util.BuilderOptions())
      .append(`**Song queue${paginated.page > 1 ? `, page ${paginated.page}` : ''}:**`)
      .append(paginated.items.length
        ? paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${Util.timeString(song.info.length)})`).join('\n')
        : 'No more songs in queue.')
      .append(`**Total queue time:** ${Util.timeString(totalLength)}`, true, "map:false", "plugin:disable");
    if (paginated.maxPage > 1) str.append('"Use queue <page> to view a specific page."', true, "map:false");

    return message.channel.send(new MessageEmbed().setColor("BLUE").setDescription(str.build("prolog")));
  }
};