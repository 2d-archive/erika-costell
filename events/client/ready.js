const Event = require("../../structures/Event");

module.exports = class ReadyEvent extends Event {
  constructor() {
    super("ready", {
      event: "ready"
    });
  }

  async exec(client = this.client) {
    client.log.info("Ready!");
    await client.andesite.init(client.user.id);
  }
}