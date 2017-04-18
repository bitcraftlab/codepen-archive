
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     fractal drawing                                                        //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// meandering through space 2016

// @bitcraftlab 2016

// HOMEWORK:

// 1. create your own fractal drawing function 
//    that creates a continuous (!) fractal curve.
// 2. Add this fuction to the GUI!

// Hint: Sketch the basic curve and its line segments on paper first

////////////////////////////////////////////////////////////////////////////////
// parameters                                                                 //
////////////////////////////////////////////////////////////////////////////////

var angle = 60;
var iteration = 3;

// add your function to the list
var functions = ['drawKochCurve', 'drawCircularInfinity'];

var gui;

////////////////////////////////////////////////////////////////////////////////
// main                                                                       //
////////////////////////////////////////////////////////////////////////////////

function setup() {
  
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  
  // create the interface
  sliderRange(0, 180, 1);
  gui = createGui('recursive drawing', width - 220, 20);
  gui.addGlobals('functions', 'angle');
  sliderRange(1, 6, 1);
  gui.addGlobals('iteration');
  
}

function draw() {
  
  // white background
  background(255);
  
  // rescale canvas so we can draw inside the unit square
  var s = min(width, height);
  scale(s, s);
  
  // adjust stroke weight, so the absolute stroke weight is 1
  strokeWeight(1/s);
  
  // pick a function
  var fn = window[functions];
  fn(1, iteration);
  
}

// ajust canvas to the window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


////////////////////////////////////////////////////////////////////////////////
// circular infinity                                                          //
////////////////////////////////////////////////////////////////////////////////

// Drawing a fractal made of nested circles
// Each circle contains two circles that are half the size
// See also: http://www.tnlc.com/eep/circles/

// draw circle fractal on screen
function drawCircularInfinity(d, iter) {
  // draw the fractal at position (0.5, 0.5)
  circularInfinity(0.5, 0.5, d * 0.4, iter);
}

// recursive function
function circularInfinity(x, y, r, iter) {
  if(iter > 0) {
    push();
    translate(x, y);
    rotate(angle);
    ellipse(0, 0, r * 2);
    circularInfinity(-r/2, 0, r/2, iter - 1);
    circularInfinity(+r/2, 0, r/2, iter - 1);
    pop();
  } else {
    ellipse(x, y, r * 2);
  }
}


////////////////////////////////////////////////////////////////////////////////
// koch curve                                                                 //
////////////////////////////////////////////////////////////////////////////////


// draw a koch curve on screen
function drawKochCurve(d, iter) {
  // go to the bottom left corner
  translate(0.1, 0.9);
  // draw the fractal
  kochCurve(d, iter);
}

// recursive function
function kochCurve(d, iter) {
  
  // decrease the size of the subsections
  var d2 = d / 3;
  
  if(iter > 0) {
    // section 1
    kochCurve(d2, iter - 1);
    // rotate left
    rotate(-angle);
    // section 2
    kochCurve(d2, iter - 1);
    // rotate twice to the right
    rotate(2 * angle);
    // section 3
    kochCurve(d2, iter - 1);
    // rotate to the left
    rotate(-angle);
    // section 4
    kochCurve(d2, iter - 1);
  } else {
    // draw a line of length d
    line(0, 0, d, 0);
    // move the same length to the right
    translate(d, 0);
  }
}