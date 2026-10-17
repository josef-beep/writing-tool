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
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/desktop/main.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _universe_host_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./universe-host-client */ "./src/desktop/universe-host-client.ts");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! electron-squirrel-startup */ "./node_modules/electron-squirrel-startup/index.js");
/* harmony import */ var electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../application/contracts/readiness */ "./src/application/contracts/readiness.ts");
/* harmony import */ var _host_client__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./host-client */ "./src/desktop/host-client.ts");
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./security */ "./src/desktop/security.ts");










const diagnostic = process.env.WRITINGTOOL_DIAGNOSTIC === '1';
const fault = diagnostic ? process.env.WRITINGTOOL_HOST_FAULT : undefined;
if (diagnostic && process.env.WRITINGTOOL_PROFILE)
    electron__WEBPACK_IMPORTED_MODULE_3__.app.setPath('userData', process.env.WRITINGTOOL_PROFILE);
let window;
let child;
let client;
let universeClient;
let hostExited = false;
let drained = false;
let draining = false;
let quitPermit;
let quitDecisionInFlight = false;
const mutationLocations = new Map();
const unresolvedOperations = new Set();
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
function authorized(event) {
    return !!window && !window.isDestroyed() && !!event.senderFrame && (0,_security__WEBPACK_IMPORTED_MODULE_9__.trustedSender)(event.sender.id, window.webContents.id, event.senderFrame === window.webContents.mainFrame, event.senderFrame.url, 'http://localhost:3000/main_window/index.html');
}
if ((electron_squirrel_startup__WEBPACK_IMPORTED_MODULE_6___default()))
    electron__WEBPACK_IMPORTED_MODULE_3__.app.quit();
else
    electron__WEBPACK_IMPORTED_MODULE_3__.app.whenReady().then(async () => {
        try {
            if (fault === 'start')
                throw new Error('Diagnostic startup failure');
            child = electron__WEBPACK_IMPORTED_MODULE_3__.utilityProcess.fork(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(__dirname, 'utility-host.cjs'), fault ? [`--diagnostic-fault=${fault}`] : [], { serviceName: 'WritingTool application host' });
            client = new _host_client__WEBPACK_IMPORTED_MODULE_8__.HostClient(child);
            universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_2__.UniverseHostClient(child);
            child.on('message', message => {
                if (typeof message === 'object' && message !== null && 'command' in message)
                    universeClient?.receive(message);
                else
                    client?.receive(message);
            });
            child.on('exit', () => {
                hostExited = true;
                client?.fail('HOST_EXITED');
                universeClient?.fail();
            });
            child.on('error', () => {
                hostErrors++;
                client?.fail('HOST_EXITED');
                universeClient?.fail();
            });
            // Exercise Electron's documented FatalError event path without inducing a crash.
            if (fault === 'fatal-error')
                child.emit('error', 'FatalError', 'diagnostic', '{}');
        }
        catch {
            client = new _host_client__WEBPACK_IMPORTED_MODULE_8__.HostClient(undefined);
            universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_2__.UniverseHostClient(undefined);
            hostExited = true;
        }
        electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on('writingtool:quit-request:v1', (event, value) => {
            if (authorized(event) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_1__.closed)(value, ['protocolVersion', 'requestId', 'command']) && value.protocolVersion === 1 && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_1__.isUuid)(value.requestId) && value.command === 'application.quit')
                void requestNativeQuit('app');
        });
        electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.handle(_security__WEBPACK_IMPORTED_MODULE_9__.READINESS_CHANNEL, (event, request) => {
            if (!authorized(event) || !(0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_7__.validRequest)(request))
                throw new Error('Readiness request denied');
            return client.request(request);
        });
        electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.handle(_application_contracts_universe__WEBPACK_IMPORTED_MODULE_1__.UNIVERSE_CHANNEL, async (event, value) => {
            if (!authorized(event) || !(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_1__.validUniverseRequest)(value) || draining)
                throw new Error('Universe request denied');
            const request = value;
            const reconcilesPending = request.command === 'universe.open' && request.reconcileOperationId && mutationLocations.has(request.reconcileOperationId);
            if (unresolvedOperations.size > 0 && request.command !== 'universe.current' && !reconcilesPending)
                return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'Reconcile the pending operation in its original folder before another operation or close.', outcome: 'unknown', retry: 'after-recovery' };
            if (request.command === 'universe.open' && hostExited && !fault) {
                child = electron__WEBPACK_IMPORTED_MODULE_3__.utilityProcess.fork(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(__dirname, 'utility-host.cjs'), [], { serviceName: 'WritingTool application host' });
                client = new _host_client__WEBPACK_IMPORTED_MODULE_8__.HostClient(child);
                universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_2__.UniverseHostClient(child);
                hostExited = false;
                child.on('message', message => {
                    if (typeof message === 'object' && message !== null && 'command' in message)
                        universeClient?.receive(message);
                    else
                        client?.receive(message);
                });
                child.on('exit', () => {
                    hostExited = true;
                    client?.fail('HOST_EXITED');
                    universeClient?.fail();
                });
                child.on('error', () => {
                    client?.fail('HOST_EXITED');
                    universeClient?.fail();
                });
            }
            if (request.command === 'universe.create' || request.command === 'universe.open') {
                const injected = diagnostic ? process.env.WRITINGTOOL_UNIVERSE_FOLDER : undefined;
                let selection;
                try {
                    selection = diagnostic && diagnosticChooserCanceled ? { canceled: true, filePaths: [] } : injected ? { canceled: false, filePaths: [injected] } : await electron__WEBPACK_IMPORTED_MODULE_3__.dialog.showOpenDialog(window, { title: request.command === 'universe.create' ? 'Choose an empty folder for the universe' : 'Open universe folder', properties: ['openDirectory'] });
                }
                catch {
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The folder chooser could not open. Try selecting a location again.', outcome: 'not-committed', retry: 'new-request' };
                }
                if (selection.canceled || !selection.filePaths[0])
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'canceled' };
                let basePath;
                try {
                    basePath = node_fs__WEBPACK_IMPORTED_MODULE_5___default().realpathSync(selection.filePaths[0]);
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
                }
                if (request.command === 'universe.create' && !(result.status === 'error' && result.outcome === 'unknown'))
                    unresolvedOperations.delete(request.input.operationId);
                if (request.command === 'universe.open' && result.status === 'ok' && request.reconcileOperationId)
                    unresolvedOperations.delete(request.reconcileOperationId);
                return result;
            }
            if (request.command === 'universe.profile.save' && activeLocation && activeSnapshot)
                rememberMutation(request.input.operationId, activeLocation, { identity: { ownerId: activeSnapshot.ownerId, rootId: activeSnapshot.rootId }, mutation: { command: request.command, input: request.input } });
            let result = await universeClient.request(request);
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
                result = (0,_universe_host_client__WEBPACK_IMPORTED_MODULE_2__.hostUnavailable)(request);
            }
            if (request.command === 'universe.profile.save' && !(result.status === 'error' && result.outcome === 'unknown'))
                unresolvedOperations.delete(request.input.operationId);
            return result;
        });
        window = new electron__WEBPACK_IMPORTED_MODULE_3__.BrowserWindow({ width: 960, height: 680, minWidth: 360, minHeight: 360, backgroundColor: '#292929', show: false, webPreferences: { preload: '/home/jo/RiderProjects/WritingTool/.webpack/renderer/main_window/preload.cjs', sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false, additionalArguments: diagnostic ? ['--writingtool-smoke'] : [] } });
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
        if (diagnostic)
            void smoke();
    }).catch(error => {
        console.error(error);
        electron__WEBPACK_IMPORTED_MODULE_3__.app.exit(1);
    });
