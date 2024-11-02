import {
  __decorate
} from "./chunk-NCOMLVU7.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-WKYGNSYM.js";

// node_modules/ramda/es/internal/_arity.js
function _arity(n25, fn) {
  switch (n25) {
    case 0:
      return function() {
        return fn.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a22) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a22, a32) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a22, a32, a42) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a22, a32, a42, a52) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a22, a32, a42, a52, a62) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a22, a32, a42, a52, a62, a72) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a22, a32, a42, a52, a62, a72, a82) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a22, a32, a42, a52, a62, a72, a82, a92) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}

// node_modules/ramda/es/internal/_isPlaceholder.js
function _isPlaceholder(a20) {
  return a20 != null && typeof a20 === "object" && a20["@@functional/placeholder"] === true;
}

// node_modules/ramda/es/internal/_curry1.js
function _curry1(fn) {
  return function f1(a20) {
    if (arguments.length === 0 || _isPlaceholder(a20)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

// node_modules/ramda/es/internal/_curry2.js
function _curry2(fn) {
  return function f22(a20, b6) {
    switch (arguments.length) {
      case 0:
        return f22;
      case 1:
        return _isPlaceholder(a20) ? f22 : _curry1(function(_b4) {
          return fn(a20, _b4);
        });
      default:
        return _isPlaceholder(a20) && _isPlaceholder(b6) ? f22 : _isPlaceholder(a20) ? _curry1(function(_a4) {
          return fn(_a4, b6);
        }) : _isPlaceholder(b6) ? _curry1(function(_b4) {
          return fn(a20, _b4);
        }) : fn(a20, b6);
    }
  };
}

// node_modules/ramda/es/internal/_curryN.js
function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    var hasPlaceholder = false;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      } else {
        hasPlaceholder = true;
      }
      combinedIdx += 1;
    }
    return !hasPlaceholder && left <= 0 ? fn.apply(this, combined) : _arity(Math.max(0, left), _curryN(length, combined, fn));
  };
}

// node_modules/ramda/es/curryN.js
var curryN = _curry2(function curryN2(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});
var curryN_default = curryN;

// node_modules/ramda/es/is.js
var is = _curry2(function is2(Ctor, val) {
  return val instanceof Ctor || val != null && (val.constructor === Ctor || Ctor.name === "Object" && typeof val === "object");
});
var is_default = is;

// node_modules/ramda/es/internal/_has.js
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// node_modules/ramda/es/internal/_isArguments.js
var toString = Object.prototype.toString;
var _isArguments = function() {
  return toString.call(arguments) === "[object Arguments]" ? function _isArguments2(x6) {
    return toString.call(x6) === "[object Arguments]";
  } : function _isArguments2(x6) {
    return _has("callee", x6);
  };
}();
var isArguments_default = _isArguments;

// node_modules/ramda/es/internal/_isArray.js
var isArray_default = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
};

// node_modules/ramda/es/internal/_isObject.js
function _isObject(x6) {
  return Object.prototype.toString.call(x6) === "[object Object]";
}

// node_modules/ramda/es/internal/_isString.js
function _isString(x6) {
  return Object.prototype.toString.call(x6) === "[object String]";
}

// node_modules/ramda/es/internal/_isTypedArray.js
function _isTypedArray(val) {
  var type3 = Object.prototype.toString.call(val);
  return type3 === "[object Uint8ClampedArray]" || type3 === "[object Int8Array]" || type3 === "[object Uint8Array]" || type3 === "[object Int16Array]" || type3 === "[object Uint16Array]" || type3 === "[object Int32Array]" || type3 === "[object Uint32Array]" || type3 === "[object Float32Array]" || type3 === "[object Float64Array]" || type3 === "[object BigInt64Array]" || type3 === "[object BigUint64Array]";
}

// node_modules/ramda/es/empty.js
var empty = _curry1(function empty2(x6) {
  return x6 != null && typeof x6["fantasy-land/empty"] === "function" ? x6["fantasy-land/empty"]() : x6 != null && x6.constructor != null && typeof x6.constructor["fantasy-land/empty"] === "function" ? x6.constructor["fantasy-land/empty"]() : x6 != null && typeof x6.empty === "function" ? x6.empty() : x6 != null && x6.constructor != null && typeof x6.constructor.empty === "function" ? x6.constructor.empty() : isArray_default(x6) ? [] : _isString(x6) ? "" : _isObject(x6) ? {} : isArguments_default(x6) ? /* @__PURE__ */ function() {
    return arguments;
  }() : _isTypedArray(x6) ? x6.constructor.from("") : void 0;
});
var empty_default = empty;

// node_modules/ramda/es/internal/_arrayFromIterator.js
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}

// node_modules/ramda/es/internal/_includesWith.js
function _includesWith(pred, x6, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (pred(x6, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}

// node_modules/ramda/es/internal/_functionName.js
function _functionName(f9) {
  var match = String(f9).match(/^function (\w*)/);
  return match == null ? "" : match[1];
}

// node_modules/ramda/es/internal/_objectIs.js
function _objectIs(a20, b6) {
  if (a20 === b6) {
    return a20 !== 0 || 1 / a20 === 1 / b6;
  } else {
    return a20 !== a20 && b6 !== b6;
  }
}
var objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;

// node_modules/ramda/es/keys.js
var hasEnumBug = !{
  toString: null
}.propertyIsEnumerable("toString");
var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
var hasArgsEnumBug = function() {
  "use strict";
  return arguments.propertyIsEnumerable("length");
}();
var contains = function contains2(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};
var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? _curry1(function keys2(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) : _curry1(function keys3(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== "length")) {
      ks[ks.length] = prop;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];
      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }
      nIdx -= 1;
    }
  }
  return ks;
});
var keys_default = keys;

// node_modules/ramda/es/type.js
var type = _curry1(function type2(val) {
  return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
});
var type_default = type;

