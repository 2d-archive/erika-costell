module.exports = class {
  static paginate(items, page = 1, pageLength = 10) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const startIndex = (page - 1) * pageLength;

    return {
      items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
      page,
      maxPage,
      pageLength
    };
  }
  static timeString(seconds, forceHours = false, ms = true) {
    if (ms) seconds /= 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);

    return `${forceHours || hours >= 1 ? `${hours}:` : ''}${hours >= 1 ? `0${minutes}`.slice(-2) : minutes}:${`0${Math.floor(seconds % 60)}`.slice(-2)}`;
  }

  /**
   * This will generate a nice player embed for us
   *
   * @param { import('./player') } player
   * @author Duncan Sterkan (duncte123)
   * @returns { String } the String that we can place in our embed
   */
  static playerEmbed(player, current) {
    return (player.paused ? "\u23F8" : "\u25B6") + " " +
      this.progressBar(player.position / current.info.length) +
    `\`[${this.formatTime(player.position)}/${this.formatTime(current.info.length)}]\`` +
      this.getVolumeIcon(player.volume);
  }

  /**
   * This will calculate the progressbar for us
   *
   * @param { Number } percent how far we are in the audio track
   * @author Duncan Sterkan (duncte123)
   * @returns the progressbar
   */
  static progressBar(percent, length = 8) {
    let str = "";
    for (let i = 0; i < length; i++) {
      if (i == Math.round(percent * length)) str += "\uD83D\uDD18";
      else str += "▬";
    }
    return str;
  }

  /**
   * This will give a nice emote depending on how loud we are sending the music
   *
   * @param { Number } volume the volume of our player
   * @author Duncan Sterkan (duncte123)
   * @returns the volume icon emote
   */
  static getVolumeIcon(volume) {
    if (volume == 0) return "\uD83D\uDD07";
    else if (volume < 33) return "\uD83D\uDD08";
    else if (volume < 67) return "\uD83D\uDD09";
    else return "\uD83D\uDD0A";
  }

  /**
   * This wil format our current player time in this format: mm:ss
   *
   * @param { Number } duration how far we are in the track
   * @author MeLike2D
   * @returns our formatted time
   */
  static formatTime(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  static BuilderOptions() {
    return {
      seperator: "\n",
      mapper: (arr, index, strings) => {
        const padding = strings.reduce((base, string) => Math.max(base, string.split(" : ")[0].length), 0);
        return ((str) => [str[0].padStart(padding), `${str[1]}`].join(" : "))(arr.split(" : "));
      },
      filter: (s) => s !== undefined,
      plugin: require("./StringBuilder").CodePlugin
    };
  }

  static Default(val, def) {
    return val == undefined ? def : val;
  }
}