"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./Util");
class StringBuilder {
  constructor(options = {}) {
    Object.defineProperties(this, {
      name: {
        value: options.name || "",
        enumerable: false,
        writable: false,
        configurable: false
      },
      seperator: {
        value: options.seperator || ", ",
        enumerable: false,
        writable: false,
        configurable: false
      }
    });
    this.plugin = options.plugin;
    this.mapper = util_1.Default(options.mapper, string => string);
    this.filter = util_1.Default(options.filter, string => string ? true : false);
    this.strings = [];
    this.partitions = [];
  }
  append(str, split = false, ...keyOPTS) {
    if (!this.filter(str, this.strings.length, this.strings))
      return this;
    this.strings.push(str);
    if (split)
      this.split(...keyOPTS);
    return this;
  }
  split(...keyOPTS) {
    const partition = this.strings;
    const pos = this.partitions.push(partition);
    this.partitions[`${pos}k`] = keyOPTS;
    this.strings = [];
    return this;
  }
  build(...params) {
    if (this.strings.length > 0)
      this.split();
    let string = [];
    for (const pos in this.partitions.filter(() => true)) {
      let partition = this.partitions[pos], ops = this.partitions[`${Number(pos) + 1}k`];
      if (!ops.includes("map:false"))
        partition = partition.filter(s => !s.startsWith('$r-')).map(this.mapper);
      if (!ops.includes("plugin:disable") && this.plugin)
        partition = this.plugin["build"](partition, ...params);
      for (let pos in partition)
        if (partition[pos].startsWith("$r-"))
          partition[pos] = partition[pos].replace("$r-", "");
      string.push(partition.join(this.seperator));
    }
    return string.join(this.seperator);
  }
}
exports.StringBuilder = StringBuilder;
class CodePlugin {
  static build(strings, language) {
    strings.unshift(`$r-\`\`\`${language}\n`);
    strings.push(`$r-\n\`\`\``);
    return strings;
  }
}
exports.CodePlugin = CodePlugin;