// node_modules/ramda/es/internal/_equals.js
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a20 = _arrayFromIterator(aIterator);
  var b6 = _arrayFromIterator(bIterator);
  function eq(_a4, _b4) {
    return _equals(_a4, _b4, stackA.slice(), stackB.slice());
  }
  return !_includesWith(function(b7, aItem) {
    return !_includesWith(eq, aItem, b7);
  }, b6, a20);
}
function _equals(a20, b6, stackA, stackB) {
  if (objectIs_default(a20, b6)) {
    return true;
  }
  var typeA = type_default(a20);
  if (typeA !== type_default(b6)) {
    return false;
  }
  if (typeof a20["fantasy-land/equals"] === "function" || typeof b6["fantasy-land/equals"] === "function") {
    return typeof a20["fantasy-land/equals"] === "function" && a20["fantasy-land/equals"](b6) && typeof b6["fantasy-land/equals"] === "function" && b6["fantasy-land/equals"](a20);
  }
  if (typeof a20.equals === "function" || typeof b6.equals === "function") {
    return typeof a20.equals === "function" && a20.equals(b6) && typeof b6.equals === "function" && b6.equals(a20);
  }
  switch (typeA) {
    case "Arguments":
    case "Array":
    case "Object":
      if (typeof a20.constructor === "function" && _functionName(a20.constructor) === "Promise") {
        return a20 === b6;
      }
      break;
    case "Boolean":
    case "Number":
    case "String":
      if (!(typeof a20 === typeof b6 && objectIs_default(a20.valueOf(), b6.valueOf()))) {
        return false;
      }
      break;
    case "Date":
      if (!objectIs_default(a20.valueOf(), b6.valueOf())) {
        return false;
      }
      break;
    case "Error":
      return a20.name === b6.name && a20.message === b6.message;
    case "RegExp":
      if (!(a20.source === b6.source && a20.global === b6.global && a20.ignoreCase === b6.ignoreCase && a20.multiline === b6.multiline && a20.sticky === b6.sticky && a20.unicode === b6.unicode)) {
        return false;
      }
      break;
  }
  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a20) {
      return stackB[idx] === b6;
    }
    idx -= 1;
  }
  switch (typeA) {
    case "Map":
      if (a20.size !== b6.size) {
        return false;
      }
      return _uniqContentEquals(a20.entries(), b6.entries(), stackA.concat([a20]), stackB.concat([b6]));
    case "Set":
      if (a20.size !== b6.size) {
        return false;
      }
      return _uniqContentEquals(a20.values(), b6.values(), stackA.concat([a20]), stackB.concat([b6]));
    case "Arguments":
    case "Array":
    case "Object":
    case "Boolean":
    case "Number":
    case "String":
    case "Date":
    case "Error":
    case "RegExp":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "ArrayBuffer":
      break;
    default:
      return false;
  }
  var keysA = keys_default(a20);
  if (keysA.length !== keys_default(b6).length) {
    return false;
  }
  var extendedStackA = stackA.concat([a20]);
  var extendedStackB = stackB.concat([b6]);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b6) && _equals(b6[key], a20[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}

// node_modules/ramda/es/equals.js
var equals = _curry2(function equals2(a20, b6) {
  return _equals(a20, b6, [], []);
});
var equals_default = equals;

// node_modules/ramda/es/isEmpty.js
var isEmpty = _curry1(function isEmpty2(x6) {
  return x6 != null && equals_default(x6, empty_default(x6));
});
var isEmpty_default = isEmpty;

// node_modules/@cds/core/internal/utils/identity.js
function r(t42) {
  return null == t42;
}
function e(t42) {
  return r(t42) || isEmpty_default(t42);
}
function u(n25) {
  return is_default(String, n25);
}
function i(t42) {
  return u(t42) && !isEmpty_default(t42.trim()) && +t42 == +t42;
}
function c(n25) {
  return is_default(String, n25) || r(n25);
}
function f(n25) {
  return is_default(Object, n25);
}
function a(n25) {
  return is_default(Map, n25);
}
function l(t42, n25) {
  return t42 !== n25;
}
function d(t42, n25) {
  return c(t42) && l(t42, n25);
}
function h(t42, n25) {
  return !e(t42) && l(t42, n25);
}
function p(t42 = "_") {
  return `${t42}${Math.random().toString(36).substr(2, 9)}`;
}
function g(t42, n25) {
  return JSON.stringify(t42) === JSON.stringify(n25);
}
function y(t42, n25, r26 = `\${${t42}}`) {
  return t42.split(".").reduce((t43, n26) => {
    try {
      const e28 = t43[n26];
      switch (true) {
        case null === e28:
        case false === e28:
        case "" === e28:
        case 0 === e28:
          return e28;
        default:
          return e28 || r26;
      }
    } catch {
      return r26;
    }
  }, n25);
}
function A(t42) {
  const n25 = /* @__PURE__ */ new Map();
  for (const [r26, e28] of t42)
    a(e28) ? n25.set(r26, A(e28)) : n25.set(r26, e28);
  return n25;
}
function b(t42) {
  switch (true) {
    case a(t42):
      return A(t42);
    case (f(t42) && !Array.isArray(t42)):
      return x({}, t42);
    default:
      return JSON.parse(JSON.stringify(t42));
  }
}
function x(...t42) {
  const n25 = {};
  return t42.map((t43) => f(t43) ? __spreadValues({}, t43) : {}).forEach((t43) => {
    Object.keys(t43).forEach((r26) => {
      const e28 = t43[r26];
      Array.isArray(e28) ? n25[r26] = Array.from(e28) : f(e28) ? n25[r26] = x(n25[r26] || {}, e28) : n25[r26] = e28;
    });
  }), n25;
}

// node_modules/@cds/core/internal/utils/environment.js
function o(o28 = window) {
  return !r(o28);
}

// node_modules/ramda/es/internal/_isInteger.js
var isInteger_default = Number.isInteger || function _isInteger(n25) {
  return n25 << 0 === n25;
};

// node_modules/ramda/es/nth.js
var nth = _curry2(function nth2(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
var nth_default = nth;

// node_modules/ramda/es/paths.js
var paths = _curry2(function paths2(pathsArray, obj) {
  return pathsArray.map(function(paths3) {
    var val = obj;
    var idx = 0;
    var p6;
    while (idx < paths3.length) {
      if (val == null) {
        return;
      }
      p6 = paths3[idx];
      val = isInteger_default(p6) ? nth_default(p6, val) : val[p6];
      idx += 1;
    }
    return val;
  });
});
var paths_default = paths;

// node_modules/ramda/es/path.js
var path = _curry2(function path2(pathAr, obj) {
  return paths_default([pathAr], obj)[0];
});
var path_default = path;

// node_modules/@cds/core/internal/utils/__.js
var a2 = { "@@functional/placeholder": true };

// node_modules/@cds/core/internal/utils/exists.js
var m = curryN_default(2, (o28, t42) => void 0 !== path_default(o28, t42));
function n(o28, r26) {
  return r26 || (r26 = window && window.customElements), !r26 || !!r26.get(o28);
}
var i2 = m(a2, window);

// node_modules/@cds/core/internal/utils/framework.js
var n2;
var e2;
var o2;
var t;
function r2(e28 = true) {
  if (!e28 || !n2) {
    const e29 = document && document.querySelector("[ng-version]");
    n2 = e29 ? "" + e29.getAttribute("ng-version") : void 0;
  }
  return n2;
}
function i3(o28 = true) {
  return o28 && n2 || (e2 = window?.angular?.version?.full), e2;
}
function u2(n25 = true) {
  return n25 && o2 || (o2 = window?.CDS?._react?.version ? window.CDS._react.version : document.querySelector("[data-reactroot], [data-reactid]") ? "unknown version" : void 0), o2;
}
function c2(n25 = true) {
  if (!n25 || !t) {
    const n26 = document.querySelectorAll("*");
    let e28;
    for (let o28 = 0; o28 < n26.length; o28++)
      if (n26[o28].__vue__) {
        e28 = n26[o28];
        break;
      }
    t = e28 ? "unknown version" : void 0;
  }
  return t;
}
function l2() {
  return window?.location?.href?.includes("localhost:6006");
}

// node_modules/@cds/core/internal/utils/string.js
function c3(t42) {
  return t42.replace(/[A-Z]/g, (t43) => "-" + t43.toLowerCase());
}
function o3(t42) {
  return t42.split("-").map((t43, n25) => n25 ? t43.charAt(0).toUpperCase() + t43.slice(1).toLowerCase() : t43).join("");
}
function f2(t42) {
  return a3(o3(t42));
}
function a3(t42) {
  return t42.charAt(0).toUpperCase() + t42.slice(1);
}
function w(t42, n25, r26 = "") {
  const e28 = t42.split(" "), u10 = "" === r26 ? e28.filter((t43) => t43 !== n25) : e28.map((t43) => t43 === n25 ? r26 : t43);
  return u10.length > 0 ? u10.join(" ") : "";
}
function P(t42, n25, e28) {
  return t42.replace(/\$\{.+?\}/g, (t43) => {
    const u10 = t43.substr(2, t43.length - 3).trim();
    return y(u10, n25, e28);
  });
}

// node_modules/@cds/core/internal/utils/supports.js
var s = new class {
  constructor() {
    if (this.supports = { js: true }, !document.body.hasAttribute("cds-supports") || "no-js" === document.body.getAttribute("cds-supports")) {
      const s22 = c3(Object.keys(this.supports).reduce((t42, s23) => `${t42} ${this.supports[s23] ? s23 : "no-" + s23}`, "")).trim();
      document.body.setAttribute("cds-supports", s22);
    }
  }
}();

// node_modules/@cds/core/internal/services/log.service.js
var n3 = class {
  static log(...o28) {
    t2() && r3() && console.log(...o28);
  }
  static warn(...o28) {
    t2() && r3() && console.warn(...o28);
  }
  static error(...o28) {
    t2() && r3() && console.error(...o28);
  }
};
function r3() {
  return !i2(["jasmine"]);
}
function t2() {
  return !window.CDS.environment.production;
}

// node_modules/@cds/core/internal/utils/global.js
function w2() {
  o() && (window.CDS = window.CDS || { _version: [], _react: { version: void 0 }, _supports: s.supports, _isStateProxied: false, _state: { focusTrapItems: [], layerElements: [], i18nRegistry: {}, elementRegistry: {}, iconRegistry: {}, motionRegistry: {} }, environment: { production: false }, getDetails: a4, logDetails: d2 }, function() {
    const e28 = "6.12.0";
    window.CDS._version.indexOf(e28) < 0 && (window.CDS._version.push(e28), document.querySelector("body")?.setAttribute("cds-version", window.CDS._version.join(" "))), window.CDS._version.length > 1 && n3.warn("Running more than one version of Clarity can cause unexpected issues. Please ensure only one version is loaded.");
  }(), window.CDS._isStateProxied || (window.CDS._isStateProxied = true, window.CDS._state = new Proxy(window.CDS._state, { set: (e28, n25, o28) => {
    const t42 = { key: n25, prev: window.CDS._state[n25], current: o28 };
    return e28[n25] = o28, document.dispatchEvent(new CustomEvent("CDS_STATE_UPDATE", { detail: t42 })), true;
  } })));
}
function a4() {
  return { versions: window.CDS._version, environment: window.CDS.environment, userAgent: navigator.userAgent, supports: window.CDS._supports, angularVersion: r2(false), angularJSVersion: i3(false), reactVersion: u2(false), vueVersion: c2(false), state: __spreadProps(__spreadValues({}, window.CDS._state), { iconRegistry: Object.keys(window.CDS._state.iconRegistry), motionRegistry: Object.keys(window.CDS._state.motionRegistry), focusTrapRegistry: Object.keys(window.CDS._state.focusTrapItems.map((e28) => e28.focusTrapId)) }) };
}
function d2() {
  n3.log(JSON.stringify(a4(), null, 2));
}

// node_modules/@cds/core/internal/utils/registration.js
var n4 = curryN_default(3, (e28, t42, o28) => {
  n(e28) && !l2() ? n3.warn(e28 + " has already been registered") : (o28.define(e28, t42), w2(), window && !Object.keys(window.CDS._state.elementRegistry).some((t43) => t43 === e28) && (window.CDS._state.elementRegistry = __spreadProps(__spreadValues({}, window.CDS._state.elementRegistry), { [e28]: {} })));
});
function w3(e28, r26) {
  o() && i2(["customElements"]) && n4(e28, r26, window.customElements);
}

// node_modules/@cds/core/polyfills/at.js
var t3 = false;
function e3(t42) {
  if ((t42 = Math.trunc(t42) || 0) < 0 && (t42 += this.length), !(t42 < 0 || t42 >= this.length))
    return this[t42];
}
if (!t3) {
  t3 = true;
  const r26 = Reflect.getPrototypeOf(Int8Array);
  for (const t42 of [Array, String, r26])
    Object.defineProperty(t42.prototype, "at", { value: e3, writable: true, enumerable: false, configurable: true });
}

// node_modules/@cds/core/polyfills/aria-reflect.js
var e4 = false;
var t4 = false;
function o4(e28, t42, o28) {
  Object.defineProperty(e28, o28, { configurable: true, enumerable: true, get: function() {
    return this.hasAttribute(t42) ? this.getAttribute(t42) : null;
  }, set: function(e29) {
    null !== e29 ? this.setAttribute(t42, e29) : this.removeAttribute(t42);
  } });
}
e4 || Element.prototype.hasOwnProperty("role") || (o4(Element.prototype, "role", "role"), e4 = true), t4 || Element.prototype.hasOwnProperty("ariaLabel") || (t4 = true, ["ActiveDescendant", "Atomic", "AutoComplete", "Busy", "Checked", "ColCount", "ColIndex", "ColSpan", "Controls", "Current", "DescribedBy", "Details", "Disabled", "ErrorMessage", "Expanded", "FlowTo", "HasPopup", "Hidden", "Invalid", "KeyShortcuts", "Label", "LabelledBy", "Level", "Live", "Modal", "MultiLine", "MultiSelectable", "Orientation", "Owns", "Placeholder", "PosInSet", "Pressed", "ReadOnly", "Relevant", "Required", "RoleDescription", "RowCount", "RowIndex", "RowSpan", "Selected", "SetSize", "Sort", "ValueMax", "ValueMin", "ValueNow", "ValueText"].forEach((e28) => o4(Element.prototype, "aria-" + e28.toLowerCase(), "aria" + e28)));

// node_modules/@lit/reactive-element/development/css-tag.js
var NODE_MODE = false;
var global = NODE_MODE ? globalThis : window;
var supportsAdoptingStyleSheets = global.ShadowRoot && (global.ShadyCSS === void 0 || global.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = Symbol();
var cssTagCache = /* @__PURE__ */ new WeakMap();
var CSSResult = class {
  constructor(cssText, strings, safeToken) {
    this["_$cssResult$"] = true;
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
    this._strings = strings;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let styleSheet = this._styleSheet;
    const strings = this._strings;
    if (supportsAdoptingStyleSheets && styleSheet === void 0) {
      const cacheable = strings !== void 0 && strings.length === 1;
      if (cacheable) {
        styleSheet = cssTagCache.get(strings);
      }
      if (styleSheet === void 0) {
        (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
        if (cacheable) {
          cssTagCache.set(strings, styleSheet);
        }
      }
    }
    return styleSheet;
  }
  toString() {
    return this.cssText;
  }
};
var textFromCSSResult = (value) => {
  if (value["_$cssResult$"] === true) {
    return value.cssText;
  } else if (typeof value === "number") {
    return value;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
  }
};
var unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
var css = (strings, ...values) => {
  const cssText = strings.length === 1 ? strings[0] : values.reduce((acc, v6, idx) => acc + textFromCSSResult(v6) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, strings, constructionToken);
};
var adoptStyles = (renderRoot, styles) => {
  if (supportsAdoptingStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map((s22) => s22 instanceof CSSStyleSheet ? s22 : s22.styleSheet);
  } else {
    styles.forEach((s22) => {
      const style = document.createElement("style");
      const nonce = global["litNonce"];
      if (nonce !== void 0) {
        style.setAttribute("nonce", nonce);
      }
      style.textContent = s22.cssText;
      renderRoot.appendChild(style);
    });
  }
};
var cssResultFromStyleSheet = (sheet) => {
  let cssText = "";
  for (const rule of sheet.cssRules) {
    cssText += rule.cssText;
  }
  return unsafeCSS(cssText);
};
var getCompatibleStyle = supportsAdoptingStyleSheets || NODE_MODE && global.CSSStyleSheet === void 0 ? (s22) => s22 : (s22) => s22 instanceof CSSStyleSheet ? cssResultFromStyleSheet(s22) : s22;

// node_modules/@lit/reactive-element/development/reactive-element.js
var _a;
var _b;
var _c;
var _d;
var _e;
var NODE_MODE2 = false;
var global2 = NODE_MODE2 ? globalThis : window;
if (NODE_MODE2) {
  (_a = global2.customElements) !== null && _a !== void 0 ? _a : global2.customElements = customElements;
}
var DEV_MODE = true;
var requestUpdateThenable;
var issueWarning;
var trustedTypes = global2.trustedTypes;
var emptyStringForBooleanAttribute = trustedTypes ? trustedTypes.emptyScript : "";
var polyfillSupport = DEV_MODE ? global2.reactiveElementPolyfillSupportDevMode : global2.reactiveElementPolyfillSupport;
if (DEV_MODE) {
  const issuedWarnings = (_b = global2.litIssuedWarnings) !== null && _b !== void 0 ? _b : global2.litIssuedWarnings = /* @__PURE__ */ new Set();
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
  issueWarning("dev-mode", `Lit is in dev mode. Not recommended for production!`);
  if (((_c = global2.ShadyDOM) === null || _c === void 0 ? void 0 : _c.inUse) && polyfillSupport === void 0) {
    issueWarning("polyfill-support-missing", `Shadow DOM is being polyfilled via \`ShadyDOM\` but the \`polyfill-support\` module has not been loaded.`);
  }
  requestUpdateThenable = (name) => ({
    then: (onfulfilled, _onrejected) => {
      issueWarning("request-update-promise", `The \`requestUpdate\` method should no longer return a Promise but does so on \`${name}\`. Use \`updateComplete\` instead.`);
      if (onfulfilled !== void 0) {
        onfulfilled(false);
      }
    }
  });
}
var debugLogEvent = DEV_MODE ? (event) => {
  const shouldEmit = global2.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global2.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var JSCompiler_renameProperty = (prop, _obj) => prop;
var defaultConverter = {
  toAttribute(value, type3) {
    switch (type3) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },
  fromAttribute(value, type3) {
    let fromValue = value;
    switch (type3) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value);
        } catch (e28) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  }
};
var notEqual = (value, old) => {
  return old !== value && (old === old || value === value);
};
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var finalized = "finalized";
var ReactiveElement = class extends HTMLElement {
  constructor() {
    super();
    this.__instanceProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
    this.hasUpdated = false;
    this.__reflectingProperty = null;
    this.__initialize();
  }
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(initializer) {
    var _a4;
    this.finalize();
    ((_a4 = this._initializers) !== null && _a4 !== void 0 ? _a4 : this._initializers = []).push(initializer);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    this.finalize();
    const attributes = [];
    this.elementProperties.forEach((v6, p6) => {
      const attr = this.__attributeNameForProperty(p6, v6);
      if (attr !== void 0) {
        this.__attributeToPropertyMap.set(attr, p6);
        attributes.push(attr);
      }
    });
    return attributes;
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    var _a4;
    if (options.state) {
      options.attribute = false;
    }
    this.finalize();
    this.elementProperties.set(name, options);
    if (!options.noAccessor && !this.prototype.hasOwnProperty(name)) {
      const key = typeof name === "symbol" ? Symbol() : `__${name}`;
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== void 0) {
        Object.defineProperty(this.prototype, name, descriptor);
        if (DEV_MODE) {
          if (!this.hasOwnProperty("__reactivePropertyKeys")) {
            this.__reactivePropertyKeys = new Set((_a4 = this.__reactivePropertyKeys) !== null && _a4 !== void 0 ? _a4 : []);
          }
          this.__reactivePropertyKeys.add(name);
        }
      }
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(name, key, options) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get() {
        return this[key];
      },
      set(value) {
        const oldValue = this[name];
        this[key] = value;
        this.requestUpdate(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(name) {
    return this.elementProperties.get(name) || defaultPropertyDeclaration;
  }
  /**
   * Creates property accessors for registered properties, sets up element
   * styling, and ensures any superclasses are also finalized. Returns true if
   * the element was finalized.
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(finalized)) {
      return false;
    }
    this[finalized] = true;
    const superCtor = Object.getPrototypeOf(this);
    superCtor.finalize();
    if (superCtor._initializers !== void 0) {
      this._initializers = [...superCtor._initializers];
    }
    this.elementProperties = new Map(superCtor.elementProperties);
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;
      const propKeys = [
        ...Object.getOwnPropertyNames(props),
        ...Object.getOwnPropertySymbols(props)
      ];
      for (const p6 of propKeys) {
        this.createProperty(p6, props[p6]);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
    if (DEV_MODE) {
      const warnRemovedOrRenamed = (name, renamed = false) => {
        if (this.prototype.hasOwnProperty(name)) {
          issueWarning(renamed ? "renamed-api" : "removed-api", `\`${name}\` is implemented on class ${this.name}. It has been ${renamed ? "renamed" : "removed"} in this version of LitElement.`);
        }
      };
      warnRemovedOrRenamed("initialize");
      warnRemovedOrRenamed("requestUpdateInternal");
      warnRemovedOrRenamed("_getUpdateComplete", true);
    }
    return true;
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(styles) {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set = new Set(styles.flat(Infinity).reverse());
      for (const s22 of set) {
        elementStyles.unshift(getCompatibleStyle(s22));
      }
    } else if (styles !== void 0) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    var _a4;
    this.__updatePromise = new Promise((res) => this.enableUpdating = res);
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.__saveInstanceProperties();
    this.requestUpdate();
    (_a4 = this.constructor._initializers) === null || _a4 === void 0 ? void 0 : _a4.forEach((i23) => i23(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller) {
    var _a4, _b4;
    ((_a4 = this.__controllers) !== null && _a4 !== void 0 ? _a4 : this.__controllers = []).push(controller);
    if (this.renderRoot !== void 0 && this.isConnected) {
      (_b4 = controller.hostConnected) === null || _b4 === void 0 ? void 0 : _b4.call(controller);
    }
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller) {
    var _a4;
    (_a4 = this.__controllers) === null || _a4 === void 0 ? void 0 : _a4.splice(this.__controllers.indexOf(controller) >>> 0, 1);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */
  __saveInstanceProperties() {
    this.constructor.elementProperties.forEach((_v, p6) => {
      if (this.hasOwnProperty(p6)) {
        this.__instanceProperties.set(p6, this[p6]);
        delete this[p6];
      }
    });
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    var _a4;
    const renderRoot = (_a4 = this.shadowRoot) !== null && _a4 !== void 0 ? _a4 : this.attachShadow(this.constructor.shadowRootOptions);
    adoptStyles(renderRoot, this.constructor.elementStyles);
    return renderRoot;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    var _a4;
    if (this.renderRoot === void 0) {
      this.renderRoot = this.createRenderRoot();
    }
    this.enableUpdating(true);
    (_a4 = this.__controllers) === null || _a4 === void 0 ? void 0 : _a4.forEach((c11) => {
      var _a5;
      return (_a5 = c11.hostConnected) === null || _a5 === void 0 ? void 0 : _a5.call(c11);
    });
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(_requestedUpdate) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    var _a4;
    (_a4 = this.__controllers) === null || _a4 === void 0 ? void 0 : _a4.forEach((c11) => {
      var _a5;
      return (_a5 = c11.hostDisconnected) === null || _a5 === void 0 ? void 0 : _a5.call(c11);
    });
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(name, _old, value) {
    this._$attributeToProperty(name, value);
  }
  __propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    var _a4;
    const attr = this.constructor.__attributeNameForProperty(name, options);
    if (attr !== void 0 && options.reflect === true) {
      const converter = ((_a4 = options.converter) === null || _a4 === void 0 ? void 0 : _a4.toAttribute) !== void 0 ? options.converter : defaultConverter;
      const attrValue = converter.toAttribute(value, options.type);
      if (DEV_MODE && this.constructor.enabledWarnings.indexOf("migration") >= 0 && attrValue === void 0) {
        issueWarning("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
      }
      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(name, value) {
    var _a4;
    const ctor = this.constructor;
    const propName = ctor.__attributeToPropertyMap.get(name);
    if (propName !== void 0 && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : ((_a4 = options.converter) === null || _a4 === void 0 ? void 0 : _a4.fromAttribute) !== void 0 ? options.converter : defaultConverter;
      this.__reflectingProperty = propName;
      this[propName] = converter.fromAttribute(
        value,
        options.type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      );
      this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @category updates
   */
  requestUpdate(name, oldValue, options) {
    let shouldRequestUpdate = true;
    if (name !== void 0) {
      options = options || this.constructor.getPropertyOptions(name);
      const hasChanged = options.hasChanged || notEqual;
      if (hasChanged(this[name], oldValue)) {
        if (!this._$changedProperties.has(name)) {
          this._$changedProperties.set(name, oldValue);
        }
        if (options.reflect === true && this.__reflectingProperty !== name) {
          if (this.__reflectingProperties === void 0) {
            this.__reflectingProperties = /* @__PURE__ */ new Map();
          }
          this.__reflectingProperties.set(name, options);
        }
      } else {
        shouldRequestUpdate = false;
      }
    }
    if (!this.isUpdatePending && shouldRequestUpdate) {
      this.__updatePromise = this.__enqueueUpdate();
    }
    return DEV_MODE ? requestUpdateThenable(this.localName) : void 0;
  }
  /**
   * Sets up the element to asynchronously update.
   */
  __enqueueUpdate() {
    return __async(this, null, function* () {
      this.isUpdatePending = true;
      try {
        yield this.__updatePromise;
      } catch (e28) {
        Promise.reject(e28);
      }
      const result = this.scheduleUpdate();
      if (result != null) {
        yield result;
      }
      return !this.isUpdatePending;
    });
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    return this.performUpdate();
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * Note: To ensure `performUpdate()` synchronously completes a pending update,
   * it should not be overridden. In LitElement 2.x it was suggested to override
   * `performUpdate()` to also customizing update scheduling. Instead, you should now
   * override `scheduleUpdate()`. For backwards compatibility with LitElement 2.x,
   * scheduling updates via `performUpdate()` continues to work, but will make
   * also calling `performUpdate()` to synchronously process updates difficult.
   *
   * @category updates
   */
  performUpdate() {
    var _a4, _b4;
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({ kind: "update" });
    if (!this.hasUpdated) {
      if (DEV_MODE) {
        const shadowedProperties = [];
        (_a4 = this.constructor.__reactivePropertyKeys) === null || _a4 === void 0 ? void 0 : _a4.forEach((p6) => {
          var _a5;
          if (this.hasOwnProperty(p6) && !((_a5 = this.__instanceProperties) === null || _a5 === void 0 ? void 0 : _a5.has(p6))) {
            shadowedProperties.push(p6);
          }
        });
        if (shadowedProperties.length) {
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
        }
      }
    }
    if (this.__instanceProperties) {
      this.__instanceProperties.forEach((v6, p6) => this[p6] = v6);
      this.__instanceProperties = void 0;
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        (_b4 = this.__controllers) === null || _b4 === void 0 ? void 0 : _b4.forEach((c11) => {
          var _a5;
          return (_a5 = c11.hostUpdate) === null || _a5 === void 0 ? void 0 : _a5.call(c11);
        });
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e28) {
      shouldUpdate = false;
      this.__markUpdated();
      throw e28;
    }
    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(_changedProperties) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(changedProperties) {
    var _a4;
    (_a4 = this.__controllers) === null || _a4 === void 0 ? void 0 : _a4.forEach((c11) => {
      var _a5;
      return (_a5 = c11.hostUpdated) === null || _a5 === void 0 ? void 0 : _a5.call(c11);
    });
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (DEV_MODE && this.isUpdatePending && this.constructor.enabledWarnings.indexOf("change-in-update") >= 0) {
      issueWarning("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
    }
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(_changedProperties) {
    if (this.__reflectingProperties !== void 0) {
      this.__reflectingProperties.forEach((v6, k3) => this.__propertyToAttribute(k3, this[k3], v6));
      this.__reflectingProperties = void 0;
    }
    this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(_changedProperties) {
  }
};
_e = finalized;
ReactiveElement[_e] = true;
ReactiveElement.elementProperties = /* @__PURE__ */ new Map();
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport({ ReactiveElement });
if (DEV_MODE) {
  ReactiveElement.enabledWarnings = ["change-in-update"];
  const ensureOwnWarnings = function(ctor) {
    if (!ctor.hasOwnProperty(JSCompiler_renameProperty("enabledWarnings", ctor))) {
      ctor.enabledWarnings = ctor.enabledWarnings.slice();
    }
  };
  ReactiveElement.enableWarning = function(warning) {
    ensureOwnWarnings(this);
    if (this.enabledWarnings.indexOf(warning) < 0) {
      this.enabledWarnings.push(warning);
    }
  };
  ReactiveElement.disableWarning = function(warning) {
    ensureOwnWarnings(this);
    const i23 = this.enabledWarnings.indexOf(warning);
    if (i23 >= 0) {
      this.enabledWarnings.splice(i23, 1);
    }
  };
}
((_d = global2.reactiveElementVersions) !== null && _d !== void 0 ? _d : global2.reactiveElementVersions = []).push("1.6.3");
if (DEV_MODE && global2.reactiveElementVersions.length > 1) {
  issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}

// node_modules/lit-html/development/lit-html.js
var _a2;
var _b2;
var _c2;
var _d2;
var DEV_MODE2 = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE3 = false;
var global3 = NODE_MODE3 ? globalThis : window;
var debugLogEvent2 = DEV_MODE2 ? (event) => {
  const shouldEmit = global3.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global3.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var debugLogRenderId = 0;
var issueWarning2;
if (DEV_MODE2) {
  (_a2 = global3.litIssuedWarnings) !== null && _a2 !== void 0 ? _a2 : global3.litIssuedWarnings = /* @__PURE__ */ new Set();
  issueWarning2 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!global3.litIssuedWarnings.has(warning)) {
      console.warn(warning);
      global3.litIssuedWarnings.add(warning);
    }
  };
  issueWarning2("dev-mode", `Lit is in dev mode. Not recommended for production!`);
}
var wrap = ENABLE_SHADYDOM_NOPATCH && ((_b2 = global3.ShadyDOM) === null || _b2 === void 0 ? void 0 : _b2.inUse) && ((_c2 = global3.ShadyDOM) === null || _c2 === void 0 ? void 0 : _c2.noPatch) === true ? global3.ShadyDOM.wrap : (node) => node;
var trustedTypes2 = global3.trustedTypes;
var policy = trustedTypes2 ? trustedTypes2.createPolicy("lit-html", {
  createHTML: (s22) => s22
}) : void 0;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
  if (!ENABLE_EXTRA_SECURITY_HOOKS) {
    return;
  }
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);
  }
  sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
  sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type3) => {
  return sanitizerFactoryInternal(node, name, type3);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${String(Math.random()).slice(9)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d3 = NODE_MODE3 && global3.document === void 0 ? {
  createTreeWalker() {
    return {};
  }
} : document;
var createMarker = () => d3.createComment("");
var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
var isArray = Array.isArray;
var isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof (value === null || value === void 0 ? void 0 : value[Symbol.iterator]) === "function";
var SPACE_CHAR = `[ 	
\f\r]`;
var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
var tag = (type3) => (strings, ...values) => {
  if (DEV_MODE2 && strings.some((s22) => s22 === void 0)) {
    console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
  }
  return {
    // This property needs to remain unminified.
    ["_$litType$"]: type3,
    strings,
    values
  };
};
var html = tag(HTML_RESULT);
var svg = tag(SVG_RESULT);
var noChange = Symbol.for("lit-noChange");
var nothing = Symbol.for("lit-nothing");
var templateCache = /* @__PURE__ */ new WeakMap();
var walker = d3.createTreeWalker(d3, 129, null, false);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  if (!Array.isArray(tsa) || !tsa.hasOwnProperty("raw")) {
    let message = "invalid template strings array";
    if (DEV_MODE2) {
      message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
    }
    throw new Error(message);
  }
  return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
var getTemplateHtml = (strings, type3) => {
  const l7 = strings.length - 1;
  const attrNames = [];
  let html2 = type3 === SVG_RESULT ? "<svg>" : "";
  let rawTextEndRegex;
  let regex = textEndRegex;
  for (let i23 = 0; i23 < l7; i23++) {
    const s22 = strings[i23];
    let attrNameEndIndex = -1;
    let attrName;
    let lastIndex = 0;
    let match;
    while (lastIndex < s22.length) {
      regex.lastIndex = lastIndex;
      match = regex.exec(s22);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === "!--") {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== void 0) {
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== void 0) {
          if (rawTextElement.test(match[TAG_NAME])) {
            rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
          if (DEV_MODE2) {
            throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
          }
          regex = tagEndRegex;
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === ">") {
          regex = rawTextEndRegex !== null && rawTextEndRegex !== void 0 ? rawTextEndRegex : textEndRegex;
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === void 0) {
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        regex = tagEndRegex;
        rawTextEndRegex = void 0;
      }
    }
    if (DEV_MODE2) {
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
    }
    const end = regex === tagEndRegex && strings[i23 + 1].startsWith("/>") ? " " : "";
    html2 += regex === textEndRegex ? s22 + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s22.slice(0, attrNameEndIndex) + boundAttributeSuffix + s22.slice(attrNameEndIndex)) + marker + end : s22 + marker + (attrNameEndIndex === -2 ? (attrNames.push(void 0), i23) : end);
  }
  const htmlResult = html2 + (strings[l7] || "<?>") + (type3 === SVG_RESULT ? "</svg>" : "");
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = class _Template {
  constructor({ strings, ["_$litType$"]: type3 }, options) {
    this.parts = [];
    let node;
    let nodeIndex = 0;
    let attrNameIndex = 0;
    const partCount = strings.length - 1;
    const parts = this.parts;
    const [html2, attrNames] = getTemplateHtml(strings, type3);
    this.el = _Template.createElement(html2, options);
    walker.currentNode = this.el.content;
    if (type3 === SVG_RESULT) {
      const content = this.el.content;
      const svgElement = content.firstChild;
      svgElement.remove();
      content.append(...svgElement.childNodes);
    }
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        if (DEV_MODE2) {
          const tag2 = node.localName;
          if (/^(?:textarea|template)$/i.test(tag2) && node.innerHTML.includes(marker)) {
            const m8 = `Expressions are not supported inside \`${tag2}\` elements. See https://lit.dev/msg/expression-in-${tag2} for more information.`;
            if (tag2 === "template") {
              throw new Error(m8);
            } else
              issueWarning2("", m8);
          }
        }
        if (node.hasAttributes()) {
          const attrsToRemove = [];
          for (const name of node.getAttributeNames()) {
            if (name.endsWith(boundAttributeSuffix) || name.startsWith(marker)) {
              const realName = attrNames[attrNameIndex++];
              attrsToRemove.push(name);
              if (realName !== void 0) {
                const value = node.getAttribute(realName.toLowerCase() + boundAttributeSuffix);
                const statics = value.split(marker);
                const m8 = /([.?@])?(.*)/.exec(realName);
                parts.push({
                  type: ATTRIBUTE_PART,
                  index: nodeIndex,
                  name: m8[2],
                  strings: statics,
                  ctor: m8[1] === "." ? PropertyPart : m8[1] === "?" ? BooleanAttributePart : m8[1] === "@" ? EventPart : AttributePart
                });
              } else {
                parts.push({
                  type: ELEMENT_PART,
                  index: nodeIndex
                });
              }
            }
          }
          for (const name of attrsToRemove) {
            node.removeAttribute(name);
          }
        }
        if (rawTextElement.test(node.tagName)) {
          const strings2 = node.textContent.split(marker);
          const lastIndex = strings2.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes2 ? trustedTypes2.emptyScript : "";
            for (let i23 = 0; i23 < lastIndex; i23++) {
              node.append(strings2[i23], createMarker());
              walker.nextNode();
              parts.push({ type: CHILD_PART, index: ++nodeIndex });
            }
            node.append(strings2[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        const data = node.data;
        if (data === markerMatch) {
          parts.push({ type: CHILD_PART, index: nodeIndex });
        } else {
          let i23 = -1;
          while ((i23 = node.data.indexOf(marker, i23 + 1)) !== -1) {
            parts.push({ type: COMMENT_PART, index: nodeIndex });
            i23 += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(html2, _options) {
    const el = d3.createElement("template");
    el.innerHTML = html2;
    return el;
  }
};
function resolveDirective(part, value, parent = part, attributeIndex) {
  var _a4, _b4, _c4;
  var _d3;
  if (value === noChange) {
    return value;
  }
  let currentDirective = attributeIndex !== void 0 ? (_a4 = parent.__directives) === null || _a4 === void 0 ? void 0 : _a4[attributeIndex] : parent.__directive;
  const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
    // This property needs to remain unminified.
    value["_$litDirective$"]
  );
  if ((currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
    (_b4 = currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective["_$notifyDirectiveConnectionChanged"]) === null || _b4 === void 0 ? void 0 : _b4.call(currentDirective, false);
    if (nextDirectiveConstructor === void 0) {
      currentDirective = void 0;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== void 0) {
      ((_c4 = (_d3 = parent).__directives) !== null && _c4 !== void 0 ? _c4 : _d3.__directives = [])[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== void 0) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
var TemplateInstance = class {
  constructor(template, parent) {
    this._$parts = [];
    this._$disconnectableChildren = void 0;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(options) {
    var _a4;
    const { el: { content }, parts } = this._$template;
    const fragment = ((_a4 = options === null || options === void 0 ? void 0 : options.creationScope) !== null && _a4 !== void 0 ? _a4 : d3).importNode(content, true);
    walker.currentNode = fragment;
    let node = walker.nextNode();
    let nodeIndex = 0;
    let partIndex = 0;
    let templatePart = parts[0];
    while (templatePart !== void 0) {
      if (nodeIndex === templatePart.index) {
        let part;
        if (templatePart.type === CHILD_PART) {
          part = new ChildPart(node, node.nextSibling, this, options);
        } else if (templatePart.type === ATTRIBUTE_PART) {
          part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
        } else if (templatePart.type === ELEMENT_PART) {
          part = new ElementPart(node, this, options);
        }
        this._$parts.push(part);
        templatePart = parts[++partIndex];
      }
      if (nodeIndex !== (templatePart === null || templatePart === void 0 ? void 0 : templatePart.index)) {
        node = walker.nextNode();
        nodeIndex++;
      }
    }
    walker.currentNode = d3;
    return fragment;
  }
  _update(values) {
    let i23 = 0;
    for (const part of this._$parts) {
      if (part !== void 0) {
        debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
          kind: "set part",
          part,
          value: values[i23],
          valueIndex: i23,
          values,
          templateInstance: this
        });
        if (part.strings !== void 0) {
          part._$setValue(values, part, i23);
          i23 += part.strings.length - 2;
        } else {
          part._$setValue(values[i23]);
        }
      }
      i23++;
    }
  }
};
var ChildPart = class _ChildPart {
  constructor(startNode, endNode, parent, options) {
    var _a4;
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    this.__isConnected = (_a4 = options === null || options === void 0 ? void 0 : options.isConnected) !== null && _a4 !== void 0 ? _a4 : true;
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._textSanitizer = void 0;
    }
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    var _a4, _b4;
    return (_b4 = (_a4 = this._$parent) === null || _a4 === void 0 ? void 0 : _a4._$isConnected) !== null && _b4 !== void 0 ? _b4 : this.__isConnected;
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let parentNode = wrap(this._$startNode).parentNode;
    const parent = this._$parent;
    if (parent !== void 0 && (parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeType) === 11) {
      parentNode = parent.parentNode;
    }
    return parentNode;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(value, directiveParent = this) {
    var _a4;
    if (DEV_MODE2 && this.parentNode === null) {
      throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
    }
    value = resolveDirective(this, value, directiveParent);
    if (isPrimitive(value)) {
      if (value === nothing || value == null || value === "") {
        if (this._$committedValue !== nothing) {
          debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
            kind: "commit nothing to child",
            start: this._$startNode,
            end: this._$endNode,
            parent: this._$parent,
            options: this.options
          });
          this._$clear();
        }
        this._$committedValue = nothing;
      } else if (value !== this._$committedValue && value !== noChange) {
        this._commitText(value);
      }
    } else if (value["_$litType$"] !== void 0) {
      this._commitTemplateResult(value);
    } else if (value.nodeType !== void 0) {
      if (DEV_MODE2 && ((_a4 = this.options) === null || _a4 === void 0 ? void 0 : _a4.host) === value) {
        this._commitText(`[probable mistake: rendered a template's host in itself (commonly caused by writing \${this} in a template]`);
        console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
        return;
      }
      this._commitNode(value);
    } else if (isIterable(value)) {
      this._commitIterable(value);
    } else {
      this._commitText(value);
    }
  }
  _insert(node) {
    return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
  }
  _commitNode(value) {
    var _a4;
    if (this._$committedValue !== value) {
      this._$clear();
      if (ENABLE_EXTRA_SECURITY_HOOKS && sanitizerFactoryInternal !== noopSanitizer) {
        const parentNodeName = (_a4 = this._$startNode.parentNode) === null || _a4 === void 0 ? void 0 : _a4.nodeName;
        if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
          let message = "Forbidden";
          if (DEV_MODE2) {
            if (parentNodeName === "STYLE") {
              message = `Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css\`...\` literals to compose styles, and make do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.`;
            } else {
              message = `Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`;
            }
          }
          throw new Error(message);
        }
      }
      debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value,
        options: this.options
      });
      this._$committedValue = this._insert(value);
    }
  }
  _commitText(value) {
    if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
      const node = wrap(this._$startNode).nextSibling;
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(node, "data", "property");
        }
        value = this._textSanitizer(value);
      }
      debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
        kind: "commit text",
        node,
        value,
        options: this.options
      });
      node.data = value;
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        const textNode = d3.createTextNode("");
        this._commitNode(textNode);
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(textNode, "data", "property");
        }
        value = this._textSanitizer(value);
        debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
          kind: "commit text",
          node: textNode,
          value,
          options: this.options
        });
        textNode.data = value;
      } else {
        this._commitNode(d3.createTextNode(value));
        debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
          kind: "commit text",
          node: wrap(this._$startNode).nextSibling,
          value,
          options: this.options
        });
      }
    }
    this._$committedValue = value;
  }
  _commitTemplateResult(result) {
    var _a4;
    const { values, ["_$litType$"]: type3 } = result;
    const template = typeof type3 === "number" ? this._$getTemplate(result) : (type3.el === void 0 && (type3.el = Template.createElement(trustFromTemplateString(type3.h, type3.h[0]), this.options)), type3);
    if (((_a4 = this._$committedValue) === null || _a4 === void 0 ? void 0 : _a4._$template) === template) {
      debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
        kind: "template updating",
        template,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values
      });
      this._$committedValue._update(values);
    } else {
      const instance = new TemplateInstance(template, this);
      const fragment = instance._clone(this.options);
      debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
        kind: "template instantiated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      instance._update(values);
      debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
        kind: "template instantiated and updated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      this._commitNode(fragment);
      this._$committedValue = instance;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(result) {
    let template = templateCache.get(result.strings);
    if (template === void 0) {
      templateCache.set(result.strings, template = new Template(result));
    }
    return template;
  }
  _commitIterable(value) {
    if (!isArray(this._$committedValue)) {
      this._$committedValue = [];
      this._$clear();
    }
    const itemParts = this._$committedValue;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      if (partIndex === itemParts.length) {
        itemParts.push(itemPart = new _ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
      } else {
        itemPart = itemParts[partIndex];
      }
      itemPart._$setValue(item);
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
      itemParts.length = partIndex;
    }
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives in
   *     those Parts.
   *
   * @internal
   */
  _$clear(start = wrap(this._$startNode).nextSibling, from) {
    var _a4;
    (_a4 = this._$notifyConnectionChanged) === null || _a4 === void 0 ? void 0 : _a4.call(this, false, true, from);
    while (start && start !== this._$endNode) {
      const n25 = wrap(start).nextSibling;
      wrap(start).remove();
      start = n25;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this metod
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(isConnected) {
    var _a4;
    if (this._$parent === void 0) {
      this.__isConnected = isConnected;
      (_a4 = this._$notifyConnectionChanged) === null || _a4 === void 0 ? void 0 : _a4.call(this, isConnected);
    } else if (DEV_MODE2) {
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
    }
  }
};
var AttributePart = class {
  constructor(element, name, strings, parent, options) {
    this.type = ATTRIBUTE_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._sanitizer = void 0;
    }
  }
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(value, directiveParent = this, valueIndex, noCommit) {
    const strings = this.strings;
    let change = false;
    if (strings === void 0) {
      value = resolveDirective(this, value, directiveParent, 0);
      change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
      if (change) {
        this._$committedValue = value;
      }
    } else {
      const values = value;
      value = strings[0];
      let i23, v6;
      for (i23 = 0; i23 < strings.length - 1; i23++) {
        v6 = resolveDirective(this, values[valueIndex + i23], directiveParent, i23);
        if (v6 === noChange) {
          v6 = this._$committedValue[i23];
        }
        change || (change = !isPrimitive(v6) || v6 !== this._$committedValue[i23]);
        if (v6 === nothing) {
          value = nothing;
        } else if (value !== nothing) {
          value += (v6 !== null && v6 !== void 0 ? v6 : "") + strings[i23 + 1];
        }
        this._$committedValue[i23] = v6;
      }
    }
    if (change && !noCommit) {
      this._commitValue(value);
    }
  }
  /** @internal */
  _commitValue(value) {
    if (value === nothing) {
      wrap(this.element).removeAttribute(this.name);
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._sanitizer === void 0) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
        }
        value = this._sanitizer(value !== null && value !== void 0 ? value : "");
      }
      debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
        kind: "commit attribute",
        element: this.element,
        name: this.name,
        value,
        options: this.options
      });
      wrap(this.element).setAttribute(this.name, value !== null && value !== void 0 ? value : "");
    }
  }
};
var PropertyPart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = PROPERTY_PART;
  }
  /** @internal */
  _commitValue(value) {
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      if (this._sanitizer === void 0) {
        this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
      }
      value = this._sanitizer(value);
    }
    debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value,
      options: this.options
    });
    this.element[this.name] = value === nothing ? void 0 : value;
  }
};
var emptyStringForBooleanAttribute2 = trustedTypes2 ? trustedTypes2.emptyScript : "";
var BooleanAttributePart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = BOOLEAN_ATTRIBUTE_PART;
  }
  /** @internal */
  _commitValue(value) {
    debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(value && value !== nothing),
      options: this.options
    });
    if (value && value !== nothing) {
      wrap(this.element).setAttribute(this.name, emptyStringForBooleanAttribute2);
    } else {
      wrap(this.element).removeAttribute(this.name);
    }
  }
};
var EventPart = class extends AttributePart {
  constructor(element, name, strings, parent, options) {
    super(element, name, strings, parent, options);
    this.type = EVENT_PART;
    if (DEV_MODE2 && this.strings !== void 0) {
      throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
    }
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(newListener, directiveParent = this) {
    var _a4;
    newListener = (_a4 = resolveDirective(this, newListener, directiveParent, 0)) !== null && _a4 !== void 0 ? _a4 : nothing;
    if (newListener === noChange) {
      return;
    }
    const oldListener = this._$committedValue;
    const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
    const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
    debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: newListener,
      options: this.options,
      removeListener: shouldRemoveListener,
      addListener: shouldAddListener,
      oldListener
    });
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.name, this, oldListener);
    }
    if (shouldAddListener) {
      this.element.addEventListener(this.name, this, newListener);
    }
    this._$committedValue = newListener;
  }
  handleEvent(event) {
    var _a4, _b4;
    if (typeof this._$committedValue === "function") {
      this._$committedValue.call((_b4 = (_a4 = this.options) === null || _a4 === void 0 ? void 0 : _a4.host) !== null && _b4 !== void 0 ? _b4 : this.element, event);
    } else {
      this._$committedValue.handleEvent(event);
    }
  }
};
var ElementPart = class {
  constructor(element, parent, options) {
    this.element = element;
    this.type = ELEMENT_PART;
    this._$disconnectableChildren = void 0;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(value) {
    debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
      kind: "commit to element binding",
      element: this.element,
      value,
      options: this.options
    });
    resolveDirective(this, value);
  }
};
var polyfillSupport2 = DEV_MODE2 ? global3.litHtmlPolyfillSupportDevMode : global3.litHtmlPolyfillSupport;
polyfillSupport2 === null || polyfillSupport2 === void 0 ? void 0 : polyfillSupport2(Template, ChildPart);
((_d2 = global3.litHtmlVersions) !== null && _d2 !== void 0 ? _d2 : global3.litHtmlVersions = []).push("2.8.0");
if (DEV_MODE2 && global3.litHtmlVersions.length > 1) {
  issueWarning2("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}
var render = (value, container, options) => {
  var _a4, _b4;
  if (DEV_MODE2 && container == null) {
    throw new TypeError(`The container to render into may not be ${container}`);
  }
  const renderId = DEV_MODE2 ? debugLogRenderId++ : 0;
  const partOwnerNode = (_a4 = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _a4 !== void 0 ? _a4 : container;
  let part = partOwnerNode["_$litPart$"];
  debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
    kind: "begin render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  if (part === void 0) {
    const endNode = (_b4 = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _b4 !== void 0 ? _b4 : null;
    partOwnerNode["_$litPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options !== null && options !== void 0 ? options : {});
  }
  part._$setValue(value);
  debugLogEvent2 === null || debugLogEvent2 === void 0 ? void 0 : debugLogEvent2({
    kind: "end render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  if (DEV_MODE2) {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}

// node_modules/lit-element/development/lit-element.js
var _a3;
var _b3;
var _c3;
var DEV_MODE3 = true;
var issueWarning3;
if (DEV_MODE3) {
  const issuedWarnings = (_a3 = globalThis.litIssuedWarnings) !== null && _a3 !== void 0 ? _a3 : globalThis.litIssuedWarnings = /* @__PURE__ */ new Set();
  issueWarning3 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
var LitElement = class extends ReactiveElement {
  constructor() {
    super(...arguments);
    this.renderOptions = { host: this };
    this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    var _a4;
    var _b4;
    const renderRoot = super.createRenderRoot();
    (_a4 = (_b4 = this.renderOptions).renderBefore) !== null && _a4 !== void 0 ? _a4 : _b4.renderBefore = renderRoot.firstChild;
    return renderRoot;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(changedProperties) {
    const value = this.render();
    if (!this.hasUpdated) {
      this.renderOptions.isConnected = this.isConnected;
    }
    super.update(changedProperties);
    this.__childPart = render(value, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    var _a4;
    super.connectedCallback();
    (_a4 = this.__childPart) === null || _a4 === void 0 ? void 0 : _a4.setConnected(true);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    var _a4;
    super.disconnectedCallback();
    (_a4 = this.__childPart) === null || _a4 === void 0 ? void 0 : _a4.setConnected(false);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return noChange;
  }
};
LitElement["finalized"] = true;
LitElement["_$litElement$"] = true;
(_b3 = globalThis.litElementHydrateSupport) === null || _b3 === void 0 ? void 0 : _b3.call(globalThis, { LitElement });
var polyfillSupport3 = DEV_MODE3 ? globalThis.litElementPolyfillSupportDevMode : globalThis.litElementPolyfillSupport;
polyfillSupport3 === null || polyfillSupport3 === void 0 ? void 0 : polyfillSupport3({ LitElement });
if (DEV_MODE3) {
  LitElement["finalize"] = function() {
    const finalized2 = ReactiveElement.finalize.call(this);
    if (!finalized2) {
      return false;
    }
    const warnRemovedOrRenamed = (obj, name, renamed = false) => {
      if (obj.hasOwnProperty(name)) {
        const ctorName = (typeof obj === "function" ? obj : obj.constructor).name;
        issueWarning3(renamed ? "renamed-api" : "removed-api", `\`${name}\` is implemented on class ${ctorName}. It has been ${renamed ? "renamed" : "removed"} in this version of LitElement.`);
      }
    };
    warnRemovedOrRenamed(this, "render");
    warnRemovedOrRenamed(this, "getStyles", true);
    warnRemovedOrRenamed(this.prototype, "adoptStyles");
    return true;
  };
}
((_c3 = globalThis.litElementVersions) !== null && _c3 !== void 0 ? _c3 : globalThis.litElementVersions = []).push("3.3.3");
if (DEV_MODE3 && globalThis.litElementVersions.length > 1) {
  issueWarning3("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
}

// node_modules/@cds/core/internal/base/base.element.scss.js
var a5 = css`@charset "UTF-8";:host,:root{--δ2:var(--cds-global-layout-space-xxs, calc(4 * 1rem / var(--cds-global-base, 20)));--δ3:var(--cds-global-layout-space-xs, calc(8 * 1rem / var(--cds-global-base, 20)));--δ4:var(--cds-global-layout-space-sm, calc(12 * 1rem / var(--cds-global-base, 20)));--δ5:var(--cds-global-layout-space-md, calc(16 * 1rem / var(--cds-global-base, 20)));--δ6:var(--cds-global-layout-space-lg, calc(24 * 1rem / var(--cds-global-base, 20)));--δ7:var(--cds-global-layout-space-xl, calc(32 * 1rem / var(--cds-global-base, 20)))}[cds-layout~="wrap:none"]{flex-wrap:nowrap!important}[cds-layout*="align:stretch"]{flex-grow:1!important}[cds-layout*="align:shrink"]{flex-shrink:1!important;flex-grow:0!important}[cds-layout~=horizontal]{display:flex;flex-direction:row;flex-wrap:wrap;justify-items:flex-start;align-items:flex-start;width:100%;margin:0;min-height:0}[cds-layout~=horizontal]>[cds-layout~=horizontal],[cds-layout~=horizontal]>[cds-layout~=vertical],[cds-layout~=horizontal]>[cds-text]{width:initial!important}[cds-layout~=horizontal][cds-layout*="align:top"]{align-items:flex-start}[cds-layout~=horizontal][cds-layout*="align:left"]{justify-content:flex-start}[cds-layout~=horizontal][cds-layout*="align:right"]{justify-content:flex-end}[cds-layout~=horizontal][cds-layout*="align:vertical-center"]{align-items:center;align-content:center}[cds-layout~=horizontal][cds-layout*="align:horizontal-center"]{justify-content:center}[cds-layout~=horizontal][cds-layout*="align:center"]{align-items:center;align-content:center;justify-content:center}[cds-layout~=horizontal][cds-layout*="order:reverse"]{flex-direction:row-reverse}[cds-layout~=horizontal][cds-layout*="align:horizontal-stretch"]{justify-content:stretch;flex-grow:1}[cds-layout~=horizontal][cds-layout*="align:horizontal-stretch"]>*{flex-grow:1}[cds-layout~=horizontal][cds-layout*="align:stretch"]{align-items:stretch;align-content:stretch;flex-grow:1}[cds-layout~=horizontal][cds-layout*="align:stretch"]>*{flex-grow:1}[cds-layout~=horizontal]>[cds-layout*="align:center"],[cds-layout~=horizontal]>[cds-layout*="align:vertical-center"]{align-self:center}[cds-layout~=horizontal]>[cds-layout*="align:center"],[cds-layout~=horizontal]>[cds-layout*="align:horizontal-center"]{margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal]>[cds-layout*="align:top"]{align-self:flex-start}[cds-layout~=horizontal]>[cds-layout*="align:right"]{margin-left:auto!important}[cds-layout~=horizontal]>[cds-layout*="align:left"]{margin-right:auto!important}[cds-layout~=vertical]{width:100%;display:flex;flex-direction:column;align-items:flex-start}[cds-layout~=vertical],[cds-layout~=vertical][cds-layout*="align:top"]{justify-content:flex-start}[cds-layout~=vertical][cds-layout*="align:left"]{align-items:flex-start}[cds-layout~=vertical][cds-layout*="align:right"]{align-items:flex-end}[cds-layout~=vertical][cds-layout*="align:vertical-center"]{justify-content:center}[cds-layout~=vertical][cds-layout*="align:horizontal-center"]{align-items:center}[cds-layout~=vertical][cds-layout*="align:center"]{align-items:center;justify-content:center}[cds-layout~=vertical][cds-layout*="order:reverse"]{flex-direction:column-reverse}[cds-layout~=vertical][cds-layout*="align:horizontal-stretch"]{align-items:stretch}[cds-layout~=vertical][cds-layout*="align:stretch"]{align-items:stretch;justify-content:stretch}[cds-layout~=vertical][cds-layout*="align:stretch"]>*{flex-grow:1}[cds-layout~=vertical]>[cds-layout*="align:center"],[cds-layout~=vertical]>[cds-layout*="align:vertical-center"]{margin-top:auto;margin-bottom:auto}[cds-layout~=vertical]>[cds-layout*="align:center"],[cds-layout~=vertical]>[cds-layout*="align:horizontal-center"]{align-self:center}[cds-layout~=vertical]>[cds-layout*="align:top"]{margin-bottom:auto!important}[cds-layout~=vertical]>[cds-layout*="align:right"]{margin-left:auto}[cds-layout~=vertical]>[cds-layout*="align:left"]{margin-right:auto}[cds-layout~=grid]{display:grid;align-items:start;align-content:start;grid-template-columns:repeat(var(--cds-global-layout-grid-cols,12),1fr);width:100%}[cds-layout~=grid][cds-layout*=rows]{grid-template-rows:repeat(12,auto)}[cds-layout~=grid]>[cds-layout*=row]{align-self:stretch}[cds-layout~=grid][cds-layout*="align:top"]{align-content:start}[cds-layout~=grid][cds-layout*="align:right"]{justify-content:end}[cds-layout~=grid][cds-layout*="align:left"]{justify-content:start}[cds-layout~=grid][cds-layout*="align:horizontal-stretch"]{justify-items:stretch;justify-content:stretch}[cds-layout~=grid][cds-layout*="align:stretch"]{align-items:stretch;align-content:stretch;justify-items:stretch;justify-content:stretch}[cds-layout~=grid][cds-layout*="align:vertical-center"]{align-items:center;align-content:center}[cds-layout~=grid][cds-layout*="align:horizontal-center"]{justify-items:center;justify-content:center}[cds-layout~=grid][cds-layout*="align:center"]{align-items:center;align-content:center;justify-items:center;justify-content:center}::slotted([cds-layout~="display:screen-reader-only"]),[cds-layout~="display:screen-reader-only"]{position:absolute!important;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);padding:0;border:0;height:1px;width:1px;overflow:hidden;white-space:nowrap;top:0;left:0;display:block!important}[cds-layout*="gap:none"]{gap:0}[cds-layout*="gap:xxs"]{gap:var(--δ2)}[cds-layout*="gap:xs"]{gap:var(--δ3)}[cds-layout*="gap:sm"]{gap:var(--δ4)}[cds-layout*="gap:md"]{gap:var(--δ5)}[cds-layout*="gap:lg"]{gap:var(--δ6)}[cds-layout~="p:none"]{padding:0!important}[cds-layout~="p:xxs"]{padding:var(--δ2)!important}[cds-layout~="p:xs"]{padding:var(--δ3)!important}[cds-layout~="p:sm"]{padding:var(--δ4)!important}[cds-layout~="p:md"]{padding:var(--δ5)!important}[cds-layout~="m:md"]{margin:var(--δ5)!important}[cds-layout~="p:lg"]{padding:var(--δ6)!important}[cds-layout~="p-y:xs"]{padding-top:var(--δ3)!important;padding-bottom:var(--δ3)!important}[cds-layout~="p-x:lg"]{padding-left:var(--δ6)!important;padding-right:var(--δ6)!important}[cds-layout~="p-y:lg"]{padding-top:var(--δ6)!important;padding-bottom:var(--δ6)!important}[cds-layout~="p-l:md"]{padding-left:var(--δ5)!important}@media (min-width:992px){[cds-layout*="gap@md:lg"]{gap:var(--δ6)}[cds-layout~="p@md:lg"]{padding:var(--δ6)!important}[cds-layout~="m@md:xl"]{margin:var(--δ7)!important}}[cds-layout~=fill]{width:100%!important}*,:after,:before{box-sizing:border-box}[cds-layout~=horizontal][cds-layout*="align:horizontal-stretch"]>::slotted(*),[cds-layout~=horizontal][cds-layout*="align:stretch"]>::slotted(*),[cds-layout~=vertical][cds-layout*="align:stretch"]>::slotted(*){flex-grow:1}[cds-layout~=vertical] ::slotted([cds-layout*="align:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align:vertical-center"]){margin-top:auto;margin-bottom:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align:horizontal-center"]){align-self:center}[cds-layout~=vertical] ::slotted([cds-layout*="align:top"]){margin-bottom:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align:bottom"]){margin-top:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align:right"]){margin-left:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align:left"]),[cds-layout~=vertical]>[cds-layout*="align:left"]{margin-right:auto}@media (min-width:576px){[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:vertical-center"]){margin-top:auto;margin-bottom:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:horizontal-center"]){align-self:center}[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:top"]){margin-bottom:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:bottom"]){margin-top:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:right"]){margin-left:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@xs:left"]){margin-right:auto}}@media (min-width:768px){[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:vertical-center"]){margin-top:auto;margin-bottom:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:horizontal-center"]){align-self:center}[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:top"]){margin-bottom:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:bottom"]){margin-top:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:right"]){margin-left:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@sm:left"]){margin-right:auto}}@media (min-width:992px){[cds-layout~=vertical] ::slotted([cds-layout*="align@md:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@md:vertical-center"]){margin-top:auto;margin-bottom:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@md:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@md:horizontal-center"]){align-self:center}[cds-layout~=vertical] ::slotted([cds-layout*="align@md:top"]){margin-bottom:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@md:bottom"]){margin-top:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@md:right"]){margin-left:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@md:left"]){margin-right:auto}}@media (min-width:1200px){[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:vertical-center"]){margin-top:auto;margin-bottom:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:horizontal-center"]){align-self:center}[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:top"]){margin-bottom:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:bottom"]){margin-top:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:right"]){margin-left:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@lg:left"]){margin-right:auto}}@media (min-width:1440px){[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:vertical-center"]){margin-top:auto;margin-bottom:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:center"]),[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:horizontal-center"]){align-self:center}[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:top"]){margin-bottom:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:bottom"]){margin-top:auto!important}[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:right"]){margin-left:auto}[cds-layout~=vertical] ::slotted([cds-layout*="align@xl:left"]){margin-right:auto}}[cds-layout~=horizontal] ::slotted([cds-layout*="align:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align:vertical-center"]){align-self:center}[cds-layout~=horizontal] ::slotted([cds-layout*="align:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align:horizontal-center"]){margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align:top"]){align-self:flex-start}[cds-layout~=horizontal] ::slotted([cds-layout*="align:bottom"]){align-self:flex-end}[cds-layout~=horizontal] ::slotted([cds-layout*="align:right"]){margin-left:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align:left"]){margin-right:auto!important}@media (min-width:576px){[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:vertical-center"]){align-self:center}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:horizontal-center"]){margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:top"]){align-self:flex-start}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:bottom"]){align-self:flex-end}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:right"]){margin-left:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xs:left"]){margin-right:auto!important}}@media (min-width:768px){[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:vertical-center"]){align-self:center}[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:horizontal-center"]){margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:top"]){align-self:flex-start}[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:bottom"]){align-self:flex-end}[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:right"]){margin-left:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@sm:left"]){margin-right:auto!important}}@media (min-width:992px){[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:vertical-center"]){align-self:center}[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:horizontal-center"]){margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:top"]){align-self:flex-start}[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:bottom"]){align-self:flex-end}[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:right"]){margin-left:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@md:left"]){margin-right:auto!important}}@media (min-width:1200px){[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:vertical-center"]){align-self:center}[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:horizontal-center"]){margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:top"]){align-self:flex-start}[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:bottom"]){align-self:flex-end}[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:right"]){margin-left:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@lg:left"]){margin-right:auto!important}}@media (min-width:1440px){[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:vertical-center"]){align-self:center}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:center"]),[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:horizontal-center"]){margin-left:auto!important;margin-right:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:top"]){align-self:flex-start}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:bottom"]){align-self:flex-end}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:right"]){margin-left:auto!important}[cds-layout~=horizontal] ::slotted([cds-layout*="align@xl:left"]){margin-right:auto!important}}[cds-text]{font-family:var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif);margin-top:0;margin-bottom:0}[cds-text][cds-layout~=grid]::after,[cds-text][cds-layout~=grid]::before,[cds-text][cds-layout~=horizontal]::after,[cds-text][cds-layout~=horizontal]::before,[cds-text][cds-layout~=vertical]::after,[cds-text][cds-layout~=vertical]::before{display:none}[cds-text*=display],[cds-text*=section],[cds-text*=subsection],[cds-text*=title]{font-family:var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif);color:var(--cds-global-typography-color-400,var(--cds-global-color-construction-900,#21333b))}[cds-text*=body],[cds-text*=message],[cds-text*=secondary]{color:var(--cds-global-typography-color-500,var(--cds-global-color-black,#000))}[cds-text*=inline]{width:auto!important;display:inline-block!important}[cds-text*=display]{font-size:var(--cds-global-typography-display-font-size,calc(40 * 1rem / var(--cds-global-base,20)));font-weight:var(--cds-global-typography-display-font-weight,500);line-height:var(--cds-global-typography-display-line-height,1.1em);letter-spacing:var(--cds-global-typography-display-letter-spacing,-.0125em)}[cds-text*=display]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-display-line-height,1.1em) - 1em)/ 2))*-1) + .037em)}[cds-text*=display]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-display-line-height,1.1em) - 1em)/ 2))*-1) - .044em)}[cds-text*=title]{font-size:var(--cds-global-typography-title-font-size,calc(24 * 1rem / var(--cds-global-base,20)));font-weight:var(--cds-global-typography-title-font-weight,500);line-height:var(--cds-global-typography-title-line-height,1.333333em);letter-spacing:var(--cds-global-typography-title-letter-spacing,-.00833333em)}[cds-text*=title]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-title-line-height,1.333333em) - 1em)/ 2))*-1) + .037em)}[cds-text*=title]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-title-line-height,1.333333em) - 1em)/ 2))*-1) - .044em)}[cds-text*=section]{font-size:var(--cds-global-typography-section-font-size,calc(20 * 1rem / var(--cds-global-base,20)));font-weight:var(--cds-global-typography-section-font-weight,500);line-height:var(--cds-global-typography-section-line-height,1.2em);letter-spacing:var(--cds-global-typography-section-letter-spacing,-.01em)}[cds-text*=section]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-section-line-height,1.2em) - 1em)/ 2))*-1) + .037em)}[cds-text*=section]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-section-line-height,1.2em) - 1em)/ 2))*-1) - .044em)}[cds-text*=subsection]{font-size:var(--cds-global-typography-subsection-font-size,calc(16 * 1rem / var(--cds-global-base,20)));font-weight:var(--cds-global-typography-subsection-font-weight,500);line-height:var(--cds-global-typography-subsection-line-height,1.5em);letter-spacing:var(--cds-global-typography-subsection-letter-spacing,-.0125em)}[cds-text*=subsection]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-subsection-line-height,1.5em) - 1em)/ 2))*-1) + .037em)}[cds-text*=subsection]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-subsection-line-height,1.5em) - 1em)/ 2))*-1) - .044em)}[cds-text*=body]{font-weight:var(--cds-global-typography-body-font-weight,400);font-size:var(--cds-global-typography-body-font-size,calc(14 * 1rem / var(--cds-global-base,20)));letter-spacing:var(--cds-global-typography-body-letter-spacing,-.00714286em);line-height:var(--cds-global-typography-body-line-height,1.4285714em)}[cds-text*=body]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-body-line-height,1.4285714em) - 1em)/ 2))*-1) + .1em)}[cds-text*=body]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-body-line-height,1.4285714em) - 1em)/ 2))*-1) - .044em)}body[cds-text*=body]::after,body[cds-text*=body]::before{content:none}[cds-text*=message]{font-size:var(--cds-global-typography-message-font-size,calc(16 * 1rem / var(--cds-global-base,20)));font-weight:var(--cds-global-typography-message-font-weight,calc(400 * 1rem / var(--cds-global-base,20)));line-height:var(--cds-global-typography-message-line-height,1.5em);letter-spacing:var(--cds-global-typography-message-letter-spacing,-.0125em)}[cds-text*=message]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-message-line-height,1.5em) - 1em)/ 2))*-1) + .037em)}[cds-text*=message]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-message-line-height,1.5em) - 1em)/ 2))*-1) - .044em)}[cds-text*=secondary]{font-size:var(--cds-global-typography-secondary-font-size,calc(13 * 1rem / var(--cds-global-base,20)));font-weight:var(--cds-global-typography-secondary-font-weight,400);line-height:var(--cds-global-typography-secondary-line-height,1.23077em);letter-spacing:var(--cds-global-typography-secondary-letter-spacing,-.007692em)}[cds-text*=secondary]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((var(--cds-global-typography-secondary-line-height,1.23077em) - 1em)/ 2))*-1) + .037em)}[cds-text*=secondary]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((var(--cds-global-typography-secondary-line-height,1.23077em) - 1em)/ 2))*-1) - .044em)}[cds-text~=link]{color:var(--cds-global-typography-link-color,var(--cds-global-color-blue-700,#0079ad))!important;text-decoration:underline!important;line-height:inherit!important;font-size:inherit!important}[cds-text~=link]:focus{outline:var(--cds-alias-object-interaction-outline,Highlight solid 2px);outline-offset:var(--cds-alias-object-interaction-outline-offset,1px)}[cds-text~=link]:hover{color:var(--cds-global-typography-link-color-hover,var(--cds-global-color-blue-800,#00608a))!important}[cds-text~=link]:visited:not([cds-text~=static]){color:var(--cds-global-typography-link-color-visited,var(--cds-global-color-lavender-600,#3b40ce))!important}[cds-text~=link]:visited:not([cds-text~=static]):hover{color:var(--cds-global-typography-link-color-visited-hover,var(--cds-global-color-lavender-700,#2429c2))!important}@media (-webkit-min-device-pixel-ratio:0){[cds-text=link]:focus{outline:var(--cds-alias-object-interaction-outline-webkit,5px auto -webkit-focus-ring-color)}}[cds-text~=code]{color:var(--cds-alias-status-danger,var(--cds-global-color-red-700,#e02200));font-family:monospace;font-size:1.1em}[cds-divider]{display:block;height:var(--cds-alias-object-border-width-100,calc(1 * 1rem / var(--cds-global-base,20)));overflow:hidden;box-shadow:var(--cds-alias-object-border-color,var(--cds-global-color-construction-200,#cbd4d8)) 0 0 0 var(--cds-alias-object-border-width-100,calc(1 * 1rem / var(--cds-global-base,20))) inset}[cds-text~=light]{font-weight:var(--cds-global-typography-font-weight-light,300)!important}[cds-text~=justify]{text-align:justify!important}[cds-text~=left]{text-align:left!important}[cds-text~=right]{text-align:right!important}[cds-text~=center]{text-align:center!important}[cds-text~=lhe]{padding:.05px 0}[cds-text~=lhe]::before{content:"";margin-top:-.124em;display:block;height:0}[cds-text~=lhe]::after{content:"";margin-bottom:-.221em;display:block;height:0}[cds-text*=h2],[cds-text*=h3]{font-family:var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif);font-size:1.4rem;font-weight:200;color:var(--cds-global-typography-color-400);line-height:1.7143em;letter-spacing:-.017857em}[cds-text*=h2]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((1.7143em - 1em)/ 2))*-1) + .037em)}[cds-text*=h2]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((1.7143em - 1em)/ 2))*-1) - .044em)}[cds-text*=h3]{font-size:1.1rem;line-height:1.0909em;letter-spacing:-.013636em}[cds-text*=h3]::before{content:"";display:block;height:0;width:0;margin-bottom:calc(((var(--cds-global-typography-top-gap-height,.1475em) + calc((1.0909em - 1em)/ 2))*-1) + .037em)}[cds-text*=h3]::after{content:"";display:block;height:0;width:0;margin-top:calc((((1em - var(--cds-global-typography-top-gap-height,.1475em) - var(--cds-global-typography-ascender-height,.1703em) - var(--cds-global-typography-x-height,.517em)) + calc((1.0909em - 1em)/ 2))*-1) - .044em)}:host{all:initial;display:block;visibility:inherit;font-family:var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif);contain:layout;box-sizing:border-box!important;-webkit-appearance:none!important}*,:after,:before{box-sizing:inherit!important}slot{font-family:var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif);display:contents!important}::slotted(*){font-family:inherit;box-sizing:inherit}::slotted(*)::placeholder{color:var(--cds-global-typography-color-200,var(--cds-global-color-construction-600,#4f6169))}:host([_is-anchor]),:host([role=button]){cursor:pointer!important}:host([_is-anchor]) ::slotted(*),:host([role=button]) ::slotted(*){cursor:pointer!important}:host([role=button][disabled]){cursor:not-allowed!important}:host([role=button][disabled]) ::slotted(*){cursor:not-allowed!important;pointer-events:none}:host([hidden]),[hidden]{display:none!important}:host([hidden*=false]){display:block!important}:host([role=dialog][hidden]),:host([role=dialog][hidden]) ::slotted(*){display:block!important;visibility:hidden!important}:host([role=dialog][hidden*=false]),:host([role=dialog][hidden*=false]) ::slotted(*){visibility:visible!important}:host([_focused]) .input,:host([_focused]) [focusable],:host([tabindex="0"]:focus),:host([tabindex="0"]:focus) [focusable],[tabindex="0"][focusable]:focus{outline:Highlight solid 2px;outline:5px auto -webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset,1px)}`;

// node_modules/@lit/reactive-element/development/decorators/property.js
var standardProperty = (options, element) => {
  if (element.kind === "method" && element.descriptor && !("value" in element.descriptor)) {
    return __spreadProps(__spreadValues({}, element), {
      finisher(clazz) {
        clazz.createProperty(element.key, options);
      }
    });
  } else {
    return {
      kind: "field",
      key: Symbol(),
      placement: "own",
      descriptor: {},
      // store the original key so subsequent decorators have access to it.
      originalKey: element.key,
      // When @babel/plugin-proposal-decorators implements initializers,
      // do this instead of the initializer below. See:
      // https://github.com/babel/babel/issues/9260 extras: [
      //   {
      //     kind: 'initializer',
      //     placement: 'own',
      //     initializer: descriptor.initializer,
      //   }
      // ],
      initializer() {
        if (typeof element.initializer === "function") {
          this[element.key] = element.initializer.call(this);
        }
      },
      finisher(clazz) {
        clazz.createProperty(element.key, options);
      }
    };
  }
};
var legacyProperty = (options, proto, name) => {
  proto.constructor.createProperty(name, options);
};
function property(options) {
  return (protoOrDescriptor, name) => name !== void 0 ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
}

// node_modules/ramda/es/internal/_indexOf.js
function _indexOf(list, a20, idx) {
  var inf, item;
  if (typeof list.indexOf === "function") {
    switch (typeof a20) {
      case "number":
        if (a20 === 0) {
          inf = 1 / a20;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a20 !== a20) {
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === "number" && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        return list.indexOf(a20, idx);
      case "string":
      case "boolean":
      case "function":
      case "undefined":
        return list.indexOf(a20, idx);
      case "object":
        if (a20 === null) {
          return list.indexOf(a20, idx);
        }
    }
  }
  while (idx < list.length) {
    if (equals_default(list[idx], a20)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}

// node_modules/ramda/es/internal/_includes.js
function _includes(a20, list) {
  return _indexOf(list, a20, 0) >= 0;
}

// node_modules/ramda/es/includes.js
var includes = _curry2(_includes);

// node_modules/ramda/es/internal/_Set.js
var _Set = function() {
  function _Set2() {
    this._nativeSet = typeof Set === "function" ? /* @__PURE__ */ new Set() : null;
    this._items = {};
  }
  _Set2.prototype.add = function(item) {
    return !hasOrAdd(item, true, this);
  };
  _Set2.prototype.has = function(item) {
    return hasOrAdd(item, false, this);
  };
  return _Set2;
}();
function hasOrAdd(item, shouldAdd, set) {
  var type3 = typeof item;
  var prevSize, newSize;
  switch (type3) {
    case "string":
    case "number":
      if (item === 0 && 1 / item === -Infinity) {
        if (set._items["-0"]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items["-0"] = true;
          }
          return false;
        }
      }
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;
          set._nativeSet.add(item);
          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type3 in set._items)) {
          if (shouldAdd) {
            set._items[type3] = {};
            set._items[type3][item] = true;
          }
          return false;
        } else if (item in set._items[type3]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type3][item] = true;
          }
          return false;
        }
      }
    case "boolean":
      if (type3 in set._items) {
        var bIdx = item ? 1 : 0;
        if (set._items[type3][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type3][bIdx] = true;
          }
          return false;
        }
      } else {
        if (shouldAdd) {
          set._items[type3] = item ? [false, true] : [true, false];
        }
        return false;
      }
    case "function":
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;
          set._nativeSet.add(item);
          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type3 in set._items)) {
          if (shouldAdd) {
            set._items[type3] = [item];
          }
          return false;
        }
        if (!_includes(item, set._items[type3])) {
          if (shouldAdd) {
            set._items[type3].push(item);
          }
          return false;
        }
        return true;
      }
    case "undefined":
      if (set._items[type3]) {
        return true;
      } else {
        if (shouldAdd) {
          set._items[type3] = true;
        }
        return false;
      }
    case "object":
      if (item === null) {
        if (!set._items["null"]) {
          if (shouldAdd) {
            set._items["null"] = true;
          }
          return false;
        }
        return true;
      }
    default:
      type3 = Object.prototype.toString.call(item);
      if (!(type3 in set._items)) {
        if (shouldAdd) {
          set._items[type3] = [item];
        }
        return false;
      }
      if (!_includes(item, set._items[type3])) {
        if (shouldAdd) {
          set._items[type3].push(item);
        }
        return false;
      }
      return true;
  }
}
var Set_default = _Set;

// node_modules/ramda/es/internal/_complement.js
function _complement(f9) {
  return function() {
    return !f9.apply(this, arguments);
  };
}

// node_modules/ramda/es/internal/_arrayReduce.js
function _arrayReduce(reducer, acc, list) {
  var index = 0;
  var length = list.length;
  while (index < length) {
    acc = reducer(acc, list[index]);
    index += 1;
  }
  return acc;
}

// node_modules/ramda/es/internal/_isTransformer.js
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] === "function";
}

// node_modules/ramda/es/internal/_dispatchable.js
function _dispatchable(methodNames, transducerCreator, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var obj = arguments[arguments.length - 1];
    if (!isArray_default(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === "function") {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}

// node_modules/ramda/es/internal/_filter.js
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}

// node_modules/ramda/es/internal/_xfBase.js
var xfBase_default = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};

// node_modules/ramda/es/internal/_xfilter.js
var XFilter = function() {
  function XFilter2(f9, xf) {
    this.xf = xf;
    this.f = f9;
  }
  XFilter2.prototype["@@transducer/init"] = xfBase_default.init;
  XFilter2.prototype["@@transducer/result"] = xfBase_default.result;
  XFilter2.prototype["@@transducer/step"] = function(result, input) {
    return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XFilter2;
}();
function _xfilter(f9) {
  return function(xf) {
    return new XFilter(f9, xf);
  };
}

// node_modules/ramda/es/filter.js
var filter = _curry2(
  _dispatchable(["fantasy-land/filter", "filter"], _xfilter, function(pred, filterable) {
    return _isObject(filterable) ? _arrayReduce(function(acc, key) {
      if (pred(filterable[key])) {
        acc[key] = filterable[key];
      }
      return acc;
    }, {}, keys_default(filterable)) : (
      // else
      _filter(pred, filterable)
    );
  })
);
var filter_default = filter;

// node_modules/ramda/es/reject.js
var reject = _curry2(function reject2(pred, filterable) {
  return filter_default(_complement(pred), filterable);
});
var reject_default = reject;

// node_modules/ramda/es/without.js
var without = _curry2(function without2(xs, list) {
  var toRemove = new Set_default();
  for (var i23 = 0; i23 < xs.length; i23 += 1) {
    toRemove.add(xs[i23]);
  }
  return reject_default(toRemove.has.bind(toRemove), list);
});

// node_modules/@cds/core/internal/utils/css.js
function u3(t42, ...e28) {
  return e28.forEach(([e29, n25]) => {
    t42.style[e29] = n25;
  }), t42;
}
function a6(t42, ...e28) {
  return e28.forEach((e29) => {
    t42.style[e29] = "";
  }), t42;
}
function c4(t42) {
  return `calc((${t42} / var(--cds-global-base)) * 1rem)`;
}

// node_modules/@cds/core/internal/utils/dom.js
var d4 = ["a[href]", "area[href]", "audio[controls]", "button:not([disabled])", 'input:not([type="hidden"]):not([disabled]):not([readonly])', "iframe", "object", "embed", "select:not([disabled])", "textarea:not([disabled])", "video[controls]", "*[contenteditable=true]", "[role=button]:not([disabled])"];
var l3 = ["*[tabindex]", ...d4];
var f3 = ['*[tabindex]:not([tabindex="-1"])', ...d4];
function b2(t42, e28 = "px") {
  return t42 && t42.getBoundingClientRect ? t42.getBoundingClientRect().width + e28 : "";
}
function L2(t42) {
  return null != t42 && "" + t42 != "false";
}

// node_modules/@cds/core/internal/decorators/property.js
function f4(t42, e28) {
  switch (e28 ? e28.type : e28) {
    case Array:
    case Object:
      return __spreadValues({ reflect: false }, e28);
    case String:
      return __spreadValues({ reflect: true, attribute: c3(t42), converter: { toAttribute: (t43) => t43 || null } }, e28);
    case Number:
      return __spreadValues({ reflect: true, attribute: c3(t42) }, e28);
    case Boolean:
      return __spreadValues({ reflect: true, attribute: c3(t42), converter: { toAttribute: (t43) => t43 ? "" : null, fromAttribute: (t43) => L2(t43) } }, e28);
    case Date:
      return __spreadValues({ reflect: false, converter: { fromAttribute: (t43) => new Date(t43) } }, e28);
    default:
      return __spreadValues({}, e28);
  }
}
function l4(t42, a20, f9) {
  const l7 = t42.firstUpdated;
  t42.firstUpdated = function(t43) {
    if (f9 && f9.required && e(this[a20])) {
      const t44 = f9.requiredMessage || function(t45 = "warning", n25, s22) {
        const a21 = s22.toLocaleLowerCase();
        return `${a3(t45)}: ${n25} is required to use ${a21} component. Set the JS Property or HTML Attribute.

` + (r2() ? `Angular: <${a21} [${n25}]="..."></${a21}>
` : "") + (c2() ? `Vue: <${a21} :${n25}="..."></${a21}>
` : "") + (u2() ? `React: <${f2(a21)} ${function(t46) {
          return t46.startsWith("aria") ? c3(t46) : t46;
        }(n25)}={...} />
` : "") + `HTML: <${a21} ${c3(n25)}="..."></${a21}>
JavaScript: document.querySelector('${a21}').${n25} = '...';

`;
      }(f9.required, a20, this.tagName);
      if ("error" === f9.required)
        throw Error(t44);
      n3.warn(t44, this);
    }
    l7 && l7.call(this, t43);
  };
}
function m2(r26) {
  return (e28, i23) => (r26?.required && l4(e28, i23, r26), property(f4(i23, r26))(e28, i23));
}
function p2(e28) {
  return (i23, n25) => {
    const o28 = f4(n25, e28);
    return o28 && (o28.reflect = !!e28?.reflect && e28.reflect, o28.reflect && !e28?.attribute && (o28.attribute = "_" + c3(n25))), property(o28)(i23, n25);
  };
}

// node_modules/@cds/core/internal/controllers/active.controller.js
function t5() {
  return (t42) => t42.addInitializer((t43) => new e5(t43));
}
var e5 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  hostConnected() {
    return __async(this, null, function* () {
      yield this.host.updateComplete, this.host.addEventListener("keydown", (t42) => this.emulateActive(t42)), this.host.addEventListener("mousedown", (t42) => this.emulateActive(t42)), this.host.addEventListener("keyup", () => this.emulateInactive()), this.host.addEventListener("blur", () => this.emulateInactive()), this.host.addEventListener("mouseup", () => this.emulateInactive());
    });
  }
  emulateActive(t42) {
    this.host.disabled || this.host?.setAttribute("cds-active", ""), "Space" === t42.code && t42.target === this.host && t42.preventDefault();
  }
  emulateInactive() {
    this.host.removeAttribute("cds-active");
  }
};

// node_modules/@cds/core/internal/controllers/aria-popup-trigger.controller.js
function t6() {
  return (t42) => t42.addInitializer((t43) => new s4(t43));
}
var s4 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  hostConnected() {
    (this.host.hasAttribute("aria-controls") || this.host.ariaControls) && (this.host.ariaHasPopup = "true", this.host.ariaExpanded = "false");
  }
};

// node_modules/@cds/core/internal/controllers/aria-disabled.controller.js
function t7() {
  return (t42) => t42.addInitializer((t43) => new s5(t43));
}
var s5 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  hostUpdated() {
    null !== this.host.disabled && (this.host.ariaDisabled = this.host.disabled), this.host.readonly && (this.host.ariaDisabled = null);
  }
};

