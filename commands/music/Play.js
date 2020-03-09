const Command = require("../../structures/Command");
const {
  MessageEmbed
} = require("discord.js");

module.exports = class PlayCommand extends Command {
  constructor() {
    super("play", {
      aliases: ["play", "p"],
      description: "ee",
      guildOnly: true,
      usage: "<song name or url>",
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

    if (!args[0])
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please provide a song name or url to play.`));

    const res = await client.andesite.search(args.join(" "), player.node);
    let msg;
    if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(res.loadType)) {
      await player.queue.add(res.tracks[0]);
      msg = `[${res.tracks[0].info.title}](${res.tracks[0].info.uri})`;
    } else if (res.loadType === 'PLAYLIST_LOADED') {
      await player.queue.add(...res.tracks);
      msg = res.playlistInfo.name;
    } else return message.channel.send(new MessageEmbed()
      .setColor("RED")
      .setDescription("I couldn't find what you were looking for."));

    if (!player.playing && !player.paused) await player.queue.start();

    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`**Queued up:** ${msg}`));
  }
};