(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log('TEST');

window.FirepadCustomToolbar = require('../src/index.js');

},{"../src/index.js":2}],2:[function(require,module,exports){
var toolbar = require('./rich-text-toolbar');

function CustomToolbar(firepad, callback) {
  this.element_ = this.makeElement_();

  this.on('undo', firepad.undo, firepad);
  this.on('redo', firepad.redo, firepad);
  this.on('bold', firepad.bold, firepad);
  this.on('italic', firepad.italic, firepad);
  this.on('underline', firepad.underline, firepad);
  this.on('strike', firepad.strike, firepad);
  this.on('font-size', firepad.fontSize, firepad);
  this.on('font', firepad.font, firepad);
  this.on('color', firepad.color, firepad);
  this.on('left', function() { firepad.align('left')}, firepad);
  this.on('center', function() { firepad.align('center')}, firepad);
  this.on('right', function() { firepad.align('right')}, firepad);
  this.on('ordered-list', firepad.orderedList, firepad);
  this.on('unordered-list', firepad.unorderedList, firepad);
  this.on('todo-list', firepad.todo, firepad);
  this.on('indent-increase', firepad.indent, firepad);
  this.on('indent-decrease', firepad.unindent, firepad);
  this.on('test', function() {
    return new Promise(function(resolve) {
      resolve(callback());
    }).then(function(url) {
      console.log(firepad.insertEntity('img', { src: url }));
    });
  });

  firepad.firepadWrapper_.insertBefore(this.element(), firepad.firepadWrapper_.firstChild);
  firepad.firepadWrapper_.className += ' firepad-richtext firepad-with-toolbar';
}

CustomToolbar.prototype = toolbar.prototype;

module.exports = CustomToolbar;

},{"./rich-text-toolbar":3}],3:[function(require,module,exports){
var utils = require('./utils');

var RichTextToolbar = function RichTextToolbar(imageInsertionUI) {
  this.imageInsertionUI = imageInsertionUI;
  this.element_ = this.makeElement_();
};

utils.makeEventEmitter(RichTextToolbar, ['bold', 'italic', 'underline', 'strike', 'font', 'font-size', 'color',
  'left', 'center', 'right', 'unordered-list', 'ordered-list', 'todo-list', 'indent-increase', 'indent-decrease',
  'undo', 'redo', 'test']);

RichTextToolbar.prototype.element = function() { return this.element_; };

RichTextToolbar.prototype.makeButton_ = function(eventName, iconName) {
  var self = this;
  iconName = iconName || eventName;
  var btn = utils.elt('a', [utils.elt('span', '', { 'class': 'firepad-tb-' + iconName } )], { 'class': 'firepad-btn' });
  utils.on(btn, 'click', utils.stopEventAnd(function() { self.trigger(eventName); }));
  return btn;
}

RichTextToolbar.prototype.makeElement_ = function() {
  var self = this;

  var font = this.makeFontDropdown_();
  var fontSize = this.makeFontSizeDropdown_();
  var color = this.makeColorDropdown_();

  var toolbarOptions = [
    utils.elt('div', [font], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [fontSize], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [color], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [self.makeButton_('bold'), self.makeButton_('italic'), self.makeButton_('underline'), self.makeButton_('strike', 'strikethrough')], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [self.makeButton_('unordered-list', 'list-2'), self.makeButton_('ordered-list', 'numbered-list'), self.makeButton_('todo-list', 'list')], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [self.makeButton_('indent-decrease'), self.makeButton_('indent-increase')], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [self.makeButton_('left', 'paragraph-left'), self.makeButton_('center', 'paragraph-center'), self.makeButton_('right', 'paragraph-right')], { 'class': 'firepad-btn-group'}),
    utils.elt('div', [self.makeButton_('undo'), self.makeButton_('redo')], { 'class': 'firepad-btn-group'})
  ];

  // CHANGE : custom event triggered on click
  toolbarOptions.push(utils.elt('div', [self.makeButton_('test', 'insert-image')], { 'class': 'firepad-btn-group' }));

  var toolbarWrapper = utils.elt('div', toolbarOptions, { 'class': 'firepad-toolbar-wrapper' });
  var toolbar = utils.elt('div', null, { 'class': 'firepad-toolbar' });
  toolbar.appendChild(toolbarWrapper)

  return toolbar;
};

RichTextToolbar.prototype.makeFontDropdown_ = function() {
  // NOTE: There must be matching .css styles in firepad.css.
  var fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Impact', 'Times New Roman', 'Verdana'];

  var items = [];
  for(var i = 0; i < fonts.length; i++) {
    var content = utils.elt('span', fonts[i]);
    content.setAttribute('style', 'font-family:' + fonts[i]);
    items.push({ content: content, value: fonts[i] });
  }
  return this.makeDropdown_('Font', 'font', items);
};

RichTextToolbar.prototype.makeFontSizeDropdown_ = function() {
  // NOTE: There must be matching .css styles in firepad.css.
  var sizes = [9, 10, 12, 14, 18, 24, 32, 42];

  var items = [];
  for(var i = 0; i < sizes.length; i++) {
    var content = utils.elt('span', sizes[i].toString());
    content.setAttribute('style', 'font-size:' + sizes[i] + 'px; line-height:' + (sizes[i]-6) + 'px;');
    items.push({ content: content, value: sizes[i] });
  }
  return this.makeDropdown_('Size', 'font-size', items, 'px');
};

RichTextToolbar.prototype.makeColorDropdown_ = function() {
  var colors = ['black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'grey'];

  var items = [];
  for(var i = 0; i < colors.length; i++) {
    var content = utils.elt('div');
    content.className = 'firepad-color-dropdown-item';
    content.setAttribute('style', 'background-color:' + colors[i]);
    items.push({ content: content, value: colors[i] });
  }
  return this.makeDropdown_('Color', 'color', items);
};

RichTextToolbar.prototype.makeDropdown_ = function(title, eventName, items, value_suffix) {
  value_suffix = value_suffix || "";
  var self = this;
  var button = utils.elt('a', title + ' \u25be', { 'class': 'firepad-btn firepad-dropdown' });
  var list = utils.elt('ul', [ ], { 'class': 'firepad-dropdown-menu' });
  button.appendChild(list);

  var isShown = false;
  function showDropdown() {
    if (!isShown) {
      list.style.display = 'block';
      utils.on(document, 'click', hideDropdown, /*capture=*/true);
      isShown = true;
    }
  }

  var justDismissed = false;
  function hideDropdown() {
    if (isShown) {
      list.style.display = '';
      utils.off(document, 'click', hideDropdown, /*capture=*/true);
      isShown = false;
    }
    // HACK so we can avoid re-showing the dropdown if you click on the dropdown header to dismiss it.
    justDismissed = true;
    setTimeout(function() { justDismissed = false; }, 0);
  }

  function addItem(content, value) {
    if (typeof content !== 'object') {
      content = document.createTextNode(String(content));
    }
    var element = utils.elt('a', [content]);

    utils.on(element, 'click', utils.stopEventAnd(function() {
      hideDropdown();
      self.trigger(eventName, value + value_suffix);
    }));

    list.appendChild(element);
  }

  for(var i = 0; i < items.length; i++) {
    var content = items[i].content, value = items[i].value;
    addItem(content, value);
  }

  utils.on(button, 'click', utils.stopEventAnd(function() {
    if (!justDismissed) {
      showDropdown();
    }
  }));

  return button;
};

module.exports = RichTextToolbar;

},{"./utils":4}],4:[function(require,module,exports){
var utils = { };

utils.makeEventEmitter = function(clazz, opt_allowedEVents) {
  clazz.prototype.allowedEvents_ = opt_allowedEVents;

  clazz.prototype.on = function(eventType, callback, context) {
    this.validateEventType_(eventType);
    this.eventListeners_ = this.eventListeners_ || { };
    this.eventListeners_[eventType] = this.eventListeners_[eventType] || [];
    this.eventListeners_[eventType].push({ callback: callback, context: context });
  };

  clazz.prototype.off = function(eventType, callback) {
    this.validateEventType_(eventType);
    this.eventListeners_ = this.eventListeners_ || { };
    var listeners = this.eventListeners_[eventType] || [];
    for(var i = 0; i < listeners.length; i++) {
      if (listeners[i].callback === callback) {
        listeners.splice(i, 1);
        return;
      }
    }
  };

  clazz.prototype.trigger =  function(eventType /*, args ... */) {
    this.eventListeners_ = this.eventListeners_ || { };
    var listeners = this.eventListeners_[eventType] || [];
    for(var i = 0; i < listeners.length; i++) {
      listeners[i].callback.apply(listeners[i].context, Array.prototype.slice.call(arguments, 1));
    }
  };

  clazz.prototype.validateEventType_ = function(eventType) {
    if (this.allowedEvents_) {
      var allowed = false;
      for(var i = 0; i < this.allowedEvents_.length; i++) {
        if (this.allowedEvents_[i] === eventType) {
          allowed = true;
          break;
        }
      }
      if (!allowed) {
        throw new Error('Unknown event "' + eventType + '"');
      }
    }
  };
};

utils.elt = function(tag, content, attrs) {
  var e = document.createElement(tag);
  if (typeof content === "string") {
    utils.setTextContent(e, content);
  } else if (content) {
    for (var i = 0; i < content.length; ++i) { e.appendChild(content[i]); }
  }
  for(var attr in (attrs || { })) {
    e.setAttribute(attr, attrs[attr]);
  }
  return e;
};

utils.setTextContent = function(e, str) {
  e.innerHTML = "";
  e.appendChild(document.createTextNode(str));
};


utils.on = function(emitter, type, f, capture) {
  if (emitter.addEventListener) {
    emitter.addEventListener(type, f, capture || false);
  } else if (emitter.attachEvent) {
    emitter.attachEvent("on" + type, f);
  }
};

utils.off = function(emitter, type, f, capture) {
  if (emitter.removeEventListener) {
    emitter.removeEventListener(type, f, capture || false);
  } else if (emitter.detachEvent) {
    emitter.detachEvent("on" + type, f);
  }
};

utils.preventDefault = function(e) {
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
};

utils.stopPropagation = function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
};

utils.stopEvent = function(e) {
  utils.preventDefault(e);
  utils.stopPropagation(e);
};

utils.stopEventAnd = function(fn) {
  return function(e) {
    fn(e);
    utils.stopEvent(e);
    return false;
  };
};

utils.trim = function(str) {
  return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
};

utils.stringEndsWith = function(str, suffix) {
  var list = (typeof suffix == 'string') ? [suffix] : suffix;
  for (var i = 0; i < list.length; i++) {
    var suffix = list[i];
    if (str.indexOf(suffix, str.length - suffix.length) !== -1)
      return true;
  }
  return false;
};

utils.assert = function assert (b, msg) {
  if (!b) {
    throw new Error(msg || "assertion error");
  }
};

utils.log = function() {
  if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
    var args = ['Firepad:'];
    for(var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console.log.apply(console, args);
  }
};

module.exports = utils;

},{}]},{},[1]);
