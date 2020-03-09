"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
const events_1 = require("events");
class Queue extends events_1.EventEmitter {
  constructor(player) {
    super();
    this.player = player;
    this.next = [];
    this.previous = [];
    this.repeat = {
      queue: false,
      song: false
    };
    this.np = {
      position: 0
    };
    this.player.on("end", async (d) => {
      if (d.type !== 'TrackEndEvent' || !['REPLACED', 'STOPPED'].includes(d.reason)) {
        if (!this.repeat.song)
          this._next();
        if (this.repeat.queue && !this.np.song) {
          const previous = this.previous.reverse();
          this.clear();
          this.add(...previous);
          this._next();
        }
        if (!this.np.song)
          return this.emit("finish");
        await this.player.play(this.np.song.track);
        this.emit("next", this.np);
      }
    }).on("player-update", (d) => {
      this.np.position = d.state.position;
    });
  }
  add(...songs) {
    if (!songs.length)
      return 0;
    return this.next.push(...songs);
  }
  _next() {
    const next = this.next.shift();
    if (this.np.song)
      this.previous.unshift(this.np.song);
    return this.np = {
      song: next,
      position: 0
    };
  }
  async start(message) {
    this.message = message;
    if (!this.np.song)
      this._next();
    await this.player.play(this.np.song.track);
    return this.emit("start", this.np);
  }
  stop() {
    return this.player.stop();
  }
  async move(from, to) {
    if (to >= this.next.length) {
      let k = to - this.next.length + 1;
      while (k--) {
        this.next.push(undefined);
      }
    }
    this.next.splice(to, 0, this.next.splice(from, 1)[0]);
    return this.next;
  }
  length() {
    return this.next.length;
  }
  sort(predicate) {
    return this.next.sort(predicate);
  }
  clear() {
    this.next = [];
    this.previous = [];
    this.np = {
      position: 0
    };
  }
  shuffle() {
    for (let i = this.next.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.next[i], this.next[j]] = [this.next[j], this.next[i]];
    }
    return this.next;
  }
}
exports.Queue = Queue;
//# sourceMappingURL=Queue.js.map