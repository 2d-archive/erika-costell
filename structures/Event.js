/**
 * @name EventOptions
 * @prop {String} event
 * @prop {String} emitter
 * @prop {"on" | "once"} type
 */

module.exports = class Event {
  /**
   * @param {String} name
   * @param {EventOptions} options
   */
  constructor(name, options = {}) {
    this.name = name;
    this.event = options.event;
    this.emitter = options.emitter;
    this.type = options.type;
    /**
     * @type {import('discord.js').Client}
     */
    this.client = null;
  }

  exec() {}
};