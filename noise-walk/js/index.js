// Meandering Through Space 2016 

// lecture 3 - noise walk

// things to try:
// * change the relative direction based on the noise 
// * create your own 'noise' function

var gui;

// random seed
var seed = 0;

// pick a step size
var stepsize = 5;
var steps = 400;

var noisezoom = 0.02;
var noiseshift = 0;

// drawing style
var strokeColor = '#5cfb66';
var opacity = 140;


function setup() {
  
  // create window filling canvas
  createCanvas(windowWidth, windowHeight);
  
  // create a GUI
  gui = createGui('random walk');
  gui.addGlobals('seed');
  sliderRange(0, 0.1, 0.001);
  gui.addGlobals('noisezoom');
  sliderRange(1, 1000, 1);
  gui.addGlobals('noiseshift');
  gui.addGlobals('steps');
  sliderRange(1, 20, 1);
  gui.addGlobals('stepsize');
  sliderRange(0, 255, 1);
  gui.addGlobals('strokeColor', 'opacity');
  
  // only redraw when we change the GUI
  noLoop();
}


function draw() {
  
  background(0);
  
  // adjust stroke weight to the step size
  strokeWeight(stepsize/2);
  
  // color object from html code
  var c = color(strokeColor);
  
  // set stroke using color components and opacity
  stroke(red(c), green(c), blue(c), opacity);
  
  // draw the curve
  myCurve(steps);
  
}


function myCurve(steps) {

  // start with the same random seed every single time
  noiseSeed(seed);
  
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
    
    // noise is directly translated to direction of the curve
    var ang = 4 * TWO_PI * noise((i + noiseshift) * noisezoom);
    var dx = cos(ang) * stepsize;
    var dy = sin(ang) * stepsize;
    x = px + dx;
    y = py + dy;
    
    // reset to previous position if we are outside the canvas
    if(x < 0 || x >= width || y < 0 || y >= height) {
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