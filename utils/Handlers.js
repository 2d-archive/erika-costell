const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");
const Command = require("../structures/Command");
const Event = require("../structures/Event");

const read = (dir, files = []) => {
  for (const path of readdirSync(dir))
    path.endsWith(".js")
      ? files.push(join(dir, path))
      : files.concat(...read(join(dir, path), files));
  return files;
};

module.exports = {
  loadEvents: (client) => {
    for (const file of read("./events/")) {
      const eventClass = require(join(__dirname, "..", file));
      const event = new eventClass();

      if (!event instanceof Event) return;

      event.client = client;
      (!event.emitter || event.emitter === "client"
        ? client
        : client[event.emitter]).on(event.event, event.exec.bind(event));
    }
  },
  loadCommands: (client) => {
    for (const file of read("./commands/")) {

      const commandClass = require(join(__dirname, "..", file));

      const command = new commandClass();
      if (!command instanceof Command) return;

      command.client = client;
      client.commands.set(command.name, command);
    }
  }
}