// node_modules/@cds/core/internal/controllers/aria-pressed.controller.js
function s6() {
  return (s22) => s22.addInitializer((s23) => new t8(s23));
}
var t8 = class {
  constructor(s22) {
    this.host = s22, this.host.addController(this);
  }
  hostUpdated() {
    null !== this.host.pressed && void 0 !== this.host.pressed && (this.host.ariaPressed = this.host.pressed ? "true" : "false"), this.host.readonly && (this.host.ariaPressed = null);
  }
};

// node_modules/@cds/core/internal/controllers/aria-button.controller.js
function t9() {
  return (t42) => t42.addInitializer((t43) => new s7(t43));
}
var s7 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  hostConnected() {
    this.host.tabIndex = 0;
  }
  hostUpdated() {
    this.host.role = this.host.readonly ? null : "button", this.host.tabIndex = this.host.disabled ? -1 : 0, this.host.readonly && this.host.removeAttribute("tabindex");
  }
};

// node_modules/@cds/core/internal/controllers/button-anchor.controller.js
function t10() {
  return (t42) => t42.addInitializer((t43) => new r4(t43));
}
var r4 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  get currentAnchor() {
    return "A" === this.host.parentElement?.tagName ? this.host.parentElement : null;
  }
  hostConnected() {
    this.setAnchor();
  }
  hostUpdated() {
    this.setAnchor();
  }
  setAnchor() {
    this.currentAnchor && this.currentAnchor !== this.previousAnchor && (this.previousAnchor = this.currentAnchor, this.host.readonly = true, this.currentAnchor.style.lineHeight = "0", this.currentAnchor.style.textDecoration = "none");
  }
};

