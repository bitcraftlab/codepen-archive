// @bitcraftlab 2016

var canvas;
var div;
var gui;

var percent = 100;
var iteration = 5;

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
  gui = createGui('thue morse folding');
  gui.addGlobals('percent');
  sliderRange(1, 6, 1);
  gui.addGlobals('iteration');

  // set rotation angle
  angleMode(DEGREES);
  noLoop();
  
};

function draw() {

  push();

  var steps = 1 << (2 * iteration);
  var d = 2048.0 / pow(3, iteration);
  var n = percent / 100 * steps;

  background(255);
  stroke(0, 80);
  strokeWeight(d / 4);
  translate(150 + d / 4, 300 - d);
  rotate(-60);

  for (var i = 0; i < n; i++) {

    // calculate thue morse digit
    var b = i;
    var r = 0;
    while (b > 0) {
      r = (r + b) % 2;
      b = floor(b / 2);
    }

    // interpret the digit as turtle code
    if (r == 0) {
      rotate(-180);
    } else {
      rotate(-120);
    }
    line(0, 0, d, 0);
    translate(d, 0);
  }

  pop();

}

// recenter canvas when the window is resized
function windowResized() {
  div.size(windowWidth, windowHeight);
  canvas.center();
}