async function smoke() {
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
        const created = await window.webContents.executeJavaScript('window.writingTool.currentUniverse()');
        const mouseClick = async (selector) => {
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
        await window.webContents.executeJavaScript(`(async()=>{await window.writingTool.closeUniverse();Array.from(document.querySelectorAll('nav button')).find(button=>button.textContent.startsWith('New universe')).click();await new Promise(resolve=>setTimeout(resolve,70));const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Unsaved native close draft');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
        const cancelNative = async (kind) => {
            if (kind === 'window')
                window.close();
            else
                electron__WEBPACK_IMPORTED_MODULE_3__.app.quit();
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
    const untrusted = new electron__WEBPACK_IMPORTED_MODULE_3__.BrowserWindow({ show: false, webPreferences: { preload: '/home/jo/RiderProjects/WritingTool/.webpack/renderer/main_window/preload.cjs', sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await untrusted.loadURL('http://localhost:3000/main_window/index.html');
    const untrustedResult = await untrusted.webContents.executeJavaScript('window.writingTool.readiness()');
    const untrustedUniverse = await untrusted.webContents.executeJavaScript('window.writingTool.currentUniverse()');
    const senderDenied = untrustedUniverse.status === 'error' && untrustedUniverse.code === 'HOST_UNAVAILABLE' && untrustedResult.status === 'unavailable' && untrustedResult.code === 'UNAVAILABLE';
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
    const windowCount = electron__WEBPACK_IMPORTED_MODULE_3__.BrowserWindow.getAllWindows().length;
    await window.webContents.executeJavaScript(`window.open('https://example.invalid'); location.href='https://example.invalid';`);
    await new Promise(resolve => setTimeout(resolve, 150));
    const security = observed.node === 'undefined' && observed.process === 'undefined' && JSON.stringify(observed.keys) === '["createUniverse","openUniverse","currentUniverse","saveUniverseProfile","closeUniverse","readiness"]' && window.webContents.getURL() === before && electron__WEBPACK_IMPORTED_MODULE_3__.BrowserWindow.getAllWindows().length === windowCount;
    const expectedCode = { start: 'HOST_START_FAILED', exit: 'HOST_EXITED', invalid: 'INVALID_RESPONSE', timeout: 'TIMEOUT', 'exit-after-ready': 'HOST_EXITED', 'fatal-error': 'HOST_EXITED' }[fault ?? ''];
    const universePassed = !universeFlow || universeFlow.passed;
    const passed = universePassed && observed.state === expected && client?.pendingCount === 0 && security && senderDenied && invalidRequestsRejected && permissionsDenied && (fault !== 'fatal-error' || hostErrors === 1) && (!expectedCode || String(observed.text).includes(expectedCode));
    console.log('WRITINGTOOL_SMOKE ' + JSON.stringify({ passed, packaged: electron__WEBPACK_IMPORTED_MODULE_3__.app.isPackaged, fault: fault ?? 'none', observed, security, senderDenied, invalidRequestsRejected, permissionsDenied, permissionChecks, permissionRequests, hostErrors, pending: client?.pendingCount, universeFlow, versions: process.versions }));
    if (!passed) {
        electron__WEBPACK_IMPORTED_MODULE_3__.app.exit(1);
        return;
    }
    // Success exits through the same production dirty decision and host drain.
    electron__WEBPACK_IMPORTED_MODULE_3__.app.quit();
    if (window && !window.isDestroyed())
        await window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click();})()`).catch(() => {
        });
}
async function requestNativeQuit(kind) {
    if (quitDecisionInFlight || draining)
        return;
    quitDecisionInFlight = true;
    try {
        const owned = window;
        if (owned && !owned.isDestroyed()) {
            const token = (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.randomUUID)();
            const approved = await owned.webContents.executeJavaScript(`new Promise(resolve => {
                const token=${JSON.stringify(token)};
                const listener=event=>{if(event.detail?.token!==token)return;document.removeEventListener('writingtool-quit-decision',listener);resolve(event.detail.approved===true);};
                document.addEventListener('writingtool-quit-decision',listener);
                document.dispatchEvent(new CustomEvent('writingtool-window-close',{detail:{token}}));
            })`);
            if (!approved)
                return;
        }
        if (unresolvedOperations.size) {
            electron__WEBPACK_IMPORTED_MODULE_3__.dialog.showErrorBox('Unable to close universe', 'Reconcile the unresolved operation before closing.');
            return;
        }
        draining = true;
        if (!hostExited) {
            // Reuse the same process, never create replacement authority. A
            // failed readiness/transport client is not a shutdown acknowledgment.
            universeClient?.fail();
            universeClient = new _universe_host_client__WEBPACK_IMPORTED_MODULE_2__.UniverseHostClient(child);
            const result = await universeClient.request({ protocolVersion: 1, requestId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.randomUUID)(), command: 'universe.close' });
            if (result.status !== 'ok' && !hostExited) {
                electron__WEBPACK_IMPORTED_MODULE_3__.dialog.showErrorBox('Unable to close universe', result.status === 'error' ? result.message : 'Shutdown was not acknowledged.');
                return;
            }
        }
        if (diagnostic)
            console.log('WRITINGTOOL_DRAIN ' + JSON.stringify({ kind, hostAlreadyExited: hostExited, unresolved: unresolvedOperations.size, drained: true }));
        quitPermit = kind;
        if (kind === 'window' && window && !window.isDestroyed())
            window.close();
        else
            electron__WEBPACK_IMPORTED_MODULE_3__.app.quit();
    }
    catch (error) {
        console.error('Normal close remains pending', error);
    }
    finally {
        draining = false;
        quitDecisionInFlight = false;
    }
}
electron__WEBPACK_IMPORTED_MODULE_3__.app.on('before-quit', event => {
    if (drained || quitPermit === 'app') {
        quitPermit = undefined;
        drained = true;
        if (!shutdown) {
            shutdown = true;
            electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.removeHandler(_security__WEBPACK_IMPORTED_MODULE_9__.READINESS_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.removeHandler(_application_contracts_universe__WEBPACK_IMPORTED_MODULE_1__.UNIVERSE_CHANNEL);
            electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.removeAllListeners('writingtool:quit-request:v1');
            client?.fail('UNAVAILABLE');
            child?.kill();
        }
        return;
    }
    event.preventDefault();
    void requestNativeQuit('app');
});
electron__WEBPACK_IMPORTED_MODULE_3__.app.on('window-all-closed', () => electron__WEBPACK_IMPORTED_MODULE_3__.app.quit());

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.cjs.map