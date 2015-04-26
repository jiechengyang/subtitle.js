/*!
 * Subtitle.js
 * Parse and manipulate SRT (SubRip)
 * https://github.com/gsantiago/subtitle.js
 *
 * @version 0.0.2
 * @author Guilherme Santiago
*/


/**
 * @constructor
 * @param {String} The SRT content to be parsed
*/
function Subtitle (srt) {
  if (srt) {
    this.srt = srt;
  }
}


/**
 * SRT parser
*/
Subtitle.prototype.parse = function () {
  var subs = [];
  var index;
  var time;
  var text;
  var start;
  var end;
  var srt = this.srt.split('\n');

  srt.forEach(function (line) {
    line = line.toString();

    // if we don't have an index, so we should expect an index
    if (!index) {
      if (/^\d+$/.test(line)) {
        index = parseInt(line);
        return;
      }
    }

    // now we have to check for the time
    if (!time) {
      var match = line.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/);
      if (match) {
        start = match[1];
        end = match[2];
        time = true;
        return;
      }
    }

    // now we get all the strings until we get an empty line
    if (line.trim() === '') {
      subs.push({
        index: index,
        start: start,
        end: end,
        text: text
      });
      index = time = start = end = text = null;
    } else {
      if (!text) {
        text = line;
      } else {
        text += '\n' + line;
      }
    }

  });

  return subs;
};


/**
 * Convert the SRT time format to milliseconds
 *
 * @static
 * @param {String} SRT time format
*/
Subtitle.toMS = function (time) {
  var match = time.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);

  if (!match) {
    throw new Error('Invalid SRT time format');
  }

  var hours = parseInt(match[1], 10);
  var minutes = parseInt(match[2], 10);
  var seconds = parseInt(match[3], 10);
  var milliseconds = parseInt(match[4], 10);

  hours *= 3600000;
  minutes *= 60000;
  seconds *= 1000;

  return hours + minutes + seconds + milliseconds;
};


/**
 * Convert milliseconds to SRT time format
 *
 * @static
 * @param {Integer} Milleseconds
*/
Subtitle.toSrtTime = function (time) {
  if (!/^\d+$/.test(time.toString())) {
    throw new Error('Time should be an Integer value in milliseconds');
  }

  time = parseInt(time);

  var date = new Date(0, 0, 0, 0, 0, 0, time);

  var hours = date.getHours() < 10
    ? '0' + date.getHours()
    : date.getHours();

  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes()
    : date.getMinutes();

  var seconds = date.getSeconds() < 10
    ? '0' + date.getSeconds()
    : date.getSeconds();

  var ms = time - ((hours * 3600000) + (minutes * 60000) + (seconds * 1000));

  if (ms < 100 && ms > 10) {
    ms = '0' + ms;
  } else if (ms < 10) {
    ms = '00' + ms;
  }

  var srtTime = hours + ':' + minutes + ':' + seconds + ',' + ms;

  return srtTime;
};


module.exports = Subtitle;