// node_modules/lit-html/development/directives/if-defined.js
var ifDefined = (value) => value !== null && value !== void 0 ? value : nothing;

// node_modules/@cds/core/internal/utils/events.js
function t11(e28) {
  e28.preventDefault(), e28.stopPropagation();
}
function s8(e28, t42, n25) {
  const r26 = new MutationObserver((r27) => {
    r27.find((e29) => e29.attributeName === t42) && n25(e28.getAttribute(t42));
  });
  return r26.observe(e28, { attributes: true }), r26;
}

// node_modules/@cds/core/internal/services/keycodes.service.js
var r5 = /* @__PURE__ */ new Map([["arrow-left", "ArrowLeft"], ["arrow-right", "ArrowRight"], ["arrow-up", "ArrowUp"], ["arrow-down", "ArrowDown"], ["tab", "Tab"], ["enter", "Enter"], ["escape", "Escape"], ["space", " "], ["home", "Home"], ["end", "End"]]);
var e7 = class {
  static get keycodes() {
    return b(r5);
  }
  static add(t42, e28) {
    r5.set(t42, e28);
  }
  static has(t42) {
    return r5.has(t42);
  }
  static getCode(t42, r26 = this.keycodes) {
    return o5(t42, r26);
  }
};
function o5(t42, r26) {
  return r26.get(t42) || "";
}

