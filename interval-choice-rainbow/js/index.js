// Meandering through Space 2016

// Interval Choice Demo

// @bitcraftlab 2016

// Interval choices are similar to SWITCH CASE control flow
// Except we are checking if a variable is inside some range
// This is useful for roulette wheel selection,
// or for implementing piecewise functions

var canvas;
var div;
var colorgui;
var rangegui;

var x0 = 0;
var x1 = 100;
var x2 = 200;
var x3 = 300;
var x4 = 400;

var c0 = '#ffff33';
var c1 = '#ff3333';
var c2 = '#ff33ff';
var c3 = '#3333ff';
var c4 = '#33ffff';

function setup() {

  // black background div
  div = createDiv();
  div.style('background', '#000');
  div.size(windowWidth, windowHeight);

  // canvas inside the div
  canvas = createCanvas(400, 280);
  canvas.parent(div);

  // position the canvas
  // canvas.center();
  canvas.position(460, 20);

  // add gui for color picking
  colorgui = createGui('colors');
  colorgui.addGlobals('c0', 'c1', 'c2', 'c3', 'c4');

  // add gui for color ranges
  sliderRange(0, 400, 1);
  rangegui = createGui('range', 240, 20);
  rangegui.addGlobals('x0', 'x1', 'x2', 'x3', 'x4');

  noLoop();
  
}

// redraw everything
function draw() {
  for(var x = 0; x < width; x++) {
    stroke(colorfn(x));
    line(x, 0, x, height);
  }
}

// adjust div size
function windowResized() {
  div.size(windowWidth, windowHeight);
  //canvas.center();
}

// example for a piecewise function using interval choice
function colorfn(a) {
  return intervalChoice(a, [
    function() { return c0; },
    x0,
    lerpColorFactory(c0, c1),
    x1,
    lerpColorFactory(c1, c2),
    x2,
    lerpColorFactory(c2, c3),
    x3,
    lerpColorFactory(c3, c4),
    x4,
    function() { return c4; }
  ]);
}

// factory function to create a function that interpolates between two colors
function lerpColorFactory(cmin, cmax) {
  return function(a, amin, amax) {
    return lerpColor(color(cmin), color(cmax), norm(a, amin, amax));
  };
}

// intervalChoice takes an interval list such as [a1, fun1, a2, fun2, a3, ...]
// and executes the function that corresponds to the respective interval
// fun1(a, a1, a2) if a1 < a <= a2
// fun2(a, a2, a3) if a2 < a <= a3
// etc ...
function intervalChoice(a, interval) {

  // filter numbers
  var numbers = interval.filter(function(a) { return typeof a === 'number'; });

  // get interval limits
  var amin = numbers[0];
  var amax = numbers[numbers.length - 1];

  // capture numbers beyond interval limits
  interval.unshift(-Infinity);
  interval.push(Infinity);

  // iterate over the interval, to find the function
  // that corresponds to our value 'a'
  var n = interval.length - 1;
  for(var i = 1; i < n; i++) {
    if(typeof interval[i] === 'function') {
      var abot = interval[i - 1];
      var afun = interval[i];
      var atop = interval[i + 1];
      if(abot <= a && a < atop) {
        return afun(a, abot, atop);
      }
    }
  }
}