/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/electron-squirrel-startup/index.js"
/*!*********************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/index.js ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path");
var spawn = (__webpack_require__(/*! child_process */ "child_process").spawn);
var debug = __webpack_require__(/*! debug */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/index.js")('electron-squirrel-startup');
var app = (__webpack_require__(/*! electron */ "electron").app);

var run = function(args, done) {
  var updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  debug('Spawning `%s` with args `%s`', updateExe, args);
  spawn(updateExe, args, {
    detached: true
  }).on('close', done);
};

var check = function() {
  if (process.platform === 'win32') {
    var cmd = process.argv[1];
    debug('processing squirrel command `%s`', cmd);
    var target = path.basename(process.execPath);

    if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
      run(['--createShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-uninstall') {
      run(['--removeShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-obsolete') {
      app.quit();
      return true;
    }
  }
  return false;
};

module.exports = check();


/***/ },

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/browser.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/browser.js ***!
  \**********************************************************************************/
(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ },

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js"
/*!********************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js ***!
  \********************************************************************************/
(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "./node_modules/electron-squirrel-startup/node_modules/ms/index.js");

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ },

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/index.js"
/*!********************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/index.js ***!
  \********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/browser.js");
} else {
  module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/node.js");
}


/***/ },

/***/ "./node_modules/electron-squirrel-startup/node_modules/debug/src/node.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/debug/src/node.js ***!
  \*******************************************************************************/
(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(/*! tty */ "tty");
var util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/electron-squirrel-startup/node_modules/debug/src/debug.js");
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(/*! fs */ "fs");
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(/*! net */ "net");
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ },

/***/ "./node_modules/electron-squirrel-startup/node_modules/ms/index.js"
/*!*************************************************************************!*\
  !*** ./node_modules/electron-squirrel-startup/node_modules/ms/index.js ***!
  \*************************************************************************/
(module) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ },

/***/ "./src/application/contracts/presentation.ts"
/*!***************************************************!*\
  !*** ./src/application/contracts/presentation.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INITIAL_TIMELINE_VIEW: () => (/* binding */ INITIAL_TIMELINE_VIEW),
/* harmony export */   PANEL_IDS: () => (/* binding */ PANEL_IDS),
/* harmony export */   PRESENTATION_CHANNEL: () => (/* binding */ PRESENTATION_CHANNEL),
/* harmony export */   TIMELINE_INTERVALS: () => (/* binding */ TIMELINE_INTERVALS),
/* harmony export */   panelActionOpensMain: () => (/* binding */ panelActionOpensMain),
/* harmony export */   resolveTimelineView: () => (/* binding */ resolveTimelineView),
/* harmony export */   validPanelAction: () => (/* binding */ validPanelAction),
/* harmony export */   validTimelineCalendar: () => (/* binding */ validTimelineCalendar),
/* harmony export */   validTimelineView: () => (/* binding */ validTimelineView)
/* harmony export */ });
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../domain/workspace */ "./src/domain/workspace.ts");



const PRESENTATION_CHANNEL = 'writingtool:presentation:v1';
const PANEL_IDS = ['navigation', 'timeline', 'context'];
const TIMELINE_INTERVALS = ['day', 'month', 'year', 'decade', 'century'];
const INITIAL_TIMELINE_VIEW = { interval: 'day', zoom: 1, focus: null, anchor: null, period: null, unresolved: false };
const validTimelineView = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['interval', 'zoom', 'focus', 'anchor', 'period', 'unresolved']) && TIMELINE_INTERVALS.includes(v.interval) && typeof v.zoom === 'number' && Number.isFinite(v.zoom) && v.zoom >= .125 && v.zoom <= 64 && (v.anchor === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.signedInteger)(v.anchor)) && (v.period === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.positiveInteger)(v.period)) && typeof v.unresolved === 'boolean' && (v.focus === null || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v.focus, ['requestId', 'start', 'end']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.focus.requestId) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.validDatePosition)(v.focus.start) && (v.focus.end === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.validDatePosition)(v.focus.end)));
function validTimelineCalendar(view, calendar) {
    if (view.interval === 'month' && !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.hasCalendarMonths)(calendar))
        return false;
    if (!view.focus)
        return true;
    if (!calendar)
        return false;
    try {
        (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.elapsedPosition)(view.focus.start, calendar);
        if (view.focus.end)
            (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.elapsedPosition)(view.focus.end, calendar);
        return true;
    }
    catch {
        return false;
    }
}
/** Focus requests reset the interval once; ordinary mirrors/panning retain its shared state. */
function resolveTimelineView(current, next, calendar) {
    if (!validTimelineView(next) || !validTimelineCalendar(next, calendar))
        return null;
    if (!next.focus || next.focus.requestId === current.focus?.requestId)
        return next;
    const start = (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.elapsedPosition)(next.focus.start, calendar), end = next.focus.end ? (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.elapsedPosition)(next.focus.end, calendar) : start, low = start < end ? start : end, high = start > end ? start : end;
    return { ...next, anchor: low.toString(), period: high > low ? (high - low).toString() : '31' };
}
const panelActionOpensMain = (action) => ['select', 'edit', 'create', 'create-event', 'tree'].includes(action.kind);
function validPanelAction(v) {
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'id']) && ['select', 'edit'].includes(String(v.kind)))
        return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id);
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'id', 'direction']) && v.kind === 'move')
        return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && [-1, 1].includes(Number(v.direction)) && typeof v.direction === 'number';
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'recordType']) && v.kind === 'create')
        return ['story', 'volume', 'chapter', 'event', 'character', 'faction', 'decision', 'plot'].includes(String(v.recordType));
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'date']) && v.kind === 'create-event')
        return (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_0__.validDatePosition)(v.date);
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'value']) && v.kind === 'filters')
        return (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.validWorkspaceData)('view', v.value);
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'value']) && v.kind === 'timeline')
        return validTimelineView(v.value);
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'tab', 'filter']) && v.kind === 'context')
        return ['characters', 'factions', 'plots', 'decisions'].includes(String(v.tab)) && ['all', 'main', 'major', 'minor', 'extra'].includes(String(v.filter));
    if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'patch']) && v.kind === 'panel' && typeof v.patch === 'object' && v.patch !== null) {
        const p = v.patch;
        return Object.keys(p).length > 0 && Object.entries(p).every(([key, value]) => key === 'placement' ? ['left', 'right', 'bottom', 'center', 'floating'].includes(String(value)) : ['visible', 'collapsed'].includes(key) && typeof value === 'boolean');
    }
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind']) && v.kind === 'tree' || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'direction']) && v.kind === 'panel-order' && typeof v.direction === 'number' && [-1, 1].includes(v.direction);
}


/***/ },

/***/ "./src/application/contracts/project.ts"
/*!**********************************************!*\
  !*** ./src/application/contracts/project.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROJECT_CHANNEL: () => (/* binding */ PROJECT_CHANNEL),
/* harmony export */   projectCommands: () => (/* binding */ projectCommands),
/* harmony export */   validProjectIdentity: () => (/* binding */ validProjectIdentity),
/* harmony export */   validProjectReceipt: () => (/* binding */ validProjectReceipt),
/* harmony export */   validProjectRequest: () => (/* binding */ validProjectRequest),
/* harmony export */   validProjectResult: () => (/* binding */ validProjectResult)
/* harmony export */ });
/* harmony import */ var _universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe */ "./src/application/contracts/universe.ts");

const PROJECT_CHANNEL = 'writingtool:project:v1';
const projectCommands = ['project.create', 'project.open', 'project.current', 'project.close'];
function validProjectRequest(v, internal = false) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.requestId) || !projectCommands.includes(x.command))
        return false;
    const selecting = x.command === 'project.create' || x.command === 'project.open';
    const extras = internal && selecting ? ['basePath', ...(Object.hasOwn(x, 'universePath') ? ['universePath'] : []), ...(Object.hasOwn(x, 'expectedCreationOperationId') ? ['expectedCreationOperationId'] : [])] : [];
    return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['protocolVersion', 'requestId', 'command', ...(x.command === 'project.create' ? ['input'] : []), ...extras]) && (!extras.length || (typeof x.basePath === 'string' && (!Object.hasOwn(x, 'universePath') || typeof x.universePath === 'string') && (!Object.hasOwn(x, 'expectedCreationOperationId') || (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.expectedCreationOperationId)))) && (x.command !== 'project.create' || ((0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(x.input, ['operationId']) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.input.operationId)));
}
function validProjectIdentity(v) {
    return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['ownerId', 'rootId', 'universeId', 'generation', 'recordVersion', 'location', 'universeLocation', 'creationOperationId']) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.ownerId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.rootId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.universeId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isGeneration)(v.generation) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && typeof v.location === 'string' && typeof v.universeLocation === 'string' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.creationOperationId);
}
function validProjectReceipt(v) {
    return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['protocolVersion', 'operationId', 'owner', 'unitGeneration', 'recordId', 'recordVersion']) && v.protocolVersion === 1 && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.operationId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) && v.owner.kind === 'project' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.owner.id) && v.recordId === v.owner.id && v.unitGeneration === '1' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion);
}
function validProjectResult(v, request, internal = false) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v, base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.protocolVersion !== 1 || x.requestId !== request.requestId || x.command !== request.command)
        return false;
    if (x.status === 'locate')
        return internal && request.command === 'project.open' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'universeId']) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.universeId);
    if (x.status === 'canceled')
        return ['project.create', 'project.open'].includes(request.command) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, base);
    if (x.status === 'error')
        return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'code', 'message', 'outcome', 'retry']) && _universe__WEBPACK_IMPORTED_MODULE_0__.universeErrorCodes.includes(x.code) && typeof x.message === 'string' && !!x.message && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry));
    if (x.status !== 'ok' || !(0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'snapshot', ...(Object.hasOwn(x, 'receipt') ? ['receipt'] : [])]))
        return false;
    if (x.snapshot === null)
        return ['project.current', 'project.close'].includes(request.command) && !Object.hasOwn(x, 'receipt');
    if (request.command === 'project.close' || typeof x.snapshot !== 'object' || x.snapshot === null)
        return false;
    const { universe, ...identity } = x.snapshot;
    if (!validProjectIdentity(identity) || !(0,_universe__WEBPACK_IMPORTED_MODULE_0__.validSnapshot)(universe) || universe.ownerId !== identity.universeId || universe.location !== identity.universeLocation)
        return false;
    return Object.hasOwn(x, 'receipt') ? request.command === 'project.create' && validProjectReceipt(x.receipt) && x.receipt.owner.id === identity.ownerId && x.receipt.recordVersion === identity.recordVersion && (!request.input || x.receipt.operationId === request.input.operationId) : request.command !== 'project.create';
}


/***/ },

/***/ "./src/application/contracts/protection.ts"
/*!*************************************************!*\
  !*** ./src/application/contracts/protection.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CATALOG_NOTICE: () => (/* binding */ CATALOG_NOTICE),
/* harmony export */   PROTECTION_CHANNEL: () => (/* binding */ PROTECTION_CHANNEL),
/* harmony export */   canDeferProtection: () => (/* binding */ canDeferProtection),
/* harmony export */   digest: () => (/* binding */ digest),
/* harmony export */   protectionHasDurableEffects: () => (/* binding */ protectionHasDurableEffects),
/* harmony export */   protectionOperationId: () => (/* binding */ protectionOperationId),
/* harmony export */   validArchiveRecord: () => (/* binding */ validArchiveRecord),
/* harmony export */   validCapturedUnit: () => (/* binding */ validCapturedUnit),
/* harmony export */   validObjectRef: () => (/* binding */ validObjectRef),
/* harmony export */   validProposal: () => (/* binding */ validProposal),
/* harmony export */   validProtectionRequest: () => (/* binding */ validProtectionRequest),
/* harmony export */   validProtectionResult: () => (/* binding */ validProtectionResult),
/* harmony export */   validProtectionValue: () => (/* binding */ validProtectionValue),
/* harmony export */   validRecoveryView: () => (/* binding */ validRecoveryView),
/* harmony export */   validResolution: () => (/* binding */ validResolution),
/* harmony export */   validRevisionManifest: () => (/* binding */ validRevisionManifest)
/* harmony export */ });
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _workspace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./workspace */ "./src/application/contracts/workspace.ts");




const PROTECTION_CHANNEL = 'writingtool:protection:v1';
const CATALOG_NOTICE = 'Database catalog only. Writing, object files and images are not included. Use a complete ZIP backup for independent recovery.';
/** Reconciliation retains the operation being reconciled, even if its transport attempt fails. */
function protectionOperationId(request) { return request.command === 'protection.reconcile' || request.command === 'protection.defer' ? request.operationId : request.requestId; }
/** These commands capture or publish saved copies without changing live writing. */
function canDeferProtection(command) { return ['protection.capture', 'protection.backup', 'protection.export'].includes(command); }
/** Read failures and cancellation signals do not create a new uncertain mutation. */
function protectionHasDurableEffects(request) { return !['protection.history', 'protection.inspect', 'protection.pending', 'protection.recents', 'protection.open', 'protection.cancel'].includes(request.command); }
function validProtectionRequest(v, internal = false) {
    if (typeof v !== 'object' || !v)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.requestId))
        return false;
    let keys = [];
    switch (x.command) {
        case 'protection.archives':
            keys = ['owner'];
            break;
        case 'protection.archive-locate':
            keys = ['owner', 'id'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.id))
                return false;
            break;
        case 'protection.recents':
        case 'protection.pending':
            keys = [];
            break;
        case 'protection.recent':
            keys = ['id', 'action'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.id) || !['open', 'locate', 'remove'].includes(String(x.action)))
                return false;
            break;
        case 'protection.history':
            keys = ['owner'];
            break;
        case 'protection.capture':
            keys = ['owner', 'reason'];
            break;
        case 'protection.inspect':
            keys = ['owner', 'revisionId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.revisionId))
                return false;
            break;
        case 'protection.backup':
            keys = ['owner', 'reason', 'chooseLocation', 'closing'];
            if (typeof x.chooseLocation !== 'boolean' || typeof x.closing !== 'boolean')
                return false;
            break;
        case 'protection.delete':
            keys = ['owner', 'kind', 'id'];
            if (!['revision', 'archive'].includes(String(x.kind)) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.id))
                return false;
            break;
        case 'protection.recover':
            keys = ['owner', 'revisionId', 'scope'];
            if (x.owner !== null && !(0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(x.owner) || x.revisionId !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.revisionId) || x.scope !== null && (!Array.isArray(x.scope) || !x.scope.every(_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)))
                return false;
            break;
        case 'protection.reference':
            keys = ['proposalId', 'sourceId', 'targetId', 'action', 'replacementId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.proposalId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.sourceId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.targetId) || !['restore', 'replacement', 'remove'].includes(String(x.action)) || x.replacementId !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.replacementId))
                return false;
            break;
        case 'protection.resume':
        case 'protection.apply':
        case 'protection.cancel-recovery':
            keys = ['proposalId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.proposalId))
                return false;
            break;
        case 'protection.resolve':
            keys = ['proposalId', 'resolution'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.proposalId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.resolution, ['recordId', 'liveFingerprint', 'recoveredFingerprint', 'choice', 'record', 'manuscript']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.resolution.recordId) || !validResolution(x.resolution))
                return false;
            break;
        case 'protection.export':
            keys = ['owner', 'format', 'storyId', 'chapterIds'];
            if (!['md', 'txt', 'docx', 'pdf', 'sqlite'].includes(String(x.format)) || x.storyId !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.storyId) || x.chapterIds !== null && (!Array.isArray(x.chapterIds) || !x.chapterIds.every(_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)))
                return false;
            break;
        case 'protection.reconcile':
            keys = ['operationId', ...(Object.hasOwn(x, 'chooseLocation') ? ['chooseLocation'] : [])];
            if (Object.hasOwn(x, 'chooseLocation') && typeof x.chooseLocation !== 'boolean' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId))
                return false;
            break;
        case 'protection.defer':
        case 'protection.cancel':
            keys = ['operationId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId))
                return false;
            break;
        case 'protection.open':
            keys = ['outputId', 'folder'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.outputId) || typeof x.folder !== 'boolean')
                return false;
            break;
        default: return false;
    }
    if (keys.includes('owner') && x.command !== 'protection.recover' && !(0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(x.owner))
        return false;
    if (keys.includes('reason') && !['Manual', 'Automatic', 'Close', 'Replaced', 'Recovered'].includes(String(x.reason)))
        return false;
    if (internal) {
        if (Object.hasOwn(x, 'nativeActivationLocations')) {
            if (x.command !== 'protection.reconcile' || !Array.isArray(x.nativeActivationLocations) || x.nativeActivationLocations.length > 2 || !x.nativeActivationLocations.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(p, ['owner', 'rootId', 'location', ...(Object.hasOwn(p, 'destination') ? ['destination'] : [])]) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(p.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(p.rootId) && nativePath(p.location) && (!Object.hasOwn(p, 'destination') || nativePath(p.destination))))
                return false;
            keys.push('nativeActivationLocations');
        }
        if (Object.hasOwn(x, 'nativePrepareOnly')) {
            if (x.nativePrepareOnly !== true)
                return false;
            keys.push('nativePrepareOnly');
        }
        if (Object.hasOwn(x, 'nativeDestination') && (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.nativeDestination, ['path', 'expectedHash']) || !nativePath(x.nativeDestination.path) || x.nativeDestination.expectedHash !== null && !digest(x.nativeDestination.expectedHash)))
            return false;
        if (Object.hasOwn(x, 'nativeBackupFolder') && !nativePath(x.nativeBackupFolder))
            return false;
        if (Object.hasOwn(x, 'nativeArchive') && !nativePath(x.nativeArchive) || Object.hasOwn(x, 'nativeRuntime') && !nativePath(x.nativeRuntime))
            return false;
        if (Object.hasOwn(x, 'nativeActivation') && (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.nativeActivation, ['project', 'universe']) || x.nativeActivation.project !== null && !nativePath(x.nativeActivation.project) || !nativePath(x.nativeActivation.universe)))
            return false;
        keys.push(...['nativeDestination', 'nativeArchive', 'nativeActivation', 'nativeRuntime', 'nativeBackupFolder'].filter(k => Object.hasOwn(x, k)));
    }
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, ['protocolVersion', 'requestId', 'command', ...keys]);
}
function validProtectionResult(v, r) { if (typeof v !== 'object' || !v)
    return false; const x = v, base = ['protocolVersion', 'requestId', 'command', 'status']; return x.protocolVersion === 1 && x.requestId === r.requestId && x.command === r.command && (x.status === 'ok' ? (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, [...base, 'value']) && validProtectionValue(x.value) && (!x.value.reconciliation || r.command === 'protection.reconcile' && x.value.reconciliation.operationId === r.operationId) : x.status === 'canceled' ? (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, base) : x.status === 'error' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, [...base, 'message', 'outcome', 'operationId']) && typeof x.message === 'string' && ['not-committed', 'unknown'].includes(String(x.outcome)) && (x.outcome === 'unknown' ? x.operationId === protectionOperationId(r) : x.operationId === null)); }
const digest = (v) => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const nativePath = (v) => (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v) && !!v && !v.includes('\0') && (/^(?:\/|[A-Za-z]:[\\/])/.test(v));
const uuidList = (v) => Array.isArray(v) && v.every(_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid) && new Set(v).size === v.length;
const validObjectRef = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['sha256', 'byteLength']) && digest(v.sha256) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.byteLength);
const validCapturedUnit = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['snapshot', 'files']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v.snapshot, ['owner', 'rootId', 'universeId', 'generation', 'assets', 'counters', 'recordIds']) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validWorkspaceUnit)(Object.fromEntries([...Object.entries(v.snapshot).filter(([k]) => k !== 'recordIds'), ['records', []], ['manuscripts', {}]])) && uuidList(v.snapshot.recordIds) && Array.isArray(v.files) && v.files.every(f => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(f, ['relativePath', 'object']) && safePath(f.relativePath) && validObjectRef(f.object)) && new Set(v.files.map(f => f.relativePath.toLowerCase())).size === v.files.length;
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
const safePath = (v) => typeof v === 'string' && !!v && !v.startsWith('/') && !v.split('/').some(p => !p || p === '.' || p === '..' || /[\\\0:\x00-\x1f]/.test(p) || /[. ]$/.test(p));
function validRevisionManifest(v) { if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'kind', 'id', 'owner', 'reason', 'capturedAt', 'completedAt', 'localCaptureStart', 'offsetMinutes', 'timeZone', 'displayName', 'universeDisplayName', 'units', 'retainedRevisionIds']) || !Array.isArray(v.units))
    return false; const units = v.units; return v.schemaVersion === 1 && v.kind === 'complete-revision' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(v.owner) && ['Manual', 'Automatic', 'Close', 'Replaced', 'Recovered'].includes(String(v.reason)) && typeof v.capturedAt === 'string' && Number.isFinite(Date.parse(v.capturedAt)) && typeof v.completedAt === 'string' && Number.isFinite(Date.parse(v.completedAt)) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.localCaptureStart) && typeof v.offsetMinutes === 'string' && /^-?(0|[1-9][0-9]*)$/.test(v.offsetMinutes) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.timeZone) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.displayName) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.universeDisplayName) && units.every(validCapturedUnit) && units.length === (v.owner.kind === 'project' ? 2 : 1) && units.some(u => u.snapshot.owner.kind === v.owner.kind && u.snapshot.owner.id === v.owner.id) && new Set(units.map(u => u.snapshot.owner.kind + u.snapshot.owner.id)).size === units.length && uuidList(v.retainedRevisionIds) && (v.owner.kind === 'universe' || units.some(u => u.snapshot.owner.kind === 'universe' && u.snapshot.owner.id === units.find(p => p.snapshot.owner.kind === 'project')?.snapshot.universeId)); }
function validResolution(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['recordId', 'liveFingerprint', 'recoveredFingerprint', 'choice', 'record', 'manuscript']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.recordId) && (v.liveFingerprint === null || digest(v.liveFingerprint)) && digest(v.recoveredFingerprint) && ['keep-live', 'use-recovered', 'combined'].includes(String(v.choice)) && (v.choice === 'combined' ? (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.validateWorkspaceRecord)(v.record) && v.record.id === v.recordId && (v.record.recordType === 'chapter' ? (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.manuscript) : v.manuscript === null) : v.record === null && v.manuscript === null); }
function validProposal(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'id', 'revisionId', 'owner', 'status', 'scope', 'expected', 'choices', 'operationId', 'replacedRevisionId']) && v.schemaVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.revisionId) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(v.owner) && ['review', 'canceled', 'applied', 'backup-required'].includes(String(v.status)) && (v.scope === null || uuidList(v.scope)) && Array.isArray(v.expected) && v.expected.length <= 2 && v.expected.every(e => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(e, ['owner', 'generation']) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(e.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(e.generation)) && Array.isArray(v.choices) && v.choices.every(validResolution) && new Set(v.choices.map(c => c.recordId)).size === v.choices.length && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.operationId) && (v.replacedRevisionId === null || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.replacedRevisionId)); }
function validRecoveryView(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['proposal', 'conflicts', 'issues', 'missing']) && validProposal(v.proposal) && Array.isArray(v.conflicts) && v.conflicts.every(c => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c, ['id', 'live', 'recovered', 'liveText', 'recoveredText', 'resolved', 'liveFingerprint', 'recoveredFingerprint']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.id) && (c.live === null || (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.validateWorkspaceRecord)(c.live) && c.live.id === c.id) && (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.validateWorkspaceRecord)(c.recovered) && c.recovered.id === c.id && (c.liveText === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(c.liveText)) && (c.recoveredText === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(c.recoveredText)) && typeof c.resolved === 'boolean' && (c.liveFingerprint === null || digest(c.liveFingerprint)) && digest(c.recoveredFingerprint)) && Array.isArray(v.issues) && v.issues.every(_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText) && Array.isArray(v.missing) && v.missing.every(m => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(m, ['sourceId', 'targetId', 'label', 'canRemove']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(m.sourceId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(m.targetId) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(m.label) && typeof m.canRemove === 'boolean'); }
function validProtectionValue(v) { if (typeof v !== 'object' || !v || Array.isArray(v))
    return false; const x = v, keys = ['reconciliation', 'warnings', 'assets', 'archives', 'recents', 'pending', 'deferrable', 'deferred', 'proposals', 'history', 'manifest', 'units', 'recovery', 'output', 'deleted', 'activated']; if (Object.keys(x).some(k => !keys.includes(k)))
    return false; return (!Object.hasOwn(x, 'reconciliation') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.reconciliation, ['operationId', 'outcome']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.reconciliation.operationId) && x.reconciliation.outcome === 'not-committed') && (!Object.hasOwn(x, 'warnings') || Array.isArray(x.warnings) && x.warnings.every(_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)) && (!Object.hasOwn(x, 'assets') || Array.isArray(x.assets) && x.assets.every(_workspace__WEBPACK_IMPORTED_MODULE_3__.validAssetData)) && (!Object.hasOwn(x, 'archives') || Array.isArray(x.archives) && x.archives.every(validArchiveRecord)) && (!Object.hasOwn(x, 'pending') || uuidList(x.pending)) && (!Object.hasOwn(x, 'deferrable') || uuidList(x.deferrable) && Array.isArray(x.pending) && x.deferrable.every(id => x.pending.includes(id))) && (!Object.hasOwn(x, 'deferred') || uuidList(x.deferred) && Array.isArray(x.deferrable) && x.deferred.every(id => x.deferrable.includes(id))) && (!Object.hasOwn(x, 'proposals') || uuidList(x.proposals)) && (!Object.hasOwn(x, 'recents') || Array.isArray(x.recents) && x.recents.every(r => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(r, ['id', 'owner', 'name', 'available']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(r.id) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(r.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(r.name) && typeof r.available === 'boolean')) && (!Object.hasOwn(x, 'history') || Array.isArray(x.history) && x.history.every(validRevisionManifest)) && (!Object.hasOwn(x, 'manifest') || validRevisionManifest(x.manifest)) && (!Object.hasOwn(x, 'units') || Array.isArray(x.units) && x.units.every(_workspace__WEBPACK_IMPORTED_MODULE_3__.validWorkspaceUnit)) && (!Object.hasOwn(x, 'recovery') || validRecoveryView(x.recovery)) && (!Object.hasOwn(x, 'output') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.output, ['id', 'path', 'notice']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.output.id) && nativePath(x.output.path) && (x.output.notice === null || x.output.notice === CATALOG_NOTICE)) && (!Object.hasOwn(x, 'deleted') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.deleted)) && (!Object.hasOwn(x, 'activated') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.activated, ['project', 'universe']) && (x.activated.project === null || nativePath(x.activated.project)) && nativePath(x.activated.universe)); }
function validArchiveRecord(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'id', 'owner', 'sha256', 'capturedAt', 'completedAt', 'locations', 'evidence', 'revisionIds', 'state']) && v.schemaVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(v.owner) && digest(v.sha256) && typeof v.capturedAt === 'string' && Number.isFinite(Date.parse(v.capturedAt)) && typeof v.completedAt === 'string' && Number.isFinite(Date.parse(v.completedAt)) && Array.isArray(v.locations) && v.locations.every(nativePath) && Array.isArray(v.evidence) && v.evidence.every(e => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(e, ['path', 'device', 'inode']) && nativePath(e.path) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(e.device) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(e.inode)) && uuidList(v.revisionIds) && ['valid', 'uncertain'].includes(String(v.state)); }


/***/ },

/***/ "./src/application/contracts/readiness.ts"
/*!************************************************!*\
  !*** ./src/application/contracts/readiness.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_CODES: () => (/* binding */ ERROR_CODES),
/* harmony export */   PROTOCOL_VERSION: () => (/* binding */ PROTOCOL_VERSION),
/* harmony export */   QUERY: () => (/* binding */ QUERY),
/* harmony export */   unavailable: () => (/* binding */ unavailable),
/* harmony export */   validRequest: () => (/* binding */ validRequest),
/* harmony export */   validResult: () => (/* binding */ validResult)
/* harmony export */ });
const PROTOCOL_VERSION = 1;
const QUERY = 'application.readiness';
const ERROR_CODES = ['HOST_START_FAILED', 'HOST_EXITED', 'TIMEOUT', 'INVALID_RESPONSE', 'UNAVAILABLE'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function closed(value, keys) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}
function validRequest(value) {
    return closed(value, ['protocolVersion', 'requestId', 'query']) && value.protocolVersion === 1 && typeof value.requestId === 'string' && uuid.test(value.requestId) && value.query === QUERY;
}
function validResult(value, requestId) {
    if (typeof value !== 'object' || value === null)
        return false;
    const candidate = value;
    const ready = candidate.status === 'ready';
    return closed(value, ready ? ['protocolVersion', 'requestId', 'status'] : ['protocolVersion', 'requestId', 'status', 'code']) && candidate.protocolVersion === 1 && uuid.test(requestId) && candidate.requestId === requestId && (ready || (candidate.status === 'unavailable' && ERROR_CODES.includes(candidate.code)));
}
function unavailable(requestId, code) {
    return { protocolVersion: 1, requestId, status: 'unavailable', code };
}


/***/ },

/***/ "./src/application/contracts/universe.ts"
/*!***********************************************!*\
  !*** ./src/application/contracts/universe.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UNIVERSE_CHANNEL: () => (/* binding */ UNIVERSE_CHANNEL),
/* harmony export */   closed: () => (/* reexport safe */ _domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed),
/* harmony export */   commands: () => (/* binding */ commands),
/* harmony export */   isGeneration: () => (/* binding */ isGeneration),
/* harmony export */   isUuid: () => (/* reexport safe */ _domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid),
/* harmony export */   universeErrorCodes: () => (/* binding */ universeErrorCodes),
/* harmony export */   validProfile: () => (/* reexport safe */ _domain_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile),
/* harmony export */   validReceipt: () => (/* binding */ validReceipt),
/* harmony export */   validSnapshot: () => (/* binding */ validSnapshot),
/* harmony export */   validUniverseRequest: () => (/* binding */ validUniverseRequest),
/* harmony export */   validUniverseResult: () => (/* binding */ validUniverseResult)
/* harmony export */ });
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
const UNIVERSE_CHANNEL = 'writingtool:universe:v1';
const commands = ['universe.create', 'universe.open', 'universe.current', 'universe.profile.save', 'universe.close'];


const universeErrorCodes = ['VALIDATION', 'UNSUPPORTED_VERSION', 'GENERATION_CONFLICT', 'LEASE_UNAVAILABLE', 'IO_FAILURE', 'INTEGRITY_MISMATCH', 'RECOVERY_REQUIRED', 'OPERATION_CONFLICT', 'HOST_UNAVAILABLE'];
const isGeneration = (v) => typeof v === 'string' && /^(0|[1-9][0-9]*)$/.test(v);
function validUniverseRequest(v, internal = false) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.requestId) || !commands.includes(x.command))
        return false;
    const mutation = x.command === 'universe.create' || x.command === 'universe.profile.save';
    const keys = ['protocolVersion', 'requestId', 'command', ...(mutation ? ['input'] : []), ...(x.command === 'universe.open' && Object.hasOwn(x, 'reconcileOperationId') ? ['reconcileOperationId'] : []), ...(internal && x.command === 'universe.open' && Object.hasOwn(x, 'reconcileExpected') ? ['reconcileExpected'] : []), ...(internal && (x.command === 'universe.create' || x.command === 'universe.open') ? ['basePath'] : [])];
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, keys) || (keys.includes('basePath') && typeof x.basePath !== 'string'))
        return false;
    if (Object.hasOwn(x, 'reconcileExpected')) {
        const e = x.reconcileExpected;
        if (!internal || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.reconcileOperationId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e, ['identity', 'mutation']))
            return false;
        if (!((0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e.identity, ['ownerId', 'rootId']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.identity.ownerId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.identity.rootId)) && !((0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e.identity, ['creationOperationId']) && e.identity.creationOperationId === x.reconcileOperationId))
            return false;
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e.mutation, ['command', 'input']) || !['universe.create', 'universe.profile.save'].includes(String(e.mutation.command)))
            return false;
        if (!validUniverseRequest({ protocolVersion: 1, requestId: x.requestId, ...e.mutation }) || e.mutation.input.operationId !== x.reconcileOperationId)
            return false;
    }
    if (!mutation)
        return !Object.hasOwn(x, 'reconcileOperationId') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.reconcileOperationId);
    const save = x.command === 'universe.profile.save';
    const i = x.input;
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(i, ['operationId', 'submittedEditorRevision', 'data', ...(save ? ['ownerId', 'expectedUnitGeneration', 'expectedRecordVersion'] : [])]) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(i.operationId) && isGeneration(i.submittedEditorRevision) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile)(i.data) && (!save || ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(i.ownerId) && isGeneration(i.expectedUnitGeneration) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(i.expectedRecordVersion)));
}
function validSnapshot(v) {
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['ownerId', 'rootId', 'generation', 'recordVersion', 'profile', 'location']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.ownerId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.rootId) && isGeneration(v.generation) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile)(v.profile) && !!v.profile.name.trim() && v.profile.name === v.profile.name.trim() && typeof v.location === 'string';
}
function validReceipt(v) {
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['protocolVersion', 'operationId', 'owner', 'unitGeneration', 'recordId', 'recordVersion', 'submittedEditorRevision']) && v.protocolVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.operationId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) && v.owner.kind === 'universe' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.owner.id) && v.recordId === v.owner.id && isGeneration(v.unitGeneration) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && isGeneration(v.submittedEditorRevision);
}
function validUniverseResult(v, request) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || x.requestId !== request.requestId || x.command !== request.command)
        return false;
    const base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.status === 'canceled')
        return (request.command === 'universe.create' || request.command === 'universe.open') && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, base);
    if (x.status === 'ok') {
        const hasReceipt = Object.hasOwn(x, 'receipt');
        const hasReconciliation = Object.hasOwn(x, 'reconciliation');
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'snapshot', ...(hasReceipt ? ['receipt'] : []), ...(hasReconciliation ? ['reconciliation'] : [])]))
            return false;
        if (request.command === 'universe.open' && request.reconcileOperationId) {
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(x.reconciliation, ['operationId', 'outcome']) || x.reconciliation.operationId !== request.reconcileOperationId || !['committed', 'not-committed'].includes(String(x.reconciliation.outcome)) || hasReceipt !== (x.reconciliation.outcome === 'committed'))
                return false;
        }
        else if (hasReconciliation)
            return false;
        if (request.command === 'universe.close')
            return x.snapshot === null && !hasReceipt;
        if (request.command === 'universe.current')
            return !hasReceipt && (x.snapshot === null || validSnapshot(x.snapshot));
        if (!validSnapshot(x.snapshot))
            return false;
        if (request.command === 'universe.open' && !hasReceipt)
            return true;
        if (!validReceipt(x.receipt) || x.receipt.owner.id !== x.snapshot.ownerId || BigInt(x.receipt.unitGeneration) > BigInt(x.snapshot.generation))
            return false;
        if (x.receipt.unitGeneration === x.snapshot.generation && x.receipt.recordVersion !== x.snapshot.recordVersion)
            return false;
        if (request.command === 'universe.open')
            return !!request.reconcileOperationId && x.receipt.operationId === request.reconcileOperationId;
        return !!request.input && x.receipt.operationId === request.input.operationId && x.receipt.submittedEditorRevision === request.input.submittedEditorRevision && (!('ownerId' in request.input) || x.receipt.owner.id === request.input.ownerId);
    }
    return x.status === 'error' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'code', 'message', 'outcome', 'retry']) && universeErrorCodes.includes(x.code) && typeof x.message === 'string' && x.message.length > 0 && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry));
}


/***/ },

/***/ "./src/application/contracts/workspace.ts"
/*!************************************************!*\
  !*** ./src/application/contracts/workspace.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SETTINGS_ID: () => (/* binding */ SETTINGS_ID),
/* harmony export */   WORKSPACE_CHANNEL: () => (/* binding */ WORKSPACE_CHANNEL),
/* harmony export */   validAppSettings: () => (/* binding */ validAppSettings),
/* harmony export */   validAssetData: () => (/* binding */ validAssetData),
/* harmony export */   validManagedImage: () => (/* binding */ validManagedImage),
/* harmony export */   validOwner: () => (/* binding */ validOwner),
/* harmony export */   validWorkspaceMutation: () => (/* binding */ validWorkspaceMutation),
/* harmony export */   validWorkspaceReceipt: () => (/* binding */ validWorkspaceReceipt),
/* harmony export */   validWorkspaceRequest: () => (/* binding */ validWorkspaceRequest),
/* harmony export */   validWorkspaceResult: () => (/* binding */ validWorkspaceResult),
/* harmony export */   validWorkspaceUnit: () => (/* binding */ validWorkspaceUnit)
/* harmony export */ });
/* harmony import */ var _universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../domain/workspace */ "./src/domain/workspace.ts");




const WORKSPACE_CHANNEL = 'writingtool:workspace:v1';
const validOwner = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'id']) && ['project', 'universe'].includes(String(v.kind)) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id);
function validWorkspaceMutation(v) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['operationId', 'submittedEditorRevision', 'units']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.operationId) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.submittedEditorRevision) || !Array.isArray(v.units) || v.units.length < 1 || v.units.length > 2)
        return false;
    const owners = new Set();
    return v.units.every(u => {
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(u, ['owner', 'expectedUnitGeneration', 'changes']) || !validOwner(u.owner) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(u.expectedUnitGeneration) || !Array.isArray(u.changes) || owners.has(u.owner.kind + u.owner.id))
            return false;
        owners.add(u.owner.kind + u.owner.id);
        const ids = new Set();
        return u.changes.every(c => {
            if (typeof c !== 'object' || !c)
                return false;
            if (c.action === 'delete') {
                if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c, ['action', 'id', 'expectedRecordVersion']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.id) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.expectedRecordVersion) || ids.has(c.id))
                    return false;
                ids.add(c.id);
                return true;
            }
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c, ['action', 'record', 'expectedRecordVersion', 'manuscript']) || c.action !== 'put' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c.record, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) || c.record.schemaVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.record.id) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.record.recordVersion) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.record.universeId) || !validOwner(c.record.owner) || !Object.hasOwn(_domain_workspace__WEBPACK_IMPORTED_MODULE_3__.recordCategory, String(c.record.recordType)) || (c.expectedRecordVersion !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.expectedRecordVersion)) || (c.manuscript !== null && !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(c.manuscript)) || ids.has(c.record.id))
                return false;
            ids.add(c.record.id);
            return true;
        });
    });
}
function validWorkspaceRequest(v, internal = false) {
    if (typeof v !== 'object' || !v)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.requestId))
        return false;
    const base = ['protocolVersion', 'requestId', 'command'];
    let keys;
    switch (x.command) {
        case 'workspace.query':
        case 'settings.get':
        case 'settings.export':
            keys = [];
            break;
        case 'workspace.mutate':
            keys = ['input'];
            if (!validWorkspaceMutation(x.input))
                return false;
            break;
        case 'workspace.reconcile':
            keys = ['operationId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId))
                return false;
            break;
        case 'workspace.asset.import':
            keys = ['owner', 'operationId', 'expectedUnitGeneration'];
            if (!validOwner(x.owner) || x.owner.kind !== 'universe' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(x.expectedUnitGeneration))
                return false;
            if (internal && Object.hasOwn(x, 'nativeAsset')) {
                if (!validAssetData(x.nativeAsset))
                    return false;
                keys.push('nativeAsset');
            }
            break;
        case 'workspace.asset.read':
            keys = ['owner', 'assetId'];
            if (!validOwner(x.owner) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.assetId))
                return false;
            break;
        case 'settings.save':
            keys = ['expectedRecordVersion', 'values'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.expectedRecordVersion) || !validAppSettings(x.values))
                return false;
            break;
        case 'settings.import':
            keys = internal && Object.hasOwn(x, 'nativeSettings') ? ['nativeSettings'] : [];
            break;
        case 'settings.select-backup':
            keys = internal && Object.hasOwn(x, 'nativeDestination') ? ['nativeDestination'] : [];
            if (keys.length && (!(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(x.nativeDestination) || !x.nativeDestination || x.nativeDestination.includes('\0')))
                return false;
            break;
        default: return false;
    }
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, [...base, ...keys]);
}
function validWorkspaceReceipt(v) {
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['protocolVersion', 'operationId', 'submittedEditorRevision', 'units']) && v.protocolVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.operationId) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.submittedEditorRevision) && Array.isArray(v.units) && v.units.length > 0 && v.units.every(u => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(u, ['owner', 'unitGeneration', 'records']) && validOwner(u.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(u.unitGeneration) && Array.isArray(u.records) && u.records.every(r => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(r, ['id', 'recordVersion', 'deleted']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(r.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(r.recordVersion) && typeof r.deleted === 'boolean'));
}
const SETTINGS_ID = 'b5a83e04-1e76-4c44-a17d-9ebd3ae09b2f';
function validAppSettings(v) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'id', 'recordVersion', 'autosaveMinutes', 'revisionMinutes', 'backupMinutes', 'retentionDays', 'backupDestination', 'theme', 'fontFamily', 'fontSize', 'panels']) || v.schemaVersion !== 1 || v.id !== SETTINGS_ID || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.recordVersion) || !['autosaveMinutes', 'revisionMinutes', 'backupMinutes', 'retentionDays'].every(k => (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.positiveInteger)(v[k])) || (v.backupDestination !== null && (!(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.backupDestination) || !v.backupDestination || v.backupDestination.includes('\0'))) || !['light', 'dark', 'system'].includes(String(v.theme)) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.fontFamily) || !v.fontFamily.trim() || typeof v.fontSize !== 'string' || !/^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.[0-9]*[1-9][0-9]*)$/.test(v.fontSize) || !Array.isArray(v.panels))
        return false;
    return v.panels.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(p, ['id', 'visible', 'collapsed', 'placement', 'order', 'width', 'height', 'monitor', 'x', 'y']) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(p.id) && !!p.id && typeof p.visible === 'boolean' && typeof p.collapsed === 'boolean' && ['left', 'right', 'bottom', 'center', 'floating'].includes(String(p.placement)) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(p.order) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.positiveInteger)(p.width) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.positiveInteger)(p.height) && (p.monitor === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(p.monitor)) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.signedInteger)(p.x) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.signedInteger)(p.y)) && new Set(v.panels.map(p => p.id)).size === v.panels.length;
}
function validManagedImage(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['id', 'sha256', 'mediaType']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && typeof v.sha256 === 'string' && /^[a-f0-9]{64}$/.test(v.sha256) && ['image/png', 'image/jpeg', 'image/webp'].includes(String(v.mediaType)); }
function validAssetData(v) { if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['id', 'sha256', 'mediaType', 'base64']))
    return false; const { base64, ...image } = v; return validManagedImage(image) && typeof base64 === 'string' && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64); }
function validWorkspaceUnit(v) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['owner', 'rootId', 'universeId', 'generation', 'records', 'manuscripts', 'assets', 'counters']) || !validOwner(v.owner) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.rootId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.universeId) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.generation) || v.owner.kind === 'universe' && v.owner.id !== v.universeId || !Array.isArray(v.records) || !v.records.every(_domain_workspace__WEBPACK_IMPORTED_MODULE_3__.validateWorkspaceRecord) || new Set(v.records.map(r => r.id)).size !== v.records.length || !v.records.every(r => r.owner.kind === v.owner.kind && r.owner.id === v.owner.id && r.universeId === v.universeId) || typeof v.manuscripts !== 'object' || !v.manuscripts || Array.isArray(v.manuscripts) || !Array.isArray(v.assets) || !v.assets.every(validManagedImage) || new Set(v.assets.map(a => a.id)).size !== v.assets.length || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v.counters, ['event', 'decision', 'story', 'chapter']) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.event) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.decision) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.story) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.chapter))
        return false;
    const manuscripts = v.manuscripts, chapters = v.records.filter(r => r.recordType === 'chapter');
    return Object.keys(manuscripts).length === chapters.length && chapters.every(c => (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(manuscripts[c.id]) && !manuscripts[c.id].includes('\r'));
}
function validWorkspaceResult(v, r) {
    if (typeof v !== 'object' || !v)
        return false;
    const x = v, base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.protocolVersion !== 1 || x.requestId !== r.requestId || x.command !== r.command)
        return false;
    if (x.status === 'canceled')
        return ['workspace.asset.import', 'settings.import', 'settings.export', 'settings.select-backup'].includes(r.command) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, base);
    if (x.status === 'error')
        return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, [...base, 'code', 'message', 'outcome', 'retry', 'issues']) && _universe__WEBPACK_IMPORTED_MODULE_0__.universeErrorCodes.includes(x.code) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(x.message) && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry)) && Array.isArray(x.issues) && x.issues.every(i => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(i, ['field', 'message']) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(i.field) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(i.message));
    if (x.status !== 'ok' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, [...base, 'snapshot', 'receipt', 'settings', 'warnings', 'asset', 'destination']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.snapshot, ['project', 'universe']) || (x.snapshot.project !== null && !validWorkspaceUnit(x.snapshot.project)) || (x.snapshot.universe !== null && !validWorkspaceUnit(x.snapshot.universe)) || (x.receipt !== null && !validWorkspaceReceipt(x.receipt)) || (x.settings !== null && !validAppSettings(x.settings)) || (x.asset !== null && !validAssetData(x.asset)) || !Array.isArray(x.warnings) || !x.warnings.every(_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText) || (x.destination !== null && !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(x.destination)))
        return false;
    const snapshot = x.snapshot;
    if (snapshot.project && (!snapshot.universe || snapshot.project.universeId !== snapshot.universe.owner.id))
        return false;
    if (r.command.startsWith('settings.'))
        return x.settings !== null && x.receipt === null && x.asset === null;
    if (x.settings !== null)
        return false;
    if (['workspace.mutate', 'workspace.asset.import'].includes(r.command) && x.receipt === null)
        return false;
    if (['workspace.query', 'workspace.asset.read'].includes(r.command) && x.receipt !== null)
        return false;
    if (['workspace.asset.read', 'workspace.asset.import'].includes(r.command) !== (x.asset !== null))
        return false;
    if (x.receipt) {
        const receipt = x.receipt;
        if (r.input && (receipt.operationId !== r.input.operationId || receipt.submittedEditorRevision !== r.input.submittedEditorRevision || !r.input.units.every(u => receipt.units.some(saved => saved.owner.kind === u.owner.kind && saved.owner.id === u.owner.id && saved.unitGeneration === (BigInt(u.expectedUnitGeneration) + 1n).toString()))))
            return false;
        if (r.operationId && receipt.operationId !== r.operationId)
            return false;
        for (const unit of receipt.units) {
            const current = [snapshot.project, snapshot.universe].find(s => s?.owner.kind === unit.owner.kind && s.owner.id === unit.owner.id);
            if (!current || BigInt(current.generation) < BigInt(unit.unitGeneration))
                return false;
            if (current.generation === unit.unitGeneration && !unit.records.every(record => record.deleted ? !current.records.some(r => r.id === record.id) : current.records.some(r => r.id === record.id && r.recordVersion === record.recordVersion)))
                return false;
        }
    }
    if (r.command === 'workspace.asset.read' && r.assetId && x.asset.id !== r.assetId)
        return false;
    return true;
}


/***/ },

/***/ "./src/desktop/host-client.ts"
/*!************************************!*\
  !*** ./src/desktop/host-client.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HostClient: () => (/* binding */ HostClient)
/* harmony export */ });
/* harmony import */ var _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/readiness */ "./src/application/contracts/readiness.ts");

class HostClient {
    host;
    timeoutMs;
    limit;
    pending = new Map();
    expired = new Set();
    failure;
    constructor(host, timeoutMs = 5000, limit = 32) {
        this.host = host;
        this.timeoutMs = timeoutMs;
        this.limit = limit;
        if (!host)
            this.failure = 'HOST_START_FAILED';
    }
    get pendingCount() { return this.pending.size; }
    request(request) {
        if (this.failure)
            return Promise.resolve((0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.unavailable)(request.requestId, this.failure));
        if (this.pending.size >= this.limit || this.pending.has(request.requestId) || this.expired.has(request.requestId))
            return Promise.resolve((0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.unavailable)(request.requestId, 'UNAVAILABLE'));
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                this.expired.add(request.requestId);
                if (this.expired.size > this.limit)
                    this.expired.delete(this.expired.values().next().value);
                this.finish(request.requestId, (0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.unavailable)(request.requestId, 'TIMEOUT'));
            }, this.timeoutMs);
            this.pending.set(request.requestId, { resolve, timer });
            try {
                this.host?.postMessage(request);
            }
            catch {
                this.fail('HOST_EXITED');
            }
        });
    }
    receive(message) {
        const id = typeof message === 'object' && message !== null && 'requestId' in message ? message.requestId : undefined;
        if (typeof id === 'string' && this.expired.has(id) && (0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.validResult)(message, id))
            return;
        if (typeof id !== 'string' || !this.pending.has(id)) {
            this.fail('INVALID_RESPONSE');
            return;
        }
        if (!(0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.validResult)(message, id)) {
            this.fail('INVALID_RESPONSE');
            return;
        }
        this.finish(id, message);
    }
    fail(code) {
        this.failure ??= code;
        for (const id of this.pending.keys())
            this.finish(id, (0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.unavailable)(id, this.failure));
    }
    finish(id, result) {
        const entry = this.pending.get(id);
        if (!entry)
            return;
        clearTimeout(entry.timer);
        this.pending.delete(id);
        entry.resolve(result);
    }
}


/***/ },

/***/ "./src/desktop/presentation.ts"
/*!*************************************!*\
  !*** ./src/desktop/presentation.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerPresentation: () => (/* binding */ registerPresentation)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:child_process */ "node:child_process");
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/presentation */ "./src/application/contracts/presentation.ts");
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./security */ "./src/desktop/security.ts");







const EVENT = 'writingtool:presentation-event:v1';
/** Floating windows receive read-only projections; only the primary controller can publish. */
function registerPresentation(owner, entry, preload) {
    const windows = new Map(), appliedBounds = new Map();
    let mirror = null, fonts = null, syncing = false, disposed = false, syncTail = Promise.resolve();
    const childId = (event) => { for (const [id, w] of windows)
        if (!w.isDestroyed() && event.senderFrame && (0,_security__WEBPACK_IMPORTED_MODULE_6__.trustedSender)(event.sender.id, w.webContents.id, event.senderFrame === w.webContents.mainFrame, event.senderFrame.url, `${entry}#floating-${id}`))
            return id; return null; };
    const primary = (event) => { const w = owner(); return !!w && !w.isDestroyed() && !!event.senderFrame && (0,_security__WEBPACK_IMPORTED_MODULE_6__.trustedSender)(event.sender.id, w.webContents.id, event.senderFrame === w.webContents.mainFrame, event.senderFrame.url, entry); };
    const send = (event) => { const w = owner(); if (w && !w.isDestroyed())
        w.webContents.send(EVENT, event); };
    const monitors = () => electron__WEBPACK_IMPORTED_MODULE_0__.screen.getAllDisplays().map(d => ({ id: String(d.id), ...d.workArea }));
    function validMirror(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(v, ['snapshot', 'settings', 'universeName', 'storyId', 'chapterId', 'selectedId', 'timeline', 'contextTab', 'characterFilter', 'blocked']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(v.snapshot, ['project', 'universe']) && (v.snapshot.project === null || (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validWorkspaceUnit)(v.snapshot.project)) && (v.snapshot.universe === null || (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validWorkspaceUnit)(v.snapshot.universe)) && (v.settings === null || (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validAppSettings)(v.settings)) && typeof v.universeName === 'string' && (v.storyId === null || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.isUuid)(v.storyId)) && (v.chapterId === null || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.isUuid)(v.chapterId)) && (v.selectedId === null || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.isUuid)(v.selectedId)) && (0,_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.validTimelineView)(v.timeline) && ['characters', 'factions', 'plots', 'decisions'].includes(String(v.contextTab)) && ['all', 'main', 'major', 'minor', 'extra'].includes(String(v.characterFilter)) && typeof v.blocked === 'boolean'; }
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle(_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.PRESENTATION_CHANNEL, async (event, value) => {
        if (disposed)
            return { status: 'error', message: 'The writing workspace is closing.' };
        const main = primary(event), id = childId(event);
        if (!main && !id)
            throw new Error('Presentation request denied');
        const result = () => ({ status: 'ok', fonts: [], monitors: monitors(), panelId: id, mirror: id ? mirror : null });
        if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(value, ['command']) && value.command === 'inventory' && main) {
            fonts ??= installedFonts();
            return { ...result(), status: 'ok', fonts: [...new Set([...await fonts, 'Liberation Serif', 'Liberation Sans', 'Liberation Mono'])], monitors: monitors(), panelId: null, mirror: null };
        }
        if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(value, ['command']) && value.command === 'panel.read' && id)
            return result();
        if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(value, ['command']) && value.command === 'panel.flush' && main) {
            await syncTail;
            const layoutPatches = [];
            for (const [panelId, child] of windows) {
                if (child.isDestroyed() || !child.isVisible())
                    continue;
                const b = child.getBounds(), patch = { x: String(b.x), y: String(b.y), width: String(b.width), height: String(b.height), monitor: String(electron__WEBPACK_IMPORTED_MODULE_0__.screen.getDisplayMatching(b).id) }, saved = mirror?.settings?.panels.find(p => p.id === panelId);
                if (saved && Object.entries(patch).some(([key, value]) => saved[key] !== value))
                    layoutPatches.push({ id: panelId, patch });
            }
            return { ...result(), status: 'ok', layoutPatches };
        }
        if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(value, ['command', 'action']) && value.command === 'panel.action' && id && (0,_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.validPanelAction)(value.action)) {
            if (!mirror || mirror.blocked)
                return { status: 'error', message: 'Finish the active operation in the main window.' };
            if (['select', 'edit', 'move'].includes(value.action.kind) && ![...(mirror.snapshot.project?.records ?? []), ...(mirror.snapshot.universe?.records ?? [])].some(r => r.id === value.action.id))
                return { status: 'error', message: 'This record is no longer active.' };
            if (value.action.kind === 'create-event') {
                const calendar = mirror.snapshot.universe?.records.find(r => r.recordType === 'calendar');
                try {
                    if (!calendar || calendar.recordType !== 'calendar')
                        throw new Error('Calendar unavailable.');
                    (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_5__.elapsedPosition)(value.action.date, calendar.data);
                }
                catch {
                    return { status: 'error', message: 'This date is no longer available in the active universe calendar.' };
                }
            }
            if (value.action.kind === 'timeline') {
                const calendar = mirror.snapshot.universe?.records.find(r => r.recordType === 'calendar');
                if (!(0,_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.validTimelineCalendar)(value.action.value, calendar?.recordType === 'calendar' ? calendar.data : null))
                    return { status: 'error', message: 'This timeline date is no longer available in the active universe calendar.' };
            }
            send({ kind: 'action', action: value.action, panelId: id });
            if ((0,_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.panelActionOpensMain)(value.action))
                owner()?.focus();
            return result();
        }
        if ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_4__.closed)(value, ['command', 'layouts', 'mirror']) && value.command === 'panel.sync' && main && validMirror(value.mirror) && Array.isArray(value.layouts) && value.mirror.settings && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validAppSettings)({ ...value.mirror.settings, panels: value.layouts })) {
            const projection = value.mirror, layouts = value.layouts;
            const synchronize = async () => { if (disposed)
                return { status: 'error', message: 'The writing workspace is closing.' }; mirror = projection; syncing = true; try {
                for (const panelId of _application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.PANEL_IDS) {
                    if (disposed)
                        return { status: 'error', message: 'The writing workspace is closing.' };
                    const layout = layouts.find(p => p.id === panelId), existing = windows.get(panelId);
                    if (!layout || !layout.visible || layout.placement !== 'floating') {
                        if (existing && !existing.isDestroyed())
                            existing.hide();
                        continue;
                    }
                    const monitor = monitors().find(m => m.id === layout.monitor);
                    if (layout.monitor && !monitor) {
                        existing?.hide();
                        send({ kind: 'layout', id: panelId, patch: { placement: panelId === 'context' ? 'right' : 'left', monitor: null } });
                        continue;
                    }
                    const rect = { x: Number(layout.x), y: Number(layout.y), width: Number(layout.width), height: Number(layout.height) };
                    if (!Object.values(rect).every(Number.isSafeInteger)) {
                        send({ kind: 'layout', id: panelId, patch: { placement: panelId === 'context' ? 'right' : 'left', monitor: null } });
                        continue;
                    }
                    let child = existing;
                    if (!child || child.isDestroyed()) {
                        const target = monitor ?? monitors()[0];
                        const inBounds = monitors().some(m => rect.x < m.x + m.width && rect.x + rect.width > m.x && rect.y < m.y + m.height && rect.y + rect.height > m.y);
                        child = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({ parent: owner(), title: `WritingTool — ${panelId}`, width: Math.max(240, rect.width), height: Math.max(240, rect.height), x: inBounds ? rect.x : target.x + 40, y: inBounds ? rect.y : target.y + 40, minWidth: 240, minHeight: 240, show: false, backgroundColor: '#292929', webPreferences: { preload, sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false } });
                        windows.set(panelId, child);
                        const owned = child;
                        child.removeMenu();
                        child.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
                        child.webContents.on('will-navigate', e => e.preventDefault());
                        child.webContents.on('will-redirect', e => e.preventDefault());
                        child.webContents.on('will-attach-webview', e => e.preventDefault());
                        child.on('close', e => { if (owner() && !owner().isDestroyed()) {
                            e.preventDefault();
                            owned.hide();
                            send({ kind: 'layout', id: panelId, patch: { visible: false } });
                        } });
                        let timer;
                        const bounds = () => { if (syncing)
                            return; clearTimeout(timer); timer = setTimeout(() => { if (owned.isDestroyed())
                            return; const b = owned.getBounds(); send({ kind: 'layout', id: panelId, patch: { x: String(b.x), y: String(b.y), width: String(b.width), height: String(b.height), monitor: String(electron__WEBPACK_IMPORTED_MODULE_0__.screen.getDisplayMatching(b).id) } }); }, 350); };
                        child.on('moved', bounds);
                        child.on('resized', bounds);
                        child.on('closed', () => { clearTimeout(timer); windows.delete(panelId); });
                        await child.loadURL(`${entry}#floating-${panelId}`);
                    }
                    if (disposed || child.isDestroyed())
                        return { status: 'error', message: 'The writing workspace is closing.' };
                    const previousBounds = appliedBounds.get(panelId), currentBounds = child.getBounds(), targetBounds = { x: rect.x, y: rect.y, width: Math.max(240, rect.width), height: Math.max(240, rect.height) };
                    if (existing && previousBounds && Object.entries(targetBounds).some(([key, value]) => previousBounds[key] !== value) && Object.entries(targetBounds).some(([key, value]) => currentBounds[key] !== value)) {
                        const visible = monitors().some(m => targetBounds.x < m.x + m.width && targetBounds.x + targetBounds.width > m.x && targetBounds.y < m.y + m.height && targetBounds.y + targetBounds.height > m.y);
                        if (visible)
                            child.setBounds(targetBounds);
                    }
                    appliedBounds.set(panelId, targetBounds);
                    child.webContents.send(EVENT, { kind: 'mirror', mirror });
                    if (!child.isVisible())
                        child.showInactive();
                }
                return result();
            }
            finally {
                syncing = false;
            } };
            const response = syncTail.then(synchronize, synchronize);
            syncTail = response.then(() => undefined, () => undefined);
            return response;
        }
        return { status: 'error', message: 'Invalid presentation command.' };
    });
    const displayRemoved = () => { for (const [id, w] of windows) {
        if (w.isDestroyed())
            continue;
        const bounds = w.getBounds();
        if (!monitors().some(m => bounds.x < m.x + m.width && bounds.x + bounds.width > m.x && bounds.y < m.y + m.height && bounds.y + bounds.height > m.y)) {
            w.hide();
            send({ kind: 'layout', id, patch: { placement: id === 'context' ? 'right' : 'left', monitor: null } });
        }
    } };
    electron__WEBPACK_IMPORTED_MODULE_0__.screen.on('display-removed', displayRemoved);
    return () => { if (disposed)
        return; disposed = true; electron__WEBPACK_IMPORTED_MODULE_0__.screen.removeListener('display-removed', displayRemoved); for (const child of windows.values())
        if (!child.isDestroyed())
            child.destroy(); windows.clear(); appliedBounds.clear(); mirror = null; const primaryWindow = owner(); if (primaryWindow && !primaryWindow.isDestroyed())
        primaryWindow.once('closed', () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.removeHandler(_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.PRESENTATION_CHANNEL));
    else
        electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.removeHandler(_application_contracts_presentation__WEBPACK_IMPORTED_MODULE_2__.PRESENTATION_CHANNEL); };
}
function installedFonts() { const command = process.platform === 'win32' ? 'powershell.exe' : process.platform === 'darwin' ? '/usr/sbin/system_profiler' : 'fc-list'; const args = process.platform === 'win32' ? ['-NoProfile', '-NonInteractive', '-Command', "(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts').PSObject.Properties | Where-Object { $_.Name -notmatch '^PS' } | ForEach-Object { $_.Name -replace ' \\(.*$','' }"] : process.platform === 'darwin' ? ['SPFontsDataType', '-json'] : ['--format', '%{family}\n']; return new Promise(resolve => (0,node_child_process__WEBPACK_IMPORTED_MODULE_1__.execFile)(command, args, { timeout: 15000, maxBuffer: 8 * 1024 * 1024, windowsHide: true }, (error, output) => { if (error) {
    resolve([]);
    return;
} let names = []; if (process.platform === 'darwin') {
    try {
        const data = JSON.parse(output);
        const walk = (v) => { if (Array.isArray(v))
            v.forEach(walk);
        else if (v && typeof v === 'object') {
            for (const [k, value] of Object.entries(v)) {
                if ((k === 'family' || k === 'family_name') && typeof value === 'string')
                    names.push(value);
                else
                    walk(value);
            }
        } };
        walk(data);
    }
    catch {
        resolve([]);
        return;
    }
}
else
    names = output.split(/[\r\n]+/).flatMap(line => line.split(',')); resolve([...new Set(names.map(n => n.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b))); })); }


/***/ },

/***/ "./src/desktop/project-host-client.ts"
/*!********************************************!*\
  !*** ./src/desktop/project-host-client.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProjectHostClient: () => (/* binding */ ProjectHostClient),
/* harmony export */   projectUnavailable: () => (/* binding */ projectUnavailable)
/* harmony export */ });
/* harmony import */ var _application_contracts_project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/project */ "./src/application/contracts/project.ts");

function projectUnavailable(request) {
    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'HOST_UNAVAILABLE', message: 'The host did not confirm the project operation. Reopen its folder before continuing.', outcome: request.command === 'project.create' ? 'unknown' : 'not-committed', retry: 'after-recovery' };
}
class ProjectHostClient {
    host;
    pending = new Map();
    failed = false;
    constructor(host) {
        this.host = host;
        this.failed = !host;
    }
    request(request) {
        if (this.failed || this.pending.size >= 32 || this.pending.has(request.requestId))
            return Promise.resolve({ ...projectUnavailable(request), outcome: 'not-committed' });
        return new Promise(resolve => {
            const timer = setTimeout(() => { this.fail(); }, 15000);
            this.pending.set(request.requestId, { request, resolve, timer });
            try {
                this.host.postMessage(request);
            }
            catch {
                this.fail();
            }
        });
    }
    receive(value) {
        if (typeof value !== 'object' || value === null || !('requestId' in value) || typeof value.requestId !== 'string') {
            this.fail();
            return;
        }
        const p = this.pending.get(value.requestId);
        if (!p)
            return;
        if (!(0,_application_contracts_project__WEBPACK_IMPORTED_MODULE_0__.validProjectResult)(value, p.request, true)) {
            this.fail();
            return;
        }
        clearTimeout(p.timer);
        this.pending.delete(value.requestId);
        p.resolve(value);
    }
    fail() { this.failed = true; for (const p of this.pending.values()) {
        clearTimeout(p.timer);
        p.resolve(projectUnavailable(p.request));
    } this.pending.clear(); }
}


/***/ },

/***/ "./src/desktop/protection-host-client.ts"
/*!***********************************************!*\
  !*** ./src/desktop/protection-host-client.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProtectionHostClient: () => (/* binding */ ProtectionHostClient),
/* harmony export */   protectionUnavailable: () => (/* binding */ protectionUnavailable)
/* harmony export */ });
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");

const protectionUnavailable = (r) => ({ protocolVersion: 1, requestId: r.requestId, command: r.command, status: 'error', message: (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__.protectionHasDurableEffects)(r) ? 'The protection outcome is unconfirmed. Retain this operation and reconcile before closing.' : 'The protection service did not answer. Retry the read or reopen the saved owning roots.', outcome: (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__.protectionHasDurableEffects)(r) ? 'unknown' : 'not-committed', operationId: (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__.protectionHasDurableEffects)(r) ? (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__.protectionOperationId)(r) : null });
class ProtectionHostClient {
    host;
    pending = new Map();
    constructor(host) {
        this.host = host;
    }
    request(request) { if (!this.host)
        return Promise.resolve(protectionUnavailable(request)); return new Promise(resolve => { this.pending.set(request.requestId, { request, resolve }); try {
        this.host.postMessage(request);
    }
    catch {
        this.fail();
    } }); }
    receive(v) { if (typeof v !== 'object' || !v || !('requestId' in v))
        return; const p = this.pending.get(String(v.requestId)); if (!p)
        return; if (!(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__.validProtectionResult)(v, p.request)) {
        this.fail();
        return;
    } this.pending.delete(p.request.requestId); p.resolve(v); }
    fail() { this.host = undefined; for (const p of this.pending.values())
        p.resolve(protectionUnavailable(p.request)); this.pending.clear(); }
}


/***/ },

/***/ "./src/desktop/protection.ts"
/*!***********************************!*\
  !*** ./src/desktop/protection.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nativeProtection: () => (/* binding */ nativeProtection),
/* harmony export */   runtimePath: () => (/* binding */ runtimePath)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _infrastructure_recent_roots__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../infrastructure/recent-roots */ "./src/infrastructure/recent-roots.ts");
/* harmony import */ var _domain_capture_time__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../domain/capture-time */ "./src/domain/capture-time.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../infrastructure/recovery-activation */ "./src/infrastructure/recovery-activation.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../infrastructure/universe-files */ "./src/infrastructure/universe-files.ts");









function nativeProtection(deps) {
    const recents = new _infrastructure_recent_roots__WEBPACK_IMPORTED_MODULE_3__.RecentRoots(electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData'));
    const outputs = new Map();
    const verifyOutput = (operationId, output) => {
        const job = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData'), `protection/jobs/${operationId}.json`));
        if (!job || typeof job !== 'object' || !('state' in job) || job.state !== 'complete' || !('destination' in job) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_5__.closed)(job.destination, ['path', 'expectedHash']) || job.destination.path !== output.path || !('digest' in job) || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_7__.digest)(job.digest))
            throw new Error('The completed output has no matching durable publication proof. Reconcile the original operation.');
        const observed = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.hashFile)(output.path);
        if (observed !== job.digest)
            throw new Error('The completed output changed before acknowledgement. Preserve it and reconcile the original operation.');
        return observed;
    };
    const inside = (file, root) => { const relative = node_path__WEBPACK_IMPORTED_MODULE_1___default().relative(root, file); return !relative || relative !== '..' && !relative.startsWith('..' + (node_path__WEBPACK_IMPORTED_MODULE_1___default().sep)) && !node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(relative); };
    function checkBackupFolder(folder, roots) { if (roots.some(root => inside(folder, root)))
        throw new Error('Choose a backup folder outside active writing roots.'); return folder; }
    async function chooseFile(title, extension, suggested, roots) { for (;;) {
        const result = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showSaveDialog(deps.window(), { title, defaultPath: suggested, filters: [{ name: extension.toUpperCase(), extensions: [extension] }], properties: ['showOverwriteConfirmation', 'createDirectory'] });
        if (result.canceled || !result.filePath)
            return null;
        const file = node_path__WEBPACK_IMPORTED_MODULE_1___default().resolve(result.filePath.toLowerCase().endsWith('.' + extension) ? result.filePath : result.filePath + '.' + extension), parent = node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(file)), resolved = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(parent, node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(file));
        if (roots.some(root => inside(resolved, root)))
            throw new Error('Choose an output outside all active writing roots.');
        let expectedHash = null;
        try {
            const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(resolved);
            if (!stat.isFile() || stat.nlink !== 1 || stat.isSymbolicLink())
                throw new Error('Choose a regular unaliased output.');
            expectedHash = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.hashFile)(resolved);
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
        return { path: resolved, expectedHash };
    } }
    async function backupFolder(closing, choose) { let folder = null; if (!choose)
        folder = (await deps.settings()).backupDestination; if (folder && !choose)
        try {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().accessSync(folder, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).W_OK);
            return node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(folder);
        }
        catch { } const selected = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showOpenDialog(deps.window(), { title: closing ? 'Choose the required closing backup folder' : 'Choose backup folder', properties: ['openDirectory', 'createDirectory'] }); if (!selected.canceled && selected.filePaths[0])
        return node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(selected.filePaths[0]); if (!closing)
        return null; for (const root of [node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('exe')), electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData')]) {
        try {
            (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.ensureManagedDirectory)(root, 'Backups');
            folder = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'Backups');
            const notice = Buffer.from((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, folder, createdAt: new Date().toISOString(), used: false, actualPath: null }));
            const userData = electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData'), relative = 'protection/close-fallback.json';
            (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.ensureManagedDirectory)(userData, 'protection');
            const old = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(userData, relative)) ? (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(userData, relative)) : null;
            (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.publishManagedBytes)(userData, relative, notice, old);
            return folder;
        }
        catch { }
    } throw new Error('Neither approved closing backup fallback is writable. Choose another folder or cancel closing.'); }
    return async (request) => {
        const base = { protocolVersion: 1, requestId: request.requestId, command: request.command };
        let sent = false;
        try {
            if (request.command === 'protection.recents')
                return { ...base, status: 'ok', value: { recents: recents.list().map(r => ({ id: r.id, owner: r.owner, name: r.name, available: recents.available(r) })) } };
            if (request.command === 'protection.recent') {
                const recent = recents.list().find(r => r.id === request.id);
                if (!recent)
                    throw new Error('That recent root is unavailable.');
                if (request.action === 'remove') {
                    recents.remove(recent.id);
                    return { ...base, status: 'ok', value: { recents: recents.list().map(r => ({ id: r.id, owner: r.owner, name: r.name, available: recents.available(r) })) } };
                }
                let location = recent.location;
                if (request.action === 'locate') {
                    const selected = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showOpenDialog(deps.window(), { title: 'Locate ' + recent.name, properties: ['openDirectory'] });
                    if (selected.canceled || !selected.filePaths[0])
                        return { ...base, status: 'canceled' };
                    location = node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(selected.filePaths[0]);
                }
                const candidate = { ...recent, location };
                if (!recents.available(candidate))
                    throw new Error('Locate the matching permanent root identity or recover a complete ZIP.');
                const activated = await deps.openRoot(recent.owner, location);
                const warnings = [];
                try {
                    recents.remember(recent.owner, recent.rootId, recent.name, location);
                }
                catch {
                    warnings.push('The owning roots opened, but the recent-root list could not be updated.');
                }
                return { ...base, status: 'ok', value: { activated, warnings } };
            }
            if (request.command === 'protection.open') {
                const output = outputs.get(request.outputId);
                if (!output || (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.hashFile)(output.path) !== output.hash)
                    throw new Error('This completed output is unavailable or changed.');
                if (request.folder)
                    electron__WEBPACK_IMPORTED_MODULE_2__.shell.showItemInFolder(output.path);
                else {
                    const error = await electron__WEBPACK_IMPORTED_MODULE_2__.shell.openPath(output.path);
                    if (error)
                        throw new Error(error);
                }
                return { ...base, status: 'ok', value: {} };
            }
            const original = request.command === 'protection.reconcile' ? deps.originalRequest(request.operationId) : request;
            let host = { ...request };
            const roots = deps.roots().map(root => node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(root));
            if (request.command === 'protection.reconcile' && original?.command === 'protection.apply') {
                const relative = (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.activationPath)(request.operationId), userData = electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData');
                if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(userData, relative))) {
                    const decision = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(userData, relative));
                    if (!(0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.validActivationDecision)(decision) || decision.requestId !== request.operationId || decision.proposalId !== original.proposalId)
                        throw new Error('The original activation evidence is invalid.');
                    const locations = [];
                    for (const participant of decision.participants) {
                        const staged = (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.activationRootAt)(participant.stage, participant), published = (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.activationRootAt)(participant.destination, participant);
                        if (staged && published)
                            throw new Error('Both recovery locations contain the original identity. Preserve both roots before reconciliation.');
                        if (published)
                            continue;
                        if (staged && (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.activationDestinationAvailable)(participant.destination, staged))
                            continue;
                        let location = staged;
                        if (!location) {
                            const selected = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showOpenDialog(deps.window(), { title: `Locate the original recovered ${participant.owner.kind} (${participant.owner.id})`, properties: ['openDirectory'] });
                            if (selected.canceled || !selected.filePaths[0])
                                return { ...base, status: 'canceled' };
                            location = (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.activationRootAt)(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(selected.filePaths[0]), participant);
                            if (!location)
                                throw new Error('Locate the matching permanent recovery root identity.');
                        }
                        let destination;
                        if (staged || decision.state !== 'complete') {
                            const selectedDestination = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showOpenDialog(deps.window(), { title: `Choose an empty folder for publishing the recovered ${participant.owner.kind}`, defaultPath: node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(location), properties: ['openDirectory', 'createDirectory'] });
                            if (selectedDestination.canceled || !selectedDestination.filePaths[0])
                                return { ...base, status: 'canceled' };
                            destination = node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(selectedDestination.filePaths[0]);
                            if (!(0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_6__.activationDestinationAvailable)(destination, location))
                                throw new Error('Choose an empty publication folder on the same filesystem as the staged recovery root.');
                        }
                        locations.push({ owner: participant.owner, rootId: participant.rootId, location, ...(destination ? { destination } : {}) });
                    }
                    const universe = deps.originalUniverse(request.operationId);
                    if (universe && !decision.participants.some(p => p.owner.kind === 'universe'))
                        locations.push(universe);
                    if (locations.length)
                        host = { ...host, nativeActivationLocations: locations };
                }
            }
            if (request.command === 'protection.reconcile' && request.chooseLocation) {
                if (original?.command === 'protection.export') {
                    const destination = await chooseFile('Retry saved ' + (original.format === 'sqlite' ? 'catalog' : 'manuscript') + ' export', original.format, `${(0,_domain_capture_time__WEBPACK_IMPORTED_MODULE_4__.safeDisplayName)(await deps.sourceName(original))}.${original.format}`, [...roots, electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData')]);
                    if (!destination)
                        return { ...base, status: 'canceled' };
                    host = { ...host, nativeDestination: destination, nativeRuntime: runtimePath() };
                }
                else {
                    if (original?.command !== 'protection.backup' && original?.command !== 'protection.apply')
                        throw new Error('Only an original backup, recovery or export operation can choose another output location.');
                    const folder = await backupFolder(original.command === 'protection.backup' && original.closing, true);
                    if (!folder)
                        return { ...base, status: 'canceled' };
                    host = { ...host, nativeBackupFolder: checkBackupFolder(folder, roots) };
                }
            }
            if (request.command === 'protection.export') {
                const destination = await chooseFile('Export saved ' + (request.format === 'sqlite' ? 'catalog' : 'manuscript'), request.format, `${(0,_domain_capture_time__WEBPACK_IMPORTED_MODULE_4__.safeDisplayName)(await deps.sourceName(request))}${request.format === 'sqlite' ? '_catalog' : request.chapterIds !== null ? '_selected_chapters' : ''}.${request.format}`, [...roots, electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData')]);
                if (!destination)
                    return { ...base, status: 'canceled' };
                host = { ...host, nativeDestination: destination, nativeRuntime: runtimePath() };
            }
            if (request.command === 'protection.backup') {
                const folder = await backupFolder(request.closing, request.chooseLocation);
                if (!folder)
                    return { ...base, status: 'canceled' };
                host = { ...host, nativeBackupFolder: checkBackupFolder(folder, roots) };
            }
            if (request.command === 'protection.archive-locate' || request.command === 'protection.recover' && !request.revisionId) {
                const selected = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showOpenDialog(deps.window(), { title: 'Recover independent complete ZIP', properties: ['openFile'], filters: [{ name: 'Complete WritingTool backup', extensions: ['zip'] }] });
                if (selected.canceled || !selected.filePaths[0])
                    return { ...base, status: 'canceled' };
                host = { ...host, nativeArchive: node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(selected.filePaths[0]) };
            }
            if (request.command === 'protection.apply') {
                const proposal = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData'), `protection/proposals/${request.proposalId}.json`));
                if (!(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_7__.validProposal)(proposal) || proposal.id !== request.proposalId)
                    throw new Error('The recovery proposal is unavailable or invalid.');
                if (!deps.activeOwners().some(owner => owner.kind === proposal.owner.kind && owner.id === proposal.owner.id)) {
                    const chosen = await electron__WEBPACK_IMPORTED_MODULE_2__.dialog.showOpenDialog(deps.window(), { title: 'Choose an empty folder for recovered owning roots', properties: ['openDirectory', 'createDirectory'] });
                    if (chosen.canceled || !chosen.filePaths[0])
                        return { ...base, status: 'canceled' };
                    const root = node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(chosen.filePaths[0]);
                    if (roots.some(live => inside(root, live) || inside(live, root)))
                        throw new Error('Choose a recovery folder separate from the active writing roots.');
                    if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(root).length)
                        throw new Error('Choose an empty recovery folder.');
                    host = { ...host, nativeActivation: { project: node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'Project'), universe: node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'Universe') } };
                    const folder = await backupFolder(false, false);
                    if (!folder)
                        return { ...base, status: 'canceled' };
                    host = { ...host, nativeBackupFolder: checkBackupFolder(folder, roots) };
                }
                else {
                    const folder = await backupFolder(false, false);
                    if (!folder)
                        return { ...base, status: 'canceled' };
                    host = { ...host, nativeBackupFolder: checkBackupFolder(folder, roots) };
                }
            }
            sent = true;
            const result = await deps.send(host);
            const outputDigest = result.status === 'ok' && result.value.output ? verifyOutput((0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_7__.protectionOperationId)(request), result.value.output) : undefined;
            if (result.status === 'ok' && result.value.output && original?.command === 'protection.backup' && original.closing) {
                const root = electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath('userData'), relative = 'protection/close-fallback.json';
                if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, relative))) {
                    const bytes = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(root, relative), notice = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(bytes);
                    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_5__.closed)(notice, ['schemaVersion', 'folder', 'createdAt', 'used', 'actualPath']) || notice.schemaVersion !== 1 || typeof notice.folder !== 'string' || !node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(notice.folder) || typeof notice.createdAt !== 'string' || !Number.isFinite(Date.parse(notice.createdAt)) || typeof notice.used !== 'boolean' || notice.actualPath !== null && typeof notice.actualPath !== 'string')
                        throw new Error('Closing backup location evidence is invalid. Reconcile before closing.');
                    if (node_path__WEBPACK_IMPORTED_MODULE_1___default().relative(notice.folder, node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(result.value.output.path)) === '')
                        (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.publishManagedBytes)(root, relative, Buffer.from((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, folder: notice.folder, createdAt: new Date().toISOString(), used: true, actualPath: result.value.output.path })), (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(bytes));
                }
            }
            if (result.status === 'ok' && result.value.output)
                outputs.set(result.value.output.id, { path: result.value.output.path, hash: outputDigest });
            return result;
        }
        catch (e) {
            return { ...base, status: 'error', message: e instanceof Error ? e.message : 'Native protection selection failed.', outcome: sent ? 'unknown' : 'not-committed', operationId: sent ? (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_7__.protectionOperationId)(request) : null };
        }
    };
}
function runtimePath() { const resources = electron__WEBPACK_IMPORTED_MODULE_2__.app.isPackaged ? process.resourcesPath : node_path__WEBPACK_IMPORTED_MODULE_1___default().join(electron__WEBPACK_IMPORTED_MODULE_2__.app.getAppPath(), 'resources'); const root = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(resources, 'libreoffice'); return process.platform === 'win32' ? node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'program/soffice.exe') : process.platform === 'darwin' ? node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'LibreOffice.app/Contents/MacOS/soffice') : node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'program/soffice'); }


/***/ },

/***/ "./src/desktop/security.ts"
/*!*********************************!*\
  !*** ./src/desktop/security.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   READINESS_CHANNEL: () => (/* binding */ READINESS_CHANNEL),
/* harmony export */   trustedSender: () => (/* binding */ trustedSender)
/* harmony export */ });
const READINESS_CHANNEL = 'writingtool:readiness:v1';
function trustedSender(senderId, ownedId, isMainFrame, actualUrl, expectedUrl) {
    return senderId === ownedId && isMainFrame && actualUrl === expectedUrl;
}


/***/ },

/***/ "./src/desktop/universe-host-client.ts"
/*!*********************************************!*\
  !*** ./src/desktop/universe-host-client.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UniverseHostClient: () => (/* binding */ UniverseHostClient),
/* harmony export */   hostUnavailable: () => (/* binding */ hostUnavailable)
/* harmony export */ });
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");

function hostUnavailable(request) {
    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'HOST_UNAVAILABLE', message: 'The application host did not confirm the operation. Reopen the selected universe to reconcile before continuing.', outcome: request.command === 'universe.create' || request.command === 'universe.profile.save' ? 'unknown' : 'not-committed', retry: 'after-recovery' };
}
class UniverseHostClient {
    host;
    timeoutMs;
    limit;
    pending = new Map();
    expired = new Map();
    failed = false;
    uncertainOperations = new Set();
    constructor(host, timeoutMs = 15000, limit = 32) {
        this.host = host;
        this.timeoutMs = timeoutMs;
        this.limit = limit;
        this.failed = !host;
    }
    request(request) {
        const operationId = 'input' in request ? request.input.operationId : undefined;
        if (this.pending.has(request.requestId) || this.expired.has(request.requestId))
            return Promise.resolve(hostUnavailable(request));
        const originalMayHaveRun = !!operationId && (this.uncertainOperations.has(operationId) || Array.from(this.pending.values()).some(entry => 'input' in entry.request && entry.request.input.operationId === operationId));
        if (this.failed || this.pending.size >= this.limit) {
            if (originalMayHaveRun)
                return Promise.resolve(hostUnavailable(request));
            return Promise.resolve({
                protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error',
                code: 'HOST_UNAVAILABLE', message: 'The command was not sent to the application host. Your edits are still available. Try again when the host is available.',
                outcome: 'not-committed', retry: 'new-request'
            });
        }
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                if (operationId)
                    this.uncertainOperations.add(operationId);
                this.expired.set(request.requestId, request);
                if (this.expired.size > this.limit)
                    this.expired.delete(this.expired.keys().next().value);
                this.finish(request.requestId, hostUnavailable(request));
            }, this.timeoutMs);
            this.pending.set(request.requestId, { request, resolve, timer });
            try {
                this.host.postMessage(request);
            }
            catch {
                this.fail();
            }
        });
    }
    receive(value) {
        const id = typeof value === 'object' && value !== null && 'requestId' in value ? value.requestId : undefined;
        if (typeof id !== 'string') {
            this.fail();
            return;
        }
        const entry = this.pending.get(id), expired = this.expired.get(id);
        if (!entry) {
            if (expired && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.validUniverseResult)(value, expired))
                return;
            this.fail();
            return;
        }
        if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.validUniverseResult)(value, entry.request)) {
            this.fail();
            return;
        }
        this.finish(id, value);
    }
    fail() {
        this.failed = true;
        for (const [id, entry] of this.pending) {
            if ('input' in entry.request)
                this.uncertainOperations.add(entry.request.input.operationId);
            this.finish(id, hostUnavailable(entry.request));
        }
    }
    finish(id, result) {
        const entry = this.pending.get(id);
        if (!entry)
            return;
        clearTimeout(entry.timer);
        this.pending.delete(id);
        entry.resolve(result);
    }
}


/***/ },

/***/ "./src/desktop/workspace-host-client.ts"
/*!**********************************************!*\
  !*** ./src/desktop/workspace-host-client.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkspaceHostClient: () => (/* binding */ WorkspaceHostClient),
/* harmony export */   workspaceUnavailable: () => (/* binding */ workspaceUnavailable)
/* harmony export */ });
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");

function workspaceUnavailable(request, sent = true) { return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'HOST_UNAVAILABLE', message: 'The host did not confirm this operation. Preserve pending edits and reconcile its original operation.', outcome: sent && ['workspace.mutate', 'workspace.asset.import', 'settings.save', 'settings.import', 'settings.select-backup'].includes(request.command) ? 'unknown' : 'not-committed', retry: 'after-recovery', issues: [] }; }
class WorkspaceHostClient {
    host;
    pending = new Map();
    failed = false;
    constructor(host) {
        this.host = host;
        this.failed = !host;
    }
    request(request) { if (this.failed || this.pending.size >= 32 || this.pending.has(request.requestId))
        return Promise.resolve(workspaceUnavailable(request, false)); return new Promise(resolve => { const timer = setTimeout(() => this.fail(), 60000); this.pending.set(request.requestId, { request, resolve, timer }); try {
        this.host.postMessage(request);
    }
    catch {
        this.fail();
    } }); }
    receive(value) { if (typeof value !== 'object' || !value || !('requestId' in value) || typeof value.requestId !== 'string') {
        this.fail();
        return;
    } const p = this.pending.get(value.requestId); if (!p)
        return; if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_0__.validWorkspaceResult)(value, p.request)) {
        this.fail();
        return;
    } clearTimeout(p.timer); this.pending.delete(value.requestId); p.resolve(value); }
    fail() { this.failed = true; for (const p of this.pending.values()) {
        clearTimeout(p.timer);
        p.resolve(workspaceUnavailable(p.request));
    } this.pending.clear(); }
}


/***/ },

/***/ "./src/domain/calendar.ts"
/*!********************************!*\
  !*** ./src/domain/calendar.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   birthPosition: () => (/* binding */ birthPosition),
/* harmony export */   compareDates: () => (/* binding */ compareDates),
/* harmony export */   configuration: () => (/* binding */ configuration),
/* harmony export */   convertDate: () => (/* binding */ convertDate),
/* harmony export */   correctChapterRange: () => (/* binding */ correctChapterRange),
/* harmony export */   displayDate: () => (/* binding */ displayDate),
/* harmony export */   elapsedPosition: () => (/* binding */ elapsedPosition),
/* harmony export */   floorDivide: () => (/* binding */ floorDivide),
/* harmony export */   hasCalendarMonths: () => (/* binding */ hasCalendarMonths),
/* harmony export */   normalizeCalendarData: () => (/* binding */ normalizeCalendarData),
/* harmony export */   positiveInteger: () => (/* binding */ positiveInteger),
/* harmony export */   scalarText: () => (/* binding */ scalarText),
/* harmony export */   signedInteger: () => (/* binding */ signedInteger),
/* harmony export */   unsignedInteger: () => (/* binding */ unsignedInteger),
/* harmony export */   validCalendarConfiguration: () => (/* binding */ validCalendarConfiguration),
/* harmony export */   validCalendarData: () => (/* binding */ validCalendarData),
/* harmony export */   validDatePosition: () => (/* binding */ validDatePosition)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");

const signedInteger = (v) => typeof v === 'string' && /^(0|-?[1-9][0-9]*)$/.test(v);
const unsignedInteger = (v) => typeof v === 'string' && /^(0|[1-9][0-9]*)$/.test(v);
const positiveInteger = (v) => unsignedInteger(v) && v !== '0';
const scalarText = (v) => typeof v === 'string' && !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v);
function validCalendarConfiguration(v) {
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['id', 'elements', 'daysOnly', 'actualDays', 'targetDays', 'enteredYear', 'yearNames']) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) || !signedInteger(v.enteredYear) || !positiveInteger(v.actualDays) || !positiveInteger(v.targetDays) || !Array.isArray(v.elements) || !Array.isArray(v.yearNames))
        return false;
    const ids = new Set();
    for (const e of v.elements) {
        if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e, ['id', 'kind', 'name', 'days']) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.id) || ids.has(e.id) || !scalarText(e.name) || !positiveInteger(e.days) || !['month', 'standalone'].includes(e.kind) || (e.kind === 'standalone' && e.days !== '1'))
            return false;
        ids.add(e.id);
    }
    if (v.elements.length ? v.daysOnly !== null || v.elements.reduce((n, e) => n + BigInt(e.days), 0n).toString() !== v.actualDays : !positiveInteger(v.daysOnly) || v.daysOnly !== v.actualDays)
        return false;
    const years = new Set();
    return v.yearNames.every(n => { if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(n, ['year', 'name']) || !signedInteger(n.year) || !scalarText(n.name) || years.has(n.year))
        return false; years.add(n.year); return true; });
}
function validCalendarData(v) {
    return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['currentVersion', 'anchor', 'versions']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.currentVersion) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.anchor, ['year', 'day']) && signedInteger(v.anchor.year) && v.anchor.day === '1' && Array.isArray(v.versions) && v.versions.length > 0 && v.versions.every(validCalendarConfiguration) && new Set(v.versions.map(c => c.id)).size === v.versions.length && v.versions.some(c => c.id === v.currentVersion);
}
function validDatePosition(v) { return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['calendarVersion', 'year', 'day']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.calendarVersion) && signedInteger(v.year) && positiveInteger(v.day); }
function configuration(calendar, id) { const c = calendar.versions.find(c => c.id === id); if (!c)
    throw new Error('Unknown calendar configuration.'); return c; }
function hasCalendarMonths(calendar) { return !!calendar && configuration(calendar, calendar.currentVersion).elements.some(element => element.kind === 'month'); }
function elapsedPosition(date, calendar) {
    if (!validDatePosition(date))
        throw new Error('Invalid calendar date.');
    const c = configuration(calendar, date.calendarVersion);
    if (BigInt(date.day) > BigInt(c.actualDays))
        throw new Error('Day exceeds the calendar year length.');
    return (BigInt(date.year) - BigInt(calendar.anchor.year)) * BigInt(c.actualDays) + BigInt(date.day) - 1n;
}
function floorDivide(n, d) { const q = n / d; return n % d < 0n ? q - 1n : q; }
function convertDate(date, calendar, targetVersion = calendar.currentVersion) {
    const position = elapsedPosition(date, calendar), days = BigInt(configuration(calendar, targetVersion).actualDays), years = floorDivide(position, days);
    return { calendarVersion: targetVersion, year: (BigInt(calendar.anchor.year) + years).toString(), day: (position - years * days + 1n).toString() };
}
function compareDates(a, b, calendar) { const x = elapsedPosition(a, calendar), y = elapsedPosition(b, calendar); return x < y ? -1 : x > y ? 1 : 0; }
function displayDate(date, calendar) {
    elapsedPosition(date, calendar);
    const c = configuration(calendar, date.calendarVersion), name = c.yearNames.find(n => n.year === date.year)?.name || '';
    if (!c.elements.length)
        return `${date.day}/${date.year}`;
    let remaining = BigInt(date.day), monthOrdinal = 0n;
    for (const e of c.elements) {
        if (e.kind === 'month')
            monthOrdinal++;
        if (remaining <= BigInt(e.days)) {
            if (e.kind === 'standalone')
                return `${name ? `${name}/` : ''}${e.name ? `${e.name}-` : ''}${date.day}/${date.year}`;
            return [e.name || monthOrdinal.toString(), remaining.toString(), date.year, name].filter(Boolean).join('/');
        }
        remaining -= BigInt(e.days);
    }
    throw new Error('Invalid calendar date.');
}
function correctChapterRange(start, end, calendar) {
    if (start)
        elapsedPosition(start, calendar);
    if (end)
        elapsedPosition(end, calendar);
    return { start, end: start && end && compareDates(end, start, calendar) < 0 ? { ...start } : end };
}
function birthPosition(birth, calendar) {
    if (!signedInteger(birth.year) || (birth.day !== null && !positiveInteger(birth.day)))
        throw new Error('Invalid recorded birth components.');
    const c = configuration(calendar, calendar.currentVersion);
    let day = 1n;
    if (birth.elementId !== null) {
        const index = c.elements.findIndex(e => e.id === birth.elementId);
        if (index >= 0) {
            const e = c.elements[index], component = BigInt(birth.day ?? '1');
            if (component <= BigInt(e.days))
                day = c.elements.slice(0, index).reduce((n, e) => n + BigInt(e.days), 0n) + component;
        }
    }
    else if (birth.day !== null && BigInt(birth.day) <= BigInt(c.actualDays))
        day = BigInt(birth.day);
    return { calendarVersion: c.id, year: birth.year, day: day.toString() };
}
/** Form targets may differ; committed configurations use their calculated actual total. */
function normalizeCalendarData(candidate, previous = null) {
    const normalized = { ...candidate, anchor: { ...candidate.anchor }, versions: candidate.versions.map(c => {
            const actual = c.elements.length ? c.elements.reduce((n, e) => { if (!positiveInteger(e.days))
                throw new Error('Calendar element days must be positive integers.'); return n + BigInt(e.days); }, 0n).toString() : c.daysOnly;
            if (!positiveInteger(actual) || !positiveInteger(c.targetDays))
                throw new Error('Calendar day totals must be positive integers.');
            return { ...c, actualDays: actual, targetDays: actual };
        }) };
    if (!validCalendarData(normalized))
        throw new Error('Invalid calendar configuration.');
    if (!previous && normalized.anchor.year !== normalized.versions[0].enteredYear)
        throw new Error('The calendar anchor must use the first entered year.');
    if (previous) {
        if (previous.anchor.year !== normalized.anchor.year || previous.anchor.day !== normalized.anchor.day)
            throw new Error('Calendar lineage anchor is immutable.');
        for (const old of previous.versions) {
            const retained = normalized.versions.find(v => v.id === old.id);
            if (!retained || stableCalendarJSON(old) !== stableCalendarJSON(retained))
                throw new Error('Existing calendar configurations are immutable.');
        }
    }
    return normalized;
}
function stableCalendarJSON(value) { if (value === null || typeof value !== 'object')
    return JSON.stringify(value); if (Array.isArray(value))
    return '[' + value.map(stableCalendarJSON).join(',') + ']'; return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stableCalendarJSON(value[k])).join(',') + '}'; }


/***/ },

/***/ "./src/domain/capture-time.ts"
/*!************************************!*\
  !*** ./src/domain/capture-time.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureTime: () => (/* binding */ captureTime),
/* harmony export */   safeDisplayName: () => (/* binding */ safeDisplayName)
/* harmony export */ });
function captureTime(date = new Date()) { const two = (n) => String(n).padStart(2, '0'); return { utc: date.toISOString(), local: `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}_${two(date.getHours())}-${two(date.getMinutes())}-${two(date.getSeconds())}`, offsetMinutes: String(-date.getTimezoneOffset()), zone: Intl.DateTimeFormat().resolvedOptions().timeZone }; }
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
function safeDisplayName(name) { const value = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[. ]+$/g, '').trim(); return value && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(value) ? value : 'WritingTool'; }


/***/ },

/***/ "./src/domain/code-fold.ts"
/*!*********************************!*\
  !*** ./src/domain/code-fold.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalCodeKey: () => (/* binding */ canonicalCodeKey),
/* harmony export */   trimmedCode: () => (/* binding */ trimmedCode)
/* harmony export */ });
/* harmony import */ var _unicode_normalization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unicode-normalization */ "./src/domain/unicode-normalization.ts");

// Unicode License V3: resources/licenses/Unicode-LICENSE.txt
// Full default case folding, Unicode 17.0.0 CaseFolding.txt (C/F; Turkic excluded).
const FOLD = { "A": "a", "B": "b", "C": "c", "D": "d", "E": "e", "F": "f", "G": "g", "H": "h", "I": "i", "J": "j", "K": "k", "L": "l", "M": "m", "N": "n", "O": "o", "P": "p", "Q": "q", "R": "r", "S": "s", "T": "t", "U": "u", "V": "v", "W": "w", "X": "x", "Y": "y", "Z": "z", "\u00b5": "\u03bc", "\u00c0": "\u00e0", "\u00c1": "\u00e1", "\u00c2": "\u00e2", "\u00c3": "\u00e3", "\u00c4": "\u00e4", "\u00c5": "\u00e5", "\u00c6": "\u00e6", "\u00c7": "\u00e7", "\u00c8": "\u00e8", "\u00c9": "\u00e9", "\u00ca": "\u00ea", "\u00cb": "\u00eb", "\u00cc": "\u00ec", "\u00cd": "\u00ed", "\u00ce": "\u00ee", "\u00cf": "\u00ef", "\u00d0": "\u00f0", "\u00d1": "\u00f1", "\u00d2": "\u00f2", "\u00d3": "\u00f3", "\u00d4": "\u00f4", "\u00d5": "\u00f5", "\u00d6": "\u00f6", "\u00d8": "\u00f8", "\u00d9": "\u00f9", "\u00da": "\u00fa", "\u00db": "\u00fb", "\u00dc": "\u00fc", "\u00dd": "\u00fd", "\u00de": "\u00fe", "\u00df": "ss", "\u0100": "\u0101", "\u0102": "\u0103", "\u0104": "\u0105", "\u0106": "\u0107", "\u0108": "\u0109", "\u010a": "\u010b", "\u010c": "\u010d", "\u010e": "\u010f", "\u0110": "\u0111", "\u0112": "\u0113", "\u0114": "\u0115", "\u0116": "\u0117", "\u0118": "\u0119", "\u011a": "\u011b", "\u011c": "\u011d", "\u011e": "\u011f", "\u0120": "\u0121", "\u0122": "\u0123", "\u0124": "\u0125", "\u0126": "\u0127", "\u0128": "\u0129", "\u012a": "\u012b", "\u012c": "\u012d", "\u012e": "\u012f", "\u0130": "i\u0307", "\u0132": "\u0133", "\u0134": "\u0135", "\u0136": "\u0137", "\u0139": "\u013a", "\u013b": "\u013c", "\u013d": "\u013e", "\u013f": "\u0140", "\u0141": "\u0142", "\u0143": "\u0144", "\u0145": "\u0146", "\u0147": "\u0148", "\u0149": "\u02bcn", "\u014a": "\u014b", "\u014c": "\u014d", "\u014e": "\u014f", "\u0150": "\u0151", "\u0152": "\u0153", "\u0154": "\u0155", "\u0156": "\u0157", "\u0158": "\u0159", "\u015a": "\u015b", "\u015c": "\u015d", "\u015e": "\u015f", "\u0160": "\u0161", "\u0162": "\u0163", "\u0164": "\u0165", "\u0166": "\u0167", "\u0168": "\u0169", "\u016a": "\u016b", "\u016c": "\u016d", "\u016e": "\u016f", "\u0170": "\u0171", "\u0172": "\u0173", "\u0174": "\u0175", "\u0176": "\u0177", "\u0178": "\u00ff", "\u0179": "\u017a", "\u017b": "\u017c", "\u017d": "\u017e", "\u017f": "s", "\u0181": "\u0253", "\u0182": "\u0183", "\u0184": "\u0185", "\u0186": "\u0254", "\u0187": "\u0188", "\u0189": "\u0256", "\u018a": "\u0257", "\u018b": "\u018c", "\u018e": "\u01dd", "\u018f": "\u0259", "\u0190": "\u025b", "\u0191": "\u0192", "\u0193": "\u0260", "\u0194": "\u0263", "\u0196": "\u0269", "\u0197": "\u0268", "\u0198": "\u0199", "\u019c": "\u026f", "\u019d": "\u0272", "\u019f": "\u0275", "\u01a0": "\u01a1", "\u01a2": "\u01a3", "\u01a4": "\u01a5", "\u01a6": "\u0280", "\u01a7": "\u01a8", "\u01a9": "\u0283", "\u01ac": "\u01ad", "\u01ae": "\u0288", "\u01af": "\u01b0", "\u01b1": "\u028a", "\u01b2": "\u028b", "\u01b3": "\u01b4", "\u01b5": "\u01b6", "\u01b7": "\u0292", "\u01b8": "\u01b9", "\u01bc": "\u01bd", "\u01c4": "\u01c6", "\u01c5": "\u01c6", "\u01c7": "\u01c9", "\u01c8": "\u01c9", "\u01ca": "\u01cc", "\u01cb": "\u01cc", "\u01cd": "\u01ce", "\u01cf": "\u01d0", "\u01d1": "\u01d2", "\u01d3": "\u01d4", "\u01d5": "\u01d6", "\u01d7": "\u01d8", "\u01d9": "\u01da", "\u01db": "\u01dc", "\u01de": "\u01df", "\u01e0": "\u01e1", "\u01e2": "\u01e3", "\u01e4": "\u01e5", "\u01e6": "\u01e7", "\u01e8": "\u01e9", "\u01ea": "\u01eb", "\u01ec": "\u01ed", "\u01ee": "\u01ef", "\u01f0": "j\u030c", "\u01f1": "\u01f3", "\u01f2": "\u01f3", "\u01f4": "\u01f5", "\u01f6": "\u0195", "\u01f7": "\u01bf", "\u01f8": "\u01f9", "\u01fa": "\u01fb", "\u01fc": "\u01fd", "\u01fe": "\u01ff", "\u0200": "\u0201", "\u0202": "\u0203", "\u0204": "\u0205", "\u0206": "\u0207", "\u0208": "\u0209", "\u020a": "\u020b", "\u020c": "\u020d", "\u020e": "\u020f", "\u0210": "\u0211", "\u0212": "\u0213", "\u0214": "\u0215", "\u0216": "\u0217", "\u0218": "\u0219", "\u021a": "\u021b", "\u021c": "\u021d", "\u021e": "\u021f", "\u0220": "\u019e", "\u0222": "\u0223", "\u0224": "\u0225", "\u0226": "\u0227", "\u0228": "\u0229", "\u022a": "\u022b", "\u022c": "\u022d", "\u022e": "\u022f", "\u0230": "\u0231", "\u0232": "\u0233", "\u023a": "\u2c65", "\u023b": "\u023c", "\u023d": "\u019a", "\u023e": "\u2c66", "\u0241": "\u0242", "\u0243": "\u0180", "\u0244": "\u0289", "\u0245": "\u028c", "\u0246": "\u0247", "\u0248": "\u0249", "\u024a": "\u024b", "\u024c": "\u024d", "\u024e": "\u024f", "\u0345": "\u03b9", "\u0370": "\u0371", "\u0372": "\u0373", "\u0376": "\u0377", "\u037f": "\u03f3", "\u0386": "\u03ac", "\u0388": "\u03ad", "\u0389": "\u03ae", "\u038a": "\u03af", "\u038c": "\u03cc", "\u038e": "\u03cd", "\u038f": "\u03ce", "\u0390": "\u03b9\u0308\u0301", "\u0391": "\u03b1", "\u0392": "\u03b2", "\u0393": "\u03b3", "\u0394": "\u03b4", "\u0395": "\u03b5", "\u0396": "\u03b6", "\u0397": "\u03b7", "\u0398": "\u03b8", "\u0399": "\u03b9", "\u039a": "\u03ba", "\u039b": "\u03bb", "\u039c": "\u03bc", "\u039d": "\u03bd", "\u039e": "\u03be", "\u039f": "\u03bf", "\u03a0": "\u03c0", "\u03a1": "\u03c1", "\u03a3": "\u03c3", "\u03a4": "\u03c4", "\u03a5": "\u03c5", "\u03a6": "\u03c6", "\u03a7": "\u03c7", "\u03a8": "\u03c8", "\u03a9": "\u03c9", "\u03aa": "\u03ca", "\u03ab": "\u03cb", "\u03b0": "\u03c5\u0308\u0301", "\u03c2": "\u03c3", "\u03cf": "\u03d7", "\u03d0": "\u03b2", "\u03d1": "\u03b8", "\u03d5": "\u03c6", "\u03d6": "\u03c0", "\u03d8": "\u03d9", "\u03da": "\u03db", "\u03dc": "\u03dd", "\u03de": "\u03df", "\u03e0": "\u03e1", "\u03e2": "\u03e3", "\u03e4": "\u03e5", "\u03e6": "\u03e7", "\u03e8": "\u03e9", "\u03ea": "\u03eb", "\u03ec": "\u03ed", "\u03ee": "\u03ef", "\u03f0": "\u03ba", "\u03f1": "\u03c1", "\u03f4": "\u03b8", "\u03f5": "\u03b5", "\u03f7": "\u03f8", "\u03f9": "\u03f2", "\u03fa": "\u03fb", "\u03fd": "\u037b", "\u03fe": "\u037c", "\u03ff": "\u037d", "\u0400": "\u0450", "\u0401": "\u0451", "\u0402": "\u0452", "\u0403": "\u0453", "\u0404": "\u0454", "\u0405": "\u0455", "\u0406": "\u0456", "\u0407": "\u0457", "\u0408": "\u0458", "\u0409": "\u0459", "\u040a": "\u045a", "\u040b": "\u045b", "\u040c": "\u045c", "\u040d": "\u045d", "\u040e": "\u045e", "\u040f": "\u045f", "\u0410": "\u0430", "\u0411": "\u0431", "\u0412": "\u0432", "\u0413": "\u0433", "\u0414": "\u0434", "\u0415": "\u0435", "\u0416": "\u0436", "\u0417": "\u0437", "\u0418": "\u0438", "\u0419": "\u0439", "\u041a": "\u043a", "\u041b": "\u043b", "\u041c": "\u043c", "\u041d": "\u043d", "\u041e": "\u043e", "\u041f": "\u043f", "\u0420": "\u0440", "\u0421": "\u0441", "\u0422": "\u0442", "\u0423": "\u0443", "\u0424": "\u0444", "\u0425": "\u0445", "\u0426": "\u0446", "\u0427": "\u0447", "\u0428": "\u0448", "\u0429": "\u0449", "\u042a": "\u044a", "\u042b": "\u044b", "\u042c": "\u044c", "\u042d": "\u044d", "\u042e": "\u044e", "\u042f": "\u044f", "\u0460": "\u0461", "\u0462": "\u0463", "\u0464": "\u0465", "\u0466": "\u0467", "\u0468": "\u0469", "\u046a": "\u046b", "\u046c": "\u046d", "\u046e": "\u046f", "\u0470": "\u0471", "\u0472": "\u0473", "\u0474": "\u0475", "\u0476": "\u0477", "\u0478": "\u0479", "\u047a": "\u047b", "\u047c": "\u047d", "\u047e": "\u047f", "\u0480": "\u0481", "\u048a": "\u048b", "\u048c": "\u048d", "\u048e": "\u048f", "\u0490": "\u0491", "\u0492": "\u0493", "\u0494": "\u0495", "\u0496": "\u0497", "\u0498": "\u0499", "\u049a": "\u049b", "\u049c": "\u049d", "\u049e": "\u049f", "\u04a0": "\u04a1", "\u04a2": "\u04a3", "\u04a4": "\u04a5", "\u04a6": "\u04a7", "\u04a8": "\u04a9", "\u04aa": "\u04ab", "\u04ac": "\u04ad", "\u04ae": "\u04af", "\u04b0": "\u04b1", "\u04b2": "\u04b3", "\u04b4": "\u04b5", "\u04b6": "\u04b7", "\u04b8": "\u04b9", "\u04ba": "\u04bb", "\u04bc": "\u04bd", "\u04be": "\u04bf", "\u04c0": "\u04cf", "\u04c1": "\u04c2", "\u04c3": "\u04c4", "\u04c5": "\u04c6", "\u04c7": "\u04c8", "\u04c9": "\u04ca", "\u04cb": "\u04cc", "\u04cd": "\u04ce", "\u04d0": "\u04d1", "\u04d2": "\u04d3", "\u04d4": "\u04d5", "\u04d6": "\u04d7", "\u04d8": "\u04d9", "\u04da": "\u04db", "\u04dc": "\u04dd", "\u04de": "\u04df", "\u04e0": "\u04e1", "\u04e2": "\u04e3", "\u04e4": "\u04e5", "\u04e6": "\u04e7", "\u04e8": "\u04e9", "\u04ea": "\u04eb", "\u04ec": "\u04ed", "\u04ee": "\u04ef", "\u04f0": "\u04f1", "\u04f2": "\u04f3", "\u04f4": "\u04f5", "\u04f6": "\u04f7", "\u04f8": "\u04f9", "\u04fa": "\u04fb", "\u04fc": "\u04fd", "\u04fe": "\u04ff", "\u0500": "\u0501", "\u0502": "\u0503", "\u0504": "\u0505", "\u0506": "\u0507", "\u0508": "\u0509", "\u050a": "\u050b", "\u050c": "\u050d", "\u050e": "\u050f", "\u0510": "\u0511", "\u0512": "\u0513", "\u0514": "\u0515", "\u0516": "\u0517", "\u0518": "\u0519", "\u051a": "\u051b", "\u051c": "\u051d", "\u051e": "\u051f", "\u0520": "\u0521", "\u0522": "\u0523", "\u0524": "\u0525", "\u0526": "\u0527", "\u0528": "\u0529", "\u052a": "\u052b", "\u052c": "\u052d", "\u052e": "\u052f", "\u0531": "\u0561", "\u0532": "\u0562", "\u0533": "\u0563", "\u0534": "\u0564", "\u0535": "\u0565", "\u0536": "\u0566", "\u0537": "\u0567", "\u0538": "\u0568", "\u0539": "\u0569", "\u053a": "\u056a", "\u053b": "\u056b", "\u053c": "\u056c", "\u053d": "\u056d", "\u053e": "\u056e", "\u053f": "\u056f", "\u0540": "\u0570", "\u0541": "\u0571", "\u0542": "\u0572", "\u0543": "\u0573", "\u0544": "\u0574", "\u0545": "\u0575", "\u0546": "\u0576", "\u0547": "\u0577", "\u0548": "\u0578", "\u0549": "\u0579", "\u054a": "\u057a", "\u054b": "\u057b", "\u054c": "\u057c", "\u054d": "\u057d", "\u054e": "\u057e", "\u054f": "\u057f", "\u0550": "\u0580", "\u0551": "\u0581", "\u0552": "\u0582", "\u0553": "\u0583", "\u0554": "\u0584", "\u0555": "\u0585", "\u0556": "\u0586", "\u0587": "\u0565\u0582", "\u10a0": "\u2d00", "\u10a1": "\u2d01", "\u10a2": "\u2d02", "\u10a3": "\u2d03", "\u10a4": "\u2d04", "\u10a5": "\u2d05", "\u10a6": "\u2d06", "\u10a7": "\u2d07", "\u10a8": "\u2d08", "\u10a9": "\u2d09", "\u10aa": "\u2d0a", "\u10ab": "\u2d0b", "\u10ac": "\u2d0c", "\u10ad": "\u2d0d", "\u10ae": "\u2d0e", "\u10af": "\u2d0f", "\u10b0": "\u2d10", "\u10b1": "\u2d11", "\u10b2": "\u2d12", "\u10b3": "\u2d13", "\u10b4": "\u2d14", "\u10b5": "\u2d15", "\u10b6": "\u2d16", "\u10b7": "\u2d17", "\u10b8": "\u2d18", "\u10b9": "\u2d19", "\u10ba": "\u2d1a", "\u10bb": "\u2d1b", "\u10bc": "\u2d1c", "\u10bd": "\u2d1d", "\u10be": "\u2d1e", "\u10bf": "\u2d1f", "\u10c0": "\u2d20", "\u10c1": "\u2d21", "\u10c2": "\u2d22", "\u10c3": "\u2d23", "\u10c4": "\u2d24", "\u10c5": "\u2d25", "\u10c7": "\u2d27", "\u10cd": "\u2d2d", "\u13f8": "\u13f0", "\u13f9": "\u13f1", "\u13fa": "\u13f2", "\u13fb": "\u13f3", "\u13fc": "\u13f4", "\u13fd": "\u13f5", "\u1c80": "\u0432", "\u1c81": "\u0434", "\u1c82": "\u043e", "\u1c83": "\u0441", "\u1c84": "\u0442", "\u1c85": "\u0442", "\u1c86": "\u044a", "\u1c87": "\u0463", "\u1c88": "\ua64b", "\u1c89": "\u1c8a", "\u1c90": "\u10d0", "\u1c91": "\u10d1", "\u1c92": "\u10d2", "\u1c93": "\u10d3", "\u1c94": "\u10d4", "\u1c95": "\u10d5", "\u1c96": "\u10d6", "\u1c97": "\u10d7", "\u1c98": "\u10d8", "\u1c99": "\u10d9", "\u1c9a": "\u10da", "\u1c9b": "\u10db", "\u1c9c": "\u10dc", "\u1c9d": "\u10dd", "\u1c9e": "\u10de", "\u1c9f": "\u10df", "\u1ca0": "\u10e0", "\u1ca1": "\u10e1", "\u1ca2": "\u10e2", "\u1ca3": "\u10e3", "\u1ca4": "\u10e4", "\u1ca5": "\u10e5", "\u1ca6": "\u10e6", "\u1ca7": "\u10e7", "\u1ca8": "\u10e8", "\u1ca9": "\u10e9", "\u1caa": "\u10ea", "\u1cab": "\u10eb", "\u1cac": "\u10ec", "\u1cad": "\u10ed", "\u1cae": "\u10ee", "\u1caf": "\u10ef", "\u1cb0": "\u10f0", "\u1cb1": "\u10f1", "\u1cb2": "\u10f2", "\u1cb3": "\u10f3", "\u1cb4": "\u10f4", "\u1cb5": "\u10f5", "\u1cb6": "\u10f6", "\u1cb7": "\u10f7", "\u1cb8": "\u10f8", "\u1cb9": "\u10f9", "\u1cba": "\u10fa", "\u1cbd": "\u10fd", "\u1cbe": "\u10fe", "\u1cbf": "\u10ff", "\u1e00": "\u1e01", "\u1e02": "\u1e03", "\u1e04": "\u1e05", "\u1e06": "\u1e07", "\u1e08": "\u1e09", "\u1e0a": "\u1e0b", "\u1e0c": "\u1e0d", "\u1e0e": "\u1e0f", "\u1e10": "\u1e11", "\u1e12": "\u1e13", "\u1e14": "\u1e15", "\u1e16": "\u1e17", "\u1e18": "\u1e19", "\u1e1a": "\u1e1b", "\u1e1c": "\u1e1d", "\u1e1e": "\u1e1f", "\u1e20": "\u1e21", "\u1e22": "\u1e23", "\u1e24": "\u1e25", "\u1e26": "\u1e27", "\u1e28": "\u1e29", "\u1e2a": "\u1e2b", "\u1e2c": "\u1e2d", "\u1e2e": "\u1e2f", "\u1e30": "\u1e31", "\u1e32": "\u1e33", "\u1e34": "\u1e35", "\u1e36": "\u1e37", "\u1e38": "\u1e39", "\u1e3a": "\u1e3b", "\u1e3c": "\u1e3d", "\u1e3e": "\u1e3f", "\u1e40": "\u1e41", "\u1e42": "\u1e43", "\u1e44": "\u1e45", "\u1e46": "\u1e47", "\u1e48": "\u1e49", "\u1e4a": "\u1e4b", "\u1e4c": "\u1e4d", "\u1e4e": "\u1e4f", "\u1e50": "\u1e51", "\u1e52": "\u1e53", "\u1e54": "\u1e55", "\u1e56": "\u1e57", "\u1e58": "\u1e59", "\u1e5a": "\u1e5b", "\u1e5c": "\u1e5d", "\u1e5e": "\u1e5f", "\u1e60": "\u1e61", "\u1e62": "\u1e63", "\u1e64": "\u1e65", "\u1e66": "\u1e67", "\u1e68": "\u1e69", "\u1e6a": "\u1e6b", "\u1e6c": "\u1e6d", "\u1e6e": "\u1e6f", "\u1e70": "\u1e71", "\u1e72": "\u1e73", "\u1e74": "\u1e75", "\u1e76": "\u1e77", "\u1e78": "\u1e79", "\u1e7a": "\u1e7b", "\u1e7c": "\u1e7d", "\u1e7e": "\u1e7f", "\u1e80": "\u1e81", "\u1e82": "\u1e83", "\u1e84": "\u1e85", "\u1e86": "\u1e87", "\u1e88": "\u1e89", "\u1e8a": "\u1e8b", "\u1e8c": "\u1e8d", "\u1e8e": "\u1e8f", "\u1e90": "\u1e91", "\u1e92": "\u1e93", "\u1e94": "\u1e95", "\u1e96": "h\u0331", "\u1e97": "t\u0308", "\u1e98": "w\u030a", "\u1e99": "y\u030a", "\u1e9a": "a\u02be", "\u1e9b": "\u1e61", "\u1e9e": "ss", "\u1ea0": "\u1ea1", "\u1ea2": "\u1ea3", "\u1ea4": "\u1ea5", "\u1ea6": "\u1ea7", "\u1ea8": "\u1ea9", "\u1eaa": "\u1eab", "\u1eac": "\u1ead", "\u1eae": "\u1eaf", "\u1eb0": "\u1eb1", "\u1eb2": "\u1eb3", "\u1eb4": "\u1eb5", "\u1eb6": "\u1eb7", "\u1eb8": "\u1eb9", "\u1eba": "\u1ebb", "\u1ebc": "\u1ebd", "\u1ebe": "\u1ebf", "\u1ec0": "\u1ec1", "\u1ec2": "\u1ec3", "\u1ec4": "\u1ec5", "\u1ec6": "\u1ec7", "\u1ec8": "\u1ec9", "\u1eca": "\u1ecb", "\u1ecc": "\u1ecd", "\u1ece": "\u1ecf", "\u1ed0": "\u1ed1", "\u1ed2": "\u1ed3", "\u1ed4": "\u1ed5", "\u1ed6": "\u1ed7", "\u1ed8": "\u1ed9", "\u1eda": "\u1edb", "\u1edc": "\u1edd", "\u1ede": "\u1edf", "\u1ee0": "\u1ee1", "\u1ee2": "\u1ee3", "\u1ee4": "\u1ee5", "\u1ee6": "\u1ee7", "\u1ee8": "\u1ee9", "\u1eea": "\u1eeb", "\u1eec": "\u1eed", "\u1eee": "\u1eef", "\u1ef0": "\u1ef1", "\u1ef2": "\u1ef3", "\u1ef4": "\u1ef5", "\u1ef6": "\u1ef7", "\u1ef8": "\u1ef9", "\u1efa": "\u1efb", "\u1efc": "\u1efd", "\u1efe": "\u1eff", "\u1f08": "\u1f00", "\u1f09": "\u1f01", "\u1f0a": "\u1f02", "\u1f0b": "\u1f03", "\u1f0c": "\u1f04", "\u1f0d": "\u1f05", "\u1f0e": "\u1f06", "\u1f0f": "\u1f07", "\u1f18": "\u1f10", "\u1f19": "\u1f11", "\u1f1a": "\u1f12", "\u1f1b": "\u1f13", "\u1f1c": "\u1f14", "\u1f1d": "\u1f15", "\u1f28": "\u1f20", "\u1f29": "\u1f21", "\u1f2a": "\u1f22", "\u1f2b": "\u1f23", "\u1f2c": "\u1f24", "\u1f2d": "\u1f25", "\u1f2e": "\u1f26", "\u1f2f": "\u1f27", "\u1f38": "\u1f30", "\u1f39": "\u1f31", "\u1f3a": "\u1f32", "\u1f3b": "\u1f33", "\u1f3c": "\u1f34", "\u1f3d": "\u1f35", "\u1f3e": "\u1f36", "\u1f3f": "\u1f37", "\u1f48": "\u1f40", "\u1f49": "\u1f41", "\u1f4a": "\u1f42", "\u1f4b": "\u1f43", "\u1f4c": "\u1f44", "\u1f4d": "\u1f45", "\u1f50": "\u03c5\u0313", "\u1f52": "\u03c5\u0313\u0300", "\u1f54": "\u03c5\u0313\u0301", "\u1f56": "\u03c5\u0313\u0342", "\u1f59": "\u1f51", "\u1f5b": "\u1f53", "\u1f5d": "\u1f55", "\u1f5f": "\u1f57", "\u1f68": "\u1f60", "\u1f69": "\u1f61", "\u1f6a": "\u1f62", "\u1f6b": "\u1f63", "\u1f6c": "\u1f64", "\u1f6d": "\u1f65", "\u1f6e": "\u1f66", "\u1f6f": "\u1f67", "\u1f80": "\u1f00\u03b9", "\u1f81": "\u1f01\u03b9", "\u1f82": "\u1f02\u03b9", "\u1f83": "\u1f03\u03b9", "\u1f84": "\u1f04\u03b9", "\u1f85": "\u1f05\u03b9", "\u1f86": "\u1f06\u03b9", "\u1f87": "\u1f07\u03b9", "\u1f88": "\u1f00\u03b9", "\u1f89": "\u1f01\u03b9", "\u1f8a": "\u1f02\u03b9", "\u1f8b": "\u1f03\u03b9", "\u1f8c": "\u1f04\u03b9", "\u1f8d": "\u1f05\u03b9", "\u1f8e": "\u1f06\u03b9", "\u1f8f": "\u1f07\u03b9", "\u1f90": "\u1f20\u03b9", "\u1f91": "\u1f21\u03b9", "\u1f92": "\u1f22\u03b9", "\u1f93": "\u1f23\u03b9", "\u1f94": "\u1f24\u03b9", "\u1f95": "\u1f25\u03b9", "\u1f96": "\u1f26\u03b9", "\u1f97": "\u1f27\u03b9", "\u1f98": "\u1f20\u03b9", "\u1f99": "\u1f21\u03b9", "\u1f9a": "\u1f22\u03b9", "\u1f9b": "\u1f23\u03b9", "\u1f9c": "\u1f24\u03b9", "\u1f9d": "\u1f25\u03b9", "\u1f9e": "\u1f26\u03b9", "\u1f9f": "\u1f27\u03b9", "\u1fa0": "\u1f60\u03b9", "\u1fa1": "\u1f61\u03b9", "\u1fa2": "\u1f62\u03b9", "\u1fa3": "\u1f63\u03b9", "\u1fa4": "\u1f64\u03b9", "\u1fa5": "\u1f65\u03b9", "\u1fa6": "\u1f66\u03b9", "\u1fa7": "\u1f67\u03b9", "\u1fa8": "\u1f60\u03b9", "\u1fa9": "\u1f61\u03b9", "\u1faa": "\u1f62\u03b9", "\u1fab": "\u1f63\u03b9", "\u1fac": "\u1f64\u03b9", "\u1fad": "\u1f65\u03b9", "\u1fae": "\u1f66\u03b9", "\u1faf": "\u1f67\u03b9", "\u1fb2": "\u1f70\u03b9", "\u1fb3": "\u03b1\u03b9", "\u1fb4": "\u03ac\u03b9", "\u1fb6": "\u03b1\u0342", "\u1fb7": "\u03b1\u0342\u03b9", "\u1fb8": "\u1fb0", "\u1fb9": "\u1fb1", "\u1fba": "\u1f70", "\u1fbb": "\u1f71", "\u1fbc": "\u03b1\u03b9", "\u1fbe": "\u03b9", "\u1fc2": "\u1f74\u03b9", "\u1fc3": "\u03b7\u03b9", "\u1fc4": "\u03ae\u03b9", "\u1fc6": "\u03b7\u0342", "\u1fc7": "\u03b7\u0342\u03b9", "\u1fc8": "\u1f72", "\u1fc9": "\u1f73", "\u1fca": "\u1f74", "\u1fcb": "\u1f75", "\u1fcc": "\u03b7\u03b9", "\u1fd2": "\u03b9\u0308\u0300", "\u1fd3": "\u03b9\u0308\u0301", "\u1fd6": "\u03b9\u0342", "\u1fd7": "\u03b9\u0308\u0342", "\u1fd8": "\u1fd0", "\u1fd9": "\u1fd1", "\u1fda": "\u1f76", "\u1fdb": "\u1f77", "\u1fe2": "\u03c5\u0308\u0300", "\u1fe3": "\u03c5\u0308\u0301", "\u1fe4": "\u03c1\u0313", "\u1fe6": "\u03c5\u0342", "\u1fe7": "\u03c5\u0308\u0342", "\u1fe8": "\u1fe0", "\u1fe9": "\u1fe1", "\u1fea": "\u1f7a", "\u1feb": "\u1f7b", "\u1fec": "\u1fe5", "\u1ff2": "\u1f7c\u03b9", "\u1ff3": "\u03c9\u03b9", "\u1ff4": "\u03ce\u03b9", "\u1ff6": "\u03c9\u0342", "\u1ff7": "\u03c9\u0342\u03b9", "\u1ff8": "\u1f78", "\u1ff9": "\u1f79", "\u1ffa": "\u1f7c", "\u1ffb": "\u1f7d", "\u1ffc": "\u03c9\u03b9", "\u2126": "\u03c9", "\u212a": "k", "\u212b": "\u00e5", "\u2132": "\u214e", "\u2160": "\u2170", "\u2161": "\u2171", "\u2162": "\u2172", "\u2163": "\u2173", "\u2164": "\u2174", "\u2165": "\u2175", "\u2166": "\u2176", "\u2167": "\u2177", "\u2168": "\u2178", "\u2169": "\u2179", "\u216a": "\u217a", "\u216b": "\u217b", "\u216c": "\u217c", "\u216d": "\u217d", "\u216e": "\u217e", "\u216f": "\u217f", "\u2183": "\u2184", "\u24b6": "\u24d0", "\u24b7": "\u24d1", "\u24b8": "\u24d2", "\u24b9": "\u24d3", "\u24ba": "\u24d4", "\u24bb": "\u24d5", "\u24bc": "\u24d6", "\u24bd": "\u24d7", "\u24be": "\u24d8", "\u24bf": "\u24d9", "\u24c0": "\u24da", "\u24c1": "\u24db", "\u24c2": "\u24dc", "\u24c3": "\u24dd", "\u24c4": "\u24de", "\u24c5": "\u24df", "\u24c6": "\u24e0", "\u24c7": "\u24e1", "\u24c8": "\u24e2", "\u24c9": "\u24e3", "\u24ca": "\u24e4", "\u24cb": "\u24e5", "\u24cc": "\u24e6", "\u24cd": "\u24e7", "\u24ce": "\u24e8", "\u24cf": "\u24e9", "\u2c00": "\u2c30", "\u2c01": "\u2c31", "\u2c02": "\u2c32", "\u2c03": "\u2c33", "\u2c04": "\u2c34", "\u2c05": "\u2c35", "\u2c06": "\u2c36", "\u2c07": "\u2c37", "\u2c08": "\u2c38", "\u2c09": "\u2c39", "\u2c0a": "\u2c3a", "\u2c0b": "\u2c3b", "\u2c0c": "\u2c3c", "\u2c0d": "\u2c3d", "\u2c0e": "\u2c3e", "\u2c0f": "\u2c3f", "\u2c10": "\u2c40", "\u2c11": "\u2c41", "\u2c12": "\u2c42", "\u2c13": "\u2c43", "\u2c14": "\u2c44", "\u2c15": "\u2c45", "\u2c16": "\u2c46", "\u2c17": "\u2c47", "\u2c18": "\u2c48", "\u2c19": "\u2c49", "\u2c1a": "\u2c4a", "\u2c1b": "\u2c4b", "\u2c1c": "\u2c4c", "\u2c1d": "\u2c4d", "\u2c1e": "\u2c4e", "\u2c1f": "\u2c4f", "\u2c20": "\u2c50", "\u2c21": "\u2c51", "\u2c22": "\u2c52", "\u2c23": "\u2c53", "\u2c24": "\u2c54", "\u2c25": "\u2c55", "\u2c26": "\u2c56", "\u2c27": "\u2c57", "\u2c28": "\u2c58", "\u2c29": "\u2c59", "\u2c2a": "\u2c5a", "\u2c2b": "\u2c5b", "\u2c2c": "\u2c5c", "\u2c2d": "\u2c5d", "\u2c2e": "\u2c5e", "\u2c2f": "\u2c5f", "\u2c60": "\u2c61", "\u2c62": "\u026b", "\u2c63": "\u1d7d", "\u2c64": "\u027d", "\u2c67": "\u2c68", "\u2c69": "\u2c6a", "\u2c6b": "\u2c6c", "\u2c6d": "\u0251", "\u2c6e": "\u0271", "\u2c6f": "\u0250", "\u2c70": "\u0252", "\u2c72": "\u2c73", "\u2c75": "\u2c76", "\u2c7e": "\u023f", "\u2c7f": "\u0240", "\u2c80": "\u2c81", "\u2c82": "\u2c83", "\u2c84": "\u2c85", "\u2c86": "\u2c87", "\u2c88": "\u2c89", "\u2c8a": "\u2c8b", "\u2c8c": "\u2c8d", "\u2c8e": "\u2c8f", "\u2c90": "\u2c91", "\u2c92": "\u2c93", "\u2c94": "\u2c95", "\u2c96": "\u2c97", "\u2c98": "\u2c99", "\u2c9a": "\u2c9b", "\u2c9c": "\u2c9d", "\u2c9e": "\u2c9f", "\u2ca0": "\u2ca1", "\u2ca2": "\u2ca3", "\u2ca4": "\u2ca5", "\u2ca6": "\u2ca7", "\u2ca8": "\u2ca9", "\u2caa": "\u2cab", "\u2cac": "\u2cad", "\u2cae": "\u2caf", "\u2cb0": "\u2cb1", "\u2cb2": "\u2cb3", "\u2cb4": "\u2cb5", "\u2cb6": "\u2cb7", "\u2cb8": "\u2cb9", "\u2cba": "\u2cbb", "\u2cbc": "\u2cbd", "\u2cbe": "\u2cbf", "\u2cc0": "\u2cc1", "\u2cc2": "\u2cc3", "\u2cc4": "\u2cc5", "\u2cc6": "\u2cc7", "\u2cc8": "\u2cc9", "\u2cca": "\u2ccb", "\u2ccc": "\u2ccd", "\u2cce": "\u2ccf", "\u2cd0": "\u2cd1", "\u2cd2": "\u2cd3", "\u2cd4": "\u2cd5", "\u2cd6": "\u2cd7", "\u2cd8": "\u2cd9", "\u2cda": "\u2cdb", "\u2cdc": "\u2cdd", "\u2cde": "\u2cdf", "\u2ce0": "\u2ce1", "\u2ce2": "\u2ce3", "\u2ceb": "\u2cec", "\u2ced": "\u2cee", "\u2cf2": "\u2cf3", "\ua640": "\ua641", "\ua642": "\ua643", "\ua644": "\ua645", "\ua646": "\ua647", "\ua648": "\ua649", "\ua64a": "\ua64b", "\ua64c": "\ua64d", "\ua64e": "\ua64f", "\ua650": "\ua651", "\ua652": "\ua653", "\ua654": "\ua655", "\ua656": "\ua657", "\ua658": "\ua659", "\ua65a": "\ua65b", "\ua65c": "\ua65d", "\ua65e": "\ua65f", "\ua660": "\ua661", "\ua662": "\ua663", "\ua664": "\ua665", "\ua666": "\ua667", "\ua668": "\ua669", "\ua66a": "\ua66b", "\ua66c": "\ua66d", "\ua680": "\ua681", "\ua682": "\ua683", "\ua684": "\ua685", "\ua686": "\ua687", "\ua688": "\ua689", "\ua68a": "\ua68b", "\ua68c": "\ua68d", "\ua68e": "\ua68f", "\ua690": "\ua691", "\ua692": "\ua693", "\ua694": "\ua695", "\ua696": "\ua697", "\ua698": "\ua699", "\ua69a": "\ua69b", "\ua722": "\ua723", "\ua724": "\ua725", "\ua726": "\ua727", "\ua728": "\ua729", "\ua72a": "\ua72b", "\ua72c": "\ua72d", "\ua72e": "\ua72f", "\ua732": "\ua733", "\ua734": "\ua735", "\ua736": "\ua737", "\ua738": "\ua739", "\ua73a": "\ua73b", "\ua73c": "\ua73d", "\ua73e": "\ua73f", "\ua740": "\ua741", "\ua742": "\ua743", "\ua744": "\ua745", "\ua746": "\ua747", "\ua748": "\ua749", "\ua74a": "\ua74b", "\ua74c": "\ua74d", "\ua74e": "\ua74f", "\ua750": "\ua751", "\ua752": "\ua753", "\ua754": "\ua755", "\ua756": "\ua757", "\ua758": "\ua759", "\ua75a": "\ua75b", "\ua75c": "\ua75d", "\ua75e": "\ua75f", "\ua760": "\ua761", "\ua762": "\ua763", "\ua764": "\ua765", "\ua766": "\ua767", "\ua768": "\ua769", "\ua76a": "\ua76b", "\ua76c": "\ua76d", "\ua76e": "\ua76f", "\ua779": "\ua77a", "\ua77b": "\ua77c", "\ua77d": "\u1d79", "\ua77e": "\ua77f", "\ua780": "\ua781", "\ua782": "\ua783", "\ua784": "\ua785", "\ua786": "\ua787", "\ua78b": "\ua78c", "\ua78d": "\u0265", "\ua790": "\ua791", "\ua792": "\ua793", "\ua796": "\ua797", "\ua798": "\ua799", "\ua79a": "\ua79b", "\ua79c": "\ua79d", "\ua79e": "\ua79f", "\ua7a0": "\ua7a1", "\ua7a2": "\ua7a3", "\ua7a4": "\ua7a5", "\ua7a6": "\ua7a7", "\ua7a8": "\ua7a9", "\ua7aa": "\u0266", "\ua7ab": "\u025c", "\ua7ac": "\u0261", "\ua7ad": "\u026c", "\ua7ae": "\u026a", "\ua7b0": "\u029e", "\ua7b1": "\u0287", "\ua7b2": "\u029d", "\ua7b3": "\uab53", "\ua7b4": "\ua7b5", "\ua7b6": "\ua7b7", "\ua7b8": "\ua7b9", "\ua7ba": "\ua7bb", "\ua7bc": "\ua7bd", "\ua7be": "\ua7bf", "\ua7c0": "\ua7c1", "\ua7c2": "\ua7c3", "\ua7c4": "\ua794", "\ua7c5": "\u0282", "\ua7c6": "\u1d8e", "\ua7c7": "\ua7c8", "\ua7c9": "\ua7ca", "\ua7cb": "\u0264", "\ua7cc": "\ua7cd", "\ua7ce": "\ua7cf", "\ua7d0": "\ua7d1", "\ua7d2": "\ua7d3", "\ua7d4": "\ua7d5", "\ua7d6": "\ua7d7", "\ua7d8": "\ua7d9", "\ua7da": "\ua7db", "\ua7dc": "\u019b", "\ua7f5": "\ua7f6", "\uab70": "\u13a0", "\uab71": "\u13a1", "\uab72": "\u13a2", "\uab73": "\u13a3", "\uab74": "\u13a4", "\uab75": "\u13a5", "\uab76": "\u13a6", "\uab77": "\u13a7", "\uab78": "\u13a8", "\uab79": "\u13a9", "\uab7a": "\u13aa", "\uab7b": "\u13ab", "\uab7c": "\u13ac", "\uab7d": "\u13ad", "\uab7e": "\u13ae", "\uab7f": "\u13af", "\uab80": "\u13b0", "\uab81": "\u13b1", "\uab82": "\u13b2", "\uab83": "\u13b3", "\uab84": "\u13b4", "\uab85": "\u13b5", "\uab86": "\u13b6", "\uab87": "\u13b7", "\uab88": "\u13b8", "\uab89": "\u13b9", "\uab8a": "\u13ba", "\uab8b": "\u13bb", "\uab8c": "\u13bc", "\uab8d": "\u13bd", "\uab8e": "\u13be", "\uab8f": "\u13bf", "\uab90": "\u13c0", "\uab91": "\u13c1", "\uab92": "\u13c2", "\uab93": "\u13c3", "\uab94": "\u13c4", "\uab95": "\u13c5", "\uab96": "\u13c6", "\uab97": "\u13c7", "\uab98": "\u13c8", "\uab99": "\u13c9", "\uab9a": "\u13ca", "\uab9b": "\u13cb", "\uab9c": "\u13cc", "\uab9d": "\u13cd", "\uab9e": "\u13ce", "\uab9f": "\u13cf", "\uaba0": "\u13d0", "\uaba1": "\u13d1", "\uaba2": "\u13d2", "\uaba3": "\u13d3", "\uaba4": "\u13d4", "\uaba5": "\u13d5", "\uaba6": "\u13d6", "\uaba7": "\u13d7", "\uaba8": "\u13d8", "\uaba9": "\u13d9", "\uabaa": "\u13da", "\uabab": "\u13db", "\uabac": "\u13dc", "\uabad": "\u13dd", "\uabae": "\u13de", "\uabaf": "\u13df", "\uabb0": "\u13e0", "\uabb1": "\u13e1", "\uabb2": "\u13e2", "\uabb3": "\u13e3", "\uabb4": "\u13e4", "\uabb5": "\u13e5", "\uabb6": "\u13e6", "\uabb7": "\u13e7", "\uabb8": "\u13e8", "\uabb9": "\u13e9", "\uabba": "\u13ea", "\uabbb": "\u13eb", "\uabbc": "\u13ec", "\uabbd": "\u13ed", "\uabbe": "\u13ee", "\uabbf": "\u13ef", "\ufb00": "ff", "\ufb01": "fi", "\ufb02": "fl", "\ufb03": "ffi", "\ufb04": "ffl", "\ufb05": "st", "\ufb06": "st", "\ufb13": "\u0574\u0576", "\ufb14": "\u0574\u0565", "\ufb15": "\u0574\u056b", "\ufb16": "\u057e\u0576", "\ufb17": "\u0574\u056d", "\uff21": "\uff41", "\uff22": "\uff42", "\uff23": "\uff43", "\uff24": "\uff44", "\uff25": "\uff45", "\uff26": "\uff46", "\uff27": "\uff47", "\uff28": "\uff48", "\uff29": "\uff49", "\uff2a": "\uff4a", "\uff2b": "\uff4b", "\uff2c": "\uff4c", "\uff2d": "\uff4d", "\uff2e": "\uff4e", "\uff2f": "\uff4f", "\uff30": "\uff50", "\uff31": "\uff51", "\uff32": "\uff52", "\uff33": "\uff53", "\uff34": "\uff54", "\uff35": "\uff55", "\uff36": "\uff56", "\uff37": "\uff57", "\uff38": "\uff58", "\uff39": "\uff59", "\uff3a": "\uff5a", "\ud801\udc00": "\ud801\udc28", "\ud801\udc01": "\ud801\udc29", "\ud801\udc02": "\ud801\udc2a", "\ud801\udc03": "\ud801\udc2b", "\ud801\udc04": "\ud801\udc2c", "\ud801\udc05": "\ud801\udc2d", "\ud801\udc06": "\ud801\udc2e", "\ud801\udc07": "\ud801\udc2f", "\ud801\udc08": "\ud801\udc30", "\ud801\udc09": "\ud801\udc31", "\ud801\udc0a": "\ud801\udc32", "\ud801\udc0b": "\ud801\udc33", "\ud801\udc0c": "\ud801\udc34", "\ud801\udc0d": "\ud801\udc35", "\ud801\udc0e": "\ud801\udc36", "\ud801\udc0f": "\ud801\udc37", "\ud801\udc10": "\ud801\udc38", "\ud801\udc11": "\ud801\udc39", "\ud801\udc12": "\ud801\udc3a", "\ud801\udc13": "\ud801\udc3b", "\ud801\udc14": "\ud801\udc3c", "\ud801\udc15": "\ud801\udc3d", "\ud801\udc16": "\ud801\udc3e", "\ud801\udc17": "\ud801\udc3f", "\ud801\udc18": "\ud801\udc40", "\ud801\udc19": "\ud801\udc41", "\ud801\udc1a": "\ud801\udc42", "\ud801\udc1b": "\ud801\udc43", "\ud801\udc1c": "\ud801\udc44", "\ud801\udc1d": "\ud801\udc45", "\ud801\udc1e": "\ud801\udc46", "\ud801\udc1f": "\ud801\udc47", "\ud801\udc20": "\ud801\udc48", "\ud801\udc21": "\ud801\udc49", "\ud801\udc22": "\ud801\udc4a", "\ud801\udc23": "\ud801\udc4b", "\ud801\udc24": "\ud801\udc4c", "\ud801\udc25": "\ud801\udc4d", "\ud801\udc26": "\ud801\udc4e", "\ud801\udc27": "\ud801\udc4f", "\ud801\udcb0": "\ud801\udcd8", "\ud801\udcb1": "\ud801\udcd9", "\ud801\udcb2": "\ud801\udcda", "\ud801\udcb3": "\ud801\udcdb", "\ud801\udcb4": "\ud801\udcdc", "\ud801\udcb5": "\ud801\udcdd", "\ud801\udcb6": "\ud801\udcde", "\ud801\udcb7": "\ud801\udcdf", "\ud801\udcb8": "\ud801\udce0", "\ud801\udcb9": "\ud801\udce1", "\ud801\udcba": "\ud801\udce2", "\ud801\udcbb": "\ud801\udce3", "\ud801\udcbc": "\ud801\udce4", "\ud801\udcbd": "\ud801\udce5", "\ud801\udcbe": "\ud801\udce6", "\ud801\udcbf": "\ud801\udce7", "\ud801\udcc0": "\ud801\udce8", "\ud801\udcc1": "\ud801\udce9", "\ud801\udcc2": "\ud801\udcea", "\ud801\udcc3": "\ud801\udceb", "\ud801\udcc4": "\ud801\udcec", "\ud801\udcc5": "\ud801\udced", "\ud801\udcc6": "\ud801\udcee", "\ud801\udcc7": "\ud801\udcef", "\ud801\udcc8": "\ud801\udcf0", "\ud801\udcc9": "\ud801\udcf1", "\ud801\udcca": "\ud801\udcf2", "\ud801\udccb": "\ud801\udcf3", "\ud801\udccc": "\ud801\udcf4", "\ud801\udccd": "\ud801\udcf5", "\ud801\udcce": "\ud801\udcf6", "\ud801\udccf": "\ud801\udcf7", "\ud801\udcd0": "\ud801\udcf8", "\ud801\udcd1": "\ud801\udcf9", "\ud801\udcd2": "\ud801\udcfa", "\ud801\udcd3": "\ud801\udcfb", "\ud801\udd70": "\ud801\udd97", "\ud801\udd71": "\ud801\udd98", "\ud801\udd72": "\ud801\udd99", "\ud801\udd73": "\ud801\udd9a", "\ud801\udd74": "\ud801\udd9b", "\ud801\udd75": "\ud801\udd9c", "\ud801\udd76": "\ud801\udd9d", "\ud801\udd77": "\ud801\udd9e", "\ud801\udd78": "\ud801\udd9f", "\ud801\udd79": "\ud801\udda0", "\ud801\udd7a": "\ud801\udda1", "\ud801\udd7c": "\ud801\udda3", "\ud801\udd7d": "\ud801\udda4", "\ud801\udd7e": "\ud801\udda5", "\ud801\udd7f": "\ud801\udda6", "\ud801\udd80": "\ud801\udda7", "\ud801\udd81": "\ud801\udda8", "\ud801\udd82": "\ud801\udda9", "\ud801\udd83": "\ud801\uddaa", "\ud801\udd84": "\ud801\uddab", "\ud801\udd85": "\ud801\uddac", "\ud801\udd86": "\ud801\uddad", "\ud801\udd87": "\ud801\uddae", "\ud801\udd88": "\ud801\uddaf", "\ud801\udd89": "\ud801\uddb0", "\ud801\udd8a": "\ud801\uddb1", "\ud801\udd8c": "\ud801\uddb3", "\ud801\udd8d": "\ud801\uddb4", "\ud801\udd8e": "\ud801\uddb5", "\ud801\udd8f": "\ud801\uddb6", "\ud801\udd90": "\ud801\uddb7", "\ud801\udd91": "\ud801\uddb8", "\ud801\udd92": "\ud801\uddb9", "\ud801\udd94": "\ud801\uddbb", "\ud801\udd95": "\ud801\uddbc", "\ud803\udc80": "\ud803\udcc0", "\ud803\udc81": "\ud803\udcc1", "\ud803\udc82": "\ud803\udcc2", "\ud803\udc83": "\ud803\udcc3", "\ud803\udc84": "\ud803\udcc4", "\ud803\udc85": "\ud803\udcc5", "\ud803\udc86": "\ud803\udcc6", "\ud803\udc87": "\ud803\udcc7", "\ud803\udc88": "\ud803\udcc8", "\ud803\udc89": "\ud803\udcc9", "\ud803\udc8a": "\ud803\udcca", "\ud803\udc8b": "\ud803\udccb", "\ud803\udc8c": "\ud803\udccc", "\ud803\udc8d": "\ud803\udccd", "\ud803\udc8e": "\ud803\udcce", "\ud803\udc8f": "\ud803\udccf", "\ud803\udc90": "\ud803\udcd0", "\ud803\udc91": "\ud803\udcd1", "\ud803\udc92": "\ud803\udcd2", "\ud803\udc93": "\ud803\udcd3", "\ud803\udc94": "\ud803\udcd4", "\ud803\udc95": "\ud803\udcd5", "\ud803\udc96": "\ud803\udcd6", "\ud803\udc97": "\ud803\udcd7", "\ud803\udc98": "\ud803\udcd8", "\ud803\udc99": "\ud803\udcd9", "\ud803\udc9a": "\ud803\udcda", "\ud803\udc9b": "\ud803\udcdb", "\ud803\udc9c": "\ud803\udcdc", "\ud803\udc9d": "\ud803\udcdd", "\ud803\udc9e": "\ud803\udcde", "\ud803\udc9f": "\ud803\udcdf", "\ud803\udca0": "\ud803\udce0", "\ud803\udca1": "\ud803\udce1", "\ud803\udca2": "\ud803\udce2", "\ud803\udca3": "\ud803\udce3", "\ud803\udca4": "\ud803\udce4", "\ud803\udca5": "\ud803\udce5", "\ud803\udca6": "\ud803\udce6", "\ud803\udca7": "\ud803\udce7", "\ud803\udca8": "\ud803\udce8", "\ud803\udca9": "\ud803\udce9", "\ud803\udcaa": "\ud803\udcea", "\ud803\udcab": "\ud803\udceb", "\ud803\udcac": "\ud803\udcec", "\ud803\udcad": "\ud803\udced", "\ud803\udcae": "\ud803\udcee", "\ud803\udcaf": "\ud803\udcef", "\ud803\udcb0": "\ud803\udcf0", "\ud803\udcb1": "\ud803\udcf1", "\ud803\udcb2": "\ud803\udcf2", "\ud803\udd50": "\ud803\udd70", "\ud803\udd51": "\ud803\udd71", "\ud803\udd52": "\ud803\udd72", "\ud803\udd53": "\ud803\udd73", "\ud803\udd54": "\ud803\udd74", "\ud803\udd55": "\ud803\udd75", "\ud803\udd56": "\ud803\udd76", "\ud803\udd57": "\ud803\udd77", "\ud803\udd58": "\ud803\udd78", "\ud803\udd59": "\ud803\udd79", "\ud803\udd5a": "\ud803\udd7a", "\ud803\udd5b": "\ud803\udd7b", "\ud803\udd5c": "\ud803\udd7c", "\ud803\udd5d": "\ud803\udd7d", "\ud803\udd5e": "\ud803\udd7e", "\ud803\udd5f": "\ud803\udd7f", "\ud803\udd60": "\ud803\udd80", "\ud803\udd61": "\ud803\udd81", "\ud803\udd62": "\ud803\udd82", "\ud803\udd63": "\ud803\udd83", "\ud803\udd64": "\ud803\udd84", "\ud803\udd65": "\ud803\udd85", "\ud806\udca0": "\ud806\udcc0", "\ud806\udca1": "\ud806\udcc1", "\ud806\udca2": "\ud806\udcc2", "\ud806\udca3": "\ud806\udcc3", "\ud806\udca4": "\ud806\udcc4", "\ud806\udca5": "\ud806\udcc5", "\ud806\udca6": "\ud806\udcc6", "\ud806\udca7": "\ud806\udcc7", "\ud806\udca8": "\ud806\udcc8", "\ud806\udca9": "\ud806\udcc9", "\ud806\udcaa": "\ud806\udcca", "\ud806\udcab": "\ud806\udccb", "\ud806\udcac": "\ud806\udccc", "\ud806\udcad": "\ud806\udccd", "\ud806\udcae": "\ud806\udcce", "\ud806\udcaf": "\ud806\udccf", "\ud806\udcb0": "\ud806\udcd0", "\ud806\udcb1": "\ud806\udcd1", "\ud806\udcb2": "\ud806\udcd2", "\ud806\udcb3": "\ud806\udcd3", "\ud806\udcb4": "\ud806\udcd4", "\ud806\udcb5": "\ud806\udcd5", "\ud806\udcb6": "\ud806\udcd6", "\ud806\udcb7": "\ud806\udcd7", "\ud806\udcb8": "\ud806\udcd8", "\ud806\udcb9": "\ud806\udcd9", "\ud806\udcba": "\ud806\udcda", "\ud806\udcbb": "\ud806\udcdb", "\ud806\udcbc": "\ud806\udcdc", "\ud806\udcbd": "\ud806\udcdd", "\ud806\udcbe": "\ud806\udcde", "\ud806\udcbf": "\ud806\udcdf", "\ud81b\ude40": "\ud81b\ude60", "\ud81b\ude41": "\ud81b\ude61", "\ud81b\ude42": "\ud81b\ude62", "\ud81b\ude43": "\ud81b\ude63", "\ud81b\ude44": "\ud81b\ude64", "\ud81b\ude45": "\ud81b\ude65", "\ud81b\ude46": "\ud81b\ude66", "\ud81b\ude47": "\ud81b\ude67", "\ud81b\ude48": "\ud81b\ude68", "\ud81b\ude49": "\ud81b\ude69", "\ud81b\ude4a": "\ud81b\ude6a", "\ud81b\ude4b": "\ud81b\ude6b", "\ud81b\ude4c": "\ud81b\ude6c", "\ud81b\ude4d": "\ud81b\ude6d", "\ud81b\ude4e": "\ud81b\ude6e", "\ud81b\ude4f": "\ud81b\ude6f", "\ud81b\ude50": "\ud81b\ude70", "\ud81b\ude51": "\ud81b\ude71", "\ud81b\ude52": "\ud81b\ude72", "\ud81b\ude53": "\ud81b\ude73", "\ud81b\ude54": "\ud81b\ude74", "\ud81b\ude55": "\ud81b\ude75", "\ud81b\ude56": "\ud81b\ude76", "\ud81b\ude57": "\ud81b\ude77", "\ud81b\ude58": "\ud81b\ude78", "\ud81b\ude59": "\ud81b\ude79", "\ud81b\ude5a": "\ud81b\ude7a", "\ud81b\ude5b": "\ud81b\ude7b", "\ud81b\ude5c": "\ud81b\ude7c", "\ud81b\ude5d": "\ud81b\ude7d", "\ud81b\ude5e": "\ud81b\ude7e", "\ud81b\ude5f": "\ud81b\ude7f", "\ud81b\udea0": "\ud81b\udebb", "\ud81b\udea1": "\ud81b\udebc", "\ud81b\udea2": "\ud81b\udebd", "\ud81b\udea3": "\ud81b\udebe", "\ud81b\udea4": "\ud81b\udebf", "\ud81b\udea5": "\ud81b\udec0", "\ud81b\udea6": "\ud81b\udec1", "\ud81b\udea7": "\ud81b\udec2", "\ud81b\udea8": "\ud81b\udec3", "\ud81b\udea9": "\ud81b\udec4", "\ud81b\udeaa": "\ud81b\udec5", "\ud81b\udeab": "\ud81b\udec6", "\ud81b\udeac": "\ud81b\udec7", "\ud81b\udead": "\ud81b\udec8", "\ud81b\udeae": "\ud81b\udec9", "\ud81b\udeaf": "\ud81b\udeca", "\ud81b\udeb0": "\ud81b\udecb", "\ud81b\udeb1": "\ud81b\udecc", "\ud81b\udeb2": "\ud81b\udecd", "\ud81b\udeb3": "\ud81b\udece", "\ud81b\udeb4": "\ud81b\udecf", "\ud81b\udeb5": "\ud81b\uded0", "\ud81b\udeb6": "\ud81b\uded1", "\ud81b\udeb7": "\ud81b\uded2", "\ud81b\udeb8": "\ud81b\uded3", "\ud83a\udd00": "\ud83a\udd22", "\ud83a\udd01": "\ud83a\udd23", "\ud83a\udd02": "\ud83a\udd24", "\ud83a\udd03": "\ud83a\udd25", "\ud83a\udd04": "\ud83a\udd26", "\ud83a\udd05": "\ud83a\udd27", "\ud83a\udd06": "\ud83a\udd28", "\ud83a\udd07": "\ud83a\udd29", "\ud83a\udd08": "\ud83a\udd2a", "\ud83a\udd09": "\ud83a\udd2b", "\ud83a\udd0a": "\ud83a\udd2c", "\ud83a\udd0b": "\ud83a\udd2d", "\ud83a\udd0c": "\ud83a\udd2e", "\ud83a\udd0d": "\ud83a\udd2f", "\ud83a\udd0e": "\ud83a\udd30", "\ud83a\udd0f": "\ud83a\udd31", "\ud83a\udd10": "\ud83a\udd32", "\ud83a\udd11": "\ud83a\udd33", "\ud83a\udd12": "\ud83a\udd34", "\ud83a\udd13": "\ud83a\udd35", "\ud83a\udd14": "\ud83a\udd36", "\ud83a\udd15": "\ud83a\udd37", "\ud83a\udd16": "\ud83a\udd38", "\ud83a\udd17": "\ud83a\udd39", "\ud83a\udd18": "\ud83a\udd3a", "\ud83a\udd19": "\ud83a\udd3b", "\ud83a\udd1a": "\ud83a\udd3c", "\ud83a\udd1b": "\ud83a\udd3d", "\ud83a\udd1c": "\ud83a\udd3e", "\ud83a\udd1d": "\ud83a\udd3f", "\ud83a\udd1e": "\ud83a\udd40", "\ud83a\udd1f": "\ud83a\udd41", "\ud83a\udd20": "\ud83a\udd42", "\ud83a\udd21": "\ud83a\udd43" };
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
const SPACE = /^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
const trimmedCode = (code) => code.replace(SPACE, "");
function canonicalCodeKey(code) { return (0,_unicode_normalization__WEBPACK_IMPORTED_MODULE_0__.unicode17NFC)((0,_unicode_normalization__WEBPACK_IMPORTED_MODULE_0__.unicode17NFD)(Array.from((0,_unicode_normalization__WEBPACK_IMPORTED_MODULE_0__.unicode17NFD)(code), c => FOLD[c] ?? c).join(""))); }


/***/ },

/***/ "./src/domain/manuscript.ts"
/*!**********************************!*\
  !*** ./src/domain/manuscript.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assertManuscript: () => (/* binding */ assertManuscript),
/* harmony export */   scalarOffsetFromUtf16: () => (/* binding */ scalarOffsetFromUtf16),
/* harmony export */   utf16OffsetFromScalar: () => (/* binding */ utf16OffsetFromScalar),
/* harmony export */   validChapterFormatting: () => (/* binding */ validChapterFormatting),
/* harmony export */   validParagraph: () => (/* binding */ validParagraph)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");
/* harmony import */ var _calendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar */ "./src/domain/calendar.ts");


function validParagraph(v) {
    if (typeof v !== 'object' || !v)
        return false;
    const kind = v.kind;
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['id', 'start', 'end', 'kind', 'indent', 'marks', ...(kind === 'heading' ? ['headingLevel'] : [])]) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.start) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.end) || BigInt(v.end) < BigInt(v.start) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.indent) || !['body', 'heading', 'scene-break'].includes(v.kind) || !Array.isArray(v.marks) || (kind === 'heading' && ![1, 2, 3, 4, 5, 6].includes(v.headingLevel)))
        return false;
    let previous = null;
    for (const m of v.marks) {
        if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(m, ['start', 'end', 'styles']) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(m.start) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(m.end) || BigInt(m.start) < BigInt(v.start) || BigInt(m.end) > BigInt(v.end) || BigInt(m.start) >= BigInt(m.end) || !Array.isArray(m.styles) || m.styles.length < 1 || m.styles.length > 2 || new Set(m.styles).size !== m.styles.length || !m.styles.every(s => s === 'bold' || s === 'italic'))
            return false;
        const styles = m.styles;
        if (previous && (BigInt(previous.end) > BigInt(m.start) || (previous.end === m.start && previous.styles.length === m.styles.length && previous.styles.every(s => styles.includes(s)))))
            return false;
        previous = m;
    }
    return kind !== 'scene-break' || v.marks.length === 0;
}
function validChapterFormatting(v) {
    return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['formatVersion', 'chapterId', 'recordVersion', 'text', 'paragraphs']) && v.formatVersion === 1 && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.chapterId) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.text, ['relativePath', 'sha256', 'byteLength', 'scalarLength']) && v.text.relativePath === `chapters/${v.chapterId}.wrt` && typeof v.text.sha256 === 'string' && /^[0-9a-f]{64}$/.test(v.text.sha256) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.text.byteLength) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.text.scalarLength) && Array.isArray(v.paragraphs) && v.paragraphs.length > 0 && v.paragraphs.every(validParagraph) && new Set(v.paragraphs.map(p => p.id)).size === v.paragraphs.length;
}
function assertManuscript(text, paragraphs) {
    if (!(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(text) || text.includes('\r') || text.startsWith('\uFEFF') || !Array.isArray(paragraphs) || !paragraphs.every(validParagraph) || new Set(paragraphs.map(p => p.id)).size !== paragraphs.length)
        throw new Error('Invalid LF manuscript or formatting.');
    const lines = text.split('\n');
    if (lines.length !== paragraphs.length)
        throw new Error('Paragraphs do not match manuscript.');
    let start = 0n;
    for (let i = 0; i < lines.length; i++) {
        const p = paragraphs[i], end = start + BigInt(Array.from(lines[i]).length);
        if (p.start !== start.toString() || p.end !== end.toString() || (p.kind === 'scene-break' && lines[i] !== '***'))
            throw new Error('Paragraph ranges do not match manuscript.');
        start = end + 1n;
    }
}
function scalarOffsetFromUtf16(text, offset) {
    if (!(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(text) || !Number.isSafeInteger(offset) || offset < 0 || offset > text.length || (offset > 0 && offset < text.length && /[\uD800-\uDBFF]/.test(text[offset - 1]) && /[\uDC00-\uDFFF]/.test(text[offset])))
        throw new Error('Offset splits a Unicode scalar.');
    return Array.from(text.slice(0, offset)).length.toString();
}
function utf16OffsetFromScalar(text, offset) { if (!(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(text) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(offset))
    throw new Error('Invalid scalar offset.'); let n = 0n, utf16 = 0; for (const s of text) {
    if (n === BigInt(offset))
        return utf16;
    n++;
    utf16 += s.length;
} if (n === BigInt(offset))
    return utf16; throw new Error('Scalar offset exceeds text.'); }


/***/ },

/***/ "./src/domain/personality.ts"
/*!***********************************!*\
  !*** ./src/domain/personality.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERSONALITY_LABELS: () => (/* binding */ PERSONALITY_LABELS)
/* harmony export */ });
const PERSONALITY_LABELS = [
    "Sanguine",
    "Choleric",
    "Phlegmatic",
    "Melancholic",
    "Average",
    "Reserved",
    "Self-Centered",
    "Role Model",
    "High Openness",
    "High Conscientiousness",
    "High Extraversion",
    "High Agreeableness",
    "High Neuroticism",
    "Curious Organizer",
    "Quiet Organizer",
    "Warm Strategist",
    "Bold Mediator",
    "Calm Explorer",
    "Intense Visionary",
    "Social Idealist",
    "Guarded Analyst",
    "Dutiful Helper",
    "Restless Achiever",
    "Steady Caregiver",
    "Practical Diplomat",
    "Reflective Builder",
    "Driven Commander",
    "Gentle Traditionalist",
    "Adventurous Connector",
    "Methodical Skeptic",
    "Creative Loyalist",
    "Cautious Reformer",
    "High-Energy Planner",
    "Low-Key Harmonizer",
    "Competitive Organizer",
    "Empathic Visionary",
    "Reserved Perfectionist",
    "Charismatic Stabilizer",
    "Independent Thinker",
    "Sensitive Collaborator",
    "Disciplined Explorer",
    "Expressive Reformer",
    "Peace-Seeking Planner",
    "Tactical Caregiver",
    "Bold Innovator",
    "Stoic Executor",
    "Imaginative Realist",
    "Structured Idealist",
    "Loyal Protector",
    "Adaptive Diplomat",
    "Abrasive Commander",
    "Cold Opportunist",
    "Anxious Controller",
    "Bitter Traditionalist",
    "Paranoid Strategist",
    "Self-Important Critic",
    "Manipulative Charmer",
    "Volatile Achiever",
    "Resentful Follower",
    "Rigid Perfectionist",
    "Detached Elitist",
    "Defensive Skeptic",
    "Impulsive Schemer",
    "Cowardly Bully",
    "Jealous Rival",
    "Passive Saboteur",
    "Martyr Complex",
    "Smug Reformer",
    "Disloyal Survivor",
    "Pessimistic Planner",
    "Control-Hungry Caregiver",
    "Restless Dissenter",
    "Guilt Weaponizer",
    "Emotionally Withholding",
    "Petty Scorekeeper",
    "Grandiose Visionary",
    "Cynical Manipulator",
    "Unstable Loyalist",
    "Status Addict",
    "Harsh Pragmatist",
    "Catastrophizer",
    "Suspicious Isolator",
    "Domineering Organizer",
    "Blame Shifter",
    "Moral Showboater",
    "Insecure Braggart",
    "Compulsive Doubter",
    "Predatory Networker",
    "Cruel Realist",
    "Envious Imitator",
    "Neglectful Dreamer",
    "Fearful Conformist",
    "Vindictive Idealist",
    "Attention Drainer",
    "Reckless Evangelist",
    "Secretly Contemptuous Ally",
    "Boundary Breaker",
    "Tyrannical Protector",
    "Hopeless Defeatist",
    "Corrosive Diplomat"
];


/***/ },

/***/ "./src/domain/unicode-normalization-data.ts"
/*!**************************************************!*\
  !*** ./src/domain/unicode-normalization-data.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMBINING: () => (/* binding */ COMBINING),
/* harmony export */   COMPOSITION: () => (/* binding */ COMPOSITION),
/* harmony export */   DECOMPOSITION: () => (/* binding */ DECOMPOSITION)
/* harmony export */ });
// Generated from Unicode 17.0.0 UnicodeData.txt and Full_Composition_Exclusion.
// Unicode License V3: resources/licenses/Unicode-LICENSE.txt
// writingtool-UnicodeData-17.0.0.txt: SHA-256 2e1efc1dcb59c575eedf5ccae60f95229f706ee6d031835247d843c11d96470c
// writingtool-DerivedNormalizationProps-17.0.0.txt: SHA-256 71fd6a206a2c0cdd41feb6b7f656aa31091db45e9cedc926985d718397f9e488
const DECOMPOSITION = { "192": [65, 768], "193": [65, 769], "194": [65, 770], "195": [65, 771], "196": [65, 776], "197": [65, 778], "199": [67, 807], "200": [69, 768], "201": [69, 769], "202": [69, 770], "203": [69, 776], "204": [73, 768], "205": [73, 769], "206": [73, 770], "207": [73, 776], "209": [78, 771], "210": [79, 768], "211": [79, 769], "212": [79, 770], "213": [79, 771], "214": [79, 776], "217": [85, 768], "218": [85, 769], "219": [85, 770], "220": [85, 776], "221": [89, 769], "224": [97, 768], "225": [97, 769], "226": [97, 770], "227": [97, 771], "228": [97, 776], "229": [97, 778], "231": [99, 807], "232": [101, 768], "233": [101, 769], "234": [101, 770], "235": [101, 776], "236": [105, 768], "237": [105, 769], "238": [105, 770], "239": [105, 776], "241": [110, 771], "242": [111, 768], "243": [111, 769], "244": [111, 770], "245": [111, 771], "246": [111, 776], "249": [117, 768], "250": [117, 769], "251": [117, 770], "252": [117, 776], "253": [121, 769], "255": [121, 776], "256": [65, 772], "257": [97, 772], "258": [65, 774], "259": [97, 774], "260": [65, 808], "261": [97, 808], "262": [67, 769], "263": [99, 769], "264": [67, 770], "265": [99, 770], "266": [67, 775], "267": [99, 775], "268": [67, 780], "269": [99, 780], "270": [68, 780], "271": [100, 780], "274": [69, 772], "275": [101, 772], "276": [69, 774], "277": [101, 774], "278": [69, 775], "279": [101, 775], "280": [69, 808], "281": [101, 808], "282": [69, 780], "283": [101, 780], "284": [71, 770], "285": [103, 770], "286": [71, 774], "287": [103, 774], "288": [71, 775], "289": [103, 775], "290": [71, 807], "291": [103, 807], "292": [72, 770], "293": [104, 770], "296": [73, 771], "297": [105, 771], "298": [73, 772], "299": [105, 772], "300": [73, 774], "301": [105, 774], "302": [73, 808], "303": [105, 808], "304": [73, 775], "308": [74, 770], "309": [106, 770], "310": [75, 807], "311": [107, 807], "313": [76, 769], "314": [108, 769], "315": [76, 807], "316": [108, 807], "317": [76, 780], "318": [108, 780], "323": [78, 769], "324": [110, 769], "325": [78, 807], "326": [110, 807], "327": [78, 780], "328": [110, 780], "332": [79, 772], "333": [111, 772], "334": [79, 774], "335": [111, 774], "336": [79, 779], "337": [111, 779], "340": [82, 769], "341": [114, 769], "342": [82, 807], "343": [114, 807], "344": [82, 780], "345": [114, 780], "346": [83, 769], "347": [115, 769], "348": [83, 770], "349": [115, 770], "350": [83, 807], "351": [115, 807], "352": [83, 780], "353": [115, 780], "354": [84, 807], "355": [116, 807], "356": [84, 780], "357": [116, 780], "360": [85, 771], "361": [117, 771], "362": [85, 772], "363": [117, 772], "364": [85, 774], "365": [117, 774], "366": [85, 778], "367": [117, 778], "368": [85, 779], "369": [117, 779], "370": [85, 808], "371": [117, 808], "372": [87, 770], "373": [119, 770], "374": [89, 770], "375": [121, 770], "376": [89, 776], "377": [90, 769], "378": [122, 769], "379": [90, 775], "380": [122, 775], "381": [90, 780], "382": [122, 780], "416": [79, 795], "417": [111, 795], "431": [85, 795], "432": [117, 795], "461": [65, 780], "462": [97, 780], "463": [73, 780], "464": [105, 780], "465": [79, 780], "466": [111, 780], "467": [85, 780], "468": [117, 780], "469": [220, 772], "470": [252, 772], "471": [220, 769], "472": [252, 769], "473": [220, 780], "474": [252, 780], "475": [220, 768], "476": [252, 768], "478": [196, 772], "479": [228, 772], "480": [550, 772], "481": [551, 772], "482": [198, 772], "483": [230, 772], "486": [71, 780], "487": [103, 780], "488": [75, 780], "489": [107, 780], "490": [79, 808], "491": [111, 808], "492": [490, 772], "493": [491, 772], "494": [439, 780], "495": [658, 780], "496": [106, 780], "500": [71, 769], "501": [103, 769], "504": [78, 768], "505": [110, 768], "506": [197, 769], "507": [229, 769], "508": [198, 769], "509": [230, 769], "510": [216, 769], "511": [248, 769], "512": [65, 783], "513": [97, 783], "514": [65, 785], "515": [97, 785], "516": [69, 783], "517": [101, 783], "518": [69, 785], "519": [101, 785], "520": [73, 783], "521": [105, 783], "522": [73, 785], "523": [105, 785], "524": [79, 783], "525": [111, 783], "526": [79, 785], "527": [111, 785], "528": [82, 783], "529": [114, 783], "530": [82, 785], "531": [114, 785], "532": [85, 783], "533": [117, 783], "534": [85, 785], "535": [117, 785], "536": [83, 806], "537": [115, 806], "538": [84, 806], "539": [116, 806], "542": [72, 780], "543": [104, 780], "550": [65, 775], "551": [97, 775], "552": [69, 807], "553": [101, 807], "554": [214, 772], "555": [246, 772], "556": [213, 772], "557": [245, 772], "558": [79, 775], "559": [111, 775], "560": [558, 772], "561": [559, 772], "562": [89, 772], "563": [121, 772], "832": [768], "833": [769], "835": [787], "836": [776, 769], "884": [697], "894": [59], "901": [168, 769], "902": [913, 769], "903": [183], "904": [917, 769], "905": [919, 769], "906": [921, 769], "908": [927, 769], "910": [933, 769], "911": [937, 769], "912": [970, 769], "938": [921, 776], "939": [933, 776], "940": [945, 769], "941": [949, 769], "942": [951, 769], "943": [953, 769], "944": [971, 769], "970": [953, 776], "971": [965, 776], "972": [959, 769], "973": [965, 769], "974": [969, 769], "979": [978, 769], "980": [978, 776], "1024": [1045, 768], "1025": [1045, 776], "1027": [1043, 769], "1031": [1030, 776], "1036": [1050, 769], "1037": [1048, 768], "1038": [1059, 774], "1049": [1048, 774], "1081": [1080, 774], "1104": [1077, 768], "1105": [1077, 776], "1107": [1075, 769], "1111": [1110, 776], "1116": [1082, 769], "1117": [1080, 768], "1118": [1091, 774], "1142": [1140, 783], "1143": [1141, 783], "1217": [1046, 774], "1218": [1078, 774], "1232": [1040, 774], "1233": [1072, 774], "1234": [1040, 776], "1235": [1072, 776], "1238": [1045, 774], "1239": [1077, 774], "1242": [1240, 776], "1243": [1241, 776], "1244": [1046, 776], "1245": [1078, 776], "1246": [1047, 776], "1247": [1079, 776], "1250": [1048, 772], "1251": [1080, 772], "1252": [1048, 776], "1253": [1080, 776], "1254": [1054, 776], "1255": [1086, 776], "1258": [1256, 776], "1259": [1257, 776], "1260": [1069, 776], "1261": [1101, 776], "1262": [1059, 772], "1263": [1091, 772], "1264": [1059, 776], "1265": [1091, 776], "1266": [1059, 779], "1267": [1091, 779], "1268": [1063, 776], "1269": [1095, 776], "1272": [1067, 776], "1273": [1099, 776], "1570": [1575, 1619], "1571": [1575, 1620], "1572": [1608, 1620], "1573": [1575, 1621], "1574": [1610, 1620], "1728": [1749, 1620], "1730": [1729, 1620], "1747": [1746, 1620], "2345": [2344, 2364], "2353": [2352, 2364], "2356": [2355, 2364], "2392": [2325, 2364], "2393": [2326, 2364], "2394": [2327, 2364], "2395": [2332, 2364], "2396": [2337, 2364], "2397": [2338, 2364], "2398": [2347, 2364], "2399": [2351, 2364], "2507": [2503, 2494], "2508": [2503, 2519], "2524": [2465, 2492], "2525": [2466, 2492], "2527": [2479, 2492], "2611": [2610, 2620], "2614": [2616, 2620], "2649": [2582, 2620], "2650": [2583, 2620], "2651": [2588, 2620], "2654": [2603, 2620], "2888": [2887, 2902], "2891": [2887, 2878], "2892": [2887, 2903], "2908": [2849, 2876], "2909": [2850, 2876], "2964": [2962, 3031], "3018": [3014, 3006], "3019": [3015, 3006], "3020": [3014, 3031], "3144": [3142, 3158], "3264": [3263, 3285], "3271": [3270, 3285], "3272": [3270, 3286], "3274": [3270, 3266], "3275": [3274, 3285], "3402": [3398, 3390], "3403": [3399, 3390], "3404": [3398, 3415], "3546": [3545, 3530], "3548": [3545, 3535], "3549": [3548, 3530], "3550": [3545, 3551], "3907": [3906, 4023], "3917": [3916, 4023], "3922": [3921, 4023], "3927": [3926, 4023], "3932": [3931, 4023], "3945": [3904, 4021], "3955": [3953, 3954], "3957": [3953, 3956], "3958": [4018, 3968], "3960": [4019, 3968], "3969": [3953, 3968], "3987": [3986, 4023], "3997": [3996, 4023], "4002": [4001, 4023], "4007": [4006, 4023], "4012": [4011, 4023], "4025": [3984, 4021], "4134": [4133, 4142], "6918": [6917, 6965], "6920": [6919, 6965], "6922": [6921, 6965], "6924": [6923, 6965], "6926": [6925, 6965], "6930": [6929, 6965], "6971": [6970, 6965], "6973": [6972, 6965], "6976": [6974, 6965], "6977": [6975, 6965], "6979": [6978, 6965], "7680": [65, 805], "7681": [97, 805], "7682": [66, 775], "7683": [98, 775], "7684": [66, 803], "7685": [98, 803], "7686": [66, 817], "7687": [98, 817], "7688": [199, 769], "7689": [231, 769], "7690": [68, 775], "7691": [100, 775], "7692": [68, 803], "7693": [100, 803], "7694": [68, 817], "7695": [100, 817], "7696": [68, 807], "7697": [100, 807], "7698": [68, 813], "7699": [100, 813], "7700": [274, 768], "7701": [275, 768], "7702": [274, 769], "7703": [275, 769], "7704": [69, 813], "7705": [101, 813], "7706": [69, 816], "7707": [101, 816], "7708": [552, 774], "7709": [553, 774], "7710": [70, 775], "7711": [102, 775], "7712": [71, 772], "7713": [103, 772], "7714": [72, 775], "7715": [104, 775], "7716": [72, 803], "7717": [104, 803], "7718": [72, 776], "7719": [104, 776], "7720": [72, 807], "7721": [104, 807], "7722": [72, 814], "7723": [104, 814], "7724": [73, 816], "7725": [105, 816], "7726": [207, 769], "7727": [239, 769], "7728": [75, 769], "7729": [107, 769], "7730": [75, 803], "7731": [107, 803], "7732": [75, 817], "7733": [107, 817], "7734": [76, 803], "7735": [108, 803], "7736": [7734, 772], "7737": [7735, 772], "7738": [76, 817], "7739": [108, 817], "7740": [76, 813], "7741": [108, 813], "7742": [77, 769], "7743": [109, 769], "7744": [77, 775], "7745": [109, 775], "7746": [77, 803], "7747": [109, 803], "7748": [78, 775], "7749": [110, 775], "7750": [78, 803], "7751": [110, 803], "7752": [78, 817], "7753": [110, 817], "7754": [78, 813], "7755": [110, 813], "7756": [213, 769], "7757": [245, 769], "7758": [213, 776], "7759": [245, 776], "7760": [332, 768], "7761": [333, 768], "7762": [332, 769], "7763": [333, 769], "7764": [80, 769], "7765": [112, 769], "7766": [80, 775], "7767": [112, 775], "7768": [82, 775], "7769": [114, 775], "7770": [82, 803], "7771": [114, 803], "7772": [7770, 772], "7773": [7771, 772], "7774": [82, 817], "7775": [114, 817], "7776": [83, 775], "7777": [115, 775], "7778": [83, 803], "7779": [115, 803], "7780": [346, 775], "7781": [347, 775], "7782": [352, 775], "7783": [353, 775], "7784": [7778, 775], "7785": [7779, 775], "7786": [84, 775], "7787": [116, 775], "7788": [84, 803], "7789": [116, 803], "7790": [84, 817], "7791": [116, 817], "7792": [84, 813], "7793": [116, 813], "7794": [85, 804], "7795": [117, 804], "7796": [85, 816], "7797": [117, 816], "7798": [85, 813], "7799": [117, 813], "7800": [360, 769], "7801": [361, 769], "7802": [362, 776], "7803": [363, 776], "7804": [86, 771], "7805": [118, 771], "7806": [86, 803], "7807": [118, 803], "7808": [87, 768], "7809": [119, 768], "7810": [87, 769], "7811": [119, 769], "7812": [87, 776], "7813": [119, 776], "7814": [87, 775], "7815": [119, 775], "7816": [87, 803], "7817": [119, 803], "7818": [88, 775], "7819": [120, 775], "7820": [88, 776], "7821": [120, 776], "7822": [89, 775], "7823": [121, 775], "7824": [90, 770], "7825": [122, 770], "7826": [90, 803], "7827": [122, 803], "7828": [90, 817], "7829": [122, 817], "7830": [104, 817], "7831": [116, 776], "7832": [119, 778], "7833": [121, 778], "7835": [383, 775], "7840": [65, 803], "7841": [97, 803], "7842": [65, 777], "7843": [97, 777], "7844": [194, 769], "7845": [226, 769], "7846": [194, 768], "7847": [226, 768], "7848": [194, 777], "7849": [226, 777], "7850": [194, 771], "7851": [226, 771], "7852": [7840, 770], "7853": [7841, 770], "7854": [258, 769], "7855": [259, 769], "7856": [258, 768], "7857": [259, 768], "7858": [258, 777], "7859": [259, 777], "7860": [258, 771], "7861": [259, 771], "7862": [7840, 774], "7863": [7841, 774], "7864": [69, 803], "7865": [101, 803], "7866": [69, 777], "7867": [101, 777], "7868": [69, 771], "7869": [101, 771], "7870": [202, 769], "7871": [234, 769], "7872": [202, 768], "7873": [234, 768], "7874": [202, 777], "7875": [234, 777], "7876": [202, 771], "7877": [234, 771], "7878": [7864, 770], "7879": [7865, 770], "7880": [73, 777], "7881": [105, 777], "7882": [73, 803], "7883": [105, 803], "7884": [79, 803], "7885": [111, 803], "7886": [79, 777], "7887": [111, 777], "7888": [212, 769], "7889": [244, 769], "7890": [212, 768], "7891": [244, 768], "7892": [212, 777], "7893": [244, 777], "7894": [212, 771], "7895": [244, 771], "7896": [7884, 770], "7897": [7885, 770], "7898": [416, 769], "7899": [417, 769], "7900": [416, 768], "7901": [417, 768], "7902": [416, 777], "7903": [417, 777], "7904": [416, 771], "7905": [417, 771], "7906": [416, 803], "7907": [417, 803], "7908": [85, 803], "7909": [117, 803], "7910": [85, 777], "7911": [117, 777], "7912": [431, 769], "7913": [432, 769], "7914": [431, 768], "7915": [432, 768], "7916": [431, 777], "7917": [432, 777], "7918": [431, 771], "7919": [432, 771], "7920": [431, 803], "7921": [432, 803], "7922": [89, 768], "7923": [121, 768], "7924": [89, 803], "7925": [121, 803], "7926": [89, 777], "7927": [121, 777], "7928": [89, 771], "7929": [121, 771], "7936": [945, 787], "7937": [945, 788], "7938": [7936, 768], "7939": [7937, 768], "7940": [7936, 769], "7941": [7937, 769], "7942": [7936, 834], "7943": [7937, 834], "7944": [913, 787], "7945": [913, 788], "7946": [7944, 768], "7947": [7945, 768], "7948": [7944, 769], "7949": [7945, 769], "7950": [7944, 834], "7951": [7945, 834], "7952": [949, 787], "7953": [949, 788], "7954": [7952, 768], "7955": [7953, 768], "7956": [7952, 769], "7957": [7953, 769], "7960": [917, 787], "7961": [917, 788], "7962": [7960, 768], "7963": [7961, 768], "7964": [7960, 769], "7965": [7961, 769], "7968": [951, 787], "7969": [951, 788], "7970": [7968, 768], "7971": [7969, 768], "7972": [7968, 769], "7973": [7969, 769], "7974": [7968, 834], "7975": [7969, 834], "7976": [919, 787], "7977": [919, 788], "7978": [7976, 768], "7979": [7977, 768], "7980": [7976, 769], "7981": [7977, 769], "7982": [7976, 834], "7983": [7977, 834], "7984": [953, 787], "7985": [953, 788], "7986": [7984, 768], "7987": [7985, 768], "7988": [7984, 769], "7989": [7985, 769], "7990": [7984, 834], "7991": [7985, 834], "7992": [921, 787], "7993": [921, 788], "7994": [7992, 768], "7995": [7993, 768], "7996": [7992, 769], "7997": [7993, 769], "7998": [7992, 834], "7999": [7993, 834], "8000": [959, 787], "8001": [959, 788], "8002": [8000, 768], "8003": [8001, 768], "8004": [8000, 769], "8005": [8001, 769], "8008": [927, 787], "8009": [927, 788], "8010": [8008, 768], "8011": [8009, 768], "8012": [8008, 769], "8013": [8009, 769], "8016": [965, 787], "8017": [965, 788], "8018": [8016, 768], "8019": [8017, 768], "8020": [8016, 769], "8021": [8017, 769], "8022": [8016, 834], "8023": [8017, 834], "8025": [933, 788], "8027": [8025, 768], "8029": [8025, 769], "8031": [8025, 834], "8032": [969, 787], "8033": [969, 788], "8034": [8032, 768], "8035": [8033, 768], "8036": [8032, 769], "8037": [8033, 769], "8038": [8032, 834], "8039": [8033, 834], "8040": [937, 787], "8041": [937, 788], "8042": [8040, 768], "8043": [8041, 768], "8044": [8040, 769], "8045": [8041, 769], "8046": [8040, 834], "8047": [8041, 834], "8048": [945, 768], "8049": [940], "8050": [949, 768], "8051": [941], "8052": [951, 768], "8053": [942], "8054": [953, 768], "8055": [943], "8056": [959, 768], "8057": [972], "8058": [965, 768], "8059": [973], "8060": [969, 768], "8061": [974], "8064": [7936, 837], "8065": [7937, 837], "8066": [7938, 837], "8067": [7939, 837], "8068": [7940, 837], "8069": [7941, 837], "8070": [7942, 837], "8071": [7943, 837], "8072": [7944, 837], "8073": [7945, 837], "8074": [7946, 837], "8075": [7947, 837], "8076": [7948, 837], "8077": [7949, 837], "8078": [7950, 837], "8079": [7951, 837], "8080": [7968, 837], "8081": [7969, 837], "8082": [7970, 837], "8083": [7971, 837], "8084": [7972, 837], "8085": [7973, 837], "8086": [7974, 837], "8087": [7975, 837], "8088": [7976, 837], "8089": [7977, 837], "8090": [7978, 837], "8091": [7979, 837], "8092": [7980, 837], "8093": [7981, 837], "8094": [7982, 837], "8095": [7983, 837], "8096": [8032, 837], "8097": [8033, 837], "8098": [8034, 837], "8099": [8035, 837], "8100": [8036, 837], "8101": [8037, 837], "8102": [8038, 837], "8103": [8039, 837], "8104": [8040, 837], "8105": [8041, 837], "8106": [8042, 837], "8107": [8043, 837], "8108": [8044, 837], "8109": [8045, 837], "8110": [8046, 837], "8111": [8047, 837], "8112": [945, 774], "8113": [945, 772], "8114": [8048, 837], "8115": [945, 837], "8116": [940, 837], "8118": [945, 834], "8119": [8118, 837], "8120": [913, 774], "8121": [913, 772], "8122": [913, 768], "8123": [902], "8124": [913, 837], "8126": [953], "8129": [168, 834], "8130": [8052, 837], "8131": [951, 837], "8132": [942, 837], "8134": [951, 834], "8135": [8134, 837], "8136": [917, 768], "8137": [904], "8138": [919, 768], "8139": [905], "8140": [919, 837], "8141": [8127, 768], "8142": [8127, 769], "8143": [8127, 834], "8144": [953, 774], "8145": [953, 772], "8146": [970, 768], "8147": [912], "8150": [953, 834], "8151": [970, 834], "8152": [921, 774], "8153": [921, 772], "8154": [921, 768], "8155": [906], "8157": [8190, 768], "8158": [8190, 769], "8159": [8190, 834], "8160": [965, 774], "8161": [965, 772], "8162": [971, 768], "8163": [944], "8164": [961, 787], "8165": [961, 788], "8166": [965, 834], "8167": [971, 834], "8168": [933, 774], "8169": [933, 772], "8170": [933, 768], "8171": [910], "8172": [929, 788], "8173": [168, 768], "8174": [901], "8175": [96], "8178": [8060, 837], "8179": [969, 837], "8180": [974, 837], "8182": [969, 834], "8183": [8182, 837], "8184": [927, 768], "8185": [908], "8186": [937, 768], "8187": [911], "8188": [937, 837], "8189": [180], "8192": [8194], "8193": [8195], "8486": [937], "8490": [75], "8491": [197], "8602": [8592, 824], "8603": [8594, 824], "8622": [8596, 824], "8653": [8656, 824], "8654": [8660, 824], "8655": [8658, 824], "8708": [8707, 824], "8713": [8712, 824], "8716": [8715, 824], "8740": [8739, 824], "8742": [8741, 824], "8769": [8764, 824], "8772": [8771, 824], "8775": [8773, 824], "8777": [8776, 824], "8800": [61, 824], "8802": [8801, 824], "8813": [8781, 824], "8814": [60, 824], "8815": [62, 824], "8816": [8804, 824], "8817": [8805, 824], "8820": [8818, 824], "8821": [8819, 824], "8824": [8822, 824], "8825": [8823, 824], "8832": [8826, 824], "8833": [8827, 824], "8836": [8834, 824], "8837": [8835, 824], "8840": [8838, 824], "8841": [8839, 824], "8876": [8866, 824], "8877": [8872, 824], "8878": [8873, 824], "8879": [8875, 824], "8928": [8828, 824], "8929": [8829, 824], "8930": [8849, 824], "8931": [8850, 824], "8938": [8882, 824], "8939": [8883, 824], "8940": [8884, 824], "8941": [8885, 824], "9001": [12296], "9002": [12297], "10972": [10973, 824], "12364": [12363, 12441], "12366": [12365, 12441], "12368": [12367, 12441], "12370": [12369, 12441], "12372": [12371, 12441], "12374": [12373, 12441], "12376": [12375, 12441], "12378": [12377, 12441], "12380": [12379, 12441], "12382": [12381, 12441], "12384": [12383, 12441], "12386": [12385, 12441], "12389": [12388, 12441], "12391": [12390, 12441], "12393": [12392, 12441], "12400": [12399, 12441], "12401": [12399, 12442], "12403": [12402, 12441], "12404": [12402, 12442], "12406": [12405, 12441], "12407": [12405, 12442], "12409": [12408, 12441], "12410": [12408, 12442], "12412": [12411, 12441], "12413": [12411, 12442], "12436": [12358, 12441], "12446": [12445, 12441], "12460": [12459, 12441], "12462": [12461, 12441], "12464": [12463, 12441], "12466": [12465, 12441], "12468": [12467, 12441], "12470": [12469, 12441], "12472": [12471, 12441], "12474": [12473, 12441], "12476": [12475, 12441], "12478": [12477, 12441], "12480": [12479, 12441], "12482": [12481, 12441], "12485": [12484, 12441], "12487": [12486, 12441], "12489": [12488, 12441], "12496": [12495, 12441], "12497": [12495, 12442], "12499": [12498, 12441], "12500": [12498, 12442], "12502": [12501, 12441], "12503": [12501, 12442], "12505": [12504, 12441], "12506": [12504, 12442], "12508": [12507, 12441], "12509": [12507, 12442], "12532": [12454, 12441], "12535": [12527, 12441], "12536": [12528, 12441], "12537": [12529, 12441], "12538": [12530, 12441], "12542": [12541, 12441], "63744": [35912], "63745": [26356], "63746": [36554], "63747": [36040], "63748": [28369], "63749": [20018], "63750": [21477], "63751": [40860], "63752": [40860], "63753": [22865], "63754": [37329], "63755": [21895], "63756": [22856], "63757": [25078], "63758": [30313], "63759": [32645], "63760": [34367], "63761": [34746], "63762": [35064], "63763": [37007], "63764": [27138], "63765": [27931], "63766": [28889], "63767": [29662], "63768": [33853], "63769": [37226], "63770": [39409], "63771": [20098], "63772": [21365], "63773": [27396], "63774": [29211], "63775": [34349], "63776": [40478], "63777": [23888], "63778": [28651], "63779": [34253], "63780": [35172], "63781": [25289], "63782": [33240], "63783": [34847], "63784": [24266], "63785": [26391], "63786": [28010], "63787": [29436], "63788": [37070], "63789": [20358], "63790": [20919], "63791": [21214], "63792": [25796], "63793": [27347], "63794": [29200], "63795": [30439], "63796": [32769], "63797": [34310], "63798": [34396], "63799": [36335], "63800": [38706], "63801": [39791], "63802": [40442], "63803": [30860], "63804": [31103], "63805": [32160], "63806": [33737], "63807": [37636], "63808": [40575], "63809": [35542], "63810": [22751], "63811": [24324], "63812": [31840], "63813": [32894], "63814": [29282], "63815": [30922], "63816": [36034], "63817": [38647], "63818": [22744], "63819": [23650], "63820": [27155], "63821": [28122], "63822": [28431], "63823": [32047], "63824": [32311], "63825": [38475], "63826": [21202], "63827": [32907], "63828": [20956], "63829": [20940], "63830": [31260], "63831": [32190], "63832": [33777], "63833": [38517], "63834": [35712], "63835": [25295], "63836": [27138], "63837": [35582], "63838": [20025], "63839": [23527], "63840": [24594], "63841": [29575], "63842": [30064], "63843": [21271], "63844": [30971], "63845": [20415], "63846": [24489], "63847": [19981], "63848": [27852], "63849": [25976], "63850": [32034], "63851": [21443], "63852": [22622], "63853": [30465], "63854": [33865], "63855": [35498], "63856": [27578], "63857": [36784], "63858": [27784], "63859": [25342], "63860": [33509], "63861": [25504], "63862": [30053], "63863": [20142], "63864": [20841], "63865": [20937], "63866": [26753], "63867": [31975], "63868": [33391], "63869": [35538], "63870": [37327], "63871": [21237], "63872": [21570], "63873": [22899], "63874": [24300], "63875": [26053], "63876": [28670], "63877": [31018], "63878": [38317], "63879": [39530], "63880": [40599], "63881": [40654], "63882": [21147], "63883": [26310], "63884": [27511], "63885": [36706], "63886": [24180], "63887": [24976], "63888": [25088], "63889": [25754], "63890": [28451], "63891": [29001], "63892": [29833], "63893": [31178], "63894": [32244], "63895": [32879], "63896": [36646], "63897": [34030], "63898": [36899], "63899": [37706], "63900": [21015], "63901": [21155], "63902": [21693], "63903": [28872], "63904": [35010], "63905": [35498], "63906": [24265], "63907": [24565], "63908": [25467], "63909": [27566], "63910": [31806], "63911": [29557], "63912": [20196], "63913": [22265], "63914": [23527], "63915": [23994], "63916": [24604], "63917": [29618], "63918": [29801], "63919": [32666], "63920": [32838], "63921": [37428], "63922": [38646], "63923": [38728], "63924": [38936], "63925": [20363], "63926": [31150], "63927": [37300], "63928": [38584], "63929": [24801], "63930": [20102], "63931": [20698], "63932": [23534], "63933": [23615], "63934": [26009], "63935": [27138], "63936": [29134], "63937": [30274], "63938": [34044], "63939": [36988], "63940": [40845], "63941": [26248], "63942": [38446], "63943": [21129], "63944": [26491], "63945": [26611], "63946": [27969], "63947": [28316], "63948": [29705], "63949": [30041], "63950": [30827], "63951": [32016], "63952": [39006], "63953": [20845], "63954": [25134], "63955": [38520], "63956": [20523], "63957": [23833], "63958": [28138], "63959": [36650], "63960": [24459], "63961": [24900], "63962": [26647], "63963": [29575], "63964": [38534], "63965": [21033], "63966": [21519], "63967": [23653], "63968": [26131], "63969": [26446], "63970": [26792], "63971": [27877], "63972": [29702], "63973": [30178], "63974": [32633], "63975": [35023], "63976": [35041], "63977": [37324], "63978": [38626], "63979": [21311], "63980": [28346], "63981": [21533], "63982": [29136], "63983": [29848], "63984": [34298], "63985": [38563], "63986": [40023], "63987": [40607], "63988": [26519], "63989": [28107], "63990": [33256], "63991": [31435], "63992": [31520], "63993": [31890], "63994": [29376], "63995": [28825], "63996": [35672], "63997": [20160], "63998": [33590], "63999": [21050], "64000": [20999], "64001": [24230], "64002": [25299], "64003": [31958], "64004": [23429], "64005": [27934], "64006": [26292], "64007": [36667], "64008": [34892], "64009": [38477], "64010": [35211], "64011": [24275], "64012": [20800], "64013": [21952], "64016": [22618], "64018": [26228], "64021": [20958], "64022": [29482], "64023": [30410], "64024": [31036], "64025": [31070], "64026": [31077], "64027": [31119], "64028": [38742], "64029": [31934], "64030": [32701], "64032": [34322], "64034": [35576], "64037": [36920], "64038": [37117], "64042": [39151], "64043": [39164], "64044": [39208], "64045": [40372], "64046": [37086], "64047": [38583], "64048": [20398], "64049": [20711], "64050": [20813], "64051": [21193], "64052": [21220], "64053": [21329], "64054": [21917], "64055": [22022], "64056": [22120], "64057": [22592], "64058": [22696], "64059": [23652], "64060": [23662], "64061": [24724], "64062": [24936], "64063": [24974], "64064": [25074], "64065": [25935], "64066": [26082], "64067": [26257], "64068": [26757], "64069": [28023], "64070": [28186], "64071": [28450], "64072": [29038], "64073": [29227], "64074": [29730], "64075": [30865], "64076": [31038], "64077": [31049], "64078": [31048], "64079": [31056], "64080": [31062], "64081": [31069], "64082": [31117], "64083": [31118], "64084": [31296], "64085": [31361], "64086": [31680], "64087": [32244], "64088": [32265], "64089": [32321], "64090": [32626], "64091": [32773], "64092": [33261], "64093": [33401], "64094": [33401], "64095": [33879], "64096": [35088], "64097": [35222], "64098": [35585], "64099": [35641], "64100": [36051], "64101": [36104], "64102": [36790], "64103": [36920], "64104": [38627], "64105": [38911], "64106": [38971], "64107": [24693], "64108": [148206], "64109": [33304], "64112": [20006], "64113": [20917], "64114": [20840], "64115": [20352], "64116": [20805], "64117": [20864], "64118": [21191], "64119": [21242], "64120": [21917], "64121": [21845], "64122": [21913], "64123": [21986], "64124": [22618], "64125": [22707], "64126": [22852], "64127": [22868], "64128": [23138], "64129": [23336], "64130": [24274], "64131": [24281], "64132": [24425], "64133": [24493], "64134": [24792], "64135": [24910], "64136": [24840], "64137": [24974], "64138": [24928], "64139": [25074], "64140": [25140], "64141": [25540], "64142": [25628], "64143": [25682], "64144": [25942], "64145": [26228], "64146": [26391], "64147": [26395], "64148": [26454], "64149": [27513], "64150": [27578], "64151": [27969], "64152": [28379], "64153": [28363], "64154": [28450], "64155": [28702], "64156": [29038], "64157": [30631], "64158": [29237], "64159": [29359], "64160": [29482], "64161": [29809], "64162": [29958], "64163": [30011], "64164": [30237], "64165": [30239], "64166": [30410], "64167": [30427], "64168": [30452], "64169": [30538], "64170": [30528], "64171": [30924], "64172": [31409], "64173": [31680], "64174": [31867], "64175": [32091], "64176": [32244], "64177": [32574], "64178": [32773], "64179": [33618], "64180": [33775], "64181": [34681], "64182": [35137], "64183": [35206], "64184": [35222], "64185": [35519], "64186": [35576], "64187": [35531], "64188": [35585], "64189": [35582], "64190": [35565], "64191": [35641], "64192": [35722], "64193": [36104], "64194": [36664], "64195": [36978], "64196": [37273], "64197": [37494], "64198": [38524], "64199": [38627], "64200": [38742], "64201": [38875], "64202": [38911], "64203": [38923], "64204": [38971], "64205": [39698], "64206": [40860], "64207": [141386], "64208": [141380], "64209": [144341], "64210": [15261], "64211": [16408], "64212": [16441], "64213": [152137], "64214": [154832], "64215": [163539], "64216": [40771], "64217": [40846], "64285": [1497, 1460], "64287": [1522, 1463], "64298": [1513, 1473], "64299": [1513, 1474], "64300": [64329, 1473], "64301": [64329, 1474], "64302": [1488, 1463], "64303": [1488, 1464], "64304": [1488, 1468], "64305": [1489, 1468], "64306": [1490, 1468], "64307": [1491, 1468], "64308": [1492, 1468], "64309": [1493, 1468], "64310": [1494, 1468], "64312": [1496, 1468], "64313": [1497, 1468], "64314": [1498, 1468], "64315": [1499, 1468], "64316": [1500, 1468], "64318": [1502, 1468], "64320": [1504, 1468], "64321": [1505, 1468], "64323": [1507, 1468], "64324": [1508, 1468], "64326": [1510, 1468], "64327": [1511, 1468], "64328": [1512, 1468], "64329": [1513, 1468], "64330": [1514, 1468], "64331": [1493, 1465], "64332": [1489, 1471], "64333": [1499, 1471], "64334": [1508, 1471], "67017": [67026, 775], "67044": [67034, 775], "69786": [69785, 69818], "69788": [69787, 69818], "69803": [69797, 69818], "69934": [69937, 69927], "69935": [69938, 69927], "70475": [70471, 70462], "70476": [70471, 70487], "70531": [70530, 70601], "70533": [70532, 70587], "70542": [70539, 70594], "70545": [70544, 70601], "70597": [70594, 70594], "70599": [70594, 70584], "70600": [70594, 70601], "70843": [70841, 70842], "70844": [70841, 70832], "70846": [70841, 70845], "71098": [71096, 71087], "71099": [71097, 71087], "71992": [71989, 71984], "90401": [90398, 90398], "90402": [90398, 90409], "90403": [90398, 90399], "90404": [90409, 90399], "90405": [90398, 90400], "90406": [90401, 90399], "90407": [90402, 90399], "90408": [90401, 90400], "93544": [93543, 93543], "93545": [93539, 93543], "93546": [93545, 93543], "119134": [119127, 119141], "119135": [119128, 119141], "119136": [119135, 119150], "119137": [119135, 119151], "119138": [119135, 119152], "119139": [119135, 119153], "119140": [119135, 119154], "119227": [119225, 119141], "119228": [119226, 119141], "119229": [119227, 119150], "119230": [119228, 119150], "119231": [119227, 119151], "119232": [119228, 119151], "194560": [20029], "194561": [20024], "194562": [20033], "194563": [131362], "194564": [20320], "194565": [20398], "194566": [20411], "194567": [20482], "194568": [20602], "194569": [20633], "194570": [20711], "194571": [20687], "194572": [13470], "194573": [132666], "194574": [20813], "194575": [20820], "194576": [20836], "194577": [20855], "194578": [132380], "194579": [13497], "194580": [20839], "194581": [20877], "194582": [132427], "194583": [20887], "194584": [20900], "194585": [20172], "194586": [20908], "194587": [20917], "194588": [168415], "194589": [20981], "194590": [20995], "194591": [13535], "194592": [21051], "194593": [21062], "194594": [21106], "194595": [21111], "194596": [13589], "194597": [21191], "194598": [21193], "194599": [21220], "194600": [21242], "194601": [21253], "194602": [21254], "194603": [21271], "194604": [21321], "194605": [21329], "194606": [21338], "194607": [21363], "194608": [21373], "194609": [21375], "194610": [21375], "194611": [21375], "194612": [133676], "194613": [28784], "194614": [21450], "194615": [21471], "194616": [133987], "194617": [21483], "194618": [21489], "194619": [21510], "194620": [21662], "194621": [21560], "194622": [21576], "194623": [21608], "194624": [21666], "194625": [21750], "194626": [21776], "194627": [21843], "194628": [21859], "194629": [21892], "194630": [21892], "194631": [21913], "194632": [21931], "194633": [21939], "194634": [21954], "194635": [22294], "194636": [22022], "194637": [22295], "194638": [22097], "194639": [22132], "194640": [20999], "194641": [22766], "194642": [22478], "194643": [22516], "194644": [22541], "194645": [22411], "194646": [22578], "194647": [22577], "194648": [22700], "194649": [136420], "194650": [22770], "194651": [22775], "194652": [22790], "194653": [22810], "194654": [22818], "194655": [22882], "194656": [136872], "194657": [136938], "194658": [23020], "194659": [23067], "194660": [23079], "194661": [23000], "194662": [23142], "194663": [14062], "194664": [14076], "194665": [23304], "194666": [23358], "194667": [23358], "194668": [137672], "194669": [23491], "194670": [23512], "194671": [23527], "194672": [23539], "194673": [138008], "194674": [23551], "194675": [23558], "194676": [24403], "194677": [23586], "194678": [14209], "194679": [23648], "194680": [23662], "194681": [23744], "194682": [23693], "194683": [138724], "194684": [23875], "194685": [138726], "194686": [23918], "194687": [23915], "194688": [23932], "194689": [24033], "194690": [24034], "194691": [14383], "194692": [24061], "194693": [24104], "194694": [24125], "194695": [24169], "194696": [14434], "194697": [139651], "194698": [14460], "194699": [24240], "194700": [24243], "194701": [24246], "194702": [24266], "194703": [172946], "194704": [24318], "194705": [140081], "194706": [140081], "194707": [33281], "194708": [24354], "194709": [24354], "194710": [14535], "194711": [144056], "194712": [156122], "194713": [24418], "194714": [24427], "194715": [14563], "194716": [24474], "194717": [24525], "194718": [24535], "194719": [24569], "194720": [24705], "194721": [14650], "194722": [14620], "194723": [24724], "194724": [141012], "194725": [24775], "194726": [24904], "194727": [24908], "194728": [24910], "194729": [24908], "194730": [24954], "194731": [24974], "194732": [25010], "194733": [24996], "194734": [25007], "194735": [25054], "194736": [25074], "194737": [25078], "194738": [25104], "194739": [25115], "194740": [25181], "194741": [25265], "194742": [25300], "194743": [25424], "194744": [142092], "194745": [25405], "194746": [25340], "194747": [25448], "194748": [25475], "194749": [25572], "194750": [142321], "194751": [25634], "194752": [25541], "194753": [25513], "194754": [14894], "194755": [25705], "194756": [25726], "194757": [25757], "194758": [25719], "194759": [14956], "194760": [25935], "194761": [25964], "194762": [143370], "194763": [26083], "194764": [26360], "194765": [26185], "194766": [15129], "194767": [26257], "194768": [15112], "194769": [15076], "194770": [20882], "194771": [20885], "194772": [26368], "194773": [26268], "194774": [32941], "194775": [17369], "194776": [26391], "194777": [26395], "194778": [26401], "194779": [26462], "194780": [26451], "194781": [144323], "194782": [15177], "194783": [26618], "194784": [26501], "194785": [26706], "194786": [26757], "194787": [144493], "194788": [26766], "194789": [26655], "194790": [26900], "194791": [15261], "194792": [26946], "194793": [27043], "194794": [27114], "194795": [27304], "194796": [145059], "194797": [27355], "194798": [15384], "194799": [27425], "194800": [145575], "194801": [27476], "194802": [15438], "194803": [27506], "194804": [27551], "194805": [27578], "194806": [27579], "194807": [146061], "194808": [138507], "194809": [146170], "194810": [27726], "194811": [146620], "194812": [27839], "194813": [27853], "194814": [27751], "194815": [27926], "194816": [27966], "194817": [28023], "194818": [27969], "194819": [28009], "194820": [28024], "194821": [28037], "194822": [146718], "194823": [27956], "194824": [28207], "194825": [28270], "194826": [15667], "194827": [28363], "194828": [28359], "194829": [147153], "194830": [28153], "194831": [28526], "194832": [147294], "194833": [147342], "194834": [28614], "194835": [28729], "194836": [28702], "194837": [28699], "194838": [15766], "194839": [28746], "194840": [28797], "194841": [28791], "194842": [28845], "194843": [132389], "194844": [28997], "194845": [148067], "194846": [29084], "194847": [148395], "194848": [29224], "194849": [29237], "194850": [29264], "194851": [149000], "194852": [29312], "194853": [29333], "194854": [149301], "194855": [149524], "194856": [29562], "194857": [29579], "194858": [16044], "194859": [29605], "194860": [16056], "194861": [16056], "194862": [29767], "194863": [29788], "194864": [29809], "194865": [29829], "194866": [29898], "194867": [16155], "194868": [29988], "194869": [150582], "194870": [30014], "194871": [150674], "194872": [30064], "194873": [139679], "194874": [30224], "194875": [151457], "194876": [151480], "194877": [151620], "194878": [16380], "194879": [16392], "194880": [30452], "194881": [151795], "194882": [151794], "194883": [151833], "194884": [151859], "194885": [30494], "194886": [30495], "194887": [30495], "194888": [30538], "194889": [16441], "194890": [30603], "194891": [16454], "194892": [16534], "194893": [152605], "194894": [30798], "194895": [30860], "194896": [30924], "194897": [16611], "194898": [153126], "194899": [31062], "194900": [153242], "194901": [153285], "194902": [31119], "194903": [31211], "194904": [16687], "194905": [31296], "194906": [31306], "194907": [31311], "194908": [153980], "194909": [154279], "194910": [154279], "194911": [31470], "194912": [16898], "194913": [154539], "194914": [31686], "194915": [31689], "194916": [16935], "194917": [154752], "194918": [31954], "194919": [17056], "194920": [31976], "194921": [31971], "194922": [32000], "194923": [155526], "194924": [32099], "194925": [17153], "194926": [32199], "194927": [32258], "194928": [32325], "194929": [17204], "194930": [156200], "194931": [156231], "194932": [17241], "194933": [156377], "194934": [32634], "194935": [156478], "194936": [32661], "194937": [32762], "194938": [32773], "194939": [156890], "194940": [156963], "194941": [32864], "194942": [157096], "194943": [32880], "194944": [144223], "194945": [17365], "194946": [32946], "194947": [33027], "194948": [17419], "194949": [33086], "194950": [23221], "194951": [157607], "194952": [157621], "194953": [144275], "194954": [144284], "194955": [33281], "194956": [33284], "194957": [36766], "194958": [17515], "194959": [33425], "194960": [33419], "194961": [33437], "194962": [21171], "194963": [33457], "194964": [33459], "194965": [33469], "194966": [33510], "194967": [158524], "194968": [33509], "194969": [33565], "194970": [33635], "194971": [33709], "194972": [33571], "194973": [33725], "194974": [33767], "194975": [33879], "194976": [33619], "194977": [33738], "194978": [33740], "194979": [33756], "194980": [158774], "194981": [159083], "194982": [158933], "194983": [17707], "194984": [34033], "194985": [34035], "194986": [34070], "194987": [160714], "194988": [34148], "194989": [159532], "194990": [17757], "194991": [17761], "194992": [159665], "194993": [159954], "194994": [17771], "194995": [34384], "194996": [34396], "194997": [34407], "194998": [34409], "194999": [34473], "195000": [34440], "195001": [34574], "195002": [34530], "195003": [34681], "195004": [34600], "195005": [34667], "195006": [34694], "195007": [17879], "195008": [34785], "195009": [34817], "195010": [17913], "195011": [34912], "195012": [34915], "195013": [161383], "195014": [35031], "195015": [35038], "195016": [17973], "195017": [35066], "195018": [13499], "195019": [161966], "195020": [162150], "195021": [18110], "195022": [18119], "195023": [35488], "195024": [35565], "195025": [35722], "195026": [35925], "195027": [162984], "195028": [36011], "195029": [36033], "195030": [36123], "195031": [36215], "195032": [163631], "195033": [133124], "195034": [36299], "195035": [36284], "195036": [36336], "195037": [133342], "195038": [36564], "195039": [36664], "195040": [165330], "195041": [165357], "195042": [37012], "195043": [37105], "195044": [37137], "195045": [165678], "195046": [37147], "195047": [37432], "195048": [37591], "195049": [37592], "195050": [37500], "195051": [37881], "195052": [37909], "195053": [166906], "195054": [38283], "195055": [18837], "195056": [38327], "195057": [167287], "195058": [18918], "195059": [38595], "195060": [23986], "195061": [38691], "195062": [168261], "195063": [168474], "195064": [19054], "195065": [19062], "195066": [38880], "195067": [168970], "195068": [19122], "195069": [169110], "195070": [38923], "195071": [38923], "195072": [38953], "195073": [169398], "195074": [39138], "195075": [19251], "195076": [39209], "195077": [39335], "195078": [39362], "195079": [39422], "195080": [19406], "195081": [170800], "195082": [39698], "195083": [40000], "195084": [40189], "195085": [19662], "195086": [19693], "195087": [40295], "195088": [172238], "195089": [19704], "195090": [172293], "195091": [172558], "195092": [172689], "195093": [40635], "195094": [19798], "195095": [40697], "195096": [40702], "195097": [40709], "195098": [40719], "195099": [40726], "195100": [40763], "195101": [173568] };
const COMBINING = { "768": 230, "769": 230, "770": 230, "771": 230, "772": 230, "773": 230, "774": 230, "775": 230, "776": 230, "777": 230, "778": 230, "779": 230, "780": 230, "781": 230, "782": 230, "783": 230, "784": 230, "785": 230, "786": 230, "787": 230, "788": 230, "789": 232, "790": 220, "791": 220, "792": 220, "793": 220, "794": 232, "795": 216, "796": 220, "797": 220, "798": 220, "799": 220, "800": 220, "801": 202, "802": 202, "803": 220, "804": 220, "805": 220, "806": 220, "807": 202, "808": 202, "809": 220, "810": 220, "811": 220, "812": 220, "813": 220, "814": 220, "815": 220, "816": 220, "817": 220, "818": 220, "819": 220, "820": 1, "821": 1, "822": 1, "823": 1, "824": 1, "825": 220, "826": 220, "827": 220, "828": 220, "829": 230, "830": 230, "831": 230, "832": 230, "833": 230, "834": 230, "835": 230, "836": 230, "837": 240, "838": 230, "839": 220, "840": 220, "841": 220, "842": 230, "843": 230, "844": 230, "845": 220, "846": 220, "848": 230, "849": 230, "850": 230, "851": 220, "852": 220, "853": 220, "854": 220, "855": 230, "856": 232, "857": 220, "858": 220, "859": 230, "860": 233, "861": 234, "862": 234, "863": 233, "864": 234, "865": 234, "866": 233, "867": 230, "868": 230, "869": 230, "870": 230, "871": 230, "872": 230, "873": 230, "874": 230, "875": 230, "876": 230, "877": 230, "878": 230, "879": 230, "1155": 230, "1156": 230, "1157": 230, "1158": 230, "1159": 230, "1425": 220, "1426": 230, "1427": 230, "1428": 230, "1429": 230, "1430": 220, "1431": 230, "1432": 230, "1433": 230, "1434": 222, "1435": 220, "1436": 230, "1437": 230, "1438": 230, "1439": 230, "1440": 230, "1441": 230, "1442": 220, "1443": 220, "1444": 220, "1445": 220, "1446": 220, "1447": 220, "1448": 230, "1449": 230, "1450": 220, "1451": 230, "1452": 230, "1453": 222, "1454": 228, "1455": 230, "1456": 10, "1457": 11, "1458": 12, "1459": 13, "1460": 14, "1461": 15, "1462": 16, "1463": 17, "1464": 18, "1465": 19, "1466": 19, "1467": 20, "1468": 21, "1469": 22, "1471": 23, "1473": 24, "1474": 25, "1476": 230, "1477": 220, "1479": 18, "1552": 230, "1553": 230, "1554": 230, "1555": 230, "1556": 230, "1557": 230, "1558": 230, "1559": 230, "1560": 30, "1561": 31, "1562": 32, "1611": 27, "1612": 28, "1613": 29, "1614": 30, "1615": 31, "1616": 32, "1617": 33, "1618": 34, "1619": 230, "1620": 230, "1621": 220, "1622": 220, "1623": 230, "1624": 230, "1625": 230, "1626": 230, "1627": 230, "1628": 220, "1629": 230, "1630": 230, "1631": 220, "1648": 35, "1750": 230, "1751": 230, "1752": 230, "1753": 230, "1754": 230, "1755": 230, "1756": 230, "1759": 230, "1760": 230, "1761": 230, "1762": 230, "1763": 220, "1764": 230, "1767": 230, "1768": 230, "1770": 220, "1771": 230, "1772": 230, "1773": 220, "1809": 36, "1840": 230, "1841": 220, "1842": 230, "1843": 230, "1844": 220, "1845": 230, "1846": 230, "1847": 220, "1848": 220, "1849": 220, "1850": 230, "1851": 220, "1852": 220, "1853": 230, "1854": 220, "1855": 230, "1856": 230, "1857": 230, "1858": 220, "1859": 230, "1860": 220, "1861": 230, "1862": 220, "1863": 230, "1864": 220, "1865": 230, "1866": 230, "2027": 230, "2028": 230, "2029": 230, "2030": 230, "2031": 230, "2032": 230, "2033": 230, "2034": 220, "2035": 230, "2045": 220, "2070": 230, "2071": 230, "2072": 230, "2073": 230, "2075": 230, "2076": 230, "2077": 230, "2078": 230, "2079": 230, "2080": 230, "2081": 230, "2082": 230, "2083": 230, "2085": 230, "2086": 230, "2087": 230, "2089": 230, "2090": 230, "2091": 230, "2092": 230, "2093": 230, "2137": 220, "2138": 220, "2139": 220, "2199": 230, "2200": 230, "2201": 220, "2202": 220, "2203": 220, "2204": 230, "2205": 230, "2206": 230, "2207": 230, "2250": 230, "2251": 230, "2252": 230, "2253": 230, "2254": 230, "2255": 220, "2256": 220, "2257": 220, "2258": 220, "2259": 220, "2260": 230, "2261": 230, "2262": 230, "2263": 230, "2264": 230, "2265": 230, "2266": 230, "2267": 230, "2268": 230, "2269": 230, "2270": 230, "2271": 230, "2272": 230, "2273": 230, "2275": 220, "2276": 230, "2277": 230, "2278": 220, "2279": 230, "2280": 230, "2281": 220, "2282": 230, "2283": 230, "2284": 230, "2285": 220, "2286": 220, "2287": 220, "2288": 27, "2289": 28, "2290": 29, "2291": 230, "2292": 230, "2293": 230, "2294": 220, "2295": 230, "2296": 230, "2297": 220, "2298": 220, "2299": 230, "2300": 230, "2301": 230, "2302": 230, "2303": 230, "2364": 7, "2381": 9, "2385": 230, "2386": 220, "2387": 230, "2388": 230, "2492": 7, "2509": 9, "2558": 230, "2620": 7, "2637": 9, "2748": 7, "2765": 9, "2876": 7, "2893": 9, "3021": 9, "3132": 7, "3149": 9, "3157": 84, "3158": 91, "3260": 7, "3277": 9, "3387": 9, "3388": 9, "3405": 9, "3530": 9, "3640": 103, "3641": 103, "3642": 9, "3656": 107, "3657": 107, "3658": 107, "3659": 107, "3768": 118, "3769": 118, "3770": 9, "3784": 122, "3785": 122, "3786": 122, "3787": 122, "3864": 220, "3865": 220, "3893": 220, "3895": 220, "3897": 216, "3953": 129, "3954": 130, "3956": 132, "3962": 130, "3963": 130, "3964": 130, "3965": 130, "3968": 130, "3970": 230, "3971": 230, "3972": 9, "3974": 230, "3975": 230, "4038": 220, "4151": 7, "4153": 9, "4154": 9, "4237": 220, "4957": 230, "4958": 230, "4959": 230, "5908": 9, "5909": 9, "5940": 9, "6098": 9, "6109": 230, "6313": 228, "6457": 222, "6458": 230, "6459": 220, "6679": 230, "6680": 220, "6752": 9, "6773": 230, "6774": 230, "6775": 230, "6776": 230, "6777": 230, "6778": 230, "6779": 230, "6780": 230, "6783": 220, "6832": 230, "6833": 230, "6834": 230, "6835": 230, "6836": 230, "6837": 220, "6838": 220, "6839": 220, "6840": 220, "6841": 220, "6842": 220, "6843": 230, "6844": 230, "6845": 220, "6847": 220, "6848": 220, "6849": 230, "6850": 230, "6851": 220, "6852": 220, "6853": 230, "6854": 230, "6855": 230, "6856": 230, "6857": 230, "6858": 220, "6859": 230, "6860": 230, "6861": 230, "6862": 230, "6863": 230, "6864": 230, "6865": 230, "6866": 230, "6867": 230, "6868": 230, "6869": 230, "6870": 230, "6871": 230, "6872": 230, "6873": 230, "6874": 230, "6875": 230, "6876": 230, "6877": 220, "6880": 230, "6881": 230, "6882": 230, "6883": 230, "6884": 230, "6885": 230, "6886": 220, "6887": 230, "6888": 230, "6889": 230, "6890": 230, "6891": 234, "6964": 7, "6980": 9, "7019": 230, "7020": 220, "7021": 230, "7022": 230, "7023": 230, "7024": 230, "7025": 230, "7026": 230, "7027": 230, "7082": 9, "7083": 9, "7142": 7, "7154": 9, "7155": 9, "7223": 7, "7376": 230, "7377": 230, "7378": 230, "7380": 1, "7381": 220, "7382": 220, "7383": 220, "7384": 220, "7385": 220, "7386": 230, "7387": 230, "7388": 220, "7389": 220, "7390": 220, "7391": 220, "7392": 230, "7394": 1, "7395": 1, "7396": 1, "7397": 1, "7398": 1, "7399": 1, "7400": 1, "7405": 220, "7412": 230, "7416": 230, "7417": 230, "7616": 230, "7617": 230, "7618": 220, "7619": 230, "7620": 230, "7621": 230, "7622": 230, "7623": 230, "7624": 230, "7625": 230, "7626": 220, "7627": 230, "7628": 230, "7629": 234, "7630": 214, "7631": 220, "7632": 202, "7633": 230, "7634": 230, "7635": 230, "7636": 230, "7637": 230, "7638": 230, "7639": 230, "7640": 230, "7641": 230, "7642": 230, "7643": 230, "7644": 230, "7645": 230, "7646": 230, "7647": 230, "7648": 230, "7649": 230, "7650": 230, "7651": 230, "7652": 230, "7653": 230, "7654": 230, "7655": 230, "7656": 230, "7657": 230, "7658": 230, "7659": 230, "7660": 230, "7661": 230, "7662": 230, "7663": 230, "7664": 230, "7665": 230, "7666": 230, "7667": 230, "7668": 230, "7669": 230, "7670": 232, "7671": 228, "7672": 228, "7673": 220, "7674": 218, "7675": 230, "7676": 233, "7677": 220, "7678": 230, "7679": 220, "8400": 230, "8401": 230, "8402": 1, "8403": 1, "8404": 230, "8405": 230, "8406": 230, "8407": 230, "8408": 1, "8409": 1, "8410": 1, "8411": 230, "8412": 230, "8417": 230, "8421": 1, "8422": 1, "8423": 230, "8424": 220, "8425": 230, "8426": 1, "8427": 1, "8428": 220, "8429": 220, "8430": 220, "8431": 220, "8432": 230, "11503": 230, "11504": 230, "11505": 230, "11647": 9, "11744": 230, "11745": 230, "11746": 230, "11747": 230, "11748": 230, "11749": 230, "11750": 230, "11751": 230, "11752": 230, "11753": 230, "11754": 230, "11755": 230, "11756": 230, "11757": 230, "11758": 230, "11759": 230, "11760": 230, "11761": 230, "11762": 230, "11763": 230, "11764": 230, "11765": 230, "11766": 230, "11767": 230, "11768": 230, "11769": 230, "11770": 230, "11771": 230, "11772": 230, "11773": 230, "11774": 230, "11775": 230, "12330": 218, "12331": 228, "12332": 232, "12333": 222, "12334": 224, "12335": 224, "12441": 8, "12442": 8, "42607": 230, "42612": 230, "42613": 230, "42614": 230, "42615": 230, "42616": 230, "42617": 230, "42618": 230, "42619": 230, "42620": 230, "42621": 230, "42654": 230, "42655": 230, "42736": 230, "42737": 230, "43014": 9, "43052": 9, "43204": 9, "43232": 230, "43233": 230, "43234": 230, "43235": 230, "43236": 230, "43237": 230, "43238": 230, "43239": 230, "43240": 230, "43241": 230, "43242": 230, "43243": 230, "43244": 230, "43245": 230, "43246": 230, "43247": 230, "43248": 230, "43249": 230, "43307": 220, "43308": 220, "43309": 220, "43347": 9, "43443": 7, "43456": 9, "43696": 230, "43698": 230, "43699": 230, "43700": 220, "43703": 230, "43704": 230, "43710": 230, "43711": 230, "43713": 230, "43766": 9, "44013": 9, "64286": 26, "65056": 230, "65057": 230, "65058": 230, "65059": 230, "65060": 230, "65061": 230, "65062": 230, "65063": 220, "65064": 220, "65065": 220, "65066": 220, "65067": 220, "65068": 220, "65069": 220, "65070": 230, "65071": 230, "66045": 220, "66272": 220, "66422": 230, "66423": 230, "66424": 230, "66425": 230, "66426": 230, "68109": 220, "68111": 230, "68152": 230, "68153": 1, "68154": 220, "68159": 9, "68325": 230, "68326": 220, "68900": 230, "68901": 230, "68902": 230, "68903": 230, "68969": 230, "68970": 230, "68971": 230, "68972": 230, "68973": 230, "69291": 230, "69292": 230, "69370": 220, "69371": 220, "69373": 220, "69374": 220, "69375": 220, "69446": 220, "69447": 220, "69448": 230, "69449": 230, "69450": 230, "69451": 220, "69452": 230, "69453": 220, "69454": 220, "69455": 220, "69456": 220, "69506": 230, "69507": 220, "69508": 230, "69509": 220, "69702": 9, "69744": 9, "69759": 9, "69817": 9, "69818": 7, "69888": 230, "69889": 230, "69890": 230, "69939": 9, "69940": 9, "70003": 7, "70080": 9, "70090": 7, "70197": 9, "70198": 7, "70377": 7, "70378": 9, "70459": 7, "70460": 7, "70477": 9, "70502": 230, "70503": 230, "70504": 230, "70505": 230, "70506": 230, "70507": 230, "70508": 230, "70512": 230, "70513": 230, "70514": 230, "70515": 230, "70516": 230, "70606": 9, "70607": 9, "70608": 9, "70722": 9, "70726": 7, "70750": 230, "70850": 9, "70851": 7, "71103": 9, "71104": 7, "71231": 9, "71350": 9, "71351": 7, "71467": 9, "71737": 9, "71738": 7, "71997": 9, "71998": 9, "72003": 7, "72160": 9, "72244": 9, "72263": 9, "72345": 9, "72767": 9, "73026": 7, "73028": 9, "73029": 9, "73111": 9, "73537": 9, "73538": 9, "90415": 9, "92912": 1, "92913": 1, "92914": 1, "92915": 1, "92916": 1, "92976": 230, "92977": 230, "92978": 230, "92979": 230, "92980": 230, "92981": 230, "92982": 230, "94192": 6, "94193": 6, "113822": 1, "119141": 216, "119142": 216, "119143": 1, "119144": 1, "119145": 1, "119149": 226, "119150": 216, "119151": 216, "119152": 216, "119153": 216, "119154": 216, "119163": 220, "119164": 220, "119165": 220, "119166": 220, "119167": 220, "119168": 220, "119169": 220, "119170": 220, "119173": 230, "119174": 230, "119175": 230, "119176": 230, "119177": 230, "119178": 220, "119179": 220, "119210": 230, "119211": 230, "119212": 230, "119213": 230, "119362": 230, "119363": 230, "119364": 230, "122880": 230, "122881": 230, "122882": 230, "122883": 230, "122884": 230, "122885": 230, "122886": 230, "122888": 230, "122889": 230, "122890": 230, "122891": 230, "122892": 230, "122893": 230, "122894": 230, "122895": 230, "122896": 230, "122897": 230, "122898": 230, "122899": 230, "122900": 230, "122901": 230, "122902": 230, "122903": 230, "122904": 230, "122907": 230, "122908": 230, "122909": 230, "122910": 230, "122911": 230, "122912": 230, "122913": 230, "122915": 230, "122916": 230, "122918": 230, "122919": 230, "122920": 230, "122921": 230, "122922": 230, "123023": 230, "123184": 230, "123185": 230, "123186": 230, "123187": 230, "123188": 230, "123189": 230, "123190": 230, "123566": 230, "123628": 230, "123629": 230, "123630": 230, "123631": 230, "124140": 232, "124141": 232, "124142": 220, "124143": 230, "124398": 230, "124399": 220, "124643": 230, "124646": 230, "124654": 230, "124655": 230, "124661": 230, "125136": 220, "125137": 220, "125138": 220, "125139": 220, "125140": 220, "125141": 220, "125142": 220, "125252": 230, "125253": 230, "125254": 230, "125255": 230, "125256": 230, "125257": 230, "125258": 7 };
const COMPOSITION = { "65,768": 192, "65,769": 193, "65,770": 194, "65,771": 195, "65,776": 196, "65,778": 197, "67,807": 199, "69,768": 200, "69,769": 201, "69,770": 202, "69,776": 203, "73,768": 204, "73,769": 205, "73,770": 206, "73,776": 207, "78,771": 209, "79,768": 210, "79,769": 211, "79,770": 212, "79,771": 213, "79,776": 214, "85,768": 217, "85,769": 218, "85,770": 219, "85,776": 220, "89,769": 221, "97,768": 224, "97,769": 225, "97,770": 226, "97,771": 227, "97,776": 228, "97,778": 229, "99,807": 231, "101,768": 232, "101,769": 233, "101,770": 234, "101,776": 235, "105,768": 236, "105,769": 237, "105,770": 238, "105,776": 239, "110,771": 241, "111,768": 242, "111,769": 243, "111,770": 244, "111,771": 245, "111,776": 246, "117,768": 249, "117,769": 250, "117,770": 251, "117,776": 252, "121,769": 253, "121,776": 255, "65,772": 256, "97,772": 257, "65,774": 258, "97,774": 259, "65,808": 260, "97,808": 261, "67,769": 262, "99,769": 263, "67,770": 264, "99,770": 265, "67,775": 266, "99,775": 267, "67,780": 268, "99,780": 269, "68,780": 270, "100,780": 271, "69,772": 274, "101,772": 275, "69,774": 276, "101,774": 277, "69,775": 278, "101,775": 279, "69,808": 280, "101,808": 281, "69,780": 282, "101,780": 283, "71,770": 284, "103,770": 285, "71,774": 286, "103,774": 287, "71,775": 288, "103,775": 289, "71,807": 290, "103,807": 291, "72,770": 292, "104,770": 293, "73,771": 296, "105,771": 297, "73,772": 298, "105,772": 299, "73,774": 300, "105,774": 301, "73,808": 302, "105,808": 303, "73,775": 304, "74,770": 308, "106,770": 309, "75,807": 310, "107,807": 311, "76,769": 313, "108,769": 314, "76,807": 315, "108,807": 316, "76,780": 317, "108,780": 318, "78,769": 323, "110,769": 324, "78,807": 325, "110,807": 326, "78,780": 327, "110,780": 328, "79,772": 332, "111,772": 333, "79,774": 334, "111,774": 335, "79,779": 336, "111,779": 337, "82,769": 340, "114,769": 341, "82,807": 342, "114,807": 343, "82,780": 344, "114,780": 345, "83,769": 346, "115,769": 347, "83,770": 348, "115,770": 349, "83,807": 350, "115,807": 351, "83,780": 352, "115,780": 353, "84,807": 354, "116,807": 355, "84,780": 356, "116,780": 357, "85,771": 360, "117,771": 361, "85,772": 362, "117,772": 363, "85,774": 364, "117,774": 365, "85,778": 366, "117,778": 367, "85,779": 368, "117,779": 369, "85,808": 370, "117,808": 371, "87,770": 372, "119,770": 373, "89,770": 374, "121,770": 375, "89,776": 376, "90,769": 377, "122,769": 378, "90,775": 379, "122,775": 380, "90,780": 381, "122,780": 382, "79,795": 416, "111,795": 417, "85,795": 431, "117,795": 432, "65,780": 461, "97,780": 462, "73,780": 463, "105,780": 464, "79,780": 465, "111,780": 466, "85,780": 467, "117,780": 468, "220,772": 469, "252,772": 470, "220,769": 471, "252,769": 472, "220,780": 473, "252,780": 474, "220,768": 475, "252,768": 476, "196,772": 478, "228,772": 479, "550,772": 480, "551,772": 481, "198,772": 482, "230,772": 483, "71,780": 486, "103,780": 487, "75,780": 488, "107,780": 489, "79,808": 490, "111,808": 491, "490,772": 492, "491,772": 493, "439,780": 494, "658,780": 495, "106,780": 496, "71,769": 500, "103,769": 501, "78,768": 504, "110,768": 505, "197,769": 506, "229,769": 507, "198,769": 508, "230,769": 509, "216,769": 510, "248,769": 511, "65,783": 512, "97,783": 513, "65,785": 514, "97,785": 515, "69,783": 516, "101,783": 517, "69,785": 518, "101,785": 519, "73,783": 520, "105,783": 521, "73,785": 522, "105,785": 523, "79,783": 524, "111,783": 525, "79,785": 526, "111,785": 527, "82,783": 528, "114,783": 529, "82,785": 530, "114,785": 531, "85,783": 532, "117,783": 533, "85,785": 534, "117,785": 535, "83,806": 536, "115,806": 537, "84,806": 538, "116,806": 539, "72,780": 542, "104,780": 543, "65,775": 550, "97,775": 551, "69,807": 552, "101,807": 553, "214,772": 554, "246,772": 555, "213,772": 556, "245,772": 557, "79,775": 558, "111,775": 559, "558,772": 560, "559,772": 561, "89,772": 562, "121,772": 563, "168,769": 901, "913,769": 902, "917,769": 904, "919,769": 905, "921,769": 906, "927,769": 908, "933,769": 910, "937,769": 911, "970,769": 912, "921,776": 938, "933,776": 939, "945,769": 940, "949,769": 941, "951,769": 942, "953,769": 943, "971,769": 944, "953,776": 970, "965,776": 971, "959,769": 972, "965,769": 973, "969,769": 974, "978,769": 979, "978,776": 980, "1045,768": 1024, "1045,776": 1025, "1043,769": 1027, "1030,776": 1031, "1050,769": 1036, "1048,768": 1037, "1059,774": 1038, "1048,774": 1049, "1080,774": 1081, "1077,768": 1104, "1077,776": 1105, "1075,769": 1107, "1110,776": 1111, "1082,769": 1116, "1080,768": 1117, "1091,774": 1118, "1140,783": 1142, "1141,783": 1143, "1046,774": 1217, "1078,774": 1218, "1040,774": 1232, "1072,774": 1233, "1040,776": 1234, "1072,776": 1235, "1045,774": 1238, "1077,774": 1239, "1240,776": 1242, "1241,776": 1243, "1046,776": 1244, "1078,776": 1245, "1047,776": 1246, "1079,776": 1247, "1048,772": 1250, "1080,772": 1251, "1048,776": 1252, "1080,776": 1253, "1054,776": 1254, "1086,776": 1255, "1256,776": 1258, "1257,776": 1259, "1069,776": 1260, "1101,776": 1261, "1059,772": 1262, "1091,772": 1263, "1059,776": 1264, "1091,776": 1265, "1059,779": 1266, "1091,779": 1267, "1063,776": 1268, "1095,776": 1269, "1067,776": 1272, "1099,776": 1273, "1575,1619": 1570, "1575,1620": 1571, "1608,1620": 1572, "1575,1621": 1573, "1610,1620": 1574, "1749,1620": 1728, "1729,1620": 1730, "1746,1620": 1747, "2344,2364": 2345, "2352,2364": 2353, "2355,2364": 2356, "2503,2494": 2507, "2503,2519": 2508, "2887,2902": 2888, "2887,2878": 2891, "2887,2903": 2892, "2962,3031": 2964, "3014,3006": 3018, "3015,3006": 3019, "3014,3031": 3020, "3142,3158": 3144, "3263,3285": 3264, "3270,3285": 3271, "3270,3286": 3272, "3270,3266": 3274, "3274,3285": 3275, "3398,3390": 3402, "3399,3390": 3403, "3398,3415": 3404, "3545,3530": 3546, "3545,3535": 3548, "3548,3530": 3549, "3545,3551": 3550, "4133,4142": 4134, "6917,6965": 6918, "6919,6965": 6920, "6921,6965": 6922, "6923,6965": 6924, "6925,6965": 6926, "6929,6965": 6930, "6970,6965": 6971, "6972,6965": 6973, "6974,6965": 6976, "6975,6965": 6977, "6978,6965": 6979, "65,805": 7680, "97,805": 7681, "66,775": 7682, "98,775": 7683, "66,803": 7684, "98,803": 7685, "66,817": 7686, "98,817": 7687, "199,769": 7688, "231,769": 7689, "68,775": 7690, "100,775": 7691, "68,803": 7692, "100,803": 7693, "68,817": 7694, "100,817": 7695, "68,807": 7696, "100,807": 7697, "68,813": 7698, "100,813": 7699, "274,768": 7700, "275,768": 7701, "274,769": 7702, "275,769": 7703, "69,813": 7704, "101,813": 7705, "69,816": 7706, "101,816": 7707, "552,774": 7708, "553,774": 7709, "70,775": 7710, "102,775": 7711, "71,772": 7712, "103,772": 7713, "72,775": 7714, "104,775": 7715, "72,803": 7716, "104,803": 7717, "72,776": 7718, "104,776": 7719, "72,807": 7720, "104,807": 7721, "72,814": 7722, "104,814": 7723, "73,816": 7724, "105,816": 7725, "207,769": 7726, "239,769": 7727, "75,769": 7728, "107,769": 7729, "75,803": 7730, "107,803": 7731, "75,817": 7732, "107,817": 7733, "76,803": 7734, "108,803": 7735, "7734,772": 7736, "7735,772": 7737, "76,817": 7738, "108,817": 7739, "76,813": 7740, "108,813": 7741, "77,769": 7742, "109,769": 7743, "77,775": 7744, "109,775": 7745, "77,803": 7746, "109,803": 7747, "78,775": 7748, "110,775": 7749, "78,803": 7750, "110,803": 7751, "78,817": 7752, "110,817": 7753, "78,813": 7754, "110,813": 7755, "213,769": 7756, "245,769": 7757, "213,776": 7758, "245,776": 7759, "332,768": 7760, "333,768": 7761, "332,769": 7762, "333,769": 7763, "80,769": 7764, "112,769": 7765, "80,775": 7766, "112,775": 7767, "82,775": 7768, "114,775": 7769, "82,803": 7770, "114,803": 7771, "7770,772": 7772, "7771,772": 7773, "82,817": 7774, "114,817": 7775, "83,775": 7776, "115,775": 7777, "83,803": 7778, "115,803": 7779, "346,775": 7780, "347,775": 7781, "352,775": 7782, "353,775": 7783, "7778,775": 7784, "7779,775": 7785, "84,775": 7786, "116,775": 7787, "84,803": 7788, "116,803": 7789, "84,817": 7790, "116,817": 7791, "84,813": 7792, "116,813": 7793, "85,804": 7794, "117,804": 7795, "85,816": 7796, "117,816": 7797, "85,813": 7798, "117,813": 7799, "360,769": 7800, "361,769": 7801, "362,776": 7802, "363,776": 7803, "86,771": 7804, "118,771": 7805, "86,803": 7806, "118,803": 7807, "87,768": 7808, "119,768": 7809, "87,769": 7810, "119,769": 7811, "87,776": 7812, "119,776": 7813, "87,775": 7814, "119,775": 7815, "87,803": 7816, "119,803": 7817, "88,775": 7818, "120,775": 7819, "88,776": 7820, "120,776": 7821, "89,775": 7822, "121,775": 7823, "90,770": 7824, "122,770": 7825, "90,803": 7826, "122,803": 7827, "90,817": 7828, "122,817": 7829, "104,817": 7830, "116,776": 7831, "119,778": 7832, "121,778": 7833, "383,775": 7835, "65,803": 7840, "97,803": 7841, "65,777": 7842, "97,777": 7843, "194,769": 7844, "226,769": 7845, "194,768": 7846, "226,768": 7847, "194,777": 7848, "226,777": 7849, "194,771": 7850, "226,771": 7851, "7840,770": 7852, "7841,770": 7853, "258,769": 7854, "259,769": 7855, "258,768": 7856, "259,768": 7857, "258,777": 7858, "259,777": 7859, "258,771": 7860, "259,771": 7861, "7840,774": 7862, "7841,774": 7863, "69,803": 7864, "101,803": 7865, "69,777": 7866, "101,777": 7867, "69,771": 7868, "101,771": 7869, "202,769": 7870, "234,769": 7871, "202,768": 7872, "234,768": 7873, "202,777": 7874, "234,777": 7875, "202,771": 7876, "234,771": 7877, "7864,770": 7878, "7865,770": 7879, "73,777": 7880, "105,777": 7881, "73,803": 7882, "105,803": 7883, "79,803": 7884, "111,803": 7885, "79,777": 7886, "111,777": 7887, "212,769": 7888, "244,769": 7889, "212,768": 7890, "244,768": 7891, "212,777": 7892, "244,777": 7893, "212,771": 7894, "244,771": 7895, "7884,770": 7896, "7885,770": 7897, "416,769": 7898, "417,769": 7899, "416,768": 7900, "417,768": 7901, "416,777": 7902, "417,777": 7903, "416,771": 7904, "417,771": 7905, "416,803": 7906, "417,803": 7907, "85,803": 7908, "117,803": 7909, "85,777": 7910, "117,777": 7911, "431,769": 7912, "432,769": 7913, "431,768": 7914, "432,768": 7915, "431,777": 7916, "432,777": 7917, "431,771": 7918, "432,771": 7919, "431,803": 7920, "432,803": 7921, "89,768": 7922, "121,768": 7923, "89,803": 7924, "121,803": 7925, "89,777": 7926, "121,777": 7927, "89,771": 7928, "121,771": 7929, "945,787": 7936, "945,788": 7937, "7936,768": 7938, "7937,768": 7939, "7936,769": 7940, "7937,769": 7941, "7936,834": 7942, "7937,834": 7943, "913,787": 7944, "913,788": 7945, "7944,768": 7946, "7945,768": 7947, "7944,769": 7948, "7945,769": 7949, "7944,834": 7950, "7945,834": 7951, "949,787": 7952, "949,788": 7953, "7952,768": 7954, "7953,768": 7955, "7952,769": 7956, "7953,769": 7957, "917,787": 7960, "917,788": 7961, "7960,768": 7962, "7961,768": 7963, "7960,769": 7964, "7961,769": 7965, "951,787": 7968, "951,788": 7969, "7968,768": 7970, "7969,768": 7971, "7968,769": 7972, "7969,769": 7973, "7968,834": 7974, "7969,834": 7975, "919,787": 7976, "919,788": 7977, "7976,768": 7978, "7977,768": 7979, "7976,769": 7980, "7977,769": 7981, "7976,834": 7982, "7977,834": 7983, "953,787": 7984, "953,788": 7985, "7984,768": 7986, "7985,768": 7987, "7984,769": 7988, "7985,769": 7989, "7984,834": 7990, "7985,834": 7991, "921,787": 7992, "921,788": 7993, "7992,768": 7994, "7993,768": 7995, "7992,769": 7996, "7993,769": 7997, "7992,834": 7998, "7993,834": 7999, "959,787": 8000, "959,788": 8001, "8000,768": 8002, "8001,768": 8003, "8000,769": 8004, "8001,769": 8005, "927,787": 8008, "927,788": 8009, "8008,768": 8010, "8009,768": 8011, "8008,769": 8012, "8009,769": 8013, "965,787": 8016, "965,788": 8017, "8016,768": 8018, "8017,768": 8019, "8016,769": 8020, "8017,769": 8021, "8016,834": 8022, "8017,834": 8023, "933,788": 8025, "8025,768": 8027, "8025,769": 8029, "8025,834": 8031, "969,787": 8032, "969,788": 8033, "8032,768": 8034, "8033,768": 8035, "8032,769": 8036, "8033,769": 8037, "8032,834": 8038, "8033,834": 8039, "937,787": 8040, "937,788": 8041, "8040,768": 8042, "8041,768": 8043, "8040,769": 8044, "8041,769": 8045, "8040,834": 8046, "8041,834": 8047, "945,768": 8048, "949,768": 8050, "951,768": 8052, "953,768": 8054, "959,768": 8056, "965,768": 8058, "969,768": 8060, "7936,837": 8064, "7937,837": 8065, "7938,837": 8066, "7939,837": 8067, "7940,837": 8068, "7941,837": 8069, "7942,837": 8070, "7943,837": 8071, "7944,837": 8072, "7945,837": 8073, "7946,837": 8074, "7947,837": 8075, "7948,837": 8076, "7949,837": 8077, "7950,837": 8078, "7951,837": 8079, "7968,837": 8080, "7969,837": 8081, "7970,837": 8082, "7971,837": 8083, "7972,837": 8084, "7973,837": 8085, "7974,837": 8086, "7975,837": 8087, "7976,837": 8088, "7977,837": 8089, "7978,837": 8090, "7979,837": 8091, "7980,837": 8092, "7981,837": 8093, "7982,837": 8094, "7983,837": 8095, "8032,837": 8096, "8033,837": 8097, "8034,837": 8098, "8035,837": 8099, "8036,837": 8100, "8037,837": 8101, "8038,837": 8102, "8039,837": 8103, "8040,837": 8104, "8041,837": 8105, "8042,837": 8106, "8043,837": 8107, "8044,837": 8108, "8045,837": 8109, "8046,837": 8110, "8047,837": 8111, "945,774": 8112, "945,772": 8113, "8048,837": 8114, "945,837": 8115, "940,837": 8116, "945,834": 8118, "8118,837": 8119, "913,774": 8120, "913,772": 8121, "913,768": 8122, "913,837": 8124, "168,834": 8129, "8052,837": 8130, "951,837": 8131, "942,837": 8132, "951,834": 8134, "8134,837": 8135, "917,768": 8136, "919,768": 8138, "919,837": 8140, "8127,768": 8141, "8127,769": 8142, "8127,834": 8143, "953,774": 8144, "953,772": 8145, "970,768": 8146, "953,834": 8150, "970,834": 8151, "921,774": 8152, "921,772": 8153, "921,768": 8154, "8190,768": 8157, "8190,769": 8158, "8190,834": 8159, "965,774": 8160, "965,772": 8161, "971,768": 8162, "961,787": 8164, "961,788": 8165, "965,834": 8166, "971,834": 8167, "933,774": 8168, "933,772": 8169, "933,768": 8170, "929,788": 8172, "168,768": 8173, "8060,837": 8178, "969,837": 8179, "974,837": 8180, "969,834": 8182, "8182,837": 8183, "927,768": 8184, "937,768": 8186, "937,837": 8188, "8592,824": 8602, "8594,824": 8603, "8596,824": 8622, "8656,824": 8653, "8660,824": 8654, "8658,824": 8655, "8707,824": 8708, "8712,824": 8713, "8715,824": 8716, "8739,824": 8740, "8741,824": 8742, "8764,824": 8769, "8771,824": 8772, "8773,824": 8775, "8776,824": 8777, "61,824": 8800, "8801,824": 8802, "8781,824": 8813, "60,824": 8814, "62,824": 8815, "8804,824": 8816, "8805,824": 8817, "8818,824": 8820, "8819,824": 8821, "8822,824": 8824, "8823,824": 8825, "8826,824": 8832, "8827,824": 8833, "8834,824": 8836, "8835,824": 8837, "8838,824": 8840, "8839,824": 8841, "8866,824": 8876, "8872,824": 8877, "8873,824": 8878, "8875,824": 8879, "8828,824": 8928, "8829,824": 8929, "8849,824": 8930, "8850,824": 8931, "8882,824": 8938, "8883,824": 8939, "8884,824": 8940, "8885,824": 8941, "12363,12441": 12364, "12365,12441": 12366, "12367,12441": 12368, "12369,12441": 12370, "12371,12441": 12372, "12373,12441": 12374, "12375,12441": 12376, "12377,12441": 12378, "12379,12441": 12380, "12381,12441": 12382, "12383,12441": 12384, "12385,12441": 12386, "12388,12441": 12389, "12390,12441": 12391, "12392,12441": 12393, "12399,12441": 12400, "12399,12442": 12401, "12402,12441": 12403, "12402,12442": 12404, "12405,12441": 12406, "12405,12442": 12407, "12408,12441": 12409, "12408,12442": 12410, "12411,12441": 12412, "12411,12442": 12413, "12358,12441": 12436, "12445,12441": 12446, "12459,12441": 12460, "12461,12441": 12462, "12463,12441": 12464, "12465,12441": 12466, "12467,12441": 12468, "12469,12441": 12470, "12471,12441": 12472, "12473,12441": 12474, "12475,12441": 12476, "12477,12441": 12478, "12479,12441": 12480, "12481,12441": 12482, "12484,12441": 12485, "12486,12441": 12487, "12488,12441": 12489, "12495,12441": 12496, "12495,12442": 12497, "12498,12441": 12499, "12498,12442": 12500, "12501,12441": 12502, "12501,12442": 12503, "12504,12441": 12505, "12504,12442": 12506, "12507,12441": 12508, "12507,12442": 12509, "12454,12441": 12532, "12527,12441": 12535, "12528,12441": 12536, "12529,12441": 12537, "12530,12441": 12538, "12541,12441": 12542, "67026,775": 67017, "67034,775": 67044, "69785,69818": 69786, "69787,69818": 69788, "69797,69818": 69803, "69937,69927": 69934, "69938,69927": 69935, "70471,70462": 70475, "70471,70487": 70476, "70530,70601": 70531, "70532,70587": 70533, "70539,70594": 70542, "70544,70601": 70545, "70594,70594": 70597, "70594,70584": 70599, "70594,70601": 70600, "70841,70842": 70843, "70841,70832": 70844, "70841,70845": 70846, "71096,71087": 71098, "71097,71087": 71099, "71989,71984": 71992, "90398,90398": 90401, "90398,90409": 90402, "90398,90399": 90403, "90409,90399": 90404, "90398,90400": 90405, "90401,90399": 90406, "90402,90399": 90407, "90401,90400": 90408, "93543,93543": 93544, "93539,93543": 93545, "93545,93543": 93546 };


/***/ },

/***/ "./src/domain/unicode-normalization.ts"
/*!*********************************************!*\
  !*** ./src/domain/unicode-normalization.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unicode17NFC: () => (/* binding */ unicode17NFC),
/* harmony export */   unicode17NFD: () => (/* binding */ unicode17NFD)
/* harmony export */ });
/* harmony import */ var _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unicode-normalization-data */ "./src/domain/unicode-normalization-data.ts");

const S_BASE = 0xac00, L_BASE = 0x1100, V_BASE = 0x1161, T_BASE = 0x11a7, L_COUNT = 19, V_COUNT = 21, T_COUNT = 28, N_COUNT = V_COUNT * T_COUNT, S_COUNT = L_COUNT * N_COUNT;
const ccc = (cp) => _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__.COMBINING[String(cp)] ?? 0;
function decompose(cp, result) {
    const syllable = cp - S_BASE;
    if (syllable >= 0 && syllable < S_COUNT) {
        result.push(L_BASE + Math.floor(syllable / N_COUNT), V_BASE + Math.floor((syllable % N_COUNT) / T_COUNT));
        const tail = syllable % T_COUNT;
        if (tail)
            result.push(T_BASE + tail);
        return;
    }
    const mapping = _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__.DECOMPOSITION[String(cp)];
    if (mapping)
        for (const value of mapping)
            decompose(value, result);
    else
        result.push(cp);
}
function decomposed(text) {
    if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(text))
        throw new Error('Malformed Unicode scalar text.');
    const raw = [];
    for (const char of text)
        decompose(char.codePointAt(0), raw);
    const result = [], marks = [];
    const flush = () => { marks.sort((a, b) => ccc(a) - ccc(b)); for (const cp of marks)
        result.push(cp); marks.length = 0; };
    for (const cp of raw) {
        if (ccc(cp) === 0) {
            flush();
            result.push(cp);
        }
        else
            marks.push(cp);
    }
    flush();
    return result;
}
const stringOf = (values) => values.map(cp => String.fromCodePoint(cp)).join('');
const unicode17NFD = (text) => stringOf(decomposed(text));
function composedPair(first, second) {
    const leading = first - L_BASE, vowel = second - V_BASE;
    if (leading >= 0 && leading < L_COUNT && vowel >= 0 && vowel < V_COUNT)
        return S_BASE + (leading * V_COUNT + vowel) * T_COUNT;
    const syllable = first - S_BASE, tail = second - T_BASE;
    if (syllable >= 0 && syllable < S_COUNT && syllable % T_COUNT === 0 && tail > 0 && tail < T_COUNT)
        return first + tail;
    return _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__.COMPOSITION[`${first},${second}`];
}
function unicode17NFC(text) {
    const input = decomposed(text);
    if (!input.length)
        return '';
    const result = [input[0]];
    let starter = 0, lastClass = ccc(input[0]);
    for (let i = 1; i < input.length; i++) {
        const cp = input[i], currentClass = ccc(cp), combined = composedPair(result[starter], cp);
        if (combined !== undefined && (lastClass < currentClass || lastClass === 0)) {
            result[starter] = combined;
        }
        else {
            if (currentClass === 0)
                starter = result.length;
            result.push(cp);
            lastClass = currentClass;
        }
    }
    return stringOf(result);
}


/***/ },

/***/ "./src/domain/validation.ts"
/*!**********************************!*\
  !*** ./src/domain/validation.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closed: () => (/* binding */ closed),
/* harmony export */   isUuid: () => (/* binding */ isUuid),
/* harmony export */   validProfile: () => (/* binding */ validProfile)
/* harmony export */ });
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v);
function closed(v, keys) {
    return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
}
function validProfile(v) {
    return closed(v, ['name', 'description']) && typeof v.name === 'string' && typeof v.description === 'string' && [v.name, v.description].every(text => !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(text));
}


/***/ },

/***/ "./src/domain/workspace.ts"
/*!*********************************!*\
  !*** ./src/domain/workspace.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_DECISION_TYPES: () => (/* binding */ BUILTIN_DECISION_TYPES),
/* harmony export */   CHARACTER_PROMPTS: () => (/* binding */ CHARACTER_PROMPTS),
/* harmony export */   PERSONALITY_LABELS: () => (/* reexport safe */ _personality__WEBPACK_IMPORTED_MODULE_3__.PERSONALITY_LABELS),
/* harmony export */   WorkspaceValidationError: () => (/* binding */ WorkspaceValidationError),
/* harmony export */   affiliationHistory: () => (/* binding */ affiliationHistory),
/* harmony export */   appendMovedGroupOrder: () => (/* binding */ appendMovedGroupOrder),
/* harmony export */   assertWorkspaceState: () => (/* binding */ assertWorkspaceState),
/* harmony export */   canonicalCodeKey: () => (/* reexport safe */ _code_fold__WEBPACK_IMPORTED_MODULE_4__.canonicalCodeKey),
/* harmony export */   characterCompleteness: () => (/* binding */ characterCompleteness),
/* harmony export */   compareOptionalDates: () => (/* binding */ compareOptionalDates),
/* harmony export */   decisionResolved: () => (/* binding */ decisionResolved),
/* harmony export */   factionCompleteness: () => (/* binding */ factionCompleteness),
/* harmony export */   nextGroupOrder: () => (/* binding */ nextGroupOrder),
/* harmony export */   normalizeCharacter: () => (/* binding */ normalizeCharacter),
/* harmony export */   normalizeFaction: () => (/* binding */ normalizeFaction),
/* harmony export */   orderedChapters: () => (/* binding */ orderedChapters),
/* harmony export */   orderedDated: () => (/* binding */ orderedDated),
/* harmony export */   orderedPlots: () => (/* binding */ orderedPlots),
/* harmony export */   ownerKindForType: () => (/* binding */ ownerKindForType),
/* harmony export */   recordCategory: () => (/* binding */ recordCategory),
/* harmony export */   synchronizedBirth: () => (/* binding */ synchronizedBirth),
/* harmony export */   trimmedCode: () => (/* reexport safe */ _code_fold__WEBPACK_IMPORTED_MODULE_4__.trimmedCode),
/* harmony export */   updateRecordCalendar: () => (/* binding */ updateRecordCalendar),
/* harmony export */   validWorkspaceData: () => (/* binding */ validWorkspaceData),
/* harmony export */   validateWorkspaceRecord: () => (/* binding */ validateWorkspaceRecord),
/* harmony export */   visibleRecord: () => (/* binding */ visibleRecord),
/* harmony export */   writingContextDecisions: () => (/* binding */ writingContextDecisions)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");
/* harmony import */ var _calendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _manuscript__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manuscript */ "./src/domain/manuscript.ts");
/* harmony import */ var _personality__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./personality */ "./src/domain/personality.ts");
/* harmony import */ var _code_fold__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./code-fold */ "./src/domain/code-fold.ts");






const recordCategory = { story: 'stories', volume: 'volumes', chapter: 'chapters', plot: 'plots', 'decision-context': 'decision-context', calendar: 'calendars', event: 'events', decision: 'decisions', 'decision-type': 'decision-types', character: 'characters', faction: 'factions', affiliation: 'affiliations', view: 'views' };
const ownerKindForType = (type) => ['story', 'volume', 'chapter', 'plot', 'decision-context'].includes(type) ? 'project' : 'universe';
class WorkspaceValidationError extends Error {
    field;
    constructor(message, field = '') {
        super(message);
        this.field = field;
        this.name = 'WorkspaceValidationError';
    }
}
const fail = (message, field = '') => { throw new WorkspaceValidationError(message, field); };
const named = (v) => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v) && !!v.trim();
const nullable = (v, f) => v === null || f(v);
const ids = (v) => Array.isArray(v) && v.every(_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && new Set(v).size === v.length;
const texts = (v, fields) => fields.every(k => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v[k]));
const maker = (v) => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['kind', 'id']) && (v.kind === 'character' || v.kind === 'faction') && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id);
const image = (v) => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['id', 'sha256', 'mediaType']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) && typeof v.sha256 === 'string' && /^[0-9a-f]{64}$/.test(v.sha256) && ['image/png', 'image/jpeg', 'image/webp'].includes(v.mediaType);
const code = (v) => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v) && !!(0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.trimmedCode)(v) && v === (0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.trimmedCode)(v);
const exactDecimal = (v, signed) => typeof v === 'string' && (signed ? /^(?:0|-?[1-9][0-9]*)(?:\.[0-9]+)?$|^-0\.[0-9]*[1-9][0-9]*$/ : /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/).test(v);
const CHARACTER_FIELDS = ['rankTitle', 'background', 'description', 'motivation', 'weaknesses', 'strengths', 'specialities'];
const FACTION_TEXT = ['description', 'governmentType', 'governmentNotes', 'leaderName', 'leaderAge', 'leaderReputation', 'leaderProfile', 'militaryHead', 'intelligenceHead', 'overview', 'strengths', 'weaknesses', 'population', 'resources', 'culture'];
const flagKeys = (v) => typeof v === 'object' && v !== null && Object.hasOwn(v, 'calendarUpdateRequired') ? ['calendarUpdateRequired'] : [];
const calendarFlag = (v) => !flagKeys(v).length || typeof v.calendarUpdateRequired === 'boolean';
function validWorkspaceData(type, v) {
    switch (type) {
        case 'story': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['title', 'creationSequence', 'order', 'volumeId', 'chapterTarget']) && named(v.title) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.creationSequence) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.volumeId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && nullable(v.chapterTarget, _calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger);
        case 'volume': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['title', 'order']) && named(v.title) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order);
        case 'chapter': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['title', 'storyId', 'creationSequence', 'start', 'end', 'characterIds', 'events', 'wordTarget', 'calendarUpdateRequired', 'formatting']) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v.title) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.storyId) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.creationSequence) && nullable(v.start, _calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition) && nullable(v.end, _calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition) && ids(v.characterIds) && Array.isArray(v.events) && v.events.every(e => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e, ['eventId', 'role']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.eventId) && ['main', 'flashback'].includes(e.role)) && new Set(v.events.map(e => e.eventId)).size === v.events.length && nullable(v.wordTarget, _calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger) && typeof v.calendarUpdateRequired === 'boolean' && (0,_manuscript__WEBPACK_IMPORTED_MODULE_2__.validChapterFormatting)(v.formatting);
        case 'plot': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'storyId', 'heading', 'date', 'order']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.storyId) && named(v.heading) && nullable(v.date, _calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order);
        case 'decision-context': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['storyId', 'decisionId']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.storyId) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.decisionId);
        case 'calendar': return (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validCalendarData)(v);
        case 'event': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'heading', 'description', 'date', 'code', 'order', 'maker', 'kind', 'characterId']) && named(v.heading) && nullable(v.description, _calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition)(v.date) && code(v.code) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.maker, maker) && ['ordinary', 'birth', 'background'].includes(v.kind) && nullable(v.characterId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && (v.kind === 'ordinary' ? v.characterId === null : v.characterId !== null);
        case 'decision': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'text', 'date', 'typeId', 'code', 'order', 'maker', 'characterIds', 'eventIds', 'followingDecisionIds']) && named(v.text) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition)(v.date) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.typeId) && code(v.code) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.maker, maker) && ids(v.characterIds) && ids(v.eventIds) && ids(v.followingDecisionIds);
        case 'decision-type': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['name', 'makerRequired', 'builtin']) && named(v.name) && v.name === v.name.trim() && typeof v.makerRequired === 'boolean' && (v.builtin === null || v.builtin === 'personal' && v.name === 'Personal Decisions' && v.makerRequired || v.builtin === 'story' && v.name === 'Story Decisions' && !v.makerRequired);
        case 'character': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'name', 'type', ...CHARACTER_FIELDS, 'waivers', 'personalities', 'image', 'birth', 'birthEventId']) && named(v.name) && ['main', 'major', 'minor', 'extra'].includes(v.type) && texts(v, CHARACTER_FIELDS) && Array.isArray(v.waivers) && v.waivers.every(w => CHARACTER_FIELDS.includes(w)) && new Set(v.waivers).size === v.waivers.length && Array.isArray(v.personalities) && v.personalities.every(p => _personality__WEBPACK_IMPORTED_MODULE_3__.PERSONALITY_LABELS.includes(p)) && new Set(v.personalities).size === v.personalities.length && nullable(v.image, image) && (v.birth === null || (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.birth, ['year', 'elementId', 'day']) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.signedInteger)(v.birth.year) && nullable(v.birth.elementId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && (v.birth.day === null || (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.birth.day) && v.birth.day !== '0')) && nullable(v.birthEventId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && (v.birth === null) === (v.birthEventId === null);
        case 'faction': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['name', ...FACTION_TEXT, 'image', 'leaderImage', 'locations', 'military']) && named(v.name) && texts(v, FACTION_TEXT) && nullable(v.image, image) && nullable(v.leaderImage, image) && Array.isArray(v.locations) && v.locations.every(l => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(l, ['name', 'notes']) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(l.name) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(l.notes)) && Array.isArray(v.military) && v.military.every(m => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(m, ['name', 'role', 'description', 'baseStrength', 'movementPoints', 'baseModifierPoints']) && texts(m, ['name', 'role', 'description']) && [m.baseStrength, m.movementPoints].every(n => n === null || exactDecimal(n, false)) && (m.baseModifierPoints === null || exactDecimal(m.baseModifierPoints, true)));
        case 'affiliation': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'characterId', 'date', 'order', 'factionId']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.characterId) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition)(v.date) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.factionId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid);
        case 'view': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['makers', 'categories']) && Array.isArray(v.makers) && v.makers.every(m => maker(m) || (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(m, ['kind']) && m.kind === 'none') && Array.isArray(v.categories) && v.categories.every(c => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(c, ['kind']) && c.kind === 'events' || (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(c, ['kind', 'id']) && c.kind === 'decision-type' && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(c.id)) && new Set(v.makers.map(m => JSON.stringify(m))).size === v.makers.length && new Set(v.categories.map(c => JSON.stringify(c))).size === v.categories.length;
        default: return false;
    }
}
function validateWorkspaceRecord(v) {
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) || v.schemaVersion !== 1 || typeof v.recordType !== 'string' || !Object.hasOwn(recordCategory, v.recordType) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.universeId) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.owner.id) || v.owner.kind !== ownerKindForType(v.recordType) || v.owner.kind === 'universe' && v.owner.id !== v.universeId || !validWorkspaceData(v.recordType, v.data))
        return false;
    if (v.recordType === 'chapter') {
        const f = v.data.formatting;
        return f.chapterId === v.id && f.recordVersion === v.recordVersion;
    }
    return true;
}
/** Validate the complete candidate closure, including the project's authoritative universe. */
function assertWorkspaceState(records) {
    const map = new Map();
    for (const r of records) {
        if (!validateWorkspaceRecord(r))
            fail('Invalid closed workspace record.');
        if (map.has(r.id))
            fail('Duplicate permanent identity.');
        map.set(r.id, r);
    }
    const calendars = records.filter((r) => r.recordType === 'calendar');
    const calendarFor = (r) => { const found = calendars.filter(c => c.universeId === r.universeId); if (found.length !== 1)
        return fail('Exactly one authoritative calendar is required for dated content.'); return found[0].data; };
    const ref = (r, id, type, project = false) => { const target = map.get(id); if (!target || target.recordType !== type || target.universeId !== r.universeId || project && (target.owner.kind !== r.owner.kind || target.owner.id !== r.owner.id))
        return fail('Missing or foreign record reference.', id); return target; };
    const keys = new Set(), typeNames = new Set(), builtin = new Set(), contexts = new Set();
    const date = (r, d) => { if (d)
        (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.elapsedPosition)(d, calendarFor(r)); };
    for (const r of records) {
        const d = r.data;
        switch (r.recordType) {
            case 'calendar':
                if (r.data.versions.some(c => c.targetDays !== c.actualDays))
                    fail('Saved calendar target must equal its actual length.');
                if (calendars.filter(c => c.universeId === r.universeId).length !== 1)
                    fail('Only one calendar per universe is permitted.');
                break;
            case 'story':
                if (r.data.volumeId)
                    ref(r, r.data.volumeId, 'volume', true);
                break;
            case 'chapter': {
                const c = r.data;
                ref(r, c.storyId, 'story', true);
                c.characterIds.forEach(id => ref(r, id, 'character'));
                c.events.forEach(e => ref(r, e.eventId, 'event'));
                date(r, c.start);
                date(r, c.end);
                if (c.start && c.end && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(c.end, c.start, calendarFor(r)) < 0)
                    fail('Chapter end must be corrected to start.');
                break;
            }
            case 'plot':
                ref(r, r.data.storyId, 'story', true);
                date(r, r.data.date);
                break;
            case 'decision-context': {
                ref(r, r.data.storyId, 'story', true);
                ref(r, r.data.decisionId, 'decision');
                const k = `${r.owner.id}/${r.data.storyId}/${r.data.decisionId}`;
                if (contexts.has(k))
                    fail('Duplicate story decision relevance.');
                contexts.add(k);
                break;
            }
            case 'event':
            case 'decision': {
                const e = r.data;
                date(r, e.date);
                const key = `${r.universeId}/${(0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.canonicalCodeKey)(e.code)}`;
                if (keys.has(key))
                    fail('Timeline code is already in use.', 'code');
                keys.add(key);
                if (e.maker)
                    ref(r, e.maker.id, e.maker.kind);
                if (r.recordType === 'event') {
                    if (r.data.characterId)
                        ref(r, r.data.characterId, 'character');
                    if (r.data.kind === 'birth') {
                        const c = ref(r, r.data.characterId, 'character');
                        if (c.data.birthEventId !== r.id || !c.data.birth || c.data.birth.year !== r.data.date.year)
                            fail('Canonical birth association is inconsistent.');
                    }
                }
                else {
                    const decision = r.data, t = ref(r, decision.typeId, 'decision-type');
                    if (t.data.makerRequired && !decision.maker)
                        fail('This decision type requires a maker.', 'maker');
                    decision.characterIds.forEach(id => ref(r, id, 'character'));
                    for (const id of decision.eventIds) {
                        const target = ref(r, id, 'event');
                        if ((0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(target.data.date, decision.date, calendarFor(r)) < 0)
                            fail('Result event predates its source decision.');
                    }
                    for (const id of decision.followingDecisionIds) {
                        const target = ref(r, id, 'decision');
                        if (id === r.id || (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(target.data.date, decision.date, calendarFor(r)) < 0)
                            fail('Invalid following decision date or self-link.');
                    }
                }
                break;
            }
            case 'decision-type': {
                const t = r.data, k = `${r.universeId}/${(0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.canonicalCodeKey)(t.name)}`;
                if (typeNames.has(k))
                    fail('Decision type names must be unique.');
                typeNames.add(k);
                if (t.builtin) {
                    const b = `${r.universeId}/${t.builtin}`;
                    if (builtin.has(b))
                        fail('Duplicate built-in decision type.');
                    builtin.add(b);
                }
                break;
            }
            case 'character':
                if (r.data.birthEventId) {
                    const e = ref(r, r.data.birthEventId, 'event');
                    if (e.data.kind !== 'birth' || e.data.characterId !== r.id || e.data.date.year !== r.data.birth.year)
                        fail('Birth event must be the character’s canonical birth.');
                }
                break;
            case 'affiliation':
                ref(r, r.data.characterId, 'character');
                if (r.data.factionId)
                    ref(r, r.data.factionId, 'faction');
                date(r, r.data.date);
                break;
            case 'view':
                if (records.filter(x => x.recordType === 'view' && x.universeId === r.universeId).length > 1)
                    fail('Only one synchronized visibility configuration is permitted per universe.');
                for (const m of r.data.makers)
                    if (m.kind !== 'none')
                        ref(r, m.id, m.kind);
                for (const c of r.data.categories)
                    if (c.kind === 'decision-type')
                        ref(r, c.id, 'decision-type');
                break;
        }
        void d;
    }
    const done = new Set(), visiting = new Set();
    // Author-sized graphs must not depend on the JavaScript recursion limit.
    for (const record of records) {
        if (record.recordType !== 'decision' || done.has(record.id))
            continue;
        const stack = [{ id: record.id, next: 0 }];
        visiting.add(record.id);
        while (stack.length) {
            const frame = stack[stack.length - 1], decision = map.get(frame.id);
            if (frame.next === decision.data.followingDecisionIds.length) {
                visiting.delete(frame.id);
                done.add(frame.id);
                stack.pop();
                continue;
            }
            const id = decision.data.followingDecisionIds[frame.next++];
            if (visiting.has(id))
                fail('Decision result graph contains a cycle.');
            if (!done.has(id)) {
                visiting.add(id);
                stack.push({ id, next: 0 });
            }
        }
    }
}
const decisionResolved = (d) => d.eventIds.length + d.followingDecisionIds.length > 0;
const exactCompare = (a, b) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0;
function compareOptionalDates(a, b, c) { return a === null ? (b === null ? 0 : -1) : b === null ? 1 : c ? (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(a, b, c) : fail('A calendar is required for dated ordering.'); }
function orderedChapters(chapters, calendar = null) { return [...chapters].sort((a, b) => compareOptionalDates(a.data.start, b.data.start, calendar) || exactCompare(a.data.creationSequence, b.data.creationSequence) || a.id.localeCompare(b.id)); }
function orderedPlots(plots, calendar = null) { return [...plots].sort((a, b) => compareOptionalDates(a.data.date, b.data.date, calendar) || exactCompare(a.data.order, b.data.order) || a.id.localeCompare(b.id)); }
function orderedDated(records, calendar) { return [...records].sort((a, b) => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(a.data.date, b.data.date, calendar) || exactCompare(a.data.order, b.data.order) || a.id.localeCompare(b.id)); }
function nextGroupOrder(records, date, calendar) { let max = -1n; for (const r of records)
    if (compareOptionalDates(r.data.date, date, calendar) === 0 && BigInt(r.data.order) > max)
        max = BigInt(r.data.order); return (max + 1n).toString(); }
function affiliationHistory(records, calendar) { let previous = null; return orderedDated(records, calendar).map(record => { const entry = { record, previousFactionId: previous, factionId: record.data.factionId }; previous = record.data.factionId; return entry; }); }
function visibleRecord(record, view) { const m = record.data.maker; return (!view.makers.length || view.makers.some(f => m ? f.kind !== 'none' && f.kind === m.kind && f.id === m.id : f.kind === 'none')) && (!view.categories.length || view.categories.some(c => record.recordType === 'event' ? c.kind === 'events' : c.kind === 'decision-type' && c.id === record.data.typeId)); }
function writingContextDecisions(decisions, contexts, storyId, chapterCharacters) { const story = new Set(contexts.filter(c => c.data.storyId === storyId).map(c => c.data.decisionId)); return decisions.filter(d => story.has(d.id) || d.data.characterIds.some(id => chapterCharacters.includes(id))); }
function characterCompleteness(character, events) { const c = character.data, expected = c.type === 'extra' ? [] : ['rankTitle', 'description', ...(c.type === 'main' ? ['background'] : [])]; const states = {}; states.name = c.name.trim() ? 'answered' : 'incomplete'; for (const f of CHARACTER_FIELDS) {
    const answered = !!c[f].trim() || f === 'background' && events.some(e => e.universeId === character.universeId && e.data.kind === 'background' && e.data.characterId === character.id);
    states[f] = answered ? 'answered' : c.waivers.includes(f) ? 'waived' : expected.includes(f) ? 'incomplete' : 'optional';
} return states; }
function normalizeCharacter(character, hasBackgroundEvent = false) { return { ...character, waivers: character.waivers.filter(f => !character[f].trim() && !(f === 'background' && hasBackgroundEvent)) }; }
function factionCompleteness(f) { const fields = ['name', ...FACTION_TEXT.filter(k => !['population', 'resources', 'culture'].includes(k))]; const missing = fields.filter(k => !f[k].trim()); if (!f.image)
    missing.push('image'); if (!f.leaderImage)
    missing.push('leaderImage'); return { complete: !missing.length, missing }; }
function normalizeFaction(f) { return { ...f, military: f.military.filter(m => m.name.trim() || m.role.trim() || m.description.trim() || m.baseStrength !== null || m.movementPoints !== null || m.baseModifierPoints !== null) }; }
function synchronizedBirth(character, event, calendar, direction) { const birth = character.data.birth; if (event.data.kind !== 'birth' || event.data.characterId !== character.id || character.data.birthEventId !== event.id || !birth)
    return fail('Birth synchronization requires the canonical association.'); return direction === 'character-to-event' ? { character, event: { ...event, data: { ...event.data, date: (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.birthPosition)(birth, calendar) } } } : { character: { ...character, data: { ...character.data, birth: { ...birth, year: event.data.date.year } } }, event }; }
const BUILTIN_DECISION_TYPES = [
    { name: 'Personal Decisions', makerRequired: true, builtin: 'personal' },
    { name: 'Story Decisions', makerRequired: false, builtin: 'story' },
];
/** Advance group position only for insertion or a real elapsed-date change. */
function appendMovedGroupOrder(before, candidate, calendar) {
    const old = before.find(r => r.id === candidate.id);
    return !old || compareOptionalDates(old.data.date, candidate.data.date, calendar) !== 0 ? { ...candidate, data: { ...candidate.data, order: nextGroupOrder(before.filter(r => r.id !== candidate.id), candidate.data.date, calendar) } } : candidate;
}
/** Explicit calendar update converts display metadata while retaining elapsed chronology. */
function updateRecordCalendar(record, calendar, convert) {
    switch (record.recordType) {
        case 'chapter': return { ...record, data: { ...record.data, start: record.data.start ? convert(record.data.start, calendar) : null, end: record.data.end ? convert(record.data.end, calendar) : null, calendarUpdateRequired: false } };
        case 'plot': return { ...record, data: { ...record.data, date: record.data.date ? convert(record.data.date, calendar) : null, ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        case 'event': return { ...record, data: { ...record.data, date: convert(record.data.date, calendar), ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        case 'decision': return { ...record, data: { ...record.data, date: convert(record.data.date, calendar), ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        case 'affiliation': return { ...record, data: { ...record.data, date: convert(record.data.date, calendar), ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        default: return record;
    }
}
const CHARACTER_PROMPTS = { rankTitle: 'What rank or title does this character hold?', background: 'What experiences shaped this character?', description: 'How would you describe this character?', motivation: 'What does this character want, and why?', weaknesses: 'What weaknesses or limitations affect this character?', strengths: 'What strengths help this character?', specialities: 'What skills or areas of expertise distinguish this character?' };


/***/ },

/***/ "./src/infrastructure/confined-fs.ts"
/*!*******************************************!*\
  !*** ./src/infrastructure/confined-fs.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configureConfinedFs: () => (/* binding */ configureConfinedFs),
/* harmony export */   confinedFs: () => (/* binding */ confinedFs)
/* harmony export */ });
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:module */ "node:module");
/* harmony import */ var node_module__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_module__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_2__);
/** Trusted main/utility-only filesystem adapter. Never expose handles or this API over IPC. */



let binding;
let configuredModule;
/** Call only from trusted bootstrap, before constructing the coordinator. */
function configureConfinedFs(modulePath) {
    if (!node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(modulePath) || node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(modulePath) !== 'confined_fs.node')
        throw new Error('Invalid trusted native module location');
    if (binding || (configuredModule !== undefined && configuredModule !== modulePath))
        throw new Error('Confined filesystem module location is already fixed');
    configuredModule = modulePath;
}
function native() {
    if (binding)
        return binding;
    if (!(process.platform === 'darwin' && ['x64', 'arm64'].includes(process.arch)) && !(process.platform === 'win32' && process.arch === 'x64'))
        throw new Error('Unsupported confined filesystem platform/architecture');
    if (process.type === 'renderer')
        throw new Error('Confined filesystem is restricted to trusted host processes');
    const runtime = process;
    const packaged = runtime.resourcesPath && !runtime.defaultApp;
    const filename = configuredModule ?? (packaged
        ? node_path__WEBPACK_IMPORTED_MODULE_0___default().join(runtime.resourcesPath, 'native', 'confined-fs', `${process.platform}-${process.arch}`, 'confined_fs.node')
        : node_path__WEBPACK_IMPORTED_MODULE_0___default().resolve('native/confined-fs/build/Release/confined_fs.node'));
    try {
        const loaded = (0,node_module__WEBPACK_IMPORTED_MODULE_1__.createRequire)(node_path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), 'package.json'))(filename);
        const operations = ['root', 'open', 'close', 'stat', 'read', 'write', 'sync', 'mkdir', 'rename', 'unlink'];
        if (loaded.contractVersion !== 1 || operations.some(name => typeof loaded[name] !== 'function'))
            throw new Error('Incompatible confined filesystem contract');
        binding = loaded;
        return loaded;
    }
    catch (cause) {
        throw new Error(`Required confined filesystem addon unavailable: ${filename}`, { cause });
    }
}
function segments(relative) {
    const result = relative.split('/');
    if (node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(relative) || result.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)))
        throw new Error('Unsafe managed path');
    return result;
}
function directory(absolute) { return native().root(node_path__WEBPACK_IMPORTED_MODULE_0___default().resolve(absolute)); }
function parent(root, relative) {
    const parts = segments(relative), name = parts.pop();
    let handle = directory(root);
    try {
        for (const part of parts) {
            const next = native().open(handle, part, 'directory');
            native().close(handle);
            handle = next;
        }
        return { handle, name };
    }
    catch (error) {
        native().close(handle);
        throw error;
    }
}
function regular(handle) {
    const stat = native().stat(handle);
    if (stat.directory)
        throw new Error('Invalid managed file');
    return stat;
}
function digest(handle, copy) {
    const hash = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.createHash)('sha256');
    for (;;) {
        const bytes = native().read(handle, 262144);
        if (!bytes.length)
            break;
        hash.update(bytes);
        if (copy)
            native().write(copy, bytes);
    }
    regular(handle);
    return hash.digest('hex');
}
function write(handle, data) {
    regular(handle);
    for (let offset = 0; offset < data.byteLength; offset += 262144)
        native().write(handle, Buffer.from(data.buffer, data.byteOffset + offset, Math.min(262144, data.byteLength - offset)));
    regular(handle);
    native().sync(handle, false);
}
function verify(parent, name, expected, expectedHash) {
    let handle;
    try {
        handle = native().open(parent, name, 'read');
        if (!expected || regular(handle).id !== expected.id || (expectedHash !== undefined && digest(handle) !== expectedHash))
            throw new Error('Managed target changed');
    }
    catch (error) {
        if (expected || error.code !== 'ENOENT')
            throw error;
    }
    finally {
        if (handle)
            native().close(handle);
    }
}
function previous(parent, name, expectedHash) {
    let handle;
    try {
        handle = native().open(parent, name, 'read');
        const identity = regular(handle);
        if (expectedHash === null || digest(handle) !== expectedHash)
            throw new Error('Unexpected managed bytes');
        return identity;
    }
    catch (error) {
        if (error.code !== 'ENOENT' || expectedHash !== null)
            throw error;
    }
    finally {
        if (handle)
            native().close(handle);
    }
}
function publish(root, relative, content, options) {
    const p = parent(root, relative), temporary = `.publish-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`;
    let target, original;
    try {
        native().sync(p.handle, true);
        let before;
        if (options.existing) {
            original = native().open(p.handle, p.name, 'read');
            before = regular(original);
        }
        else if (options.expectedHash !== undefined)
            before = previous(p.handle, p.name, options.expectedHash);
        target = native().open(p.handle, temporary, 'new');
        regular(target);
        content(target);
        regular(target);
        native().sync(target, false);
        native().sync(p.handle, true);
        options.staged?.();
        verify(p.handle, p.name, before, options.expectedHash ?? undefined);
        native().rename(p.handle, target, temporary, p.name, before !== undefined);
        native().sync(p.handle, true);
    }
    finally {
        // Retain staging evidence on failure. No unverified cleanup deletes another object's bytes.
        if (original)
            native().close(original);
        if (target)
            native().close(target);
        native().close(p.handle);
    }
}
const confinedFs = {
    syncDir(absolute) { const h = directory(absolute); try {
        native().sync(h, true);
    }
    finally {
        native().close(h);
    } },
    writeExclusive(absolute, data, reserved) {
        const p = parent(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(absolute), node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(absolute));
        let h;
        try {
            native().sync(p.handle, true);
            h = native().open(p.handle, p.name, 'new', reserved);
            write(h, Buffer.from(data));
            native().sync(p.handle, true);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    publishMarker(root, relative, data, staged) {
        publish(root, relative, h => write(h, Buffer.from(data)), { staged });
    },
    preserveMarker(root, relative) {
        const p = parent(root, relative);
        let h;
        try {
            native().sync(p.handle, true);
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            native().rename(p.handle, h, p.name, `${p.name}.damaged-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`, false);
            native().sync(p.handle, true);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    readManaged(root, relative) {
        const p = parent(root, relative);
        let h;
        try {
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            const chunks = [];
            for (;;) {
                const b = native().read(h, 262144);
                if (!b.length)
                    break;
                chunks.push(b);
            }
            regular(h);
            return Buffer.concat(chunks);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    replaceManaged(root, relative, data) { publish(root, relative, h => write(h, Buffer.from(data)), { existing: true }); },
    ensureManagedDirectory(root, relative) {
        const parts = segments(relative);
        let h = directory(root);
        try {
            for (const part of parts) {
                native().sync(h, true);
                try {
                    native().mkdir(h, part);
                    native().sync(h, true);
                }
                catch (error) {
                    if (error.code !== 'EEXIST')
                        throw error;
                }
                const next = native().open(h, part, 'directory');
                native().close(h);
                h = next;
            }
        }
        finally {
            native().close(h);
        }
    },
    publishManagedBytes(root, relative, bytes, expectedHash) {
        publish(root, relative, h => write(h, bytes), { expectedHash });
    },
    removeManagedBytes(root, relative, expectedHash) {
        const p = parent(root, relative);
        let h;
        try {
            native().sync(p.handle, true);
            h = native().open(p.handle, p.name, 'read');
            const identity = regular(h);
            if (digest(h) !== expectedHash)
                throw new Error('Unexpected removal target');
            verify(p.handle, p.name, identity, expectedHash);
            native().unlink(p.handle, h, p.name);
            native().close(h);
            h = undefined;
            native().sync(p.handle, true);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    publishManagedFile(root, relative, source, expectedHash, expectedSourceHash) {
        if (segments(relative).length !== 1)
            throw new Error('Unsafe output filename');
        const p = parent(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(source), node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(source));
        let h;
        try {
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            const sourceHandle = h;
            publish(root, relative, output => { if (digest(sourceHandle, output) !== expectedSourceHash)
                throw new Error('Validated private output changed before publication'); }, { expectedHash });
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    hashFile(absolute) {
        const p = parent(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(absolute), node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(absolute));
        let h;
        try {
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            return digest(h);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
};


/***/ },

/***/ "./src/infrastructure/recent-roots.ts"
/*!********************************************!*\
  !*** ./src/infrastructure/recent-roots.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RecentRoots: () => (/* binding */ RecentRoots)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");





class RecentRoots {
    userData;
    relative = 'protection/recent-roots.json';
    constructor(userData) {
        this.userData = userData;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.ensureManagedDirectory)(userData, 'protection');
    }
    list() { if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, this.relative)))
        return []; const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.readManaged)(this.userData, this.relative)); if (!Array.isArray(value) || !value.every(v => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(v, ['id', 'owner', 'rootId', 'name', 'location']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(v.id) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_2__.validOwner)(v.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(v.rootId) && typeof v.name === 'string' && typeof v.location === 'string' && node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(v.location)))
        throw new Error('Recent-root metadata is invalid.'); return value; }
    save(v) { const old = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, this.relative)) ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.readManaged)(this.userData, this.relative)) : null; (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.publishManagedBytes)(this.userData, this.relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.jsonBytes)(v)), old); }
    remember(owner, rootId, name, location) { this.save([{ id: owner.id, owner, rootId, name, location }, ...this.list().filter(r => r.id !== owner.id)]); }
    remove(id) { this.save(this.list().filter(r => r.id !== id)); }
    available(r) { try {
        const d = (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.readManaged)(r.location, 'writingtool.json'));
        return d.id === r.owner.id && d.rootId === r.rootId;
    }
    catch {
        return false;
    } }
}


/***/ },

/***/ "./src/infrastructure/recovery-activation.ts"
/*!***************************************************!*\
  !*** ./src/infrastructure/recovery-activation.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activationDestinationAvailable: () => (/* binding */ activationDestinationAvailable),
/* harmony export */   activationPath: () => (/* binding */ activationPath),
/* harmony export */   activationRootAt: () => (/* binding */ activationRootAt),
/* harmony export */   relocateActivationParticipant: () => (/* binding */ relocateActivationParticipant),
/* harmony export */   validActivationDecision: () => (/* binding */ validActivationDecision),
/* harmony export */   validActivationPath: () => (/* binding */ validActivationPath)
/* harmony export */ });
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");





const activationPath = (requestId) => `protection/activation-${requestId}.json`;
const validActivationPath = (value) => typeof value === 'string' && node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(value) && !value.includes('\0') && !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value);
const absolute = validActivationPath;
const inside = (file, root) => { const relative = node_path__WEBPACK_IMPORTED_MODULE_0___default().relative(root, file); return !relative || relative !== '..' && !relative.startsWith('..' + (node_path__WEBPACK_IMPORTED_MODULE_0___default().sep)) && !node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(relative); };
/** An empty/foreign replacement at an old path is not the missing participant. */
function activationRootAt(root, participant) {
    if (!absolute(root))
        throw new Error('Invalid activation path bytes.');
    let location;
    try {
        location = node_fs__WEBPACK_IMPORTED_MODULE_1___default().realpathSync(root);
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return null;
        throw error;
    }
    let discovery;
    try {
        discovery = (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.readManaged)(location, 'writingtool.json'));
    }
    catch (error) {
        if (error.code === 'ENOENT' && !['database', '.writingtool-creation.json'].some(name => node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_0___default().join(location, name))))
            return null;
        throw new Error('An original recovery path has unreadable authority evidence. Preserve it before locating the participant.');
    }
    if (!discovery || typeof discovery !== 'object' || !('schemaVersion' in discovery) || discovery.schemaVersion !== 1 || !('kind' in discovery) || !['project', 'universe'].includes(String(discovery.kind)) || !('id' in discovery) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(discovery.id) || !('rootId' in discovery) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(discovery.rootId))
        throw new Error('An original recovery path has invalid authority evidence.');
    if (discovery.kind === participant.owner.kind && discovery.id === participant.owner.id && discovery.rootId === participant.rootId)
        return location;
    if (discovery.id === participant.owner.id || discovery.rootId === participant.rootId)
        throw new Error('A recovery path has conflicting permanent owner identity.');
    return null;
}
function activationDestinationAvailable(destination, stage) {
    if (!absolute(destination) || !absolute(stage))
        throw new Error('Invalid activation path bytes.');
    try {
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_1___default().lstatSync(destination);
        if (!stat.isDirectory() || stat.isSymbolicLink() || node_fs__WEBPACK_IMPORTED_MODULE_1___default().readdirSync(destination).length)
            return false;
    }
    catch (error) {
        if (error.code !== 'ENOENT')
            throw error;
    }
    try {
        return node_fs__WEBPACK_IMPORTED_MODULE_1___default().statSync(node_fs__WEBPACK_IMPORTED_MODULE_1___default().realpathSync(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(destination))).dev === node_fs__WEBPACK_IMPORTED_MODULE_1___default().statSync(stage).dev;
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return false;
        throw error;
    }
}
/** Only a destination capability identifies a relocated, unpublished stage. */
function relocateActivationParticipant(participant, state, selected) {
    if (!absolute(selected.location) || selected.destination !== undefined && !absolute(selected.destination))
        throw new Error('Invalid activation path bytes.');
    const staged = activationRootAt(participant.stage, participant), published = activationRootAt(participant.destination, participant), location = activationRootAt(selected.location, participant);
    if (staged && published)
        throw new Error('Both recovery locations contain the original identity. Preserve both roots before reconciliation.');
    if (!location)
        throw new Error('The selected activation location has a different permanent identity.');
    if (published && published !== location || staged && staged !== location)
        throw new Error('An original activation authority remains accessible. Reconcile it before rebinding.');
    if (selected.destination !== undefined) {
        if (published || state === 'complete')
            throw new Error('A published activation retains its located publication root.');
        if (!activationDestinationAvailable(selected.destination, location))
            throw new Error('Choose an empty publication destination on the same filesystem as the staged recovery root.');
        return { ...participant, stage: location, destination: selected.destination };
    }
    if (staged || !published && state !== 'complete')
        throw new Error('Choose an empty publication destination for the relocated staged root.');
    return { ...participant, destination: location };
}
function validActivationDecision(value) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(value, ['schemaVersion', 'requestId', 'proposalId', 'manifestId', 'operationId', 'state', 'locations', 'participants']) || value.schemaVersion !== 2 || ![value.requestId, value.proposalId, value.manifestId, value.operationId].every(_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid) || !['await-coordinator', 'commit', 'complete'].includes(String(value.state)) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(value.locations, ['project', 'universe']) || value.locations.project !== null && !absolute(value.locations.project) || !absolute(value.locations.universe) || !Array.isArray(value.participants) || !value.participants.length || value.participants.length > 2)
        return false;
    const locations = value.locations;
    if (!value.participants.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(p, ['stage', 'destination', 'owner', 'rootId']) && absolute(p.stage) && absolute(p.destination) && p.stage !== p.destination && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_2__.validOwner)(p.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(p.rootId) && p.destination === (p.owner.kind === 'project' ? locations.project : locations.universe)))
        return false;
    const participants = value.participants;
    const roots = participants.flatMap(p => [p.stage, p.destination]);
    if (!participants.some(p => p.owner.kind === 'universe'))
        roots.push(locations.universe);
    return new Set(participants.map(p => p.owner.kind)).size === participants.length && new Set(participants.map(p => p.rootId)).size === participants.length && roots.every((root, index) => roots.slice(index + 1).every(other => !inside(root, other) && !inside(other, root))) && (value.state !== 'await-coordinator' || participants.length === 1 && participants[0].owner.kind === 'project');
}


/***/ },

/***/ "./src/infrastructure/universe-files.ts"
/*!**********************************************!*\
  !*** ./src/infrastructure/universe-files.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonical: () => (/* binding */ canonical),
/* harmony export */   checked: () => (/* binding */ checked),
/* harmony export */   decode: () => (/* binding */ decode),
/* harmony export */   ensureManagedDirectory: () => (/* binding */ ensureManagedDirectory),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   hashFile: () => (/* binding */ hashFile),
/* harmony export */   jsonBytes: () => (/* binding */ jsonBytes),
/* harmony export */   preserveMarker: () => (/* binding */ preserveMarker),
/* harmony export */   publishManagedBytes: () => (/* binding */ publishManagedBytes),
/* harmony export */   publishManagedFile: () => (/* binding */ publishManagedFile),
/* harmony export */   publishMarker: () => (/* binding */ publishMarker),
/* harmony export */   readManaged: () => (/* binding */ readManaged),
/* harmony export */   removeManagedBytes: () => (/* binding */ removeManagedBytes),
/* harmony export */   replaceManaged: () => (/* binding */ replaceManaged),
/* harmony export */   syncDir: () => (/* binding */ syncDir),
/* harmony export */   writeExclusive: () => (/* binding */ writeExclusive)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _confined_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./confined-fs */ "./src/infrastructure/confined-fs.ts");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_3__);




const hash = (bytes) => (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256').update(bytes).digest('hex');
// RFC8785 for the closed JSON-only slice: keys are UTF-16 sorted; no domain numbers.
function canonical(v) {
    if (v === null || typeof v !== 'object')
        return JSON.stringify(v);
    if (Array.isArray(v))
        return '[' + v.map(canonical).join(',') + ']';
    const o = v;
    return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canonical(o[k])).join(',') + '}';
}
const jsonBytes = (v) => canonical(v) + '\n';
// Scan keys before JSON.parse can erase duplicates, while retaining normal JSON grammar.
function decode(bytes) {
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
        throw new Error('BOM is unsupported');
    const s = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    let i = 0;
    const ws = () => {
        while (/[\x20\t\r\n]/.test(s[i] ?? '') && i < s.length)
            i++;
    };
    const string = () => {
        const start = i++;
        while (i < s.length) {
            const c = s[i++];
            if (c === '\\')
                i++;
            else if (c === '"') {
                const v = JSON.parse(s.slice(start, i));
                if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v))
                    throw new Error('Malformed Unicode');
                return v;
            }
        }
        throw new Error('Unterminated JSON string');
    };
    const value = () => {
        ws();
        const c = s[i];
        if (c === '"') {
            string();
            return;
        }
        if (c === '{') {
            i++;
            ws();
            const keys = new Set();
            if (s[i] === '}') {
                i++;
                return;
            }
            while (i < s.length) {
                ws();
                if (s[i] !== '"')
                    throw new Error('Invalid object');
                const k = string();
                if (keys.has(k))
                    throw new Error('Duplicate JSON key');
                keys.add(k);
                ws();
                if (s[i++] !== ':')
                    throw new Error('Invalid object');
                value();
                ws();
                if (s[i] === '}') {
                    i++;
                    return;
                }
                if (s[i++] !== ',')
                    throw new Error('Invalid object');
            }
        }
        else if (c === '[') {
            i++;
            ws();
            if (s[i] === ']') {
                i++;
                return;
            }
            while (i < s.length) {
                value();
                ws();
                if (s[i] === ']') {
                    i++;
                    return;
                }
                if (s[i++] !== ',')
                    throw new Error('Invalid array');
            }
        }
        else {
            const match = /^(?:null|true|false|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(s.slice(i));
            if (!match)
                throw new Error('Invalid JSON');
            i += match[0].length;
            return;
        }
        throw new Error('Invalid JSON');
    };
    value();
    ws();
    if (i !== s.length)
        throw new Error('Trailing JSON bytes');
    return JSON.parse(s);
}
// The supported local primitive is Linux directory-descriptor-relative I/O.
// Walking with O_NOFOLLOW pins each directory before resolving the next segment.
// Paths through /proc/self/fd refer to the open directory, even after a rename.
function directoryHandle(p) {
    if (process.platform !== 'linux')
        throw new Error('Verified directory-relative I/O is unavailable on this platform');
    let fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync('/', (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_DIRECTORY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
    try {
        for (const segment of node_path__WEBPACK_IMPORTED_MODULE_2___default().resolve(p).split('/').filter(Boolean)) {
            const next = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(`/proc/self/fd/${fd}/${segment}`, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_DIRECTORY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            fd = next;
        }
        return fd;
    }
    catch (error) {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        throw error;
    }
}
function anchored(p) {
    const fd = directoryHandle(node_path__WEBPACK_IMPORTED_MODULE_2___default().dirname(p));
    return { fd, file: `/proc/self/fd/${fd}/${node_path__WEBPACK_IMPORTED_MODULE_2___default().basename(p)}` };
}
function regular(fd) {
    const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1)
        throw new Error('Aliased or invalid managed file');
    return stat;
}
function syncDir(p) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.syncDir(p);
    const fd = directoryHandle(p);
    try {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
    }
}
function writeExclusive(p, data, reserved) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.writeExclusive(p, data, reserved);
    const parent = anchored(p);
    let fd;
    try {
        fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        reserved?.();
        regular(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data, 'utf8');
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        if (fd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
// Atomically publish metadata; keep a torn legacy marker under a distinct name.
function publishMarker(root, relative, data, staged) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.publishMarker(root, relative, data, staged);
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative));
    const temporary = `/proc/self/fd/${parent.fd}/.marker-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data, 'utf8');
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        staged?.();
        try {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
            throw new Error('Publication marker already exists');
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function preserveMarker(root, relative) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.preserveMarker(root, relative);
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative));
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        try {
            regular(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(parent.file, parent.file + '.damaged-' + (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)());
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function checked(root, relative, directory = false) {
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)) || node_path__WEBPACK_IMPORTED_MODULE_2___default().isAbsolute(relative))
        throw new Error('Unsafe managed path');
    let p = root;
    for (let i = 0; i < segments.length; i++) {
        p = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(p, segments[i]);
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(p);
        const dir = i < segments.length - 1 || directory;
        if (stat.isSymbolicLink() || (dir ? !stat.isDirectory() : (!stat.isFile() || stat.nlink !== 1)))
            throw new Error('Aliased or invalid managed path');
    }
    return p;
}
function readManaged(root, relative) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.readManaged(root, relative);
    const p = checked(root, relative);
    const parent = anchored(p);
    let fd;
    try {
        fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        regular(fd);
        return node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd);
    }
    finally {
        if (fd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function replaceManaged(root, relative, data) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.replaceManaged(root, relative, data);
    const target = checked(root, relative);
    const parent = anchored(target);
    const temporary = `/proc/self/fd/${parent.fd}/.publish-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
    let original;
    try {
        original = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        const expected = regular(original);
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data, 'utf8');
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
        if (!current.isFile() || current.nlink !== 1 || current.ino !== expected.ino || current.dev !== expected.dev)
            throw new Error('Publication target identity changed');
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        if (original !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(original);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
/** Managed binary publication shares the anchored, durable primitive used by WRT/JSON. */
function ensureManagedDirectory(root, relative) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.ensureManagedDirectory(root, relative);
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)))
        throw new Error('Unsafe managed directory');
    let fd = directoryHandle(root);
    try {
        for (const segment of segments) {
            const p = `/proc/self/fd/${fd}/${segment}`;
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(p, { mode: 0o700 });
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
            }
            catch (e) {
                if (e.code !== 'EEXIST')
                    throw e;
            }
            const next = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(p, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_DIRECTORY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            fd = next;
        }
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
    }
}
function publishManagedBytes(root, relative, data, expectedHash) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.publishManagedBytes(root, relative, data, expectedHash);
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)) || node_path__WEBPACK_IMPORTED_MODULE_2___default().isAbsolute(relative))
        throw new Error('Unsafe managed path');
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)), temporary = `/proc/self/fd/${parent.fd}/.workspace-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
    try {
        let previous;
        try {
            const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            try {
                previous = regular(fd);
                if (expectedHash === null || hash(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd)) !== expectedHash)
                    throw new Error('Unexpected managed bytes');
            }
            finally {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            }
        }
        catch (e) {
            if (e.code !== 'ENOENT' || expectedHash !== null)
                throw e;
        }
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        if (previous) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
            if (current.ino !== previous.ino || current.dev !== previous.dev || current.nlink !== 1 || !current.isFile())
                throw new Error('Managed target changed');
        }
        else {
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
                throw new Error('Managed target appeared');
            }
            catch (e) {
                if (e.code !== 'ENOENT')
                    throw e;
            }
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function removeManagedBytes(root, relative, expectedHash) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.removeManagedBytes(root, relative, expectedHash);
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative));
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        try {
            regular(fd);
            if (hash(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd)) !== expectedHash)
                throw new Error('Unexpected removal target');
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().unlinkSync(parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
/** Stream a verified private artifact through the same anchored destination publication protocol. */
function publishManagedFile(root, relative, source, expectedHash, expectedSourceHash) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.publishManagedFile(root, relative, source, expectedHash, expectedSourceHash);
    if (relative.includes('/') || !relative || /[\\\0:]/.test(relative) || relative === '.' || relative === '..')
        throw new Error('Unsafe output filename');
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)), temporary = `/proc/self/fd/${parent.fd}/.output-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
    let sourceFd, targetFd;
    try {
        let before;
        try {
            const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            try {
                before = regular(fd);
                if (expectedHash === null || hash(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd)) !== expectedHash)
                    throw new Error('Output changed since Save As.');
            }
            finally {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            }
        }
        catch (e) {
            if (e.code !== 'ENOENT' || expectedHash !== null)
                throw e;
        }
        sourceFd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(source, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        regular(sourceFd);
        targetFd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        const digest = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256'), buffer = Buffer.alloc(262144);
        let count;
        while ((count = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(sourceFd, buffer)) > 0) {
            const bytes = buffer.subarray(0, count);
            digest.update(bytes);
            let offset = 0;
            while (offset < count)
                offset += node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeSync(targetFd, bytes, offset, count - offset);
        }
        if (digest.digest('hex') !== expectedSourceHash)
            throw new Error('Validated private output changed before publication.');
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(targetFd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(targetFd);
        targetFd = undefined;
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        if (before) {
            const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
            if (stat.ino !== before.ino || stat.dev !== before.dev || !stat.isFile() || stat.nlink !== 1)
                throw new Error('Output identity changed.');
        }
        else {
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
                throw new Error('Output appeared after Save As.');
            }
            catch (e) {
                if (e.code !== 'ENOENT')
                    throw e;
            }
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        if (sourceFd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(sourceFd);
        if (targetFd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(targetFd);
        try {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().unlinkSync(temporary);
        }
        catch { }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function hashFile(file) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.hashFile(file);
    const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
    try {
        regular(fd);
        const digest = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256'), bytes = Buffer.alloc(262144);
        let n;
        while ((n = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(fd, bytes)) > 0)
            digest.update(bytes.subarray(0, n));
        return digest.digest('hex');
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
    }
}


/***/ },

/***/ "child_process"
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
(module) {

"use strict";
module.exports = require("child_process");

/***/ },

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

"use strict";
module.exports = require("electron");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

"use strict";
module.exports = require("fs");

/***/ },

/***/ "net"
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
(module) {

"use strict";
module.exports = require("net");

/***/ },

/***/ "node:child_process"
/*!*************************************!*\
  !*** external "node:child_process" ***!
  \*************************************/
(module) {

"use strict";
module.exports = require("node:child_process");

/***/ },

/***/ "node:crypto"
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
(module) {

"use strict";
module.exports = require("node:crypto");

/***/ },

/***/ "node:fs"
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
(module) {

"use strict";
module.exports = require("node:fs");

/***/ },

/***/ "node:module"
/*!******************************!*\
  !*** external "node:module" ***!
  \******************************/
(module) {

"use strict";
module.exports = require("node:module");

/***/ },

/***/ "node:path"
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
(module) {

"use strict";
module.exports = require("node:path");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("path");

/***/ },

/***/ "tty"
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
(module) {

"use strict";
module.exports = require("tty");

/***/ },

/***/ "util"
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("util");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __webpack_require__ !== 'undefined') __webpack_require__.ab = __dirname + "/native_modules/";
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/desktop/main.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../infrastructure/recovery-activation */ "./src/infrastructure/recovery-activation.ts");
/* harmony import */ var _infrastructure_confined_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../infrastructure/confined-fs */ "./src/infrastructure/confined-fs.ts");
/* harmony import */ var _infrastructure_recent_roots__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../infrastructure/recent-roots */ "./src/infrastructure/recent-roots.ts");
/* harmony import */ var _protection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./protection */ "./src/desktop/protection.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _protection_host_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./protection-host-client */ "./src/desktop/protection-host-client.ts");
/* harmony import */ var _presentation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./presentation */ "./src/desktop/presentation.ts");
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _workspace_host_client__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./workspace-host-client */ "./src/desktop/workspace-host-client.ts");
/* harmony import */ var _infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../infrastructure/universe-files */ "./src/infrastructure/universe-files.ts");
/* harmony import */ var _application_contracts_project__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../application/contracts/project */ "./src/application/contracts/project.ts");
/* harmony import */ var _project_host_client__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./project-host-client */ "./src/desktop/project-host-client.ts");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _universe_host_client__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./universe-host-client */ "./src/desktop/universe-host-client.ts");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! electron-squirrel-startup */ "./node_modules/electron-squirrel-startup/index.js");
/* harmony import */ var electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../application/contracts/readiness */ "./src/application/contracts/readiness.ts");
/* harmony import */ var _host_client__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./host-client */ "./src/desktop/host-client.ts");
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./security */ "./src/desktop/security.ts");






















const diagnostic = process.env.WRITINGTOOL_DIAGNOSTIC === '1';
const fault = diagnostic ? process.env.WRITINGTOOL_HOST_FAULT : undefined;
if (diagnostic && process.env.WRITINGTOOL_PROFILE)
    electron__WEBPACK_IMPORTED_MODULE_15__.app.setPath('userData', process.env.WRITINGTOOL_PROFILE);
let window;
let disposePresentation;
let child;
let client;
let universeClient;
let projectClient;
let workspaceClient;
let protectionClient;
let protectionInFlight = false;
const pendingProtection = new Map();
let activeProjectLocation;
let activeProjectIdentity;
let workspaceInFlight = false;
let workspaceReadCompletion;
const pendingWorkspace = new Map();
let projectInFlight = false;
let universeInFlight = false;
let pendingProjectCreation;
let hostExited = false;
let authorityRestorePending = false;
let drained = false;
let draining = false;
let quitPermit;
let quitDecisionInFlight = false;
const mutationLocations = new Map();
const unresolvedOperations = new Set();
function hasBlockingOperations() { return [...unresolvedOperations].some(id => { const operation = pendingProtection.get(id); return !operation || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(operation.request.command); }); }
function pendingProtectionPath(id) { return `protection/native-pending/${id}.json`; }
function savePendingProtection(id, value) { const root = electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'); (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(root, 'protection/native-pending'); const relative = pendingProtectionPath(id), old = node_fs__WEBPACK_IMPORTED_MODULE_17___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(root, relative)) ? (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(root, relative)) : null; (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(root, relative, Buffer.from((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(value)), old); }
function notifyPendingProtection() { if (window && !window.isDestroyed())
    window.webContents.send('writingtool:pending-protection-changed:v1'); }
function forgetPendingProtection(id) { const root = electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative = pendingProtectionPath(id); try {
    if (node_fs__WEBPACK_IMPORTED_MODULE_17___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(root, relative)))
        (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.removeManagedBytes)(root, relative, (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(root, relative)));
}
catch (error) {
    unresolvedOperations.add(id);
    throw error;
} const changed = pendingProtection.delete(id); unresolvedOperations.delete(id); if (changed)
    notifyPendingProtection(); }
function pendingProtectionState() { return { pending: [...pendingProtection.keys()], deferrable: [...pendingProtection].filter(([, pending]) => (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(pending.request.command)).map(([id]) => id), deferred: [...pendingProtection].filter(([, pending]) => pending.deferred).map(([id]) => id) }; }
function loadPendingProtection() {
    const root = electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData');
    node_fs__WEBPACK_IMPORTED_MODULE_17___default().mkdirSync(root, { recursive: true, mode: 0o700 });
    (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(root, 'protection/native-pending');
    for (const name of node_fs__WEBPACK_IMPORTED_MODULE_17___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(root, 'protection/native-pending'))) {
        const value = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(root, 'protection/native-pending/' + name));
        if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.closed)(value, ['request', 'project', 'universe', 'projectIdentity', 'universeIdentity', ...(typeof value === 'object' && value !== null && Object.hasOwn(value, 'dispatch') ? ['dispatch'] : []), ...(typeof value === 'object' && value !== null && Object.hasOwn(value, 'deferred') ? ['deferred'] : [])]) || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.validProtectionRequest)(value.request, true) || value.request.nativePrepareOnly || value.request.command === 'protection.defer' || Object.hasOwn(value, 'deferred') && (value.deferred !== true || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(value.request.command)) || name !== value.request.requestId + '.json' || Object.hasOwn(value, 'dispatch') && !['prepared', 'attempted'].includes(String(value.dispatch)) || ![value.projectIdentity, value.universeIdentity].every(identity => identity === null || (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.closed)(identity, ['id', 'rootId']) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(identity.id) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(identity.rootId)) || (value.project !== null && (typeof value.project !== 'string' || !node_path__WEBPACK_IMPORTED_MODULE_16___default().isAbsolute(value.project))) || (value.universe !== null && (typeof value.universe !== 'string' || !node_path__WEBPACK_IMPORTED_MODULE_16___default().isAbsolute(value.universe))))
            throw new Error('Pending protection metadata is invalid. Preserve application data for recovery.');
        const pending = { request: value.request, project: value.project, universe: value.universe, projectIdentity: value.projectIdentity, universeIdentity: value.universeIdentity, dispatch: value.dispatch === 'prepared' ? 'prepared' : 'attempted', ...(value.deferred === true ? { deferred: true } : {}) };
        pendingProtection.set(value.request.requestId, pending);
        if (!pending.deferred)
            unresolvedOperations.add(value.request.requestId);
    }
}
function rememberMutation(id, location, expected) {
    mutationLocations.set(id, { location, expected });
    unresolvedOperations.add(id);
    for (const oldId of mutationLocations.keys()) {
        if (mutationLocations.size <= 32)
            break;
        if (!unresolvedOperations.has(oldId))
            mutationLocations.delete(oldId);
    }
}
let activeLocation;
let activeSnapshot = null;
let diagnosticChooserCanceled = false;
let diagnosticLoseSaveAck = false;
let diagnosticLostReceipt;
let diagnosticDelaySaveAck = false;
let diagnosticAckRelease;
let shutdown = false;
let invalidRequestsRejected = false;
let permissionChecks = 0;
let permissionRequests = 0;
let hostErrors = 0;
function nativeModulePath() { return electron__WEBPACK_IMPORTED_MODULE_15__.app.isPackaged ? node_path__WEBPACK_IMPORTED_MODULE_16___default().join(process.resourcesPath, 'native/confined-fs', `${process.platform}-${process.arch}`, 'confined_fs.node') : node_path__WEBPACK_IMPORTED_MODULE_16___default().join(electron__WEBPACK_IMPORTED_MODULE_15__.app.getAppPath(), 'native/confined-fs/build/Release/confined_fs.node'); }
function launchApplicationHost(args = []) {
    node_fs__WEBPACK_IMPORTED_MODULE_17___default().mkdirSync(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), { recursive: true, mode: 0o700 });
    child = electron__WEBPACK_IMPORTED_MODULE_15__.utilityProcess.fork(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(__dirname, 'utility-host.cjs'), [...args, '--user-data=' + electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), '--writingtool-native-module=' + nativeModulePath()], { serviceName: 'WritingTool application host' });
    client = new _host_client__WEBPACK_IMPORTED_MODULE_20__.HostClient(child);
    universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_14__.UniverseHostClient(child);
    projectClient = new _project_host_client__WEBPACK_IMPORTED_MODULE_11__.ProjectHostClient(child);
    workspaceClient = new _workspace_host_client__WEBPACK_IMPORTED_MODULE_8__.WorkspaceHostClient(child);
    protectionClient = new _protection_host_client__WEBPACK_IMPORTED_MODULE_5__.ProtectionHostClient(child);
    hostExited = false;
    child.on('message', message => {
        if (typeof message === 'object' && message !== null && 'kind' in message && message.kind === 'protection.progress') {
            window?.webContents.send('writingtool:protection-progress:v1', message);
        }
        else if (typeof message === 'object' && message !== null && 'command' in message && String(message.command).startsWith('protection.'))
            protectionClient?.receive(message);
        else if (typeof message === 'object' && message !== null && 'command' in message && (String(message.command).startsWith('workspace.') || String(message.command).startsWith('settings.')))
            workspaceClient?.receive(message);
        else if (typeof message === 'object' && message !== null && 'command' in message && String(message.command).startsWith('project.'))
            projectClient?.receive(message);
        else if (typeof message === 'object' && message !== null && 'command' in message)
            universeClient?.receive(message);
        else
            client?.receive(message);
    });
    child.on('exit', () => { hostExited = true; client?.fail('HOST_EXITED'); universeClient?.fail(); projectClient?.fail(); workspaceClient?.fail(); protectionClient?.fail(); });
    child.on('error', () => { hostErrors++; client?.fail('HOST_EXITED'); universeClient?.fail(); projectClient?.fail(); workspaceClient?.fail(); protectionClient?.fail(); });
}
function authorized(event) {
    return !!window && !window.isDestroyed() && !!event.senderFrame && (0,_security__WEBPACK_IMPORTED_MODULE_21__.trustedSender)(event.sender.id, window.webContents.id, event.senderFrame === window.webContents.mainFrame, event.senderFrame.url, 'http://localhost:3000/main_window/index.html');
}
async function ensureApplicationHost(restoreActive = true) {
    if (fault || hasBlockingOperations() || pendingProjectCreation)
        return;
    if (hostExited) {
        launchApplicationHost();
        authorityRestorePending = !!(activeProjectLocation || activeLocation);
    }
    if (!restoreActive || !authorityRestorePending)
        return;
    if (activeProjectLocation) {
        const opened = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.open', basePath: activeProjectLocation, universePath: activeLocation });
        if (opened.status !== 'ok' || !opened.snapshot || opened.snapshot.ownerId !== activeProjectIdentity?.id || opened.snapshot.rootId !== activeProjectIdentity?.rootId || opened.snapshot.universe.ownerId !== activeSnapshot?.ownerId || opened.snapshot.universe.rootId !== activeSnapshot?.rootId)
            throw new Error('Reopen the saved project before continuing.');
    }
    else if (activeLocation) {
        const opened = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.open', basePath: activeLocation });
        if (opened.status !== 'ok' || !opened.snapshot || opened.snapshot.ownerId !== activeSnapshot?.ownerId || opened.snapshot.rootId !== activeSnapshot?.rootId)
            throw new Error('Reopen the saved universe before continuing.');
    }
    authorityRestorePending = false;
}
if ((electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_18___default()))
    electron__WEBPACK_IMPORTED_MODULE_15__.app.quit();
else
    electron__WEBPACK_IMPORTED_MODULE_15__.app.whenReady().then(async () => {
        try {
            if (fault === 'start')
                throw new Error('Diagnostic startup failure');
            (0,_infrastructure_confined_fs__WEBPACK_IMPORTED_MODULE_1__.configureConfinedFs)(nativeModulePath());
            loadPendingProtection();
            launchApplicationHost(fault ? [`--diagnostic-fault=${fault}`] : []);
            // Exercise Electron's documented FatalError event path without inducing a crash.
            if (fault === 'fatal-error')
                child.emit('error', 'FatalError', 'diagnostic', '{}');
        }
        catch {
            client = new _host_client__WEBPACK_IMPORTED_MODULE_20__.HostClient(undefined);
            universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_14__.UniverseHostClient(undefined);
            projectClient = new _project_host_client__WEBPACK_IMPORTED_MODULE_11__.ProjectHostClient(undefined);
            hostExited = true;
        }
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.on('writingtool:recovery-copies-request:v1', event => {
            if (!authorized(event))
                return;
            let count = 0;
            try {
                count = node_fs__WEBPACK_IMPORTED_MODULE_17___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), 'recovery/interrupted-close')).filter(id => (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(id) && node_fs__WEBPACK_IMPORTED_MODULE_17___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), 'recovery/interrupted-close', id, 'recovery.json'))).length;
            }
            catch { }
            event.sender.send('writingtool:recovery-copies:v1', count);
        });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.on('writingtool:recovery-folder:v1', event => {
            if (authorized(event))
                void electron__WEBPACK_IMPORTED_MODULE_15__.shell.openPath(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), 'recovery/interrupted-close')).catch(error => console.error('Could not open recovery copies', error));
        });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.on('writingtool:quit-request:v1', (event, value) => {
            if (authorized(event) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.closed)(value, ['protocolVersion', 'requestId', 'command', ...(typeof value === 'object' && value !== null && Object.hasOwn(value, 'recovery') ? ['recovery'] : [])]) && (!Object.hasOwn(value, 'recovery') || value.recovery === true) && value.protocolVersion === 1 && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(value.requestId) && value.command === 'application.quit')
                void requestNativeQuit('app', value.recovery === true);
        });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.handle(_security__WEBPACK_IMPORTED_MODULE_21__.READINESS_CHANNEL, (event, request) => {
            if (!authorized(event) || !(0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_19__.validRequest)(request))
                throw new Error('Readiness request denied');
            return client.request(request);
        });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.handle(_application_contracts_project__WEBPACK_IMPORTED_MODULE_10__.PROJECT_CHANNEL, async (event, value) => {
            if (!authorized(event) || !(0,_application_contracts_project__WEBPACK_IMPORTED_MODULE_10__.validProjectRequest)(value) || draining)
                throw new Error('Project request denied');
            await workspaceReadCompletion;
            if (draining)
                throw new Error('Project request denied');
            const request = value, base = { protocolVersion: 1, requestId: request.requestId, command: request.command };
            if (projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight || hasBlockingOperations() || (pendingProjectCreation && !['project.open', 'project.current'].includes(request.command)))
                return { ...base, status: 'error', code: 'RECOVERY_REQUIRED', message: 'Finish or reconcile the pending operation before changing projects.', outcome: pendingProjectCreation ? 'unknown' : 'not-committed', retry: 'after-recovery' };
            projectInFlight = true;
            let sent = false;
            try {
                await ensureApplicationHost(request.command === 'project.current' || request.command === 'project.close');
                let basePath, universePath;
                if (request.command === 'project.create' || request.command === 'project.open') {
                    if (request.command === 'project.create') {
                        const universe = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: 'Create project — 1 of 2: Choose the existing universe folder', properties: ['openDirectory'] });
                        if (universe.canceled || !universe.filePaths[0])
                            return { ...base, status: 'canceled' };
                        universePath = universe.filePaths[0];
                        try {
                            const descriptor = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(universePath, 'writingtool.json'));
                            if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.closed)(descriptor, ['schemaVersion', 'kind', 'id', 'rootId', 'creationOperationId']) || descriptor.schemaVersion !== 1 || descriptor.kind !== 'universe' || !(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(descriptor.id) || !(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(descriptor.rootId) || !(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(descriptor.creationOperationId))
                                throw new Error('Invalid universe discovery.');
                        }
                        catch {
                            return { ...base, status: 'error', code: 'VALIDATION', message: 'No project was created. First choose an existing universe folder containing writingtool.json. The empty project folder is selected in the next step.', outcome: 'not-committed', retry: 'new-request' };
                        }
                    }
                    const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: request.command === 'project.create' ? 'Create project — 2 of 2: Choose an empty project folder' : 'Open project folder', properties: ['openDirectory'] });
                    if (selected.canceled || !selected.filePaths[0])
                        return { ...base, status: 'canceled' };
                    basePath = selected.filePaths[0];
                }
                if (request.command === 'project.open' && hostExited && !fault)
                    launchApplicationHost();
                if (request.command === 'project.open' && pendingProjectCreation && !hostExited) {
                    projectClient?.fail();
                    projectClient = new _project_host_client__WEBPACK_IMPORTED_MODULE_11__.ProjectHostClient(child);
                }
                const hostRequest = { ...request, ...(basePath ? { basePath } : {}), ...(universePath ? { universePath } : {}), ...(pendingProjectCreation && request.command === 'project.open' ? { expectedCreationOperationId: pendingProjectCreation.operationId } : {}) };
                if (request.command === 'project.create')
                    pendingProjectCreation = { operationId: request.input.operationId, location: basePath };
                sent = true;
                let result = await projectClient.request(hostRequest);
                if (result.status === 'locate') {
                    const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: `Locate the project's universe (${result.universeId})`, properties: ['openDirectory'] });
                    if (selected.canceled || !selected.filePaths[0])
                        return { ...base, status: 'canceled' };
                    result = await projectClient.request({ ...hostRequest, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), universePath: selected.filePaths[0] });
                    result = { ...result, requestId: request.requestId };
                }
                if (result.status === 'locate')
                    return { ...base, status: 'error', code: 'INTEGRITY_MISMATCH', message: 'The matching universe could not be resolved.', outcome: 'not-committed', retry: 'new-request' };
                if (request.command === 'project.create' && !(result.status === 'error' && result.outcome !== 'not-committed'))
                    pendingProjectCreation = undefined;
                if (request.command === 'project.open' && result.status === 'ok')
                    pendingProjectCreation = undefined;
                if (result.status === 'ok') {
                    authorityRestorePending = false;
                    activeProjectLocation = result.snapshot?.location;
                    activeProjectIdentity = result.snapshot ? { id: result.snapshot.ownerId, rootId: result.snapshot.rootId } : undefined;
                    if (result.snapshot) {
                        activeSnapshot = result.snapshot.universe;
                        activeLocation = activeSnapshot.location;
                    }
                    if (result.snapshot)
                        try {
                            new _infrastructure_recent_roots__WEBPACK_IMPORTED_MODULE_2__.RecentRoots(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData')).remember({ kind: 'project', id: result.snapshot.ownerId }, result.snapshot.rootId, node_path__WEBPACK_IMPORTED_MODULE_16___default().basename(result.snapshot.location), result.snapshot.location);
                        }
                        catch (error) {
                            console.error('Could not update recent projects', error);
                        }
                }
                return result;
            }
            catch {
                if (!sent)
                    return { ...base, status: 'error', code: 'IO_FAILURE', message: 'The project folder chooser could not complete. Try again.', outcome: 'not-committed', retry: 'new-request' };
                return (0,_project_host_client__WEBPACK_IMPORTED_MODULE_11__.projectUnavailable)(request);
            }
            finally {
                projectInFlight = false;
            }
        });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.handle(_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.UNIVERSE_CHANNEL, async (event, value) => {
            if (!authorized(event) || !(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.validUniverseRequest)(value))
                throw new Error('Universe request denied');
            await workspaceReadCompletion;
            const original = (value.command === 'universe.profile.save' || value.command === 'universe.create') && unresolvedOperations.has(value.input.operationId) || value.command === 'universe.open' && !!value.reconcileOperationId;
            const busyResult = () => ({ protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', code: 'RECOVERY_REQUIRED', message: original || hasBlockingOperations() || pendingProjectCreation ? 'Reconcile the original pending operation before continuing. Your edits were retained.' : 'Another operation is finishing. Your edits were retained; retry in a moment.', outcome: original ? 'unknown' : 'not-committed', retry: original ? 'after-recovery' : 'new-request' });
            if (draining || projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight)
                return busyResult();
            universeInFlight = true;
            try {
                const request = value;
                const reconcilesPending = request.command === 'universe.open' && request.reconcileOperationId && mutationLocations.has(request.reconcileOperationId);
                if ((pendingProjectCreation || hasBlockingOperations()) && request.command !== 'universe.current' && !reconcilesPending)
                    return busyResult();
                await ensureApplicationHost(request.command === 'universe.current' || request.command === 'universe.profile.save' || request.command === 'universe.close');
                if (request.command === 'universe.create' || request.command === 'universe.open') {
                    const injected = diagnostic ? process.env.WRITINGTOOL_UNIVERSE_FOLDER : undefined;
                    let selection;
                    try {
                        selection = diagnostic && diagnosticChooserCanceled ? { canceled: true, filePaths: [] } : injected ? { canceled: false, filePaths: [injected] } : await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: request.command === 'universe.create' ? 'Choose an empty folder for the universe' : 'Open universe folder', properties: ['openDirectory'] });
                    }
                    catch {
                        return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The folder chooser could not open. Try selecting a location again.', outcome: 'not-committed', retry: 'new-request' };
                    }
                    if (selection.canceled || !selection.filePaths[0])
                        return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'canceled' };
                    let basePath;
                    try {
                        basePath = node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(selection.filePaths[0]);
                    }
                    catch {
                        return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The selected folder is unavailable. Your edits were retained.', outcome: request.command === 'universe.open' && request.reconcileOperationId ? 'unknown' : 'not-committed', retry: request.command === 'universe.open' && request.reconcileOperationId ? 'after-recovery' : 'new-request' };
                    }
                    const pending = request.command === 'universe.open' && request.reconcileOperationId ? mutationLocations.get(request.reconcileOperationId) : undefined;
                    if (request.command === 'universe.open' && request.reconcileOperationId && !pending)
                        return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'The original operation context is unavailable. Preserve the pending edits.', outcome: 'unknown', retry: 'after-recovery' };
                    if (request.command === 'universe.create')
                        rememberMutation(request.input.operationId, basePath, { identity: { creationOperationId: request.input.operationId }, mutation: { command: request.command, input: request.input } });
                    const result = await universeClient.request({ ...request, basePath, ...(pending ? { reconcileExpected: pending.expected } : {}) });
                    if (result.status === 'ok') {
                        activeLocation = result.snapshot?.location;
                        activeSnapshot = result.snapshot;
                        if (result.snapshot)
                            try {
                                new _infrastructure_recent_roots__WEBPACK_IMPORTED_MODULE_2__.RecentRoots(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData')).remember({ kind: 'universe', id: result.snapshot.ownerId }, result.snapshot.rootId, result.snapshot.profile.name, result.snapshot.location);
                            }
                            catch (error) {
                                console.error('Could not update recent universes', error);
                            }
                    }
                    if (request.command === 'universe.create' && !(result.status === 'error' && result.outcome === 'unknown'))
                        unresolvedOperations.delete(request.input.operationId);
                    if (result.status === 'ok' && ['universe.open', 'universe.create', 'universe.close'].includes(request.command))
                        authorityRestorePending = false;
                    if (request.command === 'universe.open' && result.status === 'ok' && request.reconcileOperationId)
                        unresolvedOperations.delete(request.reconcileOperationId);
                    return result;
                }
                if (request.command === 'universe.profile.save' && activeLocation && activeSnapshot)
                    rememberMutation(request.input.operationId, activeLocation, { identity: { ownerId: activeSnapshot.ownerId, rootId: activeSnapshot.rootId }, mutation: { command: request.command, input: request.input } });
                let result = await universeClient.request(request);
                if (result.status === 'ok') {
                    activeSnapshot = result.snapshot;
                    activeLocation = result.snapshot?.location;
                }
                if (diagnostic && diagnosticDelaySaveAck && request.command === 'universe.profile.save' && result.status === 'ok') {
                    diagnosticDelaySaveAck = false;
                    await new Promise(resolve => {
                        diagnosticAckRelease = () => {
                            diagnosticAckRelease = undefined;
                            resolve();
                        };
                    });
                }
                if (diagnostic && diagnosticLoseSaveAck && request.command === 'universe.profile.save' && result.status === 'ok') {
                    diagnosticLoseSaveAck = false;
                    diagnosticLostReceipt = result.receipt;
                    result = (0,_universe_host_client__WEBPACK_IMPORTED_MODULE_14__.hostUnavailable)(request);
                }
                if (request.command === 'universe.profile.save' && !(result.status === 'error' && result.outcome === 'unknown'))
                    unresolvedOperations.delete(request.input.operationId);
                return result;
            }
            finally {
                universeInFlight = false;
            }
        });
        const locateProtectionRoot = async (location, identity, kind) => {
            if (!location && !identity)
                return null;
            if (!location || !identity)
                throw new Error('The original protection participant identity is incomplete. Preserve its recovery metadata.');
            const matching = (folder) => { if (!folder)
                return null; try {
                const resolved = node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(folder), value = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(resolved, 'writingtool.json'));
                return value && typeof value === 'object' && 'kind' in value && 'id' in value && 'rootId' in value && value.kind === kind && value.id === identity.id && value.rootId === identity.rootId ? resolved : null;
            }
            catch {
                return null;
            } };
            const original = matching(location);
            if (original)
                return original;
            const chosen = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: `Locate the original ${kind} (${identity.id})`, properties: ['openDirectory'] });
            const resolved = matching(chosen.filePaths[0]);
            if (chosen.canceled || !resolved)
                throw new Error('The original owning identity is required. The protection operation remains pending.');
            return resolved;
        };
        let recoveredContextPending = false;
        const notifyRecoveredContext = () => { if (protectionInFlight)
            recoveredContextPending = true;
        else
            window?.webContents.send('writingtool:recovered-context:v1'); };
        const releaseProtectionAdmission = () => { protectionInFlight = false; notifyPendingProtection(); if (recoveredContextPending) {
            recoveredContextPending = false;
            notifyRecoveredContext();
        } };
        const synchronizeProtectionContext = async (notify = true) => {
            const [project, universe] = await Promise.all([
                projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.current' }),
                universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.current' }),
            ]);
            if (project.status !== 'ok' || universe.status !== 'ok') {
                if (notify)
                    notifyRecoveredContext();
                throw new Error('The active recovery participants could not be confirmed. Reopen the saved owning roots.');
            }
            if (project.snapshot && (!universe.snapshot || project.snapshot.universe.ownerId !== universe.snapshot.ownerId || project.snapshot.universe.rootId !== universe.snapshot.rootId))
                throw new Error('The active project and universe identities do not match.');
            activeProjectLocation = project.snapshot?.location;
            activeProjectIdentity = project.snapshot ? { id: project.snapshot.ownerId, rootId: project.snapshot.rootId } : undefined;
            activeLocation = universe.snapshot?.location;
            activeSnapshot = universe.snapshot;
            authorityRestorePending = false;
            if (notify)
                notifyRecoveredContext();
        };
        const runProtection = (0,_protection__WEBPACK_IMPORTED_MODULE_3__.nativeProtection)({ openRoot: async (owner, location) => { try {
                if (owner.kind === 'project') {
                    let result = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.open', basePath: location });
                    if (result.status === 'locate') {
                        const chosen = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: 'Locate matching universe', properties: ['openDirectory'] });
                        if (chosen.canceled || !chosen.filePaths[0])
                            throw new Error('The matching universe is required.');
                        result = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.open', basePath: location, universePath: chosen.filePaths[0] });
                    }
                    if (result.status !== 'ok' || !result.snapshot)
                        throw new Error(result.status === 'error' ? result.message : 'Project opening was not acknowledged.');
                    return { project: result.snapshot.location, universe: result.snapshot.universeLocation };
                }
                if (activeProjectLocation) {
                    const closed = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.close' });
                    if (closed.status !== 'ok')
                        throw new Error('Close the active project before changing universes.');
                }
                const opened = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.open', basePath: location });
                if (opened.status !== 'ok' || !opened.snapshot)
                    throw new Error(opened.status === 'error' ? opened.message : 'Universe opening was not acknowledged.');
                return { project: null, universe: opened.snapshot.location };
            }
            finally {
                await synchronizeProtectionContext(false);
            } }, window: () => window, originalRequest: id => pendingProtection.get(id)?.request, originalUniverse: id => { const pending = pendingProtection.get(id); return pending?.universe && pending.universeIdentity ? { owner: { kind: 'universe', id: pending.universeIdentity.id }, rootId: pending.universeIdentity.rootId, location: pending.universe } : undefined; }, roots: () => [activeProjectLocation, activeLocation].filter((p) => !!p), activeOwners: () => [...(activeProjectIdentity ? [{ kind: 'project', id: activeProjectIdentity.id }] : []), ...(activeSnapshot ? [{ kind: 'universe', id: activeSnapshot.ownerId }] : [])], sourceName: async (r) => { if (r.command === 'protection.export' && r.storyId) {
                const result = await workspaceClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'workspace.query' });
                if (result.status === 'ok') {
                    const story = result.snapshot.project?.records.find(record => record.recordType === 'story' && record.id === r.storyId);
                    if (story?.recordType === 'story')
                        return story.data.title;
                }
            } return r.command === 'protection.export' && r.owner.kind === 'project' && activeProjectLocation ? node_path__WEBPACK_IMPORTED_MODULE_16___default().basename(activeProjectLocation) : activeSnapshot?.profile.name ?? 'WritingTool'; }, settings: async () => { workspaceClient?.fail(); workspaceClient = new _workspace_host_client__WEBPACK_IMPORTED_MODULE_8__.WorkspaceHostClient(child); const result = await workspaceClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'settings.get' }); if (result.status !== 'ok' || !result.settings)
                throw new Error('Read backup settings before continuing.'); return result.settings; }, send: async (r) => {
                const persist = r.command !== 'protection.reconcile' && (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.protectionHasDurableEffects)(r);
                if (persist) {
                    const entry = { request: r, project: activeProjectLocation ?? null, universe: activeLocation ?? null, projectIdentity: activeProjectIdentity ?? null, universeIdentity: activeSnapshot ? { id: activeSnapshot.ownerId, rootId: activeSnapshot.rootId } : null, dispatch: 'prepared' };
                    // No ordinary command is posted until both native context and a no-effects
                    // utility job are durable. Prepared native records prove execution never began.
                    pendingProtection.set(r.requestId, entry);
                    savePendingProtection(r.requestId, entry);
                    const ready = await protectionClient.request({ ...r, nativePrepareOnly: true });
                    if (ready.status !== 'ok')
                        throw new Error(ready.status === 'error' ? ready.message : 'The protection job was not prepared. Reconcile before retrying.');
                    const attempted = { ...entry, dispatch: 'attempted' };
                    savePendingProtection(r.requestId, attempted);
                    pendingProtection.set(r.requestId, attempted);
                }
                return protectionClient.request(r);
            } });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.handle(_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.PROTECTION_CHANNEL, async (event, value) => {
            if (!authorized(event) || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.validProtectionRequest)(value))
                throw new Error('Protection request denied');
            if (draining)
                return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: 'Wait for normal closing to finish.', outcome: 'not-committed', operationId: null };
            if (value.command === 'protection.pending') {
                try {
                    const root = electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative = 'protection/proposals';
                    (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(root, relative);
                    const proposals = node_fs__WEBPACK_IMPORTED_MODULE_17___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(root, relative)).filter(name => name.endsWith('.json') && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.isUuid)(name.slice(0, -5))).map(name => name.slice(0, -5));
                    return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'ok', value: { ...pendingProtectionState(), proposals } };
                }
                catch (error) {
                    return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: error instanceof Error ? error.message : 'Pending recovery metadata could not be read.', outcome: 'not-committed', operationId: null };
                }
            }
            if (value.command === 'protection.cancel')
                return protectionClient.request(value);
            if (value.command === 'protection.defer') {
                const base = { protocolVersion: 1, requestId: value.requestId, command: value.command };
                if (protectionInFlight || workspaceInFlight || projectInFlight || universeInFlight)
                    return { ...base, status: 'error', message: 'Wait for the active operation before continuing.', outcome: 'not-committed', operationId: null };
                const pending = pendingProtection.get(value.operationId);
                if (!pending || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(pending.request.command))
                    return { ...base, status: 'error', message: 'This operation changes live writing and must be reconciled before continuing.', outcome: 'not-committed', operationId: null };
                protectionInFlight = true;
                try {
                    if (hostExited) {
                        launchApplicationHost();
                        if (activeProjectLocation) {
                            const opened = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.open', basePath: activeProjectLocation, universePath: activeLocation });
                            if (opened.status !== 'ok' || !opened.snapshot || opened.snapshot.ownerId !== activeProjectIdentity?.id || opened.snapshot.rootId !== activeProjectIdentity?.rootId)
                                throw new Error('Reopen the saved project before continuing writing.');
                        }
                        else if (activeLocation) {
                            const opened = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.open', basePath: activeLocation });
                            if (opened.status !== 'ok' || !opened.snapshot || opened.snapshot.ownerId !== activeSnapshot?.ownerId || opened.snapshot.rootId !== activeSnapshot?.rootId)
                                throw new Error('Reopen the saved universe before continuing writing.');
                        }
                        await synchronizeProtectionContext(false);
                    }
                    const deferred = { ...pending, deferred: true };
                    savePendingProtection(value.operationId, deferred);
                    pendingProtection.set(value.operationId, deferred);
                    unresolvedOperations.delete(value.operationId);
                    notifyPendingProtection();
                    if (!hasBlockingOperations() && !pendingProjectCreation)
                        notifyRecoveredContext();
                    return { ...base, status: 'ok', value: { ...pendingProtectionState(), warnings: ['The unfinished operation is retained for later reconciliation. It has not been marked complete.'] } };
                }
                catch (error) {
                    return { ...base, status: 'error', message: error instanceof Error ? error.message : 'The operation could not be set aside. Retry or reconcile it.', outcome: 'unknown', operationId: value.operationId };
                }
                finally {
                    releaseProtectionAdmission();
                }
            }
            // Listing recent roots has no authority effects and must remain available during recovery.
            if (value.command === 'protection.recents')
                return runProtection(value);
            if (value.command === 'protection.reconcile') {
                await workspaceReadCompletion;
                if (draining)
                    return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: 'Wait for normal closing to finish.', outcome: 'not-committed', operationId: null };
                if (protectionInFlight || workspaceInFlight || projectInFlight || universeInFlight)
                    return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: 'Wait for the active authority operation before reconciliation.', outcome: 'not-committed', operationId: null };
                protectionInFlight = true;
                try {
                    let pending = pendingProtection.get(value.operationId);
                    if (pending && (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(pending.request.command)) {
                        const current = activeProjectIdentity ?? (activeSnapshot ? { id: activeSnapshot.ownerId, rootId: activeSnapshot.rootId } : undefined), original = pending.projectIdentity ?? pending.universeIdentity;
                        if (current && (!original || !!activeProjectIdentity !== !!pending.projectIdentity || current.id !== original.id || current.rootId !== original.rootId))
                            return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: 'Open the original project or universe to reconcile this copy. You can continue writing in the current project.', outcome: 'not-committed', operationId: null };
                    }
                    if (pending?.dispatch === 'prepared' && !hostExited) {
                        // Execution was never sent; reset a failed preparation transport too.
                        protectionClient?.fail();
                        protectionClient = new _protection_host_client__WEBPACK_IMPORTED_MODULE_5__.ProtectionHostClient(child);
                        forgetPendingProtection(value.operationId);
                        notifyRecoveredContext();
                        return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'ok', value: { reconciliation: { operationId: value.operationId, outcome: 'not-committed' } } };
                    }
                    let moved = false;
                    if (pending) {
                        const project = await locateProtectionRoot(pending.project, pending.projectIdentity, 'project'), universe = await locateProtectionRoot(pending.universe, pending.universeIdentity, 'universe');
                        moved = project !== pending.project || universe !== pending.universe;
                        if (moved) {
                            const relocated = { ...pending, project, universe };
                            savePendingProtection(value.operationId, relocated);
                            pendingProtection.set(value.operationId, relocated);
                            pending = relocated;
                        }
                    }
                    moved = moved || !!(pending?.project && activeProjectLocation && activeProjectIdentity?.id === pending.projectIdentity?.id && activeProjectIdentity?.rootId === pending.projectIdentity?.rootId && activeProjectLocation !== pending.project) || !!(!pending?.project && pending?.universe && activeLocation && activeSnapshot?.ownerId === pending.universeIdentity?.id && activeSnapshot?.rootId === pending.universeIdentity?.rootId && activeLocation !== pending.universe);
                    const activationFile = node_path__WEBPACK_IMPORTED_MODULE_16___default().join(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_0__.activationPath)(value.operationId));
                    let activation = false;
                    if (pending?.request.command === 'protection.apply' && node_fs__WEBPACK_IMPORTED_MODULE_17___default().existsSync(activationFile)) {
                        const decision = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_0__.activationPath)(value.operationId)));
                        if (!(0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_0__.validActivationDecision)(decision) || decision.requestId !== value.operationId || decision.proposalId !== pending.request.proposalId)
                            throw new Error('Original activation evidence is invalid.');
                        activation = true;
                        // Published roots may have opened before a ZIP acknowledgement failed.
                        // Release a host holding their old VFS paths before native relocation.
                        for (const participant of decision.participants) {
                            const location = (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_0__.activationRootAt)(participant.stage, participant) ?? (0,_infrastructure_recovery_activation__WEBPACK_IMPORTED_MODULE_0__.activationRootAt)(participant.destination, participant);
                            const active = participant.owner.kind === 'project' ? activeProjectIdentity : activeSnapshot ? { id: activeSnapshot.ownerId, rootId: activeSnapshot.rootId } : undefined;
                            const activePath = participant.owner.kind === 'project' ? activeProjectLocation : activeLocation;
                            if (!location || active?.id === participant.owner.id && active.rootId === participant.rootId && activePath !== location)
                                moved = true;
                        }
                    }
                    if (moved && !hostExited && child) {
                        const original = child;
                        await new Promise((resolve, reject) => { const timer = setTimeout(() => { original.removeListener('exit', exited); reject(new Error('Wait for the original application host to release its authority before retrying.')); }, 15000); const exited = () => { clearTimeout(timer); resolve(); }; original.once('exit', exited); try {
                            original.kill();
                        }
                        catch (error) {
                            clearTimeout(timer);
                            original.removeListener('exit', exited);
                            reject(error);
                        } });
                    }
                    const hostRestarted = hostExited;
                    if (hostRestarted) {
                        launchApplicationHost();
                        if (activation) {
                            activeProjectLocation = undefined;
                            activeProjectIdentity = undefined;
                            activeLocation = undefined;
                            activeSnapshot = null;
                        }
                    }
                    else {
                        protectionClient?.fail();
                        protectionClient = new _protection_host_client__WEBPACK_IMPORTED_MODULE_5__.ProtectionHostClient(child);
                    }
                    // Activation owns reopening its staged participants before the live universe;
                    // either may need the other's coordinator journal during recovery.
                    if (!activation && pending?.project && (hostRestarted || moved || activeProjectLocation !== pending.project || activeProjectIdentity?.id !== pending.projectIdentity?.id || activeProjectIdentity?.rootId !== pending.projectIdentity?.rootId)) {
                        const opened = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.open', basePath: pending.project, universePath: pending.universe ?? undefined });
                        if (opened.status !== 'ok' || !opened.snapshot || opened.snapshot.ownerId !== pending.projectIdentity?.id || opened.snapshot.rootId !== pending.projectIdentity?.rootId || opened.snapshot.universe.ownerId !== pending.universeIdentity?.id || opened.snapshot.universe.rootId !== pending.universeIdentity?.rootId)
                            throw new Error('Reopen the original participants before protection reconciliation.');
                        activeProjectLocation = opened.snapshot.location;
                        activeProjectIdentity = { id: opened.snapshot.ownerId, rootId: opened.snapshot.rootId };
                        activeLocation = opened.snapshot.universeLocation;
                        activeSnapshot = opened.snapshot.universe;
                    }
                    else if (!activation && pending?.universe && (hostRestarted || moved || activeLocation !== pending.universe || activeSnapshot?.ownerId !== pending.universeIdentity?.id || activeSnapshot?.rootId !== pending.universeIdentity?.rootId)) {
                        const opened = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.open', basePath: pending.universe });
                        if (opened.status !== 'ok' || !opened.snapshot || opened.snapshot.ownerId !== pending.universeIdentity?.id || opened.snapshot.rootId !== pending.universeIdentity?.rootId)
                            throw new Error('Reopen the original universe before protection reconciliation.');
                        activeProjectLocation = undefined;
                        activeProjectIdentity = undefined;
                        activeLocation = opened.snapshot.location;
                        activeSnapshot = opened.snapshot;
                    }
                    if (pending?.dispatch === 'prepared') {
                        await synchronizeProtectionContext();
                        forgetPendingProtection(value.operationId);
                        return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'ok', value: { reconciliation: { operationId: value.operationId, outcome: 'not-committed' } } };
                    }
                    const result = await runProtection(value);
                    if (result.status === 'ok') {
                        await synchronizeProtectionContext();
                        forgetPendingProtection(value.operationId);
                    }
                    if (result.status !== 'ok' && pending && (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(pending.request.command))
                        await synchronizeProtectionContext();
                    if (result.status === 'error') {
                        return { ...result, outcome: 'unknown', operationId: value.operationId };
                    }
                    return result;
                }
                catch (error) {
                    if (pendingProtection.has(value.operationId) && !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.canDeferProtection)(pendingProtection.get(value.operationId).request.command))
                        unresolvedOperations.add(value.operationId);
                    else if (!hasBlockingOperations())
                        notifyRecoveredContext();
                    return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: error instanceof Error ? error.message : 'Protection reconciliation remains unconfirmed.', outcome: 'unknown', operationId: value.operationId };
                }
                finally {
                    releaseProtectionAdmission();
                }
            }
            if (protectionInFlight || workspaceInFlight || projectInFlight || universeInFlight || hasBlockingOperations())
                return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: 'Finish or reconcile the pending authority operation first.', outcome: 'not-committed', operationId: null };
            protectionInFlight = true;
            try {
                await ensureApplicationHost();
                const result = await runProtection(value);
                if (result.status === 'ok' && result.value.activated || value.command === 'protection.recent' && value.action !== 'remove')
                    await synchronizeProtectionContext();
                if (result.status === 'error' && result.outcome === 'unknown')
                    unresolvedOperations.add(value.requestId);
                else
                    forgetPendingProtection(value.requestId);
                return result;
            }
            catch (error) {
                const uncertain = pendingProtection.has(value.requestId);
                if (uncertain)
                    unresolvedOperations.add(value.requestId);
                return { protocolVersion: 1, requestId: value.requestId, command: value.command, status: 'error', message: error instanceof Error ? error.message : 'The native protection result could not be confirmed.', outcome: uncertain ? 'unknown' : 'not-committed', operationId: uncertain ? value.requestId : null };
            }
            finally {
                releaseProtectionAdmission();
            }
        });
        electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.handle(_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_7__.WORKSPACE_CHANNEL, async (event, value) => {
            if (!authorized(event) || !(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_7__.validWorkspaceRequest)(value))
                throw new Error('Workspace request denied');
            const request = value, base = { protocolVersion: 1, requestId: request.requestId, command: request.command };
            const original = request.command === 'workspace.reconcile' || request.command === 'workspace.mutate' && pendingWorkspace.has(request.input.operationId) || request.command === 'workspace.asset.import' && pendingWorkspace.has(request.operationId);
            const busyResult = () => ({ ...base, status: 'error', code: 'RECOVERY_REQUIRED', message: original || hasBlockingOperations() || pendingProjectCreation ? 'Reconcile the original pending operation before continuing. Your edits were retained.' : 'Another operation is finishing. Your edits were retained; retry in a moment.', outcome: original ? 'unknown' : 'not-committed', retry: original ? 'after-recovery' : 'new-request', issues: [] });
            if (draining || projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight)
                return busyResult();
            if ((hasBlockingOperations() || pendingProjectCreation) && request.command !== 'workspace.reconcile' && request.command !== 'settings.get' && request.command !== 'workspace.query')
                return busyResult();
            workspaceInFlight = true;
            let sent = false, completeRead;
            if (request.command === 'workspace.query' || request.command === 'settings.get')
                workspaceReadCompletion = new Promise(resolve => { completeRead = resolve; });
            try {
                await ensureApplicationHost();
                if (request.command === 'workspace.reconcile' && !fault) {
                    const pending = pendingWorkspace.get(request.operationId);
                    if (pending) {
                        const locate = async (original, identity, label) => { if (!identity)
                            return undefined; const valid = (folder) => { if (!folder)
                            return; try {
                            const resolved = node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(folder), d = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(node_fs__WEBPACK_IMPORTED_MODULE_17___default().readFileSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(resolved, 'writingtool.json')));
                            if (d.id === identity.id && d.rootId === identity.rootId)
                                return resolved;
                        }
                        catch { } return; }; const existing = valid(original); if (existing)
                            return existing; const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: `Locate the original ${label} (${identity.id})`, properties: ['openDirectory'] }); const chosen = valid(selected.filePaths[0]); if (selected.canceled || !chosen)
                            throw new Error('The original owning identity is required for reconciliation'); return chosen; };
                        const projectLocation = await locate(pending.projectLocation, pending.projectIdentity, 'project'), universeLocation = await locate(pending.universeLocation, pending.universeIdentity, 'universe');
                        const moved = projectLocation !== pending.projectLocation || universeLocation !== pending.universeLocation;
                        pending.projectLocation = projectLocation;
                        pending.universeLocation = universeLocation;
                        if (moved && !hostExited && child) {
                            const original = child;
                            await new Promise(resolve => { original.once('exit', () => resolve()); original.kill(); });
                        }
                        if (hostExited) {
                            launchApplicationHost();
                            if (projectLocation) {
                                const reopened = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.open', basePath: projectLocation, ...(universeLocation ? { universePath: universeLocation } : {}) });
                                if (reopened.status !== 'ok' || !reopened.snapshot || reopened.snapshot.ownerId !== pending.projectIdentity?.id || reopened.snapshot.rootId !== pending.projectIdentity?.rootId)
                                    throw new Error('Original project participants could not be reopened');
                            }
                            else if (universeLocation) {
                                const reopened = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.open', basePath: universeLocation });
                                if (reopened.status !== 'ok' || !reopened.snapshot || reopened.snapshot.ownerId !== pending.universeIdentity?.id || reopened.snapshot.rootId !== pending.universeIdentity?.rootId)
                                    throw new Error('Original universe could not be reopened');
                            }
                        }
                    }
                    else if (hostExited)
                        throw new Error('Original operation locations are unavailable');
                }
                if (request.command === 'workspace.reconcile' || request.command === 'settings.get' || request.command === 'workspace.query') {
                    workspaceClient?.fail();
                    workspaceClient = new _workspace_host_client__WEBPACK_IMPORTED_MODULE_8__.WorkspaceHostClient(hostExited ? undefined : child);
                }
                let internal = request;
                if (request.command === 'workspace.asset.import') {
                    const frozen = pendingWorkspace.get(request.operationId);
                    if (frozen)
                        internal = { ...frozen.request, requestId: request.requestId };
                    else {
                        const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: 'Choose profile image', properties: ['openFile'], filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }] });
                        if (selected.canceled || !selected.filePaths[0])
                            return { ...base, status: 'canceled' };
                        const bytes = node_fs__WEBPACK_IMPORTED_MODULE_17___default().readFileSync(selected.filePaths[0]);
                        const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255, webp = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
                        if ((!png && !jpeg && !webp) || electron__WEBPACK_IMPORTED_MODULE_15__.nativeImage.createFromBuffer(bytes).isEmpty())
                            return { ...base, status: 'error', code: 'VALIDATION', message: 'Choose a readable PNG, JPEG or WebP image. The previous image was retained.', outcome: 'not-committed', retry: 'new-request', issues: [] };
                        internal = { ...request, nativeAsset: { id: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), sha256: (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(bytes), mediaType: png ? 'image/png' : jpeg ? 'image/jpeg' : 'image/webp', base64: bytes.toString('base64') } };
                    }
                }
                if (request.command === 'settings.import') {
                    const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: 'Import settings', properties: ['openFile'], filters: [{ name: 'Settings', extensions: ['json'] }] });
                    if (selected.canceled || !selected.filePaths[0])
                        return { ...base, status: 'canceled' };
                    internal = { ...request, nativeSettings: (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(node_fs__WEBPACK_IMPORTED_MODULE_17___default().readFileSync(selected.filePaths[0])) };
                }
                if (request.command === 'settings.select-backup') {
                    const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: 'Choose backup destination', properties: ['openDirectory'] });
                    if (selected.canceled || !selected.filePaths[0])
                        return { ...base, status: 'canceled' };
                    internal = { ...request, nativeDestination: node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(selected.filePaths[0]) };
                }
                let exportPath;
                if (request.command === 'settings.export') {
                    const selected = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showSaveDialog(window, { title: 'Export settings', defaultPath: 'WritingTool-settings.json', filters: [{ name: 'Settings', extensions: ['json'] }], properties: ['showOverwriteConfirmation'] });
                    if (selected.canceled || !selected.filePath)
                        return { ...base, status: 'canceled' };
                    exportPath = selected.filePath;
                    const parent = node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().dirname(exportPath)), target = node_path__WEBPACK_IMPORTED_MODULE_16___default().join(parent, node_path__WEBPACK_IMPORTED_MODULE_16___default().basename(exportPath));
                    for (const root of [activeLocation, activeProjectLocation, electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData')].filter((p) => !!p)) {
                        const relative = node_path__WEBPACK_IMPORTED_MODULE_16___default().relative(node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(root), target);
                        if (!relative || relative !== '..' && !relative.startsWith('..' + (node_path__WEBPACK_IMPORTED_MODULE_16___default().sep)) && !node_path__WEBPACK_IMPORTED_MODULE_16___default().isAbsolute(relative))
                            throw new Error('Settings export cannot replace live application data');
                    }
                }
                if (request.command === 'workspace.mutate' || request.command === 'workspace.asset.import') {
                    const id = request.command === 'workspace.mutate' ? request.input.operationId : request.operationId;
                    pendingWorkspace.set(id, { request: internal, projectLocation: activeProjectLocation, universeLocation: activeLocation, projectIdentity: activeProjectIdentity, universeIdentity: activeSnapshot ? { id: activeSnapshot.ownerId, rootId: activeSnapshot.rootId } : undefined });
                    unresolvedOperations.add(id);
                }
                sent = true;
                let result = await workspaceClient.request(internal);
                if (result.status === 'ok' && exportPath && result.settings) {
                    const parent = node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().dirname(exportPath)), name = node_path__WEBPACK_IMPORTED_MODULE_16___default().basename(exportPath);
                    let expected = null;
                    try {
                        const stat = node_fs__WEBPACK_IMPORTED_MODULE_17___default().lstatSync(exportPath);
                        if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1)
                            throw new Error('Aliased export destination');
                        expected = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(node_fs__WEBPACK_IMPORTED_MODULE_17___default().readFileSync(exportPath));
                    }
                    catch (e) {
                        if (e.code !== 'ENOENT')
                            throw e;
                    }
                    ;(0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(parent, name, Buffer.from(JSON.stringify(result.settings, null, 2) + '\n'), expected);
                    result = { ...result, destination: exportPath };
                }
                const id = request.command === 'workspace.mutate' ? request.input.operationId : request.command === 'workspace.asset.import' || request.command === 'workspace.reconcile' ? request.operationId : undefined;
                if (request.command === 'workspace.reconcile' && result.status === 'ok') {
                    const original = pendingWorkspace.get(request.operationId);
                    if (original && ((original.projectIdentity && (!result.snapshot.project || result.snapshot.project.owner.id !== original.projectIdentity.id || result.snapshot.project.rootId !== original.projectIdentity.rootId)) || (original.universeIdentity && (!result.snapshot.universe || result.snapshot.universe.owner.id !== original.universeIdentity.id || result.snapshot.universe.rootId !== original.universeIdentity.rootId))))
                        return { ...base, status: 'error', code: 'INTEGRITY_MISMATCH', message: 'Reconciliation did not return the original owning identities. Preserve the pending operation.', outcome: 'unknown', retry: 'after-recovery', issues: [] };
                }
                if (request.command === 'workspace.reconcile' && result.status === 'ok') {
                    const original = pendingWorkspace.get(request.operationId);
                    if (original) {
                        activeProjectLocation = original.projectLocation;
                        activeLocation = original.universeLocation;
                    }
                }
                if (id && (request.command === 'workspace.reconcile' ? result.status === 'ok' : !(result.status === 'error' && result.outcome === 'unknown'))) {
                    unresolvedOperations.delete(id);
                    pendingWorkspace.delete(id);
                }
                if (result.status === 'ok' && activeLocation) {
                    const current = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.current' });
                    if (current.status === 'ok') {
                        activeSnapshot = current.snapshot;
                        activeLocation = current.snapshot?.location;
                    }
                }
                return result;
            }
            catch {
                return sent ? (0,_workspace_host_client__WEBPACK_IMPORTED_MODULE_8__.workspaceUnavailable)(request) : { ...base, status: 'error', code: 'IO_FAILURE', message: 'The native workspace selection or file operation could not complete. Existing content was retained.', outcome: 'not-committed', retry: 'new-request', issues: [] };
            }
            finally {
                workspaceInFlight = false;
                if (completeRead) {
                    workspaceReadCompletion = undefined;
                    completeRead();
                }
            }
        });
        disposePresentation = (0,_presentation__WEBPACK_IMPORTED_MODULE_6__.registerPresentation)(() => window, 'http://localhost:3000/main_window/index.html', '/home/jo/Documents/writing-tool/.webpack/renderer/main_window/preload.cjs');
        window = new electron__WEBPACK_IMPORTED_MODULE_15__.BrowserWindow({ width: 960, height: 680, minWidth: 360, minHeight: 360, backgroundColor: '#292929', show: false, webPreferences: { preload: '/home/jo/Documents/writing-tool/.webpack/renderer/main_window/preload.cjs', sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false, additionalArguments: diagnostic ? ['--writingtool-smoke'] : [] } });
        electron__WEBPACK_IMPORTED_MODULE_15__.powerMonitor.on('resume', () => { if (window && !window.isDestroyed())
            window.webContents.send('writingtool:system-resume:v1'); });
        window.webContents.on('console-message', (_event, _level, message) => {
            if (diagnostic && message === 'WRITINGTOOL_INVALID_REQUESTS true')
                invalidRequestsRejected = true;
        });
        window.removeMenu();
        window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
        window.webContents.on('will-navigate', event => event.preventDefault());
        window.webContents.on('will-redirect', event => event.preventDefault());
        window.webContents.on('will-attach-webview', event => event.preventDefault());
        window.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => {
            permissionRequests++;
            callback(false);
        });
        window.webContents.session.setPermissionCheckHandler(() => {
            permissionChecks++;
            return false;
        });
        window.webContents.on('will-prevent-unload', event => {
            if (drained)
                event.preventDefault();
        });
        window.on('close', event => {
            if (drained || quitPermit === 'window') {
                quitPermit = undefined;
                drained = true;
                return;
            }
            event.preventDefault();
            void requestNativeQuit('window');
        });
        window.on('closed', () => {
            client?.fail('UNAVAILABLE');
            window = undefined;
        });
        window.once('ready-to-show', () => window?.show());
        await window.loadURL('http://localhost:3000/main_window/index.html');
        const fallbackRelative = 'protection/close-fallback.json', fallbackRoot = electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData');
        if (!diagnostic && node_fs__WEBPACK_IMPORTED_MODULE_17___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_16___default().join(fallbackRoot, fallbackRelative))) {
            const bytes = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(fallbackRoot, fallbackRelative), notice = (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(bytes);
            if ((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.closed)(notice, ['schemaVersion', 'folder', 'createdAt', 'used', 'actualPath']) && notice.schemaVersion === 1 && notice.used === true && typeof notice.folder === 'string' && typeof notice.actualPath === 'string') {
                const answer = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showMessageBox(window, { type: 'info', title: 'Closing backup saved in another folder', message: 'Your required closing backup was saved at:\n' + notice.actualPath, detail: 'Choose a new backup destination for future backups.', buttons: ['Choose backup folder…', 'Remind me next launch'], defaultId: 0, cancelId: 1 });
                if (answer.response === 0) {
                    const chosen = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showOpenDialog(window, { title: 'Choose future backup folder', properties: ['openDirectory', 'createDirectory'] });
                    if (!chosen.canceled && chosen.filePaths[0]) {
                        const saved = await workspaceClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'settings.select-backup', nativeDestination: node_fs__WEBPACK_IMPORTED_MODULE_17___default().realpathSync(chosen.filePaths[0]) });
                        if (saved.status === 'ok')
                            (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.removeManagedBytes)(fallbackRoot, fallbackRelative, (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(bytes));
                    }
                }
            }
        }
        if (diagnostic)
            void smoke().catch(error => { console.error(error); console.log('WRITINGTOOL_SMOKE ' + JSON.stringify({ passed: false, fault: fault ?? 'none', error: error instanceof Error ? error.message : 'Diagnostic execution failed.' })); electron__WEBPACK_IMPORTED_MODULE_15__.app.exit(1); });
    }).catch(error => {
        console.error(error);
        electron__WEBPACK_IMPORTED_MODULE_15__.app.exit(1);
    });
async function smoke() {
    const waitForAuthorityIdle = async () => {
        let settled = 0;
        for (let attempt = 0; attempt < 250; attempt++) {
            settled = projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight ? 0 : settled + 1;
            if (settled === 2)
                return;
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        throw new Error('Diagnostic authority did not finish its background work.');
    };
    const deadline = Date.now() + 14000;
    let observed = {};
    while (Date.now() < deadline && window && !window.isDestroyed()) {
        observed = await window.webContents.executeJavaScript(`({state:document.querySelector('[data-readiness]')?.getAttribute('data-readiness'),text:document.querySelector('[data-readiness]')?.textContent,keys:Object.keys(window.writingTool || {}),node:typeof window.require,process:typeof window.process})`);
        if (observed.state === 'ready' || observed.state === 'unavailable')
            break;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (fault === 'exit-after-ready' && observed.state === 'ready') {
        child?.kill();
        while (Date.now() < deadline) {
            observed = await window.webContents.executeJavaScript(`({state:document.querySelector('[data-readiness]')?.getAttribute('data-readiness'),text:document.querySelector('[data-readiness]')?.textContent,keys:Object.keys(window.writingTool || {}),node:typeof window.require,process:typeof window.process})`);
            if (observed.state === 'unavailable')
                break;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    let universeFlow = undefined;
    if (!fault && process.env.WRITINGTOOL_UNIVERSE_FOLDER) {
        diagnosticChooserCanceled = true;
        const canceled = await window.webContents.executeJavaScript(`window.writingTool.openUniverse()`);
        diagnosticChooserCanceled = false;
        const presentation = await window.webContents.executeJavaScript(`(async () => {
            const tick=()=>new Promise(resolve=>setTimeout(resolve,70));
            const setName=(input,value)=>{ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value); input.dispatchEvent(new Event('input',{bubbles:true})); };
            Array.from(document.querySelectorAll('button')).find(button=>button.textContent==='Create universe').click(); await tick();
            let form=document.querySelector('.profile form'); form.requestSubmit(); await tick();
            const requiredName=!!document.querySelector('#name-error');
            let input=document.querySelector('.profile input'); setName(input,'Unsaved smoke draft'); await tick();
            document.dispatchEvent(new Event('writingtool-window-close')); await tick();
            const pendingGuard=document.querySelector('#pending-heading')?.textContent==='Save your changes?';
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click(); await tick();
            const preservedDraft=input.value==='Unsaved smoke draft';
            setName(input,'   '); await tick();
            Array.from(form.querySelectorAll('button')).find(button=>button.textContent==='Close').click(); await tick();
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Save')?.click(); await tick();
            const failedSaveRetains=!!document.querySelector('#name-error') && input.value==='   ';
            setName(input,'Discarded draft'); await tick();
            Array.from(form.querySelectorAll('button')).find(button=>button.textContent==='Close').click(); await tick();
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click(); await tick();
            const discarded=!document.querySelector('.profile');
            Array.from(document.querySelectorAll('button')).find(button=>button.textContent==='Create universe').click(); await tick();
            form=document.querySelector('.profile form'); input=document.querySelector('.profile input'); setName(input,'Smoke universe'); await tick(); form.requestSubmit();
            for(let i=0;i<100 && document.querySelector('#profile-heading')?.textContent!=='Universe profile';i++) await tick();
            const staysOpen=document.querySelector('#profile-heading')?.textContent==='Universe profile';
            return {requiredName,pendingGuard,preservedDraft,failedSaveRetains,discarded,staysOpen};
        })()`);
        await waitForAuthorityIdle();
        const created = await window.webContents.executeJavaScript('window.writingTool.currentUniverse()');
        if (created.status !== 'ok' || !created.snapshot)
            throw new Error('Diagnostic universe creation was not acknowledged.');
        const mouseClick = async (selector) => {
            await waitForAuthorityIdle();
            const point = await window.webContents.executeJavaScript(`(() => {const rect=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:Math.round(rect.x+rect.width/2),y:Math.round(rect.y+rect.height/2)};})()`);
            window.webContents.sendInputEvent({ type: 'mouseDown', button: 'left', clickCount: 1, ...point });
            window.webContents.sendInputEvent({ type: 'mouseUp', button: 'left', clickCount: 1, ...point });
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        await mouseClick('nav details:nth-child(2) summary');
        await mouseClick('[data-top-profile-close]');
        const mouseCloseProfile = await window.webContents.executeJavaScript(`!document.querySelector('.profile')`);
        await mouseClick('nav details:nth-child(2) summary');
        await mouseClick('[data-top-profile-edit]');
        const mouseEditProfile = await window.webContents.executeJavaScript(`!!document.querySelector('.profile') && !document.querySelector('header').inert`);
        diagnosticLoseSaveAck = true;
        await window.webContents.executeJavaScript(`(async () => {
            const input=document.querySelector('.profile input'), description=document.querySelector('.profile textarea');
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Saved smoke universe'); input.dispatchEvent(new Event('input',{bubbles:true}));
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(description,'Persisted through the secured utility host.'); description.dispatchEvent(new Event('input',{bubbles:true}));
            await new Promise(resolve=>setTimeout(resolve,70));
        })()`);
        await mouseClick('nav details:nth-child(2) summary');
        const mouseMenuUsable = await window.webContents.executeJavaScript(`document.querySelector('nav details:nth-child(2)').open && !document.querySelector('[data-top-profile-save]').disabled`);
        await mouseClick('[data-top-profile-save]');
        const recovery = await window.webContents.executeJavaScript(`(async () => {
            const tick=()=>new Promise(resolve=>setTimeout(resolve,70));
            const input=document.querySelector('.profile input');
            for(let i=0;i<100 && !document.querySelector('#error-heading');i++) await tick();
            const unknownRetained=!!document.querySelector('#error-heading') && document.querySelector('[data-profile-save]').disabled;
            document.dispatchEvent(new Event('writingtool-window-close')); await tick();
            const ordinaryDiscardBlocked=!document.querySelector('#pending-heading') && input.value==='Saved smoke universe';
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Return to editor')?.click();
            return {unknownRetained,ordinaryDiscardBlocked};
        })()`);
        await mouseClick('nav details:nth-child(2) summary');
        recovery.mouseReconcile = await window.webContents.executeJavaScript(`!document.querySelector('[data-top-reconcile]').disabled`);
        await mouseClick('[data-top-reconcile]');
        recovery.reconciled = await window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100 && document.querySelector('[data-profile-save]').disabled;i++)await new Promise(resolve=>setTimeout(resolve,70));return !document.querySelector('#error-heading')&&!document.querySelector('[data-profile-save]').disabled&&document.querySelector('.profile input').value==='Saved smoke universe';})()`);
        const delayedAck = async (departure, submittedName, newerName) => {
            diagnosticDelaySaveAck = true;
            await window.webContents.executeJavaScript(`(async () => {
                const input=document.querySelector('.profile input');
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(submittedName)}); input.dispatchEvent(new Event('input',{bubbles:true}));
                await new Promise(resolve=>setTimeout(resolve,70));
                if(${departure}) {document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Save').click();}
                else document.querySelector('[data-top-profile-save]').click();
            })()`);
            for (let i = 0; i < 100 && !diagnosticAckRelease; i++)
                await new Promise(resolve => setTimeout(resolve, 30));
            if (!diagnosticAckRelease)
                return false;
            await window.webContents.executeJavaScript(`(() => {const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(newerName)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
            diagnosticAckRelease();
            return window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100 && document.querySelector('[data-profile-save]').disabled;i++)await new Promise(resolve=>setTimeout(resolve,30));const retained=!!document.querySelector('.profile')&&document.querySelector('.profile input').value===${JSON.stringify(newerName)};document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));const dirty=!!document.querySelector('#pending-heading');Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click();return retained&&dirty;})()`);
        };
        const typingAfterSave = await delayedAck(false, 'First delayed submission', 'Newer retained draft');
        const departureSaveRetainsNewer = await delayedAck(true, 'Departure submitted draft', 'Even newer retained draft');
        await window.webContents.executeJavaScript(`(async()=>{document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard').click();})()`);
        const exactDescription = '  Exact\r\n Ω🌌 \t';
        await waitForAuthorityIdle();
        const exactSaved = await window.webContents.executeJavaScript(`(async()=>{const current=await window.writingTool.currentUniverse();const s=current.snapshot;return window.writingTool.saveUniverseProfile({operationId:crypto.randomUUID(),ownerId:s.ownerId,expectedUnitGeneration:s.generation,expectedRecordVersion:s.recordVersion,submittedEditorRevision:'999',data:{name:'Saved smoke universe',description:${JSON.stringify(exactDescription)}}});})()`);
        const exactDescriptionSaved = exactSaved.status === 'ok' && exactSaved.snapshot?.profile.description === exactDescription;
        diagnosticChooserCanceled = true;
        const activeCancellation = await window.webContents.executeJavaScript(`(async () => { const before=await window.writingTool.currentUniverse(); const result=await window.writingTool.openUniverse(); const after=await window.writingTool.currentUniverse(); return result.status==='canceled' && JSON.stringify(before.snapshot)===JSON.stringify(after.snapshot); })()`);
        diagnosticChooserCanceled = false;
        const closed = await window.webContents.executeJavaScript('window.writingTool.closeUniverse()');
        const oldChild = child;
        const exited = new Promise(resolve => oldChild?.once('exit', resolve));
        oldChild?.kill();
        await exited;
        const reopened = await window.webContents.executeJavaScript(`window.writingTool.openUniverse()`);
        await window.webContents.executeJavaScript(`(async()=>{await window.writingTool.closeUniverse();document.dispatchEvent(new Event('writingtool-recovered-context'));await new Promise(resolve=>setTimeout(resolve,150));Array.from(document.querySelectorAll('nav button')).find(button=>button.textContent.startsWith('New universe')).click();await new Promise(resolve=>setTimeout(resolve,70));const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Unsaved native close draft');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
        const cancelNative = async (kind) => {
            if (kind === 'window')
                window.close();
            else
                electron__WEBPACK_IMPORTED_MODULE_15__.app.quit();
            const preserved = await window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));const retained=!!document.querySelector('#pending-heading')&&document.querySelector('.profile input')?.value==='Unsaved native close draft';Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click();return retained;})()`);
            await new Promise(resolve => setTimeout(resolve, 70));
            return preserved && !!window && !window.isDestroyed();
        };
        const nativeWindowCancel = await cancelNative('window');
        const nativeAppCancel = await cancelNative('app');
        universeFlow = {
            passed: nativeWindowCancel && nativeAppCancel && canceled.status === 'canceled' && activeCancellation && Object.values(presentation).every(Boolean) && Object.values(recovery).every(Boolean) && mouseCloseProfile && mouseEditProfile && mouseMenuUsable && created.status === 'ok' && closed.status === 'ok' && reopened.status === 'ok' && reopened.snapshot?.ownerId === created.snapshot?.ownerId && reopened.snapshot?.profile?.name === 'Saved smoke universe' && reopened.snapshot?.generation === exactSaved.snapshot?.generation && reopened.snapshot?.profile.description === exactDescription && exactDescriptionSaved && typingAfterSave && departureSaveRetainsNewer,
            receipt: diagnosticLostReceipt, nativeWindowCancel, nativeAppCancel, presentation, typingAfterSave, departureSaveRetainsNewer, exactDescriptionSaved, topCommands: { mouseCloseProfile, mouseEditProfile, mouseMenuUsable, mouseSave: recovery.unknownRetained, mouseReconcile: recovery.mouseReconcile }, recovery, activeCancellation, reopened,
            nativePickerBoundary: 'explicit diagnostic selection and cancellation',
            acknowledgmentBoundary: 'explicit diagnostic loss after durable host reply'
        };
    }
    const expected = fault ? 'unavailable' : 'ready';
    const untrusted = new electron__WEBPACK_IMPORTED_MODULE_15__.BrowserWindow({ show: false, webPreferences: { preload: '/home/jo/Documents/writing-tool/.webpack/renderer/main_window/preload.cjs', sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await untrusted.loadURL('http://localhost:3000/main_window/index.html');
    const untrustedResult = await untrusted.webContents.executeJavaScript('window.writingTool.readiness()');
    const untrustedUniverse = await untrusted.webContents.executeJavaScript('window.writingTool.currentUniverse()');
    const untrustedWorkspace = await untrusted.webContents.executeJavaScript("window.writingTool.workspace({command:'workspace.query'})");
    const untrustedProtection = await untrusted.webContents.executeJavaScript("window.writingTool.protection({command:'protection.pending'})");
    const senderDenied = untrustedUniverse.status === 'error' && untrustedUniverse.code === 'HOST_UNAVAILABLE' && untrustedWorkspace.status === 'error' && untrustedWorkspace.code === 'HOST_UNAVAILABLE' && untrustedProtection.status === 'error' && untrustedResult.status === 'unavailable' && untrustedResult.code === 'UNAVAILABLE';
    untrusted.destroy();
    const checksBefore = permissionChecks;
    const requestsBefore = permissionRequests;
    const permissions = await window.webContents.executeJavaScript(`Promise.race([
    (async () => {
      const query = await navigator.permissions.query({name: 'geolocation'});
      const request = await new Promise(resolve => navigator.geolocation.getCurrentPosition(
        () => resolve('granted'), error => resolve(error.code === 1 ? 'denied' : 'error'),
        {timeout: 1000, maximumAge: 0}
      ));
      return {query: query.state, request};
    })(),
    new Promise(resolve => setTimeout(() => resolve({query: 'timeout', request: 'timeout'}), 2000))
  ])`);
    const permissionsDenied = permissions.query === 'denied' && permissions.request === 'denied' && permissionChecks > checksBefore && permissionRequests > requestsBefore;
    const before = window.webContents.getURL();
    const windowCount = electron__WEBPACK_IMPORTED_MODULE_15__.BrowserWindow.getAllWindows().length;
    await window.webContents.executeJavaScript(`window.open('https://example.invalid'); location.href='https://example.invalid';`);
    await new Promise(resolve => setTimeout(resolve, 150));
    const security = observed.node === 'undefined' && observed.process === 'undefined' && JSON.stringify(observed.keys) === '["protection","workspace","createProject","openProject","currentProject","closeProject","createUniverse","openUniverse","currentUniverse","saveUniverseProfile","closeUniverse","readiness"]' && window.webContents.getURL() === before && electron__WEBPACK_IMPORTED_MODULE_15__.BrowserWindow.getAllWindows().length === windowCount;
    const expectedCode = { start: 'HOST_START_FAILED', exit: 'HOST_EXITED', invalid: 'INVALID_RESPONSE', timeout: 'TIMEOUT', 'exit-after-ready': 'HOST_EXITED', 'fatal-error': 'HOST_EXITED' }[fault ?? ''];
    const universePassed = !universeFlow || universeFlow.passed;
    const passed = universePassed && observed.state === expected && client?.pendingCount === 0 && security && senderDenied && invalidRequestsRejected && permissionsDenied && (fault !== 'fatal-error' || hostErrors === 1) && (!expectedCode || String(observed.text).includes(expectedCode));
    console.log('WRITINGTOOL_SMOKE ' + JSON.stringify({ passed, packaged: electron__WEBPACK_IMPORTED_MODULE_15__.app.isPackaged, fault: fault ?? 'none', observed, security, senderDenied, invalidRequestsRejected, permissionsDenied, permissionChecks, permissionRequests, hostErrors, pending: client?.pendingCount, universeFlow, versions: process.versions }));
    if (!passed) {
        electron__WEBPACK_IMPORTED_MODULE_15__.app.exit(1);
        return;
    }
    // Success exits through the same production dirty decision and host drain.
    electron__WEBPACK_IMPORTED_MODULE_15__.app.quit();
    if (window && !window.isDestroyed())
        await window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click();})()`).catch(() => {
        });
}
let recoveryQuitInFlight = false;
async function quitAfterError(reason) {
    if (recoveryQuitInFlight || drained)
        return;
    recoveryQuitInFlight = true;
    const directory = node_path__WEBPACK_IMPORTED_MODULE_16___default().join(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), 'recovery', 'interrupted-close', (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)());
    let ownsDrain = false;
    try {
        const answer = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showMessageBox(window, { type: 'warning', title: 'Quit application?', message: reason, detail: 'You can quit now. The last operation will remain unconfirmed. Current drafts and recovery details will be kept in:\n' + directory, buttons: ['Keep application open', 'Quit application'], defaultId: 0, cancelId: 0, noLink: true });
        if (answer.response !== 1 || drained)
            return;
        ownsDrain = !draining;
        draining = true;
        try {
            let drafts = [], collectionError = null;
            if (window && !window.isDestroyed())
                try {
                    let timer;
                    try {
                        drafts = await Promise.race([window.webContents.executeJavaScript(`(()=>{
                    document.body.inert=true;
                    const detail={drafts:[]};document.dispatchEvent(new CustomEvent('writingtool-collect-recovery',{detail}));
                    detail.drafts.push({kind:'visible-editors',value:[...document.querySelectorAll('textarea,input:not([type=password]),[contenteditable=true]')].map(editor=>({label:editor.getAttribute('aria-label')||editor.getAttribute('name')||editor.id,text:'value'in editor?editor.value:editor.innerText,html:editor.isContentEditable?editor.innerHTML:null}))});
                    return detail.drafts;
                })()`), new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('The editor did not respond while collecting drafts.')), 5000); })]);
                    }
                    finally {
                        clearTimeout(timer);
                    }
                }
                catch (error) {
                    collectionError = error instanceof Error ? error.message : 'Editor drafts could not be read.';
                }
            if (!Array.isArray(drafts) || !['profile', 'workspace'].every(kind => drafts.some(entry => entry?.kind === kind && Object.hasOwn(entry, 'value'))) || drafts.some(entry => entry?.error))
                collectionError = 'Some editor state could not be collected. Available draft data has been retained.';
            const copy = { schemaVersion: 1, createdAt: new Date().toISOString(), reason, drafts, collectionError, activeProjectLocation, activeProjectIdentity, activeLocation, activeSnapshot, pendingProjectCreation, mutations: [...mutationLocations], workspace: [...pendingWorkspace], protection: [...pendingProtection], unresolved: [...unresolvedOperations] };
            const relative = node_path__WEBPACK_IMPORTED_MODULE_16___default().relative(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), directory).split((node_path__WEBPACK_IMPORTED_MODULE_16___default().sep)).join('/');
            (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative);
            (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative + '/recovery.json', Buffer.from(JSON.stringify(copy, null, 2) + '\n'), null);
            if (Array.isArray(drafts))
                for (const [index, entry] of drafts.entries()) {
                    if (!entry || typeof entry !== 'object' || !entry.value || typeof entry.value !== 'object')
                        continue;
                    if (entry.kind === 'workspace')
                        for (const kind of ['writing', 'draft']) {
                            const draft = entry.value[kind];
                            if (draft && typeof draft.text === 'string')
                                (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative + `/${kind}-${index}.txt`, Buffer.from(draft.text), null);
                        }
                    if (entry.kind === 'visible-editors' && Array.isArray(entry.value))
                        for (const [editorIndex, editor] of entry.value.entries())
                            if (typeof editor.text === 'string')
                                (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative + `/editor-${index}-${editorIndex}.txt`, Buffer.from(editor.text), null);
                    if (entry.kind === 'profile' && entry.value.editor && entry.value.draft)
                        (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(electron__WEBPACK_IMPORTED_MODULE_15__.app.getPath('userData'), relative + '/profile.txt', Buffer.from(String(entry.value.draft.name) + '\n\n' + String(entry.value.draft.description)), null);
                }
            if (collectionError)
                throw new Error('Recovery details were saved, but editor drafts could not be collected.');
        }
        catch (error) {
            const withoutCopy = await electron__WEBPACK_IMPORTED_MODULE_15__.dialog.showMessageBox(window, { type: 'warning', title: 'Recovery copy could not be completed', message: error instanceof Error ? error.message : 'The recovery copy could not be written.', detail: 'Existing saved files and recovery records will be kept. Unsaved edits may be lost if you quit without a recovery copy.', buttons: ['Keep application open', 'Quit without recovery copy'], defaultId: 0, cancelId: 0, noLink: true });
            if (withoutCopy.response !== 1) {
                if (ownsDrain)
                    draining = false;
                void window?.webContents.executeJavaScript('document.body.inert=false').catch(() => { });
                return;
            }
        }
        // An explicit error exit retains journals and pending inputs, then releases
        // the host through the usual before-quit cleanup. It never fabricates an ack.
        try {
            disposePresentation?.();
        }
        catch (error) {
            console.error('Could not close floating panels', error);
        }
        disposePresentation = undefined;
        quitPermit = 'app';
        drained = true;
        electron__WEBPACK_IMPORTED_MODULE_15__.app.quit();
    }
    finally {
        recoveryQuitInFlight = false;
        if (ownsDrain && !drained)
            draining = false;
    }
}
async function requestNativeQuit(kind, recovery = false) {
    if (recovery) {
        await quitAfterError('An error is preventing normal closing.');
        return;
    }
    if (quitDecisionInFlight || draining) {
        await quitAfterError('Closing has not finished. You can keep waiting or quit with a recovery copy.');
        return;
    }
    quitDecisionInFlight = true;
    let authorityReleased = false;
    try {
        const owned = window;
        if (owned && !owned.isDestroyed()) {
            const token = (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)();
            const approved = await owned.webContents.executeJavaScript(`new Promise(resolve => {
                const token=${JSON.stringify(token)};
                const listener=event=>{if(event.detail?.token!==token)return;document.removeEventListener('writingtool-quit-decision',listener);resolve(event.detail.approved===true);};
                document.addEventListener('writingtool-quit-decision',listener);
                document.dispatchEvent(new CustomEvent('writingtool-window-close',{detail:{token}}));
            })`);
            if (!approved)
                return;
        }
        await workspaceReadCompletion;
        if (hasBlockingOperations() || pendingProjectCreation || projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight) {
            await quitAfterError(hasBlockingOperations() || pendingProjectCreation ? 'The last operation needs recovery before normal closing.' : 'An operation is still running and normal closing could not finish.');
            return;
        }
        draining = true;
        if (!hostExited && (activeProjectLocation || activeLocation)) {
            // Reuse the same process, never create replacement authority. A
            // failed readiness/transport client is not a shutdown acknowledgment.
            universeClient?.fail();
            universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_14__.UniverseHostClient(child);
            projectClient?.fail();
            projectClient = new _project_host_client__WEBPACK_IMPORTED_MODULE_11__.ProjectHostClient(child);
            const projectResult = await projectClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'project.close' });
            if (projectResult.status !== 'ok' && !hostExited) {
                await quitAfterError(projectResult.status === 'error' ? projectResult.message : 'Project shutdown was not acknowledged.');
                return;
            }
            if (projectResult.status === 'ok') {
                authorityReleased ||= !!activeProjectLocation;
                activeProjectLocation = undefined;
                activeProjectIdentity = undefined;
            }
            const result = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_12__.randomUUID)(), command: 'universe.close' });
            if (result.status !== 'ok' && !hostExited) {
                await quitAfterError(result.status === 'error' ? result.message : 'Universe shutdown was not acknowledged.');
                return;
            }
            if (result.status === 'ok') {
                authorityReleased ||= !!activeLocation;
                activeLocation = undefined;
                activeSnapshot = null;
            }
        }
        if (diagnostic)
            console.log('WRITINGTOOL_DRAIN ' + JSON.stringify({ kind, hostAlreadyExited: hostExited, unresolved: unresolvedOperations.size, drained: true }));
        disposePresentation?.();
        disposePresentation = undefined;
        quitPermit = kind;
        if (kind === 'window' && window && !window.isDestroyed())
            window.close();
        else
            electron__WEBPACK_IMPORTED_MODULE_15__.app.quit();
    }
    catch (error) {
        console.error('Normal close remains pending', error);
        await quitAfterError(error instanceof Error ? error.message : 'Normal closing could not finish.');
    }
    finally {
        draining = false;
        quitDecisionInFlight = false;
        if (!drained && window && !window.isDestroyed()) {
            window.webContents.send('writingtool:close-aborted:v1', authorityReleased);
        }
    }
}
electron__WEBPACK_IMPORTED_MODULE_15__.app.on('before-quit', event => {
    if (drained || quitPermit === 'app') {
        quitPermit = undefined;
        drained = true;
        if (!shutdown) {
            shutdown = true;
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeHandler(_security__WEBPACK_IMPORTED_MODULE_21__.READINESS_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeHandler(_application_contracts_universe__WEBPACK_IMPORTED_MODULE_13__.UNIVERSE_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeHandler(_application_contracts_project__WEBPACK_IMPORTED_MODULE_10__.PROJECT_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeHandler(_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_7__.WORKSPACE_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeHandler(_application_contracts_protection__WEBPACK_IMPORTED_MODULE_4__.PROTECTION_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeAllListeners('writingtool:quit-request:v1');
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeAllListeners('writingtool:recovery-copies-request:v1');
            electron__WEBPACK_IMPORTED_MODULE_15__.ipcMain.removeAllListeners('writingtool:recovery-folder:v1');
            client?.fail('UNAVAILABLE');
            child?.kill();
        }
        return;
    }
    event.preventDefault();
    void requestNativeQuit('app');
});
electron__WEBPACK_IMPORTED_MODULE_15__.app.on('window-all-closed', () => electron__WEBPACK_IMPORTED_MODULE_15__.app.quit());

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.cjs.map