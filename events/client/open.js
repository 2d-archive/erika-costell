const Event = require("../../structures/Event");

module.exports = class ReadyEvent extends Event {
  constructor() {
    super("open", {
      event: "open",
      emitter: "andesite"
    });
  }

  async exec(name) {
    this.client.log.info(`Node ${name} is now connected.`);
  }
}