// node_modules/@cds/core/internal/utils/keycodes.js
function r6(r26, t42) {
  return e7.getCode(t42) === r26.key;
}
function n5(e28, t42, n25) {
  e28.filter((e29) => r6(t42, e29)).length > 0 && n25();
}
var w4;
!function(e28) {
  e28.ArrowUp = "ArrowUp", e28.ArrowDown = "ArrowDown", e28.ArrowLeft = "ArrowLeft", e28.ArrowRight = "ArrowRight", e28.End = "End", e28.Home = "Home", e28.PageUp = "PageUp", e28.PageDown = "PageDown";
}(w4 || (w4 = {}));

// node_modules/@cds/core/internal/utils/lit.js
function c5(r26, n25, o28) {
  const t42 = document.createElement("div");
  n25.prepend(t42), render(r26, n25, __spreadValues({ renderBefore: t42 }, o28));
  const i23 = t42.previousSibling;
  return t42.remove(), i23;
}
function f5(r26, n25, o28) {
  const t42 = document.createElement("div");
  n25.appendChild(t42), render(r26, n25, __spreadValues({ renderBefore: t42 }, o28));
  const i23 = t42.previousSibling;
  return t42.remove(), i23;
}

// node_modules/@cds/core/internal/controllers/button-submit.controller.js
function r7() {
  return (t42) => t42.addInitializer((t43) => new h2(t43));
}
var h2 = class {
  constructor(t42) {
    this.host = t42, this.triggerNativeButtonBehaviorHandler = this.triggerNativeButtonBehavior.bind(this), this.emulateKeyBoardEventBehaviorHandler = this.emulateKeyBoardEventBehavior.bind(this), this.host.addController(this);
  }
  hostUpdated() {
    this.setButtonType(), this.setupNativeButtonBehavior();
  }
  setButtonType() {
    !this.host.type && this.host.closest("form") && (this.host.type = "submit");
  }
  setupNativeButtonBehavior() {
    this.host.readonly || this.host.disabled ? (this.host.removeEventListener("click", this.triggerNativeButtonBehaviorHandler), this.host.removeEventListener("keyup", this.emulateKeyBoardEventBehaviorHandler)) : (this.host.addEventListener("click", this.triggerNativeButtonBehaviorHandler), this.host.addEventListener("keyup", this.emulateKeyBoardEventBehaviorHandler));
  }
  emulateKeyBoardEventBehavior(t42) {
    n5(["enter", "space"], t42, () => {
      "submit" === this.host.type ? this.triggerNativeButtonBehavior(t42) : this.host.click(), t11(t42);
    });
  }
  triggerNativeButtonBehavior(s22) {
    if (this.host.disabled)
      t11(s22);
    else if (!s22.defaultPrevented) {
      const i23 = f5(html`<button aria-hidden="true" role="presentation" ?disabled="${this.host.disabled}" tabindex="-1" style="display:none!important" value="${ifDefined(this.host.value)}" name="${ifDefined(this.host.name)}" type="${ifDefined(this.host.type)}"></button>`, this.host);
      i23?.dispatchEvent(new MouseEvent("click", { relatedTarget: this.host, composed: true })), i23?.remove();
    }
  }
};

