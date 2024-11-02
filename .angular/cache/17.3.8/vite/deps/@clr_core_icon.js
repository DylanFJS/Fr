import {
  __decorate
} from "./chunk-NCOMLVU7.js";
import {
  __async
} from "./chunk-WKYGNSYM.js";

// node_modules/@clr/core/node_modules/lit-html/lib/dom.js
var isCEPolyfill = typeof window !== "undefined" && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== void 0;
var removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

// node_modules/@clr/core/node_modules/lit-html/lib/template.js
var marker = `{{lit-${String(Math.random()).slice(2)}}}`;
var nodeMarker = `<!--${marker}-->`;
var markerRegex = new RegExp(`${marker}|${nodeMarker}`);
var boundAttributeSuffix = "$lit$";
var Template = class {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = [];
    const walker = document.createTreeWalker(element.content, 133, null, false);
    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const { strings, values: { length } } = result;
    while (partIndex < length) {
      const node = walker.nextNode();
      if (node === null) {
        walker.currentNode = stack.pop();
        continue;
      }
      index++;
      if (node.nodeType === 1) {
        if (node.hasAttributes()) {
          const attributes = node.attributes;
          const { length: length2 } = attributes;
          let count = 0;
          for (let i = 0; i < length2; i++) {
            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
              count++;
            }
          }
          while (count-- > 0) {
            const stringForPart = strings[partIndex];
            const name = lastAttributeNameRegex.exec(stringForPart)[2];
            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
            const attributeValue = node.getAttribute(attributeLookupName);
            node.removeAttribute(attributeLookupName);
            const statics = attributeValue.split(markerRegex);
            this.parts.push({ type: "attribute", index, name, strings: statics });
            partIndex += statics.length - 1;
          }
        }
        if (node.tagName === "TEMPLATE") {
          stack.push(node);
          walker.currentNode = node.content;
        }
      } else if (node.nodeType === 3) {
        const data = node.data;
        if (data.indexOf(marker) >= 0) {
          const parent = node.parentNode;
          const strings2 = data.split(markerRegex);
          const lastIndex = strings2.length - 1;
          for (let i = 0; i < lastIndex; i++) {
            let insert;
            let s = strings2[i];
            if (s === "") {
              insert = createMarker();
            } else {
              const match = lastAttributeNameRegex.exec(s);
              if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
              }
              insert = document.createTextNode(s);
            }
            parent.insertBefore(insert, node);
            this.parts.push({ type: "node", index: ++index });
          }
          if (strings2[lastIndex] === "") {
            parent.insertBefore(createMarker(), node);
            nodesToRemove.push(node);
          } else {
            node.data = strings2[lastIndex];
          }
          partIndex += lastIndex;
        }
      } else if (node.nodeType === 8) {
        if (node.data === marker) {
          const parent = node.parentNode;
          if (node.previousSibling === null || index === lastPartIndex) {
            index++;
            parent.insertBefore(createMarker(), node);
          }
          lastPartIndex = index;
          this.parts.push({ type: "node", index });
          if (node.nextSibling === null) {
            node.data = "";
          } else {
            nodesToRemove.push(node);
            index--;
          }
          partIndex++;
        } else {
          let i = -1;
          while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
            this.parts.push({ type: "node", index: -1 });
            partIndex++;
          }
        }
      }
    }
    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }
};
var endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};
var isTemplatePartActive = (part) => part.index !== -1;
var createMarker = () => document.createComment("");
var lastAttributeNameRegex = (
  // eslint-disable-next-line no-control-regex
  /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/
);

// node_modules/@clr/core/node_modules/lit-html/lib/modify-template.js
var walkerNodeFilter = 133;
function removeNodesFromTemplate(template, nodesToRemove) {
  const { element: { content }, parts: parts2 } = template;
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts2);
  let part = parts2[partIndex];
  let nodeIndex = -1;
  let removeCount = 0;
  const nodesToRemoveInTemplate = [];
  let currentRemovingNode = null;
  while (walker.nextNode()) {
    nodeIndex++;
    const node = walker.currentNode;
    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    }
    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node);
      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    }
    if (currentRemovingNode !== null) {
      removeCount++;
    }
    while (part !== void 0 && part.index === nodeIndex) {
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
      partIndex = nextActiveIndexInTemplateParts(parts2, partIndex);
      part = parts2[partIndex];
    }
  }
  nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
var countNodes = (node) => {
  let count = node.nodeType === 11 ? 0 : 1;
  const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
  while (walker.nextNode()) {
    count++;
  }
  return count;
};
var nextActiveIndexInTemplateParts = (parts2, startIndex = -1) => {
  for (let i = startIndex + 1; i < parts2.length; i++) {
    const part = parts2[i];
    if (isTemplatePartActive(part)) {
      return i;
    }
  }
  return -1;
};
function insertNodeIntoTemplate(template, node, refNode = null) {
  const { element: { content }, parts: parts2 } = template;
  if (refNode === null || refNode === void 0) {
    content.appendChild(node);
    return;
  }
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts2);
  let insertCount = 0;
  let walkerIndex = -1;
  while (walker.nextNode()) {
    walkerIndex++;
    const walkerNode = walker.currentNode;
    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }
    while (partIndex !== -1 && parts2[partIndex].index === walkerIndex) {
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts2[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts2, partIndex);
        }
        return;
      }
      partIndex = nextActiveIndexInTemplateParts(parts2, partIndex);
    }
  }
}

// node_modules/@clr/core/node_modules/lit-html/lib/directive.js
var directives = /* @__PURE__ */ new WeakMap();
var directive = (f) => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};
var isDirective = (o) => {
  return typeof o === "function" && directives.has(o);
};

// node_modules/@clr/core/node_modules/lit-html/lib/part.js
var noChange = {};
var nothing = {};

// node_modules/@clr/core/node_modules/lit-html/lib/template-instance.js
var TemplateInstance = class {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }
  update(values) {
    let i = 0;
    for (const part of this.__parts) {
      if (part !== void 0) {
        part.setValue(values[i]);
      }
      i++;
    }
    for (const part of this.__parts) {
      if (part !== void 0) {
        part.commit();
      }
    }
  }
  _clone() {
    const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts2 = this.template.parts;
    const walker = document.createTreeWalker(fragment, 133, null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode();
    while (partIndex < parts2.length) {
      part = parts2[partIndex];
      if (!isTemplatePartActive(part)) {
        this.__parts.push(void 0);
        partIndex++;
        continue;
      }
      while (nodeIndex < part.index) {
        nodeIndex++;
        if (node.nodeName === "TEMPLATE") {
          stack.push(node);
          walker.currentNode = node.content;
        }
        if ((node = walker.nextNode()) === null) {
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      }
      if (part.type === "node") {
        const part2 = this.processor.handleTextExpression(this.options);
        part2.insertAfterNode(node.previousSibling);
        this.__parts.push(part2);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }
      partIndex++;
    }
    if (isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }
    return fragment;
  }
};

// node_modules/@clr/core/node_modules/lit-html/lib/template-result.js
var policy = window.trustedTypes && trustedTypes.createPolicy("lit-html", { createHTML: (s) => s });
var commentMarker = ` ${marker} `;
var TemplateResult = class {
  constructor(strings, values, type3, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type3;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */
  getHTML() {
    const l = this.strings.length - 1;
    let html2 = "";
    let isCommentBinding = false;
    for (let i = 0; i < l; i++) {
      const s = this.strings[i];
      const commentOpen = s.lastIndexOf("<!--");
      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf("-->", commentOpen + 1) === -1;
      const attributeMatch = lastAttributeNameRegex.exec(s);
      if (attributeMatch === null) {
        html2 += s + (isCommentBinding ? commentMarker : nodeMarker);
      } else {
        html2 += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
      }
    }
    html2 += this.strings[l];
    return html2;
  }
  getTemplateElement() {
    const template = document.createElement("template");
    let value = this.getHTML();
    if (policy !== void 0) {
      value = policy.createHTML(value);
    }
    template.innerHTML = value;
    return template;
  }
};

// node_modules/@clr/core/node_modules/lit-html/lib/parts.js
var isPrimitive = (value) => {
  return value === null || !(typeof value === "object" || typeof value === "function");
};
var isIterable = (value) => {
  return Array.isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  !!(value && value[Symbol.iterator]);
};
var AttributeCommitter = class {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];
    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */
  _createPart() {
    return new AttributePart(this);
  }
  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    const parts2 = this.parts;
    if (l === 1 && strings[0] === "" && strings[1] === "") {
      const v = parts2[0].value;
      if (typeof v === "symbol") {
        return String(v);
      }
      if (typeof v === "string" || !isIterable(v)) {
        return v;
      }
    }
    let text = "";
    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = parts2[i];
      if (part !== void 0) {
        const v = part.value;
        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === "string" ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === "string" ? t : String(t);
          }
        }
      }
    }
    text += strings[l];
    return text;
  }
  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }
};
var AttributePart = class {
  constructor(committer) {
    this.value = void 0;
    this.committer = committer;
  }
  setValue(value) {
    if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value;
      if (!isDirective(value)) {
        this.committer.dirty = true;
      }
    }
  }
  commit() {
    while (isDirective(this.value)) {
      const directive2 = this.value;
      this.value = noChange;
      directive2(this);
    }
    if (this.value === noChange) {
      return;
    }
    this.committer.commit();
  }
};
var NodePart = class _NodePart {
  constructor(options) {
    this.value = void 0;
    this.__pendingValue = void 0;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  appendInto(container) {
    this.startNode = container.appendChild(createMarker());
    this.endNode = container.appendChild(createMarker());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  appendIntoPart(part) {
    part.__insert(this.startNode = createMarker());
    part.__insert(this.endNode = createMarker());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  insertAfterPart(ref) {
    ref.__insert(this.startNode = createMarker());
    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }
  setValue(value) {
    this.__pendingValue = value;
  }
  commit() {
    if (this.startNode.parentNode === null) {
      return;
    }
    while (isDirective(this.__pendingValue)) {
      const directive2 = this.__pendingValue;
      this.__pendingValue = noChange;
      directive2(this);
    }
    const value = this.__pendingValue;
    if (value === noChange) {
      return;
    }
    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === nothing) {
      this.value = nothing;
      this.clear();
    } else {
      this.__commitText(value);
    }
  }
  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }
  __commitNode(value) {
    if (this.value === value) {
      return;
    }
    this.clear();
    this.__insert(value);
    this.value = value;
  }
  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? "" : value;
    const valueAsString = typeof value === "string" ? value : String(value);
    if (node === this.endNode.previousSibling && node.nodeType === 3) {
      node.data = valueAsString;
    } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }
    this.value = value;
  }
  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);
    if (this.value instanceof TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      const instance = new TemplateInstance(template, value.processor, this.options);
      const fragment = instance._clone();
      instance.update(value.values);
      this.__commitNode(fragment);
      this.value = instance;
    }
  }
  __commitIterable(value) {
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    }
    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      itemPart = itemParts[partIndex];
      if (itemPart === void 0) {
        itemPart = new _NodePart(this.options);
        itemParts.push(itemPart);
        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }
      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }
  clear(startNode = this.startNode) {
    removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }
};
var BooleanAttributePart = class {
  constructor(element, name, strings) {
    this.value = void 0;
    this.__pendingValue = void 0;
    if (strings.length !== 2 || strings[0] !== "" || strings[1] !== "") {
      throw new Error("Boolean attributes can only contain a single expression");
    }
    this.element = element;
    this.name = name;
    this.strings = strings;
  }
  setValue(value) {
    this.__pendingValue = value;
  }
  commit() {
    while (isDirective(this.__pendingValue)) {
      const directive2 = this.__pendingValue;
      this.__pendingValue = noChange;
      directive2(this);
    }
    if (this.__pendingValue === noChange) {
      return;
    }
    const value = !!this.__pendingValue;
    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, "");
      } else {
        this.element.removeAttribute(this.name);
      }
      this.value = value;
    }
    this.__pendingValue = noChange;
  }
};
var PropertyCommitter = class extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === "" && strings[1] === "";
  }
  _createPart() {
    return new PropertyPart(this);
  }
  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }
    return super._getValue();
  }
  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element[this.name] = this._getValue();
    }
  }
};
var PropertyPart = class extends AttributePart {
};
var eventOptionsSupported = false;
(() => {
  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }
    };
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (_e) {
  }
})();
var EventPart = class {
  constructor(element, eventName, eventContext) {
    this.value = void 0;
    this.__pendingValue = void 0;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;
    this.__boundHandleEvent = (e) => this.handleEvent(e);
  }
  setValue(value) {
    this.__pendingValue = value;
  }
  commit() {
    while (isDirective(this.__pendingValue)) {
      const directive2 = this.__pendingValue;
      this.__pendingValue = noChange;
      directive2(this);
    }
    if (this.__pendingValue === noChange) {
      return;
    }
    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }
    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }
    this.value = newListener;
    this.__pendingValue = noChange;
  }
  handleEvent(event) {
    if (typeof this.value === "function") {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }
};
var getOptions = (o) => o && (eventOptionsSupported ? { capture: o.capture, passive: o.passive, once: o.once } : o.capture);

// node_modules/@clr/core/node_modules/lit-html/lib/template-factory.js
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);
  if (templateCache === void 0) {
    templateCache = {
      stringsArray: /* @__PURE__ */ new WeakMap(),
      keyString: /* @__PURE__ */ new Map()
    };
    templateCaches.set(result.type, templateCache);
  }
  let template = templateCache.stringsArray.get(result.strings);
  if (template !== void 0) {
    return template;
  }
  const key = result.strings.join(marker);
  template = templateCache.keyString.get(key);
  if (template === void 0) {
    template = new Template(result, result.getTemplateElement());
    templateCache.keyString.set(key, template);
  }
  templateCache.stringsArray.set(result.strings, template);
  return template;
}
var templateCaches = /* @__PURE__ */ new Map();

// node_modules/@clr/core/node_modules/lit-html/lib/render.js
var parts = /* @__PURE__ */ new WeakMap();
var render = (result, container, options) => {
  let part = parts.get(container);
  if (part === void 0) {
    removeNodes(container, container.firstChild);
    parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
    part.appendInto(container);
  }
  part.setValue(result);
  part.commit();
};

// node_modules/@clr/core/node_modules/lit-html/lib/default-template-processor.js
var DefaultTemplateProcessor = class {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];
    if (prefix === ".") {
      const committer2 = new PropertyCommitter(element, name.slice(1), strings);
      return committer2.parts;
    }
    if (prefix === "@") {
      return [new EventPart(element, name.slice(1), options.eventContext)];
    }
    if (prefix === "?") {
      return [new BooleanAttributePart(element, name.slice(1), strings)];
    }
    const committer = new AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */
  handleTextExpression(options) {
    return new NodePart(options);
  }
};
var defaultTemplateProcessor = new DefaultTemplateProcessor();

// node_modules/@clr/core/node_modules/lit-html/lit-html.js
if (typeof window !== "undefined") {
  (window["litHtmlVersions"] || (window["litHtmlVersions"] = [])).push("1.4.1");
}
var html = (strings, ...values) => new TemplateResult(strings, values, "html", defaultTemplateProcessor);

// node_modules/@clr/core/node_modules/lit-html/lib/shady-render.js
var getTemplateCacheKey = (type3, scopeName) => `${type3}--${scopeName}`;
var compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === "undefined") {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === "undefined") {
  console.warn(`Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.`);
  compatibleShadyCSSVersion = false;
}
var shadyTemplateFactory = (scopeName) => (result) => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);
  let templateCache = templateCaches.get(cacheKey);
  if (templateCache === void 0) {
    templateCache = {
      stringsArray: /* @__PURE__ */ new WeakMap(),
      keyString: /* @__PURE__ */ new Map()
    };
    templateCaches.set(cacheKey, templateCache);
  }
  let template = templateCache.stringsArray.get(result.strings);
  if (template !== void 0) {
    return template;
  }
  const key = result.strings.join(marker);
  template = templateCache.keyString.get(key);
  if (template === void 0) {
    const element = result.getTemplateElement();
    if (compatibleShadyCSSVersion) {
      window.ShadyCSS.prepareTemplateDom(element, scopeName);
    }
    template = new Template(result, element);
    templateCache.keyString.set(key, template);
  }
  templateCache.stringsArray.set(result.strings, template);
  return template;
};
var TEMPLATE_TYPES = ["html", "svg"];
var removeStylesFromLitTemplates = (scopeName) => {
  TEMPLATE_TYPES.forEach((type3) => {
    const templates = templateCaches.get(getTemplateCacheKey(type3, scopeName));
    if (templates !== void 0) {
      templates.keyString.forEach((template) => {
        const { element: { content } } = template;
        const styles3 = /* @__PURE__ */ new Set();
        Array.from(content.querySelectorAll("style")).forEach((s) => {
          styles3.add(s);
        });
        removeNodesFromTemplate(template, styles3);
      });
    }
  });
};
var shadyRenderSet = /* @__PURE__ */ new Set();
var prepareTemplateStyles = (scopeName, renderedDOM, template) => {
  shadyRenderSet.add(scopeName);
  const templateElement = !!template ? template.element : document.createElement("template");
  const styles3 = renderedDOM.querySelectorAll("style");
  const { length } = styles3;
  if (length === 0) {
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    return;
  }
  const condensedStyle = document.createElement("style");
  for (let i = 0; i < length; i++) {
    const style2 = styles3[i];
    style2.parentNode.removeChild(style2);
    condensedStyle.textContent += style2.textContent;
  }
  removeStylesFromLitTemplates(scopeName);
  const content = templateElement.content;
  if (!!template) {
    insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
  } else {
    content.insertBefore(condensedStyle, content.firstChild);
  }
  window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
  const style = content.querySelector("style");
  if (window.ShadyCSS.nativeShadow && style !== null) {
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else if (!!template) {
    content.insertBefore(condensedStyle, content.firstChild);
    const removes = /* @__PURE__ */ new Set();
    removes.add(condensedStyle);
    removeNodesFromTemplate(template, removes);
  }
};
var render2 = (result, container, options) => {
  if (!options || typeof options !== "object" || !options.scopeName) {
    throw new Error("The `scopeName` option is required.");
  }
  const scopeName = options.scopeName;
  const hasRendered = parts.has(container);
  const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11 && !!container.host;
  const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
  const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
  render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
  if (firstScopeRender) {
    const part = parts.get(renderContainer);
    parts.delete(renderContainer);
    const template = part.value instanceof TemplateInstance ? part.value.template : void 0;
    prepareTemplateStyles(scopeName, renderContainer, template);
    removeNodes(container, container.firstChild);
    container.appendChild(renderContainer);
    parts.set(container, part);
  }
  if (!hasRendered && needsScoping) {
    window.ShadyCSS.styleElement(container.host);
  }
};

// node_modules/@clr/core/node_modules/lit-element/lib/updating-element.js
var _a;
window.JSCompiler_renameProperty = (prop3, _obj) => prop3;
var defaultConverter = {
  toAttribute(value, type3) {
    switch (type3) {
      case Boolean:
        return value ? "" : null;
      case Object:
      case Array:
        return value == null ? value : JSON.stringify(value);
    }
    return value;
  },
  fromAttribute(value, type3) {
    switch (type3) {
      case Boolean:
        return value !== null;
      case Number:
        return value === null ? null : Number(value);
      case Object:
      case Array:
        return JSON.parse(value);
    }
    return value;
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
var STATE_HAS_UPDATED = 1;
var STATE_UPDATE_REQUESTED = 1 << 2;
var STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
var STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
var finalized = "finalized";
var UpdatingElement = class extends HTMLElement {
  constructor() {
    super();
    this.initialize();
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   */
  static get observedAttributes() {
    this.finalize();
    const attributes = [];
    this._classProperties.forEach((v, p) => {
      const attr = this._attributeNameForProperty(p, v);
      if (attr !== void 0) {
        this._attributeToPropertyMap.set(attr, p);
        attributes.push(attr);
      }
    });
    return attributes;
  }
  /**
   * Ensures the private `_classProperties` property metadata is created.
   * In addition to `finalize` this is also called in `createProperty` to
   * ensure the `@property` decorator can add property metadata.
   */
  /** @nocollapse */
  static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
      this._classProperties = /* @__PURE__ */ new Map();
      const superProperties = Object.getPrototypeOf(this)._classProperties;
      if (superProperties !== void 0) {
        superProperties.forEach((v, k) => this._classProperties.set(k, v));
      }
    }
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a PropertyDeclaration for the property with the given options.
   * The property setter calls the property's `hasChanged` property option
   * or uses a strict identity check to determine whether or not to request
   * an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   *
   * @nocollapse
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    this._ensureClassProperties();
    this._classProperties.set(name, options);
    if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
      return;
    }
    const key = typeof name === "symbol" ? Symbol() : `__${name}`;
    const descriptor = this.getPropertyDescriptor(name, key, options);
    if (descriptor !== void 0) {
      Object.defineProperty(this.prototype, name, descriptor);
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   *   class MyElement extends LitElement {
   *     static getPropertyDescriptor(name, key, options) {
   *       const defaultDescriptor =
   *           super.getPropertyDescriptor(name, key, options);
   *       const setter = defaultDescriptor.set;
   *       return {
   *         get: defaultDescriptor.get,
   *         set(value) {
   *           setter.call(this, value);
   *           // custom action.
   *         },
   *         configurable: true,
   *         enumerable: true
   *       }
   *     }
   *   }
   *
   * @nocollapse
   */
  static getPropertyDescriptor(name, key, options) {
    return {
      // tslint:disable-next-line:no-any no symbol in index
      get() {
        return this[key];
      },
      set(value) {
        const oldValue = this[name];
        this[key] = value;
        this.requestUpdateInternal(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a PropertyDeclaration via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override `createProperty`.
   *
   * @nocollapse
   * @final
   */
  static getPropertyOptions(name) {
    return this._classProperties && this._classProperties.get(name) || defaultPropertyDeclaration;
  }
  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   * @nocollapse
   */
  static finalize() {
    const superCtor = Object.getPrototypeOf(this);
    if (!superCtor.hasOwnProperty(finalized)) {
      superCtor.finalize();
    }
    this[finalized] = true;
    this._ensureClassProperties();
    this._attributeToPropertyMap = /* @__PURE__ */ new Map();
    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;
      const propKeys = [
        ...Object.getOwnPropertyNames(props),
        ...typeof Object.getOwnPropertySymbols === "function" ? Object.getOwnPropertySymbols(props) : []
      ];
      for (const p of propKeys) {
        this.createProperty(p, props[p]);
      }
    }
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static _attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   * @nocollapse
   */
  static _valueHasChanged(value, old, hasChanged = notEqual) {
    return hasChanged(value, old);
  }
  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's
   * `converter` or `converter.fromAttribute` property option.
   * @nocollapse
   */
  static _propertyValueFromAttribute(value, options) {
    const type3 = options.type;
    const converter = options.converter || defaultConverter;
    const fromAttribute = typeof converter === "function" ? converter : converter.fromAttribute;
    return fromAttribute ? fromAttribute(value, type3) : value;
  }
  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   * @nocollapse
   */
  static _propertyValueToAttribute(value, options) {
    if (options.reflect === void 0) {
      return;
    }
    const type3 = options.type;
    const converter = options.converter;
    const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
    return toAttribute(value, type3);
  }
  /**
   * Performs element initialization. By default captures any pre-set values for
   * registered properties.
   */
  initialize() {
    this._updateState = 0;
    this._updatePromise = new Promise((res) => this._enableUpdatingResolver = res);
    this._changedProperties = /* @__PURE__ */ new Map();
    this._saveInstanceProperties();
    this.requestUpdateInternal();
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
  _saveInstanceProperties() {
    this.constructor._classProperties.forEach((_v, p) => {
      if (this.hasOwnProperty(p)) {
        const value = this[p];
        delete this[p];
        if (!this._instanceProperties) {
          this._instanceProperties = /* @__PURE__ */ new Map();
        }
        this._instanceProperties.set(p, value);
      }
    });
  }
  /**
   * Applies previously saved instance properties.
   */
  _applyInstanceProperties() {
    this._instanceProperties.forEach((v, p) => this[p] = v);
    this._instanceProperties = void 0;
  }
  connectedCallback() {
    this.enableUpdating();
  }
  enableUpdating() {
    if (this._enableUpdatingResolver !== void 0) {
      this._enableUpdatingResolver();
      this._enableUpdatingResolver = void 0;
    }
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */
  disconnectedCallback() {
  }
  /**
   * Synchronizes property values when attributes change.
   */
  attributeChangedCallback(name, old, value) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }
  _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    const ctor = this.constructor;
    const attr = ctor._attributeNameForProperty(name, options);
    if (attr !== void 0) {
      const attrValue = ctor._propertyValueToAttribute(value, options);
      if (attrValue === void 0) {
        return;
      }
      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
    }
  }
  _attributeToProperty(name, value) {
    if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
      return;
    }
    const ctor = this.constructor;
    const propName = ctor._attributeToPropertyMap.get(name);
    if (propName !== void 0) {
      const options = ctor.getPropertyOptions(propName);
      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
      this[propName] = // tslint:disable-next-line:no-any
      ctor._propertyValueFromAttribute(value, options);
      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    }
  }
  /**
   * This protected version of `requestUpdate` does not access or return the
   * `updateComplete` promise. This promise can be overridden and is therefore
   * not free to access.
   */
  requestUpdateInternal(name, oldValue, options) {
    let shouldRequestUpdate = true;
    if (name !== void 0) {
      const ctor = this.constructor;
      options = options || ctor.getPropertyOptions(name);
      if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
        if (!this._changedProperties.has(name)) {
          this._changedProperties.set(name, oldValue);
        }
        if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
          if (this._reflectingProperties === void 0) {
            this._reflectingProperties = /* @__PURE__ */ new Map();
          }
          this._reflectingProperties.set(name, options);
        }
      } else {
        shouldRequestUpdate = false;
      }
    }
    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._updatePromise = this._enqueueUpdate();
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should
   * be called when an element should update based on some state not triggered
   * by setting a property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored. Returns the `updateComplete` Promise which is resolved
   * when the update completes.
   *
   * @param name {PropertyKey} (optional) name of requesting property
   * @param oldValue {any} (optional) old value of requesting property
   * @returns {Promise} A Promise that is resolved when the update completes.
   */
  requestUpdate(name, oldValue) {
    this.requestUpdateInternal(name, oldValue);
    return this.updateComplete;
  }
  /**
   * Sets up the element to asynchronously update.
   */
  _enqueueUpdate() {
    return __async(this, null, function* () {
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      try {
        yield this._updatePromise;
      } catch (e) {
      }
      const result = this.performUpdate();
      if (result != null) {
        yield result;
      }
      return !this._hasRequestedUpdate;
    });
  }
  get _hasRequestedUpdate() {
    return this._updateState & STATE_UPDATE_REQUESTED;
  }
  get hasUpdated() {
    return this._updateState & STATE_HAS_UPDATED;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * You can override this method to change the timing of updates. If this
   * method is overridden, `super.performUpdate()` must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```
   * protected async performUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.performUpdate();
   * }
   * ```
   */
  performUpdate() {
    if (!this._hasRequestedUpdate) {
      return;
    }
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }
    let shouldUpdate = false;
    const changedProperties = this._changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.update(changedProperties);
      } else {
        this._markUpdated();
      }
    } catch (e) {
      shouldUpdate = false;
      this._markUpdated();
      throw e;
    }
    if (shouldUpdate) {
      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }
      this.updated(changedProperties);
    }
  }
  _markUpdated() {
    this._changedProperties = /* @__PURE__ */ new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `_getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super._getUpdateComplete()`, then any subsequent state.
   *
   * @returns {Promise} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */
  get updateComplete() {
    return this._getUpdateComplete();
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
   *   class MyElement extends LitElement {
   *     async _getUpdateComplete() {
   *       await super._getUpdateComplete();
   *       await this._myChild.updateComplete;
   *     }
   *   }
   * @deprecated Override `getUpdateComplete()` instead for forward
   *     compatibility with `lit-element` 3.0 / `@lit/reactive-element`.
   */
  _getUpdateComplete() {
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
   *   class MyElement extends LitElement {
   *     async getUpdateComplete() {
   *       await super.getUpdateComplete();
   *       await this._myChild.updateComplete;
   *     }
   *   }
   */
  getUpdateComplete() {
    return this._updatePromise;
  }
  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
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
   */
  update(_changedProperties) {
    if (this._reflectingProperties !== void 0 && this._reflectingProperties.size > 0) {
      this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
      this._reflectingProperties = void 0;
    }
    this._markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   */
  firstUpdated(_changedProperties) {
  }
};
_a = finalized;
UpdatingElement[_a] = true;

// node_modules/@clr/core/node_modules/lit-element/lib/decorators.js
var standardProperty = (options, element) => {
  if (element.kind === "method" && element.descriptor && !("value" in element.descriptor)) {
    return Object.assign(Object.assign({}, element), { finisher(clazz) {
      clazz.createProperty(element.key, options);
    } });
  } else {
    return {
      kind: "field",
      key: Symbol(),
      placement: "own",
      descriptor: {},
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
function query(selector, cache) {
  return (protoOrDescriptor, name) => {
    const descriptor = {
      get() {
        return this.renderRoot.querySelector(selector);
      },
      enumerable: true,
      configurable: true
    };
    if (cache) {
      const prop3 = name !== void 0 ? name : protoOrDescriptor.key;
      const key = typeof prop3 === "symbol" ? Symbol() : `__${prop3}`;
      descriptor.get = function() {
        if (this[key] === void 0) {
          this[key] = this.renderRoot.querySelector(selector);
        }
        return this[key];
      };
    }
    return name !== void 0 ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
  };
}
var legacyQuery = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};
var standardQuery = (descriptor, element) => ({
  kind: "method",
  placement: "prototype",
  key: element.key,
  descriptor
});
var ElementProto = Element.prototype;
var legacyMatches = ElementProto.msMatchesSelector || ElementProto.webkitMatchesSelector;

// node_modules/@clr/core/node_modules/lit-element/lib/css-tag.js
var supportsAdoptingStyleSheets = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = Symbol();
var CSSResult = class {
  constructor(cssText, safeToken) {
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
  }
  // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.
  get styleSheet() {
    if (this._styleSheet === void 0) {
      if (supportsAdoptingStyleSheets) {
        this._styleSheet = new CSSStyleSheet();
        this._styleSheet.replaceSync(this.cssText);
      } else {
        this._styleSheet = null;
      }
    }
    return this._styleSheet;
  }
  toString() {
    return this.cssText;
  }
};
var unsafeCSS = (value) => {
  return new CSSResult(String(value), constructionToken);
};
var textFromCSSResult = (value) => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else if (typeof value === "number") {
    return value;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
  }
};
var css = (strings, ...values) => {
  const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText, constructionToken);
};

// node_modules/@clr/core/node_modules/lit-element/lit-element.js
(window["litElementVersions"] || (window["litElementVersions"] = [])).push("2.5.1");
var renderNotImplemented = {};
var LitElement = class extends UpdatingElement {
  /**
   * Return the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * @nocollapse
   */
  static getStyles() {
    return this.styles;
  }
  /** @nocollapse */
  static _getUniqueStyles() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("_styles", this))) {
      return;
    }
    const userStyles = this.getStyles();
    if (Array.isArray(userStyles)) {
      const addStyles = (styles4, set2) => styles4.reduceRight((set3, s) => (
        // Note: On IE set.add() does not return the set
        Array.isArray(s) ? addStyles(s, set3) : (set3.add(s), set3)
      ), set2);
      const set = addStyles(userStyles, /* @__PURE__ */ new Set());
      const styles3 = [];
      set.forEach((v) => styles3.unshift(v));
      this._styles = styles3;
    } else {
      this._styles = userStyles === void 0 ? [] : [userStyles];
    }
    this._styles = this._styles.map((s) => {
      if (s instanceof CSSStyleSheet && !supportsAdoptingStyleSheets) {
        const cssText = Array.prototype.slice.call(s.cssRules).reduce((css2, rule) => css2 + rule.cssText, "");
        return unsafeCSS(cssText);
      }
      return s;
    });
  }
  /**
   * Performs element initialization. By default this calls
   * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
   * captures any pre-set values for registered properties.
   */
  initialize() {
    super.initialize();
    this.constructor._getUniqueStyles();
    this.renderRoot = this.createRenderRoot();
    if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
      this.adoptStyles();
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */
  createRenderRoot() {
    return this.attachShadow(this.constructor.shadowRootOptions);
  }
  /**
   * Applies styling to the element shadowRoot using the [[`styles`]]
   * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
   * available and will fallback otherwise. When Shadow DOM is polyfilled,
   * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
   * is available but `adoptedStyleSheets` is not, styles are appended to the
   * end of the `shadowRoot` to [mimic spec
   * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
   */
  adoptStyles() {
    const styles3 = this.constructor._styles;
    if (styles3.length === 0) {
      return;
    }
    if (window.ShadyCSS !== void 0 && !window.ShadyCSS.nativeShadow) {
      window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles3.map((s) => s.cssText), this.localName);
    } else if (supportsAdoptingStyleSheets) {
      this.renderRoot.adoptedStyleSheets = styles3.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    } else {
      this._needsShimAdoptedStyleSheets = true;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated && window.ShadyCSS !== void 0) {
      window.ShadyCSS.styleElement(this);
    }
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param _changedProperties Map of changed properties with old values
   */
  update(changedProperties) {
    const templateResult = this.render();
    super.update(changedProperties);
    if (templateResult !== renderNotImplemented) {
      this.constructor.render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
    }
    if (this._needsShimAdoptedStyleSheets) {
      this._needsShimAdoptedStyleSheets = false;
      this.constructor._styles.forEach((s) => {
        const style = document.createElement("style");
        style.textContent = s.cssText;
        this.renderRoot.appendChild(style);
      });
    }
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `NodePart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   */
  render() {
    return renderNotImplemented;
  }
};
LitElement["finalized"] = true;
LitElement.render = render2;
LitElement.shadowRootOptions = { mode: "open" };

// node_modules/@clr/core/node_modules/lit-html/directives/if-defined.js
var previousValues = /* @__PURE__ */ new WeakMap();
var ifDefined = directive((value) => (part) => {
  const previousValue = previousValues.get(part);
  if (value === void 0 && part instanceof AttributePart) {
    if (previousValue !== void 0 || !previousValues.has(part)) {
      const name = part.committer.name;
      part.committer.element.removeAttribute(name);
    }
  } else if (value !== previousValue) {
    part.setValue(value);
  }
  previousValues.set(part, value);
});

// node_modules/@clr/core/internal/utils/string.js
function transformToString(delimiter, fns, ...args) {
  return fns.map((fn) => {
    return fn(...args);
  }).join(delimiter).trim();
}
function transformToSpacedString(fns, ...args) {
  return transformToString(" ", fns, ...args);
}
function transformToUnspacedString(fns, ...args) {
  return transformToString("", fns, ...args);
}
function camelCaseToKebabCase(value) {
  return value.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);
}
function kebabCaseToCamelCase(str) {
  return str.split("-").map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item).join("");
}
function kebabCaseToPascalCase(string) {
  const camelCase = kebabCaseToCamelCase(string);
  return capitalizeFirstLetter(camelCase);
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_arity.js
function _arity(n, fn) {
  switch (n) {
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
      return function(a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_isPlaceholder.js
function _isPlaceholder(a) {
  return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_curry1.js
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_curry2.js
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a2) {
          return fn(_a2, b);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_curryN.js
function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
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
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

// node_modules/@clr/core/node_modules/ramda/es/curryN.js
var curryN = _curry2(function curryN2(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});
var curryN_default = curryN;

// node_modules/@clr/core/node_modules/ramda/es/isNil.js
var isNil = _curry1(function isNil2(x) {
  return x == null;
});
var isNil_default = isNil;

// node_modules/@clr/core/node_modules/ramda/es/internal/_isInteger.js
var isInteger_default = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};

// node_modules/@clr/core/node_modules/ramda/es/internal/_isString.js
function _isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}

// node_modules/@clr/core/node_modules/ramda/es/nth.js
var nth = _curry2(function nth2(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
var nth_default = nth;

// node_modules/@clr/core/node_modules/ramda/es/paths.js
var paths = _curry2(function paths2(pathsArray, obj) {
  return pathsArray.map(function(paths3) {
    var val = obj;
    var idx = 0;
    var p;
    while (idx < paths3.length) {
      if (val == null) {
        return;
      }
      p = paths3[idx];
      val = isInteger_default(p) ? nth_default(p, val) : val[p];
      idx += 1;
    }
    return val;
  });
});
var paths_default = paths;

// node_modules/@clr/core/node_modules/ramda/es/path.js
var path = _curry2(function path2(pathAr, obj) {
  return paths_default([pathAr], obj)[0];
});
var path_default = path;

// node_modules/@clr/core/internal/utils/__.js
var __default = { "@@functional/placeholder": true };

// node_modules/@clr/core/internal/utils/exists.js
var existsIn = curryN_default(2, (pathToCheck, obj) => {
  const pathExists = path_default(pathToCheck, obj);
  return typeof pathExists !== "undefined";
});
function elementExists(tagName, registry) {
  if (!registry) {
    registry = window && window.customElements;
  }
  if (!registry) {
    return true;
  }
  return !!registry.get(tagName);
}
var existsInWindow = existsIn(__default, window);
function isBrowser(win = window) {
  return !isNil_default(win);
}

// node_modules/@clr/core/internal/services/log.service.js
var LogService = class {
  static log(...args) {
    if (notTestingEnvironment()) {
      console.log(...args);
    }
  }
  static warn(...args) {
    if (notTestingEnvironment()) {
      console.warn(...args);
    }
  }
  static error(...args) {
    if (notTestingEnvironment()) {
      console.error(...args);
    }
  }
};
function notTestingEnvironment() {
  return !existsInWindow(["jasmine"]);
}

// node_modules/@clr/core/internal/utils/framework.js
var angularVersion;
var angularJSVersion;
var reactVersion;
var vueVersion;
function getAngularVersion(useCache = true) {
  if (!useCache || !angularVersion) {
    const appRoot = document && document.querySelector("[ng-version]");
    angularVersion = appRoot ? `${appRoot.getAttribute("ng-version")}` : void 0;
  }
  return angularVersion;
}
function getAngularJSVersion(useCache = true) {
  var _a2, _b, _c;
  if (!useCache || !angularVersion) {
    angularJSVersion = (_c = (_b = (_a2 = window) === null || _a2 === void 0 ? void 0 : _a2.angular) === null || _b === void 0 ? void 0 : _b.version) === null || _c === void 0 ? void 0 : _c.full;
  }
  return angularJSVersion;
}
function getReactVersion(useCache = true) {
  var _a2, _b, _c;
  if (!useCache || !reactVersion) {
    if ((_c = (_b = (_a2 = window) === null || _a2 === void 0 ? void 0 : _a2.CDS) === null || _b === void 0 ? void 0 : _b._react) === null || _c === void 0 ? void 0 : _c.version) {
      reactVersion = window.CDS._react.version;
    } else if (document.querySelector("[data-reactroot], [data-reactid]")) {
      reactVersion = "unknown version";
    } else {
      reactVersion = void 0;
    }
  }
  return reactVersion;
}
function getVueVersion(useCache = true) {
  if (!useCache || !vueVersion) {
    const all = document.querySelectorAll("*");
    let el;
    for (let i = 0; i < all.length; i++) {
      if (all[i].__vue__) {
        el = all[i];
        break;
      }
    }
    vueVersion = el ? "unknown version" : void 0;
  }
  return vueVersion;
}
function isStorybook() {
  return window.location.href.includes("localhost:6006");
}

// node_modules/@clr/core/node_modules/ramda/es/is.js
var is = _curry2(function is2(Ctor, val) {
  return val != null && val.constructor === Ctor || val instanceof Ctor;
});
var is_default = is;

// node_modules/@clr/core/node_modules/ramda/es/internal/_has.js
function _has(prop3, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop3);
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_isArguments.js
var toString = Object.prototype.toString;
var _isArguments = function() {
  return toString.call(arguments) === "[object Arguments]" ? function _isArguments2(x) {
    return toString.call(x) === "[object Arguments]";
  } : function _isArguments2(x) {
    return _has("callee", x);
  };
}();
var isArguments_default = _isArguments;

// node_modules/@clr/core/node_modules/ramda/es/internal/_isArray.js
var isArray_default = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
};

// node_modules/@clr/core/node_modules/ramda/es/internal/_isObject.js
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

// node_modules/@clr/core/node_modules/ramda/es/empty.js
var empty = _curry1(function empty2(x) {
  return x != null && typeof x["fantasy-land/empty"] === "function" ? x["fantasy-land/empty"]() : x != null && x.constructor != null && typeof x.constructor["fantasy-land/empty"] === "function" ? x.constructor["fantasy-land/empty"]() : x != null && typeof x.empty === "function" ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === "function" ? x.constructor.empty() : isArray_default(x) ? [] : _isString(x) ? "" : _isObject(x) ? {} : isArguments_default(x) ? /* @__PURE__ */ function() {
    return arguments;
  }() : void 0;
});
var empty_default = empty;

// node_modules/@clr/core/node_modules/ramda/es/internal/_arrayFromIterator.js
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_includesWith.js
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_functionName.js
function _functionName(f) {
  var match = String(f).match(/^function (\w*)/);
  return match == null ? "" : match[1];
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_objectIs.js
function _objectIs(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
}
var objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;

// node_modules/@clr/core/node_modules/ramda/es/keys.js
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
  var prop3, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
  for (prop3 in obj) {
    if (_has(prop3, obj) && (!checkArgsLength || prop3 !== "length")) {
      ks[ks.length] = prop3;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop3 = nonEnumerableProps[nIdx];
      if (_has(prop3, obj) && !contains(ks, prop3)) {
        ks[ks.length] = prop3;
      }
      nIdx -= 1;
    }
  }
  return ks;
});
var keys_default = keys;

// node_modules/@clr/core/node_modules/ramda/es/type.js
var type = _curry1(function type2(val) {
  return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
});
var type_default = type;

// node_modules/@clr/core/node_modules/ramda/es/internal/_equals.js
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);
  function eq(_a2, _b) {
    return _equals(_a2, _b, stackA.slice(), stackB.slice());
  }
  return !_includesWith(function(b2, aItem) {
    return !_includesWith(eq, aItem, b2);
  }, b, a);
}
function _equals(a, b, stackA, stackB) {
  if (objectIs_default(a, b)) {
    return true;
  }
  var typeA = type_default(a);
  if (typeA !== type_default(b)) {
    return false;
  }
  if (a == null || b == null) {
    return false;
  }
  if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
    return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
  }
  if (typeof a.equals === "function" || typeof b.equals === "function") {
    return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
  }
  switch (typeA) {
    case "Arguments":
    case "Array":
    case "Object":
      if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
        return a === b;
      }
      break;
    case "Boolean":
    case "Number":
    case "String":
      if (!(typeof a === typeof b && objectIs_default(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case "Date":
      if (!objectIs_default(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case "Error":
      return a.name === b.name && a.message === b.message;
    case "RegExp":
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }
  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }
  switch (typeA) {
    case "Map":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case "Set":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
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
  var keysA = keys_default(a);
  if (keysA.length !== keys_default(b).length) {
    return false;
  }
  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}

// node_modules/@clr/core/node_modules/ramda/es/equals.js
var equals = _curry2(function equals2(a, b) {
  return _equals(a, b, [], []);
});
var equals_default = equals;

// node_modules/@clr/core/node_modules/ramda/es/isEmpty.js
var isEmpty = _curry1(function isEmpty2(x) {
  return x != null && equals_default(x, empty_default(x));
});
var isEmpty_default = isEmpty;

// node_modules/@clr/core/internal/utils/identity.js
function isNilOrEmpty(val) {
  return isNil_default(val) || isEmpty_default(val);
}
function isString(val) {
  return is_default(String, val);
}
function isStringOrNil(val) {
  return is_default(String, val) || isNil_default(val);
}
function isMap(val) {
  return is_default(Map, val);
}
function hasPropertyChanged(val, oldVal) {
  return val !== oldVal;
}
function hasStringPropertyChanged(val, oldVal) {
  return isStringOrNil(val) && hasPropertyChanged(val, oldVal);
}
function hasStringPropertyChangedAndNotNil(val, oldVal) {
  return !isNilOrEmpty(val) && hasPropertyChanged(val, oldVal);
}
function getEnumValues(enumeration) {
  return Object.values(enumeration);
}
function createId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
function cloneMap(mp) {
  const clonedMap = /* @__PURE__ */ new Map();
  for (const [key, val] of mp) {
    if (isMap(val)) {
      clonedMap.set(key, cloneMap(val));
    } else {
      clonedMap.set(key, val);
    }
  }
  return clonedMap;
}
function deepClone(obj) {
  return isMap(obj) ? cloneMap(obj) : JSON.parse(JSON.stringify(obj));
}

// node_modules/@clr/core/internal/decorators/property.js
function getDefaultOptions(propertyKey, options) {
  const type3 = options ? options.type : options;
  switch (type3) {
    case Array:
      return Object.assign({ reflect: false }, options);
    case Object:
      return Object.assign({ reflect: false }, options);
    case String:
      return Object.assign({ reflect: true, attribute: camelCaseToKebabCase(propertyKey), converter: {
        toAttribute: (value) => value ? value : null
      } }, options);
    case Number:
      return Object.assign({ reflect: true, attribute: camelCaseToKebabCase(propertyKey) }, options);
    case Boolean:
      return Object.assign({ reflect: true, attribute: camelCaseToKebabCase(propertyKey), converter: {
        // Mimic standard HTML boolean attributes + support "false" attribute values
        // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
        toAttribute: (value) => value ? "" : null,
        fromAttribute: (value) => value !== "false" && value !== null
      } }, options);
    case Date: {
      return Object.assign({
        // Parse date strings from attributes but do not reflect back into attribute
        reflect: false,
        converter: {
          fromAttribute: (value) => new Date(value)
        }
      }, options);
    }
    default:
      return options;
  }
}
function requirePropertyCheck(protoOrDescriptor, name, options) {
  const targetFirstUpdated = protoOrDescriptor.firstUpdated;
  function firstUpdated(props) {
    if (options && options.required && isNilOrEmpty(this[name])) {
      const message = options.requiredMessage || getRequiredMessage(options.required, name, this.tagName);
      if (options.required === "error") {
        throw new Error(message);
      } else {
        LogService.warn(message, this);
      }
    }
    if (targetFirstUpdated) {
      targetFirstUpdated.apply(this, [props]);
    }
  }
  protoOrDescriptor.firstUpdated = firstUpdated;
}
function getRequiredMessage(level = "warning", propertyName, tagName) {
  const tag = tagName.toLocaleLowerCase();
  return `${capitalizeFirstLetter(level)}: ${propertyName} is required to use ${tag} component. Set the JS Property or HTML Attribute.

${getAngularVersion() ? `Angular: <${tag} [${propertyName}]="..."></${tag}>
` : ""}${getVueVersion() ? `Vue: <${tag} :${propertyName}="..."></${tag}>
` : ""}${getReactVersion() ? `React: <${kebabCaseToPascalCase(tag)} ${propertyName}={...} />
` : ""}${`HTML: <${tag} ${camelCaseToKebabCase(propertyName)}="..."></${tag}>
`}${`JavaScript: document.querySelector('${tag}').${propertyName} = '...';

`}`;
}
function property2(options) {
  return (protoOrDescriptor, name) => {
    requirePropertyCheck(protoOrDescriptor, name, options);
    return property(getDefaultOptions(name, options))(protoOrDescriptor, name);
  };
}
function internalProperty(options) {
  return (protoOrDescriptor, name) => {
    const defaultOptions = getDefaultOptions(name, options);
    if (defaultOptions) {
      defaultOptions.reflect = (options === null || options === void 0 ? void 0 : options.reflect) ? options.reflect : false;
    }
    return property(defaultOptions)(protoOrDescriptor, name);
  };
}

// node_modules/@clr/core/internal/decorators/query-slot.js
var legacyQuery2 = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};
var standardQuery2 = (descriptor, element) => ({
  kind: "method",
  placement: "prototype",
  key: element.key,
  descriptor
});
function querySlot(selector, config) {
  return (protoOrDescriptor, name) => {
    const targetFirstUpdated = protoOrDescriptor.firstUpdated;
    function firstUpdated() {
      const ref = this.querySelector(selector);
      if (!ref && (config === null || config === void 0 ? void 0 : config.required)) {
        const message = config.requiredMessage || `The <${selector}> element is required to use <${this.tagName.toLocaleLowerCase()}>`;
        if (config.required === "error") {
          throw new Error(message);
        } else {
          LogService.warn(message, this);
        }
      }
      if ((config === null || config === void 0 ? void 0 : config.assign) && (ref === null || ref === void 0 ? void 0 : ref.hasAttribute("slot")) === false) {
        ref.setAttribute("slot", config.assign);
      }
      if (targetFirstUpdated) {
        targetFirstUpdated.apply(this);
      }
    }
    protoOrDescriptor.firstUpdated = firstUpdated;
    const descriptor = {
      get() {
        return this.querySelector(selector);
      },
      enumerable: true,
      configurable: true
    };
    return name !== void 0 ? legacyQuery2(descriptor, protoOrDescriptor, name) : standardQuery2(descriptor, protoOrDescriptor);
  };
}

// node_modules/@clr/core/internal/services/keycodes.service.js
var keyCodeRegistry = /* @__PURE__ */ new Map([
  [
    "arrow-left",
    /* @__PURE__ */ new Map([
      ["code", "ArrowLeft"],
      ["ie-code", "Left"]
    ])
  ],
  [
    "arrow-up",
    /* @__PURE__ */ new Map([
      ["code", "ArrowUp"],
      ["ie-code", "Up"]
    ])
  ],
  [
    "arrow-down",
    /* @__PURE__ */ new Map([
      ["code", "ArrowDown"],
      ["ie-code", "Down"]
    ])
  ],
  [
    "tab",
    /* @__PURE__ */ new Map([
      ["code", "Tab"],
      ["ie-code", "Tab"]
    ])
  ],
  [
    "enter",
    /* @__PURE__ */ new Map([
      ["code", "Enter"],
      ["ie-code", "Enter"]
    ])
  ],
  [
    "escape",
    /* @__PURE__ */ new Map([
      ["code", "Escape"],
      ["ie-code", "Esc"]
    ])
  ],
  [
    "space",
    /* @__PURE__ */ new Map([
      ["code", " "],
      ["ie-code", "Spacebar"]
    ])
  ],
  [
    "home",
    /* @__PURE__ */ new Map([
      ["code", "Home"],
      ["ie-code", "Home"]
    ])
  ],
  [
    "end",
    /* @__PURE__ */ new Map([
      ["code", "End"],
      ["ie-code", "End"]
    ])
  ]
]);
var KeyCodeService = class {
  /**
   * keycodes() returns a clone of the key codes dictionary/hashmap, not the actual registry.
   * Performing actions on the return value of the keycodes getter will not be reflected in the
   * actual keycodes dictionary!
   */
  static get keycodes() {
    return deepClone(keyCodeRegistry);
  }
  static add(keycode, code, legacyCode) {
    const keycodeHashValueToStore = /* @__PURE__ */ new Map([["code", code]]);
    if (legacyCode) {
      keycodeHashValueToStore.set("ie-code", legacyCode);
    }
    keyCodeRegistry.set(keycode, keycodeHashValueToStore);
  }
  static has(keycode) {
    return keyCodeRegistry.has(keycode);
  }
  static getCode(keycode) {
    return getKeycodeFromRegistry(keycode, "code", this.keycodes);
  }
  static getIeCode(keycode) {
    return getKeycodeFromRegistry(keycode, "ie-code", this.keycodes);
  }
};
function getKeycodeFromRegistry(codeToLookup, whichCodeType = "code", registry = keyCodeRegistry) {
  var _a2;
  return ((_a2 = registry.get(codeToLookup)) === null || _a2 === void 0 ? void 0 : _a2.get(whichCodeType)) || "";
}

// node_modules/@clr/core/internal/utils/keycodes.js
function keyWasEvented(evt, whichKey) {
  return KeyCodeService.getCode(whichKey) === evt.key || KeyCodeService.getIeCode(whichKey) === evt.key;
}
function onAnyKey(whichKeys, evt, handler) {
  const eventedKeys = whichKeys.filter((k) => {
    return keyWasEvented(evt, k);
  });
  if (eventedKeys.length > 0) {
    handler();
  }
}

// node_modules/@clr/core/internal/utils/events.js
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

// node_modules/@clr/core/internal/base/button.base.js
var iconSpinnerCheck = html`<span class="button-status-icon" cds-layout="horizontal align:center"
  ><span class="spinner spinner-inline spinner-check" cds-layout="align:center"></span
></span>`;
var iconSpinner = html`<span class="button-status-icon" cds-layout="horizontal align:center"
  ><span class="spinner spinner-inline" cds-layout="align:center"></span
></span>`;
var iconSlot = html`<span class="button-icon"><slot name="button-icon"></slot></span>`;
var badgeSlot = html`<span class="button-badge"><slot name="button-badge"></slot></span>`;
var CdsBaseButton = class extends LitElement {
  constructor() {
    super(...arguments);
    this.readonly = false;
    this.disabled = false;
    this.focused = false;
    this.role = "button";
    this.containsAnchor = false;
    this.isAnchor = false;
  }
  get hiddenButtonTemplate() {
    return this.readonly ? html`` : html`<button
          aria-hidden="true"
          ?disabled="${this.disabled}"
          tabindex="-1"
          style="display: none"
          value="${ifDefined(this.value)}"
          name="${ifDefined(this.name)}"
          type="${ifDefined(this.type)}"
        ></button>`;
  }
  render() {
    return html`
      <slot></slot>
      ${this.hiddenButtonTemplate}
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
  }
  firstUpdated(props) {
    super.firstUpdated(props);
    this.setupAnchorFocus();
    this.setupNativeButtonBehavior();
  }
  updated(props) {
    super.updated(props);
    this.updateButtonAttributes();
  }
  setupAnchorFocus() {
    if (this.anchor) {
      this.anchor.addEventListener("focusin", () => this.focused = true);
      this.anchor.addEventListener("focusout", () => this.focused = false);
    }
  }
  /**
   * We have to append a hidden button outside the web component in the light DOM
   * This allows us to trigger native submit events within a form element.
   */
  setupNativeButtonBehavior() {
    this.appendHiddenButton();
    this.addEventListener("click", this.triggerNativeButtonBehavior);
    this.addEventListener("keydown", this.emulateKeyBoardEventBehavior);
  }
  triggerNativeButtonBehavior(event) {
    if (!this.readonly) {
      if (this.disabled) {
        stopEvent(event);
      } else if (event.target === this && !event.defaultPrevented) {
        this.hiddenButton.dispatchEvent(new MouseEvent("click", { relatedTarget: this, composed: true }));
      }
    }
  }
  appendHiddenButton() {
    if (!this.hiddenButton && this.templateButton) {
      this.hiddenButton = this.appendChild(this.templateButton);
    }
  }
  emulateKeyBoardEventBehavior(evt) {
    if (this.anchor) {
      return;
    }
    onAnyKey(["enter", "space"], evt, () => {
      this.click();
      stopEvent(evt);
    });
  }
  updateButtonAttributes() {
    var _a2;
    this.containsAnchor = !!this.anchor;
    this.isAnchor = ((_a2 = this.parentElement) === null || _a2 === void 0 ? void 0 : _a2.tagName) === "A";
    if (this.isAnchor && this.parentElement) {
      this.parentElement.style.lineHeight = "0";
      this.parentElement.style.textDecoration = "none";
    }
    this.readonly = this.readonly || this.containsAnchor || this.isAnchor;
    this.role = this.readonly ? null : "button";
    if (this.readonly) {
      this.tabIndexAttr = null;
    } else {
      this.tabIndexAttr = this.disabled ? -1 : 0;
    }
  }
};
__decorate([
  property2({ type: Boolean })
], CdsBaseButton.prototype, "readonly", void 0);
__decorate([
  property2({ type: String })
], CdsBaseButton.prototype, "type", void 0);
__decorate([
  property2({ type: String })
], CdsBaseButton.prototype, "name", void 0);
__decorate([
  property2({ type: String })
], CdsBaseButton.prototype, "value", void 0);
__decorate([
  property2({ type: Boolean })
], CdsBaseButton.prototype, "disabled", void 0);
__decorate([
  internalProperty({ type: Number, attribute: "tabindex", reflect: true })
], CdsBaseButton.prototype, "tabIndexAttr", void 0);
__decorate([
  internalProperty({ type: Boolean, reflect: true })
], CdsBaseButton.prototype, "focused", void 0);
__decorate([
  internalProperty({ type: String, reflect: true })
], CdsBaseButton.prototype, "role", void 0);
__decorate([
  internalProperty({ type: Boolean, reflect: true })
], CdsBaseButton.prototype, "containsAnchor", void 0);
__decorate([
  querySlot("a")
], CdsBaseButton.prototype, "anchor", void 0);
__decorate([
  internalProperty({ type: Boolean, reflect: true })
], CdsBaseButton.prototype, "isAnchor", void 0);
__decorate([
  querySlot("cds-icon")
], CdsBaseButton.prototype, "icon", void 0);
__decorate([
  querySlot("cds-badge")
], CdsBaseButton.prototype, "badge", void 0);
__decorate([
  query("button")
], CdsBaseButton.prototype, "templateButton", void 0);

// node_modules/@clr/core/internal/services/focus-trap-tracker.service.js
var FocusTrapTracker = class {
  static setCurrent(el) {
    this.focusTrapElements.unshift(el);
  }
  static activatePreviousCurrent() {
    this.focusTrapElements.shift();
  }
  static getCurrent() {
    return this.focusTrapElements[0];
  }
};
FocusTrapTracker.focusTrapElements = [];

// node_modules/@clr/core/node_modules/ramda/es/internal/_indexOf.js
function _indexOf(list, a, idx) {
  var inf, item;
  if (typeof list.indexOf === "function") {
    switch (typeof a) {
      case "number":
        if (a === 0) {
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === "number" && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        return list.indexOf(a, idx);
      case "string":
      case "boolean":
      case "function":
      case "undefined":
        return list.indexOf(a, idx);
      case "object":
        if (a === null) {
          return list.indexOf(a, idx);
        }
    }
  }
  while (idx < list.length) {
    if (equals_default(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_includes.js
function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

// node_modules/@clr/core/node_modules/ramda/es/includes.js
var includes = _curry2(_includes);
var includes_default = includes;

// node_modules/@clr/core/node_modules/ramda/es/flip.js
var flip = _curry1(function flip2(fn) {
  return curryN_default(fn.length, function(a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});
var flip_default = flip;

// node_modules/@clr/core/node_modules/ramda/es/internal/_complement.js
function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_isTransformer.js
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] === "function";
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_dispatchable.js
function _dispatchable(methodNames, xf, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!isArray_default(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === "function") {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_filter.js
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

// node_modules/@clr/core/node_modules/ramda/es/internal/_isArrayLike.js
var _isArrayLike = _curry1(function isArrayLike(x) {
  if (isArray_default(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.nodeType === 1) {
    return !!x.length;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});
var isArrayLike_default = _isArrayLike;

// node_modules/@clr/core/node_modules/ramda/es/internal/_xwrap.js
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
  XWrap2.prototype["@@transducer/step"] = function(acc, x) {
    return this.f(acc, x);
  };
  return XWrap2;
}();
function _xwrap(fn) {
  return new XWrap(fn);
}

// node_modules/@clr/core/node_modules/ramda/es/bind.js
var bind = _curry2(function bind2(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});
var bind_default = bind;

// node_modules/@clr/core/node_modules/ramda/es/internal/_reduce.js
function _arrayReduce(xf, acc, list) {
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
function _iterableReduce(xf, acc, iter) {
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
function _methodReduce(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
}
var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
function _reduce(fn, acc, list) {
  if (typeof fn === "function") {
    fn = _xwrap(fn);
  }
  if (isArrayLike_default(list)) {
    return _arrayReduce(fn, acc, list);
  }
  if (typeof list["fantasy-land/reduce"] === "function") {
    return _methodReduce(fn, acc, list, "fantasy-land/reduce");
  }
  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }
  if (typeof list.next === "function") {
    return _iterableReduce(fn, acc, list);
  }
  if (typeof list.reduce === "function") {
    return _methodReduce(fn, acc, list, "reduce");
  }
  throw new TypeError("reduce: list must be array or iterable");
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_xfBase.js
var xfBase_default = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};

// node_modules/@clr/core/node_modules/ramda/es/internal/_xfilter.js
var XFilter = function() {
  function XFilter2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter2.prototype["@@transducer/init"] = xfBase_default.init;
  XFilter2.prototype["@@transducer/result"] = xfBase_default.result;
  XFilter2.prototype["@@transducer/step"] = function(result, input) {
    return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XFilter2;
}();
var _xfilter = _curry2(function _xfilter2(f, xf) {
  return new XFilter(f, xf);
});
var xfilter_default = _xfilter;

// node_modules/@clr/core/node_modules/ramda/es/filter.js
var filter = _curry2(
  _dispatchable(["filter"], xfilter_default, function(pred, filterable) {
    return _isObject(filterable) ? _reduce(function(acc, key) {
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

// node_modules/@clr/core/node_modules/ramda/es/reject.js
var reject = _curry2(function reject2(pred, filterable) {
  return filter_default(_complement(pred), filterable);
});
var reject_default = reject;

// node_modules/@clr/core/node_modules/ramda/es/without.js
var without = _curry2(function(xs, list) {
  return reject_default(flip_default(_includes)(xs), list);
});
var without_default = without;

// node_modules/@clr/core/internal/utils/dom.js
function isHTMLElement(el) {
  return !!el && el instanceof HTMLElement;
}
function addAttributeValue(element, attr, value) {
  if (element) {
    const currentAttrVal = element.getAttribute(attr);
    if (!currentAttrVal) {
      element.setAttribute(attr, value);
    } else if (!includes_default(value, currentAttrVal.split(" "))) {
      element.setAttribute(attr, currentAttrVal + " " + value);
    }
  }
}
function removeAttributeValue(element, attr, value) {
  if (element) {
    const currentAttrVal = element.getAttribute(attr);
    if (currentAttrVal) {
      const attrValues = without_default([value], currentAttrVal.split(" "));
      const newAttrValue = attrValues.join(" ");
      if (newAttrValue) {
        element.setAttribute(attr, newAttrValue);
      } else {
        element.removeAttribute(attr);
      }
    }
  }
}

// node_modules/@clr/core/internal/utils/focus-trap.js
function focusElementIfInCurrentFocusTrapElement(focusedElement, focusTrapElement) {
  if (FocusTrapTracker.getCurrent() === focusTrapElement && elementIsOutsideFocusTrapElement(focusedElement, focusTrapElement)) {
    focusTrapElement.focus();
  }
}
function elementIsOutsideFocusTrapElement(focusedElement, focusTrapElement) {
  return !focusTrapElement.contains(focusedElement) || focusedElement === focusTrapElement.topReboundElement || focusedElement === focusTrapElement.bottomReboundElement;
}
function createFocusTrapReboundElement() {
  const offScreenSpan = document.createElement("span");
  offScreenSpan.setAttribute("tabindex", "0");
  offScreenSpan.classList.add("offscreen-focus-rebounder");
  return offScreenSpan;
}
function addReboundElementsToFocusTrapElement(focusTrapElement) {
  if (focusTrapElement) {
    focusTrapElement.topReboundElement = createFocusTrapReboundElement();
    focusTrapElement.bottomReboundElement = createFocusTrapReboundElement();
    if (focusTrapElement.parentElement) {
      focusTrapElement.parentElement.insertBefore(focusTrapElement.topReboundElement, focusTrapElement);
      if (focusTrapElement.nextSibling) {
        focusTrapElement.parentElement.insertBefore(focusTrapElement.bottomReboundElement, focusTrapElement.nextSibling);
      } else {
        focusTrapElement.parentElement.appendChild(focusTrapElement.bottomReboundElement);
      }
    }
  }
}
function removeReboundElementsFromFocusTrapElement(focusTrapElement) {
  if (focusTrapElement) {
    if (focusTrapElement.topReboundElement && focusTrapElement.parentElement) {
      focusTrapElement.parentElement.removeChild(focusTrapElement.topReboundElement);
    }
    if (focusTrapElement.bottomReboundElement && focusTrapElement.parentElement) {
      focusTrapElement.parentElement.removeChild(focusTrapElement.bottomReboundElement);
    }
    delete focusTrapElement.topReboundElement;
    delete focusTrapElement.bottomReboundElement;
  }
}
var FocusTrap = class {
  constructor(hostElement) {
    this.focusTrapElement = hostElement;
  }
  enableFocusTrap() {
    if (FocusTrapTracker.getCurrent() === this.focusTrapElement) {
      throw new Error("Focus trap is already enabled for this instance.");
    }
    addReboundElementsToFocusTrapElement(this.focusTrapElement);
    this.focusTrapElement.setAttribute("tabindex", "0");
    if (document.activeElement && isHTMLElement(document.activeElement)) {
      this.previousFocus = document.activeElement;
    }
    addAttributeValue(document.body, "cds-layout", "no-scrolling");
    FocusTrapTracker.setCurrent(this.focusTrapElement);
    this.focusTrapElement.focus();
    this.onFocusInEvent = this.onFocusIn.bind(this);
    document.addEventListener("focusin", this.onFocusInEvent);
  }
  removeFocusTrap() {
    document.removeEventListener("focusin", this.onFocusInEvent);
    removeAttributeValue(document.body, "cds-layout", "no-scrolling");
    removeReboundElementsFromFocusTrapElement(this.focusTrapElement);
    FocusTrapTracker.activatePreviousCurrent();
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }
  onFocusIn(event) {
    focusElementIfInCurrentFocusTrapElement(event.target, this.focusTrapElement);
  }
};

// node_modules/@clr/core/internal/base/focus-trap.base.js
var CdsBaseFocusTrap = class extends LitElement {
  constructor() {
    super(...arguments);
    this.focusTrap = new FocusTrap(this);
    this.hidden = false;
    this.__demoMode = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.toggleFocusTrap();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.focusTrap.removeFocusTrap();
  }
  attributeChangedCallback(name, old, value) {
    super.attributeChangedCallback(name, old, value);
    if (name === "hidden" && old !== value) {
      this.toggleFocusTrap();
    }
  }
  render() {
    return html`<slot></slot>`;
  }
  toggleFocusTrap() {
    if (!this.__demoMode && !this.hasAttribute("hidden")) {
      this.focusTrap.enableFocusTrap();
    } else {
      this.focusTrap.removeFocusTrap();
    }
  }
};
__decorate([
  property2({ type: Boolean })
], CdsBaseFocusTrap.prototype, "hidden", void 0);
__decorate([
  internalProperty({ type: Boolean, reflect: true })
], CdsBaseFocusTrap.prototype, "__demoMode", void 0);

// node_modules/@clr/core/internal/utils/css.js
function addClassnames(el, ...classNames) {
  classNames.forEach((cn) => {
    el.classList.add(cn);
  });
  return el;
}
function removeClassnames(el, ...classNames) {
  classNames.forEach((cn) => {
    el.classList.remove(cn);
  });
  return el;
}
function removeClassnamesUnless(el, classnamesToRemove, classnamesToKeep) {
  const filteredClassnamesToRemove = classnamesToRemove.filter((cn) => classnamesToKeep.indexOf(cn) < 0);
  return removeClassnames(el, ...filteredClassnamesToRemove);
}
function updateElementStyles(el, ...styleTuples) {
  styleTuples.forEach(([styleKey, value]) => {
    el.style[styleKey] = value;
  });
  return el;
}

// node_modules/@clr/core/internal/utils/global.js
function getVersion() {
  const log = {
    versions: window.CDS._version,
    loadedElements: window.CDS._loadedElements,
    userAgent: navigator.userAgent,
    angularVersion: getAngularVersion(false),
    angularJSVersion: getAngularJSVersion(false),
    reactVersion: getReactVersion(false),
    vueVersion: getVueVersion(false)
  };
  return log;
}
function logVersion() {
  console.log(JSON.stringify(getVersion(), null, 2));
}
function initializeCDSGlobal() {
  window.CDS = window.CDS || {
    _version: [],
    _loadedElements: [],
    _react: { version: void 0 },
    getVersion,
    logVersion
  };
}
function setRunningVersion() {
  const loadedVersion = "4.0.15";
  if (window.CDS._version.indexOf(loadedVersion) < 0) {
    window.CDS._version.push(loadedVersion);
  }
  document.querySelector("body").setAttribute("cds-version", window.CDS._version[0]);
  if (window.CDS._version.length > 1) {
    console.warn("Running more than one version of Clarity can cause unexpected issues. Please ensure only one version is loaded.");
  }
}
function setupCDSGlobal() {
  if (isBrowser()) {
    initializeCDSGlobal();
    setRunningVersion();
  }
}

// node_modules/@clr/core/internal/utils/register.js
var addElementToRegistry = curryN_default(3, (tagName, elementClass, registry) => {
  if (elementExists(tagName) && !isStorybook()) {
    console.warn(`${tagName} has already been registered`);
  } else {
    registry.define(tagName, elementClass);
    setupCDSGlobal();
    if (!window.CDS._loadedElements.some((i) => i === tagName)) {
      window.CDS._loadedElements.push(tagName);
    }
  }
});

// node_modules/@clr/core/internal/directives/spread-props.js
var previousProps = /* @__PURE__ */ new WeakMap();
var spreadProps = directive((props) => (part) => {
  const prev = previousProps.get(part);
  if (prev === props) {
    return;
  }
  previousProps.set(part, props);
  Object.entries(props).filter(([k, v]) => v !== part.committer.element[k]).forEach(([k, v]) => part.committer.element[k] = v);
});

// node_modules/@clr/core/internal/decorators/id.js
var legacyId = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};
var standardId = (descriptor, element) => ({
  kind: "method",
  placement: "prototype",
  key: element.key,
  descriptor
});
function id() {
  return (protoOrDescriptor, name) => {
    const descriptor = {
      get() {
        const propertyName = name !== void 0 ? name : protoOrDescriptor.key;
        if (!this[`__${propertyName}`]) {
          this[`__${propertyName}`] = createId();
        }
        return this[`__${propertyName}`];
      },
      enumerable: true,
      configurable: true
    };
    return name !== void 0 ? legacyId(descriptor, protoOrDescriptor, name) : standardId(descriptor, protoOrDescriptor);
  };
}

// node_modules/@clr/core/internal/services/common-strings.default.js
var commonStringsDefault = {
  open: "Open",
  close: "Close",
  show: "Show",
  hide: "Hide",
  expand: "Expand",
  collapse: "Collapse",
  more: "More",
  select: "Select",
  selectAll: "Select All",
  previous: "Previous",
  next: "Next",
  current: "Jump to current",
  info: "Info",
  success: "Success",
  warning: "Warning",
  danger: "Error",
  rowActions: "Available actions",
  pickColumns: "Show or hide columns",
  showColumns: "Show Columns",
  sortColumn: "Sort Column",
  firstPage: "First Page",
  lastPage: "Last Page",
  nextPage: "Next Page",
  previousPage: "Previous Page",
  currentPage: "Current Page",
  totalPages: "Total Pages",
  minValue: "Min value",
  maxValue: "Max value",
  modalCloseButtonAriaLabel: "Close modal",
  modalContentStart: "Beginning of Modal Content",
  modalContentEnd: "End of Modal Content",
  showColumnsMenuDescription: "Show or hide columns menu",
  allColumnsSelected: "All columns selected",
  signpostToggle: "Signpost Toggle",
  signpostClose: "Signpost Close",
  loading: "Loading",
  // Datagrid
  detailPaneStart: "Start of row details",
  detailPaneEnd: "End of row details",
  singleSelectionAriaLabel: "Single selection header",
  singleActionableAriaLabel: "Single actionable header",
  detailExpandableAriaLabel: "Toggle more row content",
  datagridFilterAriaLabel: "Toggle column filter",
  // Alert
  alertCloseButtonAriaLabel: "Close alert",
  // Date Picker
  datepickerToggle: "Toggle datepicker",
  datepickerPreviousMonth: "Previous month",
  datepickerCurrentMonth: "Current month",
  datepickerNextMonth: "Next month",
  datepickerPreviousDecade: "Previous decade",
  datepickerNextDecade: "Next decade",
  datepickerCurrentDecade: "Current decade",
  datepickerSelectMonthText: "Select month, the current month is {CALENDAR_MONTH}",
  datepickerSelectYearText: "Select year, the current year is {CALENDAR_YEAR}",
  daypickerSRCurrentMonthPhrase: "The current month is {CURRENT_MONTH}",
  daypickerSRCurrentYearPhrase: "The current year is {CURRENT_YEAR}",
  daypickerSRCurrentDecadePhrase: "The current decade is {DECADE_RANGE}",
  // Stack View
  stackViewChanged: "Value changed.",
  // Forms
  formErrorSummary: "The form has {ERROR_NUMBER} errors.",
  //Vertical Nav
  verticalNavToggle: "Toggle vertical navigation",
  verticalNavGroupToggle: "Toggle vertical navigation group",
  // Timeline steps
  timelineStepNotStarted: "Not started",
  timelineStepCurrent: "Current",
  timelineStepSuccess: "Completed",
  timelineStepError: "Error",
  timelineStepProcessing: "In progress",
  // Datagrid expandable rows
  dategridExpandableBeginningOf: "Beginning of",
  dategridExpandableEndOf: "End of",
  dategridExpandableRowContent: "Expandable row content",
  dategridExpandableRowsHelperText: `Screen reader table commands may not work for viewing expanded content, please use your screen reader's browse mode to read the content exposed by this button`,
  /* file input */
  browse: "browse",
  files: "files",
  removeFile: "remove file"
};

// node_modules/@clr/core/internal/services/common-strings.service.js
var CommonStringsServiceInternal = class {
  constructor() {
    this.strings = commonStringsDefault;
  }
  /**
   * Access to all of the keys as strings
   */
  get keys() {
    return this.strings;
  }
  /**
   * Allows you to pass in new overrides for localization
   */
  localize(overrides) {
    this.strings = Object.assign(Object.assign({}, this.strings), overrides);
  }
  /**
   * Parse a string with a set of tokens to replace
   */
  parse(source, tokens = {}) {
    const names = Object.keys(tokens);
    let output = source;
    if (names.length) {
      names.forEach((name) => {
        output = output.replace(`{${name}}`, tokens[name]);
      });
    }
    return output;
  }
};
var CommonStringsService = new CommonStringsServiceInternal();

// node_modules/@clr/core/internal/base/base.element.css.js
var styles = css`:root,:host{--cxxs: var(--cds-token-layout-space-xxs, .1rem);--cxs: var(--cds-token-layout-space-xs, .2rem);--csm: var(--cds-token-layout-space-sm, .3rem);--cmd: var(--cds-token-layout-space-md, .6rem);--clg: var(--cds-token-layout-space-lg, 1.2rem);--cxl: var(--cds-token-layout-space-xl, 2.4rem);--cxxl: var(--cds-token-layout-space-xxl, 4.8rem)}[cds-layout~='wrap:none']{flex-wrap:nowrap !important}[cds-layout*='align:stretch']{flex-grow:1 !important}[cds-layout*='align:shrink']{flex-shrink:1 !important;flex-grow:0 !important}[cds-layout~='horizontal']{display:flex;flex-direction:row;flex-wrap:wrap;justify-items:flex-start;align-items:flex-start;width:100%;margin:0;min-height:0}[cds-layout~='horizontal']>[cds-layout~='horizontal'],[cds-layout~='horizontal']>[cds-layout~='vertical'],[cds-layout~='horizontal']>[cds-text]{width:initial !important}[cds-layout~='horizontal'][cds-layout*='align:top']{align-items:flex-start}[cds-layout~='horizontal'][cds-layout*='align:right']{justify-content:flex-end}[cds-layout~='horizontal'][cds-layout*='align:vertical-center']{align-items:center;align-content:center}[cds-layout~='horizontal'][cds-layout*='align:horizontal-center']{justify-content:center}[cds-layout~='horizontal'][cds-layout*='align:center']{align-items:center;align-content:center;justify-content:center}[cds-layout~='horizontal'][cds-layout*='order:reverse']{flex-direction:row-reverse}[cds-layout~='horizontal'][cds-layout*='align:horizontal-stretch']{justify-content:stretch;flex-grow:1}[cds-layout~='horizontal'][cds-layout*='align:horizontal-stretch']>*,[cds-layout~='horizontal'][cds-layout*='align:horizontal-stretch']>::slotted(*){flex-grow:1}[cds-layout~='horizontal'][cds-layout*='align:stretch']{align-items:stretch;align-content:stretch;flex-grow:1}[cds-layout~='horizontal'][cds-layout*='align:stretch']>*,[cds-layout~='horizontal'][cds-layout*='align:stretch']>::slotted(*){flex-grow:1}[cds-layout~='horizontal']>[cds-layout*='align:center'],[cds-layout~='horizontal']>[cds-layout*='align:vertical-center'],[cds-layout~='horizontal']>::slotted([cds-layout*='align:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align:vertical-center']){align-self:center}[cds-layout~='horizontal']>[cds-layout*='align:center'],[cds-layout~='horizontal']>[cds-layout*='align:horizontal-center'],[cds-layout~='horizontal']>::slotted([cds-layout*='align:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align:horizontal-center']){margin-left:auto !important;margin-right:auto !important}[cds-layout~='horizontal']>[cds-layout*='align:top'],[cds-layout~='horizontal']>::slotted([cds-layout*='align:top']){align-self:flex-start}[cds-layout~='horizontal']>::slotted([cds-layout*='align:bottom']){align-self:flex-end}[cds-layout~='horizontal']>[cds-layout*='align:right'],[cds-layout~='horizontal']>::slotted([cds-layout*='align:right']){margin-left:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align:left']){margin-right:auto !important}@media (min-width: 576px){[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:vertical-center']){align-self:center}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:horizontal-center']){margin-left:auto !important;margin-right:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:top']){align-self:flex-start}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:bottom']){align-self:flex-end}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:right']){margin-left:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xs:left']){margin-right:auto !important}}@media (min-width: 768px){[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:vertical-center']){align-self:center}[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:horizontal-center']){margin-left:auto !important;margin-right:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:top']){align-self:flex-start}[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:bottom']){align-self:flex-end}[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:right']){margin-left:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@sm:left']){margin-right:auto !important}}@media (min-width: 992px){[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:vertical-center']){align-self:center}[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:horizontal-center']){margin-left:auto !important;margin-right:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:top']){align-self:flex-start}[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:bottom']){align-self:flex-end}[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:right']){margin-left:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@md:left']){margin-right:auto !important}}@media (min-width: 1200px){[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:vertical-center']){align-self:center}[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:horizontal-center']){margin-left:auto !important;margin-right:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:top']){align-self:flex-start}[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:bottom']){align-self:flex-end}[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:right']){margin-left:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@lg:left']){margin-right:auto !important}}@media (min-width: 1440px){[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:vertical-center']){align-self:center}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:center']),[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:horizontal-center']){margin-left:auto !important;margin-right:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:top']){align-self:flex-start}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:bottom']){align-self:flex-end}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:right']){margin-left:auto !important}[cds-layout~='horizontal']>::slotted([cds-layout*='align@xl:left']){margin-right:auto !important}}[cds-layout~='vertical']{width:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start}[cds-layout~='vertical'][cds-layout*='align:top']{justify-content:flex-start}[cds-layout~='vertical'][cds-layout*='align:right']{align-items:flex-end}[cds-layout~='vertical'][cds-layout*='align:vertical-center']{justify-content:center}[cds-layout~='vertical'][cds-layout*='align:horizontal-center']{align-items:center}[cds-layout~='vertical'][cds-layout*='align:center']{align-items:center;justify-content:center}[cds-layout~='vertical'][cds-layout*='order:reverse']{flex-direction:column-reverse}[cds-layout~='vertical'][cds-layout*='align:horizontal-stretch']{align-items:stretch}[cds-layout~='vertical'][cds-layout*='align:stretch']{align-items:stretch;justify-content:stretch}[cds-layout~='vertical'][cds-layout*='align:stretch']>*,[cds-layout~='vertical'][cds-layout*='align:stretch']>::slotted(*){flex-grow:1}[cds-layout~='vertical']>[cds-layout*='align:center'],[cds-layout~='vertical']>[cds-layout*='align:vertical-center'],[cds-layout~='vertical']>::slotted([cds-layout*='align:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align:vertical-center']){margin-top:auto;margin-bottom:auto}[cds-layout~='vertical']>[cds-layout*='align:center'],[cds-layout~='vertical']>[cds-layout*='align:horizontal-center'],[cds-layout~='vertical']>::slotted([cds-layout*='align:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align:horizontal-center']){align-self:center}[cds-layout~='vertical']>[cds-layout*='align:top'],[cds-layout~='vertical']>::slotted([cds-layout*='align:top']){margin-bottom:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align:bottom']){margin-top:auto !important}[cds-layout~='vertical']>[cds-layout*='align:right'],[cds-layout~='vertical']>::slotted([cds-layout*='align:right']){margin-left:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align:left']){margin-right:auto}@media (min-width: 576px){[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:vertical-center']){margin-top:auto;margin-bottom:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:horizontal-center']){align-self:center}[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:top']){margin-bottom:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:bottom']){margin-top:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:right']){margin-left:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@xs:left']){margin-right:auto}}@media (min-width: 768px){[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:vertical-center']){margin-top:auto;margin-bottom:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:horizontal-center']){align-self:center}[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:top']){margin-bottom:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:bottom']){margin-top:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:right']){margin-left:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@sm:left']){margin-right:auto}}@media (min-width: 992px){[cds-layout~='vertical']>::slotted([cds-layout*='align@md:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@md:vertical-center']){margin-top:auto;margin-bottom:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@md:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@md:horizontal-center']){align-self:center}[cds-layout~='vertical']>::slotted([cds-layout*='align@md:top']){margin-bottom:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@md:bottom']){margin-top:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@md:right']){margin-left:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@md:left']){margin-right:auto}}@media (min-width: 1200px){[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:vertical-center']){margin-top:auto;margin-bottom:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:horizontal-center']){align-self:center}[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:top']){margin-bottom:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:bottom']){margin-top:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:right']){margin-left:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@lg:left']){margin-right:auto}}@media (min-width: 1440px){[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:vertical-center']){margin-top:auto;margin-bottom:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:center']),[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:horizontal-center']){align-self:center}[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:top']){margin-bottom:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:bottom']){margin-top:auto !important}[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:right']){margin-left:auto}[cds-layout~='vertical']>::slotted([cds-layout*='align@xl:left']){margin-right:auto}}[cds-layout~='display:screen-reader-only']{position:absolute !important;clip:rect(1px, 1px, 1px, 1px);clip-path:inset(50%);padding:0;border:0;height:1px;width:1px;overflow:hidden;white-space:nowrap;top:0;left:0;display:block !important}[cds-layout*='gap:none']{gap:0}[cds-layout*='gap:xs']{gap:var(--cxs)}[cds-layout*='gap:sm']{gap:var(--csm)}[cds-layout*='gap:md']{gap:var(--cmd)}[cds-layout*='gap:lg']{gap:var(--clg)}[cds-layout~='p:none']{padding:0 !important}[cds-layout~='p:xs']{padding:var(--cxs) !important}[cds-layout~='p:sm']{padding:var(--csm) !important}[cds-layout~='p:md']{padding:var(--cmd) !important}[cds-layout~='p:lg']{padding:var(--clg) !important}[cds-layout~='p-y:xs']{padding-top:var(--cxs) !important;padding-bottom:var(--cxs) !important}[cds-layout~='p-x:lg']{padding-left:var(--clg) !important;padding-right:var(--clg) !important}[cds-layout~='p-l:md']{padding-left:var(--cmd) !important}@media (min-width: 992px){[cds-layout*='gap@md:lg']{gap:var(--clg)}[cds-layout~='p@md:lg']{padding:var(--clg) !important}[cds-layout~='p@md:xl']{padding:var(--cxl) !important}}[cds-layout~='fill']{width:100% !important}*,*:before,*:after,:host{box-sizing:border-box}[cds-text]{font-family:var(--cds-token-typography-font-family, "Clarity City", "Avenir Next", "Helvetica Neue", Arial, sans-serif);margin-top:0;margin-bottom:0}[cds-text][cds-layout~='vertical']::before,[cds-text][cds-layout~='vertical']::after,[cds-text][cds-layout~='horizontal']::before,[cds-text][cds-layout~='horizontal']::after{display:none}[cds-text*='display'],[cds-text*='title']{font-family:var(--cds-token-typography-header-font-family, "Clarity City", "Avenir Next", "Helvetica Neue", Arial, sans-serif)}[cds-text*='inline']{width:auto !important;display:inline-block !important}[cds-text*='h3']{font-family:var(--cds-token-typography-header-font-family, "Clarity City", "Avenir Next", "Helvetica Neue", Arial, sans-serif);font-size:var(--cds_undefined, 1.1rem);font-weight:200;color:#333;line-height:1.0909em;letter-spacing:-.01364em}[cds-text*='h3']::before{content:'';display:block;height:0;width:0;margin-bottom:calc(((var(--cds-token-global-font-top-gap-height, 0.1475em) + calc((1.0909em - 1em) / 2)) * -1) + .037em)}[cds-text*='h3']::after{content:'';display:block;height:0;width:0;margin-top:calc( (((1em - var(--cds-token-global-font-top-gap-height, 0.1475em) - var(--cds-token-global-font-ascender-height, 0.1703em) - var(--cds-token-global-font-x-height, 0.517em)) + calc((1.0909em - 1em) / 2)) * -1) - .044em)}[cds-text*='display']{font-size:var(--cds-token-typography-display-font-size, 2rem);font-weight:var(--cds-token-typography-display-font-weight, 400);color:var(--cds-token-typography-display-color, #333);line-height:var(--cds-token-typography-display-line-height, 1.1em);letter-spacing:var(--cds-token-typography-display-letter-spacing, -0.0125em)}[cds-text*='display']::before{content:'';display:block;height:0;width:0;margin-bottom:calc(((var(--cds-token-global-font-top-gap-height, 0.1475em) + calc((var(--cds-token-typography-display-line-height, 1.1em) - 1em) / 2)) * -1) + .037em)}[cds-text*='display']::after{content:'';display:block;height:0;width:0;margin-top:calc( (((1em - var(--cds-token-global-font-top-gap-height, 0.1475em) - var(--cds-token-global-font-ascender-height, 0.1703em) - var(--cds-token-global-font-x-height, 0.517em)) + calc((var(--cds-token-typography-display-line-height, 1.1em) - 1em) / 2)) * -1) - .044em)}[cds-text*='title']{font-size:var(--cds-token-typography-title-font-size, 1.2rem);font-weight:var(--cds-token-typography-title-font-weight, 400);color:var(--cds-token-typography-title-color, #333);line-height:var(--cds-token-typography-title-line-height, 1.16667em);letter-spacing:var(--cds-token-typography-title-letter-spacing, -0.00833em)}[cds-text*='title']::before{content:'';display:block;height:0;width:0;margin-bottom:calc(((var(--cds-token-global-font-top-gap-height, 0.1475em) + calc((var(--cds-token-typography-title-line-height, 1.16667em) - 1em) / 2)) * -1) + .037em)}[cds-text*='title']::after{content:'';display:block;height:0;width:0;margin-top:calc( (((1em - var(--cds-token-global-font-top-gap-height, 0.1475em) - var(--cds-token-global-font-ascender-height, 0.1703em) - var(--cds-token-global-font-x-height, 0.517em)) + calc((var(--cds-token-typography-title-line-height, 1.16667em) - 1em) / 2)) * -1) - .044em)}[cds-text*='body']{color:var(--cds-token-typography-body-color, #1a1a1a);font-weight:var(--cds-token-typography-body-font-weight, 400);font-size:var(--cds-token-typography-body-font-size, 0.7rem);letter-spacing:var(--cds-token-typography-body-letter-spacing, -0.01429em);line-height:var(--cds-token-typography-body-line-height, 1.42857em)}[cds-text*='body']::before{content:'';display:block;height:0;width:0;margin-bottom:calc(((var(--cds-token-global-font-top-gap-height, 0.1475em) + calc((var(--cds-token-typography-body-line-height, 1.42857em) - 1em) / 2)) * -1) + .1em)}[cds-text*='body']::after{content:'';display:block;height:0;width:0;margin-top:calc( (((1em - var(--cds-token-global-font-top-gap-height, 0.1475em) - var(--cds-token-global-font-ascender-height, 0.1703em) - var(--cds-token-global-font-x-height, 0.517em)) + calc((var(--cds-token-typography-body-line-height, 1.42857em) - 1em) / 2)) * -1) - .044em)}[cds-text*='message']{font-size:var(--cds-token-typography-message-font-size, 0.8rem);font-weight:var(--cds-token-typography-message-font-weight, 400);color:var(--cds-token-typography-message-color, #333);line-height:var(--cds-token-typography-message-line-height, 1.25em);letter-spacing:var(--cds-token-typography-message-letter-spacing, -0.0125em)}[cds-text*='message']::before{content:'';display:block;height:0;width:0;margin-bottom:calc(((var(--cds-token-global-font-top-gap-height, 0.1475em) + calc((var(--cds-token-typography-message-line-height, 1.25em) - 1em) / 2)) * -1) + .037em)}[cds-text*='message']::after{content:'';display:block;height:0;width:0;margin-top:calc( (((1em - var(--cds-token-global-font-top-gap-height, 0.1475em) - var(--cds-token-global-font-ascender-height, 0.1703em) - var(--cds-token-global-font-x-height, 0.517em)) + calc((var(--cds-token-typography-message-line-height, 1.25em) - 1em) / 2)) * -1) - .044em)}[cds-text*='secondary']{font-size:var(--cds-token-typography-secondary-font-size, 0.65rem);font-weight:var(--cds-token-typography-secondary-font-weight, 400);color:var(--cds-token-typography-secondary-color, #1a1a1a);line-height:var(--cds-token-typography-secondary-line-height, 1.23077em);letter-spacing:var(--cds-token-typography-secondary-letter-spacing, -0.00769em)}[cds-text*='secondary']::before{content:'';display:block;height:0;width:0;margin-bottom:calc(((var(--cds-token-global-font-top-gap-height, 0.1475em) + calc((var(--cds-token-typography-secondary-line-height, 1.23077em) - 1em) / 2)) * -1) + .037em)}[cds-text*='secondary']::after{content:'';display:block;height:0;width:0;margin-top:calc( (((1em - var(--cds-token-global-font-top-gap-height, 0.1475em) - var(--cds-token-global-font-ascender-height, 0.1703em) - var(--cds-token-global-font-x-height, 0.517em)) + calc((var(--cds-token-typography-secondary-line-height, 1.23077em) - 1em) / 2)) * -1) - .044em)}[cds-text~='link']{color:var(--cds-token-color-action-600, #0072a3) !important;text-decoration:underline !important;line-height:inherit !important;font-size:inherit !important}[cds-text~='light']{font-weight:var(--cds-token-typography-font-weight-light, 200) !important}[cds-text~='left']{text-align:left !important}[cds-text~='right']{text-align:right !important}[cds-text~='center']{text-align:center !important}@media not all and (min-resolution: 0.001dpcm){[cds-layout~='horizontal'][cds-layout*='gap:none']{width:calc(100% + 0);margin-bottom:calc(0 * -1) !important;margin-right:calc(0 * -1) !important}[cds-layout~='horizontal'][cds-layout*='gap:none']>*,[cds-layout~='horizontal'][cds-layout*='gap:none']>::slotted(*){margin-top:0;margin-left:0;top:calc(-1 * 0) !important;left:calc(-1 * 0) !important;position:relative !important}[cds-layout~='horizontal'][cds-layout*='gap:xs']{width:calc(100% + var(--cxs));margin-bottom:calc(var(--cxs) * -1) !important;margin-right:calc(var(--cxs) * -1) !important}[cds-layout~='horizontal'][cds-layout*='gap:xs']>*,[cds-layout~='horizontal'][cds-layout*='gap:xs']>::slotted(*){margin-top:var(--cxs);margin-left:var(--cxs);top:calc(-1 * var(--cxs)) !important;left:calc(-1 * var(--cxs)) !important;position:relative !important}[cds-layout~='horizontal'][cds-layout*='gap:sm']{width:calc(100% + var(--csm));margin-bottom:calc(var(--csm) * -1) !important;margin-right:calc(var(--csm) * -1) !important}[cds-layout~='horizontal'][cds-layout*='gap:sm']>*,[cds-layout~='horizontal'][cds-layout*='gap:sm']>::slotted(*){margin-top:var(--csm);margin-left:var(--csm);top:calc(-1 * var(--csm)) !important;left:calc(-1 * var(--csm)) !important;position:relative !important}[cds-layout~='horizontal'][cds-layout*='gap:md']{width:calc(100% + var(--cmd));margin-bottom:calc(var(--cmd) * -1) !important;margin-right:calc(var(--cmd) * -1) !important}[cds-layout~='horizontal'][cds-layout*='gap:md']>*,[cds-layout~='horizontal'][cds-layout*='gap:md']>::slotted(*){margin-top:var(--cmd);margin-left:var(--cmd);top:calc(-1 * var(--cmd)) !important;left:calc(-1 * var(--cmd)) !important;position:relative !important}[cds-layout~='horizontal'][cds-layout*='gap:lg']{width:calc(100% + var(--clg));margin-bottom:calc(var(--clg) * -1) !important;margin-right:calc(var(--clg) * -1) !important}[cds-layout~='horizontal'][cds-layout*='gap:lg']>*,[cds-layout~='horizontal'][cds-layout*='gap:lg']>::slotted(*){margin-top:var(--clg);margin-left:var(--clg);top:calc(-1 * var(--clg)) !important;left:calc(-1 * var(--clg)) !important;position:relative !important}[cds-layout~='vertical'][cds-layout*='gap:none']>*,[cds-layout~='vertical'][cds-layout*='gap:none']>::slotted(*){margin-top:0}[cds-layout~='vertical'][cds-layout*='gap:none']>*:first-child,[cds-layout~='vertical'][cds-layout*='gap:none']>::slotted(*:first-child),[cds-layout~='vertical'][cds-layout*='gap:none']>::slotted([slot]:first-of-type){margin-top:0}[cds-layout~='vertical'][cds-layout*='gap:xs']>*,[cds-layout~='vertical'][cds-layout*='gap:xs']>::slotted(*){margin-top:var(--cxs)}[cds-layout~='vertical'][cds-layout*='gap:xs']>*:first-child,[cds-layout~='vertical'][cds-layout*='gap:xs']>::slotted(*:first-child),[cds-layout~='vertical'][cds-layout*='gap:xs']>::slotted([slot]:first-of-type){margin-top:0}[cds-layout~='vertical'][cds-layout*='gap:sm']>*,[cds-layout~='vertical'][cds-layout*='gap:sm']>::slotted(*){margin-top:var(--csm)}[cds-layout~='vertical'][cds-layout*='gap:sm']>*:first-child,[cds-layout~='vertical'][cds-layout*='gap:sm']>::slotted(*:first-child),[cds-layout~='vertical'][cds-layout*='gap:sm']>::slotted([slot]:first-of-type){margin-top:0}[cds-layout~='vertical'][cds-layout*='gap:md']>*,[cds-layout~='vertical'][cds-layout*='gap:md']>::slotted(*){margin-top:var(--cmd)}[cds-layout~='vertical'][cds-layout*='gap:md']>*:first-child,[cds-layout~='vertical'][cds-layout*='gap:md']>::slotted(*:first-child),[cds-layout~='vertical'][cds-layout*='gap:md']>::slotted([slot]:first-of-type){margin-top:0}[cds-layout~='vertical'][cds-layout*='gap:lg']>*,[cds-layout~='vertical'][cds-layout*='gap:lg']>::slotted(*){margin-top:var(--clg)}[cds-layout~='vertical'][cds-layout*='gap:lg']>*:first-child,[cds-layout~='vertical'][cds-layout*='gap:lg']>::slotted(*:first-child),[cds-layout~='vertical'][cds-layout*='gap:lg']>::slotted([slot]:first-of-type){margin-top:0}}:host{all:initial;display:block;font-family:var(--cds-token-typography-font-family, "Clarity City", "Avenir Next", "Helvetica Neue", Arial, sans-serif);contain:layout;box-sizing:border-box !important;-webkit-appearance:none !important}*,*:before,*:after{box-sizing:inherit !important}slot{font-family:var(--cds-token-typography-font-family, "Clarity City", "Avenir Next", "Helvetica Neue", Arial, sans-serif);display:contents !important}:host([role='button']),:host([is-anchor]){cursor:pointer !important}:host([role='button']) ::slotted(*),:host([is-anchor]) ::slotted(*){cursor:pointer !important}:host([role='button'][disabled]){cursor:not-allowed !important}:host([role='button'][disabled]) ::slotted(*){cursor:not-allowed !important}:host([hidden]){display:none !important}:host([tabindex='0']:focus),:host([focused][contains-anchor]),:host([focused]) .input{outline:Highlight solid var(--cds-token-space-size-2, 0.1rem);outline-offset:var(--cds-token-space-size-1, 0.05rem)}@media (-webkit-min-device-pixel-ratio: 0){:host([tabindex='0']:focus),:host([focused]) .input{outline-color:-webkit-focus-ring-color}}
`;

// node_modules/@clr/core/icon/icon.element.css.js
var styles2 = css`:host{--color: var(--cds-token-color-neutral-700, #666);display:inline-block;height:var(--cds-token-space-size-7, 0.8rem);width:var(--cds-token-space-size-7, 0.8rem);margin:0;vertical-align:middle;fill:var(--color);color:inherit;contain:strict}svg{display:block}:host(.clr-i-size-sm){height:var(--cds-token-space-size-7, 0.8rem);width:var(--cds-token-space-size-7, 0.8rem)}:host(.clr-i-size-md){height:var(--cds-token-space-size-9, 1.2rem);width:var(--cds-token-space-size-9, 1.2rem)}:host(.clr-i-size-lg){height:var(--cds-token-space-size-11, 1.8rem);width:var(--cds-token-space-size-11, 1.8rem)}:host(.clr-i-size-xl){height:var(--cds-token-space-size-12, 2.4rem);width:var(--cds-token-space-size-12, 2.4rem)}:host(.clr-i-size-xxl){height:calc(var(--cds-token-space-size-13, 3.6rem) - var(--cds-token-space-size-5, 0.4rem));width:calc(var(--cds-token-space-size-13, 3.6rem) - var(--cds-token-space-size-5, 0.4rem))}:host(.is-green),:host(.is-success),:host([status='success']){--color: var(--cds-token-color-success-700, #3c8500)}:host(.is-red),:host(.is-danger),:host(.is-error),:host([status='danger']){--color: var(--cds-token-color-danger-700, #db2100)}:host(.is-warning),:host([status='warning']){--color: var(--cds-token-color-warning-900, #8f5a00)}:host(.is-blue),:host(.is-info),:host(.is-highlight),:host([status='info']){--color: var(--cds-token-color-action-600, #0072a3)}:host(.is-white),:host(.is-inverse),:host([inverse]){--color: var(--cds-token-color-neutral-0, #fff)}:host([inverse].is-info),:host([status='info'].is-inverse),:host([inverse][status='info']){--color: var(--cds-token-color-action-400, #49aeda)}:host([inverse].is-success),:host([status='success'].is-inverse),:host([inverse][status='success']){--color: var(--cds-token-color-success-400, #5eb715)}:host(.is-inverse.is-error),:host(.is-inverse.is-danger),:host([status='danger'].is-inverse),:host([inverse].is-error),:host([inverse].is-danger),:host([inverse][status='danger']){--color: var(--cds-token-color-danger-700, #db2100)}:host(.is-inverse.is-warning),:host([status='warning'].is-inverse),:host([inverse].is-warning),:host([inverse][status='warning']){--color: var(--cds-token-color-warning-500, #efc006)}:host([dir='up']) svg,:host([direction='up']) svg{transform:rotate(0deg)}:host([dir='down']) svg,:host([direction='down']) svg{transform:rotate(180deg)}:host([dir='right']) svg,:host([direction='right']) svg{transform:rotate(90deg)}:host([dir='left']) svg,:host([direction='left']) svg{transform:rotate(270deg)}:host([flip='horizontal']) svg{transform:scale(-1) rotateX(180deg)}:host([flip='vertical']) svg{transform:scale(-1) rotateY(180deg)}.clr-i-badge,.clr-i-alert{fill:var(--badge-color, var(--cds-token-color-danger-700, #db2100))}:host .clr-i-solid,:host .clr-i-solid--badged,:host .clr-i-solid--alerted{display:none}:host .clr-i-outline--alerted:not(.clr-i-outline),:host .clr-i-outline--badged:not(.clr-i-outline){display:none}:host([class*='has-badge']) .can-badge .clr-i-outline--badged,:host([badge]) .can-badge .clr-i-outline--badged{display:block}:host([class*='has-badge']) .can-badge .clr-i-outline:not(.clr-i-outline--badged),:host([badge]) .can-badge .clr-i-outline:not(.clr-i-outline--badged){display:none}:host([class*='has-alert']) .can-alert .clr-i-outline--alerted,:host([badge$='triangle']) .can-alert .clr-i-outline--alerted{display:block}:host([class*='has-alert']) .can-alert .clr-i-outline--badged,:host([class*='has-alert']) .can-alert .clr-i-outline:not(.clr-i-outline--alerted),:host([badge$='triangle']) .can-alert .clr-i-outline--badged,:host([badge$='triangle']) .can-alert .clr-i-outline:not(.clr-i-outline--alerted){display:none}:host(.is-solid) .has-solid .clr-i-solid,:host([solid]) .has-solid .clr-i-solid{display:block}:host(.is-solid) .has-solid .clr-i-outline,:host(.is-solid) .has-solid .clr-i-outline--badged,:host([solid]) .has-solid .clr-i-outline,:host([solid]) .has-solid .clr-i-outline--badged{display:none}:host(.is-solid) .has-solid .clr-i-solid--alerted:not(.clr-i-solid),:host(.is-solid) .has-solid .clr-i-solid--badged:not(.clr-i-solid),:host([solid]) .has-solid .clr-i-solid--alerted:not(.clr-i-solid),:host([solid]) .has-solid .clr-i-solid--badged:not(.clr-i-solid){display:none}:host(.is-solid[class*='has-badge']) .can-badge.has-solid .clr-i-solid--badged,:host([solid].has-badge) .can-badge.has-solid .clr-i-solid--badged,:host([badge].is-solid) .can-badge.has-solid .clr-i-solid--badged,:host([badge][solid]) .can-badge.has-solid .clr-i-solid--badged{display:block}:host(.is-solid[class*='has-badge']) .can-badge.has-solid .clr-i-outline,:host(.is-solid[class*='has-badge']) .can-badge.has-solid .clr-i-outline--badged,:host(.is-solid[class*='has-badge']) .can-badge.has-solid .clr-i-solid:not(.clr-i-solid--badged),:host([solid].has-badge) .can-badge.has-solid .clr-i-outline,:host([solid].has-badge) .can-badge.has-solid .clr-i-outline--badged,:host([solid].has-badge) .can-badge.has-solid .clr-i-solid:not(.clr-i-solid--badged),:host([badge].is-solid) .can-badge.has-solid .clr-i-outline,:host([badge].is-solid) .can-badge.has-solid .clr-i-outline--badged,:host([badge].is-solid) .can-badge.has-solid .clr-i-solid:not(.clr-i-solid--badged),:host([badge][solid]) .can-badge.has-solid .clr-i-outline,:host([badge][solid]) .can-badge.has-solid .clr-i-outline--badged,:host([badge][solid]) .can-badge.has-solid .clr-i-solid:not(.clr-i-solid--badged){display:none}:host(.is-solid[class*='has-alert']) .can-alert.has-solid .clr-i-solid--alerted,:host([solid].has-alert) .can-alert.has-solid .clr-i-solid--alerted,:host([badge$='triangle'].is-solid) .can-alert.has-solid .clr-i-solid--alerted,:host([solid][badge$='triangle']) .can-alert.has-solid .clr-i-solid--alerted{display:block}:host(.is-solid[class*='has-alert']) .can-alert.has-solid .clr-i-outline,:host(.is-solid[class*='has-alert']) .can-alert.has-solid .clr-i-outline--alerted,:host(.is-solid[class*='has-alert']) .can-alert.has-solid .clr-i-solid--badged,:host(.is-solid[class*='has-alert']) .can-alert.has-solid .clr-i-solid:not(.clr-i-solid--alerted),:host([solid].has-alert) .can-alert.has-solid .clr-i-outline,:host([solid].has-alert) .can-alert.has-solid .clr-i-outline--alerted,:host([solid].has-alert) .can-alert.has-solid .clr-i-solid--badged,:host([solid].has-alert) .can-alert.has-solid .clr-i-solid:not(.clr-i-solid--alerted),:host([badge$='triangle'].is-solid) .can-alert.has-solid .clr-i-outline,:host([badge$='triangle'].is-solid) .can-alert.has-solid .clr-i-outline--alerted,:host([badge$='triangle'].is-solid) .can-alert.has-solid .clr-i-solid--badged,:host([badge$='triangle'].is-solid) .can-alert.has-solid .clr-i-solid:not(.clr-i-solid--alerted),:host([solid][badge$='triangle']) .can-alert.has-solid .clr-i-outline,:host([solid][badge$='triangle']) .can-alert.has-solid .clr-i-outline--alerted,:host([solid][badge$='triangle']) .can-alert.has-solid .clr-i-solid--badged,:host([solid][badge$='triangle']) .can-alert.has-solid .clr-i-solid:not(.clr-i-solid--alerted){display:none}:host(.has-badge--success),:host([badge='success']){--badge-color: var(--cds-token-color-success-700, #3c8500)}:host(.has-badge--danger),:host(.has-badge--error),:host([badge='danger']){--badge-color: var(--cds-token-color-danger-700, #db2100)}:host([badge='warning']){--badge-color: var(--cds-token-color-warning-900, #8f5a00)}:host([badge='inherit']){--badge-color: inherit}:host(.has-badge--info),:host([badge='info']){--badge-color: var(--cds-token-color-action-600, #0072a3)}:host(.has-alert),:host([badge$='triangle']){--badge-color: var(--cds-token-color-warning-800, #ad7600)}:host([badge='inherit-triangle']){--badge-color: inherit}:host([badge][inverse]),:host([badge].is-inverse),:host(.has-badge--danger[inverse]),:host(.has-badge--error[inverse]),:host(.has-badge--danger.is-inverse),:host(.has-badge--error.is-inverse){--badge-color: var(--cds-token-color-danger-500, #f35e44)}:host([inverse].is-highlight),:host(.is-highlight.is-inverse){--color: var(--cds-token-color-action-400, #49aeda)}:host([badge='success'][inverse]),:host([inverse].has-badge--success),:host([badge='success'].is-inverse),:host(.has-badge--success.is-inverse){--badge-color: var(--cds-token-color-success-400, #5eb715)}:host([badge='inherit'][inverse]){--badge-color: inherit}:host([badge='warning'][inverse]){--badge-color: var(--cds-token-color-warning-500, #efc006)}:host([badge='info'][inverse]),:host(.has-badge--info[inverse]),:host([badge='info'].is-inverse),:host(.has-badge--info.is-inverse){--badge-color: var(--cds-token-color-action-400, #49aeda)}:host([badge$='triangle'][inverse]),:host(.has-alert[inverse]),:host(.is-inverse[badge$='triangle']),:host(.has-alert.is-inverse){--badge-color: var(--cds-token-color-warning-500, #efc006)}:host([badge='inherit-triangle'][inverse]){--badge-color: inherit}:host(.anchored-icon){--color: inherit}
`;

// node_modules/@clr/core/node_modules/ramda/es/max.js
var max = _curry2(function max2(a, b) {
  return b > a ? b : a;
});
var max_default = max;

// node_modules/@clr/core/node_modules/ramda/es/internal/_map.js
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}

// node_modules/@clr/core/node_modules/ramda/es/internal/_xmap.js
var XMap = function() {
  function XMap2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap2.prototype["@@transducer/init"] = xfBase_default.init;
  XMap2.prototype["@@transducer/result"] = xfBase_default.result;
  XMap2.prototype["@@transducer/step"] = function(result, input) {
    return this.xf["@@transducer/step"](result, this.f(input));
  };
  return XMap2;
}();
var _xmap = _curry2(function _xmap2(f, xf) {
  return new XMap(f, xf);
});
var xmap_default = _xmap;

// node_modules/@clr/core/node_modules/ramda/es/map.js
var map = _curry2(
  _dispatchable(["fantasy-land/map", "map"], xmap_default, function map2(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
      case "[object Function]":
        return curryN_default(functor.length, function() {
          return fn.call(this, functor.apply(this, arguments));
        });
      case "[object Object]":
        return _reduce(function(acc, key) {
          acc[key] = fn(functor[key]);
          return acc;
        }, {}, keys_default(functor));
      default:
        return _map(fn, functor);
    }
  })
);
var map_default = map;

// node_modules/@clr/core/node_modules/ramda/es/prop.js
var prop = _curry2(function prop2(p, obj) {
  return path_default([p], obj);
});
var prop_default = prop;

// node_modules/@clr/core/node_modules/ramda/es/pluck.js
var pluck = _curry2(function pluck2(p, list) {
  return map_default(prop_default(p), list);
});
var pluck_default = pluck;

// node_modules/@clr/core/node_modules/ramda/es/internal/_curry3.js
function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a2, _c) {
          return fn(_a2, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function(_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a2, _b) {
          return fn(_a2, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a2, _c) {
          return fn(_a2, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function(_a2) {
          return fn(_a2, b, c);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function(_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

// node_modules/@clr/core/node_modules/ramda/es/reduce.js
var reduce = _curry3(_reduce);
var reduce_default = reduce;

// node_modules/@clr/core/node_modules/ramda/es/anyPass.js
var anyPass = _curry1(function anyPass2(preds) {
  return curryN_default(reduce_default(max_default, 0, pluck_default("length", preds)), function() {
    var idx = 0;
    var len = preds.length;
    while (idx < len) {
      if (preds[idx].apply(this, arguments)) {
        return true;
      }
      idx += 1;
    }
    return false;
  });
});
var anyPass_default = anyPass;

// node_modules/@clr/core/icon/utils/icon.has-shape.js
function iconHasBadgedShapes(icon391) {
  const shapeIsBadged = anyPass_default([existsIn(["outlineBadged"]), existsIn(["solidBadged"])]);
  return shapeIsBadged(icon391);
}
function iconHasAlertedShapes(icon391) {
  const shapeIsAlerted = anyPass_default([existsIn(["outlineAlerted"]), existsIn(["solidAlerted"])]);
  return shapeIsAlerted(icon391);
}
function iconHasSolidShapes(icon391) {
  const shapeIsSolid = anyPass_default([existsIn(["solid"]), existsIn(["solidBadged"]), existsIn(["solidAlerted"])]);
  return shapeIsSolid(icon391);
}

// node_modules/@clr/core/icon/utils/icon.classnames.js
var IconSvgClassnames;
(function(IconSvgClassnames2) {
  IconSvgClassnames2["Badged"] = "can-badge";
  IconSvgClassnames2["Alerted"] = "can-alert";
  IconSvgClassnames2["Solid"] = "has-solid";
})(IconSvgClassnames || (IconSvgClassnames = {}));
var IconDecorationClassnames;
(function(IconDecorationClassnames2) {
  IconDecorationClassnames2["Badge"] = "clr-i-badge";
  IconDecorationClassnames2["Alert"] = "clr-i-alert";
})(IconDecorationClassnames || (IconDecorationClassnames = {}));
var IconShapeClassnames;
(function(IconShapeClassnames2) {
  IconShapeClassnames2["Outline"] = "outline";
  IconShapeClassnames2["Solid"] = "solid";
  IconShapeClassnames2["OutlineBadged"] = "outline--badged";
  IconShapeClassnames2["OutlineAlerted"] = "outline--alerted";
  IconShapeClassnames2["SolidBadged"] = "solid--badged";
  IconShapeClassnames2["SolidAlerted"] = "solid--alerted";
})(IconShapeClassnames || (IconShapeClassnames = {}));
function getShapeClassname(shapeType) {
  const classNamePrefix = "clr-i-";
  let className;
  switch (shapeType) {
    case "solid":
      className = `${classNamePrefix}${IconShapeClassnames.Solid}`;
      break;
    case "outlineBadged":
      className = `${classNamePrefix}${IconShapeClassnames.OutlineBadged}`;
      break;
    case "outlineAlerted":
      className = `${classNamePrefix}${IconShapeClassnames.OutlineAlerted}`;
      break;
    case "solidBadged":
      className = `${classNamePrefix}${IconShapeClassnames.SolidBadged}`;
      break;
    case "solidAlerted":
      className = `${classNamePrefix}${IconShapeClassnames.SolidAlerted}`;
      break;
    default:
      className = `${classNamePrefix}${IconShapeClassnames.Outline}`;
      break;
  }
  return className;
}
var IconTshirtSizes;
(function(IconTshirtSizes2) {
  IconTshirtSizes2["ExtraSmall"] = "xs";
  IconTshirtSizes2["Small"] = "sm";
  IconTshirtSizes2["Medium"] = "md";
  IconTshirtSizes2["Large"] = "lg";
  IconTshirtSizes2["ExtraLarge"] = "xl";
  IconTshirtSizes2["ExtraExtraLarge"] = "xxl";
})(IconTshirtSizes || (IconTshirtSizes = {}));
var iconTshirtSizeClassnamePrefix = "clr-i-size-";
function getIconTshirtSizeClassname(sizeToLookup, prefix = iconTshirtSizeClassnamePrefix, sizes = IconTshirtSizes) {
  const tshirtSizesVals = getEnumValues(sizes);
  const indexOfSize = tshirtSizesVals.indexOf(sizeToLookup);
  if (indexOfSize > -1) {
    return prefix + tshirtSizesVals[indexOfSize];
  }
  return "";
}
function getAllIconTshirtSizeClassnames(prefix = iconTshirtSizeClassnamePrefix, sizes = IconTshirtSizes) {
  return getEnumValues(sizes).map((sz) => prefix + sz);
}
function isIconTshirtSizeClassname(classname, sizes = IconTshirtSizes) {
  return getEnumValues(sizes).indexOf(classname) > -1;
}
function getIconSvgClasses(icon391) {
  const testSolid = (i) => iconHasSolidShapes(i) ? IconSvgClassnames.Solid : "";
  const testBadged = (i) => iconHasBadgedShapes(i) ? IconSvgClassnames.Badged : "";
  const testAlerted = (i) => iconHasAlertedShapes(i) ? IconSvgClassnames.Alerted : "";
  const tests = [testSolid, testBadged, testAlerted];
  return transformToSpacedString(tests, icon391);
}
var SizeUpdateStrategies;
(function(SizeUpdateStrategies2) {
  SizeUpdateStrategies2["BadSizeValue"] = "bad-value";
  SizeUpdateStrategies2["ValidSizeString"] = "value-is-string";
  SizeUpdateStrategies2["ValidNumericString"] = "value-is-numeric";
  SizeUpdateStrategies2["NilSizeValue"] = "value-is-nil";
})(SizeUpdateStrategies || (SizeUpdateStrategies = {}));
function getUpdateSizeStrategy(size) {
  if (isNil_default(size) || size === "") {
    return SizeUpdateStrategies.NilSizeValue;
  }
  if (isString(size) && isIconTshirtSizeClassname(size)) {
    return SizeUpdateStrategies.ValidSizeString;
  }
  if (!isNaN(parseInt(size, 10))) {
    return SizeUpdateStrategies.ValidNumericString;
  }
  return SizeUpdateStrategies.BadSizeValue;
}
function updateIconSizeStyleOrClassnames(el, size) {
  const updateStrategy = getUpdateSizeStrategy(size);
  const newTshirtSize = getIconTshirtSizeClassname(size);
  switch (updateStrategy) {
    case SizeUpdateStrategies.ValidNumericString:
      updateElementStyles(el, ["width", `${size}px`], ["height", `${size}px`]);
      removeClassnames(el, ...getAllIconTshirtSizeClassnames());
      return;
    case SizeUpdateStrategies.ValidSizeString:
      addClassnames(el, newTshirtSize);
      removeClassnamesUnless(el, getAllIconTshirtSizeClassnames(), [newTshirtSize]);
      updateElementStyles(el, ["width", ""], ["height", ""]);
      return;
    case SizeUpdateStrategies.NilSizeValue:
      removeClassnames(el, ...getAllIconTshirtSizeClassnames());
      updateElementStyles(el, ["width", ""], ["height", ""]);
      return;
    case SizeUpdateStrategies.BadSizeValue:
      return;
    default:
      return;
  }
}

// node_modules/@clr/core/icon/utils/icon.svg-helpers.js
function getBadgeSvg(shapeClassname) {
  return [
    '<circle cx="30" cy="6" r="5"  class="',
    [shapeClassname, IconDecorationClassnames.Badge].join(" "),
    '" />'
  ].join("");
}
function getAlertSvg(shapeClassname) {
  return [
    '<path d="M26.85,1.14,21.13,11A1.28,1.28,0,0,0,22.23,13H33.68A1.28,1.28,0,0,0,34.78,11L29.06,1.14A1.28,1.28,0,0,0,26.85,1.14Z" class="',
    [shapeClassname, IconDecorationClassnames.Alert].join(" "),
    '"/>'
  ].join("");
}
function decorateSvgWithClassnames(shapeName, shapeSvg) {
  const shapeClassname = getShapeClassname(shapeName);
  let transformedSvg = shapeSvg.split("/>").join(` class="${shapeClassname}"/>`);
  switch (shapeName) {
    case "solidBadged":
    case "outlineBadged":
      transformedSvg = transformedSvg.concat(getBadgeSvg(shapeClassname));
      break;
    case "solidAlerted":
    case "outlineAlerted":
      transformedSvg = transformedSvg.concat(getAlertSvg(shapeClassname));
      break;
    default:
      break;
  }
  return transformedSvg;
}
function getIconSvgOpeningTag(icon391) {
  const iconSvgViewboxSize = 36;
  const iconSvgClasses = getIconSvgClasses(icon391);
  return `<svg version="1.1" class="${iconSvgClasses}" viewBox="0 0 ${iconSvgViewboxSize} ${iconSvgViewboxSize}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" role="img" aria-label="">`;
}
function getIconSvgClosingTag(icon391) {
  const makeTypescriptHappy = icon391;
  return makeTypescriptHappy ? "</svg>" : "</svg>";
}

// node_modules/@clr/core/icon/icon.renderer.js
function getInnerSvgFromShapes(iconShapes) {
  const renderFns = [];
  for (const shape in iconShapes) {
    if (iconShapes.hasOwnProperty(shape)) {
      renderFns.push(() => decorateSvgWithClassnames(shape, iconShapes[shape]));
    }
  }
  return renderFns;
}
function renderIconFromString(icon391) {
  return icon391;
}
function renderIconFromShapes(icon391) {
  let iconRender = [getIconSvgOpeningTag];
  iconRender = iconRender.concat(getInnerSvgFromShapes(icon391));
  iconRender.push(getIconSvgClosingTag);
  return transformToUnspacedString(iconRender, icon391);
}
function renderIcon(shapeOrStringIcon) {
  if (isString(shapeOrStringIcon)) {
    return renderIconFromString(shapeOrStringIcon);
  }
  return renderIconFromShapes(shapeOrStringIcon);
}

// node_modules/@clr/core/icon/shapes/unknown.js
var icon = {
  outline: '<circle cx="18" cy="26.06" r="1.33"/><path d="M18,22.61a1,1,0,0,1-1-1v-12a1,1,0,1,1,2,0v12A1,1,0,0,1,18,22.61Z"/><path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"/>',
  solid: '<path d="M18,2.1a16,16,0,1,0,16,16A16,16,0,0,0,18,2.1ZM16.6,8.8a1.4,1.4,0,0,1,2.8,0v12a1.4,1.4,0,0,1-2.8,0ZM18,28.6a1.8,1.8,0,1,1,1.8-1.8A1.8,1.8,0,0,1,18,28.6Z"/>'
};
var unknownIconName = "unknown";
var unknownIcon = [unknownIconName, renderIcon(icon)];

// node_modules/@clr/core/node_modules/ramda/es/hasPath.js
var hasPath = _curry2(function hasPath2(_path, obj) {
  if (_path.length === 0 || isNil_default(obj)) {
    return false;
  }
  var val = obj;
  var idx = 0;
  while (idx < _path.length) {
    if (!isNil_default(val) && _has(_path[idx], val)) {
      val = val[_path[idx]];
      idx += 1;
    } else {
      return false;
    }
  }
  return true;
});
var hasPath_default = hasPath;

// node_modules/@clr/core/node_modules/ramda/es/has.js
var has = _curry2(function has2(prop3, obj) {
  return hasPath_default([prop3], obj);
});
var has_default = has;

// node_modules/@clr/core/icon/utils/icon.service-helpers.js
function addIcons(shapes, registry) {
  shapes.forEach((s) => {
    addIcon(s, registry);
  });
}
function hasIcon(shapeName, registry) {
  return has_default(shapeName, registry);
}
function getIcon(shapeName, registry) {
  return registry[shapeName] ? registry[shapeName] : registry.unknown;
}
function addIconToRegistry(shape, registry) {
  const [shapeName, template] = shape;
  registry[shapeName] = renderIcon(template);
}
function addIcon(shape, registry) {
  const [shapeName] = shape;
  if (!hasIcon(shapeName, registry)) {
    addIconToRegistry(shape, registry);
  }
}
function setIconAlias(shapeName, aliasName, registry) {
  if (existsIn([shapeName], registry)) {
    Object.defineProperty(registry, aliasName, {
      get: () => {
        return registry[shapeName];
      },
      enumerable: true,
      configurable: true
    });
  }
}
function setIconAliases(iconAlias, registry) {
  if (registry[iconAlias[0]]) {
    iconAlias[1].forEach((a) => {
      setIconAlias(iconAlias[0], a, registry);
    });
  }
}
function legacyAlias(aliases, registry) {
  for (const shapeNameKey in aliases) {
    if (aliases.hasOwnProperty(shapeNameKey)) {
      if (registry.hasOwnProperty(shapeNameKey)) {
        setIconAliases([shapeNameKey, aliases[shapeNameKey]], registry);
      } else {
        throw new Error(`An icon "${shapeNameKey}" you are trying to set aliases to doesn't exist in Clarity Icons.`);
      }
    }
  }
}

// node_modules/@clr/core/icon/icon.service.js
var iconRegistry = {
  unknown: unknownIcon[1]
};
var ClarityIcons = class {
  /**
   * registry() returns a clone of the icon registry, not the actual registry itself.
   * Performing actions on the return value of registry() will not be reflected in the
   * actual iconsRegistry
   */
  static get registry() {
    return Object.assign({}, iconRegistry);
  }
  static addIcons(...shapes) {
    addIcons(shapes, iconRegistry);
  }
  static addAliases(...aliases) {
    aliases.forEach((alias) => setIconAliases(alias, iconRegistry));
  }
  static getIconNameFromShape(iconShape) {
    return iconShape[0];
  }
  /** @deprecated legacy API */
  static get(shapeName) {
    return shapeName ? getIcon(shapeName, iconRegistry) : Object.assign({}, iconRegistry);
  }
  /** @deprecated legacy API */
  static add(shapes) {
    for (const shapeName in shapes) {
      if (shapes.hasOwnProperty(shapeName)) {
        addIcon([shapeName, shapes[shapeName]], iconRegistry);
      }
    }
  }
  /** @deprecated legacy API */
  static alias(alias) {
    legacyAlias(alias, iconRegistry);
  }
};

// node_modules/@clr/core/icon/icon.element.js
var CdsIcon = class extends LitElement {
  constructor() {
    super(...arguments);
    this.solid = false;
    this.status = "";
    this.inverse = false;
    this.innerOffset = 0;
  }
  static get styles() {
    return [styles, styles2];
  }
  get shape() {
    return hasIcon(this._shape, ClarityIcons.registry) ? this._shape : "unknown";
  }
  /**
   * Changes the svg glyph displayed in the icon component. Defaults to the 'unknown' icon if
   * the specified icon cannot be found in the icon registry.
   */
  set shape(val) {
    if (hasStringPropertyChangedAndNotNil(val, this._shape)) {
      const oldVal = this._shape;
      this._shape = val;
      this.requestUpdate("shape", oldVal);
    }
  }
  get size() {
    return this._size;
  }
  /**
   * @type {string | sm | md | lg | xl | xxl}
   * Apply numerical width-height or a t-shirt-sized CSS classname
   */
  set size(val) {
    if (hasStringPropertyChanged(val, this._size)) {
      const oldVal = this._size;
      this._size = val;
      updateIconSizeStyleOrClassnames(this, val);
      this.requestUpdate("size", oldVal);
    }
  }
  firstUpdated(props) {
    super.firstUpdated(props);
    this.updateSVGAriaLabel();
  }
  updated(props) {
    if (props.has("title")) {
      this.updateSVGAriaLabel();
    }
    if (props.has("innerOffset") && this.innerOffset > 0) {
      const dimension = `calc(100% + ${this.innerOffset * 2}px)`;
      this.svg.style.width = dimension;
      this.svg.style.height = dimension;
      this.svg.style.margin = `-${this.innerOffset} 0 0 -${this.innerOffset}`;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "none");
  }
  render() {
    return html`
      <span .innerHTML="${ClarityIcons.registry[this.shape]}"></span>
      ${this.title ? html`<span id="${this.idForAriaLabel}" cds-layout="display:screen-reader-only">${this.title}</span>` : ""}
    `;
  }
  updateSVGAriaLabel() {
    if (this.title) {
      this.svg.removeAttribute("aria-label");
      this.svg.setAttribute("aria-labelledby", this.idForAriaLabel);
    } else {
      this.svg.removeAttribute("aria-labelledby");
    }
  }
};
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "shape", null);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "size", null);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "title", void 0);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "dir", void 0);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "direction", void 0);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "flip", void 0);
__decorate([
  property2({ type: Boolean })
], CdsIcon.prototype, "solid", void 0);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "status", void 0);
__decorate([
  property2({ type: Boolean })
], CdsIcon.prototype, "inverse", void 0);
__decorate([
  property2({ type: String })
], CdsIcon.prototype, "badge", void 0);
__decorate([
  internalProperty({ type: Number, reflect: true })
], CdsIcon.prototype, "innerOffset", void 0);
__decorate([
  query("svg")
], CdsIcon.prototype, "svg", void 0);
__decorate([
  id()
], CdsIcon.prototype, "idForAriaLabel", void 0);

// node_modules/@clr/core/icon/shapes/angle.js
var icon2 = {
  outline: '<path d="M29.52,22.52,18,10.6,6.48,22.52a1.7,1.7,0,0,0,2.45,2.36L18,15.49l9.08,9.39a1.7,1.7,0,0,0,2.45-2.36Z"/>'
};
var angleIconName = "angle";
var angleIcon = [angleIconName, renderIcon(icon2)];

// node_modules/@clr/core/icon/shapes/angle-double.js
var icon3 = {
  outline: '<path d="M29,19.41a1,1,0,0,1-.71-.29L18,8.83,7.71,19.12a1,1,0,0,1-1.41-1.41L18,6,29.71,17.71A1,1,0,0,1,29,19.41Z"/><path d="M29,30.41a1,1,0,0,1-.71-.29L18,19.83,7.71,30.12a1,1,0,0,1-1.41-1.41L18,17,29.71,28.71A1,1,0,0,1,29,30.41Z"/>'
};
var angleDoubleIconName = "angle-double";
var angleDoubleIcon = [angleDoubleIconName, renderIcon(icon3)];

// node_modules/@clr/core/icon/shapes/arrow.js
var icon4 = {
  outline: '<path d="M27.66,15.61,18,6,8.34,15.61A1,1,0,1,0,9.75,17L17,9.81V28.94a1,1,0,1,0,2,0V9.81L26.25,17a1,1,0,0,0,1.41-1.42Z"/>'
};
var arrowIconName = "arrow";
var arrowIcon = [arrowIconName, renderIcon(icon4)];

// node_modules/@clr/core/icon/shapes/bars.js
var icon5 = {
  outline: '<path d="M32,29H4a1,1,0,0,1,0-2H32a1,1,0,0,1,0,2Z"/><path d="M32,19H4a1,1,0,0,1,0-2H32a1,1,0,0,1,0,2Z"/><path d="M32,9H4A1,1,0,0,1,4,7H32a1,1,0,0,1,0,2Z"/>'
};
var barsIconName = "bars";
var barsIcon = [barsIconName, renderIcon(icon5)];

// node_modules/@clr/core/icon/shapes/bell.js
var icon6 = {
  outline: '<path d="M32.51,27.83A14.4,14.4,0,0,1,30,24.9a12.63,12.63,0,0,1-1.35-4.81V15.15A10.81,10.81,0,0,0,19.21,4.4V3.11a1.33,1.33,0,1,0-2.67,0V4.42A10.81,10.81,0,0,0,7.21,15.15v4.94A12.63,12.63,0,0,1,5.86,24.9a14.4,14.4,0,0,1-2.47,2.93,1,1,0,0,0-.34.75v1.36a1,1,0,0,0,1,1h27.8a1,1,0,0,0,1-1V28.58A1,1,0,0,0,32.51,27.83ZM5.13,28.94a16.17,16.17,0,0,0,2.44-3,14.24,14.24,0,0,0,1.65-5.85V15.15a8.74,8.74,0,1,1,17.47,0v4.94a14.24,14.24,0,0,0,1.65,5.85,16.17,16.17,0,0,0,2.44,3Z"/><path d="M18,34.28A2.67,2.67,0,0,0,20.58,32H15.32A2.67,2.67,0,0,0,18,34.28Z"/>',
  outlineBadged: '<path d="M18,34.28A2.67,2.67,0,0,0,20.58,32H15.32A2.67,2.67,0,0,0,18,34.28Z"/><path d="M32.51,27.83A14.4,14.4,0,0,1,30,24.9a12.63,12.63,0,0,1-1.35-4.81V15.15a10.92,10.92,0,0,0-.16-1.79,7.44,7.44,0,0,1-2.24-.84,8.89,8.89,0,0,1,.4,2.64v4.94a14.24,14.24,0,0,0,1.65,5.85,16.17,16.17,0,0,0,2.44,3H5.13a16.17,16.17,0,0,0,2.44-3,14.24,14.24,0,0,0,1.65-5.85V15.15A8.8,8.8,0,0,1,18,6.31a8.61,8.61,0,0,1,4.76,1.44A7.49,7.49,0,0,1,22.5,6c0-.21,0-.42,0-.63a10.58,10.58,0,0,0-3.32-1V3.11a1.33,1.33,0,1,0-2.67,0V4.42A10.81,10.81,0,0,0,7.21,15.15v4.94A12.63,12.63,0,0,1,5.86,24.9a14.4,14.4,0,0,1-2.47,2.93,1,1,0,0,0-.34.75v1.36a1,1,0,0,0,1,1h27.8a1,1,0,0,0,1-1V28.58A1,1,0,0,0,32.51,27.83Z"/>',
  solid: '<path d="M32.85,28.13l-.34-.3A14.37,14.37,0,0,1,30,24.9a12.63,12.63,0,0,1-1.35-4.81V15.15A10.81,10.81,0,0,0,19.21,4.4V3.11a1.33,1.33,0,1,0-2.67,0V4.42A10.81,10.81,0,0,0,7.21,15.15v4.94A12.63,12.63,0,0,1,5.86,24.9a14.4,14.4,0,0,1-2.47,2.93l-.34.3v2.82H32.85Z"/><path d="M15.32,32a2.65,2.65,0,0,0,5.25,0Z"/>',
  solidBadged: '<path d="M18,34.28A2.67,2.67,0,0,0,20.58,32H15.32A2.67,2.67,0,0,0,18,34.28Z"/><path d="M32.85,28.13l-.34-.3A14.37,14.37,0,0,1,30,24.9a12.63,12.63,0,0,1-1.35-4.81V15.15a10.92,10.92,0,0,0-.16-1.79A7.5,7.5,0,0,1,22.5,6c0-.21,0-.42,0-.63a10.57,10.57,0,0,0-3.32-1V3.11a1.33,1.33,0,1,0-2.67,0V4.42A10.81,10.81,0,0,0,7.21,15.15v4.94A12.63,12.63,0,0,1,5.86,24.9a14.4,14.4,0,0,1-2.47,2.93l-.34.3v2.82H32.85Z"/>'
};
var bellIconName = "bell";
var bellIcon = [bellIconName, renderIcon(icon6)];

// node_modules/@clr/core/icon/shapes/calendar.js
var icon7 = {
  outline: '<path d="M32.25,6H29V8h3V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6Z"/><rect x="8" y="14" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><rect x="20" y="14" width="2" height="2"/><rect x="26" y="14" width="2" height="2"/><rect x="8" y="19" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/><rect x="20" y="19" width="2" height="2"/><rect x="26" y="19" width="2" height="2"/><rect x="8" y="24" width="2" height="2"/><rect" x="14" y="24" width="2" height="2"/><rect x="20" y="24" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"/><rect x="13" y="6" width="10" height="2"/>',
  outlineAlerted: '<path d="M33.68,15.4H32V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V15.38Z"/><rect x="8" y="14" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><rect x="8" y="19" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/><rect x="20" y="19" width="2" height="2"/><rect x="26" y="19" width="2" height="2"/><rect x="8" y="24" width="2" height="2"/><rect x="14" y="24" width="2" height="2"/><rect x="20" y="24" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><polygon points="21.29 6 13 6 13 8 20.14 8 21.29 6"/>',
  outlineBadged: '<path d="M32,13.22V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V12.34A7.45,7.45,0,0,1,32,13.22Z"/><rect x="8" y="14" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><rect x="20" y="14" width="2" height="2"/><rect x="26" y="14" width="2" height="2"/><rect x="8" y="19" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/><rect x="20" y="19" width="2" height="2"/><rect x="26" y="19" width="2" height="2"/><rect x="8" y="24" width="2" height="2"/><rect x="14" y="24" width="2" height="2"/><rect x="20" y="24" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M22.5,6H13V8h9.78A7.49,7.49,0,0,1,22.5,6Z"/>',
  solid: '<path d="M32.25,6h-4V9a2.2,2.2,0,1,1-4.4,0V6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6ZM10,26H8V24h2Zm0-5H8V19h2Zm0-5H8V14h2Zm6,10H14V24h2Zm0-5H14V19h2Zm0-5H14V14h2Zm6,10H20V24h2Zm0-5H20V19h2Zm0-5H20V14h2Zm6,10H26V24h2Zm0-5H26V19h2Zm0-5H26V14h2Z"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"/>',
  solidAlerted: '<path d="M33.68,15.4H22.23A3.68,3.68,0,0,1,19,9.89L21.29,6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V15.38ZM10,26H8V24h2Zm0-5H8V19h2Zm0-5H8V14h2Zm6,10H14V24h2Zm0-5H14V19h2Zm0-5H14V14h2Zm6,10H20V24h2Zm0-5H20V19h2Zm6,5H26V24h2Zm0-5H26V19h2Z"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/>',
  solidBadged: '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M30,13.5A7.5,7.5,0,0,1,22.5,6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V12.34A7.45,7.45,0,0,1,30,13.5ZM10,26H8V24h2Zm0-5H8V19h2Zm0-5H8V14h2Zm6,10H14V24h2Zm0-5H14V19h2Zm0-5H14V14h2Zm6,10H20V24h2Zm0-5H20V19h2Zm0-5H20V14h2Zm6,10H26V24h2Zm0-5H26V19h2Zm0-5H26V14h2Z"/>'
};
var calendarIconName = "calendar";
var calendarIcon = [calendarIconName, renderIcon(icon7)];

// node_modules/@clr/core/icon/shapes/check.js
var icon8 = {
  outline: '<path d="M13.72,27.69,3.29,17.27a1,1,0,0,1,1.41-1.41l9,9L31.29,7.29a1,1,0,0,1,1.41,1.41Z"/>'
};
var checkIconName = "check";
var checkIcon = [checkIconName, renderIcon(icon8)];

// node_modules/@clr/core/icon/shapes/check-circle.js
var icon9 = {
  outline: '<path d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm0,22A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/><path d="M16.34,23.74l-5-5a1,1,0,0,1,1.41-1.41l3.59,3.59,6.78-6.78a1,1,0,0,1,1.41,1.41Z"/>',
  solid: '<path d="M30,18A12,12,0,1,1,18,6,12,12,0,0,1,30,18Zm-4.77-2.16a1.4,1.4,0,0,0-2-2l-6.77,6.77L13,17.16a1.4,1.4,0,0,0-2,2l5.45,5.45Z"/>'
};
var checkCircleIconName = "check-circle";
var checkCircleIcon = [checkCircleIconName, renderIcon(icon9)];

// node_modules/@clr/core/icon/shapes/cloud.js
var icon10 = {
  outline: '<path d="M27.14,33H10.62C5.67,33,1,28.19,1,23.1a10,10,0,0,1,8-9.75,10.19,10.19,0,0,1,20.33,1.06A10.07,10.07,0,0,1,29,16.66a8.29,8.29,0,0,1,6,8C35,29.1,31.33,33,27.14,33ZM19.09,6.23a8.24,8.24,0,0,0-8.19,8l0,.87-.86.1A7.94,7.94,0,0,0,3,23.1c0,4,3.77,7.9,7.62,7.9H27.14C30.21,31,33,28,33,24.65a6.31,6.31,0,0,0-5.37-6.26l-1.18-.18.39-1.13A8.18,8.18,0,0,0,19.09,6.23Z"/>',
  outlineAlerted: '<path d="M29,16.66a10.14,10.14,0,0,0,.2-1.3h-2a8.28,8.28,0,0,1-.37,1.72l-.39,1.13,1.18.18a6.31,6.31,0,0,1,5.37,6.26C32.95,28,30.16,31,27.09,31H10.57c-3.84,0-7.62-3.91-7.62-7.9a7.94,7.94,0,0,1,7-7.89l.86-.1,0-.87A8.16,8.16,0,0,1,21,6.47l1-1.8A10.19,10.19,0,0,0,8.91,13.36a10,10,0,0,0-8,9.75c0,5.09,4.67,9.9,9.62,9.9H27.09c4.19,0,7.86-3.9,7.86-8.35A8.29,8.29,0,0,0,29,16.66Z"/>',
  outlineBadged: '<path d="M29,16.66a10.07,10.07,0,0,0,.25-2.24c0-.33,0-.65,0-1a7.45,7.45,0,0,1-2.1-.54,8,8,0,0,1-.3,4.16l-.39,1.13,1.18.18a6.31,6.31,0,0,1,5.37,6.26C32.95,28,30.16,31,27.09,31H10.57c-3.84,0-7.62-3.91-7.62-7.9a7.94,7.94,0,0,1,7-7.89l.86-.1,0-.87a8.24,8.24,0,0,1,8.19-8A8.13,8.13,0,0,1,22.58,7a7.53,7.53,0,0,1-.08-1,7.51,7.51,0,0,1,.09-1.12A10.13,10.13,0,0,0,19,4.23,10.26,10.26,0,0,0,8.91,13.36a10,10,0,0,0-8,9.75c0,5.09,4.67,9.9,9.62,9.9H27.09c4.19,0,7.86-3.9,7.86-8.35A8.29,8.29,0,0,0,29,16.66Z"/>',
  solid: '<path d="M29,16.66a10.07,10.07,0,0,0,.25-2.24A10.19,10.19,0,0,0,8.91,13.36,10,10,0,0,0,1,23.1C1,28.19,5.62,33,10.57,33H27.09C31.28,33,35,29.1,35,24.65A8.29,8.29,0,0,0,29,16.66Z"/>',
  solidAlerted: '<path d="M29,16.66a10.15,10.15,0,0,0,.2-1.26h-7A3.68,3.68,0,0,1,19,9.89l3-5.21A10.19,10.19,0,0,0,8.91,13.36,10,10,0,0,0,1,23.1C1,28.19,5.62,33,10.57,33H27.09C31.28,33,35,29.1,35,24.65A8.29,8.29,0,0,0,29,16.66Z"/>',
  solidBadged: '<path d="M29,16.66a10.07,10.07,0,0,0,.25-2.24c0-.33,0-.65,0-1a7.44,7.44,0,0,1-6.6-8.58A10.13,10.13,0,0,0,19,4.23,10.26,10.26,0,0,0,8.91,13.36,10,10,0,0,0,1,23.1C1,28.19,5.62,33,10.57,33H27.09C31.28,33,35,29.1,35,24.65A8.29,8.29,0,0,0,29,16.66Z"/>'
};
var cloudIconName = "cloud";
var cloudIcon = [cloudIconName, renderIcon(icon10)];

// node_modules/@clr/core/icon/shapes/cog.js
var icon11 = {
  outline: '<path d="M18.1,11c-3.9,0-7,3.1-7,7s3.1,7,7,7c3.9,0,7-3.1,7-7S22,11,18.1,11z M18.1,23c-2.8,0-5-2.2-5-5s2.2-5,5-5c2.8,0,5,2.2,5,5S20.9,23,18.1,23z"/><path d="M32.8,14.7L30,13.8l-0.6-1.5l1.4-2.6c0.3-0.6,0.2-1.4-0.3-1.9l-2.4-2.4c-0.5-0.5-1.3-0.6-1.9-0.3l-2.6,1.4l-1.5-0.6l-0.9-2.8C21,2.5,20.4,2,19.7,2h-3.4c-0.7,0-1.3,0.5-1.4,1.2L14,6c-0.6,0.1-1.1,0.3-1.6,0.6L9.8,5.2C9.2,4.9,8.4,5,7.9,5.5L5.5,7.9C5,8.4,4.9,9.2,5.2,9.8l1.3,2.5c-0.2,0.5-0.4,1.1-0.6,1.6l-2.8,0.9C2.5,15,2,15.6,2,16.3v3.4c0,0.7,0.5,1.3,1.2,1.5L6,22.1l0.6,1.5l-1.4,2.6c-0.3,0.6-0.2,1.4,0.3,1.9l2.4,2.4c0.5,0.5,1.3,0.6,1.9,0.3l2.6-1.4l1.5,0.6l0.9,2.9c0.2,0.6,0.8,1.1,1.5,1.1h3.4c0.7,0,1.3-0.5,1.5-1.1l0.9-2.9l1.5-0.6l2.6,1.4c0.6,0.3,1.4,0.2,1.9-0.3l2.4-2.4c0.5-0.5,0.6-1.3,0.3-1.9l-1.4-2.6l0.6-1.5l2.9-0.9c0.6-0.2,1.1-0.8,1.1-1.5v-3.4C34,15.6,33.5,14.9,32.8,14.7z M32,19.4l-3.6,1.1L28.3,21c-0.3,0.7-0.6,1.4-0.9,2.1l-0.3,0.5l1.8,3.3l-2,2l-3.3-1.8l-0.5,0.3c-0.7,0.4-1.4,0.7-2.1,0.9l-0.5,0.1L19.4,32h-2.8l-1.1-3.6L15,28.3c-0.7-0.3-1.4-0.6-2.1-0.9l-0.5-0.3l-3.3,1.8l-2-2l1.8-3.3l-0.3-0.5c-0.4-0.7-0.7-1.4-0.9-2.1l-0.1-0.5L4,19.4v-2.8l3.4-1l0.2-0.5c0.2-0.8,0.5-1.5,0.9-2.2l0.3-0.5L7.1,9.1l2-2l3.2,1.8l0.5-0.3c0.7-0.4,1.4-0.7,2.2-0.9l0.5-0.2L16.6,4h2.8l1.1,3.5L21,7.7c0.7,0.2,1.4,0.5,2.1,0.9l0.5,0.3l3.3-1.8l2,2l-1.8,3.3l0.3,0.5c0.4,0.7,0.7,1.4,0.9,2.1l0.1,0.5l3.6,1.1V19.4z"/>',
  outlineAlerted: '<path d="M33.7,15.4h-5.3v0.1l3.6,1.1v2.8l-3.6,1.1L28.3,21c-0.3,0.7-0.6,1.4-0.9,2.1l-0.3,0.5l1.8,3.3l-2,2l-3.3-1.8l-0.5,0.3c-0.7,0.4-1.4,0.7-2.1,0.9l-0.5,0.1L19.4,32h-2.8l-1.1-3.6L15,28.3c-0.7-0.3-1.4-0.6-2.1-0.9l-0.5-0.3l-3.3,1.8l-2-2l1.8-3.3l-0.3-0.5c-0.4-0.7-0.7-1.4-0.9-2.1l-0.1-0.5L4,19.4v-2.8l3.4-1l0.2-0.5c0.2-0.8,0.5-1.5,0.9-2.2l0.3-0.5L7.1,9.1l2-2l3.2,1.8l0.5-0.3c0.7-0.4,1.4-0.7,2.2-0.9l0.5-0.2L16.6,4h2.8l1.1,3.4l1.4-2.3l-0.6-2C21,2.4,20.4,2,19.7,2h-3.4c-0.7,0-1.3,0.5-1.4,1.2L14,6c-0.6,0.1-1.1,0.3-1.6,0.6L9.8,5.2C9.2,4.9,8.4,5,7.9,5.5L5.5,7.9C5,8.4,4.9,9.2,5.2,9.8l1.3,2.5c-0.2,0.5-0.4,1.1-0.6,1.6l-2.8,0.9C2.5,15,2,15.6,2,16.3v3.4c0,0.7,0.5,1.3,1.2,1.5L6,22.1l0.6,1.5l-1.4,2.6c-0.3,0.6-0.2,1.4,0.3,1.9l2.4,2.4c0.5,0.5,1.3,0.6,1.9,0.3l2.6-1.4l1.5,0.6l0.9,2.9c0.2,0.6,0.8,1.1,1.5,1.1h3.4c0.7,0,1.3-0.5,1.5-1.1l0.9-2.9l1.5-0.6l2.6,1.4c0.6,0.3,1.4,0.2,1.9-0.3l2.4-2.4c0.5-0.5,0.6-1.3,0.3-1.9l-1.4-2.6l0.6-1.5l2.9-0.9c0.6-0.2,1.1-0.8,1.1-1.5v-3.4C34,16,33.9,15.7,33.7,15.4z"/><path d="M18.1,23c-2.8,0-5-2.2-5-5s2.2-5,5-5c0.2,0,0.5,0,0.7,0.1c-0.2-0.6-0.3-1.3-0.2-2h-0.5c-3.9,0-7,3.1-7,7c0,3.9,3.1,7,7,7c3.9,0,7-3.1,7-7c0-0.9-0.2-1.8-0.5-2.6h-2.2c0.5,0.8,0.7,1.6,0.7,2.5C23.1,20.8,20.9,23,18.1,23z"/>',
  outlineBadged: '<path d="M11.1,18c0,3.9,3.1,7,7,7c3.9,0,7-3.1,7-7s-3.1-7-7-7C14.2,11,11.1,14.1,11.1,18z M23.1,18c0,2.8-2.2,5-5,5c-2.8,0-5-2.2-5-5s2.2-5,5-5C20.9,13,23.1,15.2,23.1,18z"/><path d="M32.8,14.7L30,13.8l-0.1-0.3c-0.8,0-1.6-0.2-2.4-0.4c0.3,0.6,0.6,1.3,0.8,1.9l0.1,0.5l3.6,1.1v2.8l-3.6,1.1L28.3,21c-0.3,0.7-0.6,1.4-0.9,2.1l-0.3,0.5l1.8,3.3l-2,2l-3.3-1.8l-0.5,0.3c-0.7,0.4-1.4,0.7-2.1,0.9l-0.5,0.1L19.4,32h-2.8l-1.1-3.6L15,28.3c-0.7-0.3-1.4-0.6-2.1-0.9l-0.5-0.3l-3.3,1.8l-2-2l1.8-3.3l-0.3-0.5c-0.4-0.7-0.7-1.4-0.9-2.1l-0.1-0.5L4,19.4v-2.8l3.4-1l0.2-0.5c0.2-0.8,0.5-1.5,0.9-2.2l0.3-0.5L7.1,9.1l2-2l3.2,1.8l0.5-0.3c0.7-0.4,1.4-0.7,2.2-0.9l0.5-0.2L16.6,4h2.8l1.1,3.5L21,7.7c0.7,0.2,1.3,0.5,1.9,0.8c-0.3-0.8-0.4-1.6-0.4-2.5l-0.4-0.2l-0.9-2.8C21,2.5,20.4,2,19.7,2h-3.4c-0.7,0-1.3,0.5-1.4,1.2L14,6c-0.6,0.1-1.1,0.3-1.6,0.6L9.8,5.2C9.2,4.9,8.4,5,7.9,5.5L5.5,7.9C5,8.4,4.9,9.2,5.2,9.8l1.3,2.5c-0.2,0.5-0.4,1.1-0.6,1.6l-2.8,0.9C2.5,15,2,15.6,2,16.3v3.4c0,0.7,0.5,1.3,1.2,1.5L6,22.1l0.6,1.5l-1.4,2.6c-0.3,0.6-0.2,1.4,0.3,1.9l2.4,2.4c0.5,0.5,1.3,0.6,1.9,0.3l2.6-1.4l1.5,0.6l0.9,2.9c0.2,0.6,0.8,1.1,1.5,1.1h3.4c0.7,0,1.3-0.5,1.5-1.1l0.9-2.9l1.5-0.6l2.6,1.4c0.6,0.3,1.4,0.2,1.9-0.3l2.4-2.4c0.5-0.5,0.6-1.3,0.3-1.9l-1.4-2.6l0.6-1.5l2.9-0.9c0.6-0.2,1.1-0.8,1.1-1.5v-3.4C34,15.6,33.5,14.9,32.8,14.7z"/>',
  solid: '<path d="M32.57,15.72l-3.35-1a11.65,11.65,0,0,0-.95-2.33l1.64-3.07a.61.61,0,0,0-.11-.72L27.41,6.2a.61.61,0,0,0-.72-.11L23.64,7.72a11.62,11.62,0,0,0-2.36-1l-1-3.31A.61.61,0,0,0,19.69,3H16.31a.61.61,0,0,0-.58.43l-1,3.3a11.63,11.63,0,0,0-2.38,1l-3-1.62a.61.61,0,0,0-.72.11L6.2,8.59a.61.61,0,0,0-.11.72l1.62,3a11.63,11.63,0,0,0-1,2.37l-3.31,1a.61.61,0,0,0-.43.58v3.38a.61.61,0,0,0,.43.58l3.33,1a11.62,11.62,0,0,0,1,2.33L6.09,26.69a.61.61,0,0,0,.11.72L8.59,29.8a.61.61,0,0,0,.72.11l3.09-1.65a11.65,11.65,0,0,0,2.3.94l1,3.37a.61.61,0,0,0,.58.43h3.38a.61.61,0,0,0,.58-.43l1-3.38a11.63,11.63,0,0,0,2.28-.94l3.11,1.66a.61.61,0,0,0,.72-.11l2.39-2.39a.61.61,0,0,0,.11-.72l-1.66-3.1a11.63,11.63,0,0,0,.95-2.29l3.37-1a.61.61,0,0,0,.43-.58V16.31A.61.61,0,0,0,32.57,15.72ZM18,23.5A5.5,5.5,0,1,1,23.5,18,5.5,5.5,0,0,1,18,23.5Z"/>',
  solidAlerted: '<path d="M32.57,15.72,31.5,15.4H22.85A5.5,5.5,0,1,1,18,12.5a5.53,5.53,0,0,1,.65,0A3.68,3.68,0,0,1,19,9.89l2.09-3.62-.86-2.83A.61.61,0,0,0,19.69,3H16.31a.61.61,0,0,0-.58.43l-1,3.3a11.63,11.63,0,0,0-2.38,1l-3-1.62a.61.61,0,0,0-.72.11L6.2,8.59a.61.61,0,0,0-.11.72l1.62,3a11.63,11.63,0,0,0-1,2.37l-3.31,1a.61.61,0,0,0-.43.58v3.38a.61.61,0,0,0,.43.58l3.33,1a11.62,11.62,0,0,0,1,2.33L6.09,26.69a.61.61,0,0,0,.11.72L8.59,29.8a.61.61,0,0,0,.72.11l3.09-1.65a11.65,11.65,0,0,0,2.3.94l1,3.37a.61.61,0,0,0,.58.43h3.38a.61.61,0,0,0,.58-.43l1-3.38a11.63,11.63,0,0,0,2.28-.94l3.11,1.66a.61.61,0,0,0,.72-.11l2.39-2.39a.61.61,0,0,0,.11-.72l-1.66-3.1a11.63,11.63,0,0,0,.95-2.29l3.37-1a.61.61,0,0,0,.43-.58V16.31A.61.61,0,0,0,32.57,15.72Z"/>',
  solidBadged: '<path d="M32.57,15.72l-3.35-1a12.12,12.12,0,0,0-.47-1.32,7.49,7.49,0,0,1-6.14-6.16,11.82,11.82,0,0,0-1.33-.48l-1-3.31A.61.61,0,0,0,19.69,3H16.31a.61.61,0,0,0-.58.43l-1,3.3a11.63,11.63,0,0,0-2.38,1l-3-1.62a.61.61,0,0,0-.72.11L6.2,8.59a.61.61,0,0,0-.11.72l1.62,3a11.63,11.63,0,0,0-1,2.37l-3.31,1a.61.61,0,0,0-.43.58v3.38a.61.61,0,0,0,.43.58l3.33,1a11.62,11.62,0,0,0,1,2.33L6.09,26.69a.61.61,0,0,0,.11.72L8.59,29.8a.61.61,0,0,0,.72.11l3.09-1.65a11.65,11.65,0,0,0,2.3.94l1,3.37a.61.61,0,0,0,.58.43h3.38a.61.61,0,0,0,.58-.43l1-3.38a11.63,11.63,0,0,0,2.28-.94l3.11,1.66a.61.61,0,0,0,.72-.11l2.39-2.39a.61.61,0,0,0,.11-.72l-1.66-3.1a11.63,11.63,0,0,0,.95-2.29l3.37-1a.61.61,0,0,0,.43-.58V16.31A.61.61,0,0,0,32.57,15.72ZM18,23.5A5.5,5.5,0,1,1,23.5,18,5.5,5.5,0,0,1,18,23.5Z"/>'
};
var cogIconName = "cog";
var cogIcon = [cogIconName, renderIcon(icon11)];

// node_modules/@clr/core/icon/shapes/ellipsis-horizontal.js
var icon12 = {
  outline: '<circle cx="31.1" cy="18" r="2.9"/><circle cx="18" cy="18" r="2.9"/><circle cx="4.9" cy="18" r="2.9"/>',
  outlineBadged: '<circle cx="31.1" cy="18" r="2.9"/><circle cx="18" cy="18" r="2.9"/><circle cx="4.9" cy="18" r="2.9"/>'
};
var ellipsisHorizontalIconName = "ellipsis-horizontal";
var ellipsisHorizontalIcon = [ellipsisHorizontalIconName, renderIcon(icon12)];

// node_modules/@clr/core/icon/shapes/ellipsis-vertical.js
var icon13 = {
  outline: '<circle cx="18" cy="4.9" r="2.9"/><circle cx="18" cy="18" r="2.9"/><circle cx="18" cy="31.1" r="2.9"/>',
  outlineBadged: '<circle cx="18" cy="4.9" r="2.9"/><circle cx="18" cy="18" r="2.9"/><circle cx="18" cy="31.1" r="2.9"/>'
};
var ellipsisVerticalIconName = "ellipsis-vertical";
var ellipsisVerticalIcon = [ellipsisVerticalIconName, renderIcon(icon13)];

// node_modules/@clr/core/icon/shapes/error-standard.js
var icon14 = {
  outline: '<circle cx="18" cy="26.06" r="1.33"/><path d="M18,22.61a1,1,0,0,1-1-1v-12a1,1,0,1,1,2,0v12A1,1,0,0,1,18,22.61Z"/><path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"/>',
  solid: '<path d="M18,2.1a16,16,0,1,0,16,16A16,16,0,0,0,18,2.1ZM16.6,8.8a1.4,1.4,0,0,1,2.8,0v12a1.4,1.4,0,0,1-2.8,0ZM18,28.6a1.8,1.8,0,1,1,1.8-1.8A1.8,1.8,0,0,1,18,28.6Z"/>'
};
var errorStandardIconName = "error-standard";
var errorStandardIcon = [errorStandardIconName, renderIcon(icon14)];

// node_modules/@clr/core/icon/shapes/event.js
var icon15 = {
  outline: '<path d="M16.17,25.86,10.81,20.5a1,1,0,0,1,1.41-1.41L16.17,23l8.64-8.64a1,1,0,0,1,1.41,1.41Z"/><path d="M32.25,6H29V8h3V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6Z"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"/><rect x="13" y="6" width="10" height="2"/>',
  outlineAlerted: '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M10.81,20.5l5.36,5.36L26.22,15.81a1,1,0,0,0,.23-.41H23.8L16.17,23l-3.94-3.94a1,1,0,0,0-1.41,1.41Z"/><polygon points="21.29 6 13 6 13 8 20.14 8 21.29 6"/><path d="M33.68,15.4H32V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V15.38Z"/>',
  outlineBadged: '<path d="M10.81,20.5l5.36,5.36L26.22,15.81a1,1,0,0,0-1.41-1.41L16.17,23l-3.94-3.94a1,1,0,0,0-1.41,1.41Z"/><path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M32,13.22V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V12.34A7.45,7.45,0,0,1,32,13.22Z"/><path d="M22.5,6H13V8h9.78A7.49,7.49,0,0,1,22.5,6Z"/>',
  solid: '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"/><path d="M32.25,6h-4V9a2.2,2.2,0,0,1-4.4,0V6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6ZM25.94,16.58l-9.67,9.67L11,20.94A1.36,1.36,0,0,1,12.9,19l3.38,3.38L24,14.66a1.36,1.36,0,1,1,1.93,1.93Z"/>',
  solidAlerted: '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M33.68,15.4H26.3a1.34,1.34,0,0,1-.36,1.18l-9.67,9.67L11,20.94A1.36,1.36,0,0,1,12.9,19l3.38,3.38,7-7h-1A3.68,3.68,0,0,1,19,9.89L21.29,6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V15.38Z"/>',
  solidBadged: '<path d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"/><path d="M30,13.5A7.5,7.5,0,0,1,22.5,6H12.2V9A2.2,2.2,0,0,1,7.8,9V6h-4A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V12.34A7.45,7.45,0,0,1,30,13.5Zm-4.06,3.08-9.67,9.67L11,20.94A1.36,1.36,0,0,1,12.9,19l3.38,3.38L24,14.66a1.36,1.36,0,1,1,1.93,1.93Z"/>'
};
var eventIconName = "event";
var eventIcon = [eventIconName, renderIcon(icon15)];

// node_modules/@clr/core/icon/shapes/exclamation-circle.js
var icon16 = {
  outline: '<path d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm0,22A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/><path d="M18,20.07a1.3,1.3,0,0,1-1.3-1.3v-6a1.3,1.3,0,1,1,2.6,0v6A1.3,1.3,0,0,1,18,20.07Z"/><circle cx="17.95" cy="23.02" r="1.5"/>',
  solid: '<path d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm-1.49,6a1.49,1.49,0,0,1,3,0v6.89a1.49,1.49,0,1,1-3,0ZM18,25.5a1.72,1.72,0,1,1,1.72-1.72A1.72,1.72,0,0,1,18,25.5Z"/>'
};
var exclamationCircleIconName = "exclamation-circle";
var exclamationCircleIcon = [exclamationCircleIconName, renderIcon(icon16)];

// node_modules/@clr/core/icon/shapes/exclamation-triangle.js
var icon17 = {
  outline: '<path d="M18,21.32a1.3,1.3,0,0,0,1.3-1.3V14a1.3,1.3,0,1,0-2.6,0v6A1.3,1.3,0,0,0,18,21.32Z"/><circle cx="17.95" cy="24.27" r="1.5"/><path d="M30.33,25.54,20.59,7.6a3,3,0,0,0-5.27,0L5.57,25.54A3,3,0,0,0,8.21,30H27.69a3,3,0,0,0,2.64-4.43Zm-1.78,1.94a1,1,0,0,1-.86.49H8.21a1,1,0,0,1-.88-1.48L17.07,8.55a1,1,0,0,1,1.76,0l9.74,17.94A1,1,0,0,1,28.55,27.48Z"/>',
  solid: '<path d="M30.33,25.54,20.59,7.6a3,3,0,0,0-5.27,0L5.57,25.54A3,3,0,0,0,8.21,30H27.69a3,3,0,0,0,2.64-4.43ZM16.46,12.74a1.49,1.49,0,0,1,3,0v6.89a1.49,1.49,0,1,1-3,0ZM18,26.25a1.72,1.72,0,1,1,1.72-1.72A1.72,1.72,0,0,1,18,26.25Z"/>'
};
var exclamationTriangleIconName = "exclamation-triangle";
var exclamationTriangleIcon = [exclamationTriangleIconName, renderIcon(icon17)];

// node_modules/@clr/core/icon/shapes/eye.js
var icon18 = {
  outline: '<path d="M33.62,17.53c-3.37-6.23-9.28-10-15.82-10S5.34,11.3,2,17.53L1.72,18l.26.48c3.37,6.23,9.28,10,15.82,10s12.46-3.72,15.82-10l.26-.48ZM17.8,26.43C12.17,26.43,7,23.29,4,18c3-5.29,8.17-8.43,13.8-8.43S28.54,12.72,31.59,18C28.54,23.29,23.42,26.43,17.8,26.43Z"/><path d="M18.09,11.17A6.86,6.86,0,1,0,25,18,6.86,6.86,0,0,0,18.09,11.17Zm0,11.72A4.86,4.86,0,1,1,23,18,4.87,4.87,0,0,1,18.09,22.89Z"/>',
  solid: '<path d="M33.62,17.53c-3.37-6.23-9.28-10-15.82-10S5.34,11.3,2,17.53L1.72,18l.26.48c3.37,6.23,9.28,10,15.82,10s12.46-3.72,15.82-10l.26-.48ZM17.8,26.43C12.17,26.43,7,23.29,4,18c3-5.29,8.17-8.43,13.8-8.43S28.54,12.72,31.59,18C28.54,23.29,23.42,26.43,17.8,26.43Z"/><circle cx="18.09" cy="18.03" r="6.86"/>'
};
var eyeIconName = "eye";
var eyeIcon = [eyeIconName, renderIcon(icon18)];

// node_modules/@clr/core/icon/shapes/eye-hide.js
var icon19 = {
  outline: '<path d="M25.19,20.4A6.78,6.78,0,0,0,25.62,18a6.86,6.86,0,0,0-6.86-6.86,6.79,6.79,0,0,0-2.37.43L18,13.23a4.78,4.78,0,0,1,.74-.06A4.87,4.87,0,0,1,23.62,18a4.79,4.79,0,0,1-.06.74Z"/><path d="M34.29,17.53c-3.37-6.23-9.28-10-15.82-10a16.82,16.82,0,0,0-5.24.85L14.84,10a14.78,14.78,0,0,1,3.63-.47c5.63,0,10.75,3.14,13.8,8.43a17.75,17.75,0,0,1-4.37,5.1l1.42,1.42a19.93,19.93,0,0,0,5-6l.26-.48Z"/><path d="M4.87,5.78l4.46,4.46a19.52,19.52,0,0,0-6.69,7.29L2.38,18l.26.48c3.37,6.23,9.28,10,15.82,10a16.93,16.93,0,0,0,7.37-1.69l5,5,1.75-1.5-26-26Zm9.75,9.75,6.65,6.65a4.81,4.81,0,0,1-2.5.72A4.87,4.87,0,0,1,13.9,18,4.81,4.81,0,0,1,14.62,15.53Zm-1.45-1.45a6.85,6.85,0,0,0,9.55,9.55l1.6,1.6a14.91,14.91,0,0,1-5.86,1.2c-5.63,0-10.75-3.14-13.8-8.43a17.29,17.29,0,0,1,6.12-6.3Z"/>',
  solid: '<path d="M18.37,11.17A6.79,6.79,0,0,0,16,11.6l8.8,8.8A6.78,6.78,0,0,0,25.23,18,6.86,6.86,0,0,0,18.37,11.17Z"/><path d="M34.29,17.53c-3.37-6.23-9.28-10-15.82-10a16.82,16.82,0,0,0-5.24.85L14.84,10a14.78,14.78,0,0,1,3.63-.47c5.63,0,10.75,3.14,13.8,8.43a17.75,17.75,0,0,1-4.37,5.1l1.42,1.42a19.93,19.93,0,0,0,5-6l.26-.48Z"/><path d="M4.87,5.78l4.46,4.46a19.52,19.52,0,0,0-6.69,7.29L2.38,18l.26.48c3.37,6.23,9.28,10,15.82,10a16.93,16.93,0,0,0,7.37-1.69l5,5,1.75-1.5-26-26Zm8.3,8.3a6.85,6.85,0,0,0,9.55,9.55l1.6,1.6a14.91,14.91,0,0,1-5.86,1.2c-5.63,0-10.75-3.14-13.8-8.43a17.29,17.29,0,0,1,6.12-6.3Z"/>'
};
var eyeHideIconName = "eye-hide";
var eyeHideIcon = [eyeHideIconName, renderIcon(icon19)];

// node_modules/@clr/core/icon/shapes/filter-grid.js
var icon20 = {
  outline: '<path d="M15,25.86l2,1V20.27a1,1,0,0,0-.29-.7L10.23,13H25.79l-6.47,6.57a1,1,0,0,0-.29.7L19,28l2,1V20.68L27.58,14A1.46,1.46,0,0,0,28,13V12a1,1,0,0,0-1-1H9a1,1,0,0,0-1,1v1a1.46,1.46,0,0,0,.42,1L15,20.68Z"/>',
  solid: '<path d="M8,11v1.12a.5.5,0,0,0,.15.35l7.28,7.36a.5.5,0,0,1,.15.35v6.89a.5.5,0,0,0,.28.45l3.95,1.41a.5.5,0,0,0,.72-.45l0-8.39a.54.54,0,0,1,.18-.35l7.12-7.25a.5.5,0,0,0,.15-.35V11Z"/>'
};
var filterGridIconName = "filter-grid";
var filterGridIcon = [filterGridIconName, renderIcon(icon20)];

// node_modules/@clr/core/icon/shapes/filter-grid-circle.js
var icon21 = {
  outline: '<path d="M15,25.86l2,1V20.27a1,1,0,0,0-.29-.7L10.23,13H25.79l-6.47,6.57a1,1,0,0,0-.29.7L19,28l2,1V20.68L27.58,14A1.46,1.46,0,0,0,28,13V12a1,1,0,0,0-1-1H9a1,1,0,0,0-1,1v1a1.46,1.46,0,0,0,.42,1L15,20.68Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M8,11v1.12a.5.5,0,0,0,.15.35l7.28,7.36a.5.5,0,0,1,.15.35v6.89a.5.5,0,0,0,.28.45l3.95,1.41a.5.5,0,0,0,.72-.45l0-8.39a.54.54,0,0,1,.18-.35l7.12-7.25a.5.5,0,0,0,.15-.35V11Z"/>'
};
var filterGridCircleIconName = "filter-grid-circle";
var filterGridCircleIcon = [filterGridCircleIconName, renderIcon(icon21)];

// node_modules/@clr/core/icon/shapes/folder.js
var icon22 = {
  outline: '<path d="M30,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V11A2,2,0,0,0,30,9Zm0,20H6V13h7.31a2,2,0,0,0,2-2H6V7h6.49l2.61,3.59a1,1,0,0,0,.81.41H30Z"/>',
  outlineAlerted: '<path d="M30,15.4V29H6V13h7.31a2,2,0,0,0,2-2H6V7h6.49l2.61,3.59a1,1,0,0,0,.81.41h2.73A3.66,3.66,0,0,1,19,9.89L19.56,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V15.4Z"/>',
  outlineBadged: '<path d="M30,13.5V29H6V13h7.31a2,2,0,0,0,2-2H6V7h6.49l2.61,3.59a1,1,0,0,0,.81.41h8.51a7.5,7.5,0,0,1-1.29-2H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V13.22A7.49,7.49,0,0,1,30,13.5Z"/>',
  solid: '<path d="M30,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V11A2,2,0,0,0,30,9ZM6,11V7h6.49l2.72,4Z"/>',
  solidAlerted: '<path d="M22.23,15.4A3.68,3.68,0,0,1,19,9.89L19.56,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V15.4ZM6,11V7h6.49l2.72,4Z"/>',
  solidBadged: '<path d="M30,13.5A7.5,7.5,0,0,1,23.13,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V13.22A7.49,7.49,0,0,1,30,13.5ZM6,11V7h6.49l2.72,4Z"/>'
};
var folderIconName = "folder";
var folderIcon = [folderIconName, renderIcon(icon22)];

// node_modules/@clr/core/icon/shapes/folder-open.js
var icon23 = {
  outline: '<path d="M35.32,13.74A1.71,1.71,0,0,0,33.87,13H11.17a2.59,2.59,0,0,0-2.25,1.52,1,1,0,0,0,0,.14L6,25V7h6.49l2.61,3.59a1,1,0,0,0,.81.41H32a2,2,0,0,0-2-2H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29.69A1.37,1.37,0,0,0,5.41,31H30.34a1,1,0,0,0,1-.72l4.19-15.1A1.64,1.64,0,0,0,35.32,13.74ZM29.55,29H6.9l3.88-13.81a.66.66,0,0,1,.38-.24H33.49Z"/>',
  outlineAlerted: '<path d="M33.68,15.4h-.3L29.55,29H6.9l3.88-13.81a.66.66,0,0,1,.38-.24h9.42A3.67,3.67,0,0,1,19,13.56a3.63,3.63,0,0,1-.26-.56H11.17a2.59,2.59,0,0,0-2.25,1.52,1,1,0,0,0,0,.14L6,25V7h6.49l2.61,3.59a1,1,0,0,0,.81.41h2.73A3.66,3.66,0,0,1,19,9.89L19.56,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29.69A1.37,1.37,0,0,0,5.41,31H30.34a1,1,0,0,0,1-.72l4.19-15.1a1.68,1.68,0,0,0,.07-.32A3.67,3.67,0,0,1,33.68,15.4Z"/>',
  outlineBadged: '<path d="M35.32,13.74A1.71,1.71,0,0,0,33.87,13H11.17a2.59,2.59,0,0,0-2.25,1.52,1,1,0,0,0,0,.14L6,25V7h6.49l2.61,3.59a1,1,0,0,0,.81.41h8.52a7.49,7.49,0,0,1-1.29-2H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29.69A1.37,1.37,0,0,0,5.41,31H30.34a1,1,0,0,0,1-.72l4.19-15.1A1.64,1.64,0,0,0,35.32,13.74ZM29.55,29H6.9l3.88-13.81a.66.66,0,0,1,.38-.24H33.49Z"/>',
  solid: '<path d="M35.32,13.74A1.71,1.71,0,0,0,33.87,13H11.17a2.59,2.59,0,0,0-2.25,1.52,1,1,0,0,0,0,.14L6,25V7h6.49l2.61,3.59a1,1,0,0,0,.81.41H32a2,2,0,0,0-2-2H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29.69A1.37,1.37,0,0,0,5.41,31H30.34a1,1,0,0,0,1-.72l4.19-15.1A1.64,1.64,0,0,0,35.32,13.74Z"/>',
  solidAlerted: '<path d="M33.68,15.4H22.23A3.69,3.69,0,0,1,19,13.56a3.63,3.63,0,0,1-.26-.56H11.17a2.59,2.59,0,0,0-2.25,1.52,1,1,0,0,0,0,.14L6,25V7h6.49l2.61,3.59a1,1,0,0,0,.81.41h2.73A3.66,3.66,0,0,1,19,9.89L19.56,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29.69A1.37,1.37,0,0,0,5.41,31H30.34a1,1,0,0,0,1-.72l4.19-15.1a1.68,1.68,0,0,0,.07-.32A3.67,3.67,0,0,1,33.68,15.4Z"/>',
  solidBadged: '<path d="M35.32,13.74A1.71,1.71,0,0,0,33.87,13H11.17a2.59,2.59,0,0,0-2.25,1.52,1,1,0,0,0,0,.14L6,25V7h6.49l2.61,3.59a1,1,0,0,0,.81.41h8.52a7.49,7.49,0,0,1-1.31-2H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29.69A1.37,1.37,0,0,0,5.41,31H30.34a1,1,0,0,0,1-.72l4.19-15.1A1.64,1.64,0,0,0,35.32,13.74Z"/>'
};
var folderOpenIconName = "folder-open";
var folderOpenIcon = [folderOpenIconName, renderIcon(icon23)];

// node_modules/@clr/core/icon/shapes/help-info.js
var icon24 = {
  outline: '<path d="M25.39,25.45a1,1,0,0,0-1.38.29c-1.41,2.16-4,4.81-6.31,5.7s-4.12.57-4.84,0c-.31-.27-1.12-1-.43-3.49.46-1.66,3.32-9.48,4-11.38l-2.18.28c-.69,1.86-3.29,8.84-3.76,10.58-.68,2.49-.34,4.3,1.09,5.56A5.59,5.59,0,0,0,15,34a9.53,9.53,0,0,0,3.45-.7c2.79-1.09,5.72-4.12,7.26-6.47A1,1,0,0,0,25.39,25.45Z"/><path d="M19.3,11a4.5,4.5,0,1,0-4.5-4.5A4.5,4.5,0,0,0,19.3,11Zm0-7a2.5,2.5,0,1,1-2.5,2.5A2.5,2.5,0,0,1,19.3,4Z"/><path d="M11.81,15c.06,0,6.27-.82,7.73-1,.65-.1,1.14,0,1.3.15s.21.8-.07,1.68c-.61,1.86-3.69,11-4.59,13.71a8,8,0,0,0,1.29-.38,7.32,7.32,0,0,0,1.15-.6C19.85,25,22.15,18.1,22.67,16.52s.39-2.78-.3-3.6a3.16,3.16,0,0,0-3.08-.83c-1.43.15-7.47.94-7.73,1a1,1,0,0,0,.26,2Z"/>',
  solid: '<circle cx="20.75" cy="6" r="4"/><path d="M24.84,26.23a1,1,0,0,0-1.4.29,16.6,16.6,0,0,1-3.51,3.77c-.33.25-1.56,1.2-2.08,1-.36-.11-.15-.82-.08-1.12l.53-1.57c.22-.64,4.05-12,4.47-13.3.62-1.9.35-3.77-2.48-3.32-.77.08-8.58,1.09-8.72,1.1a1,1,0,0,0,.13,2s3-.39,3.33-.42a.88.88,0,0,1,.85.44,2.47,2.47,0,0,1-.07,1.71c-.26,1-4.37,12.58-4.5,13.25a2.78,2.78,0,0,0,1.18,3,5,5,0,0,0,3.08.83h0a8.53,8.53,0,0,0,3.09-.62c2.49-1,5.09-3.66,6.46-5.75A1,1,0,0,0,24.84,26.23Z"/>'
};
var helpInfoIconName = "help-info";
var helpInfoIcon = [helpInfoIconName, renderIcon(icon24)];

// node_modules/@clr/core/icon/shapes/home.js
var icon25 = {
  outline: '<path d="M33.71,17.29l-15-15a1,1,0,0,0-1.41,0l-15,15a1,1,0,0,0,1.41,1.41L18,4.41,32.29,18.71a1,1,0,0,0,1.41-1.41Z"/><path d="M28,32h-5V22H13V32H8V18L6,20V32a2,2,0,0,0,2,2h7V24h6V34h7a2,2,0,0,0,2-2V19.76l-2-2Z"/>',
  solid: '<path d="M33,19a1,1,0,0,1-.71-.29L18,4.41,3.71,18.71a1,1,0,0,1-1.41-1.41l15-15a1,1,0,0,1,1.41,0l15,15A1,1,0,0,1,33,19Z"/><path d="M18,7.79,6,19.83V32a2,2,0,0,0,2,2h7V24h6V34h7a2,2,0,0,0,2-2V19.76Z"/>'
};
var homeIconName = "home";
var homeIcon = [homeIconName, renderIcon(icon25)];

// node_modules/@clr/core/icon/shapes/image.js
var icon26 = {
  outline: '<path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4ZM4,30V6H32V30Z"/><path d="M8.92,14a3,3,0,1,0-3-3A3,3,0,0,0,8.92,14Zm0-4.6A1.6,1.6,0,1,1,7.33,11,1.6,1.6,0,0,1,8.92,9.41Z"/><path d="M22.78,15.37l-5.4,5.4-4-4a1,1,0,0,0-1.41,0L5.92,22.9v2.83l6.79-6.79L16,22.18l-3.75,3.75H15l8.45-8.45L30,24V21.18l-5.81-5.81A1,1,0,0,0,22.78,15.37Z"/>',
  outlineBadged: '<path d="M11.93,11a3,3,0,1,0-3,3A3,3,0,0,0,11.93,11Zm-4.6,0a1.6,1.6,0,1,1,1.6,1.6A1.6,1.6,0,0,1,7.33,11Z"/><path d="M17.38,20.77l-4-4a1,1,0,0,0-1.41,0L5.92,22.9v2.83l6.79-6.79L16,22.18l-3.75,3.75H15l8.45-8.45L30,24V21.18l-5.81-5.81a1,1,0,0,0-1.41,0Z"/><path d="M32,13.22V30H4V6H22.5a7.49,7.49,0,0,1,.28-2H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.45,7.45,0,0,1,32,13.22Z"/>',
  solid: '<path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4ZM8.92,8a3,3,0,1,1-3,3A3,3,0,0,1,8.92,8ZM6,27V22.9l6-6.08a1,1,0,0,1,1.41,0L16,19.35,8.32,27Zm24,0H11.15l6.23-6.23,5.4-5.4a1,1,0,0,1,1.41,0L30,21.18Z"/>',
  solidBadged: '<path d="M30,13.5A7.48,7.48,0,0,1,22.78,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.46,7.46,0,0,1,30,13.5ZM8.92,8a3,3,0,1,1-3,3A3,3,0,0,1,8.92,8ZM6,27V22.9l6-6.08a1,1,0,0,1,1.41,0L16,19.35,8.32,27Zm24,0H11.15l6.23-6.23,5.4-5.4a1,1,0,0,1,1.41,0L30,21.18Z"/>'
};
var imageIconName = "image";
var imageIcon = [imageIconName, renderIcon(icon26)];

// node_modules/@clr/core/icon/shapes/info-circle.js
var icon27 = {
  outline: '<circle cx="17.93" cy="11.9" r="1.4"/><path d="M21,23H19V15H16a1,1,0,0,0,0,2h1v6H15a1,1,0,1,0,0,2h6a1,1,0,0,0,0-2Z"/><path d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm0,22A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/>',
  solid: '<path d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm-2,5.15a2,2,0,1,1,2,2A2,2,0,0,1,15.9,11.15ZM23,24a1,1,0,0,1-1,1H15a1,1,0,1,1,0-2h2V17H16a1,1,0,0,1,0-2h4v8h2A1,1,0,0,1,23,24Z"/>'
};
var infoCircleIconName = "info-circle";
var infoCircleIcon = [infoCircleIconName, renderIcon(icon27)];

// node_modules/@clr/core/icon/shapes/info-standard.js
var icon28 = {
  outline: '<circle cx="17.97" cy="10.45" r="1.4"/><path d="M21,25H19V14.1H16a1,1,0,0,0,0,2h1V25H15a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"/><path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"/>',
  solid: '<path d="M18,2.1a16,16,0,1,0,16,16A16,16,0,0,0,18,2.1Zm-.1,5.28a2,2,0,1,1-2,2A2,2,0,0,1,17.9,7.38Zm3.6,21.25h-7a1.4,1.4,0,1,1,0-2.8h2.1v-9.2H15a1.4,1.4,0,1,1,0-2.8h4.4v12h2.1a1.4,1.4,0,1,1,0,2.8Z"/>'
};
var infoStandardIconName = "info-standard";
var infoStandardIcon = [infoStandardIconName, renderIcon(icon28)];

// node_modules/@clr/core/icon/shapes/search.js
var icon29 = {
  outline: '<path d="M16.33,5.05A10.95,10.95,0,1,1,5.39,16,11,11,0,0,1,16.33,5.05m0-2.05a13,13,0,1,0,13,13,13,13,0,0,0-13-13Z"/><path d="M35,33.29l-7.37-7.42-1.42,1.41,7.37,7.42A1,1,0,1,0,35,33.29Z"/>'
};
var searchIconName = "search";
var searchIcon = [searchIconName, renderIcon(icon29)];

// node_modules/@clr/core/icon/shapes/step-forward-2.js
var icon30 = {
  outline: '<path d="M7.08,6.52a1.68,1.68,0,0,0,0,2.4L16.51,18,7.12,27.08a1.7,1.7,0,0,0,2.36,2.44h0L21.4,18,9.48,6.47A1.69,1.69,0,0,0,7.08,6.52Z"/><path d="M26.49,5a1.7,1.7,0,0,0-1.7,1.7V29.3a1.7,1.7,0,0,0,3.4,0V6.7A1.7,1.7,0,0,0,26.49,5Z"/>'
};
var stepForward2IconName = "step-forward-2";
var stepForward2Icon = [stepForward2IconName, renderIcon(icon30)];

// node_modules/@clr/core/icon/shapes/success-standard.js
var icon31 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M28,12.1a1,1,0,0,0-1.41,0L15.49,23.15l-6-6A1,1,0,0,0,8,18.53L15.49,26,28,13.52A1,1,0,0,0,28,12.1Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM28.45,12.63,15.31,25.76,7.55,18a1.4,1.4,0,0,1,2-2l5.78,5.78L26.47,10.65a1.4,1.4,0,1,1,2,2Z"/>'
};
var successStandardIconName = "success-standard";
var successStandardIcon = [successStandardIconName, renderIcon(icon31)];

// node_modules/@clr/core/icon/shapes/times.js
var icon32 = {
  outline: '<path d="M19.41,18l8.29-8.29a1,1,0,0,0-1.41-1.41L18,16.59,9.71,8.29A1,1,0,0,0,8.29,9.71L16.59,18,8.29,26.29a1,1,0,1,0,1.41,1.41L18,19.41l8.29,8.29a1,1,0,0,0,1.41-1.41Z"/>'
};
var timesIconName = "times";
var timesIcon = [timesIconName, renderIcon(icon32)];

// node_modules/@clr/core/icon/shapes/unknown-status.js
var icon33 = {
  outline: '<circle cx="17.58" cy="26.23" r="1.4"/><path d="M24.7,13a5.18,5.18,0,0,0-2.16-3.56,7.26,7.26,0,0,0-5.71-1.09A11.34,11.34,0,0,0,12,10.44,1,1,0,1,0,13.26,12a9.32,9.32,0,0,1,3.94-1.72,5.29,5.29,0,0,1,4.16.74,3.21,3.21,0,0,1,1.35,2.19c.33,2.69-3.19,3.75-5.32,4.14l-.82.15v4.36a1,1,0,0,0,2,0V19.17C24.61,17.79,24.88,14.41,24.7,13Z"/>'
};
var unknownStatusIconName = "unknown-status";
var unknownStatusIcon = [unknownStatusIconName, renderIcon(icon33)];

// node_modules/@clr/core/icon/shapes/user.js
var icon34 = {
  outline: '<path d="M18,17a7,7,0,1,0-7-7A7,7,0,0,0,18,17ZM18,5a5,5,0,1,1-5,5A5,5,0,0,1,18,5Z"/><path d="M30.47,24.37a17.16,17.16,0,0,0-24.93,0A2,2,0,0,0,5,25.74V31a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V25.74A2,2,0,0,0,30.47,24.37ZM29,31H7V25.73a15.17,15.17,0,0,1,22,0h0Z"/>',
  outlineAlerted: '<path d="M30.47,24.37a17.16,17.16,0,0,0-24.93,0A2,2,0,0,0,5,25.74V31a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V25.74A2,2,0,0,0,30.47,24.37ZM29,31H7V25.73a15.17,15.17,0,0,1,22,0h0Z"/><path d="M18,17a7,7,0,0,0,4.45-1.6h-.22A3.68,3.68,0,0,1,20,14.6a5,5,0,1,1,1.24-8.42l1-1.76A7,7,0,1,0,18,17Z"/>',
  outlineBadged: '<path d="M30.47,24.37a17.16,17.16,0,0,0-24.93,0A2,2,0,0,0,5,25.74V31a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V25.74A2,2,0,0,0,30.47,24.37ZM29,31H7V25.73a15.17,15.17,0,0,1,22,0h0Z"/><path d="M18,17a7,7,0,0,0,6.85-5.56,7.4,7.4,0,0,1-2.24-6.69A7,7,0,1,0,18,17ZM18,5a5,5,0,1,1-5,5A5,5,0,0,1,18,5Z"/>',
  solid: '<path d="M30.61,24.52a17.16,17.16,0,0,0-25.22,0,1.51,1.51,0,0,0-.39,1v6A1.5,1.5,0,0,0,6.5,33h23A1.5,1.5,0,0,0,31,31.5v-6A1.51,1.51,0,0,0,30.61,24.52Z"/><circle cx="18" cy="10" r="7"/>',
  solidAlerted: '<path d="M30.61,24.52a17.16,17.16,0,0,0-25.22,0,1.51,1.51,0,0,0-.39,1v6A1.5,1.5,0,0,0,6.5,33h23A1.5,1.5,0,0,0,31,31.5v-6A1.51,1.51,0,0,0,30.61,24.52Z"/><path d="M18,17a7,7,0,0,0,4.45-1.6h-.22A3.68,3.68,0,0,1,19,9.89l3.16-5.47A7,7,0,1,0,18,17Z"/>',
  solidBadged: '<path d="M30.61,24.52a17.16,17.16,0,0,0-25.22,0,1.51,1.51,0,0,0-.39,1v6A1.5,1.5,0,0,0,6.5,33h23A1.5,1.5,0,0,0,31,31.5v-6A1.51,1.51,0,0,0,30.61,24.52Z"/><path d="M18,17a7,7,0,0,0,6.85-5.56,7.4,7.4,0,0,1-2.24-6.69A7,7,0,1,0,18,17Z"/>'
};
var userIconName = "user";
var userIcon = [userIconName, renderIcon(icon34)];

// node_modules/@clr/core/icon/shapes/view-columns.js
var icon35 = {
  outline: '<path d="M31,5H5A2,2,0,0,0,3,7V29a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V7A2,2,0,0,0,31,5ZM13,29H5V7h8Zm10,0H15V7h8Z"/>'
};
var viewColumnsIconName = "view-columns";
var viewColumnsIcon = [viewColumnsIconName, renderIcon(icon35)];

// node_modules/@clr/core/icon/shapes/vm-bug.js
var icon36 = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><title>VMware header icon</title><rect width="36" height="36" rx="3" fill="#ffffff" opacity="0.15" style="isolation:isolate"/><path d="M3.79,14.83a1.09,1.09,0,0,0-1.47-.56,1.09,1.09,0,0,0-.54,1.49l2.47,5.4c.39.85.8,1.29,1.57,1.29S7,22,7.39,21.16l2.17-4.77a.33.33,0,0,1,.31-.2.35.35,0,0,1,.35.35v4.61a1.15,1.15,0,0,0,1.14,1.3,1.17,1.17,0,0,0,1.17-1.3V17.38a1.15,1.15,0,0,1,1.22-1.2,1.13,1.13,0,0,1,1.18,1.2v3.77a1.17,1.17,0,1,0,2.32,0V17.38a1.15,1.15,0,0,1,1.22-1.2,1.13,1.13,0,0,1,1.18,1.2v3.77a1.16,1.16,0,1,0,2.31,0V16.86a2.69,2.69,0,0,0-2.78-2.69,3.57,3.57,0,0,0-2.47,1.05,2.75,2.75,0,0,0-2.38-1.05A3.93,3.93,0,0,0,12,15.22a2.82,2.82,0,0,0-2.08-1.05A2.55,2.55,0,0,0,7.4,15.89L5.82,19.63l-2-4.8" fill="#ffffff"/><path d="M33,14.18A1.14,1.14,0,0,0,31.9,15l-1.19,3.73L29.5,15.05a1.18,1.18,0,0,0-1.15-.87h-.1a1.2,1.2,0,0,0-1.15.87l-1.19,3.71-1.18-3.71a1.15,1.15,0,0,0-1.11-.87,1.08,1.08,0,0,0-1.12,1.07,1.68,1.68,0,0,0,.1.54l2,5.7a1.27,1.27,0,0,0,1.27,1,1.24,1.24,0,0,0,1.2-.93l1.2-3.64,1.2,3.64a1.25,1.25,0,0,0,1.26.93A1.27,1.27,0,0,0,32,21.5L34,15.73a1.77,1.77,0,0,0,.08-.48A1.07,1.07,0,0,0,33,14.18Z" fill="#ffffff"/></svg>';
var vmBugIconName = "vm-bug";
var vmBugIcon = [vmBugIconName, icon36];

// node_modules/@clr/core/icon/shapes/vm-bug-inverse.js
var icon37 = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><title>VMware header icon</title><rect width="36" height="36" rx="3" fill="#000000" opacity="0.66" style="isolation:isolate"/><path d="M3.79,14.83a1.09,1.09,0,0,0-1.47-.56,1.09,1.09,0,0,0-.54,1.49l2.47,5.4c.39.85.8,1.29,1.57,1.29S7,22,7.39,21.16l2.17-4.77a.33.33,0,0,1,.31-.2.35.35,0,0,1,.35.35v4.61a1.15,1.15,0,0,0,1.14,1.3,1.17,1.17,0,0,0,1.17-1.3V17.38a1.15,1.15,0,0,1,1.22-1.2,1.13,1.13,0,0,1,1.18,1.2v3.77a1.17,1.17,0,1,0,2.32,0V17.38a1.15,1.15,0,0,1,1.22-1.2,1.13,1.13,0,0,1,1.18,1.2v3.77a1.16,1.16,0,1,0,2.31,0V16.86a2.69,2.69,0,0,0-2.78-2.69,3.57,3.57,0,0,0-2.47,1.05,2.75,2.75,0,0,0-2.38-1.05A3.93,3.93,0,0,0,12,15.22a2.82,2.82,0,0,0-2.08-1.05A2.55,2.55,0,0,0,7.4,15.89L5.82,19.63l-2-4.8" fill="#ffffff"/><path d="M33,14.18A1.14,1.14,0,0,0,31.9,15l-1.19,3.73L29.5,15.05a1.18,1.18,0,0,0-1.15-.87h-.1a1.2,1.2,0,0,0-1.15.87l-1.19,3.71-1.18-3.71a1.15,1.15,0,0,0-1.11-.87,1.08,1.08,0,0,0-1.12,1.07,1.68,1.68,0,0,0,.1.54l2,5.7a1.27,1.27,0,0,0,1.27,1,1.24,1.24,0,0,0,1.2-.93l1.2-3.64,1.2,3.64a1.25,1.25,0,0,0,1.26.93A1.27,1.27,0,0,0,32,21.5L34,15.73a1.77,1.77,0,0,0,.08-.48A1.07,1.07,0,0,0,33,14.18Z" fill="#ffffff"/></svg>';
var vmBugInverseIconName = "vm-bug-inverse";
var vmBugInverseIcon = [vmBugInverseIconName, icon37];

// node_modules/@clr/core/icon/shapes/warning-standard.js
var icon38 = {
  outline: '<circle cx="18" cy="26.06" r="1.33"/><path d="M18,22.61a1,1,0,0,1-1-1v-12a1,1,0,1,1,2,0v12A1,1,0,0,1,18,22.61Z"/><path d="M15.0620782,1.681196 C15.6298819,0.649266355 16.7109091,0.0102219396 17.885,0.0102219396 C19.0590909,0.0102219396 20.1401181,0.649266355 20.7086433,1.68252129 L34.598644,27.2425225 C35.1407746,28.2401397 35.1174345,29.4495373 34.5372161,30.4254943 C33.9569977,31.4014514 32.905671,31.9996984 31.77,32 L4.02239323,31.9997492 C2.87409009,32.0254699 1.79902843,31.4375753 1.20106335,30.4569126 C0.603098265,29.4762499 0.572777899,28.2513179 1.12207818,27.241196 L15.0620782,1.681196 Z M2.87850767,28.1977282 C2.67060966,28.5800376 2.6820975,29.0441423 2.9086557,29.4156977 C3.1352139,29.7872532 3.5425354,30.0099959 4,30 L31.7697344,30 C32.1999191,29.9998858 32.5982478,29.7732208 32.8180821,29.4034482 C33.0379164,29.0336757 33.0467595,28.5754567 32.8413567,28.1974787 L18.9538739,2.64208195 C18.7394236,2.25234436 18.3298419,2.01022194 17.885,2.01022194 C17.4406889,2.01022194 17.0315538,2.25176692 16.8168946,2.64068753 L2.87850767,28.1977282 Z"/>',
  solid: '<path d="M34.6,29.21,20.71,3.65a3.22,3.22,0,0,0-5.66,0L1.17,29.21A3.22,3.22,0,0,0,4,34H31.77a3.22,3.22,0,0,0,2.83-4.75ZM16.6,10a1.4,1.4,0,0,1,2.8,0v12a1.4,1.4,0,0,1-2.8,0ZM18,29.85a1.8,1.8,0,1,1,1.8-1.8A1.8,1.8,0,0,1,18,29.85Z"/>'
};
var warningStandardIconName = "warning-standard";
var warningStandardIcon = [warningStandardIconName, renderIcon(icon38)];

// node_modules/@clr/core/icon/shapes/accessibility-1.js
var icon39 = {
  outline: '<path d="M14.44,31.94a7.31,7.31,0,0,1-5.7-11.88L7.32,18.64a9.3,9.3,0,0,0,13.1,13.11L19,30.33A7.29,7.29,0,0,1,14.44,31.94Z"/><path d="M25.36,1.67a4.12,4.12,0,1,0,4.11,4.11A4.12,4.12,0,0,0,25.36,1.67Zm0,6.23a2.12,2.12,0,1,1,2.11-2.12A2.12,2.12,0,0,1,25.36,7.9Z"/><path d="M26.56,18.18h-5a1,1,0,0,0-.24.05l3.09-3.55a2.83,2.83,0,0,0-.69-4.33l-8-4.6a1,1,0,0,0-1.12.08L9.83,9.58A1,1,0,0,0,9.66,11a1,1,0,0,0,.79.38,1,1,0,0,0,.61-.21l4.27-3.34,3.11,1.77-5.08,5.78h0a9.28,9.28,0,0,0-4.53,1.83l1.43,1.43A7.3,7.3,0,0,1,20.42,28.81l1.42,1.43a9.27,9.27,0,0,0,.77-10.06h2.82l-.77,6.51a1,1,0,0,0,.88,1.11h.12a1,1,0,0,0,1-.88l.9-7.62a1,1,0,0,0-.25-.78A1,1,0,0,0,26.56,18.18Zm-6.37-7.56,2.52,1.46a.79.79,0,0,1,.4.59.81.81,0,0,1-.2.69L19.75,17A9.17,9.17,0,0,0,16,15.45Z"/>',
  solid: '<path d="M14.77,31.94a7.31,7.31,0,0,1-5.7-11.88L7.65,18.64a9.3,9.3,0,0,0,13.1,13.11l-1.42-1.42A7.29,7.29,0,0,1,14.77,31.94Z"/><path d="M26.65,2.1a3.12,3.12,0,1,0,3.11,3.12A3.12,3.12,0,0,0,26.65,2.1Z"/><path d="M26.81,18.18H21.47q-.31-.33-.66-.63l4.38-4.86a2.14,2.14,0,0,0-.53-3.27L20.9,7.23l0,0L17.05,5.07a1,1,0,0,0-1.11.08L11.15,8.9a1,1,0,0,0,1.23,1.58l4.27-3.34,2.87,1.63L13.6,15.39a9.33,9.33,0,0,0-4.44,1.82l1.42,1.43A7.3,7.3,0,0,1,20.75,28.81l1.43,1.43A9.27,9.27,0,0,0,23,20.18h2.74l-.77,6.51a1,1,0,0,0,.87,1.11h.12a1,1,0,0,0,1-.88l.9-7.62a1,1,0,0,0-.25-.78A1,1,0,0,0,26.81,18.18Z"/>'
};
var accessibility1IconName = "accessibility-1";
var accessibility1Icon = [accessibility1IconName, renderIcon(icon39)];

// node_modules/@clr/core/icon/shapes/accessibility-2.js
var icon40 = {
  outline: '<path d="M30.06,11h-24a1,1,0,1,0,0,2H14v9.65s0,0,0,0l-3.75,10a1,1,0,0,0,.58,1.29,1.13,1.13,0,0,0,.36.06,1,1,0,0,0,.93-.65L15.62,24h4.76l3.52,9.35a1,1,0,0,0,.93.65,1.13,1.13,0,0,0,.36-.06,1,1,0,0,0,.58-1.29L22,22.68s0,0,0,0V13h8.06a1,1,0,1,0,0-2ZM20,22H16V13h4Z"/><path d="M18,10a4,4,0,1,0-4-4A4,4,0,0,0,18,10Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,18,4Z"/>',
  solid: '<circle cx="17.96" cy="5" r="3"/><path d="M30,10H6a1,1,0,0,0,0,2h8v8.36s0,0,0,0L10.11,33.17a1,1,0,0,0,.66,1.25,1.55,1.55,0,0,0,.29,0,1,1,0,0,0,1-.71l3.29-10.84h5.38L24,33.75a1,1,0,0,0,1,.71,1.55,1.55,0,0,0,.29,0,1,1,0,0,0,.66-1.25L22,20.4s0,0,0,0V12h8a1,1,0,0,0,0-2Z"/>'
};
var accessibility2IconName = "accessibility-2";
var accessibility2Icon = [accessibility2IconName, renderIcon(icon40)];

// node_modules/@clr/core/icon/shapes/add-text.js
var icon41 = {
  outline: '<path d="M31,21H13a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><path d="M12,16a1,1,0,0,0,1,1H31a1,1,0,0,0,0-2H13A1,1,0,0,0,12,16Z"/><path d="M27,27H13a1,1,0,0,0,0,2H27a1,1,0,0,0,0-2Z"/><path d="M15.89,9a1,1,0,0,0-1-1H10V3.21a1,1,0,0,0-2,0V8H2.89a1,1,0,0,0,0,2H8v5.21a1,1,0,0,0,2,0V10h4.89A1,1,0,0,0,15.89,9Z"/>'
};
var addTextIconName = "add-text";
var addTextIcon = [addTextIconName, renderIcon(icon41)];

// node_modules/@clr/core/icon/shapes/alarm-clock.js
var icon42 = {
  outline: '<path d="M31.47,3.84a5.78,5.78,0,0,0-7.37-.63,16.08,16.08,0,0,1,8.2,7.65A5.73,5.73,0,0,0,31.47,3.84Z"/><path d="M11.42,3.43a5.77,5.77,0,0,0-7.64.41,5.72,5.72,0,0,0-.38,7.64A16.08,16.08,0,0,1,11.42,3.43Z"/><path d="M16.4,4.09A14,14,0,0,0,8.11,27.88L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.9,13.9,0,0,0,16.88-.08l2.74,2.74a1,1,0,0,0,1.41-1.41L28,27.78A14,14,0,0,0,16.4,4.09ZM19.58,29.9A12,12,0,1,1,29.92,19.56,12,12,0,0,1,19.58,29.9Z"/><path d="M24.92,20.34l-6.06-3V9.5a.9.9,0,0,0-1.8,0v9L24.12,22a.9.9,0,1,0,.79-1.62Z"/>',
  outlineAlerted: '<path d="M11.42,3.43a5.77,5.77,0,0,0-7.64.41,5.72,5.72,0,0,0-.38,7.64A16.08,16.08,0,0,1,11.42,3.43Z"/><path d="M18.86,9.5a.9.9,0,0,0-1.8,0v9L24.12,22a.9.9,0,1,0,.79-1.62l-6.06-3Z"/><path d="M28,27.78A13.88,13.88,0,0,0,31.77,15.4h-2a12.07,12.07,0,1,1-8.67-9l1-1.8a14,14,0,0,0-14,23.27L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.9,13.9,0,0,0,16.88-.08l2.74,2.74a1,1,0,0,0,1.41-1.41Z"/>',
  outlineBadged: '<path d="M11.42,3.43a5.77,5.77,0,0,0-7.64.41,5.72,5.72,0,0,0-.38,7.64A16.08,16.08,0,0,1,11.42,3.43Z"/><path d="M18.86,9.5a.9.9,0,0,0-1.8,0v9L24.12,22a.9.9,0,1,0,.79-1.62l-6.06-3Z"/><path d="M28,27.78a13.89,13.89,0,0,0,3.21-14.39,7,7,0,0,1-2.11.05A12,12,0,1,1,22.56,6.9,7.54,7.54,0,0,1,22.5,6a7.52,7.52,0,0,1,.11-1.21A14,14,0,0,0,8.11,27.88L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.9,13.9,0,0,0,16.88-.08l2.74,2.74a1,1,0,0,0,1.41-1.41Z"/>',
  solid: '<path d="M31.47,3.84a5.78,5.78,0,0,0-7.37-.63,16.08,16.08,0,0,1,8.2,7.65A5.73,5.73,0,0,0,31.47,3.84Z"/><path d="M11.42,3.43a5.77,5.77,0,0,0-7.64.41,5.72,5.72,0,0,0-.38,7.64A16.08,16.08,0,0,1,11.42,3.43Z"/><path d="M18,4A14,14,0,0,0,8.11,27.88L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.9,13.9,0,0,0,16.88-.08l2.74,2.74a1,1,0,0,0,1.41-1.41L28,27.78A14,14,0,0,0,18,4Zm7.47,17.43a1,1,0,0,1-1.33.47L17,18.44V9.69a1,1,0,0,1,2,0v7.5L25,20.1A1,1,0,0,1,25.49,21.43Z"/>',
  solidAlerted: '<path d="M11.42,3.43a5.77,5.77,0,0,0-7.64.41,5.72,5.72,0,0,0-.38,7.64A16.08,16.08,0,0,1,11.42,3.43Z"/><path d="M28,27.78A13.88,13.88,0,0,0,31.77,15.4H22.23A3.69,3.69,0,0,1,19,13.56L19,13.4v3.78L25,20.1a1,1,0,1,1-.87,1.8L17,18.44V9.69a1,1,0,0,1,2,0V10L19,9.89l3-5.28a14,14,0,0,0-14,23.27L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.9,13.9,0,0,0,16.88-.08l2.74,2.74a1,1,0,0,0,1.41-1.41Z"/>',
  solidBadged: '<path d="M11.42,3.43a5.77,5.77,0,0,0-7.64.41,5.72,5.72,0,0,0-.38,7.64A16.08,16.08,0,0,1,11.42,3.43Z"/><path d="M28,27.78a13.89,13.89,0,0,0,3.21-14.39A7.46,7.46,0,0,1,22.5,6a7.52,7.52,0,0,1,.11-1.21A14,14,0,0,0,8.11,27.88L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.9,13.9,0,0,0,16.88-.08l2.74,2.74a1,1,0,0,0,1.41-1.41Zm-2.52-6.35a1,1,0,0,1-1.33.47L17,18.44V9.69a1,1,0,0,1,2,0v7.5L25,20.1A1,1,0,0,1,25.49,21.43Z"/>'
};
var alarmClockIconName = "alarm-clock";
var alarmClockIcon = [alarmClockIconName, renderIcon(icon42)];

// node_modules/@clr/core/icon/shapes/alarm-off.js
var icon43 = {
  outline: '<path d="M31.47,3.84a5.78,5.78,0,0,0-7.37-.63,16.08,16.08,0,0,1,8.2,7.65A5.73,5.73,0,0,0,31.47,3.84Z"/><path d="M25.33,21.54a.9.9,0,0,0-.41-1.2l-3.2-1.56L24.89,22A.89.89,0,0,0,25.33,21.54Z"/><path d="M18,8.6a.9.9,0,0,0-.9.9v4.6l1.8,1.81V9.5A.9.9,0,0,0,18,8.6Z"/><path d="M11.42,3.43a5.8,5.8,0,0,0-5.81-.81L8.3,5.32A16,16,0,0,1,11.42,3.43Z"/><path d="M18,4a13.91,13.91,0,0,0-8.3,2.75l1.42,1.43A12,12,0,0,1,27.82,24.9l1.42,1.43A14,14,0,0,0,18,4Z"/><path d="M1.56,4.21,2.73,5.38a5.7,5.7,0,0,0,.67,6.1A15.78,15.78,0,0,1,5.46,8.12L6.88,9.55A13.94,13.94,0,0,0,8.11,27.88L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.89,13.89,0,0,0,16.8,0l4.14,4.15L32,31.9,3,2.8ZM25,27.72A11.89,11.89,0,0,1,18,30,12,12,0,0,1,6,18a11.89,11.89,0,0,1,2.29-7Z"/>',
  solid: '<path d="M31.47,3.84a5.78,5.78,0,0,0-7.37-.63,16.08,16.08,0,0,1,8.2,7.65A5.73,5.73,0,0,0,31.47,3.84Z"/><path d="M11.42,3.43a5.8,5.8,0,0,0-5.77-.82L8.33,5.3A16,16,0,0,1,11.42,3.43Z"/><path d="M24.92,21.94l4.34,4.36A14,14,0,0,0,9.75,6.73L17,14V9.69a1,1,0,0,1,2,0V16l2.33,2.34L25,20.1a1,1,0,0,1,.47,1.33A1,1,0,0,1,24.92,21.94Z"/><path d="M1.61,4.21,2.73,5.34a5.73,5.73,0,0,0,.67,6.15A15.88,15.88,0,0,1,5.48,8.1L6.91,9.52A13.94,13.94,0,0,0,8.11,27.88L5.56,30.43A1,1,0,1,0,7,31.84l2.66-2.66a13.89,13.89,0,0,0,16.83,0l4.16,4.17L32,31.9,3,2.8Z"/>'
};
var alarmOffIconName = "alarm-off";
var alarmOffIcon = [alarmOffIconName, renderIcon(icon43)];

// node_modules/@clr/core/icon/shapes/asterisk.js
var icon44 = {
  outline: '<path d="M28.89,20.91l-5-2.91,4.87-2.86a3.11,3.11,0,0,0,1.14-1.08,3,3,0,0,0-4.09-4.15L21,12.76V7a3,3,0,0,0-6,0v5.76L10.15,9.91a3,3,0,1,0-3,5.18l5,2.91L7.2,20.86a3.11,3.11,0,0,0-1.14,1.08,3,3,0,0,0,4.09,4.14L15,23.24V28.9a3,3,0,0,0,2,2.94A3,3,0,0,0,21,29V23.24l4.85,2.85a3,3,0,1,0,3-5.18ZM28.24,24a1,1,0,0,1-1.37.36L19,19.75V29a1,1,0,0,1-2,0V19.75L9.13,24.36a1,1,0,0,1-1-1.72L16,18l-7.9-4.64a1,1,0,1,1,1-1.72L17,16.25V7a1,1,0,0,1,2,0v9.25l7.87-4.62a1,1,0,0,1,1,1.72L20,18l7.9,4.64A1,1,0,0,1,28.24,24Z"/>',
  solid: '<path d="M28.89,20.91l-5-2.91,4.87-2.86a3.11,3.11,0,0,0,1.14-1.08,3,3,0,0,0-4.09-4.15L21,12.76V7a3,3,0,0,0-6,0v5.76L10.15,9.91a3,3,0,1,0-3,5.18l5,2.91L7.2,20.86a3.11,3.11,0,0,0-1.14,1.08,3,3,0,0,0,4.09,4.14L15,23.24V28.9a3,3,0,0,0,2,2.94A3,3,0,0,0,21,29V23.24l4.85,2.85a3,3,0,1,0,3-5.18Z"/>'
};
var asteriskIconName = "asterisk";
var asteriskIcon = [asteriskIconName, renderIcon(icon44)];

// node_modules/@clr/core/icon/shapes/ban.js
var icon45 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM4,18A13.93,13.93,0,0,1,7.43,8.85L27.15,28.57A14,14,0,0,1,4,18Zm24.57,9.15L8.85,7.43A14,14,0,0,1,28.57,27.15Z"/>'
};
var banIconName = "ban";
var banIcon = [banIconName, renderIcon(icon45)];

// node_modules/@clr/core/icon/shapes/beta.js
var icon46 = {
  outline: '<path d="M7.21,14.07h3a1.61,1.61,0,0,1,1.81,1.5,1.44,1.44,0,0,1-.84,1.34,1.67,1.67,0,0,1,1.1,1.53,1.75,1.75,0,0,1-2,1.63H7.21Zm2.71,2.42c.48,0,.82-.28.82-.67s-.34-.65-.82-.65H8.49v1.32Zm.2,2.48a.75.75,0,1,0,0-1.47H8.49V19Z"/><path d="M14.55,15.23v1.2h3v1.16h-3v1.32h3.33v1.16H13.26v-6h4.62v1.16Z"/><path d="M20.41,15.23H18.54V14.07h5v1.16H21.7v4.84H20.41Z"/><path d="M28,19.12H25.32l-.38.95H23.5l2.44-6h1.44l2.45,6H28.38ZM27.55,18l-.89-2.19L25.77,18Z"/><path d="M8.06,30a.84.84,0,0,1-.38-.08A1,1,0,0,1,7.06,29V25h-4a1,1,0,0,1-1-1V10a1,1,0,0,1,1-1h30a1,1,0,0,1,1,1V24a1,1,0,0,1-1,1H13.48L8.77,29.71A1,1,0,0,1,8.06,30Zm-4-7h4a1,1,0,0,1,1,1v2.59l3.3-3.3a1,1,0,0,1,.7-.29h19V11h-28Z"/>',
  solid: '<polygon points="25.8,18 27.5,18 26.7,15.8"/><path d="M10.4,17.5c-0.1,0-0.2,0-0.3,0H8.5V19l1.6,0c0.4,0.1,0.8-0.2,0.9-0.6C11.1,18,10.8,17.6,10.4,17.5z"/><path d="M10.7,15.8c0-0.4-0.3-0.7-0.8-0.7H8.5v1.3h1.4C10.4,16.5,10.7,16.2,10.7,15.8z"/><path d="M33.1,9h-30c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h4v4c0,0.4,0.2,0.8,0.6,0.9C7.8,30,7.9,30,8.1,30c0.3,0,0.5-0.1,0.7-0.3l4.7-4.7h19.6c0.6,0,1-0.4,1-1V10C34.1,9.4,33.6,9,33.1,9z M10.4,20.1c-0.1,0-0.1,0-0.2,0H7.2v-6h3c0.9-0.1,1.7,0.5,1.8,1.4c0,0,0,0.1,0,0.1c0,0.6-0.3,1.1-0.8,1.3c0.6,0.2,1.1,0.8,1.1,1.5C12.2,19.4,11.4,20.1,10.4,20.1z M17.9,15.2h-3.3v1.2h3v1.2h-3v1.3h3.3v1.2h-4.6v-6h4.6V15.2z M21.7,20.1h-1.3v-4.8h-1.9v-1.2h5v1.2h-1.8V20.1z M28.4,20.1l-0.4-1h-2.7l-0.4,1h-1.4l2.4-6h1.4l2.5,6H28.4z"/>'
};
var betaIconName = "beta";
var betaIcon = [betaIconName, renderIcon(icon46)];

// node_modules/@clr/core/icon/shapes/bolt.js
var icon47 = {
  outline: '<path d="M10.52,34h-3a1,1,0,0,1-.88-1.44L12.55,21H6a1,1,0,0,1-.85-1.54l10.68-17A1,1,0,0,1,16.64,2H30.07a1,1,0,0,1,.77,1.69L21.78,14h5.38a1,1,0,0,1,.73,1.66l-16.63,18A1,1,0,0,1,10.52,34ZM9.18,32h.91L24.86,16H19.59a1,1,0,0,1-.77-1.69L27.88,4H17.19L7.77,19H14.2a1,1,0,0,1,.88,1.44Z"/>',
  solid: '<path d="M30.8,2.29A.49.49,0,0,0,30.35,2H16.42a.5.5,0,0,0-.42.23l-10.71,17A.49.49,0,0,0,5.7,20h7.67L6.6,33.25a.52.52,0,0,0,.46.75h3a.5.5,0,0,0,.37-.16L28,14.85a.5.5,0,0,0-.37-.85H20.89L30.72,2.82A.49.49,0,0,0,30.8,2.29Z"/>'
};
var boltIconName = "bolt";
var boltIcon = [boltIconName, renderIcon(icon47)];

// node_modules/@clr/core/icon/shapes/book.js
var icon48 = {
  outline: '<rect x="10" y="5.2" width="18" height="1.55"/><path d="M29,8H9.86A1.89,1.89,0,0,1,8,6,2,2,0,0,1,9.86,4H29a1,1,0,0,0,0-2H9.86A4,4,0,0,0,6,6a4.14,4.14,0,0,0,0,.49,1,1,0,0,0,0,.24V30a4,4,0,0,0,3.86,4H29a1,1,0,0,0,1-1V9.25s0-.06,0-.09,0-.06,0-.09A1.07,1.07,0,0,0,29,8ZM28,32H9.86A2,2,0,0,1,8,30V9.55A3.63,3.63,0,0,0,9.86,10H28Z"/>',
  solid: '<rect x="10" y="5.2" width="18" height="1.55"/><path d="M29,8H9.86A1.89,1.89,0,0,1,8,6,2,2,0,0,1,9.86,4H29a1,1,0,1,0,0-2H9.86A4,4,0,0,0,6,6a4.14,4.14,0,0,0,0,.49,1,1,0,0,0,0,.24V30a4,4,0,0,0,3.86,4H29a1,1,0,0,0,1-1V9.25s0-.06,0-.09,0-.06,0-.09A1.07,1.07,0,0,0,29,8Z"/>'
};
var bookIconName = "book";
var bookIcon = [bookIconName, renderIcon(icon48)];

// node_modules/@clr/core/icon/shapes/briefcase.js
var icon49 = {
  outline: '<path d="M32,28a0,0,0,0,1,0,0H4V21.32a7.1,7.1,0,0,1-2-1.43V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.89a6.74,6.74,0,0,1-2,1.42Z"/><path d="M25,22.4a1,1,0,0,0,1-1V15.94H24V18H14v2H24v1.4A1,1,0,0,0,25,22.4Z"/><path d="M33,6H24V4.38A2.42,2.42,0,0,0,21.55,2h-7.1A2.42,2.42,0,0,0,12,4.38V6H3A1,1,0,0,0,2,7v8a5,5,0,0,0,5,5h3v1.4a1,1,0,0,0,2,0V15.94H10V18H7a3,3,0,0,1-3-3V8H32v7a3,3,0,0,1-3,3H28v2h1a5,5,0,0,0,5-5V7A1,1,0,0,0,33,6ZM22,6H14V4.43A.45.45,0,0,1,14.45,4h7.11a.43.43,0,0,1,.44.42Z"/>',
  solid: '<path d="M30,18A4.06,4.06,0,0,0,34,14V6H24V4.43A2.44,2.44,0,0,0,21.55,2h-7.1A2.44,2.44,0,0,0,12,4.43V6H2v8A4.06,4.06,0,0,0,6.05,18h4V15.92h2v5.7a1,1,0,1,1-2,0V20.06H6.06A6.06,6.06,0,0,1,2,18.49v9.45a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V18.49a6,6,0,0,1-4.06,1.57H28V18ZM14,4.43A.45.45,0,0,1,14.45,4h7.1a.45.45,0,0,1,.45.43V6H14ZM26,21.62a1,1,0,1,1-2,0V20.06H14V18H24V15.92h2Z"/>'
};
var briefcaseIconName = "briefcase";
var briefcaseIcon = [briefcaseIconName, renderIcon(icon49)];

// node_modules/@clr/core/icon/shapes/bubble-exclamation.js
var icon50 = {
  outline: '<path d="M18,2.5c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27C34,8.78,26.82,2.5,18,2.5ZM28.29,24.61a1,1,0,0,0-.32.73l0,5.34-4.38-2.79a1,1,0,0,0-.83-.11A16,16,0,0,1,18,28.5c-7.72,0-14-5.38-14-12s6.28-12,14-12,14,5.38,14,12A11.08,11.08,0,0,1,28.29,24.61Z"/><path d="M18,20.63a1,1,0,0,0,1-1V8.48a1,1,0,1,0-2,0V19.61A1,1,0,0,0,18,20.63Z"/><circle cx="18" cy="24.04" r="1.33"/>',
  solid: '<path d="M18,2.5c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27C34,8.78,26.82,2.5,18,2.5ZM16.93,9.13a1.41,1.41,0,1,1,2.81,0V18.9a1.41,1.41,0,1,1-2.81,0Zm1.41,17.35a1.87,1.87,0,1,1,1.87-1.87A1.87,1.87,0,0,1,18.34,26.47Z"/>'
};
var bubbleExclamationIconName = "bubble-exclamation";
var bubbleExclamationIcon = [bubbleExclamationIconName, renderIcon(icon50)];

// node_modules/@clr/core/icon/shapes/bug.js
var icon51 = {
  outline: '<circle cx="23.56" cy="17.74" r="1.95"/><circle cx="22.42" cy="25.88" r="1.58"/><circle cx="12.86" cy="17.74" r="1.95"/><circle cx="13.99" cy="25.88" r="1.58"/><path d="M30.83,20H29a19.29,19.29,0,0,0-1.18-5.73l1.46-.79a1,1,0,0,0-.95-1.76l-3,1.64A17.65,17.65,0,0,1,27,20.72C27,27,23.8,31.23,18.8,31.62V15H17.2V31.62C12.22,31.21,9,27,9,20.72a17.74,17.74,0,0,1,1.73-7.34L7.7,11.72a1,1,0,0,0-.95,1.76l1.5.8A19.38,19.38,0,0,0,7.07,20H5.17a1,1,0,0,0,0,2H7.1a14.62,14.62,0,0,0,1.66,6.17L6.87,29.49A1,1,0,1,0,8,31.12l1.84-1.29A10.38,10.38,0,0,0,18,33.66a10.38,10.38,0,0,0,8.14-3.81L28,31.12a1,1,0,1,0,1.15-1.64l-1.86-1.3A14.61,14.61,0,0,0,28.94,22h1.89a1,1,0,0,0,0-2Z"/><path d="M11.51,5.36a1.67,1.67,0,0,0,1.07-.51A3.21,3.21,0,0,1,13.76,6a16.38,16.38,0,0,0-2.65,2.89,2,2,0,0,0,1.61,3.19H23.32A2,2,0,0,0,25.1,11a2,2,0,0,0-.17-2.1A16.34,16.34,0,0,0,22.25,6a3.21,3.21,0,0,1,1.17-1.11A1.68,1.68,0,1,0,23,3.27,4.77,4.77,0,0,0,21,5a5.81,5.81,0,0,0-2.93-1,5.83,5.83,0,0,0-3,1A4.77,4.77,0,0,0,13,3.27a1.68,1.68,0,1,0-1.49,2.09ZM18,6.07c1.45,0,3.53,1.57,5.31,4h0l-10.6,0C14.49,7.63,16.56,6.07,18,6.07Z"/>',
  solid: '<path d="M30.83,20H29a19.29,19.29,0,0,0-1.18-5.73l1.46-.79a1,1,0,0,0-.95-1.76l-3,1.28H10.78L7.7,11.72a1,1,0,0,0-.95,1.76l1.5.8A19.38,19.38,0,0,0,7.07,20H5.17a1,1,0,0,0,0,2H7.1a14.62,14.62,0,0,0,1.66,6.17L6.87,29.49A1,1,0,1,0,8,31.12l1.84-1.29A10.29,10.29,0,0,0,17,33.6V15h2V33.6a10.29,10.29,0,0,0,7.16-3.75L28,31.12a1,1,0,1,0,1.15-1.64l-1.86-1.3A14.61,14.61,0,0,0,28.94,22h1.89a1,1,0,0,0,0-2ZM10.91,17.74a1.95,1.95,0,1,1,1.95,1.95A1.95,1.95,0,0,1,10.91,17.74ZM14,27.46a1.58,1.58,0,1,1,1.58-1.58A1.58,1.58,0,0,1,14,27.46Zm8.43,0A1.58,1.58,0,1,1,24,25.88,1.58,1.58,0,0,1,22.42,27.46Zm1.13-7.77a1.95,1.95,0,1,1,1.95-1.95A1.95,1.95,0,0,1,23.56,19.69Z"/><path d="M11.23,5.26a1.67,1.67,0,0,0,.54-.32,5.9,5.9,0,0,1,.89.58,7.44,7.44,0,0,1,.95.94A18.48,18.48,0,0,0,10.79,9.7c-.4.57.09,1.28.86,1.28H24.44c.77,0,1.26-.71.86-1.28a18.38,18.38,0,0,0-2.88-3.28,7.28,7.28,0,0,1,.91-.9,5.9,5.9,0,0,1,.89-.58,1.69,1.69,0,1,0-.56-1.51,7.49,7.49,0,0,0-1.32.83,9.06,9.06,0,0,0-1.19,1.18A5.85,5.85,0,0,0,18,4.3a5.91,5.91,0,0,0-3.17,1.19,9.2,9.2,0,0,0-1.22-1.21,7.49,7.49,0,0,0-1.32-.83,1.68,1.68,0,1,0-1.11,1.83Z"/>'
};
var bugIconName = "bug";
var bugIcon = [bugIconName, renderIcon(icon51)];

// node_modules/@clr/core/icon/shapes/bullseye.js
var icon52 = {
  outline: '<path d="M18,2a15.92,15.92,0,0,0-4.25.59l.77,1.86a14.07,14.07,0,1,1-10,10l-1.86-.78A16,16,0,1,0,18,2Z"/><path d="M7.45,15.7a10.81,10.81,0,1,0,8.3-8.26L16.37,9A9.24,9.24,0,1,1,9,16.32Z"/><path d="M18,22.09a4.08,4.08,0,0,1-4-3.68l-1.63-.68c0,.09,0,.18,0,.27A5.69,5.69,0,1,0,18,12.31h-.24L18.43,14A4.07,4.07,0,0,1,18,22.09Z"/><path d="M8.2,13.34a.5.5,0,0,0,.35.15H12.2l5.37,5.37A1,1,0,0,0,19,17.44L13.53,12V8.51a.5.5,0,0,0-.15-.35L7.79,2.57a.5.5,0,0,0-.85.35v4H3a.5.5,0,0,0-.35.85Z"/>',
  solid: '<path d="M19,18.85a1,1,0,0,1-1.41,0l-3-3A4,4,0,0,0,13.91,18,4.09,4.09,0,1,0,18,13.91a4,4,0,0,0-2,.55l3,3A1,1,0,0,1,19,18.85Z"/><path d="M18,2a15.92,15.92,0,0,0-4.25.59l1.6,3.89A11.89,11.89,0,1,1,6.49,15.3L2.61,13.68A16,16,0,1,0,18,2Z"/><path d="M8,15.94A10.17,10.17,0,1,0,16,8l1.69,4.11.31,0A5.88,5.88,0,1,1,12.12,18c0-.12,0-.23,0-.35Z"/><path d="M8.2,13.34a.5.5,0,0,0,.35.15H12.2l2.35,2.35A4.09,4.09,0,0,1,16,14.46L13.53,12V8.51a.5.5,0,0,0-.15-.35L7.79,2.57a.5.5,0,0,0-.85.35v4H3a.5.5,0,0,0-.35.85Z"/>'
};
var bullseyeIconName = "bullseye";
var bullseyeIcon = [bullseyeIconName, renderIcon(icon52)];

// node_modules/@clr/core/icon/shapes/child-arrow.js
var icon53 = {
  outline: '<path d="M24.82,15.8a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.41L27.2,21H9V3.78a1,1,0,1,0-2,0V21a2,2,0,0,0,2,2H27.15l-3.74,3.75a1,1,0,0,0,0,1.41,1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29L31,22Z"/>'
};
var childArrowIconName = "child-arrow";
var childArrowIcon = [childArrowIconName, renderIcon(icon53)];

// node_modules/@clr/core/icon/shapes/circle.js
var icon54 = {
  outline: '<path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"/>',
  solid: '<path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34Z"/>'
};
var circleIconName = "circle";
var circleIcon = [circleIconName, renderIcon(icon54)];

// node_modules/@clr/core/icon/shapes/circle-arrow.js
var icon55 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M18.08,8.26l-7.61,7.61a1,1,0,1,0,1.41,1.41L17,12.18v15a1,1,0,0,0,2,0V12l5.28,5.28a1,1,0,1,0,1.41-1.41Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm8,15.57a1.43,1.43,0,0,1-2,0L19.4,13V27.14a1.4,1.4,0,0,1-2.8,0v-14l-4.43,4.43a1.4,1.4,0,0,1-2-2L18.08,7.7,26,15.59A1.4,1.4,0,0,1,26,17.57Z"/>'
};
var circleArrowIconName = "circle-arrow";
var circleArrowIcon = [circleArrowIconName, renderIcon(icon55)];

// node_modules/@clr/core/icon/shapes/clipboard.js
var icon56 = {
  outline: '<path d="M29.29,5H27V7h2V32H7V7H9V5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V6.69A1.7,1.7,0,0,0,29.29,5Z"/><path d="M26,7.33A2.34,2.34,0,0,0,23.67,5H21.87a4,4,0,0,0-7.75,0H12.33A2.34,2.34,0,0,0,10,7.33V11H26ZM24,9H12V7.33A.33.33,0,0,1,12.33,7H16V6a2,2,0,0,1,4,0V7h3.67a.33.33,0,0,1,.33.33Z"/><rect x="11" y="14" width="14" height="2"/><rect x="11" y="18" width="14" height="2"/><rect x="11" y="22" width="14" height="2"/><rect x="11" y="26" width="14" height="2"/>',
  outlineBadged: '<rect x="11" y="14" width="14" height="2"/><rect x="11" y="18" width="14" height="2"/><rect x="11" y="22" width="14" height="2"/><rect x="11" y="26" width="14" height="2"/><path d="M23.13,9H12V7.33A.33.33,0,0,1,12.33,7H16V6a2,2,0,0,1,4,0V7h2.57a7.52,7.52,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1h-.7a4,4,0,0,0-7.75,0H12.33A2.34,2.34,0,0,0,10,7.33V11H24.42A7.5,7.5,0,0,1,23.13,9Z"/><path d="M30,13.5a7.52,7.52,0,0,1-1-.07V32H7V7H9V5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V13.43A7.52,7.52,0,0,1,30,13.5Z"/>',
  solid: '<path d="M29.29,5H22.17a4.45,4.45,0,0,0-4.11-3A4.46,4.46,0,0,0,14,5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V6.69A1.7,1.7,0,0,0,29.29,5Zm-18,3a1,1,0,0,1,1-1h3.44V6.31a2.31,2.31,0,1,1,4.63,0V7h3.44a1,1,0,0,1,1,1v2H11.31ZM25,28H11V26H25Zm0-4H11V22H25Zm0-4H11V18H25Zm0-4H11V14H25Z"/>',
  solidBadged: '<path d="M30,13.5A7.49,7.49,0,0,1,23.66,10H11.31V8a1,1,0,0,1,1-1h3.44V6.31a2.31,2.31,0,1,1,4.63,0V7h2.19a7.54,7.54,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1h-.4a4.45,4.45,0,0,0-4.11-3A4.46,4.46,0,0,0,14,5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V13.43A7.52,7.52,0,0,1,30,13.5ZM25,28H11V26H25Zm0-4H11V22H25Zm0-4H11V18H25Zm0-4H11V14H25Z"/>'
};
var clipboardIconName = "clipboard";
var clipboardIcon = [clipboardIconName, renderIcon(icon56)];

// node_modules/@clr/core/icon/shapes/clock.js
var icon57 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M18.92,18.4V10.75a1,1,0,0,0-2,0v8.72l5.9,4a1,1,0,1,0,1.11-1.66Z"/><path d="M8,17.94A9.94,9.94,0,0,1,23.41,9.59l.85-1.36a11.55,11.55,0,1,0-8.53,21L16,27.7A10,10,0,0,1,8,17.94Z"/>',
  outlineAlerted: '<path d="M18.92,10.75a1,1,0,0,0-2,0v8.72l5.9,4a1,1,0,1,0,1.11-1.66l-5-3.39Z"/><path d="M33.77,15.39h-2A14,14,0,1,1,22.09,4.61l1-1.76A16,16,0,1,0,34,18,16,16,0,0,0,33.77,15.39Z"/><path d="M18,8a9.81,9.81,0,0,1,2,.23l.85-1.46a11.55,11.55,0,1,0-5.13,22.52L16,27.7A10,10,0,0,1,18,8Z"/>',
  outlineBadged: '<path d="M18.92,10.75a1,1,0,0,0-2,0v8.72l5.9,4a1,1,0,1,0,1.11-1.66l-5-3.39Z"/><path d="M33.12,12.81a7.44,7.44,0,0,1-1.91.58,14.05,14.05,0,1,1-8.6-8.6,7.44,7.44,0,0,1,.58-1.91,16.06,16.06,0,1,0,9.93,9.93Z"/><path d="M18,6.38a11.56,11.56,0,0,0-2.27,22.89L16,27.7a10,10,0,1,1,7.39-18.1h0a7.45,7.45,0,0,1-.78-2.23A11.45,11.45,0,0,0,18,6.38Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm6.2,21.18a1,1,0,0,1-1.39.28l-5.9-4V10.75a1,1,0,0,1,2,0V18.4l5,3.39A1,1,0,0,1,24.2,23.18ZM23.85,8.23a11.39,11.39,0,1,0-8.54,20.83L15,30.63a13,13,0,1,1,9.7-23.77Z"/>',
  solidAlerted: '<path d="M33.77,15.39H22.23A3.69,3.69,0,0,1,19,13.56c0-.09-.09-.18-.13-.27V18.4l5,3.39a1,1,0,0,1-1.11,1.66l-5.9-4V10.75a1,1,0,0,1,1.91-.41A3.65,3.65,0,0,1,19,9.89L20.74,7A11.19,11.19,0,0,0,18,6.6a11.39,11.39,0,0,0-2.69,22.47L15,30.63A13,13,0,0,1,18,5a12.8,12.8,0,0,1,3.57.51l1.53-2.66A16,16,0,1,0,34,18,16,16,0,0,0,33.77,15.39Z"/>',
  solidBadged: '<path d="M33.12,12.81A7.48,7.48,0,0,1,22.68,7.63,11.24,11.24,0,0,0,18,6.6a11.39,11.39,0,0,0-2.69,22.47L15,30.63A13,13,0,0,1,18,5a12.81,12.81,0,0,1,4.51.82,7.46,7.46,0,0,1,.68-2.94,16.06,16.06,0,1,0,9.93,9.93ZM24.2,23.18a1,1,0,0,1-1.39.28l-5.9-4V10.75a1,1,0,0,1,2,0V18.4l5,3.39A1,1,0,0,1,24.2,23.18Z"/>'
};
var clockIconName = "clock";
var clockIcon = [clockIconName, renderIcon(icon57)];

// node_modules/@clr/core/icon/shapes/clone.js
var icon58 = {
  outline: '<path d="M6,6H22v4h2V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V22a2,2,0,0,0,2,2h4V22H6Z"/><path d="M30,12H14a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V14A2,2,0,0,0,30,12Zm0,18H14V14H30Z"/><polygon points="21 28 23 28 23 23 28 23 28 21 23 21 23 16 21 16 21 21 16 21 16 23 21 23 21 28"/>',
  solid: '<path d="M24,10V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V22a2,2,0,0,0,2,2h4V12a2,2,0,0,1,2-2Z"/><path d="M30,12H14a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V14A2,2,0,0,0,30,12ZM28,23H23v5H21V23H16V21h5V16h2v5h5Z"/>'
};
var cloneIconName = "clone";
var cloneIcon = [cloneIconName, renderIcon(icon58)];

// node_modules/@clr/core/icon/shapes/collapse-card.js
var icon59 = {
  outline: '<path d="M33,21H3a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V22A1,1,0,0,0,33,21Zm-1,6H4V23H32Z"/><path d="M18,20.22l5.65-5.65a.81.81,0,0,0,0-1.14.8.8,0,0,0-1.13,0L18,18l-4.52-4.52a.8.8,0,0,0-1.13,0,.81.81,0,0,0,0,1.14Z"/><path d="M18,14.22l5.65-5.65a.81.81,0,0,0,0-1.14.8.8,0,0,0-1.13,0L18,12,13.48,7.43a.8.8,0,0,0-1.13,0,.81.81,0,0,0,0,1.14Z"/>',
  solid: '<rect x="2" y="22" width="32" height="8" rx="1" ry="1"/><path d="M18,20.7l-5.79-5.79a1,1,0,0,1,0-1.41,1,1,0,0,1,1.41,0L18,17.87l4.38-4.37a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.41Z"/><path d="M18,14.5,12.21,8.71a1,1,0,0,1,0-1.42,1,1,0,0,1,1.41,0L18,11.67l4.38-4.38a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.42Z"/>'
};
var collapseCardIconName = "collapse-card";
var collapseCardIcon = [collapseCardIconName, renderIcon(icon59)];

// node_modules/@clr/core/icon/shapes/color-palette.js
var icon60 = {
  outline: '<path d="M21.54,23.05a3.22,3.22,0,0,1-3-1.77A3.05,3.05,0,0,1,18.5,19a3.74,3.74,0,0,1,1.95-2.06A3.4,3.4,0,0,1,25,18.3a3,3,0,0,1,.08,2.32,3.69,3.69,0,0,1-2,2.07A3.85,3.85,0,0,1,21.54,23.05Zm.54-4.91a2.41,2.41,0,0,0-1,.21h0A2.13,2.13,0,0,0,20,19.51a1.37,1.37,0,0,0,0,1.09,1.81,1.81,0,0,0,2.45.63,2.1,2.1,0,0,0,1.12-1.15,1.4,1.4,0,0,0,0-1.1A1.59,1.59,0,0,0,22.08,18.14Zm-1.29-.52h0Z"/><path d="M16.19,33.87A13.72,13.72,0,0,1,6.4,30,13.86,13.86,0,0,1,2,20c0-4.4,2-8.84,5.68-12.5a18.2,18.2,0,0,1,13.1-5.37h.12c3.33,0,6.85,1.49,7.24,4.73.21,1.77-.59,3.47-1.29,5-.55,1.17-1.11,2.39-.72,2.81s1,.12,2.09-.2a6.27,6.27,0,0,1,3.38-.36,3,3,0,0,1,1.87,1.56c.94,1.83.47,4.67-.23,6.54h0A17.38,17.38,0,0,1,29,28.74,19.43,19.43,0,0,1,16.19,33.87ZM20.78,4.16A16.22,16.22,0,0,0,9.09,9C5.79,12.23,4,16.16,4,20A11.92,11.92,0,0,0,7.8,28.6c5.38,5.25,14.62,3.55,19.87-1.33a15.52,15.52,0,0,0,3.7-5.75h0c.7-1.9.84-3.92.32-4.92a1,1,0,0,0-.61-.55,4.86,4.86,0,0,0-2.29.35c-1.31.39-3,.89-4.12-.35-1.32-1.4-.46-3.25.37-5a7.93,7.93,0,0,0,1.11-3.9c-.24-2-2.81-2.95-5.26-3Z"/><path d="M23.87,26.65A2.59,2.59,0,0,0,22.35,25L22,24.9l-.46,1.53.16,0a1,1,0,0,1,.6.61c.17.6-.41,1.31-1.26,1.55s-1.71-.07-1.88-.66l-1.54.43h0a2.83,2.83,0,0,0,2.84,1.91,4,4,0,0,0,1-.14A3,3,0,0,0,23.87,26.65Z"/><path d="M15.07,25.59h0a2.73,2.73,0,0,0-2.24-1.84l-.27,1.58a1.12,1.12,0,0,1,1,.7c.17.59-.41,1.3-1.26,1.54A1.92,1.92,0,0,1,11,27.52a1,1,0,0,1-.6-.61s0-.09,0-.13l-1.58.16a2,2,0,0,0,.06.41A2.59,2.59,0,0,0,10.37,29a3.36,3.36,0,0,0,1.31.25,3.7,3.7,0,0,0,1-.14A3,3,0,0,0,15.07,25.59Z"/><path d="M10.78,19.17a2.59,2.59,0,0,0-1.52-1.65,2.91,2.91,0,0,0-.5-.16l-.37,1.56a1.21,1.21,0,0,1,.25.08,1,1,0,0,1,.6.6c.17.6-.41,1.31-1.26,1.55s-1.71-.06-1.88-.66a.86.86,0,0,1,0-.39l-1.56-.34a2.4,2.4,0,0,0,0,1.16A2.83,2.83,0,0,0,7.4,22.83a4,4,0,0,0,1-.14A3,3,0,0,0,10.78,19.17Z"/><path d="M13.45,11.4a2.59,2.59,0,0,0-1.52-1.65,1.17,1.17,0,0,0-.2-.06l-.52,1.51a.38.38,0,0,1,.1,0,1,1,0,0,1,.6.6c.17.6-.41,1.31-1.26,1.55a2.06,2.06,0,0,1-1.28-.05,1,1,0,0,1-.6-.61.85.85,0,0,1,0-.32l-1.58-.19a2.3,2.3,0,0,0,.06.94A2.56,2.56,0,0,0,8.75,14.8a3.37,3.37,0,0,0,1.31.26,4,4,0,0,0,1-.14A3,3,0,0,0,13.45,11.4Z"/><path d="M21,6.78a2.56,2.56,0,0,0-1.52-1.65l-.3-.1L18.7,6.56l.15,0a1,1,0,0,1,.6.61c.17.6-.41,1.3-1.26,1.54s-1.71-.06-1.88-.65a.9.9,0,0,1,.06-.58L14.89,6.9a2.47,2.47,0,0,0-.12,1.63,2.84,2.84,0,0,0,2.84,1.91,3.58,3.58,0,0,0,1-.15A3,3,0,0,0,21,6.78Z"/>',
  solid: '<path d="M32.23,14.89c-2.1-.56-4.93,1.8-6.34.3-1.71-1.82,2.27-5.53,1.86-8.92-.33-2.78-3.51-4.08-6.66-4.1A18.5,18.5,0,0,0,7.74,7.59c-6.64,6.59-8.07,16-1.37,22.48,6.21,6,16.61,4.23,22.67-1.4a17.73,17.73,0,0,0,4.22-6.54C34.34,19.23,34.44,15.49,32.23,14.89ZM9.4,10.57a2.23,2.23,0,0,1,2.87,1.21,2.22,2.22,0,0,1-1.81,2.53A2.22,2.22,0,0,1,7.59,13.1,2.23,2.23,0,0,1,9.4,10.57ZM5.07,20.82a2.22,2.22,0,0,1,1.82-2.53A2.22,2.22,0,0,1,9.75,19.5,2.23,2.23,0,0,1,7.94,22,2.24,2.24,0,0,1,5.07,20.82Zm7,8.33a2.22,2.22,0,0,1-2.87-1.21A2.23,2.23,0,0,1,11,25.41a2.23,2.23,0,0,1,2.87,1.21A2.22,2.22,0,0,1,12,29.15ZM15,8.26a2.23,2.23,0,0,1,1.81-2.53,2.24,2.24,0,0,1,2.87,1.21,2.22,2.22,0,0,1-1.82,2.53A2.21,2.21,0,0,1,15,8.26Zm5.82,22.19a2.22,2.22,0,0,1-2.87-1.21,2.23,2.23,0,0,1,1.81-2.53,2.24,2.24,0,0,1,2.87,1.21A2.22,2.22,0,0,1,20.78,30.45Zm5-10.46a3.2,3.2,0,0,1-1.69,1.76,3.53,3.53,0,0,1-1.4.3,2.78,2.78,0,0,1-2.56-1.5,2.49,2.49,0,0,1-.07-2,3.2,3.2,0,0,1,1.69-1.76,3,3,0,0,1,4,1.2A2.54,2.54,0,0,1,25.79,20Z"/>'
};
var colorPaletteIconName = "color-palette";
var colorPaletteIcon = [colorPaletteIconName, renderIcon(icon60)];

// node_modules/@clr/core/icon/shapes/color-picker.js
var icon61 = {
  outline: '<path d="M33,10.05a5.07,5.07,0,0,0,.1-7.17A5.06,5.06,0,0,0,26,3L20.78,8.15a2.13,2.13,0,0,1-3,0l-.67-.67L15.72,8.92,27.08,20.28l1.42-1.42-.67-.67a2.13,2.13,0,0,1,0-3ZM26.44,13.8a4.07,4.07,0,0,0-1.08,1.92l-5.08-5.08A4.07,4.07,0,0,0,22.2,9.56l5.16-5.17a3.09,3.09,0,0,1,4.35-.1,3.09,3.09,0,0,1-.1,4.35Z"/><path d="M7.3,31.51a2,2,0,1,1-2.83-2.83L18.58,14.57l-1.42-1.41L3.05,27.27a4,4,0,0,0-.68,4.8L.89,33.55A1,1,0,0,0,.89,35a1,1,0,0,0,1.42,0l1.43-1.44a3.93,3.93,0,0,0,2.09.6,4.06,4.06,0,0,0,2.88-1.2L22.82,18.81,21.41,17.4Z"/>',
  solid: '<path d="M33.73,2.11a4.09,4.09,0,0,0-5.76.1L22.81,7.38a3.13,3.13,0,0,1-4.3.11L17.09,8.91,27,18.79l1.42-1.42A3.18,3.18,0,0,1,28.46,13l5.17-5.17A4.08,4.08,0,0,0,33.73,2.11Z"/><path d="M22.18,16.79,7.46,31.51a2,2,0,1,1-2.82-2.83L19.35,14l-1.41-1.41L3.22,27.27a4,4,0,0,0-.68,4.8L1.06,33.55a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l1.44-1.44a3.93,3.93,0,0,0,2.09.6,4.06,4.06,0,0,0,2.88-1.2L23.6,18.21Z"/>'
};
var colorPickerIconName = "color-picker";
var colorPickerIcon = [colorPickerIconName, renderIcon(icon61)];

// node_modules/@clr/core/icon/shapes/copy.js
var icon62 = {
  outline: '<path d="M29.5,7h-19A1.5,1.5,0,0,0,9,8.5v24A1.5,1.5,0,0,0,10.5,34h19A1.5,1.5,0,0,0,31,32.5V8.5A1.5,1.5,0,0,0,29.5,7ZM29,32H11V9H29Z"/><path d="M26,3.5A1.5,1.5,0,0,0,24.5,2H5.5A1.5,1.5,0,0,0,4,3.5v24A1.5,1.5,0,0,0,5.5,29H6V4H26Z"/>',
  solid: '<path d="M27,3.56A1.56,1.56,0,0,0,25.43,2H5.57A1.56,1.56,0,0,0,4,3.56V28.44A1.56,1.56,0,0,0,5.57,30h.52V4.07H27Z"/><rect x="8" y="6" width="23" height="28" rx="1.5" ry="1.5"/>'
};
var copyIconName = "copy";
var copyIcon = [copyIconName, renderIcon(icon62)];

// node_modules/@clr/core/icon/shapes/copy-to-clipboard.js
var icon63 = {
  outline: '<path d="M22.6,4H21.55a3.89,3.89,0,0,0-7.31,0H13.4A2.41,2.41,0,0,0,11,6.4V10H25V6.4A2.41,2.41,0,0,0,22.6,4ZM23,8H13V6.25A.25.25,0,0,1,13.25,6h2.69l.12-1.11A1.24,1.24,0,0,1,16.61,4a2,2,0,0,1,3.15,1.18l.09.84h2.9a.25.25,0,0,1,.25.25Z"/><path d="M33.25,18.06H21.33l2.84-2.83a1,1,0,1,0-1.42-1.42L17.5,19.06l5.25,5.25a1,1,0,0,0,.71.29,1,1,0,0,0,.71-1.7l-2.84-2.84H33.25a1,1,0,0,0,0-2Z"/><path d="M29,16h2V6.68A1.66,1.66,0,0,0,29.35,5H27.08V7H29Z"/><path d="M29,31H7V7H9V5H6.64A1.66,1.66,0,0,0,5,6.67V31.32A1.66,1.66,0,0,0,6.65,33H29.36A1.66,1.66,0,0,0,31,31.33V22.06H29Z"/>'
};
var copyToClipboardIconName = "copy-to-clipboard";
var copyToClipboardIcon = [copyToClipboardIconName, renderIcon(icon63)];

// node_modules/@clr/core/icon/shapes/crosshairs.js
var icon64 = {
  outline: '<path d="M18,29A11,11,0,1,1,29,18,11,11,0,0,1,18,29ZM18,9a9,9,0,1,0,9,9A9,9,0,0,0,18,9Z"/><path d="M18,23a5,5,0,1,1,5-5A5,5,0,0,1,18,23Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,18,15Z"/><path d="M18,9a1,1,0,0,1-1-1V2.8a1,1,0,0,1,2,0V8A1,1,0,0,1,18,9Z"/><path d="M18,34a1,1,0,0,1-1-1V28a1,1,0,0,1,2,0v5A1,1,0,0,1,18,34Z"/><path d="M8,19H3.17a1,1,0,0,1,0-2H8a1,1,0,0,1,0,2Z"/><path d="M33.1,19H28a1,1,0,0,1,0-2h5.1a1,1,0,0,1,0,2Z"/>'
};
var crosshairsIconName = "crosshairs";
var crosshairsIcon = [crosshairsIconName, renderIcon(icon64)];

// node_modules/@clr/core/icon/shapes/cursor-arrow.js
var icon65 = {
  outline: '<path d="M14.58,32.31a1,1,0,0,1-.94-.65L4,5.65A1,1,0,0,1,5.25,4.37l26,9.68a1,1,0,0,1-.05,1.89l-8.36,2.57,8.3,8.3a1,1,0,0,1,0,1.41l-3.26,3.26a1,1,0,0,1-.71.29h0a1,1,0,0,1-.71-.29l-8.33-8.33-2.6,8.45a1,1,0,0,1-.93.71Zm3.09-12a1,1,0,0,1,.71.29l8.79,8.79L29,27.51l-8.76-8.76a1,1,0,0,1,.41-1.66l7.13-2.2L6.6,7l7.89,21.2L16.71,21a1,1,0,0,1,.71-.68Z"/>',
  solid: '<path d="M29,12.36,3.88,3A1,1,0,0,0,2.59,4.28L12,29.44a1,1,0,0,0,1.89-.05l2.69-8.75,9.12,8.9a1,1,0,0,0,1.41,0l2.35-2.35a1,1,0,0,0,0-1.41l-9.09-8.86L29,14.25A1,1,0,0,0,29,12.36Z"/>'
};
var cursorArrowIconName = "cursor-arrow";
var cursorArrowIcon = [cursorArrowIconName, renderIcon(icon65)];

// node_modules/@clr/core/icon/shapes/cursor-hand.js
var icon66 = {
  outline: '<path d="M30.74,15.19a13.66,13.66,0,0,0-6.87-3.83A26,26,0,0,0,18,10.58V5.28A3.4,3.4,0,0,0,14.5,2,3.4,3.4,0,0,0,11,5.28v10L9.4,13.7a3.77,3.77,0,0,0-5.28,0A3.67,3.67,0,0,0,3,16.33a3.6,3.6,0,0,0,1,2.56l4.66,5.52a11.53,11.53,0,0,0,1.43,4,10.12,10.12,0,0,0,2,2.54v1.92a1.07,1.07,0,0,0,1,1.08H27a1.07,1.07,0,0,0,1-1.08v-2.7a12.81,12.81,0,0,0,3-8.36v-6A1,1,0,0,0,30.74,15.19ZM29,21.86a10.72,10.72,0,0,1-2.6,7.26,1.11,1.11,0,0,0-.4.72V32H14.14V30.52a1,1,0,0,0-.44-.83,7.26,7.26,0,0,1-1.82-2.23,9.14,9.14,0,0,1-1.2-3.52,1,1,0,0,0-.23-.59L5.53,17.53a1.7,1.7,0,0,1,0-2.42,1.76,1.76,0,0,1,2.47,0l3,3v3.14l2-1V5.28A1.42,1.42,0,0,1,14.5,4,1.42,1.42,0,0,1,16,5.28v11.8l2,.43V12.59a24.27,24.27,0,0,1,2.51.18V18l1.6.35V13c.41.08.83.17,1.26.28a14.88,14.88,0,0,1,1.53.49v5.15l1.6.35V14.5A11.06,11.06,0,0,1,29,16.23Z"/>',
  solid: '<path d="M28.69,14.33v4.83l-2-.43V13.24a16.19,16.19,0,0,0-2.33-.84v5.82l-2-.43V12c-1.1-.18-2.18-.3-3.08-.36v5.51l-2-.43V11.48h0V4.34a2.53,2.53,0,0,0-2.6-2.43,2.53,2.53,0,0,0-2.6,2.43V17.27h0v2.59l-2,1V15.6L7.75,13.21a2.83,2.83,0,0,0-4,0,2.93,2.93,0,0,0,0,4.09l6,7.1a10.82,10.82,0,0,0,1.39,4.22,8.42,8.42,0,0,0,2.21,2.73v2.56H27.79V30.62a12.54,12.54,0,0,0,3-8.5v-6A10,10,0,0,0,28.69,14.33Z"/>'
};
var cursorHandIconName = "cursor-hand";
var cursorHandIcon = [cursorHandIconName, renderIcon(icon66)];

// node_modules/@clr/core/icon/shapes/cursor-hand-click.js
var icon67 = {
  outline: '<path d="M30.4,17.6c-1.8-1.9-4.2-3.2-6.7-3.7c-1.1-0.3-2.2-0.5-3.3-0.6c2.8-3.3,2.3-8.3-1-11.1s-8.3-2.3-11.1,1s-2.3,8.3,1,11.1c0.6,0.5,1.2,0.9,1.8,1.1v2.2l-1.6-1.5c-1.4-1.4-3.7-1.4-5.2,0c-1.4,1.4-1.5,3.6-0.1,5l4.6,5.4c0.2,1.4,0.7,2.7,1.4,3.9c0.5,0.9,1.2,1.8,1.9,2.5v1.9c0,0.6,0.4,1,1,1h13.6c0.5,0,1-0.5,1-1v-2.6c1.9-2.3,2.9-5.2,2.9-8.1v-5.8C30.7,17.9,30.6,17.7,30.4,17.6z M8.4,8.2c0-3.3,2.7-5.9,6-5.8c3.3,0,5.9,2.7,5.8,6c0,1.8-0.8,3.4-2.2,4.5V7.9c-0.1-1.8-1.6-3.2-3.4-3.2c-1.8-0.1-3.4,1.4-3.4,3.2v5.2C9.5,12.1,8.5,10.2,8.4,8.2L8.4,8.2z M28.7,24c0.1,2.6-0.8,5.1-2.5,7.1c-0.2,0.2-0.4,0.4-0.4,0.7v2.1H14.2v-1.4c0-0.3-0.2-0.6-0.4-0.8c-0.7-0.6-1.3-1.3-1.8-2.2c-0.6-1-1-2.2-1.2-3.4c0-0.2-0.1-0.4-0.2-0.6l-4.8-5.7c-0.3-0.3-0.5-0.7-0.5-1.2c0-0.4,0.2-0.9,0.5-1.2c0.7-0.6,1.7-0.6,2.4,0l2.9,2.9v3l1.9-1V7.9c0.1-0.7,0.7-1.3,1.5-1.2c0.7,0,1.4,0.5,1.4,1.2v11.5l2,0.4v-4.6c0.1-0.1,0.2-0.1,0.3-0.2c0.7,0,1.4,0.1,2.1,0.2v5.1l1.6,0.3v-5.2l1.2,0.3c0.5,0.1,1,0.3,1.5,0.5v5l1.6,0.3v-4.6c0.9,0.4,1.7,1,2.4,1.7L28.7,24z"/>'
};
var cursorHandClickIconName = "cursor-hand-click";
var cursorHandClickIcon = [cursorHandClickIconName, renderIcon(icon67)];

// node_modules/@clr/core/icon/shapes/cursor-hand-grab.js
var icon68 = {
  outline: '<path d="M28.09,9.74a4,4,0,0,0-1.16.19c-.19-1.24-1.55-2.18-3.27-2.18A4,4,0,0,0,22.13,8,3.37,3.37,0,0,0,19,6.3a3.45,3.45,0,0,0-2.87,1.32,3.65,3.65,0,0,0-1.89-.51A3.05,3.05,0,0,0,11,9.89v.91c-1.06.4-4.11,1.8-4.91,4.84s.34,8,2.69,11.78a25.21,25.21,0,0,0,5.9,6.41.9.9,0,0,0,.53.17H25.55a.92.92,0,0,0,.55-.19,13.13,13.13,0,0,0,3.75-6.13A25.8,25.8,0,0,0,31.41,18v-5.5A3.08,3.08,0,0,0,28.09,9.74ZM29.61,18a24,24,0,0,1-1.47,9.15A12.46,12.46,0,0,1,25.2,32.2H15.47a23.75,23.75,0,0,1-5.2-5.72c-2.37-3.86-3-8.23-2.48-10.39A5.7,5.7,0,0,1,11,12.76v7.65a.9.9,0,0,0,1.8,0V9.89c0-.47.59-1,1.46-1s1.49.52,1.49,1v5.72h1.8V8.81c0-.28.58-.71,1.46-.71s1.53.48,1.53.75v6.89h1.8V10l.17-.12a2.1,2.1,0,0,1,1.18-.32c.93,0,1.5.44,1.5.68l0,6.5H27V11.87a1.91,1.91,0,0,1,1.12-.33c.86,0,1.52.51,1.52.94Z"/>'
};
var cursorHandGrabIconName = "cursor-hand-grab";
var cursorHandGrabIcon = [cursorHandGrabIconName, renderIcon(icon68)];

// node_modules/@clr/core/icon/shapes/cursor-hand-open.js
var icon69 = {
  outline: '<path d="M31.46,8.57A3.11,3.11,0,0,0,27,5.75a3.19,3.19,0,0,0-4.66-2.64,3.29,3.29,0,0,0-6.42-.76,3.23,3.23,0,0,0-1.66-.46A3.27,3.27,0,0,0,11,5.18V17.84c-1.28-1.6-2.53-3.18-2.72-3.45A3.19,3.19,0,0,0,5.56,12.9a3.37,3.37,0,0,0-3.47,3.48C2.18,18.18,5.66,24.54,8,28c3.54,5.24,6.92,6,7.07,6l.18,0H25.59a.92.92,0,0,0,.55-.19,13.13,13.13,0,0,0,3.75-6.13c1-3.09,1.53-7.53,1.58-13.56ZM28.18,27.12a12.46,12.46,0,0,1-2.94,5.08H15.33c-.47-.14-3.07-1.1-5.87-5.25S3.94,17.27,3.89,16.29a1.5,1.5,0,0,1,.45-1.13,1.52,1.52,0,0,1,1.14-.46,1.43,1.43,0,0,1,1.32.71c.29.43,2.36,3,3.57,4.53L12.8,18.3V5.18a1.48,1.48,0,1,1,2.95,0V16.32h1.8v-13a1.51,1.51,0,0,1,3,0V16.45h1.8V6a1.43,1.43,0,1,1,2.85,0V17.44H27V8.54a1.33,1.33,0,0,1,2.65,0v5.55C29.62,20,29.14,24.21,28.18,27.12Z"/>'
};
var cursorHandOpenIconName = "cursor-hand-open";
var cursorHandOpenIcon = [cursorHandOpenIconName, renderIcon(icon69)];

// node_modules/@clr/core/icon/shapes/cursor-move.js
var icon70 = {
  outline: '<path d="M28.85,12.89a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L30.14,17H19V5.86l2.69,2.7a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.42L18,2,12.89,7.15a1,1,0,0,0-.29.71,1,1,0,0,0,1.71.7L17,5.86V17H5.86l2.7-2.69a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L2,18l5.14,5.11a1,1,0,0,0,.71.29,1,1,0,0,0,.7-1.71L5.86,19H17V30.14l-2.69-2.7a1,1,0,0,0-1.71.7,1,1,0,0,0,.29.71L18,34l5.11-5.14a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L19,30.14V19H30.14l-2.7,2.69a1,1,0,0,0,.7,1.71,1,1,0,0,0,.71-.29L34,18Z"/>'
};
var cursorMoveIconName = "cursor-move";
var cursorMoveIcon = [cursorMoveIconName, renderIcon(icon70)];

// node_modules/@clr/core/icon/shapes/details.js
var icon71 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z"/><path d="M9,14H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"/><path d="M9,18H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"/><path d="M9,22H19a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM19,22H9a1,1,0,0,1,0-2H19a1,1,0,0,1,0,2Zm8-4H9a1,1,0,0,1,0-2H27a1,1,0,0,1,0,2Zm0-4H9a1,1,0,0,1,0-2H27a1,1,0,0,1,0,2Z"/>'
};
var detailsIconName = "details";
var detailsIcon = [detailsIconName, renderIcon(icon71)];

// node_modules/@clr/core/icon/shapes/dot-circle.js
var icon72 = {
  outline: '<path d="M18,11a7,7,0,1,1-7,7,7,7,0,0,1,7-7"/><path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"/>'
};
var dotCircleIconName = "dot-circle";
var dotCircleIcon = [dotCircleIconName, renderIcon(icon72)];

// node_modules/@clr/core/icon/shapes/download.js
var icon73 = {
  outline: '<path d="M31,31H5a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><path d="M18,29.48,28.61,18.87a1,1,0,0,0-1.41-1.41L19,25.65V5a1,1,0,0,0-2,0V25.65L8.81,17.46a1,1,0,1,0-1.41,1.41Z"/>',
  outlineAlerted: '<path d="M31,31H5a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><path d="M18,29.48,28.61,18.87a1,1,0,0,0-1.41-1.41L19,25.65V5a1,1,0,0,0-2,0V25.65L8.81,17.46a1,1,0,1,0-1.41,1.41Z"/>',
  outlineBadged: '<path d="M31,31H5a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><path d="M18,29.48,28.61,18.87a1,1,0,0,0-1.41-1.41L19,25.65V5a1,1,0,0,0-2,0V25.65L8.81,17.46a1,1,0,1,0-1.41,1.41Z"/>'
};
var downloadIconName = "download";
var downloadIcon = [downloadIconName, renderIcon(icon73)];

// node_modules/@clr/core/icon/shapes/drag-handle.js
var icon74 = {
  outline: '<circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="24" r="1.5"/><circle cx="21" cy="12" r="1.5"/><circle cx="21" cy="24" r="1.5"/><circle cx="21" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>'
};
var dragHandleIconName = "drag-handle";
var dragHandleIcon = [dragHandleIconName, renderIcon(icon74)];

// node_modules/@clr/core/icon/shapes/drag-handle-corner.js
var icon75 = {
  outline: '<circle cx="12" cy="24" r="1.5"/><circle cx="18" cy="24" r="1.5"/><circle cx="18" cy="18" r="1.5"/><circle cx="24" cy="12" r="1.5"/><circle cx="24" cy="24" r="1.5"/><circle cx="24" cy="18" r="1.5"/>'
};
var dragHandleCornerIconName = "drag-handle-corner";
var dragHandleCornerIcon = [dragHandleCornerIconName, renderIcon(icon75)];

// node_modules/@clr/core/icon/shapes/eraser.js
var icon76 = {
  outline: '<path d="M35.62,12a2.82,2.82,0,0,0-.84-2L27.49,2.65a2.9,2.9,0,0,0-4,0L2.83,23.28a2.84,2.84,0,0,0,0,4L7.53,32H3a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2H16.74l18-18A2.82,2.82,0,0,0,35.62,12ZM13.91,32H10.36L4.25,25.89a.84.84,0,0,1,0-1.19l5.51-5.52,8.49,8.48ZM33.37,12.54,19.66,26.25l-8.48-8.49,13.7-13.7a.86.86,0,0,1,1.19,0l7.3,7.29a.86.86,0,0,1,.25.6A.82.82,0,0,1,33.37,12.54Z"/>',
  solid: '<path d="M28,32H15.33L19,28.37l-9.9-9.9L3.54,24a1.83,1.83,0,0,0,0,2.6L9,32H3a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z"/><path d="M34.08,10.65l-7.3-7.3a1.83,1.83,0,0,0-2.6,0L10.47,17.06l9.9,9.9L34.08,13.25A1.85,1.85,0,0,0,34.08,10.65Z"/>'
};
var eraserIconName = "eraser";
var eraserIcon = [eraserIconName, renderIcon(icon76)];

// node_modules/@clr/core/icon/shapes/expand-card.js
var icon77 = {
  outline: '<path d="M33,6H3A1,1,0,0,0,2,7V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM32,28H4V8H32Z"/><path d="M13.48,15.86,18,11.34l4.52,4.52a.77.77,0,0,0,.56.24.81.81,0,0,0,.57-1.37L18,9.08l-5.65,5.65a.8.8,0,1,0,1.13,1.13Z"/><path d="M13.48,21.86,18,17.34l4.52,4.52a.77.77,0,0,0,.56.24.81.81,0,0,0,.57-1.37L18,15.08l-5.65,5.65a.8.8,0,1,0,1.13,1.13Z"/>',
  solid: '<path d="M33,6H3A1,1,0,0,0,2,7V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM23.79,21.41a1,1,0,0,1-1.41,0L18,17l-4.38,4.38a1,1,0,0,1-1.41,0,1,1,0,0,1,0-1.42L18,14.2,23.79,20A1,1,0,0,1,23.79,21.41Zm0-6.2a1,1,0,0,1-1.41,0L18,10.83l-4.38,4.38a1,1,0,0,1-1.41,0,1,1,0,0,1,0-1.42L18,8l5.79,5.79A1,1,0,0,1,23.79,15.21Z"/>'
};
var expandCardIconName = "expand-card";
var expandCardIcon = [expandCardIconName, renderIcon(icon77)];

// node_modules/@clr/core/icon/shapes/file.js
var icon78 = {
  outline: '<path d="M21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V11.92Zm-.3,2.49,6,5.9h-6ZM8,30V6H20v8h8V30Z"/>',
  outlineAlerted: '<path d="M28,15.4V30H8V6H20V8.25l2.25-3.9L21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V15.4Z"/>',
  outlineBadged: '<path d="M21.59,12.39V6.49l1.07,1a7.31,7.31,0,0,1,0-2.82L21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V13.5a7.45,7.45,0,0,1-3.91-1.11ZM28,30H8V6H20v8h8Z"/>',
  solid: '<path d="M21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V11.92ZM21,13V5.84L28.3,13Z"/>',
  solidAlerted: '<path d="M22.2,15.4c-2,0-3.7-1.6-3.7-3.6c0-0.7,0.2-1.3,0.5-1.9l3.2-5.5L21.9,4H7.8C6.8,4,6,4.9,6,5.9v24.2c0,1,0.8,1.9,1.8,1.9h20.3c1,0,1.8-0.9,1.8-1.9V15.4H22.2z"/>',
  solidBadged: '<path d="M27.25,13H21V5.84l1.64,1.6a7.25,7.25,0,0,1,0-2.74L21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V13.5A7.47,7.47,0,0,1,27.25,13Z"/>'
};
var fileIconName = "file";
var fileIcon = [fileIconName, renderIcon(icon78)];

// node_modules/@clr/core/icon/shapes/file-group.js
var icon79 = {
  outline: '<path d="M31,34H13a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1H31a1,1,0,0,1,1,1V33A1,1,0,0,1,31,34ZM14,32H30V12H14Z"/><rect x="16" y="16" width="12" height="2"/><rect x="16" y="20" width="12" height="2"/><rect x="16" y="24" width="12" height="2"/><path d="M6,24V4H24V3a1,1,0,0,0-1-1H5A1,1,0,0,0,4,3V25a1,1,0,0,0,1,1H6Z"/><path d="M10,28V8H28V7a1,1,0,0,0-1-1H9A1,1,0,0,0,8,7V29a1,1,0,0,0,1,1h1Z"/>',
  solid: '<path d="M31,10H13a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V11A1,1,0,0,0,31,10ZM28,26H16V24H28Zm0-4H16V20H28Zm0-4H16V16H28Z"/><path d="M6,24V4H24V3a1,1,0,0,0-1-1H5A1,1,0,0,0,4,3V25a1,1,0,0,0,1,1H6Z"/><path d="M10,28V8H28V7a1,1,0,0,0-1-1H9A1,1,0,0,0,8,7V29a1,1,0,0,0,1,1h1Z"/>'
};
var fileGroupIconName = "file-group";
var fileGroupIcon = [fileGroupIconName, renderIcon(icon79)];

// node_modules/@clr/core/icon/shapes/file-settings.js
var icon80 = {
  outline: '<path d="M33.83,23.43a1.16,1.16,0,0,0-.71-1.12l-1.68-.5c-.09-.24-.18-.48-.29-.71l.78-1.44a1.16,1.16,0,0,0-.21-1.37l-1.42-1.41a1.16,1.16,0,0,0-1.37-.2l-1.45.76a7.84,7.84,0,0,0-.76-.32l-.48-1.58a1.15,1.15,0,0,0-1.11-.77h-2a1.16,1.16,0,0,0-1.11.82l-.47,1.54a7.76,7.76,0,0,0-.77.32l-1.42-.76a1.16,1.16,0,0,0-1.36.2l-1.45,1.4a1.16,1.16,0,0,0-.21,1.38L17.08,21a7.64,7.64,0,0,0-.31.74l-1.58.47a1.15,1.15,0,0,0-.83,1.11v2a1.15,1.15,0,0,0,.83,1.1l1.59.47a7.53,7.53,0,0,0,.31.72l-.78,1.46a1.16,1.16,0,0,0,.21,1.37l1.42,1.4a1.16,1.16,0,0,0,1.37.21l1.48-.78c.23.11.47.2.72.29L22,33.18a1.16,1.16,0,0,0,1.11.81h2a1.16,1.16,0,0,0,1.11-.82l.47-1.58c.24-.08.47-.18.7-.29l1.5.79a1.16,1.16,0,0,0,1.36-.2l1.42-1.4a1.16,1.16,0,0,0,.21-1.38l-.79-1.45q.16-.34.29-.69L33,26.5a1.15,1.15,0,0,0,.83-1.11Zm-1.6,1.63-2.11.62-.12.42a6,6,0,0,1-.5,1.19l-.21.38,1,1.91-1,1-2-1-.37.2a6.21,6.21,0,0,1-1.2.49l-.42.12-.63,2.09H23.42l-.63-2.08-.42-.12a6.23,6.23,0,0,1-1.21-.49l-.37-.2-1.94,1-1-1,1-1.94-.22-.38A6,6,0,0,1,18.17,26L18,25.63,16,25V23.69L18,23.08l.13-.41a5.94,5.94,0,0,1,.53-1.23L18.9,21l-1-1.85,1-.94,1.89,1,.38-.21a6.23,6.23,0,0,1,1.26-.52l.41-.12.63-2h1.38l.62,2,.41.12A6.21,6.21,0,0,1,27.1,19l.38.21,1.92-1,1,1-1,1.89.21.38a6.08,6.08,0,0,1,.5,1.21l.12.42,2.06.61Z"/><path d="M24.12,20.35a4,4,0,1,0,4.08,4A4.06,4.06,0,0,0,24.12,20.35Zm0,6.46a2.43,2.43,0,1,1,2.48-2.43A2.46,2.46,0,0,1,24.12,26.82Z"/><path d="M14.49,31H6V5H26v7.89a3.2,3.2,0,0,1,2,1.72V5a2,2,0,0,0-2-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H16.23l-1.1-1.08A3.11,3.11,0,0,1,14.49,31Z"/>',
  outlineAlerted: '<path d="M24.12,20.35a4,4,0,1,0,4.08,4A4.06,4.06,0,0,0,24.12,20.35Zm0,6.46a2.43,2.43,0,1,1,2.48-2.43A2.46,2.46,0,0,1,24.12,26.82Z"/><path d="M33.83,23.43a1.16,1.16,0,0,0-.71-1.12l-1.68-.5c-.09-.24-.18-.48-.29-.71l.78-1.44a1.16,1.16,0,0,0-.21-1.37l-1.42-1.41a1.16,1.16,0,0,0-1.37-.2l-1.45.76a7.84,7.84,0,0,0-.76-.32l-.48-1.58a1.15,1.15,0,0,0-1.11-.77h-2a1.16,1.16,0,0,0-1.11.82l-.47,1.54a7.76,7.76,0,0,0-.77.32l-1.42-.76a1.16,1.16,0,0,0-1.36.2l-1.45,1.4a1.16,1.16,0,0,0-.21,1.38L17.08,21a7.64,7.64,0,0,0-.31.74l-1.58.47a1.15,1.15,0,0,0-.83,1.11v2a1.15,1.15,0,0,0,.83,1.1l1.59.47a7.53,7.53,0,0,0,.31.72l-.78,1.46a1.16,1.16,0,0,0,.21,1.37l1.42,1.4a1.16,1.16,0,0,0,1.37.21l1.48-.78c.23.11.47.2.72.29L22,33.18a1.16,1.16,0,0,0,1.11.81h2a1.16,1.16,0,0,0,1.11-.82l.47-1.58c.24-.08.47-.18.7-.29l1.5.79a1.16,1.16,0,0,0,1.36-.2l1.42-1.4a1.16,1.16,0,0,0,.21-1.38l-.79-1.45q.16-.34.29-.69L33,26.5a1.15,1.15,0,0,0,.83-1.11Zm-1.6,1.63-2.11.62-.12.42a6,6,0,0,1-.5,1.19l-.21.38,1,1.91-1,1-2-1-.37.2a6.21,6.21,0,0,1-1.2.49l-.42.12-.63,2.09H23.42l-.63-2.08-.42-.12a6.23,6.23,0,0,1-1.21-.49l-.37-.2-1.94,1-1-1,1-1.94-.22-.38A6,6,0,0,1,18.17,26L18,25.63,16,25V23.69L18,23.08l.13-.41a5.94,5.94,0,0,1,.53-1.23L18.9,21l-1-1.85,1-.94,1.89,1,.38-.21a6.23,6.23,0,0,1,1.26-.52l.41-.12.63-2h1.38l.62,2,.41.12A6.21,6.21,0,0,1,27.1,19l.38.21,1.92-1,1,1-1,1.89.21.38a6.08,6.08,0,0,1,.5,1.21l.12.42,2.06.61Z"/><path d="M14.49,31H6V5H21.87L23,3H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H16.23l-1.1-1.08A3.11,3.11,0,0,1,14.49,31Z"/>',
  outlineBadged: '<path d="M33.83,23.43a1.16,1.16,0,0,0-.71-1.12l-1.68-.5c-.09-.24-.18-.48-.29-.71l.78-1.44a1.16,1.16,0,0,0-.21-1.37l-1.42-1.41a1.16,1.16,0,0,0-1.37-.2l-1.45.76a7.84,7.84,0,0,0-.76-.32l-.48-1.58a1.15,1.15,0,0,0-1.11-.77h-2a1.16,1.16,0,0,0-1.11.82l-.47,1.54a7.76,7.76,0,0,0-.77.32l-1.42-.76a1.16,1.16,0,0,0-1.36.2l-1.45,1.4a1.16,1.16,0,0,0-.21,1.38L17.08,21a7.64,7.64,0,0,0-.31.74l-1.58.47a1.15,1.15,0,0,0-.83,1.11v2a1.15,1.15,0,0,0,.83,1.1l1.59.47a7.53,7.53,0,0,0,.31.72l-.78,1.46a1.16,1.16,0,0,0,.21,1.37l1.42,1.4a1.16,1.16,0,0,0,1.37.21l1.48-.78c.23.11.47.2.72.29L22,33.18a1.16,1.16,0,0,0,1.11.81h2a1.16,1.16,0,0,0,1.11-.82l.47-1.58c.24-.08.47-.18.7-.29l1.5.79a1.16,1.16,0,0,0,1.36-.2l1.42-1.4a1.16,1.16,0,0,0,.21-1.38l-.79-1.45q.16-.34.29-.69L33,26.5a1.15,1.15,0,0,0,.83-1.11Zm-1.6,1.63-2.11.62-.12.42a6,6,0,0,1-.5,1.19l-.21.38,1,1.91-1,1-2-1-.37.2a6.21,6.21,0,0,1-1.2.49l-.42.12-.63,2.09H23.42l-.63-2.08-.42-.12a6.23,6.23,0,0,1-1.21-.49l-.37-.2-1.94,1-1-1,1-1.94-.22-.38A6,6,0,0,1,18.17,26L18,25.63,16,25V23.69L18,23.08l.13-.41a5.94,5.94,0,0,1,.53-1.23L18.9,21l-1-1.85,1-.94,1.89,1,.38-.21a6.23,6.23,0,0,1,1.26-.52l.41-.12.63-2h1.38l.62,2,.41.12A6.21,6.21,0,0,1,27.1,19l.38.21,1.92-1,1,1-1,1.89.21.38a6.08,6.08,0,0,1,.5,1.21l.12.42,2.06.61Z"/><path d="M24.12,20.35a4,4,0,1,0,4.08,4A4.06,4.06,0,0,0,24.12,20.35Zm0,6.46a2.43,2.43,0,1,1,2.48-2.43A2.46,2.46,0,0,1,24.12,26.82Z"/><path d="M14.49,31H6V5H23.08a6.94,6.94,0,0,1,.6-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H16.23l-1.1-1.08A3.11,3.11,0,0,1,14.49,31Z"/><path d="M28,15.33V12.71a7,7,0,0,1-2-1v1.88A3.2,3.2,0,0,1,28,15.33Z"/>',
  solid: '<path d="M15.55,31H6V5H26v8.78a2.37,2.37,0,0,1,2,1.57V5a2,2,0,0,0-2-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H17.16l-1-1A2.38,2.38,0,0,1,15.55,31Z"/><path d="M33.54,23.47l-2-.61a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.41,17.7a.37.37,0,0,0-.44-.07l-1.85,1A7,7,0,0,0,26.69,18l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61l-1.82-1a.37.37,0,0,0-.44.07l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82a7,7,0,0,0-.61,1.44l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61a7,7,0,0,0,.61,1.41l-1,1.9a.37.37,0,0,0,.07.44L19,32a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88a7.06,7.06,0,0,0,.58-1.39l2-.61a.37.37,0,0,0,.26-.35V23.83A.37.37,0,0,0,33.54,23.47ZM24.7,28.19A3.33,3.33,0,1,1,28,24.86,3.33,3.33,0,0,1,24.7,28.19Z"/>',
  solidAlerted: '<path d="M33.54,23.47l-2-.61a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.41,17.7a.37.37,0,0,0-.44-.07l-1.85,1A7,7,0,0,0,26.69,18l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61l-1.82-1a.37.37,0,0,0-.44.07l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82a7,7,0,0,0-.61,1.44l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61a7,7,0,0,0,.61,1.41l-1,1.9a.37.37,0,0,0,.07.44L19,32a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88a7.06,7.06,0,0,0,.58-1.39l2-.61a.37.37,0,0,0,.26-.35V23.83A.37.37,0,0,0,33.54,23.47ZM24.7,28.19A3.33,3.33,0,1,1,28,24.86,3.33,3.33,0,0,1,24.7,28.19Z"/><path d="M15.55,31H6V5H21.87L23,3H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H17.16l-1-1A2.38,2.38,0,0,1,15.55,31Z"/>',
  solidBadged: '<path d="M33.54,23.47l-2-.61a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.41,17.7a.37.37,0,0,0-.44-.07l-1.85,1A7,7,0,0,0,26.69,18l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61l-1.82-1a.37.37,0,0,0-.44.07l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82a7,7,0,0,0-.61,1.44l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61a7,7,0,0,0,.61,1.41l-1,1.9a.37.37,0,0,0,.07.44L19,32a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88a7.06,7.06,0,0,0,.58-1.39l2-.61a.37.37,0,0,0,.26-.35V23.83A.37.37,0,0,0,33.54,23.47ZM24.7,28.19A3.33,3.33,0,1,1,28,24.86,3.33,3.33,0,0,1,24.7,28.19Z"/><path d="M15.55,31H6V5H23.08a6.94,6.94,0,0,1,.6-2H6A2,2,0,0,0,4,5V31a2,2,0,0,0,2,2H17.16l-1-1A2.38,2.38,0,0,1,15.55,31Z"/><path d="M28,15.36V12.71a7,7,0,0,1-2-1v2A2.37,2.37,0,0,1,28,15.36Z"/>'
};
var fileSettingsIconName = "file-settings";
var fileSettingsIcon = [fileSettingsIconName, renderIcon(icon80)];

// node_modules/@clr/core/icon/shapes/file-zip.js
var icon81 = {
  outline: '<path d="M30,30.2V12l-8.1-7.9H7.8C6.8,4.1,6,4.9,6,6c0,0,0,0,0,0v24.2c0,1,0.7,1.8,1.7,1.8c0,0,0.1,0,0.1,0h20.3c1,0,1.8-0.7,1.8-1.7C30,30.3,30,30.2,30,30.2z M22,6.6l5.6,5.4H22V6.6z M28,30H7.9L8,6h12v8h8V30z"/><path d="M12,24c0,1.7,1.3,3,3,3s3-1.3,3-3v-4h-6V24z M13.4,24v-2.6h3.2V24c0.1,0.9-0.6,1.7-1.5,1.7c-0.9,0.1-1.7-0.6-1.7-1.5C13.4,24.2,13.4,24.1,13.4,24z"/><path d="M18.2,9c0-0.6-0.4-1-1-1H15v2h2.2C17.8,10,18.2,9.6,18.2,9z"/><path d="M12.7,10c-0.6,0-1,0.4-1,1s0.4,1,1,1H15v-2H12.7z"/><path d="M17.2,14c0.6,0,1-0.4,1-1s-0.4-1-1-1H15v2H17.2z"/><path d="M11.7,15c0,0.6,0.4,1,1,1H15v-2h-2.3C12.2,14,11.7,14.4,11.7,15z"/><path d="M17.2,18c0.6,0,1-0.4,1-1s-0.4-1-1-1H15v2H17.2z"/>',
  solid: '<path d="M15,25.6c0.9,0,1.6-0.7,1.6-1.6v-2.6h-3.2V24C13.4,24.9,14.1,25.6,15,25.6z"/><path d="M21.9,4H7.8C6.8,4,6,4.9,6,5.9v24.2c0,1,0.8,1.9,1.8,1.9h20.3c1,0,1.8-0.9,1.8-1.9V11.9L21.9,4z M18,24c0,1.7-1.3,3-3,3s-3-1.3-3-3v-4h6V24z M17.2,12c0.6,0,1,0.4,1,1s-0.4,1-1,1H15v2h2.2c0.6,0,1,0.4,1,1s-0.4,1-1,1H15v-2h-2.2c-0.6,0-1-0.4-1-1s0.4-1,1-1H15v-2h-2.2c-0.6,0-1-0.4-1-1s0.4-1,1-1H15V8h2.2c0.6,0,1,0.4,1,1s-0.4,1-1,1H15v2H17.2z M21.9,12V6.5l5.7,5.5H21.9z"/>'
};
var fileZipIconName = "file-zip";
var fileZipIcon = [fileZipIconName, renderIcon(icon81)];

// node_modules/@clr/core/icon/shapes/filter.js
var icon82 = {
  outline: '<path d="M33,4H3A1,1,0,0,0,2,5V6.67a1.79,1.79,0,0,0,.53,1.27L14,19.58v10.2l2,.76V19a1,1,0,0,0-.29-.71L4,6.59V6H32v.61L20.33,18.29A1,1,0,0,0,20,19l0,13.21L22,33V19.5L33.47,8A1.81,1.81,0,0,0,34,6.7V5A1,1,0,0,0,33,4Z"/>',
  solid: '<path d="M22,33V19.5L33.47,8A1.81,1.81,0,0,0,34,6.7V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V6.67a1.79,1.79,0,0,0,.53,1.27L14,19.58v10.2Z"/><path d="M33.48,4h-31A.52.52,0,0,0,2,4.52V6.24a1.33,1.33,0,0,0,.39.95l12,12v10l7.25,3.61V19.17l12-12A1.35,1.35,0,0,0,34,6.26V4.52A.52.52,0,0,0,33.48,4Z"/>'
};
var filterIconName = "filter";
var filterIcon = [filterIconName, renderIcon(icon82)];

// node_modules/@clr/core/icon/shapes/filter-2.js
var icon83 = {
  outline: '<path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z"/><path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z"/><path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/>'
};
var filter2IconName = "filter-2";
var filter2Icon = [filter2IconName, renderIcon(icon83)];

// node_modules/@clr/core/icon/shapes/filter-off.js
var icon84 = {
  outline: '<path d="M34,6.4C34,5.6,33.3,5,32.5,5H10.3l2,2H32v0.6l-9.6,9.6l1.4,1.4L33.4,9C33.8,8.6,34,8.1,34,7.6V6.5C34,6.5,34,6.4,34,6.4z"/><path d="M2.7,3l2,2h-1C2.9,4.9,2.1,5.5,2,6.3v1.1c0,0.5,0.2,1,0.6,1.4L14,20.2v10.3l1.9,0.8V19.4L4,7.5V7h2.7L20,20.3v12.9l2,0.8c0,0,0,0,0-0.1V22.3l10.1,10.1l1.4-1.4L4.1,1.6L2.7,3z"/>',
  solid: '<path d="M23.9,18.6L10.3,5.1h22.2C33.3,5,34,5.6,34,6.4c0,0,0,0,0,0.1v1.1c0,0.5-0.2,1-0.6,1.4L23.9,18.6z"/><path d="M33.5,31L4.1,1.6L2.6,3l2.1,2.1H3.5C2.7,5,2,5.6,2,6.4c0,0,0,0,0,0.1v1.1c0,0.5,0.2,1,0.6,1.4L14,20.5v10.1l8,3.4V22.4l10.1,10.1L33.5,31z"/>'
};
var filterOffIconName = "filter-off";
var filterOffIcon = [filterOffIconName, renderIcon(icon84)];

// node_modules/@clr/core/icon/shapes/firewall.js
var icon85 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM4,8H32v5.08H23.8v-4H22v4H14v-4H12v4H4Zm0,7H32v6.08H28.92V16.27H27v4.81H18.92V16.27H17v4.81H8.9V16.27H7v4.81H4ZM23.8,28V24.27H22.2V28H14V24.27h-1.6V28H4V23H32v5Z"/>',
  outlineAlerted: '<path d="M33.68,15.4H32v5.68H28.92V16.27H27v4.81H18.92V16.27H17v4.81H8.9V16.27H7v4.81H4V15H20.58a3.58,3.58,0,0,1-1.76-1.92H14v-4H12v4H4V8H20.14l1.15-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38ZM23.8,28V24.27H22.2V28H14V24.27h-1.6V28H4V23H32v5Z"/>',
  outlineBadged: '<path d="M30,13.5a7.47,7.47,0,0,1-2.45-.42H23.8V10.22a7.5,7.5,0,0,1-.63-1.14H22v4H14v-4H12v4H4V8H22.78a7.49,7.49,0,0,1-.28-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.45,7.45,0,0,1,30,13.5ZM4,15H32v6.08H28.92V16.27H27v4.81H18.92V16.27H17v4.81H8.9V16.27H7v4.81H4ZM23.8,28V24.27H22.2V28H14V24.27h-1.6V28H4V23H32v5Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM14,28H12V24h2Zm10,0H22V24h2Zm8-6H4V20H7V16H9v4h8V16h2v4h8V16h2v4h3Zm0-8H4V12h8V8h2v4h8V8h2v4h8Z"/>',
  solidAlerted: '<path d="M33.68,15.4H22.23A3.69,3.69,0,0,1,19.35,14H4V12h8V8h2v4h4.57A3.67,3.67,0,0,1,19,9.89L21.29,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38ZM14,28H12V24h2Zm10,0H22V24h2Zm8-6H4V20H7V16H9v4h8V16h2v4h8V16h2v4h3Z"/>',
  solidBadged: '<path d="M24,10.49V12h1.51A7.53,7.53,0,0,1,24,10.49Z"/><path d="M32,13.22V14H4V12h8V8h2v4h8V8h.78a7.49,7.49,0,0,1-.28-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.45,7.45,0,0,1,32,13.22ZM14,28H12V24h2Zm10,0H22V24h2Zm8-6H4V20H7V16H9v4h8V16h2v4h8V16h2v4h3Z"/>'
};
var firewallIconName = "firewall";
var firewallIcon = [firewallIconName, renderIcon(icon85)];

// node_modules/@clr/core/icon/shapes/first-aid.js
var icon86 = {
  outline: '<path d="M32,6H23.91V4.5A2.5,2.5,0,0,0,21.41,2h-7a2.5,2.5,0,0,0-2.5,2.5V6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM13.91,4.5a.5.5,0,0,1,.5-.5h7a.5.5,0,0,1,.5.5V6h-8ZM4,28V8H32V28Z"/><path d="M20.15,25.2H16.74a1.3,1.3,0,0,1-1.3-1.3V21.2h-2.7a1.3,1.3,0,0,1-1.3-1.3V16.5a1.3,1.3,0,0,1,1.3-1.3h2.7V12.5a1.3,1.3,0,0,1,1.3-1.3h3.41a1.3,1.3,0,0,1,1.29,1.3v2.7h2.71a1.3,1.3,0,0,1,1.29,1.3v3.4a1.3,1.3,0,0,1-1.29,1.3H21.44v2.7A1.3,1.3,0,0,1,20.15,25.2ZM17,23.6h2.81v-4h4V16.8h-4v-4H17v4H13v2.8h4Zm7.11-6.8Z"/>',
  solid: '<path d="M32,6H23.91V4.5A2.5,2.5,0,0,0,21.41,2h-7a2.5,2.5,0,0,0-2.5,2.5V6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM13.91,4.5a.5.5,0,0,1,.5-.5h7a.5.5,0,0,1,.5.5V6h-8ZM24.64,19.9a.5.5,0,0,1-.5.5h-3.5v3.5a.5.5,0,0,1-.5.5h-3.4a.5.5,0,0,1-.5-.5V20.4h-3.5a.5.5,0,0,1-.5-.5V16.5a.5.5,0,0,1,.5-.5h3.5V12.5a.5.5,0,0,1,.5-.5h3.4a.5.5,0,0,1,.5.5V16h3.5a.5.5,0,0,1,.5.5Z"/>'
};
var firstAidIconName = "first-aid";
var firstAidIcon = [firstAidIconName, renderIcon(icon86)];

// node_modules/@clr/core/icon/shapes/fish.js
var icon87 = {
  outline: '<circle cx="11.49" cy="17.5" r="1.5"/><path d="M33.48,9.29a1,1,0,0,0-1,0c-3.37,2-5.91,5.81-6.9,7.45L24.85,18s-1,1.62-1,1.62c-1.76,2.49-5.1,6.36-8.79,6.36-4.65,0-8.75-6.15-9.84-7.94,1.09-1.79,5.18-7.94,9.84-7.94,3.54,0,6.77,3.58,8.58,6.07l.28-.48s.36-.51.93-1.25C22.72,11.64,19.18,8.06,15,8.06c-6.59,0-11.67,9.07-11.88,9.46L2.89,18l.27.48c.21.39,5.29,9.46,11.88,9.46,5.06,0,9.22-5.34,11-8C26,20,27.18,18,27.18,18h0l.07-.11a18.06,18.06,0,0,1,1.88-2.75s0,0,0,0a20.31,20.31,0,0,1,2.86-3V23.88a20.93,20.93,0,0,1-3.61-4l-.16.26h0l-1,1.59a18.74,18.74,0,0,0,5.21,4.95,1,1,0,0,0,.5.14,1.13,1.13,0,0,0,.5-.13,1,1,0,0,0,.5-.87V10.16A1,1,0,0,0,33.48,9.29Z"/>'
};
var fishIconName = "fish";
var fishIcon = [fishIconName, renderIcon(icon87)];

// node_modules/@clr/core/icon/shapes/flame.js
var icon88 = {
  outline: '<path d="M31.3,16.66c-1.19-2.09-7.94-14.15-7.94-14.15a1,1,0,0,0-1.75,0l-6,10.64-3-5.28a1,1,0,0,0-1.75,0S5.4,17.78,4.42,19.5A9.3,9.3,0,0,0,3,24.61C3,29.72,5.86,34,11.67,34H22.48C28.28,34,33,29,33,22.78A11.13,11.13,0,0,0,31.3,16.66ZM22.48,32H11.77C8.13,32,5,28.66,5,24.61a7.43,7.43,0,0,1,1.16-4.13c.73-1.29,4.05-7.21,5.65-10.07l3,5.28a1,1,0,0,0,.87.51h0a1,1,0,0,0,.87-.51L22.49,5c1.86,3.33,6.15,11,7.07,12.6A9.24,9.24,0,0,1,31,22.78C31,27.87,27.18,32,22.48,32Z"/><path d="M25.75,21.73c-.65-1.16-4.38-7.81-4.38-7.81a.8.8,0,0,0-1.4,0l-4.2,7.48-1.59-2.49a.8.8,0,0,0-1.35,0L9.37,24.35a4.35,4.35,0,0,0-.82,2.6,4.49,4.49,0,0,0,.5,2H11a3,3,0,0,1-.83-2,2.78,2.78,0,0,1,.56-1.73l2.8-4.38,1.66,2.6a.8.8,0,0,0,1.41-.12,7.82,7.82,0,0,1,.4-.8L20.67,16l3.69,6.57a4.83,4.83,0,0,1,.77,2.71A5,5,0,0,1,23.46,29h2.13a6.68,6.68,0,0,0,1.14-3.74,6.45,6.45,0,0,0-1-3.5Z"/>',
  solid: '<path d="M31.3,16.32c-1.19-2.09-7.94-14.15-7.94-14.15a1,1,0,0,0-1.75,0l-6,10.64-3-5.28a1,1,0,0,0-1.75,0S5.4,17.43,4.42,19.15A9.3,9.3,0,0,0,3,24.26c0,5.11,3.88,9.65,8.67,9.74H22.48C28.28,34,33,28.62,33,22.44A11.13,11.13,0,0,0,31.3,16.32ZM21.48,32H14.54A4.68,4.68,0,0,1,10,27.41a3.91,3.91,0,0,1,.75-2.34l3.35-5.21a.5.5,0,0,1,.84,0l1.78,2.77,0-.08c.63-1.11,4.23-7.48,4.23-7.48a.5.5,0,0,1,.87,0s3.6,6.38,4.23,7.48A5.83,5.83,0,0,1,27,25.76C27,32,22.1,32,21.48,32Z"/>'
};
var flameIconName = "flame";
var flameIcon = [flameIconName, renderIcon(icon88)];

// node_modules/@clr/core/icon/shapes/form.js
var icon89 = {
  outline: '<path d="M21,12H7a1,1,0,0,1-1-1V7A1,1,0,0,1,7,6H21a1,1,0,0,1,1,1v4A1,1,0,0,1,21,12ZM8,10H20V7.94H8Z"/><path d="M21,14.08H7a1,1,0,0,0-1,1V19a1,1,0,0,0,1,1H18.36L22,16.3V15.08A1,1,0,0,0,21,14.08ZM20,18H8V16H20Z"/><path d="M11.06,31.51v-.06l.32-1.39H4V4h20V14.25L26,12.36V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V31a1,1,0,0,0,1,1h8A3.44,3.44,0,0,1,11.06,31.51Z"/><path d="M22,19.17l-.78.79A1,1,0,0,0,22,19.17Z"/><path d="M6,26.94a1,1,0,0,0,1,1h4.84l.3-1.3.13-.55,0-.05H8V24h6.34l2-2H7a1,1,0,0,0-1,1Z"/><path d="M33.49,16.67,30.12,13.3a1.61,1.61,0,0,0-2.28,0h0L14.13,27.09,13,31.9a1.61,1.61,0,0,0,1.26,1.9,1.55,1.55,0,0,0,.31,0,1.15,1.15,0,0,0,.37,0l4.85-1.07L33.49,19a1.6,1.6,0,0,0,0-2.27ZM18.77,30.91l-3.66.81L16,28.09,26.28,17.7l2.82,2.82ZM30.23,19.39l-2.82-2.82L29,15l2.84,2.84Z"/>'
};
var formIconName = "form";
var formIcon = [formIconName, renderIcon(icon89)];

// node_modules/@clr/core/icon/shapes/fuel.js
var icon90 = {
  outline: '<path d="M20.12,34H5.9A2.81,2.81,0,0,1,3,31.19V4.86A2.9,2.9,0,0,1,6,2.07H20.22A2.72,2.72,0,0,1,23,4.86V31.19A2.82,2.82,0,0,1,20.12,34ZM5.9,4A.87.87,0,0,0,5,4.86V31.19a.87.87,0,0,0,.87.87H20.12a.94.94,0,0,0,.95-.87V4.86A.94.94,0,0,0,20.12,4Z"/><path d="M29.53,34A3.5,3.5,0,0,1,26,30.5V23a2,2,0,0,0-2-2H22.57a1,1,0,0,1,0-2H24a4,4,0,0,1,4,4V30.5a1.5,1.5,0,0,0,3,0V17.3l-3.13-7A2.29,2.29,0,0,0,25.8,9h-.73a1,1,0,1,1,0-2h.73a4.3,4.3,0,0,1,3.93,2.55l3.21,7.16a1,1,0,0,1,.09.41V30.5A3.5,3.5,0,0,1,29.53,34Z"/><path d="M18,9H8A1,1,0,1,1,8,7H18a1,1,0,0,1,0,2Z"/><path d="M18,13H8A1,1,0,1,1,8,11H18A1,1,0,1,1,18,13Z"/><path d="M25,12.08a1,1,0,0,1-1-1v-6a1,1,0,0,1,2,0v6A1,1,0,0,1,25,12.08Z"/>'
};
var fuelIconName = "fuel";
var fuelIcon = [fuelIconName, renderIcon(icon90)];

// node_modules/@clr/core/icon/shapes/grid-view.js
var icon91 = {
  outline: '<path d="M14,4H6A2,2,0,0,0,4,6v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V6A2,2,0,0,0,14,4ZM6,14V6h8v8Z"/><path d="M30,4H22a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V6A2,2,0,0,0,30,4ZM22,14V6h8v8Z"/><path d="M14,20H6a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V22A2,2,0,0,0,14,20ZM6,30V22h8v8Z"/><path d="M30,20H22a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V22A2,2,0,0,0,30,20ZM22,30V22h8v8Z"/>',
  solid: '<rect x="4" y="4" width="12" height="12" rx="2" ry="2"/><rect x="20" y="4" width="12" height="12" rx="2" ry="2"/><rect x="4" y="20" width="12" height="12" rx="2" ry="2"/><rect x="20" y="20" width="12" height="12" rx="2" ry="2"/>'
};
var gridViewIconName = "grid-view";
var gridViewIcon = [gridViewIconName, renderIcon(icon91)];

// node_modules/@clr/core/icon/shapes/help.js
var icon92 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M18.29,8.92a7.38,7.38,0,0,0-5.72,2.57,1,1,0,0,0-.32.71.92.92,0,0,0,.95.92,1.08,1.08,0,0,0,.71-.29,5.7,5.7,0,0,1,4.33-2c2.36,0,3.83,1.52,3.83,3.41v.05c0,2.21-1.76,3.44-4.54,3.65a.8.8,0,0,0-.76.92s0,2.32,0,2.75a1,1,0,0,0,1,.9h.11a1,1,0,0,0,.9-1V19.45c3-.42,5.43-2,5.43-5.28v-.05C24.18,11.12,21.84,8.92,18.29,8.92Z"/><circle cx="17.78" cy="26.2" r="1.25"/>',
  outlineBadged: '<path d="M24.18,14.17v-.05c0-3-2.34-5.2-5.88-5.2a7.38,7.38,0,0,0-5.72,2.57,1,1,0,0,0-.32.71.92.92,0,0,0,.95.92,1.08,1.08,0,0,0,.71-.29,5.7,5.7,0,0,1,4.33-2c2.36,0,3.83,1.52,3.83,3.41v.05c0,2.21-1.76,3.44-4.54,3.65a.8.8,0,0,0-.76.92s0,2.32,0,2.75a1,1,0,0,0,1,.9h.11a1,1,0,0,0,.9-1V19.45C21.75,19,24.18,17.45,24.18,14.17Z"/><circle cx="17.78" cy="26.2" r="1.25"/><path d="M33.12,12.81a7.43,7.43,0,0,1-1.91.58,14.05,14.05,0,1,1-8.6-8.6,7.44,7.44,0,0,1,.58-1.91,16.06,16.06,0,1,0,9.93,9.93Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm-.22,25.85a1.65,1.65,0,1,1,1.65-1.65A1.65,1.65,0,0,1,17.78,27.85Zm1.37-8.06v1.72a1.37,1.37,0,0,1-1.3,1.36h-.11a1.34,1.34,0,0,1-1.39-1.3c0-.44,0-2.76,0-2.76a1.19,1.19,0,0,1,1.12-1.31c1.57-.12,4.18-.7,4.18-3.25,0-1.83-1.41-3.07-3.43-3.07a5.31,5.31,0,0,0-4,1.92,1.36,1.36,0,0,1-2.35-.9,1.43,1.43,0,0,1,.43-1,7.77,7.77,0,0,1,6-2.69c3.7,0,6.28,2.3,6.28,5.6C24.58,17.16,22.61,19.2,19.15,19.79Z"/>',
  solidBadged: '<path d="M33.12,12.81a7.49,7.49,0,0,1-9.93-9.93,16.06,16.06,0,1,0,9.93,9.93Zm-15.34,15a1.65,1.65,0,1,1,1.65-1.65A1.65,1.65,0,0,1,17.78,27.85Zm1.37-8.06v1.72a1.37,1.37,0,0,1-1.3,1.36h-.11a1.34,1.34,0,0,1-1.39-1.3c0-.44,0-2.76,0-2.76a1.19,1.19,0,0,1,1.12-1.31c1.57-.12,4.18-.7,4.18-3.25,0-1.83-1.41-3.07-3.43-3.07a5.31,5.31,0,0,0-4,1.92,1.36,1.36,0,0,1-2.35-.9,1.43,1.43,0,0,1,.43-1,7.77,7.77,0,0,1,6-2.69c3.7,0,6.28,2.3,6.28,5.6C24.58,17.16,22.61,19.2,19.15,19.79Z"/>'
};
var helpIconName = "help";
var helpIcon = [helpIconName, renderIcon(icon92)];

// node_modules/@clr/core/icon/shapes/history.js
var icon93 = {
  outline: '<path d="M18,9.83a1,1,0,0,0-1,1v8.72l5.9,4A1,1,0,0,0,24,21.88l-5-3.39V10.83A1,1,0,0,0,18,9.83Z"/><path d="M18,2A16.09,16.09,0,0,0,4,10.26V5.2a1,1,0,0,0-2,0V14h8.8a1,1,0,0,0,0-2H5.35A14,14,0,1,1,8.58,28.35a1,1,0,0,0-1.35,1.48A16,16,0,1,0,18,2Z"/>'
};
var historyIconName = "history";
var historyIcon = [historyIconName, renderIcon(icon93)];

// node_modules/@clr/core/icon/shapes/hourglass.js
var icon94 = {
  outline: '<path d="M29,32H26V24.91a6.67,6.67,0,0,0-2.69-5.33l-1.28-1A6.36,6.36,0,0,0,21,18h0a6.29,6.29,0,0,0,1-.62l1.28-1A6.67,6.67,0,0,0,26,11.09V4h3a1,1,0,0,0,0-2H7A1,1,0,0,0,7,4h3v7.09a6.67,6.67,0,0,0,2.69,5.33l1.28,1A6.36,6.36,0,0,0,15,18h0a6.27,6.27,0,0,0-1,.62l-1.28,1A6.67,6.67,0,0,0,10,24.91V32H7a1,1,0,0,0,0,2H29a1,1,0,0,0,0-2ZM12,24.91a4.66,4.66,0,0,1,1.88-3.72l1.28-1a4.66,4.66,0,0,1,1.18-.63,1,1,0,0,0,.65-.94V17.33a1,1,0,0,0-.65-.94,4.67,4.67,0,0,1-1.19-.63l-1.28-1A4.66,4.66,0,0,1,12,11.09V4H24v7.09a4.66,4.66,0,0,1-1.88,3.72l-1.28,1h0a4.66,4.66,0,0,1-1.18.63,1,1,0,0,0-.65.94v1.34a1,1,0,0,0,.65.94,4.67,4.67,0,0,1,1.19.63l1.28,1A4.66,4.66,0,0,1,24,24.91V32H12Z"/>',
  outlineAlerted: '<path d="M29,32H26V24.91a6.67,6.67,0,0,0-2.69-5.33l-1.28-1A6.36,6.36,0,0,0,21,18h0a6.29,6.29,0,0,0,1-.62l1.28-1a6.64,6.64,0,0,0,1.09-1H22.23a3.64,3.64,0,0,1-.78-.09l-.62.46h0a4.66,4.66,0,0,1-1.18.63,1,1,0,0,0-.65.94v1.34a1,1,0,0,0,.65.94,4.67,4.67,0,0,1,1.19.63l1.28,1A4.66,4.66,0,0,1,24,24.91V32H12V24.91a4.66,4.66,0,0,1,1.88-3.72l1.28-1a4.66,4.66,0,0,1,1.18-.63,1,1,0,0,0,.65-.94V17.33a1,1,0,0,0-.65-.94,4.67,4.67,0,0,1-1.19-.63l-1.28-1A4.66,4.66,0,0,1,12,11.09V4H22.45L23.6,2H7A1,1,0,0,0,7,4h3v7.09a6.67,6.67,0,0,0,2.69,5.33l1.28,1A6.36,6.36,0,0,0,15,18h0a6.27,6.27,0,0,0-1,.62l-1.28,1A6.67,6.67,0,0,0,10,24.91V32H7a1,1,0,0,0,0,2H29a1,1,0,0,0,0-2Z"/>',
  outlineBadged: '<path d="M29,32H26V24.91a6.67,6.67,0,0,0-2.69-5.33l-1.28-1A6.36,6.36,0,0,0,21,18h0a6.29,6.29,0,0,0,1-.62l1.28-1a6.68,6.68,0,0,0,2.57-4.16A7.53,7.53,0,0,1,24,10.49v.61a4.66,4.66,0,0,1-1.88,3.72l-1.28,1h0a4.66,4.66,0,0,1-1.18.63,1,1,0,0,0-.65.94v1.34a1,1,0,0,0,.65.94,4.67,4.67,0,0,1,1.19.63l1.28,1A4.66,4.66,0,0,1,24,24.91V32H12V24.91a4.66,4.66,0,0,1,1.88-3.72l1.28-1a4.66,4.66,0,0,1,1.18-.63,1,1,0,0,0,.65-.94V17.33a1,1,0,0,0-.65-.94,4.67,4.67,0,0,1-1.19-.63l-1.28-1A4.66,4.66,0,0,1,12,11.09V4H22.78a7.45,7.45,0,0,1,.89-2H7A1,1,0,0,0,7,4h3v7.09a6.67,6.67,0,0,0,2.69,5.33l1.28,1A6.36,6.36,0,0,0,15,18h0a6.27,6.27,0,0,0-1,.62l-1.28,1A6.67,6.67,0,0,0,10,24.91V32H7a1,1,0,0,0,0,2H29a1,1,0,0,0,0-2Z"/>',
  solid: '<path d="M6.67,4h22a1,1,0,0,0,0-2h-22a1,1,0,1,0,0,2Z"/><path d="M28.67,32h-22a1,1,0,0,0,0,2h22a1,1,0,1,0,0-2Z"/><path d="M22.55,15.67A6.07,6.07,0,0,0,25,11.12V6H10.06v5.12a6.07,6.07,0,0,0,2.45,4.55,11.48,11.48,0,0,0,2.91,1.72v1.16a11.48,11.48,0,0,0-2.91,1.72,6.07,6.07,0,0,0-2.45,4.55v5.12H25V24.82a6.07,6.07,0,0,0-2.45-4.55,11.48,11.48,0,0,0-2.91-1.72V17.39A11.48,11.48,0,0,0,22.55,15.67Z"/>',
  solidAlerted: '<path d="M28.67,32h-22a1,1,0,0,0,0,2h22a1,1,0,1,0,0-2Z"/><path d="M6.67,4H22.45L23.6,2H6.67a1,1,0,1,0,0,2Z"/><path d="M12.51,20.27a6.07,6.07,0,0,0-2.45,4.55v5.12H25V24.82a6.07,6.07,0,0,0-2.45-4.55,11.48,11.48,0,0,0-2.91-1.72V17.39a11.48,11.48,0,0,0,2.91-1.72l.3-.27h-.62A3.68,3.68,0,0,1,19,9.89L21.29,6H10.06v5.12a6.07,6.07,0,0,0,2.45,4.55,11.48,11.48,0,0,0,2.91,1.72v1.16A11.48,11.48,0,0,0,12.51,20.27Z"/>',
  solidBadged: '<path d="M28.67,32h-22a1,1,0,0,0,0,2h22a1,1,0,1,0,0-2Z"/><path d="M6.67,4H22.78a7.45,7.45,0,0,1,.89-2h-17a1,1,0,1,0,0,2Z"/><path d="M22.55,20.27a11.48,11.48,0,0,0-2.91-1.72V17.39a11.48,11.48,0,0,0,2.91-1.72A6.25,6.25,0,0,0,25,11.55,7.47,7.47,0,0,1,22.5,6H10.06v5.12a6.07,6.07,0,0,0,2.45,4.55,11.48,11.48,0,0,0,2.91,1.72v1.16a11.48,11.48,0,0,0-2.91,1.72,6.07,6.07,0,0,0-2.45,4.55v5.12H25V24.82A6.07,6.07,0,0,0,22.55,20.27Z"/>'
};
var hourglassIconName = "hourglass";
var hourglassIcon = [hourglassIconName, renderIcon(icon94)];

// node_modules/@clr/core/icon/shapes/id-badge.js
var icon95 = {
  outline: '<path d="M18,22a4.23,4.23,0,1,0-4.23-4.23A4.23,4.23,0,0,0,18,22Zm0-6.86a2.63,2.63,0,1,1-2.63,2.63A2.63,2.63,0,0,1,18,15.14Z"/><path d="M22,4a2,2,0,0,0-2-2H16a2,2,0,0,0-2,2v7h8ZM20,9H16V4h4Z"/><path d="M26,30V27.7a1.12,1.12,0,0,0-.26-.73A9.9,9.9,0,0,0,18,23.69,9.9,9.9,0,0,0,10.26,27a1.13,1.13,0,0,0-.26.73V30h1.6V27.87A8.33,8.33,0,0,1,18,25.29a8.33,8.33,0,0,1,6.4,2.59V30Z"/><path d="M28,6H24V8h4V32H8V8h4V6H8A2,2,0,0,0,6,8V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V8A2,2,0,0,0,28,6Z"/>',
  outlineAlerted: '<path d="M18,22a4.23,4.23,0,1,0-4.23-4.23A4.23,4.23,0,0,0,18,22Zm0-6.86a2.63,2.63,0,1,1-2.63,2.63A2.63,2.63,0,0,1,18,15.14Z"/><path d="M10.26,27a1.13,1.13,0,0,0-.26.73V30h1.6V27.87A8.33,8.33,0,0,1,18,25.29a8.33,8.33,0,0,1,6.4,2.59V30H26V27.7a1.12,1.12,0,0,0-.26-.73A9.9,9.9,0,0,0,18,23.69,9.9,9.9,0,0,0,10.26,27Z"/><path d="M19,9.89,19.56,9H16V4h4V8.24l2-3.46V4a2,2,0,0,0-2-2H16a2,2,0,0,0-2,2v7h4.64A3.66,3.66,0,0,1,19,9.89Z"/><path d="M28,15.4V32H8V8h4V6H8A2,2,0,0,0,6,8V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V15.4Z"/>',
  outlineBadged: '<path d="M18,22a4.23,4.23,0,1,0-4.23-4.23A4.23,4.23,0,0,0,18,22Zm0-6.86a2.63,2.63,0,1,1-2.63,2.63A2.63,2.63,0,0,1,18,15.14Z"/><path d="M22,4a2,2,0,0,0-2-2H16a2,2,0,0,0-2,2v7h8ZM20,9H16V4h4Z"/><path d="M10.26,27a1.13,1.13,0,0,0-.26.73V30h1.6V27.87A8.33,8.33,0,0,1,18,25.29a8.33,8.33,0,0,1,6.4,2.59V30H26V27.7a1.12,1.12,0,0,0-.26-.73A9.9,9.9,0,0,0,18,23.69,9.9,9.9,0,0,0,10.26,27Z"/><path d="M28,13.22V32H8V8h4V6H8A2,2,0,0,0,6,8V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.49,7.49,0,0,1,28,13.22Z"/>',
  solid: '<circle cx="18" cy="17.77" r="4.23"/><path d="M21,4a2,2,0,0,0-2-2H17a2,2,0,0,0-2,2v6h6Z"/><path d="M10.26,27a1.13,1.13,0,0,0-.26.73V30H26V27.7a1.12,1.12,0,0,0-.26-.73A9.9,9.9,0,0,0,18,23.69,9.9,9.9,0,0,0,10.26,27Z"/><path d="M28,6H23V8h5V32H8V8h5V6H8A2,2,0,0,0,6,8V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V8A2,2,0,0,0,28,6Z"/>',
  solidAlerted: '<path d="M19,9.89,21,6.5V4a2,2,0,0,0-2-2H17a2,2,0,0,0-2,2v6h4Z"/><circle cx="18" cy="17.77" r="4.23"/><path d="M10.26,27a1.13,1.13,0,0,0-.26.73V30H26V27.7a1.12,1.12,0,0,0-.26-.73A9.9,9.9,0,0,0,18,23.69,9.9,9.9,0,0,0,10.26,27Z"/><path d="M28,15.4V32H8V8h5V6H8A2,2,0,0,0,6,8V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V15.4Z"/>',
  solidBadged: '<circle cx="18" cy="17.77" r="4.23"/><path d="M21,4a2,2,0,0,0-2-2H17a2,2,0,0,0-2,2v6h6Z"/><path d="M10.26,27a1.13,1.13,0,0,0-.26.73V30H26V27.7a1.12,1.12,0,0,0-.26-.73A9.9,9.9,0,0,0,18,23.69,9.9,9.9,0,0,0,10.26,27Z"/><path d="M28,13.22V32H8V8h5V6H8A2,2,0,0,0,6,8V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.49,7.49,0,0,1,28,13.22Z"/>'
};
var idBadgeIconName = "id-badge";
var idBadgeIcon = [idBadgeIconName, renderIcon(icon95)];

// node_modules/@clr/core/icon/shapes/key.js
var icon96 = {
  outline: '<rect x="6.33" y="10.71" width="9.71" height="2.57" rx="1" ry="1" transform="translate(-5.21 11.43) rotate(-45)"/><path d="M23.35,16.8l.63-.63A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.4-.4L18,26.48h3.44v3h3.69v1.63L28,34h6V27.45ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-3-3L14,23.31a3,3,0,0,1-4.24,0L4.5,18a3,3,0,0,1,0-4.24l8.56-8.56a3,3,0,0,1,4.24,0l5.26,5.26a3,3,0,0,1,0,4.24l-2,2L32,28.28Z"/>',
  outlineAlerted: '<rect x="6.33" y="10.71" width="9.71" height="2.57" rx="1" ry="1" transform="translate(-5.21 11.43) rotate(-45)"/><path d="M23.35,16.8l.63-.63a5,5,0,0,0,.63-.77H22.23l-.29,0L20.52,16.8,32,28.28V32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-3-3L14,23.31a3,3,0,0,1-4.24,0L4.5,18a3,3,0,0,1,0-4.24l8.56-8.56a3,3,0,0,1,4.24,0L20.1,8.06l1-1.79L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.4-.4L18,26.48h3.44v3h3.69v1.63L28,34h6V27.45Z"/>',
  outlineBadged: '<rect x="6.33" y="10.71" width="9.71" height="2.57" rx="1" ry="1" transform="translate(-5.21 11.43) rotate(-45)"/><path d="M23.35,16.8l.63-.63A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.4-.4L18,26.48h3.44v3h3.69v1.63L28,34h6V27.45ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-3-3L14,23.31a3,3,0,0,1-4.24,0L4.5,18a3,3,0,0,1,0-4.24l8.56-8.56a3,3,0,0,1,4.24,0l5.26,5.26a3,3,0,0,1,0,4.24l-2,2L32,28.28Z"/>',
  solid: '<path d="M23.38,16.77l.6-.6A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.45-.45,2.1,2.2h3.44v3h3.69v1.63L28,34h6V27.45Zm-8.56-6.59L9.37,15.64a1,1,0,0,1-1.41,0l-.4-.4a1,1,0,0,1,0-1.41L13,8.36a1,1,0,0,1,1.41,0l.4.4A1,1,0,0,1,14.82,10.18ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-1.52-1.61L22,18.18,32,28.28Z"/>',
  solidAlerted: '<path d="M23.38,16.77l.6-.6a5,5,0,0,0,.63-.77H22.23A3.68,3.68,0,0,1,19,9.89l2.09-3.62L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.45-.45,2.1,2.2h3.44v3h3.69v1.63L28,34h6V27.45Zm-8.56-6.59L9.37,15.64a1,1,0,0,1-1.41,0l-.4-.4a1,1,0,0,1,0-1.41L13,8.36a1,1,0,0,1,1.41,0l.4.4A1,1,0,0,1,14.82,10.18ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-1.52-1.61L22,18.18,32,28.28Z"/>',
  solidBadged: '<path d="M23.38,16.77l.6-.6A5,5,0,0,0,24,9.1L18.71,3.84a5,5,0,0,0-7.07,0L3.09,12.39a5,5,0,0,0,0,7.07l5.26,5.26a5,5,0,0,0,7.07,0l.45-.45,2.1,2.2h3.44v3h3.69v1.63L28,34h6V27.45Zm-8.56-6.59L9.37,15.64a1,1,0,0,1-1.41,0l-.4-.4a1,1,0,0,1,0-1.41L13,8.36a1,1,0,0,1,1.41,0l.4.4A1,1,0,0,1,14.82,10.18ZM32,32H28.86l-1.77-1.76v-2.8H23.41v-3H18.8l-1.52-1.61L22,18.18,32,28.28Z"/>'
};
var keyIconName = "key";
var keyIcon = [keyIconName, renderIcon(icon96)];

// node_modules/@clr/core/icon/shapes/landscape.js
var icon97 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z"/><path d="M9,22a.82.82,0,0,0,.55-.21.8.8,0,0,0,0-1.13L7.83,18.8H28.17l-1.72,1.86a.8.8,0,0,0,0,1.13A.82.82,0,0,0,27,22a.78.78,0,0,0,.58-.26L31.09,18l-3.47-3.74a.79.79,0,0,0-1.13,0,.8.8,0,0,0,0,1.13l1.72,1.86H7.83l1.72-1.86a.8.8,0,0,0,0-1.13.79.79,0,0,0-1.13,0L4.91,18l3.47,3.74A.78.78,0,0,0,9,22Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM27.77,21.88a1,1,0,0,1-.73.32,1,1,0,0,1-.68-.27,1,1,0,0,1-.06-1.41L27.71,19H8.29L9.7,20.52a1,1,0,0,1-.06,1.41A1,1,0,0,1,9,22.2a1,1,0,0,1-.73-.32L4.64,18l3.59-3.88A1,1,0,0,1,9.7,15.48L8.29,17H27.71L26.3,15.48a1,1,0,0,1,1.47-1.36L31.36,18Z"/>'
};
var landscapeIconName = "landscape";
var landscapeIcon = [landscapeIconName, renderIcon(icon97)];

// node_modules/@clr/core/icon/shapes/library.js
var icon98 = {
  outline: '<path d="M33.48,29.63,26.74,11.82a2,2,0,0,0-2.58-1.16L21,11.85V8.92A1.92,1.92,0,0,0,19.08,7H14V4.92A1.92,1.92,0,0,0,12.08,3H5A2,2,0,0,0,3,5V32a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V19.27l5,13.21a1,1,0,0,0,1.29.58l5.61-2.14a1,1,0,0,0,.58-1.29ZM12,8.83V31H5V5h7ZM19,31H14V9h5Zm8.51-.25L21.13,13.92l3.74-1.42,6.39,16.83Z"/>',
  solid: '<path d="M12.75,3H5.25A1.15,1.15,0,0,0,4,4V33H14V4A1.15,1.15,0,0,0,12.75,3Z"/><path d="M33.77,31.09l-6.94-18.3a1,1,0,0,0-1.29-.58L22,13.59V9a1,1,0,0,0-1-1H16V33h6V14.69L28.93,33Z"/>'
};
var libraryIconName = "library";
var libraryIcon = [libraryIconName, renderIcon(icon98)];

// node_modules/@clr/core/icon/shapes/lightbulb.js
var icon99 = {
  outline: '<path d="M18,2.25a11,11,0,0,0-11,11,10.68,10.68,0,0,0,1,4.63,16.36,16.36,0,0,0,1.12,1.78,17,17,0,0,1,2,3.47,16.19,16.19,0,0,1,.59,4h2A18.17,18.17,0,0,0,13,22.44a18.46,18.46,0,0,0-2.22-3.92,15.79,15.79,0,0,1-1-1.54A8.64,8.64,0,0,1,9,13.23a9,9,0,0,1,18.07,0A8.64,8.64,0,0,1,26.21,17a15.79,15.79,0,0,1-1,1.54A18.46,18.46,0,0,0,23,22.44a18.17,18.17,0,0,0-.71,4.71h2a16.19,16.19,0,0,1,.59-4,17,17,0,0,1,2-3.47A16.31,16.31,0,0,0,28,17.86a10.68,10.68,0,0,0,1-4.63A11,11,0,0,0,18,2.25Z"/><path d="M18.63,15.51a.8.8,0,0,0-1.13,0l-3,3,2.86,3.13v5.54H19V21l-2.24-2.45,1.89-1.89A.8.8,0,0,0,18.63,15.51Z"/><path d="M23.86,29.15H12.11a.8.8,0,1,0,0,1.6H23.86a.8.8,0,0,0,0-1.6Z"/><path d="M22,32.15H14a.8.8,0,1,0,0,1.6H22a.8.8,0,1,0,0-1.6Z"/><path d="M17.32,10.89l-2.73,2.73a.8.8,0,0,0,1.13,1.13L18.45,12a.8.8,0,1,0-1.13-1.13Z"/>',
  outlineBadged: '<path d="M19,27.15V21l-2.24-2.45,1.89-1.89a.8.8,0,0,0-1.13-1.13l-3,3,2.86,3.13v5.54Z"/><path d="M23.86,29.15H12.11a.8.8,0,1,0,0,1.6H23.86a.8.8,0,0,0,0-1.6Z"/><path d="M22,32.15H14a.8.8,0,1,0,0,1.6H22a.8.8,0,1,0,0-1.6Z"/><path d="M15.72,14.75,18.45,12a.8.8,0,1,0-1.13-1.13l-2.73,2.73a.8.8,0,0,0,1.13,1.13Z"/><path d="M27,12.88c0,.12,0,.23,0,.35A8.64,8.64,0,0,1,26.21,17a15.79,15.79,0,0,1-1,1.54A18.46,18.46,0,0,0,23,22.44a18.17,18.17,0,0,0-.71,4.71h2a16.19,16.19,0,0,1,.59-4,17,17,0,0,1,2-3.47A16.31,16.31,0,0,0,28,17.86a10.63,10.63,0,0,0,1-4.43A7.45,7.45,0,0,1,27,12.88Z"/><path d="M13.71,27.15A18.17,18.17,0,0,0,13,22.44a18.46,18.46,0,0,0-2.22-3.92,15.79,15.79,0,0,1-1-1.54A8.64,8.64,0,0,1,9,13.23,9,9,0,0,1,22.53,5.47a7.45,7.45,0,0,1,.43-2,11,11,0,0,0-16,9.8,10.68,10.68,0,0,0,1,4.63,16.36,16.36,0,0,0,1.12,1.78,17,17,0,0,1,2,3.47,16.19,16.19,0,0,1,.59,4Z"/>',
  solid: '<path d="M23.86,29.15H12.11a.8.8,0,1,0,0,1.6H23.86a.8.8,0,0,0,0-1.6Z"/><path d="M22,32.15H14a.8.8,0,1,0,0,1.6H22a.8.8,0,1,0,0-1.6Z"/><path d="M18,2.25a11,11,0,0,0-11,11,10.68,10.68,0,0,0,1,4.63,16.36,16.36,0,0,0,1.12,1.78,17,17,0,0,1,2,3.47,16.19,16.19,0,0,1,.59,4h5.69V21.61l-2.86-3.13,3-3a.8.8,0,0,1,1.13,1.13l-1.89,1.89L19,21v6.17H24.3a16.19,16.19,0,0,1,.59-4,17,17,0,0,1,2-3.47A16.31,16.31,0,0,0,28,17.86a10.68,10.68,0,0,0,1-4.63A11,11,0,0,0,18,2.25ZM18.45,12l-2.73,2.73a.8.8,0,1,1-1.13-1.13l2.73-2.73A.8.8,0,1,1,18.45,12Z"/>',
  solidBadged: '<path d="M23.86,29.15H12.11a.8.8,0,1,0,0,1.6H23.86a.8.8,0,0,0,0-1.6Z"/><path d="M22,32.15H14a.8.8,0,1,0,0,1.6H22a.8.8,0,1,0,0-1.6Z"/><path d="M22.5,6A7.47,7.47,0,0,1,23,3.44a11,11,0,0,0-16,9.8,10.68,10.68,0,0,0,1,4.63,16.36,16.36,0,0,0,1.12,1.78,17,17,0,0,1,2,3.47,16.19,16.19,0,0,1,.59,4h5.69V21.61l-2.86-3.13,3-3a.8.8,0,0,1,1.13,1.13l-1.89,1.89L19,21v6.17H24.3a16.19,16.19,0,0,1,.59-4,17,17,0,0,1,2-3.47A16.31,16.31,0,0,0,28,17.86a10.63,10.63,0,0,0,1-4.43A7.5,7.5,0,0,1,22.5,6Zm-4,6-2.73,2.73a.8.8,0,1,1-1.13-1.13l2.73-2.73A.8.8,0,1,1,18.45,12Z"/>'
};
var lightbulbIconName = "lightbulb";
var lightbulbIcon = [lightbulbIconName, renderIcon(icon99)];

// node_modules/@clr/core/icon/shapes/list.js
var icon100 = {
  outline: '<rect x="15" y="8" width="9" height="2"/><rect x="15" y="12" width="9" height="2"/><rect x="15" y="16" width="9" height="2"/><rect x="15" y="20" width="9" height="2"/><rect x="15" y="24" width="9" height="2"/><rect x="11" y="8" width="2" height="2"/><rect x="11" y="12" width="2" height="2"/><rect x="11" y="16" width="2" height="2"/><rect x="11" y="20" width="2" height="2"/><rect x="11" y="24" width="2" height="2"/><path d="M28,2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V4A2,2,0,0,0,28,2Zm0,30H8V4H28Z"/>',
  outlineBadged: '<rect x="15" y="12" width="9" height="2"/><rect x="15" y="16" width="9" height="2"/><rect x="15" y="20" width="9" height="2"/><rect x="15" y="24" width="9" height="2"/><rect x="11" y="8" width="2" height="2"/><rect x="11" y="12" width="2" height="2"/><rect x="11" y="16" width="2" height="2"/><rect x="11" y="20" width="2" height="2"/><rect x="11" y="24" width="2" height="2"/><path d="M15,8v2h8.66a7.45,7.45,0,0,1-.89-2Z"/><path d="M28,13.22V32H8V4H22.78a7.45,7.45,0,0,1,.88-2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.49,7.49,0,0,1,28,13.22Z"/>',
  solid: '<path d="M28,2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V4A2,2,0,0,0,28,2ZM13,26H11V24h2Zm0-4H11V20h2Zm0-4H11V16h2Zm0-4H11V12h2Zm0-4H11V8h2ZM25,26H15V24H25Zm0-4H15V20H25Zm0-4H15V16H25Zm0-4H15V12H25Zm0-4H15V8H25Z"/>',
  solidBadged: '<path d="M23.66,10H15V8h7.78a7.42,7.42,0,0,1,.89-6H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.49,7.49,0,0,1,23.66,10ZM13,26H11V24h2Zm0-4H11V20h2Zm0-4H11V16h2Zm0-4H11V12h2Zm0-4H11V8h2ZM25,26H15V24H25Zm0-4H15V20H25Zm0-4H15V16H25Zm0-4H15V12H25Z"/>'
};
var listIconName = "list";
var listIcon = [listIconName, renderIcon(icon100)];

// node_modules/@clr/core/icon/shapes/lock.js
var icon101 = {
  outline: '<path d="M18.09,20.59A2.41,2.41,0,0,0,17,25.14V28h2V25.23a2.41,2.41,0,0,0-.91-4.64Z"/><path d="M26,15V10.72a8.2,8.2,0,0,0-8-8.36,8.2,8.2,0,0,0-8,8.36V15H7V32a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V15ZM12,10.72a6.2,6.2,0,0,1,6-6.36,6.2,6.2,0,0,1,6,6.36V15H12ZM9,32V17H27V32Z"/>',
  solid: '<path d="M26,15V10.72a8.2,8.2,0,0,0-8-8.36,8.2,8.2,0,0,0-8,8.36V15H7V32a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V15ZM19,25.23V28H17V25.14a2.4,2.4,0,1,1,2,.09ZM24,15H12V10.72a6.2,6.2,0,0,1,6-6.36,6.2,6.2,0,0,1,6,6.36Z"/>'
};
var lockIconName = "lock";
var lockIcon = [lockIconName, renderIcon(icon101)];

// node_modules/@clr/core/icon/shapes/login.js
var icon102 = {
  outline: '<path d="M28,4H12a2,2,0,0,0-2,2H28V30H12V20.2H10V30a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V6A2,2,0,0,0,28,4Z"/><path d="M15.12,18.46a1,1,0,1,0,1.41,1.41l5.79-5.79L16.54,8.29a1,1,0,0,0-1.41,1.41L18.5,13H4a1,1,0,0,0-1,1,1,1,0,0,0,1,1H18.5Z"/>',
  solid: '<path d="M28,4H12a2,2,0,0,0-2,2v7h8.5L15.12,9.71a1,1,0,0,1,1.41-1.41l5.79,5.79-5.79,5.79a1,1,0,0,1-1.41-1.41L18.5,15H10V30a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V6A2,2,0,0,0,28,4Z"/><path d="M10,13H4a1,1,0,0,0-1,1,1,1,0,0,0,1,1h6Z"/>'
};
var loginIconName = "login";
var loginIcon = [loginIconName, renderIcon(icon102)];

// node_modules/@clr/core/icon/shapes/logout.js
var icon103 = {
  outline: '<path d="M7,6H23v9.8h2V6a2,2,0,0,0-2-2H7A2,2,0,0,0,5,6V30a2,2,0,0,0,2,2H23a2,2,0,0,0,2-2H7Z"/><path d="M28.16,17.28a1,1,0,0,0-1.41,1.41L30.13,22H15.63a1,1,0,0,0-1,1,1,1,0,0,0,1,1h14.5l-3.38,3.46a1,1,0,1,0,1.41,1.41L34,23.07Z"/>',
  solid: '<path d="M23,4H7A2,2,0,0,0,5,6V30a2,2,0,0,0,2,2H23a2,2,0,0,0,2-2V24H15.63a1,1,0,0,1-1-1,1,1,0,0,1,1-1H25V6A2,2,0,0,0,23,4Z"/><path d="M28.16,17.28a1,1,0,0,0-1.41,1.41L30.13,22H25v2h5.13l-3.38,3.46a1,1,0,1,0,1.41,1.41L34,23.07Z"/>'
};
var logoutIconName = "logout";
var logoutIcon = [logoutIconName, renderIcon(icon103)];

// node_modules/@clr/core/icon/shapes/minus.js
var icon104 = {
  outline: '<path d="M26,17H10a1,1,0,0,0,0,2H26a1,1,0,0,0,0-2Z"/>'
};
var minusIconName = "minus";
var minusIcon = [minusIconName, renderIcon(icon104)];

// node_modules/@clr/core/icon/shapes/minus-circle.js
var icon105 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M24,17H12a1,1,0,0,0,0,2H24a1,1,0,0,0,0-2Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm6,17.5H12a1.5,1.5,0,0,1,0-3H24a1.5,1.5,0,0,1,0,3Z"/>'
};
var minusCircleIconName = "minus-circle";
var minusCircleIcon = [minusCircleIconName, renderIcon(icon105)];

// node_modules/@clr/core/icon/shapes/moon.js
var icon106 = {
  outline: '<path d="M31,27.19a1,1,0,0,0-1-.56c-.28,0-.56,0-.85,0A11,11,0,0,1,24.92,5.61a1,1,0,0,0,.61-1,1,1,0,0,0-.67-.91,14.7,14.7,0,0,0-5-.87,15.12,15.12,0,0,0,0,30.24,14.78,14.78,0,0,0,11-4.81A1,1,0,0,0,31,27.19ZM19.89,31.12a13.12,13.12,0,0,1,0-26.24,11.81,11.81,0,0,1,2,.16,13,13,0,0,0,5.72,23.53A12.75,12.75,0,0,1,19.89,31.12Z"/>',
  solid: '<path d="M29.2,26.72A12.07,12.07,0,0,1,22.9,4.44,13.68,13.68,0,0,0,19.49,4a14,14,0,0,0,0,28,13.82,13.82,0,0,0,10.9-5.34A11.71,11.71,0,0,1,29.2,26.72Z"/>'
};
var moonIconName = "moon";
var moonIcon = [moonIconName, renderIcon(icon106)];

// node_modules/@clr/core/icon/shapes/new.js
var icon107 = {
  outline: '<path d="M34.59,23l-4.08-5,4-4.9a1.82,1.82,0,0,0,.23-1.94A1.93,1.93,0,0,0,32.94,10h-31A1.91,1.91,0,0,0,0,11.88V24.13A1.91,1.91,0,0,0,1.94,26H33.05a1.93,1.93,0,0,0,1.77-1.09A1.82,1.82,0,0,0,34.59,23ZM2,24V12H32.78l-4.84,5.93L32.85,24Z"/><polygon points="9.39 19.35 6.13 15 5 15 5 21.18 6.13 21.18 6.13 16.84 9.39 21.18 10.51 21.18 10.51 15 9.39 15 9.39 19.35"/><polygon points="12.18 21.18 16.84 21.18 16.84 20.16 13.31 20.16 13.31 18.55 16.5 18.55 16.5 17.52 13.31 17.52 13.31 16.03 16.84 16.03 16.84 15 12.18 15 12.18 21.18"/><polygon points="24.52 19.43 23.06 15 21.84 15 20.37 19.43 19.05 15 17.82 15 19.78 21.18 20.89 21.18 22.45 16.59 24 21.18 25.13 21.18 27.08 15 25.85 15 24.52 19.43"/>',
  solid: '<path d="M34.11,24.49l-3.92-6.62,3.88-6.35A1,1,0,0,0,33.22,10H2a2,2,0,0,0-2,2V24a2,2,0,0,0,2,2H33.25A1,1,0,0,0,34.11,24.49Zm-23.6-3.31H9.39L6.13,16.84v4.35H5V15H6.13l3.27,4.35V15h1.12ZM16.84,16H13.31v1.49h3.2v1h-3.2v1.61h3.53v1H12.18V15h4.65Zm8.29,5.16H24l-1.55-4.59L20.9,21.18H19.78l-2-6.18H19l1.32,4.43L21.84,15h1.22l1.46,4.43L25.85,15h1.23Z"/>'
};
var newIconName = "new";
var newIcon = [newIconName, renderIcon(icon107)];

// node_modules/@clr/core/icon/shapes/no-access.js
var icon108 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M27.15,15H8.85A1.85,1.85,0,0,0,7,16.85v2.29A1.85,1.85,0,0,0,8.85,21H27.15A1.85,1.85,0,0,0,29,19.15V16.85A1.85,1.85,0,0,0,27.15,15Zm.25,4.15a.25.25,0,0,1-.25.25H8.85a.25.25,0,0,1-.25-.25V16.85a.25.25,0,0,1,.25-.25H27.15a.25.25,0,0,1,.25.25Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM29.15,20H6.85A.85.85,0,0,1,6,19.15V16.85A.85.85,0,0,1,6.85,16H29.15a.85.85,0,0,1,.85.85v2.29A.85.85,0,0,1,29.15,20Z"/>'
};
var noAccessIconName = "no-access";
var noAccessIcon = [noAccessIconName, renderIcon(icon108)];

// node_modules/@clr/core/icon/shapes/note.js
var icon109 = {
  outline: '<path d="M28,30H6V8H19.22l2-2H6A2,2,0,0,0,4,8V30a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V15l-2,2Z"/><path d="M33.53,5.84,30.16,2.47a1.61,1.61,0,0,0-2.28,0L14.17,16.26l-1.11,4.81A1.61,1.61,0,0,0,14.63,23,1.69,1.69,0,0,0,15,23l4.85-1.07L33.53,8.12A1.61,1.61,0,0,0,33.53,5.84ZM18.81,20.08l-3.66.81L16,17.26,26.32,6.87l2.82,2.82ZM30.27,8.56,27.45,5.74,29,4.16,31.84,7Z"/>',
  solid: '<path d="M33,6.4,29.3,2.7a1.71,1.71,0,0,0-2.36,0L23.65,6H6A2,2,0,0,0,4,8V30a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V11.76l3-3A1.67,1.67,0,0,0,33,6.4ZM18.83,20.13l-4.19.93,1-4.15,9.55-9.57,3.23,3.23ZM29.5,9.43,26.27,6.2l1.85-1.85,3.23,3.23Z"/>'
};
var noteIconName = "note";
var noteIcon = [noteIconName, renderIcon(icon109)];

// node_modules/@clr/core/icon/shapes/objects.js
var icon110 = {
  outline: '<path d="M16.08,14.9a10.41,10.41,0,0,1,1.87-.71l-4-10.77a2,2,0,0,0-3.75,0L2,25.26A2,2,0,0,0,3.92,28h6.94a10,10,0,0,1-.52-2H3.92L12.06,4.12Z"/><path d="M32,9H22a2,2,0,0,0-2,2v2.85c.23,0,.46,0,.69,0A10.51,10.51,0,0,1,22,13.9V11H32V21H30.65a10.42,10.42,0,0,1,.45,2H32a2,2,0,0,0,2-2V11A2,2,0,0,0,32,9Z"/><path d="M20.69,15.81a8.5,8.5,0,1,0,8.5,8.5A8.51,8.51,0,0,0,20.69,15.81Zm0,15a6.5,6.5,0,1,1,6.5-6.5A6.51,6.51,0,0,1,20.69,30.81Z"/>',
  solid: '<path d="M10.65,24.44a9.51,9.51,0,0,1,7.06-9.17L13,3a1,1,0,0,0-1.87,0L2.07,26.56A1,1,0,0,0,3,27.92h8.32A9.44,9.44,0,0,1,10.65,24.44Z"/><path d="M32,10H20a1,1,0,0,0-1,1v4a9.43,9.43,0,0,1,10.63,9H32a1,1,0,0,0,1-1V11A1,1,0,0,0,32,10Z"/><circle cx="20.15" cy="24.44" r="7.5"/>'
};
var objectsIconName = "objects";
var objectsIcon = [objectsIconName, renderIcon(icon110)];

// node_modules/@clr/core/icon/shapes/organization.js
var icon111 = {
  outline: '<polygon points="9.8 18.8 26.2 18.8 26.2 21.88 27.8 21.88 27.8 17.2 18.8 17.2 18.8 14 17.2 14 17.2 17.2 8.2 17.2 8.2 21.88 9.8 21.88 9.8 18.8"/><path d="M14,23H4a2,2,0,0,0-2,2v6a2,2,0,0,0,2,2H14a2,2,0,0,0,2-2V25A2,2,0,0,0,14,23ZM4,31V25H14v6Z"/><path d="M32,23H22a2,2,0,0,0-2,2v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V25A2,2,0,0,0,32,23ZM22,31V25H32v6Z"/><path d="M13,13H23a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2H13a2,2,0,0,0-2,2v6A2,2,0,0,0,13,13Zm0-8H23v6H13Z"/>',
  solid: '<polygon points="9.8 18.8 26.2 18.8 26.2 21.88 27.8 21.88 27.8 17.2 18.8 17.2 18.8 14 17.2 14 17.2 17.2 8.2 17.2 8.2 21.88 9.8 21.88 9.8 18.8"/><rect x="2" y="23" width="14" height="10" rx="2" ry="2"/><rect x="20" y="23" width="14" height="10" rx="2" ry="2"/><rect x="11" y="3" width="14" height="10" rx="2" ry="2"/>'
};
var organizationIconName = "organization";
var organizationIcon = [organizationIconName, renderIcon(icon111)];

// node_modules/@clr/core/icon/shapes/paperclip.js
var icon112 = {
  outline: '<path d="M8.42,32.6A6.3,6.3,0,0,1,4,30.79l-.13-.13A6.2,6.2,0,0,1,2,26.22,6.77,6.77,0,0,1,4,21.4L19.5,6.07a8.67,8.67,0,0,1,12.15-.35A8,8,0,0,1,34,11.44a9,9,0,0,1-2.7,6.36L17.37,31.6A1,1,0,1,1,16,30.18L29.89,16.38A7,7,0,0,0,32,11.44a6,6,0,0,0-1.76-4.3,6.67,6.67,0,0,0-9.34.35L5.45,22.82A4.78,4.78,0,0,0,4,26.22a4.21,4.21,0,0,0,1.24,3l.13.13a4.64,4.64,0,0,0,6.5-.21L25.22,15.94A2.7,2.7,0,0,0,26,14a2.35,2.35,0,0,0-.69-1.68,2.61,2.61,0,0,0-3.66.13l-9.2,9.12a1,1,0,1,1-1.41-1.42L20.28,11a4.62,4.62,0,0,1,6.48-.13A4.33,4.33,0,0,1,28,14a4.68,4.68,0,0,1-1.41,3.34L13.28,30.58A6.91,6.91,0,0,1,8.42,32.6Z"/>'
};
var paperclipIconName = "paperclip";
var paperclipIcon = [paperclipIconName, renderIcon(icon112)];

// node_modules/@clr/core/icon/shapes/paste.js
var icon113 = {
  outline: '<path d="M30,12H26v2h4v2h2V14A2,2,0,0,0,30,12Z"/><rect x="30" y="18" width="2" height="6"/><path d="M30,30H28v2h2a2,2,0,0,0,2-2V26H30Z"/><path d="M24,22V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V22a2,2,0,0,0,2,2H22A2,2,0,0,0,24,22ZM6,6H22V22H6Z"/><rect x="20" y="30" width="6" height="2"/><path d="M14,26H12v4a2,2,0,0,0,2,2h4V30H14Z"/>',
  solid: '<path d="M30,12H26v2h4v2h2V14A2,2,0,0,0,30,12Z"/><rect x="30" y="18" width="2" height="6"/><path d="M30,30H28v2h2a2,2,0,0,0,2-2V26H30Z"/><rect x="4" y="4" width="20" height="20" rx="2" ry="2"/><rect x="20" y="30" width="6" height="2"/><path d="M14,26H12v4a2,2,0,0,0,2,2h4V30H14Z"/>'
};
var pasteIconName = "paste";
var pasteIcon = [pasteIconName, renderIcon(icon113)];

// node_modules/@clr/core/icon/shapes/pencil.js
var icon114 = {
  outline: '<path d="M33.87,8.32,28,2.42a2.07,2.07,0,0,0-2.92,0L4.27,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13.09,32,33.87,11.24A2.07,2.07,0,0,0,33.87,8.32ZM12.09,30.2,4.32,31.83l1.77-7.62L21.66,8.7l6,6ZM29,13.25l-6-6,3.48-3.46,5.9,6Z"/>',
  solid: '<path d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"/><path d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"/>'
};
var pencilIconName = "pencil";
var pencilIcon = [pencilIconName, renderIcon(icon114)];

// node_modules/@clr/core/icon/shapes/pin.js
var icon115 = {
  outline: '<path d="M33,16.59a1,1,0,0,1-.71-.29L19.7,3.71a1,1,0,0,1,1.41-1.41L33.71,14.89A1,1,0,0,1,33,16.59Z"/><path d="M28.52,15.56l-1.41-1.41-7.2,7.2a1,1,0,0,0-.25,1,9,9,0,0,1-1.53,8.09L5.58,17.87a9,9,0,0,1,8.09-1.53,1,1,0,0,0,1-.25l7.2-7.2L20.44,7.48l-6.79,6.79A10.94,10.94,0,0,0,3.41,17.11a1,1,0,0,0,0,1.42l6.33,6.33L2.29,32.29a1,1,0,1,0,1.41,1.41l7.44-7.44,6.33,6.33a1,1,0,0,0,.71.29h0a1,1,0,0,0,.71-.3,11,11,0,0,0,2.84-10.24Z"/>',
  solid: '<path d="M33,16.71a1,1,0,0,1-.71-.29L19.7,3.82a1,1,0,0,1,1.41-1.41L33.71,15A1,1,0,0,1,33,16.71Z"/><path d="M20.44,7.59l-6.79,6.79A10.94,10.94,0,0,0,3.41,17.22a1,1,0,0,0,0,1.42L9.73,25,2.29,32.41a1,1,0,1,0,1.41,1.41l7.44-7.44,6.33,6.33a1,1,0,0,0,.71.29h0a1,1,0,0,0,.71-.3,11,11,0,0,0,2.84-10.24l6.79-6.79Z"/>'
};
var pinIconName = "pin";
var pinIcon = [pinIconName, renderIcon(icon115)];

// node_modules/@clr/core/icon/shapes/pinboard.js
var icon116 = {
  outline: '<path d="M30,30,6,30,6,6H22V4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V14H30Z"/><path d="M33.57,9.33l-7-7a1,1,0,0,0-1.41,1.41l7,7a1,1,0,1,0,1.41-1.41Z"/><path d="M22.1,11.19l.7.5L26.46,8,25,6.56,22.51,9.13c-2-.87-4.35.14-5.92,1.68l-.72.71,3.54,3.54-3.67,3.67,1.41,1.41,3.67-3.67L24.37,20l.71-.72c1.54-1.57,2.55-3.92,1.68-5.93l2.54-2.57L27.88,9.38,24.21,13.1l.49.69c.76,1,.25,2.37-.41,3.33L18.77,11.6C19.84,10.86,21.15,10.5,22.1,11.19Z"/>',
  solid: '<path d="M30,30,6,30,6,6H22V4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V14H30Z"/><path d="M33.57,9.33l-7-7a1,1,0,0,0-1.41,1.41l1.38,1.38-4,4c-2-.87-4.35.14-5.92,1.68l-.72.71,3.54,3.54-3.67,3.67,1.41,1.41,3.67-3.67L24.37,20l.71-.72c1.54-1.57,2.55-3.91,1.68-5.92l4-4,1.38,1.38a1,1,0,1,0,1.41-1.41Z"/>'
};
var pinboardIconName = "pinboard";
var pinboardIcon = [pinboardIconName, renderIcon(icon116)];

// node_modules/@clr/core/icon/shapes/plus.js
var icon117 = {
  outline: '<path d="M30,17H19V6a1,1,0,1,0-2,0V17H6a1,1,0,0,0-1,1,.91.91,0,0,0,1,.94H17V30a1,1,0,1,0,2,0V19H30a1,1,0,0,0,1-1A1,1,0,0,0,30,17Z"/>'
};
var plusIconName = "plus";
var plusIcon = [plusIconName, renderIcon(icon117)];

// node_modules/@clr/core/icon/shapes/plus-circle.js
var icon118 = {
  outline: '<path d="M26.17,17H19V9.83a1,1,0,0,0-2,0V17H9.83a1,1,0,0,0,0,2H17v7.17a1,1,0,0,0,2,0V19h7.17a1,1,0,0,0,0-2Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/>',
  solid: '<path d="M34,18A16,16,0,1,1,18,2,16,16,0,0,1,34,18Zm-8.41-1.5H19.5V10.41a1.5,1.5,0,0,0-3,0V16.5H10.41a1.5,1.5,0,0,0,0,3H16.5v6.09a1.5,1.5,0,0,0,3,0V19.5h6.09a1.5,1.5,0,0,0,0-3Z"/>'
};
var plusCircleIconName = "plus-circle";
var plusCircleIcon = [plusCircleIconName, renderIcon(icon118)];

// node_modules/@clr/core/icon/shapes/pop-out.js
var icon119 = {
  outline: '<path d="M27,33H5a2,2,0,0,1-2-2V9A2,2,0,0,1,5,7H15V9H5V31H27V21h2V31A2,2,0,0,1,27,33Z"/><path d="M18,3a1,1,0,0,0,0,2H29.59L15.74,18.85a1,1,0,1,0,1.41,1.41L31,6.41V18a1,1,0,0,0,2,0V3Z"/>'
};
var popOutIconName = "pop-out";
var popOutIcon = [popOutIconName, renderIcon(icon119)];

// node_modules/@clr/core/icon/shapes/portrait.js
var icon120 = {
  outline: '<path d="M15.34,26.45a.8.8,0,0,0-1.13,0,.79.79,0,0,0,0,1.13L18,31.09l3.74-3.47a.79.79,0,0,0,.05-1.13.8.8,0,0,0-1.13,0L18.8,28.17V7.83l1.86,1.72a.8.8,0,1,0,1.08-1.17L18,4.91,14.26,8.38a.79.79,0,0,0,0,1.13.8.8,0,0,0,1.13,0L17.2,7.83V28.17Z"/><path d="M28,2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V4A2,2,0,0,0,28,2Zm0,30H8V4H28Z"/>',
  solid: '<path d="M28,2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V4A2,2,0,0,0,28,2ZM20.52,26.3a1,1,0,0,1,1.36,1.47L18,31.36l-3.88-3.59a1,1,0,0,1,1.36-1.47L17,27.71V8.29L15.48,9.7a1,1,0,0,1-1.36-1.47L18,4.64l3.88,3.59a1,1,0,0,1,.05,1.41,1,1,0,0,1-.73.32,1,1,0,0,1-.68-.26L19,8.29V27.71Z"/>'
};
var portraitIconName = "portrait";
var portraitIcon = [portraitIconName, renderIcon(icon120)];

// node_modules/@clr/core/icon/shapes/printer.js
var icon121 = {
  outline: '<path d="M29,9H27V5H9V9H7a4,4,0,0,0-4,4V24H6.92V22.09H5V13a2,2,0,0,1,2-2H29a2,2,0,0,1,2,2v9H29.08V24H33V13A4,4,0,0,0,29,9ZM25,9H11V7H25Z"/><path d="M28,18H8a1,1,0,0,0,0,2H9V32H27V20h1a1,1,0,0,0,0-2ZM25,30H11V20H25Z"/><rect x="27" y="13.04" width="2" height="2"/>',
  outlineAlerted: '<path d="M28,18H8a1,1,0,0,0,0,2H9V32H27V20h1a1,1,0,0,0,0-2ZM25,30H11V20H25Z"/><polygon points="31 15.4 31 22.09 29.08 22.09 29.08 24 33 24 33 15.4 31 15.4"/><path d="M5,13a2,2,0,0,1,2-2H18.64A3.65,3.65,0,0,1,19,9.89L19.54,9H11V7h9.71l1.13-2H9V9H7a4,4,0,0,0-4,4V24H6.92V22.09H5Z"/>',
  outlineBadged: '<path d="M28,18H8a1,1,0,0,0,0,2H9V32H27V20h1a1,1,0,0,0,0-2ZM25,30H11V20H25Z"/><rect x="27" y="13.04" width="2" height="2"/><path d="M33,12.88a7.45,7.45,0,0,1-2,.55v8.66H29.08V24H33V13C33,13,33,12.93,33,12.88Z"/><path d="M5,13a2,2,0,0,1,2-2H24.42a7.5,7.5,0,0,1-1.27-2H11V7H22.57a7.52,7.52,0,0,1-.07-1,7.54,7.54,0,0,1,.07-1H9V9H7a4,4,0,0,0-4,4V24H6.92V22.09H5Z"/>',
  solid: '<path d="M29,9H27V5H9V9H7a4,4,0,0,0-4,4V24H9v8H27V24h6V13A4,4,0,0,0,29,9ZM25,24v6H11V19H25ZM25,9H11V7H25Zm4,6H27V13h2Z"/>',
  solidAlerted: '<path d="M22.23,15.4A3.68,3.68,0,0,1,19,9.89L19.54,9H11V7h9.71l1.13-2H9V9H7a4,4,0,0,0-4,4V24H9v8H27V24h6V15.4ZM25,24v6H11V19H25Z"/>',
  solidBadged: '<path d="M33,12.88a7.3,7.3,0,0,1-4,.55V15H27V13h.32a7.52,7.52,0,0,1-4.18-4H11V7H22.57a7.52,7.52,0,0,1-.07-1,7.54,7.54,0,0,1,.07-1H9V9H7a4,4,0,0,0-4,4V24H9v8H27V24h6V13C33,13,33,12.93,33,12.88ZM25,24v6H11V19H25Z"/>'
};
var printerIconName = "printer";
var printerIcon = [printerIconName, renderIcon(icon121)];

// node_modules/@clr/core/icon/shapes/recycle.js
var icon122 = {
  outline: '<path d="M6.4,17.4c0.2,0.1,0.3,0.1,0.5,0.1c0.2,0,0.4-0.1,0.5-0.1l7-4.1c0.3-0.2,0.5-0.5,0.5-0.9c0-0.4-0.2-0.7-0.5-0.9L11.9,10L14,6.2c0.4-0.7,1-1.3,1.7-1.7c2-1.1,4.5-0.3,5.6,1.7c0.3,0.5,0.9,0.6,1.4,0.3c0,0,0,0,0.1,0c0.4-0.3,0.5-0.9,0.3-1.3c-0.6-1-1.4-1.9-2.4-2.4c-3-1.6-6.7-0.6-8.3,2.4L9.6,9.9c-0.3,0.5-0.1,1.1,0.3,1.4l2,1.2l-4,2.4V8.2c0-0.6-0.4-1-1-1C6.4,7.3,6,7.7,6,8.3v8.3C6,16.9,6.2,17.2,6.4,17.4z"/><path d="M32.1,21l-3.5-6.2c-0.1-0.2-0.4-0.4-0.6-0.5c-0.3-0.1-0.5,0-0.8,0.1l-2.2,1.3V11l5.5,3.3c0.1,0,0.1,0.1,0.2,0.1c0.5,0.2,1.1,0,1.3-0.5c0.2-0.5,0-1.1-0.5-1.3l-7-4.2c-0.3-0.2-0.7-0.2-1,0C23.1,8.5,23,8.8,23,9.2v8.3c0,0.4,0.1,0.8,0.4,1c0.3,0.2,0.7,0.2,1,0l2.9-1.7l3,5.3c0.7,1.3,0.7,2.8,0,4.1c-0.6,1.2-1.9,1.9-3.2,1.9h-0.9c-0.5,0-1.2,0.4-1.2,1c0.1,0.6,0.6,1,1.2,1h0.9c2.1,0,4-1.1,5-2.9C33.2,25.2,33.2,22.9,32.1,21z"/><path d="M22.4,28.2l-7-4.2c-0.3-0.2-0.7-0.2-1,0c-0.3,0.2-0.4,0.5-0.4,0.9v3.3H9.1c-1.5-0.1-2.9-0.9-3.6-2.3c-0.8-1.4-0.8-3.2,0-4.6c0.3-0.5,0.1-1.1-0.4-1.4c-0.5-0.3-1.1-0.1-1.4,0.4c-1.2,2.1-1.1,4.6,0.1,6.6C4.9,28.8,7,30,9.2,30H15c0.6,0,1-0.4,1-1v-2.4l4,2.4l-5.6,3.3c-0.3,0.2-0.5,0.5-0.5,0.9c0,0.6,0.5,1,1,1c0.2,0,0.3-0.1,0.5-0.2l7-4.2c0.2-0.1,0.3-0.2,0.4-0.4C23.1,29,22.9,28.4,22.4,28.2z"/>',
  solid: '<path d="M20.8,3.1c-3-1.6-6.7-0.6-8.4,2.4l-2.2,3.8l-2-1.1C8.2,8,8,8,7.9,8C7.4,8,7,8.4,7,8.9v7.2c0,0.3,0.1,0.6,0.4,0.8c0.1,0.1,0.3,0.1,0.4,0.1c0.2,0,0.3,0,0.4-0.1l6.3-3.6c0.3-0.2,0.4-0.4,0.4-0.8c0-0.3-0.2-0.6-0.4-0.8L12,10.3l2.2-3.8c0.4-0.7,1-1.3,1.7-1.7c2-1.1,4.5-0.3,5.6,1.7c0.3,0.5,0.9,0.6,1.4,0.4c0.5-0.3,0.6-0.9,0.4-1.4C22.6,4.5,21.8,3.6,20.8,3.1z"/><path d="M32.2,21.1l-3-5.3l2.3-1.3c0.3-0.2,0.4-0.4,0.4-0.8c0-0.3-0.2-0.6-0.4-0.8l-6.2-3.6c-0.1-0.1-0.3-0.1-0.4-0.1c-0.5,0-0.9,0.4-0.9,0.9v7.2c0,0.3,0.2,0.6,0.4,0.8c0.1,0.1,0.3,0.1,0.4,0.1c0.2,0,0.3-0.1,0.4-0.1l2.2-1.3l3,5.3c0.7,1.2,0.7,2.8,0,4c-0.7,1.2-1.9,1.9-3.2,1.9h-0.9c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h0.9c2.1,0,4-1.1,5-3C33.2,25.3,33.2,23,32.2,21.1z"/><path d="M21.7,28.4l-6.2-3.6c-0.1-0.1-0.3-0.1-0.4-0.1c-0.5,0-0.9,0.4-0.9,0.9v2.6H9.3c-1.5,0-2.9-0.8-3.6-2.1c-0.8-1.4-0.8-3.1,0-4.5c0.3-0.5,0.1-1.1-0.4-1.4c-0.5-0.3-1.1-0.1-1.4,0.4c-1.2,2-1.2,4.5,0,6.5c1.1,1.9,3.1,3.1,5.4,3.1h4.8v2.6c0,0.3,0.2,0.6,0.4,0.8c0.1,0.1,0.3,0.1,0.4,0.1c0.1,0,0.3,0,0.4-0.1l6.3-3.6c0.3-0.2,0.4-0.4,0.4-0.8C22.1,28.8,21.9,28.5,21.7,28.4z"/>'
};
var recycleIconName = "recycle";
var recycleIcon = [recycleIconName, renderIcon(icon122)];

// node_modules/@clr/core/icon/shapes/redo.js
var icon123 = {
  outline: '<path d="M24,4.22a1,1,0,0,0-1.41,1.42l5.56,5.49h-13A11,11,0,0,0,10.07,32,1,1,0,0,0,11,30.18a9,9,0,0,1-5-8,9.08,9.08,0,0,1,9.13-9h13l-5.54,5.48A1,1,0,0,0,24,20l8-7.91Z"/>'
};
var redoIconName = "redo";
var redoIcon = [redoIconName, renderIcon(icon123)];

// node_modules/@clr/core/icon/shapes/refresh.js
var icon124 = {
  outline: '<path d="M22.4,11.65a1.09,1.09,0,0,0,1.09,1.09H34.43V1.81a1.09,1.09,0,1,0-2.19,0V8.95a16.41,16.41,0,1,0,1.47,15.86,1.12,1.12,0,0,0-2.05-.9,14.18,14.18,0,1,1-1.05-13.36H23.5A1.09,1.09,0,0,0,22.4,11.65Z"/>'
};
var refreshIconName = "refresh";
var refreshIcon = [refreshIconName, renderIcon(icon124)];

// node_modules/@clr/core/icon/shapes/repeat.js
var icon125 = {
  outline: '<path d="M6,14.15A3.17,3.17,0,0,1,9.17,11H28.4l-4.28,4.54a1,1,0,1,0,1.46,1.37L32.09,10,25.58,3.09a1,1,0,1,0-1.46,1.37L28.4,9H9.17A5.17,5.17,0,0,0,4,14.15v6.1l2-2.12Z"/><path d="M30,21.85A3.17,3.17,0,0,1,26.83,25H7.6l4.28-4.54a1,1,0,1,0-1.46-1.37L3.91,26l6.51,6.91a1,1,0,1,0,1.46-1.37L7.6,27H26.83A5.17,5.17,0,0,0,32,21.85v-6.1l-2,2.12Z"/>'
};
var repeatIconName = "repeat";
var repeatIcon = [repeatIconName, renderIcon(icon125)];

// node_modules/@clr/core/icon/shapes/resize.js
var icon126 = {
  outline: '<path d="M19,4a1,1,0,0,0,0,2h9.59l-9.25,9.25a1,1,0,1,0,1.41,1.41L30,7.41V17a1,1,0,0,0,2,0V4Z"/><path d="M4,19a1,1,0,0,1,2,0v9.59l9.25-9.25a1,1,0,1,1,1.41,1.41L7.41,30H17a1,1,0,0,1,0,2H4Z"/>'
};
var resizeIconName = "resize";
var resizeIcon = [resizeIconName, renderIcon(icon126)];

// node_modules/@clr/core/icon/shapes/scissors.js
var icon127 = {
  outline: '<path d="M24.06,18.18l9.61-8.77a1,1,0,0,0-.09-1.55l-2.24-1.6a3.57,3.57,0,0,0-4.28.12L15.88,15.3l-3.26-2.52a5.45,5.45,0,1,0-1,1.77l2.62,2L10,20a5.48,5.48,0,1,0,1.59,1.29L28.3,7.94a1.57,1.57,0,0,1,1.88-.05l1.23.88L21.1,18.19l10.31,9.4-1.23.88a1.57,1.57,0,0,1-1.88-.05l-9.81-7.85L17,21.93l10.06,8a3.57,3.57,0,0,0,4.29.12l2.24-1.6a1,1,0,0,0,.09-1.55ZM7.45,14.54a3.46,3.46,0,1,1,3.45-3.46A3.46,3.46,0,0,1,7.45,14.54Zm0,13.72A3.46,3.46,0,1,1,10.9,24.8,3.46,3.46,0,0,1,7.45,28.26Z"/>',
  solid: '<path d="M33.81,8.13,31.63,6.48a1.92,1.92,0,0,0-2.36,0L10,22.06a5.46,5.46,0,1,0,2,1.81l3.9-3.12L29.27,31.52a1.92,1.92,0,0,0,2.36,0l2.18-1.64L20.94,19ZM7.45,29.75a2.86,2.86,0,1,1,2.86-2.86A2.87,2.87,0,0,1,7.45,29.75Z"/><path d="M14.3,15.24,12,13.38a5.46,5.46,0,1,0-2,1.81L12.16,17Zm-6.85-2a2.86,2.86,0,1,1,2.86-2.86A2.86,2.86,0,0,1,7.45,13.23Z"/>'
};
var scissorsIconName = "scissors";
var scissorsIcon = [scissorsIconName, renderIcon(icon127)];

// node_modules/@clr/core/icon/shapes/scroll.js
var icon128 = {
  outline: '<path d="M34,11.12V6.58a4.5,4.5,0,0,0-4.5-4.5h-16A4.5,4.5,0,0,0,9,6.58v23a2.5,2.5,0,1,1-5,0V26H7.19V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V13.13h-2V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54Zm-4.5-7A2.5,2.5,0,0,1,32,6.58V9.12H18V6.58a4.48,4.48,0,0,0-.76-2.5Z"/>',
  outlineAlerted: '<path d="M28.08,15.4V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54h2.61A3.66,3.66,0,0,1,19,9.89l.44-.76H18V6.58a4.48,4.48,0,0,0-.76-2.5H22.4l1.15-2H13.5A4.5,4.5,0,0,0,9,6.58v23a2.5,2.5,0,1,1-5,0V26H7.19V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V15.4Z"/>',
  outlineBadged: '<path d="M30,13.5a7.49,7.49,0,0,1-1.92-.26v16.3a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54h8.54a7.5,7.5,0,0,1-1.35-2H18V6.58a4.48,4.48,0,0,0-.76-2.5h5.52a7.44,7.44,0,0,1,.86-2H13.5A4.5,4.5,0,0,0,9,6.58v23a2.5,2.5,0,1,1-5,0V26H7.19V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5v-16Z"/>',
  solid: '<path d="M34,11.12V6.58a4.5,4.5,0,0,0-4.5-4.5h-16A4.5,4.5,0,0,0,9,6.58V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V13.13h-2V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54Z"/>',
  solidAlerted: '<path d="M28.08,15.4V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54h2.61A3.66,3.66,0,0,1,19,9.89l4.51-7.8H13.5A4.5,4.5,0,0,0,9,6.58V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V15.4Z"/>',
  solidBadged: '<path d="M30,13.5a7.49,7.49,0,0,1-1.92-.26v16.3a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54h8.54a7.46,7.46,0,0,1-.92-9H13.5A4.5,4.5,0,0,0,9,6.58V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5v-16Z"/>'
};
var scrollIconName = "scroll";
var scrollIcon = [scrollIconName, renderIcon(icon128)];

// node_modules/@clr/core/icon/shapes/shrink.js
var icon129 = {
  outline: '<path d="M32,15H22.41l9.25-9.25a1,1,0,0,0-1.41-1.41L21,13.59V4a1,1,0,0,0-2,0V17H32a1,1,0,0,0,0-2Z"/><path d="M4,19a1,1,0,0,0,0,2h9.59L4.33,30.25a1,1,0,1,0,1.41,1.41L15,22.41V32a1,1,0,0,0,2,0V19Z"/>'
};
var shrinkIconName = "shrink";
var shrinkIcon = [shrinkIconName, renderIcon(icon129)];

// node_modules/@clr/core/icon/shapes/slider.js
var icon130 = {
  outline: '<path d="M12,12.37A4,4,0,0,0,9,8.48V5A1,1,0,1,0,7,5V8.48a4,4,0,0,0,0,7.78V31a1,1,0,1,0,2,0V16.26A4,4,0,0,0,12,12.37Zm-4,2a2,2,0,1,1,2-2A2,2,0,0,1,8,14.4Z"/><path d="M32,15.83a4,4,0,0,0-3-3.89V5a1,1,0,1,0-2,0v6.94a4,4,0,0,0,0,7.78V31a1,1,0,1,0,2,0V19.72A4,4,0,0,0,32,15.83Zm-4,2a2,2,0,1,1,2-2A2,2,0,0,1,28,17.87Z"/><path d="M22,24.5a4,4,0,0,0-3-3.89V5a1,1,0,1,0-2,0V20.61a4,4,0,0,0,0,7.78V31a1,1,0,1,0,2,0V28.39A4,4,0,0,0,22,24.5Zm-4,2a2,2,0,1,1,2-2A2,2,0,0,1,18,26.53Z"/>',
  solid: '<path d="M9,9.29V5A1,1,0,1,0,7,5V9.3a3.22,3.22,0,0,0,0,6.11V31a1,1,0,1,0,2,0V15.43A3.22,3.22,0,0,0,9,9.29Z"/><path d="M19,21.45V5a1,1,0,1,0-2,0V21.47a3.22,3.22,0,0,0,0,6.11V31a1,1,0,1,0,2,0V27.6a3.22,3.22,0,0,0,0-6.14Z"/><path d="M29,12.75V5a1,1,0,1,0-2,0v7.76a3.22,3.22,0,0,0,0,6.11V31a1,1,0,1,0,2,0V18.89a3.22,3.22,0,0,0,0-6.14Z"/>'
};
var sliderIconName = "slider";
var sliderIcon = [sliderIconName, renderIcon(icon130)];

// node_modules/@clr/core/icon/shapes/snowflake.js
var icon131 = {
  outline: '<path d="M18.05,33.61a1,1,0,0,1-1-1V3.37a1,1,0,1,1,1.95,0V32.63A1,1,0,0,1,18.05,33.61Z"/><path d="M18.06,10.07,14.52,6.54a1,1,0,0,1,0-1.41,1,1,0,0,1,1.41,0l2.13,2.12,2.12-2.12a1,1,0,0,1,1.41,0,1,1,0,0,1,0,1.41Z"/><path d="M20.85,31.17a1,1,0,0,1-.7-.29L18,28.76,15.9,30.88a1,1,0,0,1-1.41,0,1,1,0,0,1,0-1.42L18,25.93l3.54,3.53a1,1,0,0,1,0,1.42A1,1,0,0,1,20.85,31.17Z"/><path d="M30.92,26.5a1,1,0,0,1-.5-.13l-26-15A1,1,0,0,1,4.07,10a1,1,0,0,1,1.37-.36l26,15a1,1,0,0,1-.5,1.87Z"/><path d="M6,15.37a1,1,0,0,1-.26-2l2.9-.78L7.84,9.73a1,1,0,1,1,1.93-.52L11.07,14,6.24,15.33A.82.82,0,0,1,6,15.37Z"/><path d="M27.05,27.54a1,1,0,0,1-1-.75L24.8,22l4.82-1.3a1,1,0,1,1,.52,1.93l-2.9.78.78,2.9a1,1,0,0,1-.71,1.22A.75.75,0,0,1,27.05,27.54Z"/><path d="M4.94,26.5a1,1,0,0,1-.5-1.87l26-15a1,1,0,0,1,1.36.36,1,1,0,0,1-.36,1.37l-26,15A1,1,0,0,1,4.94,26.5Z"/><path d="M8.81,27.54a.75.75,0,0,1-.26,0,1,1,0,0,1-.71-1.22l.78-2.9-2.9-.78A1,1,0,0,1,5,21.38a1,1,0,0,1,1.23-.71L11.07,22l-1.3,4.82A1,1,0,0,1,8.81,27.54Z"/><path d="M29.88,15.37a.82.82,0,0,1-.26,0L24.8,14l1.29-4.83A1,1,0,1,1,28,9.73l-.78,2.89,2.9.78a1,1,0,0,1-.26,2Z"/>'
};
var snowflakeIconName = "snowflake";
var snowflakeIcon = [snowflakeIconName, renderIcon(icon131)];

// node_modules/@clr/core/icon/shapes/sort-by.js
var icon132 = {
  outline: '<path d="M28.54,13H7.46a1,1,0,0,1,0-2H28.54a1,1,0,0,1,0,2Z"/><path d="M21.17,19H7.46a1,1,0,0,1,0-2H21.17a1,1,0,0,1,0,2Z"/><path d="M13.74,25H7.46a1,1,0,0,1,0-2h6.28a1,1,0,0,1,0,2Z"/>'
};
var sortByIconName = "sort-by";
var sortByIcon = [sortByIconName, renderIcon(icon132)];

// node_modules/@clr/core/icon/shapes/sun.js
var icon133 = {
  outline: '<path d="M18,6.31a1,1,0,0,0,1-1V1.91a1,1,0,0,0-2,0v3.4A1,1,0,0,0,18,6.31Z"/><path d="M18,29.69a1,1,0,0,0-1,1v3.4a1,1,0,0,0,2,0v-3.4A1,1,0,0,0,18,29.69Z"/><path d="M8.32,9.74A1,1,0,0,0,9,10a1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42L7.33,5.92A1,1,0,0,0,5.92,7.33Z"/><path d="M27.68,26.26a1,1,0,1,0-1.42,1.42l2.41,2.4a1,1,0,0,0,.71.3,1,1,0,0,0,.7-.3,1,1,0,0,0,0-1.41Z"/><path d="M6.31,18a1,1,0,0,0-1-1H1.91a1,1,0,0,0,0,2h3.4A1,1,0,0,0,6.31,18Z"/><path d="M34.09,17h-3.4a1,1,0,1,0,0,2h3.4a1,1,0,0,0,0-2Z"/><path d="M8.32,26.26l-2.4,2.41a1,1,0,0,0,.7,1.71,1,1,0,0,0,.71-.3l2.41-2.4a1,1,0,1,0-1.42-1.42Z"/><path d="M27,10a1,1,0,0,0,.71-.29l2.4-2.41a1,1,0,0,0,0-1.41,1,1,0,0,0-1.41,0l-2.41,2.4a1,1,0,0,0,0,1.42A1,1,0,0,0,27,10Z"/><path d="M18.13,7.75a10.13,10.13,0,1,0,10,10.13A10.08,10.08,0,0,0,18.13,7.75Zm0,18.25a8.13,8.13,0,1,1,8-8.12A8.08,8.08,0,0,1,18.13,26Z"/>',
  solid: '<path d="M18,6.42a1,1,0,0,0,1-1V1.91a1,1,0,0,0-2,0V5.42A1,1,0,0,0,18,6.42Z"/><path d="M18,29.58a1,1,0,0,0-1,1v3.51a1,1,0,0,0,2,0V30.58A1,1,0,0,0,18,29.58Z"/><path d="M8.4,9.81A1,1,0,0,0,9.81,8.4L7.33,5.92A1,1,0,0,0,5.92,7.33Z"/><path d="M27.6,26.19a1,1,0,0,0-1.41,1.41l2.48,2.48a1,1,0,0,0,1.41-1.41Z"/><path d="M6.42,18a1,1,0,0,0-1-1H1.91a1,1,0,0,0,0,2H5.42A1,1,0,0,0,6.42,18Z"/><path d="M34.09,17H30.58a1,1,0,0,0,0,2h3.51a1,1,0,0,0,0-2Z"/><path d="M8.4,26.19,5.92,28.67a1,1,0,0,0,1.41,1.41L9.81,27.6A1,1,0,0,0,8.4,26.19Z"/><path d="M27.6,9.81l2.48-2.48a1,1,0,0,0-1.41-1.41L26.19,8.4A1,1,0,0,0,27.6,9.81Z"/><circle cx="18" cy="18" r="10"/>'
};
var sunIconName = "sun";
var sunIcon = [sunIconName, renderIcon(icon133)];

// node_modules/@clr/core/icon/shapes/switch.js
var icon134 = {
  outline: '<path d="M5.71,14H20.92V12H5.71L9.42,8.27A1,1,0,1,0,8,6.86L1.89,13,8,19.14a1,1,0,1,0,1.42-1.4Z"/><rect x="23" y="12" width="3" height="2"/><rect x="28" y="12" width="2" height="2"/><path d="M27.92,17.86a1,1,0,0,0-1.42,1.41L30.21,23H15v2H30.21L26.5,28.74a1,1,0,1,0,1.42,1.4L34,24Z"/><rect x="10" y="23" width="3" height="2"/><rect x="6" y="23" width="2" height="2"/>'
};
var switchIconName = "switch";
var switchIcon = [switchIconName, renderIcon(icon134)];

// node_modules/@clr/core/icon/shapes/sync.js
var icon135 = {
  outline: '<path d="M32.84,15.72a1,1,0,1,0-2,.29A13.15,13.15,0,0,1,31,17.94,13,13,0,0,1,8.7,27h5.36a1,1,0,0,0,0-2h-9v9a1,1,0,1,0,2,0V28.2A15,15,0,0,0,32.84,15.72Z"/><path d="M30.06,1A1.05,1.05,0,0,0,29,2V7.83A14.94,14.94,0,0,0,3,17.94a15.16,15.16,0,0,0,.2,2.48,1,1,0,0,0,1,.84h.16a1,1,0,0,0,.82-1.15A13.23,13.23,0,0,1,5,17.94a13,13,0,0,1,13-13A12.87,12.87,0,0,1,27.44,9H22.06a1,1,0,0,0,0,2H31V2A1,1,0,0,0,30.06,1Z"/>'
};
var syncIconName = "sync";
var syncIcon = [syncIconName, renderIcon(icon135)];

// node_modules/@clr/core/icon/shapes/table.js
var icon136 = {
  outline: '<path d="M8,34a1,1,0,0,1-1-1V2.92a1,1,0,0,1,2,0V33A1,1,0,0,1,8,34Z"/><path d="M17,33.92a1,1,0,0,1-1-1V9.1a1,1,0,1,1,2,0V32.92A1,1,0,0,1,17,33.92Z"/><path d="M26,34a1,1,0,0,1-1-1V9a1,1,0,0,1,2,0V33A1,1,0,0,1,26,34Z"/><path d="M33.11,18h-25a1,1,0,1,1,0-2h25a1,1,0,1,1,0,2Z"/><path d="M33.1,26.94H8.1A1,1,0,1,1,8.1,25h25a1,1,0,1,1,0,1.92Z"/><path d="M33,8.92H3A1,1,0,1,1,3,7H33a1,1,0,1,1,0,1.94Z"/>'
};
var tableIconName = "table";
var tableIcon = [tableIconName, renderIcon(icon136)];

// node_modules/@clr/core/icon/shapes/tag.js
var icon137 = {
  outline: '<circle cx="10.52" cy="10.52" r="1.43"/><path d="M31.93,19.2,17.33,4.6A2,2,0,0,0,15.92,4L6,4A2,2,0,0,0,4,6l0,9.92a2,2,0,0,0,.59,1.41l14.6,14.6a2,2,0,0,0,2.83,0l9.9-9.9A2,2,0,0,0,31.93,19.2ZM20.62,30.52,6,15.91V6h9.92l14.6,14.62Z"/>',
  outlineAlerted: '<circle cx="10.52" cy="10.52" r="1.43"/><path d="M31.93,19.2l-3.8-3.8H25.31l5.22,5.22-9.9,9.9L6,15.91V6h9.92l3.41,3.41,1-1.78-3-3A2,2,0,0,0,15.92,4L6,4A2,2,0,0,0,4,6l0,9.92a2,2,0,0,0,.59,1.41l14.6,14.6a2,2,0,0,0,2.83,0l9.9-9.9A2,2,0,0,0,31.93,19.2Z"/>',
  outlineBadged: '<circle cx="10.52" cy="10.52" r="1.43"/><path d="M31.93,19.2,17.33,4.6A2,2,0,0,0,15.92,4L6,4A2,2,0,0,0,4,6l0,9.92a2,2,0,0,0,.59,1.41l14.6,14.6a2,2,0,0,0,2.83,0l9.9-9.9A2,2,0,0,0,31.93,19.2ZM20.62,30.52,6,15.91V6h9.92l14.6,14.62Z"/>',
  solid: '<path d="M31.93,19.2,17.33,4.6A2,2,0,0,0,15.92,4L6,4A2,2,0,0,0,4,6l0,9.92a2,2,0,0,0,.59,1.41l14.6,14.6a2,2,0,0,0,2.83,0l9.9-9.9A2,2,0,0,0,31.93,19.2ZM9.65,11.31a1.66,1.66,0,1,1,1.66-1.66A1.66,1.66,0,0,1,9.65,11.31Z"/>',
  solidAlerted: '<path d="M28.46,15.73H22.23A3.68,3.68,0,0,1,19,10.22l1.43-2.47L17.33,4.6A2,2,0,0,0,15.92,4L6,4A2,2,0,0,0,4,6l0,9.92a2,2,0,0,0,.59,1.41l14.6,14.6a2,2,0,0,0,2.83,0l9.9-9.9a2,2,0,0,0,0-2.83ZM9.65,11.31a1.66,1.66,0,1,1,1.66-1.66A1.66,1.66,0,0,1,9.65,11.31Z"/>',
  solidBadged: '<path d="M31.93,19.2,17.33,4.6A2,2,0,0,0,15.92,4L6,4A2,2,0,0,0,4,6l0,9.92a2,2,0,0,0,.59,1.41l14.6,14.6a2,2,0,0,0,2.83,0l9.9-9.9A2,2,0,0,0,31.93,19.2ZM9.65,11.31a1.66,1.66,0,1,1,1.66-1.66A1.66,1.66,0,0,1,9.65,11.31Z"/>'
};
var tagIconName = "tag";
var tagIcon = [tagIconName, renderIcon(icon137)];

// node_modules/@clr/core/icon/shapes/tags.js
var icon138 = {
  outline: '<path d="M33.16,19.13,19.58,5.55A1.92,1.92,0,0,0,18.21,5H16.12L31.75,20.45,21.22,31.07a1.93,1.93,0,0,0,2.73,0l9.21-9.21a1.93,1.93,0,0,0,0-2.73Z"/><circle cx="7.81" cy="11.14" r="1.33"/><path d="M27.78,19.17,14.2,5.58A1.92,1.92,0,0,0,12.83,5H3.61A1.93,1.93,0,0,0,1.68,6.93v9.22a1.92,1.92,0,0,0,.57,1.36L15.84,31.1a1.93,1.93,0,0,0,2.73,0l9.21-9.21A1.93,1.93,0,0,0,27.78,19.17ZM17.26,29.69,3.69,16.15V7h9.1L26.37,20.48Z"/>',
  outlineAlerted: '<circle cx="7.81" cy="11.14" r="1.33"/><path d="M27.78,19.17,24,15.4H22.23A3.65,3.65,0,0,1,21,15.19l5.33,5.29-9.11,9.21L3.69,16.15V7h9.1l6,5.94a3.68,3.68,0,0,1,.1-2.69L14.2,5.58A1.92,1.92,0,0,0,12.83,5H3.61A1.93,1.93,0,0,0,1.68,6.93v9.22a1.92,1.92,0,0,0,.57,1.36L15.84,31.1a1.93,1.93,0,0,0,2.73,0l9.21-9.21A1.93,1.93,0,0,0,27.78,19.17Z"/><path d="M20.83,6.8,19.58,5.55A1.92,1.92,0,0,0,18.21,5H16.12L19.79,8.6Z"/><path d="M33.16,19.13,29.43,15.4H26.65l5.1,5L21.22,31.07a1.93,1.93,0,0,0,2.73,0l9.21-9.21a1.93,1.93,0,0,0,0-2.73Z"/>',
  outlineBadged: '<circle cx="7.81" cy="11.14" r="1.33"/><path d="M27.78,19.17,14.2,5.58A1.92,1.92,0,0,0,12.83,5H3.61A1.93,1.93,0,0,0,1.68,6.93v9.22a1.92,1.92,0,0,0,.57,1.36L15.84,31.1a1.93,1.93,0,0,0,2.73,0l9.21-9.21A1.93,1.93,0,0,0,27.78,19.17ZM17.26,29.69,3.69,16.15V7h9.1L26.37,20.48Z"/><path d="M33.16,19.13,19.58,5.55A1.92,1.92,0,0,0,18.21,5H16.12L31.75,20.45,21.22,31.07a1.93,1.93,0,0,0,2.73,0l9.21-9.21a1.93,1.93,0,0,0,0-2.73Z"/>',
  solid: '<path d="M33.16,19.13,19.58,5.55A1.92,1.92,0,0,0,18.21,5H16.12L31.75,20.45,21.22,31.07a1.93,1.93,0,0,0,2.73,0l9.21-9.21a1.93,1.93,0,0,0,0-2.73Z"/><path d="M27.78,19.17,14.2,5.58A1.92,1.92,0,0,0,12.83,5H3.61A1.93,1.93,0,0,0,1.68,6.93v9.22a1.92,1.92,0,0,0,.57,1.36L15.84,31.1a1.93,1.93,0,0,0,2.73,0l9.21-9.21A1.93,1.93,0,0,0,27.78,19.17ZM6.67,11.72A1.73,1.73,0,1,1,8.4,10,1.73,1.73,0,0,1,6.67,11.72Z"/>',
  solidAlerted: '<path d="M20.83,6.8,19.58,5.55A1.92,1.92,0,0,0,18.21,5H16.12L19.79,8.6Z"/><path d="M33.16,19.13,29.43,15.4H26.65l5.1,5L21.22,31.07a1.93,1.93,0,0,0,2.73,0l9.21-9.21a1.93,1.93,0,0,0,0-2.73Z"/><path d="M27.78,19.17,24,15.4H22.23a3.67,3.67,0,0,1-3.36-5.15L14.2,5.58A1.92,1.92,0,0,0,12.83,5H3.61A1.93,1.93,0,0,0,1.68,6.93v9.22a1.92,1.92,0,0,0,.57,1.36L15.84,31.1a1.93,1.93,0,0,0,2.73,0l9.21-9.21A1.93,1.93,0,0,0,27.78,19.17ZM6.67,11.72A1.73,1.73,0,1,1,8.4,10,1.73,1.73,0,0,1,6.67,11.72Z"/>',
  solidBadged: '<path d="M27.78,19.17,14.2,5.58A1.92,1.92,0,0,0,12.83,5H3.61A1.93,1.93,0,0,0,1.68,6.93v9.22a1.92,1.92,0,0,0,.57,1.36L15.84,31.1a1.93,1.93,0,0,0,2.73,0l9.21-9.21A1.93,1.93,0,0,0,27.78,19.17ZM6.67,11.72A1.73,1.73,0,1,1,8.4,10,1.73,1.73,0,0,1,6.67,11.72Z"/><path d="M33.16,19.13,19.58,5.55A1.92,1.92,0,0,0,18.21,5H16.12L31.75,20.45,21.22,31.07a1.93,1.93,0,0,0,2.73,0l9.21-9.21a1.93,1.93,0,0,0,0-2.73Z"/>'
};
var tagsIconName = "tags";
var tagsIcon = [tagsIconName, renderIcon(icon138)];

// node_modules/@clr/core/icon/shapes/target.js
var icon139 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M18,7.2A10.8,10.8,0,1,0,28.8,18,10.81,10.81,0,0,0,18,7.2Zm0,20A9.2,9.2,0,1,1,27.2,18,9.21,9.21,0,0,1,18,27.2Z"/><path d="M18,12.31A5.69,5.69,0,1,0,23.69,18,5.69,5.69,0,0,0,18,12.31Zm0,9.77A4.09,4.09,0,1,1,22.09,18,4.09,4.09,0,0,1,18,22.09Z"/>',
  solid: '<circle cx="18" cy="18" r="4.09"/><path d="M18,7.83A10.17,10.17,0,1,0,28.17,18,10.18,10.18,0,0,0,18,7.83Zm0,16A5.88,5.88,0,1,1,23.88,18,5.88,5.88,0,0,1,18,23.88Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,27.83A11.83,11.83,0,1,1,29.83,18,11.85,11.85,0,0,1,18,29.83Z"/>'
};
var targetIconName = "target";
var targetIcon = [targetIconName, renderIcon(icon139)];

// node_modules/@clr/core/icon/shapes/thermometer.js
var icon140 = {
  outline: '<path d="M19,23.17V11.46H17V23.2a3,3,0,1,0,2,0Z"/><path d="M26,15a1,1,0,0,0,0-2H23.92V11H26a1,1,0,0,0,0-2H23.92V8a6,6,0,0,0-12,0V20.81a8,8,0,1,0,12-.2V19H26a1,1,0,0,0,0-2H23.92V15ZM24,26a6,6,0,1,1-10.36-4.12l.27-.29V8a4,4,0,0,1,8,0V21.44l.3.29A6,6,0,0,1,24,26Z"/>'
};
var thermometerIconName = "thermometer";
var thermometerIcon = [thermometerIconName, renderIcon(icon140)];

// node_modules/@clr/core/icon/shapes/times-circle.js
var icon141 = {
  outline: '<path d="M19.61,18l4.86-4.86a1,1,0,0,0-1.41-1.41L18.2,16.54l-4.89-4.89a1,1,0,0,0-1.41,1.41L16.78,18,12,22.72a1,1,0,1,0,1.41,1.41l4.77-4.77,4.74,4.74a1,1,0,0,0,1.41-1.41Z"/><path d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm8,22.1a1.4,1.4,0,0,1-2,2l-6-6L12,26.12a1.4,1.4,0,1,1-2-2L16,18.08,9.83,11.86a1.4,1.4,0,1,1,2-2L18,16.1l6.17-6.17a1.4,1.4,0,1,1,2,2L20,18.08Z"/>'
};
var timesCircleIconName = "times-circle";
var timesCircleIcon = [timesCircleIconName, renderIcon(icon141)];

// node_modules/@clr/core/icon/shapes/tools.js
var icon142 = {
  outline: '<path d="M20,14H16a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V15A1,1,0,0,0,20,14Zm-.4,6.6H16.4V15.4h3.2Z"/><path d="M33.71,12.38,29.62,8.29A1,1,0,0,0,28.92,8h-5V6.05A2,2,0,0,0,22,4H13.84A1.92,1.92,0,0,0,12,6.05V8H7.08a1,1,0,0,0-.71.29L2.29,12.38a1,1,0,0,0-.29.71V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V13.08A1,1,0,0,0,33.71,12.38ZM14,6h8V8H14ZM32,17H22v1.93H32V28H4V18.93H14V17H4V13.5L7.5,10h21L32,13.5Z"/>',
  solid: '<rect x="16.4" y="15.4" width="3.2" height="5.2"/><path d="M21,21a1,1,0,0,1-1,1H16a1,1,0,0,1-1-1V19H2v9a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19H21Z"/><path d="M33.71,12.38,29.62,8.29A1,1,0,0,0,28.92,8h-5V6.05A2,2,0,0,0,22,4H13.84A1.92,1.92,0,0,0,12,6.05V8H7.08a1,1,0,0,0-.71.29L2.29,12.38a1,1,0,0,0-.29.71V17H15V15a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2H34V13.08A1,1,0,0,0,33.71,12.38ZM22,8H14V6h8Z"/>'
};
var toolsIconName = "tools";
var toolsIcon = [toolsIconName, renderIcon(icon142)];

// node_modules/@clr/core/icon/shapes/trash.js
var icon143 = {
  outline: '<path d="M27.14,34H8.86A2.93,2.93,0,0,1,6,31V11.23H8V31a.93.93,0,0,0,.86,1H27.14A.93.93,0,0,0,28,31V11.23h2V31A2.93,2.93,0,0,1,27.14,34Z"/><path d="M30.78,9H5A1,1,0,0,1,5,7H30.78a1,1,0,0,1,0,2Z"/><rect x="21" y="13" width="2" height="15"/><rect x="13" y="13" width="2" height="15"/><path d="M23,5.86H21.1V4H14.9V5.86H13V4a2,2,0,0,1,1.9-2h6.2A2,2,0,0,1,23,4Z"/>',
  solid: '<path d="M6,9V31a2.93,2.93,0,0,0,2.86,3H27.09A2.93,2.93,0,0,0,30,31V9Zm9,20H13V14h2Zm8,0H21V14h2Z"/><path d="M30.73,5H23V4A2,2,0,0,0,21,2h-6.2A2,2,0,0,0,13,4V5H5A1,1,0,1,0,5,7H30.73a1,1,0,0,0,0-2Z"/>'
};
var trashIconName = "trash";
var trashIcon = [trashIconName, renderIcon(icon143)];

// node_modules/@clr/core/icon/shapes/tree.js
var icon144 = {
  outline: '<path d="M30.6,11.7C29.2,5.8,24,1.7,18,1.7c-7.2,0-13,5.8-13,13c0,6.8,5.3,12.4,12,12.9v5c0,0.6,0.4,1,1,1s1-0.4,1-1v-5v-2V22c0,0,0,0,0-0.1v-3.6l4.7-4.7c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L19,15.6v-3l-3.3-3.3c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4l2.7,2.7v6.2l-3.8-3.8c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4l5.2,5.2v3.2c-5.6-0.5-10-5.2-10-10.9c0-6.1,4.9-11,11-11s11,4.9,11,11c0,4.9-3.3,9.2-8,10.6v2.1C28,25.7,32.3,18.7,30.6,11.7z"/>',
  solid: '<path d="M18,2C10.8,1.7,4.8,7.3,4.5,14.5C4.2,21.7,9.8,27.7,17,28v-5.2l-5.2-5.2c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0c0,0,0,0,0,0l3.8,3.8v-6.2l-2.7-2.7c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0c0,0,0,0,0,0l3.3,3.3v3l3.3-3.3c0.4-0.4,1-0.4,1.4,0c0,0,0,0,0,0c0.4,0.4,0.4,1,0,1.4L19,18.8V28c7.2-0.3,12.8-6.3,12.5-13.5S25.2,1.7,18,2z"/><path d="M18,28c-0.3,0-0.6,0-1,0v5c0,0.6,0.4,1,1,1s1-0.4,1-1v-5C18.7,28,18.3,28,18,28z"/>'
};
var treeIconName = "tree";
var treeIcon = [treeIconName, renderIcon(icon144)];

// node_modules/@clr/core/icon/shapes/tree-view.js
var icon145 = {
  outline: '<path d="M15,32H11a1,1,0,0,1-1-1V27a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,15,32Zm-3-2h2V28H12Z"/><path d="M15,16H11a1,1,0,0,0-1,1v1.2H5.8V12H7a1,1,0,0,0,1-1V7A1,1,0,0,0,7,6H3A1,1,0,0,0,2,7v4a1,1,0,0,0,1,1H4.2V29.8h6.36a.8.8,0,0,0,0-1.6H5.8V19.8H10V21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V17A1,1,0,0,0,15,16ZM4,8H6v2H4ZM14,20H12V18h2Z"/><path d="M34,9a1,1,0,0,0-1-1H10v2H33A1,1,0,0,0,34,9Z"/><path d="M33,18H18v2H33a1,1,0,0,0,0-2Z"/><path d="M33,28H18v2H33a1,1,0,0,0,0-2Z"/>',
  solid: '<rect x="10" y="26" width="6" height="6" rx="1" ry="1"/><path d="M15,16H11a1,1,0,0,0-1,1v1.2H5.8V12H7a1,1,0,0,0,1-1V7A1,1,0,0,0,7,6H3A1,1,0,0,0,2,7v4a1,1,0,0,0,1,1H4.2V29.8H11a.8.8,0,1,0,0-1.6H5.8V19.8H10V21a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V17A1,1,0,0,0,15,16Z"/><path d="M33,8H10v2H33a1,1,0,0,0,0-2Z"/><path d="M33,18H18v2H33a1,1,0,0,0,0-2Z"/><path d="M33,28H18v2H33a1,1,0,0,0,0-2Z"/>'
};
var treeViewIconName = "tree-view";
var treeViewIcon = [treeViewIconName, renderIcon(icon145)];

// node_modules/@clr/core/icon/shapes/two-way-arrows.js
var icon146 = {
  outline: '<path d="M23.43,16.83A1,1,0,0,0,22,18.24L25.72,22H7.83a1,1,0,0,0,0,2H25.72L22,27.7a1,1,0,1,0,1.42,1.41L29.53,23Z"/><path d="M13.24,18.45a1,1,0,0,0,.71-1.71L10.24,13H28.12a1,1,0,0,0,0-2H10.24l3.71-3.73a1,1,0,0,0-1.42-1.41L6.42,12l6.11,6.14A1,1,0,0,0,13.24,18.45Z"/>'
};
var twoWayArrowsIconName = "two-way-arrows";
var twoWayArrowsIcon = [twoWayArrowsIconName, renderIcon(icon146)];

// node_modules/@clr/core/icon/shapes/undo.js
var icon147 = {
  outline: '<path d="M20.87,11.14h-13l5.56-5.49A1,1,0,0,0,12,4.22L4,12.13,12,20a1,1,0,0,0,1.41-1.42L7.86,13.14h13a9.08,9.08,0,0,1,9.13,9,9,9,0,0,1-5,8A1,1,0,0,0,25.93,32a11,11,0,0,0-5.06-20.82Z"/>'
};
var undoIconName = "undo";
var undoIcon = [undoIconName, renderIcon(icon147)];

// node_modules/@clr/core/icon/shapes/unlock.js
var icon148 = {
  outline: '<path d="M12,25.14V28h2V25.23a2.42,2.42,0,1,0-2-.09Z"/><path d="M26,2a8.2,8.2,0,0,0-8,8.36V15H2V32a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V15H20V10.36A6.2,6.2,0,0,1,26,4a6.2,6.2,0,0,1,6,6.36v6.83a1,1,0,0,0,2,0V10.36A8.2,8.2,0,0,0,26,2ZM22,17V32H4V17Z"/>',
  solid: '<path d="M26,2a8.2,8.2,0,0,0-8,8.36V15H2V32a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V15H20V10.36A6.2,6.2,0,0,1,26,4a6.2,6.2,0,0,1,6,6.36v6.83a1,1,0,0,0,2,0V10.36A8.2,8.2,0,0,0,26,2ZM14,25.23V28H12V25.14a2.4,2.4,0,1,1,2,.09Z"/>'
};
var unlockIconName = "unlock";
var unlockIcon = [unlockIconName, renderIcon(icon148)];

// node_modules/@clr/core/icon/shapes/upload.js
var icon149 = {
  outline: '<path d="M31,31H5a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><path d="M8.81,15,17,6.83V27.48a1,1,0,0,0,2,0V6.83L27.19,15a1,1,0,0,0,1.41-1.41L18,3,7.39,13.61A1,1,0,1,0,8.81,15Z"/>',
  outlineAlerted: '<path d="M31,31H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h26c0.6,0,1-0.4,1-1S31.6,31,31,31z"/><path d="M8.8,15L17,6.8v20.6c0,0.6,0.4,1,1,1s1-0.4,1-1V6.8L20.1,8l1-1.8L18,3L7.4,13.6C7,14,6.9,14.6,7.2,15s1,0.5,1.4,0.1C8.7,15.1,8.8,15.1,8.8,15z"/>',
  outlineBadged: '<path d="M31,31H5a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><path d="M8.81,15,17,6.83V27.48a1,1,0,0,0,2,0V6.83L27.19,15a1,1,0,0,0,1.41-1.41L18,3,7.39,13.61A1,1,0,1,0,8.81,15Z"/>'
};
var uploadIconName = "upload";
var uploadIcon = [uploadIconName, renderIcon(icon149)];

// node_modules/@clr/core/icon/shapes/users.js
var icon150 = {
  outline: '<path d="M17.9,17.3c2.7,0,4.8-2.2,4.8-4.9c0-2.7-2.2-4.8-4.9-4.8c-2.7,0-4.8,2.2-4.8,4.8C13,15.1,15.2,17.3,17.9,17.3z M17.8,9.6C17.9,9.6,17.9,9.6,17.8,9.6c1.6,0,2.9,1.3,2.9,2.9s-1.3,2.8-2.9,2.8c-1.6,0-2.8-1.3-2.8-2.8C15,10.9,16.3,9.6,17.8,9.6z"/><path d="M32.7,16.7c-1.9-1.7-4.4-2.6-7-2.5c-0.3,0-0.5,0-0.8,0c-0.2,0.8-0.5,1.5-0.9,2.1c0.6-0.1,1.1-0.1,1.7-0.1c1.9-0.1,3.8,0.5,5.3,1.6V25h2v-8L32.7,16.7z"/><path d="M23.4,7.8c0.5-1.2,1.9-1.8,3.2-1.3c1.2,0.5,1.8,1.9,1.3,3.2c-0.4,0.9-1.3,1.5-2.2,1.5c-0.2,0-0.5,0-0.7-0.1c0.1,0.5,0.1,1,0.1,1.4c0,0.2,0,0.4,0,0.6c0.2,0,0.4,0.1,0.6,0.1c2.5,0,4.5-2,4.5-4.4c0-2.5-2-4.5-4.4-4.5c-1.6,0-3,0.8-3.8,2.2C22.5,6.8,23,7.2,23.4,7.8z"/><path d="M12,16.4c-0.4-0.6-0.7-1.3-0.9-2.1c-0.3,0-0.5,0-0.8,0c-2.6-0.1-5.1,0.8-7,2.4L3,17v8h2v-7.2c1.6-1.1,3.4-1.7,5.3-1.6C10.9,16.2,11.5,16.3,12,16.4z"/><path d="M10.3,13.1c0.2,0,0.4,0,0.6-0.1c0-0.2,0-0.4,0-0.6c0-0.5,0-1,0.1-1.4c-0.2,0.1-0.5,0.1-0.7,0.1c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4c1,0,1.9,0.6,2.3,1.5c0.4-0.5,1-1,1.5-1.4c-1.3-2.1-4-2.8-6.1-1.5c-2.1,1.3-2.8,4-1.5,6.1C7.3,12.3,8.7,13.1,10.3,13.1z"/><path d="M26.1,22.7l-0.2-0.3c-2-2.2-4.8-3.5-7.8-3.4c-3-0.1-5.9,1.2-7.9,3.4L10,22.7v7.6c0,0.9,0.7,1.7,1.7,1.7c0,0,0,0,0,0h12.8c0.9,0,1.7-0.8,1.7-1.7c0,0,0,0,0,0V22.7z M24.1,30H12v-6.6c1.6-1.6,3.8-2.4,6.1-2.4c2.2-0.1,4.4,0.8,6,2.4V30z"/>',
  outlineAlerted: '<path d="M11.09,14.57c.1,0,.2,0,.31,0a6.43,6.43,0,0,1,.09-2,2.09,2.09,0,1,1,1.47-3,6.58,6.58,0,0,1,1.55-1.31,4.09,4.09,0,1,0-3.42,6.33Z"/><path d="M13,18.14a6.53,6.53,0,0,1-1.28-2.2l-.63,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v7h2V19.51a7,7,0,0,1,4.67-1.6A8.09,8.09,0,0,1,13,18.14Z"/><path d="M31.35,18.42A8.59,8.59,0,0,0,25,15.91c-.32,0-.6,0-.9.06a6.53,6.53,0,0,1-1.35,2.25A7.9,7.9,0,0,1,25,17.91a6.94,6.94,0,0,1,4.64,1.58v6.27h2V18.7Z"/><path d="M18.1,19.73A9.69,9.69,0,0,0,11,22.47l-.25.28v7.33a1.57,1.57,0,0,0,1.61,1.54H23.83a1.57,1.57,0,0,0,1.61-1.54V22.73l-.25-.28A9.58,9.58,0,0,0,18.1,19.73Zm5.33,9.88H12.73V23.55a8.08,8.08,0,0,1,5.37-1.82,8,8,0,0,1,5.33,1.8Z"/><path d="M20.28,14.27a2.46,2.46,0,1,1-2.42-2.89,2.44,2.44,0,0,1,1,.24,3.67,3.67,0,0,1,.43-2,4.41,4.41,0,0,0-1.48-.27A4.47,4.47,0,1,0,22.14,15,3.69,3.69,0,0,1,20.28,14.27Z"/>',
  outlineBadged: '<path d="M11.09,14.57c.1,0,.2,0,.31,0a6.43,6.43,0,0,1,.09-2,2.09,2.09,0,1,1,1.47-3,6.58,6.58,0,0,1,1.55-1.31,4.09,4.09,0,1,0-3.42,6.33Z"/><path d="M13,18.14a6.53,6.53,0,0,1-1.28-2.2l-.63,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v7h2V19.51a7,7,0,0,1,4.67-1.6A8.09,8.09,0,0,1,13,18.14Z"/><path d="M31.35,18.42A8.59,8.59,0,0,0,25,15.91c-.32,0-.6,0-.9.06a6.53,6.53,0,0,1-1.35,2.25A7.9,7.9,0,0,1,25,17.91a6.94,6.94,0,0,1,4.64,1.58v6.27h2V18.7Z"/><path d="M17.86,18.3a4.47,4.47,0,1,0-4.47-4.47A4.47,4.47,0,0,0,17.86,18.3Zm0-6.93a2.47,2.47,0,1,1-2.47,2.47A2.47,2.47,0,0,1,17.86,11.37Z"/><path d="M18.1,19.73A9.69,9.69,0,0,0,11,22.47l-.25.28v7.33a1.57,1.57,0,0,0,1.61,1.54H23.83a1.57,1.57,0,0,0,1.61-1.54V22.73l-.25-.28A9.58,9.58,0,0,0,18.1,19.73Zm5.33,9.88H12.73V23.55a8.08,8.08,0,0,1,5.37-1.82,8,8,0,0,1,5.33,1.8Z"/><path d="M26.37,12a2,2,0,0,1-2.09.42,6.53,6.53,0,0,1,.15,1.38,6.59,6.59,0,0,1,0,.68,4,4,0,0,0,.57.06,4.08,4.08,0,0,0,3.3-1.7A7.45,7.45,0,0,1,26.37,12Z"/><path d="M22.95,6.93a4.16,4.16,0,0,0-1.47,1.44A6.59,6.59,0,0,1,23,9.77a2.1,2.1,0,0,1,.59-.83A7.44,7.44,0,0,1,22.95,6.93Z"/>',
  solid: '<path d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z"/><path d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z"/><path d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z"/><path d="M24.43,13.44a6.54,6.54,0,0,1,0,.69,4.09,4.09,0,0,0,.58.05h.19A4.09,4.09,0,1,0,21.47,8,6.53,6.53,0,0,1,24.43,13.44Z"/><circle cx="17.87" cy="13.45" r="4.47"/><path d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z"/>',
  solidAlerted: '<path d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z"/><path d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z"/><path d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z"/><path d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z"/><path d="M17.87,17.92a4.46,4.46,0,0,0,4-2.54A3.67,3.67,0,0,1,19,9.89l.35-.61A4.42,4.42,0,0,0,17.87,9a4.47,4.47,0,1,0,0,8.93Z"/>',
  solidBadged: '<path d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.58,6.58,0,0,1,12,16.14Z"/><path d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z"/><path d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z"/><circle cx="17.87" cy="13.45" r="4.47"/><path d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z"/><path d="M24.43,13.44a6.54,6.54,0,0,1,0,.69,4.09,4.09,0,0,0,.58.05h.19a4.05,4.05,0,0,0,2.52-1,7.5,7.5,0,0,1-5.14-6.32A4.13,4.13,0,0,0,21.47,8,6.53,6.53,0,0,1,24.43,13.44Z"/>'
};
var usersIconName = "users";
var usersIcon = [usersIconName, renderIcon(icon150)];

// node_modules/@clr/core/icon/shapes/view-cards.js
var icon151 = {
  outline: '<path d="M15,17H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,17ZM4,8v7H15V8Z"/><path d="M32,17H21a2,2,0,0,1-2-2V8a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2v7A2,2,0,0,1,32,17ZM21,8v7H32V8Z"/><path d="M15,30H4a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,30ZM4,21v7H15V21Z"/><path d="M32,30H21a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2v7A2,2,0,0,1,32,30ZM21,21v7H32V21Z"/>'
};
var viewCardsIconName = "view-cards";
var viewCardsIcon = [viewCardsIconName, renderIcon(icon151)];

// node_modules/@clr/core/icon/shapes/view-list.js
var icon152 = {
  outline: '<rect x="2" y="8" width="2" height="2"/><path d="M7,10H31a1,1,0,0,0,0-2H7a1,1,0,0,0,0,2Z"/><rect x="2" y="14" width="2" height="2"/><path d="M31,14H7a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><rect x="2" y="20" width="2" height="2"/><path d="M31,20H7a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/><rect x="2" y="26" width="2" height="2"/><path d="M31,26H7a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"/>'
};
var viewListIconName = "view-list";
var viewListIcon = [viewListIconName, renderIcon(icon152)];

// node_modules/@clr/core/icon/shapes/volume.js
var icon153 = {
  outline: '<path d="M25.88,32H12a4,4,0,0,1-4-4V11.46L2.31,5.77a1,1,0,0,1-.22-1.09A1,1,0,0,1,3,4.06H28.86a1,1,0,0,1,1,1V28A4,4,0,0,1,25.88,32ZM5.43,6l4.28,4.34a.75.75,0,0,1,.21.63v17A2.13,2.13,0,0,0,12,30H25.88A2.1,2.1,0,0,0,28,28V6Z"/><path d="M33,16a1,1,0,0,1-1-1V6H28.86a.92.92,0,0,1-1-.9,1,1,0,0,1,1-1H33a1,1,0,0,1,1,1V15A1,1,0,0,1,33,16Z"/><path d="M24,11H18a1,1,0,1,1,0-2H24a1,1,0,1,1,0,2Z"/><path d="M24,15H21a1,1,0,1,1,0-2H24a1,1,0,1,1,0,2Z"/><path d="M24,19H18a1,1,0,1,1,0-2H24a1,1,0,1,1,0,2Z"/><path d="M24,27H18a1,1,0,1,1,0-2H24a1,1,0,1,1,0,2Z"/><path d="M24,23H21A1,1,0,1,1,21,21H24A1,1,0,1,1,24,23Z"/>'
};
var volumeIconName = "volume";
var volumeIcon = [volumeIconName, renderIcon(icon153)];

// node_modules/@clr/core/icon/shapes/wand.js
var icon154 = {
  outline: '<path d="M34.1,4,31.71,1.6a1.83,1.83,0,0,0-1.31-.54h0a2.05,2.05,0,0,0-1.45.62L1.76,29.23A2,2,0,0,0,1.68,32l2.4,2.43A1.83,1.83,0,0,0,5.39,35h0a2.05,2.05,0,0,0,1.45-.62L34,6.79A2,2,0,0,0,34.1,4ZM5.42,32.93,3.16,30.65h0L24.11,9.43l2.25,2.28ZM32.61,5.39l-5.12,5.18L25.24,8.29l5.13-5.2,2.25,2.28Z"/><path d="M32.53,20.47l2.09-2.09a.8.8,0,0,0-1.13-1.13l-2.09,2.09-2.09-2.09a.8.8,0,0,0-1.13,1.13l2.09,2.09-2.09,2.09a.8.8,0,0,0,1.13,1.13l2.09-2.09,2.09,2.09a.8.8,0,0,0,1.13-1.13Z"/><path d="M14.78,6.51a.8.8,0,0,0,1.13,0L17.4,5l1.49,1.49A.8.8,0,0,0,20,5.38L18.54,3.89,20,2.4a.8.8,0,0,0-1.13-1.13L17.4,2.76,15.91,1.27A.8.8,0,1,0,14.78,2.4l1.49,1.49L14.78,5.38A.8.8,0,0,0,14.78,6.51Z"/><path d="M8.33,15.26a.8.8,0,0,0,1.13,0l1.16-1.16,1.16,1.16a.8.8,0,1,0,1.13-1.13L11.76,13l1.16-1.16a.8.8,0,1,0-1.13-1.13l-1.16,1.16L9.46,10.68a.8.8,0,1,0-1.13,1.13L9.49,13,8.33,14.13A.8.8,0,0,0,8.33,15.26Z"/>'
};
var wandIconName = "wand";
var wandIcon = [wandIconName, renderIcon(icon154)];

// node_modules/@clr/core/icon/shapes/window-close.js
var icon155 = {
  outline: '<path d="M19.41,18l7.29-7.29a1,1,0,0,0-1.41-1.41L18,16.59,10.71,9.29a1,1,0,0,0-1.41,1.41L16.59,18,9.29,25.29a1,1,0,1,0,1.41,1.41L18,19.41l7.29,7.29a1,1,0,0,0,1.41-1.41Z"/>'
};
var windowCloseIconName = "window-close";
var windowCloseIcon = [windowCloseIconName, renderIcon(icon155)];

// node_modules/@clr/core/icon/shapes/window-max.js
var icon156 = {
  outline: '<path d="M27.89,9h-20a2,2,0,0,0-2,2V25a2,2,0,0,0,2,2h20a2,2,0,0,0,2-2V11A2,2,0,0,0,27.89,9Zm-20,16V11h20V25Z"/>'
};
var windowMaxIconName = "window-max";
var windowMaxIcon = [windowMaxIconName, renderIcon(icon156)];

// node_modules/@clr/core/icon/shapes/window-min.js
var icon157 = {
  outline: '<path d="M27,27H9a1,1,0,0,1,0-2H27a1,1,0,0,1,0,2Z"/>'
};
var windowMinIconName = "window-min";
var windowMinIcon = [windowMinIconName, renderIcon(icon157)];

// node_modules/@clr/core/icon/shapes/window-restore.js
var icon158 = {
  outline: '<path d="M28,8H14a2,2,0,0,0-2,2v2h2V10H28V20H26v2h2a2,2,0,0,0,2-2V10A2,2,0,0,0,28,8Z"/><path d="M22,14H8a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V16A2,2,0,0,0,22,14ZM8,26V16H22V26Z"/>'
};
var windowRestoreIconName = "window-restore";
var windowRestoreIcon = [windowRestoreIconName, renderIcon(icon158)];

// node_modules/@clr/core/icon/shapes/world.js
var icon159 = {
  outline: '<path d="M26.54,18a19.38,19.38,0,0,0-.43-4h3.6a12.3,12.3,0,0,0-.67-1.6H25.69A19.72,19.72,0,0,0,22.8,6.53a12.3,12.3,0,0,0-2.55-.76,17.83,17.83,0,0,1,3.89,6.59H18.75V5.6c-.25,0-.51,0-.77,0s-.49,0-.73,0v6.77H11.86a17.83,17.83,0,0,1,3.9-6.6,12.28,12.28,0,0,0-2.54.75,19.72,19.72,0,0,0-2.91,5.85H6.94A12.3,12.3,0,0,0,6.26,14H9.89a19.38,19.38,0,0,0-.43,4,19.67,19.67,0,0,0,.5,4.37H6.42A12.34,12.34,0,0,0,7.16,24h3.23a19.32,19.32,0,0,0,2.69,5.36,12.28,12.28,0,0,0,2.61.79A17.91,17.91,0,0,1,12,24h5.26v6.34c.24,0,.49,0,.73,0s.51,0,.77,0V24H24a17.9,17.9,0,0,1-3.7,6.15,12.28,12.28,0,0,0,2.62-.81A19.32,19.32,0,0,0,25.61,24h3.2a12.34,12.34,0,0,0,.74-1.6H26A19.67,19.67,0,0,0,26.54,18Zm-9.29,4.37H11.51a17.69,17.69,0,0,1-.09-8.4h5.83Zm7.24,0H18.75V14h5.83A18.21,18.21,0,0,1,25,18,18.12,18.12,0,0,1,24.49,22.37Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/>',
  outlineBadged: '<path d="M33.12,12.81a7.44,7.44,0,0,1-1.91.58,14.05,14.05,0,1,1-8.6-8.6,7.43,7.43,0,0,1,.58-1.91,16.06,16.06,0,1,0,9.93,9.93Z"/><path d="M20.25,5.77a17.83,17.83,0,0,1,3.89,6.59H18.75V5.6c-.25,0-.51,0-.77,0s-.49,0-.73,0v6.77H11.86a17.83,17.83,0,0,1,3.9-6.6,12.28,12.28,0,0,0-2.54.75,19.72,19.72,0,0,0-2.91,5.85H6.94A12.3,12.3,0,0,0,6.26,14H9.89a19.38,19.38,0,0,0-.43,4,19.67,19.67,0,0,0,.5,4.37H6.42A12.34,12.34,0,0,0,7.16,24h3.23a19.32,19.32,0,0,0,2.69,5.36,12.28,12.28,0,0,0,2.61.79A17.91,17.91,0,0,1,12,24h5.26v6.34c.24,0,.49,0,.73,0s.51,0,.77,0V24H24a17.9,17.9,0,0,1-3.7,6.15,12.28,12.28,0,0,0,2.62-.81A19.32,19.32,0,0,0,25.61,24h3.2a12.34,12.34,0,0,0,.74-1.6H26a19.67,19.67,0,0,0,.5-4.37,19.38,19.38,0,0,0-.43-4h3.6c-.06-.17-.12-.33-.19-.49a7.45,7.45,0,0,1-3.47-1.11h-.36c0-.11-.08-.21-.11-.32a7.48,7.48,0,0,1-3.06-5.62A12.41,12.41,0,0,0,20.25,5.77Zm-3,16.59H11.51a17.69,17.69,0,0,1-.09-8.4h5.83ZM25,18a18.12,18.12,0,0,1-.55,4.37H18.75V14h5.83A18.21,18.21,0,0,1,25,18Z"/>',
  solid: '<path d="M10.05,18a20.46,20.46,0,0,0,.62,4.93h6.48V13.45H10.58A20.55,20.55,0,0,0,10.05,18Z"/><path d="M18.85,13.45v9.48h6.48A20.46,20.46,0,0,0,26,18a20.55,20.55,0,0,0-.52-4.55Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM30.22,24.71H26.6a21.8,21.8,0,0,1-3,6,13.86,13.86,0,0,1-3,.92,20.21,20.21,0,0,0,4.18-6.94H18.86v7.15c-.29,0-.57,0-.86,0s-.55,0-.83,0V24.71H11.22a20.21,20.21,0,0,0,4.18,6.95,13.86,13.86,0,0,1-2.94-.9,21.8,21.8,0,0,1-3-6.05H5.78a13.94,13.94,0,0,1-.83-1.81h4A22.2,22.2,0,0,1,8.37,18a21.88,21.88,0,0,1,.48-4.55H4.76a13.88,13.88,0,0,1,.76-1.81H9.33A22.26,22.26,0,0,1,12.61,5a13.86,13.86,0,0,1,2.87-.84,20.13,20.13,0,0,0-4.4,7.45h6.09V4c.28,0,.55,0,.83,0s.58,0,.86,0v7.64h6.09a20.13,20.13,0,0,0-4.39-7.44A13.89,13.89,0,0,1,23.43,5a22.26,22.26,0,0,1,3.27,6.59h3.77a13.89,13.89,0,0,1,.76,1.81H27.17A21.88,21.88,0,0,1,27.66,18a22.2,22.2,0,0,1-.57,4.93h4A13.94,13.94,0,0,1,30.22,24.71Z"/>',
  solidBadged: '<path d="M10.05,18a20.46,20.46,0,0,0,.62,4.93h6.48V13.45H10.58A20.55,20.55,0,0,0,10.05,18Z"/><path d="M18.85,22.94h6.48A20.46,20.46,0,0,0,26,18a20.55,20.55,0,0,0-.52-4.55H18.85Z"/><path d="M33.12,12.81a7.44,7.44,0,0,1-1.9.58v0H31a6.77,6.77,0,0,1-2.07,0h-1.8A21.88,21.88,0,0,1,27.66,18a22.2,22.2,0,0,1-.57,4.93h4a13.94,13.94,0,0,1-.83,1.81H26.6a21.8,21.8,0,0,1-3,6,13.86,13.86,0,0,1-3,.92,20.21,20.21,0,0,0,4.18-6.94H18.86v7.15c-.29,0-.57,0-.86,0s-.55,0-.83,0V24.71H11.22a20.21,20.21,0,0,0,4.18,6.95,13.86,13.86,0,0,1-2.94-.9,21.8,21.8,0,0,1-3-6.05H5.78a13.94,13.94,0,0,1-.83-1.81h4A22.2,22.2,0,0,1,8.37,18a21.88,21.88,0,0,1,.48-4.55H4.76a13.88,13.88,0,0,1,.76-1.81H9.33A22.26,22.26,0,0,1,12.61,5a13.86,13.86,0,0,1,2.87-.84,20.13,20.13,0,0,0-4.4,7.45h6.09V4c.28,0,.55,0,.83,0s.58,0,.86,0v7.64h6.09l0-.13a7.47,7.47,0,0,1-2.36-4.76,20.37,20.37,0,0,0-2-2.55,14.23,14.23,0,0,1,2.06.56,7.44,7.44,0,0,1,.57-1.86,16.06,16.06,0,1,0,9.93,9.93Z"/>'
};
var worldIconName = "world";
var worldIcon = [worldIconName, renderIcon(icon159)];

// node_modules/@clr/core/icon/shapes/wrench.js
var icon160 = {
  outline: '<path d="M33.18,26.11,20.35,13.28A9.28,9.28,0,0,0,7.54,2.79l-1.34.59,5.38,5.38L8.76,11.59,3.38,6.21,2.79,7.54A9.27,9.27,0,0,0,13.28,20.35L26.11,33.18a2,2,0,0,0,2.83,0l4.24-4.24A2,2,0,0,0,33.18,26.11Zm-5.66,5.66L13.88,18.12l-.57.16a7.27,7.27,0,0,1-9.31-7,7.2,7.2,0,0,1,.15-1.48l4.61,4.61,5.66-5.66L9.81,4.15a7.27,7.27,0,0,1,8.47,9.16l-.16.57L31.77,27.53Z"/><circle cx="27.13" cy="27.09" r="1.3" transform="translate(-11.21 27.12) rotate(-45)"/>',
  solid: '<path d="M33.73,27.72,19.67,13.66a8.79,8.79,0,0,0-12-10.5L13,8.53,8.53,13,3.16,7.67a8.79,8.79,0,0,0,10.5,12L27.72,33.73a1.07,1.07,0,0,0,1.5,0l4.51-4.51A1.07,1.07,0,0,0,33.73,27.72ZM29,29a1.38,1.38,0,1,1,0-2A1.38,1.38,0,0,1,29,29Z"/>'
};
var wrenchIconName = "wrench";
var wrenchIcon = [wrenchIconName, renderIcon(icon160)];

// node_modules/@clr/core/icon/shapes/zoom-in.js
var icon161 = {
  outline: '<path d="M16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Zm0,21.91A10,10,0,1,1,26,16,10,10,0,0,1,16,25.91Z"/><path d="M31.71,29.69l-5.17-5.17A13.68,13.68,0,0,1,25.15,26l5.15,5.15a1,1,0,0,0,1.41-1.41Z"/><path d="M21,15H17V11a1,1,0,0,0-2,0v4H11a1,1,0,0,0,0,2h4v4a1,1,0,0,0,2,0V17h4a1,1,0,0,0,0-2Z"/>'
};
var zoomInIconName = "zoom-in";
var zoomInIcon = [zoomInIconName, renderIcon(icon161)];

// node_modules/@clr/core/icon/shapes/zoom-out.js
var icon162 = {
  outline: '<path d="M16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Zm0,21.91A10,10,0,1,1,26,16,10,10,0,0,1,16,25.91Z"/><path d="M31.71,29.69l-5.17-5.17A13.68,13.68,0,0,1,25.15,26l5.15,5.15a1,1,0,0,0,1.41-1.41Z"/><path d="M20,15H12a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"/>'
};
var zoomOutIconName = "zoom-out";
var zoomOutIcon = [zoomOutIconName, renderIcon(icon162)];

// node_modules/@clr/core/icon/shapes/axis-chart.js
var icon163 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 6.007 26.731 L 27.73 26.73 C 28.49 26.67 28.91 25.8 28.47 25.17 C 28.3 24.92 28.03 24.76 27.73 24.74 L 8.001 24.736 L 8.01 11.01 C 8.01 10.23 7.17 9.75 6.5 10.14 C 6.19 10.31 6 10.65 6 11.01 L 6.007 26.731 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 6.007 26.731 L 27.73 26.73 C 28.49 26.67 28.91 25.8 28.47 25.17 C 28.3 24.92 28.03 24.76 27.73 24.74 L 8.001 24.736 L 8.01 11.01 C 8.01 10.23 7.17 9.75 6.5 10.14 C 6.19 10.31 6 10.65 6 11.01 L 6.007 26.731 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 6.007 26.731 L 27.73 26.73 C 28.49 26.67 28.91 25.8 28.47 25.17 C 28.3 24.92 28.03 24.76 27.73 24.74 L 8.001 24.736 L 8.01 11.01 C 8.01 10.23 7.17 9.75 6.5 10.14 C 6.19 10.31 6 10.65 6 11.01 L 6.007 26.731 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 6.007 26.731 L 27.73 26.73 C 28.49 26.67 28.91 25.8 28.47 25.17 C 28.3 24.92 28.03 24.76 27.73 24.74 L 8.001 24.736 L 8.01 11.01 C 8.01 10.23 7.17 9.75 6.5 10.14 C 6.19 10.31 6 10.65 6 11.01 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 34 15.357 Z M 6.007 26.731 L 27.73 26.73 C 28.49 26.67 28.91 25.8 28.47 25.17 C 28.3 24.92 28.03 24.76 27.73 24.74 L 8.001 24.736 L 8.01 11.01 C 8.01 10.23 7.17 9.75 6.5 10.14 C 6.19 10.31 6 10.65 6 11.01 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 6.007 26.731 L 27.73 26.73 C 28.49 26.67 28.91 25.8 28.47 25.17 C 28.3 24.92 28.03 24.76 27.73 24.74 L 8.001 24.736 L 8.01 11.01 C 8.01 10.23 7.17 9.75 6.5 10.14 C 6.19 10.31 6 10.65 6 11.01 Z"/>'
};
var axisChartIconName = "axis-chart";
var axisChartIcon = [axisChartIconName, renderIcon(icon163)];

// node_modules/@clr/core/icon/shapes/bar-chart.js
var icon164 = {
  outline: '<path d="M32,5H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V7A2,2,0,0,0,32,5ZM4,29V7H32V29Z"/><path d="M 7 10 L 13 10 L 13 26 L 11.4 26 L 11.4 11.6 L 8.6 11.6 L 8.6 26 L 7 26 Z"/><path d="M 15 19 L 21 19 L 21 26 L 19.4 26 L 19.4 20.6 L 16.6 20.6 L 16.6 26 L 15 26 Z"/><path d="M 23 16 L 29 16 L 29 26 L 27.4 26 L 27.4 17.6 L 24.6 17.6 L 24.6 26 L 23 26 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 7 10 L 13 10 L 13 26 L 11.4 26 L 11.4 11.6 L 8.6 11.6 L 8.6 26 L 7 26 Z"/><path d="M 15 19 L 21 19 L 21 26 L 19.4 26 L 19.4 20.6 L 16.6 20.6 L 16.6 26 L 15 26 Z"/><path d="M 23 16 L 29 16 L 29 26 L 27.4 26 L 27.4 17.6 L 24.6 17.6 L 24.6 26 L 23 26 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.105 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 7 10 L 13 10 L 13 26 L 11.4 26 L 11.4 11.6 L 8.6 11.6 L 8.6 26 L 7 26 Z"/><path d="M 15 19 L 21 19 L 21 26 L 19.4 26 L 19.4 20.6 L 16.6 20.6 L 16.6 26 L 15 26 Z"/><path d="M 23 16 L 29 16 L 29 26 L 27.4 26 L 27.4 17.6 L 24.6 17.6 L 24.6 26 L 23 26 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 32 5 C 33.105 5 34 5.895 34 7 Z M 7 26 L 13 26 L 13 10 L 7 10 Z M 15 26 L 21 26 L 21 19 L 15 19 Z M 23 26 L 29 26 L 29 16 L 23 16 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 34 15.357 Z M 7 26 L 13 26 L 13 10 L 7 10 Z M 15 26 L 21 26 L 21 19 L 15 19 Z M 23 26 L 29 26 L 29 16 L 23 16 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.625 13.429 32.895 13.036 34 12.34 Z M 7 26 L 13 26 L 13 10 L 7 10 Z M 15 26 L 21 26 L 21 19 L 15 19 Z M 23 26 L 29 26 L 29 16 L 23 16 Z"/>'
};
var barChartIconName = "bar-chart";
var barChartIcon = [barChartIconName, renderIcon(icon164)];

// node_modules/@clr/core/icon/shapes/bell-curve.js
var icon165 = {
  outline: '<path d="M33,29H3A1,1,0,1,1,3,27H33A1,1,0,1,1,33,29Z"/><path d="M33,25h-.62a8.11,8.11,0,0,1-8-6.67C23.62,14.44,21.89,7.94,18,7.94s-5.69,6.51-6.38,10.39a8.11,8.11,0,0,1-8,6.65H3a1,1,0,1,1,0-2h.6A6.11,6.11,0,0,0,9.6,18c1.41-7.88,4.3-12,8.35-12s6.93,4.16,8.33,12a6.11,6.11,0,0,0,6,5H33a1,1,0,0,1,0,2Z"/>'
};
var bellCurveIconName = "bell-curve";
var bellCurveIcon = [bellCurveIconName, renderIcon(icon165)];

// node_modules/@clr/core/icon/shapes/box-plot.js
var icon166 = {
  outline: '<path d="M32,5H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V7A2,2,0,0,0,32,5ZM4,29V7H32V29Z"/><path d="M 7 12 L 17 12 L 17 26 L 7 26 L 7 12 Z M 8.6 24.4 L 15.4 24.4 L 15.4 18.8 L 8.6 18.8 L 8.6 24.4 Z M 15.4 13.6 L 8.6 13.6 L 8.6 17.2 L 15.4 17.2 L 15.4 13.6 Z"/><path d="M 19 24 L 29 24 L 29 10 L 19 10 L 19 24 Z M 20.6 11.6 L 27.4 11.6 L 27.4 17.2 L 20.6 17.2 L 20.6 11.6 Z M 27.4 22.4 L 20.6 22.4 L 20.6 18.8 L 27.4 18.8 L 27.4 22.4 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 7 12 L 17 12 L 17 26 L 7 26 L 7 12 Z M 8.6 24.4 L 15.4 24.4 L 15.4 18.8 L 8.6 18.8 L 8.6 24.4 Z M 15.4 13.6 L 8.6 13.6 L 8.6 17.2 L 15.4 17.2 L 15.4 13.6 Z"/><path d="M 29 24 L 19 24 L 19 15.345 C 19.021 15.348 20.6 15.36 20.6 15.36 L 20.6 17.2 L 27.4 17.2 L 27.4 15.36 L 29 15.357 L 29 24 Z M 27.4 18.8 L 20.6 18.8 L 20.6 22.4 L 27.4 22.4 L 27.4 18.8 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.105 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 7 12 L 17 12 L 17 26 L 7 26 L 7 12 Z M 8.6 24.4 L 15.4 24.4 L 15.4 18.8 L 8.6 18.8 L 8.6 24.4 Z M 15.4 13.6 L 8.6 13.6 L 8.6 17.2 L 15.4 17.2 L 15.4 13.6 Z"/><path d="M 19 10 L 23.728 10 C 24.105 10.596 24.564 11.135 25.09 11.6 L 20.6 11.6 L 20.6 17.2 L 27.4 17.2 L 27.4 12.987 C 27.909 13.177 28.445 13.313 29 13.387 L 29 24 L 19 24 Z M 27.4 18.8 L 20.6 18.8 L 20.6 22.4 L 27.4 22.4 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 32 5 C 33.105 5 34 5.895 34 7 Z M 7 26 L 17 26 L 17 12 L 7 12 Z M 9 19 L 15 19 L 15 24 L 9 24 Z M 15 17 L 9 17 L 9 14 L 15 14 Z M 19 24 L 29 24 L 29 10 L 19 10 Z M 21 12 L 27 12 L 27 17 L 21 17 Z M 27 22 L 21 22 L 21 19 L 27 19 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 19.028 10 L 19 10 L 19 10.048 L 17.625 12.395 C 16.807 13.583 17.571 15.197 19 15.345 L 19 24 L 29 24 L 29 15.357 L 34 15.357 Z M 7 26 L 17 26 L 17 12 L 7 12 Z M 9 19 L 15 19 L 15 24 L 9 24 Z M 15 17 L 9 17 L 9 14 L 15 14 Z M 27 17 L 21 17 L 21 15.357 L 27 15.357 Z M 27 22 L 21 22 L 21 19 L 27 19 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 22.57 5 C 22.312 6.817 22.732 8.566 23.633 10 L 19 10 L 19 24 L 29 24 L 29 13.427 C 29.103 13.44 29.206 13.451 29.31 13.46 L 30.32 13.48 C 31.625 13.429 32.895 13.036 34 12.34 Z M 7 26 L 17 26 L 17 12 L 7 12 Z M 9 19 L 15 19 L 15 24 L 9 24 Z M 15 17 L 9 17 L 9 14 L 15 14 Z M 21 12 L 25.472 12 C 25.94 12.352 26.452 12.65 27 12.885 L 27 17 L 21 17 Z M 27 22 L 21 22 L 21 19 L 27 19 Z"/>'
};
var boxPlotIconName = "box-plot";
var boxPlotIcon = [boxPlotIconName, renderIcon(icon166)];

// node_modules/@clr/core/icon/shapes/bubble-chart.js
var icon167 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 29 18 C 29 19.657 27.657 21 26 21 C 24.343 21 23 19.657 23 18 C 23 16.343 24.343 15 26 15 C 27.657 15 29 16.343 29 18 Z M 26 16.6 C 25.227 16.6 24.6 17.227 24.6 18 C 24.6 18.773 25.227 19.4 26 19.4 C 26.773 19.4 27.4 18.773 27.4 18 C 27.4 17.227 26.773 16.6 26 16.6 Z" rx="3"/><path d="M 15 14 C 15 16.209 13.209 18 11 18 C 8.791 18 7 16.209 7 14 C 7 11.791 8.791 10 11 10 C 13.209 10 15 11.791 15 14 Z M 11 11.6 C 9.675 11.6 8.6 12.675 8.6 14 C 8.6 15.325 9.675 16.4 11 16.4 C 12.325 16.4 13.4 15.325 13.4 14 C 13.4 12.675 12.325 11.6 11 11.6 Z" rx="3"/><path d="M 21 23 C 21 24.657 19.657 26 18 26 C 16.343 26 15 24.657 15 23 C 15 21.343 16.343 20 18 20 C 19.657 20 21 21.343 21 23 Z M 18 21.6 C 17.227 21.6 16.6 22.227 16.6 23 C 16.6 23.773 17.227 24.4 18 24.4 C 18.773 24.4 19.4 23.773 19.4 23 C 19.4 22.227 18.773 21.6 18 21.6 Z" rx="3"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 29 18 C 29 19.657 27.657 21 26 21 C 24.343 21 23 19.657 23 18 C 23 16.343 24.343 15 26 15 C 27.657 15 29 16.343 29 18 Z M 26 16.6 C 25.227 16.6 24.6 17.227 24.6 18 C 24.6 18.773 25.227 19.4 26 19.4 C 26.773 19.4 27.4 18.773 27.4 18 C 27.4 17.227 26.773 16.6 26 16.6 Z" rx="3"/><path d="M 15 14 C 15 16.209 13.209 18 11 18 C 8.791 18 7 16.209 7 14 C 7 11.791 8.791 10 11 10 C 13.209 10 15 11.791 15 14 Z M 11 11.6 C 9.675 11.6 8.6 12.675 8.6 14 C 8.6 15.325 9.675 16.4 11 16.4 C 12.325 16.4 13.4 15.325 13.4 14 C 13.4 12.675 12.325 11.6 11 11.6 Z" rx="3"/><path d="M 21 23 C 21 24.657 19.657 26 18 26 C 16.343 26 15 24.657 15 23 C 15 21.343 16.343 20 18 20 C 19.657 20 21 21.343 21 23 Z M 18 21.6 C 17.227 21.6 16.6 22.227 16.6 23 C 16.6 23.773 17.227 24.4 18 24.4 C 18.773 24.4 19.4 23.773 19.4 23 C 19.4 22.227 18.773 21.6 18 21.6 Z" rx="3"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 29 18 C 29 19.657 27.657 21 26 21 C 24.343 21 23 19.657 23 18 C 23 16.343 24.343 15 26 15 C 27.657 15 29 16.343 29 18 Z M 26 16.6 C 25.227 16.6 24.6 17.227 24.6 18 C 24.6 18.773 25.227 19.4 26 19.4 C 26.773 19.4 27.4 18.773 27.4 18 C 27.4 17.227 26.773 16.6 26 16.6 Z" rx="3"/><path d="M 15 14 C 15 16.209 13.209 18 11 18 C 8.791 18 7 16.209 7 14 C 7 11.791 8.791 10 11 10 C 13.209 10 15 11.791 15 14 Z M 11 11.6 C 9.675 11.6 8.6 12.675 8.6 14 C 8.6 15.325 9.675 16.4 11 16.4 C 12.325 16.4 13.4 15.325 13.4 14 C 13.4 12.675 12.325 11.6 11 11.6 Z" rx="3"/><path d="M 21 23 C 21 24.657 19.657 26 18 26 C 16.343 26 15 24.657 15 23 C 15 21.343 16.343 20 18 20 C 19.657 20 21 21.343 21 23 Z M 18 21.6 C 17.227 21.6 16.6 22.227 16.6 23 C 16.6 23.773 17.227 24.4 18 24.4 C 18.773 24.4 19.4 23.773 19.4 23 C 19.4 22.227 18.773 21.6 18 21.6 Z" rx="3"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 11 10 C 8.791 10 7 11.791 7 14 C 7 16.209 8.791 18 11 18 C 13.209 18 15 16.209 15 14 C 15 11.791 13.209 10 11 10 Z M 26 15 C 24.343 15 23 16.343 23 18 C 23 19.657 24.343 21 26 21 C 27.657 21 29 19.657 29 18 C 29 16.343 27.657 15 26 15 Z M 18 20 C 16.343 20 15 21.343 15 23 C 15 24.657 16.343 26 18 26 C 19.657 26 21 24.657 21 23 C 21 21.343 19.657 20 18 20 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 24.579 15.357 C 23.639 15.863 23 16.857 23 18 C 23 19.657 24.343 21 26 21 C 27.657 21 29 19.657 29 18 C 29 16.857 28.361 15.863 27.421 15.357 L 34 15.357 Z M 11 10 C 8.791 10 7 11.791 7 14 C 7 16.209 8.791 18 11 18 C 13.209 18 15 16.209 15 14 C 15 11.791 13.209 10 11 10 Z M 18 20 C 16.343 20 15 21.343 15 23 C 15 24.657 16.343 26 18 26 C 19.657 26 21 24.657 21 23 C 21 21.343 19.657 20 18 20 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 11 10 C 8.791 10 7 11.791 7 14 C 7 16.209 8.791 18 11 18 C 13.209 18 15 16.209 15 14 C 15 11.791 13.209 10 11 10 Z M 26 15 C 24.343 15 23 16.343 23 18 C 23 19.657 24.343 21 26 21 C 27.657 21 29 19.657 29 18 C 29 16.343 27.657 15 26 15 Z M 18 20 C 16.343 20 15 21.343 15 23 C 15 24.657 16.343 26 18 26 C 19.657 26 21 24.657 21 23 C 21 21.343 19.657 20 18 20 Z"/>'
};
var bubbleChartIconName = "bubble-chart";
var bubbleChartIcon = [bubbleChartIconName, renderIcon(icon167)];

// node_modules/@clr/core/icon/shapes/cloud-chart.js
var icon168 = {
  outline: '<path d="M32,5H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V7A2,2,0,0,0,32,5ZM4,29V7H32V29Z"/><path d="M 20.971 11.243 C 23.314 13.586 22.364 18.335 18.849 21.849 C 15.334 25.364 10.586 26.314 8.243 23.97 C 5.899 21.627 6.849 16.878 10.364 13.364 C 13.879 9.849 18.628 8.9 20.971 11.243 Z M 11.636 14.637 C 8.824 17.449 7.875 21.058 9.515 22.698 C 11.155 24.338 14.764 23.389 17.576 20.577 C 20.388 17.765 21.338 14.156 19.697 12.516 C 18.057 10.876 14.448 11.825 11.636 14.637 Z"/><path d="M 28 22 C 28 23.657 26.657 25 25 25 C 23.343 25 22 23.657 22 22 C 22 20.343 23.343 19 25 19 C 26.657 19 28 20.343 28 22 Z M 25 20.6 C 24.227 20.6 23.6 21.227 23.6 22 C 23.6 22.773 24.227 23.4 25 23.4 C 25.773 23.4 26.4 22.773 26.4 22 C 26.4 21.227 25.773 20.6 25 20.6 Z" x="7"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 18.849 21.849 C 15.334 25.364 10.586 26.314 8.243 23.97 C 5.899 21.627 6.849 16.878 10.364 13.364 C 13.049 10.679 16.453 9.492 18.956 10.124 L 18.008 11.741 C 16.18 11.518 13.695 12.578 11.636 14.637 C 8.824 17.449 7.875 21.058 9.515 22.698 C 11.155 24.338 14.764 23.389 17.576 20.577 C 19.228 18.925 20.237 16.998 20.456 15.357 L 22.22 15.357 C 22.006 17.477 20.838 19.861 18.849 21.849 Z"/><path d="M 28 22 C 28 23.657 26.657 25 25 25 C 23.343 25 22 23.657 22 22 C 22 20.343 23.343 19 25 19 C 26.657 19 28 20.343 28 22 Z M 25 20.6 C 24.226 20.6 23.6 21.226 23.6 22 C 23.6 22.773 24.226 23.4 25 23.4 C 25.773 23.4 26.4 22.773 26.4 22 C 26.4 21.226 25.773 20.6 25 20.6 Z" x="7"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.105 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 20.971 11.243 C 23.314 13.586 22.364 18.335 18.849 21.849 C 15.334 25.364 10.586 26.314 8.243 23.97 C 5.899 21.627 6.849 16.878 10.364 13.364 C 13.879 9.849 18.628 8.9 20.971 11.243 Z M 11.636 14.637 C 8.824 17.449 7.875 21.058 9.515 22.698 C 11.155 24.338 14.764 23.389 17.576 20.577 C 20.388 17.765 21.338 14.156 19.697 12.516 C 18.057 10.876 14.448 11.825 11.636 14.637 Z"/><path d="M 28 22 C 28 23.657 26.657 25 25 25 C 23.343 25 22 23.657 22 22 C 22 20.343 23.343 19 25 19 C 26.657 19 28 20.343 28 22 Z M 25 20.6 C 24.226 20.6 23.6 21.226 23.6 22 C 23.6 22.773 24.226 23.4 25 23.4 C 25.773 23.4 26.4 22.773 26.4 22 C 26.4 21.226 25.773 20.6 25 20.6 Z" x="7"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 32 5 C 33.105 5 34 5.895 34 7 Z M 10.364 13.364 C 6.849 16.878 5.899 21.627 8.243 23.97 C 10.586 26.314 15.334 25.364 18.849 21.849 C 22.364 18.335 23.314 13.586 20.971 11.243 C 18.628 8.9 13.879 9.849 10.364 13.364 Z M 25 19 C 23.343 19 22 20.343 22 22 C 22 23.657 23.343 25 25 25 C 26.657 25 28 23.657 28 22 C 28 20.343 26.657 19 25 19 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 18.956 10.124 C 16.453 9.492 13.049 10.679 10.364 13.364 C 6.849 16.878 5.899 21.627 8.243 23.97 C 10.586 26.314 15.334 25.364 18.849 21.849 C 20.838 19.861 22.006 17.477 22.22 15.357 L 34 15.357 Z M 25 19 C 23.343 19 22 20.343 22 22 C 22 23.657 23.343 25 25 25 C 26.657 25 28 23.657 28 22 C 28 20.343 26.657 19 25 19 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.625 13.429 32.895 13.036 34 12.34 Z M 10.364 13.364 C 6.849 16.878 5.899 21.627 8.243 23.97 C 10.586 26.314 15.334 25.364 18.849 21.849 C 22.364 18.335 23.314 13.586 20.971 11.243 C 18.628 8.9 13.879 9.849 10.364 13.364 Z M 25 19 C 23.343 19 22 20.343 22 22 C 22 23.657 23.343 25 25 25 C 26.657 25 28 23.657 28 22 C 28 20.343 26.657 19 25 19 Z"/>'
};
var cloudChartIconName = "cloud-chart";
var cloudChartIcon = [cloudChartIconName, renderIcon(icon168)];

// node_modules/@clr/core/icon/shapes/curve-chart.js
var icon169 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 7 11.8 C 6.558 11.8 6.2 11.442 6.2 11 C 6.2 10.558 6.558 10.2 7 10.2 L 13 10.2 C 15.404 10.2 16.368 11.907 17.653 16.478 C 17.695 16.628 17.744 16.803 17.835 17.129 C 17.909 17.392 17.964 17.588 18.019 17.78 C 19.332 22.375 20.549 24.2 23 24.2 L 29 24.2 C 29.442 24.2 29.8 24.558 29.8 25 C 29.8 25.442 29.442 25.8 29 25.8 L 23 25.8 C 19.535 25.8 17.981 23.469 16.481 18.22 C 16.425 18.025 16.369 17.826 16.295 17.56 C 16.203 17.234 16.154 17.06 16.113 16.911 C 15.043 13.105 14.305 11.8 13 11.8 L 7 11.8 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 7 11.8 C 6.558 11.8 6.2 11.442 6.2 11 C 6.2 10.558 6.558 10.2 7 10.2 L 13 10.2 C 15.404 10.2 16.368 11.907 17.653 16.478 C 17.695 16.628 17.744 16.803 17.835 17.129 C 17.909 17.392 17.964 17.588 18.019 17.78 C 19.332 22.375 20.549 24.2 23 24.2 L 29 24.2 C 29.442 24.2 29.8 24.558 29.8 25 C 29.8 25.442 29.442 25.8 29 25.8 L 23 25.8 C 19.535 25.8 17.981 23.469 16.481 18.22 C 16.425 18.025 16.369 17.826 16.295 17.56 C 16.203 17.234 16.154 17.06 16.113 16.911 C 15.043 13.105 14.305 11.8 13 11.8 L 7 11.8 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 7 11.8 C 6.558 11.8 6.2 11.442 6.2 11 C 6.2 10.558 6.558 10.2 7 10.2 L 13 10.2 C 15.404 10.2 16.368 11.907 17.653 16.478 C 17.695 16.628 17.744 16.803 17.835 17.129 C 17.909 17.392 17.964 17.588 18.019 17.78 C 19.332 22.375 20.549 24.2 23 24.2 L 29 24.2 C 29.442 24.2 29.8 24.558 29.8 25 C 29.8 25.442 29.442 25.8 29 25.8 L 23 25.8 C 19.535 25.8 17.981 23.469 16.481 18.22 C 16.425 18.025 16.369 17.826 16.295 17.56 C 16.203 17.234 16.154 17.06 16.113 16.911 C 15.043 13.105 14.305 11.8 13 11.8 L 7 11.8 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 13 12 C 14.817 12 15.674 13.499 17.039 18.275 C 17.813 20.984 18.201 22.118 18.882 23.309 C 19.87 25.038 21.205 26 23 26 L 29 26 C 29.552 26 30 25.552 30 25 C 30 24.448 29.552 24 29 24 L 23 24 C 21.183 24 20.326 22.501 18.962 17.725 C 18.188 15.016 17.799 13.882 17.118 12.691 C 16.13 10.962 14.795 10 13 10 L 7 10 C 6.448 10 6 10.448 6 11 C 6 11.552 6.448 12 7 12 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 17.476 12.612 17.379 12.843 17.33 13.077 C 17.262 12.948 17.192 12.82 17.118 12.691 C 16.13 10.962 14.795 10 13 10 L 7 10 C 6.448 10 6 10.448 6 11 C 6 11.552 6.448 12 7 12 L 13 12 C 14.817 12 15.674 13.499 17.039 18.275 C 17.813 20.984 18.201 22.118 18.882 23.309 C 19.87 25.038 21.205 26 23 26 L 29 26 C 29.552 26 30 25.552 30 25 C 30 24.448 29.552 24 29 24 L 23 24 C 21.183 24 20.326 22.501 18.962 17.725 C 18.64 16.598 18.385 15.744 18.147 15.044 C 18.407 15.215 18.717 15.326 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 34 15.357 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 13 12 C 14.817 12 15.674 13.499 17.039 18.275 C 17.813 20.984 18.201 22.118 18.882 23.309 C 19.87 25.038 21.205 26 23 26 L 29 26 C 29.552 26 30 25.552 30 25 C 30 24.448 29.552 24 29 24 L 23 24 C 21.183 24 20.326 22.501 18.962 17.725 C 18.188 15.016 17.799 13.882 17.118 12.691 C 16.13 10.962 14.795 10 13 10 L 7 10 C 6.448 10 6 10.448 6 11 C 6 11.552 6.448 12 7 12 Z"/>'
};
var curveChartIconName = "curve-chart";
var curveChartIcon = [curveChartIconName, renderIcon(icon169)];

// node_modules/@clr/core/icon/shapes/grid-chart.js
var icon170 = {
  outline: '<path d="M15,17H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,17ZM4,8v7H15V8Z"/><path d="M32,17H21a2,2,0,0,1-2-2V8a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2v7A2,2,0,0,1,32,17ZM21,8v7H32V8Z"/><path d="M15,30H4a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,30ZM4,21v7H15V21Z"/><path d="M32,30H21a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2v7A2,2,0,0,1,32,30ZM21,21v7H32V21Z"/>',
  outlineAlerted: '<path d="M15,17H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,17ZM4,8v7H15V8Z"/><path d="M 32 17 L 21 17 C 20.014 17 19.195 16.287 19.03 15.348 C 19.041 15.349 19.053 15.35 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 33.968 15.357 C 33.8 16.292 32.983 17 32 17 Z M 19 8 C 19 6.895 19.895 6 21 6 L 21.372 6 L 19 10.048 Z"/><path d="M15,30H4a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,30ZM4,21v7H15V21Z"/><path d="M32,30H21a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2v7A2,2,0,0,1,32,30ZM21,21v7H32V21Z"/>',
  outlineBadged: '<path d="M15,17H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,17ZM4,8v7H15V8Z"/><path d="M 32 17 L 21 17 C 19.895 17 19 16.105 19 15 L 19 8 C 19 6.895 19.895 6 21 6 L 22.59 6 C 22.59 6.019 22.59 6.037 22.59 6.056 C 22.59 6.729 22.68 7.381 22.848 8 L 21 8 L 21 15 L 32 15 L 32 13.175 C 32.717 12.972 33.389 12.664 34 12.269 L 34 15 C 34 16.105 33.105 17 32 17 Z"/><path d="M15,30H4a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H15a2,2,0,0,1,2,2v7A2,2,0,0,1,15,30ZM4,21v7H15V21Z"/><path d="M32,30H21a2,2,0,0,1-2-2V21a2,2,0,0,1,2-2H32a2,2,0,0,1,2,2v7A2,2,0,0,1,32,30ZM21,21v7H32V21Z"/>',
  solid: '<path d="M 15 17 L 4 17 C 2.895 17 2 16.105 2 15 L 2 8 C 2 6.895 2.895 6 4 6 L 15 6 C 16.105 6 17 6.895 17 8 L 17 15 C 17 16.105 16.105 17 15 17 Z"/><path d="M 32 17 L 21 17 C 19.895 17 19 16.105 19 15 L 19 8 C 19 6.895 19.895 6 21 6 L 32 6 C 33.105 6 34 6.895 34 8 L 34 15 C 34 16.105 33.105 17 32 17 Z"/><path d="M 15 30 L 4 30 C 2.895 30 2 29.105 2 28 L 2 21 C 2 19.895 2.895 19 4 19 L 15 19 C 16.105 19 17 19.895 17 21 L 17 28 C 17 29.105 16.105 30 15 30 Z"/><path d="M 32 30 L 21 30 C 19.895 30 19 29.105 19 28 L 19 21 C 19 19.895 19.895 19 21 19 L 32 19 C 33.105 19 34 19.895 34 21 L 34 28 C 34 29.105 33.105 30 32 30 Z"/>',
  solidAlerted: '<path d="M 15 17 L 4 17 C 2.895 17 2 16.105 2 15 L 2 8 C 2 6.895 2.895 6 4 6 L 15 6 C 16.105 6 17 6.895 17 8 L 17 15 C 17 16.105 16.105 17 15 17 Z"/><path d="M 32 17 L 21 17 C 20.014 17 19.195 16.287 19.03 15.348 C 19.041 15.349 19.053 15.35 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 33.968 15.357 C 33.8 16.292 32.983 17 32 17 Z M 19 8 C 19 6.895 19.895 6 21 6 L 21.372 6 L 19 10.048 Z"/><path d="M 15 30 L 4 30 C 2.895 30 2 29.105 2 28 L 2 21 C 2 19.895 2.895 19 4 19 L 15 19 C 16.105 19 17 19.895 17 21 L 17 28 C 17 29.105 16.105 30 15 30 Z"/><path d="M 32 30 L 21 30 C 19.895 30 19 29.105 19 28 L 19 21 C 19 19.895 19.895 19 21 19 L 32 19 C 33.105 19 34 19.895 34 21 L 34 28 C 34 29.105 33.105 30 32 30 Z"/>',
  solidBadged: '<path d="M 15 17 L 4 17 C 2.895 17 2 16.105 2 15 L 2 8 C 2 6.895 2.895 6 4 6 L 15 6 C 16.105 6 17 6.895 17 8 L 17 15 C 17 16.105 16.105 17 15 17 Z"/><path d="M 32 17 L 21 17 C 19.895 17 19 16.105 19 15 L 19 8 C 19 6.895 19.895 6 21 6 L 22.59 6 C 22.59 6.019 22.59 6.037 22.59 6.056 C 22.59 10.141 25.901 13.452 29.986 13.452 C 31.466 13.452 32.844 13.018 34 12.269 L 34 15 C 34 16.105 33.105 17 32 17 Z"/><path d="M 15 30 L 4 30 C 2.895 30 2 29.105 2 28 L 2 21 C 2 19.895 2.895 19 4 19 L 15 19 C 16.105 19 17 19.895 17 21 L 17 28 C 17 29.105 16.105 30 15 30 Z"/><path d="M 32 30 L 21 30 C 19.895 30 19 29.105 19 28 L 19 21 C 19 19.895 19.895 19 21 19 L 32 19 C 33.105 19 34 19.895 34 21 L 34 28 C 34 29.105 33.105 30 32 30 Z"/>'
};
var gridChartIconName = "grid-chart";
var gridChartIcon = [gridChartIconName, renderIcon(icon170)];

// node_modules/@clr/core/icon/shapes/heat-map.js
var icon171 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 8 10 L 28 10 L 28 26 L 8 26 Z M 9.6 24 L 14.1 24 L 14.1 18.8 L 9.6 18.8 Z M 14.1 11.6 L 9.6 11.6 L 9.6 17.2 L 14.1 17.2 Z M 26 24 L 26 18.8 L 21.9 18.8 L 21.9 24 Z M 26 11.6 L 21.9 11.6 L 21.9 17.2 L 26 17.2 Z M 15.7 11.6 L 15.7 17.2 L 20.3 17.2 L 20.3 11.6 Z M 15.7 24 L 20.3 24 L 20.3 18.8 L 15.7 18.8 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 8 10 L 19.028 10 L 18.091 11.6 L 15.7 11.6 L 15.7 17.2 L 20.3 17.2 L 20.3 15.357 L 21.9 15.357 L 21.9 17.2 L 26 17.2 L 26 15.357 L 28 15.357 L 28 26 L 8 26 Z M 9.6 24 L 14.1 24 L 14.1 18.8 L 9.6 18.8 Z M 14.1 11.6 L 9.6 11.6 L 9.6 17.2 L 14.1 17.2 Z M 26 24 L 26 18.8 L 21.9 18.8 L 21.9 24 Z M 15.7 24 L 20.3 24 L 20.3 18.8 L 15.7 18.8 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 8 10 L 23.728 10 C 24.105 10.596 24.564 11.135 25.09 11.6 L 21.9 11.6 L 21.9 17.2 L 26 17.2 L 26 12.287 C 26.611 12.679 27.284 12.983 28 13.182 L 28 26 L 8 26 Z M 9.6 24 L 14.1 24 L 14.1 18.8 L 9.6 18.8 Z M 14.1 11.6 L 9.6 11.6 L 9.6 17.2 L 14.1 17.2 Z M 26 24 L 26 18.8 L 21.9 18.8 L 21.9 24 Z M 15.7 11.6 L 15.7 17.2 L 20.3 17.2 L 20.3 11.6 Z M 15.7 24 L 20.3 24 L 20.3 18.8 L 15.7 18.8 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 8 26 L 28 26 L 28 10 L 8 10 Z M 10 19 L 14 19 L 14 24 L 10 24 Z M 22 24 L 22 19 L 26 19 L 26 24 Z M 20 19 L 20 24 L 16 24 L 16 19 Z M 26 17 L 22 17 L 22 12 L 26 12 Z M 20 12 L 20 17 L 16 17 L 16 12 Z M 14 12 L 14 17 L 10 17 L 10 12 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 19.028 10 L 8 10 L 8 26 L 28 26 L 28 15.357 L 34 15.357 Z M 10 19 L 14 19 L 14 24 L 10 24 Z M 22 24 L 22 19 L 26 19 L 26 24 Z M 20 19 L 20 24 L 16 24 L 16 19 Z M 26 17 L 22 17 L 22 15.357 L 26 15.357 Z M 20 17 L 16 17 L 16 12 L 17.856 12 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 20 15.357 Z M 14 12 L 14 17 L 10 17 L 10 12 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 22.312 6.817 22.732 8.566 23.633 10 L 8 10 L 8 26 L 28 26 L 28 13.232 C 28.421 13.345 28.859 13.422 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 10 19 L 14 19 L 14 24 L 10 24 Z M 22 24 L 22 19 L 26 19 L 26 24 Z M 20 19 L 20 24 L 16 24 L 16 19 Z M 26 17 L 22 17 L 22 12 L 25.584 12 C 25.719 12.1 25.858 12.196 26 12.287 Z M 20 12 L 20 17 L 16 17 L 16 12 Z M 14 12 L 14 17 L 10 17 L 10 12 Z"/>'
};
var heatMapIconName = "heat-map";
var heatMapIcon = [heatMapIconName, renderIcon(icon171)];

// node_modules/@clr/core/icon/shapes/line-chart.js
var icon172 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><polygon points="15.62 15.222 9.602 23.968 5.55 20.384 6.61 19.186 9.308 21.572 15.634 12.38 22.384 22.395 29.138 13.47 30.414 14.436 22.308 25.145"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 15.62 15.222 L 9.602 23.968 L 5.55 20.384 L 6.61 19.186 L 9.308 21.572 L 15.634 12.38 L 22.384 22.395 L 27.717 15.348 L 29.724 15.348 L 22.308 25.145 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><polygon points="15.62 15.222 9.602 23.968 5.55 20.384 6.61 19.186 9.308 21.572 15.634 12.38 22.384 22.395 29.138 13.47 30.414 14.436 22.308 25.145"/>',
  solid: '<path d="M 32 5 L 4 5 C 2.896 5 2 5.896 2 7 L 2 29 C 2 30.105 2.896 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.896 33.105 5 32 5 Z M 22.56 25.94 L 15.46 15.36 L 9.12 24.64 L 4.62 20.64 L 6 19.05 L 8.7 21.44 L 15.46 11.56 L 22.65 22.27 L 29.65 13 L 31.35 14.28 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 27.452 15.357 L 22.38 22.06 L 15.63 12 L 9.28 21.28 L 6.75 19.04 L 5.42 20.53 L 9.65 24.28 L 15.61 15.56 L 22.28 25.5 L 29.959 15.357 L 34 15.357 Z"/>',
  solidBadged: '<path d="M 30.32 13.48 L 31.38 14.28 L 22.56 25.94 L 15.46 15.36 L 9.12 24.64 L 4.62 20.64 L 6 19.05 L 8.7 21.44 L 15.46 11.56 L 22.65 22.27 L 29.31 13.46 C 25.05 13.1 21.969 9.233 22.57 5 L 4 5 C 2.896 5 2 5.896 2 7 L 2 29 C 2 30.105 2.896 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 12.34 C 32.895 13.036 31.626 13.429 30.32 13.48 Z"/>'
};
var lineChartIconName = "line-chart";
var lineChartIcon = [lineChartIconName, renderIcon(icon172)];

// node_modules/@clr/core/icon/shapes/pie-chart.js
var icon173 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 17 27 C 12.582 27 9 23.418 9 19 C 9 14.582 12.582 11 17 11 L 17 19 L 25 19 C 25 23.418 21.418 27 17 27 Z M 23.247 20.4 L 15.4 20.4 L 15.4 12.802 C 12.64 13.513 10.601 16.018 10.6 19 C 10.6 22.535 13.465 25.4 17 25.4 C 20.054 25.401 22.608 23.261 23.247 20.4 Z"/><path d="M 19 9 C 23.418 9 27 12.582 27 17 L 19 17 Z M 25.198 15.4 C 24.62 13.15 22.849 11.38 20.6 10.801 L 20.6 15.4 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 17 27 C 12.582 27 9 23.418 9 19 C 9 14.582 12.582 11 17 11 L 17 19 L 25 19 C 25 23.418 21.418 27 17 27 Z M 23.247 20.4 L 15.4 20.4 L 15.4 12.802 C 12.64 13.513 10.601 16.018 10.6 19 C 10.6 22.535 13.465 25.4 17 25.4 C 20.054 25.401 22.608 23.261 23.247 20.4 Z"/><path d="M 27 17 L 19 17 L 19 15.345 C 19.021 15.348 19.043 15.349 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 26.831 15.357 C 26.942 15.887 27 16.437 27 17 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 17 27 C 12.582 27 9 23.418 9 19 C 9 14.582 12.582 11 17 11 L 17 19 L 25 19 C 25 23.418 21.418 27 17 27 Z M 23.247 20.4 L 15.4 20.4 L 15.4 12.802 C 12.64 13.513 10.601 16.018 10.6 19 C 10.6 22.535 13.465 25.4 17 25.4 C 20.054 25.401 22.608 23.261 23.247 20.4 Z"/><path d="M 19 9 C 23.418 9 27 12.582 27 17 L 19 17 Z M 25.198 15.4 C 24.62 13.15 22.849 11.38 20.6 10.801 L 20.6 15.4 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 C 32 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 25 19 L 17 19 L 17 11 C 12.582 11 9 14.582 9 19 C 9 23.418 12.582 27 17 27 C 21.418 27 25 23.418 25 19 Z M 19 17 L 27 17 C 27 12.582 23.418 9 19 9 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 16.807 13.583 17.571 15.197 19 15.345 L 19 17 L 27 17 C 27 16.437 26.942 15.887 26.831 15.357 L 34 15.357 Z M 25 19 L 17 19 L 17 11 C 12.582 11 9 14.582 9 19 C 9 23.418 12.582 27 17 27 C 21.418 27 25 23.418 25 19 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 25 19 L 17 19 L 17 11 C 12.582 11 9 14.582 9 19 C 9 23.418 12.582 27 17 27 C 21.418 27 25 23.418 25 19 Z M 19 17 L 27 17 C 27 12.582 23.418 9 19 9 Z"/>'
};
var pieChartIconName = "pie-chart";
var pieChartIcon = [pieChartIconName, renderIcon(icon173)];

// node_modules/@clr/core/icon/shapes/scatter-plot.js
var icon174 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 9.101 15.8 C 9.413 16.111 9.919 16.111 10.231 15.8 L 11.391 14.64 L 12.551 15.8 C 12.964 16.256 13.717 16.094 13.905 15.507 C 14.002 15.208 13.914 14.881 13.681 14.67 L 12.531 13.54 L 13.691 12.38 C 14.147 11.966 13.985 11.214 13.399 11.025 C 13.1 10.929 12.772 11.017 12.561 11.25 L 11.401 12.41 L 10.231 11.22 C 9.817 10.763 9.065 10.926 8.877 11.512 C 8.78 11.811 8.868 12.139 9.101 12.35 L 10.261 13.54 L 9.101 14.67 C 8.789 14.982 8.789 15.487 9.101 15.8 Z"/><path d="M 15.176 25.536 C 15.488 25.847 15.994 25.847 16.306 25.536 L 17.466 24.376 L 18.626 25.536 C 19.039 25.992 19.792 25.83 19.98 25.243 C 20.077 24.944 19.989 24.617 19.756 24.406 L 18.606 23.276 L 19.766 22.116 C 20.222 21.702 20.06 20.95 19.474 20.761 C 19.175 20.665 18.847 20.753 18.636 20.986 L 17.476 22.146 L 16.306 20.956 C 15.892 20.499 15.14 20.662 14.952 21.248 C 14.855 21.547 14.943 21.875 15.176 22.086 L 16.336 23.276 L 15.176 24.406 C 14.864 24.718 14.864 25.223 15.176 25.536 Z"/><path d="M 22.912 20.343 C 23.224 20.654 23.73 20.654 24.042 20.343 L 25.202 19.183 L 26.362 20.343 C 26.775 20.799 27.528 20.637 27.716 20.05 C 27.813 19.751 27.725 19.424 27.492 19.213 L 26.342 18.083 L 27.502 16.923 C 27.958 16.509 27.796 15.757 27.21 15.568 C 26.911 15.472 26.583 15.56 26.372 15.793 L 25.212 16.953 L 24.042 15.763 C 23.628 15.306 22.876 15.469 22.688 16.055 C 22.591 16.354 22.679 16.682 22.912 16.893 L 24.072 18.083 L 22.912 19.213 C 22.6 19.525 22.6 20.03 22.912 20.343 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 9.101 15.8 C 9.413 16.111 9.919 16.111 10.231 15.8 L 11.391 14.64 L 12.551 15.8 C 12.964 16.256 13.717 16.094 13.905 15.507 C 14.002 15.208 13.914 14.881 13.681 14.67 L 12.531 13.54 L 13.691 12.38 C 14.147 11.966 13.985 11.214 13.399 11.025 C 13.1 10.929 12.772 11.017 12.561 11.25 L 11.401 12.41 L 10.231 11.22 C 9.817 10.763 9.065 10.926 8.877 11.512 C 8.78 11.811 8.868 12.139 9.101 12.35 L 10.261 13.54 L 9.101 14.67 C 8.789 14.982 8.789 15.487 9.101 15.8 Z"/><path d="M 15.176 25.536 C 15.488 25.847 15.994 25.847 16.306 25.536 L 17.466 24.376 L 18.626 25.536 C 19.039 25.992 19.792 25.83 19.98 25.243 C 20.077 24.944 19.989 24.617 19.756 24.406 L 18.606 23.276 L 19.766 22.116 C 20.222 21.702 20.06 20.95 19.474 20.761 C 19.175 20.665 18.847 20.753 18.636 20.986 L 17.476 22.146 L 16.306 20.956 C 15.892 20.499 15.14 20.662 14.952 21.248 C 14.855 21.547 14.943 21.875 15.176 22.086 L 16.336 23.276 L 15.176 24.406 C 14.864 24.718 14.864 25.223 15.176 25.536 Z"/><path d="M 22.912 20.343 C 23.224 20.654 23.73 20.654 24.042 20.343 L 25.202 19.183 L 26.362 20.343 C 26.775 20.799 27.528 20.637 27.716 20.05 C 27.813 19.751 27.725 19.424 27.492 19.213 L 26.342 18.083 L 27.502 16.923 C 27.958 16.509 27.796 15.757 27.21 15.568 C 26.911 15.472 26.583 15.56 26.372 15.793 L 25.212 16.953 L 24.042 15.763 C 23.628 15.306 22.876 15.469 22.688 16.055 C 22.591 16.354 22.679 16.682 22.912 16.893 L 24.072 18.083 L 22.912 19.213 C 22.6 19.525 22.6 20.03 22.912 20.343 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 9.101 15.8 C 9.413 16.111 9.919 16.111 10.231 15.8 L 11.391 14.64 L 12.551 15.8 C 12.964 16.256 13.717 16.094 13.905 15.507 C 14.002 15.208 13.914 14.881 13.681 14.67 L 12.531 13.54 L 13.691 12.38 C 14.147 11.966 13.985 11.214 13.399 11.025 C 13.1 10.929 12.772 11.017 12.561 11.25 L 11.401 12.41 L 10.231 11.22 C 9.817 10.763 9.065 10.926 8.877 11.512 C 8.78 11.811 8.868 12.139 9.101 12.35 L 10.261 13.54 L 9.101 14.67 C 8.789 14.982 8.789 15.487 9.101 15.8 Z"/><path d="M 15.176 25.536 C 15.488 25.847 15.994 25.847 16.306 25.536 L 17.466 24.376 L 18.626 25.536 C 19.039 25.992 19.792 25.83 19.98 25.243 C 20.077 24.944 19.989 24.617 19.756 24.406 L 18.606 23.276 L 19.766 22.116 C 20.222 21.702 20.06 20.95 19.474 20.761 C 19.175 20.665 18.847 20.753 18.636 20.986 L 17.476 22.146 L 16.306 20.956 C 15.892 20.499 15.14 20.662 14.952 21.248 C 14.855 21.547 14.943 21.875 15.176 22.086 L 16.336 23.276 L 15.176 24.406 C 14.864 24.718 14.864 25.223 15.176 25.536 Z"/><path d="M 22.912 20.343 C 23.224 20.654 23.73 20.654 24.042 20.343 L 25.202 19.183 L 26.362 20.343 C 26.775 20.799 27.528 20.637 27.716 20.05 C 27.813 19.751 27.725 19.424 27.492 19.213 L 26.342 18.083 L 27.502 16.923 C 27.958 16.509 27.796 15.757 27.21 15.568 C 26.911 15.472 26.583 15.56 26.372 15.793 L 25.212 16.953 L 24.042 15.763 C 23.628 15.306 22.876 15.469 22.688 16.055 C 22.591 16.354 22.679 16.682 22.912 16.893 L 24.072 18.083 L 22.912 19.213 C 22.6 19.525 22.6 20.03 22.912 20.343 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 9.101 15.8 C 9.413 16.111 9.919 16.111 10.231 15.8 L 11.391 14.64 L 12.551 15.8 C 12.964 16.256 13.717 16.094 13.905 15.507 C 14.002 15.208 13.914 14.881 13.681 14.67 L 12.531 13.54 L 13.691 12.38 C 14.147 11.966 13.985 11.214 13.399 11.025 C 13.1 10.929 12.772 11.017 12.561 11.25 L 11.401 12.41 L 10.231 11.22 C 9.817 10.763 9.065 10.926 8.877 11.512 C 8.78 11.811 8.868 12.139 9.101 12.35 L 10.261 13.54 L 9.101 14.67 C 8.789 14.982 8.789 15.487 9.101 15.8 Z M 15.176 25.536 C 15.488 25.847 15.994 25.847 16.306 25.536 L 17.466 24.376 L 18.626 25.536 C 19.039 25.992 19.792 25.83 19.98 25.243 C 20.077 24.944 19.989 24.617 19.756 24.406 L 18.606 23.276 L 19.766 22.116 C 20.222 21.702 20.06 20.95 19.474 20.761 C 19.175 20.665 18.847 20.753 18.636 20.986 L 17.476 22.146 L 16.306 20.956 C 15.892 20.499 15.14 20.662 14.952 21.248 C 14.855 21.547 14.943 21.875 15.176 22.086 L 16.336 23.276 L 15.176 24.406 C 14.864 24.718 14.864 25.223 15.176 25.536 Z M 22.912 20.343 C 23.224 20.654 23.73 20.654 24.042 20.343 L 25.202 19.183 L 26.362 20.343 C 26.775 20.799 27.528 20.637 27.716 20.05 C 27.813 19.751 27.725 19.424 27.492 19.213 L 26.342 18.083 L 27.502 16.923 C 27.958 16.509 27.796 15.757 27.21 15.568 C 26.911 15.472 26.583 15.56 26.372 15.793 L 25.212 16.953 L 24.042 15.763 C 23.628 15.306 22.876 15.469 22.688 16.055 C 22.591 16.354 22.679 16.682 22.912 16.893 L 24.072 18.083 L 22.912 19.213 C 22.6 19.525 22.6 20.03 22.912 20.343 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 34 15.357 Z M 9.101 15.8 C 9.413 16.111 9.919 16.111 10.231 15.8 L 11.391 14.64 L 12.551 15.8 C 12.964 16.256 13.717 16.094 13.905 15.507 C 14.002 15.208 13.914 14.881 13.681 14.67 L 12.531 13.54 L 13.691 12.38 C 14.147 11.966 13.985 11.214 13.399 11.025 C 13.1 10.929 12.772 11.017 12.561 11.25 L 11.401 12.41 L 10.231 11.22 C 9.817 10.763 9.065 10.926 8.877 11.512 C 8.78 11.811 8.868 12.139 9.101 12.35 L 10.261 13.54 L 9.101 14.67 C 8.789 14.982 8.789 15.487 9.101 15.8 Z M 15.176 25.536 C 15.488 25.847 15.994 25.847 16.306 25.536 L 17.466 24.376 L 18.626 25.536 C 19.039 25.992 19.792 25.83 19.98 25.243 C 20.077 24.944 19.989 24.617 19.756 24.406 L 18.606 23.276 L 19.766 22.116 C 20.222 21.702 20.06 20.95 19.474 20.761 C 19.175 20.665 18.847 20.753 18.636 20.986 L 17.476 22.146 L 16.306 20.956 C 15.892 20.499 15.14 20.662 14.952 21.248 C 14.855 21.547 14.943 21.875 15.176 22.086 L 16.336 23.276 L 15.176 24.406 C 14.864 24.718 14.864 25.223 15.176 25.536 Z M 22.912 20.343 C 23.224 20.654 23.73 20.654 24.042 20.343 L 25.202 19.183 L 26.362 20.343 C 26.775 20.799 27.528 20.637 27.716 20.05 C 27.813 19.751 27.725 19.424 27.492 19.213 L 26.342 18.083 L 27.502 16.923 C 27.958 16.509 27.796 15.757 27.21 15.568 C 26.911 15.472 26.583 15.56 26.372 15.793 L 25.212 16.953 L 24.042 15.763 C 23.628 15.306 22.876 15.469 22.688 16.055 C 22.591 16.354 22.679 16.682 22.912 16.893 L 24.072 18.083 L 22.912 19.213 C 22.6 19.525 22.6 20.03 22.912 20.343 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 9.101 15.8 C 9.413 16.111 9.919 16.111 10.231 15.8 L 11.391 14.64 L 12.551 15.8 C 12.964 16.256 13.717 16.094 13.905 15.507 C 14.002 15.208 13.914 14.881 13.681 14.67 L 12.531 13.54 L 13.691 12.38 C 14.147 11.966 13.985 11.214 13.399 11.025 C 13.1 10.929 12.772 11.017 12.561 11.25 L 11.401 12.41 L 10.231 11.22 C 9.817 10.763 9.065 10.926 8.877 11.512 C 8.78 11.811 8.868 12.139 9.101 12.35 L 10.261 13.54 L 9.101 14.67 C 8.789 14.982 8.789 15.487 9.101 15.8 Z M 15.176 25.536 C 15.488 25.847 15.994 25.847 16.306 25.536 L 17.466 24.376 L 18.626 25.536 C 19.039 25.992 19.792 25.83 19.98 25.243 C 20.077 24.944 19.989 24.617 19.756 24.406 L 18.606 23.276 L 19.766 22.116 C 20.222 21.702 20.06 20.95 19.474 20.761 C 19.175 20.665 18.847 20.753 18.636 20.986 L 17.476 22.146 L 16.306 20.956 C 15.892 20.499 15.14 20.662 14.952 21.248 C 14.855 21.547 14.943 21.875 15.176 22.086 L 16.336 23.276 L 15.176 24.406 C 14.864 24.718 14.864 25.223 15.176 25.536 Z M 22.912 20.343 C 23.224 20.654 23.73 20.654 24.042 20.343 L 25.202 19.183 L 26.362 20.343 C 26.775 20.799 27.528 20.637 27.716 20.05 C 27.813 19.751 27.725 19.424 27.492 19.213 L 26.342 18.083 L 27.502 16.923 C 27.958 16.509 27.796 15.757 27.21 15.568 C 26.911 15.472 26.583 15.56 26.372 15.793 L 25.212 16.953 L 24.042 15.763 C 23.628 15.306 22.876 15.469 22.688 16.055 C 22.591 16.354 22.679 16.682 22.912 16.893 L 24.072 18.083 L 22.912 19.213 C 22.6 19.525 22.6 20.03 22.912 20.343 Z"/>'
};
var scatterPlotIconName = "scatter-plot";
var scatterPlotIcon = [scatterPlotIconName, renderIcon(icon174)];

// node_modules/@clr/core/icon/shapes/tick-chart.js
var icon175 = {
  outline: '<path d="M 32 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.105 2.895 31 4 31 L 32 31 C 33.105 31 34 30.105 34 29 L 34 7 C 34 5.895 33.105 5 32 5 Z M 4 29 L 4 7 L 32 7 L 32 29 Z"/><path d="M 6 25 L 8 25 L 8 22 L 10 22 L 10 25 L 13 25 L 13 22 L 15 22 L 15 25 L 18 25 L 18 22 L 20 22 L 20 25 L 23 25 L 23 22 L 25 22 L 25 25 L 27.723 25 C 28.023 25.02 28.293 25.18 28.463 25.43 C 28.903 26.06 28.483 26.93 27.723 26.99 L 6 26.991 Z"/>',
  outlineAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.895 31 2 30.105 2 29 L 2 7 C 2 5.895 2.895 5 4 5 L 21.958 5 L 20.786 7 L 4 7 L 4 29 L 32 29 L 32 15.357 L 34 15.357 Z"/><path d="M 6 25 L 8 25 L 8 22 L 10 22 L 10 25 L 13 25 L 13 22 L 15 22 L 15 25 L 18 25 L 18 22 L 20 22 L 20 25 L 23 25 L 23 22 L 25 22 L 25 25 L 27.723 25 C 28.023 25.02 28.293 25.18 28.463 25.43 C 28.903 26.06 28.483 26.93 27.723 26.99 L 6 26.991 Z"/>',
  outlineBadged: '<path d="M 32 13.22 L 32 29 L 4 29 L 4 7 L 22.57 7 C 22.524 6.668 22.501 6.334 22.5 6 C 22.501 5.665 22.524 5.331 22.57 5 L 4 5 C 2.895 5 2 5.895 2 7 L 2 29 C 2 30.104 2.895 31 4 31 L 32 31 C 33.104 31 34 30.104 34 29 L 34 12.34 C 33.38 12.73 32.706 13.026 32 13.22 Z"/><path d="M 6 25 L 8 25 L 8 22 L 10 22 L 10 25 L 13 25 L 13 22 L 15 22 L 15 25 L 18 25 L 18 22 L 20 22 L 20 25 L 23 25 L 23 22 L 25 22 L 25 25 L 27.723 25 C 28.023 25.02 28.293 25.18 28.463 25.43 C 28.903 26.06 28.483 26.93 27.723 26.99 L 6 26.991 Z"/>',
  solid: '<path d="M 34 7 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 32 5 C 33.105 5 34 5.896 34 7 Z M 6 26.991 L 27.723 26.99 C 28.483 26.93 28.903 26.06 28.463 25.43 C 28.293 25.18 28.023 25.02 27.723 25 L 25 25 L 25 22 L 23 22 L 23 25 L 20 25 L 20 22 L 18 22 L 18 25 L 15 25 L 15 22 L 13 22 L 13 25 L 10 25 L 10 22 L 8 22 L 8 25 L 6 25 Z"/>',
  solidAlerted: '<path d="M 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 21.958 5 L 17.625 12.395 C 16.795 13.601 17.594 15.245 19.064 15.351 C 19.134 15.357 19.201 15.359 19.27 15.357 L 34 15.357 Z M 6 26.991 L 27.723 26.99 C 28.483 26.93 28.903 26.06 28.463 25.43 C 28.293 25.18 28.023 25.02 27.723 25 L 25 25 L 25 22 L 23 22 L 23 25 L 20 25 L 20 22 L 18 22 L 18 25 L 15 25 L 15 22 L 13 22 L 13 25 L 10 25 L 10 22 L 8 22 L 8 25 L 6 25 Z"/>',
  solidBadged: '<path d="M 34 12.34 L 34 29 C 34 30.105 33.105 31 32 31 L 4 31 C 2.896 31 2 30.105 2 29 L 2 7 C 2 5.896 2.896 5 4 5 L 22.57 5 C 21.969 9.233 25.05 13.1 29.31 13.46 L 30.32 13.48 C 31.626 13.429 32.895 13.036 34 12.34 Z M 6 26.991 L 27.723 26.99 C 28.483 26.93 28.903 26.06 28.463 25.43 C 28.293 25.18 28.023 25.02 27.723 25 L 25 25 L 25 22 L 23 22 L 23 25 L 20 25 L 20 22 L 18 22 L 18 25 L 15 25 L 15 22 L 13 22 L 13 25 L 10 25 L 10 22 L 8 22 L 8 25 L 6 25 Z"/>'
};
var tickChartIconName = "tick-chart";
var tickChartIcon = [tickChartIconName, renderIcon(icon175)];

// node_modules/@clr/core/icon/shapes/bank.js
var icon176 = {
  outline: '<path d="M3.5,13.56,18,5.23l14.5,8.33a1,1,0,0,0,1-1.73L18,2.92,2.5,11.83a1,1,0,1,0,1,1.73Z"/><path d="M4,26a1,1,0,0,0,1,1H31a1,1,0,0,0,0-2H28V17.63H26V25H19V17.63H17V25H10V17.63H8V25H5A1,1,0,0,0,4,26Z"/><rect x="5.02" y="14" width="26" height="2"/><path d="M33,29H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z"/><path d="M22.15,11.58h3.21L18.65,7.72a.8.8,0,0,0-.8,0l-6.72,3.86h3.21l3.9-2.24Z"/>',
  outlineAlerted: '<path d="M4,26a1,1,0,0,0,1,1H31a1,1,0,0,0,0-2H28V17.63H26V25H19V17.63H17V25H10V17.63H8V25H5A1,1,0,0,0,4,26Z"/><path d="M33,29H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z"/><path d="M22.5,15A3.51,3.51,0,0,1,20,14H5v2H31V15Z"/><path d="M19.46,9.74l.68-1.17-1.49-.85a.8.8,0,0,0-.8,0l-6.72,3.86h3.21l3.9-2.24,1.1.63C19.39,9.89,19.42,9.81,19.46,9.74Z"/><path d="M22.05,5.25,18,2.92,2.5,11.83a1,1,0,1,0,1,1.73L18,5.23,21.05,7Z"/>',
  outlineBadged: '<path d="M4,26a1,1,0,0,0,1,1H31a1,1,0,0,0,0-2H28V17.63H26V25H19V17.63H17V25H10V17.63H8V25H5A1,1,0,0,0,4,26Z"/><rect x="5.02" y="14" width="26" height="2"/><path d="M33,29H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z"/><path d="M22.15,11.58h3.21L18.65,7.72a.8.8,0,0,0-.8,0l-6.72,3.86h3.21l3.9-2.24Z"/><path d="M22.5,6c0-.16,0-.32,0-.48L18,2.92,2.5,11.83a1,1,0,1,0,1,1.73L18,5.23,22.77,8A7.49,7.49,0,0,1,22.5,6Z"/><path d="M31.94,13.24l.56.32a1,1,0,0,0,1.44-1.19A7.45,7.45,0,0,1,31.94,13.24Z"/>',
  solid: '<path d="M3.5,13.56,5,12.68V16H31V12.71l1.48.85a1,1,0,0,0,1-1.73L18,2.92,2.5,11.83a1,1,0,1,0,1,1.73ZM17.85,7.11a.8.8,0,0,1,.8,0L25.37,11H22.15l-3.9-2.24L14.35,11H11.14Z"/><path d="M32.85,27H32v-.85A1.15,1.15,0,0,0,30.85,25H28V17.63H24V25H20V17.63H16V25H12V17.63H8V25H5.15A1.15,1.15,0,0,0,4,26.15V27H3.15A1.15,1.15,0,0,0,2,28.15V31H34V28.15A1.15,1.15,0,0,0,32.85,27Z"/>',
  solidAlerted: '<path d="M32.85,27H32v-.85A1.15,1.15,0,0,0,30.85,25H28V17.63H24V25H20V17.63H16V25H12V17.63H8V25H5.15A1.15,1.15,0,0,0,4,26.15V27H3.15A1.15,1.15,0,0,0,2,28.15V31H34V28.15A1.15,1.15,0,0,0,32.85,27Z"/><path d="M22.5,15a3.51,3.51,0,0,1-3-5.26l.14-.24-1.35-.78L14.35,11H11.14l6.72-3.86a.8.8,0,0,1,.8,0l1.75,1,1.65-2.86L18,2.92,2.5,11.83a1,1,0,1,0,1,1.73L5,12.68V16H31V15Z"/>',
  solidBadged: '<path d="M32.85,27H32v-.85A1.15,1.15,0,0,0,30.85,25H28V17.63H24V25H20V17.63H16V25H12V17.63H8V25H5.15A1.15,1.15,0,0,0,4,26.15V27H3.15A1.15,1.15,0,0,0,2,28.15V31H34V28.15A1.15,1.15,0,0,0,32.85,27Z"/><path d="M30,13.5A7.47,7.47,0,0,1,24.39,11H22.15l-3.9-2.24L14.35,11H11.14l6.72-3.86a.8.8,0,0,1,.8,0l5,2.87A7.45,7.45,0,0,1,22.5,6c0-.16,0-.32,0-.48L18,2.92,2.5,11.83a1,1,0,1,0,1,1.73L5,12.68V16H31V13.42A7.53,7.53,0,0,1,30,13.5Z"/><path d="M31.94,13.24l.56.32a1,1,0,0,0,1.44-1.19A7.45,7.45,0,0,1,31.94,13.24Z"/>'
};
var bankIconName = "bank";
var bankIcon = [bankIconName, renderIcon(icon176)];

// node_modules/@clr/core/icon/shapes/bitcoin.js
var icon177 = {
  outline: '<path d="M24.11,16.88A5.49,5.49,0,0,0,21,7V4a1,1,0,0,0-2,0V7H16V4a1,1,0,0,0-2,0V7H11a1,1,0,0,0-1,1V28a1,1,0,0,0,1,1h3v3a1,1,0,0,0,2,0V29h3v3a1,1,0,0,0,2,0V29h.08A6.07,6.07,0,0,0,27,22.81v-.62A6.25,6.25,0,0,0,24.11,16.88ZM12,9h8.69a3.59,3.59,0,0,1,3.43,2.36A3.51,3.51,0,0,1,20.79,16H12ZM25,22.81A4.08,4.08,0,0,1,21.06,27H12V18h9.06A4.08,4.08,0,0,1,25,22.19Z"/>',
  solid: '<path d="M21.18,18.47H14.5v6h6.68a2.7,2.7,0,0,0,2.63-2.77v-.48A2.71,2.71,0,0,0,21.18,18.47Z"/><path d="M23,13.75a2.24,2.24,0,0,0-2.23-2.25H14.5V16h6.3A2.22,2.22,0,0,0,23,13.75Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm8.31,19.73A5.22,5.22,0,0,1,21.18,27H21v1.9a1,1,0,0,1-2,0V27H17v1.9a1,1,0,0,1-2,0V27H13.25A1.25,1.25,0,0,1,12,25.75V17.23h0v-7A1.25,1.25,0,0,1,13.25,9H15V7.07a1,1,0,0,1,2,0V9h2V7.07a1,1,0,0,1,2,0V9a4.72,4.72,0,0,1,3.2,8,5.31,5.31,0,0,1,2.11,4.24Z"/>'
};
var bitcoinIconName = "bitcoin";
var bitcoinIcon = [bitcoinIconName, renderIcon(icon177)];

// node_modules/@clr/core/icon/shapes/calculator.js
var icon178 = {
  outline: '<path d="M28,2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V4A2,2,0,0,0,28,2ZM8,32V4H28V32Z"/><path d="M12,8H25.67V6H11a1,1,0,0,0-1,1v4.67h2Z"/><polygon points="12 16 10 16 10 18 14 18 14 14 12 14 12 16"/><polygon points="24 16 22 16 22 18 26 18 26 14 24 14 24 16"/><polygon points="18 16 16 16 16 18 20 18 20 14 18 14 18 16"/><polygon points="12 22 10 22 10 24 14 24 14 20 12 20 12 22"/><polygon points="24 22 22 22 22 24 26 24 26 20 24 20 24 22"/><polygon points="18 22 16 22 16 24 20 24 20 20 18 20 18 22"/><polygon points="12 28 10 28 10 30 14 30 14 26 12 26 12 28"/><polygon points="24 28 22 28 22 30 26 30 26 26 24 26 24 28"/><polygon points="18 28 16 28 16 30 20 30 20 26 18 26 18 28"/>',
  solid: '<path d="M28,2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V4A2,2,0,0,0,28,2ZM12,28H10V26h2Zm0-6H10V20h2Zm0-6H10V14h2Zm7,12H17V26h2Zm0-6H17V20h2Zm0-6H17V14h2Zm7,12H24V26h2Zm0-6H24V20h2Zm0-6H24V14h2Zm0-7H10V5H26Z"/>'
};
var calculatorIconName = "calculator";
var calculatorIcon = [calculatorIconName, renderIcon(icon178)];

// node_modules/@clr/core/icon/shapes/coin-bag.js
var icon179 = {
  outline: '<path d="M21.6,29a1,1,0,0,0-1-1h-6a1,1,0,0,0,0,2h6A1,1,0,0,0,21.6,29Z"/><path d="M22.54,24h-6a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"/><path d="M22,32H16a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"/><path d="M32.7,32h-7a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Z"/><path d="M33.7,28h-7a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Z"/><path d="M33.74,26a28,28,0,0,0-2.82-10.12A20.24,20.24,0,0,0,24.6,8.71L27,3.42a1,1,0,0,0-.07-1A1,1,0,0,0,26.13,2H9.8a1,1,0,0,0-.91,1.42l2.45,5.31a20.33,20.33,0,0,0-6.28,7.15c-2.15,4-2.82,8.89-3,12.28a3.6,3.6,0,0,0,1,2.71A3.79,3.79,0,0,0,5.8,31.94H12V30H5.72a1.68,1.68,0,0,1-1.21-.52,1.62,1.62,0,0,1-.45-1.23c.14-2.61.69-7.58,2.76-11.45A18,18,0,0,1,13.08,10h1a30.81,30.81,0,0,0-1.87,2.92,22.78,22.78,0,0,0-1.47,3.34l1.37.92a24,24,0,0,1,1.49-3.47A29.1,29.1,0,0,1,16.05,10h1a21.45,21.45,0,0,1,1.41,5,22.54,22.54,0,0,1,.32,3.86l1.58-1.11a24.15,24.15,0,0,0-.32-3A24.82,24.82,0,0,0,18.76,10h.78l.91-2H13.21L11.36,4H24.57l-2.5,5.47a9.93,9.93,0,0,1,1.23.78,18.63,18.63,0,0,1,5.86,6.57A26.59,26.59,0,0,1,31.73,26Z"/>',
  solid: '<path d="M24.89,26h7.86c-.66-8.71-4.41-14.12-9.22-17.32L25.72,3.9a1,1,0,0,0-.91-1.4H11.1a1,1,0,0,0-.91,1.4l1.2,2.6H21.51l-.9,2H18.76A24.9,24.9,0,0,1,20,13.19a24.49,24.49,0,0,1,.32,3l-1.58,1.11a22.54,22.54,0,0,0-.32-3.86A21.74,21.74,0,0,0,17,8.5h-1a28.22,28.22,0,0,0-2.48,3.7,23.91,23.91,0,0,0-1.49,3.46l-1.37-.91a22.78,22.78,0,0,1,1.47-3.34A30.81,30.81,0,0,1,14.05,8.5H12.3l.08.17C7.08,12.2,3.05,18.4,3.05,28.75A1.65,1.65,0,0,0,4.61,30.5h8A2.67,2.67,0,0,1,14.21,26a2.67,2.67,0,0,1-.37-1.34,2.7,2.7,0,0,1,2.7-2.7h6a2.7,2.7,0,0,1,2.7,2.7A2.63,2.63,0,0,1,24.89,26Z"/><path d="M21.6,28.5a1,1,0,0,0-1-1h-6a1,1,0,0,0,0,2h6A1,1,0,0,0,21.6,28.5Z"/><path d="M22.54,23.5h-6a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"/><path d="M22,31.5H16a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"/><path d="M32.7,31.5h-7a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Z"/><path d="M33.7,27.5h-7a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Z"/>'
};
var coinBagIconName = "coin-bag";
var coinBagIcon = [coinBagIconName, renderIcon(icon179)];

// node_modules/@clr/core/icon/shapes/credit-card.js
var icon180 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,2,0,12H4L4,8ZM4,28V24H32v4Z"/>',
  solid: '<rect x="7" y="3" width="22" height="30" rx="0.96" ry="0.96" transform="translate(36) rotate(90)" fill="none" stroke="#000" stroke-linejoin="round" stroke-width="2"/><path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,18H4V20H32Z"/>'
};
var creditCardIconName = "credit-card";
var creditCardIcon = [creditCardIconName, renderIcon(icon180)];

// node_modules/@clr/core/icon/shapes/dollar.js
var icon181 = {
  outline: '<path d="M26,21.15a6.91,6.91,0,0,0-4.38-3.32A26,26,0,0,0,19,17.19V8.12A10.05,10.05,0,0,1,23.86,10a1,1,0,0,0,1.33-1.5A11.75,11.75,0,0,0,19,6.1V3a1,1,0,0,0-2,0V6c-4.4.1-6.83,2.29-7.57,4.18A5.56,5.56,0,0,0,11.66,17,13.2,13.2,0,0,0,17,18.84V28a12.3,12.3,0,0,1-7.14-2.74A1,1,0,1,0,8.49,26.7,14.09,14.09,0,0,0,17,30v3a1,1,0,0,0,2,0V30c2.82-.19,6.07-1.09,7.3-4.76A5.33,5.33,0,0,0,26,21.15ZM12.79,15.32a3.57,3.57,0,0,1-1.49-4.39C11.41,10.63,12.53,8.12,17,8v8.8A10.7,10.7,0,0,1,12.79,15.32ZM24.4,24.56c-.72,2.14-2.32,3.17-5.4,3.4V19.23c.64.14,1.3.3,2,.51a5,5,0,0,1,3.19,2.32A3.34,3.34,0,0,1,24.4,24.56Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm7.65,21.59c-1,3-3.61,3.84-5.9,4v2a1.25,1.25,0,0,1-2.5,0V27.59A11.47,11.47,0,0,1,11,25a1.25,1.25,0,1,1,1.71-1.83,9.11,9.11,0,0,0,4.55,1.94V18.83a9.63,9.63,0,0,1-3.73-1.41,4.8,4.8,0,0,1-1.91-5.84c.59-1.51,2.42-3.23,5.64-3.51V6.25a1.25,1.25,0,0,1,2.5,0V8.11a9.67,9.67,0,0,1,4.9,2A1.25,1.25,0,0,1,23,11.95a7.14,7.14,0,0,0-3.24-1.31v6.13c.6.13,1.24.27,1.91.48a5.85,5.85,0,0,1,3.69,2.82A4.64,4.64,0,0,1,25.65,23.59Z"/><path d="M20.92,19.64c-.4-.12-.79-.22-1.17-.3v5.76c2-.2,3.07-.9,3.53-2.3a2.15,2.15,0,0,0-.15-1.58A3.49,3.49,0,0,0,20.92,19.64Z"/><path d="M13.94,12.48a2.31,2.31,0,0,0,1,2.87,6.53,6.53,0,0,0,2.32.92V10.55C15.16,10.8,14.19,11.84,13.94,12.48Z"/>'
};
var dollarIconName = "dollar";
var dollarIcon = [dollarIconName, renderIcon(icon181)];

// node_modules/@clr/core/icon/shapes/dollar-bill.js
var icon182 = {
  outline: '<path d="M32,8H4a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8Zm0,6a4.25,4.25,0,0,1-3.9-4H32Zm0,1.62v4.83A5.87,5.87,0,0,0,26.49,26h-17A5.87,5.87,0,0,0,4,20.44V15.6A5.87,5.87,0,0,0,9.51,10h17A5.87,5.87,0,0,0,32,15.6ZM7.9,10A4.25,4.25,0,0,1,4,14V10ZM4,22.06A4.25,4.25,0,0,1,7.9,26H4ZM28.1,26A4.25,4.25,0,0,1,32,22.06V26Z"/><path d="M18,10.85c-3.47,0-6.3,3.21-6.3,7.15s2.83,7.15,6.3,7.15,6.3-3.21,6.3-7.15S21.47,10.85,18,10.85Zm0,12.69c-2.59,0-4.7-2.49-4.7-5.55s2.11-5.55,4.7-5.55,4.7,2.49,4.7,5.55S20.59,23.55,18,23.55Z"/>',
  solid: '<path d="M32,8H4a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8ZM4,26V21.15A5.18,5.18,0,0,1,8.79,26ZM4,14.85V10H8.79A5.18,5.18,0,0,1,4,14.85ZM18,25.15c-3.47,0-6.3-3.21-6.3-7.15s2.83-7.15,6.3-7.15,6.3,3.21,6.3,7.15S21.47,25.15,18,25.15ZM32,26H27.25A5.18,5.18,0,0,1,32,21.15Zm0-11.15A5.18,5.18,0,0,1,27.25,10H32Z"/><ellipse cx="18" cy="18" rx="4" ry="4.72"/>'
};
var dollarBillIconName = "dollar-bill";
var dollarBillIcon = [dollarBillIconName, renderIcon(icon182)];

// node_modules/@clr/core/icon/shapes/e-check.js
var icon183 = {
  outline: '<rect x="16" y="16" width="15" height="2"/><rect x="20" y="21" width="11" height="2"/><path d="M34,8H12.93a8.35,8.35,0,0,1,.79,2H33V26H3V19.9a7.83,7.83,0,0,1-2-1.34V27a1,1,0,0,0,1,1H34a1,1,0,0,0,1-1V9A1,1,0,0,0,34,8Z"/><path d="M6.57,18.68a6.17,6.17,0,0,0,4.32-1.59,1.2,1.2,0,0,0,.36-.84,1.08,1.08,0,0,0-1.09-1.11,1,1,0,0,0-.71.25,4.32,4.32,0,0,1-2.84,1,3.35,3.35,0,0,1-3.46-3h7.53A1.29,1.29,0,0,0,12,12.06,5.68,5.68,0,0,0,6.27,6.14,6,6,0,0,0,.4,12.4v0A6,6,0,0,0,6.57,18.68ZM6.25,8.39c1.82,0,2.87,1.39,3,3.16H3.13C3.38,9.69,4.56,8.39,6.25,8.39Z"/>',
  solid: '<path d="M34,8H12.91a8.61,8.61,0,0,1,1.2,4.39,8,8,0,0,1-7.78,8.27A7.51,7.51,0,0,1,1,18.41V27a1,1,0,0,0,1,1H34a1,1,0,0,0,1-1V9A1,1,0,0,0,34,8ZM31,23H20V21H31Zm0-5H16V16H31Z"/><path d="M6.57,18.68A6,6,0,0,1,.4,12.44v0A6,6,0,0,1,6.27,6.14,5.68,5.68,0,0,1,12,12.06a1.29,1.29,0,0,1-1.3,1.32H3.15a3.35,3.35,0,0,0,3.46,3,4.32,4.32,0,0,0,2.84-1,1,1,0,0,1,.71-.25,1.08,1.08,0,0,1,1.09,1.11,1.2,1.2,0,0,1-.36.84A6.17,6.17,0,0,1,6.57,18.68ZM9.3,11.55c-.18-1.77-1.23-3.16-3-3.16s-2.87,1.3-3.12,3.16Z"/>'
};
var eCheckIconName = "e-check";
var eCheckIcon = [eCheckIconName, renderIcon(icon183)];

// node_modules/@clr/core/icon/shapes/employee.js
var icon184 = {
  outline: '<path d="M16.43,16.69a7,7,0,1,1,7-7A7,7,0,0,1,16.43,16.69Zm0-11.92a5,5,0,1,0,5,5A5,5,0,0,0,16.43,4.77Z"/><path d="M22,17.9A25.41,25.41,0,0,0,5.88,19.57a4.06,4.06,0,0,0-2.31,3.68V29.2a1,1,0,1,0,2,0V23.25a2,2,0,0,1,1.16-1.86,22.91,22.91,0,0,1,9.7-2.11,23.58,23.58,0,0,1,5.57.66Z"/><rect x="22.14" y="27.41" width="6.14" height="1.4"/><path d="M33.17,21.47H28v2h4.17v8.37H18V23.47h6.3v.42a1,1,0,0,0,2,0V20a1,1,0,0,0-2,0v1.47H17a1,1,0,0,0-1,1V32.84a1,1,0,0,0,1,1H33.17a1,1,0,0,0,1-1V22.47A1,1,0,0,0,33.17,21.47Z"/>',
  solid: '<circle cx="16.86" cy="9.73" r="6.46"/><rect x="21" y="28" width="7" height="1.4"/><path d="M15,30v3a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1H26V20.53a1,1,0,0,0-2,0V22H22V18.42A32.12,32.12,0,0,0,16.86,18a26,26,0,0,0-11,2.39,3.28,3.28,0,0,0-1.88,3V30Zm17,2H17V24h7v.42a1,1,0,0,0,2,0V24h6Z"/>'
};
var employeeIconName = "employee";
var employeeIcon = [employeeIconName, renderIcon(icon184)];

// node_modules/@clr/core/icon/shapes/employee-group.js
var icon185 = {
  outline: '<path d="M18.42,16.31a5.7,5.7,0,1,1,5.76-5.7A5.74,5.74,0,0,1,18.42,16.31Zm0-9.4a3.7,3.7,0,1,0,3.76,3.7A3.74,3.74,0,0,0,18.42,6.91Z"/><path d="M18.42,16.31a5.7,5.7,0,1,1,5.76-5.7A5.74,5.74,0,0,1,18.42,16.31Zm0-9.4a3.7,3.7,0,1,0,3.76,3.7A3.74,3.74,0,0,0,18.42,6.91Z"/><path d="M21.91,17.65a20.6,20.6,0,0,0-13,2A1.77,1.77,0,0,0,8,21.25v3.56a1,1,0,0,0,2,0V21.38a18.92,18.92,0,0,1,12-1.68Z"/><path d="M33,22H26.3V20.52a1,1,0,0,0-2,0V22H17a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V23A1,1,0,0,0,33,22ZM32,32H18V24h6.3v.41a1,1,0,0,0,2,0V24H32Z"/><rect x="21.81" y="27.42" width="5.96" height="1.4"/><path d="M10.84,12.24a18,18,0,0,0-7.95,2A1.67,1.67,0,0,0,2,15.71v3.1a1,1,0,0,0,2,0v-2.9a16,16,0,0,1,7.58-1.67A7.28,7.28,0,0,1,10.84,12.24Z"/><path d="M33.11,14.23a17.8,17.8,0,0,0-7.12-2,7.46,7.46,0,0,1-.73,2A15.89,15.89,0,0,1,32,15.91v2.9a1,1,0,1,0,2,0v-3.1A1.67,1.67,0,0,0,33.11,14.23Z"/><path d="M10.66,10.61c0-.23,0-.45,0-.67a3.07,3.07,0,0,1,.54-6.11,3.15,3.15,0,0,1,2.2.89,8.16,8.16,0,0,1,1.7-1.08,5.13,5.13,0,0,0-9,3.27,5.1,5.1,0,0,0,4.7,5A7.42,7.42,0,0,1,10.66,10.61Z"/><path d="M24.77,1.83a5.17,5.17,0,0,0-3.69,1.55,7.87,7.87,0,0,1,1.9,1,3.14,3.14,0,0,1,4.93,2.52,3.09,3.09,0,0,1-1.79,2.77,7.14,7.14,0,0,1,.06.93,7.88,7.88,0,0,1-.1,1.2,5.1,5.1,0,0,0,3.83-4.9A5.12,5.12,0,0,0,24.77,1.83Z"/>',
  solid: '<ellipse cx="18" cy="11.28" rx="4.76" ry="4.7"/><path d="M10.78,11.75c.16,0,.32,0,.48,0,0-.15,0-.28,0-.43a6.7,6.7,0,0,1,3.75-6,4.62,4.62,0,1,0-4.21,6.46Z"/><path d="M24.76,11.28c0,.15,0,.28,0,.43.16,0,.32,0,.48,0A4.58,4.58,0,1,0,21,5.29,6.7,6.7,0,0,1,24.76,11.28Z"/><path d="M22.29,16.45a21.45,21.45,0,0,1,5.71,2,2.71,2.71,0,0,1,.68.53H34V15.56a.72.72,0,0,0-.38-.64,18,18,0,0,0-8.4-2.05l-.66,0A6.66,6.66,0,0,1,22.29,16.45Z"/><path d="M6.53,20.92A2.76,2.76,0,0,1,8,18.47a21.45,21.45,0,0,1,5.71-2,6.66,6.66,0,0,1-2.27-3.55l-.66,0a18,18,0,0,0-8.4,2.05.72.72,0,0,0-.38.64V22H6.53Z"/><rect x="21.46" y="26.69" width="5.96" height="1.4"/><path d="M32.81,21.26H25.94v-1a1,1,0,0,0-2,0v1H22V18.43A20.17,20.17,0,0,0,18,18a19.27,19.27,0,0,0-9.06,2.22.76.76,0,0,0-.41.68v5.61h7.11v6.09a1,1,0,0,0,1,1H32.81a1,1,0,0,0,1-1V22.26A1,1,0,0,0,32.81,21.26Zm-1,10.36H17.64V23.26h6.3v.91a1,1,0,0,0,2,0v-.91h5.87Z"/>'
};
var employeeGroupIconName = "employee-group";
var employeeGroupIcon = [employeeGroupIconName, renderIcon(icon185)];

// node_modules/@clr/core/icon/shapes/euro.js
var icon186 = {
  outline: '<path d="M31.48,28.49a1,1,0,0,0-1.38-.32A12,12,0,0,1,12.45,22H24.16a1,1,0,0,0,0-2H11.93a11.16,11.16,0,0,1,0-4H24.16a1,1,0,0,0,0-2H12.45A12,12,0,0,1,30.06,7.8a1,1,0,0,0,1.06-1.7A14,14,0,0,0,10.34,14H3.54a1,1,0,1,0,0,2H9.91a14,14,0,0,0-.16,2,14,14,0,0,0,.16,2H3.54a1,1,0,1,0,0,2h6.8a14,14,0,0,0,20.83,7.87A1,1,0,0,0,31.48,28.49Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm7.42,25.16A10.88,10.88,0,0,1,9.23,21H5.84a1,1,0,0,1,0-2h3c0-.35-.05-.71-.05-1.07s0-.63,0-.93h-3a1,1,0,0,1,0-2H9.19A10.86,10.86,0,0,1,25.38,8.69a1.25,1.25,0,0,1-1.32,2.12A8.36,8.36,0,0,0,11.82,15h9.36a1,1,0,0,1,0,2H11.33a7.72,7.72,0,0,0,0,2h9.82a1,1,0,0,1,0,2H11.87a8.36,8.36,0,0,0,12.22,4,1.25,1.25,0,1,1,1.33,2.12Z"/>'
};
var euroIconName = "euro";
var euroIcon = [euroIconName, renderIcon(icon186)];

// node_modules/@clr/core/icon/shapes/factory.js
var icon187 = {
  outline: '<path d="M33.47,7.37a1,1,0,0,0-1,.06L23,13.77V8.26a1,1,0,0,0-1.64-.77L13.48,14H10V4.62a1,1,0,0,0-.78-1l-4-.9a1,1,0,0,0-.85.2A1,1,0,0,0,4,3.73V14H3a1,1,0,0,0-1,1V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V8.26A1,1,0,0,0,33.47,7.37ZM6,5l2,.44V14H6ZM32,30H4V16h9.83a1,1,0,0,0,.64-.23L21,10.37v5.28a1,1,0,0,0,1.56.83L32,10.14Z"/><rect x="6" y="17.99" width="8" height="2"/><rect x="6" y="21.99" width="8" height="2"/><rect x="6" y="25.99" width="8" height="2"/><rect x="19" y="18.99" width="2" height="3"/><rect x="19" y="24.99" width="2" height="3"/><rect x="23" y="18.99" width="2" height="3"/><rect x="23" y="24.99" width="2" height="3"/><rect x="27" y="18.99" width="2" height="3"/><rect x="27" y="24.99" width="2" height="3"/>',
  solid: '<path d="M32.45,8.44,22,15.3V9.51a1,1,0,0,0-1.63-.78L14.07,14H10V4.06L4,2.71V14H2V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V9.27A1,1,0,0,0,32.45,8.44ZM14,29H6V27h8Zm0-4H6V23h8Zm0-4H6V19h8Zm8,8H20V26h2Zm0-6H20V20h2Zm4,6H24V26h2Zm0-6H24V20h2Zm4,6H28V26h2Zm0-6H28V20h2Z"/>'
};
var factoryIconName = "factory";
var factoryIcon = [factoryIconName, renderIcon(icon187)];

// node_modules/@clr/core/icon/shapes/peso.js
var icon188 = {
  outline: '<path d="M31,13.2H27.89A6.81,6.81,0,0,0,28,12a7.85,7.85,0,0,0-.1-1.19h2.93a.8.8,0,0,0,0-1.6H27.46A8.44,8.44,0,0,0,19.57,4H11a1,1,0,0,0-1,1V9.2H7a.8.8,0,0,0,0,1.6h3v2.4H7a.8.8,0,0,0,0,1.6h3V31a1,1,0,0,0,2,0V20h7.57a8.45,8.45,0,0,0,7.89-5.2H31a.8.8,0,0,0,0-1.6ZM12,6h7.57a6.51,6.51,0,0,1,5.68,3.2H12Zm0,4.8H25.87a5.6,5.6,0,0,1,0,2.4H12ZM19.57,18H12V14.8H25.25A6.51,6.51,0,0,1,19.57,18Z"/>',
  solid: '<path d="M14.18,13.8V16h9.45a5.26,5.26,0,0,0,.08-.89,4.72,4.72,0,0,0-.2-1.31Z"/><path d="M14.18,19.7h5.19a4.28,4.28,0,0,0,3.5-1.9H14.18Z"/><path d="M19.37,10.51H14.18V12h8.37A4.21,4.21,0,0,0,19.37,10.51Z"/><path d="M17.67,2a16,16,0,1,0,16,16A16,16,0,0,0,17.67,2Zm10.5,15.8H25.7a6.87,6.87,0,0,1-6.33,4.4H14.18v6.54a1.25,1.25,0,1,1-2.5,0V17.8H8.76a.9.9,0,1,1,0-1.8h2.92V13.8H8.76a.9.9,0,1,1,0-1.8h2.92V9.26A1.25,1.25,0,0,1,12.93,8h6.44a6.84,6.84,0,0,1,6.15,4h2.65a.9.9,0,0,1,0,1.8H26.09a6.91,6.91,0,0,1,.12,1.3,6.8,6.8,0,0,1-.06.9h2a.9.9,0,0,1,0,1.8Z"/>'
};
var pesoIconName = "peso";
var pesoIcon = [pesoIconName, renderIcon(icon188)];

// node_modules/@clr/core/icon/shapes/piggy-bank.js
var icon189 = {
  outline: '<path d="M19.72,10.47a11.65,11.65,0,0,0-6.31.52A.8.8,0,1,0,14,12.48,10.11,10.11,0,0,1,19.44,12a.8.8,0,1,0,.28-1.57Z"/><circle cx="25.38" cy="16.71" r="1.36"/><path d="M35.51,18.63a1,1,0,0,0-.84-.44,3.42,3.42,0,0,1-2.09-1.12,17.35,17.35,0,0,1-2.63-3.78l2.88-4.5A1.89,1.89,0,0,0,33,7a1.77,1.77,0,0,0-1.33-1,10.12,10.12,0,0,0-5.39.75,12.72,12.72,0,0,0-2.72,1.63,16.94,16.94,0,0,0-5.16-1.39C11.31,6.3,4.83,10.9,4,17H4a2.56,2.56,0,0,1-1.38-1.53,1.81,1.81,0,0,1,.14-1.4,1.19,1.19,0,0,1,.43-.43,1.08,1.08,0,0,0-1.12-1.85A3.31,3.31,0,0,0,.91,13a4,4,0,0,0-.33,3.08A4.76,4.76,0,0,0,3,18.95l.92.46a17.58,17.58,0,0,0,1.82,7l.17.38A23,23,0,0,0,9.2,31.88a1,1,0,0,0,.75.34h4.52a1,1,0,0,0,.92-1.38L15,29.94l1.18.13a20.33,20.33,0,0,0,4,0c.37.6.77,1.2,1.21,1.79a1,1,0,0,0,.8.41h4.34a1,1,0,0,0,.92-1.39c-.17-.4-.34-.83-.47-1.2-.18-.53-.32-1-.43-1.45A13.18,13.18,0,0,0,29.56,26a12.5,12.5,0,0,0,3,0,1,1,0,0,0,.78-.62l2.26-5.81A1,1,0,0,0,35.51,18.63Zm-3.78,5.44a11.37,11.37,0,0,1-2.35-.11h0a8.2,8.2,0,0,1-2.53-.87,1,1,0,0,0-.93,1.77,11.72,11.72,0,0,0,1.29.58,8,8,0,0,1-1.8,1.16l-1.06.48s.49,2.19.82,3.16H22.79c-.24-.34-1.45-2.36-1.45-2.36l-.67.09a18.53,18.53,0,0,1-4.25.12c-.66-.06-1.76-.2-2.62-.35l-1.55-.27s.63,2.43.75,2.74v0H10.42A20.57,20.57,0,0,1,7.76,26l-.18-.39A14.62,14.62,0,0,1,6,17.48c.54-5.19,6.12-9.11,12.19-8.54a15.47,15.47,0,0,1,5.08,1.48l.62.29.5-.47A10.29,10.29,0,0,1,27,8.54a8.25,8.25,0,0,1,4-.65l-3.38,5.29.25.5h0a21.16,21.16,0,0,0,3.31,4.84,6.49,6.49,0,0,0,2.14,1.39Z"/>',
  solid: '<path d="M35,18.87A5.83,5.83,0,0,1,33,17.61a21.63,21.63,0,0,1-3.29-4.84l3.39-5.29a.9.9,0,0,0-.54-1.38,9.67,9.67,0,0,0-5.13.72,12,12,0,0,0-3.13,2A17.37,17.37,0,0,0,18.6,7.15C11.8,6.52,5.27,10.9,4.54,17l-.14-.07A2.76,2.76,0,0,1,2.9,15.29a2,2,0,0,1,.15-1.55,1.32,1.32,0,0,1,.47-.48,1.08,1.08,0,1,0-1.12-1.85,3.45,3.45,0,0,0-1.23,1.25A4.16,4.16,0,0,0,.84,15.9a5,5,0,0,0,2.57,3l1,.54a18.62,18.62,0,0,0,2,7.3,23,23,0,0,0,3,4.79,1,1,0,0,0,.8.38h3.61a.52.52,0,0,0,.4-.75L14,30.38a11,11,0,0,1-.33-1.18c.91.16,2.08.31,2.87.38a20.07,20.07,0,0,0,3.12,0c.39.7.79,1.33,1.15,1.85a.93.93,0,0,0,.77.41h3.11a.65.65,0,0,0,.61-.85c-.23-.74-.53-1.75-.71-2.37a15.9,15.9,0,0,0,3.75-1.76c.16-.11.32-.26.48-.39a13.77,13.77,0,0,1-2.42-1,.8.8,0,0,1,.74-1.42,11.64,11.64,0,0,0,3.18,1.1,13.31,13.31,0,0,0,2.68.12,1,1,0,0,0,.9-.66l1.73-4.44A1,1,0,0,0,35,18.87ZM13.79,11.59a.86.86,0,0,1-.3.05.85.85,0,0,1-.3-1.64,12.41,12.41,0,0,1,6.69-.55.85.85,0,1,1-.3,1.67A10.75,10.75,0,0,0,13.79,11.59Zm12.52,6.12a1.44,1.44,0,1,1,1.44-1.44A1.44,1.44,0,0,1,26.32,17.72Z"/>'
};
var piggyBankIconName = "piggy-bank";
var piggyBankIcon = [piggyBankIconName, renderIcon(icon189)];

// node_modules/@clr/core/icon/shapes/pound.js
var icon190 = {
  outline: '<path d="M27.9,30H13.4A8.45,8.45,0,0,0,15,24.65V21h4.31a1,1,0,0,0,0-2H15V11.31A5.24,5.24,0,0,1,20.21,6,5.19,5.19,0,0,1,24,7.73a1,1,0,0,0,1.48-1.35A7.19,7.19,0,0,0,13,11.31V19H8.72a1,1,0,1,0,0,2H13v3.65C13,29.38,10.12,30,10,30a1,1,0,0,0,.17,2H27.9a1,1,0,1,0,0-2Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm6.5,25.92H11.74a1.25,1.25,0,0,1-.22-2.48c.15,0,1.72-.49,1.72-3.54V19h-2.5a1,1,0,0,1,0-2h2.5V11.88a5.85,5.85,0,0,1,5.72-6,5.63,5.63,0,0,1,4.21,1.94A1.25,1.25,0,1,1,21.3,9.51,3.08,3.08,0,0,0,19,8.42a3.35,3.35,0,0,0-3.22,3.46V17h3a1,1,0,0,1,0,2h-3v2.9A7.65,7.65,0,0,1,15,25.42H24.5a1.25,1.25,0,0,1,0,2.5Z"/>'
};
var poundIconName = "pound";
var poundIcon = [poundIconName, renderIcon(icon190)];

// node_modules/@clr/core/icon/shapes/ruble.js
var icon191 = {
  outline: '<path d="M20.57,20A8.23,8.23,0,0,0,29,12a8.23,8.23,0,0,0-8.43-8H12a1,1,0,0,0-1,1V18H9a1,1,0,0,0,0,2h2v2H9a1,1,0,0,0,0,2h2v7a1,1,0,0,0,2,0V24h9a1,1,0,0,0,0-2H13V20ZM13,6h7.57A6.24,6.24,0,0,1,27,12a6.23,6.23,0,0,1-6.43,6H13Z"/>',
  solid: '<path d="M20.75,9.25H15v8.81h5.79a4.66,4.66,0,0,0,4.86-4.4A4.65,4.65,0,0,0,20.75,9.25Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm2.75,18.56H15V22h8.29a1,1,0,0,1,0,2H15v5a1.25,1.25,0,0,1-2.5,0V24H11.25a1,1,0,0,1,0-2h1.21V20.56H11.25a1.25,1.25,0,0,1,0-2.5h1.21V8a1.25,1.25,0,0,1,1.25-1.25h7a7.14,7.14,0,0,1,7.36,6.9A7.15,7.15,0,0,1,20.75,20.56Z"/>'
};
var rubleIconName = "ruble";
var rubleIcon = [rubleIconName, renderIcon(icon191)];

// node_modules/@clr/core/icon/shapes/rupee.js
var icon192 = {
  outline: '<path d="M28,8H24.14A7.52,7.52,0,0,0,22.6,6H28a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2h7.55a5.42,5.42,0,0,1,4.2,2H10a1,1,0,0,0,0,2H22.79A5.54,5.54,0,0,1,23,11.51,5.48,5.48,0,0,1,17.55,17H11.14a1,1,0,0,0-.75,1.66L22.06,32a1,1,0,1,0,1.5-1.32L13.35,19h4.21a7.51,7.51,0,0,0,7.3-9H28a1,1,0,0,0,0-2Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm5.88,9H26a1,1,0,0,1,0,2H24.26c0,.06,0,.12,0,.19a6.09,6.09,0,0,1-6,6.2h-2l6.82,8.06a1.25,1.25,0,0,1-1.91,1.62L12.63,18.94a1.25,1.25,0,0,1,1-2.06h4.71a3.59,3.59,0,0,0,3.48-3.69c0-.07,0-.13,0-.2h-9a1,1,0,0,1,0-2h8.32a3.41,3.41,0,0,0-2.78-1.5H12.75a1.25,1.25,0,0,1,0-2.5H26a1,1,0,0,1,0,2H22.68A6.23,6.23,0,0,1,23.88,11Z"/>'
};
var rupeeIconName = "rupee";
var rupeeIcon = [rupeeIconName, renderIcon(icon192)];

// node_modules/@clr/core/icon/shapes/shopping-bag.js
var icon193 = {
  outline: '<path d="M25,12V9.05a7,7,0,1,0-14,0v7a1,1,0,0,0,2,0V14h8V12H13V9.05a5,5,0,1,1,10,0V16a1,1,0,1,0,2,0V14h5V32H6V14H9V12H4V32.09A1.91,1.91,0,0,0,5.91,34H30.09A1.91,1.91,0,0,0,32,32.09V12Z"/>',
  solid: '<path d="M13,9.22a5,5,0,1,1,10,0V12h2V9.22a7,7,0,1,0-14,0V12h2Z"/><path d="M25,12v3.1a1,1,0,1,1-2,0V12H13v3.1a1,1,0,0,1-2,0V12H4V32a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V12Z"/>'
};
var shoppingBagIconName = "shopping-bag";
var shoppingBagIcon = [shoppingBagIconName, renderIcon(icon193)];

// node_modules/@clr/core/icon/shapes/shopping-cart.js
var icon194 = {
  outline: '<circle cx="13.33" cy="29.75" r="2.25"/><circle cx="27" cy="29.75" r="2.25"/><path d="M33.08,5.37A1,1,0,0,0,32.31,5H11.49l.65,2H31L28.33,19h-15L8.76,4.53a1,1,0,0,0-.66-.65L4,2.62a1,1,0,1,0-.59,1.92L7,5.64l4.59,14.5L9.95,21.48l-.13.13A2.66,2.66,0,0,0,9.74,25,2.75,2.75,0,0,0,12,26H28.69a1,1,0,0,0,0-2H11.84a.67.67,0,0,1-.56-1l2.41-2H29.13a1,1,0,0,0,1-.78l3.17-14A1,1,0,0,0,33.08,5.37Z"/>',
  outlineAlerted: '<circle cx="13.33" cy="29.75" r="2.25"/><circle cx="27" cy="29.75" r="2.25"/><polygon points="20.71 7 21.87 5 11.49 5 12.14 7 20.71 7"/><path d="M29.15,15.4,28.33,19h-15L8.76,4.53a1,1,0,0,0-.66-.65L4,2.62a1,1,0,1,0-.59,1.92L7,5.64l4.59,14.5L9.95,21.48l-.13.13A2.66,2.66,0,0,0,9.74,25,2.75,2.75,0,0,0,12,26H28.69a1,1,0,0,0,0-2H11.84a.67.67,0,0,1-.56-1l2.41-2H29.13a1,1,0,0,0,1-.78l1.09-4.82Z"/>',
  outlineBadged: '<circle cx="13.33" cy="29.75" r="2.25"/><circle cx="27" cy="29.75" r="2.25"/><path d="M22.57,7a7.52,7.52,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1H11.49l.65,2Z"/><path d="M30,13.5l-.42,0L28.33,19h-15L8.76,4.53a1,1,0,0,0-.66-.65L4,2.62a1,1,0,1,0-.59,1.92L7,5.64l4.59,14.5L9.95,21.48l-.13.13A2.66,2.66,0,0,0,9.74,25,2.75,2.75,0,0,0,12,26H28.69a1,1,0,0,0,0-2H11.84a.67.67,0,0,1-.56-1l2.41-2H29.13a1,1,0,0,0,1-.78l1.57-6.91A7.51,7.51,0,0,1,30,13.5Z"/>',
  solid: '<circle cx="13.5" cy="29.5" r="2.5"/><circle cx="26.5" cy="29.5" r="2.5"/><path d="M33.1,6.39A1,1,0,0,0,32.31,6H9.21L8.76,4.57a1,1,0,0,0-.66-.65L4,2.66a1,1,0,1,0-.59,1.92L7,5.68l4.58,14.47L9.95,21.49l-.13.13A2.66,2.66,0,0,0,9.74,25,2.75,2.75,0,0,0,12,26H28.69a1,1,0,0,0,0-2H11.84a.67.67,0,0,1-.56-1l2.41-2H29.12a1,1,0,0,0,1-.76l3.2-13A1,1,0,0,0,33.1,6.39Z"/>',
  solidAlerted: '<circle cx="13.5" cy="29.5" r="2.5"/><circle cx="26.5" cy="29.5" r="2.5"/><path d="M22.23,15.4A3.68,3.68,0,0,1,19,9.89L21.29,6H9.21L8.76,4.57a1,1,0,0,0-.66-.65L4,2.66a1,1,0,1,0-.59,1.92L7,5.68l4.58,14.47L9.95,21.49l-.13.13A2.66,2.66,0,0,0,9.74,25,2.75,2.75,0,0,0,12,26H28.69a1,1,0,0,0,0-2H11.84a.67.67,0,0,1-.56-1l2.41-2H29.12a1,1,0,0,0,1-.76l1.19-4.84Z"/>',
  solidBadged: '<circle cx="13.5" cy="29.5" r="2.5"/><circle cx="26.5" cy="29.5" r="2.5"/><path d="M30,13.5A7.5,7.5,0,0,1,22.5,6H9.21L8.76,4.57a1,1,0,0,0-.66-.65L4,2.66a1,1,0,1,0-.59,1.92L7,5.68l4.58,14.47L9.95,21.49l-.13.13A2.66,2.66,0,0,0,9.74,25,2.75,2.75,0,0,0,12,26H28.69a1,1,0,0,0,0-2H11.84a.67.67,0,0,1-.56-1l2.41-2H29.12a1,1,0,0,0,1-.76l1.71-7A7.49,7.49,0,0,1,30,13.5Z"/>'
};
var shoppingCartIconName = "shopping-cart";
var shoppingCartIcon = [shoppingCartIconName, renderIcon(icon194)];

// node_modules/@clr/core/icon/shapes/store.js
var icon195 = {
  outline: '<path d="M28,30H16V22H14v8H8V22H6v8a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V22H28Z"/><path d="M33.79,13.27,29.71,5.11A2,2,0,0,0,27.92,4H8.08A2,2,0,0,0,6.29,5.11L2.21,13.27a2,2,0,0,0-.21.9v3.08a2,2,0,0,0,.46,1.28A4.67,4.67,0,0,0,6,20.13a4.72,4.72,0,0,0,3-1.07,4.73,4.73,0,0,0,6,0,4.73,4.73,0,0,0,6,0,4.73,4.73,0,0,0,6,0,4.72,4.72,0,0,0,6.53-.52A2,2,0,0,0,34,17.26V14.17A2,2,0,0,0,33.79,13.27ZM30,18.13A2.68,2.68,0,0,1,27.82,17L27,15.88,26.19,17a2.71,2.71,0,0,1-4.37,0L21,15.88,20.19,17a2.71,2.71,0,0,1-4.37,0L15,15.88,14.19,17a2.71,2.71,0,0,1-4.37,0L9,15.88,8.18,17A2.68,2.68,0,0,1,6,18.13a2.64,2.64,0,0,1-2-.88V14.17L8.08,6H27.92L32,14.16v.67l0,2.39A2.67,2.67,0,0,1,30,18.13Z"/>',
  solid: '<path d="M28,30H16V22H14v8H8V22H6v8a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V22H28Z"/><path d="M33.79,13.27,29.71,5.11A2,2,0,0,0,27.92,4H8.08A2,2,0,0,0,6.29,5.11L2.21,13.27a2,2,0,0,0-.21.9v3.08a2,2,0,0,0,.46,1.28A4.67,4.67,0,0,0,6,20.13a4.72,4.72,0,0,0,3-1.07,4.73,4.73,0,0,0,6,0,4.73,4.73,0,0,0,6,0,4.73,4.73,0,0,0,6,0,4.72,4.72,0,0,0,6.53-.52A2,2,0,0,0,34,17.26V14.17A2,2,0,0,0,33.79,13.27ZM15,14.4v1.52L14.18,17a2.71,2.71,0,0,1-4.37,0L9,15.88V14.4L11.59,6H16Zm12,1.48L26.19,17a2.71,2.71,0,0,1-4.37,0L21,15.88l0,0V14.4L20,6h4.45L27,14.4Z"/>'
};
var storeIconName = "store";
var storeIcon = [storeIconName, renderIcon(icon195)];

// node_modules/@clr/core/icon/shapes/wallet.js
var icon196 = {
  outline: '<path d="M32,15H31V9a1,1,0,0,0-1-1H6a1,1,0,0,1-1-.82V6.82A1,1,0,0,1,6,6H29.58a1,1,0,0,0,0-2H6A3,3,0,0,0,3,7a3.08,3.08,0,0,0,0,.36V27.93A4.1,4.1,0,0,0,7.13,32H30a1,1,0,0,0,1-1V25h1a1,1,0,0,0,1-1V16A1,1,0,0,0,32,15ZM29,30H7.13A2.11,2.11,0,0,1,5,27.93V9.88A3.11,3.11,0,0,0,6,10H29v5H22a5,5,0,0,0,0,10h7Zm2-7H22a3,3,0,0,1,0-6H31Z"/><circle cx="23.01" cy="20" r="1.5"/>',
  solid: '<path d="M32.94,14H31V9a1,1,0,0,0-1-1H6A1,1,0,0,1,5,7H5V7A1,1,0,0,1,6,6H29.6a1,1,0,1,0,0-2H6A2.94,2.94,0,0,0,3,6.88v21A4.13,4.13,0,0,0,7.15,32H30a1,1,0,0,0,1-1V26h1.94a.93.93,0,0,0,1-.91v-10A1.08,1.08,0,0,0,32.94,14ZM32,24l-8.58,0a3.87,3.87,0,0,1-3.73-4,3.87,3.87,0,0,1,3.73-4L32,16Z"/><circle cx="24.04" cy="19.92" r="1.5"/>'
};
var walletIconName = "wallet";
var walletIcon = [walletIconName, renderIcon(icon196)];

// node_modules/@clr/core/icon/shapes/won.js
var icon197 = {
  outline: '<path d="M33,18H28.75l.5-2H33a1,1,0,0,0,0-2H29.74l2.17-8.76A1,1,0,0,0,30,4.76L27.68,14H21.31L19,4.76a1,1,0,0,0-1.94,0L14.79,14H8.42L6.13,4.76a1,1,0,0,0-1.94.48L6.36,14H3a1,1,0,0,0,0,2H6.85l.5,2H3a1,1,0,0,0,0,2H7.84l2.79,11.24a1,1,0,0,0,1.94,0L15.36,20h5.38l2.79,11.24a1,1,0,0,0,1.94,0L28.25,20H33a1,1,0,0,0,0-2Zm-5.82-2-.5,2H22.3l-.5-2ZM18,9.16,19.25,14h-2.4ZM8.91,16h5.38l-.5,2H9.41ZM11.6,26.84,9.91,20H13.3ZM15.85,18l.5-2h3.39l.5,2Zm8.64,8.84L22.8,20h3.39Z"/>',
  solid: '<polygon points="17.74 16 17.22 18 18.85 18 18.32 16 17.74 16"/><polygon points="11.94 18 14.63 18 15.16 16 11.41 16 11.94 18"/><polygon points="13.29 23.1 14.1 20 12.47 20 13.29 23.1"/><polygon points="21.44 18 24.13 18 24.66 16 20.91 16 21.44 18"/><polygon points="22.78 23.1 23.6 20 21.97 20 22.78 23.1"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM29,20H26.19L24,28.32a1.25,1.25,0,0,1-2.42,0L19.38,20H16.69l-2.19,8.32a1.25,1.25,0,0,1-2.42,0L9.88,20H7a1,1,0,0,1,0-2H9.35l-.53-2H7a1,1,0,0,1,0-2H8.3l-1-3.68a1.25,1.25,0,0,1,2.42-.64L10.88,14h4.8l1.14-4.32a1.25,1.25,0,0,1,2.42,0L20.38,14h4.8l1.14-4.32a1.25,1.25,0,0,1,2.42.64l-1,3.68H29a1,1,0,0,1,0,2H27.24l-.53,2H29a1,1,0,0,1,0,2Z"/>'
};
var wonIconName = "won";
var wonIcon = [wonIconName, renderIcon(icon197)];

// node_modules/@clr/core/icon/shapes/yen.js
var icon198 = {
  outline: '<path d="M29.34,4.55a1,1,0,1,0-1.67-1.1L18,18.23,8.33,3.45a1,1,0,0,0-1.67,1.1L17,20.35V22.2H12a.8.8,0,0,0,0,1.6h5v2.4H12a.8.8,0,0,0,0,1.6h5V32a1,1,0,0,0,2,0V27.8h5a.8.8,0,0,0,0-1.6H19V23.8h5a.8.8,0,0,0,0-1.6H19V20.35Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm8.07,7.91L19.74,20H22a1,1,0,0,1,0,2H19.25v2H22a1,1,0,0,1,0,2H19.25v2.75a1.25,1.25,0,0,1-2.5,0V26H14a1,1,0,1,1,0-2h2.75V22H14a1,1,0,1,1,0-2h2.26L9.93,9.91a1.25,1.25,0,1,1,2.12-1.33L18,18.08l5.95-9.49a1.25,1.25,0,1,1,2.12,1.33Z"/>'
};
var yenIconName = "yen";
var yenIcon = [yenIconName, renderIcon(icon198)];

// node_modules/@clr/core/icon/shapes/camera.js
var icon199 = {
  outline: '<path d="M32,8H24.7L23.64,5.28A2,2,0,0,0,21.78,4H14.22a2,2,0,0,0-1.87,1.28L11.3,8H4a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8Zm0,22H4V10h8.67l1.55-4h7.56l1.55,4H32Z"/><path d="M9,19a9,9,0,1,0,9-9A9,9,0,0,0,9,19Zm16.4,0A7.4,7.4,0,1,1,18,11.6,7.41,7.41,0,0,1,25.4,19Z"/><path d="M9.37,12.83a.8.8,0,0,0-.8-.8H6.17a.8.8,0,0,0,0,1.6h2.4A.8.8,0,0,0,9.37,12.83Z"/><path d="M12.34,19a5.57,5.57,0,0,0,3.24,5l.85-1.37a4,4,0,1,1,4.11-6.61l.86-1.38A5.56,5.56,0,0,0,12.34,19Z"/>',
  solid: '<path d="M32,8H24.7L23.64,5.28A2,2,0,0,0,21.78,4H14.22a2,2,0,0,0-1.87,1.28L11.3,8H4a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8ZM6.17,13.63a.8.8,0,0,1,0-1.6h2.4a.8.8,0,0,1,0,1.6ZM18,28a9,9,0,1,1,9-9A9,9,0,0,1,18,28Z"/><path d="M11.11,19.06a7.07,7.07,0,0,0,4.11,6.41l1.09-1.74a5,5,0,1,1,5.22-8.39l1.09-1.76a7.06,7.06,0,0,0-11.51,5.48Z"/>'
};
var cameraIconName = "camera";
var cameraIcon = [cameraIconName, renderIcon(icon199)];

// node_modules/@clr/core/icon/shapes/fast-forward.js
var icon200 = {
  outline: '<path d="M17.77,31.92a2,2,0,0,1-.86-.2A1.81,1.81,0,0,1,16,29.93v-6.7L5.24,31.5a1.94,1.94,0,0,1-2.06.22,2,2,0,0,1-1.11-1.79v-24A2,2,0,0,1,3.18,4.12a1.93,1.93,0,0,1,2.06.22L16,12.61V5.91a1.81,1.81,0,0,1,.91-1.79A1.93,1.93,0,0,1,19,4.34l15.32,12a2,2,0,0,1,0,3.15L19,31.5A2,2,0,0,1,17.77,31.92Zm0-12.8V29.93l15.26-12-15.32-12,.06,10.81L4,5.91v24Z"/>',
  solid: '<path d="M17.71,32a2,2,0,0,1-.86-.2A1.77,1.77,0,0,1,16,30v-6.7L5.17,31.58a1.94,1.94,0,0,1-2.06.22A2,2,0,0,1,2,30V6A2,2,0,0,1,3.11,4.2a1.93,1.93,0,0,1,2.06.22L16,12.69V6a1.77,1.77,0,0,1,.85-1.79,1.93,1.93,0,0,1,2.06.22l15.32,12a2,2,0,0,1,0,3.15l-15.32,12A2,2,0,0,1,17.71,32Z"/>'
};
var fastForwardIconName = "fast-forward";
var fastForwardIcon = [fastForwardIconName, renderIcon(icon200)];

// node_modules/@clr/core/icon/shapes/film-strip.js
var icon201 = {
  outline: '<path d="M30,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V6A2,2,0,0,0,30,4Zm0,26H6V6H30Z"/><path d="M14.6,23.07a1.29,1.29,0,0,0,1.24.09l8.73-4a1.3,1.3,0,0,0,0-2.37h0l-8.73-4A1.3,1.3,0,0,0,14,14v8A1.29,1.29,0,0,0,14.6,23.07Zm1-8.6L23.31,18,15.6,21.51Z"/><rect x="8" y="7" width="2" height="3"/><rect x="14" y="7" width="2" height="3"/><rect x="20" y="7" width="2" height="3"/><rect x="26" y="7" width="2" height="3"/><rect x="8" y="26" width="2" height="3"/><rect x="14" y="26" width="2" height="3"/><rect x="20" y="26" width="2" height="3"/><rect x="26" y="26" width="2" height="3"/>',
  solid: '<path d="M30,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V6A2,2,0,0,0,30,4ZM20,7h2v3H20ZM14,7h2v3H14ZM10,29H8V26h2Zm0-19H8V7h2Zm6,19H14V26h2Zm6,0H20V26h2Zm3.16-10.16L15.39,23.2A1,1,0,0,1,14,22.28V13.57a1,1,0,0,1,1.41-.91L25.16,17A1,1,0,0,1,25.16,18.84ZM28,29H26V26h2Zm0-19H26V7h2Z"/>'
};
var filmStripIconName = "film-strip";
var filmStripIcon = [filmStripIconName, renderIcon(icon201)];

// node_modules/@clr/core/icon/shapes/headphones.js
var icon202 = {
  outline: '<path d="M18,3A14.27,14.27,0,0,0,4,17.5V31H9.2A2.74,2.74,0,0,0,12,28.33V21.67A2.74,2.74,0,0,0,9.2,19H6V17.5A12.27,12.27,0,0,1,18,5,12.27,12.27,0,0,1,30,17.5V19H26.8A2.74,2.74,0,0,0,24,21.67v6.67A2.74,2.74,0,0,0,26.8,31H32V17.5A14.27,14.27,0,0,0,18,3ZM9.2,21a.75.75,0,0,1,.8.67v6.67a.75.75,0,0,1-.8.67H6V21ZM26,28.33V21.67a.75.75,0,0,1,.8-.67H30v8H26.8A.75.75,0,0,1,26,28.33Z"/>',
  solid: '<path d="M18,3A14.27,14.27,0,0,0,4,17.5V31H8.2A1.74,1.74,0,0,0,10,29.33V22.67A1.74,1.74,0,0,0,8.2,21H6V17.5A12.27,12.27,0,0,1,18,5,12.27,12.27,0,0,1,30,17.5V21H27.8A1.74,1.74,0,0,0,26,22.67v6.67A1.74,1.74,0,0,0,27.8,31H32V17.5A14.27,14.27,0,0,0,18,3Z"/>'
};
var headphonesIconName = "headphones";
var headphonesIcon = [headphonesIconName, renderIcon(icon202)];

// node_modules/@clr/core/icon/shapes/image-gallery.js
var icon203 = {
  outline: '<path d="M32.12,10H3.88A1.88,1.88,0,0,0,2,11.88V30.12A1.88,1.88,0,0,0,3.88,32H32.12A1.88,1.88,0,0,0,34,30.12V11.88A1.88,1.88,0,0,0,32.12,10ZM32,30H4V12H32Z"/><path d="M8.56,19.45a3,3,0,1,0-3-3A3,3,0,0,0,8.56,19.45Zm0-4.6A1.6,1.6,0,1,1,7,16.45,1.6,1.6,0,0,1,8.56,14.85Z"/><path d="M7.9,28l6-6,3.18,3.18L14.26,28h2l7.46-7.46L30,26.77v-2L24.2,19a.71.71,0,0,0-1,0l-5.16,5.16L14.37,20.5a.71.71,0,0,0-1,0L5.92,28Z"/><path d="M30.14,3h0a1,1,0,0,0-1-1h-22a1,1,0,0,0-1,1h0V4h24Z"/><path d="M32.12,7V7a1,1,0,0,0-1-1h-26a1,1,0,0,0-1,1h0V8h28Z"/>',
  solid: '<path d="M30.14,3h0a1,1,0,0,0-1-1h-22a1,1,0,0,0-1,1h0V4h24Z"/><path d="M32.12,7V7a1,1,0,0,0-1-1h-26a1,1,0,0,0-1,1h0V8h28Z"/><path d="M32.12,10H3.88A1.88,1.88,0,0,0,2,11.88V30.12A1.88,1.88,0,0,0,3.88,32H32.12A1.88,1.88,0,0,0,34,30.12V11.88A1.88,1.88,0,0,0,32.12,10ZM8.56,13.45a3,3,0,1,1-3,3A3,3,0,0,1,8.56,13.45ZM30,28h-24l7.46-7.47a.71.71,0,0,1,1,0l3.68,3.68L23.21,19a.71.71,0,0,1,1,0L30,24.79Z"/>'
};
var imageGalleryIconName = "image-gallery";
var imageGalleryIcon = [imageGalleryIconName, renderIcon(icon203)];

// node_modules/@clr/core/icon/shapes/microphone.js
var icon204 = {
  outline: '<path d="M18,24c3.9,0,7-3.1,7-7V9c0-3.9-3.1-7-7-7s-7,3.1-7,7v8C11,20.9,14.1,24,18,24z M13,9c0-2.8,2.2-5,5-5s5,2.2,5,5v8c0,2.8-2.2,5-5,5s-5-2.2-5-5V9z"/><path d="M30,17h-2c0,5.5-4.5,10-10,10S8,22.5,8,17H6c0,6.3,4.8,11.4,11,11.9V32h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h8c0.6,0,1-0.4,1-1s-0.4-1-1-1h-3v-3.1C25.2,28.4,30,23.3,30,17z"/>',
  solid: '<path d="M18,24c3.9,0,7-3.1,7-7V9c0-3.9-3.1-7-7-7s-7,3.1-7,7v8C11,20.9,14.1,24,18,24z"/><path d="M30,17h-2c0,5.5-4.5,10-10,10S8,22.5,8,17H6c0,6.3,4.8,11.4,11,11.9V32h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h8c0.6,0,1-0.4,1-1s-0.4-1-1-1h-3v-3.1C25.2,28.4,30,23.3,30,17z"/>'
};
var microphoneIconName = "microphone";
var microphoneIcon = [microphoneIconName, renderIcon(icon204)];

// node_modules/@clr/core/icon/shapes/microphone-mute.js
var icon205 = {
  outline: '<path d="M30,17h-2c0,1.8-0.5,3.5-1.4,5l1.5,1.5C29.3,21.5,29.9,19.3,30,17z"/><path d="M18,4c2.8,0,5,2.2,5,5v8c0,0.4-0.1,0.8-0.2,1.2l1.6,1.6c0.4-0.9,0.6-1.8,0.6-2.8V9c0-3.9-3.2-7-7.1-6.9c-2.9,0-5.6,1.9-6.5,4.7L13,8.3C13.5,5.9,15.6,4.2,18,4z"/><path d="M25.2,26.6l6.9,6.9l1.4-1.4L4,2.6L2.6,4l8.4,8.4V17c0,3.9,3.1,7,7,7c1.3,0,2.5-0.3,3.6-1l2.2,2.2C22.1,26.4,20.1,27,18,27c-5.4,0.2-9.8-4.1-10-9.4c0-0.2,0-0.4,0-0.6H6c0.1,6.2,4.8,11.4,11,12v3h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h8c0.6,0,1-0.4,1-1s-0.4-1-1-1h-3v-3C21.2,28.8,23.4,28,25.2,26.6z M13.8,19.7C13.3,18.9,13,18,13,17v-2.6l7.1,7.1C17.9,22.5,15.2,21.8,13.8,19.7z"/>',
  solid: '<path d="M30,17h-2c0,1.8-0.5,3.5-1.4,5l1.5,1.5C29.3,21.5,29.9,19.3,30,17z"/><path d="M25,17V9c0-3.9-3.2-7-7.1-6.9c-2.9,0-5.6,1.9-6.5,4.7l13,13C24.8,18.9,25,17.9,25,17z"/><path d="M25.2,26.6l6.9,6.9l1.4-1.4L4,2.6L2.6,4l8.4,8.4V17c0,3.9,3.1,7,7,7c1.3,0,2.5-0.3,3.6-1l2.2,2.2C22.1,26.4,20.1,27,18,27c-5.4,0.2-9.8-4.1-10-9.4c0-0.2,0-0.4,0-0.6H6c0.1,6.2,4.8,11.4,11,12v3h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h8c0.6,0,1-0.4,1-1s-0.4-1-1-1h-3v-3C21.2,28.8,23.4,28,25.2,26.6z"/>'
};
var microphoneMuteIconName = "microphone-mute";
var microphoneMuteIcon = [microphoneMuteIconName, renderIcon(icon205)];

// node_modules/@clr/core/icon/shapes/music-note.js
var icon206 = {
  outline: '<path d="M31.68,6.16c-1.92-3.3-10.6-4-11.58-4.09L19,2V22.34a5.89,5.89,0,0,0-.82-.56,8.33,8.33,0,0,0-6.53-.41C7.57,22.7,4.92,26.5,5.78,29.84a5.33,5.33,0,0,0,2.66,3.32,7.48,7.48,0,0,0,3.61.88A9.54,9.54,0,0,0,15,33.57c3.67-1.18,6.17-4.33,6.06-7.36V9.34a29.14,29.14,0,0,1,6.55,1.43,1,1,0,1,0,.72-1.87A31.37,31.37,0,0,0,21,7.33V4.17c3.33.36,8,1.38,8.92,3,2,3.41-2.33,7.36-2.37,7.4a1,1,0,0,0,1.33,1.49C29.15,15.85,34.5,11,31.68,6.16ZM14.35,31.67a6.43,6.43,0,0,1-5-.26,3.31,3.31,0,0,1-1.69-2.07c-.6-2.33,1.45-5.05,4.58-6.06a7.52,7.52,0,0,1,2.3-.37,5.52,5.52,0,0,1,2.65.62,3.31,3.31,0,0,1,1.69,2.07C19.54,27.94,17.49,30.66,14.35,31.67Z"/>',
  solid: '<path d="M31.68,6.16c-1.92-3.3-10.6-4-11.58-4.09L19,2V22.29a5.88,5.88,0,0,0-.81-.55,8.33,8.33,0,0,0-6.53-.41c-4.12,1.33-6.77,5.13-5.91,8.47a5.33,5.33,0,0,0,2.66,3.32,7.48,7.48,0,0,0,3.61.88A9.54,9.54,0,0,0,15,33.52c3.7-1.19,6.2-4.37,6.06-7.42,0,0,0,0,0,0V8.49c1,.12,2.37.33,3.82.64a11.17,11.17,0,0,1,4.06,1.46c1,.66.38,1.9.33,2a11.8,11.8,0,0,1-1.66,2,1,1,0,0,0,1.33,1.49C29.15,15.85,34.5,11,31.68,6.16Z"/>'
};
var musicNoteIconName = "music-note";
var musicNoteIcon = [musicNoteIconName, renderIcon(icon206)];

// node_modules/@clr/core/icon/shapes/pause.js
var icon207 = {
  outline: '<path d="M12.93,32H6.07A2.07,2.07,0,0,1,4,29.93V6.07A2.07,2.07,0,0,1,6.07,4h6.87A2.07,2.07,0,0,1,15,6.07V29.93A2.07,2.07,0,0,1,12.93,32ZM13,6H6V30h7Z"/><path d="M29.93,32H23.07A2.07,2.07,0,0,1,21,29.93V6.07A2.07,2.07,0,0,1,23.07,4h6.87A2.07,2.07,0,0,1,32,6.07V29.93A2.07,2.07,0,0,1,29.93,32ZM30,6H23V30h7Z"/>',
  solid: '<rect x="3.95" y="4" width="11" height="28" rx="2.07" ry="2.07"/><rect x="20.95" y="4" width="11" height="28" rx="2.07" ry="2.07"/>'
};
var pauseIconName = "pause";
var pauseIcon = [pauseIconName, renderIcon(icon207)];

// node_modules/@clr/core/icon/shapes/play.js
var icon208 = {
  outline: '<path d="M8.07,31.6A2.07,2.07,0,0,1,6,29.53V6.32A2.07,2.07,0,0,1,9,4.47L32.21,16.08a2.07,2.07,0,0,1,0,3.7L9,31.38A2.06,2.06,0,0,1,8.07,31.6Zm0-25.34L8,6.32V29.53l.1.06L31.31,18a.06.06,0,0,0,0-.06Z"/>',
  solid: '<path d="M32.16,16.08,8.94,4.47A2.07,2.07,0,0,0,6,6.32V29.53a2.06,2.06,0,0,0,3,1.85L32.16,19.77a2.07,2.07,0,0,0,0-3.7Z"/>'
};
var playIconName = "play";
var playIcon = [playIconName, renderIcon(icon208)];

// node_modules/@clr/core/icon/shapes/power.js
var icon209 = {
  outline: '<path d="M18,21a1,1,0,0,1-1-1V4a1,1,0,0,1,2,0V20A1,1,0,0,1,18,21Z"/><path d="M18,34.15a15,15,0,0,1-7.52-28,1,1,0,0,1,1,1.73,13,13,0,1,0,13,0,1,1,0,1,1,1-1.73,15,15,0,0,1-7.52,28Z"/>',
  outlineAlerted: '<path d="M18,21a1,1,0,0,0,1-1V4a1,1,0,0,0-2,0V20A1,1,0,0,0,18,21Z"/><path d="M32.51,15.4H30.44a13,13,0,1,1-19-7.5,1,1,0,0,0-1-1.73A15,15,0,1,0,33,19.15,14.9,14.9,0,0,0,32.51,15.4Z"/>',
  outlineBadged: '<path d="M18,21a1,1,0,0,1-1-1V4a1,1,0,0,1,2,0V20A1,1,0,0,1,18,21Z"/><path d="M30,13.5l-.31,0A13,13,0,1,1,11.48,7.9a1,1,0,0,0-1-1.73,15,15,0,1,0,21.31,7.1A7.49,7.49,0,0,1,30,13.5Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm.06,17.68a1.28,1.28,0,0,1-1.29-1.28V8.65a1.29,1.29,0,0,1,2.58,0V18.4A1.28,1.28,0,0,1,18.06,19.68ZM18,27.79A9.88,9.88,0,0,1,12.17,9.85a1.4,1.4,0,0,1,1.94.31,1.37,1.37,0,0,1-.31,1.92,7.18,7.18,0,1,0,11.43,5.8,7.07,7.07,0,0,0-3-5.76A1.37,1.37,0,0,1,22,10.2a1.4,1.4,0,0,1,1.94-.29A9.88,9.88,0,0,1,18,27.79Z"/>',
  solidAlerted: '<path d="M33.68,15.4h-6A9.7,9.7,0,0,1,28,17.89a10,10,0,1,1-15.83-8,1.4,1.4,0,0,1,1.94.31,1.37,1.37,0,0,1-.31,1.92,7.18,7.18,0,1,0,11.43,5.8,7.08,7.08,0,0,0-.45-2.49H22.23A3.69,3.69,0,0,1,19.35,14v4.4a1.29,1.29,0,0,1-2.58,0V8.65a1.29,1.29,0,0,1,2.58,0v.71l3.76-6.51A16,16,0,1,0,34,18a16,16,0,0,0-.23-2.61Z"/>',
  solidBadged: '<path d="M30,13.5a7.47,7.47,0,0,1-3.57-.9A9.83,9.83,0,0,1,28,17.89a10,10,0,1,1-15.83-8,1.4,1.4,0,0,1,1.94.31,1.37,1.37,0,0,1-.31,1.92,7.18,7.18,0,1,0,11.43,5.8,7.07,7.07,0,0,0-3-5.76A1.37,1.37,0,0,1,22,10.2a1.38,1.38,0,0,1,1.52-.49,7.45,7.45,0,0,1-.3-6.83,16.06,16.06,0,1,0,9.93,9.93A7.46,7.46,0,0,1,30,13.5ZM16.77,8.65a1.29,1.29,0,0,1,2.58,0V18.4a1.29,1.29,0,0,1-2.58,0Z"/>'
};
var powerIconName = "power";
var powerIcon = [powerIconName, renderIcon(icon209)];

// node_modules/@clr/core/icon/shapes/replay-all.js
var icon210 = {
  outline: '<path d="M17.46,26.22a1.4,1.4,0,0,0,1-.42l5.59-5.56a1.43,1.43,0,0,0,.42-1,1.46,1.46,0,0,0-.42-1l-5.59-5.56a1.43,1.43,0,0,0-2.44,1V24.79a1.41,1.41,0,0,0,.88,1.32A1.54,1.54,0,0,0,17.46,26.22Zm.16-12.16,5.19,5.16-5.19,5.17Z"/><path d="M18.06,5h-6.7l2.92-2.64A1,1,0,0,0,12.94.88L7.32,6,12.94,11a1,1,0,0,0,.67.26,1,1,0,0,0,.74-.33,1,1,0,0,0-.07-1.42L11.46,7h6.6A11.78,11.78,0,1,1,7.71,24.41,1,1,0,0,0,6,25.36,13.78,13.78,0,1,0,18.06,5Z"/>'
};
var replayAllIconName = "replay-all";
var replayAllIcon = [replayAllIconName, renderIcon(icon210)];

// node_modules/@clr/core/icon/shapes/replay-one.js
var icon211 = {
  outline: '<path d="M19,27.27a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1H19a3.8,3.8,0,0,0-1.1.23l-2,.62a.92.92,0,0,0-.72.86.88.88,0,0,0,.88.86,1.46,1.46,0,0,0,.43-.08L18,15.07v11.2A1,1,0,0,0,19,27.27Z"/><path d="M18.06,5h-6.7l2.92-2.64A1,1,0,0,0,12.94.88L7.32,6,12.94,11a1,1,0,0,0,.67.26,1,1,0,0,0,.74-.33,1,1,0,0,0-.07-1.42L11.46,7h6.6A11.78,11.78,0,1,1,7.71,24.41,1,1,0,0,0,6,25.36,13.78,13.78,0,1,0,18.06,5Z"/>'
};
var replayOneIconName = "replay-one";
var replayOneIcon = [replayOneIconName, renderIcon(icon211)];

// node_modules/@clr/core/icon/shapes/rewind.js
var icon212 = {
  outline: '<path d="M17.09,31.58l-15.32-12a2,2,0,0,1,0-3.15l15.32-12a1.93,1.93,0,0,1,2.06-.22A1.77,1.77,0,0,1,20,6v6.7L30.83,4.42a1.93,1.93,0,0,1,2.06-.22A2,2,0,0,1,34,6V30a2,2,0,0,1-1.11,1.79,1.94,1.94,0,0,1-2.06-.22L20,23.31V30a1.77,1.77,0,0,1-.85,1.79,1.94,1.94,0,0,1-2.06-.22ZM32,30l.06-24L18,16.8V6L3,18,18,30V19.2Z"/>',
  solid: '<path d="M16.92,31.58,1.6,19.57a2,2,0,0,1,0-3.15l15.32-12A1.93,1.93,0,0,1,19,4.2,1.89,1.89,0,0,1,20,6v6.7L30.66,4.42a1.93,1.93,0,0,1,2.06-.22A2,2,0,0,1,33.83,6V30a2,2,0,0,1-1.11,1.79,1.94,1.94,0,0,1-2.06-.22L20,23.31V30a1.89,1.89,0,0,1-1,1.79,1.94,1.94,0,0,1-2.06-.22Z"/>'
};
var rewindIconName = "rewind";
var rewindIcon = [rewindIconName, renderIcon(icon212)];

// node_modules/@clr/core/icon/shapes/shuffle.js
var icon213 = {
  outline: '<path d="M21.61,11h8.62l-3.3,3.3a1,1,0,1,0,1.41,1.42L34,10.08l-.71-.71h0L28.34,4.43a1,1,0,0,0-1.41,1.42L30.11,9H21a1,1,0,0,0-.86.5L17.5,14.09l1.16,2Z"/><path d="M11.07,25.07H3a1,1,0,0,0,0,2h8.65a1,1,0,0,0,.86-.5L15.18,22,14,20Z"/><path d="M28.34,20.17a1,1,0,0,0-1.41,1.42l3.5,3.5H21.61L12.51,9.53a1,1,0,0,0-.86-.5H3a1,1,0,1,0,0,2h8.07l9.1,15.55a1,1,0,0,0,.86.5H29.9l-3,3a1,1,0,0,0,1.41,1.42l4.95-4.94h0l.71-.71Z"/>'
};
var shuffleIconName = "shuffle";
var shuffleIcon = [shuffleIconName, renderIcon(icon213)];

// node_modules/@clr/core/icon/shapes/step-forward.js
var icon214 = {
  outline: '<path d="M5,32.23a2,2,0,0,1-2-2V5.77A2,2,0,0,1,6.17,4.14L23.23,16.38a2,2,0,0,1,0,3.25h0L6.17,31.86A2,2,0,0,1,5,32.23ZM5,5.77V30.23L22.07,18Z"/><path d="M31,32H28a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2V30A2,2,0,0,1,31,32ZM28,6V30h3V6Z"/>',
  solid: '<path d="M5,31.9a2,2,0,0,1-2-2V5.44A2,2,0,0,1,6.12,3.81L23.18,16a2,2,0,0,1,0,3.25h0L6.12,31.52A2,2,0,0,1,5,31.9Z"/><rect x="25.95" y="3.67" width="7" height="28" rx="2" ry="2"/>'
};
var stepForwardIconName = "step-forward";
var stepForwardIcon = [stepForwardIconName, renderIcon(icon214)];

// node_modules/@clr/core/icon/shapes/stop.js
var icon215 = {
  outline: '<path d="M30,32H6a2,2,0,0,1-2-2V6A2,2,0,0,1,6,4H30a2,2,0,0,1,2,2V30A2,2,0,0,1,30,32ZM6,6V30H30V6Z"/>',
  solid: '<rect x="3.96" y="4" width="27.99" height="28" rx="2" ry="2"/>'
};
var stopIconName = "stop";
var stopIcon = [stopIconName, renderIcon(icon215)];

// node_modules/@clr/core/icon/shapes/video-camera.js
var icon216 = {
  outline: '<path d="M34,10.34a2.11,2.11,0,0,0-1.16-1.9,2,2,0,0,0-2.13.15L26,11.6V8a2,2,0,0,0-2-2H6a4,4,0,0,0-4,4V26a4,4,0,0,0,4,4H24a2,2,0,0,0,2-2V24.4l4.64,3a2.07,2.07,0,0,0,2.2.2A2.11,2.11,0,0,0,34,25.66ZM31.93,25.77c-.06,0-.11,0-.19-.06L24,20.77V28H6a2,2,0,0,1-2-2V10A2,2,0,0,1,6,8H24v7.23l7.8-5a.11.11,0,0,1,.13,0,.11.11,0,0,1,.07.11V25.66A.11.11,0,0,1,31.93,25.77Z"/>',
  solid: '<path d="M32.3,9.35,26,12.9V8a2,2,0,0,0-2-2H6a4,4,0,0,0-4,4V26a4,4,0,0,0,4,4H24a2,2,0,0,0,2-2V23.08l6.3,3.55A1.1,1.1,0,0,0,34,25.77V10.2A1.1,1.1,0,0,0,32.3,9.35Z"/>'
};
var videoCameraIconName = "video-camera";
var videoCameraIcon = [videoCameraIconName, renderIcon(icon216)];

// node_modules/@clr/core/icon/shapes/video-gallery.js
var icon217 = {
  outline: '<path d="M32.12,10H3.88A1.88,1.88,0,0,0,2,11.88V30.12A1.88,1.88,0,0,0,3.88,32H32.12A1.88,1.88,0,0,0,34,30.12V11.88A1.88,1.88,0,0,0,32.12,10ZM32,30H4V12H32Z"/><path d="M30.14,3h0a1,1,0,0,0-1-1h-22a1,1,0,0,0-1,1h0V4h24Z"/><path d="M32.12,7V7a1,1,0,0,0-1-1h-26a1,1,0,0,0-1,1h0V8h28Z"/><path d="M12.82,26.79a1.74,1.74,0,0,0,.93.28,1.68,1.68,0,0,0,.69-.15l9.77-4.36a1.69,1.69,0,0,0,0-3.1L14.44,15.1a1.7,1.7,0,0,0-2.39,1.55v8.72A1.7,1.7,0,0,0,12.82,26.79Zm.63-10.14a.29.29,0,0,1,.14-.25.3.3,0,0,1,.16,0,.27.27,0,0,1,.12,0l9.77,4.35a.29.29,0,0,1,.18.28.28.28,0,0,1-.18.27l-9.77,4.36a.28.28,0,0,1-.28,0,.31.31,0,0,1-.14-.25Z"/>',
  solid: '<path d="M32.12,10H3.88A1.88,1.88,0,0,0,2,11.88V30.12A1.88,1.88,0,0,0,3.88,32H32.12A1.88,1.88,0,0,0,34,30.12V11.88A1.88,1.88,0,0,0,32.12,10ZM24.18,21.83l-9.77,4.36A1,1,0,0,1,13,25.28V16.56a1,1,0,0,1,1.41-.91L24.18,20A1,1,0,0,1,24.18,21.83Z"/><path d="M30.14,3h0a1,1,0,0,0-1-1h-22a1,1,0,0,0-1,1h0V4h24Z"/><path d="M32.12,7V7a1,1,0,0,0-1-1h-26a1,1,0,0,0-1,1h0V8h28Z"/>'
};
var videoGalleryIconName = "video-gallery";
var videoGalleryIcon = [videoGalleryIconName, renderIcon(icon217)];

// node_modules/@clr/core/icon/shapes/volume-down.js
var icon218 = {
  outline: '<path d="M23.41,25.11a1,1,0,0,1-.54-1.85,6.21,6.21,0,0,0-.19-10.65,1,1,0,1,1,1-1.73A8.21,8.21,0,0,1,23.94,25,1,1,0,0,1,23.41,25.11Z"/><path d="M18,32a2,2,0,0,1-1.42-.59L9.14,24H4a2,2,0,0,1-2-2V14a2,2,0,0,1,2-2H9.22l7.33-7.41A2,2,0,0,1,20,6V30a2,2,0,0,1-1.24,1.85A2,2,0,0,1,18,32ZM4,14v8H9.56a1,1,0,0,1,.71.28L18,30V6l-7.65,7.68a1,1,0,0,1-.71.3ZM18,6Z"/>',
  solid: '<path d="M23.41,25.11a1,1,0,0,1-.54-1.85,6.21,6.21,0,0,0-.19-10.65,1,1,0,1,1,1-1.73A8.21,8.21,0,0,1,23.94,25,1,1,0,0,1,23.41,25.11Z"/><path d="M18.34,3.87,9,12H3a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1H8.83l9.51,8.3A1,1,0,0,0,20,31.55V4.62A1,1,0,0,0,18.34,3.87Z"/>'
};
var volumeDownIconName = "volume-down";
var volumeDownIcon = [volumeDownIconName, renderIcon(icon218)];

// node_modules/@clr/core/icon/shapes/volume-mute.js
var icon219 = {
  outline: '<path d="M3.61,6.41,9.19,12H4a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2H9.14l7.41,7.47A2,2,0,0,0,18,32a2,2,0,0,0,.76-.15A2,2,0,0,0,20,30V22.77l5.89,5.89c-.25.15-.49.29-.75.42a1,1,0,0,0,.9,1.79,14.4,14.4,0,0,0,1.31-.75l2.28,2.28L31,31,5,5ZM18,30l-7.73-7.77A1,1,0,0,0,9.56,22H4V14H9.64a1,1,0,0,0,.71-.3l.26-.26L18,20.81Z"/><path d="M24.89,6.69A12.42,12.42,0,0,1,29,26.1l1.42,1.42A14.42,14.42,0,0,0,25.76,4.88a1,1,0,1,0-.87,1.8Z"/><path d="M22.69,12.62A6.27,6.27,0,0,1,25.8,18a6.17,6.17,0,0,1-1.24,3.71L26,23.13A8.15,8.15,0,0,0,27.8,18a8.28,8.28,0,0,0-4.1-7.11,1,1,0,1,0-1,1.73Z"/><path d="M18,6v9.15l2,2V6a2,2,0,0,0-3.42-1.41L12,9.17l1.41,1.41Z"/>',
  solid: '<path d="M24.87,6.69A12.42,12.42,0,0,1,28.75,26.3l1.42,1.42A14.43,14.43,0,0,0,25.74,4.88a1,1,0,0,0-.87,1.8Z"/><path d="M27.3,27.67h0l-3.84-3.84-.57-.57h0L4.63,5,3.21,6.41,8.8,12H3a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1H8.83l9.51,8.3A1,1,0,0,0,20,31.55V23.2l5.59,5.59c-.17.1-.34.2-.51.29a1,1,0,0,0,.9,1.79c.37-.19.72-.4,1.08-.62l2.14,2.14L30.61,31l-3.25-3.25Z"/><path d="M22.69,12.62A6.27,6.27,0,0,1,25.8,18a6.17,6.17,0,0,1-1.42,3.92l1.42,1.42a8.16,8.16,0,0,0,2-5.34,8.28,8.28,0,0,0-4.1-7.11,1,1,0,1,0-1,1.73Z"/><path d="M20,4.62a1,1,0,0,0-1.66-.75l-6.42,5.6L20,17.54Z"/>'
};
var volumeMuteIconName = "volume-mute";
var volumeMuteIcon = [volumeMuteIconName, renderIcon(icon219)];

// node_modules/@clr/core/icon/shapes/volume-up.js
var icon220 = {
  outline: '<path d="M23.41,25.25a1,1,0,0,1-.54-1.85,6.21,6.21,0,0,0-.19-10.65,1,1,0,1,1,1-1.73,8.21,8.21,0,0,1,.24,14.06A1,1,0,0,1,23.41,25.25Z"/><path d="M25.62,31.18a1,1,0,0,1-.45-1.89A12.44,12.44,0,0,0,25,6.89a1,1,0,1,1,.87-1.8,14.44,14.44,0,0,1,.24,26A1,1,0,0,1,25.62,31.18Z"/><path d="M18,32.06a2,2,0,0,1-1.42-.59L9.14,24H4a2,2,0,0,1-2-2V14a2,2,0,0,1,2-2H9.22l7.33-7.39A2,2,0,0,1,20,6v24a2,2,0,0,1-1.24,1.85A2,2,0,0,1,18,32.06ZM4,14v8H9.56a1,1,0,0,1,.71.3L18,30.06V6L10.35,13.7a1,1,0,0,1-.71.3ZM18,6Z"/>',
  solid: '<path d="M23.41,25.25a1,1,0,0,1-.54-1.85,6.21,6.21,0,0,0-.19-10.65,1,1,0,1,1,1-1.73,8.21,8.21,0,0,1,.24,14.06A1,1,0,0,1,23.41,25.25Z"/><path d="M25.62,31.18a1,1,0,0,1-.45-1.89A12.44,12.44,0,0,0,25,6.89a1,1,0,1,1,.87-1.8,14.44,14.44,0,0,1,.24,26A1,1,0,0,1,25.62,31.18Z"/><path d="M18.33,4,9.07,12h-6a1,1,0,0,0-1,1v9.92a1,1,0,0,0,1,1H8.88l9.46,8.24A1,1,0,0,0,20,31.43V4.72A1,1,0,0,0,18.33,4Z"/>'
};
var volumeUpIconName = "volume-up";
var volumeUpIcon = [volumeUpIconName, renderIcon(icon220)];

// node_modules/@clr/core/icon/shapes/arrow-mini.js
var icon221 = {
  outline: '<path d="M29.18,13.26,17.92,3,6.63,13.28a2,2,0,0,0-.55,2.33,2,2,0,0,0,3.19.68L16,10.13V30.29a2,2,0,0,0,1.35,2A2,2,0,0,0,20,30.38V10.28l6.57,6a2,2,0,0,0,1.35.52,2,2,0,0,0,1.72-1A2.08,2.08,0,0,0,29.18,13.26Z"/>'
};
var arrowMiniIconName = "arrow-mini";
var arrowMiniIcon = [arrowMiniIconName, renderIcon(icon221)];

// node_modules/@clr/core/icon/shapes/calendar-mini.js
var icon222 = {
  outline: '<path d="M29,8H27.6V4a1.6,1.6,0,0,0-3.2,0V8H11.6V4A1.6,1.6,0,0,0,8.4,4V8H7a3,3,0,0,0-3,3V29a3,3,0,0,0,3,3H29a3,3,0,0,0,3-3V11A3,3,0,0,0,29,8Zm-1,4v4.4H8V12ZM8,28V19.6H28V28Z"/>',
  solid: '<path d="M29,8H27.6V4a1.6,1.6,0,0,0-3.2,0V8H11.6V4A1.6,1.6,0,0,0,8.4,4V8H7a3,3,0,0,0-3,3V29a3,3,0,0,0,3,3H29a3,3,0,0,0,3-3V11A3,3,0,0,0,29,8ZM8,28V16H28V28Z"/>'
};
var calendarMiniIconName = "calendar-mini";
var calendarMiniIcon = [calendarMiniIconName, renderIcon(icon222)];

// node_modules/@clr/core/icon/shapes/check-circle-mini.js
var icon223 = {
  outline: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm0,24A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/><path d="M21.66,14.72,16.5,19.88l-2.79-2.79a1.61,1.61,0,0,0-2.27,2.27l5.06,5.05L23.92,17a1.6,1.6,0,0,0,0-2.26A1.62,1.62,0,0,0,21.66,14.72Z"/>',
  solid: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm8.27,12.51L16.9,25.94l-6.34-6.55a2,2,0,1,1,2.88-2.78l3.5,3.62,6.49-6.54a2,2,0,1,1,2.84,2.82Z"/>'
};
var checkCircleMiniIconName = "check-circle-mini";
var checkCircleMiniIcon = [checkCircleMiniIconName, renderIcon(icon223)];

// node_modules/@clr/core/icon/shapes/check-mini.js
var icon224 = {
  outline: '<path d="M13.13,27.94,4.61,17.43a2,2,0,1,1,3.11-2.52l5.71,7L28.49,6.68a2,2,0,0,1,2.85,2.81Z"/>'
};
var checkMiniIconName = "check-mini";
var checkMiniIcon = [checkMiniIconName, renderIcon(icon224)];

// node_modules/@clr/core/icon/shapes/error-mini.js
var icon225 = {
  outline: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm0,24A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/><rect x="16" y="12" width="4" height="6"/><rect x="16" y="20.8" width="4" height="3.2"/>',
  solid: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm2,20H16V20h4Zm0-8H16V8h4Z"/>'
};
var errorMiniIconName = "error-mini";
var errorMiniIcon = [errorMiniIconName, renderIcon(icon225)];

// node_modules/@clr/core/icon/shapes/event-mini.js
var icon226 = {
  outline: '<path d="M29,8H27.6V4a1.6,1.6,0,0,0-3.2,0V8H11.6V4A1.6,1.6,0,0,0,8.4,4V8H7a3,3,0,0,0-3,3V29a3,3,0,0,0,3,3H29a3,3,0,0,0,3-3V11A3,3,0,0,0,29,8ZM28,28H8V12H28Z"/><path d="M16.8,25.66l7.71-7.8a1.6,1.6,0,1,0-2.27-2.25l-5.45,5.51L14,18.33a1.6,1.6,0,0,0-2.26,2.27Z"/>',
  solid: '<path d="M30,8H27.6V4a1.6,1.6,0,0,0-3.2,0V8H11.6V4A1.6,1.6,0,0,0,8.4,4V8H6a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V10A2,2,0,0,0,30,8Zm-4.57,9.43L16.36,26.6l-6-6a2,2,0,1,1,2.82-2.83l3.14,3.13,6.23-6.3a2,2,0,0,1,2.85,2.81Z"/>'
};
var eventMiniIconName = "event-mini";
var eventMiniIcon = [eventMiniIconName, renderIcon(icon226)];

// node_modules/@clr/core/icon/shapes/filter-grid-circle-mini.js
var icon227 = {
  outline: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm2,23.8V23l5.29-5.76A1.9,1.9,0,0,0,23.92,14H11.7a1.9,1.9,0,0,0-1.37,3.21L16,23.08V27.8a10,10,0,1,1,4,0Z"/>',
  solid: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm8.76,10.68L20,20.8v5.08H16V20.8L9.24,14.68A1.56,1.56,0,0,1,10.52,12h15A1.56,1.56,0,0,1,26.76,14.68Z"/>'
};
var filterGridCircleMiniIconName = "filter-grid-circle-mini";
var filterGridCircleMiniIcon = [filterGridCircleMiniIconName, renderIcon(icon227)];

// node_modules/@clr/core/icon/shapes/filter-grid-mini.js
var icon228 = {
  outline: '<path d="M12,19v8.8l4,2.05V18.27A2,2,0,0,0,15.55,17L8.18,8H27.74l-7.29,8.93A2,2,0,0,0,20,18.19V31.88l4,2v-15L33.51,7.26A2,2,0,0,0,32,4H4A2,2,0,0,0,2.41,7.27Z"/>',
  solid: '<path d="M32.13,4H3.92A2,2,0,0,0,2.53,7.44L14,18.54v9.52l8,4.08V18.58L33.52,7.44A2,2,0,0,0,32.13,4Z"/>'
};
var filterGridMiniIconName = "filter-grid-mini";
var filterGridMiniIcon = [filterGridMiniIconName, renderIcon(icon228)];

// node_modules/@clr/core/icon/shapes/info-circle-mini.js
var icon229 = {
  outline: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm0,24A10,10,0,1,1,28,18,10,10,0,0,1,18,28Z"/><rect x="16" y="18" width="4" height="6"/><rect x="16" y="12" width="4" height="3.2"/>',
  solid: '<path d="M18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Zm2,22H16V16h4Zm0-14H16V8h4Z"/>'
};
var infoCircleMiniIconName = "info-circle-mini";
var infoCircleMiniIcon = [infoCircleMiniIconName, renderIcon(icon229)];

// node_modules/@clr/core/icon/shapes/times-mini.js
var icon230 = {
  outline: '<path d="M29.37,6.35a2,2,0,0,0-2.83,0L18,14.94,9.37,6.35A2,2,0,0,0,6.54,9.18l8.59,8.59L6.54,26.35a2,2,0,1,0,2.83,2.83L18,20.6l8.58,8.58a2,2,0,0,0,2.83-2.83l-8.59-8.58,8.59-8.59A2,2,0,0,0,29.37,6.35Z"/>'
};
var timesMiniIconName = "times-mini";
var timesMiniIcon = [timesMiniIconName, renderIcon(icon230)];

// node_modules/@clr/core/icon/shapes/warning-mini.js
var icon231 = {
  outline: '<path d="M32.47,25.6,21.75,5.92a4.27,4.27,0,0,0-7.5,0L3.53,25.6a4.27,4.27,0,0,0,3.75,6.32H28.72a4.27,4.27,0,0,0,3.75-6.32ZM29,27.78a.26.26,0,0,1-.24.14H7.28A.26.26,0,0,1,7,27.78a.25.25,0,0,1,0-.27L17.76,7.83a.28.28,0,0,1,.48,0L29,27.51A.25.25,0,0,1,29,27.78Z"/><rect x="16" y="12" width="4" height="8"/><rect x="16" y="22" width="4" height="4"/>',
  solid: '<path d="M32.71,29,20.44,4.42a2.73,2.73,0,0,0-4.88,0L3.29,29a2.73,2.73,0,0,0,2.44,4H30.27A2.73,2.73,0,0,0,32.71,29ZM20,28H16V24h4Zm0-8H16V12h4Z"/>'
};
var warningMiniIconName = "warning-mini";
var warningMiniIcon = [warningMiniIconName, renderIcon(icon231)];

// node_modules/@clr/core/icon/shapes/administrator.js
var icon232 = {
  outline: '<path d="M14.68,14.81a6.76,6.76,0,1,1,6.76-6.75A6.77,6.77,0,0,1,14.68,14.81Zm0-11.51a4.76,4.76,0,1,0,4.76,4.76A4.76,4.76,0,0,0,14.68,3.3Z"/><path d="M16.42,31.68A2.14,2.14,0,0,1,15.8,30H4V24.22a14.81,14.81,0,0,1,11.09-4.68l.72,0a2.2,2.2,0,0,1,.62-1.85l.12-.11c-.47,0-1-.06-1.46-.06A16.47,16.47,0,0,0,2.2,23.26a1,1,0,0,0-.2.6V30a2,2,0,0,0,2,2H16.7Z"/><path d="M26.87,16.29a.37.37,0,0,1,.15,0,.42.42,0,0,0-.15,0Z" /><path d="M33.68,23.32l-2-.61a7.21,7.21,0,0,0-.58-1.41l1-1.86A.38.38,0,0,0,32,19l-1.45-1.45a.36.36,0,0,0-.44-.07l-1.84,1a7.15,7.15,0,0,0-1.43-.61l-.61-2a.36.36,0,0,0-.36-.24H23.82a.36.36,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.6l-1.82-1a.35.35,0,0,0-.43.07L17.69,19a.38.38,0,0,0-.06.44l1,1.82A6.77,6.77,0,0,0,18,22.69l-2,.6a.36.36,0,0,0-.26.35v2.05A.35.35,0,0,0,16,26l2,.61a7,7,0,0,0,.6,1.41l-1,1.91a.36.36,0,0,0,.06.43l1.45,1.45a.38.38,0,0,0,.44.07l1.87-1a7.09,7.09,0,0,0,1.4.57l.6,2a.38.38,0,0,0,.35.26h2.05a.37.37,0,0,0,.35-.26l.61-2.05a6.92,6.92,0,0,0,1.38-.57l1.89,1a.36.36,0,0,0,.43-.07L32,30.4A.35.35,0,0,0,32,30l-1-1.88a7,7,0,0,0,.58-1.39l2-.61a.36.36,0,0,0,.26-.35V23.67A.36.36,0,0,0,33.68,23.32ZM24.85,28a3.34,3.34,0,1,1,3.33-3.33A3.34,3.34,0,0,1,24.85,28Z"/>',
  solid: '<circle cx="14.67" cy="8.3" r="6"/><path d="M16.44,31.82a2.15,2.15,0,0,1-.38-2.55l.53-1-1.09-.33A2.14,2.14,0,0,1,14,25.84V23.79a2.16,2.16,0,0,1,1.53-2.07l1.09-.33-.52-1a2.17,2.17,0,0,1,.35-2.52,18.92,18.92,0,0,0-2.32-.16A15.58,15.58,0,0,0,2,23.07v7.75a1,1,0,0,0,1,1H16.44Z"/><path d="M33.7,23.46l-2-.6a6.73,6.73,0,0,0-.58-1.42l1-1.86a.35.35,0,0,0-.07-.43l-1.45-1.46a.38.38,0,0,0-.43-.07l-1.85,1a7.74,7.74,0,0,0-1.43-.6l-.61-2a.38.38,0,0,0-.36-.25H23.84a.38.38,0,0,0-.35.26l-.6,2a6.85,6.85,0,0,0-1.45.61l-1.81-1a.38.38,0,0,0-.44.06l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82A7.24,7.24,0,0,0,18,22.83l-2,.61a.36.36,0,0,0-.26.35v2.05a.36.36,0,0,0,.26.35l2,.61a7.29,7.29,0,0,0,.6,1.41l-1,1.9a.37.37,0,0,0,.07.44L19.16,32a.38.38,0,0,0,.44.06l1.87-1a7.09,7.09,0,0,0,1.4.57l.6,2.05a.38.38,0,0,0,.36.26h2.05a.38.38,0,0,0,.35-.26l.6-2.05a6.68,6.68,0,0,0,1.38-.57l1.89,1a.38.38,0,0,0,.44-.06L32,30.55a.38.38,0,0,0,.06-.44l-1-1.88a6.92,6.92,0,0,0,.57-1.38l2-.61a.39.39,0,0,0,.27-.35V23.82A.4.4,0,0,0,33.7,23.46Zm-8.83,4.72a3.34,3.34,0,1,1,3.33-3.34A3.34,3.34,0,0,1,24.87,28.18Z"/>'
};
var administratorIconName = "administrator";
var administratorIcon = [administratorIconName, renderIcon(icon232)];

// node_modules/@clr/core/icon/shapes/animation.js
var icon233 = {
  outline: '<path d="M10.16,31.71a4.4,4.4,0,0,1-4.64-1A4.34,4.34,0,0,1,4.23,27.6a4.41,4.41,0,0,1,.18-1.2,11.61,11.61,0,0,1-1-2.56,6.4,6.4,0,0,0,9.33,8.63A11.55,11.55,0,0,1,10.16,31.71Z"/><path d="M18.41,27.68a7.61,7.61,0,0,1-9.08-1.26,7.58,7.58,0,0,1-1.27-9.06,14.26,14.26,0,0,1-.37-2.85,9.58,9.58,0,0,0,.22,13.33,9.63,9.63,0,0,0,13.35.22A14.46,14.46,0,0,1,18.41,27.68Z"/><path d="M21.66,26.21a12.1,12.1,0,1,1,8.57-3.54h0A12.11,12.11,0,0,1,21.66,26.21ZM21.66,4A10.11,10.11,0,0,0,11.54,14.11a10,10,0,0,0,3,7.14,10.12,10.12,0,0,0,14.31,0A10.11,10.11,0,0,0,21.66,4Zm7.86,18h0Z"/>',
  solid: '<path d="M3.5,23.77a6.41,6.41,0,0,0,9.33,8.67A11.65,11.65,0,0,1,3.5,23.77Z"/><path d="M7.68,14.53a9.6,9.6,0,0,0,13.4,13.7A14.11,14.11,0,0,1,7.68,14.53Z"/><path d="M21.78,2A12.12,12.12,0,1,1,9.66,14.15,12.12,12.12,0,0,1,21.78,2"/>'
};
var animationIconName = "animation";
var animationIcon = [animationIconName, renderIcon(icon233)];

// node_modules/@clr/core/icon/shapes/application.js
var icon234 = {
  outline: '<rect x="5" y="7" width="2" height="2"/><rect x="9" y="7" width="2" height="2"/><rect x="13" y="7" width="2" height="2"/><path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4ZM4,6H32v4.2H4ZM4,30V11.8H32V30Z"/>',
  solid: '<path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4Zm0,6.2H4V6H32Z"/><rect x="5" y="7" width="2" height="2"/><rect x="9" y="7" width="2" height="2"/><rect x="13" y="7" width="2" height="2"/>'
};
var applicationIconName = "application";
var applicationIcon = [applicationIconName, renderIcon(icon234)];

// node_modules/@clr/core/icon/shapes/applications.js
var icon235 = {
  outline: '<polygon points="8 8 4 8 4 10 10 10 10 4 8 4 8 8"/><polygon points="19 8 15 8 15 10 21 10 21 4 19 4 19 8"/><polygon points="30 4 30 8 26 8 26 10 32 10 32 4 30 4"/><polygon points="8 19 4 19 4 21 10 21 10 15 8 15 8 19"/><polygon points="19 19 15 19 15 21 21 21 21 15 19 15 19 19"/><polygon points="30 19 26 19 26 21 32 21 32 15 30 15 30 19"/><polygon points="8 30 4 30 4 32 10 32 10 26 8 26 8 30"/><polygon points="19 30 15 30 15 32 21 32 21 26 19 26 19 30"/><polygon points="30 30 26 30 26 32 32 32 32 26 30 26 30 30"/>',
  outlineAlerted: '<polygon points="8 8 4 8 4 10 10 10 10 4 8 4 8 8"/><polygon points="8 19 4 19 4 21 10 21 10 15 8 15 8 19"/><polygon points="19 19 15 19 15 21 21 21 21 15 19 15 19 19"/><polygon points="30 15 30 19 26 19 26 21 32 21 32 15 30 15"/><polygon points="8 30 4 30 4 32 10 32 10 26 8 26 8 30"/><polygon points="19 30 15 30 15 32 21 32 21 26 19 26 19 30"/><polygon points="30 30 26 30 26 32 32 32 32 26 30 26 30 30"/><path d="M19,8H15v2h4L19,9.89,21,6.5V4H19Z"/>',
  outlineBadged: '<polygon points="8 8 4 8 4 10 10 10 10 4 8 4 8 8"/><polygon points="19 8 15 8 15 10 21 10 21 4 19 4 19 8"/><polygon points="8 19 4 19 4 21 10 21 10 15 8 15 8 19"/><polygon points="19 19 15 19 15 21 21 21 21 15 19 15 19 19"/><polygon points="30 19 26 19 26 21 32 21 32 15 30 15 30 19"/><polygon points="8 30 4 30 4 32 10 32 10 26 8 26 8 30"/><polygon points="19 30 15 30 15 32 21 32 21 26 19 26 19 30"/><polygon points="30 30 26 30 26 32 32 32 32 26 30 26 30 30"/>',
  solid: '<rect x="4" y="4" width="6" height="6"/><rect x="4" y="15" width="6" height="6"/><rect x="4" y="26" width="6" height="6"/><rect x="15" y="4" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><rect x="15" y="26" width="6" height="6"/><rect x="26" y="4" width="6" height="6"/><rect x="26" y="15" width="6" height="6"/><rect x="26" y="26" width="6" height="6"/>',
  solidAlerted: '<rect x="4" y="4" width="6" height="6"/><rect x="4" y="15" width="6" height="6"/><rect x="4" y="26" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><rect x="15" y="26" width="6" height="6"/><rect x="26" y="15" width="6" height="6"/><rect x="26" y="26" width="6" height="6"/><path d="M15,10h4L19,9.89,21,6.5V4H15Z"/>',
  solidBadged: '<rect x="4" y="4" width="6" height="6"/><rect x="4" y="15" width="6" height="6"/><rect x="4" y="26" width="6" height="6"/><rect x="15" y="4" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><rect x="15" y="26" width="6" height="6"/><rect x="26" y="15" width="6" height="6"/><rect x="26" y="26" width="6" height="6"/>'
};
var applicationsIconName = "applications";
var applicationsIcon = [applicationsIconName, renderIcon(icon235)];

// node_modules/@clr/core/icon/shapes/archive.js
var icon236 = {
  outline: '<path d="M29,32H7V22H5V32a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V22H29Z"/><path d="M14,24a1,1,0,0,0,1,1h6a1,1,0,0,0,0-2H15A1,1,0,0,0,14,24Z"/><path d="M14,18H6V14h4a3,3,0,0,1-.68-1.87s0-.09,0-.13H5.5A1.5,1.5,0,0,0,4,13.5V20H16Z"/><path d="M30.5,12H26.66s0,.09,0,.13A3,3,0,0,1,26,14h4v4H22l-2,2H32V13.5A1.5,1.5,0,0,0,30.5,12Z"/><path d="M18,19.18l6.38-6.35A1,1,0,1,0,23,11.41l-4,3.95V3a1,1,0,1,0-2,0v12.4l-4-3.95a1,1,0,0,0-1.41,1.42Z"/>',
  solid: '<path d="M19.41,20.6,18,22l-1.41-1.4L16,20H5V32a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V20H20ZM22,24a1,1,0,0,1-1,1H15a1,1,0,0,1,0-2h6A1,1,0,0,1,22,24Z"/><path d="M30.5,12H26.66s0,.09,0,.13a3,3,0,0,1-.88,2.12L22,18H32V13.5A1.5,1.5,0,0,0,30.5,12Z"/><path d="M10.2,14.25a3,3,0,0,1-.88-2.12s0-.09,0-.13H5.5A1.5,1.5,0,0,0,4,13.5V18H14Z"/><path d="M18,19.18l6.38-6.35A1,1,0,1,0,23,11.41l-4,3.95V3a1,1,0,1,0-2,0v12.4l-4-3.95a1,1,0,0,0-1.41,1.42Z"/>'
};
var archiveIconName = "archive";
var archiveIcon = [archiveIconName, renderIcon(icon236)];

// node_modules/@clr/core/icon/shapes/assign-user.js
var icon237 = {
  outline: '<path d="M18,17a7.46,7.46,0,1,0-7.45-7.46A7.46,7.46,0,0,0,18,17ZM18,4.07a5.46,5.46,0,1,1-5.45,5.45A5.46,5.46,0,0,1,18,4.07Z"/><path d="M6,31.89V25.77a16.13,16.13,0,0,1,12-5,16.61,16.61,0,0,1,8.71,2.33l1.35-1.51A18.53,18.53,0,0,0,18,18.74,17.7,17.7,0,0,0,4.21,24.8a1,1,0,0,0-.21.6v6.49A2.06,2.06,0,0,0,6,34H18.39l-1.9-2Z"/><path d="M30,31.89,30,32H26.85l-1.8,2H30a2.06,2.06,0,0,0,2-2.07V26.2l-2,2.23Z"/><path d="M34.76,18.62a1,1,0,0,0-1.41.08l-11.62,13-5.2-5.59A1,1,0,0,0,15.12,26a1,1,0,0,0-.06,1.42l6.69,7.2L34.84,20A1,1,0,0,0,34.76,18.62Z"/>',
  solid: '<circle cx="17.99" cy="10.36" r="6.81"/><path d="M12,26.65a2.8,2.8,0,0,1,4.85-1.8L20.71,29l6.84-7.63A16.81,16.81,0,0,0,18,18.55,16.13,16.13,0,0,0,5.5,24a1,1,0,0,0-.2.61V30a2,2,0,0,0,1.94,2h8.57l-3.07-3.3A2.81,2.81,0,0,1,12,26.65Z"/><path d="M28.76,32a2,2,0,0,0,1.94-2V26.24L25.57,32Z"/><path d="M33.77,18.62a1,1,0,0,0-1.42.08l-11.62,13-5.2-5.59A1,1,0,0,0,14.12,26a1,1,0,0,0,0,1.42l6.68,7.2L33.84,20A1,1,0,0,0,33.77,18.62Z"/>'
};
var assignUserIconName = "assign-user";
var assignUserIcon = [assignUserIconName, renderIcon(icon237)];

// node_modules/@clr/core/icon/shapes/atom.js
var icon238 = {
  outline: '<path d="M18,14.05a4,4,0,1,0,4,4A4,4,0,0,0,18,14.05Zm0,6.44a2.42,2.42,0,1,1,2.42-2.42A2.42,2.42,0,0,1,18,20.49Z"/><path d="M24.23,11.71a39.14,39.14,0,0,0-4.57-3.92,22.86,22.86,0,0,1,3.48-1.72c.32-.12.62-.21.92-.3a2.28,2.28,0,0,0,3.81-.46,3.31,3.31,0,0,1,1.92.84c1.19,1.19,1.22,3.59.1,6.58.49.65.94,1.31,1.35,2,.17-.4.35-.79.49-1.18,1.47-3.85,1.28-7-.53-8.78a5.29,5.29,0,0,0-3.33-1.44,2.29,2.29,0,0,0-4.31.54c-.37.11-.74.22-1.13.37a25.79,25.79,0,0,0-4.57,2.35A26.21,26.21,0,0,0,13.28,4.2c-3.85-1.46-7-1.28-8.77.53C2.85,6.4,2.58,9.17,3.68,12.59a2.28,2.28,0,0,0,1.59,3.67c.32.61.67,1.22,1.06,1.82A25.54,25.54,0,0,0,4,22.66c-1.47,3.84-1.28,7,.53,8.77a5.63,5.63,0,0,0,4.12,1.51,13.34,13.34,0,0,0,4.65-1,26.21,26.21,0,0,0,4.58-2.35A25.79,25.79,0,0,0,22.43,32a14.16,14.16,0,0,0,3.65.9A2.3,2.3,0,0,0,30.46,32a4.55,4.55,0,0,0,.74-.57c1.81-1.81,2-4.93.53-8.77A32.68,32.68,0,0,0,24.23,11.71ZM12.57,30.09c-3,1.15-5.45,1.13-6.65-.08s-1.23-3.62-.07-6.64a22.77,22.77,0,0,1,1.71-3.48,40.19,40.19,0,0,0,3.92,4.56c.43.43.87.85,1.31,1.25q.9-.46,1.83-1.05c-.58-.52-1.16-1-1.72-1.61a34,34,0,0,1-5.74-7.47A2.29,2.29,0,0,0,5.5,11.69h0c-.75-2.5-.62-4.49.43-5.54a3.72,3.72,0,0,1,2.72-.92,11.4,11.4,0,0,1,3.93.84,22.86,22.86,0,0,1,3.48,1.72,39.14,39.14,0,0,0-4.57,3.92c-.44.44-.87.9-1.29,1.36a20.27,20.27,0,0,0,1,1.85c.54-.61,1.09-1.21,1.68-1.8a36.33,36.33,0,0,1,5-4.17,36.88,36.88,0,0,1,4.95,4.17,36.26,36.26,0,0,1,4.17,5,37,37,0,0,1-4.17,5A30.68,30.68,0,0,1,12.57,30.09ZM29.79,30l-.16.13a2.27,2.27,0,0,0-3.5.72,12.57,12.57,0,0,1-3-.77,22,22,0,0,1-3.48-1.72,39.14,39.14,0,0,0,4.57-3.92,38.26,38.26,0,0,0,3.92-4.56,22.88,22.88,0,0,1,1.72,3.48C31,26.39,31,28.81,29.79,30Z"/>',
  solid: '<path d="M24.23,11.71a39.14,39.14,0,0,0-4.57-3.92,22.86,22.86,0,0,1,3.48-1.72c.32-.12.62-.21.92-.3a2.28,2.28,0,0,0,3.81-.46,3.31,3.31,0,0,1,1.92.84c1.19,1.19,1.22,3.59.1,6.58.49.65.94,1.31,1.35,2,.17-.4.35-.79.49-1.18,1.47-3.85,1.28-7-.53-8.78a5.29,5.29,0,0,0-3.33-1.44,2.29,2.29,0,0,0-4.31.54c-.37.11-.74.22-1.13.37a25.79,25.79,0,0,0-4.57,2.35A26.21,26.21,0,0,0,13.28,4.2c-3.85-1.46-7-1.28-8.77.53C2.85,6.4,2.58,9.17,3.68,12.59a2.28,2.28,0,0,0,1.59,3.67c.32.61.67,1.22,1.06,1.82A25.54,25.54,0,0,0,4,22.66c-1.47,3.84-1.28,7,.53,8.77a5.63,5.63,0,0,0,4.12,1.51,13.34,13.34,0,0,0,4.65-1,26.21,26.21,0,0,0,4.58-2.35A25.79,25.79,0,0,0,22.43,32a14.16,14.16,0,0,0,3.65.9A2.3,2.3,0,0,0,30.46,32a4.55,4.55,0,0,0,.74-.57c1.81-1.81,2-4.93.53-8.77A32.68,32.68,0,0,0,24.23,11.71ZM12.57,30.09c-3,1.15-5.45,1.13-6.65-.08s-1.23-3.62-.07-6.64a22.77,22.77,0,0,1,1.71-3.48,40.19,40.19,0,0,0,3.92,4.56c.43.43.87.85,1.31,1.25q.9-.46,1.83-1.05c-.58-.52-1.16-1-1.72-1.61a34,34,0,0,1-5.74-7.47A2.29,2.29,0,0,0,5.5,11.69h0c-.75-2.5-.62-4.49.43-5.54a3.72,3.72,0,0,1,2.72-.92,11.4,11.4,0,0,1,3.93.84,22.86,22.86,0,0,1,3.48,1.72,39.14,39.14,0,0,0-4.57,3.92c-.44.44-.87.9-1.29,1.36a20.27,20.27,0,0,0,1,1.85c.54-.61,1.09-1.21,1.68-1.8a36.33,36.33,0,0,1,5-4.17,36.88,36.88,0,0,1,4.95,4.17,36.26,36.26,0,0,1,4.17,5,37,37,0,0,1-4.17,5A30.68,30.68,0,0,1,12.57,30.09ZM29.79,30l-.16.13a2.27,2.27,0,0,0-3.5.72,12.57,12.57,0,0,1-3-.77,22,22,0,0,1-3.48-1.72,39.14,39.14,0,0,0,4.57-3.92,38.26,38.26,0,0,0,3.92-4.56,22.88,22.88,0,0,1,1.72,3.48C31,26.39,31,28.81,29.79,30Z"/><circle cx="17.99" cy="18.07" r="3.3" transform="translate(-2.66 3.11) rotate(-9.22)"/>'
};
var atomIconName = "atom";
var atomIcon = [atomIconName, renderIcon(icon238)];

// node_modules/@clr/core/icon/shapes/backup.js
var icon239 = {
  outline: '<rect x="6" y="22" width="24" height="2"/><rect x="26" y="26" width="4" height="2"/><path d="M30.84,13.37A1.94,1.94,0,0,0,28.93,12H26.55a3,3,0,0,1-.14,2h2.54C30,16.94,31.72,21.65,32,22.48V30H4V22.48C4.28,21.65,7.05,14,7.05,14H9.58a3,3,0,0,1-.14-2H7.07a1.92,1.92,0,0,0-1.9,1.32C2,22,2,22.1,2,22.33V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22.33C34,22.1,34,22,30.84,13.37Z"/><path d="M18,19.84l6.38-6.35A1,1,0,1,0,23,12.08L19,16V4a1,1,0,1,0-2,0V16l-4-3.95a1,1,0,0,0-1.41,1.42Z"/>',
  outlineAlerted: '<rect x="6" y="22" width="24" height="2"/><rect x="26" y="26" width="4" height="2"/><path d="M18,19.84l4.47-4.44h-.23a3.67,3.67,0,0,1-2-.61L19,16V4a1,1,0,1,0-2,0V16l-4-3.95a1,1,0,0,0-1.41,1.42Z"/><path d="M31.58,15.4H29.46c1,2.85,2.31,6.37,2.54,7.08V30H4V22.48C4.28,21.65,7.05,14,7.05,14H9.58a3,3,0,0,1-.14-2H7.07a1.92,1.92,0,0,0-1.9,1.32C2,22,2,22.1,2,22.33V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22.33C34,22.12,34,22,31.58,15.4Z"/>',
  outlineBadged: '<rect x="6" y="22" width="24" height="2"/><rect x="26" y="26" width="4" height="2"/><path d="M18,19.84l6.38-6.35A1,1,0,1,0,23,12.08L19,16V4a1,1,0,1,0-2,0V16l-4-3.95a1,1,0,0,0-1.41,1.42Z"/><path d="M30.87,13.45a7.55,7.55,0,0,1-.87.05,7.46,7.46,0,0,1-3.35-.8,3,3,0,0,1-.24,1.3h2.54C30,16.94,31.72,21.65,32,22.48V30H4V22.48C4.28,21.65,7.05,14,7.05,14H9.58a3,3,0,0,1-.14-2H7.07a1.92,1.92,0,0,0-1.9,1.32C2,22,2,22.1,2,22.33V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22.33C34,22.1,34,22,30.87,13.45Z"/>',
  solid: '<path d="M18,19.84l6.38-6.35A1,1,0,1,0,23,12.08L19,16V4a1,1,0,1,0-2,0V16l-4-3.95a1,1,0,0,0-1.41,1.42Z"/><path d="M19.41,21.26l-.74.74H33.93c-.17-.57-.79-2.31-3.09-8.63A1.94,1.94,0,0,0,28.93,12H26.55a3,3,0,0,1-.76,2.92Z"/><path d="M16.58,21.26,10.2,14.91A3,3,0,0,1,9.44,12H7.07a1.92,1.92,0,0,0-1.9,1.32C2.86,19.68,2.24,21.43,2.07,22H17.33Z"/><path d="M2,24v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24Zm28,4H26V26h4Z"/>',
  solidAlerted: '<path d="M16.58,21.26,10.2,14.91A3,3,0,0,1,9.44,12H7.07a1.92,1.92,0,0,0-1.9,1.32C2.86,19.68,2.24,21.43,2.07,22H17.33Z"/><path d="M2,24v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24Zm28,4H26V26h4Z"/><path d="M18.66,22H33.93c-.15-.51-.65-1.93-2.35-6.6H25.3l-5.89,5.86Z"/><path d="M18,19.84l4.47-4.44h-.23a3.64,3.64,0,0,1-2-.61L19,16V4a1,1,0,1,0-2,0V16l-4-3.95a1,1,0,0,0-1.41,1.42Z"/>',
  solidBadged: '<path d="M18,19.84l6.38-6.35A1,1,0,1,0,23,12.08L19,16V4a1,1,0,1,0-2,0V16l-4-3.95a1,1,0,0,0-1.41,1.42Z"/><path d="M16.58,21.26,10.2,14.91A3,3,0,0,1,9.44,12H7.07a1.92,1.92,0,0,0-1.9,1.32C2.86,19.68,2.24,21.43,2.07,22H17.33Z"/><path d="M2,24v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24Zm28,4H26V26h4Z"/><path d="M18.66,22H33.93c-.17-.57-.79-2.3-3.06-8.55a7.55,7.55,0,0,1-.87.05,7.46,7.46,0,0,1-3.35-.8,3,3,0,0,1-.86,2.21l-6.38,6.35Z"/>'
};
var backupIconName = "backup";
var backupIcon = [backupIconName, renderIcon(icon239)];

// node_modules/@clr/core/icon/shapes/backup-restore.js
var icon240 = {
  outline: '<rect x="6" y="22" width="24" height="2"/><rect x="26" y="26" width="4" height="2"/><path d="M13,9.92,17,6V19a1,1,0,1,0,2,0V6l4,3.95A1,1,0,1,0,24.38,8.5L18,2.16,11.61,8.5A1,1,0,0,0,13,9.92Z"/><path d="M30.84,13.37A1.94,1.94,0,0,0,28.93,12H21v2h7.95C30,16.94,31.72,21.65,32,22.48V30H4V22.48C4.28,21.65,7.05,14,7.05,14H15V12H7.07a1.92,1.92,0,0,0-1.9,1.32C2,22,2,22.1,2,22.33V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22.33C34,22.1,34,22,30.84,13.37Z"/>',
  outlineAlerted: '<rect x="6" y="22" width="24" height="2"/><rect x="26" y="26" width="4" height="2"/><path d="M13,9.92,17,6V19a1,1,0,1,0,2,0V6l1.47,1.46,1-1.79L18,2.16,11.61,8.5A1,1,0,0,0,13,9.92Z"/><path d="M31.58,15.4H29.46c1,2.85,2.31,6.37,2.54,7.08V30H4V22.48C4.28,21.65,7.05,14,7.05,14H15V12H7.07a1.92,1.92,0,0,0-1.9,1.32C2,22,2,22.1,2,22.33V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22.33C34,22.12,34,22,31.58,15.4Z"/>',
  outlineBadged: '<rect x="6" y="22" width="24" height="2"/><rect x="26" y="26" width="4" height="2"/><path d="M13,9.92,17,6V19a1,1,0,1,0,2,0V6l4,3.95a1,1,0,0,0,.71.29l.11,0a7.46,7.46,0,0,1-1.25-3.52L18,2.16,11.61,8.5A1,1,0,0,0,13,9.92Z"/><path d="M30.87,13.45a7.55,7.55,0,0,1-.87.05A7.46,7.46,0,0,1,25.51,12H21v2h7.95C30,16.94,31.72,21.65,32,22.48V30H4V22.48C4.28,21.65,7.05,14,7.05,14H15V12H7.07a1.92,1.92,0,0,0-1.9,1.32C2,22,2,22.1,2,22.33V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22.33C34,22.1,34,22,30.87,13.45Z"/>',
  solid: '<path d="M2,24v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24Zm28,5H26V27h4Z"/><path d="M30.84,13.37A1.94,1.94,0,0,0,28.93,12H21v6a3,3,0,1,1-6,0V12H7.07a1.92,1.92,0,0,0-1.9,1.32C2.86,19.68,2.24,21.43,2.07,22H33.93C33.77,21.43,33.14,19.69,30.84,13.37Z"/><path d="M13,9.92,17,6V18a1,1,0,1,0,2,0V6l4,3.95A1,1,0,1,0,24.38,8.5L18,2.16,11.61,8.5A1,1,0,0,0,13,9.92Z"/>',
  solidAlerted: '<path d="M2,24v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24Zm28,5H26V27h4Z"/><path d="M13,9.92,17,6V18a1,1,0,1,0,2,0V6l1.47,1.46,1-1.79L18,2.16,11.61,8.5A1,1,0,0,0,13,9.92Z"/><path d="M31.58,15.4H22.23A3.62,3.62,0,0,1,21,15.16V18a3,3,0,1,1-6,0V12H7.07a1.92,1.92,0,0,0-1.9,1.32C2.86,19.68,2.24,21.43,2.07,22H33.93C33.79,21.49,33.28,20.07,31.58,15.4Z"/>',
  solidBadged: '<path d="M2,24v6a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24Zm28,5H26V27h4Z"/><path d="M13,9.92,17,6V18a1,1,0,1,0,2,0V6l4,3.95a1,1,0,0,0,.71.29l.11,0a7.46,7.46,0,0,1-1.25-3.52L18,2.16,11.61,8.5A1,1,0,0,0,13,9.92Z"/><path d="M30.87,13.45a7.55,7.55,0,0,1-.87.05A7.46,7.46,0,0,1,25.51,12H21v6a3,3,0,1,1-6,0V12H7.07a1.92,1.92,0,0,0-1.9,1.32C2.86,19.68,2.24,21.43,2.07,22H33.93C33.77,21.43,33.15,19.7,30.87,13.45Z"/>'
};
var backupRestoreIconName = "backup-restore";
var backupRestoreIcon = [backupRestoreIconName, renderIcon(icon240)];

// node_modules/@clr/core/icon/shapes/bar-code.js
var icon241 = {
  outline: '<path d="M5,7A1,1,0,0,0,4,8V30a1,1,0,0,0,2,0V8A1,1,0,0,0,5,7Z"/><path d="M9,7A1,1,0,0,0,8,8V26a1,1,0,0,0,2,0V8A1,1,0,0,0,9,7Z"/><path d="M13,7a1,1,0,0,0-1,1V26a1,1,0,0,0,2,0V8A1,1,0,0,0,13,7Z"/><path d="M17,7a1,1,0,0,0-1,1V26a1,1,0,0,0,2,0V8A1,1,0,0,0,17,7Z"/><path d="M21,7a1,1,0,0,0-1,1V26a1,1,0,0,0,2,0V8A1,1,0,0,0,21,7Z"/><path d="M25,7a1,1,0,0,0-1,1V26a1,1,0,0,0,2,0V8A1,1,0,0,0,25,7Z"/><path d="M29,7a1,1,0,0,0-1,1V26a1,1,0,0,0,2,0V8A1,1,0,0,0,29,7Z"/><path d="M33,7a1,1,0,0,0-1,1V30a1,1,0,0,0,2,0V8A1,1,0,0,0,33,7Z"/>'
};
var barCodeIconName = "bar-code";
var barCodeIcon = [barCodeIconName, renderIcon(icon241)];

// node_modules/@clr/core/icon/shapes/battery.js
var icon242 = {
  outline: '<path d="M18.59,11.77a1,1,0,0,0-1.73,1l2.5,4.34-6.07-1,5.29,10.59a1,1,0,0,0,1.79-.89l-3.53-7.08,6.38,1.06Z"/><path d="M25.12,4H23V3.58A1.58,1.58,0,0,0,21.42,2H14.58A1.58,1.58,0,0,0,13,3.58V4H10.88A1.88,1.88,0,0,0,9,5.88V32.12A1.88,1.88,0,0,0,10.88,34H25.12A1.88,1.88,0,0,0,27,32.12V5.88A1.88,1.88,0,0,0,25.12,4ZM25,32H11V6h4V4h6V6h4Z"/>',
  outlineAlerted: '<path d="M18.59,11.77a1,1,0,0,0-1.73,1l2.5,4.34-6.07-1,5.29,10.59a1,1,0,0,0,1.79-.89l-3.53-7.08,6.38,1.06Z"/><path d="M25,15.4V32H11V6h4V4h6V6h.28l1.64-2.85A1.57,1.57,0,0,0,21.42,2H14.58A1.58,1.58,0,0,0,13,3.58V4H10.88A1.88,1.88,0,0,0,9,5.88V32.12A1.88,1.88,0,0,0,10.88,34H25.12A1.88,1.88,0,0,0,27,32.12V15.4Z"/>',
  outlineBadged: '<path d="M18.59,11.77a1,1,0,0,0-1.73,1l2.5,4.34-6.07-1,5.29,10.59a1,1,0,0,0,1.79-.89l-3.53-7.08,6.38,1.06Z"/><path d="M25,11.58V32H11V6h4V4h6V6H22.5A7.47,7.47,0,0,1,23,3.38,1.57,1.57,0,0,0,21.42,2H14.58A1.58,1.58,0,0,0,13,3.58V4H10.88A1.88,1.88,0,0,0,9,5.88V32.12A1.88,1.88,0,0,0,10.88,34H25.12A1.88,1.88,0,0,0,27,32.12V12.87A7.5,7.5,0,0,1,25,11.58Z"/>',
  solid: '<path d="M22,4V2.62A.6.6,0,0,0,21.42,2H14.58a.6.6,0,0,0-.58.62V4H10A1.09,1.09,0,0,0,9,5.07v28A1,1,0,0,0,10,34H26a1,1,0,0,0,1-.94v-28A1.09,1.09,0,0,0,26,4ZM20.26,25.44a1.2,1.2,0,0,1-2.15,1.07L12.65,15.56l6,1-2.29-4a1.2,1.2,0,1,1,2.08-1.2l4.83,8.37L16.9,18.7Z"/>',
  solidAlerted: '<path d="M22.23,15.4A3.66,3.66,0,0,1,20.55,15l2.76,4.79L16.9,18.7l3.36,6.73a1.2,1.2,0,0,1-2.15,1.07L12.65,15.56l6,1-2.29-4a1.2,1.2,0,1,1,2.08-1.2l.09.15A3.66,3.66,0,0,1,19,9.89L22.45,4H22V2.62A.6.6,0,0,0,21.42,2H14.58a.6.6,0,0,0-.58.62V4H10A1.09,1.09,0,0,0,9,5.07v28A1,1,0,0,0,10,34H26a1,1,0,0,0,1-.94V15.4Z"/>',
  solidBadged: '<path d="M22.5,6a7.49,7.49,0,0,1,.28-2H22V2.62A.6.6,0,0,0,21.42,2H14.58a.6.6,0,0,0-.58.62V4H10A1.09,1.09,0,0,0,9,5.07v28A1,1,0,0,0,10,34H26a1,1,0,0,0,1-.94V12.87A7.5,7.5,0,0,1,22.5,6ZM20.26,25.44a1.2,1.2,0,0,1-2.15,1.07L12.65,15.56l6,1-2.29-4a1.2,1.2,0,1,1,2.08-1.2l4.83,8.37L16.9,18.7Z"/>'
};
var batteryIconName = "battery";
var batteryIcon = [batteryIconName, renderIcon(icon242)];

// node_modules/@clr/core/icon/shapes/block.js
var icon243 = {
  outline: '<path d="M31.42,9.09l-13-6a1,1,0,0,0-.84,0l-13,6A1,1,0,0,0,4,10V27a1,1,0,0,0,.58.91l13,6a1,1,0,0,0,.84,0l13-6A1,1,0,0,0,32,27V10A1,1,0,0,0,31.42,9.09ZM18,5.1,28.61,10,18,14.9,7.39,10ZM6,11.56l11,5.08v14.8L6,26.36ZM19,31.44V16.64l11-5.08v14.8Z"/>',
  outlineAlerted: '<path d="M30,15.53V26.36L19,31.44V16.64l2.57-1.19a3.67,3.67,0,0,1-2.11-1.22L18,14.9,7.39,10,18,5.1l3.08,1.42,1-1.74L18.42,3.09a1,1,0,0,0-.84,0l-13,6A1,1,0,0,0,4,10V27a1,1,0,0,0,.58.91l13,6a1,1,0,0,0,.84,0l13-6A1,1,0,0,0,32,27V15.53ZM17,31.44,6,26.36V11.56l11,5.08Z"/>',
  outlineBadged: '<path d="M30,13.5V26.36L19,31.44V16.64l8.08-3.73a7.57,7.57,0,0,1-2-1.27L18,14.9,7.39,10,18,5.1l4.61,2.13A7.12,7.12,0,0,1,22.5,6a8,8,0,0,1,.07-1L18.42,3.09a1,1,0,0,0-.84,0l-13,6A1,1,0,0,0,4,10V27a1,1,0,0,0,.58.91l13,6a1,1,0,0,0,.84,0l13-6A1,1,0,0,0,32,27V13.22A7.37,7.37,0,0,1,30,13.5ZM17,31.44,6,26.36V11.56l11,5.08Z"/>',
  solid: '<path d="M31.42,9.09l-13-6a1,1,0,0,0-.84,0l-13,6A1,1,0,0,0,4,10V27a1,1,0,0,0,.58.91l13,6a1,1,0,0,0,.84,0l13-6A1,1,0,0,0,32,27V10A1,1,0,0,0,31.42,9.09ZM18,14.9,7.39,10,18,5.1,28.61,10ZM30,26.36,19,31.44V16.64l11-5.08Z"/>',
  solidAlerted: '<path d="M30,15.38v11L19,31.44V16.64l2.79-1.29a3.68,3.68,0,0,1-2.25-1.16L18,14.9,7.39,10,18,5.1l3,1.39,1-1.75L18.42,3.09a1,1,0,0,0-.84,0l-13,6A1,1,0,0,0,4,10V27a1,1,0,0,0,.58.91l13,6a1,1,0,0,0,.84,0l13-6A1,1,0,0,0,32,27V15.38Z"/>',
  solidBadged: '<path d="M30,13.5V26.36L19,31.44V16.64l8.08-3.73a7.57,7.57,0,0,1-2-1.27L18,14.9,7.39,10,18,5.1l4.61,2.13A7.12,7.12,0,0,1,22.5,6a8,8,0,0,1,.07-1L18.42,3.09a1,1,0,0,0-.84,0l-13,6A1,1,0,0,0,4,10V27a1,1,0,0,0,.58.91l13,6a1,1,0,0,0,.84,0l13-6A1,1,0,0,0,32,27V13.22A7.37,7.37,0,0,1,30,13.5Z"/>'
};
var blockIconName = "block";
var blockIcon = [blockIconName, renderIcon(icon243)];

// node_modules/@clr/core/icon/shapes/blocks-group.js
var icon244 = {
  outline: '<path d="M33.53,18.76,26.6,15.57V6.43A1,1,0,0,0,26,5.53l-7.5-3.45a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14L2.68,18.76a1,1,0,0,0-.58.91v9.78h0a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91h0V19.67A1,1,0,0,0,33.53,18.76Zm-2.81.91L25.61,22,20.5,19.67l5.11-2.35ZM18.1,4.08l5.11,2.35L18.1,8.78,13,6.43ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm6.5,11.49-6.5,3-6.5-3V21.23L10.18,24A1,1,0,0,0,11,24l6.08-2.8ZM11.6,15.57h0V8l6.08,2.8a1,1,0,0,0,.84,0L24.6,8v7.58h0l-6.5,3ZM32.11,28.81l-6.5,3-6.51-3V21.22L25.19,24A1,1,0,0,0,26,24l6.08-2.8Z"/>',
  outlineAlerted: '<path d="M33.53,18.76,26.6,15.57h-2v0l-6.5,3-6.5-3V8l6.08,2.8a1,1,0,0,0,.84,0l.24-.11a4.17,4.17,0,0,1,.29-.65l1.33-2.31-2.28,1L13,6.43l5.1-2.35,3.47,1.6,1-1.73L18.5,2.08a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm0,14.49-6.5-3V21.23L10.18,24A1,1,0,0,0,11,24l6.08-2.8,0,7.6Zm15-14.48,5.11,2.35L25.61,22,20.5,19.67Zm0,14.49-6.51-3V21.22L25.19,24A1,1,0,0,0,26,24l6.08-2.8,0,7.61Z"/>',
  outlineBadged: '<path d="M33.53,18.76,26.6,15.57V12.7a7.58,7.58,0,0,1-2-1.51v4.39l-6.5,3-6.5-3V8l6.08,2.8a1,1,0,0,0,.84,0L23,8.72a7.05,7.05,0,0,1-.47-2l-4.47,2L13,6.43l5.1-2.35,4.44,2s0-.06,0-.09a7.55,7.55,0,0,1,.27-2l-4.3-2a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm0,14.49-6.5-3V21.23L10.18,24A1,1,0,0,0,11,24l6.08-2.8,0,7.6Zm15-14.48,5.11,2.35L25.61,22,20.5,19.67Zm0,14.49-6.51-3V21.22L25.19,24A1,1,0,0,0,26,24l6.08-2.8,0,7.61Z"/>',
  solid: '<path d="M33.53,18.76,26.6,15.57V6.43A1,1,0,0,0,26,5.53l-7.5-3.45a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14L2.68,18.76a1,1,0,0,0-.58.91v9.78h0a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91h0V19.67A1,1,0,0,0,33.53,18.76ZM25.61,22,20.5,19.67l5.11-2.35,5.11,2.35Zm-1-6.44-6.44,3V10.87a1,1,0,0,0,.35-.08L24.6,8v7.58ZM18.1,4.08l5.11,2.35L18.1,8.78,13,6.43ZM10.6,17.31l5.11,2.35L10.6,22,5.49,19.67Zm6.5,11.49-6.5,3h0V24.11h0A1,1,0,0,0,11,24l6.08-2.8Zm15,0-6.46,3V24.11A1,1,0,0,0,26,24l6.08-2.8Z"/>',
  solidAlerted: '<path d="M33.53,18.76,26.6,15.57v0h-2v0l-6.43,3V10.87a1.05,1.05,0,0,0,.35-.08l.14-.06A3.23,3.23,0,0,1,19,10l1.28-2.22-2.14,1L13,6.43l5.1-2.35,3.39,1.56,1-1.73-4-1.83a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76Zm-28,.91,5.11-2.36,5.11,2.35L10.6,22ZM10.6,31.8V24.11A1.08,1.08,0,0,0,11,24l6.08-2.8,0,7.6Zm9.9-12.13,5.11-2.35,5.11,2.35L25.61,22ZM25.64,31.8V24.11A.89.89,0,0,0,26,24l6.08-2.8,0,7.6Z"/>',
  solidBadged: '<path d="M33.53,18.76,26.6,15.57V12.69a7.66,7.66,0,0,1-2-1.47v4.34l-6.43,3V10.87a1.05,1.05,0,0,0,.35-.08L23,8.73a7.65,7.65,0,0,1-.48-2l-4.42,2L13,6.43l5.1-2.35,4.38,2V6a7.55,7.55,0,0,1,.27-2L18.5,2.08a1,1,0,0,0-.84,0l-7.5,3.45a1,1,0,0,0-.58.91v9.14l-6.9,3.18a1,1,0,0,0-.58.91v9.78a1,1,0,0,0,.58.91l7.5,3.45a1,1,0,0,0,.84,0l7.08-3.26,7.08,3.26a1,1,0,0,0,.84,0l7.5-3.45a1,1,0,0,0,.58-.91V19.67A1,1,0,0,0,33.53,18.76Zm-28,.91,5.11-2.36,5.11,2.35L10.6,22ZM10.6,31.8V24.11A1.08,1.08,0,0,0,11,24l6.08-2.8,0,7.6Zm9.9-12.13,5.11-2.35,5.11,2.35L25.61,22ZM25.64,31.8V24.11A.89.89,0,0,0,26,24l6.08-2.8,0,7.6Z"/>'
};
var blocksGroupIconName = "blocks-group";
var blocksGroupIcon = [blocksGroupIconName, renderIcon(icon244)];

// node_modules/@clr/core/icon/shapes/bluetooth.js
var icon245 = {
  outline: '<path d="M26.64,25.27,19,17.53,19,3,25.21,9.4l-5.65,5.79L21,16.62l5.68-5.82a2,2,0,0,0,0-2.78L20.48,1.7A2.08,2.08,0,0,0,18.85,1,2,2,0,0,0,17,3V15.38L10.05,8.27A1,1,0,0,0,8.62,9.66L16.79,18,9.06,26a1,1,0,0,0,0,1.41,1,1,0,0,0,.7.29,1,1,0,0,0,.72-.31L17,20.68V33a2.07,2.07,0,0,0,.71,1.62A2,2,0,0,0,19,35a1.94,1.94,0,0,0,1.42-.6l6.23-6.38A2,2,0,0,0,26.64,25.27ZM19,33.05V20.29l6.21,6.36Z"/>',
  solid: '<path d="M26.52,24.52l-5.65-5.83-1.46-1.5v-12L23.79,9.7l-3.6,3.71,2.24,2.29,4.09-4.22a2.54,2.54,0,0,0,0-3.56L20.57,1.78A2.54,2.54,0,0,0,16.2,3.55V13.86l-5.53-5.7a1.6,1.6,0,1,0-2.3,2.23L15.75,18l-7,7.19a1.6,1.6,0,0,0,0,2.26,1.63,1.63,0,0,0,1.12.45,1.58,1.58,0,0,0,1.15-.49l5.11-5.27V32.45a2.53,2.53,0,0,0,1.59,2.36,2.44,2.44,0,0,0,.95.19,2.56,2.56,0,0,0,1.83-.77l5.95-6.15A2.54,2.54,0,0,0,26.52,24.52ZM19.4,30.83V21.77l4.39,4.53Z"/>'
};
var bluetoothIconName = "bluetooth";
var bluetoothIcon = [bluetoothIconName, renderIcon(icon245)];

// node_modules/@clr/core/icon/shapes/bluetooth-off.js
var icon246 = {
  outline: '<path d="M19,3,25.22,9.4l-5.66,5.8L21,16.63l5.68-5.83a2,2,0,0,0,0-2.78L20.48,1.7A2,2,0,0,0,18.85,1,2,2,0,0,0,17,3v11.4l2,2Z"/><path d="M4.77,5,3.36,6.42,15.89,19,9.06,26a1,1,0,0,0,.71,1.7,1,1,0,0,0,.72-.31L17,20.68V32.94a2.08,2.08,0,0,0,.71,1.63A2,2,0,0,0,19,35a2,2,0,0,0,1.42-.6l5.41-5.54,3.54,3.53L30.77,31ZM19,33.05v-11l5.41,5.41Z"/>',
  solid: '<path d="M19.31,5.17,23.7,9.7l-3.59,3.71,2.24,2.29,4.09-4.22a2.56,2.56,0,0,0,0-3.56l-6-6.14a2.51,2.51,0,0,0-2.77-.59,2.54,2.54,0,0,0-1.6,2.36v10l3.21,3.21Z"/><path d="M4.5,5,3.09,6.42,15.17,18.51,8.7,25.19A1.6,1.6,0,0,0,9.85,27.9,1.57,1.57,0,0,0,11,27.41l5.11-5.27V32.45a2.54,2.54,0,0,0,1.6,2.36,2.44,2.44,0,0,0,.95.19,2.55,2.55,0,0,0,1.82-.77l5.12-5.29,3.49,3.48L30.5,31ZM19.81,30.83V22.65l4,4Z"/>'
};
var bluetoothOffIconName = "bluetooth-off";
var bluetoothOffIcon = [bluetoothOffIconName, renderIcon(icon246)];

// node_modules/@clr/core/icon/shapes/building.js
var icon247 = {
  outline: '<path d="M31,8H23v2h8V31H23v2H33V10A2,2,0,0,0,31,8Z"/><path d="M19.88,3H6.12A2.12,2.12,0,0,0,4,5.12V33H22V5.12A2.12,2.12,0,0,0,19.88,3ZM20,31H17V28H9v3H6V5.12A.12.12,0,0,1,6.12,5H19.88a.12.12,0,0,1,.12.12Z"/><rect x="8" y="8" width="2" height="2"/><rect x="12" y="8" width="2" height="2"/><rect x="16" y="8" width="2" height="2"/><rect x="8" y="13" width="2" height="2"/><rect x="12" y="13" width="2" height="2"/><rect x="16" y="13" width="2" height="2"/><rect x="8" y="18" width="2" height="2"/><rect x="12" y="18" width="2" height="2""/><rect x="16" y="18" width="2" height="2""/><rect x="8" y="23" width="2" height="2""/><rect x="12" y="23" width="2" height="2""/><rect x="16" y="23" width="2" height="2""/><rect x="23" y="13" width="2" height="2""/><rect x="27" y="13" width="2" height="2""/><rect x="23" y="18" width="2" height="2""/><rect x="27" y="18" width="2" height="2""/><rect x="23" y="23" width="2" height="2""/><rect x="27" y="23" width="2" height="2""/>',
  outlineAlerted: '<rect x="8" y="8" width="2" height="2"/><rect x="12" y="8" width="2" height="2"/><rect x="16" y="8" width="2" height="2"/><rect x="8" y="13" width="2" height="2"/><rect x="12" y="13" width="2" height="2"/><rect x="16" y="13" width="2" height="2"/><rect x="8" y="18" width="2" height="2"/><rect x="12" y="18" width="2" height="2"/><rect x="16" y="18" width="2" height="2"/><rect x="8" y="23" width="2" height="2"/><rect x="12" y="23" width="2" height="2"/><rect x="16" y="23" width="2" height="2"/><rect x="23" y="18" width="2" height="2"/><rect x="27" y="18" width="2" height="2"/><rect x="23" y="23" width="2" height="2"/><rect x="27" y="23" width="2" height="2"/><path d="M20,31H17V28H9v3H6V5.12A.12.12,0,0,1,6.12,5H19.88a.12.12,0,0,1,.12.12V8.24l2-3.41A2.12,2.12,0,0,0,19.88,3H6.12A2.12,2.12,0,0,0,4,5.12V33H22V15.38a3.68,3.68,0,0,1-2-.74Z"/><polygon points="31 15.4 31 31 23 31 23 33 33 33 33 15.4 31 15.4"/>',
  outlineBadged: '<path d="M19.88,3H6.12A2.12,2.12,0,0,0,4,5.12V33H22V5.12A2.12,2.12,0,0,0,19.88,3ZM20,31H17V28H9v3H6V5.12A.12.12,0,0,1,6.12,5H19.88a.12.12,0,0,1,.12.12Z"/><rect x="8" y="8" width="2" height="2"/><rect x="12" y="8" width="2" height="2"/><rect x="16" y="8" width="2" height="2"/><rect x="8" y="13" width="2" height="2"/><rect x="12" y="13" width="2" height="2"/><rect x="16" y="13" width="2" height="2"/><rect x="8" y="18" width="2" height="2"/><rect x="12" y="18" width="2" height="2"/><rect x="16" y="18" width="2" height="2"/><rect x="8" y="23" width="2" height="2"/><rect x="12" y="23" width="2" height="2"/><rect x="16" y="23" width="2" height="2"/><rect x="23" y="13" width="2" height="2"/><rect x="27" y="13" width="2" height="2"/><rect x="23" y="18" width="2" height="2"/><rect x="27" y="18" width="2" height="2"/><rect x="23" y="23" width="2" height="2"/><rect x="27" y="23" width="2" height="2"/><path d="M31,13.43V31H23v2H33V12.87A7.45,7.45,0,0,1,31,13.43Z"/>',
  solid: '<path d="M31,8H22V33H33V10A2,2,0,0,0,31,8ZM26,25H24V23h2Zm0-5H24V18h2Zm0-5H24V13h2Zm4,10H28V23h2Zm0-5H28V18h2Zm0-5H28V13h2Z"/><path d="M17.88,3H6.12A2.12,2.12,0,0,0,4,5.12V33H9V30h6v3h5V5.12A2.12,2.12,0,0,0,17.88,3ZM9,25H7V23H9Zm0-5H7V18H9Zm0-5H7V13H9Zm0-5H7V8H9Zm4,15H11V23h2Zm0-5H11V18h2Zm0-5H11V13h2Zm0-5H11V8h2Zm4,15H15V23h2Zm0-5H15V18h2Zm0-5H15V13h2Zm0-5H15V8h2Z"/>',
  solidAlerted: '<path d="M17.88,3H6.12A2.12,2.12,0,0,0,4,5.12V33H9V30h6v3h5V14.64a3.67,3.67,0,0,1-1-4.76l1-1.65V5.12A2.12,2.12,0,0,0,17.88,3ZM9,25H7V23H9Zm0-5H7V18H9Zm0-5H7V13H9Zm0-5H7V8H9Zm4,15H11V23h2Zm0-5H11V18h2Zm0-5H11V13h2Zm0-5H11V8h2Zm4,15H15V23h2Zm0-5H15V18h2Zm0-5H15V13h2Zm0-5H15V8h2Z"/><path d="M22.23,15.4l-.23,0V33H33V15.4ZM26,25H24V23h2Zm0-5H24V18h2Zm4,5H28V23h2Zm0-5H28V18h2Z"/>',
  solidBadged: '<path d="M17.88,3H6.12A2.12,2.12,0,0,0,4,5.12V33H9V30h6v3h5V5.12A2.12,2.12,0,0,0,17.88,3ZM9,25H7V23H9Zm0-5H7V18H9Zm0-5H7V13H9Zm0-5H7V8H9Zm4,15H11V23h2Zm0-5H11V18h2Zm0-5H11V13h2Zm0-5H11V8h2Zm4,15H15V23h2Zm0-5H15V18h2Zm0-5H15V13h2Zm0-5H15V8h2Z"/><path d="M30,13.5V15H28V13.22A7.5,7.5,0,0,1,22.78,8H22V33H33V12.87A7.47,7.47,0,0,1,30,13.5ZM26,25H24V23h2Zm0-5H24V18h2Zm0-5H24V13h2Zm4,10H28V23h2Zm0-5H28V18h2Z"/>'
};
var buildingIconName = "building";
var buildingIcon = [buildingIconName, renderIcon(icon247)];

// node_modules/@clr/core/icon/shapes/bundle.js
var icon248 = {
  outline: '<path d="M32.43,8.35l-13-6.21a1,1,0,0,0-.87,0l-15,7.24a1,1,0,0,0-.57.9V26.83a1,1,0,0,0,.6.92l13,6.19a1,1,0,0,0,.87,0l15-7.24a1,1,0,0,0,.57-.9V9.25A1,1,0,0,0,32.43,8.35ZM19,4.15,29.93,9.37l-5.05,2.44L14.21,6.46ZM17,15.64,6,10.41l5.9-2.85L22.6,12.91ZM5,12.13,16,17.4V31.46L5,26.2ZM18,31.45V17.36l13-6.29v14.1Z"/>',
  solid: '<path d="M32.43,8.35l-13-6.21a1,1,0,0,0-.87,0l-15,7.24a1,1,0,0,0-.57.9V26.83a1,1,0,0,0,.6.92l13,6.19a1,1,0,0,0,.87,0l15-7.24a1,1,0,0,0,.57-.9V9.25A1,1,0,0,0,32.43,8.35ZM19,4.15,29.93,9.37l-5.05,2.44L14.21,6.46ZM17,15.64,6,10.41l5.9-2.85L22.6,12.91Zm1,15.8V17.36l13-6.29v14.1Z"/>'
};
var bundleIconName = "bundle";
var bundleIcon = [bundleIconName, renderIcon(icon248)];

// node_modules/@clr/core/icon/shapes/capacitor.js
var icon249 = {
  outline: '<path d="M15,34.06a1,1,0,0,1-1-1V3.15a1,1,0,1,1,2,0V33.06A1,1,0,0,1,15,34.06Z"/><path d="M21,34.06a1,1,0,0,1-1-1V3.15a1,1,0,1,1,2,0V33.06A1,1,0,0,1,21,34.06Z"/><path d="M14.46,19H3a1,1,0,0,1,0-2H14.46a1,1,0,0,1,0,2Z"/><path d="M33,19H21.54a1,1,0,0,1,0-2H33a1,1,0,0,1,0,2Z"/>'
};
var capacitorIconName = "capacitor";
var capacitorIcon = [capacitorIconName, renderIcon(icon249)];

// node_modules/@clr/core/icon/shapes/cd-dvd.js
var icon250 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><path d="M22.33,18a4.46,4.46,0,1,0-4.45,4.46A4.46,4.46,0,0,0,22.33,18ZM17.88,20.9A2.86,2.86,0,1,1,20.73,18,2.86,2.86,0,0,1,17.88,20.9Z"/><path d="M17.88,7.43H18V5.84h-.12A12.21,12.21,0,0,0,5.68,17.75h1.6A10.61,10.61,0,0,1,17.88,7.43Z"/><path d="M30.08,18H28.49v0A10.61,10.61,0,0,1,18.25,28.63v1.6A12.22,12.22,0,0,0,30.09,18S30.08,18,30.08,18Z"/><path d="M18,11V9.44h-.12a8.62,8.62,0,0,0-8.6,8.32h1.6a7,7,0,0,1,7-6.72Z"/><path d="M18.25,25v1.6A8.61,8.61,0,0,0,26.48,18v0h-1.6v0A7,7,0,0,1,18.25,25Z"/>',
  solid: '<path d="M18.17,1.92a16,16,0,1,0,16,16A16,16,0,0,0,18.17,1.92ZM26.23,18h1.54a9.61,9.61,0,0,1-9.6,9.53H18V26h.17A8.07,8.07,0,0,0,26.23,18ZM6.05,18H4.45v-.08A13.72,13.72,0,0,1,18,4.21v1.6A12.13,12.13,0,0,0,6.05,17.92Zm4.05,0H8.56v-.08A9.61,9.61,0,0,1,18,8.32V9.86a8.07,8.07,0,0,0-7.9,8.06Zm4.32-.08a3.75,3.75,0,1,1,3.75,3.75A3.75,3.75,0,0,1,14.42,17.92Zm3.75,13.71H18V30h.17A12.13,12.13,0,0,0,30.28,18h1.6A13.73,13.73,0,0,1,18.17,31.63Z"/>'
};
var cdDvdIconName = "cd-dvd";
var cdDvdIcon = [cdDvdIconName, renderIcon(icon250)];

// node_modules/@clr/core/icon/shapes/certificate.js
var icon251 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28H4V8H32l0,8.56a8.41,8.41,0,0,1,2,1.81V8A2,2,0,0,0,32,6Z"/><rect x="7" y="12" width="17" height="1.6"/><rect x="7" y="16" width="11" height="1.6"/><rect x="7" y="23" width="10" height="1.6"/><path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z"/>',
  outlineAlerted: '<rect x="7" y="16" width="11" height="1.6"/><rect x="7" y="23" width="10" height="1.6"/><path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z"/><path d="M19,13.56A3.66,3.66,0,0,1,18.57,12H7v1.6H19.07Z"/><path d="M33.68,15.4H32v1.16a8.41,8.41,0,0,1,2,1.81v-3Z"/><path d="M4,28V8H20.14l1.15-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28Z"/>',
  outlineBadged: '<rect x="7" y="12" width="17" height="1.6"/><rect x="7" y="16" width="11" height="1.6"/><rect x="7" y="23" width="10" height="1.6"/><path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z"/><path d="M32,13.22v3.34a8.41,8.41,0,0,1,2,1.81v-6A7.45,7.45,0,0,1,32,13.22Z"/><path d="M4,28V8H22.78a7.49,7.49,0,0,1-.28-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28Z"/>',
  solid: '<path d="M19,30H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H32a2,2,0,0,1,2,2V18.37a8.34,8.34,0,0,0-13.49,9.79l-.93,1.14ZM7,12v1.6H24V12Zm0,5.6H18V16H7Zm0,7H17V23H7Z"/><path d="M33.83,23.59a6.37,6.37,0,1,0-10.77,4.59l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37A6.34,6.34,0,0,0,33.83,23.59Zm-10.74,0a4.37,4.37,0,1,1,4.37,4.31A4.35,4.35,0,0,1,23.1,23.59Z"/>',
  solidAlerted: '<path d="M33.83,23.59a6.37,6.37,0,1,0-10.77,4.59l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37A6.34,6.34,0,0,0,33.83,23.59Zm-10.74,0a4.37,4.37,0,1,1,4.37,4.31A4.35,4.35,0,0,1,23.1,23.59Z"/><path d="M33.68,15.4H29.25a8.36,8.36,0,0,1,4.75,3v-3Z"/><path d="M19.07,13.6H7V12H18.57A3.67,3.67,0,0,1,19,9.89L21.29,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14A8.34,8.34,0,0,1,25.66,15.4H22.23A3.68,3.68,0,0,1,19.07,13.6ZM17,24.6H7V23H17Zm1-7H7V16H18Z"/>',
  solidBadged: '<path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z"/><path d="M30,13.5A7.5,7.5,0,0,1,22.5,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14A8.34,8.34,0,0,1,34,18.37v-6A7.46,7.46,0,0,1,30,13.5ZM17,24.6H7V23H17Zm1-7H7V16H18Zm6-4H7V12H24Z"/>'
};
var certificateIconName = "certificate";
var certificateIcon = [certificateIconName, renderIcon(icon251)];

// node_modules/@clr/core/icon/shapes/ci-cd.js
var icon252 = {
  outline: '<path d="M23.53,19.81a7.45,7.45,0,0,1-1.65-.18,10.48,10.48,0,0,1,.72,2.13c.3,0,.61,0,.93,0a9.52,9.52,0,0,0,3-.49l-.93-1.81A7.67,7.67,0,0,1,23.53,19.81Z"/><path d="M18.36,17.87,18,17.49a7.4,7.4,0,0,1-2.2-5.92,7.31,7.31,0,0,1,1.54-4L17.26,9A1,1,0,0,0,18.17,10h.09a1,1,0,0,0,1-.91L19.6,5a1,1,0,0,0-.29-.79A1,1,0,0,0,18.52,4l-4.09.35a1,1,0,0,0,.17,2l1.29-.11a9.45,9.45,0,0,0-2.05,5.32,9.28,9.28,0,0,0,2.67,7.26l.31.37a7.33,7.33,0,0,1,2.06,4.91,7.39,7.39,0,0,1-.26,2.47l1.8.91a8.76,8.76,0,0,0,.45-3.51A9.28,9.28,0,0,0,18.36,17.87Z"/><path d="M32.4,17.91,31.19,18A9.65,9.65,0,0,0,23.53,2.45a9.33,9.33,0,0,0-3,.49l.91,1.8a7.67,7.67,0,0,1,9.76,7.39,7.58,7.58,0,0,1-1.65,4.72l.1-1.54a1,1,0,1,0-2-.13l-.28,4.08a1,1,0,0,0,.31.78.94.94,0,0,0,.69.28h.1l4.08-.42a1,1,0,0,0,.9-1.1A1,1,0,0,0,32.4,17.91Z"/><path d="M4.07,20.44h.08l4.09-.35a1,1,0,1,0-.17-2l-1.39.12a7.63,7.63,0,0,1,4.52-1.49,7.9,7.9,0,0,1,1.63.18,10.23,10.23,0,0,1-.71-2.13c-.3,0-.61,0-.92,0a9.66,9.66,0,0,0-5.9,2l.12-1.31a1,1,0,0,0-.92-1.08,1,1,0,0,0-1.08.91l-.35,4.08a1,1,0,0,0,1,1.08Z"/><path d="M18.42,28.23l-4.09.27a1,1,0,0,0,.13,2L16,30.39a7.71,7.71,0,0,1-12.54-6,7.6,7.6,0,0,1,.29-2L2,21.46a9.59,9.59,0,0,0-.47,2.95A9.7,9.7,0,0,0,17.19,32l-.12,1.18a1,1,0,0,0,.89,1.1h.11a1,1,0,0,0,1-.9l.42-4.06a1,1,0,0,0-1.06-1.1Z"/>'
};
var ciCdIconName = "ci-cd";
var ciCdIcon = [ciCdIconName, renderIcon(icon252)];

// node_modules/@clr/core/icon/shapes/cloud-network.js
var icon253 = {
  outline: '<path d="M30.71,15.18v-1A11.28,11.28,0,0,0,19.56,2.83h-.11a11.28,11.28,0,0,0-11,8.93,7.47,7.47,0,0,0,0,14.94H29.13a5.86,5.86,0,0,0,1.58-11.52ZM29.13,24.7H8.46a5.47,5.47,0,1,1,0-10.94h1.69l.11-.87a9.27,9.27,0,0,1,18.45,1.3v1.28c0,.09,0,.18,0,.27l-.07,1.15.94.11a3.86,3.86,0,0,1-.43,7.71Z"/><path d="M29.58,31.18H18.85v-2.4h-2v2.4H6.08a1,1,0,0,0,0,2h23.5a1,1,0,0,0,0-2Z"/>'
};
var cloudNetworkIconName = "cloud-network";
var cloudNetworkIcon = [cloudNetworkIconName, renderIcon(icon253)];

// node_modules/@clr/core/icon/shapes/cloud-scale.js
var icon254 = {
  outline: '<path d="M6.32,11.11H7.84L8,10.24A7.19,7.19,0,0,1,15.07,4h.07a7.15,7.15,0,0,1,4.71,1.83,11.1,11.1,0,0,1,3.09.64A9.18,9.18,0,0,0,15.16,2h-.09A9.2,9.2,0,0,0,6.13,9.11,6.15,6.15,0,0,0,2.33,19.95,8.09,8.09,0,0,1,3,17.71a4.12,4.12,0,0,1-.81-2.44A4.16,4.16,0,0,1,6.32,11.11Z"/><path d="M10.4,16.91h1.52L12,16a7.19,7.19,0,0,1,7.12-6.25h.07a7.17,7.17,0,0,1,5.7,2.92,11.05,11.05,0,0,1,2.72.77,9.2,9.2,0,0,0-8.4-5.69h-.09a9.2,9.2,0,0,0-8.94,7.12,6.15,6.15,0,0,0-3.64,11,8.11,8.11,0,0,1,.79-2,4.14,4.14,0,0,1,3-7Z"/><path d="M32.42,24.47v-.62a9.18,9.18,0,0,0-18.13-2.16A6.16,6.16,0,0,0,14.48,34H31a4.88,4.88,0,0,0,1.46-9.53ZM31,32H14.48a4.16,4.16,0,1,1,0-8.32H16l.11-.87a7.19,7.19,0,0,1,7.12-6.25h.07a7.21,7.21,0,0,1,7.12,7.25v1c0,.07,0,.13,0,.2l-.07,1.11.94.11A2.88,2.88,0,0,1,31,32Z"/>'
};
var cloudScaleIconName = "cloud-scale";
var cloudScaleIcon = [cloudScaleIconName, renderIcon(icon254)];

// node_modules/@clr/core/icon/shapes/cloud-traffic.js
var icon255 = {
  outline: '<path d="M26.54,20.82a.88.88,0,0,0-.88-.88H20.75l1.1-1.1A.88.88,0,0,0,20.6,17.6l-3.21,3.22L20.6,24a.88.88,0,1,0,1.25-1.24L20.76,21.7h4.9A.88.88,0,0,0,26.54,20.82Z"/><path d="M29.27,21.7a.88.88,0,1,0,0-1.76h-.58a.88.88,0,1,0,0,1.76Z"/><path d="M32.21,20h-.06a.85.85,0,0,0-.85.88.91.91,0,0,0,.91.88.88.88,0,1,0,0-1.76Z"/><path d="M32.59,11a.88.88,0,0,0-1.25,1.24l1.1,1.1H27.53a.88.88,0,1,0,0,1.76h4.9l-1.09,1.09a.88.88,0,0,0,1.25,1.24l3.21-3.22Z"/><path d="M24.5,15.07a.88.88,0,1,0,0-1.76h-.58a.88.88,0,1,0,0,1.76Z"/><path d="M21.9,14.27a.85.85,0,0,0-.85-.88H21a.88.88,0,1,0,0,1.76A.91.91,0,0,0,21.9,14.27Z"/><path d="M30.36,23.65c0,.13,0,.26,0,.39a3.77,3.77,0,0,1-3.62,3.89H7.28a5.32,5.32,0,0,1-5.13-5.48A5.32,5.32,0,0,1,7.28,17H8.91L9,16.12a8.92,8.92,0,0,1,8.62-8h.08a8.49,8.49,0,0,1,6.56,3.29h2.37a10.55,10.55,0,0,0-8.91-5.25h-.11A10.82,10.82,0,0,0,7.22,15a7.28,7.28,0,0,0-7,7.43,7.27,7.27,0,0,0,7.08,7.43H26.77A5.72,5.72,0,0,0,32.35,24a3.77,3.77,0,0,0,0-.39Z"/>'
};
var cloudTrafficIconName = "cloud-traffic";
var cloudTrafficIcon = [cloudTrafficIconName, renderIcon(icon255)];

// node_modules/@clr/core/icon/shapes/cluster.js
var icon256 = {
  outline: '<path d="M31.36,8H27.5v2H31V30H27.5v2H33V9.67A1.65,1.65,0,0,0,31.36,8Z"/><path d="M5,10H8.5V8H4.64A1.65,1.65,0,0,0,3,9.67V32H8.5V30H5Z"/><ellipse cx="18.01" cy="25.99" rx="1.8" ry="1.79"/><path d="M24.32,4H11.68A1.68,1.68,0,0,0,10,5.68V32H26V5.68A1.68,1.68,0,0,0,24.32,4ZM24,30H12V6H24Z"/><rect x="13.5" y="9.21" width="9" height="1.6"/>',
  outlineAlerted: '<path d="M5,10H8.5V8H4.64A1.65,1.65,0,0,0,3,9.67V32H8.5V30H5Z"/><ellipse cx="18.01" cy="25.99" rx="1.8" ry="1.79"/><path d="M19,9.89l.39-.68H13.5v1.6h5.17A3.65,3.65,0,0,1,19,9.89Z"/><path d="M24,30H12V6h9.29l1.15-2H11.68A1.68,1.68,0,0,0,10,5.68V32H26V15.4H24Z"/><polygon points="31 15.4 31 30 27.5 30 27.5 32 33 32 33 15.4 31 15.4"/>',
  outlineBadged: '<path d="M5,10H8.5V8H4.64A1.65,1.65,0,0,0,3,9.67V32H8.5V30H5Z"/><ellipse cx="18.01" cy="25.99" rx="1.8" ry="1.79"/><rect x="13.5" y="9.21" width="9" height="1.6"/><path d="M24,10.49V30H12V6H22.5a7.49,7.49,0,0,1,.28-2H11.68A1.68,1.68,0,0,0,10,5.68V32H26V12.34A7.53,7.53,0,0,1,24,10.49Z"/><path d="M31,13.43V30H27.5v2H33V12.87A7.45,7.45,0,0,1,31,13.43Z"/>',
  solid: '<path d="M31.36,8H27.5V32H33V9.67A1.65,1.65,0,0,0,31.36,8Z"/><path d="M3,9.67V32H8.5V8H4.64A1.65,1.65,0,0,0,3,9.67Z"/><path d="M24.32,4H11.68A1.68,1.68,0,0,0,10,5.68V32H26V5.68A1.68,1.68,0,0,0,24.32,4ZM18,27.79A1.79,1.79,0,1,1,19.81,26,1.8,1.8,0,0,1,18,27.79ZM23,10.6H13V9H23Z"/>',
  solidAlerted: '<path d="M3,9.67V32H8.5V8H4.64A1.65,1.65,0,0,0,3,9.67Z"/><rect x="27.5" y="15.4" width="5.5" height="16.6"/><path d="M19,13.56a3.68,3.68,0,0,1-.31-3H13V9h6.56l2.89-5H11.68A1.68,1.68,0,0,0,10,5.68V32H26V15.4H22.23A3.69,3.69,0,0,1,19,13.56ZM18,27.79A1.79,1.79,0,1,1,19.81,26,1.8,1.8,0,0,1,18,27.79Z"/>',
  solidBadged: '<path d="M3,9.67V32H8.5V8H4.64A1.65,1.65,0,0,0,3,9.67Z"/><path d="M22.5,6a7.49,7.49,0,0,1,.28-2H11.68A1.68,1.68,0,0,0,10,5.68V32H26V12.34A7.49,7.49,0,0,1,22.5,6ZM18,27.79A1.79,1.79,0,1,1,19.81,26,1.8,1.8,0,0,1,18,27.79ZM23,10.6H13V9H23Z"/><path d="M30,13.5a7.47,7.47,0,0,1-2.5-.44V32H33V12.87A7.47,7.47,0,0,1,30,13.5Z"/>'
};
var clusterIconName = "cluster";
var clusterIcon = [clusterIconName, renderIcon(icon256)];

// node_modules/@clr/core/icon/shapes/code.js
var icon257 = {
  outline: '<path d="M13.71,12.59a1,1,0,0,0-1.39-.26L5.79,16.78a1,1,0,0,0,0,1.65l6.53,4.45a1,1,0,1,0,1.13-1.65L8.13,17.61,13.45,14A1,1,0,0,0,13.71,12.59Z"/><path d="M30.21,16.78l-6.53-4.45A1,1,0,1,0,22.55,14l5.32,3.63-5.32,3.63a1,1,0,0,0,1.13,1.65l6.53-4.45a1,1,0,0,0,0-1.65Z"/><path d="M19.94,9.83a.9.9,0,0,0-1.09.66L15.41,24.29a.9.9,0,0,0,.66,1.09l.22,0a.9.9,0,0,0,.87-.68l3.44-13.81A.9.9,0,0,0,19.94,9.83Z"/>',
  outlineAlerted: '<path d="M13.71,12.59a1,1,0,0,0-1.39-.26L5.79,16.78a1,1,0,0,0,0,1.65l6.53,4.45a1,1,0,1,0,1.13-1.65L8.13,17.61,13.45,14A1,1,0,0,0,13.71,12.59Z"/><path d="M18.56,11.62,15.41,24.29a.9.9,0,0,0,.66,1.09l.22,0a.9.9,0,0,0,.87-.68L19.73,14.4a3.59,3.59,0,0,1-1.16-2.79Z"/><path d="M30.21,16.78l-2-1.38H24.64l3.24,2.21-5.32,3.63a1,1,0,0,0,1.13,1.65l6.53-4.45a1,1,0,0,0,0-1.65Z"/>',
  outlineBadged: '<path d="M13.71,12.59a1,1,0,0,0-1.39-.26L5.79,16.78a1,1,0,0,0,0,1.65l6.53,4.45a1,1,0,1,0,1.13-1.65L8.13,17.61,13.45,14A1,1,0,0,0,13.71,12.59Z"/><path d="M30.21,16.78l-6.53-4.45A1,1,0,1,0,22.55,14l5.32,3.63-5.32,3.63a1,1,0,0,0,1.13,1.65l6.53-4.45a1,1,0,0,0,0-1.65Z"/><path d="M19.94,9.83a.9.9,0,0,0-1.09.66L15.41,24.29a.9.9,0,0,0,.66,1.09l.22,0a.9.9,0,0,0,.87-.68l3.44-13.81A.9.9,0,0,0,19.94,9.83Z"/>'
};
var codeIconName = "code";
var codeIcon = [codeIconName, renderIcon(icon257)];

// node_modules/@clr/core/icon/shapes/computer.js
var icon258 = {
  outline: '<polygon points="9.6 22.88 9.6 10.6 24.4 10.6 25.98 9 8 9 8 22.88 9.6 22.88"/><path d="M6,7H30V23h2V6.5A1.5,1.5,0,0,0,30.5,5H5.5A1.5,1.5,0,0,0,4,6.5V23H6Z"/><path d="M1,25v3.4A2.6,2.6,0,0,0,3.6,31H32.34a2.6,2.6,0,0,0,2.6-2.6V25Zm32,3.4a.6.6,0,0,1-.6.6H3.56a.6.6,0,0,1-.6-.6V26.53h9.95a1.64,1.64,0,0,0,1.5,1h7.13a1.64,1.64,0,0,0,1.5-1H33Z"/>',
  outlineAlerted: '<path d="M1,25v3.4A2.6,2.6,0,0,0,3.6,31H32.34a2.6,2.6,0,0,0,2.6-2.6V25Zm32,3.4a.6.6,0,0,1-.6.6H3.56a.6.6,0,0,1-.6-.6V26.53h9.95a1.64,1.64,0,0,0,1.5,1h7.13a1.64,1.64,0,0,0,1.5-1H33Z"/><path d="M9.6,22.88V10.6h9.14A3.64,3.64,0,0,1,19,9.89L19.56,9H8V22.88Z"/><path d="M6,7H20.71l1.15-2H5.5A1.5,1.5,0,0,0,4,6.5V23H6Z"/><rect x="30" y="15.4" width="2" height="7.6"/>',
  outlineBadged: '<path d="M1,25v3.4A2.6,2.6,0,0,0,3.6,31H32.34a2.6,2.6,0,0,0,2.6-2.6V25Zm32,3.4a.6.6,0,0,1-.6.6H3.56a.6.6,0,0,1-.6-.6V26.53h9.95a1.64,1.64,0,0,0,1.5,1h7.13a1.64,1.64,0,0,0,1.5-1H33Z"/><path d="M22.5,6a7.52,7.52,0,0,1,.07-1H5.5A1.5,1.5,0,0,0,4,6.5V23H6V7H22.57A7.52,7.52,0,0,1,22.5,6Z"/><path d="M30,13.5V23h2V13.22A7.49,7.49,0,0,1,30,13.5Z"/><path d="M23.13,9H8V22.88H9.6V10.6H24.08A7.49,7.49,0,0,1,23.13,9Z"/>',
  solid: '<path d="M23.81,26c-.35.9-.94,1.5-1.61,1.5H13.74c-.68,0-1.26-.6-1.61-1.5H1v1.75A2.45,2.45,0,0,0,3.6,30H32.4A2.45,2.45,0,0,0,35,27.75V26Z"/><path d="M7,10H29V24h3V7.57A1.54,1.54,0,0,0,30.5,6H5.5A1.54,1.54,0,0,0,4,7.57V24H7Z"/>',
  solidAlerted: '<path d="M23.81,26c-.35.9-.94,1.5-1.61,1.5H13.74c-.68,0-1.26-.6-1.61-1.5H1v1.75A2.45,2.45,0,0,0,3.6,30H32.4A2.45,2.45,0,0,0,35,27.75V26Z"/><rect x="29" y="15.4" width="3" height="8.6"/><path d="M7,10H19L19,9.89,21.29,6H5.5A1.54,1.54,0,0,0,4,7.57V24H7Z"/>',
  solidBadged: '<path d="M23.81,26c-.35.9-.94,1.5-1.61,1.5H13.74c-.68,0-1.26-.6-1.61-1.5H1v1.75A2.45,2.45,0,0,0,3.6,30H32.4A2.45,2.45,0,0,0,35,27.75V26Z"/><path d="M7,10H23.66A7.46,7.46,0,0,1,22.5,6H5.5A1.54,1.54,0,0,0,4,7.57V24H7Z"/><path d="M32,13.22a7.14,7.14,0,0,1-3,.2V24h3Z"/>'
};
var computerIconName = "computer";
var computerIcon = [computerIconName, renderIcon(icon258)];

// node_modules/@clr/core/icon/shapes/connect.js
var icon259 = {
  outline: '<path d="M34,17H28.23A6.25,6.25,0,0,0,22,12H14.15a6.25,6.25,0,0,0-6.21,5H2v2H7.93a6.22,6.22,0,0,0,6.22,5H22a6.22,6.22,0,0,0,6.22-5H34ZM17.08,22H14.15a4.17,4.17,0,0,1-4.31-4,4.17,4.17,0,0,1,4.31-4h2.94ZM22,22H19V14h3a4.17,4.17,0,0,1,4.31,4A4.17,4.17,0,0,1,22,22Z"/>',
  solid: '<path d="M17,12H14.15a6.25,6.25,0,0,0-6.21,5H2v2H7.93a6.22,6.22,0,0,0,6.22,5H17Z"/><path d="M28.23,17A6.25,6.25,0,0,0,22,12H19V24h3a6.22,6.22,0,0,0,6.22-5H34V17Z"/>'
};
var connectIconName = "connect";
var connectIcon = [connectIconName, renderIcon(icon259)];

// node_modules/@clr/core/icon/shapes/container.js
var icon260 = {
  outline: '<path d="M32,30H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H32a2,2,0,0,1,2,2V28A2,2,0,0,1,32,30ZM4,8V28H32V8Z"/><path d="M9,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,9,25.3Z"/><path d="M14.92,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,14.92,25.3Z"/><path d="M21,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,21,25.3Z"/><path d="M27,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,27,25.3Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM9.63,24.23a.79.79,0,0,1-.81.77A.79.79,0,0,1,8,24.23V11.77A.79.79,0,0,1,8.82,11a.79.79,0,0,1,.81.77Zm6,0a.79.79,0,0,1-.82.77.79.79,0,0,1-.81-.77V11.77a.79.79,0,0,1,.81-.77.79.79,0,0,1,.82.77Zm6.21,0a.79.79,0,0,1-.82.77.79.79,0,0,1-.81-.77V11.77a.79.79,0,0,1,.81-.77.79.79,0,0,1,.82.77Zm6.12,0a.79.79,0,0,1-.82.77.79.79,0,0,1-.81-.77V11.77a.79.79,0,0,1,.81-.77.79.79,0,0,1,.82.77Z"/>'
};
var containerIconName = "container";
var containerIcon = [containerIconName, renderIcon(icon260)];

// node_modules/@clr/core/icon/shapes/container-volume.js
var icon261 = {
  outline: '<path d="M8,17.58a32.35,32.35,0,0,0,6.3.92,4.13,4.13,0,0,1,.92-1.37,30.94,30.94,0,0,1-7.22-1Z"/><path d="M6,28V8.19c.34-.76,4.31-2.11,11-2.11s10.67,1.35,11,2v.3c-.82.79-4.58,2.05-11.11,2.05A33.48,33.48,0,0,1,8,9.44v1.44a35.6,35.6,0,0,0,8.89,1c4.29,0,8.8-.58,11.11-1.82v5.07a5.3,5.3,0,0,1-1.81.88H30V8.12c0-3.19-8.17-4-13-4s-13,.85-13,4V28C4,30.63,9.39,31.68,14,32V30C9.13,29.66,6.28,28.62,6,28Z"/><path d="M8,24.28a31.3,31.3,0,0,0,6,.89v-1.4a28.93,28.93,0,0,1-6-.93Z"/><path d="M32,18H18a2,2,0,0,0-2,2V32a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V20A2,2,0,0,0,32,18ZM18,32V20H32V32Z"/><path d="M21,21.7a.7.7,0,0,0-.7.7v7.49a.7.7,0,0,0,1.4,0V22.4A.7.7,0,0,0,21,21.7Z"/><path d="M25,21.82a.7.7,0,0,0-.7.7V30a.7.7,0,1,0,1.4,0V22.52A.7.7,0,0,0,25,21.82Z"/><path d="M29,21.7a.7.7,0,0,0-.7.7v7.49a.7.7,0,1,0,1.4,0V22.4A.7.7,0,0,0,29,21.7Z"/>',
  solid: '<path d="M32,18H18a2,2,0,0,0-2,2V32a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V20A2,2,0,0,0,32,18ZM18,32V20H32V32Z"/><path d="M21,21.7a.7.7,0,0,0-.7.7v7.49a.7.7,0,0,0,1.4,0V22.4A.7.7,0,0,0,21,21.7Z"/><path d="M25,21.82a.7.7,0,0,0-.7.7V30a.7.7,0,1,0,1.4,0V22.52A.7.7,0,0,0,25,21.82Z"/><path d="M29,21.7a.7.7,0,0,0-.7.7v7.49a.7.7,0,1,0,1.4,0V22.4A.7.7,0,0,0,29,21.7Z"/><path d="M18,16H28V8.12c0-1.68-5.38-3-12-3S4,6.44,4,8.12V28c0,1.5,4.33,2.75,10,3V25.22a29.17,29.17,0,0,1-8-1.29V22.44l.24.1A26.63,26.63,0,0,0,14,23.82V20a4,4,0,0,1,.29-1.47A29.19,29.19,0,0,1,6,17.23V15.75l.24.09a29,29,0,0,0,9,1.32h0A4,4,0,0,1,18,16ZM6,10.54V9.05l.24.09A30.12,30.12,0,0,0,16,10.47,28.33,28.33,0,0,0,26,9.05v1.5a32.53,32.53,0,0,1-10,1.32A32.44,32.44,0,0,1,6,10.54Z"/>'
};
var containerVolumeIconName = "container-volume";
var containerVolumeIcon = [containerVolumeIconName, renderIcon(icon261)];

// node_modules/@clr/core/icon/shapes/control-lun.js
var icon262 = {
  outline: '<path d="M8,24.59a25.5,25.5,0,0,0,2.75.59l1.21-1.41a24.13,24.13,0,0,1-4-.83Z"/><path d="M6,27.53V10.3c2.9,1.43,8.34,1.88,12,1.88s9.1-.45,12-1.88v5.11c-.91.82-5,2.13-12,2.13A34.81,34.81,0,0,1,8,16.33V18a40.86,40.86,0,0,0,10,1.16c3.46,0,9.13-.45,12-1.91v3.23h2V8h0s0,0,0-.07c0-3.35-8.8-4.25-14-4.25S4,4.58,4,7.93v19.6c0,2,3.17,3.14,6.83,3.72L8.38,28.68C7,28.28,6.13,27.84,6,27.53ZM18,5.68c7.15,0,11.53,1.44,12,2.25-.46.81-4.84,2.25-12,2.25S6.31,8.69,6,8C6.31,7.18,10.71,5.68,18,5.68Z"/><path d="M32.09,22H15.46l-5.41,6.31L15.49,34h16.6a2,2,0,0,0,2-2V23.93A2,2,0,0,0,32.09,22Zm0,10H16.34l-3.59-3.77L16.38,24H32.09v8Z"/><path d="M16.11,27a1,1,0,1,0,1,1A1,1,0,0,0,16.11,27Z"/>',
  outlineAlerted: '<path d="M8,24.59a25.5,25.5,0,0,0,2.75.59l1.21-1.41a24.13,24.13,0,0,1-4-.83Z"/><path d="M32.09,22H15.46l-5.41,6.31L15.49,34h16.6a2,2,0,0,0,2-2V23.93A2,2,0,0,0,32.09,22Zm0,10H16.34l-3.59-3.77L16.38,24H32.09v8Z"/><path d="M16.11,27a1,1,0,1,0,1,1A1,1,0,0,0,16.11,27Z"/><path d="M6,27.53V10.3c2.9,1.43,8.34,1.88,12,1.88h.59a3.59,3.59,0,0,1,.32-2H18C10.71,10.18,6.31,8.69,6,8c.32-.8,4.72-2.3,12-2.3,1.22,0,2.35.05,3.41.12l1.1-1.91c-1.6-.15-3.17-.21-4.51-.21-5.2,0-14,.9-14,4.25v19.6c0,2,3.17,3.14,6.83,3.72L8.38,28.68C7,28.28,6.13,27.84,6,27.53Z"/><path d="M8,16.33V18a40.86,40.86,0,0,0,10,1.16c3.46,0,9.13-.45,12-1.91v3.23h2V15.4H30c-.91.82-5,2.13-12,2.13A34.81,34.81,0,0,1,8,16.33Z"/>',
  outlineBadged: '<path d="M8,24.59a25.5,25.5,0,0,0,2.75.59l1.21-1.41a24.13,24.13,0,0,1-4-.83Z"/><path d="M32.09,22H15.46l-5.41,6.31L15.49,34h16.6a2,2,0,0,0,2-2V23.93A2,2,0,0,0,32.09,22Zm0,10H16.34l-3.59-3.77L16.38,24H32.09v8Z"/><path d="M16.11,27a1,1,0,1,0,1,1A1,1,0,0,0,16.11,27Z"/><path d="M18,17.54A34.81,34.81,0,0,1,8,16.33V18a40.86,40.86,0,0,0,10,1.16c3.46,0,9.13-.45,12-1.91v3.23h2V13.22a7.32,7.32,0,0,1-2,.28v1.91C29.09,16.23,25,17.54,18,17.54Z"/><path d="M6,27.53V10.3c2.9,1.43,8.34,1.88,12,1.88a47.66,47.66,0,0,0,7.09-.52,7.45,7.45,0,0,1-1.51-1.8,47.4,47.4,0,0,1-5.58.32C10.71,10.18,6.31,8.69,6,8c.32-.8,4.72-2.3,12-2.3,1.66,0,3.16.08,4.51.21a7.56,7.56,0,0,1,.29-2c-1.7-.17-3.38-.24-4.8-.24-5.2,0-14,.9-14,4.25v19.6c0,2,3.17,3.14,6.83,3.72L8.38,28.68C7,28.28,6.13,27.84,6,27.53Z"/>',
  solid: '<path d="M16.11,27a1,1,0,1,0,1,1A1,1,0,0,0,16.11,27Z"/><path d="M32.09,21H32V17.32c-1.9,2.93-10.46,3.3-14,3.3A42.43,42.43,0,0,1,8,19.56V17.88A40.59,40.59,0,0,0,18,19c5,0,13.2-.82,14-3.82V10.72c-2.21,3.36-10.49,3.46-14,3.46A42.12,42.12,0,0,1,8,13.11V11a40.59,40.59,0,0,0,10,1.14c5,0,13.28-.83,14-3.88V7.83h0c-.19-3.27-8.84-4.15-14-4.15S4.21,4.56,4,7.83H4v19.7c0,2.16,3.64,3.3,7.63,3.84l2.84,3,.59.62h17a3,3,0,0,0,3-3V23.93A3,3,0,0,0,32.09,21ZM8,26.08V24.4a25.79,25.79,0,0,0,3.46.7l-1.24,1.44C9.46,26.42,8.71,26.27,8,26.08ZM33.09,32a1,1,0,0,1-1,1H15.92L11.4,28.23,15.92,23H32.09a1,1,0,0,1,1,1Z"/>',
  solidAlerted: '<path d="M16.11,27a1,1,0,1,0,1,1A1,1,0,0,0,16.11,27Z"/><path d="M32.09,21H32V17.32c-1.9,2.93-10.46,3.3-14,3.3A42.43,42.43,0,0,1,8,19.56V17.88A40.59,40.59,0,0,0,18,19c4.85,0,12.8-.79,13.91-3.62H22.23a3.68,3.68,0,0,1-2.73-1.23H18A42.12,42.12,0,0,1,8,13.11V11a40.59,40.59,0,0,0,10,1.14h.59a3.61,3.61,0,0,1,.46-2.29l3.46-6c-1.6-.15-3.17-.21-4.51-.21-5.14,0-13.79.88-14,4.15H4v19.7c0,2.16,3.64,3.3,7.63,3.84l2.84,3,.59.62h17a3,3,0,0,0,3-3V23.93A3,3,0,0,0,32.09,21ZM8,26.08V24.4a25.79,25.79,0,0,0,3.46.7l-1.24,1.44C9.46,26.42,8.71,26.27,8,26.08ZM33.09,32a1,1,0,0,1-1,1H15.92L11.4,28.23,15.92,23H32.09a1,1,0,0,1,1,1Z"/>',
  solidBadged: '<path d="M16.11,27a1,1,0,1,0,1,1A1,1,0,0,0,16.11,27Z"/><path d="M32.09,21H32V17.32c-1.9,2.93-10.46,3.3-14,3.3A42.43,42.43,0,0,1,8,19.56V17.88A40.59,40.59,0,0,0,18,19c5,0,13.2-.82,14-3.82v-2a7.34,7.34,0,0,1-4.12,0,39.47,39.47,0,0,1-9.88,1A42.12,42.12,0,0,1,8,13.11V11a40.59,40.59,0,0,0,10,1.14,47.76,47.76,0,0,0,7.09-.52A7.45,7.45,0,0,1,22.8,3.92c-1.7-.17-3.38-.24-4.8-.24-5.14,0-13.79.88-14,4.15H4v19.7c0,2.16,3.64,3.3,7.63,3.84l2.84,3,.59.62h17a3,3,0,0,0,3-3V23.93A3,3,0,0,0,32.09,21ZM8,26.08V24.4a25.79,25.79,0,0,0,3.46.7l-1.24,1.44C9.46,26.42,8.71,26.27,8,26.08ZM33.09,32a1,1,0,0,1-1,1H15.92L11.4,28.23,15.92,23H32.09a1,1,0,0,1,1,1Z"/>'
};
var controlLunIconName = "control-lun";
var controlLunIcon = [controlLunIconName, renderIcon(icon262)];

// node_modules/@clr/core/icon/shapes/cpu.js
var icon263 = {
  outline: '<path d="M23.08,23.07h-11v1.5H23.83a.75.75,0,0,0,.75-.75V11.33h-1.5Z"/><path d="M32.2,18.15a.8.8,0,1,0,0-1.6H30v-5.4h2.2a.8.8,0,1,0,0-1.6H30V8.1A2.1,2.1,0,0,0,27.9,6H26.35V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6H8.1A2.1,2.1,0,0,0,6,8.1V9.55H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6V27.9A2.1,2.1,0,0,0,8.1,30h2.65v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30H27.9A2.1,2.1,0,0,0,30,27.9V25.15h2.2a.8.8,0,1,0,0-1.6H30v-5.4ZM28,27.9a.1.1,0,0,1-.1.1H8.1a.1.1,0,0,1-.1-.1V8.1A.1.1,0,0,1,8.1,8H27.9a.1.1,0,0,1,.1.1Z"/>',
  outlineAlerted: '<path d="M32.2,23.55H30v-5.4h2.2a.8.8,0,1,0,0-1.6H30V15.4H28V27.9a.1.1,0,0,1-.1.1H8.1a.1.1,0,0,1-.1-.1V8.1A.1.1,0,0,1,8.1,8h12l1.15-2H19.35V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6H8.1A2.1,2.1,0,0,0,6,8.1V9.55H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6V27.9A2.1,2.1,0,0,0,8.1,30h2.65v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30H27.9A2.1,2.1,0,0,0,30,27.9V25.15h2.2a.8.8,0,1,0,0-1.6Z"/><path d="M12.06,24.57H23.83a.75.75,0,0,0,.75-.75V15.4h-1.5v7.67h-11Z"/>',
  outlineBadged: '<path d="M12.06,24.57H23.83a.75.75,0,0,0,.75-.75V11.33h-1.5V23.07h-11Z"/><path d="M32.2,23.55H30v-5.4h2.2a.8.8,0,1,0,0-1.6H30V13.5a7.49,7.49,0,0,1-2-.28V27.9a.1.1,0,0,1-.1.1H8.1a.1.1,0,0,1-.1-.1V8.1A.1.1,0,0,1,8.1,8H22.78a7.49,7.49,0,0,1-.28-2H19.35V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6H8.1A2.1,2.1,0,0,0,6,8.1V9.55H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6V27.9A2.1,2.1,0,0,0,8.1,30h2.65v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30H27.9A2.1,2.1,0,0,0,30,27.9V25.15h2.2a.8.8,0,1,0,0-1.6Z"/>',
  solid: '<path d="M32.2,18.15a.8.8,0,1,0,0-1.6H30v-5.4h2.2a.8.8,0,1,0,0-1.6H30V8.1A2.1,2.1,0,0,0,27.9,6H26.35V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6H8.1A2.1,2.1,0,0,0,6,8.1V9.55H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6V27.9A2.1,2.1,0,0,0,8.1,30h2.65v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30H27.9A2.1,2.1,0,0,0,30,27.9V25.15h2.2a.8.8,0,1,0,0-1.6H30v-5.4ZM25,23.81A1.18,1.18,0,0,1,24,25H13V23H23V11h2Z"/>',
  solidAlerted: '<path d="M32.2,23.55H30v-5.4h2.2a.8.8,0,1,0,0-1.6H30V15.4H25v8.41A1.18,1.18,0,0,1,24,25H13V23H23V15.4h-.77A3.68,3.68,0,0,1,19,9.89L21.29,6H19.35V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6H8.1A2.1,2.1,0,0,0,6,8.1V9.55H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6V27.9A2.1,2.1,0,0,0,8.1,30h2.65v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30H27.9A2.1,2.1,0,0,0,30,27.9V25.15h2.2a.8.8,0,1,0,0-1.6Z"/>',
  solidBadged: '<path d="M32.2,23.55H30v-5.4h2.2a.8.8,0,1,0,0-1.6H30V13.5a7.46,7.46,0,0,1-5-1.92V23.81A1.18,1.18,0,0,1,24,25H13V23H23V11h1.42A7.46,7.46,0,0,1,22.5,6H19.35V3.8a.8.8,0,1,0-1.6,0V6h-5.4V3.8a.8.8,0,1,0-1.6,0V6H8.1A2.1,2.1,0,0,0,6,8.1V9.55H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6v5.4H3.8a.8.8,0,1,0,0,1.6H6V27.9A2.1,2.1,0,0,0,8.1,30h2.65v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30h5.4v2.2a.8.8,0,1,0,1.6,0V30H27.9A2.1,2.1,0,0,0,30,27.9V25.15h2.2a.8.8,0,1,0,0-1.6Z"/>'
};
var cpuIconName = "cpu";
var cpuIcon = [cpuIconName, renderIcon(icon263)];

// node_modules/@clr/core/icon/shapes/dashboard.js
var icon264 = {
  outline: '<path d="M25.18,12.32l-5.91,5.81a3,3,0,1,0,1.41,1.42l5.92-5.81Z"/><path d="M18,4.25A16.49,16.49,0,0,0,5.4,31.4l.3.35H30.3l.3-.35A16.49,16.49,0,0,0,18,4.25Zm11.34,25.5H6.66a14.43,14.43,0,0,1-3.11-7.84H7v-2H3.55A14.41,14.41,0,0,1,7,11.29l2.45,2.45,1.41-1.41L8.43,9.87A14.41,14.41,0,0,1,17,6.29v3.5h2V6.3a14.47,14.47,0,0,1,13.4,13.61H28.92v2h3.53A14.43,14.43,0,0,1,29.34,29.75Z"/>',
  outlineBadged: '<path d="M15.85,18.69a3,3,0,1,0,4.83.85l5.92-5.81-1.41-1.41-5.91,5.81A3,3,0,0,0,15.85,18.69Z"/><path d="M32.58,13a7.45,7.45,0,0,1-2.06.44,14.4,14.4,0,0,1,1.93,6.43H28.92v2h3.53a14.43,14.43,0,0,1-3.11,7.84H6.66a14.43,14.43,0,0,1-3.11-7.84H7v-2H3.55A14.41,14.41,0,0,1,7,11.29l2.45,2.45,1.41-1.41L8.43,9.87A14.41,14.41,0,0,1,17,6.29v3.5h2V6.3A14.41,14.41,0,0,1,22.58,7a7.52,7.52,0,0,1-.08-1,7.52,7.52,0,0,1,.09-1.09A16.49,16.49,0,0,0,5.4,31.4l.3.35H30.3l.3-.35a16.45,16.45,0,0,0,2-18.36Z"/>',
  solid: '<path d="M18,4.25A16.49,16.49,0,0,0,5.4,31.4l.3.35H30.3l.3-.35A16.49,16.49,0,0,0,18,4.25Zm8.6,9.48-5.92,5.81a3,3,0,1,1-1.41-1.42l5.91-5.81Zm-23,6.17H7v2H3.56c0-.39-.05-.77-.05-1.17S3.53,20.18,3.55,19.9Zm4.88-10,2.46,2.46L9.47,13.74,7,11.29A14.57,14.57,0,0,1,8.43,9.87ZM19,9.79H17V6.29c.32,0,.63,0,1,0s.7,0,1,.05ZM32.49,20.74c0,.39,0,.79-.05,1.17H28.92v-2h3.53C32.47,20.18,32.49,20.46,32.49,20.74Z"/>',
  solidBadged: '<path d="M32.58,13a7.46,7.46,0,0,1-10-8.12A16.49,16.49,0,0,0,5.4,31.4l.3.35H30.3l.3-.35a16.45,16.45,0,0,0,2-18.36ZM17,6.29c.32,0,.63,0,1,0s.7,0,1,.05v3.5H17ZM7,21.91H3.56c0-.39-.05-.77-.05-1.17s0-.56,0-.83H7Zm2.51-8.16L7,11.29A14.57,14.57,0,0,1,8.43,9.87l2.46,2.46Zm10.62,9.19a3,3,0,1,1-.82-4.81l5.91-5.81,1.41,1.41-5.92,5.81A3,3,0,0,1,20.09,22.93Zm12.35-1H28.92v-2h3.53c0,.28,0,.55,0,.83S32.47,21.52,32.44,21.91Z"/>'
};
var dashboardIconName = "dashboard";
var dashboardIcon = [dashboardIconName, renderIcon(icon264)];

// node_modules/@clr/core/icon/shapes/data-cluster.js
var icon265 = {
  outline: '<path d="M26.5,4.08C22.77,4.08,19,5.4,19,7.91V9.5a18.75,18.75,0,0,1,2,.2V7.91c0-.65,2.09-1.84,5.5-1.84S32,7.27,32,7.91V18.24c0,.54-1.46,1.44-3.9,1.73v2c3.13-.32,5.9-1.6,5.9-3.75V7.91C34,5.4,30.23,4.08,26.5,4.08Z"/><path d="M4,18.24V7.91c0-.65,2.09-1.84,5.5-1.84S15,7.27,15,7.91V9.7a18.75,18.75,0,0,1,2-.2V7.91c0-2.52-3.77-3.84-7.5-3.84S2,5.4,2,7.91V18.24C2,20.4,4.77,21.67,7.9,22V20C5.46,19.68,4,18.78,4,18.24Z"/><path d="M18,10.85c-4.93,0-8.65,1.88-8.65,4.38V27.54c0,2.5,3.72,4.38,8.65,4.38s8.65-1.88,8.65-4.38V15.23C26.65,12.73,22.93,10.85,18,10.85Zm6.65,7.67c-.85,1-3.42,2-6.65,2A14.49,14.49,0,0,1,14,20v1.46a16.33,16.33,0,0,0,4,.47,12.76,12.76,0,0,0,6.65-1.56v3.12c-.85,1-3.42,2-6.65,2a14.49,14.49,0,0,1-4-.53v1.46a16.33,16.33,0,0,0,4,.47,12.76,12.76,0,0,0,6.65-1.56v2.29c0,.95-2.65,2.38-6.65,2.38s-6.65-1.43-6.65-2.38V15.23c0-.95,2.65-2.38,6.65-2.38s6.65,1.43,6.65,2.38Z"/>',
  outlineAlerted: '<path d="M4,18.24V7.91c0-.65,2.09-1.84,5.5-1.84S15,7.27,15,7.91V9.7a18.75,18.75,0,0,1,2-.2V7.91c0-2.52-3.77-3.84-7.5-3.84S2,5.4,2,7.91V18.24C2,20.4,4.77,21.67,7.9,22V20C5.46,19.68,4,18.78,4,18.24Z"/><path d="M24.65,18.52c-.85,1-3.42,2-6.65,2A14.49,14.49,0,0,1,14,20v1.46a16.33,16.33,0,0,0,4,.47,12.76,12.76,0,0,0,6.65-1.56v3.12c-.85,1-3.42,2-6.65,2a14.49,14.49,0,0,1-4-.53v1.46a16.33,16.33,0,0,0,4,.47,12.76,12.76,0,0,0,6.65-1.56v2.29c0,.95-2.65,2.38-6.65,2.38s-6.65-1.43-6.65-2.38V15.23c0-.95,2.65-2.38,6.65-2.38l.75,0a3.69,3.69,0,0,1-.08-2l-.66,0c-4.93,0-8.65,1.88-8.65,4.38V27.54c0,2.5,3.72,4.38,8.65,4.38s8.65-1.88,8.65-4.38V15.4h-2Z"/><path d="M22,4.8c-1.75.63-3,1.68-3,3.12V9.5l.25,0Z"/><path d="M33.68,15.4H32v2.84c0,.54-1.46,1.44-3.9,1.73v2c3.13-.32,5.9-1.6,5.9-3.75V15.38Z"/>',
  outlineBadged: '<path d="M4,18.24V7.91c0-.65,2.09-1.84,5.5-1.84S15,7.27,15,7.91V9.7a18.75,18.75,0,0,1,2-.2V7.91c0-2.52-3.77-3.84-7.5-3.84S2,5.4,2,7.91V18.24C2,20.4,4.77,21.67,7.9,22V20C5.46,19.68,4,18.78,4,18.24Z"/><path d="M18,10.85c-4.93,0-8.65,1.88-8.65,4.38V27.54c0,2.5,3.72,4.38,8.65,4.38s8.65-1.88,8.65-4.38V15.23C26.65,12.73,22.93,10.85,18,10.85Zm6.65,7.67c-.85,1-3.42,2-6.65,2A14.49,14.49,0,0,1,14,20v1.46a16.33,16.33,0,0,0,4,.47,12.76,12.76,0,0,0,6.65-1.56v3.12c-.85,1-3.42,2-6.65,2a14.49,14.49,0,0,1-4-.53v1.46a16.33,16.33,0,0,0,4,.47,12.76,12.76,0,0,0,6.65-1.56v2.29c0,.95-2.65,2.38-6.65,2.38s-6.65-1.43-6.65-2.38V15.23c0-.95,2.65-2.38,6.65-2.38s6.65,1.43,6.65,2.38Z"/><path d="M21,7.91c0-.33.55-.8,1.54-1.18,0-.24,0-.48,0-.73a7.52,7.52,0,0,1,.14-1.41C20.55,5.19,19,6.3,19,7.91V9.5a18.75,18.75,0,0,1,2,.2Z"/><path d="M32,13.22v5c0,.54-1.46,1.44-3.9,1.73v2c3.13-.32,5.9-1.6,5.9-3.75v-5.9A7.45,7.45,0,0,1,32,13.22Z"/>',
  solid: '<path d="M26.5,4.08C22.77,4.08,19,5.4,19,7.91V9.48c5.3.26,9,2.6,9,5.76v6.7l.05.06c3.13-.32,5.9-1.6,5.9-3.75V7.91C34,5.4,30.23,4.08,26.5,4.08Z"/><path d="M17,9.48V7.91c0-2.52-3.77-3.84-7.5-3.84S2,5.4,2,7.91V18.24C2,20.4,4.77,21.67,7.9,22L8,21.93v-6.7C8,12.08,11.7,9.74,17,9.48Z"/><path d="M18,10.85c-4.93,0-8.65,1.88-8.65,4.38V27.54c0,2.5,3.72,4.38,8.65,4.38s8.65-1.88,8.65-4.38V25.38A13.58,13.58,0,0,1,18,28a16.77,16.77,0,0,1-6-1V25.27a14.5,14.5,0,0,0,6,1.17c4.21,0,7.65-1.23,8.63-3.23V20.47C24.8,22,21.72,23,18,23a16.77,16.77,0,0,1-6-1V20.23a14.5,14.5,0,0,0,6,1.17c4.21,0,7.65-1.11,8.63-3.11V15.23C26.65,12.73,22.93,10.85,18,10.85Z"/>',
  solidAlerted: '<path d="M17,9.48V7.91c0-2.52-3.77-3.84-7.5-3.84S2,5.4,2,7.91V18.24C2,20.4,4.77,21.67,7.9,22L8,21.93v-6.7C8,12.08,11.7,9.74,17,9.48Z"/><path d="M19,13.56a3.68,3.68,0,0,1-.39-2.7l-.66,0c-4.93,0-8.65,1.88-8.65,4.38V27.54c0,2.5,3.72,4.38,8.65,4.38s8.65-1.88,8.65-4.38V25.38A13.58,13.58,0,0,1,18,28a16.77,16.77,0,0,1-6-1V25.27a14.5,14.5,0,0,0,6,1.17c4.21,0,7.65-1.23,8.63-3.23V20.47C24.8,22,21.72,23,18,23a16.77,16.77,0,0,1-6-1V20.23a14.5,14.5,0,0,0,6,1.17c4.21,0,7.65-1.11,8.63-3.11V15.4H22.23A3.69,3.69,0,0,1,19,13.56Z"/><path d="M22,4.8c-1.75.63-3,1.68-3,3.12V9.48l.27,0Z"/><path d="M33.68,15.4H28v6.53l.05.06c3.13-.32,5.9-1.6,5.9-3.75V15.38Z"/>',
  solidBadged: '<path d="M17,9.48V7.91c0-2.52-3.77-3.84-7.5-3.84S2,5.4,2,7.91V18.24C2,20.4,4.77,21.67,7.9,22L8,21.93v-6.7C8,12.08,11.7,9.74,17,9.48Z"/><path d="M18,10.85c-4.93,0-8.65,1.88-8.65,4.38V27.54c0,2.5,3.72,4.38,8.65,4.38s8.65-1.88,8.65-4.38V25.38A13.58,13.58,0,0,1,18,28a16.77,16.77,0,0,1-6-1V25.27a14.5,14.5,0,0,0,6,1.17c4.21,0,7.65-1.23,8.63-3.23V20.47C24.8,22,21.72,23,18,23a16.77,16.77,0,0,1-6-1V20.23a14.5,14.5,0,0,0,6,1.17c4.21,0,7.65-1.11,8.63-3.11V15.23C26.65,12.73,22.93,10.85,18,10.85Z"/><path d="M22.5,6a7.52,7.52,0,0,1,.14-1.4C20.55,5.19,19,6.3,19,7.91V9.48a15.33,15.33,0,0,1,5,1A7.46,7.46,0,0,1,22.5,6Z"/><path d="M30,13.49A7.47,7.47,0,0,1,27.35,13a4,4,0,0,1,.7,2.23v6.7l.05.06c3.13-.32,5.9-1.6,5.9-3.75V12.33A7.46,7.46,0,0,1,30,13.49Z"/>'
};
var dataClusterIconName = "data-cluster";
var dataClusterIcon = [dataClusterIconName, renderIcon(icon265)];

// node_modules/@clr/core/icon/shapes/deploy.js
var icon266 = {
  outline: '<path d="M33,2H22.1a1,1,0,0,0,0,2h8.53l-8.82,9a1,1,0,1,0,1.43,1.4L32,5.46V13.9a1,1,0,0,0,2,0V3A1,1,0,0,0,33,2Z"/><path d="M11.54,10.73l-9,5.17a1,1,0,0,0-.5.87v11a1,1,0,0,0,.5.87l9,5.15a1,1,0,0,0,1,0l9-5.15a1,1,0,0,0,.5-.87v-11a1,1,0,0,0-.5-.87l-9-5.17A1,1,0,0,0,11.54,10.73ZM11,31.08l-7-4V18.44l7,4ZM12,21,4.81,16.87,12,12.78l7.21,4.12Zm8,6.09-7,4V22.44l7-4Z"/>',
  solid: '<path d="M33,2H22.1a1,1,0,0,0,0,2h8.53l-8.82,9a1,1,0,1,0,1.43,1.4L32,5.46V13.9a1,1,0,0,0,2,0V3A1,1,0,0,0,33,2Z"/><path d="M12.46,10.73a1,1,0,0,0-1,0l-8.68,5L12,21l9.19-5.26Z"/><path d="M2,27.73a1,1,0,0,0,.5.87L11,33.46v-11L2,17.28Z"/><path d="M13,33.46l8.5-4.86a1,1,0,0,0,.5-.87V17.29l-9,5.15Z"/>'
};
var deployIconName = "deploy";
var deployIcon = [deployIconName, renderIcon(icon266)];

// node_modules/@clr/core/icon/shapes/devices.js
var icon267 = {
  outline: '<path d="M32,13H24a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V15A2,2,0,0,0,32,13Zm0,2V26H24V15ZM24,30V27.6h8V30Z"/><path d="M20,22H4V6H28v5h2V6a2,2,0,0,0-2-2H4A2,2,0,0,0,2,6V22a2,2,0,0,0,2,2H20Z"/><path d="M20,26H9a1,1,0,0,0,0,2H20Z"/>',
  solid: '<path d="M32,13H24a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V15A2,2,0,0,0,32,13Zm0,2V28H24V15Z"/><path d="M28,4H4A2,2,0,0,0,2,6V22a2,2,0,0,0,2,2h8v2H9.32A1.2,1.2,0,0,0,8,27a1.2,1.2,0,0,0,1.32,1H19.92v-.37H20V22H4V6H28v5h2V6A2,2,0,0,0,28,4Z"/>'
};
var devicesIconName = "devices";
var devicesIcon = [devicesIconName, renderIcon(icon267)];

// node_modules/@clr/core/icon/shapes/disconnect.js
var icon268 = {
  outline: '<path d="M12.17,6A6.21,6.21,0,0,0,6,11H2.13v2H6a6.23,6.23,0,0,0,6.21,5H17V6ZM15.1,16H12.17a4.2,4.2,0,0,1-4.31-4,4.17,4.17,0,0,1,4.31-4H15.1Z"/><path d="M33.92,23H30.14a6.25,6.25,0,0,0-6.21-5H19v2H14a1,1,0,1,0,0,2h5v4H14a1,1,0,0,0-1,1,1,1,0,0,0,1,1h5v2h4.94a6.23,6.23,0,0,0,6.22-5h3.76Zm-10,5H21V20h2.94a4.17,4.17,0,0,1,4.31,4A4.17,4.17,0,0,1,23.94,28Z"/>',
  solid: '<path d="M12,6a6.21,6.21,0,0,0-6.21,5H2v2H5.83A6.23,6.23,0,0,0,12,18H17V6Z"/><path d="M33.79,23H30.14a6.25,6.25,0,0,0-6.21-5H19v2H14a1,1,0,0,0-1,1,1,1,0,0,0,1,1h5v4H14a1,1,0,0,0-1,1,1,1,0,0,0,1,1h5v2h4.94a6.23,6.23,0,0,0,6.22-5h3.64Z"/>'
};
var disconnectIconName = "disconnect";
var disconnectIcon = [disconnectIconName, renderIcon(icon268)];

// node_modules/@clr/core/icon/shapes/display.js
var icon269 = {
  outline: '<path d="M32.5,3H3.5A1.5,1.5,0,0,0,2,4.5v21A1.5,1.5,0,0,0,3.5,27h29A1.5,1.5,0,0,0,34,25.5V4.5A1.5,1.5,0,0,0,32.5,3ZM32,25H4V5H32Z"/><polygon points="7.7 8.76 28.13 8.76 29.94 7.16 6.1 7.16 6.1 23 7.7 23 7.7 8.76"/><path d="M26,32H24.26a3.61,3.61,0,0,1-1.5-2.52V28.13H21.24V29.5A4.2,4.2,0,0,0,22.17,32H13.83a4.2,4.2,0,0,0,.93-2.52V28.13H13.24V29.5A3.61,3.61,0,0,1,11.74,32H9.94a1,1,0,1,0,0,2H26.06a.92.92,0,0,0,1-1A1,1,0,0,0,26,32Z"/>',
  outlineAlerted: '<path d="M26,32H24.26a3.61,3.61,0,0,1-1.5-2.52V28.13H21.24V29.5A4.2,4.2,0,0,0,22.17,32H13.83a4.2,4.2,0,0,0,.93-2.52V28.13H13.24V29.5A3.61,3.61,0,0,1,11.74,32H9.94a1,1,0,1,0,0,2H26.06a.92.92,0,0,0,1-1A1,1,0,0,0,26,32Z"/><path d="M33.68,15.4H32V25H4V5H21.87L23,3H3.5A1.5,1.5,0,0,0,2,4.5v21A1.5,1.5,0,0,0,3.5,27h29A1.5,1.5,0,0,0,34,25.5V15.38Z"/><polygon points="7.7 23 7.7 8.76 19.7 8.76 20.62 7.16 6.1 7.16 6.1 23 7.7 23"/>',
  outlineBadged: '<path d="M26,32H24.26a3.61,3.61,0,0,1-1.5-2.52V28.13H21.24V29.5A4.2,4.2,0,0,0,22.17,32H13.83a4.2,4.2,0,0,0,.93-2.52V28.13H13.24V29.5A3.61,3.61,0,0,1,11.74,32H9.94a1,1,0,1,0,0,2H26.06a.92.92,0,0,0,1-1A1,1,0,0,0,26,32Z"/><path d="M6.1,23H7.7V8.76H23a7.44,7.44,0,0,1-.43-1.6H6.1Z"/><path d="M32,13.22V25H4V5H22.57a7.45,7.45,0,0,1,.55-2H3.5A1.5,1.5,0,0,0,2,4.5v21A1.5,1.5,0,0,0,3.5,27h29A1.5,1.5,0,0,0,34,25.5V12.34A7.45,7.45,0,0,1,32,13.22Z"/>',
  solid: '<path d="M26,32H24.26a3.61,3.61,0,0,1-1.5-2.52V28.13H13.24V29.5A3.61,3.61,0,0,1,11.74,32H9.94a1,1,0,1,0,0,2H26.06a.92.92,0,0,0,1-1A1,1,0,0,0,26,32Z"/><path d="M32.5,3H3.5A1.5,1.5,0,0,0,2,4.5v21A1.5,1.5,0,0,0,3.5,27h29A1.5,1.5,0,0,0,34,25.5V4.5A1.5,1.5,0,0,0,32.5,3ZM31,21.83H5V7H31Z"/>',
  solidAlerted: '<path d="M26,32H24.26a3.61,3.61,0,0,1-1.5-2.52V28.13H13.24V29.5A3.61,3.61,0,0,1,11.74,32H9.94a1,1,0,1,0,0,2H26.06a.92.92,0,0,0,1-1A1,1,0,0,0,26,32Z"/><path d="M33.68,15.4H31v6.43H5V7H20.71L23,3H3.5A1.5,1.5,0,0,0,2,4.5v21A1.5,1.5,0,0,0,3.5,27h29A1.5,1.5,0,0,0,34,25.5V15.38Z"/>',
  solidBadged: '<path d="M26,32H24.26a3.61,3.61,0,0,1-1.5-2.52V28.13H13.24V29.5A3.61,3.61,0,0,1,11.74,32H9.94a1,1,0,1,0,0,2H26.06a.92.92,0,0,0,1-1A1,1,0,0,0,26,32Z"/><path d="M31,13.43v8.41H5V7H22.57a7.29,7.29,0,0,1,.55-4H3.5A1.5,1.5,0,0,0,2,4.5v21A1.5,1.5,0,0,0,3.5,27h29A1.5,1.5,0,0,0,34,25.5V12.34A7.44,7.44,0,0,1,31,13.43Z"/>'
};
var displayIconName = "display";
var displayIcon = [displayIconName, renderIcon(icon269)];

// node_modules/@clr/core/icon/shapes/download-cloud.js
var icon270 = {
  outline: '<path d="M30.31,13c0-.1,0-.21,0-.32a10.26,10.26,0,0,0-10.45-10,10.47,10.47,0,0,0-9.6,6.1A9.65,9.65,0,0,0,10.89,28a3,3,0,0,1,0-2A7.65,7.65,0,0,1,11,10.74l.67,0,.23-.63a8.43,8.43,0,0,1,8-5.4,8.26,8.26,0,0,1,8.45,8,7.75,7.75,0,0,1,0,.8l-.08.72.65.3A6,6,0,0,1,26.38,26H25.09a3,3,0,0,1,0,2h1.28a8,8,0,0,0,3.93-15Z"/><path d="M22.28,26.07a1,1,0,0,0-.71.29L19,28.94V16.68a1,1,0,1,0-2,0V28.94l-2.57-2.57A1,1,0,0,0,13,27.78l5,5,5-5a1,1,0,0,0-.71-1.71Z"/>',
  outlineAlerted: '<path d="M22.28,26.07a1,1,0,0,0-.71.29L19,28.94V16.68a1,1,0,1,0-2,0V28.94l-2.57-2.57A1,1,0,0,0,13,27.78l5,5,5-5a1,1,0,0,0-.71-1.71Z"/><path d="M19.87,4.69a8.81,8.81,0,0,1,2,.25l1-1.8a10.8,10.8,0,0,0-3.07-.45,10.47,10.47,0,0,0-9.6,6.1A9.65,9.65,0,0,0,10.89,28a3,3,0,0,1,0-2A7.65,7.65,0,0,1,11,10.74l.67,0,.23-.63A8.43,8.43,0,0,1,19.87,4.69Z"/><path d="M32.9,15.4H30.21A6,6,0,0,1,26.38,26H25.09a3,3,0,0,1,0,2h1.28A8,8,0,0,0,32.9,15.4Z"/>',
  outlineBadged: '<path d="M22.28,26.07a1,1,0,0,0-.71.29L19,28.94V16.68a1,1,0,1,0-2,0V28.94l-2.57-2.57A1,1,0,0,0,13,27.78l5,5,5-5a1,1,0,0,0-.71-1.71Z"/><path d="M19.87,4.69a8.79,8.79,0,0,1,2.68.42,7.45,7.45,0,0,1,.5-1.94,10.79,10.79,0,0,0-3.18-.48,10.47,10.47,0,0,0-9.6,6.1A9.65,9.65,0,0,0,10.89,28a3,3,0,0,1,0-2A7.65,7.65,0,0,1,11,10.74l.67,0,.23-.63A8.43,8.43,0,0,1,19.87,4.69Z"/><path d="M30.92,13.44a7.13,7.13,0,0,1-2.63-.14c0,.08,0,.15,0,.23l-.08.72.65.3A6,6,0,0,1,26.38,26H25.09a3,3,0,0,1,0,2h1.28a8,8,0,0,0,4.54-14.61Z"/>'
};
var downloadCloudIconName = "download-cloud";
var downloadCloudIcon = [downloadCloudIconName, renderIcon(icon270)];

// node_modules/@clr/core/icon/shapes/export.js
var icon271 = {
  outline: '<path d="M6,13.61h7.61V6H24v8.38h2V6a2,2,0,0,0-2-2H10.87L4,10.87V30a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2H6Zm0-1.92L11.69,6H12v6H6Z"/><path d="M28.32,16.35a1,1,0,0,0-1.41,1.41L30.16,21H18a1,1,0,0,0,0,2H30.19l-3.28,3.28a1,1,0,1,0,1.41,1.41L34,22Z"/>',
  outlineAlerted: '<path d="M28.32,16.35a1,1,0,0,0-1.41,1.41L30.16,21H18a1,1,0,0,0,0,2H30.19l-3.28,3.28a1,1,0,1,0,1.41,1.41L34,22Z"/><path d="M6,13.61h7.61V6h7.68l1.15-2H10.87L4,10.87V30a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2H6Zm0-1.92L11.69,6H12v6H6Z"/>',
  outlineBadged: '<path d="M28.32,16.35a1,1,0,0,0-1.41,1.41L30.16,21H18a1,1,0,0,0,0,2H30.19l-3.28,3.28a1,1,0,1,0,1.41,1.41L34,22Z"/><path d="M26,12.34a7.53,7.53,0,0,1-2-1.85v3.89h2Z"/><path d="M6,13.61h7.61V6H22.5a7.49,7.49,0,0,1,.28-2H10.87L4,10.87V30a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2H6Zm0-1.92L11.69,6H12v6H6Z"/>',
  solid: '<path d="M17,22a1,1,0,0,1,1-1h8V6a2,2,0,0,0-2-2H10.87L4,10.86V30a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V23H18A1,1,0,0,1,17,22ZM12,12H6v-.32L11.69,6H12Z"/><path d="M29.32,16.35a1,1,0,0,0-1.41,1.41L31.16,21H26v2h5.19l-3.28,3.28a1,1,0,1,0,1.41,1.41L35,22Z"/>',
  solidAlerted: '<path d="M29.32,16.35a1,1,0,0,0-1.41,1.41L31.16,21H26v2h5.19l-3.28,3.28a1,1,0,1,0,1.41,1.41L35,22Z"/><path d="M17,22a1,1,0,0,1,1-1h8V15.4H22.23A3.68,3.68,0,0,1,19,9.89L22.45,4H10.87L4,10.86V30a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V23H18A1,1,0,0,1,17,22ZM12,12H6v-.32L11.69,6H12Z"/>',
  solidBadged: '<path d="M29.32,16.35a1,1,0,0,0-1.41,1.41L31.16,21H26v2h5.19l-3.28,3.28a1,1,0,1,0,1.41,1.41L35,22Z"/><path d="M17,22a1,1,0,0,1,1-1h8V12.34A7.46,7.46,0,0,1,22.78,4H10.87L4,10.86V30a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V23H18A1,1,0,0,1,17,22ZM12,12H6v-.32L11.69,6H12Z"/>'
};
var exportIconName = "export";
var exportIcon = [exportIconName, renderIcon(icon271)];

// node_modules/@clr/core/icon/shapes/file-share.js
var icon272 = {
  outline: '<path d="M30,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V11A2,2,0,0,0,30,9Zm0,20H6V13h7.31a2,2,0,0,0,2-2H6V7h6.49l2.61,3.59a1,1,0,0,0,.81.41H30Z"/><path d="M21.91,22.48a2.06,2.06,0,0,0-1.44.62l-5.72-2.66V20l5.66-2.65a2.08,2.08,0,1,0,.06-2.94,2.12,2.12,0,0,0-.64,1.48v.23l-5.64,2.66a2.08,2.08,0,1,0-.08,2.95l.08-.08,5.67,2.66v.3a2.09,2.09,0,1,0,2.08-2.1Z"/>',
  solid: '<path d="M30,9H16.42L14.11,5.82A2,2,0,0,0,12.49,5H6A2,2,0,0,0,4,7V29a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V11A2,2,0,0,0,30,9ZM6,7h6.49l2.72,4H6ZM21.94,26.64a2.09,2.09,0,0,1-2.11-2.06l0-.3-5.67-2.66-.08.08a2.08,2.08,0,1,1,.08-2.95l5.64-2.66v-.23a2.08,2.08,0,1,1,.58,1.46L14.75,20v.47l5.72,2.66a2.07,2.07,0,1,1,1.47,3.54Z"/>'
};
var fileShareIconName = "file-share";
var fileShareIcon = [fileShareIconName, renderIcon(icon272)];

// node_modules/@clr/core/icon/shapes/file-share-2.js
var icon273 = {
  outline: '<path d="M25,4H7.83A1.89,1.89,0,0,0,6,5.91V30.09A1.89,1.89,0,0,0,7.83,32H28.17A1.87,1.87,0,0,0,30,30.09V9ZM24,5.78,28.2,10H24ZM8,30V6H22v6h6V30Z"/><path d="M22,21.81a2.11,2.11,0,0,0-1.44.62l-5.72-2.66v-.44l5.66-2.65a2.08,2.08,0,1,0,.06-2.94h0a2.14,2.14,0,0,0-.64,1.48v.23l-5.64,2.66a2.08,2.08,0,1,0-.08,2.95l.08-.08,5.67,2.66v.3A2.09,2.09,0,1,0,22,21.84Z"/>',
  solid: '<path d="M25,4.06H7.83A1.89,1.89,0,0,0,6,6V30.15a1.89,1.89,0,0,0,1.83,1.91H28.17A1.87,1.87,0,0,0,30,30.15V9ZM22,26a2.09,2.09,0,0,1-2.1-2.08v-.3L14.27,21l-.08.08a2.08,2.08,0,1,1,.08-2.95l5.64-2.66v-.23a2.14,2.14,0,0,1,.64-1.48h0a2.08,2.08,0,1,1-.06,2.94l-5.66,2.65v.44l5.72,2.66A2.11,2.11,0,0,1,22,21.81l0,0A2.09,2.09,0,0,1,22,26Zm2-16V5.84l4.2,4.22Z"/>'
};
var fileShare2IconName = "file-share-2";
var fileShare2Icon = [fileShare2IconName, renderIcon(icon273)];

// node_modules/@clr/core/icon/shapes/flask.js
var icon274 = {
  outline: '<path d="M31.43,27.28,23,14.84V4h1a1,1,0,0,0,0-2H12a1,1,0,0,0,0,2h1V14.84L4.51,27.36A4.29,4.29,0,0,0,5,32.8,4.38,4.38,0,0,0,8.15,34H28a4.24,4.24,0,0,0,3.42-6.72ZM29.85,31a2.62,2.62,0,0,1-2,1H8a2.2,2.2,0,0,1-2.06-1.41,2.68,2.68,0,0,1,.29-2.17l3-4.44,14,0-1.31-2H10.57L15,15.46V4h6V15.46l8.84,13.05A2.23,2.23,0,0,1,29.85,31Z"/>',
  solid: '<path d="M31.49,27.4,23,14.94V4h1a1,1,0,0,0,0-2H12.08a1,1,0,0,0,0,2H13V14.94L4.58,27.31a4.31,4.31,0,0,0-.78,3A4.23,4.23,0,0,0,8,34H27.86A4.36,4.36,0,0,0,31,32.8,4.23,4.23,0,0,0,31.49,27.4ZM15,15.49V4h6V15.49L26.15,23H9.85Z"/>'
};
var flaskIconName = "flask";
var flaskIcon = [flaskIconName, renderIcon(icon274)];

// node_modules/@clr/core/icon/shapes/floppy.js
var icon275 = {
  outline: '<path d="M27.36,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V8.78ZM25,30H11V22H25Zm5,0H27V22a2,2,0,0,0-2-2H11a2,2,0,0,0-2,2v8H6V6h4v6a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2H12V6H26.51L30,9.59Z"/>',
  outlineAlerted: '<path d="M30,15.4V30H27V22a2,2,0,0,0-2-2H11a2,2,0,0,0-2,2v8H6V6h4v6a2,2,0,0,0,2,2h7.35a3.54,3.54,0,0,1-.77-2H12V6h9.29l1.15-2H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V15.4ZM25,30H11V22H25Z"/>',
  outlineBadged: '<path d="M30,13.5h0V30H27V22a2,2,0,0,0-2-2H11a2,2,0,0,0-2,2v8H6V6h4v6a2,2,0,0,0,2,2H24a2,2,0,0,0,2-1.68l-.43-.3H12V6H22.5a7.49,7.49,0,0,1,.28-2H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V13.22A7.49,7.49,0,0,1,30,13.5ZM25,30H11V22H25Z"/>',
  solid: '<path d="M27.36,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V8.78ZM26,30H10V21.5A1.5,1.5,0,0,1,11.5,20h13A1.5,1.5,0,0,1,26,21.5ZM24,14H12a2,2,0,0,1-2-2V6h2v6H26A2,2,0,0,1,24,14Z"/>',
  solidAlerted: '<path d="M22.23,15.4A3.69,3.69,0,0,1,19.35,14H12a2,2,0,0,1-2-2V6h2v6h6.58A3.67,3.67,0,0,1,19,9.89L22.45,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V15.4ZM26,30H10V21.5A1.5,1.5,0,0,1,11.5,20h13A1.5,1.5,0,0,1,26,21.5Z"/>',
  solidBadged: '<path d="M30,13.5a7.46,7.46,0,0,1-4-1.18A2,2,0,0,1,24,14H12a2,2,0,0,1-2-2V6h2v6H25.54a7.45,7.45,0,0,1-2.76-8H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V13.22A7.49,7.49,0,0,1,30,13.5ZM26,30H10V21.5A1.5,1.5,0,0,1,11.5,20h13A1.5,1.5,0,0,1,26,21.5Z"/>'
};
var floppyIconName = "floppy";
var floppyIcon = [floppyIconName, renderIcon(icon275)];

// node_modules/@clr/core/icon/shapes/hard-disk.js
var icon276 = {
  outline: '<path d="M34,21.08,30.86,8.43A2,2,0,0,0,28.94,7H7.06A2,2,0,0,0,5.13,8.47L2,21.08a1,1,0,0,0,0,.24V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V21.31A1,1,0,0,0,34,21.08ZM4,29V21.44L7.06,9H28.93L32,21.44V29Z"/><rect x="6" y="20" width="24" height="2"/><rect x="26" y="24" width="4" height="2"/>',
  outlineAlerted: '<rect x="6" y="20" width="24" height="2"/><rect x="26" y="24" width="4" height="2"/><path d="M34,21.08l-1.4-5.68H30.51l1.49,6V29H4V21.44L7.06,9h12.5l1.15-2H7.06A2,2,0,0,0,5.13,8.47L2,21.08a1,1,0,0,0,0,.24V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V21.31A1,1,0,0,0,34,21.08Z"/>',
  outlineBadged: '<rect x="6" y="20" width="24" height="2"/><rect x="26" y="24" width="4" height="2"/><path d="M34,21.08,32,13.21a7.49,7.49,0,0,1-2,.29l2,7.94V29H4V21.44L7.06,9H23.13a7.45,7.45,0,0,1-.55-2H7.06A2,2,0,0,0,5.13,8.47L2,21.08a1,1,0,0,0,0,.24V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V21.31A1,1,0,0,0,34,21.08Z"/>',
  solid: '<path d="M30.86,8.43A2,2,0,0,0,28.94,7H7.06A2,2,0,0,0,5.13,8.47L2.29,20H33.71Z"/><path d="M2,22v7a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22Zm28,5H26V25h4Z"/>',
  solidAlerted: '<path d="M2,22v7a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22Zm28,5H26V25h4Z"/><path d="M32.58,15.4H22.23A3.68,3.68,0,0,1,19,9.89L20.71,7H7.06A2,2,0,0,0,5.13,8.47L2.29,20H33.71Z"/>',
  solidBadged: '<path d="M2,22v7a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V22Zm28,5H26V25h4Z"/><path d="M32,13.21A7.47,7.47,0,0,1,22.57,7H7.06A2,2,0,0,0,5.13,8.47L2.29,20H33.71Z"/>'
};
var hardDiskIconName = "hard-disk";
var hardDiskIcon = [hardDiskIconName, renderIcon(icon276)];

// node_modules/@clr/core/icon/shapes/hard-drive.js
var icon277 = {
  outline: '<path d="M34,8a2,2,0,0,0-2-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2ZM32,28H4V8H32V28Z"/><circle cx="6.21" cy="10.25" r="1.25"/><circle cx="29.81" cy="10.25" r="1.25"/><circle cx="6.21" cy="25.42" r="1.25"/><circle cx="29.81" cy="25.42" r="1.25"/><path d="M11.88,18.08a3.59,3.59,0,1,0,3.59-3.59,3.84,3.84,0,0,0-.91.13L15,16.16a2.08,2.08,0,0,1,.5-.07,2,2,0,1,1-2,2,1.64,1.64,0,0,1,.08-.5L12,17.16A3.53,3.53,0,0,0,11.88,18.08Z"/><path d="M15.47,25.73a7.66,7.66,0,0,1-7.65-7.65,7.55,7.55,0,0,1,.27-2L6.54,15.7a9.24,9.24,0,0,0,17.8,4.95H22.66A7.64,7.64,0,0,1,15.47,25.73Z"/><path d="M28.22,17.83a.8.8,0,0,0-.8-.8H24.66a9.26,9.26,0,0,0-9.19-8.2,9.36,9.36,0,0,0-2.38.32l.42,1.54a7.86,7.86,0,0,1,2-.26A7.66,7.66,0,0,1,23,17H20.92a.8.8,0,0,0,0,1.6h6.5A.8.8,0,0,0,28.22,17.83Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM12,17.16l1.54.42a1.64,1.64,0,0,0-.08.5,2,2,0,1,0,2-2,2.08,2.08,0,0,0-.5.07l-.41-1.54a3.84,3.84,0,0,1,.91-.13,3.59,3.59,0,1,1-3.59,3.59A3.53,3.53,0,0,1,12,17.16ZM5.31,8A1.25,1.25,0,1,1,4.06,9.25,1.25,1.25,0,0,1,5.31,8Zm0,20.06a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,5.31,28.06Zm10.16-.73A9.22,9.22,0,0,1,6.54,15.7l1.55.41a7.55,7.55,0,0,0-.27,2,7.64,7.64,0,0,0,14.84,2.57h1.68A9.25,9.25,0,0,1,15.47,27.33Zm12-8.7h-6.5a.8.8,0,0,1,0-1.6H23a7.66,7.66,0,0,0-7.57-6.6,7.86,7.86,0,0,0-2,.26l-.42-1.54a9.36,9.36,0,0,1,2.38-.32A9.26,9.26,0,0,1,24.66,17h2.76a.8.8,0,0,1,0,1.6Zm3.39,9.43a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,30.81,28.06Zm0-17.56a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,30.81,10.5Z"/>'
};
var hardDriveIconName = "hard-drive";
var hardDriveIcon = [hardDriveIconName, renderIcon(icon277)];

// node_modules/@clr/core/icon/shapes/hard-drive-disks.js
var icon278 = {
  outline: '<path d="M26,5.74A1.74,1.74,0,0,0,24.26,4H3.74A1.74,1.74,0,0,0,2,5.74V20.26A1.74,1.74,0,0,0,3.74,22H4V6H26Z"/><path d="M30,9.74A1.74,1.74,0,0,0,28.26,8H7.74A1.74,1.74,0,0,0,6,9.74V24.26A1.74,1.74,0,0,0,7.74,26H8V10H30Z"/><path d="M32.26,12H11.74A1.74,1.74,0,0,0,10,13.74V28.26A1.74,1.74,0,0,0,11.74,30H32.26A1.74,1.74,0,0,0,34,28.26V13.74A1.74,1.74,0,0,0,32.26,12ZM32,28H12V14H32Z"/><path d="M19.94,23.68a2.64,2.64,0,1,0-2.7-2.63A2.67,2.67,0,0,0,19.94,23.68Zm0-3.87a1.24,1.24,0,1,1-1.29,1.24A1.27,1.27,0,0,1,19.94,19.81Z"/><path d="M19.94,16.22a4.93,4.93,0,0,1,4.95,4.35H23.71V22h4.41a.7.7,0,0,0,0-1.4H26.31a6.33,6.33,0,0,0-6.37-5.75,6.58,6.58,0,0,0-1.48.17l.35,1.37A4.73,4.73,0,0,1,19.94,16.22Z"/><path d="M19.94,27.27a6.42,6.42,0,0,0,5.67-3.35H23.93a5,5,0,0,1-4,1.95,4.91,4.91,0,0,1-5-4.82,5.16,5.16,0,0,1,.08-.79L13.63,20a7,7,0,0,0-.09,1A6.32,6.32,0,0,0,19.94,27.27Z"/>',
  solid: '<path d="M26,5.74A1.74,1.74,0,0,0,24.26,4H3.74A1.74,1.74,0,0,0,2,5.74V20.26A1.74,1.74,0,0,0,3.74,22H4V6H26Z"/><path d="M30,9.74A1.74,1.74,0,0,0,28.26,8H7.74A1.74,1.74,0,0,0,6,9.74V24.26A1.74,1.74,0,0,0,7.74,26H8V10H30Z"/><path d="M19.62,22.6A1.55,1.55,0,1,0,18,21.05,1.6,1.6,0,0,0,19.62,22.6Z"/><path d="M32.26,12H11.74A1.74,1.74,0,0,0,10,13.74V28.26A1.74,1.74,0,0,0,11.74,30H32.26A1.74,1.74,0,0,0,34,28.26V13.74A1.74,1.74,0,0,0,32.26,12ZM19.62,17.74a3.31,3.31,0,1,1-3.38,3.31A3.35,3.35,0,0,1,19.62,17.74Zm0,11.13a7.94,7.94,0,0,1-8-7.82,7.83,7.83,0,0,1,.11-1.29l1.75.3a5.36,5.36,0,0,0-.11,1,6.18,6.18,0,0,0,6.28,6.06,6.35,6.35,0,0,0,5-2.46h2.1A8.06,8.06,0,0,1,19.62,28.87ZM29.89,22.2H24.36V20.44h1.48A6.19,6.19,0,0,0,19.62,15a6.48,6.48,0,0,0-1.41.16l-.45-1.7a8.16,8.16,0,0,1,1.86-.22,8,8,0,0,1,8,7.21h2.26a.88.88,0,0,1,0,1.76Z"/>'
};
var hardDriveDisksIconName = "hard-drive-disks";
var hardDriveDisksIcon = [hardDriveDisksIconName, renderIcon(icon278)];

// node_modules/@clr/core/icon/shapes/helix.js
var icon279 = {
  outline: '<path d="M8.88,13.07a.9.9,0,0,1-.49-1.66l8.93-5.73a.9.9,0,1,1,1,1.52L9.37,12.92A.9.9,0,0,1,8.88,13.07Z"/><path d="M13.25,15.11a.9.9,0,0,1-.49-1.66L18,10.08a.9.9,0,1,1,1,1.52L13.74,15A.9.9,0,0,1,13.25,15.11Z"/><path d="M19.72,30.23a.9.9,0,0,1-.49-1.66l8.93-5.73a.9.9,0,0,1,1,1.52L20.2,30.09A.9.9,0,0,1,19.72,30.23Z"/><path d="M18.92,25.94a.9.9,0,0,1-.49-1.66l5.25-3.37a.9.9,0,1,1,1,1.51L19.4,25.8A.89.89,0,0,1,18.92,25.94Z"/><path d="M21.56,5.69a3.59,3.59,0,0,1,.15,3.53L18.83,15h2.25l2.43-4.87a5.61,5.61,0,0,0-5-8.14H13.26l-1,2h6.22A3.61,3.61,0,0,1,21.56,5.69Z"/><path d="M32.91,20.78A5.53,5.53,0,0,0,27.66,17H9.31a3.54,3.54,0,0,1-3.56-3.67,3.61,3.61,0,0,1,.42-1.54l4.26-8.49a1,1,0,1,0-1.79-.9L4.4,10.84A5.67,5.67,0,0,0,4,15.22,5.53,5.53,0,0,0,9.28,19h7.6l-3.44,6.87a5.64,5.64,0,0,0,1.5,6.92A5.38,5.38,0,0,0,18.41,34h5.25l1-2H18.43a3.58,3.58,0,0,1-3.22-5.21L19.11,19h8.54a3.42,3.42,0,0,1,2.15.71,3.57,3.57,0,0,1,1,4.43l-4.12,8.22a1,1,0,1,0,1.79.9l4.06-8.1A5.67,5.67,0,0,0,32.91,20.78Z"/>',
  solid: '<path d="M32.16,19.63A5.55,5.55,0,0,0,27.42,17H10.06a4.36,4.36,0,0,1-3.67-2,4.07,4.07,0,0,1-.19-4.13l3.62-7,1.42,1.63-2.74,5.3,8.84-5.66a.91.91,0,0,1,1,1.53L7.84,13.38a2.13,2.13,0,0,0,.24.52,2.28,2.28,0,0,0,1.65,1L18.11,9.5a.91.91,0,0,1,1,1.52L13,14.94H20.8l2.41-4.82a5.6,5.6,0,0,0-5-8.12H9a1,1,0,0,0-.9.56L3.88,10.89a5.6,5.6,0,0,0,5,8.12h7.65l-3.43,6.87a5.6,5.6,0,0,0,5,8.12h9.28a1,1,0,0,0,.93-.65l4.14-8.24A5.58,5.58,0,0,0,32.16,19.63ZM17.75,25.57A.91.91,0,0,1,18,24.31l6-3.88A.91.91,0,1,1,25,22l-6,3.88a.91.91,0,0,1-1.26-.27ZM29,24.34l-9,5.78a.91.91,0,1,1-1-1.53l9-5.78a.91.91,0,1,1,1,1.53Z"/>'
};
var helixIconName = "helix";
var helixIcon = [helixIconName, renderIcon(icon279)];

// node_modules/@clr/core/icon/shapes/host.js
var icon280 = {
  outline: '<path d="M18,24.3a2.48,2.48,0,1,0,2.48,2.47A2.48,2.48,0,0,0,18,24.3Zm0,3.6a1.13,1.13,0,1,1,1.13-1.12A1.13,1.13,0,0,1,18,27.9Z"/><rect x="13.5" y="20.7" width="9" height="1.44"/><path d="M25.65,3.6H10.35A1.35,1.35,0,0,0,9,4.95V32.4H27V4.95A1.35,1.35,0,0,0,25.65,3.6Zm-.45,27H10.8V5.4H25.2Z"/><rect x="12.6" y="7.2" width="10.8" height="1.44"/><rect x="12.6" y="10.8" width="10.8" height="1.44"/>',
  outlineAlerted: '<path d="M15.2,27.8c0,1.5,1.2,2.8,2.8,2.8s2.8-1.2,2.8-2.8S19.5,25,18,25S15.2,26.2,15.2,27.8z M19.2,27.8c0,0.7-0.6,1.2-1.2,1.2s-1.2-0.6-1.2-1.2s0.6-1.2,1.2-1.2S19.2,27.1,19.2,27.8z"/><rect x="13" y="21" width="10" height="1.6"/><polygon points="21.3,6 12,6 12,7.6 20.4,7.6"/><path d="M12,11.6h6.6c0-0.6,0.2-1.1,0.4-1.6h-7V11.6z"/><path d="M26,15.4V32H10V4h12.5l1.1-2H9.5C8.7,2,8,2.7,8,3.5V34h20V15.4H26z"/>',
  outlineBadged: '<path d="M15.2,27.8c0,1.5,1.2,2.8,2.8,2.8s2.8-1.2,2.8-2.8S19.5,25,18,25S15.2,26.2,15.2,27.8z M19.2,27.8c0,0.7-0.6,1.2-1.2,1.2s-1.2-0.6-1.2-1.2s0.6-1.2,1.2-1.2S19.2,27.1,19.2,27.8z"/><rect x="13" y="21" width="10" height="1.6"/><path d="M24,10.5c-0.1-0.2-0.2-0.3-0.3-0.5H12v1.6h12V10.5z"/><path d="M12,6v1.6h10.7c-0.1-0.5-0.2-1.1-0.2-1.6H12z"/><path d="M26,12.3V32H10V4h12.8c0.2-0.7,0.5-1.4,0.9-2H9.5C8.7,2,8,2.7,8,3.5V34h20V13.2C27.3,13,26.6,12.7,26,12.3z"/>',
  solid: '<path d="M26.5,2h-17C8.7,2,8,2.7,8,3.5V34h20V3.5C28,2.7,27.3,2,26.5,2z M18,30.5c-1.5,0-2.8-1.2-2.8-2.8S16.5,25,18,25s2.8,1.2,2.8,2.8S19.5,30.5,18,30.5z M23,22.6H13V21h10V22.6z M24,11.6H12V10h12V11.6z M24,7.6H12V6h12V7.6z"/><circle cx="18" cy="27.8" r="1.2"/>',
  solidAlerted: '<path d="M22.2,15.3c-2,0-3.7-1.6-3.7-3.7H12V10h6.9c0-0.1,0.1-0.2,0.1-0.2l1.2-2.2H12V6h9.2l2.3-4h-14C8.7,2,8,2.7,8,3.5V34h20V15.3H22.2z M18,30.5c-1.5,0-2.8-1.2-2.8-2.8S16.5,25,18,25s2.8,1.2,2.8,2.8S19.5,30.5,18,30.5z M23,22.6H13V21h10V22.6z"/><circle cx="18" cy="27.8" r="1.2"/>',
  solidBadged: '<path d="M24,10.3v1.2H12V10h11.8c-0.5-0.7-0.8-1.5-1-2.4H12V6h10.5c0,0,0-0.1,0-0.1c0-1.4,0.4-2.7,1.1-3.9H9.5C8.7,2,8,2.7,8,3.5V34h20V13.1C26.4,12.6,25,11.7,24,10.3z M18,30.5c-1.5,0-2.8-1.2-2.8-2.8S16.5,25,18,25s2.8,1.2,2.8,2.8S19.5,30.5,18,30.5zM23,22.6H13V21h10V22.6z"/><circle cx="18" cy="27.8" r="1.2"/>'
};
var hostIconName = "host";
var hostIcon = [hostIconName, renderIcon(icon280)];

// node_modules/@clr/core/icon/shapes/host-group.js
var icon281 = {
  outline: '<path d="M21.08,34h-14A1.08,1.08,0,0,1,6,33V12a1.08,1.08,0,0,1,1.08-1.08h14A1.08,1.08,0,0,1,22.16,12V33A1.08,1.08,0,0,1,21.08,34ZM8.16,31.88H20V13H8.16Z"/><rect x="10.08" y="14.96" width="8" height="2"/><path d="M26.1,27.81h-2V9h-12V7h13a1,1,0,0,1,1,1Z"/><path d="M30.08,23h-2V5h-11V3h12a1,1,0,0,1,1,1Z"/><rect x="13.08" y="27.88" width="2" height="2.16"/>',
  solid: '<path d="M15.08,31 L1.08,31 C0.513427197,31.0015564 0.0419663765,30.5650186 0,30 L0,9 C0,8.40353247 0.48353247,7.92 1.08,7.92 L15.08,7.92 C15.6764675,7.92 16.16,8.40353247 16.16,9 L16.16,30 C16.1180336,30.5650186 15.6465728,31.0015564 15.08,31 Z M4.08,11.96 L4.08,13.96 L12.08,13.96 L12.08,11.96 L4.08,11.96 Z M7.08,24.88 L7.08,27.04 L9.08,27.04 L9.08,24.88 L7.08,24.88 Z"/><path d="M20.1,24.81 L18.1,24.81 L18.1,6 L6.1,6 L6.1,4 L19.1,4 C19.6522847,4 20.1,4.44771525 20.1,5 L20.1,24.81 Z"/><path d="M24.08,20 L22.08,20 L22.08,2 L11.08,2 L11.08,0 L23.08,0 C23.6322847,0 24.08,0.44771525 24.08,1 L24.08,20 Z"/>'
};
var hostGroupIconName = "host-group";
var hostGroupIcon = [hostGroupIconName, renderIcon(icon281)];

// node_modules/@clr/core/icon/shapes/import.js
var icon282 = {
  outline: '<path d="M28,4H14.87L8,10.86V15h2V13.61h7.61V6H28V30H8a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V6A2,2,0,0,0,28,4ZM16,12H10v-.32L15.7,6H16Z"/><path d="M11.94,26.28a1,1,0,1,0,1.41,1.41L19,22l-5.68-5.68a1,1,0,0,0-1.41,1.41L15.2,21H3a1,1,0,1,0,0,2H15.23Z"/>',
  outlineAlerted: '<path d="M11.94,26.28a1,1,0,1,0,1.41,1.41L19,22l-5.68-5.68a1,1,0,0,0-1.41,1.41L15.2,21H3a1,1,0,1,0,0,2H15.23Z"/><path d="M28,15.4V30H8a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V15.4Z"/><path d="M10,13.61h7.61V6h3.68l1.15-2H14.87L8,10.86V15h2Zm0-1.92L15.7,6H16v6H10Z"/>',
  outlineBadged: '<path d="M11.94,26.28a1,1,0,1,0,1.41,1.41L19,22l-5.68-5.68a1,1,0,0,0-1.41,1.41L15.2,21H3a1,1,0,1,0,0,2H15.23Z"/><path d="M28,13.22V30H8a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.49,7.49,0,0,1,28,13.22Z"/><path d="M10,13.61h7.61V6H22.5a7.49,7.49,0,0,1,.28-2H14.87L8,10.86V15h2Zm0-1.92L15.7,6H16v6H10Z"/>',
  solid: '<path d="M3,21a1,1,0,1,0,0,2H8V21Z"/><path d="M28,4H14.87L8,10.86V21H15.2l-3.25-3.25a1,1,0,0,1,1.41-1.41L19,22l-5.68,5.68a1,1,0,0,1-1.41-1.41L15.23,23H8v7a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V6A2,2,0,0,0,28,4ZM16,12H10v-.32L15.69,6H16Z"/>',
  solidAlerted: '<path d="M3,21a1,1,0,1,0,0,2H8V21Z"/><path d="M22.23,15.4A3.68,3.68,0,0,1,19,9.89L22.45,4H14.87L8,10.86V21H15.2l-3.25-3.25a1,1,0,0,1,1.41-1.41L19,22l-5.68,5.68a1,1,0,0,1-1.41-1.41L15.23,23H8v7a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V15.4ZM16,12H10v-.32L15.69,6H16Z"/>',
  solidBadged: '<path d="M3,21a1,1,0,1,0,0,2H8V21Z"/><path d="M22.5,6a7.49,7.49,0,0,1,.28-2H14.87L8,10.86V21H15.2l-3.25-3.25a1,1,0,0,1,1.41-1.41L19,22l-5.68,5.68a1,1,0,0,1-1.41-1.41L15.23,23H8v7a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.5,7.5,0,0,1,22.5,6ZM16,12H10v-.32L15.69,6H16Z"/>'
};
var importIconName = "import";
var importIcon = [importIconName, renderIcon(icon282)];

// node_modules/@clr/core/icon/shapes/inductor.js
var icon283 = {
  outline: '<path d="M24.31,25.81c-1.75,0-3-2.49-3-6a12.79,12.79,0,0,1,1.72-6.7,2.57,2.57,0,0,0-3.79,0A12.79,12.79,0,0,1,21,19.76c0,3.56-1.23,6-3,6s-3-2.49-3-6a12.79,12.79,0,0,1,1.72-6.7,2.57,2.57,0,0,0-3.79,0,12.79,12.79,0,0,1,1.72,6.7c0,3.56-1.23,6-3,6s-3-2.49-3-6a12.88,12.88,0,0,1,1.71-6.7,2.7,2.7,0,0,0-1.89-.87C7.1,12.19,5.69,13.7,5,16l-.23.7H2a1,1,0,0,1,0-2H3.29c1.1-2.83,3.06-4.55,5.24-4.55a4.67,4.67,0,0,1,3.16,1.32,4.62,4.62,0,0,1,3.15-1.32A4.65,4.65,0,0,1,18,11.51a4.43,4.43,0,0,1,6.31,0,4.67,4.67,0,0,1,3.16-1.32c2.18,0,4.14,1.72,5.24,4.55H34a1,1,0,0,1,0,2H31.28l-.23-.7c-.74-2.34-2.15-3.85-3.58-3.85a2.7,2.7,0,0,0-1.89.87,12.88,12.88,0,0,1,1.71,6.7C27.29,23.32,26.07,25.81,24.31,25.81ZM18,14.93a11.71,11.71,0,0,0-1,4.83c0,2.54.66,3.75,1,4,.32-.27,1-1.48,1-4A11.71,11.71,0,0,0,18,14.93Zm6.31,0a11.71,11.71,0,0,0-1,4.83c0,2.54.66,3.75,1,4,.32-.27,1-1.48,1-4A11.71,11.71,0,0,0,24.31,14.93Zm-12.62,0a11.71,11.71,0,0,0-1,4.83c0,2.54.66,3.75,1,4,.32-.27,1-1.48,1-4A11.71,11.71,0,0,0,11.69,14.93Z"/>'
};
var inductorIconName = "inductor";
var inductorIcon = [inductorIconName, renderIcon(icon283)];

// node_modules/@clr/core/icon/shapes/install.js
var icon284 = {
  outline: '<path d="M30.92,8H26.55a1,1,0,0,0,0,2H31V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V10A2,2,0,0,0,30.92,8Z"/><path d="M10.3,18.87l7,6.89a1,1,0,0,0,1.4,0l7-6.89a1,1,0,0,0-1.4-1.43L19,22.65V4a1,1,0,0,0-2,0V22.65l-5.3-5.21a1,1,0,0,0-1.4,1.43Z"/>',
  outlineAlerted: '<path d="M10.3,18.87l7,6.89a1,1,0,0,0,1.4,0l7-6.89a1,1,0,0,0-1.4-1.43L19,22.65V4a1,1,0,0,0-2,0V22.65l-5.3-5.21a1,1,0,0,0-1.4,1.43Z"/><path d="M31,15.4V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V15.4Z"/>',
  outlineBadged: '<path d="M10.3,18.87l7,6.89a1,1,0,0,0,1.4,0l7-6.89a1,1,0,0,0-1.4-1.43L19,22.65V4a1,1,0,0,0-2,0V22.65l-5.3-5.21a1,1,0,0,0-1.4,1.43Z"/><path d="M31,13.43V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V12.87A7.45,7.45,0,0,1,31,13.43Z"/>'
};
var installIconName = "install";
var installIcon = [installIconName, renderIcon(icon284)];

// node_modules/@clr/core/icon/shapes/keyboard.js
var icon285 = {
  outline: '<path d="M32,8H4a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8Zm0,18H4V10H32Z"/><rect x="7" y="13" width="2" height="2"/><rect x="11" y="13" width="2" height="2"/><rect x="15" y="13" width="2" height="2"/><rect x="19" y="13" width="2" height="2"/><rect x="23" y="13" width="2" height="2"/><rect x="27" y="13" width="2" height="2"/><rect x="7" y="17" width="2" height="2"/><rect x="11" y="17" width="2" height="2"/><rect  x="15" y="17" width="2" height="2"/><rect  x="19" y="17" width="2" height="2"/><rect  x="23" y="17" width="2" height="2"/><rect  x="27" y="17" width="2" height="2"/><rect  x="27" y="22" width="1.94" height="2"/><rect  x="7" y="22" width="2" height="2"/><rect  x="11.13" y="22" width="13.75" height="2"/>',
  solid: '<path d="M32,8H4a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8ZM19,13h2v2H19Zm0,4h2v2H19Zm-4-4h2v2H15Zm0,4h2v2H15Zm-4-4h2v2H11ZM9,24H7V22H9Zm0-5H7V17H9Zm0-4H7V13H9Zm2,2h2v2H11Zm13.88,7H11.13V22H24.88ZM25,19H23V17h2Zm0-4H23V13h2Zm3.94,9H27V22h1.94ZM29,19H27V17h2Zm0-4H27V13h2Z"/>'
};
var keyboardIconName = "keyboard";
var keyboardIcon = [keyboardIconName, renderIcon(icon285)];

// node_modules/@clr/core/icon/shapes/layers.js
var icon286 = {
  outline: '<path d="M18,20.25a1,1,0,0,1-.43-.1l-15-7.09a1,1,0,0,1,0-1.81l15-7.09a1,1,0,0,1,.85,0l15,7.09a1,1,0,0,1,0,1.81l-15,7.09A1,1,0,0,1,18,20.25ZM5.34,12.16l12.66,6,12.66-6L18,6.18Z"/><path d="M18,26.16a1,1,0,0,1-.43-.1L2.57,19a1,1,0,1,1,.85-1.81L18,24.06l14.57-6.89A1,1,0,1,1,33.43,19l-15,7.09A1,1,0,0,1,18,26.16Z"/><path d="M18,32.07a1,1,0,0,1-.43-.1l-15-7.09a1,1,0,0,1,.85-1.81L18,30l14.57-6.89a1,1,0,1,1,.85,1.81L18.43,32A1,1,0,0,1,18,32.07Z"/>',
  solid: '<path d="M18,20.25a1,1,0,0,1-.43-.1l-15-7.09a1,1,0,0,1,0-1.81l15-7.09a1,1,0,0,1,.85,0l15,7.09a1,1,0,0,1,0,1.81l-15,7.09A1,1,0,0,1,18,20.25Z"/><path d="M18,26.16a1,1,0,0,1-.43-.1L2.57,19a1,1,0,1,1,.85-1.81L18,24.06l14.57-6.89A1,1,0,1,1,33.43,19l-15,7.09A1,1,0,0,1,18,26.16Z"/><path d="M18,32.07a1,1,0,0,1-.43-.1l-15-7.09a1,1,0,0,1,.85-1.81L18,30l14.57-6.89a1,1,0,1,1,.85,1.81L18.43,32A1,1,0,0,1,18,32.07Z"/>'
};
var layersIconName = "layers";
var layersIcon = [layersIconName, renderIcon(icon286)];

// node_modules/@clr/core/icon/shapes/link.js
var icon287 = {
  outline: '<path d="M17.6,24.32l-2.46,2.44a4,4,0,0,1-5.62,0,3.92,3.92,0,0,1,0-5.55l4.69-4.65a4,4,0,0,1,5.62,0,3.86,3.86,0,0,1,1,1.71A2,2,0,0,0,21.1,18l1.29-1.28a5.89,5.89,0,0,0-1.15-1.62,6,6,0,0,0-8.44,0L8.1,19.79a5.91,5.91,0,0,0,0,8.39,6,6,0,0,0,8.44,0l3.65-3.62c-.17,0-.33,0-.5,0A8,8,0,0,1,17.6,24.32Z"/><path d="M28.61,7.82a6,6,0,0,0-8.44,0l-3.65,3.62c.17,0,.33,0,.49,0h0a8,8,0,0,1,2.1.28l2.46-2.44a4,4,0,0,1,5.62,0,3.92,3.92,0,0,1,0,5.55l-4.69,4.65a4,4,0,0,1-5.62,0,3.86,3.86,0,0,1-1-1.71,2,2,0,0,0-.28.23l-1.29,1.28a5.89,5.89,0,0,0,1.15,1.62,6,6,0,0,0,8.44,0l4.69-4.65a5.92,5.92,0,0,0,0-8.39Z"/>'
};
var linkIconName = "link";
var linkIcon = [linkIconName, renderIcon(icon287)];

// node_modules/@clr/core/icon/shapes/media-changer.js
var icon288 = {
  outline: '<path d="M30,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H7.88v1.57a1,1,0,0,0,2,0V32h16v1.57a1,1,0,0,0,2,0V32H30a2,2,0,0,0,2-2V6A2,2,0,0,0,30,4ZM6,30V6H30V30Z"/><rect x="20" y="18" width="2" height="2"/><rect x="24" y="18" width="2" height="2"/><rect x="20" y="22" width="2" height="2"/><rect x="24" y="22" width="2" height="2"/><path d="M27.22,10H20v4a.8.8,0,1,0,1.59,0V11.6h5.63a.8.8,0,1,0,0-1.6Z"/><rect x="8.81" y="10" width="8.14" height="2"/><rect x="8.81" y="14" width="8.14" height="2"/><rect x="8.81" y="18" width="8.14" height="2"/><rect x="8.81" y="22" width="8.14" height="2"/><rect x="8.81" y="26" width="8.14" height="2"/>',
  outlineAlerted: '<rect x="20" y="18" width="2" height="2"/><rect x="24" y="18" width="2" height="2"/><rect x="20" y="22" width="2" height="2"/><rect x="24" y="22" width="2" height="2"/><rect x="8.81" y="10" width="8.14" height="2"/><rect x="8.81" y="14" width="8.14" height="2"/><rect x="8.81" y="18" width="8.14" height="2"/><rect x="8.81" y="22" width="8.14" height="2"/><rect x="8.81" y="26" width="8.14" height="2"/><path d="M30,15.4V30H6V6H21.27l1.18-2H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H7.88v1.57a1,1,0,0,0,2,0V32h16v1.57a1,1,0,0,0,2,0V32H30a2,2,0,0,0,2-2V15.4Z"/>',
  outlineBadged: '<rect x="20" y="18" width="2" height="2"/><rect x="24" y="18" width="2" height="2"/><rect x="20" y="22" width="2" height="2"/><rect x="24" y="22" width="2" height="2"/><rect x="8.81" y="10" width="8.14" height="2"/><rect x="8.81" y="14" width="8.14" height="2"/><rect x="8.81" y="18" width="8.14" height="2"/><rect x="8.81" y="22" width="8.14" height="2"/><rect x="8.81" y="26" width="8.14" height="2"/><path d="M20,14a.8.8,0,1,0,1.59,0V11.6H25A7.74,7.74,0,0,1,23.66,10H20Z"/><path d="M30,13.5h0V30H6V6H22.5V6a7.37,7.37,0,0,1,.28-2H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H7.88v1.57a1,1,0,0,0,2,0V32h16v1.57a1,1,0,0,0,2,0V32H30a2,2,0,0,0,2-2V13.22A7.37,7.37,0,0,1,30,13.5Z"/>',
  solid: '<path d="M30,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H7.88v1.57a1,1,0,0,0,2,0V32h16v1.57a1,1,0,0,0,2,0V32H30a2,2,0,0,0,2-2V6A2,2,0,0,0,30,4ZM17,28H8.81V26H17Zm0-4H8.81V22H17Zm0-4H8.81V18H17Zm0-4H8.81V14H17Zm0-4H8.81V10H17ZM22,24H20V22h2Zm0-4H20V18h2Zm4,4H24V22h2Zm0-4H24V18h2Zm0-6H20V10h6Z"/>',
  solidAlerted: '<path d="M22.23,15.4a3.68,3.68,0,0,1-3.18-5.51L22.45,4H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H7.88v1.57a1,1,0,0,0,2,0V32h16v1.57a1,1,0,0,0,2,0V32H30a2,2,0,0,0,2-2V15.4ZM17,28H8.81V26H17Zm0-4H8.81V22H17Zm0-4H8.81V18H17Zm0-4H8.81V14H17Zm0-4H8.81V10H17ZM22,24H20V22h2Zm0-4H20V18h2Zm4,4H24V22h2Zm0-4H24V18h2Z"/>',
  solidBadged: '<path d="M30,13.5a7.49,7.49,0,0,1-4-1.16V14H20V10h3.66A7.49,7.49,0,0,1,22.5,6a7.37,7.37,0,0,1,.28-2H6A2,2,0,0,0,4,6V30a2,2,0,0,0,2,2H7.88v1.57a1,1,0,0,0,2,0V32h16v1.57a1,1,0,0,0,2,0V32H30a2,2,0,0,0,2-2V13.22A7.37,7.37,0,0,1,30,13.5ZM17,28H8.81V26H17Zm0-4H8.81V22H17Zm0-4H8.81V18H17Zm0-4H8.81V14H17Zm0-4H8.81V10H17ZM22,24H20V22h2Zm0-4H20V18h2Zm4,4H24V22h2Zm0-4H24V18h2Z"/>'
};
var mediaChangerIconName = "media-changer";
var mediaChangerIcon = [mediaChangerIconName, renderIcon(icon288)];

// node_modules/@clr/core/icon/shapes/memory.js
var icon289 = {
  outline: '<rect x="8" y="12" width="4" height="8"/><rect x="16" y="12" width="4" height="8"/><rect x="24" y="12" width="4" height="8"/><path d="M15,27H4V17H2V27a2,2,0,0,0,2,2H16.61V25.55h2.26V24H15Z"/><path d="M32,7H4A2,2,0,0,0,2,9v4H4V9H32v4h2V9A2,2,0,0,0,32,7Z"/><path d="M32,27H19v2H32a2,2,0,0,0,2-2V17H32Z"/>',
  outlineAlerted: '<rect x="8" y="12" width="4" height="8"/><path d="M15,27H4V17H2V27a2,2,0,0,0,2,2H16.61V25.55h2.26V24H15Z"/><path d="M32,17V27H19v2H32a2,2,0,0,0,2-2V17Z"/><path d="M19,13.56A3.66,3.66,0,0,1,18.57,12H16v8h4V14.64A3.67,3.67,0,0,1,19,13.56Z"/><rect x="24" y="15.4" width="4" height="4.6"/><path d="M4,9H19.56l1.15-2H4A2,2,0,0,0,2,9v4H4Z"/>',
  outlineBadged: '<rect x="8" y="12" width="4" height="8"/><rect x="16" y="12" width="4" height="8"/><path d="M15,27H4V17H2V27a2,2,0,0,0,2,2H16.61V25.55h2.26V24H15Z"/><path d="M32,17V27H19v2H32a2,2,0,0,0,2-2V17Z"/><path d="M28,13.22A7.46,7.46,0,0,1,25.51,12H24v8h4Z"/><path d="M4,9H23.13a7.45,7.45,0,0,1-.55-2H4A2,2,0,0,0,2,9v4H4Z"/>',
  solid: '<path d="M34,13V9a2,2,0,0,0-2-2H4A2,2,0,0,0,2,9v4H4v4H2V27a2,2,0,0,0,2,2H16.61V25.55H19V29H32a2,2,0,0,0,2-2V17H32V13ZM12,20H8V12h4Zm8,0H16V12h4Zm8,0H24V12h4Z"/>',
  solidAlerted: '<path d="M32,17V15.07H28V20H24V15.07H22.23A3.68,3.68,0,0,1,20,14.31V20H16V12h2.61A3.68,3.68,0,0,1,19,9.55L20.52,7H4A2,2,0,0,0,2,9v4H4v4H2V27a2,2,0,0,0,2,2H16.61V25.55H19V29H32a2,2,0,0,0,2-2V17ZM12,20H8V12h4Z"/>',
  solidBadged: '<path d="M32,17V13.22a7.33,7.33,0,0,1-4,0V20H24V12h1.51a7.48,7.48,0,0,1-2.94-5H4A2,2,0,0,0,2,9v4H4v4H2V27a2,2,0,0,0,2,2H16.61V25.55H19V29H32a2,2,0,0,0,2-2V17ZM12,20H8V12h4Zm8,0H16V12h4Z"/>'
};
var memoryIconName = "memory";
var memoryIcon = [memoryIconName, renderIcon(icon289)];

// node_modules/@clr/core/icon/shapes/mobile.js
var icon290 = {
  outline: '<path d="M25,4H11A2,2,0,0,0,9,6V30a2,2,0,0,0,2,2H25a2,2,0,0,0,2-2V6A2,2,0,0,0,25,4ZM11,6H25V24H11Zm0,24V26H25v4Z"/><rect x="17" y="27" width="2" height="2"/>',
  solid: '<path d="M25,4H11A2,2,0,0,0,9,6V30a2,2,0,0,0,2,2H25a2,2,0,0,0,2-2V6A2,2,0,0,0,25,4ZM19,30H17V28h2Zm-8-4V6H25V26Z"/>'
};
var mobileIconName = "mobile";
var mobileIcon = [mobileIconName, renderIcon(icon290)];

// node_modules/@clr/core/icon/shapes/mouse.js
var icon291 = {
  outline: '<path d="M18,34A10,10,0,0,1,8,24V12a10,10,0,0,1,20,0V24A10,10,0,0,1,18,34ZM18,4a8,8,0,0,0-8,8V24a8,8,0,0,0,16,0V12A8,8,0,0,0,18,4Z"/><path d="M18,15a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0v4A1,1,0,0,1,18,15Z"/>',
  solid: '<path d="M18,2A10,10,0,0,0,8,12V24a10,10,0,0,0,20,0V12A10,10,0,0,0,18,2Zm1.3,11.44a1.3,1.3,0,0,1-2.6,0V10a1.3,1.3,0,0,1,2.6,0Z"/>'
};
var mouseIconName = "mouse";
var mouseIcon = [mouseIconName, renderIcon(icon291)];

// node_modules/@clr/core/icon/shapes/namespace.js
var icon292 = {
  outline: '<path d="M27,4.18a1,1,0,1,0-1,1.73l6,3.47V26.62l-6,3.47a1,1,0,0,0-.37,1.36,1,1,0,0,0,1.37.37l7-4.05V8.23Z"/><path d="M9.68,29.9,4,26.62V9.38L9.68,6.1a1,1,0,1,0-1-1.73L2,8.23V27.77l6.68,3.86a1,1,0,0,0,1.37-.37A1,1,0,0,0,9.68,29.9Z"/><path d="M10,12V24a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2H12A2,2,0,0,0,10,12Zm7,0v5H12V12Zm-5,7h5v5H12Zm7,5V19h5v5Zm5-7H19V12h5Z"/>'
};
var namespaceIconName = "namespace";
var namespaceIcon = [namespaceIconName, renderIcon(icon292)];

// node_modules/@clr/core/icon/shapes/network-globe.js
var icon293 = {
  outline: '<path d="M26.58,32h-18a1,1,0,1,0,0,2h18a1,1,0,0,0,0-2Z"/><path d="M17.75,2a14,14,0,0,0-14,14c0,.45,0,.89.07,1.33l0,0h0A14,14,0,1,0,17.75,2Zm0,2a12,12,0,0,1,8.44,3.48c0,.33,0,.66,0,1A18.51,18.51,0,0,0,14,8.53a2.33,2.33,0,0,0-1.14-.61l-.25,0c-.12-.42-.23-.84-.32-1.27s-.14-.81-.19-1.22A11.92,11.92,0,0,1,17.75,4Zm-3,5.87A17,17,0,0,1,25.92,10a16.9,16.9,0,0,1-3.11,7,2.28,2.28,0,0,0-2.58.57c-.35-.2-.7-.4-1-.63a16,16,0,0,1-4.93-5.23,2.25,2.25,0,0,0,.47-1.77Zm-4-3.6c0,.21.06.43.1.64.09.44.21.87.33,1.3a2.28,2.28,0,0,0-1.1,2.25A18.32,18.32,0,0,0,5.9,14.22,12,12,0,0,1,10.76,6.27Zm0,15.71A2.34,2.34,0,0,0,9.2,23.74l-.64,0A11.94,11.94,0,0,1,5.8,16.92l.11-.19a16.9,16.9,0,0,1,4.81-4.89,2.31,2.31,0,0,0,2.28.63,17.53,17.53,0,0,0,5.35,5.65c.41.27.83.52,1.25.76A2.32,2.32,0,0,0,19.78,20a16.94,16.94,0,0,1-6.2,3.11A2.34,2.34,0,0,0,10.76,22Zm7,6a11.92,11.92,0,0,1-5.81-1.51l.28-.06a2.34,2.34,0,0,0,1.57-1.79,18.43,18.43,0,0,0,7-3.5,2.29,2.29,0,0,0,3-.62,17.41,17.41,0,0,0,4.32.56l.53,0A12,12,0,0,1,17.75,28Zm6.51-8.9a2.33,2.33,0,0,0-.33-1.19,18.4,18.4,0,0,0,3.39-7.37q.75.35,1.48.78a12,12,0,0,1,.42,8.2A16,16,0,0,1,24.27,19.11Z"/>',
  outlineAlerted: '<path d="M26.58,32h-18a1,1,0,1,0,0,2h18a1,1,0,0,0,0-2Z"/><path d="M31.73,15.4h-2c0,.2,0,.4,0,.61a12,12,0,0,1-.53,3.52,16,16,0,0,1-5-.41,2.33,2.33,0,0,0-.33-1.19,18.87,18.87,0,0,0,1.62-2.52H23.83a17.29,17.29,0,0,1-1,1.54,2.28,2.28,0,0,0-2.58.57c-.35-.2-.7-.4-1-.63a16,16,0,0,1-4.93-5.23,2.25,2.25,0,0,0,.47-1.77A17.08,17.08,0,0,1,19.56,9l.87-1.51a18.59,18.59,0,0,0-6.39,1,2.33,2.33,0,0,0-1.14-.61l-.25,0c-.12-.42-.23-.84-.32-1.27s-.14-.81-.19-1.22A11.88,11.88,0,0,1,22,4.79L23,3A14,14,0,0,0,3.75,16c0,.45,0,.89.07,1.33l0,0h0A14,14,0,0,0,31.76,16C31.76,15.8,31.74,15.6,31.73,15.4Zm-21-9.13c0,.21.06.43.1.64.09.44.21.87.33,1.3a2.28,2.28,0,0,0-1.1,2.25A18.32,18.32,0,0,0,5.9,14.22,12,12,0,0,1,10.76,6.27Zm0,15.71A2.34,2.34,0,0,0,9.2,23.74l-.64,0A11.94,11.94,0,0,1,5.8,16.92l.11-.19a16.9,16.9,0,0,1,4.81-4.89,2.31,2.31,0,0,0,2.28.63,17.53,17.53,0,0,0,5.35,5.65c.41.27.83.52,1.25.76A2.32,2.32,0,0,0,19.78,20a16.94,16.94,0,0,1-6.2,3.11A2.34,2.34,0,0,0,10.76,22Zm7,6a11.92,11.92,0,0,1-5.81-1.51l.28-.06a2.34,2.34,0,0,0,1.57-1.79,18.43,18.43,0,0,0,7-3.5,2.29,2.29,0,0,0,3-.62,17.41,17.41,0,0,0,4.32.56l.53,0A12,12,0,0,1,17.75,28Z"/>',
  outlineBadged: '<path d="M26.58,32h-18a1,1,0,1,0,0,2h18a1,1,0,0,0,0-2Z"/><path d="M31.5,13.35a7.54,7.54,0,0,1-1.5.15l-.51,0a11.91,11.91,0,0,1-.25,6,16,16,0,0,1-5-.41,2.33,2.33,0,0,0-.33-1.19,18.59,18.59,0,0,0,2.78-5.18,7.49,7.49,0,0,1-1.31-.82,17,17,0,0,1-2.61,5,2.28,2.28,0,0,0-2.58.57c-.35-.2-.7-.4-1-.63a16,16,0,0,1-4.93-5.23,2.25,2.25,0,0,0,.47-1.77,17,17,0,0,1,8.53-.62,7.43,7.43,0,0,1-.56-1.59A18.56,18.56,0,0,0,14,8.53a2.33,2.33,0,0,0-1.14-.61l-.25,0c-.12-.42-.23-.84-.32-1.27s-.14-.81-.19-1.22A11.92,11.92,0,0,1,22.57,5a7.45,7.45,0,0,1,.53-2A14,14,0,0,0,3.75,16c0,.45,0,.89.07,1.33l0,0h0a14,14,0,1,0,27.68-4ZM10.76,6.27c0,.21.06.43.1.64.09.44.21.87.33,1.3a2.28,2.28,0,0,0-1.1,2.25A18.32,18.32,0,0,0,5.9,14.22,12,12,0,0,1,10.76,6.27Zm0,15.71A2.34,2.34,0,0,0,9.2,23.74l-.64,0A11.94,11.94,0,0,1,5.8,16.92l.11-.19a16.9,16.9,0,0,1,4.81-4.89,2.31,2.31,0,0,0,2.28.63,17.53,17.53,0,0,0,5.35,5.65c.41.27.83.52,1.25.76A2.32,2.32,0,0,0,19.78,20a16.94,16.94,0,0,1-6.2,3.11A2.34,2.34,0,0,0,10.76,22Zm7,6a11.92,11.92,0,0,1-5.81-1.51l.28-.06a2.34,2.34,0,0,0,1.57-1.79,18.43,18.43,0,0,0,7-3.5,2.29,2.29,0,0,0,3-.62,17.41,17.41,0,0,0,4.32.56l.53,0A12,12,0,0,1,17.75,28Z"/>',
  solid: '<path d="M26.58,32h-18a1,1,0,1,0,0,2h18a1,1,0,0,0,0-2Z"/><path d="M14.72,9.87a2.25,2.25,0,0,1-.47,1.77,16,16,0,0,0,4.93,5.23c.34.23.69.43,1,.63a2.28,2.28,0,0,1,2.58-.57,16.9,16.9,0,0,0,3.11-7A17,17,0,0,0,14.72,9.87Z"/><path d="M17.75,2a14,14,0,0,0-14,14c0,.45,0,.89.07,1.33l0,0h0A14,14,0,1,0,17.75,2ZM28.1,21.09a17.41,17.41,0,0,1-4.32-.56,2.29,2.29,0,0,1-3,.62,18.43,18.43,0,0,1-7,3.5,2.34,2.34,0,0,1-1.57,1.79l-.29.06a11.93,11.93,0,0,1-3.39-2.8l.66,0a2.33,2.33,0,0,1,4.37-.58A16.94,16.94,0,0,0,19.78,20a2.32,2.32,0,0,1-.18-1.17c-.42-.24-.84-.49-1.25-.76A17.53,17.53,0,0,1,13,12.47a2.31,2.31,0,0,1-2.28-.63,27.31,27.31,0,0,0-5,4.74c0-.2,0-.39,0-.57a12,12,0,0,1,.14-1.73,18.75,18.75,0,0,1,4.2-3.8,2.28,2.28,0,0,1,1.1-2.25c-.12-.43-.24-.86-.33-1.3,0-.14,0-.29-.11-.64a12,12,0,0,1,1.37-.87c.1.59.14.9.21,1.21s.2.85.32,1.27l.25,0A2.33,2.33,0,0,1,14,8.53a18.51,18.51,0,0,1,12.11-.07c0-.32,0-.65,0-1h0a12,12,0,0,1,2.62,3.85h0q-.73-.43-1.48-.78a18.4,18.4,0,0,1-3.39,7.37,2.33,2.33,0,0,1,.33,1.19,22,22,0,0,0,5,.45,11.88,11.88,0,0,1-.61,1.53Z"/>',
  solidAlerted: '<path d="M26.58,32h-18a1,1,0,1,0,0,2h18a1,1,0,0,0,0-2Z"/><path d="M31.73,15.4H25.56a18.87,18.87,0,0,1-1.62,2.52,2.33,2.33,0,0,1,.33,1.19,22,22,0,0,0,5,.45,11.88,11.88,0,0,1-.61,1.53H28.1a17.41,17.41,0,0,1-4.32-.56,2.29,2.29,0,0,1-3,.62,18.43,18.43,0,0,1-7,3.5,2.34,2.34,0,0,1-1.57,1.79l-.29.06a11.93,11.93,0,0,1-3.39-2.8l.66,0a2.33,2.33,0,0,1,4.37-.58A16.94,16.94,0,0,0,19.78,20a2.32,2.32,0,0,1-.18-1.17c-.42-.24-.84-.49-1.25-.76A17.53,17.53,0,0,1,13,12.47a2.31,2.31,0,0,1-2.28-.63,27.31,27.31,0,0,0-5,4.74c0-.2,0-.39,0-.57a12,12,0,0,1,.14-1.73,18.75,18.75,0,0,1,4.2-3.8,2.28,2.28,0,0,1,1.1-2.25c-.12-.43-.24-.86-.33-1.3,0-.14,0-.29-.11-.64a12,12,0,0,1,1.37-.87c.1.59.14.9.21,1.21s.2.85.32,1.27l.25,0A2.33,2.33,0,0,1,14,8.53a18.59,18.59,0,0,1,6.39-1L23,3A14,14,0,0,0,3.75,16c0,.45,0,.89.07,1.33l0,0h0A14,14,0,0,0,31.76,16C31.76,15.8,31.74,15.6,31.73,15.4Z"/><path d="M14.26,11.64a16,16,0,0,0,4.93,5.23c.34.23.69.43,1,.63a2.28,2.28,0,0,1,2.58-.57,17.29,17.29,0,0,0,1-1.54h-1.6A3.68,3.68,0,0,1,19,9.89L19.56,9a17.08,17.08,0,0,0-4.84.88,2.25,2.25,0,0,1-.47,1.77Z"/>',
  solidBadged: '<path d="M26.58,32h-18a1,1,0,1,0,0,2h18a1,1,0,0,0,0-2Z"/><path d="M31.5,13.35a7.54,7.54,0,0,1-1.5.15,7.46,7.46,0,0,1-3.28-.76,18.59,18.59,0,0,1-2.78,5.18,2.33,2.33,0,0,1,.33,1.19,22,22,0,0,0,5,.45,11.88,11.88,0,0,1-.61,1.53H28.1a17.41,17.41,0,0,1-4.32-.56,2.29,2.29,0,0,1-3,.62,18.43,18.43,0,0,1-7,3.5,2.34,2.34,0,0,1-1.57,1.79l-.29.06a11.93,11.93,0,0,1-3.39-2.8l.66,0a2.33,2.33,0,0,1,4.37-.58A16.94,16.94,0,0,0,19.78,20a2.32,2.32,0,0,1-.18-1.17c-.42-.24-.84-.49-1.25-.76A17.53,17.53,0,0,1,13,12.47a2.31,2.31,0,0,1-2.28-.63,27.31,27.31,0,0,0-5,4.74c0-.2,0-.39,0-.57a12,12,0,0,1,.14-1.73,18.75,18.75,0,0,1,4.2-3.8,2.28,2.28,0,0,1,1.1-2.25c-.12-.43-.24-.86-.33-1.3,0-.14,0-.29-.11-.64a12,12,0,0,1,1.37-.87c.1.59.14.9.21,1.21s.2.85.32,1.27l.25,0A2.33,2.33,0,0,1,14,8.53a18.56,18.56,0,0,1,8.65-.87,7.45,7.45,0,0,1,.41-4.59A14,14,0,0,0,3.75,16c0,.45,0,.89.07,1.33l0,0h0a14,14,0,1,0,27.68-4Z"/><path d="M14.72,9.87a2.25,2.25,0,0,1-.47,1.77,16,16,0,0,0,4.93,5.23c.34.23.69.43,1,.63a2.28,2.28,0,0,1,2.58-.57,17,17,0,0,0,2.61-5,7.52,7.52,0,0,1-2.16-2.67A17,17,0,0,0,14.72,9.87Z"/>'
};
var networkGlobeIconName = "network-globe";
var networkGlobeIcon = [networkGlobeIconName, renderIcon(icon293)];

// node_modules/@clr/core/icon/shapes/network-settings.js
var icon294 = {
  outline: '<path d="M10.85,27.44a2.29,2.29,0,0,0,1.74-1.68c.54-.14,1.06-.32,1.59-.51v-1.2a2.77,2.77,0,0,1,.06-.51,17.44,17.44,0,0,1-1.82.62,2.28,2.28,0,0,0-4.28.63l-.45,0h0a11.93,11.93,0,0,1-2.88-7.27,17.79,17.79,0,0,1,5-4.72,2.23,2.23,0,0,0,2.29.56,18.52,18.52,0,0,0,4.47,5,2.74,2.74,0,0,1,.21-.24l.95-.91a16.9,16.9,0,0,1-4.35-4.79,2.27,2.27,0,0,0,.35-1.2c0-.07,0-.14,0-.22A17.69,17.69,0,0,1,25,11a17.49,17.49,0,0,1-1.15,3.34l.19,0h1.56a19,19,0,0,0,.91-2.72c.43.19.84.41,1.26.64a11.94,11.94,0,0,1,1,4.09l0,0A2.77,2.77,0,0,1,30,16a2.73,2.73,0,0,1,.68.1A14,14,0,1,0,16.08,31a2.72,2.72,0,0,1,0-2A11.93,11.93,0,0,1,10.85,27.44ZM16.76,5a12,12,0,0,1,8.61,3.66c0,.25,0,.51-.08.76a19.21,19.21,0,0,0-12.35.11A2.28,2.28,0,0,0,11.74,9a17,17,0,0,1-.61-2.53A11.92,11.92,0,0,1,16.76,5ZM9.66,7.36a18.72,18.72,0,0,0,.49,1.92,2.28,2.28,0,0,0-1.07,1.93s0,.1,0,.15A19.45,19.45,0,0,0,5,14.79,12,12,0,0,1,9.66,7.36Z"/><path d="M25,21.19A3.84,3.84,0,1,0,28.88,25,3.87,3.87,0,0,0,25,21.19Zm0,6.08A2.24,2.24,0,1,1,27.28,25,2.26,2.26,0,0,1,25,27.27Z"/><path d="M34.17,24.14a1.14,1.14,0,0,0-.7-1.1l-1.56-.46q-.11-.32-.26-.63l.72-1.33a1.14,1.14,0,0,0-.21-1.34l-1.34-1.32a1.14,1.14,0,0,0-1.34-.2l-1.34.71a7.28,7.28,0,0,0-.67-.28L27,16.71a1.14,1.14,0,0,0-1.08-.76H24a1.14,1.14,0,0,0-1.08.8l-.44,1.43a7.32,7.32,0,0,0-.68.28l-1.32-.7a1.14,1.14,0,0,0-1.33.19l-1.37,1.31a1.14,1.14,0,0,0-.21,1.35l.7,1.28q-.16.32-.28.65L16.58,23a1.13,1.13,0,0,0-.81,1.09v1.87A1.14,1.14,0,0,0,16.59,27l1.47.44q.12.32.28.64l-.72,1.35a1.14,1.14,0,0,0,.2,1.35l1.34,1.32a1.14,1.14,0,0,0,1.34.2l1.37-.72q.31.14.63.26l.44,1.47a1.14,1.14,0,0,0,1.09.8h1.9A1.14,1.14,0,0,0,27,33.31l.44-1.47c.21-.07.42-.16.62-.25l1.38.73a1.14,1.14,0,0,0,1.33-.2l1.34-1.32a1.14,1.14,0,0,0,.21-1.35l-.73-1.34q.14-.3.25-.6l1.5-.44A1.13,1.13,0,0,0,34.17,26Zm-1.6,1.5-2,.58-.12.42A5.55,5.55,0,0,1,30,27.73l-.21.38,1,1.79-.86.84-1.82-1-.37.2a5.78,5.78,0,0,1-1.12.46l-.42.12-.59,2H24.38l-.59-1.95-.42-.12A5.86,5.86,0,0,1,22.24,30l-.37-.2-1.81,1-.86-.85,1-1.82-.22-.38a5.6,5.6,0,0,1-.49-1.13l-.13-.41-1.95-.58V24.42l1.94-.58.12-.41a5.53,5.53,0,0,1,.49-1.14l.22-.39-1-1.73.87-.84,1.77.94.38-.21a5.8,5.8,0,0,1,1.17-.49l.41-.12.59-1.91h1.23l.58,1.9.41.12a5.79,5.79,0,0,1,1.16.48l.38.21,1.8-.95.86.85-1,1.77.21.38a5.53,5.53,0,0,1,.47,1.13l.12.42,1.93.57Z"/>',
  solid: '<path d="M34,23.63,32,23a7.06,7.06,0,0,0-.58-1.41l1-1.86a.37.37,0,0,0-.07-.44L30.9,17.86a.37.37,0,0,0-.44-.07l-1.85,1a7,7,0,0,0-1.43-.61l-.61-2a.37.37,0,0,0-.36-.25h-2a.37.37,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.61L20,17.8a.37.37,0,0,0-.44.07L18,19.31a.37.37,0,0,0-.07.44l1,1.82A7,7,0,0,0,18.35,23l-2,.61a.37.37,0,0,0-.26.35v2a.37.37,0,0,0,.26.35l2,.61A7,7,0,0,0,19,28.37l-1,1.9a.37.37,0,0,0,.07.44l1.45,1.45a.37.37,0,0,0,.44.07l1.87-1a7.06,7.06,0,0,0,1.39.57l.61,2a.37.37,0,0,0,.35.26h2a.37.37,0,0,0,.35-.26l.61-2a7,7,0,0,0,1.38-.57l1.89,1a.37.37,0,0,0,.44-.07l1.45-1.45a.37.37,0,0,0,.07-.44l-1-1.88A7,7,0,0,0,31.95,27l2-.61a.37.37,0,0,0,.26-.35V24A.37.37,0,0,0,34,23.63Zm-8.83,4.72A3.33,3.33,0,1,1,28.53,25,3.33,3.33,0,0,1,25.19,28.34Z"/><path d="M10.85,27.44a2.29,2.29,0,0,0,1.74-1.68,19.71,19.71,0,0,0,1.89-.6V23.95a2,2,0,0,1,.09-.55,17.42,17.42,0,0,1-2.17.78,2.28,2.28,0,0,0-4.28.63l-.45,0h0a11.93,11.93,0,0,1-2.88-7.27,17.79,17.79,0,0,1,5-4.72,2.23,2.23,0,0,0,2.29.56,18.52,18.52,0,0,0,4.65,5.09,1.93,1.93,0,0,1,.23-.32l.89-.87a16.89,16.89,0,0,1-4.49-4.89,2.27,2.27,0,0,0,.35-1.2c0-.07,0-.14,0-.22A17.69,17.69,0,0,1,25,11a17.49,17.49,0,0,1-1.15,3.35,1.94,1.94,0,0,1,.31-.05h1.45a19.06,19.06,0,0,0,.9-2.7c.43.19.84.41,1.26.64a11.93,11.93,0,0,1,1,4.63l1-.51a2,2,0,0,1,.92-.23h.08A14,14,0,1,0,16.44,31a1.94,1.94,0,0,1,.12-1.46l.28-.53h-.07A11.91,11.91,0,0,1,10.85,27.44ZM16.76,5a12,12,0,0,1,8.61,3.66c0,.25,0,.51-.08.76a19.21,19.21,0,0,0-12.35.11A2.28,2.28,0,0,0,11.74,9a17,17,0,0,1-.61-2.53A11.92,11.92,0,0,1,16.76,5ZM9.66,7.36a18.72,18.72,0,0,0,.49,1.92,2.28,2.28,0,0,0-1.07,1.93s0,.1,0,.15A19.45,19.45,0,0,0,5,14.79,12,12,0,0,1,9.66,7.36Z"/>'
};
var networkSettingsIconName = "network-settings";
var networkSettingsIcon = [networkSettingsIconName, renderIcon(icon294)];

// node_modules/@clr/core/icon/shapes/network-switch.js
var icon295 = {
  outline: '<path d="M33.91,18.47,30.78,8.41A2,2,0,0,0,28.87,7H7.13A2,2,0,0,0,5.22,8.41L2.09,18.48a2,2,0,0,0-.09.59V27a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.06A2,2,0,0,0,33.91,18.47ZM32,27H4V19.06L7.13,9H28.87L32,19.06Z"/><rect x="7.12" y="22" width="1.8" height="3"/><rect x="12.12" y="22" width="1.8" height="3"/><rect x="17.11" y="22" width="1.8" height="3"/><rect x="22.1" y="22" width="1.8" height="3"/><rect x="27.1" y="22" width="1.8" height="3"/><rect x="6.23" y="18" width="23.69" height="1.4"/>',
  outlineAlerted: '<rect x="7.12" y="22" width="1.8" height="3"/><rect x="12.12" y="22" width="1.8" height="3"/><rect x="17.11" y="22" width="1.8" height="3"/><rect x="22.1" y="22" width="1.8" height="3"/><rect x="27.1" y="22" width="1.8" height="3"/><rect x="6.23" y="18" width="23.69" height="1.4"/><path d="M33.91,18.47,33,15.4H30.86L32,19.06V27H4V19.06L7.13,9H19.56l1.15-2H7.13A2,2,0,0,0,5.22,8.41L2.09,18.48a2,2,0,0,0-.09.59V27a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.06A2,2,0,0,0,33.91,18.47Z"/>',
  outlineBadged: '<rect x="7.12" y="22" width="1.8" height="3"/><rect x="12.12" y="22" width="1.8" height="3"/><rect x="17.11" y="22" width="1.8" height="3"/><rect x="22.1" y="22" width="1.8" height="3"/><rect x="27.1" y="22" width="1.8" height="3"/><rect x="6.23" y="18" width="23.69" height="1.4"/><path d="M33.91,18.47l-1.65-5.32a7.49,7.49,0,0,1-2,.33L32,19.06V27H4V19.06L7.13,9h16a7.45,7.45,0,0,1-.55-2H7.13A2,2,0,0,0,5.22,8.41L2.09,18.48a2,2,0,0,0-.09.59V27a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.06A2,2,0,0,0,33.91,18.47Z"/>',
  solid: '<path d="M33.91,18.47,30.78,8.41A2,2,0,0,0,28.87,7H7.13A2,2,0,0,0,5.22,8.41L2.09,18.48a2,2,0,0,0-.09.59V27a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.06A2,2,0,0,0,33.91,18.47ZM8.92,25H7.12V22h1.8Zm5,0h-1.8V22h1.8Zm5,0h-1.8V22h1.8Zm5,0H22.1V22h1.8Zm5,0H27.1V22h1.8ZM31,19.4H5V18H31Z"/>',
  solidAlerted: '<path d="M33,15.4H22.23A3.68,3.68,0,0,1,19,9.89L20.71,7H7.13A2,2,0,0,0,5.22,8.41L2.09,18.48a2,2,0,0,0-.09.59V27a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.06a2,2,0,0,0-.09-.59ZM8.92,25H7.12V22h1.8Zm5,0h-1.8V22h1.8Zm5,0h-1.8V22h1.8Zm5,0H22.1V22h1.8Zm5,0H27.1V22h1.8ZM31,19.4H5V18H31Z"/>',
  solidBadged: '<path d="M32.26,13.15A7.49,7.49,0,0,1,22.57,7H7.13A2,2,0,0,0,5.22,8.41L2.09,18.48a2,2,0,0,0-.09.59V27a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V19.06a2,2,0,0,0-.09-.59ZM8.92,25H7.12V22h1.8Zm5,0h-1.8V22h1.8Zm5,0h-1.8V22h1.8Zm5,0H22.1V22h1.8Zm5,0H27.1V22h1.8ZM31,19.4H5V18H31Z"/>'
};
var networkSwitchIconName = "network-switch";
var networkSwitchIcon = [networkSwitchIconName, renderIcon(icon295)];

// node_modules/@clr/core/icon/shapes/no-wifi.js
var icon296 = {
  outline: '<path d="M18,24.42a4,4,0,1,0,4,4A4,4,0,0,0,18,24.42Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,18,30.42Z"/><path d="M26.21,21.85a1,1,0,0,0-.23-1.4,13.56,13.56,0,0,0-5-2.23l3.87,3.87A1,1,0,0,0,26.21,21.85Z"/><path d="M18.05,10.72a20.88,20.88,0,0,0-4.16.43l1.74,1.74a19,19,0,0,1,2.42-.17A18.76,18.76,0,0,1,28.64,16a1,1,0,0,0,1.12-1.65A20.75,20.75,0,0,0,18.05,10.72Z"/><path d="M33.55,8.2A28.11,28.11,0,0,0,8.11,5.36L9.69,6.93A26,26,0,0,1,32.45,9.87a1,1,0,0,0,1.1-1.67Z"/><path d="M1.84,4.75,4.27,7.18c-.62.34-1.23.7-1.83,1.1A1,1,0,1,0,3.56,9.94C4.26,9.47,5,9,5.74,8.65l3.87,3.87A20.59,20.59,0,0,0,6.23,14.4,1,1,0,0,0,7.36,16a18.82,18.82,0,0,1,3.77-2l4.16,4.16A13.51,13.51,0,0,0,10,20.55a1,1,0,0,0,1.18,1.61A11.52,11.52,0,0,1,17,20l10.8,10.8,1.41-1.41-26-26Z"/>',
  solid: '<circle cx="18" cy="29.54" r="3"/><path d="M29.18,17.71l.11-.17a1.51,1.51,0,0,0-.47-2.1A20.57,20.57,0,0,0,18,12.37c-.56,0-1.11,0-1.65.07l3.21,3.21a17.41,17.41,0,0,1,7.6,2.52A1.49,1.49,0,0,0,29.18,17.71Z"/><path d="M32.76,9.38A27.9,27.9,0,0,0,10.18,6.27L12.81,8.9A24.68,24.68,0,0,1,31.1,12.12a1.49,1.49,0,0,0,2-.46l.11-.17A1.51,1.51,0,0,0,32.76,9.38Z"/><path d="M3,4.75l3.1,3.1A27.28,27.28,0,0,0,3.18,9.42a1.51,1.51,0,0,0-.48,2.11l.11.17a1.49,1.49,0,0,0,2,.46,24.69,24.69,0,0,1,3.67-1.9l3.14,3.14a20.63,20.63,0,0,0-4.53,2.09,1.51,1.51,0,0,0-.46,2.1l.11.17a1.49,1.49,0,0,0,2,.46A17.46,17.46,0,0,1,14.25,16l3.6,3.6a13.39,13.39,0,0,0-6.79,1.93,1.5,1.5,0,0,0-.46,2.09l.1.16a1.52,1.52,0,0,0,2.06.44,10.2,10.2,0,0,1,9-.7L29,30.75l1.41-1.41-26-26Z"/>'
};
var noWifiIconName = "no-wifi";
var noWifiIcon = [noWifiIconName, renderIcon(icon296)];

// node_modules/@clr/core/icon/shapes/node.js
var icon297 = {
  outline: '<path d="M18,30.66,7,24.33V11.67L18,5.34l11,6.33V24.33ZM9,23.18l9,5.17,9-5.17V12.82L18,7.65,9,12.82Z"/>'
};
var nodeIconName = "node";
var nodeIcon = [nodeIconName, renderIcon(icon297)];

// node_modules/@clr/core/icon/shapes/node-group.js
var icon298 = {
  outline: '<path d="M33.53,21.58l-4.94-2.83V13.09a1,1,0,0,0-.51-.87L22.64,9.1a1,1,0,0,0-1,0L16.2,12.22a1,1,0,0,0-.51.87v5.66l-4.94,2.83a1,1,0,0,0-.5.87v6.24a1,1,0,0,0,.5.86l5.45,3.12a1,1,0,0,0,1,0l4.95-2.83,4.95,2.83a1,1,0,0,0,.5.14,1,1,0,0,0,.49-.14l5.45-3.12a1,1,0,0,0,.5-.86V22.45A1,1,0,0,0,33.53,21.58ZM22.14,11.12l4.45,2.55V19l-4.46,2.56-4.44-2.6V13.67ZM16.69,30.65l-4.44-2.54V23l4.68-2.68,4.4,2.57V28ZM32,28.11l-4.44,2.54L22.93,28V22.93l4.46-2.57L32,23Z"/><path d="M7,27.43a1,1,0,0,1-1-1V19.9A1,1,0,0,1,6.5,19l4.95-2.83V10.54a1,1,0,0,1,.5-.87l5.21-3a1,1,0,0,1,1.37.37,1,1,0,0,1-.38,1.37l-4.7,2.68v5.66a1,1,0,0,1-.51.87L8,20.48v5.95A1,1,0,0,1,7,27.43Z"/><path d="M3,25.05a1,1,0,0,1-1-1V17.53a1,1,0,0,1,.5-.86l5-2.84V8.17A1,1,0,0,1,8,7.31l5.25-3a1,1,0,0,1,1,1.74L9.45,8.75v5.66a1,1,0,0,1-.51.87L4,18.11v5.94A1,1,0,0,1,3,25.05Z"/>'
};
var nodeGroupIconName = "node-group";
var nodeGroupIcon = [nodeGroupIconName, renderIcon(icon298)];

// node_modules/@clr/core/icon/shapes/nodes.js
var icon299 = {
  outline: '<path d="M10.5,34.29,2,29.39V19.58l8.5-4.9,8.5,4.9v9.81ZM4,28.23,10.5,32,17,28.23V20.74L10.5,17,4,20.74Z"/><path d="M25.5,34.29,17,29.39V19.58l8.5-4.9,8.5,4.9v9.81ZM19,28.23,25.5,32,32,28.23V20.74L25.5,17,19,20.74Z"/><path d="M18,21.32l-8.5-4.9V6.61L18,1.71l8.5,4.9v9.81Zm-6.5-6.06L18,19l6.5-3.75V7.77L18,4,11.5,7.77Z"/>'
};
var nodesIconName = "nodes";
var nodesIcon = [nodesIconName, renderIcon(icon299)];

// node_modules/@clr/core/icon/shapes/nvme.js
var icon300 = {
  outline: '<path d="M27,22V14a2,2,0,0,0-2-2H11a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2H25A2,2,0,0,0,27,22ZM11,14H25v8H11Z"/><rect x="19" y="6" width="4" height="2"/><rect x="25.01" y="6" width="1.97" height="2"/><path d="M5.8,8H16.87V6h-11L7.78,4.08a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L2,7,6.37,11.4a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41Z"/><path d="M29.61,24.68a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L30.1,28H19v2H30.2l-2,2a1,1,0,0,0,0,1.41,1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29L34,29.05Z"/><rect x="13" y="28" width="4" height="2"/><rect x="9" y="28" width="1.97" height="2"/>'
};
var nvmeIconName = "nvme";
var nvmeIcon = [nvmeIconName, renderIcon(icon300)];

// node_modules/@clr/core/icon/shapes/phone-handset.js
var icon301 = {
  outline: '<path d="M27.73,35.44a4.72,4.72,0,0,1-1-.11,33.91,33.91,0,0,1-16.62-8.75,32.71,32.71,0,0,1-9-16.25A4.58,4.58,0,0,1,2.46,6.05l4-3.85A2,2,0,0,1,8,1.66a2,2,0,0,1,1.45.87l5,7.39a1.6,1.6,0,0,1-.11,1.9l-2.51,3a18.94,18.94,0,0,0,4.17,5.89h0a19.26,19.26,0,0,0,6.07,4.09l3.11-2.47a1.64,1.64,0,0,1,1.86-.12l7.55,4.88A2,2,0,0,1,35,30.2l-3.9,3.86A4.74,4.74,0,0,1,27.73,35.44ZM7.84,3.64l-4,3.85a2.54,2.54,0,0,0-.75,2.4,30.7,30.7,0,0,0,8.41,15.26,31.9,31.9,0,0,0,15.64,8.23,2.75,2.75,0,0,0,2.5-.74l3.9-3.86-7.29-4.71-3.34,2.66a1,1,0,0,1-.92.17,20.06,20.06,0,0,1-7.36-4.75h0a19.49,19.49,0,0,1-4.87-7.2A1,1,0,0,1,10,14l2.7-3.23Z"/>',
  solid: '<path d="M15.22,20.64a20.37,20.37,0,0,0,7.4,4.79l3.77-3a.67.67,0,0,1,.76,0l7,4.51a2,2,0,0,1,.33,3.18l-3.28,3.24a4,4,0,0,1-3.63,1.07,35.09,35.09,0,0,1-17.15-9A33.79,33.79,0,0,1,1.15,8.6a3.78,3.78,0,0,1,1.1-3.55l3.4-3.28a2,2,0,0,1,3.12.32L13.43,9a.63.63,0,0,1,0,.75l-3.07,3.69A19.75,19.75,0,0,0,15.22,20.64Z"/>'
};
var phoneHandsetIconName = "phone-handset";
var phoneHandsetIcon = [phoneHandsetIconName, renderIcon(icon301)];

// node_modules/@clr/core/icon/shapes/plugin.js
var icon302 = {
  outline: '<path d="M29.81,16H29V8.83a2,2,0,0,0-2-2H21A5.14,5.14,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Zm2.41,7A3,3,0,0,1,30,24H27v7.83H4V25H5a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,4.81,15H4V8.83h9V7a3,3,0,0,1,1-2.22A3,3,0,0,1,16.31,4,3.13,3.13,0,0,1,19,7.19V8.83h8V18h2.81A3.13,3.13,0,0,1,33,20.69,3,3,0,0,1,32.22,23Z"/>',
  outlineAlerted: '<path d="M29.81,16H29v-.6H27V18h2.81A3.13,3.13,0,0,1,33,20.69,3,3,0,0,1,32.22,23,3,3,0,0,1,30,24H27v7.83H4V25H5a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,4.81,15H4V8.83h9V7a3,3,0,0,1,1-2.22A3,3,0,0,1,16.31,4,3.13,3.13,0,0,1,19,7.19V8.83h.66L21,6.59A5.12,5.12,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Z"/>',
  outlineBadged: '<path d="M29.81,16H29V13.43a7.45,7.45,0,0,1-2-.55V18h2.81A3.13,3.13,0,0,1,33,20.69,3,3,0,0,1,32.22,23,3,3,0,0,1,30,24H27v7.83H4V25H5a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,4.81,15H4V8.83h9V7a3,3,0,0,1,1-2.22A3,3,0,0,1,16.31,4,3.13,3.13,0,0,1,19,7.19V8.83h4.06a7.44,7.44,0,0,1-.51-2H21A5.14,5.14,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Z"/>',
  solid: '<path d="M29.81,16H29V8.83a2,2,0,0,0-2-2H21A5.14,5.14,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Z"/>',
  solidAlerted: '<path d="M29.81,16H29v-.6H22.23A3.68,3.68,0,0,1,19,9.89L21,6.59A5.12,5.12,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Z"/>',
  solidBadged: '<path d="M29.81,16H29V13.43a7.5,7.5,0,0,1-6.45-6.59H21A5.14,5.14,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Z"/>'
};
var pluginIconName = "plugin";
var pluginIcon = [pluginIconName, renderIcon(icon302)];

// node_modules/@clr/core/icon/shapes/pod.js
var icon303 = {
  outline: '<path d="M26,32H10a6,6,0,0,1-6-6V10a6,6,0,0,1,6-6H26a6,6,0,0,1,6,6V26A6,6,0,0,1,26,32ZM10,6a4,4,0,0,0-4,4V26a4,4,0,0,0,4,4H26a4,4,0,0,0,4-4V10a4,4,0,0,0-4-4Z"/><path d="M26.56,15H15.44A1.43,1.43,0,0,0,14,16.44v8.12A1.43,1.43,0,0,0,15.44,26H26.56A1.43,1.43,0,0,0,28,24.56V16.44A1.43,1.43,0,0,0,26.56,15ZM26,24H16V17H26Z"/><path d="M12.4,19H10V12H20v1.4h2v-2A1.43,1.43,0,0,0,20.56,10H9.44A1.43,1.43,0,0,0,8,11.44v8.12A1.43,1.43,0,0,0,9.44,21h3Z"/>'
};
var podIconName = "pod";
var podIcon = [podIconName, renderIcon(icon303)];

// node_modules/@clr/core/icon/shapes/process-on-vm.js
var icon304 = {
  outline: '<path d="M33.49,26.28a1,1,0,0,0-1.2-.7l-2.49.67a14.23,14.23,0,0,0,2.4-6.75A14.48,14.48,0,0,0,27.37,7.35,1,1,0,0,0,26,7.44a1,1,0,0,0,.09,1.41,12.45,12.45,0,0,1,4.16,10.46,12.19,12.19,0,0,1-2,5.74L28,22.54a1,1,0,1,0-1.95.16l.5,6.44,6.25-1.66A1,1,0,0,0,33.49,26.28Z"/><path d="M4.31,17.08a1.06,1.06,0,0,0,.44.16,1,1,0,0,0,1.12-.85A12.21,12.21,0,0,1,18.69,5.84L16.45,7.37a1,1,0,0,0,.47,1.79A1,1,0,0,0,17.56,9l5.33-3.66L18.33.76a1,1,0,1,0-1.39,1.38l1.7,1.7A14.2,14.2,0,0,0,3.89,16.12,1,1,0,0,0,4.31,17.08Z"/><path d="M21.73,29.93a12,12,0,0,1-4.84.51,12.3,12.3,0,0,1-9.57-6.3l2.49.93a1,1,0,0,0,.69-1.84l-4.59-1.7h0L4.44,21,3.33,27.35a1,1,0,0,0,.79,1.13l.17,0a1,1,0,0,0,1-.81l.42-2.4a14.3,14.3,0,0,0,11,7.14,13.91,13.91,0,0,0,5.63-.6,1,1,0,0,0-.6-1.9Z"/><path d="M22,13H14a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V14A1,1,0,0,0,22,13Zm-1,8H15V15h6Z"/>'
};
var processOnVmIconName = "process-on-vm";
var processOnVmIcon = [processOnVmIconName, renderIcon(icon304)];

// node_modules/@clr/core/icon/shapes/qr-code.js
var icon305 = {
  outline: '<path d="M5.6,4A1.6,1.6,0,0,0,4,5.6V12h8V4ZM10,10H6V6h4Z"/><path d="M4,30.4A1.6,1.6,0,0,0,5.6,32H12V24H4ZM6,26h4v4H6Z"/><path d="M24,32h6.4A1.6,1.6,0,0,0,32,30.4V24H24Zm2-6h4v4H26Z"/><path d="M30.4,4H24v8h8V5.6A1.6,1.6,0,0,0,30.4,4ZM30,10H26V6h4Z"/><polygon points="20 10 20 8 16 8 16 12 18 12 18 10 20 10"/><rect x="12" y="12" width="2" height="2"/><rect x="14" y="14" width="4" height="2"/><polygon points="20 6 20 8 22 8 22 4 14 4 14 8 16 8 16 6 20 6"/><rect x="4" y="14" width="2" height="4"/><polygon points="12 16 12 18 10 18 10 14 8 14 8 18 6 18 6 20 4 20 4 22 8 22 8 20 10 20 10 22 12 22 12 20 14 20 14 16 12 16"/><polygon points="20 16 22 16 22 18 24 18 24 16 26 16 26 14 22 14 22 10 20 10 20 12 18 12 18 14 20 14 20 16"/><polygon points="18 30 14 30 14 32 22 32 22 30 20 30 20 28 18 28 18 30"/><polygon points="22 20 22 18 20 18 20 16 18 16 18 18 16 18 16 20 18 20 18 22 20 22 20 20 22 20"/><rect x="30" y="20" width="2" height="2"/><rect x="22" y="20" width="6" height="2"/><polygon points="30 14 28 14 28 16 26 16 26 18 28 18 28 20 30 20 30 18 32 18 32 16 30 16 30 14"/><rect x="20" y="22" width="2" height="6"/><polygon points="14 28 16 28 16 26 18 26 18 24 16 24 16 20 14 20 14 28"/>'
};
var qrCodeIconName = "qr-code";
var qrCodeIcon = [qrCodeIconName, renderIcon(icon305)];

// node_modules/@clr/core/icon/shapes/rack-server.js
var icon306 = {
  outline: '<rect x="6" y="9" width="2" height="2"/><rect x="10" y="9" width="14" height="2"/><rect x="6" y="17" width="2" height="2"/><rect x="10" y="17" width="14" height="2"/><path d="M32,5H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V7A2,2,0,0,0,32,5ZM4,7H32v6H4Zm0,8H32v6H4ZM4,29V23H32v6Z"/><rect x="6" y="25" width="2" height="2"/><rect x="10" y="25" width="14" height="2"/>',
  outlineAlerted: '<rect x="10" y="17" width="14" height="2"/><rect x="6" y="25" width="2" height="2"/><rect x="10" y="25" width="14" height="2"/><path d="M18.64,11A3.65,3.65,0,0,1,19,9.89L19.56,9H10v2Z"/><path d="M33.68,15.4H32V21H4V15H20.58A3.67,3.67,0,0,1,19,13.56a3.63,3.63,0,0,1-.26-.56H4V7H20.71l1.15-2H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38ZM4,29V23H32v6Z"/>',
  outlineBadged: '<rect x="6" y="9" width="2" height="2"/><rect x="6" y="17" width="2" height="2"/><rect x="10" y="17" width="14" height="2"/><rect x="6" y="25" width="2" height="2"/><rect x="10" y="25" width="14" height="2"/><path d="M10,11H24v-.51A7.48,7.48,0,0,1,23.13,9H10Z"/><path d="M30,13.5a7.47,7.47,0,0,1-2.68-.5H4V7H22.57a7.52,7.52,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.46,7.46,0,0,1,30,13.5ZM4,15H32v6H4ZM4,29V23H32v6Z"/>',
  solid: '<path d="M2,22H34V14H2Zm8-5H24v2H10ZM6,17H8v2H6Z"/><path d="M32,4H4A2,2,0,0,0,2,6v6H34V6A2,2,0,0,0,32,4ZM8,9H6V7H8ZM24,9H10V7H24Z"/><path d="M2,30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24H2Zm8-3H24v2H10ZM6,27H8v2H6Z"/>',
  solidAlerted: '<path d="M2,30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24H2Zm8-3H24v2H10ZM6,27H8v2H6Z"/><path d="M19,9.89,19.56,9H10V7H20.71l1.73-3H4A2,2,0,0,0,2,6v6H18.57A3.67,3.67,0,0,1,19,9.89ZM8,9H6V7H8Z"/><path d="M33.68,15.4H22.23A3.69,3.69,0,0,1,19.35,14H2v8H34V15.38ZM8,19H6V17H8Zm16,0H10V17H24Z"/>',
  solidBadged: '<path d="M2,14v8H34V14Zm6,5H6V17H8Zm16,0H10V17H24Z"/><path d="M2,30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V24H2Zm8-3H24v2H10ZM6,27H8v2H6Z"/><path d="M23.13,9H10V7H22.57a7.52,7.52,0,0,1-.07-1,7.49,7.49,0,0,1,.28-2H4A2,2,0,0,0,2,6v6H25.51A7.52,7.52,0,0,1,23.13,9ZM8,9H6V7H8Z"/>'
};
var rackServerIconName = "rack-server";
var rackServerIcon = [rackServerIconName, renderIcon(icon306)];

// node_modules/@clr/core/icon/shapes/radar.js
var icon307 = {
  outline: '<path d="M32,18c0,7.7-6.3,14-14,14c-7.7,0-14-6.3-14-14C4,10.6,9.7,4.5,17.1,4v3.7c-5.7,0.5-9.9,5.5-9.4,11.2s5.5,9.9,11.2,9.4c5.3-0.5,9.4-4.9,9.4-10.3h-2c0,4.6-3.7,8.3-8.3,8.3s-8.3-3.7-8.3-8.3c0-4.2,3.1-7.8,7.3-8.3v4.4c-1.8,0.4-3.1,2-3.1,3.9c0,2.2,1.8,4,4,4s4-1.8,4-4c0-1.8-1.3-3.4-3-3.8V2.1C18.6,2,18.3,2,18,2C9.2,2,2,9.2,2,18s7.2,16,16,16s16-7.2,16-16H32z M20,18c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S20,16.9,20,18z"/>',
  solid: '<path d="M32,18c0,7.7-6.2,14-14,14S4,25.8,4,18c0-7.4,5.7-13.5,13.1-14v3.7c-5.7,0.5-9.8,5.5-9.3,11.2s5.5,9.8,11.2,9.3c5.3-0.5,9.3-4.9,9.3-10.2h-2c0,4.6-3.7,8.3-8.3,8.3S9.7,22.6,9.7,18c0-4.2,3.2-7.8,7.3-8.2v4.4c-2.1,0.6-3.4,2.7-2.9,4.9c0.6,2.1,2.7,3.4,4.9,2.9c2.1-0.6,3.4-2.7,2.9-4.9c-0.4-1.4-1.5-2.5-2.9-2.9V2c-0.4,0-0.7,0-1.1,0c-8.8,0-16,7.2-16,16c0,8.8,7.2,16,16,16s16-7.2,16-16c0,0,0,0,0,0H32z"/>'
};
var radarIconName = "radar";
var radarIcon = [radarIconName, renderIcon(icon307)];

// node_modules/@clr/core/icon/shapes/resistor.js
var icon308 = {
  outline: '<path d="M29.43,26.34h0A1.47,1.47,0,0,1,28,25.22L24.86,13.15,21.74,25.22a1.49,1.49,0,0,1-1.45,1.12h0a1.49,1.49,0,0,1-1.46-1.12L15.71,13.15,12.6,25.22a1.51,1.51,0,0,1-2.91,0L6.57,13.15,5.22,18.37H2a1,1,0,0,1,0-2H3.67l1.45-5.59A1.48,1.48,0,0,1,6.57,9.66h0A1.47,1.47,0,0,1,8,10.78l3.12,12.07,3.12-12.07a1.49,1.49,0,0,1,1.45-1.12h0a1.49,1.49,0,0,1,1.46,1.12l3.12,12.07,3.12-12.07a1.5,1.5,0,0,1,2.9,0l3.12,12.07,1.35-5.22H34a1,1,0,0,1,0,2H32.33l-1.45,5.59A1.48,1.48,0,0,1,29.43,26.34Z"/>'
};
var resistorIconName = "resistor";
var resistorIcon = [resistorIconName, renderIcon(icon308)];

// node_modules/@clr/core/icon/shapes/resource-pool.js
var icon309 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM4,18a14,14,0,0,1,27.95-1H17.49L8.3,28.07A14,14,0,0,1,4,18ZM18,32a13.91,13.91,0,0,1-8.16-2.65L18.43,19H31.95A14,14,0,0,1,18,32Z"/>',
  outlineAlerted: '<path d="M33.68,15.4H31.73a14,14,0,0,1,.22,1.6H17.49L8.3,28.07A14,14,0,0,1,22.09,4.62l1-1.76A16,16,0,1,0,34,18a16,16,0,0,0-.23-2.61ZM18,32a13.91,13.91,0,0,1-8.16-2.65L18.43,19H31.95A14,14,0,0,1,18,32Z"/>',
  outlineBadged: '<path d="M31.2,13.4a13.91,13.91,0,0,1,.75,3.6H17.49L8.3,28.07A14,14,0,0,1,22.61,4.8a7.43,7.43,0,0,1,.58-1.92,16.06,16.06,0,1,0,9.93,9.93A7.43,7.43,0,0,1,31.2,13.4ZM18,32a13.91,13.91,0,0,1-8.16-2.65L18.43,19H31.95A14,14,0,0,1,18,32Z"/>',
  solid: '<path d="M8.57,30.9A16,16,0,0,0,33.95,19H18.43Z"/><path d="M33.95,17A16,16,0,1,0,7,29.6L17.49,17Z"/>',
  solidAlerted: '<path d="M8.57,30.9A16,16,0,0,0,33.95,19H18.43Z"/><path d="M33.95,17a16,16,0,0,0-.18-1.61H22.23A3.68,3.68,0,0,1,19,9.89l4.06-7A16,16,0,0,0,7,29.6L17.49,17Z"/>',
  solidBadged: '<path d="M8.57,30.9A16,16,0,0,0,33.95,19H18.43Z"/><path d="M33.95,17a15.91,15.91,0,0,0-.84-4.18,7.49,7.49,0,0,1-9.92-9.94A16,16,0,0,0,7,29.6L17.49,17Z"/>'
};
var resourcePoolIconName = "resource-pool";
var resourcePoolIcon = [resourcePoolIconName, renderIcon(icon309)];

// node_modules/@clr/core/icon/shapes/router.js
var icon310 = {
  outline: '<path d="M18,14.87l5.11-5.14a1,1,0,1,0-1.42-1.41L19,11V3.33a1,1,0,0,0-2,0V11L14.31,8.32a1,1,0,1,0-1.42,1.41Z"/><path d="M18,21.13l-5.11,5.14a1,1,0,0,0,1.42,1.41L17,25v7.69a1,1,0,0,0,2,0V25l2.69,2.71a1,1,0,0,0,1.42-1.41Z"/><path d="M28.85,12.89a1,1,0,0,0-1.41,1.42L30.15,17H22.46a1,1,0,1,0,0,2h7.69l-2.71,2.69a1,1,0,0,0,1.41,1.42L34,18Z"/><path d="M5.85,19h7.69a1,1,0,0,0,0-2H5.85l2.71-2.69a1,1,0,1,0-1.41-1.42L2,18l5.14,5.11a1,1,0,1,0,1.41-1.42Z"/>',
  outlineAlerted: '<path d="M18,21.13l-5.11,5.14a1,1,0,0,0,1.42,1.41L17,25v7.69a1,1,0,0,0,2,0V25l2.69,2.71a1,1,0,0,0,1.42-1.41Z"/><path d="M5.85,19h7.69a1,1,0,0,0,0-2H5.85l2.71-2.69a1,1,0,1,0-1.41-1.42L2,18l5.14,5.11a1,1,0,1,0,1.41-1.42Z"/><path d="M31.38,15.4H28.54L30.15,17H22.46a1,1,0,1,0,0,2h7.69l-2.71,2.69a1,1,0,0,0,1.41,1.42L34,18Z"/><path d="M18,14.87l1.15-1.16-.1-.15A3.68,3.68,0,0,1,19,10V3.33a1,1,0,0,0-2,0V11L14.31,8.32a1,1,0,1,0-1.42,1.41Z"/>',
  outlineBadged: '<path d="M18,14.87l5.11-5.14a1,1,0,1,0-1.42-1.41L19,11V3.33a1,1,0,0,0-2,0V11L14.31,8.32a1,1,0,1,0-1.42,1.41Z"/><path d="M18,21.13l-5.11,5.14a1,1,0,0,0,1.42,1.41L17,25v7.69a1,1,0,0,0,2,0V25l2.69,2.71a1,1,0,0,0,1.42-1.41Z"/><path d="M28.85,12.89a1,1,0,0,0-1.41,1.42L30.15,17H22.46a1,1,0,1,0,0,2h7.69l-2.71,2.69a1,1,0,0,0,1.41,1.42L34,18Z"/><path d="M5.85,19h7.69a1,1,0,0,0,0-2H5.85l2.71-2.69a1,1,0,1,0-1.41-1.42L2,18l5.14,5.11a1,1,0,1,0,1.41-1.42Z"/>',
  solid: '<path d="M18,1.67a16,16,0,1,0,16,16A16,16,0,0,0,18,1.67ZM13.86,9.92a.8.8,0,0,1,1.13,0l2.21,2.19V5.93a.8.8,0,0,1,1.6,0v6.18L21,9.92a.8.8,0,1,1,1.13,1.14L18,15.15l-4.14-4.1A.8.8,0,0,1,13.86,9.92ZM10.32,21.74a.8.8,0,0,1-1.13,0L5,17.67l4.19-4.09a.8.8,0,1,1,1.12,1.14l-2.2,2.14h6.27a.8.8,0,0,1,0,1.6H8.11l2.2,2.15A.8.8,0,0,1,10.32,21.74Zm11.82,3.67a.8.8,0,0,1-1.13,0L18.8,23.23V29.4a.8.8,0,0,1-1.6,0V23.23L15,25.42a.8.8,0,1,1-1.13-1.14L18,20.18l4.14,4.1A.8.8,0,0,1,22.14,25.41Zm4.67-3.66a.8.8,0,1,1-1.12-1.14l2.2-2.15H21.63a.8.8,0,0,1,0-1.6h6.27l-2.2-2.14a.8.8,0,1,1,1.12-1.14L31,17.67Z"/>',
  solidAlerted: '<path d="M33.82,15.39H28.68L31,17.67l-4.19,4.09a.8.8,0,1,1-1.12-1.14l2.2-2.15H21.63a.8.8,0,0,1,0-1.6h6.27l-1.5-1.47H22.23a3.68,3.68,0,0,1-3-1.51L18,15.15l-4.14-4.1A.8.8,0,1,1,15,9.92l2.21,2.19V5.93a.8.8,0,0,1,1.6,0v4.49A3.65,3.65,0,0,1,19,9.89l4.22-7.31A16,16,0,1,0,34,17.67,16,16,0,0,0,33.82,15.39Zm-23.5,6.35a.8.8,0,0,1-1.13,0L5,17.67l4.19-4.09a.8.8,0,1,1,1.12,1.14l-2.2,2.14h6.27a.8.8,0,0,1,0,1.6H8.11l2.2,2.15A.8.8,0,0,1,10.32,21.74Zm11.82,3.67a.8.8,0,0,1-1.13,0L18.8,23.23V29.4a.8.8,0,0,1-1.6,0V23.23L15,25.42a.8.8,0,1,1-1.13-1.14L18,20.18l4.14,4.1A.8.8,0,0,1,22.14,25.41Z"/>',
  solidBadged: '<path d="M33.22,12.76A7.49,7.49,0,0,1,23.32,2.6a16,16,0,1,0,9.9,10.17ZM13.86,9.92a.8.8,0,0,1,1.13,0l2.21,2.19V5.93a.8.8,0,0,1,1.6,0v6.18L21,9.92a.8.8,0,1,1,1.13,1.14L18,15.15l-4.14-4.1A.8.8,0,0,1,13.86,9.92ZM10.32,21.74a.8.8,0,0,1-1.13,0L5,17.67l4.19-4.09a.8.8,0,1,1,1.12,1.14l-2.2,2.14h6.27a.8.8,0,0,1,0,1.6H8.11l2.2,2.15A.8.8,0,0,1,10.32,21.74Zm11.82,3.67a.8.8,0,0,1-1.13,0L18.8,23.23V29.4a.8.8,0,0,1-1.6,0V23.23L15,25.42a.8.8,0,1,1-1.13-1.14L18,20.18l4.14,4.1A.8.8,0,0,1,22.14,25.41Zm4.67-3.66a.8.8,0,1,1-1.12-1.14l2.2-2.15H21.63a.8.8,0,0,1,0-1.6h6.27l-2.2-2.14a.8.8,0,1,1,1.12-1.14L31,17.67Z"/>'
};
var routerIconName = "router";
var routerIcon = [routerIconName, renderIcon(icon310)];

// node_modules/@clr/core/icon/shapes/ruler-pencil.js
var icon311 = {
  outline: '<polygon points="9 17.41 9 27 18.59 27 16.59 25 11 25 11 19.41 9 17.41"/><path d="M34.87,32.29,32,29.38V32H4V27.85H6v-1.6H4V19.6H6V18H4V11.6H6V10H4V4.41L19.94,20.26V17.44L3.71,1.29A1,1,0,0,0,2,2V33a1,1,0,0,0,1,1H34.16a1,1,0,0,0,.71-1.71Z"/><path d="M24,30h4a2,2,0,0,0,2-2V8.7L27.7,4.47a2,2,0,0,0-1.76-1h0a2,2,0,0,0-1.76,1.08L22,8.72V28A2,2,0,0,0,24,30ZM24,9.2l1.94-3.77L28,9.21V24H24Zm0,16.43h4v2.44H24Z"/>',
  solid: '<path d="M34.87,32.21,30,27.37V8.75L27.7,4.52a2,2,0,0,0-3.54,0L22,8.76V19.41L3.71,1.21A1,1,0,0,0,2,1.92V10H4.17v1.6H2V18H4.17v1.6H2v6.65H4.17v1.6H2v5.07a1,1,0,0,0,1,1H34.16a1,1,0,0,0,.71-1.71ZM10,26V16.94L19.07,26Zm18,2.11H24V25.68h4Zm0-4H24V9.25l1.94-3.77L28,9.26Z"/>'
};
var rulerPencilIconName = "ruler-pencil";
var rulerPencilIcon = [rulerPencilIconName, renderIcon(icon311)];

// node_modules/@clr/core/icon/shapes/shield.js
var icon312 = {
  outline: '<path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59ZM30,15.93c0,11-10,15.61-12,16.43-2-.82-12-5.44-12-16.43V9.14a47.54,47.54,0,0,0,6.18-2.25,48.23,48.23,0,0,0,5.82-3,48.23,48.23,0,0,0,5.82,3A47.54,47.54,0,0,0,30,9.14Z"/>',
  outlineAlerted: '<path d="M30,15.4v.53c0,11-10,15.61-12,16.43-2-.82-12-5.44-12-16.43V9.14a47.54,47.54,0,0,0,6.18-2.25,48.23,48.23,0,0,0,5.82-3c1,.64,2.2,1.27,3.43,1.89l1-1.74a41.1,41.1,0,0,1-3.89-2.18L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V15.4Z"/>',
  outlineBadged: '<path d="M30,13.5v2.43c0,11-10,15.61-12,16.43-2-.82-12-5.44-12-16.43V9.14a47.54,47.54,0,0,0,6.18-2.25,48.23,48.23,0,0,0,5.82-3,46.19,46.19,0,0,0,4.51,2.42c0-.1,0-.19,0-.29a7.49,7.49,0,0,1,.23-1.83,41.61,41.61,0,0,1-4.19-2.33L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V13.22A7.49,7.49,0,0,1,30,13.5Z"/>',
  solid: '<path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59Z"/>',
  solidAlerted: '<path d="M22.23,15.4A3.68,3.68,0,0,1,19,9.89L22.43,4a41.1,41.1,0,0,1-3.89-2.18L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V15.4Z"/>',
  solidBadged: '<path d="M30,13.5a7.47,7.47,0,0,1-7.27-9.33,41.61,41.61,0,0,1-4.19-2.33L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V13.22A7.49,7.49,0,0,1,30,13.5Z"/>'
};
var shieldIconName = "shield";
var shieldIcon = [shieldIconName, renderIcon(icon312)];

// node_modules/@clr/core/icon/shapes/shield-check.js
var icon313 = {
  outline: '<path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59ZM30,15.93c0,11-10,15.61-12,16.43-2-.82-12-5.44-12-16.43V9.14a47.54,47.54,0,0,0,6.18-2.25,48.23,48.23,0,0,0,5.82-3,48.23,48.23,0,0,0,5.82,3A47.54,47.54,0,0,0,30,9.14Z"/><path d="M10.88,16.87a1,1,0,0,0-1.41,1.41l6,6L26.4,13.77A1,1,0,0,0,25,12.33l-9.47,9.19Z"/>',
  solid: '<path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59Zm-4.57,6.65L15.51,24.9,9.19,18.57a1.4,1.4,0,0,1,2-2L15.54,21,24.73,12a1.4,1.4,0,1,1,2,2Z"/>'
};
var shieldCheckIconName = "shield-check";
var shieldCheckIcon = [shieldCheckIconName, renderIcon(icon313)];

// node_modules/@clr/core/icon/shapes/shield-x.js
var icon314 = {
  outline: '<path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59ZM30,15.93c0,11-10,15.61-12,16.43-2-.82-12-5.44-12-16.43V9.14a47.54,47.54,0,0,0,6.18-2.25,48.23,48.23,0,0,0,5.82-3,48.23,48.23,0,0,0,5.82,3A47.54,47.54,0,0,0,30,9.14Z"/><path d="M22.81,10.79,18,15.61l-4.81-4.81a1,1,0,0,0-1.41,1.41L16.59,17l-4.81,4.81a1,1,0,1,0,1.41,1.41L18,18.43l4.81,4.81a1,1,0,0,0,1.41-1.41L19.41,17l4.81-4.81a1,1,0,0,0-1.41-1.41Z"/>',
  solid: '<path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59ZM24.51,21.55a1.4,1.4,0,0,1-2,2L18,19l-4.53,4.53a1.43,1.43,0,0,1-2,0,1.4,1.4,0,0,1,0-2L16,17l-4.53-4.53a1.4,1.4,0,1,1,2-2L18,15l4.53-4.53a1.4,1.4,0,0,1,2,2L20,17Z"/>'
};
var shieldXIconName = "shield-x";
var shieldXIcon = [shieldXIconName, renderIcon(icon314)];

// node_modules/@clr/core/icon/shapes/squid.js
var icon315 = {
  outline: '<path d="M18,7a1,1,0,0,1-1-1V3.19a1,1,0,0,1,2,0V6A1,1,0,0,1,18,7Z"/><path d="M18,34a1,1,0,0,1-1-1V30a1,1,0,0,1,2,0v3A1,1,0,0,1,18,34Z"/><path d="M7.41,18l1.78-1.77a1,1,0,1,0-1.42-1.42L6,16.59,4.23,14.81a1,1,0,1,0-1.42,1.42L4.59,18,2.81,19.77a1,1,0,0,0,0,1.42,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29L6,19.41l1.77,1.78a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/><path d="M6,13.76l.36-.36a3,3,0,0,1,2.11-.88,11,11,0,0,1,19,0,3,3,0,0,1,2.12.88l.36.36.2-.2a13,13,0,0,0-24.4,0Z"/><path d="M30,22.24l-.36.36a3,3,0,0,1-2.12.88,11,11,0,0,1-19,0,3,3,0,0,1-2.12-.88L6,22.24l-.2.2a13,13,0,0,0,24.4,0Z"/><path d="M31.41,18l1.78-1.77a1,1,0,0,0-1.42-1.42L30,16.59l-1.77-1.78a1,1,0,1,0-1.42,1.42L28.59,18l-1.78,1.77a1,1,0,0,0,0,1.42,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29L30,19.41l1.77,1.78a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/>'
};
var squidIconName = "squid";
var squidIcon = [squidIconName, renderIcon(icon315)];

// node_modules/@clr/core/icon/shapes/ssd.js
var icon316 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z"/><circle cx="6.21" cy="10.25" r="1.25"/><circle cx="29.81" cy="10.25" r="1.25"/><circle cx="6.21" cy="25.42" r="1.25"/><circle cx="29.81" cy="25.42" r="1.25"/><path d="M10,18.62c1.32.31,1.91.54,1.91,1.22s-.53,1.09-1.55,1.09a4,4,0,0,1-2.71-1.11l-.86,1.06a5,5,0,0,0,3.52,1.34c2,0,3.1-1,3.1-2.52s-1.15-2.05-2.87-2.44c-1.31-.3-1.92-.54-1.92-1.21A1.25,1.25,0,0,1,10,15a3.68,3.68,0,0,1,2.37,1l.81-1.1A4.58,4.58,0,0,0,10,13.69c-1.74,0-3,1.05-3,2.49S8.26,18.22,10,18.62Z"/><path d="M17.83,20.93a4,4,0,0,1-2.71-1.11l-.86,1.06a5,5,0,0,0,3.52,1.34c2,0,3.1-1,3.1-2.52S19.73,17.65,18,17.26c-1.31-.3-1.92-.54-1.92-1.21A1.25,1.25,0,0,1,17.48,15a3.68,3.68,0,0,1,2.37,1l.81-1.1a4.56,4.56,0,0,0-3.12-1.15c-1.73,0-3,1.05-3,2.49s1.19,2,2.89,2.44c1.32.31,1.91.54,1.91,1.22S18.85,20.93,17.83,20.93Z"/><path d="M29.9,18c0-2.41-1.92-4.12-4.64-4.12h-2.9v8.24h2.9C28,22.08,29.9,20.37,29.9,18Zm-6-2.76h1.56a2.77,2.77,0,1,1,0,5.53H23.86Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM5.21,8A1.25,1.25,0,1,1,4,9.25,1.25,1.25,0,0,1,5.21,8Zm0,20a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,5.21,28Zm5.06-5.78a5,5,0,0,1-3.52-1.34l.86-1.06a4,4,0,0,0,2.71,1.11c1,0,1.55-.5,1.55-1.09s-.59-.91-1.91-1.22c-1.7-.4-2.89-.89-2.89-2.44s1.22-2.49,3-2.49a4.58,4.58,0,0,1,3.12,1.15l-.81,1.1A3.68,3.68,0,0,0,10,15a1.25,1.25,0,0,0-1.39,1.08c0,.67.61.91,1.92,1.21,1.72.39,2.87.94,2.87,2.44S12.24,22.22,10.27,22.22Zm7.51,0a5,5,0,0,1-3.52-1.34l.86-1.06a4,4,0,0,0,2.71,1.11c1,0,1.55-.5,1.55-1.09s-.59-.91-1.91-1.22c-1.7-.4-2.89-.89-2.89-2.44s1.23-2.49,3-2.49a4.56,4.56,0,0,1,3.12,1.15l-.81,1.1a3.68,3.68,0,0,0-2.37-1,1.25,1.25,0,0,0-1.39,1.08c0,.67.61.91,1.92,1.21,1.72.39,2.87.94,2.87,2.44S19.75,22.22,17.78,22.22Zm4.58-.14V13.84h2.9c2.72,0,4.64,1.71,4.64,4.12S28,22.08,25.26,22.08ZM30.69,28a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,30.69,28Zm0-17.5a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,30.69,10.5Z"/><path d="M23.86,15.2h1.56a2.77,2.77,0,1,1,0,5.53H23.86Z"/>'
};
var ssdIconName = "ssd";
var ssdIcon = [ssdIconName, renderIcon(icon316)];

// node_modules/@clr/core/icon/shapes/storage.js
var icon317 = {
  outline: '<path d="M33,6.69h0c-.18-3.41-9.47-4.33-15-4.33S3,3.29,3,6.78V29.37c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43V6.78s0,0,0,0S33,6.7,33,6.69Zm-2,7.56c-.33.86-5.06,2.45-13,2.45A37.45,37.45,0,0,1,7,15.34v2.08A43.32,43.32,0,0,0,18,18.7c4,0,9.93-.48,13-2v5.17c-.33.86-5.06,2.45-13,2.45A37.45,37.45,0,0,1,7,22.92V25a43.32,43.32,0,0,0,11,1.28c4,0,9.93-.48,13-2v5.1c-.35.86-5.08,2.45-13,2.45S5.3,30.2,5,29.37V6.82C5.3,6,10,4.36,18,4.36c7.77,0,12.46,1.53,13,2.37-.52.87-5.21,2.39-13,2.39A37.6,37.6,0,0,1,7,7.76V9.85a43.53,43.53,0,0,0,11,1.27c4,0,9.93-.48,13-2Z"/>',
  outlineAlerted: '<path d="M19.51,9.09,18,9.11A37.6,37.6,0,0,1,7,7.76V9.85a43.53,43.53,0,0,0,11,1.27h.61A3.66,3.66,0,0,1,19,9.89Z"/><path d="M28.83,15.4A38.37,38.37,0,0,1,18,16.7,37.45,37.45,0,0,1,7,15.34v2.08A43.33,43.33,0,0,0,18,18.7c4,0,9.93-.48,13-2v5.17c-.33.86-5.06,2.45-13,2.45A37.45,37.45,0,0,1,7,22.92V25a43.33,43.33,0,0,0,11,1.28c4,0,9.93-.48,13-2v5.1c-.35.86-5.08,2.45-13,2.45S5.3,30.2,5,29.37V6.82C5.3,6,10,4.36,18,4.36c1.5,0,2.89.06,4.15.16l1.1-1.9c-1.86-.18-3.7-.26-5.25-.26-5.57,0-15,.93-15,4.43V29.37c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43v-14Z"/>',
  outlineBadged: '<path d="M7,7.76V9.85a43.53,43.53,0,0,0,11,1.27,54.82,54.82,0,0,0,6.2-.36,7.5,7.5,0,0,1-1.13-1.88c-1.5.15-3.2.24-5.07.24A37.6,37.6,0,0,1,7,7.76Z"/><path d="M31,13.43v.82c-.33.86-5.06,2.45-13,2.45A37.45,37.45,0,0,1,7,15.34v2.08A43.33,43.33,0,0,0,18,18.7c4,0,9.93-.48,13-2v5.17c-.33.86-5.06,2.45-13,2.45A37.45,37.45,0,0,1,7,22.92V25a43.33,43.33,0,0,0,11,1.28c4,0,9.93-.48,13-2v5.1c-.35.86-5.08,2.45-13,2.45S5.3,30.2,5,29.37V6.82C5.3,6,10,4.36,18,4.36c1.7,0,3.25.08,4.64.2a7.44,7.44,0,0,1,.67-1.94c-1.88-.18-3.75-.26-5.31-.26-5.57,0-15,.93-15,4.43V29.37c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43V12.87A7.45,7.45,0,0,1,31,13.43Z"/>',
  solid: '<path d="M17.91,18.28c8.08,0,14.66-1.74,15.09-3.94V8.59c-.43,2.2-7,3.94-15.09,3.94A39.4,39.4,0,0,1,6.25,11V9a39.4,39.4,0,0,0,11.66,1.51C26,10.53,32.52,8.79,33,6.61h0C32.8,3.2,23.52,2.28,18,2.28S3,3.21,3,6.71V29.29c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43V24.09C32.57,26.28,26,28,17.91,28A39.4,39.4,0,0,1,6.25,26.52v-2A39.4,39.4,0,0,0,17.91,26C26,26,32.57,24.28,33,22.09V16.34c-.43,2.2-7,3.94-15.09,3.94A39.4,39.4,0,0,1,6.25,18.77v-2A39.4,39.4,0,0,0,17.91,18.28Z"/>',
  solidAlerted: '<path class="clr-i-solid--alerted clr-i-solid-path-1--alerted" d="M17.91,20.28A39.4,39.4,0,0,1,6.25,18.77v-2a39.4,39.4,0,0,0,11.66,1.51c6.9,0,12.7-1.27,14.51-3H22.23a3.67,3.67,0,0,1-3.55-2.75h-.77A39.4,39.4,0,0,1,6.25,11V9a39.4,39.4,0,0,0,11.66,1.51h.82A3.64,3.64,0,0,1,19,9.75l4.17-7.22c-1.85-.18-3.68-.25-5.21-.25-5.57,0-15,.93-15,4.43V29.29c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43V24.09C32.57,26.28,26,28,17.91,28A39.4,39.4,0,0,1,6.25,26.52v-2A39.4,39.4,0,0,0,17.91,26C26,26,32.57,24.28,33,22.09V16.34C32.57,18.53,26,20.28,17.91,20.28Z"/>',
  solidBadged: '<path d="M17.91,18.28c8.08,0,14.66-1.74,15.09-3.94v-1.6a7.47,7.47,0,0,1-7.38-.8,48.3,48.3,0,0,1-7.71.59A39.4,39.4,0,0,1,6.25,11V9a39.4,39.4,0,0,0,11.66,1.51,51,51,0,0,0,6-.34,7.46,7.46,0,0,1-.59-7.65c-1.87-.18-3.73-.26-5.28-.26-5.57,0-15,.93-15,4.43V29.29c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43V24.09C32.57,26.28,26,28,17.91,28A39.4,39.4,0,0,1,6.25,26.52v-2A39.4,39.4,0,0,0,17.91,26C26,26,32.57,24.28,33,22.09V16.34c-.43,2.2-7,3.94-15.09,3.94A39.4,39.4,0,0,1,6.25,18.77v-2A39.4,39.4,0,0,0,17.91,18.28Z"/>'
};
var storageIconName = "storage";
var storageIcon = [storageIconName, renderIcon(icon317)];

// node_modules/@clr/core/icon/shapes/storage-adapter.js
var icon318 = {
  outline: '<path d="M6.06,30a1,1,0,0,1-1-1V8h-2a1,1,0,0,1,0-2h4V29A1,1,0,0,1,6.06,30Z"/><path d="M30.06,27h-25V9h25a3,3,0,0,1,3,3V24A3,3,0,0,1,30.06,27Zm-23-2h23a1,1,0,0,0,1-1V12a1,1,0,0,0-1-1h-23Z"/><rect x="22.06" y="20" width="6" height="2"/><rect x="22.06" y="14" width="6" height="2"/><path d="M19.06,22h-8V20h7V14h2v7A1,1,0,0,1,19.06,22Z"/>'
};
var storageAdapterIconName = "storage-adapter";
var storageAdapterIcon = [storageAdapterIconName, renderIcon(icon318)];

// node_modules/@clr/core/icon/shapes/tablet.js
var icon319 = {
  outline: '<rect x="17" y="29" width="2" height="2"/><path d="M30,2H6A2,2,0,0,0,4,4V32a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V4A2,2,0,0,0,30,2Zm0,2V26.38H6V4ZM6,32V28H30v4Z"/>',
  solid: '<path d="M30,2H6A2,2,0,0,0,4,4V32a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V4A2,2,0,0,0,30,2ZM19,32H17V30h2ZM6,28V4H30V28Z"/>'
};
var tabletIconName = "tablet";
var tabletIcon = [tabletIconName, renderIcon(icon319)];

// node_modules/@clr/core/icon/shapes/tape-drive.js
var icon320 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM4,28V8H32V28Z"/><path d="M13.33,13.35a4.52,4.52,0,1,0,4.53,4.52A4.53,4.53,0,0,0,13.33,13.35Zm0,7.44a2.92,2.92,0,1,1,2.93-2.92A2.92,2.92,0,0,1,13.33,20.79Z"/><path d="M23.62,13.35a4.52,4.52,0,1,0,4.52,4.52A4.53,4.53,0,0,0,23.62,13.35Zm0,7.44a2.92,2.92,0,1,1,2.92-2.92A2.92,2.92,0,0,1,23.62,20.79Z"/><path d="M6,11V23.55H8V12H29.34V10H7A1,1,0,0,0,6,11Z"/>',
  outlineAlerted: '<path d="M8.81,17.87a4.53,4.53,0,1,0,4.52-4.52A4.53,4.53,0,0,0,8.81,17.87Zm7.45,0A2.93,2.93,0,1,1,13.33,15,2.93,2.93,0,0,1,16.26,17.87Z"/><path d="M7,10a1,1,0,0,0-1,1V23.55H8V12H18.57A3.7,3.7,0,0,1,19,10Z"/><path d="M33.68,15.4H32V28H4V8H20.14l1.15-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38Z"/><path d="M22.09,15.39a3.65,3.65,0,0,1-1.8-.55,4.51,4.51,0,1,0,7.11.56H25.17a2.92,2.92,0,1,1-3.08,0Z"/>',
  outlineBadged: '<path d="M8.81,17.87a4.53,4.53,0,1,0,4.52-4.52A4.53,4.53,0,0,0,8.81,17.87Zm7.45,0A2.93,2.93,0,1,1,13.33,15,2.93,2.93,0,0,1,16.26,17.87Z"/><path d="M19.1,17.87a4.52,4.52,0,1,0,4.52-4.52A4.53,4.53,0,0,0,19.1,17.87Zm7.44,0A2.92,2.92,0,1,1,23.62,15,2.92,2.92,0,0,1,26.54,17.87Z"/><path d="M32,13.22V28H4V8H22.78a7.37,7.37,0,0,1-.28-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.65,7.65,0,0,1,32,13.22Z"/><path d="M6,11V23.55H8V12H25.51a7.66,7.66,0,0,1-1.85-2H7A1,1,0,0,0,6,11Z"/>',
  solid: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM30,24H6V12H30Z"/><path d="M12.21,23a5,5,0,1,0-5-5A5,5,0,0,0,12.21,23Zm0-7a2,2,0,1,1-2,2A2,2,0,0,1,12.21,16Z"/><path d="M23.79,23a5,5,0,1,0-5-5A5,5,0,0,0,23.79,23Zm0-7a2,2,0,1,1-2,2A2,2,0,0,1,23.79,16Z"/>',
  solidAlerted: '<path d="M7.2,18a5,5,0,1,0,5-5A5,5,0,0,0,7.2,18Zm7,0a2,2,0,1,1-2-2A2,2,0,0,1,14.22,18Z"/><path d="M18.78,18a5,5,0,1,0,9.27-2.6H22.23a3.71,3.71,0,0,1-2.17-.71A5,5,0,0,0,18.78,18Zm5-2a2,2,0,1,1-2,2A2,2,0,0,1,23.79,16Z"/><path d="M33.68,15.4H30V24H6V12H18.57a3.65,3.65,0,0,1,.48-2.11L21.29,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38Z"/>',
  solidBadged: '<path d="M12.21,23a5,5,0,1,0-5-5A5,5,0,0,0,12.21,23Zm0-7a2,2,0,1,1-2,2A2,2,0,0,1,12.21,16Z"/><path d="M23.79,23a5,5,0,1,0-5-5A5,5,0,0,0,23.79,23Zm0-7a2,2,0,1,1-2,2A2,2,0,0,1,23.79,16Z"/><path d="M30,13.5V24H6V12H25.51a7.49,7.49,0,0,1-3-6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.49,7.49,0,0,1,30,13.5Z"/>'
};
var tapeDriveIconName = "tape-drive";
var tapeDriveIcon = [tapeDriveIconName, renderIcon(icon320)];

// node_modules/@clr/core/icon/shapes/terminal.js
var icon321 = {
  outline: '<path d="M32,5H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V7A2,2,0,0,0,32,5ZM4,7H32V9.2H4ZM4,29V10.8H32V29Z"/><rect x="17" y="23" width="6" height="2"/><polygon points="7 15.68 13.79 18.8 7 21.91 7 24.11 16.6 19.7 16.6 17.89 7 13.48 7 15.68"/>',
  outlineAlerted: '<rect x="17" y="23" width="6" height="2"/><polygon points="7 24.11 16.6 19.7 16.6 17.89 7 13.48 7 15.68 13.79 18.8 7 21.91 7 24.11"/><path d="M33.68,15.4H32V29H4V10.8H18.68A3.66,3.66,0,0,1,19,9.89l.4-.69H4V7H20.71l1.15-2H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38Z"/>',
  outlineBadged: '<rect x="17" y="23" width="6" height="2"/><polygon points="7 24.11 16.6 19.7 16.6 17.89 7 13.48 7 15.68 13.79 18.8 7 21.91 7 24.11"/><path d="M32,13.22V29H4V10.8H24.24a7.51,7.51,0,0,1-1-1.6H4V7H22.57a7.52,7.52,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.45,7.45,0,0,1,32,13.22Z"/>',
  solid: '<path d="M32,5H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V7A2,2,0,0,0,32,5ZM6.8,15.81V13.17l10,4.59v2.08l-10,4.59V21.78l6.51-3ZM23.4,25.4H17V23h6.4ZM4,9.2V7H32V9.2Z"/>',
  solidAlerted: '<path d="M33.68,15.4H22.23A3.68,3.68,0,0,1,19,9.89l.4-.69H4V7H20.71l1.15-2H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.38ZM16.8,19.83l-10,4.59V21.78l6.51-3-6.51-3V13.17l10,4.59Zm6.6,5.57H17V23h6.4Z"/>',
  solidBadged: '<path d="M30,13.5a7.49,7.49,0,0,1-6.78-4.3H4V7H22.57a7.52,7.52,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1H4A2,2,0,0,0,2,7V29a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.46,7.46,0,0,1,30,13.5ZM16.8,19.83l-10,4.59V21.78l6.51-3-6.51-3V13.17l10,4.59Zm6.6,5.57H17V23h6.4Z"/>'
};
var terminalIconName = "terminal";
var terminalIcon = [terminalIconName, renderIcon(icon321)];

// node_modules/@clr/core/icon/shapes/unarchive.js
var icon322 = {
  outline: '<path d="M29,32H7V22H5V32a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V22H29Z"/><path d="M14,24a1,1,0,0,0,1,1h6a1,1,0,0,0,0-2H15A1,1,0,0,0,14,24Z"/><path d="M15,18H6V14h9V12H5.5A1.5,1.5,0,0,0,4,13.5V20H15.78A3,3,0,0,1,15,18Z"/><path d="M30.5,12H21v2h9v4H21a3,3,0,0,1-.78,2H32V13.5A1.5,1.5,0,0,0,30.5,12Z"/><path d="M13,9.55,17,5.6V18a1,1,0,1,0,2,0V5.6l4,3.95a1,1,0,1,0,1.41-1.42L18,1.78,11.61,8.13A1,1,0,0,0,13,9.55Z"/>',
  solid: '<path d="M18,21a3,3,0,0,1-2.22-1H5V32a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V20H20.21A3,3,0,0,1,18,21Zm4,3a1,1,0,0,1-1,1H15a1,1,0,0,1,0-2h6A1,1,0,0,1,22,24Z"/><path d="M15,12H5.5A1.5,1.5,0,0,0,4,13.5V18H15Z"/><path d="M30.5,12H21v6H32V13.5A1.5,1.5,0,0,0,30.5,12Z"/><path d="M13,9.55,17,5.6V18a1,1,0,1,0,2,0V5.6l4,3.95a1,1,0,1,0,1.41-1.42L18,1.78,11.61,8.13A1,1,0,0,0,13,9.55Z"/>'
};
var unarchiveIconName = "unarchive";
var unarchiveIcon = [unarchiveIconName, renderIcon(icon322)];

// node_modules/@clr/core/icon/shapes/uninstall.js
var icon323 = {
  outline: '<path d="M11.29,26.72a1,1,0,0,0,1.41,0L18,21.49l5.3,5.23A1,1,0,0,0,24.7,25.3l-5.28-5.21,5.28-5.21a1,1,0,0,0-1.41-1.42L18,18.68l-5.3-5.23a1,1,0,0,0-1.41,1.42l5.28,5.21L11.3,25.3A1,1,0,0,0,11.29,26.72Z"/><path d="M30.92,8H26.55a1,1,0,0,0,0,2H31V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V10A2,2,0,0,0,30.92,8Z"/>',
  outlineAlerted: '<path d="M11.29,26.72a1,1,0,0,0,1.41,0L18,21.49l5.3,5.23A1,1,0,0,0,24.7,25.3l-5.28-5.21,4.75-4.69H22.23a3.65,3.65,0,0,1-.81-.1L18,18.68l-5.3-5.23a1,1,0,0,0-1.41,1.42l5.28,5.21L11.3,25.3A1,1,0,0,0,11.29,26.72Z"/><path d="M31,15.4V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V15.4Z"/>',
  outlineBadged: '<path d="M11.29,26.72a1,1,0,0,0,1.41,0L18,21.49l5.3,5.23A1,1,0,0,0,24.7,25.3l-5.28-5.21,5.28-5.21a1,1,0,0,0-1.41-1.42L18,18.68l-5.3-5.23a1,1,0,0,0-1.41,1.42l5.28,5.21L11.3,25.3A1,1,0,0,0,11.29,26.72Z"/><path d="M31,13.43V30H5V10H9.38a1,1,0,0,0,0-2H5.08A2,2,0,0,0,3,10V30a2,2,0,0,0,2.08,2H30.92A2,2,0,0,0,33,30V12.87A7.45,7.45,0,0,1,31,13.43Z"/>'
};
var uninstallIconName = "uninstall";
var uninstallIcon = [uninstallIconName, renderIcon(icon323)];

// node_modules/@clr/core/icon/shapes/unlink.js
var icon324 = {
  outline: '<path d="M5,5,3.59,6.41l9,9L8.1,19.79a5.91,5.91,0,0,0,0,8.39,6,6,0,0,0,8.44,0L21,23.78l8.63,8.63L31,31ZM15.13,26.76a4,4,0,0,1-5.62,0,3.92,3.92,0,0,1,0-5.55L14,16.79l5.58,5.58Z"/><path d="M21.53,9.22a4,4,0,0,1,5.62,0,3.92,3.92,0,0,1,0,5.55l-4.79,4.76L23.78,21l4.79-4.76a5.92,5.92,0,0,0,0-8.39,6,6,0,0,0-8.44,0l-4.76,4.74L16.78,14Z"/>'
};
var unlinkIconName = "unlink";
var unlinkIcon = [unlinkIconName, renderIcon(icon324)];

// node_modules/@clr/core/icon/shapes/upload-cloud.js
var icon325 = {
  outline: '<path d="M30.31,13c0-.1,0-.21,0-.32a10.26,10.26,0,0,0-10.45-10,10.47,10.47,0,0,0-9.6,6.1A9.74,9.74,0,0,0,1.6,18.4,9.62,9.62,0,0,0,11.25,28H15V26H11.25A7.65,7.65,0,0,1,11,10.74l.67,0,.23-.63a8.43,8.43,0,0,1,8-5.4,8.26,8.26,0,0,1,8.45,8,7.75,7.75,0,0,1,0,.8l-.08.72.65.3A6,6,0,0,1,26.38,26H21v2h5.38a8,8,0,0,0,3.93-15Z"/><path d="M22.28,21.85A1,1,0,0,0,23,20.14l-5-5-5,5a1,1,0,0,0,1.41,1.41L17,19V31.25a1,1,0,1,0,2,0V19l2.57,2.57A1,1,0,0,0,22.28,21.85Z"/>',
  outlineAlerted: '<path d="M22.28,21.85A1,1,0,0,0,23,20.14l-5-5-5,5a1,1,0,0,0,1.41,1.41L17,19V31.25a1,1,0,1,0,2,0V19l2.57,2.57A1,1,0,0,0,22.28,21.85Z"/><path d="M3.6,18.38A7.71,7.71,0,0,1,11,10.74l.67,0,.23-.63a8.43,8.43,0,0,1,8-5.4,8.81,8.81,0,0,1,2,.25l1-1.8a10.8,10.8,0,0,0-3.07-.45,10.47,10.47,0,0,0-9.6,6.1A9.74,9.74,0,0,0,1.6,18.4,9.62,9.62,0,0,0,11.25,28H15V26H11.25A7.66,7.66,0,0,1,3.6,18.38Z"/><path d="M32.9,15.4H30.21A6,6,0,0,1,26.38,26H21v2h5.38A8,8,0,0,0,32.9,15.4Z"/>',
  outlineBadged: '<path d="M22.28,21.85A1,1,0,0,0,23,20.14l-5-5-5,5a1,1,0,0,0,1.41,1.41L17,19V31.25a1,1,0,1,0,2,0V19l2.57,2.57A1,1,0,0,0,22.28,21.85Z"/><path d="M30.92,13.44a7.13,7.13,0,0,1-2.63-.14c0,.08,0,.15,0,.23l-.08.72.65.3A6,6,0,0,1,26.38,26H21v2h5.38a8,8,0,0,0,4.54-14.56Z"/><path d="M3.6,18.38A7.71,7.71,0,0,1,11,10.74l.67,0,.23-.63a8.43,8.43,0,0,1,8-5.4,8.79,8.79,0,0,1,2.68.42,7.45,7.45,0,0,1,.5-1.94,10.79,10.79,0,0,0-3.18-.48,10.47,10.47,0,0,0-9.6,6.1A9.74,9.74,0,0,0,1.6,18.4,9.62,9.62,0,0,0,11.25,28H15V26H11.25A7.66,7.66,0,0,1,3.6,18.38Z"/>'
};
var uploadCloudIconName = "upload-cloud";
var uploadCloudIcon = [uploadCloudIconName, renderIcon(icon325)];

// node_modules/@clr/core/icon/shapes/usb.js
var icon326 = {
  outline: '<path d="M14.29,11.4a1.49,1.49,0,0,1,1.28-.72h1a2.89,2.89,0,0,0,2.75,2.09,3,3,0,0,0,0-5.91,2.9,2.9,0,0,0-2.67,1.82H15.57a3.49,3.49,0,0,0-3,1.66l-3,4.83h2.36Zm5-2.94A1.36,1.36,0,1,1,18,9.81,1.32,1.32,0,0,1,19.33,8.46Z"/><path d="M34.3,17.37l-6.11-3.66a.7.7,0,0,0-.7,0,.71.71,0,0,0-.36.61V17H6.92a2.33,2.33,0,0,1,.32,1.17,2.47,2.47,0,1,1-2.47-2.46,2.37,2.37,0,0,1,1.15.3l.93-1.76A4.44,4.44,0,1,0,9.15,19h3.58l4.17,6.65a3.49,3.49,0,0,0,3,1.66h1.66v1.28a.79.79,0,0,0,.8.79h4.49a.79.79,0,0,0,.8-.79v-4.4a.79.79,0,0,0-.8-.8H22.34a.8.8,0,0,0-.8.8v1.12H19.88a1.51,1.51,0,0,1-1.28-.72L15.09,19h12v2.66a.69.69,0,0,0,.36.61.67.67,0,0,0,.34.09.65.65,0,0,0,.36-.1l6.11-3.66a.69.69,0,0,0,.34-.6A.71.71,0,0,0,34.3,17.37ZM23.14,25H26v2.8H23.14Zm5.39-4.56V15.55l4,2.42Z"/>',
  solid: '<path d="M34.72,17.37l-5.51-3.31a.71.71,0,0,0-1.07.6V17H11.77l3.52-5.6a1.49,1.49,0,0,1,1.28-.72h1.64a2.41,2.41,0,0,0,2.25,1.61,2.48,2.48,0,0,0,0-4.95,2.38,2.38,0,0,0-2.13,1.34H16.57a3.49,3.49,0,0,0-3,1.66L9.41,17H8a3.46,3.46,0,1,0,.08,2h5.64l4.15,6.62a3.49,3.49,0,0,0,3,1.66h2.59v.92h4.4V23.8h-4.4v1.48H20.88a1.51,1.51,0,0,1-1.28-.72L16.11,19h12v2.28a.7.7,0,0,0,.36.61.72.72,0,0,0,.34.09.65.65,0,0,0,.36-.1l5.52-3.31a.7.7,0,0,0,0-1.2Z"/>'
};
var usbIconName = "usb";
var usbIcon = [usbIconName, renderIcon(icon326)];

// node_modules/@clr/core/icon/shapes/vm.js
var icon327 = {
  outline: '<path d="M11,5H25V8h2V5a2,2,0,0,0-2-2H11A2,2,0,0,0,9,5v6.85h2Z"/><path d="M30,10H17v2h8v6h2V12h3V26H22V17a2,2,0,0,0-2-2H6a2,2,0,0,0-2,2V31a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V28h8a2,2,0,0,0,2-2V12A2,2,0,0,0,30,10ZM6,31V17H20v9H16V20H14v6a2,2,0,0,0,2,2h4v3Z"/>',
  outlineAlerted: '<path d="M11,5H21.87L23,3H11A2,2,0,0,0,9,5v6.85h2Z"/><rect x="25.01" y="15.4" width="1.99" height="2.6"/><path d="M30,15.4V26H22V17a2,2,0,0,0-2-2H6a2,2,0,0,0-2,2V31a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V28h8a2,2,0,0,0,2-2V15.4ZM6,31V17H20v9H16V20H14v6a2,2,0,0,0,2,2h4v3Z"/><path d="M17,10v2h1.57A3.67,3.67,0,0,1,19,10Z"/>',
  outlineBadged: '<path d="M11,5H22.57a7.45,7.45,0,0,1,.55-2H11A2,2,0,0,0,9,5v6.85h2Z"/><path d="M30,13.5h0V26H22V17a2,2,0,0,0-2-2H6a2,2,0,0,0-2,2V31a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V28h8a2,2,0,0,0,2-2V13.22A7.49,7.49,0,0,1,30,13.5ZM6,31V17H20v9H16V20H14v6a2,2,0,0,0,2,2h4v3Z"/><path d="M17,12h8v6h2V12.87A7.52,7.52,0,0,1,23.66,10H17Z"/>',
  solid: '<path d="M13.59,12a3.6,3.6,0,0,1,3.6-3.6H27V5a2,2,0,0,0-2-2H11A2,2,0,0,0,9,5v8.4h4.59Z"/><path d="M30,10H17.19a2,2,0,0,0-2,2v1.4H20A3.6,3.6,0,0,1,23.6,17v8H22V17a2,2,0,0,0-2-2H6a2,2,0,0,0-2,2V31a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V29.6H17.19a3.6,3.6,0,0,1-3.6-3.6V20h1.6v6a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V12A2,2,0,0,0,30,10Z"/>',
  solidAlerted: '<path d="M13.59,12a3.6,3.6,0,0,1,3.6-3.6h2.72L23,3H11A2,2,0,0,0,9,5v8.4h4.59Z"/><path d="M17.19,10a2,2,0,0,0-2,2v1.4H19A3.68,3.68,0,0,1,19,10Z"/><path d="M23.21,15.4A3.55,3.55,0,0,1,23.6,17v8H22V17a2,2,0,0,0-2-2H6a2,2,0,0,0-2,2V31a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V29.6H17.19a3.6,3.6,0,0,1-3.6-3.6V20h1.6v6a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V15.4Z"/>',
  solidBadged: '<path d="M13.59,12a3.6,3.6,0,0,1,3.6-3.6H22.9A7.45,7.45,0,0,1,23.13,3H11A2,2,0,0,0,9,5v8.4h4.59Z"/><path d="M30,13.5A7.49,7.49,0,0,1,23.66,10H17.19a2,2,0,0,0-2,2v1.4H20A3.6,3.6,0,0,1,23.6,17v8H22V17a2,2,0,0,0-2-2H6a2,2,0,0,0-2,2V31a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V29.6H17.19a3.6,3.6,0,0,1-3.6-3.6V20h1.6v6a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V13.22A7.49,7.49,0,0,1,30,13.5Z"/>'
};
var vmIconName = "vm";
var vmIcon = [vmIconName, renderIcon(icon327)];

// node_modules/@clr/core/icon/shapes/vmw-app.js
var icon328 = {
  outline: '<polygon points="28 22 30 22 30 30 22 30 22 28 20 28 20 32 32 32 32 20 28 20 28 22"/><polygon points="14 30 6 30 6 22 8 22 8 20 4 20 4 32 16 32 16 28 14 28 14 30"/><polygon points="8 14 6 14 6 6 14 6 14 8 16 8 16 4 4 4 4 16 8 16 8 14"/><polygon points="20 4 20 8 22 8 22 6 30 6 30 14 28 14 28 16 32 16 32 4 20 4"/><rect x="11" y="11" width="6" height="6"/><rect x="19" y="11" width="6" height="6"/><rect x="11" y="19" width="6" height="6"/><rect x="19" y="19" width="6" height="6"/>',
  outlineAlerted: '<polygon points="28 22 30 22 30 30 22 30 22 28 20 28 20 32 32 32 32 20 28 20 28 22"/><polygon points="14 30 6 30 6 22 8 22 8 20 4 20 4 32 16 32 16 28 14 28 14 30"/><polygon points="8 14 6 14 6 6 14 6 14 8 16 8 16 4 4 4 4 16 8 16 8 14"/><rect x="11" y="11" width="6" height="6"/><rect x="11" y="19" width="6" height="6"/><rect x="19" y="19" width="6" height="6"/><path d="M25,15.4H22.23A3.69,3.69,0,0,1,19,13.56l0-.1V17h6Z"/><polygon points="22.45 4 20 4 20 8 20.14 8 22.45 4"/><rect x="28" y="15.4" width="4" height="0.6"/>',
  outlineBadged: '<polygon points="28 22 30 22 30 30 22 30 22 28 20 28 20 32 32 32 32 20 28 20 28 22"/><polygon points="14 30 6 30 6 22 8 22 8 20 4 20 4 32 16 32 16 28 14 28 14 30"/><polygon points="8 14 6 14 6 6 14 6 14 8 16 8 16 4 4 4 4 16 8 16 8 14"/><rect x="11" y="11" width="6" height="6"/><rect x="11" y="19" width="6" height="6"/><rect x="19" y="19" width="6" height="6"/><path d="M22,6h.5a7.49,7.49,0,0,1,.28-2H20V8h2Z"/><path d="M30,13.5V14H28v2h4V13.22A7.49,7.49,0,0,1,30,13.5Z"/><path d="M25,11.58a7.53,7.53,0,0,1-.58-.58H19v6h6Z"/>'
};
var vmwAppIconName = "vmw-app";
var vmwAppIcon = [vmwAppIconName, renderIcon(icon328)];

// node_modules/@clr/core/icon/shapes/wifi.js
var icon329 = {
  outline: '<path d="M33.55,8.2a28.1,28.1,0,0,0-31.11.08A1,1,0,1,0,3.56,9.94a26.11,26.11,0,0,1,28.89-.07,1,1,0,0,0,1.1-1.67Z"/><path d="M18.05,10.72A20.74,20.74,0,0,0,6.23,14.4,1,1,0,0,0,7.36,16,18.85,18.85,0,0,1,28.64,16a1,1,0,0,0,1.12-1.65A20.75,20.75,0,0,0,18.05,10.72Z"/><path d="M18.05,17.9a13.51,13.51,0,0,0-8,2.64,1,1,0,0,0,1.18,1.61,11.56,11.56,0,0,1,13.62-.08A1,1,0,1,0,26,20.46,13.52,13.52,0,0,0,18.05,17.9Z"/><path d="M18,24.42a4,4,0,1,0,4,4A4,4,0,0,0,18,24.42Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,18,30.42Z"/>',
  solid: '<circle cx="18" cy="29.54" r="3"/><path d="M32.76,9.38a27.87,27.87,0,0,0-29.57,0,1.51,1.51,0,0,0-.48,2.11l.11.17a1.49,1.49,0,0,0,2,.46,24.68,24.68,0,0,1,26.26,0,1.49,1.49,0,0,0,2-.46l.11-.17A1.51,1.51,0,0,0,32.76,9.38Z"/><path d="M28.82,15.44a20.59,20.59,0,0,0-21.7,0,1.51,1.51,0,0,0-.46,2.1l.11.17a1.49,1.49,0,0,0,2,.46,17.4,17.4,0,0,1,18.36,0,1.49,1.49,0,0,0,2-.46l.11-.17A1.51,1.51,0,0,0,28.82,15.44Z"/><path d="M24.88,21.49a13.41,13.41,0,0,0-13.82,0,1.5,1.5,0,0,0-.46,2.09l.1.16a1.52,1.52,0,0,0,2.06.44,10.27,10.27,0,0,1,10.42,0,1.52,1.52,0,0,0,2.06-.45l.1-.16A1.49,1.49,0,0,0,24.88,21.49Z"/>'
};
var wifiIconName = "wifi";
var wifiIcon = [wifiIconName, renderIcon(icon329)];

// node_modules/@clr/core/icon/shapes/bookmark.js
var icon330 = {
  outline: '<path d="M26,34a2,2,0,0,1-1.41-.58L18,26.82l-6.54,6.52A2,2,0,0,1,8,31.93V4a2,2,0,0,1,2-2H26a2,2,0,0,1,2,2V32a2,2,0,0,1-2,2Zm0-2h0V4H10V31.93L18,24Z"/>',
  solid: '<path d="M26,2H10A2,2,0,0,0,8,4V31.93a2,2,0,0,0,3.42,1.41l6.54-6.52,6.63,6.6A2,2,0,0,0,28,32V4A2,2,0,0,0,26,2Z"/>'
};
var bookmarkIconName = "bookmark";
var bookmarkIcon = [bookmarkIconName, renderIcon(icon330)];

// node_modules/@clr/core/icon/shapes/chat-bubble.js
var icon331 = {
  outline: '<path d="M18,2.5c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27C34,8.78,26.82,2.5,18,2.5ZM28.29,24.61a1,1,0,0,0-.32.73l0,5.34-4.38-2.79a1,1,0,0,0-.83-.11A16,16,0,0,1,18,28.5c-7.72,0-14-5.38-14-12s6.28-12,14-12,14,5.38,14,12A11.08,11.08,0,0,1,28.29,24.61Z"/><path d="M25,15.5H11a1,1,0,0,0,0,2H25a1,1,0,0,0,0-2Z"/><path d="M21.75,20.5h-7.5a1,1,0,0,0,0,2h7.5a1,1,0,0,0,0-2Z"/><path d="M11.28,12.5H24.72a1,1,0,0,0,0-2H11.28a1,1,0,0,0,0,2Z"/>',
  outlineBadged: '<path d="M33.38,12.69a7.43,7.43,0,0,1-1.89.66A10.35,10.35,0,0,1,32,16.5a11.08,11.08,0,0,1-3.71,8.11,1,1,0,0,0-.32.73l0,5.34-4.38-2.79a1,1,0,0,0-.83-.11A16,16,0,0,1,18,28.5c-7.72,0-14-5.38-14-12s6.28-12,14-12a16,16,0,0,1,4.55.66A7.44,7.44,0,0,1,23,3.22a18,18,0,0,0-5-.72c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27A12.32,12.32,0,0,0,33.38,12.69Z"/><path d="M11,15.5a1,1,0,0,0,0,2H25a1,1,0,0,0,0-2Z"/><path d="M14.25,20.5a1,1,0,0,0,0,2h7.5a1,1,0,0,0,0-2Z"/><path d="M10.28,11.5a1,1,0,0,0,1,1H24.72a1,1,0,0,0,.83-.47A7.53,7.53,0,0,1,24,10.5H11.28A1,1,0,0,0,10.28,11.5Z"/>',
  solid: '<path d="M18,2.5c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27C34,8.78,26.82,2.5,18,2.5Zm8,14a1,1,0,0,1-1,1H11a1,1,0,0,1,0-2H25A1,1,0,0,1,26,16.5Zm-3.25,5a1,1,0,0,1-1,1h-7.5a1,1,0,0,1,0-2h7.5A1,1,0,0,1,22.75,21.5Zm-12.47-10a1,1,0,0,1,1-1H24.72a1,1,0,0,1,0,2H11.28A1,1,0,0,1,10.28,11.5Z"/>',
  solidBadged: '<path d="M30,13.25a7.46,7.46,0,0,1-4.35-1.4,1,1,0,0,1-.93.65H11.28a1,1,0,0,1,0-2H24.2A7.46,7.46,0,0,1,23,3.2a18,18,0,0,0-5-.7c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27,12.34,12.34,0,0,0-.68-4A7.46,7.46,0,0,1,30,13.25ZM21.75,22.5h-7.5a1,1,0,0,1,0-2h7.5a1,1,0,0,1,0,2Zm3.25-5H11a1,1,0,0,1,0-2H25a1,1,0,0,1,0,2Z"/>'
};
var chatBubbleIconName = "chat-bubble";
var chatBubbleIcon = [chatBubbleIconName, renderIcon(icon331)];

// node_modules/@clr/core/icon/shapes/crown.js
var icon332 = {
  outline: '<path d="M4,13.33A1.39,1.39,0,1,0,2.6,14.72,1.39,1.39,0,0,0,4,13.33Z"/><path d="M31.81,15.84a20.35,20.35,0,0,0-4.58,1.43,22.7,22.7,0,0,0-3.48,2.1A17.69,17.69,0,0,1,22,16.57a47.65,47.65,0,0,1-2.8-7.69,1,1,0,0,0-1-.74,1,1,0,0,0-1,.74,46.71,46.71,0,0,1-2.8,7.69,17,17,0,0,1-1.76,2.8,22.7,22.7,0,0,0-3.48-2.1,20.66,20.66,0,0,0-4.58-1.43,1,1,0,0,0-1,.39,1,1,0,0,0-.09,1.05A50.13,50.13,0,0,1,7.82,31.17a1,1,0,0,0,1,.83H27.62a1,1,0,0,0,1-.83,50.15,50.15,0,0,1,4.26-13.89,1,1,0,0,0-.09-1.05A1,1,0,0,0,31.81,15.84ZM26.79,30H9.64a55.66,55.66,0,0,0-3.4-11.71,15.75,15.75,0,0,1,2.09.78,20,20,0,0,1,3.85,2.45,1,1,0,0,0,1.39-.09,19.28,19.28,0,0,0,2.67-4,43.46,43.46,0,0,0,2-4.89,41.74,41.74,0,0,0,2,4.89,19.92,19.92,0,0,0,2.66,4,1,1,0,0,0,1.4.09,19.21,19.21,0,0,1,3.85-2.45,14.77,14.77,0,0,1,2.09-.78A55.07,55.07,0,0,0,26.79,30Z"/><ellipse cx="33.83" cy="13.33" rx="1.39" ry="1.39"/><path d="M18.22,6.39A1.39,1.39,0,1,0,16.84,5,1.39,1.39,0,0,0,18.22,6.39Z"/><path d="M18.23,26.34a1.11,1.11,0,1,0,1.1,1.1A1.1,1.1,0,0,0,18.23,26.34Z"/><path d="M12.58,26.34a1.11,1.11,0,1,0,1.1,1.1A1.1,1.1,0,0,0,12.58,26.34Z"/><path d="M23.89,26.34a1.11,1.11,0,1,0,1.1,1.1A1.1,1.1,0,0,0,23.89,26.34Z"/>',
  solid: '<path d="M2.6,11.93A1.4,1.4,0,1,0,4,13.33,1.4,1.4,0,0,0,2.6,11.93Z"/><ellipse cx="33.83" cy="13.33" rx="1.39" ry="1.39"/><path d="M18.22,6.39A1.39,1.39,0,1,0,16.84,5,1.39,1.39,0,0,0,18.22,6.39Z"/><path d="M31.63,16.1A18.61,18.61,0,0,0,28,17.34a21.57,21.57,0,0,0-4,2.49,19.2,19.2,0,0,1-2.26-3.49,48.92,48.92,0,0,1-2.52-6.58,1,1,0,0,0-1-.71h0a1,1,0,0,0-1,.71,48.42,48.42,0,0,1-2.52,6.58,18.69,18.69,0,0,1-2.26,3.48,22.81,22.81,0,0,0-4-2.48A18.83,18.83,0,0,0,4.9,16.1a1,1,0,0,0-1,.33,1,1,0,0,0-.13,1.07,55.9,55.9,0,0,1,4,13.5,1,1,0,0,0,1,.83h19a1,1,0,0,0,1-.83,55.9,55.9,0,0,1,4-13.5,1,1,0,0,0-.13-1.07A1,1,0,0,0,31.63,16.1ZM11.08,28.55a1.11,1.11,0,1,1,1.1-1.11A1.11,1.11,0,0,1,11.08,28.55Zm7.15,0a1.11,1.11,0,0,1,0-2.21,1.11,1.11,0,0,1,0,2.21Zm7.16,0a1.11,1.11,0,1,1,1.1-1.11A1.11,1.11,0,0,1,25.39,28.55Z"/>'
};
var crownIconName = "crown";
var crownIcon = [crownIconName, renderIcon(icon332)];

// node_modules/@clr/core/icon/shapes/envelope.js
var icon333 = {
  outline: '<path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6ZM30.46,28H5.66l7-7.24-1.44-1.39L4,26.84V9.52L16.43,21.89a2,2,0,0,0,2.82,0L32,9.21v17.5l-7.36-7.36-1.41,1.41ZM5.31,8H30.38L17.84,20.47Z"/>',
  outlineAlerted: '<path d="M33.68,15.26H32V26.71l-7.36-7.36-1.41,1.41L30.46,28H5.66l7-7.24-1.44-1.39L4,26.84V9.52L16.43,21.89a2,2,0,0,0,2.82,0l6.66-6.63H23.08l-5.24,5.21L5.31,8H20.06l1.15-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V15.24Z"/>',
  outlineBadged: '<path d="M32,13.08V26.71l-7.36-7.36-1.41,1.41L30.46,28H5.66l7-7.24-1.44-1.39L4,26.84V9.52L16.43,21.89a2,2,0,0,0,2.82,0l8.83-8.78a7.44,7.44,0,0,1-2-.85l-8.26,8.21L5.31,8H22.81a7.49,7.49,0,0,1-.31-2H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.2A7.45,7.45,0,0,1,32,13.08Z"/>',
  solid: '<path d="M32.33,6a2,2,0,0,0-.41,0h-28a2,2,0,0,0-.53.08L17.84,20.47Z"/><path d="M33.81,7.39,19.25,21.89a2,2,0,0,1-2.82,0L2,7.5a2,2,0,0,0-.07.5V28a2,2,0,0,0,2,2h28a2,2,0,0,0,2-2V8A2,2,0,0,0,33.81,7.39ZM5.3,28H3.91V26.57l7.27-7.21,1.41,1.41Zm26.61,0H30.51l-7.29-7.23,1.41-1.41,7.27,7.21Z"/>',
  solidAlerted: '<path d="M33.68,15.4H25.77l-6.52,6.49a2,2,0,0,1-2.82,0L2,7.5a2,2,0,0,0-.07.5V28a2,2,0,0,0,2,2h28a2,2,0,0,0,2-2V15.38ZM5.3,28H3.91V26.57l7.27-7.21,1.41,1.41Zm26.61,0H30.51l-7.29-7.23,1.41-1.41,7.27,7.21Z"/><path d="M22.94,15.4h-.7A3.68,3.68,0,0,1,19,9.89L21.29,6H3.92a2,2,0,0,0-.53.08L17.84,20.47Z"/>',
  solidBadged: '<path d="M26,12.34A7.49,7.49,0,0,1,22.5,6H3.92a2,2,0,0,0-.53.08L17.84,20.47Z"/><path d="M30,13.5a7.49,7.49,0,0,1-2-.29l-8.71,8.68a2,2,0,0,1-2.82,0L2,7.5a2,2,0,0,0-.07.5V28a2,2,0,0,0,2,2h28a2,2,0,0,0,2-2V12.39A7.45,7.45,0,0,1,30,13.5ZM5.3,28H3.91V26.57l7.27-7.21,1.41,1.41Zm26.61,0H30.51l-7.29-7.23,1.41-1.41,7.27,7.21Z"/>'
};
var envelopeIconName = "envelope";
var envelopeIcon = [envelopeIconName, renderIcon(icon333)];

// node_modules/@clr/core/icon/shapes/flag.js
var icon334 = {
  outline: '<path d="M6,34a1,1,0,0,1-1-1V3A1,1,0,0,1,7,3V33A1,1,0,0,1,6,34Z"/><path d="M30.55,3.82a1,1,0,0,0-1,0,14.9,14.9,0,0,1-6.13,1.16,13.11,13.11,0,0,1-5.18-1.49,12.78,12.78,0,0,0-5-1.45A10.86,10.86,0,0,0,9,2.85V5.08A8.8,8.8,0,0,1,13.25,4a11.22,11.22,0,0,1,4.2,1.28,14.84,14.84,0,0,0,6,1.66A18.75,18.75,0,0,0,29,6.12V18.95a16.16,16.16,0,0,1-5.58.93,13.11,13.11,0,0,1-5.18-1.49,12.78,12.78,0,0,0-5-1.45A10.86,10.86,0,0,0,9,17.79V20a8.8,8.8,0,0,1,4.25-1.08,11.22,11.22,0,0,1,4.2,1.28,14.84,14.84,0,0,0,6,1.66,16.79,16.79,0,0,0,7-1.37,1,1,0,0,0,.55-.89V4.67A1,1,0,0,0,30.55,3.82Z"/>',
  solid: '<path d="M5.92,2a1,1,0,0,0-1,1V33a1,1,0,0,0,2,0V3A1,1,0,0,0,5.92,2Z"/><path d="M30.5,3.82a1,1,0,0,0-1,0,14.9,14.9,0,0,1-6.13,1.16,13.11,13.11,0,0,1-5.18-1.49A12.78,12.78,0,0,0,13.2,2,10.86,10.86,0,0,0,9,2.85V20a8.8,8.8,0,0,1,4.25-1.08,11.22,11.22,0,0,1,4.2,1.28,14.84,14.84,0,0,0,6,1.66,16.79,16.79,0,0,0,7-1.37,1,1,0,0,0,.55-.89V4.67A1,1,0,0,0,30.5,3.82Z"/>'
};
var flagIconName = "flag";
var flagIcon = [flagIconName, renderIcon(icon334)];

// node_modules/@clr/core/icon/shapes/half-star.js
var icon335 = {
  outline: '<path d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.22.22,0,0,1,.08.24L7.35,31.21A2.23,2.23,0,0,0,9.49,34a2.22,2.22,0,0,0,1.24-.38l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.22,2.22,0,0,0,3.38-2.45l-2.45-8.64a.23.23,0,0,1,.08-.24ZM18.33,26.62h0a2.21,2.21,0,0,0-1.24.38L9.62,32a.22.22,0,0,1-.34-.25l2.45-8.64A2.21,2.21,0,0,0,11,20.76L3.9,15.21a.22.22,0,0,1,.13-.4l9-.34A2.22,2.22,0,0,0,15,13l3.1-8.43a.2.2,0,0,1,.21-.15h0Z"/>',
  solid: '<path d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.23.23,0,0,1,.08.24L7.35,31.21a2.22,2.22,0,0,0,3.38,2.45l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.2,2.2,0,0,0,2.55,0,2.2,2.2,0,0,0,.83-2.4l-2.45-8.64a.22.22,0,0,1,.08-.24ZM24.9,23.11l2.45,8.64A.22.22,0,0,1,27,32l-7.46-5a2.21,2.21,0,0,0-1.24-.38h0V4.44h0a.2.2,0,0,1,.21.15L21.62,13a2.22,2.22,0,0,0,2,1.46l9,.34a.22.22,0,0,1,.13.4l-7.06,5.55A2.21,2.21,0,0,0,24.9,23.11Z"/>'
};
var halfStarIconName = "half-star";
var halfStarIcon = [halfStarIconName, renderIcon(icon335)];

// node_modules/@clr/core/icon/shapes/happy-face.js
var icon336 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><circle cx="10.89" cy="13.89" r="2"/><circle cx="25.05" cy="13.89" r="2"/><path d="M18.13,28.21a8.67,8.67,0,0,0,8.26-6H9.87A8.67,8.67,0,0,0,18.13,28.21Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM8.89,13.89a2,2,0,1,1,2,2A2,2,0,0,1,8.89,13.89Zm9.24,14.32a8.67,8.67,0,0,1-8.26-6H26.38A8.67,8.67,0,0,1,18.13,28.21Zm6.93-12.32a2,2,0,1,1,2-2A2,2,0,0,1,25.05,15.89Z"/>'
};
var happyFaceIconName = "happy-face";
var happyFaceIcon = [happyFaceIconName, renderIcon(icon336)];

// node_modules/@clr/core/icon/shapes/hashtag.js
var icon337 = {
  outline: '<path d="M32,12H25.34l1.55-7.74a1,1,0,0,0-2-.39L23.3,12H15.11l1.55-7.74a1,1,0,0,0-2-.39L13.07,12H6a1,1,0,0,0,0,2h6.67l-1.6,8H4a1,1,0,0,0,0,2h6.66L9.11,31.74a1,1,0,0,0,.79,1.17.68.68,0,0,0,.2,0,1,1,0,0,0,1-.8L12.7,24h8.19l-1.55,7.74a1,1,0,0,0,.79,1.17.62.62,0,0,0,.19,0,1,1,0,0,0,1-.8L22.93,24H30a1,1,0,0,0,0-2H23.33l1.61-8H32a1,1,0,0,0,0-2ZM21.29,22H13.1l1.61-8H22.9Z"/>',
  solid: '<path d="M31.87,10H26.32l1-4.83A1,1,0,0,0,26.35,4h-2a1,1,0,0,0-1,.78L22.33,10h-5.4l1-4.83A1,1,0,0,0,17,4H15a1,1,0,0,0-1,.78L13,10H7a1,1,0,0,0-1,.8l-.41,2a1,1,0,0,0,1,1.2h5.55L10.5,22h-6a1,1,0,0,0-1,.8l-.41,2a1,1,0,0,0,1,1.2H9.68l-1,4.83a1,1,0,0,0,1,1.17h2a1,1,0,0,0,.95-.78L13.67,26h5.4l-1,4.83A1,1,0,0,0,19,32h2a1,1,0,0,0,1-.78L23.05,26h6a1,1,0,0,0,1-.8l.4-2a1,1,0,0,0-1-1.2H23.87l1.63-8h6a1,1,0,0,0,1-.8l.41-2A1,1,0,0,0,31.87,10Zm-12,12h-5.4l1.64-8h5.4Z"/>'
};
var hashtagIconName = "hashtag";
var hashtagIcon = [hashtagIconName, renderIcon(icon337)];

// node_modules/@clr/core/icon/shapes/heart.js
var icon338 = {
  outline: '<path d="M18,32.43a1,1,0,0,1-.61-.21C11.83,27.9,8,24.18,5.32,20.51,1.9,15.82,1.12,11.49,3,7.64c1.34-2.75,5.19-5,9.69-3.69A9.87,9.87,0,0,1,18,7.72a9.87,9.87,0,0,1,5.31-3.77c4.49-1.29,8.35.94,9.69,3.69,1.88,3.85,1.1,8.18-2.32,12.87C28,24.18,24.17,27.9,18.61,32.22A1,1,0,0,1,18,32.43ZM10.13,5.58A5.9,5.9,0,0,0,4.8,8.51c-1.55,3.18-.85,6.72,2.14,10.81A57.13,57.13,0,0,0,18,30.16,57.13,57.13,0,0,0,29.06,19.33c3-4.1,3.69-7.64,2.14-10.81-1-2-4-3.59-7.34-2.65a8,8,0,0,0-4.94,4.2,1,1,0,0,1-1.85,0,7.93,7.93,0,0,0-4.94-4.2A7.31,7.31,0,0,0,10.13,5.58Z"/>',
  solid: '<path d="M33,7.64c-1.34-2.75-5.2-5-9.69-3.69A9.87,9.87,0,0,0,18,7.72a9.87,9.87,0,0,0-5.31-3.77C8.19,2.66,4.34,4.89,3,7.64c-1.88,3.85-1.1,8.18,2.32,12.87C8,24.18,11.83,27.9,17.39,32.22a1,1,0,0,0,1.23,0c5.55-4.31,9.39-8,12.07-11.71C34.1,15.82,34.88,11.49,33,7.64Z"/>'
};
var heartIconName = "heart";
var heartIcon = [heartIconName, renderIcon(icon338)];

// node_modules/@clr/core/icon/shapes/heart-broken.js
var icon339 = {
  outline: '<path d="M33,7.64c-1.34-2.75-5.09-5-9.69-3.69a9.87,9.87,0,0,0-6,4.84,18.9,18.9,0,0,0-2.23,5.33l5.28,2.34-4.6,4.37,3.49,4.1,1.52-1.3L18.54,21l5.4-5.13L17.58,13A16.23,16.23,0,0,1,19.75,8.9a7.68,7.68,0,0,1,4.11-3c3.34-.89,6.34.6,7.34,2.65,1.55,3.18.85,6.72-2.14,10.81A57.16,57.16,0,0,1,18,30.16,57.16,57.16,0,0,1,6.94,19.33c-3-4.1-3.69-7.64-2.14-10.81a5.9,5.9,0,0,1,5.33-2.93,7.31,7.31,0,0,1,2,.29,7.7,7.7,0,0,1,3.38,2l.15-.3a10.66,10.66,0,0,1,1-1.41,9.64,9.64,0,0,0-3.94-2.22C8.2,2.66,4.34,4.89,3,7.64c-1.88,3.85-1.1,8.18,2.32,12.87C8,24.18,11.83,27.9,17.39,32.22a1,1,0,0,0,1.23,0c5.55-4.31,9.39-8,12.07-11.71C34.1,15.82,34.88,11.49,33,7.64Z"/>',
  solid: '<path d="M33,7.64c-1.34-2.75-5.2-5-9.69-3.69A11.55,11.55,0,0,0,18.19,7.5a16.89,16.89,0,0,0-2.48,4.56L22.27,15,16.7,20.26,19,23l-1.57,1.34-3.6-4.22,4.74-4.51-5.44-2.41a19.49,19.49,0,0,1,2.3-5.5,14.77,14.77,0,0,1,1.06-1.54l.06,0a9.66,9.66,0,0,0-3.89-2.18C8.19,2.66,4.34,4.89,3,7.64c-1.88,3.85-1.1,8.18,2.32,12.87C8,24.18,11.83,27.9,17.39,32.22a1,1,0,0,0,1.23,0c5.55-4.31,9.39-8,12.07-11.71C34.1,15.82,34.88,11.49,33,7.64Z"/>'
};
var heartBrokenIconName = "heart-broken";
var heartBrokenIcon = [heartBrokenIconName, renderIcon(icon339)];

// node_modules/@clr/core/icon/shapes/inbox.js
var icon340 = {
  outline: '<path d="M12.23,13.09a1,1,0,0,0,0,1.41L18,20.3l5.79-5.79a1,1,0,0,0-1.41-1.41L19,16.47V2A1,1,0,0,0,18,1a1,1,0,0,0-1,1v14.5l-3.38-3.38A1,1,0,0,0,12.23,13.09Z"/><path d="M29.5,5H22V7h7V21H23.61l-.1.89a5.42,5.42,0,0,1-10.77,0l-.1-.89H7V7h7V5H6.5A1.5,1.5,0,0,0,5,6.5v25A1.5,1.5,0,0,0,6.5,33h23A1.5,1.5,0,0,0,31,31.5V6.5A1.5,1.5,0,0,0,29.5,5ZM29,31H7V23h3.91a7.42,7.42,0,0,0,14.44,0H29Z"/>',
  outlineBadged: '<path d="M12.23,13.09a1,1,0,0,0,0,1.41L18,20.3l5.79-5.79a1,1,0,0,0-1.41-1.41L19,16.47V2A1,1,0,0,0,18,1a1,1,0,0,0-1,1v14.5l-3.38-3.38A1,1,0,0,0,12.23,13.09Z"/><path d="M30,13.5a7.52,7.52,0,0,1-1-.07V21H23.61l-.1.89a5.42,5.42,0,0,1-10.77,0l-.1-.89H7V7h7V5H6.5A1.5,1.5,0,0,0,5,6.5v25A1.5,1.5,0,0,0,6.5,33h23A1.5,1.5,0,0,0,31,31.5V13.43A7.52,7.52,0,0,1,30,13.5ZM29,31H7V23h3.91a7.42,7.42,0,0,0,14.44,0H29Z"/>'
};
var inboxIconName = "inbox";
var inboxIcon = [inboxIconName, renderIcon(icon340)];

// node_modules/@clr/core/icon/shapes/neutral-face.js
var icon341 = {
  outline: '<path d="M24.05,22.06h-12a1,1,0,0,0,0,2h12a1,1,0,0,0,0-2Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><circle cx="25.16" cy="14.28" r="1.8"/><circle cx="11.16" cy="14.28" r="1.8"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm7.05,21.06a1,1,0,0,1-1,1h-12a1,1,0,0,1,0-2h12A1,1,0,0,1,25.05,23.06ZM27,14.28a1.8,1.8,0,1,1-1.8-1.8A1.8,1.8,0,0,1,27,14.28Zm-15.8,1.8a1.8,1.8,0,1,1,1.8-1.8A1.8,1.8,0,0,1,11.16,16.08Z"/>'
};
var neutralFaceIconName = "neutral-face";
var neutralFaceIcon = [neutralFaceIconName, renderIcon(icon341)];

// node_modules/@clr/core/icon/shapes/picture.js
var icon342 = {
  outline: '<path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4ZM4,30V6H32V30Z"/><path d="M8.92,14a3,3,0,1,0-3-3A3,3,0,0,0,8.92,14Zm0-4.6A1.6,1.6,0,1,1,7.33,11,1.6,1.6,0,0,1,8.92,9.41Z"/><path d="M22.78,15.37l-5.4,5.4-4-4a1,1,0,0,0-1.41,0L5.92,22.9v2.83l6.79-6.79L16,22.18l-3.75,3.75H15l8.45-8.45L30,24V21.18l-5.81-5.81A1,1,0,0,0,22.78,15.37Z"/>',
  outlineBadged: '<path d="M11.93,11a3,3,0,1,0-3,3A3,3,0,0,0,11.93,11Zm-4.6,0a1.6,1.6,0,1,1,1.6,1.6A1.6,1.6,0,0,1,7.33,11Z"/><path d="M17.38,20.77l-4-4a1,1,0,0,0-1.41,0L5.92,22.9v2.83l6.79-6.79L16,22.18l-3.75,3.75H15l8.45-8.45L30,24V21.18l-5.81-5.81a1,1,0,0,0-1.41,0Z"/><path d="M32,13.22V30H4V6H22.5a7.49,7.49,0,0,1,.28-2H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.45,7.45,0,0,1,32,13.22Z"/>',
  solid: '<path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4ZM8.92,8a3,3,0,1,1-3,3A3,3,0,0,1,8.92,8ZM6,27V22.9l6-6.08a1,1,0,0,1,1.41,0L16,19.35,8.32,27Zm24,0H11.15l6.23-6.23,5.4-5.4a1,1,0,0,1,1.41,0L30,21.18Z"/>',
  solidBadged: '<path d="M30,13.5A7.48,7.48,0,0,1,22.78,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V12.34A7.46,7.46,0,0,1,30,13.5ZM8.92,8a3,3,0,1,1-3,3A3,3,0,0,1,8.92,8ZM6,27V22.9l6-6.08a1,1,0,0,1,1.41,0L16,19.35,8.32,27Zm24,0H11.15l6.23-6.23,5.4-5.4a1,1,0,0,1,1.41,0L30,21.18Z"/>'
};
var pictureIconName = "picture";
var pictureIcon = [pictureIconName, renderIcon(icon342)];

// node_modules/@clr/core/icon/shapes/sad-face.js
var icon343 = {
  outline: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"/><circle cx="25.16" cy="14.28" r="1.8"/><circle cx="11.41" cy="14.28" r="1.8"/><path d="M18.16,20a9,9,0,0,0-7.33,3.78,1,1,0,1,0,1.63,1.16,7,7,0,0,1,11.31-.13,1,1,0,0,0,1.6-1.2A9,9,0,0,0,18.16,20Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm9,12.28a1.8,1.8,0,1,1-1.8-1.8A1.8,1.8,0,0,1,27,14.28Zm-15.55,1.8a1.8,1.8,0,1,1,1.8-1.8A1.8,1.8,0,0,1,11.41,16.08Zm14,7.53a1,1,0,0,1-1.6,1.2,7,7,0,0,0-11.31.13,1,1,0,1,1-1.63-1.16,9,9,0,0,1,14.54-.17Z"/>'
};
var sadFaceIconName = "sad-face";
var sadFaceIcon = [sadFaceIconName, renderIcon(icon343)];

// node_modules/@clr/core/icon/shapes/share.js
var icon344 = {
  outline: '<path d="M27.53,24a5,5,0,0,0-3.6,1.55L11.74,19.45a4.47,4.47,0,0,0,0-2.8l12.21-6.21a5.12,5.12,0,1,0-1.07-1.7L10.79,14.89a5,5,0,1,0,0,6.33l12.06,6.07A4.93,4.93,0,0,0,22.54,29a5,5,0,1,0,5-5Zm0-20a3,3,0,1,1-3,3A3,3,0,0,1,27.53,4ZM7,21a3,3,0,1,1,3-3A3,3,0,0,1,7,21ZM27.53,32a3,3,0,1,1,3-3A3,3,0,0,1,27.53,32Z"/>',
  solid: '<path d="M27.53,24a5,5,0,0,0-3.6,1.55L11.74,19.45a4.47,4.47,0,0,0,0-2.8l12.21-6.21a5.12,5.12,0,1,0-1.07-1.7L10.79,14.89a5,5,0,1,0,0,6.33l12.06,6.07A4.93,4.93,0,0,0,22.54,29a5,5,0,1,0,5-5Z"/>'
};
var shareIconName = "share";
var shareIcon = [shareIconName, renderIcon(icon344)];

// node_modules/@clr/core/icon/shapes/star.js
var icon345 = {
  outline: '<path d="M27.19,34a2.22,2.22,0,0,1-1.24-.38l-7.46-5a.22.22,0,0,0-.25,0l-7.46,5A2.22,2.22,0,0,1,7.4,31.21l2.45-8.64a.23.23,0,0,0-.08-.24L2.71,16.78a2.22,2.22,0,0,1,1.29-4l9-.34a.23.23,0,0,0,.2-.15l3.1-8.43a2.22,2.22,0,0,1,4.17,0l3.1,8.43a.23.23,0,0,0,.2.15l9,.34a2.22,2.22,0,0,1,1.29,4L27,22.33a.22.22,0,0,0-.08.24l2.45,8.64A2.23,2.23,0,0,1,27.19,34Zm-8.82-7.42A2.21,2.21,0,0,1,19.6,27l7.46,5a.22.22,0,0,0,.34-.25l-2.45-8.64a2.21,2.21,0,0,1,.77-2.35l7.06-5.55a.22.22,0,0,0-.13-.4l-9-.34a2.22,2.22,0,0,1-2-1.46l-3.1-8.43a.22.22,0,0,0-.42,0L15.06,13a2.22,2.22,0,0,1-2,1.46l-9,.34a.22.22,0,0,0-.13.4L11,20.76a2.22,2.22,0,0,1,.77,2.35L9.33,31.75a.21.21,0,0,0,.08.24.2.2,0,0,0,.26,0l7.46-5A2.22,2.22,0,0,1,18.36,26.62Z"/>',
  solid: '<path d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.23.23,0,0,1,.08.24L7.35,31.21a2.22,2.22,0,0,0,3.38,2.45l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.2,2.2,0,0,0,2.55,0,2.2,2.2,0,0,0,.83-2.4l-2.45-8.64a.22.22,0,0,1,.08-.24Z"/>'
};
var starIconName = "star";
var starIcon = [starIconName, renderIcon(icon345)];

// node_modules/@clr/core/icon/shapes/talk-bubbles.js
var icon346 = {
  outline: '<path d="M23,26a1,1,0,0,1-1,1H8c-.22,0-.43.2-.61.33L4,30V14a1,1,0,0,1,1-1H8.86V11H5a3,3,0,0,0-3,3V32a1,1,0,0,0,.56.89,1,1,0,0,0,1-.1L8.71,29H22.15A2.77,2.77,0,0,0,25,26.13V25H23Z"/><path d="M31,4H14a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3H27.55l4.78,3.71a1,1,0,0,0,1,.11,1,1,0,0,0,.57-.9V7A3,3,0,0,0,31,4ZM32,22.94,28.5,20.21a1,1,0,0,0-.61-.21H14a1,1,0,0,1-1-1V7a1,1,0,0,1,1-1H31A1.1,1.1,0,0,1,32,7.06Z"/>',
  outlineBadged: '<path d="M23,26a1,1,0,0,1-1,1H8c-.22,0-.43.2-.61.33L4,30V14a1,1,0,0,1,1-1H8.86V11H5a3,3,0,0,0-3,3V32a1,1,0,0,0,.56.89,1,1,0,0,0,1-.1L8.71,29H22.15A2.77,2.77,0,0,0,25,26.13V25H23Z"/><path d="M32,13.22v9.72L28.5,20.21a1,1,0,0,0-.61-.21H14a1,1,0,0,1-1-1V7a1,1,0,0,1,1-1H22.5a7.49,7.49,0,0,1,.28-2H14a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3H27.55l4.78,3.71a1,1,0,0,0,1,.11,1,1,0,0,0,.57-.9V12.37A7.45,7.45,0,0,1,32,13.22Z"/>',
  solid: '<path d="M8,19V11H5a3,3,0,0,0-3,3V32a1,1,0,0,0,.56.89,1,1,0,0,0,1-.1L8.71,29H22.15A2.77,2.77,0,0,0,25,26.13V25H14A6,6,0,0,1,8,19Z"/><path d="M31,4H14a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3H27.55l4.78,3.71a1,1,0,0,0,1,.11,1,1,0,0,0,.57-.9V7A3,3,0,0,0,31,4Z"/>',
  solidBadged: '<path d="M8,19V11H5a3,3,0,0,0-3,3V32a1,1,0,0,0,.56.89,1,1,0,0,0,1-.1L8.71,29H22.15A2.77,2.77,0,0,0,25,26.13V25H14A6,6,0,0,1,8,19Z"/><path d="M30,13.5A7.48,7.48,0,0,1,22.78,4H14a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3H27.55l4.78,3.71a1,1,0,0,0,1,.11,1,1,0,0,0,.57-.9V12.37A7.45,7.45,0,0,1,30,13.5Z"/>'
};
var talkBubblesIconName = "talk-bubbles";
var talkBubblesIcon = [talkBubblesIconName, renderIcon(icon346)];

// node_modules/@clr/core/icon/shapes/tasks.js
var icon347 = {
  outline: '<path d="M29.29,34H6.71A1.7,1.7,0,0,1,5,32.31V6.69A1.75,1.75,0,0,1,7,5H9V7H7V32H29V7H27V5h2.25A1.7,1.7,0,0,1,31,6.69V32.31A1.7,1.7,0,0,1,29.29,34Z"/><path d="M16.66,25.76,11.3,20.4A1,1,0,0,1,12.72,19l3.94,3.94,8.64-8.64a1,1,0,0,1,1.41,1.41Z"/><path d="M26,11H10V7.33A2.34,2.34,0,0,1,12.33,5h1.79a4,4,0,0,1,7.75,0h1.79A2.34,2.34,0,0,1,26,7.33ZM12,9H24V7.33A.33.33,0,0,0,23.67,7H20V6a2,2,0,0,0-4,0V7H12.33a.33.33,0,0,0-.33.33Z"/>',
  outlineAlerted: '<path d="M19,9.89,19.56,9H12V7.33A.33.33,0,0,1,12.33,7H16V6a2,2,0,0,1,4,0V7h.71l1.16-2a4,4,0,0,0-7.74,0H12.33A2.34,2.34,0,0,0,10,7.33V11h8.64A3.65,3.65,0,0,1,19,9.89Z"/><path d="M24.19,15.4l-7.53,7.53L12.72,19A1,1,0,0,0,11.3,20.4l5.36,5.36L26.71,15.71a1,1,0,0,0,.2-.31Z"/><path d="M29,15.4V32H7V7H9V5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V15.4Z"/>',
  outlineBadged: '<path d="M12.72,19A1,1,0,0,0,11.3,20.4l5.36,5.36L26.71,15.71a1,1,0,0,0-1.41-1.41l-8.64,8.64Z"/><path d="M23.13,9H12V7.33A.33.33,0,0,1,12.33,7H16V6a2,2,0,0,1,4,0V7h2.57a7.52,7.52,0,0,1-.07-1,7.52,7.52,0,0,1,.07-1h-.7a4,4,0,0,0-7.75,0H12.33A2.34,2.34,0,0,0,10,7.33V11H24.42A7.5,7.5,0,0,1,23.13,9Z"/><path d="M30,13.5a7.52,7.52,0,0,1-1-.07V32H7V7H9V5H7A1.75,1.75,0,0,0,5,6.69V32.31A1.7,1.7,0,0,0,6.71,34H29.29A1.7,1.7,0,0,0,31,32.31V13.43A7.52,7.52,0,0,1,30,13.5Z"/>',
  solid: '<path d="M29.29,4.95h-7.2a4.31,4.31,0,0,0-8.17,0H7A1.75,1.75,0,0,0,5,6.64V32.26a1.7,1.7,0,0,0,1.71,1.69H29.29A1.7,1.7,0,0,0,31,32.26V6.64A1.7,1.7,0,0,0,29.29,4.95Zm-18,3a1,1,0,0,1,1-1h3.44V6.32a2.31,2.31,0,0,1,4.63,0V7h3.44a1,1,0,0,1,1,1V9.8H11.25Zm14.52,9.23-9.12,9.12-5.24-5.24a1.4,1.4,0,0,1,2-2l3.26,3.26,7.14-7.14a1.4,1.4,0,1,1,2,2Z"/>',
  solidAlerted: '<path d="M25.88,15.4a1.38,1.38,0,0,1-.11,1.81l-9.12,9.12-5.24-5.24a1.4,1.4,0,0,1,2-2l3.26,3.26,7-7H22.23A3.68,3.68,0,0,1,19,9.89l0-.09H11.25V8a1,1,0,0,1,1-1h3.44V6.32a2.31,2.31,0,0,1,4.63,0V7h.42L22,4.76a4.3,4.3,0,0,0-8.09.19H7A1.75,1.75,0,0,0,5,6.64V32.26a1.7,1.7,0,0,0,1.71,1.69H29.29A1.7,1.7,0,0,0,31,32.26V15.4Z"/>',
  solidBadged: '<path d="M30,13.5a7.49,7.49,0,0,1-6.46-3.7H11.25V8a1,1,0,0,1,1-1h3.44V6.32a2.31,2.31,0,0,1,4.63,0V7h2.26a7.53,7.53,0,0,1-.07-1,7.53,7.53,0,0,1,.08-1.05h-.5a4.31,4.31,0,0,0-8.17,0H7A1.75,1.75,0,0,0,5,6.64V32.26a1.7,1.7,0,0,0,1.71,1.69H29.29A1.7,1.7,0,0,0,31,32.26V13.43A7.52,7.52,0,0,1,30,13.5Zm-4.23,3.71-9.12,9.12-5.24-5.24a1.4,1.4,0,0,1,2-2l3.26,3.26,7.14-7.14a1.4,1.4,0,1,1,2,2Z"/>'
};
var tasksIconName = "tasks";
var tasksIcon = [tasksIconName, renderIcon(icon347)];

// node_modules/@clr/core/icon/shapes/thumbs-down.js
var icon348 = {
  outline: '<path d="M12,10c2.92-1.82,7.3-4,9.37-4h6a16.68,16.68,0,0,1,3.31,6.08A26.71,26.71,0,0,1,32,20H23V30a2.05,2.05,0,0,1-1.26,1.69c-.77-2-2.62-6.57-4.23-8.72A11.39,11.39,0,0,0,12,19.09v2.13a9.13,9.13,0,0,1,3.91,3c1.88,2.51,4.29,9.11,4.31,9.17a1,1,0,0,0,1.19.63C22.75,33.62,25,32.4,25,30V22h8a1,1,0,0,0,1-1,29,29,0,0,0-1.4-9.62c-1.89-5.4-4.1-7.14-4.2-7.22A1,1,0,0,0,27.79,4H21.37C18.94,4,14.83,6,12,7.63Z"/><path d="M2,5H9a1,1,0,0,1,1,1V22a1,1,0,0,1-1,1H2ZM8,7H4V21H8Z"/>',
  solid: '<path d="M16.37,23.84c2.12,2.84,4.76,10.07,4.76,10.07S24,33.13,24,30.71V21h9.77a29.46,29.46,0,0,0-1.44-9.74C30.39,5.68,28.2,4,28.2,4H21.35C19.1,4,15,5.9,12,7.65v12.8A10.84,10.84,0,0,1,16.37,23.84Z"/><path d="M9,23a1,1,0,0,0,1-1V6A1,1,0,0,0,9,5H2V23Z"/>'
};
var thumbsDownIconName = "thumbs-down";
var thumbsDownIcon = [thumbsDownIconName, renderIcon(icon348)];

// node_modules/@clr/core/icon/shapes/thumbs-up.js
var icon349 = {
  outline: '<path d="M24,26c-2.92,1.82-7.3,4-9.37,4h-6a16.68,16.68,0,0,1-3.31-6.08A26.71,26.71,0,0,1,4,16h9V6a2.05,2.05,0,0,1,1.26-1.69c.77,2,2.62,6.57,4.23,8.72A11.39,11.39,0,0,0,24,16.91V14.78a9.13,9.13,0,0,1-3.91-3c-1.88-2.51-4.29-9.11-4.31-9.17A1,1,0,0,0,14.59,2C13.25,2.38,11,3.6,11,6v8H3a1,1,0,0,0-1,1,29,29,0,0,0,1.4,9.62c1.89,5.4,4.1,7.14,4.2,7.22a1,1,0,0,0,.61.21h6.42c2.43,0,6.55-2,9.37-3.63Z"/><path d="M34,31H27a1,1,0,0,1-1-1V14a1,1,0,0,1,1-1h7Zm-6-2h4V15H28Z"/>',
  solid: '<path d="M19.63,12.12C17.51,9.28,14.88,2,14.88,2S12,2.83,12,5.25V15H2.23a29.46,29.46,0,0,0,1.44,9.74C5.61,30.27,7.8,32,7.8,32h6.86C16.9,32,21,30.06,24,28.31V15.51A10.84,10.84,0,0,1,19.63,12.12Z"/><path d="M27,13a1,1,0,0,0-1,1V30a1,1,0,0,0,1,1h7V13Z"/>'
};
var thumbsUpIconName = "thumbs-up";
var thumbsUpIcon = [thumbsUpIconName, renderIcon(icon349)];

// node_modules/@clr/core/icon/shapes/align-bottom.js
var icon350 = {
  outline: '<path d="M34,30H2a1,1,0,0,0,0,2H34a1,1,0,0,0,0-2Z"/><path d="M16,5a1,1,0,0,0-1-1H7A1,1,0,0,0,6,5V28H16ZM14,26H8V6h6Z"/><path d="M30,13a1,1,0,0,0-1-1H21a1,1,0,0,0-1,1V28H30ZM28,26H22V14h6Z"/>'
};
var alignBottomIconName = "align-bottom";
var alignBottomIcon = [alignBottomIconName, renderIcon(icon350)];

// node_modules/@clr/core/icon/shapes/align-center.js
var icon351 = {
  outline: '<path d="M31,20H19V16h6a1,1,0,0,0,1-1V7a1,1,0,0,0-1-1H19V2a1,1,0,0,0-2,0V6H11a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1h6v4H5a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H17v4a1,1,0,0,0,2,0V30H31a1,1,0,0,0,1-1V21A1,1,0,0,0,31,20ZM12,14V8H24v6ZM30,28H6V22H30Z"/>'
};
var alignCenterIconName = "align-center";
var alignCenterIcon = [alignCenterIconName, renderIcon(icon351)];

// node_modules/@clr/core/icon/shapes/align-left.js
var icon352 = {
  outline: '<path d="M5,1A1,1,0,0,0,4,2V34a1,1,0,0,0,2,0V2A1,1,0,0,0,5,1Z"/><path d="M31,20H8V30H31a1,1,0,0,0,1-1V21A1,1,0,0,0,31,20Zm-1,8H10V22H30Z"/><path d="M24,15V7a1,1,0,0,0-1-1H8V16H23A1,1,0,0,0,24,15Zm-2-1H10V8H22Z"/>'
};
var alignLeftIconName = "align-left";
var alignLeftIcon = [alignLeftIconName, renderIcon(icon352)];

// node_modules/@clr/core/icon/shapes/align-left-text.js
var icon353 = {
  outline: '<path d="M20.25,26H6v2.2H20.25a1.1,1.1,0,0,0,0-2.2Z"/><path d="M28,20H6v2.2H28A1.1,1.1,0,0,0,28,20Z"/><path d="M22.6,15.1A1.1,1.1,0,0,0,21.5,14H6v2.2H21.5A1.1,1.1,0,0,0,22.6,15.1Z"/><path d="M29.25,8H6v2.2H29.25a1.1,1.1,0,1,0,0-2.2Z"/>'
};
var alignLeftTextIconName = "align-left-text";
var alignLeftTextIcon = [alignLeftTextIconName, renderIcon(icon353)];

// node_modules/@clr/core/icon/shapes/align-middle.js
var icon354 = {
  outline: '<path d="M34,17H30V11a1,1,0,0,0-1-1H21a1,1,0,0,0-1,1v6H16V5a1,1,0,0,0-1-1H7A1,1,0,0,0,6,5V17H2a1,1,0,0,0,0,2H6V31a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V19h4v6a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V19h4a1,1,0,0,0,0-2ZM14,30H8V6h6Zm14-6H22V12h6Z"/>'
};
var alignMiddleIconName = "align-middle";
var alignMiddleIcon = [alignMiddleIconName, renderIcon(icon354)];

// node_modules/@clr/core/icon/shapes/align-right.js
var icon355 = {
  outline: '<path d="M31,1a1,1,0,0,0-1,1V34a1,1,0,0,0,2,0V2A1,1,0,0,0,31,1Z"/><path d="M4,21v8a1,1,0,0,0,1,1H28V20H5A1,1,0,0,0,4,21Zm2,1H26v6H6Z"/><path d="M12,7v8a1,1,0,0,0,1,1H28V6H13A1,1,0,0,0,12,7Zm2,1H26v6H14Z"/>'
};
var alignRightIconName = "align-right";
var alignRightIcon = [alignRightIconName, renderIcon(icon355)];

// node_modules/@clr/core/icon/shapes/align-right-text.js
var icon356 = {
  outline: '<path d="M14.65,27.1a1.1,1.1,0,0,0,1.1,1.1H30V26H15.75A1.1,1.1,0,0,0,14.65,27.1Z"/><path d="M6.9,21.1A1.1,1.1,0,0,0,8,22.2H30V20H8A1.1,1.1,0,0,0,6.9,21.1Z"/><path d="M13.4,15.1a1.1,1.1,0,0,0,1.1,1.1H30V14H14.5A1.1,1.1,0,0,0,13.4,15.1Z"/><path d="M6.75,8a1.1,1.1,0,1,0,0,2.2H30V8Z"/>'
};
var alignRightTextIconName = "align-right-text";
var alignRightTextIcon = [alignRightTextIconName, renderIcon(icon356)];

// node_modules/@clr/core/icon/shapes/align-top.js
var icon357 = {
  outline: '<path d="M34,4H2A1,1,0,0,0,2,6H34a1,1,0,0,0,0-2Z"/><path d="M6,31a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V8H6ZM8,10h6V30H8Z"/><path d="M20,23a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V8H20Zm2-13h6V22H22Z"/>'
};
var alignTopIconName = "align-top";
var alignTopIcon = [alignTopIconName, renderIcon(icon357)];

// node_modules/@clr/core/icon/shapes/block-quote.js
var icon358 = {
  outline: '<path d="M11.86,16.55a4.31,4.31,0,0,0-2.11.56,14.44,14.44,0,0,1,4.36-6,1.1,1.1,0,0,0-1.4-1.7c-4,3.25-5.78,7.75-5.78,10.54A5.08,5.08,0,0,0,10,24.58a4.4,4.4,0,0,0,1.88.44,4.24,4.24,0,1,0,0-8.47Z"/><path d="M23,16.55a4.29,4.29,0,0,0-2.11.56,14.5,14.5,0,0,1,4.35-6,1.1,1.1,0,1,0-1.39-1.7c-4,3.25-5.78,7.75-5.78,10.54a5.08,5.08,0,0,0,3,4.61A4.37,4.37,0,0,0,23,25a4.24,4.24,0,1,0,0-8.47Z"/>'
};
var blockQuoteIconName = "block-quote";
var blockQuoteIcon = [blockQuoteIconName, renderIcon(icon358)];

// node_modules/@clr/core/icon/shapes/bold.js
var icon359 = {
  outline: '<path d="M22.43,17.54a4.67,4.67,0,0,0,2.8-4.37v-.06a4.43,4.43,0,0,0-1.31-3.25,7.09,7.09,0,0,0-5.13-1.73h-7A1.71,1.71,0,0,0,10,9.86V26a1.72,1.72,0,0,0,1.74,1.74h7.33c4.37,0,7.25-1.88,7.25-5.38V22.3C26.32,19.64,24.73,18.32,22.43,17.54ZM13.68,11.4h4.54c2,0,3.15.89,3.15,2.33v.06c0,1.68-1.36,2.49-3.38,2.49H13.68ZM22.37,22c0,1.59-1.31,2.43-3.46,2.43H13.68V19.62h5c2.49,0,3.69.88,3.69,2.37Z"/>'
};
var boldIconName = "bold";
var boldIcon = [boldIconName, renderIcon(icon359)];

// node_modules/@clr/core/icon/shapes/bullet-list.js
var icon360 = {
  outline: '<circle cx="5.21" cy="9.17" r="2"/><circle cx="5.21" cy="17.17" r="2"/><circle cx="5.21" cy="25.17" r="2"/><path d="M32.42,9a1,1,0,0,0-1-1H10v2H31.42A1,1,0,0,0,32.42,9Z"/><path d="M31.42,16H10v2H31.42a1,1,0,0,0,0-2Z"/><path d="M31.42,24H10v2H31.42a1,1,0,0,0,0-2Z"/>'
};
var bulletListIconName = "bullet-list";
var bulletListIcon = [bulletListIconName, renderIcon(icon360)];

// node_modules/@clr/core/icon/shapes/center-text.js
var icon361 = {
  outline: '<path d="M30.88,8H5.12a1.1,1.1,0,0,0,0,2.2H30.88a1.1,1.1,0,1,0,0-2.2Z"/><path d="M25.5,16.2a1.1,1.1,0,1,0,0-2.2h-15a1.1,1.1,0,1,0,0,2.2Z"/><path d="M30.25,20H5.75a1.1,1.1,0,0,0,0,2.2h24.5a1.1,1.1,0,0,0,0-2.2Z"/><path d="M24.88,26H11.12a1.1,1.1,0,1,0,0,2.2H24.88a1.1,1.1,0,1,0,0-2.2Z"/>'
};
var centerTextIconName = "center-text";
var centerTextIcon = [centerTextIconName, renderIcon(icon361)];

// node_modules/@clr/core/icon/shapes/checkbox-list.js
var icon362 = {
  outline: '<path d="M31.43,16H10v2H31.43a1,1,0,0,0,0-2Z"/><path d="M31.43,24H10v2H31.43a1,1,0,0,0,0-2Z"/><path d="M15.45,10h16a1,1,0,0,0,0-2h-14Z"/><path d="M17.5,3.42a1.09,1.09,0,0,0-1.55,0L7.89,11.48,4.51,7.84A1.1,1.1,0,1,0,2.9,9.34l4.94,5.3L17.5,5A1.1,1.1,0,0,0,17.5,3.42Z"/>'
};
var checkboxListIconName = "checkbox-list";
var checkboxListIcon = [checkboxListIconName, renderIcon(icon362)];

// node_modules/@clr/core/icon/shapes/font-size.js
var icon363 = {
  outline: '<path d="M21,9.08A1.13,1.13,0,0,0,19.86,8H4.62a1.1,1.1,0,1,0,0,2.19H11V27a1.09,1.09,0,0,0,2.17,0V10.19h6.69A1.14,1.14,0,0,0,21,9.08Z"/><path d="M30.67,15H21.15a1.1,1.1,0,1,0,0,2.19H25V26.5a1.09,1.09,0,0,0,2.17,0V17.23h3.54a1.1,1.1,0,1,0,0-2.19Z"/>'
};
var fontSizeIconName = "font-size";
var fontSizeIcon = [fontSizeIconName, renderIcon(icon363)];

// node_modules/@clr/core/icon/shapes/highlighter.js
var icon364 = {
  outline: '<path d="M15.82,26.06a1,1,0,0,1-.71-.29L8.67,19.33a1,1,0,0,1-.29-.71,1,1,0,0,1,.29-.71L23,3.54a5.55,5.55,0,1,1,7.85,7.86L16.53,25.77A1,1,0,0,1,15.82,26.06Zm-5-7.44,5,5L29.48,10a3.54,3.54,0,0,0,0-5,3.63,3.63,0,0,0-5,0Z"/><path d="M10.38,28.28A1,1,0,0,1,9.67,28L6.45,24.77a1,1,0,0,1-.22-1.09l2.22-5.44a1,1,0,0,1,1.63-.33l6.45,6.44A1,1,0,0,1,16.2,26l-5.44,2.22A1.33,1.33,0,0,1,10.38,28.28ZM8.33,23.82l2.29,2.28,3.43-1.4L9.74,20.39Z"/><path d="M8.94,30h-5a1,1,0,0,1-.84-1.55l3.22-4.94a1,1,0,0,1,1.55-.16l3.21,3.22a1,1,0,0,1,.06,1.35L9.7,29.64A1,1,0,0,1,8.94,30ZM5.78,28H8.47L9,27.34l-1.7-1.7Z"/><rect x="3.06" y="31" width="30" height="3"/>'
};
var highlighterIconName = "highlighter";
var highlighterIcon = [highlighterIconName, renderIcon(icon364)];

// node_modules/@clr/core/icon/shapes/indent.js
var icon365 = {
  outline: '<path d="M31.06,9h-26a1,1,0,1,1,0-2h26a1,1,0,1,1,0,2Z"/><path d="M31.06,14h-17a1,1,0,0,1,0-2h17a1,1,0,1,1,0,2Z"/><path d="M31.06,19h-17a1,1,0,0,1,0-2h17a1,1,0,1,1,0,2Z"/><path d="M31.06,24h-17a1,1,0,0,1,0-2h17a1,1,0,1,1,0,2Z"/><path d="M31.06,29h-26a1,1,0,0,1,0-2h26a1,1,0,1,1,0,2Z"/><path d="M5.56,22.54a1,1,0,0,1-.7-1.71L7.68,18,4.86,15.17a1,1,0,0,1,0-1.41,1,1,0,0,1,1.41,0L10.51,18,6.27,22.24A1,1,0,0,1,5.56,22.54Z"/>'
};
var indentIconName = "indent";
var indentIcon = [indentIconName, renderIcon(icon365)];

// node_modules/@clr/core/icon/shapes/italic.js
var icon366 = {
  outline: '<path d="M24.42,8H17.1a1.1,1.1,0,1,0,0,2.19h2.13L13.11,25.55H10.47a1.1,1.1,0,1,0,0,2.19H17.8a1.1,1.1,0,1,0,0-2.19H15.51l6.13-15.36h2.78a1.1,1.1,0,1,0,0-2.19Z"/>'
};
var italicIconName = "italic";
var italicIcon = [italicIconName, renderIcon(icon366)];

// node_modules/@clr/core/icon/shapes/justify-text.js
var icon367 = {
  outline: '<path d="M6,10.2H31.75a1.1,1.1,0,1,0,0-2.2H6a1.1,1.1,0,1,0,0,2.2Z"/><path d="M31.75,14H6a1.1,1.1,0,1,0,0,2.2H31.75a1.1,1.1,0,1,0,0-2.2Z"/><path d="M31.12,20H6.62a1.1,1.1,0,1,0,0,2.2h24.5a1.1,1.1,0,1,0,0-2.2Z"/><path d="M30.45,25.83H6.6a1.1,1.1,0,0,0,0,2.2H30.45a1.1,1.1,0,0,0,0-2.2Z"/>'
};
var justifyTextIconName = "justify-text";
var justifyTextIcon = [justifyTextIconName, renderIcon(icon367)];

// node_modules/@clr/core/icon/shapes/language.js
var icon368 = {
  outline: '<path d="M30,3H14v5h2V5h14c0.6,0,1,0.4,1,1v11c0,0.6-0.4,1-1,1H17v7h-5.3L8,27.9V25H5c-0.6,0-1-0.4-1-1V13c0-0.6,0.4-1,1-1h13v-2H5c-1.7,0-3,1.3-3,3v11c0,1.7,1.3,3,3,3h1v5.1l6.3-5.1H19v-7h11c1.7,0,3-1.3,3-3V6C33,4.3,31.7,3,30,3z"/><path d="M6.2,22.9h2.4l0.6-1.6h3.1l0.6,1.6h2.4L11.9,14H9.5L6.2,22.9z M10.7,16.5l1,3.1h-2L10.7,16.5z"/><path d="M20,17c1.1,0,2.6-0.3,4-1c1.4,0.7,3,1,4,1v-2c0,0-1,0-2.1-0.4c1.2-1.2,2.1-3,2.1-5.6V8h-3V6h-2v2h-3v2h5.9c-0.2,1.8-1,2.9-1.9,3.6c-0.6-0.5-1.2-1.2-1.6-2.1h-2.1c0.4,1.3,1,2.3,1.8,3.1C21.1,15,20.2,15,20,15V17z"/>',
  solid: '<polygon points="11,16.5 10,19.6 12,19.6 11,16.5 	"/><path d="M30.3,3h-16v5h4v2h-13c-1.7,0-3,1.3-3,3v11c0,1.7,1.3,3,3,3h1v5.1l6.3-5.1h6.7v-7h11c1.7,0,3-1.3,3-3V6C33.3,4.3,32,3,30.3,3z M13.1,22.9l-0.5-1.6H9.5l-0.6,1.6H6.5L9.8,14h2.4l3.3,8.9L13.1,22.9z M28.3,15v2c-1.3,0-2.7-0.4-3.9-1c-1.2,0.6-2.6,0.9-4,1l-0.1-2c0.7,0,1.4-0.1,2.1-0.3c-0.9-0.9-1.5-2-1.8-3.2h2.1c0.3,0.9,0.9,1.6,1.6,2.2c1.1-0.9,1.8-2.2,1.9-3.7h-6V8h3V6h2v2h3.3l0.1,1c0.1,2.1-0.7,4.2-2.2,5.7C27.1,14.9,27.7,15,28.3,15z"/>'
};
var languageIconName = "language";
var languageIcon = [languageIconName, renderIcon(icon368)];

// node_modules/@clr/core/icon/shapes/number-list.js
var icon369 = {
  outline: '<polygon points="5.46 7.41 5.46 11.56 6.65 11.56 6.65 6.05 5.7 6.05 4.05 7.16 4.52 8 5.46 7.41"/><path d="M5.57,14.82a.76.76,0,0,1,.83.73c0,.38-.21.74-.87,1.27l-2,1.57v1H7.67V18.28H5.33l1-.77c1-.7,1.28-1.27,1.28-2a1.83,1.83,0,0,0-2-1.76,2.63,2.63,0,0,0-2.14,1.08l.76.73A1.75,1.75,0,0,1,5.57,14.82Z"/><path d="M6.56,24.64a1.32,1.32,0,0,0,1-1.27c0-.87-.78-1.51-2-1.51a2.61,2.61,0,0,0-2.1,1l.69.72a1.78,1.78,0,0,1,1.3-.64c.54,0,.92.26.92.66s-.36.62-1,.62H4.79v1h.64c.74,0,1.07.21,1.07.63s-.35.68-1,.68a2,2,0,0,1-1.46-.65l-.7.78a2.85,2.85,0,0,0,2.21.93c1.29,0,2.13-.69,2.13-1.64A1.33,1.33,0,0,0,6.56,24.64Z"/><path d="M32.42,9a1,1,0,0,0-1-1H10v2H31.42A1,1,0,0,0,32.42,9Z"/><path d="M31.42,16H10v2H31.42a1,1,0,0,0,0-2Z"/><path d="M31.42,24H10v2H31.42a1,1,0,0,0,0-2Z"/>'
};
var numberListIconName = "number-list";
var numberListIcon = [numberListIconName, renderIcon(icon369)];

// node_modules/@clr/core/icon/shapes/outdent.js
var icon370 = {
  outline: '<path d="M31.06,9h-26a1,1,0,1,1,0-2h26a1,1,0,1,1,0,2Z"/><path d="M31.06,14h-17a1,1,0,0,1,0-2h17a1,1,0,1,1,0,2Z"/><path d="M31.06,19h-17a1,1,0,0,1,0-2h17a1,1,0,1,1,0,2Z"/><path d="M31.06,24h-17a1,1,0,0,1,0-2h17a1,1,0,1,1,0,2Z"/><path d="M31.06,29h-26a1,1,0,0,1,0-2h26a1,1,0,1,1,0,2Z"/><path d="M9.56,22.54a1,1,0,0,1-.7-.3L4.61,18l4.25-4.24a1,1,0,0,1,1.41,1.41L7.44,18l2.83,2.83a1,1,0,0,1-.71,1.71Z"/>'
};
var outdentIconName = "outdent";
var outdentIcon = [outdentIconName, renderIcon(icon370)];

// node_modules/@clr/core/icon/shapes/paint-roller.js
var icon371 = {
  outline: '<path d="M31,10V4a2,2,0,0,0-2-2H6A2,2,0,0,0,4,4v6a2,2,0,0,0,2,2H29A2,2,0,0,0,31,10ZM6,4H29v6H6Z"/><path d="M33,6H32v6.29L18.7,16.54a1,1,0,0,0-.7,1V19H16V33a2,2,0,0,0,2,2h2a2,2,0,0,0,2-2V19H20v-.73L33.3,14a1,1,0,0,0,.7-1V7A1,1,0,0,0,33,6ZM20,33H18V21h2Z"/>',
  solid: '<rect x="4" y="2" width="27" height="10" rx="1" ry="1"/><path d="M33,6H32v6.24L18.71,16.45a1,1,0,0,0-.71,1V19H16V34a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V19H20v-.82L33.29,14A1,1,0,0,0,34,13V7A1,1,0,0,0,33,6Z"/>'
};
var paintRollerIconName = "paint-roller";
var paintRollerIcon = [paintRollerIconName, renderIcon(icon371)];

// node_modules/@clr/core/icon/shapes/strikethrough.js
var icon372 = {
  outline: '<path d="M32.88,19.92h-30a1,1,0,1,1,0-2h30a1,1,0,0,1,0,2Z"/><path d="M7.27,15.86a12.9,12.9,0,0,1,1.29-.52A5.69,5.69,0,0,1,10.39,15a3.18,3.18,0,0,1,2.75,1.11A4.44,4.44,0,0,1,14,18.85v.49a13.83,13.83,0,0,0-4.29-.74,6.19,6.19,0,0,0-2.59.54A5,5,0,0,0,5.81,20H15.88V18.85a5.67,5.67,0,0,0-1.37-4,5.16,5.16,0,0,0-4-1.49,10,10,0,0,0-3.91.88.87.87,0,0,0-.44,1.18A.84.84,0,0,0,7.27,15.86Z"/><path d="M21,20a5.94,5.94,0,0,1,.54-2.31,4.35,4.35,0,0,1,1.58-1.83,4.27,4.27,0,0,1,4.59,0,4.47,4.47,0,0,1,1.57,1.83A6.12,6.12,0,0,1,29.85,20h2a7.73,7.73,0,0,0-.78-3.19,6,6,0,0,0-2.18-2.45,5.74,5.74,0,0,0-3.1-.88,5.39,5.39,0,0,0-2.8.73,5.55,5.55,0,0,0-2,2.05V10a.87.87,0,0,0-.86-.86H20a.87.87,0,0,0-.86.86V20Z"/><path d="M29.67,22a5.61,5.61,0,0,1-.36,1.07,4.47,4.47,0,0,1-1.57,1.85,4.32,4.32,0,0,1-4.59,0,4.35,4.35,0,0,1-1.58-1.85A5.64,5.64,0,0,1,21.2,22H19.09v4.13A.87.87,0,0,0,20,27h.2a.87.87,0,0,0,.86-.86V24.51a5.58,5.58,0,0,0,2,2.06,5.48,5.48,0,0,0,2.8.72,5.66,5.66,0,0,0,3.1-.88A5.88,5.88,0,0,0,31.09,24,7.09,7.09,0,0,0,31.73,22Z"/><path d="M14,22v.76a3.34,3.34,0,0,1-1.62,2,5.34,5.34,0,0,1-2.69.72,3.78,3.78,0,0,1-2.36-.7,2.24,2.24,0,0,1-.94-1.9,2.29,2.29,0,0,1,.2-.91H4.62a4,4,0,0,0-.13,1,3.83,3.83,0,0,0,1.35,3.06A5.15,5.15,0,0,0,9.31,27.2,6,6,0,0,0,12,26.57a4.62,4.62,0,0,0,2-1.74V26a.86.86,0,0,0,.86.86H15a.86.86,0,0,0,.86-.86V22Z"/>'
};
var strikethroughIconName = "strikethrough";
var strikethroughIcon = [strikethroughIconName, renderIcon(icon372)];

// node_modules/@clr/core/icon/shapes/subscript.js
var icon373 = {
  outline: '<path d="M14.55,18l6.8,8.6a1.17,1.17,0,0,1-.92,1.9h0a1.17,1.17,0,0,1-.92-.44L13,19.91,6.6,28a1.17,1.17,0,0,1-.92.44h0a1.17,1.17,0,0,1-.92-1.9L11.55,18l-6.8-8.6a1.17,1.17,0,0,1,.92-1.9h0A1.17,1.17,0,0,1,6.63,8l6.44,8.13L19.5,8a1.17,1.17,0,0,1,.92-.44h0a1.17,1.17,0,0,1,.92,1.9Z"/><path d="M23,31.8,27.49,28a9.9,9.9,0,0,0,1.88-2.05A3.44,3.44,0,0,0,30,24a2.35,2.35,0,0,0-.35-1.27,2.44,2.44,0,0,0-1-.84,2.9,2.9,0,0,0-1.26-.28,3.36,3.36,0,0,0-1.83.5,5.64,5.64,0,0,0-1.48,1.42l-1-.81a5.11,5.11,0,0,1,4.36-2.37,4.35,4.35,0,0,1,2,.45,3.43,3.43,0,0,1,2,3.18,4.45,4.45,0,0,1-.68,2.35,10.9,10.9,0,0,1-2.24,2.46l-3.24,2.81H31.5V33H23Z"/>'
};
var subscriptIconName = "subscript";
var subscriptIcon = [subscriptIconName, renderIcon(icon373)];

// node_modules/@clr/core/icon/shapes/superscript.js
var icon374 = {
  outline: '<path d="M14.43,18l6.79,8.6a1.17,1.17,0,0,1-.92,1.9h0a1.17,1.17,0,0,1-.92-.44l-6.44-8.13L6.47,28a1.17,1.17,0,0,1-.92.44h0a1.17,1.17,0,0,1-.92-1.9L11.43,18l-6.8-8.6a1.17,1.17,0,0,1,.92-1.9h0A1.2,1.2,0,0,1,6.51,8l6.43,8.13L19.38,8a1.17,1.17,0,0,1,.92-.44h0a1.17,1.17,0,0,1,.92,1.9Z"/><path d="M22.85,14.47l4.51-3.85a9.37,9.37,0,0,0,1.88-2,3.43,3.43,0,0,0,.59-1.86,2.27,2.27,0,0,0-.36-1.27,2.38,2.38,0,0,0-.95-.83,2.77,2.77,0,0,0-1.26-.29,3.39,3.39,0,0,0-1.83.5,5.83,5.83,0,0,0-1.49,1.42l-1-.81a5.12,5.12,0,0,1,4.36-2.37,4.36,4.36,0,0,1,2,.45,3.47,3.47,0,0,1,2,3.18A4.44,4.44,0,0,1,30.58,9a11.14,11.14,0,0,1-2.24,2.46L25.1,14.31h6.28v1.33H22.85Z"/>'
};
var superscriptIconName = "superscript";
var superscriptIcon = [superscriptIconName, renderIcon(icon374)];

// node_modules/@clr/core/icon/shapes/text.js
var icon375 = {
  outline: '<path d="M12.19,8.84a1.45,1.45,0,0,0-1.4-1h-.12a1.46,1.46,0,0,0-1.42,1L1.14,26.56a1.29,1.29,0,0,0-.14.59,1,1,0,0,0,1,1,1.12,1.12,0,0,0,1.08-.77l2.08-4.65h11l2.08,4.59a1.24,1.24,0,0,0,1.12.83,1.08,1.08,0,0,0,1.08-1.08,1.64,1.64,0,0,0-.14-.57ZM6.08,20.71l4.59-10.22,4.6,10.22Z"/><path d="M32.24,14.78A6.35,6.35,0,0,0,27.6,13.2a11.36,11.36,0,0,0-4.7,1,1,1,0,0,0-.58.89,1,1,0,0,0,.94.92,1.23,1.23,0,0,0,.39-.08,8.87,8.87,0,0,1,3.72-.81c2.7,0,4.28,1.33,4.28,3.92v.5a15.29,15.29,0,0,0-4.42-.61c-3.64,0-6.14,1.61-6.14,4.64v.05c0,2.95,2.7,4.48,5.37,4.48a6.29,6.29,0,0,0,5.19-2.48V26.9a1,1,0,0,0,1,1,1,1,0,0,0,1-1.06V19A5.71,5.71,0,0,0,32.24,14.78Zm-.56,7.7c0,2.28-2.17,3.89-4.81,3.89-1.94,0-3.61-1.06-3.61-2.86v-.06c0-1.8,1.5-3,4.2-3a15.2,15.2,0,0,1,4.22.61Z"/>'
};
var textIconName = "text";
var textIcon = [textIconName, renderIcon(icon375)];

// node_modules/@clr/core/icon/shapes/text-color.js
var icon376 = {
  outline: '<path d="M19.47,3.84a1.45,1.45,0,0,0-1.4-1H18a1.45,1.45,0,0,0-1.42,1L8.42,21.56a1.35,1.35,0,0,0-.14.59,1,1,0,0,0,1,1,1.11,1.11,0,0,0,1.08-.77l2.08-4.65h11l2.08,4.59a1.24,1.24,0,0,0,1.12.83,1.08,1.08,0,0,0,1.08-1.08,1.59,1.59,0,0,0-.14-.57ZM13.36,15.71,18,5.49l4.6,10.22Z"/><rect x="4.06" y="25" width="28" height="8" rx="2" ry="2"/>'
};
var textColorIconName = "text-color";
var textColorIcon = [textColorIconName, renderIcon(icon376)];

// node_modules/@clr/core/icon/shapes/underline.js
var icon377 = {
  outline: '<path d="M18,28.17c5.08,0,8.48-3.08,8.48-9V8.54a1.15,1.15,0,1,0-2.3,0v10.8c0,4.44-2.38,6.71-6.13,6.71s-6.21-2.47-6.21-6.85V8.54a1.15,1.15,0,1,0-2.3,0v10.8C9.53,25.09,13,28.17,18,28.17Z"/><path d="M31,30H5a1.11,1.11,0,0,0,0,2.21H31A1.11,1.11,0,0,0,31,30Z"/>'
};
var underlineIconName = "underline";
var underlineIcon = [underlineIconName, renderIcon(icon377)];

// node_modules/@clr/core/icon/shapes/airplane.js
var icon378 = {
  outline: '<path d="M35.77,8.16a2.43,2.43,0,0,0-1.9-2L28,4.87a4.5,4.5,0,0,0-3.65.79L7,18.3,2.14,18.1A1.86,1.86,0,0,0,.91,21.41l5,3.93c.6.73,1,.59,10.93-4.82l.93,9.42a1.36,1.36,0,0,0,.85,1.18,1.43,1.43,0,0,0,.54.1,1.54,1.54,0,0,0,1-.41l2.39-2.18a1.52,1.52,0,0,0,.46-.83L25.2,15.9c3.57-2,6.95-3.88,9.36-5.25A2.43,2.43,0,0,0,35.77,8.16Zm-2.2.75c-2.5,1.42-6,3.41-9.76,5.47l-.41.23L21.07,27.28l-1.47,1.34L18.5,17.32,17.17,18C10,22,7.61,23.16,6.79,23.52l-4.3-3.41,5.08.22,18-13.06a2.51,2.51,0,0,1,2-.45l5.85,1.26a.43.43,0,0,1,.35.37A.42.42,0,0,1,33.57,8.91Z"/><path d="M7,12.54l3.56,1,1.64-1.19-4-1.16L10,10.09l5.47-.16,2.3-1.67L10,8.5a1.25,1.25,0,0,0-.7.17L6.67,10.2A1.28,1.28,0,0,0,7,12.54Z"/>',
  solid: '<path d="M6.25,11.5,12,13.16l6.32-4.59-9.07.26A.52.52,0,0,0,9,8.91L6.13,10.56A.51.51,0,0,0,6.25,11.5Z"/><path d="M34.52,6.36,28.22,5a3.78,3.78,0,0,0-3.07.67L6.12,19.5l-4.57-.2a1.25,1.25,0,0,0-.83,2.22l4.45,3.53a.55.55,0,0,0,.53.09c1.27-.49,6-3,11.59-6.07l1.12,11.51a.55.55,0,0,0,.9.37l2.5-2.08a.76.76,0,0,0,.26-.45l2.37-13.29c4-2.22,7.82-4.37,10.51-5.89A1.55,1.55,0,0,0,34.52,6.36Z"/>'
};
var airplaneIconName = "airplane";
var airplaneIcon = [airplaneIconName, renderIcon(icon378)];

// node_modules/@clr/core/icon/shapes/bicycle.js
var icon379 = {
  outline: '<path d="M8.5,29.65A6.51,6.51,0,0,1,2,23.15a6.39,6.39,0,0,1,6.5-6.36A6.39,6.39,0,0,1,15,23.15,6.51,6.51,0,0,1,8.5,29.65Zm0-11a4.5,4.5,0,1,0,4.5,4.5A4.51,4.51,0,0,0,8.5,18.65Z"/><path d="M27.5,29.65a6.51,6.51,0,0,1-6.5-6.5,6.5,6.5,0,0,1,13,0A6.51,6.51,0,0,1,27.5,29.65Zm0-11a4.5,4.5,0,1,0,4.5,4.5A4.51,4.51,0,0,0,27.5,18.65Z"/><path d="M19,24.66H8a1,1,0,0,1-.89-1.45l5-10,1.78.9L9.62,22.73H19Z"/><rect x="13" y="12.68" width="11" height="1.91"/><path d="M28,24.66a1,1,0,0,1-.94-.66L22.29,10.66H20a1,1,0,0,1-1-1,1,1,0,0,1,1-.93h3a.94.94,0,0,1,.94.6l5,14a1,1,0,0,1-.6,1.27A1,1,0,0,1,28,24.66Z"/><path d="M13,14.66a1,1,0,0,1-.71-.29l-1.7-1.71H8a1,1,0,0,1-1-1,.94.94,0,0,1,1-1h3a1.08,1.08,0,0,1,.75.27l2,2a1,1,0,0,1,0,1.41A1,1,0,0,1,13,14.66Z"/>',
  solid: '<path d="M15,21.9c-0.2-2-1.2-3.8-2.9-4.9l-2.5,4.9H15z"/><path d="M7.2,23.4c-0.2-0.3-0.2-0.7,0-1l3.2-6.3c-0.6-0.2-1.2-0.2-1.8-0.2C5,15.9,2,18.8,2,22.4c0,3.6,2.9,6.5,6.5,6.5c3,0,5.6-2.1,6.3-5H8C7.7,23.9,7.3,23.7,7.2,23.4z"/><path d="M19,21.9h-4c0,0.2,0,0.3,0,0.5c0,0.5-0.1,1-0.2,1.5H19V21.9z"/><path d="M27.5,15.9c-0.3,0-0.6,0-0.9,0.1l2.4,6.6c0.2,0.5-0.1,1.1-0.6,1.3c-0.1,0-0.2,0.1-0.3,0.1c-0.4,0-0.8-0.3-0.9-0.7l-2.4-6.7c-3.2,1.6-4.5,5.5-3,8.7c1.6,3.2,5.5,4.5,8.7,3c3.2-1.6,4.5-5.5,3-8.7C32.2,17.3,30,15.9,27.5,15.9z"/><path d="M24.7,16.7c0.6-0.3,1.3-0.5,1.9-0.6l-2.7-7.4C23.8,8.2,23.4,8,23,7.9h-3c-0.6,0-1,0.5-1,1.1c0,0.5,0.4,0.9,1,0.9c0,0,0,0,0,0h2.3l0.7,2h-9.6l-1.7-1.7C11.5,10.1,11.3,10,11,10H8c-0.6,0-1,0.4-1,1s0.4,1,1,1h2.6l1.2,1.2l-1.5,3c0.6,0.2,1.3,0.5,1.8,0.8l1.6-3.2h10L24.7,16.7z"/>'
};
var bicycleIconName = "bicycle";
var bicycleIcon = [bicycleIconName, renderIcon(icon379)];

// node_modules/@clr/core/icon/shapes/boat.js
var icon380 = {
  outline: '<path d="M29.1,27.1C28,27,26.9,27.4,26,28.2c-1.1,1.1-2.9,1.1-4.1,0c-1-0.7-2.1-1.1-3.3-1.1c-1.2-0.1-2.4,0.3-3.3,1.1C14.7,28.7,14,29,13.2,29s-1.5-0.3-2.1-0.8c-1-0.8-2.2-1.2-3.4-1.2s-2.4,0.4-3.4,1.2C3.7,28.7,2.8,29,2,29v2c1.3,0.1,2.6-0.3,3.6-1.2C6.2,29.3,7.1,29,7.9,29c0.7,0,1.5,0.3,2.1,0.8c1.8,1.6,4.6,1.6,6.5,0c0.6-0.5,1.3-0.8,2.1-0.8c0.7,0,1.4,0.3,2,0.8c1.9,1.6,4.6,1.6,6.5,0c0.5-0.5,1.3-0.8,2-0.8c0.7,0,1.4,0.3,1.9,0.8c0.9,0.7,1.9,1.1,3,1.2v-2c-1,0-1.2-0.4-1.7-0.8C31.4,27.5,30.3,27.1,29.1,27.1z"/><path d="M6,23c0-0.6,0.5-1,1.1-1H32l-3.5,3.1h0.2c0.8,0,1.6,0.2,2.2,0.5l2.5-2.2l0.2-0.2c0.7-0.8,0.6-2.1-0.2-2.8C33,20.2,32.6,20,32.1,20h-25c-1.7,0-3,1.3-3,3v3.2c0.5-0.5,1.2-0.8,1.9-1.1V23z"/><path d="M8.9,19H15v-7.8c0-0.6-0.3-1.2-0.8-1.6C13.3,8.9,12,9.1,11.4,10l-4.1,5.9c-0.4,0.6-0.4,1.4-0.1,2.1C7.5,18.6,8.2,19,8.9,19z M13.1,11.2L13,17H8.9L13.1,11.2z"/><path d="M26,18c0.4-0.6,0.4-1.4,0-2L19.7,5.6c-0.4-0.6-1-1-1.7-1c-1.1,0-2,0.9-2,2V19h8.3C25,19,25.7,18.6,26,18z M17.9,6.6l6.4,10.5h-6.4V6.6z"/>',
  solid: '<path d="M34,31c-1.1-0.1-2.1-0.5-3-1.2c-0.5-0.5-1.2-0.8-2-0.8c-0.7,0-1.5,0.3-2,0.8c-0.9,0.8-2,1.1-3.1,1.1c-1.2,0-2.4-0.4-3.3-1.1c-1.2-1.1-3-1.1-4.1,0c-0.9,0.8-2.1,1.2-3.4,1.2c-1.2,0-2.3-0.4-3.2-1.2c-0.6-0.5-1.3-0.8-2-0.8c-0.8,0-1.7,0.3-2.3,0.8c-1,0.8-2.3,1.2-3.5,1.1V29c0.8,0,1.7-0.3,2.3-0.9c1-0.8,2.2-1.2,3.4-1.1c1.2,0,2.4,0.4,3.3,1.2c1.2,1.1,3,1.1,4.2,0c1.9-1.6,4.7-1.6,6.5,0c1.2,1.1,3,1.1,4.1,0c0.9-0.8,2.1-1.2,3.3-1.2c1.1,0,2.2,0.4,3,1.2C32.8,28.7,33,29,34,29L34,31z"/><path d="M4.1,26.2c0.6-0.5,1.2-0.8,1.9-1V23c0-0.6,0.4-1.1,1-1.1h25L28.4,25h0.2c0.8,0,1.6,0.2,2.2,0.5l2.5-2.2l0.2-0.2c0.7-0.9,0.5-2.1-0.4-2.8C32.9,20.1,32.4,20,32,20H7c-1.7,0-3,1.3-3,3L4.1,26.2L4.1,26.2z"/><path d="M14.9,18.9H8.9c-1.1,0-2-0.9-2-2c0-0.4,0.1-0.8,0.4-1.2l4.1-5.8c0.6-0.9,1.9-1.1,2.8-0.5c0.5,0.4,0.8,1,0.8,1.6V18.9z"/><path d="M24.3,18.9H16V6.4c0-1.1,0.9-2,2-2c0.7,0,1.3,0.4,1.7,1L26,15.8c0.6,1,0.2,2.2-0.7,2.7C25,18.7,24.6,18.8,24.3,18.9L24.3,18.9z"/>'
};
var boatIconName = "boat";
var boatIcon = [boatIconName, renderIcon(icon380)];

// node_modules/@clr/core/icon/shapes/campervan.js
var icon381 = {
  outline: '<path d="M9.5,24C9.5,24,9.5,24,9.5,24C7.6,24,6,25.6,6,27.5c0,0,0,0,0,0C6,29.4,7.6,31,9.5,31c1.9,0,3.5-1.6,3.5-3.5S11.4,24,9.5,24z M9.5,29C8.7,29,8,28.3,8,27.5S8.7,26,9.5,26s1.5,0.7,1.5,1.5S10.3,29,9.5,29z"/><path d="M23.5,4C23.5,24,23.5,24,23.5,24c-1.9,0-3.5,1.6-3.5,3.5c0,0,0,0,0,0c0,1.9,1.5,3.5,3.5,3.5c1.9,0,3.5-1.6,3.5-3.5S25.4,24,23.5,24z M23.5,29c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S24.3,29,23.5,29z"/><path d="M33,20.1V20h-0.1l-3.5-5.5C31,13.6,32,12,32,10.3V9.7C32,7.1,29.9,5,27.3,5h-8.5c-1.9,0-3.7,1.2-4.4,3H5c-1.7,0-3,1.3-3,3v17h2V11c0-0.6,0.4-1,1-1h10.9L16,9.2C16.3,7.9,17.4,7,18.7,7h8.5C28.8,7,30,8.2,30,9.7v0.5c0,1.5-1.2,2.7-2.7,2.7H24v9h7.8l0.2,0.3V25c0,0.6-0.4,1-1,1h-2v2h2c1.7,0,3-1.3,3-3v-3.3L33,20.1z M26,20v-5h1.5l3.1,5H26z"/><rect x="19" y="9" width="8" height="2"/><polygon points="20,22 22,22 22,13 15,13 15,28 17,28 17,15 20,15"/><path d="M6,20h7v-7H6V20z M8,15h3v3H8V15z"/>',
  solid: '<path d="M9.5,24C7.6,24,6,25.6,6,27.5S7.6,31,9.5,31c0,0,0,0,0,0c1.9,0,3.5-1.6,3.5-3.5c0,0,0-0.1,0-0.1C13,25.5,11.4,24,9.5,24z"/><circle cx="23.5" cy="27.5" r="3.5"/><path d="M29.5,14.5C31,13.6,32,12,32,10.2V9.7c0,0,0,0,0-0.1C32,7,29.9,5,27.3,5h-8.5c-1.9,0-3.7,1.2-4.4,3H5c-1.7,0-3,1.3-3,3v17h2V11c0-0.6,0.4-1,1-1h10.9L16,9.2C16.3,7.9,17.4,7,18.7,7h8.5C28.8,7,30,8.2,30,9.7v0.5c0,1.5-1.2,2.7-2.7,2.7H27h-3v9h7.8l0.2,0.3V25c0,0.6-0.4,1-1,1h-2v2h2c1.7,0,3-1.3,3-3v-3.3L29.5,14.5z"/><rect x="19" y="9" width="7.9" height="2"/><polygon points="20,22 21.9,22 21.9,13 15,13 15,28 16.9,28 16.9,15 20,15"/><rect x="6" y="13" width="6.9" height="7"/>'
};
var campervanIconName = "campervan";
var campervanIcon = [campervanIconName, renderIcon(icon381)];

// node_modules/@clr/core/icon/shapes/car.js
var icon382 = {
  outline: '<rect x="15" y="17" width="3" height="2"/><path d="M26.45,14.17A22.1,22.1,0,0,0,19.38,7a9.64,9.64,0,0,0-9-.7,8.6,8.6,0,0,0-4.82,6.4c-.08.47-.14.92-.2,1.36A4,4,0,0,0,2,18v6.13a2,2,0,0,0,2,2V20H4V18a2,2,0,0,1,2-2H24.73A7.28,7.28,0,0,1,32,23.27V24h-2a4.53,4.53,0,1,0,.33,2H32a2,2,0,0,0,2-2v-.73A9.28,9.28,0,0,0,26.45,14.17ZM11,14H6.93c0-.31.09-.63.15-1A6.52,6.52,0,0,1,11,8h0Zm2,0V7.58a8.17,8.17,0,0,1,5.36,1.16A19,19,0,0,1,23.9,14ZM25.8,28.38a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,25.8,28.38Z"/><path d="M14.17,24a4.53,4.53,0,1,0,.33,2h5.3c0-.08,0-.17,0-.25A6,6,0,0,1,20,24ZM10,28.38a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,10,28.38Z"/>',
  solid: '<path d="M26.87,14.28A22.36,22.36,0,0,0,19.65,6.9a9.64,9.64,0,0,0-9-.7,8.6,8.6,0,0,0-4.82,6.4c-.08.49-.15,1-.21,1.4h-1A2.59,2.59,0,0,0,2,16.59v8.55a.86.86,0,0,0,.86.86H4.59c0-.13,0-.26,0-.39a5.77,5.77,0,0,1,7.71-5.45l-1,1a4.56,4.56,0,0,0-4.34,1.58,3,3,0,0,0-.63.93A4.5,4.5,0,1,0,14.82,26h5.48c0-.13,0-.26,0-.39A5.77,5.77,0,0,1,28,20.16l-1,1a4.56,4.56,0,0,0-4.34,1.58,3,3,0,0,0-.63.93A4.5,4.5,0,1,0,30.53,26h2.61a.86.86,0,0,0,.86-.86V23.36A9.39,9.39,0,0,0,26.87,14.28ZM12,14H8c0-.35.1-.71.16-1.07a6.52,6.52,0,0,1,3.87-5h0ZM10.36,28.36a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,10.36,28.36ZM19,19H16V17h3Zm-6-5V7.47a8.16,8.16,0,0,1,5.4,1.15A19.15,19.15,0,0,1,24,14ZM26.06,28.36a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,26.06,28.36Z"/>'
};
var carIconName = "car";
var carIcon = [carIconName, renderIcon(icon382)];

// node_modules/@clr/core/icon/shapes/caravan.js
var icon383 = {
  outline: '<path d="M13.5,21C11,21,9,23,9,25.5s2,4.5,4.5,4.5c2.5,0,4.5-2,4.5-4.5C18,23,16,21,13.5,21z M13.5,28c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S14.9,28,13.5,28z"/><path d="M33,24h-2v-7.5c0-0.5-0.1-1-0.4-1.5l-4.2-7.5c-0.5-1-1.5-1.5-2.6-1.5H5C3.3,6,2,7.3,2,9v14c0,1.7,1.3,3,3,3h2v-2H5c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1h18.8c0.4,0,0.7,0.2,0.9,0.5l4.2,7.5c0.1,0.1,0.1,0.3,0.1,0.5V24h-4V12h-7v8h2v-6h3v10h-3v2h13c0.6,0,1-0.4,1-1S33.6,24,33,24z"/><path d="M16,12H7v6h9V12z M14,16H9v-2h5V16z"/>',
  solid: '<path d="M13.5,30C11,30,9,28,9,25.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5C18,28,16,30,13.5,30z"/><path d="M33,24h-2v-7.5c0-0.5-0.1-1-0.4-1.5l-4.2-7.5c-0.5-1-1.5-1.5-2.6-1.5H5C3.3,6,2,7.3,2,9v14c0,1.7,1.3,3,3,3h2v-2H5c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1h18.8c0.4,0,0.7,0.2,0.9,0.5l4.2,7.5c0.1,0.1,0.1,0.3,0.1,0.5V24h-4V12h-7v8h2v-6h3v10h-3v2h13c0.6,0,1-0.4,1-1S33.6,24,33,24z"/><path d="M16,18H7v-6h9V18z"/>'
};
var caravanIconName = "caravan";
var caravanIcon = [caravanIconName, renderIcon(icon383)];

// node_modules/@clr/core/icon/shapes/compass.js
var icon384 = {
  outline: '<path d="M20.82,15.31h0L10.46,9c-.46-.26-1.11.37-.86.84l6.15,10.56,10.56,6.15a.66.66,0,0,0,.84-.86Zm-4,4,3-3,4.55,7.44Z"/><path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm1,29.95V29.53H17v2.42A14,14,0,0,1,4.05,19H6.47V17H4.05A14,14,0,0,1,17,4.05V6.47h2V4.05A14,14,0,0,1,31.95,17H29.53v2h2.42A14,14,0,0,1,19,31.95Z"/>',
  solid: '<path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM6.47,19H4.05c0-.33-.05-.66-.05-1s0-.67.05-1H6.47ZM17,4.05c.33,0,.66-.05,1-.05s.67,0,1,.05V6.47H17Zm2,27.9c-.33,0-.66.05-1,.05s-.67,0-1-.05V29.53h2Zm8-5.58a.59.59,0,0,1-.69.16L15.75,20.38,9.6,9.82c-.25-.47.39-1.1.86-.84l10.37,6.33h0l6.33,10.37A.59.59,0,0,1,27,26.37ZM29.53,19V17h2.42c0,.33.05.66.05,1s0,.67-.05,1Z"/><polygon points="16.77 19.35 24.35 23.77 19.8 16.33 16.77 19.35"/>'
};
var compassIconName = "compass";
var compassIcon = [compassIconName, renderIcon(icon384)];

// node_modules/@clr/core/icon/shapes/ferry.js
var icon385 = {
  outline: '<path d="M29,25.1c-1.2,0-2.3,0.4-3.3,1.1c0,0,0,0,0,0c-1.1,1.1-3,1.1-4.1,0c-0.9-0.8-2.1-1.2-3.3-1.2c-1.2,0-2.3,0.4-3.2,1.2c-1.2,1.1-3,1.1-4.2,0C10,25.4,8.8,25,7.6,25c-1.2,0-2.4,0.4-3.4,1.1C3.6,26.7,2.8,27,2,27v2c1.3,0.1,2.5-0.4,3.4-1.2C6.1,27.3,6.9,27,7.7,27c0.8,0,1.5,0.3,2.1,0.8c1.9,1.6,4.7,1.6,6.5,0c0.6-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8c1.9,1.6,4.6,1.6,6.5,0c0.5-0.5,1.3-0.8,2-0.8c0.7,0,1.5,0.3,2,0.8c0.9,0.7,2,1.1,3.1,1.2v-1.9c-0.7,0-1.4-0.3-1.9-0.9C31.3,25.4,30.1,25,29,25.1z"/><path d="M5.9,23.2V20H32l-3.5,3h0.2c0.8,0,1.6,0.2,2.2,0.5l2.5-2.2l0.2-0.2c0.5-0.6,0.5-1.4,0.2-2.1c-0.4-0.7-1-1-1.8-1h-4.4L22.5,11H17c-1.7,0-3,1.3-3,3h-2V8.1H6v6.1c-1.2,0.4-2,1.5-2,2.8v1.1V20v4.3l0.1-0.1C4.6,23.7,5.2,23.4,5.9,23.2z M8,10h2v4H8V10zM6,17c0-0.6,0.4-1,1-1h9v-2c0-0.6,0.4-1,1-1h5l0.6,1H18v2h5.8l1.2,2.1H6V17z"/>',
  solid: '<path d="M28.2,25c-1.2,0-2.4,0.4-3.3,1.2c-1.2,1.1-3,1.1-4.1,0c-1.9-1.6-4.6-1.6-6.5,0c-1.2,1.1-2.9,1.1-4.1,0c-0.9-0.8-2-1.2-3.2-1.2c-1.2,0-2.3,0.4-3.2,1.2C3.4,26.7,2.7,27,2,27v2c1.1-0.1,2.2-0.5,3.1-1.2C5.6,27.3,6.3,27,7,27c0.7,0,1.5,0.3,2,0.8c1.9,1.6,4.7,1.6,6.6,0c0.6-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8c1.9,1.6,4.7,1.6,6.5,0c0.6-0.5,1.3-0.8,2.1-0.8c0.8,0,1.6,0.3,2.1,0.8c0.9,0.8,2.2,1.3,3.4,1.2v-2c-0.8,0-1.6-0.3-2.2-0.8C30.7,25.4,29.5,25,28.2,25z"/><path d="M5.8,23.2v-3.3h26.1L28.4,23h0.2c0.8,0,1.6,0.2,2.2,0.5l2.5-2.2l0.1-0.2c0.7-0.9,0.5-2.1-0.4-2.8c-0.3-0.3-0.8-0.4-1.2-0.4h-4.1l-5.4-7h-5.5c-1.7,0-3,1.3-3,3h-2V8H6v6.2c-1.2,0.4-2.1,1.5-2.1,2.8l0,7.2l0.1,0C4.5,23.7,5.1,23.4,5.8,23.2z M17.9,14h4.2l1.4,2h-5.7V14z M7.9,10h2v4h-2V10z"/>'
};
var ferryIconName = "ferry";
var ferryIcon = [ferryIconName, renderIcon(icon385)];

// node_modules/@clr/core/icon/shapes/map.js
var icon386 = {
  outline: '<path d="M33.59,6.19A1,1,0,0,0,32.7,6L23.09,9,13.46,4.11a1,1,0,0,0-.84,0L2.62,8.2A1,1,0,0,0,2,9.13V29.61a1,1,0,0,0,1.38.92L13,26.58l9.59,4.92a1,1,0,0,0,.46.11,1,1,0,0,0,.3,0l10-3.12a1,1,0,0,0,.7-1V7A1,1,0,0,0,33.59,6.19ZM32,26.75l-8.32,2.6V27.06h-1.6v2l-8.4-4.31V23.06h-1.6v1.72L4,28.11V9.79l8.08-3.33V8.81h1.6V6.47l8.4,4.3v2.1h1.6V11L32,8.36Z"/><rect x="22.08" y="15.06" width="1.6" height="3.81"/><rect x="22.08" y="21.06" width="1.6" height="3.81"/><rect x="12.08" y="11.06" width="1.6" height="3.81"/><rect x="12.08" y="17.13" width="1.6" height="3.75"/>',
  solid: '<path d="M33.31,7.35,25,9.94V14H23V10.29L14,5.68V9H12V5.27l-9.67,4A.53.53,0,0,0,2,9.75V30.45a.53.53,0,0,0,.74.49L12,27.12V23h2v4.53l9,4.61V28h2v3.79l8.63-2.7a.53.53,0,0,0,.37-.51V7.86A.53.53,0,0,0,33.31,7.35ZM14,21H12V17h2Zm0-6H12V11h2ZM25,26H23V22h2Zm0-6H23V16h2Z"/>'
};
var mapIconName = "map";
var mapIcon = [mapIconName, renderIcon(icon386)];

// node_modules/@clr/core/icon/shapes/map-marker.js
var icon387 = {
  outline: '<path d="M18,6.72a5.73,5.73,0,1,0,5.73,5.73A5.73,5.73,0,0,0,18,6.72Zm0,9.46a3.73,3.73,0,1,1,3.73-3.73A3.73,3.73,0,0,1,18,16.17Z"/><path d="M18,2A11.79,11.79,0,0,0,6.22,13.73c0,4.67,2.62,8.58,4.54,11.43l.35.52a99.61,99.61,0,0,0,6.14,8l.76.89.76-.89a99.82,99.82,0,0,0,6.14-8l.35-.53c1.91-2.85,4.53-6.75,4.53-11.42A11.79,11.79,0,0,0,18,2ZM23.59,24l-.36.53c-1.72,2.58-4,5.47-5.23,6.9-1.18-1.43-3.51-4.32-5.23-6.9L12.42,24c-1.77-2.64-4.2-6.25-4.2-10.31a9.78,9.78,0,1,1,19.56,0C27.78,17.79,25.36,21.4,23.59,24Z"/>',
  outlineBadged: '<path d="M18,6.72a5.73,5.73,0,1,0,5.73,5.73A5.73,5.73,0,0,0,18,6.72Zm0,9.46a3.73,3.73,0,1,1,3.73-3.73A3.73,3.73,0,0,1,18,16.17Z"/><path d="M29.77,13.49a7.49,7.49,0,0,1-2-.33c0,.19,0,.38,0,.57,0,4.06-2.42,7.67-4.19,10.31l-.36.53c-1.72,2.58-4,5.47-5.23,6.9-1.18-1.43-3.51-4.32-5.23-6.9L12.42,24c-1.77-2.64-4.2-6.25-4.2-10.31A9.77,9.77,0,0,1,22.56,5.09a7.45,7.45,0,0,1,.52-2A11.75,11.75,0,0,0,6.22,13.73c0,4.67,2.62,8.58,4.54,11.43l.35.52a99.61,99.61,0,0,0,6.14,8l.76.89.76-.89a99.82,99.82,0,0,0,6.14-8l.35-.53c1.91-2.85,4.53-6.75,4.53-11.42C29.78,13.65,29.77,13.57,29.77,13.49Z"/>',
  solid: '<path d="M18,2A11.79,11.79,0,0,0,6.22,13.73c0,4.67,2.62,8.58,4.54,11.43l.35.52a99.61,99.61,0,0,0,6.14,8l.76.89.76-.89a99.82,99.82,0,0,0,6.14-8l.35-.53c1.91-2.85,4.53-6.75,4.53-11.42A11.79,11.79,0,0,0,18,2Zm0,17a6.56,6.56,0,1,1,6.56-6.56A6.56,6.56,0,0,1,18,19Z"/><circle cx="18" cy="12.44" r="3.73"/>',
  solidBadged: '<path d="M29.77,13.49A7.47,7.47,0,0,1,24.38,11a6.58,6.58,0,1,1-1.61-3,7.42,7.42,0,0,1,.31-4.84A11.75,11.75,0,0,0,6.22,13.73c0,4.67,2.62,8.58,4.54,11.43l.35.52a99.61,99.61,0,0,0,6.14,8l.76.89.76-.89a99.82,99.82,0,0,0,6.14-8l.35-.53c1.91-2.85,4.53-6.75,4.53-11.42C29.78,13.65,29.77,13.57,29.77,13.49Z"/><circle cx="18" cy="12.44" r="3.73"/>'
};
var mapMarkerIconName = "map-marker";
var mapMarkerIcon = [mapMarkerIconName, renderIcon(icon387)];

// node_modules/@clr/core/icon/shapes/on-holiday.js
var icon388 = {
  outline: '<path d="M18.08,2.34c-8.82,0-16,6.28-16,14s7.18,14,16,14A17.91,17.91,0,0,0,23,29.66l5.53,3.52a1,1,0,0,0,1.38-.3,1,1,0,0,0,.16-.54V25.61a13,13,0,0,0,4-9.27C34.08,8.62,26.9,2.34,18.08,2.34ZM28.37,24.45a1,1,0,0,0-.32.73v5.34l-4.38-2.79a1,1,0,0,0-.83-.11,16,16,0,0,1-4.76.72c-7.72,0-14-5.38-14-12s6.28-12,14-12,14,5.38,14,12A11.1,11.1,0,0,1,28.37,24.45Z"/><path d="M31.1,15.82,31,15.67,28.5,13.44a3.25,3.25,0,0,0-2.39-.84l-5.38.34-3.59-3a.81.81,0,0,0-.52-.19H13.56a.78.78,0,0,0-.69.4.77.77,0,0,0,0,.79l1.36,2.44-4.71.29,1.31,1.52,15.39-1a1.65,1.65,0,0,1,1.22.43l2.36,2.13a.11.11,0,0,1,0,.07c0,.06-.09.05-.1.06H21.82l-.35.37-5.19,5.53H14.64l2.73-5.9H8.54L7.13,14.16,6.51,13a.8.8,0,0,0-1-.2A.81.81,0,0,0,5.2,13.9l2,3.94a1.21,1.21,0,0,0,1.08.65h6.57l-1.94,4.18A1.2,1.2,0,0,0,13,23.83a1.22,1.22,0,0,0,1,.56h2.43a1.17,1.17,0,0,0,.88-.39l5.18-5.51h7.16a1.65,1.65,0,0,0,1.52-.91A1.74,1.74,0,0,0,31.1,15.82ZM14.92,11.31h1.41l2.09,1.77L16,13.23Z"/>',
  solid: '<path d="M18,2.5c-8.82,0-16,6.28-16,14s7.18,14,16,14a17.91,17.91,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.38-.3A1,1,0,0,0,30,32.5V25.77a13,13,0,0,0,4-9.27C34,8.78,26.82,2.5,18,2.5ZM29.84,18H21.51a.42.42,0,0,0-.3.13l-5.3,5.64a.39.39,0,0,1-.29.13H13.19a.41.41,0,0,1-.37-.58l2.47-5.32H7.46a.42.42,0,0,1-.36-.22l-2.7-5H6.24a.53.53,0,0,1,.39.18l1.56,1.69a.38.38,0,0,0,.33.14l6.18-.38-2-3.55h2.89a.47.47,0,0,1,.31.11L19.63,14l6.69-.35a2.44,2.44,0,0,1,1.81.63l2.47,2.23A.92.92,0,0,1,29.84,18Z"/>'
};
var onHolidayIconName = "on-holiday";
var onHolidayIcon = [onHolidayIconName, renderIcon(icon388)];

// node_modules/@clr/core/icon/shapes/trailer.js
var icon389 = {
  outline: '<path d="M15,19.2c-3.2,0-5.8,2.6-5.8,5.8s2.6,5.8,5.8,5.8s5.8-2.6,5.8-5.8S18.2,19.2,15,19.2z M15,29.2c-2.3,0-4.2-1.9-4.2-4.2s1.9-4.2,4.2-4.2s4.2,1.9,4.2,4.2S17.3,29.2,15,29.2z"/><rect x="14" y="24" width="2" height="2"/><path d="M33,9H2v13.1c0,0,0,0,0,0C2,24.3,3.7,26,5.9,26H7v-2H5.9c-1,0-1.8-0.8-1.9-1.9V15h22v7.1c0,1-0.8,1.8-1.9,1.9H23v2h1.1c0,0,0,0,0,0c2.1,0,3.8-1.7,3.8-3.9V11h5c0.6,0,1-0.4,1-1S33.6,9,33,9z M26,13H4v-2h22V13z"/>',
  solid: '<path d="M33,9H2v13.1c0,0,0,0,0,0C2,24.3,3.7,26,5.9,26H7v-2H5.9c-1,0-1.8-0.8-1.9-1.9V15h22v7.1c0,1-0.8,1.8-1.9,1.9H23v2h1.1c0,0,0,0,0,0c2.1,0,3.8-1.7,3.8-3.9V11h5c0.6,0,1-0.4,1-1S33.6,9,33,9z"/><path d="M15,19.2c-3.2,0-5.8,2.6-5.8,5.8s2.6,5.8,5.8,5.8s5.8-2.6,5.8-5.8l0,0C20.8,21.8,18.2,19.2,15,19.2z M16,26h-2v-2h2V26z"/>'
};
var trailerIconName = "trailer";
var trailerIcon = [trailerIconName, renderIcon(icon389)];

// node_modules/@clr/core/icon/shapes/truck.js
var icon390 = {
  outline: '<path d="M30,12H26V7a1,1,0,0,0-1-1H3A1,1,0,0,0,2,7V25a1,1,0,0,0,1,1H4V8H24V19.7a6.45,6.45,0,0,1,1.56-.2c.15,0,.29,0,.44,0V14h4a2,2,0,0,1,2,2v1H28v2h4v5H29.6a4.54,4.54,0,0,0-8.34,0H14.43a4.5,4.5,0,0,0-4.17-2.76A4.38,4.38,0,1,0,14.72,26H21a4.49,4.49,0,0,0,8.92,0H33a1,1,0,0,0,1-1V16A4,4,0,0,0,30,12ZM10.26,28a2.38,2.38,0,1,1,0-4.75,2.38,2.38,0,1,1,0,4.75Zm15.17,0a2.38,2.38,0,1,1,2.5-2.37A2.44,2.44,0,0,1,25.43,28Z"/>',
  solid: '<path d="M30,12H26V7a1,1,0,0,0-1-1H3A1,1,0,0,0,2,7V25a1,1,0,0,0,1,1H4V8H24V21.49A4.45,4.45,0,0,0,21.25,24H14.43a4.5,4.5,0,0,0-4.17-2.76A4.38,4.38,0,1,0,14.72,26H21a4.48,4.48,0,0,0,8.91,0H34V16A4,4,0,0,0,30,12ZM10.26,28a2.38,2.38,0,1,1,0-4.75,2.38,2.38,0,1,1,0,4.75Zm15.17,0a2.38,2.38,0,1,1,2.5-2.37A2.44,2.44,0,0,1,25.42,28ZM32,17H26V14h4a2,2,0,0,1,2,2Z"/>'
};
var truckIconName = "truck";
var truckIcon = [truckIconName, renderIcon(icon390)];

// node_modules/@clr/core/icon/collections/chart.js
var chartCollectionIcons = [
  axisChartIcon,
  barChartIcon,
  bellCurveIcon,
  boxPlotIcon,
  bubbleChartIcon,
  cloudChartIcon,
  curveChartIcon,
  gridChartIcon,
  heatMapIcon,
  lineChartIcon,
  pieChartIcon,
  scatterPlotIcon,
  tickChartIcon
];
var chartCollectionAliases = [[lineChartIconName, ["analytics"]]];
function loadChartIconSet() {
  ClarityIcons.addIcons(...chartCollectionIcons);
  ClarityIcons.addAliases(...chartCollectionAliases);
}

// node_modules/@clr/core/icon/collections/commerce.js
var commerceCollectionIcons = [
  bankIcon,
  bitcoinIcon,
  calculatorIcon,
  creditCardIcon,
  coinBagIcon,
  dollarIcon,
  dollarBillIcon,
  eCheckIcon,
  employeeGroupIcon,
  employeeIcon,
  euroIcon,
  factoryIcon,
  pesoIcon,
  piggyBankIcon,
  poundIcon,
  rubleIcon,
  rupeeIcon,
  shoppingBagIcon,
  shoppingCartIcon,
  storeIcon,
  walletIcon,
  wonIcon,
  yenIcon
];
var commerceCollectionAliases = [[piggyBankIconName, ["savings"]]];
function loadCommerceIconSet() {
  ClarityIcons.addIcons(...commerceCollectionIcons);
  ClarityIcons.addAliases(...commerceCollectionAliases);
}

// node_modules/@clr/core/icon/collections/core.js
var coreCollectionIcons = [
  angleIcon,
  angleDoubleIcon,
  arrowIcon,
  barsIcon,
  bellIcon,
  calendarIcon,
  checkIcon,
  checkCircleIcon,
  cloudIcon,
  cogIcon,
  ellipsisHorizontalIcon,
  ellipsisVerticalIcon,
  errorStandardIcon,
  eventIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  eyeIcon,
  eyeHideIcon,
  filterGridIcon,
  filterGridCircleIcon,
  folderIcon,
  folderOpenIcon,
  helpInfoIcon,
  homeIcon,
  imageIcon,
  infoCircleIcon,
  infoStandardIcon,
  searchIcon,
  stepForward2Icon,
  successStandardIcon,
  timesIcon,
  unknownStatusIcon,
  userIcon,
  viewColumnsIcon,
  vmBugIcon,
  vmBugInverseIcon,
  warningStandardIcon
];
var coreCollectionAliases = [
  [homeIconName, ["house"]],
  [cogIconName, ["settings"]],
  [checkIconName, ["success"]],
  [timesIconName, ["close"]],
  [exclamationTriangleIconName, ["warning"]],
  [exclamationCircleIconName, ["error"]],
  [infoCircleIconName, ["info"]],
  [barsIconName, ["menu"]],
  [userIconName, ["avatar"]],
  [angleIconName, ["caret"]],
  [folderIconName, ["directory"]],
  [bellIconName, ["notification"]],
  [angleDoubleIconName, ["collapse"]]
];
function loadCoreIconSet() {
  ClarityIcons.addIcons(...coreCollectionIcons);
  ClarityIcons.addAliases(...coreCollectionAliases);
}

// node_modules/@clr/core/icon/collections/essential.js
var essentialCollectionIcons = [
  accessibility1Icon,
  accessibility2Icon,
  addTextIcon,
  alarmClockIcon,
  alarmOffIcon,
  asteriskIcon,
  banIcon,
  betaIcon,
  boltIcon,
  bookIcon,
  briefcaseIcon,
  bubbleExclamationIcon,
  bugIcon,
  bullseyeIcon,
  childArrowIcon,
  circleIcon,
  circleArrowIcon,
  clipboardIcon,
  clockIcon,
  cloneIcon,
  collapseCardIcon,
  colorPaletteIcon,
  colorPickerIcon,
  copyIcon,
  copyToClipboardIcon,
  crosshairsIcon,
  cursorArrowIcon,
  cursorHandIcon,
  cursorHandClickIcon,
  cursorHandGrabIcon,
  cursorHandOpenIcon,
  cursorMoveIcon,
  detailsIcon,
  dotCircleIcon,
  downloadIcon,
  dragHandleIcon,
  dragHandleCornerIcon,
  eraserIcon,
  expandCardIcon,
  fileGroupIcon,
  fileIcon,
  fileSettingsIcon,
  fileZipIcon,
  filterIcon,
  filter2Icon,
  filterOffIcon,
  firewallIcon,
  firstAidIcon,
  fishIcon,
  flameIcon,
  formIcon,
  fuelIcon,
  gridViewIcon,
  helpIcon,
  historyIcon,
  hourglassIcon,
  idBadgeIcon,
  keyIcon,
  landscapeIcon,
  libraryIcon,
  lightbulbIcon,
  listIcon,
  lockIcon,
  loginIcon,
  logoutIcon,
  minusIcon,
  minusCircleIcon,
  moonIcon,
  newIcon,
  noAccessIcon,
  noteIcon,
  objectsIcon,
  organizationIcon,
  paperclipIcon,
  pasteIcon,
  pencilIcon,
  pinIcon,
  pinboardIcon,
  plusIcon,
  plusCircleIcon,
  popOutIcon,
  portraitIcon,
  printerIcon,
  recycleIcon,
  redoIcon,
  refreshIcon,
  repeatIcon,
  resizeIcon,
  scissorsIcon,
  scrollIcon,
  shrinkIcon,
  sliderIcon,
  snowflakeIcon,
  sortByIcon,
  sunIcon,
  switchIcon,
  syncIcon,
  tableIcon,
  tagIcon,
  tagsIcon,
  targetIcon,
  thermometerIcon,
  timesCircleIcon,
  toolsIcon,
  trashIcon,
  treeIcon,
  treeViewIcon,
  twoWayArrowsIcon,
  undoIcon,
  unlockIcon,
  uploadIcon,
  usersIcon,
  viewCardsIcon,
  viewListIcon,
  volumeIcon,
  wandIcon,
  windowCloseIcon,
  windowMaxIcon,
  windowMinIcon,
  windowRestoreIcon,
  worldIcon,
  wrenchIcon,
  zoomInIcon,
  zoomOutIcon
];
var essentialCollectionAliases = [
  [pencilIconName, ["edit"]],
  [noteIconName, ["note-edit"]],
  [usersIconName, ["group"]],
  [fileIconName, ["document"]],
  [plusIconName, ["add"]],
  [banIconName, ["cancel"]],
  [timesCircleIconName, ["remove"]],
  [loginIconName, ["sign-in"]],
  [logoutIconName, ["sign-out"]],
  [boltIconName, ["lightning"]],
  [organizationIconName, ["flow-chart"]],
  [bubbleExclamationIconName, ["alert"]],
  [pinboardIconName, ["pinned"]],
  [paperclipIconName, ["attachment"]],
  [shrinkIconName, ["resize-down"]],
  [resizeIconName, ["resize-up"]]
];
function loadEssentialIconSet() {
  ClarityIcons.addIcons(...essentialCollectionIcons);
  ClarityIcons.addAliases(...essentialCollectionAliases);
}

// node_modules/@clr/core/icon/collections/media.js
var mediaCollectionIcons = [
  cameraIcon,
  fastForwardIcon,
  filmStripIcon,
  headphonesIcon,
  imageGalleryIcon,
  microphoneIcon,
  microphoneMuteIcon,
  musicNoteIcon,
  pauseIcon,
  playIcon,
  powerIcon,
  replayAllIcon,
  replayOneIcon,
  rewindIcon,
  shuffleIcon,
  stepForwardIcon,
  stopIcon,
  videoCameraIcon,
  videoGalleryIcon,
  volumeDownIcon,
  volumeMuteIcon,
  volumeUpIcon
];
var mediaCollectionAliases = [];
function loadMediaIconSet() {
  ClarityIcons.addIcons(...mediaCollectionIcons);
  ClarityIcons.addAliases(...mediaCollectionAliases);
}

// node_modules/@clr/core/icon/collections/mini.js
var miniCollectionIcons = [
  arrowMiniIcon,
  calendarMiniIcon,
  checkCircleMiniIcon,
  checkMiniIcon,
  errorMiniIcon,
  eventMiniIcon,
  filterGridMiniIcon,
  filterGridCircleMiniIcon,
  infoCircleMiniIcon,
  timesMiniIcon,
  warningMiniIcon
];
var miniCollectionAliases = [
  [timesMiniIconName, ["close-mini"]],
  [infoCircleMiniIconName, ["info-mini"]]
];
function loadMiniIconSet() {
  ClarityIcons.addIcons(...miniCollectionIcons);
  ClarityIcons.addAliases(...miniCollectionAliases);
}

// node_modules/@clr/core/icon/collections/technology.js
var technologyCollectionIcons = [
  administratorIcon,
  animationIcon,
  applicationIcon,
  applicationsIcon,
  archiveIcon,
  assignUserIcon,
  atomIcon,
  backupIcon,
  backupRestoreIcon,
  barCodeIcon,
  batteryIcon,
  blockIcon,
  blocksGroupIcon,
  bluetoothIcon,
  bluetoothOffIcon,
  buildingIcon,
  bundleIcon,
  capacitorIcon,
  cdDvdIcon,
  certificateIcon,
  ciCdIcon,
  cloudNetworkIcon,
  cloudScaleIcon,
  cloudTrafficIcon,
  clusterIcon,
  codeIcon,
  computerIcon,
  connectIcon,
  containerIcon,
  containerVolumeIcon,
  controlLunIcon,
  cpuIcon,
  dashboardIcon,
  dataClusterIcon,
  deployIcon,
  devicesIcon,
  disconnectIcon,
  displayIcon,
  downloadCloudIcon,
  exportIcon,
  fileShareIcon,
  fileShare2Icon,
  flaskIcon,
  floppyIcon,
  hardDriveIcon,
  hardDriveDisksIcon,
  hardDiskIcon,
  helixIcon,
  hostIcon,
  hostGroupIcon,
  importIcon,
  inductorIcon,
  installIcon,
  keyboardIcon,
  layersIcon,
  linkIcon,
  mediaChangerIcon,
  memoryIcon,
  mobileIcon,
  mouseIcon,
  namespaceIcon,
  networkGlobeIcon,
  networkSettingsIcon,
  networkSwitchIcon,
  nodeGroupIcon,
  nodeIcon,
  nodesIcon,
  noWifiIcon,
  nvmeIcon,
  phoneHandsetIcon,
  pluginIcon,
  podIcon,
  processOnVmIcon,
  qrCodeIcon,
  rackServerIcon,
  radarIcon,
  resistorIcon,
  resourcePoolIcon,
  routerIcon,
  rulerPencilIcon,
  shieldIcon,
  shieldCheckIcon,
  shieldXIcon,
  squidIcon,
  ssdIcon,
  storageIcon,
  storageAdapterIcon,
  tabletIcon,
  tapeDriveIcon,
  terminalIcon,
  unarchiveIcon,
  uninstallIcon,
  unlinkIcon,
  uploadCloudIcon,
  usbIcon,
  vmIcon,
  vmwAppIcon,
  wifiIcon
];
var technologyCollectionAliases = [
  [hostIconName, ["server"]],
  [terminalIconName, ["command"]],
  [mobileIconName, ["mobile-phone"]],
  [certificateIconName, ["license"]],
  [noWifiIconName, ["disconnected"]],
  [phoneHandsetIconName, ["receiver"]],
  [rulerPencilIconName, ["design"]],
  [helixIconName, ["dna"]],
  [fileShareIconName, ["folder-share"]]
];
function loadTechnologyIconSet() {
  ClarityIcons.addIcons(...technologyCollectionIcons);
  ClarityIcons.addAliases(...technologyCollectionAliases);
}

// node_modules/@clr/core/icon/collections/social.js
var socialCollectionIcons = [
  bookmarkIcon,
  calendarIcon,
  chatBubbleIcon,
  crownIcon,
  envelopeIcon,
  eventIcon,
  flagIcon,
  halfStarIcon,
  happyFaceIcon,
  hashtagIcon,
  heartIcon,
  heartBrokenIcon,
  inboxIcon,
  neutralFaceIcon,
  pictureIcon,
  sadFaceIcon,
  shareIcon,
  starIcon,
  talkBubblesIcon,
  tasksIcon,
  thumbsDownIcon,
  thumbsUpIcon
];
var socialCollectionAliases = [
  [starIconName, ["favorite"]],
  [envelopeIconName, ["email"]],
  [calendarIconName, ["date"]]
];
function loadSocialIconSet() {
  ClarityIcons.addIcons(...socialCollectionIcons);
  ClarityIcons.addAliases(...socialCollectionAliases);
}

// node_modules/@clr/core/icon/collections/text-edit.js
var textEditCollectionIcons = [
  alignBottomIcon,
  alignCenterIcon,
  alignLeftIcon,
  alignLeftTextIcon,
  alignMiddleIcon,
  alignRightIcon,
  alignRightTextIcon,
  alignTopIcon,
  blockQuoteIcon,
  boldIcon,
  bulletListIcon,
  centerTextIcon,
  checkboxListIcon,
  fontSizeIcon,
  highlighterIcon,
  indentIcon,
  italicIcon,
  justifyTextIcon,
  languageIcon,
  numberListIcon,
  outdentIcon,
  paintRollerIcon,
  strikethroughIcon,
  subscriptIcon,
  superscriptIcon,
  textIcon,
  textColorIcon,
  underlineIcon
];
var textEditCollectionAliases = [];
function loadTextEditIconSet() {
  ClarityIcons.addIcons(...textEditCollectionIcons);
  ClarityIcons.addAliases(...textEditCollectionAliases);
}

// node_modules/@clr/core/icon/collections/travel.js
var travelCollectionIcons = [
  airplaneIcon,
  bicycleIcon,
  boatIcon,
  carIcon,
  campervanIcon,
  caravanIcon,
  compassIcon,
  ferryIcon,
  mapIcon,
  mapMarkerIcon,
  onHolidayIcon,
  trailerIcon,
  truckIcon
];
var travelCollectionAliases = [
  [airplaneIconName, ["plane"]],
  [caravanIconName, ["auto"]]
];
function loadTravelIconSet() {
  ClarityIcons.addIcons(...travelCollectionIcons);
  ClarityIcons.addAliases(...travelCollectionAliases);
}
export {
  CdsIcon,
  ClarityIcons,
  accessibility1Icon,
  accessibility2Icon,
  addTextIcon,
  administratorIcon,
  airplaneIcon,
  alarmClockIcon,
  alarmOffIcon,
  alignBottomIcon,
  alignCenterIcon,
  alignLeftIcon,
  alignLeftTextIcon,
  alignMiddleIcon,
  alignRightIcon,
  alignRightTextIcon,
  alignTopIcon,
  angleDoubleIcon,
  angleIcon,
  animationIcon,
  applicationIcon,
  applicationsIcon,
  archiveIcon,
  arrowIcon,
  arrowMiniIcon,
  assignUserIcon,
  asteriskIcon,
  atomIcon,
  axisChartIcon,
  backupIcon,
  backupRestoreIcon,
  banIcon,
  bankIcon,
  barChartIcon,
  barCodeIcon,
  barsIcon,
  batteryIcon,
  bellCurveIcon,
  bellIcon,
  betaIcon,
  bicycleIcon,
  bitcoinIcon,
  blockIcon,
  blockQuoteIcon,
  blocksGroupIcon,
  bluetoothIcon,
  bluetoothOffIcon,
  boatIcon,
  boldIcon,
  boltIcon,
  bookIcon,
  bookmarkIcon,
  boxPlotIcon,
  briefcaseIcon,
  bubbleChartIcon,
  bubbleExclamationIcon,
  bugIcon,
  buildingIcon,
  bulletListIcon,
  bullseyeIcon,
  bundleIcon,
  calculatorIcon,
  calendarIcon,
  calendarMiniIcon,
  cameraIcon,
  campervanIcon,
  capacitorIcon,
  carIcon,
  caravanIcon,
  cdDvdIcon,
  centerTextIcon,
  certificateIcon,
  chartCollectionAliases,
  chartCollectionIcons,
  chatBubbleIcon,
  checkCircleIcon,
  checkCircleMiniIcon,
  checkIcon,
  checkMiniIcon,
  checkboxListIcon,
  childArrowIcon,
  ciCdIcon,
  circleArrowIcon,
  circleIcon,
  clipboardIcon,
  clockIcon,
  cloneIcon,
  cloudChartIcon,
  cloudIcon,
  cloudNetworkIcon,
  cloudScaleIcon,
  cloudTrafficIcon,
  clusterIcon,
  codeIcon,
  cogIcon,
  coinBagIcon,
  collapseCardIcon,
  colorPaletteIcon,
  colorPickerIcon,
  commerceCollectionAliases,
  commerceCollectionIcons,
  compassIcon,
  computerIcon,
  connectIcon,
  containerIcon,
  containerVolumeIcon,
  controlLunIcon,
  copyIcon,
  copyToClipboardIcon,
  coreCollectionAliases,
  coreCollectionIcons,
  cpuIcon,
  creditCardIcon,
  crosshairsIcon,
  crownIcon,
  cursorArrowIcon,
  cursorHandClickIcon,
  cursorHandGrabIcon,
  cursorHandIcon,
  cursorHandOpenIcon,
  cursorMoveIcon,
  curveChartIcon,
  dashboardIcon,
  dataClusterIcon,
  deployIcon,
  detailsIcon,
  devicesIcon,
  disconnectIcon,
  displayIcon,
  dollarBillIcon,
  dollarIcon,
  dotCircleIcon,
  downloadCloudIcon,
  downloadIcon,
  dragHandleCornerIcon,
  dragHandleIcon,
  eCheckIcon,
  ellipsisHorizontalIcon,
  ellipsisVerticalIcon,
  employeeGroupIcon,
  employeeIcon,
  envelopeIcon,
  eraserIcon,
  errorMiniIcon,
  errorStandardIcon,
  essentialCollectionAliases,
  essentialCollectionIcons,
  euroIcon,
  eventIcon,
  eventMiniIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  expandCardIcon,
  exportIcon,
  eyeHideIcon,
  eyeIcon,
  factoryIcon,
  fastForwardIcon,
  ferryIcon,
  fileGroupIcon,
  fileIcon,
  fileSettingsIcon,
  fileShare2Icon,
  fileShareIcon,
  fileZipIcon,
  filmStripIcon,
  filter2Icon,
  filterGridCircleIcon,
  filterGridCircleMiniIcon,
  filterGridIcon,
  filterGridMiniIcon,
  filterIcon,
  filterOffIcon,
  firewallIcon,
  firstAidIcon,
  fishIcon,
  flagIcon,
  flameIcon,
  flaskIcon,
  floppyIcon,
  folderIcon,
  folderOpenIcon,
  fontSizeIcon,
  formIcon,
  fuelIcon,
  gridChartIcon,
  gridViewIcon,
  halfStarIcon,
  happyFaceIcon,
  hardDiskIcon,
  hardDriveDisksIcon,
  hardDriveIcon,
  hashtagIcon,
  headphonesIcon,
  heartBrokenIcon,
  heartIcon,
  heatMapIcon,
  helixIcon,
  helpIcon,
  helpInfoIcon,
  highlighterIcon,
  historyIcon,
  homeIcon,
  hostGroupIcon,
  hostIcon,
  hourglassIcon,
  idBadgeIcon,
  imageGalleryIcon,
  imageIcon,
  importIcon,
  inboxIcon,
  indentIcon,
  inductorIcon,
  infoCircleIcon,
  infoCircleMiniIcon,
  infoStandardIcon,
  installIcon,
  italicIcon,
  justifyTextIcon,
  keyIcon,
  keyboardIcon,
  landscapeIcon,
  languageIcon,
  layersIcon,
  libraryIcon,
  lightbulbIcon,
  lineChartIcon,
  linkIcon,
  listIcon,
  loadChartIconSet,
  loadCommerceIconSet,
  loadCoreIconSet,
  loadEssentialIconSet,
  loadMediaIconSet,
  loadMiniIconSet,
  loadSocialIconSet,
  loadTechnologyIconSet,
  loadTextEditIconSet,
  loadTravelIconSet,
  lockIcon,
  loginIcon,
  logoutIcon,
  mapIcon,
  mapMarkerIcon,
  mediaChangerIcon,
  mediaCollectionAliases,
  mediaCollectionIcons,
  memoryIcon,
  microphoneIcon,
  microphoneMuteIcon,
  miniCollectionAliases,
  miniCollectionIcons,
  minusCircleIcon,
  minusIcon,
  mobileIcon,
  moonIcon,
  mouseIcon,
  musicNoteIcon,
  namespaceIcon,
  networkGlobeIcon,
  networkSettingsIcon,
  networkSwitchIcon,
  neutralFaceIcon,
  newIcon,
  noAccessIcon,
  noWifiIcon,
  nodeGroupIcon,
  nodeIcon,
  nodesIcon,
  noteIcon,
  numberListIcon,
  nvmeIcon,
  objectsIcon,
  onHolidayIcon,
  organizationIcon,
  outdentIcon,
  paintRollerIcon,
  paperclipIcon,
  pasteIcon,
  pauseIcon,
  pencilIcon,
  pesoIcon,
  phoneHandsetIcon,
  pictureIcon,
  pieChartIcon,
  piggyBankIcon,
  pinIcon,
  pinboardIcon,
  playIcon,
  pluginIcon,
  plusCircleIcon,
  plusIcon,
  podIcon,
  popOutIcon,
  portraitIcon,
  poundIcon,
  powerIcon,
  printerIcon,
  processOnVmIcon,
  qrCodeIcon,
  rackServerIcon,
  radarIcon,
  recycleIcon,
  redoIcon,
  refreshIcon,
  renderIcon,
  repeatIcon,
  replayAllIcon,
  replayOneIcon,
  resistorIcon,
  resizeIcon,
  resourcePoolIcon,
  rewindIcon,
  routerIcon,
  rubleIcon,
  rulerPencilIcon,
  rupeeIcon,
  sadFaceIcon,
  scatterPlotIcon,
  scissorsIcon,
  scrollIcon,
  searchIcon,
  shareIcon,
  shieldCheckIcon,
  shieldIcon,
  shieldXIcon,
  shoppingBagIcon,
  shoppingCartIcon,
  shrinkIcon,
  shuffleIcon,
  sliderIcon,
  snowflakeIcon,
  socialCollectionAliases,
  socialCollectionIcons,
  sortByIcon,
  squidIcon,
  ssdIcon,
  starIcon,
  stepForward2Icon,
  stepForwardIcon,
  stopIcon,
  storageAdapterIcon,
  storageIcon,
  storeIcon,
  strikethroughIcon,
  subscriptIcon,
  successStandardIcon,
  sunIcon,
  superscriptIcon,
  switchIcon,
  syncIcon,
  tableIcon,
  tabletIcon,
  tagIcon,
  tagsIcon,
  talkBubblesIcon,
  tapeDriveIcon,
  targetIcon,
  tasksIcon,
  technologyCollectionAliases,
  technologyCollectionIcons,
  terminalIcon,
  textColorIcon,
  textEditCollectionAliases,
  textEditCollectionIcons,
  textIcon,
  thermometerIcon,
  thumbsDownIcon,
  thumbsUpIcon,
  tickChartIcon,
  timesCircleIcon,
  timesIcon,
  timesMiniIcon,
  toolsIcon,
  trailerIcon,
  trashIcon,
  travelCollectionAliases,
  travelCollectionIcons,
  treeIcon,
  treeViewIcon,
  truckIcon,
  twoWayArrowsIcon,
  unarchiveIcon,
  underlineIcon,
  undoIcon,
  uninstallIcon,
  unknownIcon,
  unknownStatusIcon,
  unlinkIcon,
  unlockIcon,
  uploadCloudIcon,
  uploadIcon,
  usbIcon,
  userIcon,
  usersIcon,
  videoCameraIcon,
  videoGalleryIcon,
  viewCardsIcon,
  viewColumnsIcon,
  viewListIcon,
  vmBugIcon,
  vmBugInverseIcon,
  vmIcon,
  vmwAppIcon,
  volumeDownIcon,
  volumeIcon,
  volumeMuteIcon,
  volumeUpIcon,
  walletIcon,
  wandIcon,
  warningMiniIcon,
  warningStandardIcon,
  wifiIcon,
  windowCloseIcon,
  windowMaxIcon,
  windowMinIcon,
  windowRestoreIcon,
  wonIcon,
  worldIcon,
  wrenchIcon,
  yenIcon,
  zoomInIcon,
  zoomOutIcon
};
/*! Bundled license information:

lit-html/lib/dom.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/modify-template.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/directive.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/part.js:
  (**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template-instance.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template-result.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/parts.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template-factory.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/render.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/default-template-processor.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/shady-render.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-element/lib/updating-element.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-element/lib/decorators.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-element/lib/css-tag.js:
  (**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)
*/
//# sourceMappingURL=@clr_core_icon.js.map
