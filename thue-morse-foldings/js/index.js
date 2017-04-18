// Meandering Through Space 2016

// Thue-Morse Foldings

// @bitcraftlab 2016

var percent = 100;
var iteration = 5;

var canvas;
var div;
var gui;

var steps;
var d;

function forward() {
  line(0, 0, d, 0);
  translate(d, 0);
}

var truss = {
  init: function() {
    steps = 1 << (2 * iteration);
    d = 2048 / pow(3, iteration);
    translate(150 + d / 4, 300 - d);
    rotate(-60);
  },
  0: function() {
    rotate(-180);
    forward();
  },
  1: function() {
    rotate(-120);
    forward();
  }
};

var zigzag = {
  init: function() {
    steps = pow(4, iteration - 1);
    d = 2048 / pow(3, iteration);
    translate(150 - d / 4, 300);
    rotate(120);
  },
  0: function() {
    rotate(-120);
  },
  1: function() {
    forward();
  }
};

var snowflake = {
  init: function() {
    steps = 2 << 2 * (iteration - 1);
    d = 1024 / pow(3, iteration);
    translate(150, 300);
    rotate(-120);
  },
  0: function() {
    rotate(180);
  },
  1: function() {
    rotate(-60);
    forward();
  }
};

// turtle object selection
var turtles = {
  'Zig Zag': zigzag,
  'Snow Flake': snowflake,
  'Truss Structure': truss,
};

// array of turtle keys / labels
turtle = Object.keys(turtles);

function setup() {

  // container div
  div = createDiv('');
  div.size(windowWidth, windowHeight);
  div.style('background', '#000');

  // fixed size canvas
  canvas = createCanvas(640, 400);
  canvas.parent(div);
  canvas.center();

  // add some gui
  gui = createGui('thue morse foldings');
  gui.addGlobals('turtle', 'percent');
  sliderRange(1, 6, 1);
  gui.addGlobals('iteration');

  angleMode(DEGREES);
  noLoop();

}

function draw() {

  push();

  var theTurtle = turtles[turtle];
  theTurtle.init();

  background(255);
  strokeWeight(d / 4);
  var n = percent / 100 * steps;

  for (var i = 0; i < n; i++) {

    // calculate thue-morse digit
    var b = i;
    var r = 0;
    while (b > 0) {
      r = (r + b) % 2;
      b = floor(b / 2);
    }

    // interpret digit as turtle code    
    theTurtle[r]();

  }

  pop();

}

// recenter canvas when the window is resized
function windowResized() {
  div.size(windowWidth, windowHeight);
  canvas.center();
}