// node_modules/@cds/core/internal/controllers/aria-expanded.controller.js
function t12() {
  return (t42) => t42.addInitializer((t43) => new s9(t43));
}
var s9 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  hostUpdated() {
    null !== this.host.expanded && void 0 !== this.host.expanded && (this.host.ariaExpanded = this.host.expanded ? "true" : "false"), this.host.readonly && (this.host.ariaExpanded = null);
  }
};

// node_modules/@cds/core/internal/base/button.base.js
var m3 = class extends LitElement {
  constructor() {
    super(...arguments);
    this._disabled = false;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(o28) {
    const r26 = this._disabled;
    this._disabled = o28, this.requestUpdate("disabled", r26);
  }
};
__decorate([m2({ type: Boolean })], m3.prototype, "pressed", void 0), __decorate([m2({ type: Boolean })], m3.prototype, "expanded", void 0), __decorate([m2({ type: Boolean })], m3.prototype, "readonly", void 0), __decorate([m2({ type: String })], m3.prototype, "type", void 0), __decorate([m2({ type: String })], m3.prototype, "name", void 0), __decorate([m2({ type: String })], m3.prototype, "value", void 0), __decorate([m2({ type: Boolean })], m3.prototype, "disabled", null), __decorate([m2({ type: String })], m3.prototype, "popup", void 0), m3 = __decorate([t5(), t9(), s6(), t12(), t7(), t6(), r7(), t10()], m3);

// node_modules/@cds/core/internal/utils/focus.js
function t13(e28) {
  return e28.matches("a[href],area[href],input:not([disabled]),button:not([disabled]),select:not([disabled]),textarea:not([disabled]),iframe,object,embed,*[tabindex],*[contenteditable=true],[role=button]:not([disabled])");
}
function a7(e28) {
  e28 && !t13(e28) ? (e28.setAttribute("tabindex", "-1"), e28.focus(), e28.addEventListener("blur", () => e28.removeAttribute("tabindex"), { once: true })) : e28?.focus();
}
function d5(e28, t42) {
  e28.addEventListener("focusout", (n25) => {
    !e28.contains(n25.relatedTarget) && document.hasFocus() && t42();
  });
}
function i4(t42, n25) {
  t42.addEventListener("keyup", (t43) => {
    "Escape" === t43.code && (t11(t43), n25());
  });
}
function c6(e28) {
  return true === e28.cdsIgnoreFocus || e28.hasAttribute("cds-ignore-focus") || e28.hasAttribute("_demo-mode");
}

// node_modules/@cds/core/internal/utils/traversal.js
function r8(r26, t42 = 10) {
  return n6(r26, t42).filter((r27) => t13(r27));
}
function n6(e28, r26 = 10) {
  return Array.from(t14(e28)).reduce((e29, o28) => [...e29, [o28, [...Array.from(t14(o28)).map((e30) => [e30, n6(e30, r26)])]]], []).flat(r26);
}
function t14(e28) {
  if (e28.documentElement)
    return e28.documentElement.children;
  if (e28.shadowRoot)
    return e28.shadowRoot.children;
  if (e28.assignedElements) {
    const r26 = e28.assignedElements();
    return r26.length ? r26 : e28.children;
  }
  return e28.children;
}

// node_modules/@cds/core/internal/controllers/first-focus.controller.js
var e8 = class {
  constructor(s22, t42 = { fallback: "focusable" }) {
    this.host = s22, this.config = t42, this.host.addController(this);
  }
  hostConnected() {
    return __async(this, null, function* () {
      yield this.host.updateComplete, this.observer = s8(this.host, "hidden", () => this.cdsFocusFirst()), this.cdsFocusFirst();
    });
  }
  hostDisconnected() {
    this.observer?.disconnect();
  }
  cdsFocusFirst() {
    if (!c6(this.host)) {
      const s22 = this.host.shadowRoot ? this.host.shadowRoot : this.host, i23 = s22.querySelector(".private-host") ?? this.host, h9 = n6(s22).filter((s23) => !s23.hasAttribute("cds-focus-boundary")), e28 = h9.find((s23) => s23.hasAttribute("cds-first-focus")), r26 = "focusable" === this.config.fallback ? h9.find((s23) => t13(s23) && !s23.classList.contains("private-host")) : null, a20 = "none" === this.config.fallback ? null : i23, n25 = e28 ?? r26 ?? a20;
      n25 && a7(n25);
    }
  }
};

// node_modules/@cds/core/internal/controllers/closable.controller.js
var e9 = class {
  constructor(s22, t42 = {}) {
    this.host = s22, this.config = __spreadValues({ escape: true, focusout: false }, t42), this.host.addController(this);
  }
  hostConnected() {
    this.config.escape && i4(this.host, () => this.close("escape-keypress")), this.config.focusout && (this.host.tabIndex = 0, d5(this.host, () => this.close("focusout")));
  }
  close(s22) {
    this.host.dispatchEvent(new CustomEvent("closeChange", { detail: s22 }));
  }
};

// node_modules/@cds/core/internal/controllers/inline-focus-trap.controller.js
var e10 = class {
  constructor(t42) {
    this.host = t42, this.host.addController(this);
  }
  get focusableItems() {
    return r8(this.root).filter((t42) => !t42.hasAttribute("cds-focus-boundary") && (this.root.contains(t42) || t42.closest("[cds-focus-trap]") === this.host));
  }
  get root() {
    return this.host.shadowRoot ? this.host.shadowRoot : this.host;
  }
  get styles() {
    return html`<style cds-focus-style>:host(:focus-within) [cds-focus-boundary],:host(:host:focus-within) [cds-focus-boundary]{display:block!important}</style>`;
  }
  boundary(s22) {
    return html`<div @focusin="${() => this.focusableItems.at(s22)?.focus()}" test="${s22}" cds-focus-boundary tabindex="0" style="display:none;position:absolute;width:1px;height:1px;clip:rect(0,0,0,0)">boundary</div>`;
  }
  hostConnected() {
    return __async(this, null, function* () {
      yield this.host.updateComplete, c6(this.host) || (c5(this.styles, this.root), c5(this.boundary(-1), this.root), f5(this.boundary(0), this.root), this.host.setAttribute("cds-focus-trap", ""));
    });
  }
};

// node_modules/@cds/core/internal/base/focus-trap.base.js
var p3 = class extends LitElement {
  constructor() {
    super();
    this.firstFocusController = new e8(this), this.closableController = new e9(this), this.inlineFocusTrapController = new e10(this), this.demoMode = false, this.focusTrapId = p();
  }
  render() {
    return html`<slot></slot>`;
  }
};
__decorate([p2({ type: Boolean, reflect: true })], p3.prototype, "demoMode", void 0), __decorate([p2({ type: String })], p3.prototype, "focusTrapId", void 0);

// node_modules/@cds/core/internal/utils/event-subject.js
var s10 = class {
  constructor(s22, i23) {
    this.fn = s22, this.subscriptions = i23;
  }
  unsubscribe() {
    const s22 = this.subscriptions.indexOf(this);
    -1 !== s22 && this.subscriptions.splice(s22, 1);
  }
};
var i5 = class {
  constructor() {
    this.subscriptions = [];
  }
  subscribe(i23) {
    const t42 = new s10(i23, this.subscriptions);
    return this.subscriptions.push(t42), t42;
  }
  emit(s22) {
    this.subscriptions.forEach((i23) => i23.fn(s22));
  }
  toEventObservable() {
    return this;
  }
};

// node_modules/@cds/core/internal/services/global.service.js
var a8 = new i5();
a8.listener = document.addEventListener("CDS_STATE_UPDATE", (t42) => a8.emit(t42.detail));
var i6 = class _i {
  static get state() {
    return w2(), window.CDS._state;
  }
  static getValue(t42) {
    return _i.state[t42];
  }
  static setValue(t42, e28) {
    _i.state[t42] = e28;
  }
  static log() {
    n3.log(JSON.stringify(_i.state, null, 2));
  }
};
i6.stateUpdates = a8.toEventObservable();

// node_modules/ramda/es/isNil.js
var isNil = _curry1(function isNil2(x6) {
  return x6 == null;
});

// node_modules/ramda/es/add.js
var add = _curry2(function add2(a20, b6) {
  return Number(a20) + Number(b6);
});
var add_default = add;

// node_modules/ramda/es/internal/_curry3.js
function _curry3(fn) {
  return function f32(a20, b6, c11) {
    switch (arguments.length) {
      case 0:
        return f32;
      case 1:
        return _isPlaceholder(a20) ? f32 : _curry2(function(_b4, _c4) {
          return fn(a20, _b4, _c4);
        });
      case 2:
        return _isPlaceholder(a20) && _isPlaceholder(b6) ? f32 : _isPlaceholder(a20) ? _curry2(function(_a4, _c4) {
          return fn(_a4, b6, _c4);
        }) : _isPlaceholder(b6) ? _curry2(function(_b4, _c4) {
          return fn(a20, _b4, _c4);
        }) : _curry1(function(_c4) {
          return fn(a20, b6, _c4);
        });
      default:
        return _isPlaceholder(a20) && _isPlaceholder(b6) && _isPlaceholder(c11) ? f32 : _isPlaceholder(a20) && _isPlaceholder(b6) ? _curry2(function(_a4, _b4) {
          return fn(_a4, _b4, c11);
        }) : _isPlaceholder(a20) && _isPlaceholder(c11) ? _curry2(function(_a4, _c4) {
          return fn(_a4, b6, _c4);
        }) : _isPlaceholder(b6) && _isPlaceholder(c11) ? _curry2(function(_b4, _c4) {
          return fn(a20, _b4, _c4);
        }) : _isPlaceholder(a20) ? _curry1(function(_a4) {
          return fn(_a4, b6, c11);
        }) : _isPlaceholder(b6) ? _curry1(function(_b4) {
          return fn(a20, _b4, c11);
        }) : _isPlaceholder(c11) ? _curry1(function(_c4) {
          return fn(a20, b6, _c4);
        }) : fn(a20, b6, c11);
    }
  };
}

// node_modules/ramda/es/internal/_isArrayLike.js
var _isArrayLike = _curry1(function isArrayLike(x6) {
  if (isArray_default(x6)) {
    return true;
  }
  if (!x6) {
    return false;
  }
  if (typeof x6 !== "object") {
    return false;
  }
  if (_isString(x6)) {
    return false;
  }
  if (x6.length === 0) {
    return true;
  }
  if (x6.length > 0) {
    return x6.hasOwnProperty(0) && x6.hasOwnProperty(x6.length - 1);
  }
  return false;
});
var isArrayLike_default = _isArrayLike;

// node_modules/ramda/es/internal/_createReduce.js
var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
function _createReduce(arrayReduce, methodReduce, iterableReduce) {
  return function _reduce(xf, acc, list) {
    if (isArrayLike_default(list)) {
      return arrayReduce(xf, acc, list);
    }
    if (list == null) {
      return acc;
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return methodReduce(xf, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return iterableReduce(xf, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return iterableReduce(xf, acc, list);
    }
    if (typeof list.reduce === "function") {
      return methodReduce(xf, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  };
}

// node_modules/ramda/es/internal/_xArrayReduce.js
function _xArrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf["@@transducer/step"](acc, list[idx]);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx += 1;
  }
  return xf["@@transducer/result"](acc);
}

// node_modules/ramda/es/bind.js
var bind = _curry2(function bind2(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});
var bind_default = bind;

// node_modules/ramda/es/internal/_xReduce.js
function _xIterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf["@@transducer/step"](acc, step.value);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    step = iter.next();
  }
  return xf["@@transducer/result"](acc);
}
function _xMethodReduce(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
}
var _xReduce = _createReduce(_xArrayReduce, _xMethodReduce, _xIterableReduce);
var xReduce_default = _xReduce;

// node_modules/ramda/es/internal/_xwrap.js
var XWrap = function() {
  function XWrap2(fn) {
    this.f = fn;
  }
  XWrap2.prototype["@@transducer/init"] = function() {
    throw new Error("init not implemented on XWrap");
  };
  XWrap2.prototype["@@transducer/result"] = function(acc) {
    return acc;
  };
  XWrap2.prototype["@@transducer/step"] = function(acc, x6) {
    return this.f(acc, x6);
  };
  return XWrap2;
}();
function _xwrap(fn) {
  return new XWrap(fn);
}

// node_modules/ramda/es/reduce.js
var reduce = _curry3(function(xf, acc, list) {
  return xReduce_default(typeof xf === "function" ? _xwrap(xf) : xf, acc, list);
});
var reduce_default = reduce;

// node_modules/ramda/es/sum.js
var sum = reduce_default(add_default, 0);
var sum_default = sum;

// node_modules/@cds/core/internal/utils/math.js
var a9 = curryN_default(3, (r26, t42, o28) => (r26 || 0) + sum_default(t42 || []) - sum_default(o28 || []));
var e12 = curryN_default(4, (r26, m8, t42, o28) => !!o28 && o28(a9(r26, m8, t42)));

// node_modules/@cds/core/internal/motion/interfaces.js
var e13;
!function(e28) {
  e28.ready = "ready", e28.active = "active", e28.start = "starting", e28.end = "done";
}(e13 || (e13 = {}));

// node_modules/ramda/es/internal/_cloneRegExp.js
function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, pattern.flags ? pattern.flags : (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : "") + (pattern.dotAll ? "s" : ""));
}

