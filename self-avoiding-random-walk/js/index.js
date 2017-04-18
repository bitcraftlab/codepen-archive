// Meandering Through Space 2016 

// lecture 3 - self avoiding random walk

// things to try:
// * change the probabilities of walking in certain directions
// * create your own random function

var gui;
var counter;

// random seed
var seed = 0;

// pick a step size
var stepsize = 10;
var steps = 50;
var maxsteps = 100;

// drawing style
var strokeColor = '#cc0000';
var showStops = true;

function setup() {

  // create window filling canvas
  createCanvas(windowWidth, windowHeight);

  // create a GUI
  gui = createGui('random walk');
  gui.addGlobals('seed');
  sliderRange(1, 1000, 1);
  gui.addGlobals('steps');
  sliderRange(1, 20, 1);
  gui.addGlobals('stepsize');
  sliderRange(0, 255, 1);
  gui.addGlobals('strokeColor', 'showStops');

  // only redraw when we change the GUI
  noLoop();
}

function draw() {

  clear();

  // adjust stroke weight to the step size
  strokeWeight(stepsize / 2);
  stroke(strokeColor);

  // draw the curve
  myCurve(steps);

}

function myCurve(steps) {

  // start with the same random seed every single time
  randomSeed(seed);

  // start out in the center of the screen
  var x = width / 2;
  var y = height / 2;

  // previous values for x and y
  var px = x;
  var py = y;

  for (var i = 0; i < steps; i++) {

    // assign previous position
    px = x;
    py = y;

    // randomly pick a direction
    var r = random();

    // update position
    if (r < 0.25) {
      x = x + stepsize;
    } else if (r < 0.5) {
      x = x - stepsize;
    } else if (r < 0.75) {
      y = y + stepsize;
    } else {
      y = y - stepsize;
    }

    //updatePixels();
    var c = get(x, y);
    
    if (c[0] !== 0) {
      if (showStops) {
        push();
        strokeWeight(1);
        ellipse(x, y, stepsize * 0.6, stepsize * 0.6);
        pop();
      }
      x = px;
      y = py;
    }

    // reset to previous position if we are outside the canvas
    if (x < 0 || x >= width || y < 0 || y >= height) {
      x = px;
      y = py;
    }

    // connect previous and current position
    line(px, py, x, y);

  }

}

// dynamically adjust window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}