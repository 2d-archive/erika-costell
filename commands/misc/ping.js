const Command = require("../../structures/Command");
const { MessageEmbed, Message, Client } = require("discord.js");
const { BuilderOptions } = require("../../utils/Util");
const { StringBuilder } = require("../../utils/StringBuilder");

module.exports = class BotInfoCommand extends Command {
  constructor() {
    super("ping", {
      aliases: [ "ping", "pong", "latency" ],
      description: "Shows the websocket and api latency.",
      category: "misc"
    });
  }

  /**
   * @param {Message} message 
   * @param {String[]} args 
   * @param {Client} client 
   */
  async exec(message, args, client) {
    const start = Date.now();
    return new Promise((res) => {
      return res(message.channel.send(new MessageEmbed()
        .setColor("BLUE")
        .setDescription(new StringBuilder(BuilderOptions())
          .append(`WebSocket Ping : ${Math.round(message.guild ? message.guild.shard.ping : client.ws.ping)}`)
          .append(`API Ping : ${Math.round(Date.now() - start)}`))))
    });
  }
}