/**
 * @name CommandOptions
 * @prop {String[]} aliases
 * @prop {String} description
 * @prop {String} category
 * @prop {Boolean} guildOnly
 * @prop {String} usage
 */

module.exports = class Command {
  /**
   * @param {String} name
   * @param {CommandOptions} options
   */
  constructor(name, options = {}) {
    this.name = name;
    this.aliases = options.aliases || [];
    this.description = options.description || "";
    this.category = options.category || "main";
    this.guildOnly = options.guildOnly || false;
    this.usage = options.usage || "";
    /**
     * @type {import('discord.js').Client}
     */
    this.client = null;
  }

  /**
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   */
  exec(message, args) {}
};