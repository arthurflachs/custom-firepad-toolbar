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
      firepad.insertEntity('img', { src: url });
    });
  });

  firepad.firepadWrapper_.insertBefore(this.element(), firepad.firepadWrapper_.firstChild);
  firepad.firepadWrapper_.className += ' firepad-richtext firepad-with-toolbar';
}

CustomToolbar.prototype = toolbar.prototype;

module.exports = CustomToolbar;