// node_modules/ramda/es/internal/_clone.js
function _clone(value, deep, map) {
  map || (map = new _ObjectMap());
  if (_isPrimitive(value)) {
    return value;
  }
  var copy = function copy2(copiedValue) {
    var cachedCopy = map.get(value);
    if (cachedCopy) {
      return cachedCopy;
    }
    map.set(value, copiedValue);
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        copiedValue[key] = deep ? _clone(value[key], true, map) : value[key];
      }
    }
    return copiedValue;
  };
  switch (type_default(value)) {
    case "Object":
      return copy(Object.create(Object.getPrototypeOf(value)));
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return _cloneRegExp(value);
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "BigInt64Array":
    case "BigUint64Array":
      return value.slice();
    default:
      return value;
  }
}
function _isPrimitive(param) {
  var type3 = typeof param;
  return param == null || type3 != "object" && type3 != "function";
}
var _ObjectMap = function() {
  function _ObjectMap2() {
    this.map = {};
    this.length = 0;
  }
  _ObjectMap2.prototype.set = function(key, value) {
    const hashedKey = this.hash(key);
    let bucket = this.map[hashedKey];
    if (!bucket) {
      this.map[hashedKey] = bucket = [];
    }
    bucket.push([key, value]);
    this.length += 1;
  };
  _ObjectMap2.prototype.hash = function(key) {
    let hashedKey = [];
    for (var value in key) {
      hashedKey.push(Object.prototype.toString.call(key[value]));
    }
    return hashedKey.join();
  };
  _ObjectMap2.prototype.get = function(key) {
    if (this.length <= 180) {
      for (const p6 in this.map) {
        const bucket2 = this.map[p6];
        for (let i23 = 0; i23 < bucket2.length; i23 += 1) {
          const element = bucket2[i23];
          if (element[0] === key) {
            return element[1];
          }
        }
      }
      return;
    }
    const hashedKey = this.hash(key);
    const bucket = this.map[hashedKey];
    if (!bucket) {
      return;
    }
    for (let i23 = 0; i23 < bucket.length; i23 += 1) {
      const element = bucket[i23];
      if (element[0] === key) {
        return element[1];
      }
    }
  };
  return _ObjectMap2;
}();

// node_modules/ramda/es/clone.js
var clone = _curry1(function clone2(value) {
  return value != null && typeof value.clone === "function" ? value.clone() : _clone(value, true);
});

