require("dotenv").config({ path: `${__dirname}\\.env` });
const { Manager } = require("discord.js-andesite");
const { Client, Collection } = require("discord.js");

const client = new Client();
client.andesite = new Manager(client, {
  defaultVolume: 50,
  nodes: [{
    host: "localhost",
    name: "main-node",
    port: 5000
  }]
});

client.log = require("@ayana/logger").get("Client");
client.commands = new Collection();
require("./utils/Handlers").loadCommands(client);
require("./utils/Handlers").loadEvents(client);

client.login(process.env.TOKEN);