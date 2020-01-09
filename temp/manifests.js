(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["debugManifests"] = factory();
	else
		root["debugManifests"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(6);
var util = __webpack_require__(7);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(3);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(1);
exports.encode = exports.stringify = __webpack_require__(2);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module), __webpack_require__(4)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @copyright Microsoft Corporation. All rights reserved.
 *
 * @file manifestsFile.ts
 */

Object.defineProperty(exports, "__esModule", { value: true });
var url = __webpack_require__(0);
/**
 * Get the manifest array with each of the base URLs rewritten to point to the local
 *  page's protocol, hostname, and port. This function is useful for automated tests
 *  that run locally and use an unpredictable port.
 */
function getLocalPageManifests() {
    // Clone manifestsArray
    var manifests = JSON.parse(JSON.stringify(getManifests()));
    manifests.forEach(function (manifest) {
        var baseUrls = manifest.loaderConfig.internalModuleBaseUrls;
        var baseUrl = url.parse(baseUrls[0]);
        var pageUrl = url.parse(window.location.toString());
        baseUrl.protocol = pageUrl.protocol;
        baseUrl.host = pageUrl.host;
        baseUrls[0] = url.format(baseUrl);
    });
    return manifests;
}
exports.getLocalPageManifests = getLocalPageManifests;
/**
 * Get the manifest array.
 */
function getManifests() {
    return [
  {
    "id": "af59c2b3-2da7-41fd-8b72-3939817960af",
    "alias": "SPClientBase",
    "componentType": "Library",
    "version": "1.0.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-client-base",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-client-base/"
      ],
      "scriptResources": {
        "sp-client-base": {
          "type": "path",
          "path": "dist/sp-client-base.js"
        }
      }
    }
  },
  {
    "id": "73e1dc6c-8441-42cc-ad47-4bd3659f8a3a",
    "alias": "SPLodashSubset",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-lodash-subset",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-lodash-subset/"
      ],
      "scriptResources": {
        "sp-lodash-subset": {
          "type": "path",
          "path": "dist/sp-lodash-subset.js"
        }
      }
    }
  },
  {
    "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b",
    "alias": "SPCoreLibrary",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-core-library",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-core-library/"
      ],
      "scriptResources": {
        "sp-core-library": {
          "type": "path",
          "path": "dist/sp-core-library.js"
        },
        "@microsoft/sp-lodash-subset": {
          "type": "component",
          "version": "1.1.0",
          "id": "73e1dc6c-8441-42cc-ad47-4bd3659f8a3a"
        }
      }
    }
  },
  {
    "id": "f97266fb-ccb7-430e-9384-4124d05295d3",
    "alias": "Decorators",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "decorators",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/decorators/"
      ],
      "scriptResources": {
        "decorators": {
          "type": "path",
          "path": "dist/decorators.js"
        }
      }
    }
  },
  {
    "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6",
    "alias": "SPHttp",
    "componentType": "Library",
    "version": "1.1.1",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-http",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-http/"
      ],
      "scriptResources": {
        "sp-http": {
          "type": "path",
          "path": "dist/sp-http.js"
        },
        "@microsoft/decorators": {
          "type": "component",
          "version": "1.1.0",
          "id": "f97266fb-ccb7-430e-9384-4124d05295d3"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-lodash-subset": {
          "type": "component",
          "version": "1.1.0",
          "id": "73e1dc6c-8441-42cc-ad47-4bd3659f8a3a"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        }
      }
    }
  },
  {
    "id": "02a01e42-69ab-403d-8a16-acd128661f8e",
    "alias": "OfficeUIFabricReact",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "office-ui-fabric-react.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/office-ui-fabric-react-bundle/"
      ],
      "scriptResources": {
        "office-ui-fabric-react.bundle": {
          "type": "path",
          "path": "dist/office-ui-fabric-react.bundle.js"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        }
      }
    }
  },
  {
    "id": "1e384972-6346-49b4-93c7-b2e6763938e6",
    "alias": "sp-polyfills",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-polyfills",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-polyfills/"
      ],
      "scriptResources": {
        "sp-polyfills": {
          "type": "path",
          "path": "dist/sp-polyfills.js"
        }
      }
    }
  },
  {
    "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f",
    "alias": "SPLoader",
    "componentType": "Library",
    "version": "1.1.1",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-loader",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-loader/"
      ],
      "scriptResources": {
        "sp-loader": {
          "type": "localizedPath",
          "paths": {},
          "defaultPath": "dist/sp-loader_en-us.js"
        }
      }
    }
  },
  {
    "id": "467dc675-7cc5-4709-8aac-78e3b71bd2f6",
    "alias": "SPComponentBase",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-component-base",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-component-base/"
      ],
      "scriptResources": {
        "sp-component-base": {
          "type": "path",
          "path": "dist/sp-component-base.js"
        },
        "@microsoft/decorators": {
          "type": "component",
          "version": "1.1.0",
          "id": "f97266fb-ccb7-430e-9384-4124d05295d3"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        }
      }
    }
  },
  {
    "id": "1c4541f7-5c31-41aa-9fa8-fbc9dc14c0a8",
    "alias": "SPPageContext",
    "componentType": "Library",
    "version": "1.1.0",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-page-context",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-page-context/"
      ],
      "scriptResources": {
        "sp-page-context": {
          "type": "path",
          "path": "dist/sp-page-context.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        }
      }
    }
  },
  {
    "id": "974a7777-0990-4136-8fa6-95d80114c2e0",
    "alias": "SPWebPartBase",
    "componentType": "Library",
    "version": "1.1.1",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-webpart-base",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-webpart-workbench/node_modules/@microsoft/sp-webpart-base/"
      ],
      "scriptResources": {
        "sp-webpart-base": {
          "type": "localizedPath",
          "paths": {},
          "defaultPath": "dist/sp-webpart-base_en-us.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/decorators": {
          "type": "component",
          "version": "1.1.0",
          "id": "f97266fb-ccb7-430e-9384-4124d05295d3"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        },
        "@microsoft/sp-lodash-subset": {
          "type": "component",
          "version": "1.1.0",
          "id": "73e1dc6c-8441-42cc-ad47-4bd3659f8a3a"
        },
        "office-ui-fabric-react": {
          "type": "component",
          "version": "1.1.0",
          "id": "02a01e42-69ab-403d-8a16-acd128661f8e"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-page-context": {
          "type": "component",
          "version": "1.1.0",
          "id": "1c4541f7-5c31-41aa-9fa8-fbc9dc14c0a8"
        },
        "@microsoft/sp-component-base": {
          "type": "component",
          "version": "1.1.0",
          "id": "467dc675-7cc5-4709-8aac-78e3b71bd2f6"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "0773bd53-a69e-4293-87e6-ba80ea4d614b",
    "alias": "SPExtensionBase",
    "componentType": "Library",
    "version": "0.1.1",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-extension-base",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-extension-base/"
      ],
      "scriptResources": {
        "sp-extension-base": {
          "type": "path",
          "path": "dist/sp-extension-base.js"
        },
        "@microsoft/sp-component-base": {
          "type": "component",
          "version": "1.1.0",
          "id": "467dc675-7cc5-4709-8aac-78e3b71bd2f6"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        },
        "@microsoft/decorators": {
          "type": "component",
          "version": "1.1.0",
          "id": "f97266fb-ccb7-430e-9384-4124d05295d3"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "4df9bb86-ab0a-4aab-ab5f-48bf167048fb",
    "alias": "SPApplicationBase",
    "componentType": "Library",
    "version": "1.1.1",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-application-base",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-application-base/"
      ],
      "scriptResources": {
        "sp-application-base": {
          "type": "path",
          "path": "dist/sp-application-base.js"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-page-context": {
          "type": "component",
          "version": "1.1.0",
          "id": "1c4541f7-5c31-41aa-9fa8-fbc9dc14c0a8"
        },
        "@ms/odsp-utilities-bundle": {
          "type": "component",
          "version": "1.1.0",
          "id": "cc2cc925-b5be-41bb-880a-f0f8030c6aff"
        },
        "@microsoft/sp-extension-base": {
          "type": "component",
          "version": "0.1.1",
          "id": "0773bd53-a69e-4293-87e6-ba80ea4d614b"
        },
        "@microsoft/decorators": {
          "type": "component",
          "version": "1.1.0",
          "id": "f97266fb-ccb7-430e-9384-4124d05295d3"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "4d5eb168-6729-49a8-aec7-0e397f486b6e",
    "alias": "SPClientPreview",
    "componentType": "Library",
    "version": "1.1.1",
    "manifestVersion": 2,
    "loaderConfig": {
      "entryModuleId": "sp-client-preview",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-client-preview/"
      ],
      "scriptResources": {
        "sp-client-preview": {
          "type": "path",
          "path": "dist/sp-client-preview.js"
        }
      }
    }
  },
  {
    "id": "8be81a5c-af38-4bb2-af97-afa3b64dfbed",
    "alias": "WebPartWorkbench",
    "componentType": "Application",
    "version": "1.1.0",
    "manifestVersion": 2,
    "safeWithCustomScriptDisabled": true,
    "title": {
      "default": "WebpartWorkbench"
    },
    "description": {
      "default": "WebpartWorkbench"
    },
    "assemblyId": "5dae53c4-db1e-4d0b-b8b2-88c874dabf83",
    "preloadComponents": [
      "8217e442-8ed3-41fd-957d-b112e841286a",
      "4df9bb86-ab0a-4aab-ab5f-48bf167048fb",
      "05ed6956-59ad-4aa6-9e4e-b832c96ae87b"
    ],
    "preloadOptions": {
      "shouldPreloadWeb": true,
      "shouldPreloadUser": true,
      "shouldPreloadList": false,
      "shouldPreloadItem": true,
      "shouldPreloadQuickLaunch": true
    },
    "loaderConfig": {
      "entryModuleId": "sp-webpart-workbench",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/@microsoft/sp-webpart-workbench/"
      ],
      "scriptResources": {
        "sp-webpart-workbench": {
          "type": "localizedPath",
          "paths": {},
          "defaultPath": "dist/sp-webpart-workbench_en-us.js"
        },
        "office-ui-fabric-react": {
          "type": "component",
          "version": "1.1.0",
          "id": "02a01e42-69ab-403d-8a16-acd128661f8e"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@ms/sp-telemetry": {
          "type": "component",
          "version": "0.2.2",
          "id": "8217e442-8ed3-41fd-957d-b112e841286a"
        },
        "@ms/odsp-utilities-bundle": {
          "type": "component",
          "version": "1.1.0",
          "id": "cc2cc925-b5be-41bb-880a-f0f8030c6aff"
        },
        "@microsoft/sp-lodash-subset": {
          "type": "component",
          "version": "1.1.0",
          "id": "73e1dc6c-8441-42cc-ad47-4bd3659f8a3a"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.0",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.0",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-page-context": {
          "type": "component",
          "version": "1.0.1",
          "id": "1c4541f7-5c31-41aa-9fa8-fbc9dc14c0a8"
        },
        "@microsoft/sp-extension-base": {
          "type": "component",
          "version": "0.1.0",
          "id": "0773bd53-a69e-4293-87e6-ba80ea4d614b"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.0",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        },
        "@microsoft/decorators": {
          "type": "component",
          "version": "1.0.1",
          "id": "f97266fb-ccb7-430e-9384-4124d05295d3"
        },
        "@microsoft/office-ui-fabric-react-bundle": {
          "type": "component",
          "version": "1.1.0",
          "id": "02a01e42-69ab-403d-8a16-acd128661f8e"
        }
      }
    }
  },
  {
    "id": "d688e552-a2fb-4904-af1c-c28aa1ee79d3",
    "alias": "TestWebPart",
    "componentType": "WebPart",
    "version": "0.0.1",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "d688e552-a2fb-4904-af1c-c28aa1ee79d3",
        "group": {
          "default": "Under Development"
        },
        "title": {
          "default": "Test"
        },
        "description": {
          "default": "Test description"
        },
        "officeFabricIconFontName": "Page",
        "properties": {
          "description": "CustomFieldsWebPart",
          "date": "",
          "date2": ""
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "sp-client-custom-fields.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/node_modules/sp-client-custom-fields/"
      ],
      "scriptResources": {
        "sp-client-custom-fields.bundle": {
          "type": "path",
          "path": "dist/sp-client-custom-fields.bundle.js"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "testStrings": {
          "defaultPath": "lib/webparts/test/loc/en-us.js",
          "type": "localizedPath",
          "paths": {}
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "0824a209-e4f0-45a8-b630-99e5d72df5f5",
    "alias": "TabsWebPart",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Tabs"
        },
        "description": {
          "default": "You can dynamically create sections to view your content in the form of tabs. In edit mode, you can directly modify the contents of each tab with a WYSIWYG editor and preview your Web Part in your page. The tabs are responsives and adapt with the size of the screen."
        },
        "officeFabricIconFontName": "Sections",
        "properties": {
          "inline": true,
          "disableColor": "#f8f7ee",
          "selectedColor": "#9cc943",
          "tabs": [
            {
              "Title": "Elementum",
              "Content": "<h1>Lorem ipsum dolor sit amet</h1><p>consectetur adipiscing elit. Fusce fringilla neque id metus egestas, vitae pharetra arcu porttitor. Nullam consequat id urna eu pellentesque. Fusce ut velit pellentesque, ornare libero sit amet, tristique neque. Cras   incidunt et nisl nec mattis. Proin nisi nunc, rhoncus ac laoreet eget, pulvinar quis nisl. Vestibulum libero massa, eleifend ut suscipit et, aliquet id lorem. Aliquam in ornare arcu. Curabitur non turpis tortor.</p> <p>Nunc vehicula convallis augue, a molestie elit feugiat id. Fusce semper fermentum est vel viverra. Nam pellentesque tempus tempus. In molestie rutrum maximus. Pellentesque eget nulla neque. Phasellus egestas tempus eros, et fermentum sem mattis eget. Fusce vulputate nisl et mauris condimentum, non semper nisl elementum. Duis placerat purus id libero aliquet, at fermentum nisi malesuada. Morbi congue orci id ipsum pellentesque, non consequat enim fringilla.</p>"
            },
            {
              "Title": "Tab 2",
              "Content": "<b>Sample with rich html</b>"
            },
            {
              "Title": "Tab 3",
              "Content": "<a href='#'>Link</a>"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "tabs.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "tabs.bundle": {
          "type": "path",
          "path": "dist/tabs.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "TabsStrings": {
          "defaultPath": "lib/webparts/tabs/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "1431c215-2c2a-479c-a483-51b474c7bc88",
    "alias": "Markdown",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Markdown"
        },
        "description": {
          "default": "If you like the Markdown (MD) syntax, this Web Part is made for you! With this Web Part, you can add a player of Markdown in your page and edit its content through a specialized Editor. It has never been as easy to use the power of Markdown in SharePoint."
        },
        "officeFabricIconFontName": "Header1",
        "properties": {
          "text": "",
          "toolbar": true,
          "toolbarTips": true,
          "status": true,
          "spellChecker": false
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "markdown.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "markdown.bundle": {
          "type": "path",
          "path": "dist/markdown.bundle.js"
        },
        "showdown": {
          "type": "path",
          "path": "src/javascripts/showdown/showdown.min.js",
          "globalName": "showdown"
        },
        "simplemde": {
          "type": "path",
          "path": "src/javascripts/simplemde/simplemde.min.js",
          "globalName": "SimpleMDE"
        },
        "MarkdownStrings": {
          "defaultPath": "lib/webparts/markdown/loc/en-us.js",
          "type": "localizedPath"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "1431cddd-2c55-475c-5483-51aa74c7bc88",
    "alias": "TypeWriting",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Type Writing"
        },
        "description": {
          "default": "Insert a text with a typwriter effect. It will simulate a mechanical or electromechanical machine for writing in characters similar to those produced by printer."
        },
        "officeFabricIconFontName": "Underline",
        "properties": {
          "text": "Lipsum",
          "splitLines": true,
          "font": "",
          "fontSize": "normal",
          "fontColor": "#000000",
          "backgroundColor": "#FFFFFF",
          "typingInterval": 130,
          "blinkInterval": 1000,
          "cursorColor": "#00fd55"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "typeWriting.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "typeWriting.bundle": {
          "type": "path",
          "path": "dist/typeWriting.bundle.js"
        },
        "typewriting": {
          "type": "path",
          "path": "node_modules/typewriting/dist/typewriting.min.js",
          "globalName": "TypeWriting"
        },
        "TypeWritingStrings": {
          "defaultPath": "lib/webparts/typeWriting/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "1631c215-2c2a-479c-ae83-510474c79c88",
    "alias": "FckText",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "RichText Editor"
        },
        "description": {
          "default": "This Web Part is a rich alternative text editor. Instead of the native SharePoint Editor, this Web Part uses the editor CKEditor, which is a popular and powerful JavaScript full HTML code editor. You can configure the type of integration (fixed or dynamic)."
        },
        "officeFabricIconFontName": "ClearFormatting",
        "properties": {
          "text": "",
          "inline": true
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "fckText.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "fckText.bundle": {
          "type": "path",
          "path": "dist/fckText.bundle.js"
        },
        "fckTextStrings": {
          "defaultPath": "lib/webparts/fckText/loc/en-us.js",
          "type": "localizedPath"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "1d2f44ed-0aa7-499b-a99b-9e23a7351499",
    "alias": "TextRotator",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Text Rotator"
        },
        "description": {
          "default": "This Web Part allows you to display several sentences one after the other with a transition effect."
        },
        "officeFabricIconFontName": "Rotate",
        "properties": {
          "text": "Lipsum lipsum\ncorpus vae vista",
          "font": "",
          "fontSize": "18px",
          "fontColor": "#000000",
          "backgroundColor": "#FFFFFF",
          "effect": "bounceInRight",
          "duration": 2000,
          "align": "left"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "textRotator.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "textRotator.bundle": {
          "type": "path",
          "path": "dist/textRotator.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "morphext": {
          "type": "path",
          "path": "src/javascripts/morphext/morphext.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "TextRotatorStrings": {
          "defaultPath": "lib/webparts/textRotator/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "28d3013b-a43a-4869-ac4d-48cd421d2101",
    "alias": "BarChart",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "7a7091d9-d176-450b-a04f-9fa48ca1981b",
        "group": {
          "default": "Charts, Graphs and Maps"
        },
        "title": {
          "default": "Bar Chart"
        },
        "description": {
          "default": "To generate a chart in the form of a vertical or horizontal diagram. You can simply edit the data of the chart, change the values, labels, or colors. Create simply and effectively elegant and effective dashboards for your employees."
        },
        "officeFabricIconFontName": "BarChart4",
        "properties": {
          "responsive": false,
          "horizontal": true,
          "xAxesEnable": true,
          "yAxesEnable": true,
          "dimension": {
            "width": "450px",
            "height": "450px"
          },
          "position": "top",
          "title": "Months Bar Chart",
          "titleEnable": true,
          "titleColor": "#666",
          "titleSize": "12px",
          "items": [
            {
              "Label": "January",
              "Value": 65,
              "Color": "rgba(255, 99, 132, 0.2)",
              "Hover Color": "rgba(255,99,132,1)"
            },
            {
              "Label": "February",
              "Value": 59,
              "Color": "rgba(54, 162, 235, 0.2)",
              "Hover Color": "rgba(54, 162, 235, 1)"
            },
            {
              "Label": "March",
              "Value": 80,
              "Color": "rgba(255, 206, 86, 0.2)",
              "Hover Color": "rgba(255, 206, 86, 1)"
            },
            {
              "Label": "April",
              "Value": 81,
              "Color": "rgba(75, 192, 192, 0.2)",
              "Hover Color": "rgba(75, 192, 192, 1)"
            },
            {
              "Label": "May",
              "Value": 56,
              "Color": "rgba(153, 102, 255, 0.2)",
              "Hover Color": "rgba(153, 102, 255, 1)"
            },
            {
              "Label": "June",
              "Value": 55,
              "Color": "rgba(255, 159, 64, 0.2)",
              "Hover Color": "rgba(255, 159, 64, 1)"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "barChart.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "barChart.bundle": {
          "type": "path",
          "path": "dist/barChart.bundle.js"
        },
        "chartjs": {
          "type": "path",
          "path": "src/javascripts/chartjs/Chart.min.js",
          "globalName": "Chart"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "BarChartStrings": {
          "defaultPath": "lib/webparts/barChart/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "3f378f3d-733d-34b6-8470-17317bb0b275",
    "alias": "NewsCarousel",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "72505c62-b3c0-4cc3-89d8-f2adc8d962a0",
        "group": {
          "default": "News Management"
        },
        "title": {
          "default": "News Carousel"
        },
        "description": {
          "default": "Insert a classical, responsive, cool & touch ready News Carousel. With this web part, you can add easily news focus in your SharePoint site. The users can easily navigate in news items, with buttons or with touch."
        },
        "officeFabricIconFontName": "News",
        "properties": {
          "enableArrows": true,
          "enableBullets": true,
          "enablePlayButton": false,
          "enableFullscreenButton": false,
          "enableZoomPanel": false,
          "controlsAlwaysOn": true,
          "preserveRatio": true,
          "pauseOnMouseover": false,
          "carousel": true,
          "autoplay": true,
          "speed": 2500,
          "transition": "slide",
          "enableProgressIndicator": false,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": true,
          "textPanelOpacity": 0.4,
          "items": [
            {
              "Title": "Discover the new work station",
              "Enable": "true",
              "Description": "Smart, fast & easy: discover the new work station",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-204611-large.jpeg"
            },
            {
              "Title": "All the Intranet in your Smart Phone",
              "Enable": "true",
              "Description": "Stay connected with the Intranet App",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-large.jpg"
            },
            {
              "Title": "Take a break!",
              "Enable": "true",
              "Description": "Discover the new coffees selection",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-70221-large.jpeg"
            },
            {
              "Title": "Discover the new meeting areas",
              "Enable": "true",
              "Description": "New meeting areas available at Level 2",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/space-desk-workspace-coworking-large.jpg"
            },
            {
              "Title": "New travel policies",
              "Enable": "true",
              "Description": "The new travel policies are available",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-large-car.jpg"
            },
            {
              "Title": "New commons",
              "Enable": "false",
              "Description": "View the video of the new commons",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-58801-large.jpeg"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "newsCarousel.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "newsCarousel.bundle": {
          "type": "path",
          "path": "dist/newsCarousel.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-slider": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-slider.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "NewsCarouselStrings": {
          "defaultPath": "lib/webparts/newsCarousel/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "3f3e8f3d-033d-34b6-8450-173122222275",
    "alias": "SimpleCarousel",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Simple Carousel"
        },
        "description": {
          "default": "The Web Part Simple Carousel allows you to browse a library of images in forms of thumbnails that scroll horizontally."
        },
        "officeFabricIconFontName": "Forward",
        "properties": {
          "enableArrows": true,
          "enableBorder": false,
          "enableIcons": true,
          "borderColor": "#CCCCCC",
          "border": 0,
          "tileDimension": {
            "width": "160px",
            "height": "160px"
          },
          "pauseOnMouseover": true,
          "autoplay": true,
          "speed": 4000,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": false,
          "textPanelOpacity": 0.4
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "simple-carousel.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "simple-carousel.bundle": {
          "type": "path",
          "path": "dist/simple-carousel.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-carousel": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-carousel.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "simpleCarouselStrings": {
          "defaultPath": "lib/webparts/simpleCarousel/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "3f3e8f3d-033d-34b6-8450-17312bb0b275",
    "alias": "SliderGallery",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Slider Gallery"
        },
        "description": {
          "default": "This Web Part allows you to view your photo galleries in the form of a slider between the images. Photos automatically scroll with the effect of your choice. The user can click on the arrows or use the touch features to navigate through the images. On click, the image is opened in full screen."
        },
        "officeFabricIconFontName": "Play",
        "properties": {
          "enableArrows": true,
          "enableBullets": true,
          "enablePlayButton": false,
          "enableFullscreenButton": false,
          "enableZoomPanel": false,
          "controlsAlwaysOn": false,
          "preserveRatio": true,
          "pauseOnMouseover": true,
          "carousel": true,
          "autoplay": true,
          "speed": 4000,
          "transition": "slide",
          "enableProgressIndicator": true,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": true,
          "textPanelOpacity": 0.4
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "slider-gallery.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "slider-gallery.bundle": {
          "type": "path",
          "path": "dist/slider-gallery.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-slider": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-slider.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "sliderGalleryStrings": {
          "defaultPath": "lib/webparts/sliderGallery/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "3f3e8f3d-033d-34b6-8450-1731c427c275",
    "alias": "GridGallery",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Grid Gallery"
        },
        "description": {
          "default": "From any library of images of your SharePoint site, you can generate an image gallery with thumbnails that scroll automatically. You can click on an image to enlarge. This Web Pat is responsive."
        },
        "officeFabricIconFontName": "PictureLibrary",
        "properties": {
          "enableArrows": true,
          "enableBullets": false,
          "enablePlayButton": true,
          "enableFullscreenButton": true,
          "enableZoomPanel": true,
          "controlsAlwaysOn": false,
          "preserveRatio": true,
          "pauseOnMouseover": true,
          "enableBorder": false,
          "borderColor": "#CCCCCC",
          "border": 0,
          "tileDimension": {
            "width": "88px",
            "height": "50px"
          },
          "autoplay": true,
          "speed": 4000,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": false,
          "enableProgressIndicator": false,
          "textPanelOpacity": 0.4,
          "position": "bottom",
          "numCols": 2
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "grid-gallery.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "grid-gallery.bundle": {
          "type": "path",
          "path": "dist/grid-gallery.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-grid": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-grid.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "gridGalleryStrings": {
          "defaultPath": "lib/webparts/gridGallery/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "40ff328d-4e5e-4a07-9f71-7c17f42744e2",
    "alias": "VerticalTimeline",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "7a7091d9-d176-450b-a04f-9fa48ca1981b",
        "group": {
          "default": "Charts, Graphs and Maps"
        },
        "title": {
          "default": "Vertical Timeline"
        },
        "description": {
          "default": "A web part to generate a Facebook like vertical Timeline from SharePoint Calendar list items. For example, this Web Part is very convenient to build a synthetic view on your major project milestones. This Web Part uses CSS3 to optimize the user experience."
        },
        "officeFabricIconFontName": "Timeline",
        "properties": {
          "icon": "ms-Icon--Calendar",
          "color": "#000000",
          "backgroundColor": "#efffef"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "verticalTimeline.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "verticalTimeline.bundle": {
          "type": "path",
          "path": "dist/verticalTimeline.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "VerticalTimelineStrings": {
          "defaultPath": "lib/webparts/verticalTimeline/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "438e1c92-f33f-4952-aa36-add7530b6937",
    "alias": "SocialPhotoStream",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "8be34b8b-4fe8-4adb-b4b6-cc88a51f8646",
        "group": {
          "default": "Social Tools"
        },
        "title": {
          "default": "Social Photo Stream"
        },
        "description": {
          "default": "A web part to insert a list of photo from populars photos sharing plateforms as Instagram, Pinterest, Flickr, Deviantart, Dribbble, Picasa, Youtube & Newsfeed."
        },
        "officeFabricIconFontName": "Photo2",
        "properties": {
          "network": "pinterest",
          "userName": "microsoft",
          "accessKey": "",
          "limit": 20,
          "overlay": true,
          "dimension": {
            "width": "100px",
            "height": "100px"
          },
          "spacing": 5
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "socialPhotoStream.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "socialPhotoStream.bundle": {
          "type": "path",
          "path": "dist/socialPhotoStream.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "socialStream": {
          "type": "path",
          "path": "src/javascripts/socialStream/socialstream.jquery.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "SocialPhotoStreamStrings": {
          "defaultPath": "lib/webparts/socialPhotoStream/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "44a6136a-dcc5-45dd-95a6-747430624042",
    "alias": "Photopile",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Photopile"
        },
        "description": {
          "default": "From a SharePoint library, this Web Part generates a stack of photos on a table effect. This gives an aspect of photo gallery of Polaroid, for example. Click on the photos to enlarge to full screen."
        },
        "officeFabricIconFontName": "StackIndicator",
        "properties": {
          "listName": "",
          "orderBy": "ID",
          "orderByAsc": "asc",
          "count": 100,
          "numLayers": 5,
          "thumbOverlap": 50,
          "thumbRotation": 45,
          "thumbBorderWidth": 2,
          "thumbBorderColor": "white",
          "thumbBorderHover": "#EAEAEA",
          "draggable": true,
          "fadeDuration": 200,
          "pickupDuration": 500,
          "photoZIndex": 100,
          "photoBorder": 10,
          "photoBorderColor": "white",
          "showInfo": true,
          "autoplayGallery": false,
          "autoplaySpeed": 5000
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "photopile.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "photopile.bundle": {
          "type": "path",
          "path": "dist/photopile.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "jqueryui": {
          "type": "path",
          "path": "node_modules/jqueryui/jquery-ui.js"
        },
        "photopileModule": {
          "type": "path",
          "path": "src/javascripts/photopile/photopile.js"
        },
        "mystrings": {
          "defaultPath": "lib/webparts/photopile/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "47b0d836-1229-4d96-99bd-8c094c3a824c",
    "alias": "SimplePoll",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "1df557f4-e29a-4d2d-b1bf-a6b0b68aae90",
        "group": {
          "default": "Tools"
        },
        "title": {
          "default": "Simple Poll"
        },
        "description": {
          "default": "Insert a simple poll (one question) based on a SharePoint survey list. This Web Part is perfect for simple surveys to insert on a homepage for example. Users can vote in 1 click and see the results in the form of a pie or bar chart."
        },
        "officeFabricIconFontName": "CustomList",
        "properties": {
          "chartType": "pie",
          "forceVoteToViewResults": false,
          "size": "24px",
          "colo": "#323232"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "simplePoll.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "simplePoll.bundle": {
          "type": "path",
          "path": "dist/simplePoll.bundle.js"
        },
        "chartjs": {
          "type": "path",
          "path": "src/javascripts/chartjs/Chart.min.js",
          "globalName": "Chart"
        },
        "SimplePollStrings": {
          "defaultPath": "lib/webparts/simplePoll/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "4fae8f7d-099d-44b6-8450-17312bb0b275",
    "alias": "TilesGallery",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Tiles Gallery"
        },
        "description": {
          "default": "From any library of images of your SharePoint site, generate a gallery of pictures in tiles mode. You can click on the images to open them in a web viewer in lightbox view. You can choose the appearance of your tiles, colors, texts, width, height, etc. Your tiles could be justified (classical tiles mode) or vertical (like Delve dashboard)."
        },
        "officeFabricIconFontName": "ViewAll2",
        "properties": {
          "justified": true,
          "enableIcons": true,
          "enableShadow": false,
          "enableBorder": false,
          "spaceBetweenCols": 3,
          "borderColor": "#CCCCCC",
          "border": 2,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": false,
          "textPanelPosition": "inline-bottom",
          "textPanelOpacity": 0.4
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "tiles-gallery.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "tiles-gallery.bundle": {
          "type": "path",
          "path": "dist/tiles-gallery.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-tiles": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-tiles.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "tilesGalleryStrings": {
          "defaultPath": "lib/webparts/tilesGallery/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "52785d1a-a41a-4541-a4a5-a03142a21cf0",
    "alias": "SyntaxHighlighter",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Syntax Highlighter"
        },
        "description": {
          "default": "With this Web Part, you can copy and paste the code in a page and automatically benefit from a syntax highlighter to read the code. This Web Part supports many languages as ActionScript3, Bash/shell, ColdFusion, c#, C++, CSS, Delphi, Diff, Erlang, Groovy, JavaScript, Java, JavaFX, Perl, PHP, Plain Text, PowerShell, Python, Ruby, Scala, SQL, Visual Basic and XML."
        },
        "officeFabricIconFontName": "Code",
        "properties": {
          "code": "function hello(){\n  console.writeLine('hello !');\n}",
          "language": "js",
          "toolbar": true,
          "gutter": true,
          "autoLinks": true,
          "smartTabs": true
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "syntaxHighlighter.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "syntaxHighlighter.bundle": {
          "type": "path",
          "path": "dist/syntaxHighlighter.bundle.js"
        },
        "shBrushAS3": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushAS3.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushBash": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushBash.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushCSharp": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushCSharp.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushColdFusion": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushColdFusion.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushCpp": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushCpp.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushCss": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushCss.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushDelphi": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushDelphi.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushDiff": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushDiff.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushErlang": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushErlang.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushGroovy": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushGroovy.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushJScript": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushJScript.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushJava": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushJava.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushJavaFX": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushJavaFX.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushPerl": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushPerl.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushPhp": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushPhp.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushPlain": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushPlain.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushPowerShell": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushPowerShell.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushPython": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushPython.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushRuby": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushRuby.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushScala": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushScala.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushSql": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushSql.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushVb": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushVb.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "shBrushXml": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shBrushXml.min.js",
          "globalDependencies": [
            "syntaxHighlighter"
          ],
          "globalName": "SyntaxHighlighter"
        },
        "syntaxHighlighter": {
          "type": "path",
          "path": "src/javascripts/syntaxHighlighter/shCore.min.js",
          "globalName": "SyntaxHighlighter"
        },
        "SyntaxHighlighterStrings": {
          "defaultPath": "lib/webparts/syntaxHighlighter/loc/en-us.js",
          "type": "localizedPath"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "60564c9b-8561-489d-9ff7-1846c8358964",
    "alias": "NewsTicker",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "72505c62-b3c0-4cc3-89d8-f2adc8d962a0",
        "group": {
          "default": "News Management"
        },
        "title": {
          "default": "News Ticker"
        },
        "description": {
          "default": "Insert a simple horizontal News Ticker to display news as a simple ribbon. This web part is usefull if you want to display Breaking News BBC like information in your site"
        },
        "officeFabricIconFontName": "NumberedList",
        "properties": {
          "title": "Latest News",
          "width": "100%",
          "height": "30px",
          "backgroundColor": "#347fd0",
          "font": "Helvetica",
          "fontSize": "16px",
          "fontColor": "#e7f251",
          "fontMssg": "Helvetica",
          "fontSizeMssg": "16px",
          "fontColorMssg": "#ffffff",
          "speed": "10",
          "borderRadius": 4,
          "pausedMouseHover": true,
          "items": [
            {
              "Title": "Discover the new work station",
              "Enable": "true",
              "Link Url": "#"
            },
            {
              "Title": "All the Intranet in your Smart Phone",
              "Enable": "true",
              "Link Url": "#"
            },
            {
              "Title": "Take a break!",
              "Enable": "true",
              "Link Url": "#"
            },
            {
              "Title": "Discover the new meeting areas",
              "Enable": "true",
              "Link Url": "#"
            },
            {
              "Title": "New travel policies",
              "Enable": "true",
              "Link Url": "#"
            },
            {
              "Title": "New commons",
              "Enable": "false",
              "Link Url": "#"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "newsTicker.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "newsTicker.bundle": {
          "type": "path",
          "path": "dist/newsTicker.bundle.js"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "NewsTickerStrings": {
          "defaultPath": "lib/webparts/newsTicker/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "6510e024-b86d-479b-8a75-39b439bfc34d",
    "alias": "PieChart",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "7a7091d9-d176-450b-a04f-9fa48ca1981b",
        "group": {
          "default": "Charts, Graphs and Maps"
        },
        "title": {
          "default": "Pie Chart"
        },
        "description": {
          "default": "Insert a Pie chart with a few clicks in your SharePoint page. You can edit the data, choose values, colors, legends and all the graphics. You can generate graphs to fixed sizes or responsive mode."
        },
        "officeFabricIconFontName": "PieDouble",
        "properties": {
          "responsive": false,
          "dimension": {
            "width": "400px",
            "height": "400px"
          },
          "cutoutPercentage": 0,
          "animateRotate": true,
          "animateScale": false,
          "position": "top",
          "title": "Colors Pie",
          "titleEnable": true,
          "titleColor": "#666",
          "titleSize": "12px",
          "legendEnable": true,
          "legendPosition": "top",
          "legendColor": "#666",
          "legendSize": "12px",
          "items": [
            {
              "Label": "Red",
              "Value": 300,
              "Color": "#FF6384",
              "Hover Color": "#FF6384"
            },
            {
              "Label": "Blue",
              "Value": 50,
              "Color": "#36A2EB",
              "Hover Color": "#36A2EB"
            },
            {
              "Label": "Yellow",
              "Value": 100,
              "Color": "#FFCE56",
              "Hover Color": "#FFCE56"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "pieChart.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "pieChart.bundle": {
          "type": "path",
          "path": "dist/pieChart.bundle.js"
        },
        "chartjs": {
          "type": "path",
          "path": "src/javascripts/chartjs/Chart.min.js",
          "globalName": "Chart"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "PieChartStrings": {
          "defaultPath": "lib/webparts/pieChart/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "65c7a7f0-6875-4731-8956-2a8d423edc1d",
    "alias": "ImagePuzzle",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Image Puzzle"
        },
        "description": {
          "default": "From an image of your SharePoint site, this Web Part will generate a puzzle effect. The image will be automatically cut into pieces, and the pieces are going to move next to the other before returning to the normal state of the image. Nice to add style to your page."
        },
        "officeFabricIconFontName": "Puzzle",
        "properties": {
          "image": "",
          "alt": "",
          "linkText": "",
          "linkUrl": "",
          "dimension": {
            "width": "100%",
            "height": "100%"
          },
          "frequence": 2000,
          "columns": 4,
          "rows": 4,
          "margin": 2,
          "distinct": false
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "imagePuzzle.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "imagePuzzle.bundle": {
          "type": "path",
          "path": "dist/imagePuzzle.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "jigsaw": {
          "type": "path",
          "path": "src/javascripts/imagePuzzle/jquery.image-jigsaw.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "ImagePuzzleStrings": {
          "defaultPath": "lib/webparts/imagePuzzle/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "6b1bd026-d733-4828-85ba-41fdae288a45",
    "alias": "ArcText",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "ArcText"
        },
        "description": {
          "default": "With this Web Part, you can add a text with effect of curve. You can editing your title appearance, and choose the degree of the curve."
        },
        "officeFabricIconFontName": "Font",
        "properties": {
          "text": "My lipsum sample curved title",
          "align": "center",
          "size": "28px",
          "radius": "500",
          "reverse": false,
          "rotateLetters": true
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "arc-text.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "arc-text.bundle": {
          "type": "path",
          "path": "dist/arc-text.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "arctext": {
          "type": "path",
          "path": "src/javascripts/arcText/jquery.arctext.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "arcTextStrings": {
          "defaultPath": "lib/webparts/arcText/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "74ebd2e5-98b8-46cf-89a1-cacef2f52203",
    "alias": "SocialShare",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "8be34b8b-4fe8-4adb-b4b6-cc88a51f8646",
        "group": {
          "default": "Social Tools"
        },
        "title": {
          "default": "Social Share"
        },
        "description": {
          "default": "A web part to insert social share buttons as Yammer, Linkedin, Twitter, Facebook and more than 100 other social providers thanks to the Addthis services."
        },
        "officeFabricIconFontName": "Like",
        "properties": {
          "pubid": "ra-",
          "size": "32x32",
          "style": "default",
          "yammer": true,
          "linkedin": true,
          "twitter": true,
          "facebook": true,
          "googlePlus": true,
          "more": true,
          "count": true,
          "services": []
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "socialShare.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "socialShare.bundle": {
          "type": "path",
          "path": "dist/socialShare.bundle.js"
        },
        "SocialShareStrings": {
          "defaultPath": "lib/webparts/socialShare/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "7bd1d81d-c811-461b-1704-ad1b5e31dc2c",
    "alias": "ImageColor",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "a509fe47-209d-48b7-b27a-6f3841c4033a",
        "group": {
          "default": "Images Galleries and Tools"
        },
        "title": {
          "default": "Image Color"
        },
        "description": {
          "default": "This Web Part allows you to select an image and automatically apply a color effect. This Web Part uses libraries of CSS3 effects to color images."
        },
        "officeFabricIconFontName": "EditPhoto",
        "properties": {
          "alt": "",
          "linkText": "",
          "linkUrl": ""
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "imageColor.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "imageColor.bundle": {
          "type": "path",
          "path": "dist/imageColor.bundle.js"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "ImageColorStrings": {
          "defaultPath": "lib/webparts/imageColor/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "7bded87d-c81a-461b-b704-adab5e3adc2c",
    "alias": "MessageBar",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "1df557f4-e29a-4d2d-b1bf-a6b0b68aae90",
        "group": {
          "default": "Tools"
        },
        "title": {
          "default": "Message Bar"
        },
        "description": {
          "default": "Insert a message bar to your page, for example set a maintenance warning text, etc. Very convenient to share a simple and highly visible message to your visitors."
        },
        "officeFabricIconFontName": "Error",
        "properties": {
          "text": "<p>Warning: this site is <b>under maintenance</b>. <a href='#'>More info</a></p>",
          "font": "",
          "fontSize": "18px",
          "fontColor": "#000000",
          "backgroundColor": "#ffeaea",
          "icon": "ms-Icon--Warning",
          "enabled": true
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "messageBar.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "messageBar.bundle": {
          "type": "path",
          "path": "dist/messageBar.bundle.js"
        },
        "MessageBarStrings": {
          "defaultPath": "lib/webparts/messageBar/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "802fdd09-ea24-4929-bf84-be665dd89420",
    "alias": "LineChart",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "7a7091d9-d176-450b-a04f-9fa48ca1981b",
        "group": {
          "default": "Charts, Graphs and Maps"
        },
        "title": {
          "default": "Line Chart"
        },
        "description": {
          "default": "A simple and effective Web Part to generate a line chart in a page. You can choose the points on the line, set the line and fill, color, etc. Convenient to view financial results for example."
        },
        "officeFabricIconFontName": "Chart",
        "properties": {
          "responsive": false,
          "horizontal": true,
          "xAxesEnable": true,
          "yAxesEnable": true,
          "dimension": {
            "width": "450px",
            "height": "450px"
          },
          "position": "top",
          "title": "Months Line Chart",
          "titleEnable": true,
          "titleColor": "#666",
          "titleSize": "12px",
          "pointStyle": "circle",
          "fill": true,
          "lineTension": 0.25,
          "showLine": true,
          "steppedLine": false,
          "fillColor": "rgba(75, 192, 192, 0.2)",
          "items": [
            {
              "Label": "January",
              "Value": 65
            },
            {
              "Label": "February",
              "Value": 59
            },
            {
              "Label": "March",
              "Value": 80
            },
            {
              "Label": "April",
              "Value": 81
            },
            {
              "Label": "May",
              "Value": 56
            },
            {
              "Label": "June",
              "Value": 55
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "lineChart.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "lineChart.bundle": {
          "type": "path",
          "path": "dist/lineChart.bundle.js"
        },
        "chartjs": {
          "type": "path",
          "path": "src/javascripts/chartjs/Chart.min.js",
          "globalName": "Chart"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "LineChartStrings": {
          "defaultPath": "lib/webparts/lineChart/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "81146368-785c-47c2-b313-66d83f1bb4f8",
    "alias": "BingTranslator",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "1df557f4-e29a-4d2d-b1bf-a6b0b68aae90",
        "group": {
          "default": "Tools"
        },
        "title": {
          "default": "Bing Translator"
        },
        "description": {
          "default": "Insert a Bing Translator widget to automatically translate the current page in another language. This WebPart is going to add to your page a \"Translate\" button. When user click on this button, it can translate in-place and automatically the content of the page in the language of his choice."
        },
        "officeFabricIconFontName": "BingLogo",
        "properties": {
          "theme": "Dark",
          "color": "#ffffff",
          "backgroundColor": "#555555",
          "start": "Manual",
          "language": ""
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "bingTranslator.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "bingTranslator.bundle": {
          "type": "path",
          "path": "dist/bingTranslator.bundle.js"
        },
        "BingTranslatorStrings": {
          "defaultPath": "lib/webparts/bingTranslator/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "89bdfa67-e90d-4b2b-b2db-18dbba2c71cd",
    "alias": "QRCode",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "1df557f4-e29a-4d2d-b1bf-a6b0b68aae90",
        "group": {
          "default": "Tools"
        },
        "title": {
          "default": "QR Code"
        },
        "description": {
          "default": "Insert a QR Code in your SharePoint pages and modify the associated text, size, etc. A QRCode is very handy for example to allow your users to access simply and quickly to a page on your Intranet from a smartphone."
        },
        "officeFabricIconFontName": "Camera",
        "properties": {
          "text": "https://contoso.sharepoint.com",
          "dimension": {
            "width": "250px",
            "height": "250px"
          },
          "mode": "canvas"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "qrCode.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "qrCode.bundle": {
          "type": "path",
          "path": "dist/qrCode.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "qrcode": {
          "type": "path",
          "path": "src/javascripts/qrcode/jquery.qrcode.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "QrCodeStrings": {
          "defaultPath": "lib/webparts/qrCode/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "89d609dd-9fb6-4353-aab4-6215ac1bb7f6",
    "alias": "Accordion",
    "componentType": "WebPart",
    "version": "0.0.1",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Accordion"
        },
        "description": {
          "default": "As for the Web Part of the tabs, you can manage the content in the form of accordion sections. Add, edit or remove your tabs and change the content with the WYSIWYG editor."
        },
        "officeFabricIconFontName": "DoubleChevronDown",
        "properties": {
          "inline": true,
          "collapsible": false,
          "animate": true,
          "speed": 200,
          "heightStyle": "auto",
          "tabs": [
            {
              "Title": "Elementum",
              "Content": "<h1>Lorem ipsum dolor sit amet</h1><p>consectetur adipiscing elit. Fusce fringilla neque id metus egestas, vitae pharetra arcu porttitor. Nullam consequat id urna eu pellentesque. Fusce ut velit pellentesque, ornare libero sit amet, tristique neque. Cras   incidunt et nisl nec mattis. Proin nisi nunc, rhoncus ac laoreet eget, pulvinar quis nisl. Vestibulum libero massa, eleifend ut suscipit et, aliquet id lorem. Aliquam in ornare arcu. Curabitur non turpis tortor.</p> <p>Nunc vehicula convallis augue, a molestie elit feugiat id. Fusce semper fermentum est vel viverra. Nam pellentesque tempus tempus. In molestie rutrum maximus. Pellentesque eget nulla neque. Phasellus egestas tempus eros, et fermentum sem mattis eget. Fusce vulputate nisl et mauris condimentum, non semper nisl elementum. Duis placerat purus id libero aliquet, at fermentum nisi malesuada. Morbi congue orci id ipsum pellentesque, non consequat enim fringilla.</p>"
            },
            {
              "Title": "Tab 2",
              "Content": "<b>Sample with rich html</b>"
            },
            {
              "Title": "Tab 3",
              "Content": "<a href='#'>Link</a>"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "accordion.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "accordion.bundle": {
          "type": "path",
          "path": "dist/accordion.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "jqueryui": {
          "type": "path",
          "path": "node_modules/jqueryui/jquery-ui.js"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "AccordionStrings": {
          "defaultPath": "lib/webparts/accordion/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        },
        "@microsoft/sp-loader": {
          "type": "component",
          "version": "1.1.1",
          "id": "1c6c9123-7aac-41f3-a376-3caea41ed83f"
        }
      }
    }
  },
  {
    "id": "944744d9-a870-4bb7-a732-f63da7558609",
    "alias": "StockInfo",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "1df557f4-e29a-4d2d-b1bf-a6b0b68aae90",
        "group": {
          "default": "Tools"
        },
        "title": {
          "default": "Stock Info"
        },
        "description": {
          "default": "Generates as graph picture the current stock value of a specified stock. With this Web Part, you can for example share the current stock price of your company on your homepage. This Web Part uses the Yahoo! Financial Services."
        },
        "officeFabricIconFontName": "Financial",
        "properties": {
          "stock": "MSFT",
          "lang": "en-US",
          "region": "US",
          "dimension": {
            "width": "250px",
            "height": "250px"
          }
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "stockInfo.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "stockInfo.bundle": {
          "type": "path",
          "path": "dist/stockInfo.bundle.js"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "StockInfoStrings": {
          "defaultPath": "lib/webparts/stockInfo/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "a4aacd2d-2a55-475c-5483-51a37437b388",
    "alias": "AnimatedText",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "4a6dc2e5-7bd2-4ab7-a830-8107d2b7ee5a",
        "group": {
          "default": "Text Tools"
        },
        "title": {
          "default": "Animated Text"
        },
        "description": {
          "default": "This Web Part allows you to add a text with an animation. You can choose among a large number of animation (fade, resizing, time, rotation, etc.), choose do it, color, size, etc."
        },
        "officeFabricIconFontName": "FontSize",
        "properties": {
          "text": "Lipsum lipsum",
          "font": "",
          "fontSize": "",
          "fontColor": "#000000",
          "backgroundColor": "#FFFFFF",
          "effect": "spin",
          "effectDirection": "forward",
          "timing": 50,
          "duration": 800,
          "letterEnd": "restore",
          "elementEnd": "restore",
          "align": "left"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "animatedText.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "animatedText.bundle": {
          "type": "path",
          "path": "dist/animatedText.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "letterfx": {
          "type": "path",
          "path": "src/javascripts/letterfx/letterfx.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "AnimatedTextStrings": {
          "defaultPath": "lib/webparts/animatedText/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "b27e9f72-10b4-4880-95e3-5ca8fb223a1c",
    "alias": "MediaPlayer",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "9054c3f7-ed44-4b45-bb29-97c6253d3ae4",
        "group": {
          "default": "Video and Audio"
        },
        "title": {
          "default": "Media Player"
        },
        "description": {
          "default": "This Web Part is an alternative player for videos or audio files. This player allows you to play video files in HTML5 mode, with streamed videos to different formats and also from Youtube or Vimeo. This player is elegant and also lets you add subtitles to videos in different languages."
        },
        "officeFabricIconFontName": "MusicInCollectionFill",
        "properties": {
          "player": "youtube",
          "html5video": "//cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.mp4",
          "html5cover": "//cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.jpg",
          "html5captions": [
            {
              "Title": "English",
              "SrcLen": "en",
              "Url": "//cdn.selz.com/plyr/1.5/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
            }
          ],
          "youtubeVideoId": "bTqVqk7FSmY",
          "vimeoVideoId": "143418951",
          "audio": "//cdn.selz.com/plyr/1.5/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "mediaPlayer.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "mediaPlayer.bundle": {
          "type": "path",
          "path": "dist/mediaPlayer.bundle.js"
        },
        "plyr": {
          "type": "path",
          "path": "src/javascripts/mediaPlayer/plyr.js",
          "globalName": "plyr"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "MediaPlayerStrings": {
          "defaultPath": "lib/webparts/mediaPlayer/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "b6330715-c92a-479c-ae83-510474079988",
    "alias": "3DCarousel",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "72505c62-b3c0-4cc3-89d8-f2adc8d962a0",
        "group": {
          "default": "News Management"
        },
        "title": {
          "default": "3D Carousel"
        },
        "description": {
          "default": "Insert a 3D Carousel in your SharePoint pages. With this Web Part, you can manage your menu items and create automatically a 3D carousel."
        },
        "officeFabricIconFontName": "Sync",
        "properties": {
          "speed": 6,
          "showButton": true,
          "showTitle": true,
          "autoPlay": true,
          "autoPlayDelay": 2000,
          "bringToFront": true,
          "mirrorGap": 2,
          "mirrorHeight": 0.2,
          "mirrorOpacity": 0.4,
          "yOrigin": 43,
          "yRadius": 86,
          "xOrigin": 383,
          "xRadius": 320,
          "height": 400,
          "font": "\"Segoe UI\",Frutiger,\"Frutiger Linotype\",\"Dejavu Sans\",\"Helvetica Neue\",Arial,sans-serif",
          "fontSize": "28px",
          "fontColor": "#000000",
          "itemHeight": 180,
          "items": [
            {
              "Title": "Skype",
              "Enabled": "true",
              "Link Text": "Download",
              "Link Url": "https://www.skype.com/en/business/skype-for-business/",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/skype.png"
            },
            {
              "Title": "OneNote",
              "Enabled": "true",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/onenote.png"
            },
            {
              "Title": "Delve",
              "Enabled": "true",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/delve.png"
            },
            {
              "Title": "Office Video",
              "Enabled": "true",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/o365video.png"
            },
            {
              "Title": "Word",
              "Enabled": "true",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/word.png"
            },
            {
              "Title": "Excel",
              "Enabled": "true",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/excel.png"
            },
            {
              "Title": "PowerPoint",
              "Enabled": "true",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/logos/powerpoint.png"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "carousel-3-d.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "carousel-3-d.bundle": {
          "type": "path",
          "path": "dist/carousel-3-d.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "cloud9carousel": {
          "type": "path",
          "path": "src/javascripts/cloud9carousel/jquery.cloud9carousel.js",
          "globalDependencies": [
            "jquery",
            "jqueryreflection"
          ],
          "globalName": "jQuery"
        },
        "jqueryreflection": {
          "type": "path",
          "path": "src/javascripts/reflection/jquery.reflection.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "carousel3DStrings": {
          "defaultPath": "lib/webparts/carousel3D/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "b63ccc15-cc2a-479c-ae83-510474c79c88",
    "alias": "coverflow",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "72505c62-b3c0-4cc3-89d8-f2adc8d962a0",
        "group": {
          "default": "News Management"
        },
        "title": {
          "default": "Coverflow"
        },
        "description": {
          "default": "Generates a Coverflow Apple like menu in your pages. Manage your menu items with title and picture and create a cool coverflow menu."
        },
        "officeFabricIconFontName": "Sections",
        "properties": {
          "duration": "normal",
          "easing": "swing",
          "density": 2,
          "innerOffset": 50,
          "innerScale": 0.7,
          "shadow": true,
          "textPanelEnable": true,
          "textPanelAlign": "left",
          "textPanelFontSize": "16px",
          "textPanelFont": "\"Segoe UI\",Frutiger,\"Frutiger Linotype\",\"Dejavu Sans\",\"Helvetica Neue\",Arial,sans-serif",
          "textPanelFontColor": "#ffffff",
          "textPanelBackgroundColor": "rgba(0,0,0,0.6)",
          "items": [
            {
              "Title": "Attic",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "images/coverflow/attic.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/attic.jpg"
            },
            {
              "Title": "Aurora",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/aurora.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/aurora.jpg"
            },
            {
              "Title": "Barbecue",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/barbecue.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/barbecue.jpg"
            },
            {
              "Title": "Black Swan",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/blackswan.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/blackswan.jpg"
            },
            {
              "Title": "Chess",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/chess.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/chess.jpg"
            },
            {
              "Title": "Fire",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/fire.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/fire.jpg"
            },
            {
              "Title": "Keyboard",
              "Enabled": "true",
              "Link Text": "View",
              "Link Url": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/keyboard.jpg",
              "Picture": "https://spfx40fantastics.azureedge.net/spfx40fantastics/images/coverflow/keyboard.jpg"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "coverflow.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "coverflow.bundle": {
          "type": "path",
          "path": "dist/coverflow.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "jqueryui": {
          "type": "path",
          "path": "node_modules/jqueryui/jquery-ui.js"
        },
        "coverflow": {
          "type": "path",
          "path": "src/javascripts/coverflow/jquery.coverflow.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "interpolate": {
          "type": "path",
          "path": "src/javascripts/coverflow/jquery.interpolate.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "touchSwipe": {
          "type": "path",
          "path": "src/javascripts/coverflow/jquery.touchSwipe.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "dockMenuStrings": {
          "defaultPath": "lib/webparts/coverflow/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "cc3483eb-bb8b-45ac-95f5-8dd8529a2a5c",
    "alias": "PolarChart",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "7a7091d9-d176-450b-a04f-9fa48ca1981b",
        "group": {
          "default": "Charts, Graphs and Maps"
        },
        "title": {
          "default": "Polar Chart"
        },
        "description": {
          "default": "A web part to insert a polar chart, modify the data and the render. Very easy & quick to use in a SharePoint page."
        },
        "officeFabricIconFontName": "MarketDown",
        "properties": {
          "responsive": false,
          "dimension": {
            "width": "450px",
            "height": "450px"
          },
          "animateRotate": true,
          "animateScale": false,
          "position": "top",
          "title": "Colors Polar Chart",
          "titleEnable": true,
          "titleColor": "#666",
          "titleSize": "12px",
          "legendEnable": true,
          "legendPosition": "top",
          "legendColor": "#666",
          "legendSize": "12px",
          "items": [
            {
              "Label": "Red",
              "Value": 11,
              "Color": "#FF6384",
              "Hover Color": "#FF6384"
            },
            {
              "Label": "Green",
              "Value": 16,
              "Color": "#4BC0C0",
              "Hover Color": "#4BC0C0"
            },
            {
              "Label": "Yellow",
              "Value": 7,
              "Color": "#FFCE56",
              "Hover Color": "#FFCE56"
            },
            {
              "Label": "Grey",
              "Value": 3,
              "Color": "#E7E9ED",
              "Hover Color": "#E7E9ED"
            },
            {
              "Label": "Blue",
              "Value": 14,
              "Color": "#36A2EB",
              "Hover Color": "#36A2EB"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "polarChart.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "polarChart.bundle": {
          "type": "path",
          "path": "dist/polarChart.bundle.js"
        },
        "chartjs": {
          "type": "path",
          "path": "src/javascripts/chartjs/Chart.min.js",
          "globalName": "Chart"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "PolarChartStrings": {
          "defaultPath": "lib/webparts/polarChart/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "d0f9e0eb-7a28-4c30-8459-e04a48beda2a",
    "alias": "TweetsFeed",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "8be34b8b-4fe8-4adb-b4b6-cc88a51f8646",
        "group": {
          "default": "Social Tools"
        },
        "title": {
          "default": "Tweets Feed"
        },
        "description": {
          "default": "With this Web Part, you can easily add a Twitter feed to any page. You have to specify the Twitter account you want to view messages, configure the Visual rendering, and twitter will be integrated into your site."
        },
        "officeFabricIconFontName": "Share",
        "properties": {
          "autoLimit": true,
          "limit": 250,
          "header": true,
          "footer": false,
          "borders": false,
          "scrollbars": true,
          "transparent": true,
          "linkColor": "#820bbb",
          "borderColor": "#a80000"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "tweetsFeed.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "tweetsFeed.bundle": {
          "type": "path",
          "path": "dist/tweetsFeed.bundle.js"
        },
        "twitter": {
          "type": "path",
          "path": "src/javascripts/twitter/widgets.js",
          "globalName": "twttr"
        },
        "TweetsFeedStrings": {
          "defaultPath": "lib/webparts/tweetsFeed/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "d13752b9-1a71-45ca-96fe-918f0c9631cb",
    "alias": "RSSReader",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "8be34b8b-4fe8-4adb-b4b6-cc88a51f8646",
        "group": {
          "default": "Social Tools"
        },
        "title": {
          "default": "RSS Reader"
        },
        "description": {
          "default": "A web part to insert a full client side RSS/Atom Feed in your SharePoint pages. You can easily integrated a topical or competitive intelligence stream into your pages to your favorite RSS feeds."
        },
        "officeFabricIconFontName": "InternetSharing",
        "properties": {
          "feedUrl": "https://blogs.office.com/feed/",
          "maxCount": 10,
          "showDesc": true,
          "showPubDate": true,
          "descCharacterLimit": 100,
          "titleLinkTarget": "_blank",
          "dateFormat": "MM/DD/YYYY",
          "dateFormatLang": "en",
          "backgroundColor": "#ffffff",
          "font": "",
          "fontSize": "16px",
          "fontColor": "#4EBAFF"
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "rssReader.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "rssReader.bundle": {
          "type": "path",
          "path": "dist/rssReader.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "feedek": {
          "type": "path",
          "path": "src/javascripts/rssReader/FeedEk.min.js",
          "globalDependencies": [
            "jquery",
            "moment"
          ],
          "globalName": "jQuery"
        },
        "moment": {
          "type": "path",
          "path": "src/javascripts/rssReader/moment.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "RssReaderStrings": {
          "defaultPath": "lib/webparts/rssReader/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "e762c85a-f068-4067-a8c0-b5cdbf4fcce7",
    "alias": "AudioEqualizer",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "9054c3f7-ed44-4b45-bb29-97c6253d3ae4",
        "group": {
          "default": "Video and Audio"
        },
        "title": {
          "default": "Audio Equalizer"
        },
        "description": {
          "default": "Instead of the classic audio player, you can use a fun player with an equalizer. The equalizer adds an effect on music that drives your page and the user experience. You can configure your equalizer by modifying the columns, color, speed, etc."
        },
        "officeFabricIconFontName": "Equalizer",
        "properties": {
          "audio": "",
          "audioType": "audio/mp3",
          "dimension": {
            "width": "600px",
            "height": "150px"
          },
          "color": "#800080",
          "color1": "#B837F2",
          "color2": "#009AD9",
          "bars": 20,
          "barMargin": 1,
          "components": 10,
          "componentMargin": 1,
          "frequency": 9,
          "refreshTime": 100
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "audioEqualizer.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "audioEqualizer.bundle": {
          "type": "path",
          "path": "dist/audioEqualizer.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "equalizer": {
          "type": "path",
          "path": "src/javascripts/audioEqualizer/jquery.equalizer.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "reverseorder": {
          "type": "path",
          "path": "src/javascripts/audioEqualizer/jquery.reverseorder.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "AudioEqualizerStrings": {
          "defaultPath": "lib/webparts/audioEqualizer/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        }
      }
    }
  },
  {
    "id": "ee6ccc68-d0ec-456c-8968-08a705191cf1",
    "alias": "TilesMenu",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "supportsFullBleed": true,
    "preconfiguredEntries": [
      {
        "groupId": "72505c62-b3c0-4cc3-89d8-f2adc8d962a0",
        "group": {
          "default": "News Management"
        },
        "title": {
          "default": "Tiles Menu"
        },
        "description": {
          "default": "This Web Part allows you to very easily create a menu in form of tiles that is responsive and adapted for mobile. You can directly manage the items on your menu, with a title, an image and manage Visual rendering options."
        },
        "officeFabricIconFontName": "Tiles",
        "properties": {
          "justified": true,
          "enableIcons": false,
          "enableShadow": false,
          "enableBorder": false,
          "tilesMinColumns": 2,
          "tilesMaxColumns": 0,
          "tilesJustifiedRowHeight": 150,
          "spaceBetweenCols": 3,
          "borderColor": "#CCCCCC",
          "border": 2,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": false,
          "textPanelPosition": "inline-bottom",
          "textPanelOpacity": 0.4,
          "items": [
            {
              "Title": "Discover the new work station",
              "Enable": "true",
              "Description": "Smart, fast & easy: discover the new work station",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-204611-large.jpeg"
            },
            {
              "Title": "All the Intranet in your Smart Phone",
              "Enable": "true",
              "Description": "Stay connected with the Intranet App",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-large.jpg"
            },
            {
              "Title": "Take a break!",
              "Enable": "true",
              "Description": "Discover the new coffees selection",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-70221-large.jpeg"
            },
            {
              "Title": "Discover the new meeting areas",
              "Enable": "true",
              "Description": "New meeting areas available at Level 2",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/space-desk-workspace-coworking-large.jpg"
            },
            {
              "Title": "New travel policies",
              "Enable": "true",
              "Description": "The new travel policies are available",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-large-car.jpg"
            },
            {
              "Title": "New commons",
              "Enable": "false",
              "Description": "View the video of the new commons",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-58801-large.jpeg"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "tilesMenu.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "tilesMenu.bundle": {
          "type": "path",
          "path": "dist/tilesMenu.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-tiles": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-tiles.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "TilesMenuStrings": {
          "defaultPath": "lib/webparts/tilesMenu/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "f6adeeb5-6e0c-46e8-a2e3-88b193b6c424",
    "alias": "NewsSlider",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "72505c62-b3c0-4cc3-89d8-f2adc8d962a0",
        "group": {
          "default": "News Management"
        },
        "title": {
          "default": "News Slider"
        },
        "description": {
          "default": "Insert a News Slider Tiles control to your pages. In a few clicks you can create a slider with buttons allowing you to navigate horizontally in tiles. You can define your elements and customize the look and feel of your slider. This Web Part is responsive."
        },
        "officeFabricIconFontName": "PageRight",
        "properties": {
          "enableArrows": true,
          "enableBorder": false,
          "enableIcons": false,
          "borderColor": "#CCCCCC",
          "border": 0,
          "tileDimension": {
            "width": "160px",
            "height": "160px"
          },
          "pauseOnMouseover": true,
          "autoplay": true,
          "speed": 2000,
          "textPanelEnable": true,
          "textPanelAlwaysOnTop": false,
          "textPanelOpacity": 0.4,
          "items": [
            {
              "Title": "Discover the new work station",
              "Enable": "true",
              "Description": "Smart, fast & easy: discover the new work station",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-204611-large.jpeg"
            },
            {
              "Title": "All the Intranet in your Smart Phone",
              "Enable": "true",
              "Description": "Stay connected with the Intranet App",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-large.jpg"
            },
            {
              "Title": "Take a break!",
              "Enable": "true",
              "Description": "Discover the new coffees selection",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-70221-large.jpeg"
            },
            {
              "Title": "Discover the new meeting areas",
              "Enable": "true",
              "Description": "New meeting areas available at Level 2",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/space-desk-workspace-coworking-large.jpg"
            },
            {
              "Title": "New travel policies",
              "Enable": "true",
              "Description": "The new travel policies are available",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-large-car.jpg"
            },
            {
              "Title": "New commons",
              "Enable": "false",
              "Description": "View the video of the new commons",
              "Link Url": "#",
              "Picture": "//spfx40fantastics.azureedge.net/spfx40fantastics/images/menu/pexels-photo-58801-large.jpeg"
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "newsSlider.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "newsSlider.bundle": {
          "type": "path",
          "path": "dist/newsSlider.bundle.js"
        },
        "jquery": {
          "type": "path",
          "path": "node_modules/jquery/dist/jquery.min.js",
          "globalName": "jQuery"
        },
        "unitegallery": {
          "type": "path",
          "path": "src/javascripts/unitegallery/unitegallery.min.js",
          "globalDependencies": [
            "jquery"
          ],
          "globalName": "jQuery"
        },
        "ug-theme-carousel": {
          "type": "path",
          "path": "src/javascripts/unitegallery/ug-theme-carousel.js",
          "globalDependencies": [
            "jquery",
            "unitegallery"
          ],
          "globalName": "jQuery"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "NewsSliderStrings": {
          "defaultPath": "lib/webparts/newsSlider/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  },
  {
    "id": "fd2d0897-88b8-42a8-a825-1ec3bf68277f",
    "alias": "RadarChart",
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "preconfiguredEntries": [
      {
        "groupId": "7a7091d9-d176-450b-a04f-9fa48ca1981b",
        "group": {
          "default": "Charts, Graphs and Maps"
        },
        "title": {
          "default": "Radar Chart"
        },
        "description": {
          "default": "Offer elegant and alternative views to your data with this Web part. With the radar chart, you can for example easily see comparisons between data."
        },
        "officeFabricIconFontName": "Starburst",
        "properties": {
          "responsive": false,
          "horizontal": true,
          "xAxesEnable": true,
          "yAxesEnable": true,
          "dimension": {
            "width": "450px",
            "height": "450px"
          },
          "position": "top",
          "title": "Months Radar",
          "titleEnable": true,
          "titleColor": "#666",
          "titleSize": "12px",
          "pointStyle": "circle",
          "fill": true,
          "lineTension": 0.05,
          "fillColor": "rgba(75, 192, 192, 0.3)",
          "items": [
            {
              "Label": "January",
              "Value": 65
            },
            {
              "Label": "February",
              "Value": 59
            },
            {
              "Label": "March",
              "Value": 90
            },
            {
              "Label": "April",
              "Value": 81
            },
            {
              "Label": "May",
              "Value": 56
            },
            {
              "Label": "June",
              "Value": 55
            }
          ]
        }
      }
    ],
    "loaderConfig": {
      "entryModuleId": "radarChart.bundle",
      "internalModuleBaseUrls": [
        "http://localhost:8080/"
      ],
      "scriptResources": {
        "radarChart.bundle": {
          "type": "path",
          "path": "dist/radarChart.bundle.js"
        },
        "chartjs": {
          "type": "path",
          "path": "src/javascripts/chartjs/Chart.min.js",
          "globalName": "Chart"
        },
        "sp-client-custom-fields/strings": {
          "defaultPath": "node_modules/sp-client-custom-fields/lib/loc/en-us.js",
          "type": "localizedPath"
        },
        "RadarChartStrings": {
          "defaultPath": "lib/webparts/radarChart/loc/en-us.js",
          "type": "localizedPath"
        },
        "react": {
          "type": "component",
          "version": "15.4.2",
          "id": "0d910c1c-13b9-4e1c-9aa4-b008c5e42d7d",
          "failoverPath": "node_modules/react/dist/react.js"
        },
        "@microsoft/sp-webpart-base": {
          "type": "component",
          "version": "1.1.1",
          "id": "974a7777-0990-4136-8fa6-95d80114c2e0"
        },
        "react-dom": {
          "type": "component",
          "version": "15.4.2",
          "id": "aa0a46ec-1505-43cd-a44a-93f3a5aa460a",
          "failoverPath": "node_modules/react-dom/dist/react-dom.js"
        },
        "@microsoft/sp-core-library": {
          "type": "component",
          "version": "1.1.0",
          "id": "7263c7d0-1d6a-45ec-8d85-d4d1d234171b"
        },
        "@microsoft/sp-http": {
          "type": "component",
          "version": "1.1.1",
          "id": "c07208f0-ea3b-4c1a-9965-ac1b825211a6"
        }
      }
    }
  }
];
}
exports.getManifests = getManifests;

//# sourceMappingURL=manifestsFile.js.map


/***/ })
/******/ ]);
});