// node_modules/lit-html/development/directive.js
var directive = (c11) => (...values) => ({
  // This property needs to remain unminified.
  ["_$litDirective$"]: c11,
  values
});
var Directive = class {
  constructor(_partInfo) {
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  /** @internal */
  _$initialize(part, parent, attributeIndex) {
    this.__part = part;
    this._$parent = parent;
    this.__attributeIndex = attributeIndex;
  }
  /** @internal */
  _$resolve(part, props) {
    return this.update(part, props);
  }
  update(_part, props) {
    return this.render(...props);
  }
};

// node_modules/@cds/core/internal/directives/spread-props.js
var t18 = class extends Directive {
  render() {
    return "";
  }
  update(e28, r26) {
    return Object.entries(r26[0]).filter(([r27, t42]) => t42 !== e28.element[r27]).forEach(([r27, t42]) => e28.element[r27] = t42), this.render();
  }
};
var n11 = directive(t18);

// node_modules/@cds/core/internal/services/i18n.service.js
var i9 = { actions: { sort: "Sort", expand: "Expand", close: "Close", resize: "Resize", filter: "Filter" }, alert: { closeButtonAriaLabel: "Close", loading: "Loading", info: "Info", success: "Success", warning: "Warning", danger: "Error" }, dropdown: { open: "Open" }, file: { browse: "browse", files: "files", removeFile: "remove file" }, modal: { closeButtonAriaLabel: "Close modal", contentStart: "Beginning of modal content", contentBox: "Scrollable modal body", contentEnd: "End of modal content" }, navigation: { navigationElement: "navigation", navigationLabel: "navigation menu", navigationAbridgedText: "View abridged menu", navigationUnabridgedText: "View unabridged menu" }, overlay: { closeButtonAriaLabel: "Close dialog", contentStart: "Beginning of dialog content", contentEnd: "End of dialog content" }, popup: { closeButtonAriaLabel: "Close popup", contentStart: "Beginning of popup content", contentEnd: "End of popup content" }, password: { showButtonAriaLabel: "Show password", hideButtonAriaLabel: "Hide password" }, progress: { loading: "Loading", looping: "Loading" }, treeview: { loading: "Loading" }, grid: { resizeColumn: "Resize Column", closeDetails: "Close Details", noData: "No Results Found", rowDetailStart: "Start of row details", rowDetailEnd: "End of row details", footerEnd: "End of grid rows", action: "Action", dropTarget: "Drop Item", pagination: { label: "grid pagination", firstPage: "go to first page", previousPage: "go to previous page", nextPage: "go to next page", lastPage: "go to last page", pageSize: "rows per page", page: "page" } } };
var a11 = class _a4 {
  static get keys() {
    return 0 === Object.keys(i6.state.i18nRegistry).length && (i6.state.i18nRegistry = x(i9, i6.state.i18nRegistry)), x(i9, i6.state.i18nRegistry);
  }
  static findKey(e28) {
    const t42 = _a4.keys;
    return Object.keys(t42).find((o28) => g(t42[o28], e28));
  }
  static get(e28) {
    return e28 && _a4.keys[e28] || {};
  }
  static reset() {
    i6.state.i18nRegistry = x({}, i9);
  }
  static hydrate(e28, o28) {
    return JSON.parse(P(JSON.stringify(e28), o28));
  }
  static localize(t42) {
    i6.state.i18nRegistry = x(i9, i6.state.i18nRegistry, t42);
  }
};

// node_modules/@cds/core/internal/decorators/i18n.js
function o9() {
  return (n25, r26) => {
    const c11 = n25.connectedCallback, o28 = n25.disconnectedCallback;
    n25.connectedCallback = function() {
      n25.__i18nSub = i6.stateUpdates.subscribe((e28) => {
        "i18nRegistry" === e28.key && this.requestUpdate(r26);
      }), c11 && c11.apply(this);
    }, n25.disconnectedCallback = function() {
      n25.__i18nSub.unsubscribe(), o28 && o28.apply(this);
    };
    const d11 = { get() {
      const e28 = x(a11.keys[this.__i18nKey], this.__i18n || {});
      return a11.hydrate(e28, this);
    }, set(e28) {
      const t42 = u5(e28, this), s22 = a12(a11.findKey(t42) || "", this.__i18nKey, t42, this.__i18n);
      void 0 !== s22.key && (this.__i18nKey = s22.key + ""), void 0 !== s22.values && (this.__i18n = __spreadValues({}, s22.values)), true === s22.update && this.requestUpdate(), this.requestUpdate(r26);
    }, enumerable: true, configurable: true };
    return void 0 !== r26 ? function(t42, i23, s22) {
      const n26 = Object.defineProperty(i23, s22, t42);
      return m2({ type: Object, attribute: "cds-i18n" })(n26, s22);
    }(d11, n25, r26) : function(t42, i23) {
      const s22 = { kind: "method", placement: "prototype", key: i23.key, descriptor: t42 };
      return m2({ type: Object })(s22);
    }(d11, n25);
  };
}
function u5(e28, t42) {
  if (e(e28)) {
    let e29 = {};
    if (t42.hasAttribute("cds-i18n")) {
      const i23 = t42.getAttribute("cds-i18n") + "";
      if (e(i23))
        e29 = {};
      else
        try {
          e29 = JSON.parse(i23);
        } catch {
          n3.warn("Clarity i18n: Invalid JSON passed to cds-i18n"), e29 = {};
        }
    }
    return e29;
  }
  return e28;
}
function a12(e28, t42, i23, s22) {
  return e(e28) ? g(i23, s22) ? { update: false } : { update: true, values: i23 } : e28 === t42 ? { update: false, values: {} } : { update: true, key: e28, values: {} };
}

// node_modules/@cds/core/internal/positioning/interfaces.js
var t20;
!function(t42) {
  t42[t42.Responsive = 0] = "Responsive", t42[t42.Top = 1] = "Top", t42[t42.Left = 2] = "Left", t42[t42.TopOrLeft = 3] = "TopOrLeft", t42[t42.Right = 4] = "Right", t42[t42.TopOrRight = 5] = "TopOrRight", t42[t42.Horizontal = 6] = "Horizontal", t42[t42.TopOrHorizontal = 7] = "TopOrHorizontal", t42[t42.Bottom = 8] = "Bottom", t42[t42.Vertical = 9] = "Vertical", t42[t42.BottomOrLeft = 10] = "BottomOrLeft", t42[t42.VerticalOrLeft = 11] = "VerticalOrLeft", t42[t42.BottomOrRight = 12] = "BottomOrRight", t42[t42.VerticalOrRight = 13] = "VerticalOrRight", t42[t42.BottomOrHorizontal = 14] = "BottomOrHorizontal", t42[t42.All = 15] = "All";
}(t20 || (t20 = {}));

// node_modules/@cds/core/internal/utils/size.js
function o10(t42) {
  return ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"].indexOf(t42) > -1;
}
function r14(r26, x6) {
  if (!u(x6) || e(x6) || o10(x6))
    u3(r26, ["width", ""], ["height", ""]);
  else if (i(x6)) {
    const t42 = c4(parseInt(x6));
    u3(r26, ["width", t42], ["height", t42]);
  }
}

// node_modules/@cds/core/internal/index.js
var o27 = a5;

// node_modules/@cds/core/icon/icon.renderer.js
function n23(n25) {
  return n25;
}

// node_modules/@cds/core/icon/shapes/unknown.js
var n24 = "unknown";
var r23 = ["unknown", n23({ outline: '<circle class="cds-internal-dot-3" cx="31.1" cy="18" r="2.9"/><circle class="cds-internal-dot-2" cx="18" cy="18" r="2.9"/><circle class="cds-internal-dot-1" cx="4.9" cy="18" r="2.9"/>' })];

// node_modules/@cds/core/icon/icon.service.js
var r24 = class _r {
  static get registry() {
    return __spreadValues({ unknown: r23[1] }, i6.state.iconRegistry);
  }
  static addIcons(...e28) {
    i6.state.iconRegistry = __spreadValues(__spreadValues({}, i6.state.iconRegistry), Object.fromEntries(e28.filter(([t42]) => !_r.registry[t42])));
  }
  static addAliases(...e28) {
    const s22 = e28.filter(([t42]) => _r.registry[t42]).flatMap(([t42, e29]) => e29.map((e30) => [e30, _r.registry[t42]]));
    i6.state.iconRegistry = __spreadValues(__spreadValues({}, i6.state.iconRegistry), Object.fromEntries(s22));
  }
  static getIconNameFromShape(t42) {
    return t42[0];
  }
};

// node_modules/@lit/reactive-element/development/decorators/base.js
var decorateProperty = ({ finisher, descriptor }) => (protoOrDescriptor, name) => {
  var _a4;
  if (name !== void 0) {
    const ctor = protoOrDescriptor.constructor;
    if (descriptor !== void 0) {
      Object.defineProperty(protoOrDescriptor, name, descriptor(name));
    }
    finisher === null || finisher === void 0 ? void 0 : finisher(ctor, name);
  } else {
    const key = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_a4 = protoOrDescriptor.originalKey) !== null && _a4 !== void 0 ? _a4 : protoOrDescriptor.key
    );
    const info = descriptor != void 0 ? {
      kind: "method",
      placement: "prototype",
      key,
      descriptor: descriptor(protoOrDescriptor.key)
    } : __spreadProps(__spreadValues({}, protoOrDescriptor), { key });
    if (finisher != void 0) {
      info.finisher = function(ctor) {
        finisher(ctor, key);
      };
    }
    return info;
  }
};

// node_modules/@lit/reactive-element/development/decorators/query.js
function query(selector, cache) {
  return decorateProperty({
    descriptor: (name) => {
      const descriptor = {
        get() {
          var _a4, _b4;
          return (_b4 = (_a4 = this.renderRoot) === null || _a4 === void 0 ? void 0 : _a4.querySelector(selector)) !== null && _b4 !== void 0 ? _b4 : null;
        },
        enumerable: true,
        configurable: true
      };
      if (cache) {
        const key = typeof name === "symbol" ? Symbol() : `__${name}`;
        descriptor.get = function() {
          var _a4, _b4;
          if (this[key] === void 0) {
            this[key] = (_b4 = (_a4 = this.renderRoot) === null || _a4 === void 0 ? void 0 : _a4.querySelector(selector)) !== null && _b4 !== void 0 ? _b4 : null;
          }
          return this[key];
        };
      }
      return descriptor;
    }
  });
}

// node_modules/@cds/core/icon/icon.element.scss.js
var s20 = css`@keyframes fadeInAndOut{0%,to{opacity:0}75%{opacity:1}}:host{--color:currentColor;display:inline-block;height:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));margin:0;vertical-align:middle;fill:var(--color);color:var(--color);contain:strict;cursor:inherit}svg{display:block}:host([size*=xs]){height:var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20)))}:host([size*=sm]){height:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-7,calc(16 * 1rem / var(--cds-global-base,20)))}:host([size*=md]){height:var(--cds-global-space-9,calc(24 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-9,calc(24 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-9,calc(24 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-9,calc(24 * 1rem / var(--cds-global-base,20)))}:host([size*=lg]){height:var(--cds-global-space-11,calc(36 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-11,calc(36 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-11,calc(36 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-11,calc(36 * 1rem / var(--cds-global-base,20)))}:host([size*=xl]){height:var(--cds-global-space-12,calc(48 * 1rem / var(--cds-global-base,20)));width:var(--cds-global-space-12,calc(48 * 1rem / var(--cds-global-base,20)));min-height:var(--cds-global-space-12,calc(48 * 1rem / var(--cds-global-base,20)));min-width:var(--cds-global-space-12,calc(48 * 1rem / var(--cds-global-base,20)))}:host([size*=xxl]){height:calc(var(--cds-global-space-13,calc(64 * 1rem / var(--cds-global-base,20))) - var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20))));width:calc(var(--cds-global-space-13,calc(64 * 1rem / var(--cds-global-base,20))) - var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20))));min-height:calc(var(--cds-global-space-13,calc(64 * 1rem / var(--cds-global-base,20))) - var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20))));min-width:calc(var(--cds-global-space-13,calc(64 * 1rem / var(--cds-global-base,20))) - var(--cds-global-space-5,calc(8 * 1rem / var(--cds-global-base,20))))}:host([size*=fit]){height:auto;width:auto;contain:layout}:host([status=success]){--color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([status=danger]){--color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([status=warning]){--color:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500))}:host([status=info]){--color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))}:host([status=neutral]){--color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}:host([inverse]){--color:var(--cds-global-color-construction-200, #cbd4d8)}:host([direction=up]){transform:rotate(0)}:host([direction=down]){transform:rotate(180deg)}:host([direction=right]){transform:rotate(90deg)}:host([direction=left]){transform:rotate(270deg)}:host([flip=horizontal]){transform:scale(-1) rotateX(180deg)}:host([flip=vertical]){transform:scale(-1) rotateY(180deg)}.alert,.badge{fill:var(--badge-color,var(--cds-alias-status-danger,var(--cds-global-color-red-700,#e02200)))}:host([badge=success]){--badge-color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([badge=danger]){--badge-color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([badge*=warning]){--badge-color:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500))}:host([badge=inherit]){--badge-color:currentColor}:host([badge=info]){--badge-color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))}:host([badge=neutral]){--badge-color:var(--cds-alias-status-neutral, var(--cds-global-color-construction-600, #4f6169))}:host([badge=inherit-triangle]){--badge-color:currentColor}:host([badge][inverse]){--badge-color:var(--cds-alias-status-danger, var(--cds-global-color-red-700, #e02200))}:host([badge=success][inverse]){--badge-color:var(--cds-alias-status-success, var(--cds-global-color-green-700, #42810e))}:host([badge*=warning][inverse]){--badge-color:var(--cds-alias-status-warning-dark, var(--cds-global-color-ochre-800, #a36500))}:host([badge*=inherit][inverse]){--badge-color:currentColor}:host([badge=info][inverse]){--badge-color:var(--cds-alias-status-info, var(--cds-global-color-blue-700, #0079ad))}.cds-internal-dot-1{animation:fadeInAndOut 1.8s ease-in 0s infinite}.cds-internal-dot-2{animation:fadeInAndOut 1.8s ease-out .422s infinite}.cds-internal-dot-3{animation:fadeInAndOut 1.8s ease-out .675s infinite}@media (prefers-reduced-motion){.cds-internal-dot-1,.cds-internal-dot-2,.cds-internal-dot-3{animation:none}}`;

// node_modules/@cds/core/icon/utils/icon.classnames.js
var d10;
function c10(n25) {
  switch (true) {
    case e(n25):
      return d10.NilSizeValue;
    case o10(n25):
      return d10.ValidSizeString;
    case i(n25):
      return d10.ValidNumericString;
    default:
      return d10.BadSizeValue;
  }
}
function h8(i23) {
  return e(i23) ? "" : w(i23, "fit");
}
function s21(i23, e28) {
  return !r(i23) && i23.indexOf("fit") > -1 ? [["width", "auto"], ["height", "auto"], ["min-width", e28], ["min-height", e28]] : [["width", e28], ["height", e28], ["min-width", e28], ["min-height", e28]];
}
function S4(i23, e28) {
  let t42 = "";
  switch (c10(h8(e28))) {
    case d10.ValidNumericString:
      return t42 = c4(parseInt(e28)), void u3(i23, ...s21(e28, t42));
    case d10.ValidSizeString:
    case d10.NilSizeValue:
      return void a6(i23, "width", "height", "min-width", "min-height");
    case d10.BadSizeValue:
    default:
      return;
  }
}
!function(i23) {
  i23.BadSizeValue = "bad-value", i23.ValidSizeString = "value-is-string", i23.ValidNumericString = "value-is-numeric", i23.NilSizeValue = "value-is-nil";
}(d10 || (d10 = {}));

// node_modules/@cds/core/icon/utils/icon.svg-helpers.js
function i22(e28) {
  return e28.badge && ("inherit-triangle" === e28.badge || "warning-triangle" === e28.badge);
}
function r25(e28) {
  let r26 = "";
  return e28.badge && i22(e28) ? r26 = '<path d="M26.85 1.14L21.13 11a1.28 1.28 0 001.1 2h11.45a1.28 1.28 0 001.1-2l-5.72-9.86a1.28 1.28 0 00-2.21 0z" class="alert" />' : e28.badge && (r26 = '<circle cx="30" cy="6" r="5" class="badge" />'), r26;
}
function t41(r26) {
  const t42 = r24.registry[r26.shape] ?? r24.registry.unknown;
  let n25 = r26.solid && t42.solid ? t42.solid : t42.outline;
  return r26.badge && !i22(r26) && (n25 = r26.solid ? t42.solidBadged ?? n25 : t42.outlineBadged ?? n25), i22(r26) && (n25 = r26.solid ? t42.solidAlerted ?? n25 : t42.outlineAlerted ?? n25), n25;
}

// node_modules/@cds/core/icon/icon.element.js
var v5 = class extends LitElement {
  constructor() {
    super(...arguments);
    this._shape = "unknown", this.solid = false, this.inverse = false;
  }
  static get styles() {
    return [o27, s20];
  }
  get shape() {
    return this._shape;
  }
  set shape(t42) {
    if (h(t42, this._shape)) {
      const s22 = this._shape;
      this._shape = t42, this.requestUpdate("shape", s22);
    }
  }
  get size() {
    return this._size;
  }
  set size(t42) {
    if (d(t42, this._size)) {
      const s22 = this._size;
      this._size = t42, S4(this, t42), this.requestUpdate("size", s22);
    }
  }
  updated(t42) {
    if (t42.has("innerOffset") && this.innerOffset > 0) {
      const t43 = c4(-1 * this.innerOffset), s22 = `calc(100% + ${c4(2 * this.innerOffset)})`;
      this.svg.style.width = s22, this.svg.style.height = s22, this.svg.style.margin = `${t43} 0 0 ${t43}`;
    }
  }
  firstUpdated(t42) {
    if (super.firstUpdated(t42), this.isConnected) {
      let t43 = "unknown";
      this.subscription = i6.stateUpdates.subscribe((s22) => {
        "iconRegistry" === s22.key && r24.registry[this.shape] && t43 !== this.shape && (t43 = this.shape, this.requestUpdate("shape"));
      });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.subscription?.unsubscribe();
  }
  render() {
    return u(r24.registry[this.shape]) ? html`<span .innerHTML="${r24.registry[this.shape]}"></span>` : svg`<svg .innerHTML="${t41(this) + r25(this)}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>`;
  }
};
__decorate([m2({ type: String })], v5.prototype, "shape", null), __decorate([m2({ type: String })], v5.prototype, "size", null), __decorate([m2({ type: String })], v5.prototype, "direction", void 0), __decorate([m2({ type: String })], v5.prototype, "flip", void 0), __decorate([m2({ type: Boolean })], v5.prototype, "solid", void 0), __decorate([m2({ type: String })], v5.prototype, "status", void 0), __decorate([m2({ type: Boolean })], v5.prototype, "inverse", void 0), __decorate([m2({ type: String })], v5.prototype, "badge", void 0), __decorate([p2({ type: Number })], v5.prototype, "innerOffset", void 0), __decorate([query("svg")], v5.prototype, "svg", void 0);

export {
  css,
  html,
  LitElement,
  e,
  d,
  n3 as n,
  b2 as b,
  m2 as m,
  p2 as p,
  m3 as m2,
  w3 as w,
  a11 as a,
  o9 as o,
  r14 as r,
  o27 as o2,
  n23 as n2,
  n24 as n3,
  r23 as r2,
  r24 as r3,
  v5 as v
};
/*! Bundled license information:

@lit/reactive-element/development/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/development/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/development/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=chunk-V5D7J42Y.js.map
