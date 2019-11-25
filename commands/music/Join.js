const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const { Queue } = require("../../structures/Queue");

module.exports = class JoinCommand extends Command {
  constructor() {
    super("join", {
      aliases: [ "join", "summon" ],
      description: "Joins the voice channel your currently in.",
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
    if (client.andesite.players.has(message.guild.id))
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`A player already exists.`));

    if (!message.member.voice.channel)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription(`Please join a voice channel so you can listen to my ~~hell~~ music!`));

    const node = client.andesite.nodes.get();
    if (!node)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setDescription("I'm very sorry, I can't find my producer... check back in like another year or so."));

    const player = await node.join({ guildId: message.guild.id, channelId: message.member.voice.channelID });
    player.queue = new Queue(player);
    player.queue.on("finish", async () => {
      await node.leave(message.guild.id);
      return message.channel.send(new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`No more songs left in the queue!`));
    }).on("next", async np => {
      return message.channel.send(new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`Started playing **[${np.song.info.title}](${np.song.info.uri})**!`));
    });
    return message.channel.send(new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Joined \`${message.member.voice.channel.name}\` via request of you *(${message.author} if you didn't remember)*!`));
  }
};